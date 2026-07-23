import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import {
  DODO_PRODUCT_ID,
  getAppUrl,
  getSiteHost,
  metadataString,
  verifyDodoWebhookSignature,
} from "@/lib/dodo";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { ensurePaymentTables, getPool } from "@/lib/db";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

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
    await reportConversionFailure({
      category: "payment_webhook_configuration_failure",
      title: "Dodo payment webhook is not configured",
      error: "DODO_WEBHOOK_SECRET is not configured",
      context: { route: "/api/webhooks/dodo" },
    });
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

  const supportedEventTypes = new Set([
    "payment.succeeded",
    "payment.failed",
    "payment.cancelled",
  ]);
  if (!event.type || !supportedEventTypes.has(event.type)) {
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
    if (event.type === "payment.succeeded") {
      await reportConversionFailure({
        category: "payment_webhook_metadata_failure",
        title: "Successful payment is missing its CV identifier",
        error: "A payment.succeeded webhook had no valid draft_id metadata.",
        context: {
          route: "/api/webhooks/dodo",
          has_checkout_id: Boolean(data.checkout_session_id),
        },
      });
    }
    return NextResponse.json({ error: "Missing draft_id metadata" }, { status: 400 });
  }

  const paymentId = data.payment_id || data.id || data.checkout_session_id || randomUUID();
  const checkoutId = data.checkout_session_id || null;
  let email = data.customer?.email || metadataString(metadata, "email") || null;
  const amountCents = readAmountCents(data);
  const currency = readCurrency(data);

  try {
    await ensurePaymentTables();

    if (event.type !== "payment.succeeded") {
      if (checkoutId) {
        await getPool().query(
          `
            UPDATE workcv_payment_checkouts
            SET status = $2, updated_at = NOW()
            WHERE id = $1
          `,
          [checkoutId, event.type === "payment.failed" ? "failed" : "cancelled"],
        );
      }
      return NextResponse.json({ status: "ok" });
    }

    let checkoutUserId: string | null = null;
    let consentAt: Date | null = null;
    let consentVersion: string | null = null;
    if (checkoutId) {
      const checkout = await getPool().query<{
        email: string | null;
        user_id: string | null;
        consent_at: Date | null;
        consent_version: string | null;
      }>(
        `
          UPDATE workcv_payment_checkouts
          SET completed_at = NOW(), status = 'paid', updated_at = NOW()
          WHERE id = $1
          RETURNING email, user_id, consent_at, consent_version
        `,
        [checkoutId]
      );
      email ||= checkout.rows[0]?.email || null;
      checkoutUserId = checkout.rows[0]?.user_id || null;
      consentAt = checkout.rows[0]?.consent_at || null;
      consentVersion = checkout.rows[0]?.consent_version || null;
    }

    await getPool().query(
      `
        INSERT INTO workcv_orders
          (id, draft_id, email, product_id, amount_cents, currency, checkout_id,
           raw_event_type, user_id, consent_at, consent_version)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        paymentId,
        draftId,
        email,
        productId,
        amountCents,
        currency,
        checkoutId,
        event.type,
        checkoutUserId,
        consentAt,
        consentVersion,
      ]
    );

    if (email) {
      const claimed = await getPool().query<{ id: string }>(
        `
          UPDATE workcv_orders
          SET confirmation_email_attempted_at = NOW()
          WHERE id = $1
            AND confirmation_email_sent_at IS NULL
            AND (
              confirmation_email_attempted_at IS NULL
              OR confirmation_email_attempted_at < NOW() - INTERVAL '10 minutes'
            )
          RETURNING id
        `,
        [paymentId]
      );

      if (claimed.rows.length > 0) {
        try {
          await sendPurchaseConfirmationEmail({
            to: email,
            orderId: paymentId,
            amountCents,
            currency,
            editorUrl: `${getAppUrl()}/editor?draftId=${encodeURIComponent(draftId)}`,
          });
          await getPool().query(
            `
              UPDATE workcv_orders
              SET confirmation_email_sent_at = NOW()
              WHERE id = $1
            `,
            [paymentId]
          );
        } catch (error) {
          await getPool().query(
            `
              UPDATE workcv_orders
              SET confirmation_email_attempted_at = NULL
              WHERE id = $1 AND confirmation_email_sent_at IS NULL
            `,
            [paymentId]
          );
          throw error;
        }
      }
    } else {
      console.error("dodo_purchase_confirmation_missing_email", { paymentId, checkoutId });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("dodo_webhook_processing_failed", error);
    await reportConversionFailure({
      category: "payment_webhook_processing_failure",
      title: "Successful payment could not unlock its CV",
      documentId: draftId,
      error,
      context: {
        route: "/api/webhooks/dodo",
        event_type: event.type,
        has_checkout_id: Boolean(checkoutId),
      },
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
