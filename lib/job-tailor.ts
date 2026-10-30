import { z } from "zod";

import { analyseAtsKeywords } from "./ats-keyword-checker.ts";
import type { CvData, CvTargeting } from "./editor-data.ts";

// "Tailor my CV for this job": a job sent from the tracker or the Chrome
// extension becomes a separate copy of the user's CV with the advert attached.
// Pure functions so the rules can be tested without a browser.

export const jobTailorHandoffKey = "workcv-job-tailor-handoff-v1";
export const jobTailorEditorPath = "/editor?from=job-tailor";
// Long enough to cover signing in with an emailed code.
const handoffLifetimeMs = 60 * 60 * 1_000;
export const maxAdvertLength = 12_000;
// Below this the keyword check has too little to work with.
export const minAdvertLength = 80;

const jobSchema = z.object({
  role: z.string().trim().max(160),
  employer: z.string().trim().max(160).default(""),
  advertText: z.string().trim().max(maxAdvertLength).default(""),
  source: z.enum(["job-tracker", "chrome-extension", "tailor-page"]),
});

export type TailorJob = z.infer<typeof jobSchema>;
export type JobTailorHandoff = TailorJob & { version: 1; createdAt: number };

/** Cleans untrusted input (an extension link or a form); null if unusable. */
export function parseTailorJob(value: unknown): TailorJob | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const clip = (field: unknown, max: number) =>
    typeof field === "string" ? field.replace(/\u0000/g, "").trim().slice(0, max) : field;
  const result = jobSchema.safeParse({
    ...input,
    role: clip(input.role, 160),
    employer: clip(input.employer, 160),
    advertText: clip(input.advertText, maxAdvertLength),
  });
  if (!result.success) return null;
  return result.data.role || result.data.advertText.length >= minAdvertLength ? result.data : null;
}

export function serializeJobTailorHandoff(job: TailorJob, now = Date.now()) {
  const handoff: JobTailorHandoff = { version: 1, createdAt: now, ...job };
  return JSON.stringify(handoff);
}

export function parseJobTailorHandoff(raw: string | null, now = Date.now()): JobTailorHandoff | null {
  if (!raw || raw.length > 100_000) return null;
  try {
    const value = JSON.parse(raw) as Partial<JobTailorHandoff>;
    if (value.version !== 1 || typeof value.createdAt !== "number") return null;
    if (now - value.createdAt > handoffLifetimeMs || value.createdAt > now + 60_000) return null;
    const job = parseTailorJob(value);
    return job ? { version: 1, createdAt: value.createdAt, ...job } : null;
  } catch {
    return null;
  }
}

// The Chrome extension opens /tailor#job=<base64url JSON>. A URL fragment is
// never sent to the server, so the advert stays out of request logs.
export function encodeJobForHash(job: Pick<TailorJob, "role" | "employer" | "advertText">) {
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, role: job.role, employer: job.employer, advertText: job.advertText }));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return `job=${btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;
}

export function decodeJobFromHash(hash: string): TailorJob | null {
  const match = /^#?job=([A-Za-z0-9_-]{1,200000})$/.exec(hash);
  if (!match) return null;
  try {
    const base64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
    const text = new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
    const value = JSON.parse(text) as Record<string, unknown>;
    if (value.v !== 1) return null;
    return parseTailorJob({ ...value, source: "chrome-extension" });
  } catch {
    return null;
  }
}

/** True when the CV holds the person's own details, so tailoring should copy it rather than fill it in. */
export function cvHasContent(cv: Pick<CvData, "fullName" | "experience">) {
  return Boolean(cv.fullName.trim() || cv.experience.some((item) => item.role.trim()));
}

export function cvEvidenceText(cv: Pick<CvData, "profile" | "skills" | "experience" | "education">) {
  return [
    cv.profile,
    cv.skills,
    ...cv.experience.flatMap((item) => [item.role, item.company, item.bullets]),
    ...cv.education.flatMap((item) => [item.qualification, item.institution, item.details]),
  ].filter(Boolean).join("\n");
}

/** The targeting saved by "Analyse vacancy": the advert plus its top missing keywords. */
export function vacancyTargeting(role: string, jobDescription: string, evidence: string): { targeting: CvTargeting; score: number; missing: number } {
  const analysis = analyseAtsKeywords(jobDescription, evidence);
  return {
    targeting: {
      role,
      jobDescription: jobDescription.trim(),
      priorities: analysis.missing.slice(0, 3).map((item) => ({
        category: item.category === "Skill or tool" ? "vacancy-relevance" : "evidence",
        title: item.term,
        action: `Add this only where your real experience supports it (${item.importance.toLowerCase()} requirement).`,
      })),
    },
    score: analysis.score,
    missing: analysis.missing.length,
  };
}

export function tailoredCvTitle(job: Pick<TailorJob, "role" | "employer">, fallback: string) {
  const title = [job.role, job.employer].map((part) => part.trim()).filter(Boolean).join(" – ");
  return (title || fallback).slice(0, 160);
}

/**
 * Points a CV at one vacancy: target role, advert, and the letter's job and
 * employer. The letter's body is left alone; a copied letter keeps its
 * [employer] prompts so it is reviewed before it is sent.
 */
export function tailorCvForJob(cv: CvData, job: Pick<TailorJob, "role" | "employer" | "advertText">): CvData {
  const role = job.role.trim() || cv.targetRole;
  const next: CvData = { ...cv, targetRole: role };
  if (job.advertText.trim().length >= minAdvertLength) {
    next.targeting = vacancyTargeting(role, job.advertText, cvEvidenceText(cv)).targeting;
  }
  if (cv.coverLetter) {
    next.coverLetter = {
      ...cv.coverLetter,
      jobTitle: job.role.trim() || cv.coverLetter.jobTitle,
      employer: job.employer.trim() || cv.coverLetter.employer,
    };
  }
  return next;
}
