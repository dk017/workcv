// Short price strings used on /pricing, /cv-builder-no-subscription-uk and /cv-builder-scams-uk.
// The full, sourced comparison data lives in lib/competitors; keep these in step with it.
export const competitorPricingCheckedDate = "30 October 2026";

export const competitorPricing = {
  myPerfectCv: {
    entry: "£2.95 for 14 days",
    renewal: "£16.95 every 4 weeks",
    annual: "£59.40 billed annually",
    source: "https://www.myperfectcv.co.uk/pricing",
  },
  resumeIo: {
    entry: "£2.95 for 7 days",
    renewal: "£20.95 every 4 weeks",
    annual: "£49.95 billed every 3 months",
    source: "https://resume.io/uk/pricing",
  },
  liveCareer: {
    entry: "£1.95 for 14 days",
    renewal: "£19.85 every 4 weeks",
    annual: "£83.40 billed annually",
    source: "https://www.livecareer.co.uk/pricing",
  },
  cvMaker: {
    entry: "£2.95 for 7 days",
    renewal: "£21.99 per month",
    source: "https://www.cvmaker.uk/pricing",
  },
  zety: {
    entry: "£2.95 for 14 days",
    renewal: "£20.95 every 4 weeks",
    annual: "£59.40 billed annually",
    source: "https://zety.com/uk/pricing",
  },
} as const;
