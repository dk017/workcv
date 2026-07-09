import { z } from "zod";

import {
  createBlankCv,
  type CvData,
  type TemplateId,
} from "./editor-data.ts";

export const CV_MAX_PAYLOAD_BYTES = 100 * 1024;
export const CV_MAX_EXPERIENCE_ITEMS = 30;
export const CV_MAX_EDUCATION_ITEMS = 30;
export const CV_MAX_SKILLS = 50;
export const CV_MAX_BULLETS_PER_ENTRY = 50;

const shortText = z.string().max(160);
const dateText = z.string().max(40);
const idText = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);

function lineList(maxLines: number, maxLineLength: number, maxLength: number) {
  return z
    .string()
    .max(maxLength)
    .transform((value, context) => {
      const normalised = value.replace(/\r\n?/g, "\n");
      const lines = normalised.split("\n");
      if (lines.length > maxLines) {
        context.addIssue({
          code: "custom",
          message: `Must contain no more than ${maxLines} lines`,
        });
        return z.NEVER;
      }
      if (lines.some((line) => line.length > maxLineLength)) {
        context.addIssue({
          code: "custom",
          message: `Each line must contain no more than ${maxLineLength} characters`,
        });
        return z.NEVER;
      }
      return normalised;
    });
}

export const experienceItemSchema = z
  .object({
    id: idText,
    role: shortText,
    company: shortText,
    location: shortText,
    start: dateText,
    end: dateText,
    bullets: lineList(CV_MAX_BULLETS_PER_ENTRY, 1_000, 20_000),
  })
  .strict();

export const educationItemSchema = z
  .object({
    id: idText,
    qualification: shortText,
    institution: shortText,
    location: shortText,
    start: dateText,
    end: dateText,
    details: z.string().max(10_000),
  })
  .strict();

const targetingSchema = z
  .object({
    role: shortText,
    jobDescription: z.string().max(30_000),
    priorities: z
      .array(
        z
          .object({
            category: z.enum([
              "vacancy-relevance",
              "evidence",
              "role-clarity",
              "structure",
              "completeness",
            ]),
            title: z.string().max(200),
            action: z.string().max(1_000),
          })
          .strict(),
      )
      .max(10),
  })
  .strict();

export const cvDataSchema = z
  .object({
    template: z.enum(["classic", "modern", "compact"]),
    fullName: shortText,
    targetRole: shortText,
    email: z.string().max(254),
    phone: z.string().max(80),
    location: shortText,
    linkedin: z.string().max(500),
    profile: z.string().max(5_000),
    skills: lineList(CV_MAX_SKILLS, 200, 10_000),
    experience: z.array(experienceItemSchema).max(CV_MAX_EXPERIENCE_ITEMS),
    education: z.array(educationItemSchema).max(CV_MAX_EDUCATION_ITEMS),
    targeting: targetingSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const ids = new Set<string>();
    [...value.experience, ...value.education].forEach((item) => {
      if (ids.has(item.id)) {
        context.addIssue({
          code: "custom",
          path: ["experience"],
          message: "Entry IDs must be unique",
        });
      }
      ids.add(item.id);
    });
  });

export class CvValidationError extends Error {
  readonly issues: z.core.$ZodIssue[];

  constructor(message: string, issues: z.core.$ZodIssue[] = []) {
    super(message);
    this.name = "CvValidationError";
    this.issues = issues;
  }
}

function assertPayloadSize(input: unknown) {
  let encoded: string;
  try {
    encoded = JSON.stringify(input);
  } catch {
    throw new CvValidationError("CV data must be valid JSON.");
  }
  if (Buffer.byteLength(encoded, "utf8") > CV_MAX_PAYLOAD_BYTES) {
    throw new CvValidationError(
      `CV data exceeds the ${CV_MAX_PAYLOAD_BYTES / 1024}KB limit.`,
    );
  }
}

export function parseCvData(input: unknown): CvData {
  assertPayloadSize(input);
  const result = cvDataSchema.safeParse(input);
  if (!result.success) {
    throw new CvValidationError("CV data is invalid.", result.error.issues);
  }
  return result.data;
}

function safeString(value: unknown, max: number) {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").slice(0, max)
    : "";
}

function safeId(value: unknown, prefix: string) {
  if (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 100 &&
    /^[a-zA-Z0-9_-]+$/.test(value)
  ) {
    return value;
  }
  return `${prefix}-${crypto.randomUUID()}`;
}

function uniqueId(value: unknown, prefix: string, ids: Set<string>) {
  let id = safeId(value, prefix);
  while (ids.has(id)) id = `${prefix}-${crypto.randomUUID()}`;
  ids.add(id);
  return id;
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function limitedLines(value: unknown, count: number, lineLength: number, total: number) {
  return safeString(value, total)
    .split("\n")
    .slice(0, count)
    .map((line) => line.slice(0, lineLength))
    .join("\n");
}

export function repairCvData(
  input: unknown,
  fallbackTemplate: TemplateId = "classic",
): CvData {
  const source = objectValue(input);
  const blank = createBlankCv(fallbackTemplate);
  const template = ["classic", "modern", "compact"].includes(String(source.template))
    ? (source.template as TemplateId)
    : fallbackTemplate;

  const experienceSource = Array.isArray(source.experience)
    ? source.experience.filter((item) => item && typeof item === "object")
    : [];
  const educationSource = Array.isArray(source.education)
    ? source.education.filter((item) => item && typeof item === "object")
    : [];
  const ids = new Set<string>();

  const repaired: CvData = {
    ...blank,
    template,
    fullName: safeString(source.fullName, 160),
    targetRole: safeString(source.targetRole, 160),
    email: safeString(source.email, 254),
    phone: safeString(source.phone, 80),
    location: safeString(source.location, 160),
    linkedin: safeString(source.linkedin, 500),
    profile: safeString(source.profile, 5_000),
    skills: limitedLines(source.skills, CV_MAX_SKILLS, 200, 10_000),
    experience: experienceSource.slice(0, CV_MAX_EXPERIENCE_ITEMS).map((value) => {
      const item = objectValue(value);
      return {
        id: uniqueId(item.id, "exp", ids),
        role: safeString(item.role, 160),
        company: safeString(item.company, 160),
        location: safeString(item.location, 160),
        start: safeString(item.start, 40),
        end: safeString(item.end, 40),
        bullets: limitedLines(
          item.bullets,
          CV_MAX_BULLETS_PER_ENTRY,
          1_000,
          20_000,
        ),
      };
    }),
    education: educationSource.slice(0, CV_MAX_EDUCATION_ITEMS).map((value) => {
      const item = objectValue(value);
      return {
        id: uniqueId(item.id, "edu", ids),
        qualification: safeString(item.qualification, 160),
        institution: safeString(item.institution, 160),
        location: safeString(item.location, 160),
        start: safeString(item.start, 40),
        end: safeString(item.end, 40),
        details: safeString(item.details, 10_000),
      };
    }),
  };

  if (repaired.experience.length === 0) repaired.experience = blank.experience;
  if (repaired.education.length === 0) repaired.education = blank.education;

  const targetingResult = targetingSchema.safeParse(source.targeting);
  if (targetingResult.success) repaired.targeting = targetingResult.data;

  return parseCvData(repaired);
}

export function formatCvValidationError(error: CvValidationError) {
  if (error.issues.length === 0) return error.message;
  const issue = error.issues[0];
  const field = issue.path.length > 0 ? issue.path.join(".") : "CV data";
  return `${field}: ${issue.message}`;
}
