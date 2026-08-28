export const growthStages = [
  ["qualified_sessions", "signups"],
  ["signups", "activated_users"],
  ["activated_users", "preview_ready_users"],
  ["preview_ready_users", "pdf_clickers"],
  ["pdf_clickers", "checkout_openers"],
  ["checkout_openers", "payment_starters"],
  ["payment_starters", "positive_value_orders"],
  ["positive_value_orders", "successful_pdf_downloaders"],
];

export function normalizeMetricRows(rows) {
  return rows.map((row) => ({ metric: row.metric, value: Number(row.value) }));
}

export function calculateStepConversions(metricRows) {
  const values = Object.fromEntries(metricRows.map((row) => [row.metric, row.value]));
  return growthStages.map(([from, to]) => ({
    step: `${from} -> ${to}`,
    conversion:
      values[from] > 0 ? `${((values[to] / values[from]) * 100).toFixed(1)}%` : "n/a",
  }));
}

export function normalizeSourceRows(rows) {
  return rows.map((row) => ({
    ...row,
    signups: Number(row.signups),
    activated: Number(row.activated),
    pdf_clickers: Number(row.pdf_clickers),
    checkout_openers: Number(row.checkout_openers),
    buyers: Number(row.buyers),
  }));
}
