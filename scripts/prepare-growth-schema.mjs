import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const parsed = new URL(databaseUrl);
if (!/^postgres(?:ql)?:$/.test(parsed.protocol) || !parsed.hostname || parsed.pathname === "/") {
  throw new Error("DATABASE_URL must be a PostgreSQL URL with a host and database name");
}
console.log(`Preparing WorkCV growth schema on ${parsed.hostname}/${parsed.pathname.slice(1)}`);

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
const client = await pool.connect();
try {
  const base = await client.query(`
    SELECT
      to_regclass('public.workcv_login_codes') IS NOT NULL AS login_codes,
      to_regclass('public.workcv_signup_events') IS NOT NULL AS signup_events,
      to_regclass('public.workcv_editor_events') IS NOT NULL AS editor_events,
      to_regclass('public.workcv_funnel_events') IS NOT NULL AS funnel_events,
      to_regclass('public.workcv_payment_checkouts') IS NOT NULL AS checkouts,
      to_regclass('public.workcv_orders') IS NOT NULL AS orders,
      to_regclass('public.workcv_users') IS NOT NULL AS users,
      to_regclass('public.workcv_cv_documents') IS NOT NULL AS documents
  `);
  if (Object.values(base.rows[0] || {}).some((value) => value !== true)) {
    throw new Error("Base WorkCV tables are missing; run the application database setup first");
  }

  await client.query("BEGIN");
  await client.query(`
    ALTER TABLE workcv_editor_events ADD COLUMN IF NOT EXISTS event_key TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS workcv_editor_events_event_key_uidx
      ON workcv_editor_events (event_key) WHERE event_key IS NOT NULL;

    ALTER TABLE workcv_funnel_events
      ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;
    CREATE INDEX IF NOT EXISTS workcv_funnel_events_test_event_time_idx
      ON workcv_funnel_events (is_test, event_name, created_at DESC);

    ALTER TABLE workcv_payment_checkouts
      ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE workcv_orders
      ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;
    CREATE INDEX IF NOT EXISTS workcv_orders_test_paid_idx
      ON workcv_orders (is_test, paid_at DESC);

    CREATE TABLE IF NOT EXISTS workcv_saved_cv_reminders (
      user_id TEXT PRIMARY KEY,
      email_normalized TEXT NOT NULL,
      document_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'sending',
      attempt_count INTEGER NOT NULL DEFAULT 1,
      last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      sent_at TIMESTAMPTZ,
      last_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS workcv_saved_cv_reminders_status_idx
      ON workcv_saved_cv_reminders (status, updated_at DESC);

    UPDATE workcv_login_codes
      SET attribution = attribution - 'visitorId' - 'sessionId'
      WHERE attribution ? 'visitorId' OR attribution ? 'sessionId';
    UPDATE workcv_signup_events
      SET attribution = attribution - 'visitorId' - 'sessionId'
      WHERE attribution ? 'visitorId' OR attribution ? 'sessionId';
  `);
  await client.query("COMMIT");

  const verification = await client.query(`
    SELECT
      to_regclass('public.workcv_saved_cv_reminders') IS NOT NULL AS reminders,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'workcv_editor_events' AND column_name = 'event_key'
      ) AS event_key,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'workcv_funnel_events' AND column_name = 'is_test'
      ) AS funnel_test,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'workcv_orders' AND column_name = 'is_test'
      ) AS order_test,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'workcv_payment_checkouts' AND column_name = 'is_test'
      ) AS checkout_test,
      to_regclass('public.workcv_editor_events_event_key_uidx') IS NOT NULL AS event_key_index,
      to_regclass('public.workcv_funnel_events_test_event_time_idx') IS NOT NULL AS funnel_report_index,
      to_regclass('public.workcv_orders_test_paid_idx') IS NOT NULL AS order_report_index,
      to_regclass('public.workcv_saved_cv_reminders_status_idx') IS NOT NULL AS reminder_index,
      (
        SELECT COUNT(*) FROM workcv_login_codes
        WHERE attribution ? 'visitorId' OR attribution ? 'sessionId'
      ) + (
        SELECT COUNT(*) FROM workcv_signup_events
        WHERE attribution ? 'visitorId' OR attribution ? 'sessionId'
      ) AS forbidden_identifier_rows
  `);
  const result = verification.rows[0];
  if (
    !result?.reminders ||
    !result?.event_key ||
    !result?.funnel_test ||
    !result?.order_test ||
    !result?.checkout_test ||
    !result?.event_key_index ||
    !result?.funnel_report_index ||
    !result?.order_report_index ||
    !result?.reminder_index ||
    Number(result?.forbidden_identifier_rows || 0) !== 0
  ) {
    throw new Error("Growth schema verification failed");
  }
  console.log("Growth schema prepared; forbidden raw identifier rows: 0");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  client.release();
  await pool.end();
}
