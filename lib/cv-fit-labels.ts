// Display helpers for the CV fit assessment. Kept free of server-only imports so
// both the assessment code and the checker page can use them.

export type CvSeniority = "entry" | "mid-level" | "senior" | "leadership" | "unclear";

const seniorityLabels: Record<CvSeniority, string> = {
  entry: "entry level",
  "mid-level": "mid-level",
  senior: "senior level",
  leadership: "leadership level",
  unclear: "an unclear level",
};

/** "entry level", "mid-level", "an unclear level"… ready to follow the word "at". */
export function seniorityLabel(seniority: CvSeniority) {
  return seniorityLabels[seniority] ?? seniorityLabels.unclear;
}

/** Models often wrap an exact quote in quote marks; the page adds its own. */
export function stripWrappingQuotes(value: string) {
  return value.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, "");
}
