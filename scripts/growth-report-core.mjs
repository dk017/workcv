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
