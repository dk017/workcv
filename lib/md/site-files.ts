import { founder, site } from "../site.ts";
import { isoDate, markdownDocument, markdownLink, markdownUrl, type MarkdownPage } from "./format.ts";
import { privatePaths, publicRoutes, type PublicRoute, type PublicRouteSection } from "./public-routes.ts";
import { renderMarkdownPages } from "./registry.ts";

// Generated site files for agents: llms.txt (llmstxt.org), llms-full.txt and ai.txt.
// Keep in sync with robots.txt; all three read lib/md/public-routes.ts.

const sections: Array<{ section: PublicRouteSection; heading: string }> = [
  { section: "core", heading: "Core pages" },
  { section: "guides", heading: "CV and job search guides" },
  { section: "templates", heading: "CV templates and examples" },
  { section: "tools", heading: "Free tools" },
  { section: "comparisons", heading: "Comparisons with other CV builders" },
  { section: "extensions", heading: "Browser extension and WordPress plugin" },
  { section: "legal", heading: "Legal" },
];

export const llmsFullCharacterLimit = 500_000;
export const aiPolicyUpdated = "2026-10-27";

function orderedRoutes(): PublicRoute[] {
  return sections.flatMap(({ section }) =>
    publicRoutes.filter((route) => route.section === section).sort((a, b) => b.priority - a.priority));
}

function keyFacts() {
  return `Key facts: ${site.name} is run by its founder, ${founder.name}. Building and previewing a CV is free. One saved CV with its matching cover letter costs ${site.price} once, downloaded as PDF and editable Word (single-column). The ${site.passDays}-day Job Search Pass costs ${site.passPrice} once and covers unlimited CVs and cover letters created during the pass. Neither renews. Contact: ${site.email}.`;
}

function linkLine(route: PublicRoute, page: MarkdownPage | null) {
  const link = markdownLink(page?.label ?? route.path, markdownUrl(route.path));
  return page?.summary ? `- ${link}: ${page.summary}` : `- ${link}`;
}

export async function buildLlmsTxt() {
  const routes = orderedRoutes();
  const rendered = await renderMarkdownPages(routes.map((route) => route.path));
  const pages = new Map(routes.map((route, index) => [route.path, rendered[index]]));
  const list = (section: PublicRouteSection) => routes
    .filter((route) => route.section === section)
    .map((route) => linkLine(route, pages.get(route.path) ?? null))
    .join("\n");

  return [
    "# WorkCV",
    `> ${site.description}`,
    keyFacts(),
    "Every link below is the markdown version of a page. Drop the .md suffix for the HTML page, which is the canonical URL to cite.",
    ...sections
      .filter(({ section }) => section !== "extensions" && section !== "legal")
      .map(({ section, heading }) => `## ${heading}\n\n${list(section)}`),
    `## Machine-readable

- [Full content](${site.url}/llms-full.txt): every public page as markdown in one file
- [Markdown catalog](${site.url}/api/md/_catalog): JSON list of every page with its HTML and markdown URL
- [Sitemap](${site.url}/sitemap.xml): canonical HTML pages
- [AI usage policy](${site.url}/ai.txt): permissions, restrictions and how to cite WorkCV
- [OpenAPI](${site.url}/.well-known/openapi.json): the public discovery endpoints (health, API catalog, agent skills)
- [Agent skill: create a UK CV](${site.url}/agent-skills/create-uk-cv.md): how an agent can help a user through the website
- [Auth notes](${site.url}/auth.md): how sign-in works and what agents must ask the user first`,
    `## Optional\n\n${list("extensions")}\n${list("legal")}`,
  ].join("\n\n") + "\n";
}

export async function buildLlmsFullTxt(now = new Date()) {
  const routes = orderedRoutes();
  const rendered = await renderMarkdownPages(routes.map((route) => route.path));
  const entries = routes.map((route, index) => {
    const page = rendered[index];
    return { route, page, text: page ? `---\n<!-- source: ${page.canonical} -->\n\n${markdownDocument(page)}` : "" };
  });

  // Core and legal pages always go in. The rest are picked by sitemap priority until the budget is
  // spent (smaller pages can still fill the gap), then everything is printed in section order.
  // The list of pages left out has its own share of the limit.
  const budget = llmsFullCharacterLimit - 30_000;
  const always = (entry: (typeof entries)[number]) => entry.route.section === "core" || entry.route.section === "legal";
  const chosen = new Set<string>();
  let length = 0;
  for (const entry of [...entries].sort((a, b) => Number(always(b)) - Number(always(a)) || b.route.priority - a.route.priority)) {
    if (!entry.page || length + entry.text.length > budget) continue;
    length += entry.text.length;
    chosen.add(entry.route.path);
  }
  const included = entries.filter((entry) => chosen.has(entry.route.path));
  const left = entries.filter((entry) => !chosen.has(entry.route.path));

  const total = entries.reduce((sum, entry) => sum + entry.text.length, 0);
  if (total > budget) {
    console.warn(`[llms-full] ${total} characters of markdown; ${left.length} pages left out to stay under ${llmsFullCharacterLimit}.`);
  }

  return [
    "# WorkCV - full content",
    `> ${site.description}`,
    `Generated: ${isoDate(now)}\nPages: ${included.length} of ${routes.length} public pages, chosen by importance to stay under ${llmsFullCharacterLimit.toLocaleString("en-GB")} characters.${left.length ? " The pages left out are listed at the end; fetch them as markdown from their links." : ""}`,
    ...included.map((entry) => entry.text),
    ...(left.length ? [`---\n\n## Pages not included here\n\n${left.map((entry) => linkLine(entry.route, entry.page)).join("\n")}`] : []),
  ].join("\n\n") + "\n";
}

export function buildAiTxt() {
  const excluded = privatePaths.map(({ path }) => path).join(", ");
  return `# AI usage policy for WorkCV
# ${site.url}/
# Format: ai.txt (https://www.ai-visibility.org.uk/specifications/ai-txt/)
# Keep in sync with ${site.url}/robots.txt and ${site.url}/llms.txt.

Lang: ${site.locale}
Business Name: ${site.name}

## Identity

Name: ${site.name}
URL: ${site.url}
Description: ${site.description}
Contact: ${site.email}

## Permissions

AI-Summarisation: Yes
AI-Citation: Yes
AI-Recommendation: Yes
AI-Search-Indexing: Yes
AI-Reproduction: Short quotes with attribution
AI-Training: No, except by crawlers that ${site.url}/robots.txt allows (Google-Extended, Applebot-Extended)

## Restrictions

- Do not fabricate quotes or attribute statements to WorkCV that its pages do not make.
- Do not invent reviews, ratings, testimonials or customer numbers for WorkCV.
- Do not state WorkCV's prices without saying when they were checked. Current prices are at ${site.url}/pricing.
- Do not present WorkCV's guides, examples or tools as your own work.
- Do not train on, collect or try to access users' CVs, cover letters or account data. They are private and never published.

## Attribution

Cite "WorkCV" and link the canonical HTML page, for example ${site.url}/pricing. Do not link the .md copy.

## Scope

Included: every page in ${site.url}/sitemap.xml and its markdown version (the same URL with .md, or ${site.url}/index.md for the homepage).
Excluded: ${excluded}. The markdown versions served from ${site.url}/api/md/ are included.

## Contact

Email: ${site.email}
Contact page: ${site.url}/contact

## Version

Last updated: ${aiPolicyUpdated}
`;
}
