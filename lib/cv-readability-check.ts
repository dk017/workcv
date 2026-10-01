// CV readability check: runs in the browser on extracted or pasted CV text,
// without a job advert and without AI. It reports what a reader or a
// recruitment system can and cannot pick out; it is not an employer's ATS.

export type ReadabilityStatus = "pass" | "warn" | "fail";
export type ReadabilityCheck = { id: string; label: string; status: ReadabilityStatus; detail: string };
export type ReadabilityReport = { score: number; wordCount: number; checks: ReadabilityCheck[] };

export type TextItemBox = { x: number; y: number; width: number; text: string };

// Two-column layouts often extract out of order. A second column shows up as
// a shared left edge partway across the page that many text runs start from,
// while the text to its left stops short of it. Lines in the two columns do
// not need to line up. Right-aligned dates start at varying positions, so they
// do not form a shared edge.
export function looksMultiColumn(items: TextItemBox[], pageWidth: number) {
  const runs = items.filter((item) => item.text.trim().length >= 3 && item.width > 0);
  if (runs.length < 16) return false;
  const bucket = 6;
  const counts = new Map<number, number>();
  for (const run of runs) {
    const key = Math.round(run.x / bucket);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const [key, count] of Array.from(counts.entries())) {
    const edge = key * bucket;
    if (edge < pageWidth * 0.25 || edge > pageWidth * 0.72) continue;
    // Allow for small jitter around the edge.
    const atEdge = runs.filter((run) => Math.abs(run.x - edge) <= bucket).length;
    if (atEdge < 8 || atEdge / runs.length < 0.2 || count < 4) continue;
    const leftRuns = runs.filter((run) => run.x < edge - bucket);
    if (leftRuns.length < 8) continue;
    const stopShort = leftRuns.filter((run) => run.x + run.width <= edge + 2).length;
    if (stopShort / leftRuns.length >= 0.9) return true;
  }
  return false;
}

