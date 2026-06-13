import { Pool } from "pg";

let pool: Pool | null = null;
let paymentSetupPromise: Promise<void> | null = null;
let authSetupPromise: Promise<void> | null = null;

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
  if (!paymentSetupPromise) {
    paymentSetupPromise = getPool()
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
        paymentSetupPromise = null;
        throw error;
      });
  }

  return paymentSetupPromise;
}

export async function ensureAuthTables() {
  if (!authSetupPromise) {
    authSetupPromise = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS workcv_users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS workcv_login_codes (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_login_codes_email_idx
          ON workcv_login_codes (email, created_at DESC);

        CREATE TABLE IF NOT EXISTS workcv_sessions (
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES workcv_users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_sessions_user_idx
          ON workcv_sessions (user_id);

        CREATE TABLE IF NOT EXISTS workcv_cv_documents (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES workcv_users(id) ON DELETE CASCADE,
          title TEXT NOT NULL DEFAULT 'My CV',
          data JSONB NOT NULL,
          template_id TEXT NOT NULL DEFAULT 'classic',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_cv_documents_user_updated_idx
          ON workcv_cv_documents (user_id, updated_at DESC);
      `)
      .then(() => undefined)
      .catch((error) => {
        authSetupPromise = null;
        throw error;
      });
  }

  return authSetupPromise;
}
