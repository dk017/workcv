// Standalone: streamed to Node inside the production container. Never logs plaintext.
import { createPublicKey, publicEncrypt, randomBytes, createCipheriv } from "node:crypto";

export function encryptSnapshot(snapshot, publicKeyBase64) {
  const key = createPublicKey(Buffer.from(publicKeyBase64, "base64").toString("utf8"));
  if (key.asymmetricKeyType !== "rsa" || key.asymmetricKeyDetails.modulusLength < 3072) {
    throw new Error("A 3072-bit or stronger RSA public key is required");
  }
  const secret = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret, iv);
  cipher.setAAD(Buffer.from("workcv-growth-v1"));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(snapshot), "utf8"), cipher.final()]);
  return Buffer.from(JSON.stringify({
    version: 1,
    key: publicEncrypt({ key, oaepHash: "sha256" }, secret).toString("base64"),
    iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  })).toString("base64");
}

const publicPath = `(path ~ '^/' AND path !~ '^/(login|editor|my-cvs|cv-pdf|api)(/|$)')`;
const sourceSql = `CASE
  WHEN lower(coalesce(medium_value,'')) IN ('cpc','ppc','paid','paid_search','paid_social','display','affiliate') THEN 'paid_or_affiliate_tagged'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'chatgpt|openai' THEN 'chatgpt'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'brave' THEN 'brave'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'claude|anthropic' THEN 'claude'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'gemini|bard' THEN 'gemini'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'perplexity' THEN 'perplexity'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'copilot' THEN 'copilot'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'bing' THEN 'bing'
  WHEN lower(coalesce(source_value,'') || ' ' || coalesce(host_value,'')) ~ 'google' THEN 'google'
  WHEN coalesce(source_value,'') IN ('','direct','direct_or_unknown') AND coalesce(host_value,'')='' THEN 'direct_or_unknown'
  ELSE 'other_referral_or_tagged' END`;
const safePath = (expression) => `CASE WHEN split_part(coalesce(${expression},''),'?',1) ~ '^/[a-zA-Z0-9/_-]*$'
  AND ${expression} !~ '^/(login|editor|my-cvs|cv-pdf|api)(/|$)' THEN left(split_part(${expression},'?',1),160) ELSE '(unknown public landing)' END`;

