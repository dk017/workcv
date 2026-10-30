export type EvidenceRow = { criterion: string; essential: boolean; context: string; action: string; outcome: string };
export const statementExample: EvidenceRow = {
  criterion: "Explain information clearly to different audiences", essential: true,
  context: "At a community centre, I helped visitors understand how to book activities.",
  action: "I asked what they needed, explained the options in plain language and wrote down the next steps. When a visitor needed a different format, I checked with the coordinator rather than guessing.",
  outcome: "The visitor chose a suitable session and completed the booking with the coordinator.",
};
export function evidenceStatus(row: EvidenceRow) {
  if (!row.context.trim() && !row.action.trim() && !row.outcome.trim()) return "Not evidenced";
  return row.context.trim() && row.action.trim() && row.outcome.trim() ? "Draft evidence entered" : "Needs detail";
}
export function buildStatement(rows: EvidenceRow[]) {
  return rows.filter((row) => row.criterion.trim()).map((row) => [row.context.trim(), row.action.trim(), row.outcome.trim()].filter(Boolean).join(" ")).filter(Boolean).join("\n\n");
}
export function statementWordCount(text: string) { return text.trim() ? text.trim().split(/\s+/).length : 0; }
