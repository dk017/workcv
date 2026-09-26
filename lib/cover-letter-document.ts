import { lines, type CoverLetter, type CvData, type TemplateId } from "./editor-data.ts";

// One guided box per paragraph, following the National Careers Service and
// Prospects four-part structure. Extra paragraphs beyond these are "Additional".
export const coverLetterParagraphGuides = [
  {
    label: "Opening",
    purpose: "Name the job, where you saw it and one genuine reason you want it.",
    example: "I am applying for the Customer Service Assistant role advertised on Indeed. Your focus on first-contact resolution matches the way I like to work.",
  },
  {
    label: "Your strongest evidence",
    purpose: "Pick the requirement that matters most in the advert and prove it with a real example.",
    example: "At North Street Books I handle around 60 customer queries a day in person and by phone, resolving most without escalation.",
  },
  {
    label: "More evidence and fit",
    purpose: "Cover a second key requirement and what you would bring to the team.",
    example: "I also keep daily stock and till records accurate, which would support your team's service standards during busy periods.",
  },
  {
    label: "Closing",
    purpose: "Confirm your interest, mention interview availability if useful, and thank them.",
    example: "I would welcome the chance to discuss how I could help your team. I am available for interview at short notice. Thank you for considering my application.",
  },
] as const;

export const COVER_LETTER_TARGET_WORDS = { min: 250, max: 400, onePageLimit: 450 } as const;

export function createCoverLetter(cv: CvData): CoverLetter {
  return {
    jobTitle: (cv.targeting?.role || cv.targetRole || "").trim().slice(0, 160),
    employer: "",
    reference: "",
    recipientName: "",
    greeting: "hiring-manager",
    employerAddress: "",
    includeDate: true,
    paragraphs: ["", "", "", ""],
  };
}

export function coverLetterFor(cv: CvData): CoverLetter {
  return cv.coverLetter || createCoverLetter(cv);
}

export function coverLetterGreeting(letter: CoverLetter) {
  const name = letter.recipientName.trim();
  if (name) return `Dear ${name},`;
  return letter.greeting === "sir-madam" ? "Dear Sir or Madam," : "Dear Hiring Manager,";
}

// UK convention: "Yours sincerely" when you address a named person, otherwise
// "Yours faithfully".
export function coverLetterSignOff(letter: CoverLetter) {
  return letter.recipientName.trim() ? "Yours sincerely," : "Yours faithfully,";
}

export function coverLetterSubject(letter: CoverLetter) {
  const jobTitle = letter.jobTitle.trim();
  if (!jobTitle) return "";
  const reference = letter.reference.trim();
  return `Re: ${jobTitle}${reference ? ` (ref. ${reference})` : ""}`;
}

export function formatUkLetterDate(date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}

export function coverLetterBody(letter: CoverLetter) {
  return letter.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function hasCoverLetterContent(cv: CvData) {
  return Boolean(cv.coverLetter && coverLetterBody(cv.coverLetter).length > 0);
}

export function recipientBlock(letter: CoverLetter) {
  return [letter.recipientName.trim(), letter.employer.trim(), ...lines(letter.employerAddress)].filter(Boolean);
}

export function countLetterWords(value: string) {
  return value.trim().match(/[A-Za-z0-9£][A-Za-z0-9'’£.,%-]*/g)?.length ?? 0;
}

// The same text a user would paste into an application form or email body:
// no address block, just the letter.
export function coverLetterPlainText(cv: CvData) {
  const letter = coverLetterFor(cv);
  return [
    coverLetterGreeting(letter),
    "",
    ...coverLetterBody(letter).flatMap((paragraph) => [paragraph, ""]),
    coverLetterSignOff(letter),
    cv.fullName.trim(),
  ].join("\n").trim();
}

export function coverLetterStyle(cv: CvData): TemplateId {
  return cv.layoutPreset && cv.layoutPreset !== "standard" ? "classic" : cv.template;
}

export type CoverLetterCheck = { severity: "fix" | "tip"; message: string };

function normalise(value: string) {
  return value.toLocaleLowerCase("en-GB").replace(/[^a-z0-9]+/g, " ").trim();
}

export function coverLetterChecks(cv: CvData): CoverLetterCheck[] {
  const letter = coverLetterFor(cv);
  const body = coverLetterBody(letter).join("\n\n");
  const checks: CoverLetterCheck[] = [];
  if (!body) return [{ severity: "fix", message: "Write at least your opening paragraph." }];

  if (/\[[^\]\n]{1,120}\]/.test(body)) {
    checks.push({ severity: "fix", message: "Replace the remaining [bracketed] prompts with your own details." });
  }
  if (!cv.fullName.trim()) {
    checks.push({ severity: "fix", message: "Add your name in the Profile tab so the letter can be signed." });
  }
  if (![cv.email, cv.phone].some((value) => value.trim())) {
    checks.push({ severity: "fix", message: "Add an email or phone number in the Profile tab so the employer can reply." });
  }
  const normalisedBody = normalise(body);
  if (letter.employer.trim() && !normalisedBody.includes(normalise(letter.employer))) {
    checks.push({ severity: "tip", message: `Mention ${letter.employer.trim()} by name, ideally in your opening.` });
  }
  if (letter.jobTitle.trim() && !normalisedBody.includes(normalise(letter.jobTitle))) {
    checks.push({ severity: "tip", message: `Name the ${letter.jobTitle.trim()} role in your opening.` });
  }
  const words = countLetterWords(body);
  if (words > COVER_LETTER_TARGET_WORDS.onePageLimit) {
    checks.push({ severity: "tip", message: `At ${words} words the letter may run past one page. Aim for ${COVER_LETTER_TARGET_WORDS.min}–${COVER_LETTER_TARGET_WORDS.max}.` });
  } else if (words < 150) {
    checks.push({ severity: "tip", message: `At ${words} words the letter is quite short. Most UK letters are ${COVER_LETTER_TARGET_WORDS.min}–${COVER_LETTER_TARGET_WORDS.max} words.` });
  }
  return checks;
}

// Split a free-text letter (for example from the application pack) into body
// paragraphs, dropping its greeting, sign-off and signature lines.
export function splitLetterText(text: string, fullName = "") {
  const name = fullName.trim().toLocaleLowerCase("en-GB");
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !/^dear\b/i.test(line) && !/^yours\s+(sincerely|faithfully)/i.test(line) && !/^(kind|best)\s+regards/i.test(line) && line.toLocaleLowerCase("en-GB") !== name)
      .join(" "))
    .filter(Boolean)
    .slice(0, 6)
    .map((paragraph) => paragraph.slice(0, 2_500));
}
