import { WORKCV_PASS, WORKCV_PASS_PRODUCT_ID } from "@/lib/commerce";
import { ensurePaymentTables, getPool } from "@/lib/db";
import { passStatusFrom, unlockedDocumentSql, type PassStatus } from "@/lib/pass-rules";

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
