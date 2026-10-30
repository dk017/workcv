import type { AnalyticsRange } from "./admin-access.ts";

export type AnalyticsCell = string | number | boolean | null;
export type AnalyticsRow = Record<string, AnalyticsCell>;
export type AnalyticsClient = { query: (sql: string, values?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> };
export type AnalyticsConfig = { range: AnalyticsRange; excludedUsers: string[]; passProductId: string; cvProductId: string; ingestEnabled: boolean };
export type AnalyticsReport = {
  generatedAt: string; start: string; range: AnalyticsRange; ingestEnabled: boolean; exclusions: number;
  summary: AnalyticsRow; coverage: AnalyticsRow;
  trends: AnalyticsRow[]; sources: AnalyticsRow[]; sourceSales: AnalyticsRow[]; pages: AnalyticsRow[];
  devices: AnalyticsRow[]; cohort: AnalyticsRow[]; plans: AnalyticsRow[]; passOffers: AnalyticsRow[];
  planEvents: AnalyticsRow[]; checkout: AnalyticsRow[]; orders: AnalyticsRow[]; live: AnalyticsRow[];
  journeys: AnalyticsRow[]; editorActivity: AnalyticsRow[]; tools: AnalyticsRow[]; ctas: AnalyticsRow[]; quality: AnalyticsRow;
};

function rows(input: Record<string, unknown>[]): AnalyticsRow[] {
  return input.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key,
    value instanceof Date ? value.toISOString() : value === null || ["string", "number", "boolean"].includes(typeof value) ? value as AnalyticsCell : null,
  ])));
}

// Query parameters hold all runtime values. Keep editor/CV content and customer
// emails out of this report; only pseudonymous identifiers and fixed event fields.
const publicPath = `path ~ '^/' AND path !~ '^/(admin|api|login|editor|my-cvs|cv-pdf|cv-pdf-parity|agent-markdown|chrome)(/|$)'`;
const source = `coalesce(nullif(lower(source),''), nullif(lower(referrer_host),''), 'direct_or_unknown')`;
const path = `CASE WHEN split_part(path,'?',1) ~ '^/[a-zA-Z0-9/_-]*$' THEN left(split_part(path,'?',1),160) ELSE '(other public page)' END`;

