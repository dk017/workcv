import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ensureAuthTables, getPool } from "@/lib/db";
import { getEmailTransporter, getTransactionalEmailIdentity } from "@/lib/email";
import { AUTH_LIMITS, exceedsAuthLimit } from "@/lib/auth-policy";

const sessionCookieName = "workcv_session";
const loginCodeTtlMinutes = 15;
const sessionTtlDays = 30;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type User = {
  id: string;
  email: string;
};

function getAuthSecret() {
  const configured = process.env.AUTH_SESSION_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET is required in production");
  }
  return "dev-workcv-auth-secret-change-me";
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(`${getAuthSecret()}:${value}`).digest("hex");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateCode() {
  return String(crypto.randomInt(100000, 1_000_000));
}

export class AuthRateLimitError extends Error {
  constructor() {
    super("Too many attempts. Please wait before trying again.");
    this.name = "AuthRateLimitError";
  }
}

function normaliseIp(ip: string) {
  return ip.trim().slice(0, 64) || "unknown";
}

async function assertWithinRateLimit(
  kind: "request" | "verify",
  email: string,
  ip: string,
) {
  const interval = kind === "request" ? "1 hour" : "15 minutes";
  const result = await getPool().query<{ email_count: string; ip_count: string }>(
    `
      SELECT
        COUNT(*) FILTER (WHERE email = $2) AS email_count,
        COUNT(*) FILTER (WHERE ip = $3) AS ip_count
      FROM workcv_auth_rate_events
      WHERE kind = $1
        AND succeeded = FALSE
        AND created_at > NOW() - $4::interval
    `,
    [kind, email, ip, interval],
  );
  if (
    exceedsAuthLimit(
      kind,
      Number(result.rows[0]?.email_count || 0),
      Number(result.rows[0]?.ip_count || 0),
    )
  ) {
    throw new AuthRateLimitError();
  }
}

async function recordAuthEvent(
  kind: "request" | "verify",
  email: string,
  ip: string,
  succeeded: boolean,
) {
  await getPool().query(
    `
      INSERT INTO workcv_auth_rate_events (kind, email, ip, succeeded)
      VALUES ($1, $2, $3, $4)
    `,
    [kind, email, ip, succeeded],
  );
}

export function isValidEmail(email: string) {
  return emailRegex.test(email);
}

export async function requestEmailLoginCode(emailInput: string, ipInput = "unknown") {
  const email = normalizeEmail(emailInput);
  const ip = normaliseIp(ipInput);
  if (!isValidEmail(email)) {
    throw new Error("INVALID_EMAIL");
  }

  await ensureAuthTables();
  await assertWithinRateLimit("request", email, ip);

  const code = generateCode();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + loginCodeTtlMinutes * 60 * 1000);

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `
        UPDATE workcv_login_codes
        SET used_at = NOW()
        WHERE email = $1 AND used_at IS NULL
      `,
      [email],
    );
    await client.query(
      `
        INSERT INTO workcv_login_codes
          (id, email, code_hash, expires_at, request_ip)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [id, email, hashValue(code), expiresAt, ip],
    );
    await client.query(
      `
        INSERT INTO workcv_auth_rate_events (kind, email, ip, succeeded)
        VALUES ('request', $1, $2, FALSE)
      `,
      [email, ip],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const transporter = getEmailTransporter();
  const { from, replyTo } = getTransactionalEmailIdentity();

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

  if (process.env.NODE_ENV !== "production") {
    console.log(`workcv_auth_dev_code ${email} ${code}`);
    return { devCode: code };
  }
  throw new Error("SMTP is required for email login in production");
}

export async function verifyEmailLoginCode(
  emailInput: string,
  codeInput: string,
  ipInput = "unknown",
) {
  const email = normalizeEmail(emailInput);
  const code = codeInput.trim();
  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return null;
  const ip = normaliseIp(ipInput);

  await ensureAuthTables();
  await assertWithinRateLimit("verify", email, ip);

  const codeResult = await getPool().query<{
    id: string;
    code_hash: string;
    attempt_count: number;
    locked_until: Date | null;
  }>(
    `
      SELECT id, code_hash, attempt_count, locked_until
      FROM workcv_login_codes
      WHERE email = $1
        AND used_at IS NULL
        AND expires_at > NOW()
        AND (locked_until IS NULL OR locked_until <= NOW())
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [email]
  );

  const record = codeResult.rows[0];
  const suppliedHash = hashValue(code);
  const validHash =
    record &&
    record.code_hash.length === suppliedHash.length &&
    crypto.timingSafeEqual(Buffer.from(record.code_hash), Buffer.from(suppliedHash));
  if (!record || !validHash) {
    await recordAuthEvent("verify", email, ip, false);
    if (record) {
      await getPool().query(
        `
          UPDATE workcv_login_codes
          SET attempt_count = attempt_count + 1,
              locked_until = CASE
                WHEN attempt_count + 1 >= $2
                  THEN NOW() + ($3::text || ' minutes')::interval
                ELSE locked_until
              END
          WHERE id = $1
        `,
        [record.id, AUTH_LIMITS.attemptsPerCode, AUTH_LIMITS.lockoutMinutes],
      );
    }
    return null;
  }

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

  await getPool().query(
    "UPDATE workcv_login_codes SET used_at = NOW() WHERE email = $1 AND used_at IS NULL",
    [email],
  );
  await recordAuthEvent("verify", email, ip, true);

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
