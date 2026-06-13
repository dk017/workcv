import crypto from "crypto";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ensureAuthTables, getPool } from "@/lib/db";

const sessionCookieName = "workcv_session";
const loginCodeTtlMinutes = 15;
const sessionTtlDays = 30;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type User = {
  id: string;
  email: string;
};

function getAuthSecret() {
  return process.env.AUTH_SESSION_SECRET || "dev-workcv-auth-secret-change-me";
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(`${getAuthSecret()}:${value}`).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function isValidEmail(email: string) {
  return emailRegex.test(email);
}

export async function requestEmailLoginCode(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!isValidEmail(email)) {
    throw new Error("INVALID_EMAIL");
  }

  await ensureAuthTables();

  const code = generateCode();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + loginCodeTtlMinutes * 60 * 1000);

  await getPool().query(
    `
      INSERT INTO workcv_login_codes (id, email, code_hash, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
    [id, email, hashValue(code), expiresAt]
  );

  const transporter = getEmailTransporter();
  const fromEmail = process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || "contact@werkcv.nl";
  const fromName = process.env.AUTH_FROM_NAME || "WorkCV";
  const from = `${fromName} <${fromEmail}>`;
  const replyTo = process.env.AUTH_REPLY_TO_EMAIL || "contact@workcv.co.uk";

  if (transporter) {
    await transporter.sendMail({
      from,
      replyTo,
      to: email,
      subject: "Your WorkCV login code",
      text: `Your WorkCV login code is ${code}. This code expires in ${loginCodeTtlMinutes} minutes.`,
      html: `<p>Your WorkCV login code is <strong>${code}</strong>.</p><p>This code expires in ${loginCodeTtlMinutes} minutes.</p>`,
    });
    return {};
  }

  console.log(`workcv_auth_dev_code ${email} ${code}`);
  if (process.env.NODE_ENV !== "production") {
    return { devCode: code };
  }
  return {};
}

export async function verifyEmailLoginCode(emailInput: string, codeInput: string) {
  const email = normalizeEmail(emailInput);
  const code = codeInput.trim();
  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return null;

  await ensureAuthTables();

  const codeResult = await getPool().query<{
    id: string;
    code_hash: string;
  }>(
    `
      SELECT id, code_hash
      FROM workcv_login_codes
      WHERE email = $1 AND used_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [email]
  );

  const record = codeResult.rows[0];
  if (!record || record.code_hash !== hashValue(code)) return null;

  let user = (
    await getPool().query<User>("SELECT id, email FROM workcv_users WHERE email = $1", [email])
  ).rows[0];
  const isNewUser = !user;

  if (!user) {
    const userId = crypto.randomUUID();
    user = (
      await getPool().query<User>(
        `
          INSERT INTO workcv_users (id, email)
          VALUES ($1, $2)
          RETURNING id, email
        `,
        [userId, email]
      )
    ).rows[0];
  }

  await getPool().query("UPDATE workcv_login_codes SET used_at = NOW() WHERE id = $1", [
    record.id,
  ]);

  const token = crypto.randomBytes(32).toString("hex");
  await getPool().query(
    `
      INSERT INTO workcv_sessions (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
    [
      hashValue(token),
      user.id,
      new Date(Date.now() + sessionTtlDays * 24 * 60 * 60 * 1000),
    ]
  );

  return { token, userId: user.id, isNewUser };
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: sessionCookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionTtlDays * 24 * 60 * 60,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: sessionCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function findUserByToken(token: string) {
  await ensureAuthTables();
  const result = await getPool().query<User>(
    `
      SELECT u.id, u.email
      FROM workcv_sessions s
      JOIN workcv_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > NOW()
      LIMIT 1
    `,
    [hashValue(token)]
  );

  return result.rows[0] || null;
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;
  return findUserByToken(token);
}

export async function getCurrentUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!token) return null;
  return findUserByToken(token);
}

export async function deleteCurrentSession(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!token) return;
  await ensureAuthTables();
  await getPool().query("DELETE FROM workcv_sessions WHERE token_hash = $1", [
    hashValue(token),
  ]);
}
