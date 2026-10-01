import { WORKCV_PASS, WORKCV_PASS_PRODUCT_ID, WORKCV_PRODUCT_ID } from "@/lib/commerce";
import { ensurePaymentTables, getPool } from "@/lib/db";
import { passStatusFrom, unlockedDocumentSql, type PassStatus } from "@/lib/pass-rules";
import {
  PASS_UPGRADE_WINDOW_DAYS,
  passUpgradeMode,
  upgradeOfferFrom,
  type UpgradeOffer,
} from "@/lib/pass-upgrade";
import { isApprovedTestUser } from "@/lib/test-orders";

// One paid order, or a Job Search Pass covering the CV's creation date,
// unlocks every download format for that saved CV.
export async function hasPaidCvOrder(userId: string, documentId: string) {
  await ensurePaymentTables();
  const result = await getPool().query<{ unlocked: boolean }>(
    `SELECT ${unlockedDocumentSql("$3", "$4")} AS unlocked
     FROM workcv_cv_documents d
     WHERE d.id = $1 AND d.user_id = $2`,
    [documentId, userId, WORKCV_PASS_PRODUCT_ID, WORKCV_PASS.days],
  );
  return result.rows[0]?.unlocked === true;
}

export async function getPassStatus(userId: string, now: Date = new Date()): Promise<PassStatus> {
  await ensurePaymentTables();
  const result = await getPool().query<{ paid_at: Date }>(
    `SELECT paid_at FROM workcv_orders
     WHERE user_id = $1 AND product_id = $2 AND refunded_at IS NULL`,
    [userId, WORKCV_PASS_PRODUCT_ID],
  );
  return passStatusFrom(result.rows.map((row) => row.paid_at), now);
}

// A recent single-CV buyer can upgrade to the Pass and pay the difference.
// Rolled out with WORKCV_PASS_UPGRADE (off | test | on); "test" limits it to
// approved test users until a live payment has confirmed the discounted total.
export async function getUpgradeOffer(
  user: { id: string; email?: string | null },
  now: Date = new Date(),
): Promise<UpgradeOffer> {
  const mode = passUpgradeMode(process.env.WORKCV_PASS_UPGRADE);
  if (mode === "off" || (mode === "test" && !isApprovedTestUser(user))) return { eligible: false };
  await ensurePaymentTables();
  const [pass, orders] = await Promise.all([
    getPassStatus(user.id, now),
    getPool().query<{ amount_cents: number | null; paid_at: Date }>(
      `SELECT amount_cents, paid_at FROM workcv_orders
       WHERE user_id = $1 AND product_id = $2 AND refunded_at IS NULL
         AND paid_at > $3::timestamptz - make_interval(days => $4::int)`,
      [user.id, WORKCV_PRODUCT_ID, now.toISOString(), PASS_UPGRADE_WINDOW_DAYS],
    ),
  ]);
  return upgradeOfferFrom({
    singleOrders: orders.rows.map((row) => ({ amountMinor: row.amount_cents, paidAt: row.paid_at })),
    passActive: pass.active,
    now,
  });
}
