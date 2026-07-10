export type GapStatus = "present" | "missing" | "caution";

export type CvGapCheck = {
  id: string;
  title: string;
  detail: string;
  status: GapStatus;
  priority: "essential" | "recommended" | "review";
};

export type CvGapResult = {
  wordCount: number;
  checks: CvGapCheck[];
  essentialsFound: number;
  essentialsTotal: number;
};

const headingGroups = {
  profile: ["profile", "personal profile", "personal statement", "professional summary", "career summary", "summary"],
  experience: ["experience", "work experience", "employment", "employment history", "work history", "career history", "projects", "volunteering", "voluntary experience"],
  education: ["education", "education and qualifications", "qualifications", "academic history", "training and education"],
  skills: ["skills", "key skills", "core skills", "technical skills", "competencies", "core competencies"],
};

function normaliseLine(line: string) {
  return line
    .toLocaleLowerCase("en-GB")
    .replace(/^[\s#*_|:–—-]+|[\s#*_|:–—-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasHeading(lines: string[], headings: string[]) {
  return lines.some((line) => headings.includes(normaliseLine(line)));
}

function countWords(value: string) {
  return value.trim().match(/\b[A-Za-z0-9][A-Za-z0-9'’-]*\b/g)?.length ?? 0;
}

export function analyseCvGaps(rawText: string): CvGapResult {
  const text = rawText.trim();
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const wordCount = countWords(text);
  const emailFound = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const phoneFound = /(?:\+44\s?\d|\b0\d{2,4})[\d\s()-]{7,}/.test(text);
  const experienceFound = hasHeading(lines, headingGroups.experience);
  const achievementFound =
    /(?:£\s?\d|\b\d+(?:[.,]\d+)?%\b|\b(?:increased|reduced|saved|improved|grew|delivered|generated|exceeded)\b.{0,45}\b\d)/i.test(text);
  const datesFound =
    /\b(?:19|20)\d{2}\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(?:19|20)\d{2}\b/i.test(text);
  const bulletCount = lines.filter((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line)).length;
  const sensitiveFound = /\b(?:date of birth|dob|marital status|nationality|national insurance(?: number)?|ni number)\b/i.test(text);

  const checks: CvGapCheck[] = [
    {
      id: "contact",
      title: "Email and phone number",
      detail: emailFound && phoneFound
        ? "Both core contact methods were found."
        : `Add ${!emailFound && !phoneFound ? "an email address and phone number" : !emailFound ? "an email address" : "a phone number"} near the top.`,
      status: emailFound && phoneFound ? "present" : "missing",
      priority: "essential",
    },
    {
      id: "profile",
      title: "Introduction or personal profile",
      detail: "Use a short, role-focused introduction directly below your contact details.",
      status: hasHeading(lines, headingGroups.profile) ? "present" : "missing",
      priority: "essential",
    },
    {
      id: "experience",
      title: "Experience, projects or volunteering",
      detail: "Show evidence from paid work, placements, projects or volunteering, with the most recent first.",
      status: experienceFound ? "present" : "missing",
      priority: "essential",
    },
    {
      id: "education",
      title: "Education and qualifications",
      detail: "Include qualification, institution and dates. Move this higher if you are early in your career.",
      status: hasHeading(lines, headingGroups.education) ? "present" : "missing",
      priority: "essential",
    },
    {
      id: "skills",
      title: "Easy-to-find skills",
      detail: "A clear skills section helps a reader find relevant tools and capabilities quickly.",
      status: hasHeading(lines, headingGroups.skills) ? "present" : "missing",
      priority: "recommended",
    },
    {
      id: "dates",
      title: "Dates for history",
      detail: "Add clear dates to education and experience so the sequence is easy to follow.",
      status: datesFound ? "present" : "missing",
      priority: "recommended",
    },
    {
      id: "bullets",
      title: "Scannable bullet points",
      detail: bulletCount >= 3 ? `${bulletCount} bullet points were found.` : "Use concise bullets for responsibilities and achievements.",
      status: bulletCount >= 3 ? "present" : "missing",
      priority: "recommended",
    },
    {
      id: "achievements",
      title: "Evidence of outcomes",
      detail: "Where truthful, add scale or results such as volume, time, money, quality or percentage change.",
      status: achievementFound ? "present" : "missing",
      priority: "recommended",
    },
    {
      id: "sensitive",
      title: "Unnecessary personal details",
      detail: sensitiveFound
        ? "Review personal details: UK CV guidance says not to include age, date of birth, marital status or nationality."
        : "No obvious unnecessary personal details were found.",
      status: sensitiveFound ? "caution" : "present",
      priority: "review",
    },
    {
      id: "length",
      title: "Enough content to assess",
      detail: wordCount < 150
        ? "This looks very short. Check that the complete CV was pasted."
        : wordCount > 1_200
          ? "This looks long. Use the CV length checker for a more detailed review."
          : `${wordCount} words gives the detector enough content for a useful section check.`,
      status: wordCount < 150 || wordCount > 1_200 ? "caution" : "present",
      priority: "review",
    },
  ];

  const essentials = checks.filter((check) => check.priority === "essential");
  return {
    wordCount,
    checks,
    essentialsFound: essentials.filter((check) => check.status === "present").length,
    essentialsTotal: essentials.length,
  };
}
