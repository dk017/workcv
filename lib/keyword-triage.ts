import type { AtsAnalysis, AtsKeyword } from "./ats-keyword-checker.ts";

export type KeywordTriage = {
  /** Advert keywords the CV already covers. */
  found: AtsKeyword[];
  /** Missing keywords still to ask about, most important first. */
  queue: AtsKeyword[];
  /** Missing keywords the user said do not apply to them. */
  skipped: AtsKeyword[];
  total: number;
};

const sameTerm = (a: string, b: string) => a.trim().toLocaleLowerCase("en-GB") === b.trim().toLocaleLowerCase("en-GB");

/**
 * Turns an advert analysis into a one-at-a-time triage queue. Action verbs are
 * left out: "Yes, I have done this" only makes sense for skills,
 * qualifications and job titles.
 */
export function buildKeywordTriage(analysis: AtsAnalysis, skippedTerms: string[] = []): KeywordTriage {
  const relevant = (keyword: AtsKeyword) => keyword.category !== "Action verb";
  const isSkipped = (keyword: AtsKeyword) => skippedTerms.some((term) => sameTerm(term, keyword.term));
  const missing = analysis.missing.filter(relevant).sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term));
  const found = analysis.found.filter(relevant);
  return {
    found,
    queue: missing.filter((keyword) => !isSkipped(keyword)),
    skipped: missing.filter(isSkipped),
    total: found.length + missing.length,
  };
}

/** The analyser stores some terms in lower case; show and save them in sentence case. */
export function displayKeyword(term: string) {
  const text = term.trim();
  return text === text.toLocaleLowerCase("en-GB") ? text.charAt(0).toLocaleUpperCase("en-GB") + text.slice(1) : text;
}

/** Skills and qualifications can go straight into the skills list. */
export function canAddToSkills(keyword: Pick<AtsKeyword, "category">) {
  return keyword.category === "Skill or tool" || keyword.category === "Qualification";
}

/** Adds a skill on its own line unless the list already has it. */
export function addSkillLine(skills: string, term: string) {
  const lines = skills.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.some((line) => sameTerm(line, term))) return lines.join("\n");
  return [...lines, displayKeyword(term)].join("\n");
}

export function addSkippedKeyword(skippedTerms: string[] = [], term: string) {
  return skippedTerms.some((existing) => sameTerm(existing, term)) ? skippedTerms : [...skippedTerms, term].slice(-100);
}
