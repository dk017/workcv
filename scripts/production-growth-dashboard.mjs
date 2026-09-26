import { createDecipheriv, privateDecrypt } from "node:crypto";

export function decryptSnapshot(encoded, privateKey, requestId) {
  const envelope = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  if (envelope.version !== 1) throw new Error("Unsupported report encryption version");
  const key = privateDecrypt({ key: privateKey, oaepHash: "sha256" }, Buffer.from(envelope.key, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAAD(Buffer.from("workcv-growth-v1"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const report = JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.data, "base64")), decipher.final()]).toString("utf8"));
  if (report.version !== 1 || report.request_id !== requestId) throw new Error("Report does not match this request");
  return report;
}

export function readEncryptedChunks(log) {
  const chunks = [...log.matchAll(/WORKCV_GROWTH_CHUNK:(\d+)\/(\d+):([A-Za-z0-9+/=]+)/g)];
  const count = Number(chunks[0]?.[2]);
  if (!count || chunks.length !== count || chunks.some((m, i) => Number(m[1]) !== i + 1 || Number(m[2]) !== count)) {
    throw new Error("Encrypted report is missing or incomplete; no plaintext fallback is permitted");
  }
  return chunks.map(m => m[3]).join("");
}

const escape = value => String(value ?? "—").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const label = value => value.replaceAll("_", " ");
export const cohortRate = (buyers, visitors) => visitors > 0 ? `${(100 * buyers / visitors).toFixed(1)}%` : "Not measurable";
function table(rows) {
  if (!rows.length) return "<p>No recorded activity in this window.</p>";
  const keys = Object.keys(rows[0]);
  return `<div class="scroll"><table><thead><tr>${keys.map(k => `<th scope="col">${escape(label(k))}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${keys.map(k => `<td>${escape(row[k])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

export function renderDashboard(report) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
  <title>WorkCV private growth baseline</title><style>
  :root{font-family:system-ui,sans-serif;color:#172d37;background:#f3f6f8}body{max-width:1200px;margin:auto;padding:24px}h1{font-size:32px}h2{margin-top:40px}h3{margin-top:28px}p,li{line-height:1.6}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.card,section{background:white;border:1px solid #cbd5df;border-radius:10px;padding:20px}.card strong{display:block;font-size:30px;margin-top:8px}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:10px;border-bottom:1px solid #d8e0e5;vertical-align:top}th{background:#eef3f6;white-space:nowrap}td{overflow-wrap:anywhere;min-width:70px}small{color:#425b68}nav a{margin-right:24px;color:#075e77}.warning{background:#fff6da;padding:16px;border-left:4px solid #9e6d00}summary{cursor:pointer;font-weight:600}@media(max-width:600px){body{padding:12px}section{padding:12px}}
  </style></head><body><h1>WorkCV growth baseline</h1><p>Private local report · Generated ${escape(report.generated_at)} · UTC</p>
  <p class="warning">The goal is 10 paid orders/day. This report measures recorded behaviour; it does not promise a growth outcome. Orders include returning buyers. Attribution is not proof that a channel caused a sale.</p>
  <nav>${report.windows.map(w => `<a href="#days-${w.days}">Last ${w.days} days</a>`).join("")}</nav>
  <h2>Tracking coverage</h2>${table(Object.entries(report.coverage).map(([metric, value]) => ({ metric: label(metric), value })))}
  ${report.windows.map(w => {
    const totals = Object.fromEntries(["visitors","linked_visitors","cta_visitors","login_visitors","signup_visitors","cv_visitors","preview_visitors","checkout_visitors","payment_visitors","buyer_visitors","download_visitors","ambiguous_visitors","extra_browser_visitors"].map(key => [key, w.cohort.reduce((sum, row) => sum + row[key], 0)]));
    return `<section><h2 id="days-${w.days}">Last ${w.days} days</h2><p><small>${escape(w.start)} ≤ event time &lt; ${escape(w.end)}</small></p>
    <div class="cards"><div class="card">Paid orders<strong>${escape(w.activity.paid_orders)}</strong></div><div class="card">Orders per day<strong>${(w.activity.paid_orders / w.days).toFixed(2)}</strong></div><div class="card">Observed public visitors<strong>${escape(totals.visitors)}</strong></div><div class="card">Linked visitor → buyer<strong>${cohortRate(totals.buyer_visitors, totals.visitors)}</strong><small>${totals.buyer_visitors} linked buyers / ${totals.visitors} observed visitors. Incomplete attribution.</small></div></div>
    <h3>Recorded revenue by currency</h3><p>Gross minor units: 799 GBP minor units means £7.99. No currencies are combined.</p>${table(w.revenue)}
    <h3>Activity totals — different populations, not a conversion ladder</h3>${table(Object.entries(w.activity).map(([metric, count]) => ({ metric: label(metric), count })))}
    <h3>Same visitor cohort: independent milestones</h3><p>One visitor is counted once per window. A later authenticated milestone is credited only after their entry and to at most one visitor per user. Unlinked activity is unknown, not a confirmed failure. “CV visitors” means created a saved CV, not necessarily completed it.</p>
    ${table(Object.entries(totals).map(([milestone, visitors]) => ({ milestone: label(milestone), visitors })))}
    <details><summary>Visitor milestones by source and landing page</summary>${table(w.cohort)}</details>
    <h3>Paid orders by checkout attribution</h3><p>Legacy profile fallback can change after purchase. Source-less snapshots remain unknown; they are not silently replaced.</p>${table(w.sales)}
    <h3>Tool usage</h3><p>Events may repeat; a tool completion is not a purchase.</p>${table(w.tools)}
    <h3>What buyers say the CV is for</h3><p>Optional question after a CV's first successful download, so respondents are mostly buyers. Counts are saved CVs, not people.</p>${table(w.answers || [])}
    <h3>CTA clicks by placement</h3><p>A click is not a purchase. Compare with paid orders by landing page above.</p>${table(w.ctas || [])}
    <h3>Data quality and exclusions</h3>${table(Object.entries(w.quality).map(([metric, count]) => ({ metric: label(metric), count })))}
    </section>`;
  }).join("")}
  <h2>Definitions and limits</h2><ul>${report.notes.map(note => `<li>${escape(note)}</li>`).join("")}</ul>
  <p>Keep this file private. No external scripts, tracking, fonts or images are loaded.</p></body></html>`;
}
