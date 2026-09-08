import type { CvData, EducationItem, ExperienceItem } from "@/lib/editor-data";

export type ToolCheckStatus = "good" | "review" | "warning";

export type ToolCheck = {
  id: string;
  label: string;
  status: ToolCheckStatus;
  detail: string;
};

export type CvFormatAnalysis = {
  wordCount: number;
  score: number;
  checks: ToolCheck[];
  summary: string;
};

export type FirstJobInput = {
  fullName: string;
  targetRole: string;
  education: string;
  projects: string;
  volunteering: string;
  strengths: string;
  availability: string;
};

export type FirstJobDraft = {
  profile: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  patch: Partial<Pick<CvData, "fullName" | "targetRole" | "profile" | "skills" | "experience" | "education">>;
};

export type TransferableInput = {
  previousRole: string;
  experience: string;
  targetRole: string;
};

export type TransferableMatch = {
  skill: string;
  evidence: string;
  usefulFor: string[];
  source: string;
};

export type TransferableResult = {
  matches: TransferableMatch[];
  profile: string;
  skills: string;
  patch: Partial<Pick<CvData, "targetRole" | "profile" | "skills">>;
};

export type ShortenResult = {
  originalWords: number;
  shortenedWords: number;
  removedWords: number;
  shortenedText: string;
  suggestions: string[];
};

export type ConversionResult = {
  convertedText: string;
  changes: string[];
  omittedLines: string[];
  wordCount: number;
};

export type GapInput = {
  reason: string;
  start: string;
  end: string;
  learning: string;
  targetRole: string;
  readiness: string;
};

export type GapResult = {
  explanation: string;
  profileLine: string;
  suggestions: string[];
  patch: Partial<Pick<CvData, "targetRole" | "profile">>;
};

const wordPattern = /\b[A-Za-z0-9]+(?:['’/-][A-Za-z0-9]+)*\b/g;
const datePattern = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}[/-]\d{1,2})?\s*\b(?:19|20)\d{2}\b/i;

export function countToolWords(value: string) {
  return value.match(wordPattern)?.length || 0;
}

function hasHeading(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function check(
  id: string,
  label: string,
  status: ToolCheckStatus,
  detail: string,
): ToolCheck {
  return { id, label, status, detail };
}

export function analyseCvFormat(text: string): CvFormatAnalysis {
  const clean = text.trim();
  const lines = clean.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const lower = clean.toLowerCase();
  const bullets = lines.filter((line) => /^[-•*▪◦]\s+/.test(line));
  const numberedBullets = lines.filter((line) => /^\d+[.)]\s+/.test(line));
  const longLines = lines.filter((line) => line.length > 180);
  const checks: ToolCheck[] = [
    check(
      "contact",
      "Contact details",
      /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(clean) && /(?:\+?44|0)\s*\d[\d\s().-]{7,}/.test(clean)
        ? "good"
        : "review",
      /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(clean)
        ? "An email address is visible. Add a reachable phone number if the employer expects one."
        : "Add an email address and a reachable phone number near your name.",
    ),
    check(
      "headings",
      "Standard section headings",
      [
        hasHeading(lower, [/\b(profile|personal profile|summary|about me)\b/]),
        hasHeading(lower, [/\b(experience|employment|work history|career history)\b/]),
        hasHeading(lower, [/\b(education|qualifications|training)\b/]),
        hasHeading(lower, [/\b(skills|key skills|core skills|competenc(?:ies|e))\b/]),
      ].filter(Boolean).length >= 3
        ? "good"
        : "review",
      "Use familiar headings such as Profile, Experience, Education and Key Skills so a recruiter can scan the structure quickly.",
    ),
    check(
      "dates",
      "Clear dates",
      datePattern.test(clean) && /(?:19|20)\d{2}\s*(?:-|–|to)\s*(?:Present|Current|(?:19|20)\d{2})/i.test(clean)
        ? "good"
        : "review",
      datePattern.test(clean)
        ? "Dates are present. Check that every role and qualification has a consistent month-and-year or year range."
        : "Add clear dates to each role and qualification; avoid unexplained date abbreviations.",
    ),
    check(
      "bullets",
      "Scannable evidence",
      bullets.length + numberedBullets.length >= 3 ? "good" : "review",
      bullets.length + numberedBullets.length >= 3
        ? `${bullets.length + numberedBullets.length} bullet lines found. Keep each one focused on an action, responsibility or result.`
        : "Turn dense paragraphs into short bullet points that show what you did.",
    ),
    check(
      "outcomes",
      "Evidence of outcomes",
      /\b(?:increased|reduced|improved|saved|delivered|achieved|grew|managed|supported)\b/i.test(clean) && /\d/.test(clean)
        ? "good"
        : "review",
      /\d/.test(clean)
        ? "Some numbers are present. Make sure they explain scale or change and can be supported if asked."
        : "Add real scale or outcomes where you have them, such as volume, team size, time, accuracy or percentage change.",
    ),
    check(
      "personal-details",
      "UK personal-detail hygiene",
      /\b(?:date of birth|dob|marital status|nationality|passport number|ni number|national insurance)\b/i.test(clean)
        ? "warning"
        : "good",
      /\b(?:date of birth|dob|marital status|nationality|passport number|ni number|national insurance)\b/i.test(clean)
        ? "Review this personal information. It is not normally needed on a standard UK CV."
        : "No common unnecessary personal-detail labels were found.",
    ),
    check(
      "layout-signals",
      "Copy and parsing signals",
      /\t|\|\s+\|/.test(clean) || longLines.length > 2 ? "review" : "good",
      /\t|\|\s+\|/.test(clean) || longLines.length > 2
        ? "The pasted text contains tabs, repeated separators or very long lines. Inspect the actual file for columns, tables and reading order."
        : "The pasted text has no obvious column or separator warning. This does not replace checking the actual PDF or DOCX.",
    ),
  ];
  const good = checks.filter((item) => item.status === "good").length;
  const score = Math.round((good / checks.length) * 100);
  return {
    wordCount: countToolWords(clean),
    score,
    checks,
    summary:
      score >= 80
        ? "Your pasted CV has a solid text structure. Inspect the real file and tailor the evidence to the vacancy before sending it."
        : score >= 55
          ? "The structure is workable, but a few focused edits should make the CV easier to scan and safer to submit."
          : "The pasted CV needs a structural tidy-up before you spend time on visual formatting or applications.",
  };
}