export async function collectAdminAnalytics(client: AnalyticsClient, config: AnalyticsConfig): Promise<AnalyticsReport> {
  const hours = config.range === "24h" ? 24 : config.range === "30d" ? 720 : 168;
  const bucket = config.range === "24h" ? "hour" : "day";
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  try {
    await client.query("SET LOCAL statement_timeout = '10s'");
    await client.query("SET LOCAL lock_timeout = '2s'");
    await client.query("SET LOCAL TIME ZONE 'UTC'");
    const now = (await client.query("SELECT NOW() AS at")).rows[0].at;
    const end = new Date(now as string | Date);
    const start = new Date(end.getTime() - hours * 3600000);
    const emails = config.excludedUsers.filter(value => value.includes("@")).map(value => value.toLowerCase());
    const resolved = emails.length ? (await client.query("SELECT id FROM workcv_users WHERE lower(email) = ANY($1::text[])", [emails])).rows.map(row => String(row.id)) : [];
    const excluded = Array.from(new Set([...config.excludedUsers.filter(value => !value.includes("@")), ...resolved]));
    const params = [start, end, excluded, config.passProductId, config.cvProductId];
    // Always bind all five parameters, even for queries without a product dimension.
    const base = `WITH bounds AS (SELECT $1::timestamptz started,$2::timestamptz ended,$3::text[] excluded,$4::text pass_product,$5::text cv_product),
      f AS (SELECT * FROM workcv_funnel_events,bounds WHERE created_at>=started AND created_at<ended AND NOT is_test
        AND NOT(coalesce(user_id,'')=ANY(excluded)) AND ${publicPath}),
      e AS (SELECT * FROM workcv_editor_events,bounds WHERE created_at>=started AND created_at<ended AND NOT(coalesce(user_id,'')=ANY(excluded))),
      o AS (SELECT * FROM workcv_orders,bounds WHERE paid_at>=started AND paid_at<ended AND NOT is_test AND amount_cents>0 AND NOT(coalesce(user_id,'')=ANY(excluded))),
      s AS (SELECT * FROM workcv_signup_events,bounds WHERE created_at>=started AND created_at<ended AND event_name='signup_completed' AND user_id IS NOT NULL AND NOT(user_id=ANY(excluded))),
      d AS (SELECT user_id,created_at FROM workcv_cv_documents,bounds WHERE created_at>=started AND created_at<ended AND NOT(coalesce(user_id,'')=ANY(excluded)))`;
    const query = async (sql: string) => rows((await client.query(base + sql, params)).rows);
    const summary = (await query(`SELECT
      (SELECT count(DISTINCT visitor_hash)::int FROM f WHERE event_name IN ('landing_view','page_view')) visitors,
      (SELECT count(DISTINCT session_hash)::int FROM f WHERE event_name IN ('landing_view','page_view')) sessions,
      (SELECT count(*)::int FROM f WHERE event_name='page_view') page_views,
      (SELECT count(*)::int FROM f WHERE event_name='marketing_cta_clicked') cta_clicks,
      (SELECT count(DISTINCT user_id)::int FROM s) signups,
      (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='editor_viewed') editor_users,
      (SELECT count(DISTINCT user_id)::int FROM d) cv_creators,
      (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='checkout_sheet_opened') checkout_users,
      (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='payment_started') payment_users,
      (SELECT count(*)::int FROM o) paid_orders,
      (SELECT count(*)::int FROM o WHERE product_id=pass_product) pass_orders,
      (SELECT coalesce(sum(amount_cents),0)::bigint FROM o WHERE upper(currency)='GBP') gbp_gross_minor,
      (SELECT count(DISTINCT session_hash)::int FROM f WHERE created_at>=$2::timestamptz-interval '15 minutes') active_sessions`))[0];
    const coverage = rows((await client.query(`SELECT
      (SELECT min(created_at) FROM workcv_funnel_events WHERE NOT is_test AND ${publicPath}) first_public_event,
      (SELECT max(created_at) FROM workcv_funnel_events WHERE NOT is_test AND ${publicPath}) latest_public_event,
      (SELECT max(created_at) FROM workcv_editor_events) latest_editor_event`)).rows)[0];
    const trends = await query(`, ticks AS (SELECT generate_series(date_trunc('${bucket}',$1::timestamptz),date_trunc('${bucket}',$2::timestamptz),interval '1 ${bucket}') bucket),
      visits AS (SELECT date_trunc('${bucket}',created_at) bucket,count(DISTINCT visitor_hash)::int visitors,count(*) FILTER(WHERE event_name='page_view')::int page_views FROM f WHERE event_name IN ('page_view','landing_view') GROUP BY 1),
      paid AS (SELECT date_trunc('${bucket}',paid_at) bucket,count(*)::int paid_orders,count(*) FILTER(WHERE product_id=pass_product)::int pass_orders FROM o GROUP BY 1)
      SELECT ticks.bucket,coalesce(visitors,0) visitors,coalesce(page_views,0) page_views,coalesce(paid_orders,0) paid_orders,coalesce(pass_orders,0) pass_orders
      FROM ticks LEFT JOIN visits USING(bucket) LEFT JOIN paid USING(bucket) ORDER BY bucket`);
    const sources = await query(`, entries AS (SELECT DISTINCT ON(session_hash) session_hash,visitor_hash,${source} source_label,coalesce(medium,'') medium,coalesce(campaign,'') campaign
      FROM f WHERE event_name IN ('landing_view','page_view') ORDER BY session_hash,created_at,id)
      SELECT source_label source,medium,campaign,count(*)::int sessions,count(DISTINCT visitor_hash)::int visitors FROM entries GROUP BY 1,2,3 ORDER BY sessions DESC,source LIMIT 100`);
    const sourceSales = await query(`SELECT
      coalesce(nullif(lower(attribution_source),''),nullif(lower(attribution_referrer_host),''),'direct_or_unknown') source,
      coalesce(attribution_medium,'') medium,coalesce(attribution_campaign,'') campaign,
      CASE WHEN attribution_captured_at IS NULL THEN 'not captured' ELSE 'checkout snapshot' END attribution,
      CASE WHEN product_id=pass_product THEN 'Job Pass' WHEN product_id=cv_product THEN 'Single CV' ELSE 'Other product' END plan,
      upper(coalesce(currency,'UNKNOWN')) currency,count(*)::int orders,sum(amount_cents)::bigint gross_minor
      FROM o GROUP BY 1,2,3,4,5,6 ORDER BY orders DESC,source LIMIT 100`);
    const pages = await query(`SELECT ${path} page,count(*) FILTER(WHERE event_name='page_view')::int views,
      count(DISTINCT visitor_hash) FILTER(WHERE event_name IN ('page_view','landing_view'))::int visitors,
      count(*) FILTER(WHERE event_name='marketing_cta_clicked')::int cta_clicks FROM f GROUP BY 1 ORDER BY views DESC,page LIMIT 50`);
    const devices = await query(`, entries AS (SELECT DISTINCT ON(session_hash) session_hash,device_class FROM f
      WHERE event_name IN ('page_view','landing_view') ORDER BY session_hash,created_at,id)
      SELECT device_class device,count(*)::int sessions FROM entries GROUP BY 1 ORDER BY sessions DESC`);
    // A common visitor cohort, not division of unrelated activity totals. Each
    // authenticated user is credited to at most one visitor; ambiguous links remain unknown.
    const cohort = await query(`, landings AS (SELECT DISTINCT ON(visitor_hash) visitor_hash,created_at entry_at FROM f WHERE event_name='landing_view' ORDER BY visitor_hash,created_at,id),
      candidates AS (SELECT l.*,links.n,CASE WHEN links.n=1 THEN links.user_id END user_id FROM landings l
        CROSS JOIN LATERAL (SELECT count(DISTINCT x.user_id)::int n,min(x.user_id) user_id FROM
          (SELECT user_id FROM f WHERE visitor_hash=l.visitor_hash AND user_id IS NOT NULL
           UNION SELECT id FROM workcv_users WHERE first_visitor_hash=l.visitor_hash AND NOT(id=ANY($3::text[]))) x) links),
      ranked AS (SELECT *,row_number() OVER(PARTITION BY user_id ORDER BY entry_at,visitor_hash) rn FROM candidates),
      journeys AS (SELECT *,CASE WHEN rn=1 THEN user_id END linked_user FROM ranked),
      milestones AS (SELECT *,
        EXISTS(SELECT 1 FROM f WHERE f.visitor_hash=j.visitor_hash AND f.created_at>=j.entry_at AND event_name='marketing_cta_clicked') cta,
        EXISTS(SELECT 1 FROM s WHERE s.user_id=j.linked_user AND s.created_at>=j.entry_at) signup,
        EXISTS(SELECT 1 FROM d WHERE d.user_id=j.linked_user AND d.created_at>=j.entry_at) cv,
        EXISTS(SELECT 1 FROM e WHERE e.user_id=j.linked_user AND e.created_at>=j.entry_at AND event_name='preview_ready') preview,
        EXISTS(SELECT 1 FROM e WHERE e.user_id=j.linked_user AND e.created_at>=j.entry_at AND event_name='checkout_sheet_opened') checkout,
        EXISTS(SELECT 1 FROM e WHERE e.user_id=j.linked_user AND e.created_at>=j.entry_at AND event_name='payment_started') payment,
        EXISTS(SELECT 1 FROM o WHERE o.user_id=j.linked_user AND o.paid_at>=j.entry_at) buyer
        FROM journeys j)
      SELECT count(*)::int visitors,count(*) FILTER(WHERE linked_user IS NOT NULL)::int linked_visitors,
        count(*) FILTER(WHERE n>1)::int ambiguous_visitors,count(*) FILTER(WHERE user_id IS NOT NULL AND rn>1)::int extra_browser_visitors,
        count(*) FILTER(WHERE cta)::int cta_visitors,count(*) FILTER(WHERE signup)::int signup_visitors,
        count(*) FILTER(WHERE cv)::int cv_visitors,count(*) FILTER(WHERE preview)::int preview_visitors,
        count(*) FILTER(WHERE checkout)::int checkout_visitors,count(*) FILTER(WHERE payment)::int payment_visitors,count(*) FILTER(WHERE buyer)::int buyer_visitors FROM milestones`);
    const plans = await query(`SELECT CASE WHEN product_id=pass_product THEN 'Job Pass' WHEN product_id=cv_product THEN 'Single CV' ELSE 'Other product' END plan,
      upper(coalesce(currency,'UNKNOWN')) currency,count(*)::int orders,sum(amount_cents)::bigint gross_minor,
      count(*) FILTER(WHERE refunded_at IS NOT NULL)::int refund_flags FROM o GROUP BY 1,2 ORDER BY orders DESC`);
    const passOffers = await query(`SELECT ${path} page,metadata->>'placement' placement,count(DISTINCT session_hash)::int exposed_sessions
      FROM f WHERE event_name='public_pass_offer_viewed' GROUP BY 1,2 ORDER BY exposed_sessions DESC LIMIT 50`);
    const planEvents = await query(`SELECT event_name event,coalesce(metadata->>'plan','unspecified') plan,count(*)::int events,count(DISTINCT user_id)::int users
      FROM e WHERE event_name IN ('editor_viewed','checkout_plan_selected','pass_offer_shown','pass_offer_clicked','upgrade_offer_shown','upgrade_offer_clicked','payment_started','payment_failed','payment_cancelled')
      GROUP BY 1,2 ORDER BY event,plan`);
    const checkout = await query(`SELECT event_name event,count(*)::int events,count(DISTINCT user_id)::int users FROM e
      WHERE event_name IN ('preview_ready','pdf_clicked','checkout_sheet_opened','payment_started','payment_failed','payment_cancelled','pdf_downloaded') GROUP BY 1 ORDER BY users DESC`);
    const orders = await query(`SELECT left(md5(id),10) order_ref,paid_at,
      CASE WHEN product_id=pass_product THEN 'Job Pass' WHEN product_id=cv_product THEN 'Single CV' ELSE 'Other product' END plan,
      upper(coalesce(currency,'UNKNOWN')) currency,amount_cents gross_minor,
      coalesce(nullif(attribution_source,''),nullif(attribution_referrer_host,''),'direct_or_unknown') source,
      refunded_at IS NOT NULL refund_flag FROM o ORDER BY paid_at DESC,id LIMIT 50`);
    const live = await query(`, latest AS (SELECT DISTINCT ON(session_hash) session_hash,${path} page,${source} source_label,device_class,created_at
      FROM f WHERE created_at>=$2::timestamptz-interval '15 minutes' ORDER BY session_hash,created_at DESC,id DESC)
      SELECT left(session_hash,10) session,page,source_label source,device_class device,created_at last_seen FROM latest ORDER BY created_at DESC LIMIT 50`);
    const journeys = await query(`, recent_sessions AS (SELECT session_hash,max(created_at) last_seen FROM f GROUP BY 1 ORDER BY last_seen DESC LIMIT 20),
      ranked AS (SELECT f.*,row_number() OVER(PARTITION BY f.session_hash ORDER BY f.created_at DESC,f.id DESC) event_rank FROM f JOIN recent_sessions USING(session_hash))
      SELECT left(session_hash,10) session,created_at occurred_at,event_name event,${path} page,${source} source,
      left(coalesce(metadata->>'placement',''),80) placement FROM ranked WHERE event_rank<=12 ORDER BY created_at DESC,id DESC`);
    const editorActivity = await query(`SELECT left(md5(user_id),10) account,event_name event,created_at occurred_at,
      CASE WHEN metadata->>'plan' IN ('cv','pass') THEN metadata->>'plan' ELSE '' END plan FROM e ORDER BY created_at DESC,id DESC LIMIT 50`);
    const tools = await query(`SELECT coalesce(metadata->>'tool','unspecified') tool,event_name event,count(*)::int events,count(DISTINCT session_hash)::int sessions
      FROM f WHERE event_name IN ('tool_started','tool_completed') GROUP BY 1,2 ORDER BY sessions DESC LIMIT 50`);
    const ctas = await query(`SELECT ${path} page,coalesce(metadata->>'placement','unlabelled') placement,count(*)::int clicks,count(DISTINCT session_hash)::int sessions
      FROM f WHERE event_name='marketing_cta_clicked' GROUP BY 1,2 ORDER BY clicks DESC LIMIT 50`);
    const quality = (await query(`SELECT
      (SELECT count(*)::int FROM workcv_funnel_events WHERE created_at>=$1 AND created_at<$2 AND is_test) excluded_test_events,
      (SELECT count(*)::int FROM workcv_orders WHERE paid_at>=$1 AND paid_at<$2 AND (is_test OR coalesce(user_id,'')=ANY($3::text[]))) excluded_orders,
      (SELECT count(*)::int FROM o WHERE attribution_captured_at IS NULL) orders_without_snapshot,
      (SELECT count(*)::int FROM o WHERE user_id IS NULL) orders_without_user,
      (SELECT count(*)::int FROM workcv_orders WHERE paid_at>=$1 AND paid_at<$2 AND coalesce(amount_cents,0)<=0) zero_value_orders`))[0];
    await client.query("COMMIT");
    return { generatedAt: end.toISOString(),start: start.toISOString(),range: config.range,ingestEnabled: config.ingestEnabled,exclusions: excluded.length,
      summary,coverage,trends,sources,sourceSales,pages,devices,cohort,plans,passOffers,planEvents,checkout,orders,live,journeys,editorActivity,tools,ctas,quality };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
