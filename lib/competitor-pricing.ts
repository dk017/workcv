export const competitorPricingCheckedDate = "23 July 2026";

export const competitorPricing = {
  myPerfectCv: {
    entry: "£2.95 for 14 days",
    renewal: "£16.95 every 4 weeks",
    annual: "£59.40 billed annually",
    source: "https://www.myperfectcv.co.uk/pricing",
  },
  resumeIo: {
    entry: "£2.95 for 7 days",
    renewal: "£19.95 every 4 weeks",
    annual: "£49.95 billed every 3 months",
    source: "https://resume.io/pricing",
  },
  liveCareer: {
    entry: "£1.95 for 14 days",
    renewal: "£19.85 every 4 weeks",
    annual: "£83.40 billed annually",
    source: "https://www.livecareer.co.uk/pricing",
  },
  cvMaker: {
    entry: "£0.99 for 7 days",
    renewal: "£19.99 per month",
    source: "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk",
  },
  zety: {
    entry: "Regional offer shown at checkout",
    renewal: "Regional renewal shown at checkout",
    source: "https://zety.com/pricing",
    note:
      "The former UK pricing URL currently redirects to a non-UK pricing page, so this site does not quote an unverified GBP amount.",
  },
} as const;
