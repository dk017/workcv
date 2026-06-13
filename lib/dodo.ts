import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_PRODUCT_ID = "pdt_0NgvxNXDilMTh3bpfLPq2";

export const DODO_PRODUCT_ID =
  process.env.DODO_PRODUCT_ID ||
  process.env.DODO_WORKCV_PRODUCT_ID ||
  process.env.DODO_PAYMENTS_PRODUCT_ID ||
  DEFAULT_PRODUCT_ID;

const DODO_API_KEY = process.env.DODO_API_KEY || process.env.DODO_PAYMENTS_API_KEY;
const DODO_ENVIRONMENT =
  process.env.DODO_ENVIRONMENT || process.env.DODO_PAYMENTS_ENVIRONMENT || "live_mode";

const DODO_API_BASE =
  DODO_ENVIRONMENT === "test_mode" || DODO_ENVIRONMENT === "test"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type DodoCheckoutResponse = {
  session_id?: string;
  checkout_url?: string;
};

export function getAppUrl() {
  return APP_URL.replace(/\/$/, "");
}

export function getSiteHost() {
  try {
    return new URL(getAppUrl()).host.toLowerCase();
  } catch {
    return null;
  }
}

export async function createDodoCheckout(input: { draftId: string; email?: string }) {
  if (!DODO_API_KEY) {
    throw new Error("DODO_API_KEY is not configured");
  }

  const body: Record<string, unknown> = {
    product_cart: [{ product_id: DODO_PRODUCT_ID, quantity: 1 }],
    allowed_payment_method_types: ["credit", "debit", "apple_pay", "google_pay"],
    billing_currency: "GBP",
    return_url: `${getAppUrl()}/editor?payment=success&draftId=${encodeURIComponent(
      input.draftId
    )}`,
    cancel_url: `${getAppUrl()}/editor?payment=cancelled&draftId=${encodeURIComponent(
      input.draftId
    )}`,
    metadata: {
      draft_id: input.draftId,
      product: "cv-download",
      product_id: DODO_PRODUCT_ID,
      provider: "dodo",
      site_host: getSiteHost(),
    },
    customization: {
      show_order_details: true,
      theme: "light",
    },
    feature_flags: {
      allow_currency_selection: false,
      allow_discount_code: false,
      allow_phone_number_collection: false,
    },
    minimal_address: true,
    billing_address: {
      country: "GB",
      zipcode: "SW1A 1AA",
    },
  };

  if (input.email) {
    body.customer = { email: input.email };
  }

  const response = await fetch(`${DODO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dodo checkout failed (${response.status}): ${error}`);
  }

  const checkout = (await response.json()) as DodoCheckoutResponse;
  if (!checkout.checkout_url || !checkout.session_id) {
    throw new Error("Dodo checkout response is missing checkout_url or session_id");
  }

  return {
    checkoutUrl: checkout.checkout_url,
    sessionId: checkout.session_id,
    siteHost: getSiteHost(),
  };
}

function decodeWebhookSecret(secret: string): Buffer {
  if (secret.startsWith("whsec_")) {
    return Buffer.from(secret.slice("whsec_".length), "base64");
  }

  return Buffer.from(secret, "utf8");
}

function extractSignatures(signatureHeader: string): string[] {
  return signatureHeader
    .split(" ")
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter((part) => part && part !== "v1");
}

export function verifyDodoWebhookSignature(input: {
  rawBody: string;
  webhookId: string | null;
  webhookTimestamp: string | null;
  webhookSignature: string | null;
  secret: string;
}) {
  const { rawBody, webhookId, webhookTimestamp, webhookSignature, secret } = input;
  if (!webhookId || !webhookTimestamp || !webhookSignature || !secret) return false;

  const timestampSeconds = Number(webhookTimestamp);
  if (!Number.isFinite(timestampSeconds)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > 5 * 60) return false;

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expected = createHmac("sha256", decodeWebhookSecret(secret))
    .update(signedContent)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);

  return extractSignatures(webhookSignature).some((signature) => {
    const signatureBuffer = Buffer.from(signature);
    return (
      signatureBuffer.length === expectedBuffer.length &&
      timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });
}

export function metadataString(
  metadata: Record<string, unknown> | null | undefined,
  key: string
) {
  const raw = metadata?.[key];
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  if (typeof raw === "boolean") return String(raw);
  return null;
}
