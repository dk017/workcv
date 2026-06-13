import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { userOwnsCvDocument } from "@/lib/cv-documents";
import { createDodoCheckout, DODO_PRODUCT_ID } from "@/lib/dodo";
import { ensurePaymentTables, getPool } from "@/lib/db";

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

  if (!isValidDraftId(draftId)) {
    return NextResponse.json({ error: "Invalid draftId" }, { status: 400 });
  }

  if (email !== null && email !== undefined && email !== "" && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const ownsDocument = await userOwnsCvDocument(user.id, draftId);
    if (!ownsDocument) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    await ensurePaymentTables();
    const checkout = await createDodoCheckout({
      draftId,
      email: isValidEmail(email) ? email : undefined,
    });

    await getPool().query(
      `
        INSERT INTO workcv_payment_checkouts
          (id, draft_id, email, product_id, checkout_url, site_host, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          draft_id = EXCLUDED.draft_id,
          email = EXCLUDED.email,
          product_id = EXCLUDED.product_id,
          checkout_url = EXCLUDED.checkout_url,
          site_host = EXCLUDED.site_host,
          updated_at = NOW()
      `,
      [
        checkout.sessionId,
        draftId,
        isValidEmail(email) ? email : null,
        DODO_PRODUCT_ID,
        checkout.checkoutUrl,
        checkout.siteHost,
      ]
    );

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl });
  } catch (error) {
    console.error("dodo_checkout_create_failed", error);
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 502 });
  }
}
