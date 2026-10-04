// Turns what the ATS checker found into things the editor can ask the user
// about. Pure and client-safe: no server imports.

import { analyseAtsKeywords, type AtsAnalysis, type AtsKeyword } from "./ats-keyword-checker.ts";
import type { CvFitHandoff } from "./cv-fit-handoff.ts";
import { assessExistingBullet, hasOutcome } from "./cv-bullet-rules.ts";
import type { CvData, CvTargeting } from "./editor-data.ts";
import { buildKeywordTriage, type KeywordTriage } from "./keyword-triage.ts";

type Requirement = NonNullable<CvTargeting["requirements"]>[number];

const limits = { requirements: 8, requirement: 180, explanation: 260, phrases: 5, phrase: 160, reason: 220 };

const clamp = (value: string, max: number) => value.trim().slice(0, max);
const same = (a: string, b: string) => a.trim().toLocaleLowerCase("en-GB") === b.trim().toLocaleLowerCase("en-GB");
const includes = (list: string[] | undefined, value: string) => (list ?? []).some((item) => same(item, value));

/**
 * The job title the AI features should aim at. The user's own headline wins; if
 * they have not written one, fall back to the vacancy so suggestions still
 * target the right role without putting that title on their CV.
 */
export function effectiveTargetRole(cv: Pick<CvData, "targetRole" | "targeting">) {
  return cv.targetRole.trim() || cv.targeting?.role?.trim() || "";
}

/** Skill and qualification terms the dictionary finds in a piece of text. */
function skillTermsIn(text: string) {
  const analysis = analyseAtsKeywords(text, "");
  return [...analysis.found, ...analysis.missing]
    .filter((keyword) => keyword.category === "Skill or tool" || keyword.category === "Qualification")
    .map((keyword) => keyword.term);
}

/** Builds the saved targeting record from a checker hand-off, clamped to the save schema's limits. */
export function targetingFromFitHandoff(handoff: CvFitHandoff): CvTargeting {
  const requirements = (handoff.requirements ?? []).slice(0, limits.requirements);
  const targeting: CvTargeting = {
    role: clamp(handoff.targetRole, 160),
    jobDescription: handoff.jobDescription.slice(0, 30_000),
    priorities: handoff.priorities.slice(0, 10).map((priority) => ({
      category: priority.category,
      title: clamp(priority.title, 200),
      action: clamp(priority.action, 1_000),
    })),
  };
  if (requirements.length) {
    const cvTerms = handoff.cvText ? new Set(analyseAtsKeywords(requirements.map((item) => item.requirement).join("\n"), handoff.cvText).found.map((keyword) => keyword.term)) : null;
    targeting.requirements = requirements
      .filter((item) => item.status !== "supported")
      .map((item) => ({
        requirement: clamp(item.requirement, limits.requirement),
        status: item.status === "partly-supported" ? ("partly-supported" as const) : ("not-evidenced" as const),
        explanation: clamp(item.explanation, limits.explanation),
        // Without the CV text there is no baseline, so the user must answer it themselves.
        watch: cvTerms ? skillTermsIn(item.requirement).filter((term) => !cvTerms.has(term)).slice(0, 6) : [],
      }));
    targeting.evidencedRequirements = requirements
      .filter((item) => item.status === "supported")
      .map((item) => clamp(item.requirement, limits.requirement));
  }
  const phrases = (handoff.vaguePhrases ?? []).slice(0, limits.phrases);
  if (phrases.length) {
    targeting.vaguePhrases = phrases.map((item) => ({ phrase: clamp(item.phrase, limits.phrase), reason: clamp(item.reason, limits.reason) }));
  }
  return targeting;
}

export type VacancyTriage = KeywordTriage & {
  /** Keywords inside an unmet requirement: the requirement question covers them. */
  covered: AtsKeyword[];
  requirements: {
    /** Unmet requirements still to ask about, not-evidenced before partly. */
    queue: Requirement[];
    skipped: Requirement[];
    answered: Requirement[];
  };
};

function keywordTermsIn(text: string) {
  const analysis = analyseAtsKeywords(text, "");
  return [...analysis.found, ...analysis.missing].filter((keyword) => keyword.category !== "Action verb" && keyword.category !== "Job title").map((keyword) => keyword.term);
}

/**
 * What to ask the user, in order: the checker's unmet requirements first, then
 * any advert keywords those requirements do not already cover.
 *
 * - A requirement the checker judged evidenced is never asked about, and nor are its keywords.
 * - An unmet requirement is dropped once the user answers or skips it, or once the CV
 *   now contains every skill keyword that was missing when the checker ran (`watch`),
 *   for example they added Excel to their skills. A requirement whose words were already
 *   in the CV when the checker judged it unmet is never dropped automatically.
 * - Keywords inside an unmet requirement are not asked separately.
 */
