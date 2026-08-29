import pg from "pg";

import { calculateStepConversions, normalizeMetricRows, normalizeNumericRows } from "./growth-report-core.mjs";

const { Pool } = pg;

function reportDays(argv) {
  const value = Number(argv.find((item) => item.startsWith("--days="))?.split("=")[1] || "30");
  if (![7, 14, 30, 90].includes(value)) throw new Error("--days must be one of 7, 14, 30, or 90");
  return value;
}

function reportTimezone(argv) {
  const value = argv.find((item) => item.startsWith("--timezone="))?.split("=")[1] || "UTC";
  if (value !== "UTC") throw new Error("--timezone currently supports UTC only");
  return value;
}

const days = reportDays(process.argv.slice(2));
const timezone = reportTimezone(process.argv.slice(2));
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const privateLanding = `(path = '/login' OR path = '/editor' OR path = '/my-cvs' OR path LIKE '/cv-pdf/%' OR path LIKE '/api/%')`;
const sourceCase = `CASE
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'chatgpt|openai' THEN 'chatgpt'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'claude|anthropic' THEN 'claude'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'gemini|bard\\.google' THEN 'gemini'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'perplexity' THEN 'perplexity'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'copilot' THEN 'copilot'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'bing\\.com|(^| )bing( |$)' THEN 'bing'
  WHEN LOWER(COALESCE(source_value, '') || ' ' || COALESCE(host_value, '')) ~ 'google' THEN 'google'
  WHEN COALESCE(source_value, '') <> '' THEN LEFT(REGEXP_REPLACE(LOWER(source_value), '[^a-z0-9._-]', '_', 'g'), 80)
  WHEN COALESCE(host_value, '') <> '' THEN 'referral'
  ELSE 'direct_or_unknown' END`;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
