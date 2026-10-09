import type { ReadinessIssue } from "@/lib/cv-readiness";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { lines, type CvData } from "@/lib/editor-data";

// The editor's steps, in order. The summary comes after the history it summarises.
export const steps = [
  { id: "contact", label: "Contact" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "profile", label: "Profile" },
  { id: "more", label: "More sections" },
  { id: "letter", label: "Cover letter" },
  { id: "finish", label: "Finish" },
] as const;

export type StepId = (typeof steps)[number]["id"];

export function parseStep(value: string | null | undefined): StepId | null {
  return steps.some((step) => step.id === value) ? (value as StepId) : null;
}

export function stepIndex(id: StepId) {
  return steps.findIndex((step) => step.id === id);
}

export function nextStep(id: StepId): StepId | null {
  return steps[stepIndex(id) + 1]?.id ?? null;
}

export function previousStep(id: StepId): StepId | null {
  return steps[stepIndex(id) - 1]?.id ?? null;
}

export function stepLabel(id: StepId) {
  return steps[stepIndex(id)].label;
}

// Readiness issues name a CV section; contact details and the target role live on the Contact step.
export function stepForIssue(issue: ReadinessIssue): StepId {
  if (issue.section === "profile") return issue.id === "contact" || issue.id === "target-role" ? "contact" : "profile";
  return parseStep(issue.section) ?? "contact";
}

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// A tick in the step bar: the step has the essentials. Optional steps tick once they have content.
export function stepComplete(cv: CvData, id: StepId, unlocked: boolean): boolean {
  switch (id) {
    case "contact":
      return Boolean(cv.fullName.trim() && (cv.email.trim() || cv.phone.trim()));
    case "experience":
      return cv.experience.some((item) => item.role.trim() && item.company.trim() && item.bullets.trim());
    case "education":
      return cv.education.some((item) => item.qualification.trim() && item.institution.trim());
    case "skills":
      return lines(cv.skills).length >= 3;
    case "profile":
      return words(cv.profile) >= 20;
    case "more":
      return Object.values(cv.additionalSections || {}).some((value) => Boolean(value?.trim()));
    case "letter":
      return hasCoverLetterContent(cv);
    case "finish":
      return unlocked;
  }
}
