const priceAmount = 7.99;
const priceCurrency = "GBP";

export const site = {
  name: "WorkCV",
  domain: "workcv.co.uk",
  url: "https://workcv.co.uk",
  locale: "en-GB",
  priceAmount,
  priceCurrency,
  price: `£${priceAmount.toFixed(2)}`,
  priceGbp: `${priceCurrency} ${priceAmount.toFixed(2)}`,
  summary:
    "A clear, professional UK CV—ready when you are.",
};

export const routes = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];
