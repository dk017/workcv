import type { z } from "zod";

import {
  CV_MAX_PAYLOAD_BYTES,
  type CvValidationError,
  cvDataSchema,
} from "./cv-schema.ts";

// The editor checks a CV against the same schema as PUT /api/cv/current before
// saving, so a field the server would reject is named in plain English instead
// of failing every save with a generic error the user cannot act on.

export type CvEditorTab =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "template"
  | "cover-letter";

export type CvSaveIssue = {
  /** Path without list positions, e.g. "experience.bullets". Safe for analytics. */
  field: string;
  message: string;
};

const sections: Record<string, { label: string; tab: CvEditorTab | null; numbered?: boolean }> = {
  template: { label: "Template", tab: "template" },
  fullName: { label: "Full name", tab: "profile" },
  targetRole: { label: "Target role", tab: "profile" },
  email: { label: "Email", tab: "profile" },
  phone: { label: "Phone", tab: "profile" },
  location: { label: "Location", tab: "profile" },
  linkedin: { label: "LinkedIn", tab: "profile" },
  profile: { label: "Profile summary", tab: "profile" },
  skills: { label: "Skills", tab: "skills" },
  experience: { label: "Experience", tab: "experience", numbered: true },
  education: { label: "Education", tab: "education", numbered: true },
  applicationPack: { label: "Application pack", tab: "experience" },
  layoutPreset: { label: "Layout", tab: "template" },
  sectionOrder: { label: "Section order", tab: "template" },
  additionalSections: { label: "Extra sections", tab: "template" },
  coverLetter: { label: "Cover letter", tab: "cover-letter" },
  targeting: { label: "Job advert", tab: null },
};

const parts: Record<string, string> = {
  role: "job title",
  company: "employer",
  location: "location",
  start: "start date",
  end: "end date",
  bullets: "bullet points",
  qualification: "qualification",
  institution: "institution",
  details: "details",
  jobTitle: "job title",
  employer: "employer",
  reference: "reference",
  recipientName: "recipient name",
  employerAddress: "employer address",
  paragraphs: "paragraphs",
  projects: "projects",
  certifications: "certifications",
  volunteering: "volunteering",
  languages: "languages",
  jobDescription: "advert text",
  coverLetter: "cover letter",
  thankYouEmail: "thank-you email",
  originalCvText: "original CV text",
};

export function tabForCvField(field: string): CvEditorTab | null {
  return sections[field.split(".")[0]]?.tab ?? null;
}

function labelFor(path: PropertyKey[]) {
  const [top, ...rest] = path;
  const section = sections[String(top)];
  if (!section) return "CV";
  let label = section.label;
  if (section.numbered && typeof rest[0] === "number") label += ` ${rest[0] + 1}`;
  const part = rest.find((item): item is string => typeof item === "string");
  return part ? `${label} – ${parts[part] ?? part}` : label;
}

function count(value: unknown) {
  return Number(value).toLocaleString("en-GB");
}

export function describeCvIssue(issue: z.core.$ZodIssue): CvSaveIssue {
  const field = issue.path.filter((item) => typeof item === "string").join(".").slice(0, 80) || "cv";
  const label = labelFor(issue.path);
  const params = issue.code === "custom" ? (issue.params as { limit?: string; maximum?: number } | undefined) : undefined;

  let message: string;
  if (issue.code === "too_big" && issue.origin === "string") {
    message = `${label} is too long. Keep it under ${count(issue.maximum)} characters.`;
  } else if (issue.code === "too_big" && issue.origin === "array") {
    message = `${label} has too many entries. The maximum is ${count(issue.maximum)}.`;
  } else if (params?.limit === "lines") {
    message = `${label} has more than ${count(params.maximum)} lines. Remove blank or extra lines.`;
  } else if (params?.limit === "line_length") {
    message =
      field === "skills"
        ? `Skills has a line over ${count(params.maximum)} characters. Put each skill on its own line.`
        : `${label} has a line over ${count(params.maximum)} characters. Split it into shorter lines.`;
  } else {
    message = `${label}: ${issue.message}`;
  }
  return { field, message: `Not saved. ${message}` };
}

const tooLarge: CvSaveIssue = {
  field: "size",
  message: "Not saved. This CV is too large. Shorten the job advert, cover letter or application pack text.",
};

export function describeCvValidationError(error: CvValidationError): CvSaveIssue {
  return error.issues[0] ? describeCvIssue(error.issues[0]) : tooLarge;
}

/** The first reason the server would reject this CV, or null if it would accept it. */
export function findCvSaveIssue(cv: unknown): CvSaveIssue | null {
  const encoded = JSON.stringify(cv);
  if (new TextEncoder().encode(encoded).length > CV_MAX_PAYLOAD_BYTES) return tooLarge;
  // Validate what the server will receive, after JSON drops undefined values.
  const result = cvDataSchema.safeParse(JSON.parse(encoded));
  return result.success ? null : describeCvIssue(result.error.issues[0]);
}
