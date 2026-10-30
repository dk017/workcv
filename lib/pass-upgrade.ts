import { WORKCV_PASS, WORKCV_PRICE } from "./commerce.ts";

// "Upgrade to the Job Search Pass": a recent single-CV buyer pays the Pass
// price minus what they already paid. The server is the only source of truth.

export const PASS_UPGRADE_WINDOW_DAYS = 14;
const DAY_MS = 86_400_000;

// off: nobody; test: approved test users only (default until a live payment
// has confirmed the discounted total); on: every eligible buyer.
export type PassUpgradeMode = "off" | "test" | "on";

export function passUpgradeMode(value: string | undefined): PassUpgradeMode {
  return value === "on" || value === "off" ? value : "test";
}

export type UpgradeOffer =
  | { eligible: true; creditMinor: number; priceMinor: number; endsAt: string }
  | { eligible: false };

export function upgradeOfferFrom(input: {
  // Non-refunded, paid single-CV orders for this user.
  singleOrders: Array<{ amountMinor: number | null; paidAt: Date }>;
  passActive: boolean;
  now?: Date;
}): UpgradeOffer {
  if (input.passActive) return { eligible: false };
  const now = input.now ?? new Date();
  const recent = input.singleOrders
    .filter((order) => typeof order.amountMinor === "number" && order.amountMinor > 0)
    .filter((order) => order.paidAt.getTime() <= now.getTime())
    .filter((order) => now.getTime() < order.paidAt.getTime() + PASS_UPGRADE_WINDOW_DAYS * DAY_MS)
    .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())[0];
  if (!recent) return { eligible: false };
  const creditMinor = Math.min(recent.amountMinor as number, WORKCV_PRICE.amountMinor);
  return {
    eligible: true,
    creditMinor,
    priceMinor: WORKCV_PASS.amountMinor - creditMinor,
    endsAt: new Date(recent.paidAt.getTime() + PASS_UPGRADE_WINDOW_DAYS * DAY_MS).toISOString(),
  };
}

export function upgradeWindowEnd(paidAt: Date) {
  return new Date(paidAt.getTime() + PASS_UPGRADE_WINDOW_DAYS * DAY_MS);
}

export function formatPence(minor: number) {
  return `£${(minor / 100).toFixed(2)}`;
}

// Dodo discount codes: up to 16 characters.
export function upgradeDiscountCode(random: () => number = Math.random) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "UPG";
  for (let index = 0; index < 12; index += 1) code += alphabet[Math.floor(random() * alphabet.length)];
  return code;
}

// Body for Dodo POST /discounts: a single-use flat credit on the Pass only.
export function upgradeDiscountBody(input: { creditMinor: number; passProductId: string; code: string; now?: Date }) {
  const now = input.now ?? new Date();
  return {
    name: "Job Search Pass upgrade credit",
    code: input.code,
    type: "flat",
    amount: input.creditMinor,
    currency_options: [{ currency: "GBP", is_default: true, max_amount_possible: input.creditMinor }],
    restricted_to: [input.passProductId],
    usage_limit: 1,
    expires_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
  };
}
