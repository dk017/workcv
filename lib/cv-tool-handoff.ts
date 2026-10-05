import type { CvData } from "@/lib/editor-data";
import { createBlankCv } from "./editor-data.ts";
import { cvDataSchema } from "./cv-schema.ts";

export const cvToolHandoffKey = "workcv-cv-tool-handoff-v1";

export type CvToolPatch = Partial<
  Pick<
    CvData,
    | "fullName"
    | "targetRole"
    | "profile"
    | "skills"
    | "experience"
    | "education"
    | "targeting"
    | "applicationPack"
    | "coverLetter"
    | "layoutPreset"
    | "additionalSections"
  >
>;

export type CvToolHandoff = {
  version: 1;
  createdAt: number;
  source: string;
  patch?: CvToolPatch;
  sourceText?: string;
};

export function writeCvToolHandoff(input: {
  source: string;
  patch?: CvToolPatch;
  sourceText?: string;
}) {
  if (typeof window === "undefined") return;
  if (input.sourceText && input.sourceText.length > 30_000) {
    throw new Error("The source text is too long to carry across. Shorten it or copy your notes first.");
  }
  const handoff: CvToolHandoff = {
    version: 1,
    createdAt: Date.now(),
    source: input.source.slice(0, 80),
    patch: input.patch,
    sourceText: input.sourceText,
  };
  if (input.patch && !cvDataSchema.safeParse({ ...createBlankCv(), ...input.patch }).success) {
    throw new Error("The tool result is not a valid CV draft.");
  }
  const encoded = JSON.stringify(handoff);
  if (encoded.length > 150_000 || new TextEncoder().encode(JSON.stringify(input.patch || {})).byteLength > 100 * 1024) {
    throw new Error("The draft is too large to carry across. Copy it and shorten the selected wording.");
  }
  window.sessionStorage.setItem(cvToolHandoffKey, encoded);
}

export function readCvToolHandoff(): CvToolHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(cvToolHandoffKey);
    if (!raw) return null;
    if (raw.length > 150000) { window.sessionStorage.removeItem(cvToolHandoffKey); return null; }
    const value = JSON.parse(raw) as Partial<CvToolHandoff>;
    if (
      value.version !== 1 ||
      typeof value.createdAt !== "number" ||
      !Number.isFinite(value.createdAt) ||
      value.createdAt > Date.now() + 60000 ||
      Date.now() - value.createdAt > 30 * 60 * 1_000 ||
      typeof value.source !== "string" ||
      (value.sourceText !== undefined && typeof value.sourceText !== "string") ||
      (value.sourceText !== undefined && value.sourceText.length > 30000) ||
      (value.patch !== undefined && (!value.patch || Array.isArray(value.patch) || typeof value.patch !== "object" || !cvDataSchema.safeParse({ ...createBlankCv(), ...value.patch }).success))
    ) {
      window.sessionStorage.removeItem(cvToolHandoffKey);
      return null;
    }
    return value as CvToolHandoff;
  } catch {
    try { window.sessionStorage.removeItem(cvToolHandoffKey); } catch { /* Storage may be blocked. */ }
    return null;
  }
}

export function removeCvToolHandoff(expected?: CvToolHandoff) {
  if (typeof window === "undefined") return;
  // A newer tool result must not be removed by an older save completing.
  if (expected && JSON.stringify(readCvToolHandoff()) !== JSON.stringify(expected)) return;
  try { window.sessionStorage.removeItem(cvToolHandoffKey); } catch { /* The saved CV remains available. */ }
}