export function buildVacancyTriage(analysis: AtsAnalysis, targeting: CvTargeting, cvText: string): VacancyTriage {
  const skipped = targeting.skippedKeywords ?? [];
  const base = buildKeywordTriage(analysis, skipped);
  const unmet = targeting.requirements ?? [];

  const addressed = (requirement: Requirement) => {
    const watch = requirement.watch ?? [];
    if (watch.length === 0) return false;
    const nowFound = new Set(analyseAtsKeywords(requirement.requirement, cvText).found.map((keyword) => keyword.term));
    return watch.every((term) => nowFound.has(term));
  };

  const answered = unmet.filter((item) => includes(targeting.answeredRequirements, item.requirement) || addressed(item));
  const open = unmet.filter((item) => !answered.includes(item));
  const skippedRequirements = open.filter((item) => includes(skipped, item.requirement));
  const queue = open
    .filter((item) => !skippedRequirements.includes(item))
    .sort((a, b) => Number(b.status === "not-evidenced") - Number(a.status === "not-evidenced"));

  const evidencedTerms = new Set((targeting.evidencedRequirements ?? []).flatMap(keywordTermsIn));
  const unmetTerms = new Set(unmet.flatMap((item) => keywordTermsIn(item.requirement)));

  const movedToFound = base.queue.filter((keyword) => evidencedTerms.has(keyword.term));
  const covered = base.queue.filter((keyword) => !evidencedTerms.has(keyword.term) && unmetTerms.has(keyword.term));
  const keywordQueue = base.queue.filter((keyword) => !evidencedTerms.has(keyword.term) && !unmetTerms.has(keyword.term));

  return {
    found: [...base.found, ...movedToFound],
    queue: keywordQueue,
    skipped: base.skipped,
    covered,
    total: base.total,
    requirements: { queue, skipped: skippedRequirements, answered },
  };
}

export type VaguePhraseItem = {
  phrase: string;
  reason: string;
  where: { kind: "profile" } | { kind: "bullet"; roleId: string; index: number; roleTitle: string };
};

const squash = (value: string) => value.replace(/\s+/g, " ").trim().toLocaleLowerCase("en-GB");

/**
 * Vague phrases the checker flagged that are still in the CV, with where they
 * are. A phrase the user has since edited away is dropped, so the list shrinks
 * as they fix things.
 */
export function vaguePhraseItems(cv: CvData): VaguePhraseItem[] {
  const items: VaguePhraseItem[] = [];
  for (const entry of cv.targeting?.vaguePhrases ?? []) {
    const needle = squash(entry.phrase);
    if (needle.length < 3) continue;
    if (squash(cv.profile).includes(needle)) {
      items.push({ ...entry, where: { kind: "profile" } });
      continue;
    }
    for (const role of cv.experience) {
      const lines = role.bullets.split("\n");
      const index = lines.findIndex((line) => squash(line).includes(needle));
      if (index >= 0) {
        items.push({ ...entry, where: { kind: "bullet", roleId: role.id, index, roleTitle: role.role.trim() || "this role" } });
        break;
      }
    }
  }
  return items;
}

export type MatchProgress = {
  /** Advert keywords found on the CV out of those the card tracks. */
  keywords: { found: number; total: number };
  /** Unmet advert requirements the user has answered with a bullet (or whose skill is now on the CV). Null with no checker data. */
  requirements: { handled: number; total: number } | null;
  /** Bullets that show a result or number out of all bullets. */
  bulletsWithResults: { count: number; total: number };
  /** Bullets the editor currently flags as weak. */
  flaggedBullets: number;
};

/**
 * Counts that move as the user edits. Everything here is deterministic and
 * needs no AI call, so it can update on every keystroke. It is deliberately
 * not combined into one score: the AI-judged parts of the checker's score
 * cannot be recomputed live.
 */
export function matchProgress(cv: CvData, triage: VacancyTriage): MatchProgress {
  const bullets = cv.experience
    .flatMap((role) => role.bullets.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);
  const requirements = cv.targeting?.requirements ?? [];
  return {
    keywords: { found: triage.found.length, total: triage.total },
    requirements: requirements.length ? { handled: triage.requirements.answered.length, total: requirements.length } : null,
    bulletsWithResults: { count: bullets.filter(hasOutcome).length, total: bullets.length },
    flaggedBullets: bullets.filter((line) => assessExistingBullet(line).length > 0).length,
  };
}
