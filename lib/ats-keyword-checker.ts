export type AtsKeywordCategory =
  | "Job title"
  | "Skill or tool"
  | "Qualification"
  | "Action verb";

export type AtsKeyword = {
  term: string;
  category: AtsKeywordCategory;
  found: boolean;
  importance: "Essential" | "Repeated" | "Relevant";
  weight: number;
};

export type AtsAnalysis = {
  score: number;
  verdict: "Low coverage" | "Partial coverage" | "Strong coverage";
  found: AtsKeyword[];
  missing: AtsKeyword[];
  totalKeywords: number;
  essentialFound: number;
  essentialTotal: number;
};

type KeywordDefinition = {
  term: string;
  category: AtsKeywordCategory;
  variants?: string[];
};

const skillTerms = [
  "account management",
  "administration",
  "agile",
  "auditing",
  "budget management",
  "business analysis",
  "business development",
  "cash handling",
  "change management",
  "clinical care",
  "communication",
  "compliance",
  "content creation",
  "continuous improvement",
  "contract management",
  "credit control",
  "crm",
  "customer service",
  "data analysis",
  "data entry",
  "digital marketing",
  "due diligence",
  "email marketing",
  "employee relations",
  "excel",
  "financial analysis",
  "financial reporting",
  "first aid",
  "forecasting",
  "forklift",
  "fundraising",
  "google analytics",
  "health and safety",
  "inventory management",
  "javascript",
  "lead generation",
  "leadership",
  "machine learning",
  "manual handling",
  "market research",
  "microsoft 365",
  "microsoft office",
  "microsoft teams",
  "negotiation",
  "networking",
  "nhs",
  "numeracy",
  "payroll",
  "performance management",
  "power bi",
  "problem solving",
  "procurement",
  "project management",
  "python",
  "quality assurance",
  "recruitment",
  "risk assessment",
  "risk management",
  "safeguarding",
  "sage",
  "sales",
  "salesforce",
  "seo",
  "social media",
  "sql",
  "stakeholder management",
  "stock control",
  "stock rotation",
  "strategic planning",
  "supply chain",
  "tableau",
  "team management",
  "time management",
  "training",
  "troubleshooting",
  "typescript",
  "warehouse management",
  "word",
  "wordpress",
].map((term) => ({ term, category: "Skill or tool" as const }));

const skillDefinitions: KeywordDefinition[] = [
  {
    term: "complaint handling",
    category: "Skill or tool",
    variants: [
      "complaint handling",
      "complaints handling",
      "complaint resolution",
      "handling complaints",
      "managed complaints",
      "resolve complaints",
      "resolved complaints",
    ],
  },
  {
    term: "key performance indicators",
    category: "Skill or tool",
    variants: ["key performance indicators", "kpi", "kpis"],
  },
];

const qualificationTerms: KeywordDefinition[] = [
  { term: "GCSE", category: "Qualification", variants: ["gcse", "gcses"] },
  { term: "A level", category: "Qualification", variants: ["a level", "a levels", "a-level", "a-levels"] },
  { term: "NVQ", category: "Qualification", variants: ["nvq"] },
  { term: "BTEC", category: "Qualification", variants: ["btec"] },
  { term: "HNC", category: "Qualification", variants: ["hnc"] },
  { term: "HND", category: "Qualification", variants: ["hnd"] },
  { term: "degree", category: "Qualification", variants: ["degree", "bachelor", "bachelors", "bsc", "ba degree"] },
  { term: "master's degree", category: "Qualification", variants: ["master's", "masters degree", "msc", "mba"] },
  { term: "PhD", category: "Qualification", variants: ["phd", "doctorate"] },
  { term: "QTS", category: "Qualification", variants: ["qts", "qualified teacher status"] },
  { term: "NMC registration", category: "Qualification", variants: ["nmc registration", "nmc registered", "nmc pin"] },
  { term: "HCPC registration", category: "Qualification", variants: ["hcpc registration", "hcpc registered"] },
  { term: "DBS check", category: "Qualification", variants: ["dbs", "disclosure and barring service"] },
  { term: "driving licence", category: "Qualification", variants: ["driving licence", "driver's licence", "drivers licence"] },
  { term: "CPC", category: "Qualification", variants: ["driver cpc", "cpc card", "certificate of professional competence"] },
  { term: "CSCS card", category: "Qualification", variants: ["cscs", "cscs card"] },
  { term: "SIA licence", category: "Qualification", variants: ["sia licence", "sia license"] },
  { term: "CIPD", category: "Qualification", variants: ["cipd"] },
  { term: "AAT", category: "Qualification", variants: ["aat"] },
  { term: "ACCA", category: "Qualification", variants: ["acca"] },
  { term: "ACA", category: "Qualification", variants: ["aca"] },
  { term: "CIMA", category: "Qualification", variants: ["cima"] },
  { term: "PRINCE2", category: "Qualification", variants: ["prince2", "prince 2"] },
  { term: "PMP", category: "Qualification", variants: ["pmp", "project management professional"] },
  { term: "ITIL", category: "Qualification", variants: ["itil"] },
  { term: "NEBOSH", category: "Qualification", variants: ["nebosh"] },
  { term: "IOSH", category: "Qualification", variants: ["iosh"] },
];

