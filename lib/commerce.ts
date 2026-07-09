export const WORKCV_PRICE = {
  amountMinor: 799,
  amount: 7.99,
  currency: "GBP",
  taxInclusive: false,
  billing: "one_time",
} as const;

export const WORKCV_PRODUCT_ID =
  process.env.DODO_PRODUCT_ID ||
  process.env.DODO_WORKCV_PRODUCT_ID ||
  process.env.DODO_PAYMENTS_PRODUCT_ID ||
  "pdt_0NgvxNXDilMTh3bpfLPq2";

export const DIGITAL_CONTENT_CONSENT_VERSION = "2026-07-05";
