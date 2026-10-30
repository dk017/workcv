import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

function argument(name, fallback = "") {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length) || fallback;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }
  return rows;
}

function numberValue(value) {
  const normalised = String(value || "").trim().replace(/,/g, "");
  if (!normalised || /^breakout$/i.test(normalised)) return null;
  const parsed = Number.parseFloat(normalised.replace(/%$/, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function classify(query) {
  const value = query.toLocaleLowerCase("en-GB");
  const rules = [
    { pattern: /interview|cover letter|thank.?you|application|cv|resume|job application/, cluster: "applications", intent: "application", targetType: "guide-or-tool", freshnessRisk: "medium" },
    { pattern: /career|advancement|promotion|testing|skill|training|course/, cluster: "career-progression", intent: "career-progression", targetType: "guide-or-tool", freshnessRisk: "medium" },
    { pattern: /redundan|notice|employment\s+support|support\s+allowance|benefit|jobseeker|job\s+seeker|lost\s+(?:my\s+)?job|statutory\s+pay|holiday\s+pay|salary|\bpay\b/, cluster: "employment-changes", intent: "employment-change", targetType: "guide-or-calculator", freshnessRisk: "high" },
    { pattern: /job|vacanc|recruit|employer|delivery|driver|warehouse/, cluster: "job-search", intent: "job-search", targetType: "guide-or-template", freshnessRisk: "high" },
  ];
  return rules.find((rule) => rule.pattern.test(value)) || {
    cluster: "review",
    intent: "unclear",
    targetType: "manual-review",
    freshnessRisk: "high",
  };
}

function normaliseQuery(query) {
  return query
    .normalize("NFKC")
    .toLocaleLowerCase("en-GB")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function escapeTable(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ").trim();
}

function parseRows(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("The trend export does not contain any data rows.");
  const headers = rows[0].map((header) => header.trim().toLocaleLowerCase("en-GB"));
  const indexOf = (name) => headers.indexOf(name);
  const queryIndex = indexOf("query");
  const interestIndex = indexOf("search interest");
  const increaseIndex = indexOf("increase percent");
  if (queryIndex < 0 || interestIndex < 0 || increaseIndex < 0) {
    throw new Error('Expected columns: "query", "search interest", and "increase percent".');
  }

  const seenQueries = new Set();
  return rows.slice(1).map((row) => {
    const query = String(row[queryIndex] || "").trim();
    const searchInterestRaw = String(row[interestIndex] || "").trim();
    const increasePercentRaw = String(row[increaseIndex] || "").trim();
    const classification = classify(query);
    return {
      rank: 0,
      query,
      searchInterestRaw,
      searchInterest: numberValue(searchInterestRaw),
      increasePercentRaw,
      increasePercent: numberValue(increasePercentRaw),
      isBreakout: /^breakout$/i.test(increasePercentRaw) || /^breakout$/i.test(searchInterestRaw),
      ...classification,
    };
  }).filter((row) => {
    const key = normaliseQuery(row.query);
    if (!key || seenQueries.has(key)) return false;
    seenQueries.add(key);
    return true;
  }).map((row, index) => ({ ...row, rank: index + 1 }));
}

function sortRows(rows) {
  return [...rows].sort((left, right) => {
    if (Number(right.isBreakout) !== Number(left.isBreakout)) return Number(right.isBreakout) - Number(left.isBreakout);
    return (right.searchInterest ?? -1) - (left.searchInterest ?? -1) || (right.increasePercent ?? -1) - (left.increasePercent ?? -1) || left.query.localeCompare(right.query);
  });
}

function renderReport(rows, options) {
  const breakoutCount = rows.filter((row) => row.isBreakout).length;
  const nonZeroInterest = rows.filter((row) => row.searchInterest !== null && row.searchInterest > 0).length;
  const reviewRows = sortRows(rows);
  const table = reviewRows.map((row, index) => `| ${index + 1} | ${escapeTable(row.query)} | ${escapeTable(row.searchInterestRaw || "—")} | ${escapeTable(row.increasePercentRaw || "—")} | ${row.cluster} | ${row.intent} | ${row.targetType} | ${row.freshnessRisk} |`).join("\n");
  return `# Trend radar review — ${options.asOf}

Internal planning output for WorkCV. This report is a discovery aid, not a traffic forecast. Do not publish the percentages as search volume or demand guarantees.

- Source file: \`${escapeTable(basename(options.input))}\`
- Trend window: ${options.windowStart || "not supplied"} to ${options.windowEnd || "not supplied"}
- Queries reviewed: ${rows.length}
- Breakout rows: ${breakoutCount}
- Rows with non-zero search interest: ${nonZeroInterest}

## Review rules

1. Confirm the query in a fresh Google Trends snapshot and Search Console before publishing.
2. Prefer one genuinely useful page over several employer or spelling variants.
3. Choose a guide, template or tool based on intent; do not build a general trends blog.
4. Every published page needs a truthful next step into the WorkCV application workflow and, where relevant, the no-subscription CV builder.
5. Archive or refresh pages when the topic becomes stale, legal, pay-related or employer-specific.

## Ranked review queue

| Rank | Query | Search interest | Increase | Suggested cluster | Intent | Target type | Freshness risk |
| ---: | --- | ---: | ---: | --- | --- | --- | --- |
${table}

## Editorial status

All rows are **manual review** until a current snapshot confirms sustained relevance, user intent and a defensible WorkCV destination. The script never creates a public page and never publishes source query text automatically.
`;
}

const input = argument("input");
if (!input) throw new Error("Pass a CSV export with --input=path-to-export.csv");

const asOf = argument("as-of", new Date().toISOString().slice(0, 10));
const output = argument("output", `research/trend-radar/review-${asOf}.md`);
const options = {
  input,
  asOf,
  output,
  windowStart: argument("window-start"),
  windowEnd: argument("window-end"),
};
const rows = parseRows(readFileSync(resolve(input), "utf8"));
const reportPath = resolve(output);
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, renderReport(rows, options), "utf8");
console.log(`Trend radar report written to ${reportPath}`);