const titleTerms = [
  "account manager",
  "accountant",
  "administrative assistant",
  "business analyst",
  "care assistant",
  "care worker",
  "customer service advisor",
  "customer service assistant",
  "data analyst",
  "delivery driver",
  "developer",
  "finance assistant",
  "graduate",
  "healthcare assistant",
  "hr advisor",
  "marketing executive",
  "nurse",
  "operations manager",
  "personal assistant",
  "project coordinator",
  "project manager",
  "receptionist",
  "registered nurse",
  "sales assistant",
  "sales executive",
  "software developer",
  "software engineer",
  "support worker",
  "teacher",
  "teaching assistant",
  "warehouse operative",
].map((term) => ({ term, category: "Job title" as const }));

const actionDefinitions: KeywordDefinition[] = [
  ["achieve", "achieved", "achieving"],
  ["analyse", "analysed", "analysing", "analyze", "analyzed", "analyzing"],
  ["build", "built", "building"],
  ["coordinate", "coordinated", "coordinating"],
  ["create", "created", "creating"],
  ["deliver", "delivered", "delivering"],
  ["develop", "developed", "developing"],
  ["drive", "drove", "driven", "driving"],
  ["implement", "implemented", "implementing"],
  ["improve", "improved", "improving"],
  ["lead", "led", "leading"],
  ["manage", "managed", "managing"],
  ["monitor", "monitored", "monitoring"],
  ["negotiate", "negotiated", "negotiating"],
  ["optimise", "optimised", "optimising", "optimize", "optimized", "optimizing"],
  ["organise", "organised", "organising", "organize", "organized", "organizing"],
  ["prepare", "prepared", "preparing"],
  ["present", "presented", "presenting"],
  ["reduce", "reduced", "reducing"],
  ["report", "reported", "reporting"],
  ["resolve", "resolved", "resolving"],
  ["support", "supported", "supporting"],
  ["train", "trained", "training"],
].map(([term, ...variants]) => ({
  term,
  variants: [term, ...variants],
  category: "Action verb",
}));

const definitions: KeywordDefinition[] = [
  ...titleTerms,
  ...skillTerms,
  ...skillDefinitions,
  ...qualificationTerms,
  ...actionDefinitions,
];

const categoryWeights: Record<AtsKeywordCategory, number> = {
  "Job title": 1.35,
  "Skill or tool": 1.2,
  Qualification: 1.4,
  "Action verb": 0.65,
};

const requirementSignals =
  /\b(essential|required|must|need(?:ed)?|minimum|proven|demonstrable|qualified|qualification|certification|licen[cs]e|experience (?:of|in|with|using)|knowledge of|proficien(?:t|cy))\b/i;

const acronymExclusions = new Set([
  "CV",
  "UK",
  "HR",
  "JOB",
  "ROLE",
  "THE",
  "AND",
  "OUR",
  "YOU",
  "YOUR",
  "WE",
  "US",
  "KPI",
  "KPIS",
]);

