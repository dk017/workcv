import crypto from "crypto";

import mammoth from "mammoth";
import OpenAI from "openai";
import { z } from "zod";

import type { CvData, TemplateId } from "@/lib/editor-data";

const maxExtractedCharacters = 24000;

const parsedExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  bullets: z.array(z.string()),
});

const parsedEducationSchema = z.object({
  qualification: z.string(),
  institution: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  details: z.array(z.string()),
});

const parsedCvSchema = z.object({
  fullName: z.string(),
  targetRole: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
  profile: z.string(),
  skills: z.array(z.string()),
  experience: z.array(parsedExperienceSchema),
  education: z.array(parsedEducationSchema),
});

type ParsedCv = z.infer<typeof parsedCvSchema>;

const parsedCvJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullName: { type: "string" },
    targetRole: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    location: { type: "string" },
    linkedin: { type: "string" },
    profile: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["role", "company", "location", "start", "end", "bullets"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          qualification: { type: "string" },
          institution: { type: "string" },
          location: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          details: { type: "array", items: { type: "string" } },
        },
        required: ["qualification", "institution", "location", "start", "end", "details"],
      },
    },
  },
  required: [
    "fullName",
    "targetRole",
    "email",
    "phone",
    "location",
    "linkedin",
    "profile",
    "skills",
    "experience",
    "education",
  ],
} as const;

export class CvImportError extends Error {
  constructor(
    message: string,
    public readonly status = 400
  ) {
    super(message);
  }
}

function cleanText(value: string) {
  return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function extractPdfText(buffer: Buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const documentTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const document = await documentTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    pages.push(pageText);
  }

  return cleanText(pages.join("\n\n"));
}

async function extractDocxText(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return cleanText(result.value);
}

export async function extractCvText(buffer: Buffer, fileName: string, fileType: string) {
  const lowerName = fileName.toLowerCase();
  const isPdf = fileType === "application/pdf" || lowerName.endsWith(".pdf");
  const isDocx =
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx");

  if (isPdf) return extractPdfText(buffer);
  if (isDocx) return extractDocxText(buffer);

  throw new CvImportError("Upload a PDF or DOCX CV.");
}

function compactLines(values: string[], limit: number) {
  return values
    .map((value) => cleanText(value))
    .filter(Boolean)
    .slice(0, limit);
}

function toEditorData(parsed: ParsedCv, template: TemplateId): CvData {
  const experience = parsed.experience.slice(0, 8).map((item) => ({
    id: crypto.randomUUID(),
    role: cleanText(item.role),
    company: cleanText(item.company),
    location: cleanText(item.location),
    start: cleanText(item.start),
    end: cleanText(item.end),
    bullets: compactLines(item.bullets, 6).join("\n"),
  }));

  const education = parsed.education.slice(0, 6).map((item) => ({
    id: crypto.randomUUID(),
    qualification: cleanText(item.qualification),
    institution: cleanText(item.institution),
    location: cleanText(item.location),
    start: cleanText(item.start),
    end: cleanText(item.end),
    details: compactLines(item.details, 4).join("\n"),
  }));

  return {
    template,
    fullName: cleanText(parsed.fullName),
    targetRole: cleanText(parsed.targetRole),
    email: cleanText(parsed.email),
    phone: cleanText(parsed.phone),
    location: cleanText(parsed.location),
    linkedin: cleanText(parsed.linkedin),
    profile: cleanText(parsed.profile),
    skills: compactLines(parsed.skills, 18).join("\n"),
    experience:
      experience.length > 0
        ? experience
        : [
            {
              id: crypto.randomUUID(),
              role: "",
              company: "",
              location: "",
              start: "",
              end: "",
              bullets: "",
            },
          ],
    education:
      education.length > 0
        ? education
        : [
            {
              id: crypto.randomUUID(),
              qualification: "",
              institution: "",
              location: "",
              start: "",
              end: "",
              details: "",
            },
          ],
  };
}

export async function parseCvTextWithAi(text: string, template: TemplateId) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new CvImportError("CV import is not configured yet.", 503);
  }

  const sourceText = cleanText(text).slice(0, maxExtractedCharacters);
  if (sourceText.length < 80) {
    throw new CvImportError("We could not read enough text from that CV. Try a clearer PDF or DOCX file.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let content: string | null | undefined;
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "workcv_imported_cv",
          strict: true,
          schema: parsedCvJsonSchema,
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You convert existing CV text into structured fields for a UK CV builder. Preserve facts from the source. Do not invent employers, dates, qualifications, contact details, metrics, links, or awards. Omit photo, date of birth, nationality, gender, marital status, and full address details. Use concise UK English. If a field is not present, return an empty string or empty array.",
        },
        {
          role: "user",
          content: `Parse this CV into WorkCV editor fields. Keep bullet points action-focused but faithful to the source. Infer a short targetRole only when the CV clearly states or strongly implies one.\n\n${sourceText}`,
        },
      ],
    });

    content = completion.choices[0]?.message.content;
  } catch (error) {
    console.error("workcv_import_openai_error", {
      model,
      status: typeof error === "object" && error && "status" in error ? error.status : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
    throw new CvImportError("AI CV import is temporarily unavailable. Please try again shortly.", 502);
  }

  if (!content) {
    throw new CvImportError("AI could not read the CV details. Please try another PDF or DOCX file.", 502);
  }

  let parsed: ParsedCv;
  try {
    parsed = parsedCvSchema.parse(JSON.parse(content));
  } catch (error) {
    console.error("workcv_import_ai_output_error", {
      message: error instanceof Error ? error.message : String(error),
    });
    throw new CvImportError("AI returned an unreadable CV import. Please try again.", 502);
  }

  return {
    cv: toEditorData(parsed, template),
    extractedCharacters: sourceText.length,
  };
}
