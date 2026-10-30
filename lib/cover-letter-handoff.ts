import type { CoverLetter } from "./editor-data.ts";
import type { CvToolPatch } from "./cv-tool-handoff.ts";

export const coverLetterEditorRoute = "/editor?template=classic&new=1&from=career-tool";

type LetterSource = {
  fullName: string;
  targetRole: string;
  company: string;
  hiringManager?: string;
  jobDescription: string;
};

// Use the fields submitted for this result, not later edits to the form.
// Transfer structured paragraphs directly; no second AI request or text import.
export function buildCoverLetterPatch(source: LetterSource, paragraphs: string[]): CvToolPatch {
  const coverLetter: CoverLetter = {
    jobTitle: source.targetRole.trim(),
    employer: source.company.trim(),
    recipientName: source.hiringManager?.trim() || "",
    greeting: "sir-madam",
    reference: "",
    employerAddress: "",
    includeDate: true,
    paragraphs: [...paragraphs],
  };
  return {
    fullName: source.fullName.trim(),
    targetRole: source.targetRole.trim(),
    coverLetter,
    targeting: {
      role: source.targetRole.trim(),
      jobDescription: source.jobDescription.trim(),
      priorities: [],
    },
  };
}
