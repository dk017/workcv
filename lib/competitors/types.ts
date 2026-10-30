export type Faq = { question: string; answer: string };

/**
 * uk-page: GBP figures on the brand's own UK pricing page.
 * uk-page-conflict: the brand's own pages show different GBP figures; both are disclosed.
 * regional: the brand's own pages quote USD or EUR, so UK checkout may differ.
 * unconfirmed: no current price was visible on the official pages we could check; older figures are labelled as such.
 */
export type PriceConfidence = "uk-page" | "uk-page-conflict" | "regional" | "unconfirmed";

/** A paid plan used to model what a CV costs over time. GBP only. */
export type PlanOption = {
  label: string;
  /** Introductory period charged once before the recurring price applies. */
  first?: { price: number; days: number };
  price: number;
  days: number;
};

/** One option on an alternatives page. `href` is internal unless `external` is true. */
export type AlternativeOption = {
  name: string;
  bestFor: string;
  price: string;
  why: string;
  tradeOff: string;
  href: string;
  external?: boolean;
  /** Link text; defaults to a comparison or "Visit" label. */
  cta?: string;
};

export type Competitor = {
  slug: string;
  name: string;
  domain: string;
  homepage: string;
  owner?: string;
  /** What the product is, in one sentence. */
  summary: string;
  category: string;
  vsPath: string;
  altPath: string;
  pricing: {
    headline: string;
    rows: Array<[string, string]>;
    confidence: PriceConfidence;
    note?: string;
    sourceUrl: string;
    plans?: PlanOption[];
  };
  facts: {
    billing: string;
    free: string;
    formats: string;
    coverLetters: string;
    ai: string;
    ats: string;
    design: string;
    afterPaying: string;
    bestFor: string;
  };
  switching: { summary: string; href: string; label: string };
  sources: Array<[string, string]>;
  vs: {
    title: string;
    description: string;
    answer: string;
    verdict: string[];
    competitorBetter: string[];
    workcvBetter: string[];
    faqs: Faq[];
  };
  alt: {
    /** What people call the thing they are replacing, if not the brand name (e.g. "Canva CV"). */
    subject?: string;
    title: string;
    description: string;
    answer: string;
    why: string[];
    /** Other competitors are referenced by slug and reuse their `asAlternative` copy. */
    options: Array<AlternativeOption | { slug: string; why: string }>;
    faqs: Faq[];
  };
  /** How this brand is described when it appears on another brand's alternatives page. */
  asAlternative: { bestFor: string; price: string; tradeOff: string };
  /** Slugs of the most useful sibling comparisons. */
  related: string[];
};
