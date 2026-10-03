import Link from "next/link";
import { Activity, ArrowUpRight, BarChart3, CreditCard, Eye, Globe2, Layers3, MousePointer2, Ticket, Users } from "lucide-react";
import type { AnalyticsRange, AnalyticsView } from "@/lib/admin-access";
import type { AnalyticsReport, AnalyticsRow } from "@/lib/admin-analytics-query";
import { AnalyticsRefresh } from "@/app/admin/analytics/refresh";
import styles from "./analytics-dashboard.module.css";

const views = [
  { id: "overview", label: "Overview", icon: BarChart3, description: "Traffic, revenue and the signals worth checking." },
  { id: "live", label: "Live activity", icon: Activity, description: "Recently active sessions and the pages they explored." },
  { id: "acquisition", label: "Acquisition", icon: Globe2, description: "Understand where visitors come from and which sources lead to sales." },
  { id: "conversion", label: "Conversion", icon: MousePointer2, description: "Follow observed visitors from arrival to product use and purchase." },
  { id: "checkout", label: "Checkout & sales", icon: CreditCard, description: "Payment activity, confirmed orders and revenue by plan." },
  { id: "pass", label: "Job Pass", icon: Ticket, description: "Offer visibility, plan interest and paid Job Search Pass orders." },
  { id: "activity", label: "Pages & tools", icon: Layers3, description: "See which resources visitors use and where they take action." },
] as const;
const ranges = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days" };
const href = (view: string, range: string) => `/admin/analytics?view=${view}&range=${range}`;
const n = (value: unknown) => Number(value || 0);
const number = (value: unknown) => new Intl.NumberFormat("en-GB").format(n(value));
function money(value: unknown, currency = "GBP") {
  if (!/^[A-Z]{3}$/.test(currency) || currency === "UNKNOWN") return `${number(value)} minor units (${currency})`;
  try { const formatter = new Intl.NumberFormat("en-GB", { style: "currency", currency }); return formatter.format(n(value) / 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2)); }
  catch { return `${number(value)} minor units (${currency})`; }
}
function date(value: unknown, short = false) {
  if (!value) return "Not recorded";
  const parsed = new Date(String(value));
  if (!Number.isFinite(parsed.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", ...(short ? {} : { hour: "2-digit", minute: "2-digit" }) }).format(parsed);
}
const label = (value: string) => value.replaceAll("_", " ");
function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className={styles.panel}><div className={styles.panelHeader}><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</section>;
}
function Table({ title, description, rows, columns }: { title: string; description?: string; rows: AnalyticsRow[]; columns: [string, string][] }) {
  return <Panel title={title} description={description}>{!rows.length ? <div className={styles.empty}>No recorded activity in this period.</div> : <div className={styles.scroll} tabIndex={0} role="region" aria-label={title}><table className={styles.table}><thead><tr>{columns.map(([key, name]) => <th key={key} scope="col">{name}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{columns.map(([key]) => {
    const value = row[key];
    const text = key.endsWith("_at") || key === "last_seen" ? date(value) : key === "gross_minor" ? money(value, String(row.currency || "GBP")) : typeof value === "boolean" ? value ? "Yes" : "No" : value === null || value === "" ? "—" : typeof value === "number" ? number(value) : String(value);
    return <td key={key} title={text}>{text}</td>;
  })}</tr>)}</tbody></table></div>}</Panel>;
}
function Cards({ items }: { items: { title: string; value: string; note: string; accent?: boolean }[] }) {
  return <div className={styles.cards}>{items.map((item, index) => { const Icon = [Users, Eye, CreditCard, Ticket][index % 4]; return <section key={item.title} className={`${styles.card} ${item.accent ? styles.cardAccent : ""}`}><div className={styles.cardLabel}>{item.title}<Icon size={16} /></div><strong>{item.value}</strong><small>{item.note}</small></section>; })}</div>;
}
function Chart({ rows, primary, secondary, title, firstLabel, secondLabel }: { rows: AnalyticsRow[]; primary: string; secondary: string; title: string; firstLabel: string; secondLabel: string }) {
  const max = Math.max(1, ...rows.flatMap(row => [n(row[primary]), n(row[secondary])]));
  const point = (value: number, index: number) => `${10 + index * 580 / Math.max(1, rows.length - 1)},${150 - value / max * 125}`;
  return <Panel title={title} description="Buckets follow UTC; displayed timestamps are IST. First and last buckets may be partial."><div className={styles.chart}><div className={styles.legend}><span>{firstLabel}</span><span>{secondLabel}</span></div>
    <svg viewBox="0 0 600 165" role="img" aria-label={`${title}. Maximum plotted value ${max}.`} preserveAspectRatio="none">
      {[25, 87.5, 150].map(y => <line key={y} x1="10" x2="590" y1={y} y2={y} stroke="#edf0f5" />)}
      <polyline fill="none" stroke="#9eaac0" strokeWidth="2" points={rows.map((row, index) => point(n(row[secondary]), index)).join(" ")} />
      <polyline fill="none" stroke="#176d65" strokeWidth="2.5" points={rows.map((row, index) => point(n(row[primary]), index)).join(" ")} />
      {rows.map((row, index) => <circle key={index} cx={10 + index * 580 / Math.max(1, rows.length - 1)} cy={150 - n(row[primary]) / max * 125} r="3" fill="#176d65"><title>{`${date(row.bucket)}: ${firstLabel} ${number(row[primary])}; ${secondLabel} ${number(row[secondary])}`}</title></circle>)}
    </svg><div className={styles.chartLabels}><span>{date(rows[0]?.bucket)}</span><span>Peak {number(max)}</span><span>{date(rows.at(-1)?.bucket)}</span></div></div></Panel>;
}
function Bars({ title, description, items }: { title: string; description: string; items: [string, number][] }) {
  const max = Math.max(1, ...items.map(([, count]) => count));
  return <Panel title={title} description={description}><div className={styles.bars}>{items.map(([name, count]) => <div key={name}><div className={styles.barLabel}><span>{name}</span><strong>{number(count)}</strong></div><div className={styles.track}><div className={styles.fill} style={{ width: `${count / max * 100}%` }} /></div></div>)}</div></Panel>;
}
function Journeys({ rows }: { rows: AnalyticsRow[] }) {
  const sessions = Array.from(new Set(rows.map(row => String(row.session))));
  return <Panel title="Recent session journeys" description="Latest 20 observed sessions; up to 12 public events each. Pseudonymous IDs, no CV text or customer emails.">{!sessions.length ? <div className={styles.empty}>Journeys appear when visitors use public pages.</div> : <div className={styles.timeline}>{sessions.map(session => {
    const events = rows.filter(row => row.session === session);
    return <details key={session}><summary>Session {session}<span>{events[0].source} · {events.length} recent events · {date(events[0].occurred_at)}</span></summary><ol>{[...events].reverse().map((event, index) => <li key={index}><strong>{label(String(event.event))}</strong> · {event.page}<br /><small>{date(event.occurred_at)}{event.placement ? ` · ${event.placement}` : ""}</small></li>)}</ol></details>;
  })}</div>}</Panel>;
}
function Insights({ report }: { report: AnalyticsReport }) {
  const s = report.summary;
  const notes: [string, string][] = [];
  const unknown = report.sources.filter(row => row.source === "direct_or_unknown").reduce((sum, row) => sum + n(row.sessions), 0);
  if (!report.ingestEnabled) notes.push(["Public tracking is disabled", "Enable the configured event ingestion before interpreting traffic totals."]);
  if (unknown) notes.push([`${number(unknown)} sessions have no recorded source`, "Tag links where permitted. Direct / unknown traffic is not automatically organic search."]);
  if (!n(s.pass_orders)) notes.push(["No Job Pass purchases recorded in this period", "Check offer exposure and plan-specific checkout activity before concluding that price is the problem."]);
  const failures = report.planEvents.filter(row => row.event === "payment_failed").reduce((sum, row) => sum + n(row.events), 0);
  if (failures) notes.push([`${number(failures)} payment-failure events`, "Inspect checkout activity. Events can repeat for the same customer and do not all represent lost sales."]);
  if (n(report.quality.orders_without_snapshot)) notes.push(["Some orders have no checkout attribution", "Those orders remain unattributed. Their source is not reconstructed from a later customer profile."]);
  if (!notes.length) notes.push(["Compare results over complete periods", "Use source, page and plan views to investigate changes. A small number of orders is not enough to establish a trend."]);
  return <Panel title="Worth checking" description="Observations from this period, not automated causal claims."><div className={styles.insights}>{notes.slice(0,4).map(([title,text]) => <div className={styles.insight} key={title}><strong>{title}</strong><p>{text}</p></div>)}</div></Panel>;
}

export function AnalyticsDashboard({ report, range, view }: { report: AnalyticsReport | null; range: AnalyticsRange; view: AnalyticsView }) {
  const selected = views.find(item => item.id === view)!;
  const s = report?.summary || {};
  const cohort = report?.cohort[0] || {};
  const milestones: [string, number][] = [["Observed landing visitors",n(cohort.visitors)],["Clicked a CTA",n(cohort.cta_visitors)],["Created a CV",n(cohort.cv_visitors)],["Opened checkout",n(cohort.checkout_visitors)],["Purchased",n(cohort.buyer_visitors)]];
  return <div className={styles.dashboard}>
    <header className={styles.topbar}><div className={styles.brand}><span>W</span>WorkCV<small>Analytics</small></div><a href="/my-cvs" className="flex items-center gap-2">Back to WorkCV <ArrowUpRight size={15} /></a></header>
    <div className={styles.body}><aside className={styles.sidebar}><p className={styles.eyebrow}>Workspace</p><nav className={styles.nav} aria-label="Analytics views">{views.map(({id,label: name,icon: Icon}) => <Link prefetch={false} key={id} href={href(id,range)} aria-current={view===id ? "page" : undefined}><Icon size={18} />{name}</Link>)}</nav><p className={styles.sidebarNote}>Private dashboard<br />WorkCV site data<br />Admin access only</p></aside>
    <div className={styles.content}><div className={styles.heading}><div><h1>{selected.label}</h1><p>{selected.description}</p></div>{report && <span className={styles.status}><span className={styles.liveDot} />{number(s.active_sessions)} recently active sessions</span>}</div>
      <div className={styles.controls}><nav className={styles.ranges} aria-label="Analytics date range">{Object.entries(ranges).map(([key,name]) => <Link prefetch={false} key={key} href={href(view,key)} aria-current={range===key ? "page" : undefined}>{name}</Link>)}</nav><AnalyticsRefresh /></div>
      {!report ? <div className={styles.notice} role="alert"><strong>Analytics is temporarily unavailable.</strong><br />The database could not provide a complete report. No partial or sample figures are shown. Refresh to retry; if this continues, check database availability and the growth schema.</div> : <>
      {!report.ingestEnabled && <div className={styles.notice}>Public event ingestion is disabled. Traffic figures may be incomplete even while orders continue to be recorded.</div>}
      <p className={styles.muted}>{date(report.start)} – {date(report.generatedAt)} · Asia/Kolkata (IST) · Updated {date(report.generatedAt)}</p>
      {view === "overview" && <>
        <Cards items={[{title:"Visitors",value:number(s.visitors),note:`${number(s.sessions)} observed sessions`},{title:"New accounts",value:number(s.signups),note:`${number(s.cv_creators)} people created a CV`},{title:"Gross revenue · GBP",value:money(s.gbp_gross_minor),note:`${number(s.paid_orders)} orders across all currencies`,accent:true},{title:"Job Pass orders",value:number(s.pass_orders),note:"Confirmed positive paid orders",accent:true}]} />
        <div className={styles.grid}><Chart rows={report.trends} title="Visitor trend" primary="visitors" secondary="page_views" firstLabel="Visitors" secondLabel="Page views" /><Chart rows={report.trends} title="Order trend" primary="paid_orders" secondary="pass_orders" firstLabel="All paid orders" secondLabel="Job Pass orders" /></div>
        <div className={styles.grid}><Insights report={report} /><Bars title="Visitor milestones" description="The same landing cohort. Milestones are independent and can be skipped; not a sequential conversion rate." items={milestones} /></div>
        <div className={styles.grid}><Table title="Leading traffic sources" rows={report.sources.slice(0,8)} columns={[["source","Source"],["sessions","Sessions"],["campaign","Campaign"]]} /><Table title="Most viewed pages" rows={report.pages.slice(0,8)} columns={[["page","Page"],["views","Views"],["cta_clicks","CTA clicks"]]} /></div>
      </>}
      {view === "live" && <>
        <Cards items={[{title:"Recently active",value:number(s.active_sessions),note:"Public activity in the last 15 minutes",accent:true},{title:"Sessions in period",value:number(s.sessions),note:"Observed on public pages"},{title:"Page views",value:number(s.page_views),note:"Repeated page visits count"},{title:"Editor users",value:number(s.editor_users),note:"Signed-in users with a recorded view"}]} />
        <Table title="Recently active sessions" description="Last observed public page, not a presence heartbeat. Up to 50 sessions. Location is not collected." rows={report.live} columns={[["session","Session"],["page","Last public page"],["source","Source"],["device","Device"],["last_seen","Last seen · IST"]]} />
        <Journeys rows={report.journeys} /><Table title="Recent editor activity" description="Separate account-level activity; not assumed to belong to a particular browser session." rows={report.editorActivity} columns={[["account","Account reference"],["event","Event"],["plan","Plan"],["occurred_at","Time · IST"]]} />
      </>}
      {view === "acquisition" && <>
        <Table title="Traffic sources & campaigns" description="First observed public event per session in the selected period. Publisher domains and UTM sources stay distinct. Top 100 combinations." rows={report.sources} columns={[["source","Source / referrer"],["medium","Medium"],["campaign","Campaign"],["sessions","Sessions"],["visitors","Visitors"]]} />
        <Table title="Revenue by checkout attribution" description="The source saved when checkout started, not a causal claim or the same population as traffic above. Gross revenue; currencies remain separate." rows={report.sourceSales} columns={[["source","Source"],["medium","Medium"],["campaign","Campaign"],["plan","Plan"],["orders","Orders"],["gross_minor","Gross revenue"],["attribution","Attribution basis"]]} />
        <div className={styles.grid}><Table title="Landing and visited pages" rows={report.pages} columns={[["page","Page"],["views","Views"],["visitors","Visitors"],["cta_clicks","CTA clicks"]]} /><Bars title="Devices" description="Device at the first observed page event in each session." items={report.devices.map(row => [String(row.device),n(row.sessions)])} /></div>
      </>}
      {view === "conversion" && <>
        <Cards items={[{title:"Landing cohort",value:number(cohort.visitors),note:"Visitors with a landing in this period"},{title:"Linked to an account",value:number(cohort.linked_visitors),note:"Unique, unambiguous account links"},{title:"Linked buyers",value:number(cohort.buyer_visitors),note:"Purchased after their observed landing"},{title:"Observed buyer rate",value:n(cohort.visitors) ? `${(n(cohort.buyer_visitors)/n(cohort.visitors)*100).toFixed(1)}%` : "—",note:"Linked buyers / landing visitors",accent:true}]} />
        <div className={styles.grid}><Bars title="Same-cohort milestones" description="Includes returning users. Each milestone is after arrival; the stages are not a required sequence." items={[...milestones.slice(0,2),["Signed up",n(cohort.signup_visitors)],milestones[2],["Preview ready",n(cohort.preview_visitors)],milestones[3],["Started payment",n(cohort.payment_visitors)],milestones[4]]} /><Table title="Activity totals" description="Independent populations: do not divide these rows into a conversion funnel." rows={[{stage:"New accounts",users:s.signups},{stage:"CV creators",users:s.cv_creators},{stage:"Editor views",users:s.editor_users},{stage:"Checkout users",users:s.checkout_users},{stage:"Payment starters",users:s.payment_users}]} columns={[["stage","Activity"],["users","Users"]]} /></div>
        <p className={styles.muted}>{number(cohort.ambiguous_visitors)} ambiguous visitor links and {number(cohort.extra_browser_visitors)} extra browser identities were not given duplicate account credit. Unlinked activity and recent visitors with less time to convert limit this rate.</p>
        <Table title="Calls to action" rows={report.ctas} columns={[["page","Page"],["placement","Placement"],["clicks","Clicks"],["sessions","Sessions"]]} />
      </>}
      {view === "checkout" && <>
        <Cards items={[{title:"Checkout users",value:number(s.checkout_users),note:"Opened the checkout sheet"},{title:"Payment starters",value:number(s.payment_users),note:"Recorded payment-start event"},{title:"Paid orders",value:number(s.paid_orders),note:"Positive orders; tests excluded",accent:true},{title:"Gross revenue · GBP",value:money(s.gbp_gross_minor),note:"Before fees, refunds and tax",accent:true}]} />
        <div className={styles.grid}><Table title="Revenue by plan" rows={report.plans} columns={[["plan","Plan"],["currency","Currency"],["orders","Orders"],["gross_minor","Gross revenue"],["refund_flags","Refund flags"]]} /><Table title="Checkout & download events" description="Events can repeat. Unique users are counted separately for each event." rows={report.checkout} columns={[["event","Event"],["events","Events"],["users","Users"]]} /></div>
        <Table title="Recent confirmed orders" description="Latest 50 positive orders in this period. Refund flags do not quantify partial refunds or net revenue." rows={report.orders} columns={[["order_ref","Order reference"],["paid_at","Paid · IST"],["plan","Plan"],["gross_minor","Gross amount"],["source","Checkout source"],["refund_flag","Refund flagged"]]} />
        <Table title="Plan and payment diagnostics" rows={report.planEvents} columns={[["event","Event"],["plan","Plan"],["events","Events"],["users","Users"]]} />
      </>}
      {view === "pass" && <>
        <Cards items={[{title:"Job Pass orders",value:number(s.pass_orders),note:"Positive confirmed orders",accent:true},{title:"GBP Pass revenue",value:money(report.plans.filter(row => row.plan==="Job Pass"&&row.currency==="GBP").reduce((sum,row)=>sum+n(row.gross_minor),0)),note:"Gross; before refunds, fees and tax",accent:true},{title:"Pass payment starters",value:number(report.planEvents.find(row=>row.event==="payment_started"&&row.plan==="pass")?.users),note:"Unique signed-in users"},{title:"Pass selection events",value:number(report.planEvents.find(row=>row.event==="checkout_plan_selected"&&row.plan==="pass")?.events),note:"Includes repeated selections"}]} />
        <Table title="Where the Pass price was seen" description="Price block at least half visible for one second. Sessions can appear at multiple placements; do not sum as unique visitors." rows={report.passOffers} columns={[["page","Page"],["placement","Placement"],["exposed_sessions","Exposed sessions"]]} />
        <Table title="Pass & upgrade activity" description="Missing historical plan metadata stays unspecified. A discounted order is not proof of an upgrade." rows={report.planEvents.filter(row=>row.plan==="pass"||String(row.event).startsWith("pass_")||String(row.event).startsWith("upgrade_"))} columns={[["event","Event"],["plan","Plan"],["events","Events"],["users","Users"]]} />
        <Table title="Job Pass revenue by currency" rows={report.plans.filter(row=>row.plan==="Job Pass")} columns={[["currency","Currency"],["orders","Orders"],["gross_minor","Gross revenue"],["refund_flags","Refund flags"]]} />
      </>}
      {view === "activity" && <>
        <Table title="Public pages" description="Top 50 pages by recorded views. This includes later route visits, not just entry pages." rows={report.pages} columns={[["page","Page"],["views","Views"],["visitors","Visitors"],["cta_clicks","CTA clicks"]]} />
        <Table title="Tool usage" description="Events can repeat. Tool completion does not imply a purchase." rows={report.tools} columns={[["tool","Tool"],["event","Event"],["events","Events"],["sessions","Sessions"]]} />
        <Table title="CTA placements" rows={report.ctas} columns={[["page","Page"],["placement","Placement"],["clicks","Clicks"],["sessions","Sessions"]]} />
      </>}
      <details className={styles.muted}><summary className="cursor-pointer font-semibold">Tracking coverage & exclusions</summary><p>{report.exclusions} configured admin/test accounts resolved for exclusion. Signed-out operator visits cannot always be identified. Browser blocking, bots and historical tracking gaps can affect the counts.</p><p>First public event: {date(report.coverage.first_public_event)}. Latest public event: {date(report.coverage.latest_public_event)}. Latest editor event: {date(report.coverage.latest_editor_event)}.</p><ul>{Object.entries(report.quality).map(([key,value])=><li key={key}>{label(key)}: {String(value ?? "—")}</li>)}</ul></details>
      </>}
      <footer className={styles.footer}>Private WorkCV analytics · Existing first-party measurements · No customer CV content<br />Rolling date ranges. Revenue is gross, not profit. Unknown attribution stays unknown. Refresh updates the snapshot; it does not guarantee complete tracking.</footer>
    </div></div>
  </div>;
}
