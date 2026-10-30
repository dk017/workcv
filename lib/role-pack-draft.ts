import type { CvToolPatch } from "./cv-tool-handoff.ts";
import { buildCoverLetterPatch } from "./cover-letter-handoff.ts";
export type RolePackFields = { fullName: string; targetRole: string; company: string; profile: string; motivation: string; evidence: string; moreEvidence: string };
export function buildRolePackDraft(fields: RolePackFields, educationFirst = false): CvToolPatch {
  const entries = Object.values(fields);
  if (entries.some(value => !value.trim())) throw new Error("Complete each field with your own details.");
  if (fields.fullName.length > 100 || fields.targetRole.length > 140 || fields.company.length > 140 || fields.profile.length > 1000 || fields.motivation.length > 500 || fields.evidence.length > 1800 || fields.moreEvidence.length > 1800) throw new Error("Shorten the details to fit the field limits.");
  const patch = buildCoverLetterPatch({ ...fields, jobDescription: "" }, [
    `I am applying for the ${fields.targetRole.trim()} role at ${fields.company.trim()}. ${fields.motivation.trim()}`,
    fields.evidence.trim(), fields.moreEvidence.trim(),
    "Thank you for considering my application. I would welcome the opportunity to discuss my suitability for the role."
  ]);
  return { ...patch, profile: fields.profile.trim(), ...(educationFirst ? { layoutPreset: "education-first" } : {}) };
}
