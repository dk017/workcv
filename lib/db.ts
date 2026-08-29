import { Pool } from "pg";

let pool: Pool | null = null;
let paymentSetupPromise: Promise<void> | null = null;
let authSetupPromise: Promise<void> | null = null;
let analyticsSetupPromise: Promise<void> | null = null;
let feedbackSetupPromise: Promise<void> | null = null;
let reminderSetupPromise: Promise<void> | null = null;

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
          user_id TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          consent_at TIMESTAMPTZ,
          consent_version TEXT,
          is_test BOOLEAN NOT NULL DEFAULT FALSE,
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
          user_id TEXT,
          consent_at TIMESTAMPTZ,
          consent_version TEXT,
          is_test BOOLEAN NOT NULL DEFAULT FALSE,
          confirmation_email_attempted_at TIMESTAMPTZ,
          confirmation_email_sent_at TIMESTAMPTZ,
          paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS confirmation_email_attempted_at TIMESTAMPTZ;

        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;

        ALTER TABLE workcv_payment_checkouts
          ADD COLUMN IF NOT EXISTS user_id TEXT;
        ALTER TABLE workcv_payment_checkouts
          ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
        ALTER TABLE workcv_payment_checkouts
          ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
        ALTER TABLE workcv_payment_checkouts
          ADD COLUMN IF NOT EXISTS consent_version TEXT;
        ALTER TABLE workcv_payment_checkouts
          ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS user_id TEXT;
        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS consent_version TEXT;
        ALTER TABLE workcv_orders
          ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;

        DO $backfill$
        BEGIN
          IF to_regclass('public.workcv_cv_documents') IS NOT NULL THEN
            UPDATE workcv_payment_checkouts p
            SET user_id = d.user_id
            FROM workcv_cv_documents d
            WHERE p.user_id IS NULL AND p.draft_id = d.id;

            UPDATE workcv_orders o
            SET user_id = d.user_id
            FROM workcv_cv_documents d
            WHERE o.user_id IS NULL AND o.draft_id = d.id;
          END IF;
        END
        $backfill$;

        CREATE INDEX IF NOT EXISTS workcv_orders_draft_paid_idx
          ON workcv_orders (draft_id, paid_at);
        CREATE INDEX IF NOT EXISTS workcv_orders_test_paid_idx
          ON workcv_orders (is_test, paid_at DESC);
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

        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS first_landing_path TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS first_referrer TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS utm_source TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS utm_medium TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS utm_term TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS utm_content TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS signup_next_path TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS first_visitor_hash TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS first_session_hash TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS last_landing_path TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS last_referrer_host TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS last_utm_source TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS last_utm_medium TEXT;
        ALTER TABLE workcv_users ADD COLUMN IF NOT EXISTS last_utm_campaign TEXT;

        CREATE TABLE IF NOT EXISTS workcv_login_codes (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          attempt_count INTEGER NOT NULL DEFAULT 0,
          locked_until TIMESTAMPTZ,
          request_ip TEXT,
          attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
          next_path TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_login_codes_email_idx
          ON workcv_login_codes (email, created_at DESC);

        ALTER TABLE workcv_login_codes
          ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 0;
        ALTER TABLE workcv_login_codes
          ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
        ALTER TABLE workcv_login_codes
          ADD COLUMN IF NOT EXISTS request_ip TEXT;
        ALTER TABLE workcv_login_codes
          ADD COLUMN IF NOT EXISTS attribution JSONB NOT NULL DEFAULT '{}'::jsonb;
        ALTER TABLE workcv_login_codes
          ADD COLUMN IF NOT EXISTS next_path TEXT;

        UPDATE workcv_login_codes
        SET attribution = attribution - 'visitorId' - 'sessionId'
        WHERE attribution ? 'visitorId' OR attribution ? 'sessionId';

        CREATE TABLE IF NOT EXISTS workcv_signup_events (
          id BIGSERIAL PRIMARY KEY,
          event_name TEXT NOT NULL,
          email_hash TEXT NOT NULL,
          user_id TEXT,
          next_path TEXT,
          attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_signup_events_funnel_idx
          ON workcv_signup_events (event_name, created_at DESC);

        UPDATE workcv_signup_events
        SET attribution = attribution - 'visitorId' - 'sessionId'
        WHERE attribution ? 'visitorId' OR attribution ? 'sessionId';

        CREATE TABLE IF NOT EXISTS workcv_auth_rate_events (
          id BIGSERIAL PRIMARY KEY,
          kind TEXT NOT NULL,
          email TEXT NOT NULL,
          ip TEXT NOT NULL,
          succeeded BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_auth_rate_events_lookup_idx
          ON workcv_auth_rate_events (kind, email, ip, created_at DESC);

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

export async function ensureAnalyticsTables() {
  if (!analyticsSetupPromise) {
    analyticsSetupPromise = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS workcv_editor_events (
          id BIGSERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          document_id TEXT,
          event_name TEXT NOT NULL,
          event_key TEXT,
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_editor_events_funnel_idx
          ON workcv_editor_events (event_name, created_at DESC);
        ALTER TABLE workcv_editor_events
          ADD COLUMN IF NOT EXISTS event_key TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS workcv_editor_events_event_key_uidx
          ON workcv_editor_events (event_key)
          WHERE event_key IS NOT NULL;

        CREATE TABLE IF NOT EXISTS workcv_funnel_events (
          id BIGSERIAL PRIMARY KEY,
          event_id_hash TEXT NOT NULL UNIQUE,
          visitor_hash TEXT NOT NULL,
          session_hash TEXT NOT NULL,
          user_id TEXT,
          event_name TEXT NOT NULL,
          path TEXT NOT NULL,
          source TEXT,
          source_normalized TEXT NOT NULL,
          medium TEXT,
          campaign TEXT,
          referrer_host TEXT,
          device_class TEXT NOT NULL,
          is_test BOOLEAN NOT NULL DEFAULT FALSE,
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_funnel_events_event_time_idx
          ON workcv_funnel_events (event_name, created_at DESC);
        ALTER TABLE workcv_funnel_events
          ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS workcv_funnel_events_source_time_idx
          ON workcv_funnel_events (source_normalized, created_at DESC);
        CREATE INDEX IF NOT EXISTS workcv_funnel_events_path_time_idx
          ON workcv_funnel_events (path, created_at DESC);
        CREATE INDEX IF NOT EXISTS workcv_funnel_events_user_time_idx
          ON workcv_funnel_events (user_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS workcv_funnel_events_visitor_time_idx
          ON workcv_funnel_events (visitor_hash, created_at DESC);
        CREATE TABLE IF NOT EXISTS workcv_conversion_alerts (
          fingerprint TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          user_id TEXT,
          document_id TEXT,
          occurrence_count INTEGER NOT NULL DEFAULT 1,
          first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_error TEXT,
          last_alert_attempt_at TIMESTAMPTZ,
          last_alert_sent_at TIMESTAMPTZ,
          last_delivery_error TEXT
        );

        CREATE INDEX IF NOT EXISTS workcv_conversion_alerts_last_seen_idx
          ON workcv_conversion_alerts (last_seen_at DESC);
      `)
      .then(() => undefined)
      .catch((error) => {
        analyticsSetupPromise = null;
        throw error;
      });
  }
  return analyticsSetupPromise;
}

export async function ensureFeedbackOutreachTables() {
  if (!feedbackSetupPromise) {
    feedbackSetupPromise = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS workcv_feedback_preferences (
          email_normalized TEXT PRIMARY KEY,
          feedback_opted_out_at TIMESTAMPTZ,
          source TEXT NOT NULL DEFAULT 'unsubscribe',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS workcv_feedback_outreach (
          user_id TEXT PRIMARY KEY,
          email_normalized TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'sending',
          attempt_count INTEGER NOT NULL DEFAULT 1,
          last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          sent_at TIMESTAMPTZ,
          last_error TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS workcv_feedback_outreach_status_idx
          ON workcv_feedback_outreach (status, updated_at DESC);
      `)
      .then(() => undefined)
      .catch((error) => {
        feedbackSetupPromise = null;
        throw error;
      });
  }
  return feedbackSetupPromise;
}

export async function ensureSavedCvReminderTables() {
  if (!reminderSetupPromise) {
    reminderSetupPromise = getPool()
      .query(`
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
      `)
      .then(() => undefined)
      .catch((error) => {
        reminderSetupPromise = null;
        throw error;
      });
  }
  return reminderSetupPromise;
}
