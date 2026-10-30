// Read-only support lookup: a customer's orders and saved CVs, to see which CV a payment unlocked.
// Prints counts and labels only, never CV text. It runs inside the production app container, which
// already has DATABASE_URL, so piping it over ssh from the repo root needs no credentials:
//
//   ssh <server> "cd /opt/workcv && docker compose -p workcv -f docker-compose.ghcr.yml exec -T \
//     -e LOOKUP_EMAIL=customer@example.com app node --input-type=module" < scripts/order-lookup.mjs

const email = (process.env.LOOKUP_EMAIL || "").trim().toLowerCase();
if (!email.includes("@")) {
  console.error("Set LOOKUP_EMAIL to the customer's sign-in or receipt email.");
  process.exit(1);
}

// Same default as lib/commerce.ts. "paid" below means the CV's own order; a Pass is listed with the orders.
const passProductId = process.env.DODO_PASS_PRODUCT_ID || "pdt_0NoafhI03VVtoLtkpGLHe";
const { default: pg } = await import("pg");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
await client.connect();
try {
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");

  const users = await client.query("SELECT id, created_at FROM workcv_users WHERE lower(email) = $1", [email]);
  const user = users.rows[0];
  console.log(user ? `User ${user.id} (signed up ${user.created_at.toISOString()})` : "No WorkCV account with that email.");

  // Orders by account or by receipt email, in case the payment email differs from the sign-in email.
  const orders = await client.query(
    `SELECT o.id, o.product_id, o.amount_cents, o.currency, o.paid_at, o.refunded_at, o.draft_id,
            o.checkout_id, o.user_id, d.id IS NOT NULL AS cv_exists
     FROM workcv_orders o
     LEFT JOIN workcv_cv_documents d ON d.id = o.draft_id AND d.user_id = o.user_id
     WHERE o.user_id = $1 OR lower(o.email) = $2
     ORDER BY o.paid_at DESC`,
    [user?.id ?? "", email],
  );
  console.log(`\nOrders (${orders.rowCount}):`);
  console.table(orders.rows.map((row) => ({
    order: row.id,
    product: row.product_id,
    amount: row.amount_cents === null ? null : `${(row.amount_cents / 100).toFixed(2)} ${row.currency ?? ""}`.trim(),
    paid: row.paid_at.toISOString(),
    refunded: Boolean(row.refunded_at),
    cv: row.draft_id,
    cvExists: row.cv_exists,
    sameAccount: row.user_id === user?.id,
    checkout: row.checkout_id,
  })));

  if (user) {
    const documents = await client.query(
      `SELECT d.id, d.title, d.created_at, d.updated_at,
              coalesce(nullif(trim(d.data->>'targetRole'), ''), '(none)') AS target_role,
              nullif(trim(d.data->>'fullName'), '') IS NOT NULL AS has_name,
              coalesce(jsonb_array_length(d.data->'experience'), 0) AS jobs,
              length(d.data::text) AS size,
              EXISTS (SELECT 1 FROM workcv_orders o WHERE o.draft_id = d.id AND o.user_id = d.user_id
                      AND o.refunded_at IS NULL AND o.product_id <> $2) AS paid
       FROM workcv_cv_documents d
       WHERE d.user_id = $1
       ORDER BY d.updated_at DESC`,
      [user.id, passProductId],
    );
    console.log(`\nSaved CVs (${documents.rowCount}), most recently edited first:`);
    console.table(documents.rows.map((row) => ({
      cv: row.id,
      title: row.title,
      targetRole: row.target_role,
      hasName: row.has_name,
      jobs: row.jobs,
      size: row.size,
      created: row.created_at.toISOString(),
      edited: row.updated_at.toISOString(),
      paid: row.paid,
    })));
  }
} finally {
  await client.query("ROLLBACK").catch(() => {});
  await client.end();
}
