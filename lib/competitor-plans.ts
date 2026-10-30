// Numeric, sourced plan details for the competitor comparison pages, so costs
// over time are calculated rather than typed by hand. Each brand records the
// date its official pages were checked; re-check before changing any figure.
// Pure module: no imports, safe for tests.

export type RenewingPlan = {
  label: string;
  currency: "GBP" | "USD";
  /** First charge, in pence/cents (0 when there is no trial). */
  entryMinor: number;
  /** Days covered by the first charge before the first renewal. */
  entryDays: number;
  renewalMinor: number;
  /** Days between renewals. */
  cycleDays: number;
  /** Exact renewal wording from the official page. */
  renewalWording: string;
};

export type CompetitorPlans = {
  brand: string;
  checked: string;
  operator: string;
  operatorSource: string;
  pricingSource: string;
  /** Where the prices apply, e.g. the UK site or the international page we were shown. */
  priceScope: string;
  freePlan: string;
  trial: RenewingPlan;
  annual?: { label: string; currency: "GBP" | "USD"; totalMinor: number; wording: string };
};

const fourWeeks = 28;

export const competitorPlans = {
  myPerfectCv: {
    brand: "MyPerfectCV",
    checked: "4 October 2026",
    operator: "BOLD LLC",
    operatorSource: "https://www.myperfectcv.co.uk/terms-of-use",
    pricingSource: "https://www.myperfectcv.co.uk/pricing",
    priceScope: "UK site, prices in pounds",
    freePlan: "Build CVs and cover letters free, but free downloads are TXT only. PDF and Word downloads need a paid plan.",
    trial: {
      label: "Premium – 14 days",
      currency: "GBP",
      entryMinor: 295,
      entryDays: 14,
      renewalMinor: 1695,
      cycleDays: fourWeeks,
      renewalWording: "After 14 days, your subscription will be automatically renewed for £16.95, charged every 4 weeks.",
    },
    annual: { label: "Premium – Annual", currency: "GBP", totalMinor: 5940, wording: "Pay £59.40 up-front, save 66%, with yearly auto-renewal. Cancel anytime." },
  },
  liveCareer: {
    brand: "LiveCareer",
    checked: "4 October 2026",
    operator: "BOLD LLC",
    operatorSource: "https://www.livecareer.co.uk/terms-of-service",
    pricingSource: "https://www.livecareer.co.uk/pricing",
    priceScope: "UK site, prices in pounds",
    freePlan: "Build CVs and cover letters free, but free downloads are TXT only. Word and PDF downloads need a paid plan.",
    trial: {
      label: "14-day access",
      currency: "GBP",
      entryMinor: 195,
      entryDays: 14,
      renewalMinor: 1985,
      cycleDays: fourWeeks,
      renewalWording: "After 14 days it automatically renews for £19.85 billed every four weeks.",
    },
    annual: { label: "Annual access", currency: "GBP", totalMinor: 8340, wording: "£83.40 per year billed annually. Automatically renews every year, can be canceled at any time." },
  },
  zety: {
    brand: "Zety",
    checked: "4 October 2026",
    operator: "BOLD LLC",
    operatorSource: "https://zety.com/terms-of-service",
    pricingSource: "https://zety.com/pricing",
    priceScope: "Zety's UK pricing address redirected us to its US-dollar page, so no pound price is quoted here",
    freePlan: "Build a CV and cover letter free, but free downloads are TXT only. PDF and Word downloads need a paid plan.",
    trial: {
      label: "Pro Package (14-day trial)",
      currency: "USD",
      entryMinor: 195,
      entryDays: 14,
      renewalMinor: 2595,
      cycleDays: fourWeeks,
      renewalWording: "After 14 days, auto-renews at $25.95 billed every 4 weeks. Cancel anytime.",
    },
    annual: { label: "Annual Package", currency: "USD", totalMinor: 7140, wording: "Pay $71.40 at once, save 79%. Auto-renews each year. Cancel anytime." },
  },
  kickresume: {
    brand: "Kickresume",
    checked: "4 October 2026",
    operator: "Kickresume",
    operatorSource: "https://www.kickresume.com/terms/",
    pricingSource: "https://www.kickresume.com/en/pricing/",
    priceScope: "prices were shown to us in US dollars",
    freePlan: "Genuinely free to download, as often as you like, if you stick to the 4 basic templates and free customisation options.",
    trial: {
      label: "One Month",
      currency: "USD",
      entryMinor: 900,
      entryDays: 30,
      renewalMinor: 900,
      cycleDays: 30,
      renewalWording: "At the end of the monthly subscription period, you will automatically be signed up and billed for an additional subscription term of 30 days.",
    },
    annual: { label: "One Year", currency: "USD", totalMinor: 4800, wording: "When you purchase an annual subscription, auto-renew is automatically selected in your account." },
  },
} satisfies Record<string, CompetitorPlans>;

/**
 * What a renewing plan costs over `days` if it is never cancelled: the first
 * charge on day 0, then a renewal at the end of the first period and every
 * cycle after that, counting only charges made before `days`.
 */
export function costOverDays(plan: Pick<RenewingPlan, "entryMinor" | "entryDays" | "renewalMinor" | "cycleDays">, days: number) {
  if (days <= 0) return 0;
  let total = plan.entryMinor;
  for (let charge = plan.entryDays; charge < days; charge += plan.cycleDays) total += plan.renewalMinor;
  return total;
}

export function formatMinor(amountMinor: number, currency: "GBP" | "USD") {
  return `${currency === "GBP" ? "£" : "$"}${(amountMinor / 100).toFixed(2)}`;
}