try {
  const ready = await pool.query(`SELECT
    to_regclass('public.workcv_funnel_events') IS NOT NULL AS funnel,
    to_regclass('public.workcv_editor_events') IS NOT NULL AS editor,
    to_regclass('public.workcv_signup_events') IS NOT NULL AS signup,
    to_regclass('public.workcv_orders') IS NOT NULL AS orders,
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workcv_orders' AND column_name = 'is_test') AS order_test`);
  if (Object.values(ready.rows[0] || {}).some((value) => value !== true)) {
    throw new Error("Growth schema is not ready; run npm run db:prepare:growth first");
  }

  const boundsRow = (await pool.query(
    `SELECT NOW() AS report_end, NOW() - ($1::text || ' days')::interval AS window_start`,
    [days],
  )).rows[0];
  const params = [boundsRow.window_start, boundsRow.report_end];
  const bounds = `WITH bounds AS (SELECT $1::timestamptz AS window_start, $2::timestamptz AS report_end)`;

  const metrics = await pool.query(`${bounds}
    SELECT 'qualified_sessions' metric, COUNT(DISTINCT session_hash)::bigint value FROM workcv_funnel_events, bounds
      WHERE event_name='landing_view' AND is_test=FALSE AND NOT ${privateLanding} AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'marketing_cta_clickers', COUNT(DISTINCT session_hash)::bigint FROM workcv_funnel_events, bounds
      WHERE event_name='marketing_cta_clicked' AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'marketing_cta_clicks', COUNT(*)::bigint FROM workcv_funnel_events, bounds
      WHERE event_name='marketing_cta_clicked' AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'login_starters', COUNT(DISTINCT session_hash)::bigint FROM workcv_funnel_events, bounds
      WHERE event_name='login_started' AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'signups', COUNT(DISTINCT user_id)::bigint FROM workcv_signup_events, bounds
      WHERE event_name='signup_completed' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'activated_users', COUNT(DISTINCT user_id)::bigint FROM workcv_cv_documents, bounds
      WHERE created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'created_documents', COUNT(*)::bigint FROM workcv_cv_documents, bounds
      WHERE created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'preview_ready_users', COUNT(DISTINCT user_id)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='preview_ready' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'pdf_clickers', COUNT(DISTINCT user_id)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='pdf_clicked' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'checkout_openers', COUNT(DISTINCT user_id)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='checkout_sheet_opened' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'payment_starters', COUNT(DISTINCT user_id)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='payment_started' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'positive_production_orders', COUNT(*)::bigint FROM workcv_orders, bounds
      WHERE amount_cents>0 AND is_test=FALSE AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'gross_production_gbp_pence', COALESCE(SUM(amount_cents),0)::bigint FROM workcv_orders, bounds
      WHERE amount_cents>0 AND is_test=FALSE AND UPPER(COALESCE(currency,'GBP'))='GBP' AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'zero_value_orders', COUNT(*)::bigint FROM workcv_orders, bounds
      WHERE COALESCE(amount_cents,0)<=0 AND is_test=FALSE AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'test_operator_orders', COUNT(*)::bigint FROM workcv_orders, bounds
      WHERE is_test=TRUE AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'successful_pdf_downloaders', COUNT(DISTINCT user_id)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='pdf_downloaded' AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'successful_pdf_downloads', COUNT(*)::bigint FROM workcv_editor_events, bounds
      WHERE event_name='pdf_downloaded' AND created_at>=window_start AND created_at<report_end`, params);

  const firstTouch = await pool.query(`${bounds},
    landings AS (
      SELECT source_normalized source, path landing_path, session_hash FROM workcv_funnel_events, bounds
      WHERE event_name='landing_view' AND is_test=FALSE AND NOT ${privateLanding} AND created_at>=window_start AND created_at<report_end
    ),
    landing_groups AS (
      SELECT source, landing_path, COUNT(DISTINCT session_hash)::bigint qualified_sessions,
        COUNT(DISTINCT session_hash) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_funnel_events e, bounds b WHERE e.session_hash=landings.session_hash AND e.event_name='marketing_cta_clicked' AND e.is_test=FALSE AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint cta_clickers,
        COUNT(DISTINCT session_hash) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_funnel_events e, bounds b WHERE e.session_hash=landings.session_hash AND e.event_name='login_started' AND e.is_test=FALSE AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint login_starters
      FROM landings GROUP BY source, landing_path
    ),
    signup_users AS (
      SELECT DISTINCT user_id FROM workcv_signup_events, bounds WHERE event_name='signup_completed' AND user_id IS NOT NULL AND created_at>=window_start AND created_at<report_end
    ),
    attributed_users AS (
      SELECT u.id, COALESCE(first_event.source_normalized, normalized.source) source,
        COALESCE(first_event.path, u.first_landing_path, '(unknown)') landing_path
      FROM signup_users s JOIN workcv_users u ON u.id=s.user_id
      LEFT JOIN LATERAL (
        SELECT e.source_normalized,e.path FROM workcv_funnel_events e
        WHERE e.user_id=u.id AND e.event_name='landing_view' AND e.is_test=FALSE
          AND NOT (e.path='/login' OR e.path='/editor' OR e.path='/my-cvs' OR e.path LIKE '/cv-pdf/%' OR e.path LIKE '/api/%')
        ORDER BY e.created_at ASC LIMIT 1
      ) first_event ON TRUE
      CROSS JOIN LATERAL (SELECT ${sourceCase} source FROM (SELECT u.utm_source source_value,u.first_referrer host_value) raw) normalized
    ),
    user_groups AS (
      SELECT a.source,a.landing_path,COUNT(*)::bigint signups,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_cv_documents d,bounds b WHERE d.user_id=a.id AND d.created_at>=b.window_start AND d.created_at<b.report_end))::bigint activated_users,
        COALESCE(SUM((SELECT COUNT(*) FROM workcv_cv_documents d,bounds b WHERE d.user_id=a.id AND d.created_at>=b.window_start AND d.created_at<b.report_end)),0)::bigint created_documents,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_editor_events e,bounds b WHERE e.user_id=a.id AND e.event_name='preview_ready' AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint preview_ready_users,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_editor_events e,bounds b WHERE e.user_id=a.id AND e.event_name='pdf_clicked' AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint pdf_clickers,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_editor_events e,bounds b WHERE e.user_id=a.id AND e.event_name='checkout_sheet_opened' AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint checkout_openers,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_editor_events e,bounds b WHERE e.user_id=a.id AND e.event_name='payment_started' AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint payment_starters,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_orders o,bounds b WHERE o.user_id=a.id AND o.amount_cents>0 AND o.is_test=FALSE AND o.paid_at>=b.window_start AND o.paid_at<b.report_end))::bigint production_buyers,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM workcv_editor_events e,bounds b WHERE e.user_id=a.id AND e.event_name='pdf_downloaded' AND e.created_at>=b.window_start AND e.created_at<b.report_end))::bigint pdf_downloaders
      FROM attributed_users a GROUP BY a.source,a.landing_path
    )
    SELECT COALESCE(l.source,u.source) source,COALESCE(l.landing_path,u.landing_path) landing_path,
      COALESCE(l.qualified_sessions,0)::bigint qualified_sessions,COALESCE(l.cta_clickers,0)::bigint cta_clickers,COALESCE(l.login_starters,0)::bigint login_starters,
      COALESCE(u.signups,0)::bigint signups,COALESCE(u.activated_users,0)::bigint activated_users,COALESCE(u.created_documents,0)::bigint created_documents,COALESCE(u.preview_ready_users,0)::bigint preview_ready_users,
      COALESCE(u.pdf_clickers,0)::bigint pdf_clickers,COALESCE(u.checkout_openers,0)::bigint checkout_openers,COALESCE(u.payment_starters,0)::bigint payment_starters,
      COALESCE(u.production_buyers,0)::bigint production_buyers,COALESCE(u.pdf_downloaders,0)::bigint pdf_downloaders
    FROM landing_groups l FULL JOIN user_groups u USING(source,landing_path)
    ORDER BY qualified_sessions DESC,signups DESC,source,landing_path`, params);

  const acquisition = await pool.query(`${bounds}, landing_candidates AS (
      SELECT DISTINCT ON (session_hash) session_hash,source_normalized source,path landing_path,device_class,
        date_trunc('week',created_at AT TIME ZONE 'UTC')::date utc_week_start
      FROM workcv_funnel_events,bounds
      WHERE event_name='landing_view' AND is_test=FALSE AND NOT ${privateLanding} AND created_at>=window_start AND created_at<report_end
      ORDER BY session_hash,created_at ASC
    ), sessions AS (
      SELECT landing_candidates.*,
        (SELECT COUNT(*) FROM workcv_funnel_events e,bounds b
         WHERE e.session_hash=landing_candidates.session_hash AND e.event_name='marketing_cta_clicked' AND e.is_test=FALSE
           AND e.created_at>=b.window_start AND e.created_at<b.report_end)::bigint cta_clicks
      FROM landing_candidates
    )
    SELECT source,landing_path,device_class,utc_week_start,COUNT(*)::bigint sessions,
      COALESCE(SUM(cta_clicks),0)::bigint cta_clicks,
      (ROUND(100.0*COUNT(*) FILTER (WHERE cta_clicks>0)/NULLIF(COUNT(*),0),1)::text||'%') cta_click_rate
    FROM sessions GROUP BY source,landing_path,device_class,utc_week_start ORDER BY utc_week_start DESC,sessions DESC`, params);

  const lastTouch = await pool.query(`${bounds}, attributed AS (
      SELECT o.amount_cents,normalized.source,COALESCE(u.last_landing_path,'(unknown)') landing_path
      FROM workcv_orders o LEFT JOIN workcv_users u ON u.id=o.user_id
      CROSS JOIN LATERAL (SELECT ${sourceCase} source FROM (SELECT u.last_utm_source source_value,u.last_referrer_host host_value) raw) normalized,bounds
      WHERE o.amount_cents>0 AND o.is_test=FALSE AND o.paid_at>=window_start AND o.paid_at<report_end)
    SELECT source,landing_path,COUNT(*)::bigint production_orders,COALESCE(SUM(amount_cents),0)::bigint revenue_pence
    FROM attributed GROUP BY source,landing_path ORDER BY production_orders DESC,source,landing_path`, params);

  const quality = await pool.query(`${bounds}
    SELECT 'unattributed_signups' metric,COUNT(DISTINCT s.user_id)::bigint value FROM workcv_signup_events s LEFT JOIN workcv_users u ON u.id=s.user_id,bounds
      WHERE s.event_name='signup_completed' AND s.created_at>=window_start AND s.created_at<report_end AND COALESCE(u.utm_source,'')='' AND COALESCE(u.first_referrer,'')=''
    UNION ALL SELECT 'linked_landing_events',COUNT(*)::bigint FROM workcv_funnel_events,bounds WHERE event_name='landing_view' AND user_id IS NOT NULL AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'anonymous_landing_events',COUNT(*)::bigint FROM workcv_funnel_events,bounds WHERE event_name='landing_view' AND user_id IS NULL AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'private_path_landing_events',COUNT(*)::bigint FROM workcv_funnel_events,bounds WHERE event_name='landing_view' AND ${privateLanding} AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'duplicate_landing_rows',GREATEST(COUNT(*)-COUNT(DISTINCT session_hash),0)::bigint FROM workcv_funnel_events,bounds WHERE event_name='landing_view' AND is_test=FALSE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'test_funnel_events',COUNT(*)::bigint FROM workcv_funnel_events,bounds WHERE is_test=TRUE AND created_at>=window_start AND created_at<report_end
    UNION ALL SELECT 'zero_value_orders',COUNT(*)::bigint FROM workcv_orders,bounds WHERE COALESCE(amount_cents,0)<=0 AND is_test=FALSE AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'test_operator_orders',COUNT(*)::bigint FROM workcv_orders,bounds WHERE is_test=TRUE AND paid_at>=window_start AND paid_at<report_end
    UNION ALL SELECT 'authoritative_events_missing_association',COUNT(*)::bigint FROM workcv_editor_events,bounds WHERE event_name IN('document_created','payment_confirmed','pdf_downloaded') AND (user_id IS NULL OR document_id IS NULL) AND created_at>=window_start AND created_at<report_end`, params);

  const metricRows = normalizeMetricRows(metrics.rows);
  console.log(`WorkCV operational growth funnel — ${days} days — ${timezone}`);
  console.log(`Window: ${new Date(boundsRow.window_start).toISOString()} <= occurred_at < ${new Date(boundsRow.report_end).toISOString()}`);
  console.log(`Report generated at: ${new Date(boundsRow.report_end).toISOString()} (${timezone})`);
  console.table(metricRows);
  const grossPence = metricRows.find((row) => row.metric === "gross_production_gbp_pence")?.value || 0;
  console.log(`Gross production revenue (GBP): £${(grossPence / 100).toFixed(2)}`);
  console.log("Step conversion (same operational event window)");
  console.table(calculateStepConversions(metricRows));
  console.log("First-touch funnel by source and first public landing (no PII)");
  console.table(normalizeNumericRows(firstTouch.rows));
  console.log("Acquisition sessions by source, landing, device, and UTC week");
  console.table(normalizeNumericRows(acquisition.rows));
  console.log("Last-touch positive production orders (no PII)");
  console.table(normalizeNumericRows(lastTouch.rows));
  console.log("Data quality and explicitly excluded activity");
  console.table(normalizeMetricRows(quality.rows));
} finally {
  await pool.end();
}
