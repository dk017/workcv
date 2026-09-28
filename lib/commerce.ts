export const WORKCV_PRICE = {
  amountMinor: 799,
  amount: 7.99,
  currency: "GBP",
  taxInclusive: true,
  billing: "one_time",
} as const;

export const WORKCV_PRODUCT_ID =
  process.env.DODO_PRODUCT_ID ||
  process.env.DODO_WORKCV_PRODUCT_ID ||
  process.env.DODO_PAYMENTS_PRODUCT_ID ||
  "pdt_0NgvxNXDilMTh3bpfLPq2";

// Job Search Pass: one payment, never renews. Every CV created before the
// pass window ends stays unlocked; the window is computed from paid_at.
export const WORKCV_PASS = {
  amountMinor: 2499,
  amount: 24.99,
  currency: "GBP",
  taxInclusive: true,
  billing: "one_time",
  days: 90,
} as const;

export const WORKCV_PASS_PRODUCT_ID =
  process.env.DODO_PASS_PRODUCT_ID || "pdt_0NoafhI03VVtoLtkpGLHe";

export type WorkcvPlan = "cv" | "pass";

export function isWorkcvPlan(value: unknown): value is WorkcvPlan {
  return value === "cv" || value === "pass";
}

export function productIdForPlan(plan: WorkcvPlan) {
  return plan === "pass" ? WORKCV_PASS_PRODUCT_ID : WORKCV_PRODUCT_ID;
}

export function planForProductId(productId: string | null | undefined): WorkcvPlan | null {
  if (productId === WORKCV_PRODUCT_ID) return "cv";
  if (productId === WORKCV_PASS_PRODUCT_ID) return "pass";
  return null;
}

export const DIGITAL_CONTENT_CONSENT_VERSION = "2026-07-05";
