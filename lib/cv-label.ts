import type { CvData } from "./editor-data.ts";

/** How a saved CV is named in the editor and on My CVs: the job it is for, and the employer
 * when the cover letter names one. Saving overwrites the stored title with the person's name,
 * which is the same on every copy, so it can't tell CVs apart. */
export function cvDisplayTitle(cv: Pick<CvData, "targetRole" | "coverLetter">) {
  return [cv.targetRole.trim() || "Untitled CV", cv.coverLetter?.employer.trim()].filter(Boolean).join(" · ");
}
