import { ensurePaymentTables, getPool } from "@/lib/db";

// One paid order unlocks every download format for that saved CV.
export async function hasPaidCvOrder(userId: string, documentId: string) {
  await ensurePaymentTables();
  const paid = await getPool().query(
    "SELECT 1 FROM workcv_orders WHERE draft_id = $1 AND user_id = $2 LIMIT 1",
    [documentId, userId],
  );
  return Boolean(paid.rows[0]);
}
