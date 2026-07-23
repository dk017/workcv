import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { userOwnsCvDocument } from "@/lib/cv-documents";
import { createDodoCheckout, DODO_PRODUCT_ID } from "@/lib/dodo";
import { ensurePaymentTables, getPool } from "@/lib/db";
import { DIGITAL_CONTENT_CONSENT_VERSION } from "@/lib/commerce";

export const runtime = "nodejs";

function isValidDraftId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{12,80}$/.test(value);
}

function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Log in before checkout." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const draftId = payload.draftId;
  const email = payload.email;
  const consentAccepted = payload.consentAccepted === true;
  const forceNew = payload.forceNew === true;

  if (!isValidDraftId(draftId)) {
    return NextResponse.json({ error: "Invalid draftId" }, { status: 400 });
  }

  if (email !== null && email !== undefined && email !== "" && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!consentAccepted) {
    return NextResponse.json(
      { error: "Confirm immediate digital access before checkout." },
      { status: 400 },
    );
  }

  try {
    const ownsDocument = await userOwnsCvDocument(user.id, draftId);
    if (!ownsDocument) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    await ensurePaymentTables();
    if (forceNew) {
      await getPool().query(
        `
          UPDATE workcv_payment_checkouts
          SET status = 'cancelled', updated_at = NOW()
          WHERE draft_id = $1 AND user_id = $2 AND status = 'pending'
        `,
        [draftId, user.id],
      );
    }
    const existing = await getPool().query<{ checkout_url: string | null }>(
      `
        SELECT checkout_url
        FROM workcv_payment_checkouts
        WHERE draft_id = $1
          AND user_id = $2
          AND status = 'pending'
          AND created_at > NOW() - INTERVAL '15 minutes'
          AND checkout_url IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [draftId, user.id],
    );
    if (!forceNew && existing.rows[0]?.checkout_url) {
      return NextResponse.json({ checkoutUrl: existing.rows[0].checkout_url });
    }

    const checkout = await createDodoCheckout({
      draftId,
      email: isValidEmail(email) ? email : undefined,
    });

    await getPool().query(
      `
        INSERT INTO workcv_payment_checkouts
          (id, draft_id, email, product_id, checkout_url, site_host, user_id,
           consent_at, consent_version, status, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, 'pending', NOW())
        ON CONFLICT (id) DO UPDATE SET
          draft_id = EXCLUDED.draft_id,
          email = EXCLUDED.email,
          product_id = EXCLUDED.product_id,
          checkout_url = EXCLUDED.checkout_url,
          site_host = EXCLUDED.site_host,
          user_id = EXCLUDED.user_id,
          consent_at = EXCLUDED.consent_at,
          consent_version = EXCLUDED.consent_version,
          updated_at = NOW()
      `,
      [
        checkout.sessionId,
        draftId,
        isValidEmail(email) ? email : null,
        DODO_PRODUCT_ID,
        checkout.checkoutUrl,
        checkout.siteHost,
        user.id,
        DIGITAL_CONTENT_CONSENT_VERSION,
      ]
    );

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl });
  } catch (error) {
    console.error("dodo_checkout_create_failed", error);
    await reportConversionFailure({
      category: "checkout_creation_failure",
      title: "Dodo checkout could not be created",
      userId: user.id,
      documentId: draftId,
      error,
      context: {
        route: "/api/checkout/dodo",
        force_new: forceNew,
      },
    });
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 502 });
  }
}
