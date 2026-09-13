import { WORKCV_PRICE } from "./commerce.ts";

const priceAmount = WORKCV_PRICE.amount;
const priceCurrency = WORKCV_PRICE.currency;

export const site = {
  name: "WorkCV",
  domain: "workcv.co.uk",
  url: "https://workcv.co.uk",
  locale: "en-GB",
  priceAmount,
  priceCurrency,
  price: `£${priceAmount.toFixed(2)}`,
  priceGbp: `£${priceAmount.toFixed(2)}`,
  priceTaxInclusive: WORKCV_PRICE.taxInclusive,
  summary:
    "A clear, professional UK CV—ready when you are.",
};

export const commercialRoutes = {
  moneyPage: "/cv-builder-no-subscription-uk",
  pricing: "/pricing",
  editor: "/editor?template=classic&new=1",
} as const;

export const routes = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];
