import type { CvData } from "./editor-data.ts";

// Copy a CV for another application: keep the person's experience and the
// letter's body as a starting point, but drop everything tied to the
// previous job so it cannot be sent to the wrong employer by mistake.
export function prepareDuplicateCv(source: CvData): CvData {
  const { targeting: _targeting, applicationPack: _applicationPack, ...rest } = source;
  const copy: CvData = structuredClone(rest);
  if (source.coverLetter) {
    const oldEmployer = source.coverLetter.employer.trim();
    const employerPattern = oldEmployer
      ? new RegExp(oldEmployer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
      : null;
    copy.coverLetter = {
      ...structuredClone(source.coverLetter),
      // The copied letter is for a different employer: turn the old name into
      // a prompt so the bracket check flags it until it is replaced.
      paragraphs: source.coverLetter.paragraphs.map((paragraph) =>
        employerPattern ? paragraph.replace(employerPattern, "[employer]") : paragraph,
      ),
      employer: "",
      recipientName: "",
      reference: "",
      employerAddress: "",
    };
  }
  return copy;
}

export function duplicateTitle(title: string) {
  const base = title.trim().replace(/ \(copy(?: \d+)?\)$/, "") || "My CV";
  return `${base} (copy)`.slice(0, 160);
}
