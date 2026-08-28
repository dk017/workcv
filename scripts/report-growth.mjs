import pg from "pg";

import {
  calculateStepConversions,
  normalizeMetricRows,
  normalizeSourceRows,
} from "./growth-report-core.mjs";

const { Pool } = pg;

function reportDays(argv) {
  const raw = argv.find((value) => value.startsWith("--days="))?.split("=")[1] || "30";
  const value = Number(raw);
  if (![7, 14, 30, 90].includes(value)) {
    throw new Error("--days must be one of 7, 14, 30, or 90");
  }
  return value;
}

const days = reportDays(process.argv.slice(2));
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
try {
  const tableCheck = await pool.query(`
    SELECT
      to_regclass('public.workcv_funnel_events') IS NOT NULL AS funnel,
      to_regclass('public.workcv_editor_events') IS NOT NULL AS editor,
      to_regclass('public.workcv_signup_events') IS NOT NULL AS signup,
      to_regclass('public.workcv_orders') IS NOT NULL AS orders
  `);
  const tables = tableCheck.rows[0];
  if (!tables?.funnel || !tables?.editor || !tables?.signup || !tables?.orders) {
    throw new Error("Growth tables are not ready; deploy the application before running this report");
  }

  const metrics = await pool.query(
    `
      WITH window AS (SELECT NOW() - ($1::text || ' days')::interval AS since)
      SELECT 'qualified_sessions' AS metric,
             COUNT(DISTINCT session_hash)::bigint AS value
      FROM workcv_funnel_events, window
      WHERE event_name = 'landing_view' AND created_at >= window.since
      UNION ALL
      SELECT 'signups', COUNT(DISTINCT user_id)::bigint
      FROM workcv_signup_events, window
      WHERE event_name = 'signup_completed' AND created_at >= window.since
      UNION ALL
      SELECT 'activated_users', COUNT(DISTINCT d.user_id)::bigint
      FROM workcv_cv_documents d
      JOIN workcv_users u ON u.id = d.user_id, window
      WHERE u.created_at >= window.since
      UNION ALL
      SELECT 'preview_ready_users', COUNT(DISTINCT user_id)::bigint
      FROM workcv_editor_events, window
      WHERE event_name = 'preview_ready' AND created_at >= window.since
      UNION ALL
      SELECT 'pdf_clickers', COUNT(DISTINCT user_id)::bigint
      FROM workcv_editor_events, window
      WHERE event_name = 'pdf_clicked' AND created_at >= window.since
      UNION ALL
      SELECT 'checkout_openers', COUNT(DISTINCT user_id)::bigint
      FROM workcv_editor_events, window
      WHERE event_name = 'checkout_sheet_opened' AND created_at >= window.since
      UNION ALL
      SELECT 'payment_starters', COUNT(DISTINCT user_id)::bigint
      FROM workcv_editor_events, window
      WHERE event_name = 'payment_started' AND created_at >= window.since
      UNION ALL
      SELECT 'positive_value_orders', COUNT(*)::bigint
      FROM workcv_orders, window
      WHERE amount_cents > 0 AND paid_at >= window.since
      UNION ALL
      SELECT 'successful_pdf_downloaders', COUNT(DISTINCT user_id)::bigint
      FROM workcv_editor_events, window
      WHERE event_name = 'pdf_downloaded' AND created_at >= window.since
    `,
    [days],
  );

  const sources = await pool.query(
    `
      WITH window AS (SELECT NOW() - ($1::text || ' days')::interval AS since),
      new_users AS (
        SELECT u.id, u.first_landing_path,
               COALESCE(f.source_normalized,
                 CASE
                   WHEN LOWER(COALESCE(u.utm_source, '')) LIKE '%chatgpt%' THEN 'chatgpt'
                   WHEN LOWER(COALESCE(u.utm_source, '')) LIKE '%claude%' THEN 'claude'
                   WHEN LOWER(COALESCE(u.utm_source, '')) LIKE '%gemini%' THEN 'gemini'
                   WHEN LOWER(COALESCE(u.utm_source, '')) LIKE '%google%' OR LOWER(COALESCE(u.first_referrer, '')) LIKE '%google.%' THEN 'google'
                   WHEN COALESCE(u.utm_source, '') <> '' THEN LOWER(u.utm_source)
                   ELSE 'direct_or_unknown'
                 END
               ) AS source
        FROM workcv_users u
        LEFT JOIN LATERAL (
          SELECT source_normalized
          FROM workcv_funnel_events e
          WHERE e.user_id = u.id AND e.event_name = 'landing_view'
          ORDER BY e.created_at ASC
          LIMIT 1
        ) f ON TRUE, window
        WHERE u.created_at >= window.since
      )
      SELECT source,
             COALESCE(first_landing_path, '(unknown)') AS landing_path,
             COUNT(*)::bigint AS signups,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM workcv_cv_documents d WHERE d.user_id = new_users.id
             ))::bigint AS activated,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM workcv_editor_events e
               WHERE e.user_id = new_users.id AND e.event_name = 'pdf_clicked'
             ))::bigint AS pdf_clickers,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM workcv_editor_events e
               WHERE e.user_id = new_users.id AND e.event_name = 'checkout_sheet_opened'
             ))::bigint AS checkout_openers,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM workcv_orders o
               WHERE o.user_id = new_users.id AND o.amount_cents > 0
             ))::bigint AS buyers
      FROM new_users
      GROUP BY source, first_landing_path
      ORDER BY signups DESC, source, landing_path
    `,
    [days],
  );

  console.log(`WorkCV growth funnel — ${days} days — UTC`);
  const metricRows = normalizeMetricRows(metrics.rows);
  console.table(metricRows);
  console.log("Step conversion");
  console.table(calculateStepConversions(metricRows));
  console.log("Source and first-landing funnel (no PII)");
  console.table(normalizeSourceRows(sources.rows));
} finally {
  await pool.end();
}
