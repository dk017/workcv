import type { CvFitPriority } from "./cv-fit-assessment";

export const cvFitHandoffKey = "workcv-cv-fit-handoff-v1";
const handoffLifetimeMs = 30 * 60 * 1_000;

export type CvFitHandoff = {
  version: 1;
  createdAt: number;
  cvText?: string;
  jobDescription: string;
  targetRole: string;
  priorities: CvFitPriority[];
  /** What the assessment found for each advert requirement. Optional: older hand-offs do not have it. */
  requirements?: Array<{
    requirement: string;
    status: "supported" | "partly-supported" | "not-evidenced";
    explanation: string;
  }>;
  /** Phrases in the CV the assessment called vague. */
  vaguePhrases?: Array<{ phrase: string; reason: string }>;
  source: "cv-fit-assessment";
};

export function readCvFitHandoff(): CvFitHandoff | null {
  try {
    const raw = window.sessionStorage.getItem(cvFitHandoffKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<CvFitHandoff>;
    if (
      value.version !== 1 ||
      value.source !== "cv-fit-assessment" ||
      typeof value.createdAt !== "number" ||
      Date.now() - value.createdAt > handoffLifetimeMs ||
      typeof value.jobDescription !== "string" ||
      typeof value.targetRole !== "string" ||
      !Array.isArray(value.priorities)
    ) {
      window.sessionStorage.removeItem(cvFitHandoffKey);
      return null;
    }
    return value as CvFitHandoff;
  } catch {
    window.sessionStorage.removeItem(cvFitHandoffKey);
    return null;
  }
}

export function writeCvFitHandoff(handoff: CvFitHandoff) {
  window.sessionStorage.setItem(cvFitHandoffKey, JSON.stringify(handoff));
}

export function removeCvSourceFromHandoff() {
  const handoff = readCvFitHandoff();
  if (!handoff) return;
  delete handoff.cvText;
  window.sessionStorage.setItem(cvFitHandoffKey, JSON.stringify(handoff));
}
