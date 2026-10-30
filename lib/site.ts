import { WORKCV_PASS, WORKCV_PRICE } from "./commerce.ts";

const priceAmount = WORKCV_PRICE.amount;
const priceCurrency = WORKCV_PRICE.currency;

export const site = {
  name: "WorkCV",
  domain: "workcv.co.uk",
  url: "https://workcv.co.uk",
  // Store listing by item ID, so the link survives renames of the listing.
  chromeExtensionUrl: "https://chromewebstore.google.com/detail/bpledmncejopbidegmhdefkpdjgojlmg",
  locale: "en-GB",
  priceAmount,
  priceCurrency,
  price: `£${priceAmount.toFixed(2)}`,
  priceGbp: `£${priceAmount.toFixed(2)}`,
  priceTaxInclusive: WORKCV_PRICE.taxInclusive,
  passPrice: `£${WORKCV_PASS.amount.toFixed(2)}`,
  passDays: WORKCV_PASS.days,
  summary:
    "A clear, professional UK CV—ready when you are.",
  email: "contact@workcv.co.uk",
  // Who we are, for agents: shared by the Organization JSON-LD, llms.txt and ai.txt.
  description:
    `WorkCV is a UK CV builder for job seekers who want a clear, professional CV without a subscription. Build and preview a CV and matching cover letter free, then pay £${priceAmount.toFixed(2)} once to download both as PDF and editable Word, or buy a ${WORKCV_PASS.days}-day Job Search Pass for £${WORKCV_PASS.amount.toFixed(2)}. Nothing renews.`,
};

export const founder = {
  name: "Dhineshkumar R",
  role: "Founder",
  location: "India",
} as const;

export const commercialRoutes = {
  moneyPage: "/cv-builder-no-subscription-uk",
  pricing: "/pricing",
  editor: "/editor?template=classic&new=1",
} as const;

// Main navigation in the site header.
export const routes = [
  { href: "/templates", label: "Templates" },
  { href: "/cv-examples-uk", label: "CV examples" },
  { href: "/tools", label: "Free tools" },
  { href: "/pricing", label: "Pricing" },
];
