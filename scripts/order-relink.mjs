// Moves one single-CV order to another CV the same customer owns, for when a payment ended up on
// the wrong (or a deleted) copy. Find both IDs with scripts/order-lookup.mjs first. It only checks
// and prints unless RELINK_CONFIRM=RELINK is set:
//
//   ssh <server> "cd /opt/workcv && docker compose -p workcv -f docker-compose.ghcr.yml exec -T \
//     -e RELINK_ORDER_ID=<order> -e RELINK_TO_CV=<cv> [-e RELINK_CONFIRM=RELINK] \
//     app node --input-type=module" < scripts/order-relink.mjs
//
// To undo, run it again with RELINK_TO_CV set to the CV it previously pointed at, if that CV still exists.

const orderId = (process.env.RELINK_ORDER_ID || "").trim();
const toCv = (process.env.RELINK_TO_CV || "").trim();
const confirmed = process.env.RELINK_CONFIRM === "RELINK";
if (!orderId || !toCv) {
  console.error("Set RELINK_ORDER_ID and RELINK_TO_CV.");
  process.exit(1);
}

// Same default as lib/commerce.ts.
const passProductId = process.env.DODO_PASS_PRODUCT_ID || "pdt_0NoafhI03VVtoLtkpGLHe";
const { default: pg } = await import("pg");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
await client.connect();
try {
  await client.query("BEGIN");
  const order = (await client.query(
    "SELECT id, user_id, draft_id, product_id, refunded_at FROM workcv_orders WHERE id = $1 FOR UPDATE",
    [orderId],
  )).rows[0];
  const target = (await client.query(
    `SELECT d.id, d.user_id, d.title, d.updated_at,
            EXISTS (SELECT 1 FROM workcv_orders o WHERE o.draft_id = d.id AND o.user_id = d.user_id
                    AND o.refunded_at IS NULL AND o.id <> $2 AND o.product_id <> $3) AS already_paid
     FROM workcv_cv_documents d WHERE d.id = $1`,
    [toCv, orderId, passProductId],
  )).rows[0];

  const problems = [
    !order && "Order not found.",
    order?.refunded_at && "Order was refunded.",
    order?.product_id === passProductId && "Order is a Job Search Pass, which is not tied to one CV.",
    !target && "Target CV not found.",
    order && target && target.user_id !== order.user_id && "Target CV belongs to a different account than the order.",
    target?.already_paid && "Target CV already has its own paid order.",
    order && order.draft_id === toCv && "Order already points at that CV.",
  ].filter(Boolean);

  console.log(`Order ${orderId}: from CV ${order?.draft_id ?? "?"} to CV ${toCv}` +
    (target ? ` ("${target.title}", edited ${target.updated_at.toISOString()})` : ""));
  if (problems.length) {
    problems.forEach((problem) => console.error(`Refused: ${problem}`));
    process.exitCode = 1;
    await client.query("ROLLBACK");
  } else if (!confirmed) {
    console.log("Checks passed. Nothing changed: add -e RELINK_CONFIRM=RELINK to apply.");
    await client.query("ROLLBACK");
  } else {
    await client.query("UPDATE workcv_orders SET draft_id = $1 WHERE id = $2 AND user_id = $3", [toCv, orderId, order.user_id]);
    await client.query("COMMIT");
    console.log(`Relinked. It previously pointed at CV ${order.draft_id}.`);
  }
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end();
}
