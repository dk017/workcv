import { z } from "zod";

// Job application tracker: browser-only storage, CSV import/export and summaries.
// Pure functions so the logic can be tested without a browser.

export const trackerStorageKey = "workcv-job-tracker-v1";
export const jobPackPrefillKey = "workcv-job-pack-prefill-v1";
export const maxTrackedJobs = 300;
export const passOfferThreshold = 3;

export const jobStatuses = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "unsuccessful", label: "Unsuccessful" },
  { id: "withdrawn", label: "Withdrawn" },
] as const;
export type JobStatus = (typeof jobStatuses)[number]["id"];

export const jobSources = [
  "Indeed",
  "Reed",
  "Totaljobs",
  "CV-Library",
  "LinkedIn",
  "NHS Jobs",
  "Civil Service Jobs",
  "Find a job (GOV.UK)",
  "Company website",
  "Recruitment agency",
  "Referral",
  "Other",
] as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Invalid date");
const optionalText = (max: number) => z.string().trim().max(max).optional();

export const trackedJobSchema = z.object({
  id: z.string().min(1).max(64),
  role: z.string().trim().min(1).max(120),
  employer: z.string().trim().min(1).max(120),
  status: z.enum(jobStatuses.map((status) => status.id) as [JobStatus, ...JobStatus[]]),
  location: optionalText(120),
  salary: optionalText(80),
  url: optionalText(2000),
  source: optionalText(60),
  closingDate: isoDate.optional(),
  appliedDate: isoDate.optional(),
  nextAction: optionalText(160),
  nextActionDate: isoDate.optional(),
  contact: optionalText(120),
  notes: optionalText(2000),
  advertText: optionalText(12_000), // Job Application Pack accepts up to 12,000
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});
export type TrackedJob = z.infer<typeof trackedJobSchema>;

// Drop empty optional strings so stored data stays compact and comparisons are simple.
export function cleanJob(job: TrackedJob): TrackedJob {
  const entries = Object.entries(job).filter(([, value]) => value !== "" && value !== undefined);
  return Object.fromEntries(entries) as TrackedJob;
}

export function parseTrackerState(raw: string | null): { jobs: TrackedJob[]; dropped: number } {
  if (!raw) return { jobs: [], dropped: 0 };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { jobs: [], dropped: 0 };
  }
  const list = value && typeof value === "object" && Array.isArray((value as { jobs?: unknown }).jobs)
    ? ((value as { jobs: unknown[] }).jobs)
    : [];
  const jobs: TrackedJob[] = [];
  let dropped = 0;
  for (const item of list) {
    const parsed = trackedJobSchema.safeParse(item);
    if (parsed.success && jobs.length < maxTrackedJobs) jobs.push(cleanJob(parsed.data));
    else dropped += 1;
  }
  return { jobs, dropped };
}

export function serializeTrackerState(jobs: TrackedJob[]) {
  return JSON.stringify({ version: 1, jobs: jobs.slice(0, maxTrackedJobs) });
}

export function isSafeHttpUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function statusLabel(status: JobStatus) {
  return jobStatuses.find((item) => item.id === status)?.label ?? status;
}

// ---- Dates (UK weeks start on Monday) ----

