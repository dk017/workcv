import marketingClusterConfig from "../lib/marketing-clusters-data.json" with { type: "json" };

export const growthStages = [
  ["qualified_sessions", "marketing_cta_clickers"],
  ["marketing_cta_clickers", "login_starters"],
  ["login_starters", "signups"],
  ["signups", "activated_users"],
  ["activated_users", "preview_ready_users"],
  ["preview_ready_users", "pdf_clickers"],
  ["pdf_clickers", "checkout_openers"],
  ["checkout_openers", "payment_starters"],
  ["payment_starters", "positive_production_orders"],
  ["positive_production_orders", "successful_pdf_downloaders"],
];

export function normalizeMetricRows(rows) {
  return rows.map((row) => ({ metric: row.metric, value: Number(row.value) }));
}

export function calculateStepConversions(metricRows) {
  const values = Object.fromEntries(metricRows.map((row) => [row.metric, row.value]));
  return growthStages.map(([from, to]) => ({
    step: `${from} -> ${to}`,
    conversion:
      values[from] > 0 && Number.isFinite(values[to])
        ? `${((values[to] / values[from]) * 100).toFixed(1)}%`
        : "n/a",
  }));
}

export function normalizeNumericRows(rows) {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        typeof value === "string" && /^-?\d+(?:\.\d+)?$/.test(value)
          ? Number(value)
          : value,
      ]),
    ),
  );
}

export const normalizeSourceRows = normalizeNumericRows;

const marketingClusterExactRoutes = new Map(
  Object.entries(marketingClusterConfig.exactRoutes),
);

const marketingClusterPrefixes = marketingClusterConfig.prefixRoutes;

export function marketingClusterForPath(pathname = "") {
  const path = pathname.split("?", 1)[0] || "/";
  if (marketingClusterExactRoutes.has(path)) return marketingClusterExactRoutes.get(path);
  const prefix = marketingClusterPrefixes.find(([value]) => path.startsWith(value));
  if (prefix) return prefix[1];
  if (path === "/" || path === "/tools" || path === "/templates") return "core-commercial";
  return "other";
}

export function addMarketingCluster(rows, pathKey = "landing_path") {
  return rows.map((row) => ({
    ...row,
    marketing_cluster: marketingClusterForPath(row[pathKey]),
  }));
}