function id(prefix: string, index: number) {
  return `${prefix}-${Date.now()}-${index}`;
}

function splitItems(value: string) {
  return value
    .split(/\r?\n|[•·]|\s*;\s*/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter((item) => item.length > 2);
}

export function buildFirstJobDraft(input: FirstJobInput): FirstJobDraft {
  const strengths = splitItems(input.strengths);
  const projects = splitItems(input.projects);
  const volunteering = splitItems(input.volunteering);
  const role = input.targetRole.trim() || "an entry-level role";
  const evidence = [...projects, ...volunteering];
  const profileParts = [
    `Motivated early-career candidate seeking ${role}`,
    input.education.trim() ? `with a foundation in ${input.education.trim()}` : "",
    strengths.length ? `and strengths in ${strengths.slice(0, 3).join(", ")}` : "",
    input.availability.trim() ? `Available ${input.availability.trim()}.` : "",
  ].filter(Boolean);
  const profile = `${profileParts.join(" ")}.`.replace(/\.\./g, ".");
  const skills = [...strengths, ...["Clear communication", "Organisation", "Reliability"].filter((item) => !strengths.some((skill) => skill.toLowerCase() === item.toLowerCase()))]
    .slice(0, 8)
    .join("\n");
  const experience: ExperienceItem[] = evidence.length
    ? [
        {
          id: id("experience", 0),
          role: projects.length ? "Project experience" : "Volunteering and community experience",
          company: "",
          location: "",
          start: "",
          end: "",
          bullets: evidence.slice(0, 5).map((item) => (/[.!?]$/.test(item) ? item : `${item}.`)).join("\n"),
        },
      ]
    : [];
  const education: EducationItem[] = input.education.trim()
    ? [{ id: id("education", 0), qualification: input.education.trim(), institution: "", location: "", start: "", end: "", details: "" }]
    : [];
  const patch = {
    fullName: input.fullName.trim(),
    targetRole: input.targetRole.trim(),
    profile,
    skills,
    experience,
    education,
  };
  return { profile, skills, experience, education, patch };
}

const transferableRules: Array<{ terms: RegExp; skill: string; usefulFor: string[]; wording: string }> = [
  { terms: /customer|client|complaint|passenger|patient/i, skill: "Customer and stakeholder communication", usefulFor: ["customer service", "account support", "operations"], wording: "Explained information clearly, handled questions and followed issues through to the next step." },
  { terms: /team|coach|mentor|supervis/i, skill: "Team support and coaching", usefulFor: ["team leadership", "supervision", "training"], wording: "Supported colleagues, shared practical guidance and helped work stay organised during busy periods." },
  { terms: /excel|spreadsheet|report|data|crm|system/i, skill: "Accurate records and data handling", usefulFor: ["administration", "operations", "data support"], wording: "Maintained accurate records, used workplace systems and turned information into clear updates." },
  { terms: /project|plan|deadline|deliver|coordinate/i, skill: "Planning and coordination", usefulFor: ["project support", "operations", "administration"], wording: "Planned tasks, coordinated people or information and kept work moving towards a deadline." },
  { terms: /sale|revenue|target|retail|upsell/i, skill: "Commercial awareness", usefulFor: ["sales", "account management", "retail"], wording: "Understood customer needs, worked towards targets and connected activity with a commercial outcome." },
  { terms: /stock|warehouse|logistics|dispatch|delivery/i, skill: "Process and operational accuracy", usefulFor: ["logistics", "warehouse", "operations"], wording: "Followed repeatable processes, checked details and helped work move accurately through the operation." },
  { terms: /care|support|vulnerable|safeguard/i, skill: "Responsible support and safeguarding", usefulFor: ["care", "support work", "community services"], wording: "Provided reliable support, respected confidentiality and responded appropriately to individual needs." },
  { terms: /write|content|social|marketing|campaign/i, skill: "Written communication and content", usefulFor: ["marketing", "communications", "administration"], wording: "Produced clear written information and adapted the message for its audience and purpose." },
];

export function translateTransferableSkills(input: TransferableInput): TransferableResult {
  const source = `${input.previousRole} ${input.experience}`.trim();
  const matches = transferableRules.filter((rule) => rule.terms.test(source)).map((rule) => ({
    skill: rule.skill,
    evidence: rule.wording,
    usefulFor: rule.usefulFor,
    source: input.previousRole.trim() || "your experience",
  }));
  const fallback = matches.length ? matches : [{ skill: "Adaptability and learning", evidence: "Learned new processes, adjusted to changing priorities and applied feedback to improve the work.", usefulFor: ["most entry-level roles"], source: input.previousRole.trim() || "your experience" }];
  const profile = `${input.targetRole.trim() ? `Career changer targeting ${input.targetRole.trim()}` : "Experienced professional bringing transferable strengths"}. ${fallback.slice(0, 3).map((item) => item.skill).join(", ")} ${input.experience.trim() ? "supported by evidence from previous work." : "Add one real example for each strength before using this wording."}`;
  const skills = fallback.map((item) => item.skill).join("\n");
  return { matches: fallback, profile, skills, patch: { targetRole: input.targetRole.trim(), profile, skills } };
}

const genericPhrases = /\b(responsible for|worked on|helped with|duties included|various|hard[- ]working|team player|excellent communication)\b/i;

export function shortenCvText(text: string, targetWords = 550): ShortenResult {
  const lines = text.split(/\r?\n/);
  const originalWords = countToolWords(text);
  if (originalWords <= targetWords) {
    return { originalWords, shortenedWords: originalWords, removedWords: 0, shortenedText: text.trim(), suggestions: ["Your pasted CV is already within the target text range. Check the rendered page count and remove repetition only where it does not prove fit."] };
  }
  const entries = lines.map((raw, index) => {
    const line = raw.trim();
    let score = 1;
    if (!line) score = 0;
    if (/^[A-Z][A-Z\s&/]{3,}$/.test(line)) score += 5;
    if (datePattern.test(line) || /\b(?:present|current)\b/i.test(line)) score += 4;
    if (/^[-•*]/.test(line)) score += /\d|%|increased|reduced|delivered|managed|improved/i.test(line) ? 5 : 3;
    if (/@|\+?44|\b07\d/.test(line)) score += 4;
    if (genericPhrases.test(line)) score -= 2;
    return { line, index, score, words: countToolWords(line) };
  });
  const mustKeep = entries.filter((entry) => entry.score >= 5 || entry.index < 4);
  const optional = entries.filter((entry) => entry.score < 5 && entry.index >= 4).sort((a, b) => b.score - a.score || a.index - b.index);
  const chosen = [...mustKeep];
  let words = chosen.reduce((total, entry) => total + entry.words, 0);
  for (const entry of optional) {
    if (words + entry.words > targetWords) continue;
    chosen.push(entry);
    words += entry.words;
  }
  const keptIndexes = new Set(chosen.map((entry) => entry.index));
  const shortenedText = entries.filter((entry) => keptIndexes.has(entry.index)).map((entry) => entry.line).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const shortenedWords = countToolWords(shortenedText);
  const suggestions = [
    "Keep the strongest recent role and give older unrelated roles fewer bullets.",
    "Replace repeated duty lists with one line that shows the action, context and result.",
    "Keep dates, job titles and evidence for requirements the vacancy calls essential.",
    "Preview the actual PDF after editing; word count cannot prove a two-page layout.",
  ];
  return { originalWords, shortenedWords, removedWords: Math.max(0, originalWords - shortenedWords), shortenedText, suggestions };
}

const headingMap: Array<[RegExp, string]> = [
  [/^(?:professional\s+)?summary$|^objective$|^about\s+me$/i, "PROFILE"],
  [/^(?:professional\s+|relevant\s+)?experience$|^employment\s+history$|^work\s+history$|^career\s+history$/i, "EXPERIENCE"],
  [/^education$|^academic\s+background$|^qualifications?(?:\s+and\s+training)?$/i, "EDUCATION AND QUALIFICATIONS"],
  [/^(?:key\s+|core\s+)?skills$|^competenc(?:ies|e)$/i, "KEY SKILLS"],
  [/^achievements?$|^selected\s+achievements?$/i, "SELECTED ACHIEVEMENTS"],
];

const spellingMap: Array<[RegExp, string]> = [
  [/\borganize\b/gi, "organise"],
  [/\borganized\b/gi, "organised"],
  [/\borganization\b/gi, "organisation"],
  [/\banalyze\b/gi, "analyse"],
  [/\banalyzed\b/gi, "analysed"],
  [/\bbehavior\b/gi, "behaviour"],
  [/\bcenter\b/gi, "centre"],
];

export function convertResumeToUkCv(text: string): ConversionResult {
  const changes: string[] = [];
  const omittedLines: string[] = [];
  const output: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^\s*(?:date of birth|dob|age|marital status|nationality|gender|passport(?: number)?|ni number|national insurance number|photo(?:graph)?|full address)\s*:/i.test(line)) {
      omittedLines.push(line);
      continue;
    }
    let next = line;
    for (const [pattern, heading] of headingMap) {
      if (pattern.test(line)) {
        next = heading;
        if (line.toUpperCase() !== heading) changes.push(`Renamed “${line}” to “${heading}”.`);
        break;
      }
    }
    for (const [pattern, replacement] of spellingMap) {
      if (pattern.test(next)) {
        next = next.replace(pattern, replacement);
        changes.push(`Applied UK spelling: “${replacement}”.`);
      }
    }
    output.push(next);
  }
  const convertedText = output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (omittedLines.length) changes.push(`${omittedLines.length} personal-detail line${omittedLines.length === 1 ? "" : "s"} set aside for review.`);
  if (!changes.length) changes.push("No automatic wording changes were needed. Check headings, dates and file instructions manually.");
  return { convertedText, changes: changes.filter((value, index, values) => values.indexOf(value) === index), omittedLines, wordCount: countToolWords(convertedText) };
}

