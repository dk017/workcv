import { WORKCV_PASS } from "./commerce.ts";

const DAY_MS = 86_400_000;

export type PassStatus = { active: boolean; expiresAt: string | null; daysLeft: number };

// Pure unlock rules, mirrored by unlockedDocumentSql and covered by tests:
// - a CV with its own non-refunded order is unlocked;
// - a CV created before any non-refunded pass window ends is unlocked,
//   including CVs created before the pass was bought. It stays unlocked
//   after the pass ends; only CVs created later need a new purchase.
export function passExpiry(paidAt: Date, days: number = WORKCV_PASS.days) {
  return new Date(paidAt.getTime() + days * DAY_MS);
}

export function isDocumentUnlocked(input: {
  documentCreatedAt: Date;
  hasDirectOrder: boolean;
  passPaidAts: Date[];
}) {
  if (input.hasDirectOrder) return true;
  return input.passPaidAts.some((paidAt) => input.documentCreatedAt < passExpiry(paidAt));
}

export function passStatusFrom(passPaidAts: Date[], now: Date = new Date()): PassStatus {
  const latest = passPaidAts
    .map((paidAt) => passExpiry(paidAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  if (!latest || latest <= now) {
    return { active: false, expiresAt: latest?.toISOString() ?? null, daysLeft: 0 };
  }
  return {
    active: true,
    expiresAt: latest.toISOString(),
    daysLeft: Math.ceil((latest.getTime() - now.getTime()) / DAY_MS),
  };
}

// SQL form of isDocumentUnlocked for a workcv_cv_documents row aliased `d`.
export function unlockedDocumentSql(passProductParam: string, daysParam: string) {
  return `(
    EXISTS (
      SELECT 1 FROM workcv_orders o
      WHERE o.draft_id = d.id AND o.user_id = d.user_id AND o.refunded_at IS NULL
    )
    OR EXISTS (
      SELECT 1 FROM workcv_orders p
      WHERE p.user_id = d.user_id AND p.product_id = ${passProductParam}
        AND p.refunded_at IS NULL
        AND d.created_at < p.paid_at + make_interval(days => ${daysParam}::int)
    )
  )`;
}

// A refund only revokes access when it covers the whole order.
export function refundRevokesAccess(refundAmountMinor: number | null, orderAmountMinor: number | null) {
  if (typeof refundAmountMinor !== "number" || typeof orderAmountMinor !== "number") return false;
  return refundAmountMinor >= orderAmountMinor;
}