const headingPatterns: Array<[string, RegExp]> = [
  ["experience", /^\s*(work |employment |professional |relevant )?(experience|history|employment)\b/im],
  ["education", /^\s*(education|qualifications|education (and|&) (training|qualifications))\b/im],
  ["skills", /^\s*((key |core |technical )?skills|competencies)\b/im],
  ["profile", /^\s*(profile|personal (statement|profile)|summary|professional summary|about me)\b/im],
];

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function cvReadabilityReport(input: {
  text: string;
  emptyPages?: number[];
  multiColumnPages?: number[];
  // Uploaded files often keep list markers out of the text, so bullets are only judged for pasted text.
  source?: "file" | "paste";
}): ReadabilityReport {
  const text = input.text.replace(/\r\n?/g, "\n");
  const words = wordCount(text);
  const checks: ReadabilityCheck[] = [];
  const add = (id: string, label: string, status: ReadabilityStatus, detail: string) => checks.push({ id, label, status, detail });

  // Selectable text.
  if (words < 80) {
    add("text", "Readable text", "fail", "Very little text could be read. If this is a PDF, it may be an image or scan. Export it again from Word or your CV builder so the text is selectable.");
  } else if (input.emptyPages?.length) {
    add("text", "Readable text", "warn", `Page ${input.emptyPages.join(", ")} has little or no selectable text. Check it isn't an image.`);
  } else if (/�/.test(text)) {
    add("text", "Readable text", "warn", "Some characters could not be read. Check names, dates and qualifications in the text below.");
  } else {
    add("text", "Readable text", "pass", `${words} words were read, so the text is selectable.`);
  }

  // Length: most UK CVs are up to two pages (roughly 450–900 words in a clean layout).
  if (words >= 80 && words < 250) add("length", "Length", "warn", `${words} words is short for most roles. Add evidence for each recent job, unless you are applying for a first job.`);
  else if (words > 1100) add("length", "Length", "warn", `${words} words is likely to run past two pages. Cut older or repeated duties first.`);
  else if (words >= 250) add("length", "Length", "pass", `${words} words suits a CV of up to two pages.`);

  // Contact details.
  const email = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(text);
  const phone = /(?:\+44\s?7\d{3}|\b07\d{3})[\s-]?\d{3}[\s-]?\d{3}\b|(?:\+44\s?|\b0)\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/.test(text);
  if (email && phone) add("contact", "Contact details", "pass", "An email address and a phone number were found.");
  else add("contact", "Contact details", email || phone ? "warn" : "fail", `No ${email ? "phone number" : phone ? "email address" : "email address or phone number"} was found in the text. Put contact details in the main body, not a header image.`);

  // Standard headings. Wide letter spacing can turn "PROFILE" into "P R O F I L E"
  // for some PDF readers, so recognise those headings but point the risk out.
  // Some letter pairs stay joined ("E D U C AT I O N"), so allow one or two letters per piece.
  const spacedHeading = /(?:^|\n)\s*(?:[A-Z]{1,2} ){3,}[A-Z]{1,2}\s*(?=\n|$)/.test(text);
  const headingText = text.replace(/\b(?:[A-Z]{1,2} ){2,}[A-Z]{1,2}\b/g, (match) => match.replace(/ /g, ""));
  const found = headingPatterns.filter(([, pattern]) => pattern.test(headingText)).map(([name]) => name);
  const missing = headingPatterns.map(([name]) => name).filter((name) => !found.includes(name));
  const spacingNote = " Your headings use wide letter spacing, which some systems read as separate letters (for example \"P R O F I L E\"); normal spacing is safer.";
  if (!found.includes("experience") && !found.includes("education")) {
    add("headings", "Section headings", "fail", "No standard headings such as Experience or Education were found. Use plain headings so each section is easy to find.");
  } else if (missing.length) {
    add("headings", "Section headings", "warn", `Found ${found.join(", ")}. Consider a plain heading for ${missing.join(" and ")}.${spacedHeading ? spacingNote : ""}`);
  } else if (spacedHeading) {
    add("headings", "Section headings", "warn", `Profile, Experience, Education and Skills headings were found.${spacingNote}`);
  } else {
    add("headings", "Section headings", "pass", "Profile, Experience, Education and Skills headings were all found.");
  }

  // Dates.
  const years = text.match(/\b(19[7-9]\d|20[0-4]\d)\b/g) ?? [];
  const monthYear = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(19|20)\d{2}\b/i.test(text);
  const numericDate = /\b(0?[1-9]|1[0-2])\/(19|20)\d{2}\b/.test(text);
  if (years.length < 2) add("dates", "Dates", "warn", "Few dates were found. Give start and end dates (month and year) for each role.");
  else if (monthYear && numericDate) add("dates", "Dates", "warn", "Dates use mixed formats (for example Jan 2024 and 01/2024). Pick one format throughout.");
  else add("dates", "Dates", "pass", "Dates were found in a consistent format.");

  // Bullet points.
  const bullets = text.split("\n").filter((line) => /^\s*([•●▪◦\-*–]|\d+\.)\s+\S/.test(line)).length;
  if (bullets >= 3) add("bullets", "Bullet points", "pass", `${bullets} bullet points help recruiters skim your duties and results.`);
  else if (input.source !== "file") add("bullets", "Bullet points", "warn", "Few bullet points were found. Use short bullets for duties and achievements under each role.");

  // UK personal details (National Careers Service: leave out age, date of birth, marital status and nationality).
  const personal = [
    [/date of birth|\bd\.?o\.?b\.?\b|\bborn (on|in)\b/i, "date of birth"],
    [/\bage[:\s]+\d{2}\b|\b\d{2} years old\b/i, "age"],
    [/marital status|\b(married|single|divorced)\b/i, "marital status"],
    [/\bnationality\b/i, "nationality"],
  ] as const;
  const personalFound = personal.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
  if (personalFound.length) add("personal", "Personal details", "warn", `Your CV seems to include ${personalFound.join(", ")}. UK CVs normally leave these out.`);
  else add("personal", "Personal details", "pass", "No date of birth, age, marital status or nationality was found.");

  // Layout (PDF only).
  if (input.multiColumnPages?.length) {
    add("layout", "Layout", "warn", `Page ${input.multiColumnPages.join(", ")} looks like a two-column layout. Some recruitment systems read columns in the wrong order; a single column is safer.`);
  }

  const points = { pass: 1, warn: 0.5, fail: 0 } as const;
  const score = Math.round((checks.reduce((sum, check) => sum + points[check.status], 0) / checks.length) * 100);
  return { score, wordCount: words, checks };
}