export function buildGapExplanation(input: GapInput): GapResult {
  const reason = input.reason.trim() || "a career break";
  const dates = [input.start.trim(), input.end.trim()].filter(Boolean).join("–");
  const dateLabel = dates ? `, ${dates}` : "";
  const learning = input.learning.trim();
  const readiness = input.readiness.trim() || "now ready to return to work";
  const explanation = `${reason}${dateLabel}. ${learning ? `During this period, ${learning.replace(/[.!?]+$/, "")}. ` : ""}${readiness.replace(/^[a-z]/, (value) => value.toUpperCase())}.`;
  const profileLine = `${input.targetRole.trim() ? `Targeting ${input.targetRole.trim()}. ` : ""}${readiness.replace(/^[a-z]/, (value) => value.toUpperCase())}. ${learning ? "Brings recent learning and transferable experience to the next role." : "Ready to discuss relevant experience and recent preparation."}`;
  return {
    explanation,
    profileLine,
    suggestions: [
      "Keep the explanation factual and brief; private medical or family details are optional.",
      "Put recent training, volunteering or projects above older unrelated detail when they are relevant.",
      "Use the same month-and-year date style across the whole CV.",
      "Check that the wording is true and that you can explain it comfortably in an interview.",
    ],
    patch: { targetRole: input.targetRole.trim(), profile: profileLine },
  };
}
