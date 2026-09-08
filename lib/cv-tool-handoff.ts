import type { CvData } from "@/lib/editor-data";

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
  const handoff: CvToolHandoff = {
    version: 1,
    createdAt: Date.now(),
    source: input.source.slice(0, 80),
    patch: input.patch,
    sourceText: input.sourceText?.slice(0, 30_000),
  };
  window.sessionStorage.setItem(cvToolHandoffKey, JSON.stringify(handoff));
}

export function readCvToolHandoff(): CvToolHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(cvToolHandoffKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<CvToolHandoff>;
    if (
      value.version !== 1 ||
      typeof value.createdAt !== "number" ||
      Date.now() - value.createdAt > 30 * 60 * 1_000 ||
      typeof value.source !== "string" ||
      (value.sourceText !== undefined && typeof value.sourceText !== "string") ||
      (value.patch !== undefined && typeof value.patch !== "object")
    ) {
      window.sessionStorage.removeItem(cvToolHandoffKey);
      return null;
    }
    return value as CvToolHandoff;
  } catch {
    window.sessionStorage.removeItem(cvToolHandoffKey);
    return null;
  }
}

export function removeCvToolHandoff() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(cvToolHandoffKey);
}