export async function collectSnapshot(client, environment = process.env) {
  // A single connection and snapshot prevent inconsistent totals during a payment.
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  try {
    await client.query("SET LOCAL statement_timeout = '20s'");
    await client.query("SET LOCAL lock_timeout = '2s'");
    await client.query("SET LOCAL TIME ZONE 'UTC'");
    const end = (await client.query("SELECT NOW() AS at")).rows[0].at;
    // Entries are user IDs or sign-in emails; emails resolve to IDs here and
    // never leave the database.
    const testEntries = (environment.WORKCV_TEST_USER_IDS || "").split(",").map(x => x.trim()).filter(Boolean);
    const testEmails = testEntries.filter(x => x.includes("@")).map(x => x.toLowerCase());
    const emailUserIds = testEmails.length
      ? (await client.query("SELECT id FROM workcv_users WHERE lower(email) = ANY($1::text[])", [testEmails])).rows.map(row => row.id)
      : [];
    const testUsers = [...new Set([...testEntries.filter(x => !x.includes("@")), ...emailUserIds])];
    const report = { version: 1, request_id: environment.WORKCV_REPORT_ID, generated_at: end,
      timezone: "UTC", windows: [], notes: [
        "Rolling 7/30-day windows share one database snapshot; final day is partial.",
        "Activity totals have different units. They are not step-to-step conversion rates.",
        "Visitor milestones use one observed public visitor cohort; milestones are independent, not a mandatory sequence.",
        "A user is assigned to at most one visitor per window. Ambiguous and extra browser identities remain unlinked.",
        "These are observed first-party visits, not all traffic. Blocked tracking, bots, deleted documents and historical tracking gaps can affect counts.",
        "Sources are recorded attribution, not causal proof. Untagged paid traffic cannot be identified; direct/unknown is not assumed organic.",
        "Revenue is gross recorded paid-order value, not net of refunds, fees or tax. Excludes test/operator and zero-value orders.",
        "Recent visitors have less time to convert. Compare equally matured cohorts before declaring improvement.",
      ] };
    report.coverage = (await client.query(`SELECT
      (SELECT min(created_at) FROM workcv_funnel_events WHERE NOT is_test) first_public_event,
      (SELECT max(created_at) FROM workcv_funnel_events WHERE NOT is_test) latest_public_event,
      (SELECT min(created_at) FROM workcv_editor_events) first_editor_event,
      (SELECT max(created_at) FROM workcv_editor_events) latest_editor_event`)).rows[0];
    report.coverage.ingest_enabled = environment.WORKCV_FUNNEL_INGEST_ENABLED === "true";
    report.coverage.configured_test_users = testUsers.length;
    for (const days of [7, 30]) {
      const start = new Date(new Date(end).getTime() - days * 86400000);
      const params = [start, end, testUsers];
      const base = `WITH f AS (
        SELECT * FROM workcv_funnel_events WHERE created_at >= $1 AND created_at < $2 AND NOT is_test
          AND NOT (coalesce(user_id,'') = ANY($3::text[]))
      ), e AS (
        SELECT * FROM workcv_editor_events WHERE created_at >= $1 AND created_at < $2
          AND NOT (coalesce(user_id,'') = ANY($3::text[]))
      ), o AS (
        SELECT * FROM workcv_orders WHERE paid_at >= $1 AND paid_at < $2 AND NOT is_test AND amount_cents > 0
          AND NOT (coalesce(user_id,'') = ANY($3::text[]))
      ), d AS (
        SELECT user_id,created_at FROM workcv_cv_documents WHERE created_at >= $1 AND created_at < $2
          AND NOT (user_id = ANY($3::text[]))
      ), s AS (
        SELECT user_id,created_at FROM workcv_signup_events WHERE created_at >= $1 AND created_at < $2
          AND event_name='signup_completed' AND user_id IS NOT NULL AND NOT (user_id = ANY($3::text[]))
      )`;
      const query = async sql => (await client.query(base + sql, params)).rows;
      const activity = (await query(`SELECT
        (SELECT count(DISTINCT session_hash)::int FROM f WHERE event_name='landing_view' AND ${publicPath}) public_sessions,
        (SELECT count(DISTINCT visitor_hash)::int FROM f WHERE event_name='landing_view' AND ${publicPath}) public_visitors,
        (SELECT count(DISTINCT session_hash)::int FROM f WHERE event_name='marketing_cta_clicked') cta_sessions,
        (SELECT count(DISTINCT session_hash)::int FROM f WHERE event_name='login_started') login_start_sessions,
        (SELECT count(DISTINCT user_id)::int FROM s) new_users,
        (SELECT count(DISTINCT user_id)::int FROM d) cv_creators,
        (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='preview_ready') preview_users,
        (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='pdf_clicked') pdf_intent_users,
        (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='checkout_sheet_opened') checkout_users,
        (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='payment_started') payment_start_users,
        (SELECT count(*)::int FROM o) paid_orders,
        (SELECT count(DISTINCT user_id)::int FROM o) buyers_with_user_id,
        (SELECT count(DISTINCT user_id)::int FROM e WHERE event_name='pdf_downloaded') pdf_download_users`))[0];
      const cohort = await query(`, landings AS (
        SELECT DISTINCT ON (visitor_hash) visitor_hash,created_at entry_at,path,source_normalized,medium,referrer_host
        FROM f WHERE event_name='landing_view' AND ${publicPath} ORDER BY visitor_hash,created_at,id
      ), candidates AS (
        SELECT l.*, links.user_id,links.identities FROM landings l
        LEFT JOIN LATERAL (
          SELECT CASE WHEN count(DISTINCT user_id)=1 THEN min(user_id) END user_id,count(DISTINCT user_id)::int identities
          FROM (
            SELECT user_id FROM workcv_funnel_events WHERE visitor_hash=l.visitor_hash AND created_at<$2 AND NOT is_test AND user_id IS NOT NULL
            UNION SELECT id FROM workcv_users WHERE first_visitor_hash=l.visitor_hash AND created_at<$2
          ) linked WHERE NOT (user_id = ANY($3::text[]))
        ) links ON true
      ), ranked AS (
        SELECT *,row_number() OVER (PARTITION BY user_id ORDER BY entry_at,visitor_hash) user_rank FROM candidates
      ), journeys AS (
        SELECT *,CASE WHEN user_rank=1 THEN user_id END linked_user FROM ranked
      ), milestones AS (
        SELECT ${sourceSql} source,${safePath("j.path")} landing_path,
          linked_user IS NOT NULL linked,identities>1 ambiguous,
          user_id IS NOT NULL AND user_rank>1 extra_browser,
          EXISTS(SELECT 1 FROM f WHERE visitor_hash=j.visitor_hash AND event_name='marketing_cta_clicked' AND created_at>=entry_at) cta,
          EXISTS(SELECT 1 FROM f WHERE visitor_hash=j.visitor_hash AND event_name='login_started' AND created_at>=entry_at) login,
          EXISTS(SELECT 1 FROM s WHERE user_id=linked_user AND created_at>=entry_at) signup,
          EXISTS(SELECT 1 FROM d WHERE user_id=linked_user AND created_at>=entry_at) activated,
          EXISTS(SELECT 1 FROM e WHERE user_id=linked_user AND event_name='preview_ready' AND created_at>=entry_at) preview,
          EXISTS(SELECT 1 FROM e WHERE user_id=linked_user AND event_name='checkout_sheet_opened' AND created_at>=entry_at) checkout,
          EXISTS(SELECT 1 FROM e WHERE user_id=linked_user AND event_name='payment_started' AND created_at>=entry_at) payment,
          EXISTS(SELECT 1 FROM o WHERE user_id=linked_user AND paid_at>=entry_at) buyer,
          EXISTS(SELECT 1 FROM e WHERE user_id=linked_user AND event_name='pdf_downloaded' AND created_at>=entry_at) downloaded
        FROM journeys j CROSS JOIN LATERAL (SELECT source_normalized source_value,medium medium_value,referrer_host host_value) raw
      ) SELECT source,landing_path,count(*)::int visitors,
        count(*) FILTER(WHERE linked)::int linked_visitors,count(*) FILTER(WHERE ambiguous)::int ambiguous_visitors,
        count(*) FILTER(WHERE extra_browser)::int extra_browser_visitors,
        count(*) FILTER(WHERE cta)::int cta_visitors,count(*) FILTER(WHERE login)::int login_visitors,
        count(*) FILTER(WHERE signup)::int signup_visitors,count(*) FILTER(WHERE activated)::int cv_visitors,
        count(*) FILTER(WHERE preview)::int preview_visitors,count(*) FILTER(WHERE checkout)::int checkout_visitors,
        count(*) FILTER(WHERE payment)::int payment_visitors,count(*) FILTER(WHERE buyer)::int buyer_visitors,
        count(*) FILTER(WHERE downloaded)::int download_visitors
      FROM milestones GROUP BY source,landing_path ORDER BY visitors DESC,source,landing_path`);
      const revenue = await query(`SELECT upper(coalesce(currency,'UNKNOWN')) currency,count(*)::int paid_orders,
        sum(amount_cents)::bigint gross_minor_units FROM o GROUP BY 1 ORDER BY 1`);
      const sales = await query(`, attributed AS (
        SELECT o.amount_cents,upper(coalesce(o.currency,'UNKNOWN')) currency,${sourceSql} source,
          ${safePath("CASE WHEN o.attribution_captured_at IS NOT NULL THEN o.attribution_landing_path ELSE u.last_landing_path END")} landing_path,
          CASE WHEN o.attribution_captured_at IS NOT NULL THEN 'checkout_snapshot' ELSE 'legacy_profile_fallback' END attribution_basis
        FROM o LEFT JOIN workcv_users u ON u.id=o.user_id
        CROSS JOIN LATERAL (SELECT
          CASE WHEN o.attribution_captured_at IS NOT NULL THEN o.attribution_source ELSE u.last_utm_source END source_value,
          CASE WHEN o.attribution_captured_at IS NOT NULL THEN o.attribution_medium ELSE u.last_utm_medium END medium_value,
          CASE WHEN o.attribution_captured_at IS NOT NULL THEN o.attribution_referrer_host ELSE u.last_referrer_host END host_value
        ) raw
      ) SELECT source,landing_path,attribution_basis,currency,count(*)::int orders,sum(amount_cents)::bigint gross_minor_units
      FROM attributed GROUP BY 1,2,3,4 ORDER BY orders DESC,source,landing_path`);
      const tools = await query(`SELECT metadata->>'tool' tool,event_name,metadata->>'result' result,
        metadata->>'placement' placement,count(*)::int events,count(DISTINCT session_hash)::int sessions
        FROM f WHERE event_name IN ('tool_started','tool_completed') GROUP BY 1,2,3,4 ORDER BY 1,2,3,4`);
      // Fixed-choice answers only; the ingest route rejects anything else.
      const answers = await query(`SELECT event_name question,
        coalesce(metadata->>'purpose',metadata->>'volume','dismissed') answer,
        count(DISTINCT coalesce(document_id,user_id))::int cvs
        FROM e WHERE event_name IN ('cv_purpose_selected','cv_application_volume_selected','cv_purpose_dismissed')
        GROUP BY 1,2 ORDER BY 1,3 DESC`);
      const ctas = await query(`SELECT coalesce(metadata->>'placement','unlabelled') placement,
        count(*)::int clicks,count(DISTINCT session_hash)::int sessions
        FROM f WHERE event_name='marketing_cta_clicked' GROUP BY 1 ORDER BY sessions DESC,placement`);
      const quality = (await client.query(`SELECT
        (SELECT count(*)::int FROM workcv_funnel_events WHERE created_at >= $1 AND created_at < $2 AND is_test) test_events_excluded,
        (SELECT count(*)::int FROM workcv_orders WHERE paid_at >= $1 AND paid_at < $2 AND (is_test OR coalesce(user_id,'')=ANY($3::text[]))) test_operator_orders_excluded,
        (SELECT count(*)::int FROM workcv_orders WHERE paid_at >= $1 AND paid_at < $2 AND coalesce(amount_cents,0)<=0) zero_value_orders,
        (SELECT count(*)::int FROM workcv_orders WHERE paid_at >= $1 AND paid_at < $2 AND NOT is_test AND amount_cents>0 AND user_id IS NULL) paid_orders_without_user`, params)).rows[0];
      report.windows.push({ days,start,end,activity,revenue,cohort,sales,tools,answers,ctas,quality });
    }
    await client.query("COMMIT");
    return report;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

if (process.env.WORKCV_REPORT_EXECUTE === "1") {
  let client;
  try {
    // Validate the recipient before touching the database; only public key leaves the laptop.
    encryptSnapshot({}, process.env.WORKCV_REPORT_PUBLIC_KEY || "");
    if (!/^[a-f0-9-]{36}$/.test(process.env.WORKCV_REPORT_ID || "")) throw new Error("Invalid request ID");
    const { default: pg } = await import("pg");
    client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
    await client.connect();
    const report = await collectSnapshot(client);
    const chunks = encryptSnapshot(report, process.env.WORKCV_REPORT_PUBLIC_KEY).match(/.{1,3000}/g);
    chunks.forEach((chunk, index) => console.log(`WORKCV_GROWTH_CHUNK:${index + 1}/${chunks.length}:${chunk}`));
  } catch (error) {
    // Do not send SQL, credentials or report contents into public CI logs.
    console.error("WORKCV_GROWTH_FAILED:" + (/^[A-Z0-9]{5}$/.test(error.code || "") ? error.code : "REPORT_ERROR"));
    process.exitCode = 1;
  } finally {
    if (client) await client.end();
  }
}
