import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import {
  DODO_PRODUCT_ID,
  getSiteHost,
  metadataString,
  verifyDodoWebhookSignature,
} from "@/lib/dodo";
import { ensurePaymentTables, getPool } from "@/lib/db";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_KEY;

type DodoWebhookEvent = {
  type?: string;
  data?: DodoPaymentPayload;
};

type DodoPaymentPayload = {
  payment_id?: string;
  id?: string;
  checkout_session_id?: string | null;
  customer?: {
    email?: string | null;
  } | null;
  metadata?: Record<string, unknown> | null;
  total_amount?: number | null;
  amount?: number | null;
  currency?: string | null;
  settlement_currency?: string | null;
};

function readAmountCents(data: DodoPaymentPayload) {
  if (typeof data.total_amount === "number") return data.total_amount;
  if (typeof data.amount === "number") return data.amount;
  return null;
}

function readCurrency(data: DodoPaymentPayload) {
  return (data.currency || data.settlement_currency || "GBP").toUpperCase();
}

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("DODO_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureValid = verifyDodoWebhookSignature({
    rawBody,
    webhookId: request.headers.get("webhook-id"),
    webhookTimestamp: request.headers.get("webhook-timestamp"),
    webhookSignature: request.headers.get("webhook-signature"),
    secret: WEBHOOK_SECRET,
  });

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(rawBody) as DodoWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ status: "ignored" });
  }

  const data = event.data;
  if (!data) {
    return NextResponse.json({ error: "Missing payment payload" }, { status: 400 });
  }

  const metadata = data.metadata || {};
  const draftId = metadataString(metadata, "draft_id") || metadataString(metadata, "draftId");
  const productId = metadataString(metadata, "product_id") || DODO_PRODUCT_ID;
  const eventSiteHost = metadataString(metadata, "site_host")?.toLowerCase() || null;
  const expectedSiteHost = getSiteHost();

  if (productId !== DODO_PRODUCT_ID) {
    return NextResponse.json({ status: "ignored", reason: "product_mismatch" });
  }

  if (expectedSiteHost && eventSiteHost && eventSiteHost !== expectedSiteHost) {
    return NextResponse.json({ status: "ignored", reason: "site_host_mismatch" });
  }

  if (!draftId || !/^[a-zA-Z0-9_-]{12,80}$/.test(draftId)) {
    return NextResponse.json({ error: "Missing draft_id metadata" }, { status: 400 });
  }

  const paymentId = data.payment_id || data.id || data.checkout_session_id || randomUUID();
  const checkoutId = data.checkout_session_id || null;
  const email = data.customer?.email || metadataString(metadata, "email") || null;

  try {
    await ensurePaymentTables();

    if (checkoutId) {
      await getPool().query(
        `
          UPDATE workcv_payment_checkouts
          SET completed_at = NOW(), updated_at = NOW()
          WHERE id = $1
        `,
        [checkoutId]
      );
    }

    await getPool().query(
      `
        INSERT INTO workcv_orders
          (id, draft_id, email, product_id, amount_cents, currency, checkout_id, raw_event_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        paymentId,
        draftId,
        email,
        productId,
        readAmountCents(data),
        readCurrency(data),
        checkoutId,
        event.type,
      ]
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("dodo_webhook_persist_failed", error);
    return NextResponse.json({ error: "Webhook persistence failed" }, { status: 500 });
  }
}