export function todayIso(now = new Date()) {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function dayNumber(iso: string) {
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

export function daysBetween(fromIso: string, toIso: string) {
  return dayNumber(toIso) - dayNumber(fromIso);
}

function weekStart(iso: string) {
  const day = dayNumber(iso);
  const weekday = (new Date(day * 86_400_000).getUTCDay() + 6) % 7; // Monday = 0
  return day - weekday;
}

const activeStatuses: JobStatus[] = ["saved", "applied", "interview", "offer"];

export type JobUrgency = { kind: "overdue" | "due" | "closing"; label: string } | null;

export function jobUrgency(job: TrackedJob, today: string): JobUrgency {
  if (!activeStatuses.includes(job.status)) return null;
  if (job.nextActionDate) {
    const days = daysBetween(today, job.nextActionDate);
    if (days < 0) return { kind: "overdue", label: `Follow-up ${-days} day${days === -1 ? "" : "s"} overdue` };
    if (days === 0) return { kind: "due", label: "Follow-up due today" };
  }
  if (job.status === "saved" && job.closingDate) {
    const days = daysBetween(today, job.closingDate);
    if (days >= 0 && days <= 3) {
      return { kind: "closing", label: days === 0 ? "Closes today" : `Closes in ${days} day${days === 1 ? "" : "s"}` };
    }
  }
  return null;
}

export function summarizeJobs(jobs: TrackedJob[], today: string) {
  const thisWeek = weekStart(today);
  return {
    total: jobs.length,
    appliedThisWeek: jobs.filter((job) => job.appliedDate && weekStart(job.appliedDate) === thisWeek).length,
    active: jobs.filter((job) => activeStatuses.includes(job.status)).length,
    interviews: jobs.filter((job) => job.status === "interview").length,
    followUpsDue: jobs.filter((job) => {
      const urgency = jobUrgency(job, today);
      return urgency?.kind === "overdue" || urgency?.kind === "due";
    }).length,
  };
}

// Most urgent first: overdue, due today, closing soon, then by next action date and recency.
export function sortJobs(jobs: TrackedJob[], today: string) {
  const rank = (job: TrackedJob) => {
    const urgency = jobUrgency(job, today);
    return urgency ? { overdue: 0, due: 1, closing: 2 }[urgency.kind] : 3;
  };
  return [...jobs].sort((a, b) => {
    const byUrgency = rank(a) - rank(b);
    if (byUrgency) return byUrgency;
    if (a.nextActionDate && b.nextActionDate && a.nextActionDate !== b.nextActionDate) {
      return a.nextActionDate < b.nextActionDate ? -1 : 1;
    }
    if (a.nextActionDate !== b.nextActionDate) return a.nextActionDate ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}

// ---- CSV ----

const csvColumns: Array<{ header: string; key: keyof TrackedJob }> = [
  { header: "Job title", key: "role" },
  { header: "Employer", key: "employer" },
  { header: "Status", key: "status" },
  { header: "Date applied", key: "appliedDate" },
  { header: "Closing date", key: "closingDate" },
  { header: "Next action", key: "nextAction" },
  { header: "Next action date", key: "nextActionDate" },
  { header: "Location", key: "location" },
  { header: "Salary", key: "salary" },
  { header: "Where found", key: "source" },
  { header: "Job advert link", key: "url" },
  { header: "Contact", key: "contact" },
  { header: "Notes", key: "notes" },
  { header: "Job advert text", key: "advertText" },
];

// Spreadsheet apps treat cells starting with these characters as formulas.
function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function jobsToCsv(jobs: TrackedJob[]) {
  const rows = jobs.map((job) =>
    csvColumns
      .map(({ key }) => {
        const value = job[key];
        if (value === undefined) return "";
        return csvCell(key === "status" ? statusLabel(value as JobStatus) : String(value));
      })
      .join(","),
  );
  // BOM so Excel opens UTF-8 (e.g. £) correctly.
  return `﻿${[csvColumns.map(({ header }) => header).join(","), ...rows].join("\r\n")}\r\n`;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const input = text.replace(/^﻿/, "");
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((value) => value.trim() !== ""));
}

const headerAliases: Record<string, keyof TrackedJob> = {
  "job title": "role", role: "role", position: "role",
  employer: "employer", company: "employer",
  status: "status",
  "date applied": "appliedDate", applied: "appliedDate",
  "closing date": "closingDate", deadline: "closingDate",
  "next action": "nextAction", "next step": "nextAction",
  "next action date": "nextActionDate", "follow-up date": "nextActionDate", "follow up date": "nextActionDate",
  location: "location",
  salary: "salary",
  "where found": "source", source: "source",
  "job advert link": "url", link: "url", url: "url",
  contact: "contact",
  notes: "notes",
  "job advert text": "advertText", "job description": "advertText",
};

function importDate(value: string) {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return isoDate.safeParse(trimmed).success ? trimmed : undefined;
  // UK spreadsheets usually use DD/MM/YYYY.
  const uk = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!uk) return undefined;
  const iso = `${uk[3]}-${uk[2].padStart(2, "0")}-${uk[1].padStart(2, "0")}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso ? iso : undefined;
}

function importStatus(value: string): JobStatus {
  const lower = value.trim().toLowerCase();
  const match = jobStatuses.find((status) => status.id === lower || status.label.toLowerCase() === lower);
  if (match) return match.id;
  if (/reject|declin/.test(lower)) return "unsuccessful";
  if (/interview/.test(lower)) return "interview";
  if (/offer/.test(lower)) return "offer";
  if (/withdr/.test(lower)) return "withdrawn";
  if (/appl|sent|submit/.test(lower)) return "applied";
  return "saved";
}

export function csvToJobs(text: string, makeId: () => string, now = Date.now()) {
  const rows = parseCsv(text);
  if (!rows.length) return { jobs: [] as TrackedJob[], skipped: 0, error: "The file is empty." };
  const keys = rows[0].map((header) => headerAliases[header.trim().toLowerCase()]);
  if (!keys.includes("role") || !keys.includes("employer")) {
    return { jobs: [] as TrackedJob[], skipped: 0, error: "The file needs 'Job title' and 'Employer' columns." };
  }
  const jobs: TrackedJob[] = [];
  let skipped = 0;
  for (const cells of rows.slice(1)) {
    const draft: Record<string, unknown> = { id: makeId(), status: "saved", createdAt: now, updatedAt: now };
    keys.forEach((key, index) => {
      if (!key) return;
      // Undo the formula guard added on export.
      const value = (cells[index] ?? "").replace(/^'(?=[=+\-@])/, "").trim();
      if (!value) return;
      if (key === "status") draft.status = importStatus(value);
      else if (key === "appliedDate" || key === "closingDate" || key === "nextActionDate") {
        const date = importDate(value);
        if (date) draft[key] = date;
      } else draft[key] = value;
    });
    const parsed = trackedJobSchema.safeParse(draft);
    if (parsed.success) jobs.push(cleanJob(parsed.data));
    else skipped += 1;
  }
  return { jobs, skipped, error: "" };
}

// Importing the same file twice should not duplicate jobs: match on title, employer and date applied.
export function mergeImportedJobs(existing: TrackedJob[], imported: TrackedJob[]) {
  const keyOf = (job: TrackedJob) => [job.role, job.employer, job.appliedDate ?? ""].map((part) => part.trim().toLowerCase()).join("|");
  const seen = new Set(existing.map(keyOf));
  const added: TrackedJob[] = [];
  let duplicates = 0;
  for (const job of imported) {
    const key = keyOf(job);
    if (seen.has(key)) {
      duplicates += 1;
      continue;
    }
    seen.add(key);
    added.push(job);
  }
  return { added: added.slice(0, Math.max(0, maxTrackedJobs - existing.length)), duplicates, overLimit: Math.max(0, added.length - (maxTrackedJobs - existing.length)) };
}

// ---- Hand a tracked job to the Job Application Pack ----

export type JobPackPrefill = { targetRole: string; company: string; jobDescription: string };

export function buildJobPackPrefill(job: TrackedJob): JobPackPrefill {
  return {
    targetRole: job.role,
    company: job.employer,
    jobDescription: job.advertText ?? "",
  };
}

export function readJobPackPrefill(raw: string | null): JobPackPrefill | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<JobPackPrefill>;
    if (typeof value.targetRole !== "string" || typeof value.company !== "string") return null;
    return {
      targetRole: value.targetRole.slice(0, 120),
      company: value.company.slice(0, 120),
      jobDescription: typeof value.jobDescription === "string" ? value.jobDescription.slice(0, 12_000) : "",
    };
  } catch {
    return null;
  }
}
