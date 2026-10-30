// Display casing for advert keywords. The keyword dictionary stores most terms
// in lower case ("crm", "sql", "javascript"), so showing or saving them as-is
// would put "Crm" or "Sql" on a CV. Anything that already has capital letters
// (NVQ, PRINCE2, an acronym lifted from the advert) is kept exactly as it is.

const brandCasing: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  wordpress: "WordPress",
  "power bi": "Power BI",
  "google analytics": "Google Analytics",
  "microsoft 365": "Microsoft 365",
  "microsoft office": "Microsoft Office",
  "microsoft teams": "Microsoft Teams",
};

const acronyms = new Set([
  "api", "aws", "cad", "cpr", "crm", "css", "dbs", "erp", "gdpr", "hr", "html",
  "it", "kpi", "kpis", "nhs", "nvq", "pmo", "sap", "seo", "sql", "ui", "uk", "ux", "vat",
]);

export function formatKeyword(term: string) {
  const text = term.trim();
  if (!text) return text;
  if (text !== text.toLocaleLowerCase("en-GB")) return text;

  const brand = brandCasing[text];
  if (brand) return brand;

  const words = text.split(/\s+/).map((word) => (acronyms.has(word) ? word.toLocaleUpperCase("en-GB") : word));
  const joined = words.join(" ");
  return joined.charAt(0).toLocaleUpperCase("en-GB") + joined.slice(1);
}
