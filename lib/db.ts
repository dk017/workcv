import { Pool } from "pg";

let pool: Pool | null = null;
let setupPromise: Promise<void> | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }

  return pool;
}

export async function ensurePaymentTables() {
  if (!setupPromise) {
    setupPromise = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS workcv_payment_checkouts (
          id TEXT PRIMARY KEY,
          draft_id TEXT NOT NULL,
          email TEXT,
          product_id TEXT NOT NULL,
          provider TEXT NOT NULL DEFAULT 'dodo',
          checkout_url TEXT,
          site_host TEXT,
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_payment_checkouts_draft_idx
          ON workcv_payment_checkouts (draft_id);

        CREATE TABLE IF NOT EXISTS workcv_orders (
          id TEXT PRIMARY KEY,
          draft_id TEXT NOT NULL,
          email TEXT,
          product_id TEXT NOT NULL,
          provider TEXT NOT NULL DEFAULT 'dodo',
          amount_cents INTEGER,
          currency TEXT,
          checkout_id TEXT,
          raw_event_type TEXT,
          paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_orders_draft_paid_idx
          ON workcv_orders (draft_id, paid_at);
      `)
      .then(() => undefined)
      .catch((error) => {
        setupPromise = null;
        throw error;
      });
  }

  return setupPromise;
}
