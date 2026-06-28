export type CvLengthVerdict = "Too short" | "Good length" | "Too long";

export type CvLengthAnalysis = {
  wordCount: number;
  characterCount: number;
  estimatedPages: number;
  verdict: CvLengthVerdict;
  differenceFromRange: number;
  paragraphs: number;
  bulletPoints: number;
  longParagraphs: number;
  summary: string;
  primaryTip: string;
  actions: string[];
};

const minimumWords = 300;
const maximumWords = 800;
const wordsPerEstimatedPage = 400;

export const cvLengthGuidance = {
  minimumWords,
  maximumWords,
  wordsPerEstimatedPage,
};

export function countCvWords(value: string) {
  const normalised = value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .trim();

  if (!normalised) return 0;

  return normalised
    .split(/\s+/)
    .filter((part) => /[A-Za-z0-9]/.test(part)).length;
}

function countParagraphs(value: string) {
  return value
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean).length;
}

function countBulletPoints(value: string) {
  return value
    .split("\n")
    .filter((line) => /^\s*(?:[-*•▪◦]|\d+[.)])\s+\S/.test(line)).length;
}

function countLongParagraphs(value: string) {
  return value
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => countCvWords(paragraph))
    .filter((words) => words > 80).length;
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export function analyseCvLength(value: string): CvLengthAnalysis {
  const wordCount = countCvWords(value);
  const estimatedPages =
    wordCount === 0
      ? 0
      : Math.max(0.1, roundToOneDecimal(wordCount / wordsPerEstimatedPage));
  const paragraphs = countParagraphs(value);
  const bulletPoints = countBulletPoints(value);
  const longParagraphs = countLongParagraphs(value);

  if (wordCount < minimumWords) {
    const differenceFromRange = minimumWords - wordCount;
    return {
      wordCount,
      characterCount: value.length,
      estimatedPages,
      verdict: "Too short",
      differenceFromRange,
      paragraphs,
      bulletPoints,
      longParagraphs,
      summary: `This draft is ${differenceFromRange} ${differenceFromRange === 1 ? "word" : "words"} below WorkCV's general 300-word lower guide.`,
      primaryTip:
        "Add evidence, not filler. Check whether your profile, recent experience, education and relevant skills show why you fit the target role.",
      actions: [
        "Give the most relevant role, placement, project or volunteering experience two to four evidence-led bullet points.",
        "Name useful tools, qualifications and job-specific skills where you can prove them.",
        bulletPoints < 3
          ? "Turn dense duty descriptions into concise bullets that show an action, context and result."
          : "Check that each bullet explains an action or result rather than listing isolated keywords.",
        "If you are a school leaver, student or recent graduate with limited experience, a complete one-page CV can still be appropriate.",
      ],
    };
  }

  if (wordCount > maximumWords) {
    const differenceFromRange = wordCount - maximumWords;
    const actions = [
      "Compress older or less relevant roles to the job title, employer, dates and one or two useful bullets.",
      "Remove repeated duties, generic soft-skill claims and detail that does not support this application.",
      "Keep recent achievements, required qualifications and evidence that matches the job advert.",
      longParagraphs > 0
        ? `Break up or rewrite the ${longParagraphs} paragraph${longParagraphs === 1 ? "" : "s"} over 80 words so key evidence is easier to scan.`
        : "Check whether several short bullets make the same point and combine them where possible.",
    ];

    return {
      wordCount,
      characterCount: value.length,
      estimatedPages,
      verdict: "Too long",
      differenceFromRange,
      paragraphs,
      bulletPoints,
      longParagraphs,
      summary: `This draft is ${differenceFromRange} ${differenceFromRange === 1 ? "word" : "words"} above WorkCV's general 800-word upper guide.`,
      primaryTip:
        "Cut from the least relevant material first. Do not remove evidence merely to hit a number.",
      actions,
    };
  }

  return {
    wordCount,
    characterCount: value.length,
    estimatedPages,
    verdict: "Good length",
    differenceFromRange: 0,
    paragraphs,
    bulletPoints,
    longParagraphs,
    summary:
      "This draft sits within WorkCV's general 300–800 word guide for a concise one- or two-page UK CV.",
    primaryTip:
      "Do not add or cut content just to move the number. Use the space to keep the most relevant evidence easy to find.",
    actions: [
      "Check that the first page contains your target role, strongest evidence and most relevant recent experience.",
      "Make every bullet specific enough to show what you did, how you did it or what changed.",
      longParagraphs > 0
        ? `Review the ${longParagraphs} paragraph${longParagraphs === 1 ? "" : "s"} over 80 words; the overall length is good, but dense blocks can still be hard to scan.`
        : "Keep paragraphs concise and use bullets where they make achievements easier to scan.",
      "Follow any length or format instruction in the vacancy even when it differs from this general guide.",
    ],
  };
}