function normalise(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseCount(text: string, phrase: string) {
  const source = ` ${text} `;
  const target = ` ${normalise(phrase)} `;
  if (target.trim().length < 2) return 0;

  let count = 0;
  let fromIndex = 0;
  while (true) {
    const matchIndex = source.indexOf(target, fromIndex);
    if (matchIndex === -1) return count;
    count += 1;
    fromIndex = matchIndex + target.length;
  }
}

function bestVariantCount(text: string, definition: KeywordDefinition) {
  return Math.max(
    ...[definition.term, ...(definition.variants ?? [])].map((variant) =>
      phraseCount(text, variant),
    ),
  );
}

function findRelevantContext(jobDescription: string, definition: KeywordDefinition) {
  const contexts = jobDescription
    .split(/[\n.!?;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return contexts.some((context) => {
    const normalisedContext = normalise(context);
    return (
      requirementSignals.test(context) &&
      bestVariantCount(normalisedContext, definition) > 0
    );
  });
}

function inferredAcronyms(jobDescription: string): KeywordDefinition[] {
  const candidates = jobDescription.match(/\b[A-Z][A-Z0-9+.#-]{1,9}\b/g) ?? [];
  return Array.from(new Set(candidates))
    .filter((term) => !acronymExclusions.has(term.toUpperCase()))
    .map((term) => ({ term, category: "Skill or tool" }));
}

function uniqueDefinitions(items: KeywordDefinition[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.category}:${normalise(item.term)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function limitByCategory(keywords: AtsKeyword[]) {
  const limits: Record<AtsKeywordCategory, number> = {
    "Job title": 4,
    "Skill or tool": 18,
    Qualification: 8,
    "Action verb": 10,
  };
  const counts: Record<AtsKeywordCategory, number> = {
    "Job title": 0,
    "Skill or tool": 0,
    Qualification: 0,
    "Action verb": 0,
  };

  return keywords.filter((keyword) => {
    if (counts[keyword.category] >= limits[keyword.category]) return false;
    counts[keyword.category] += 1;
    return true;
  });
}

export function analyseAtsKeywords(
  jobDescription: string,
  cvText: string,
): AtsAnalysis {
  const normalisedJob = normalise(jobDescription);
  const normalisedCv = normalise(cvText);
  const candidates = uniqueDefinitions([
    ...definitions,
    ...inferredAcronyms(jobDescription),
  ]);

  const keywords = candidates
    .map((definition): AtsKeyword | null => {
      const occurrences = bestVariantCount(normalisedJob, definition);
      if (occurrences === 0) return null;

      const essential = findRelevantContext(jobDescription, definition);
      const importance = essential
        ? "Essential"
        : occurrences > 1
          ? "Repeated"
          : "Relevant";
      const importanceMultiplier = essential
        ? 1.35
        : occurrences > 1
          ? 1.15
          : 1;
      const repetitionMultiplier = 1 + Math.min(occurrences - 1, 2) * 0.12;
      const weight =
        categoryWeights[definition.category] *
        importanceMultiplier *
        repetitionMultiplier;

      return {
        term: definition.term,
        category: definition.category,
        found: bestVariantCount(normalisedCv, definition) > 0,
        importance,
        weight,
      };
    })
    .filter((keyword): keyword is AtsKeyword => keyword !== null)
    .sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term));

  const limitedKeywords = limitByCategory(keywords);
  const totalWeight = limitedKeywords.reduce(
    (sum, keyword) => sum + keyword.weight,
    0,
  );
  const foundWeight = limitedKeywords
    .filter((keyword) => keyword.found)
    .reduce((sum, keyword) => sum + keyword.weight, 0);
  const score =
    totalWeight === 0 ? 0 : Math.round((foundWeight / totalWeight) * 100);
  const essentialKeywords = limitedKeywords.filter(
    (keyword) => keyword.importance === "Essential",
  );

  return {
    score,
    verdict:
      score >= 70
        ? "Strong coverage"
        : score >= 45
          ? "Partial coverage"
          : "Low coverage",
    found: limitedKeywords.filter((keyword) => keyword.found),
    missing: limitedKeywords.filter((keyword) => !keyword.found),
    totalKeywords: limitedKeywords.length,
    essentialFound: essentialKeywords.filter((keyword) => keyword.found).length,
    essentialTotal: essentialKeywords.length,
  };
}
