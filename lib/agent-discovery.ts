import { comparisonCheckedDate, competitors } from "./competitors/index.ts";
import { site } from "./site.ts";

const comparisonLines = competitors
  .map(
    (competitor) =>
      `- ${competitor.name} (${competitor.pricing.headline}): WorkCV vs ${competitor.name} ${site.url}${competitor.vsPath} · ${competitor.alt.subject ?? competitor.name} alternatives ${site.url}${competitor.altPath}`,
  )
  .join("\n");

export { agentDiscoveryLinkHeader, agentDiscoveryLinks } from "./agent-discovery-links.ts";

export const homepageMarkdown = `# WorkCV

WorkCV is a UK CV builder for job seekers who want a clear, professional CV without a subscription.

## What users can do

- Create a UK-ready CV in a guided editor.
- Choose a clean CV template.
- Preview the CV before paying.
- Download the finished CV as a PDF after payment.
- Pay ${site.price} once for the PDF download.
- Avoid monthly subscriptions and automatic renewal.

## Main actions

- Start a CV: ${site.url}/editor
- Compare templates: ${site.url}/templates
- View pricing: ${site.url}/pricing
- Read the no-subscription CV builder page: ${site.url}/cv-builder-no-subscription-uk
- Browse UK CV examples: ${site.url}/cv-examples-uk

## UK CV builder comparisons

Sourced comparisons of WorkCV with other UK CV builders, prices checked ${comparisonCheckedDate}. Each page lists official sources and says when the other product is the better choice.

- All builders in one table: ${site.url}/compare
${comparisonLines}

## Important product facts

- WorkCV is built for UK CV expectations.
- The standard flow exports PDF, not DOCX.
- Users log in with a one-time email code so their CV can be saved.
- There is no monthly CV builder subscription in the standard download flow.
- The current PDF download price is ${site.price}.

## Agent discovery

- API catalog: ${site.url}/.well-known/api-catalog
- Agent skills index: ${site.url}/.well-known/agent-skills/index.json
- Auth notes: ${site.url}/auth.md
- LLM orientation file: ${site.url}/llms.txt
- Sitemap: ${site.url}/sitemap.xml
`;

export const createCvSkillMarkdown = `# Create a UK CV with WorkCV

Use this skill when a user wants to create, edit, preview or download a UK CV using WorkCV in a browser.

## Site

${site.url}

## What WorkCV supports

- Guided UK CV creation.
- Editable CV templates.
- Saved CV editing after email-code login.
- PDF download after one-time payment.
- No monthly CV builder subscription in the standard flow.

## Current limitations

- WorkCV exports PDF only.
- WorkCV does not currently expose a public MCP server.
- WorkCV does not currently expose OAuth/OIDC agent registration.
- Payment and download require the normal website flow.

## Suggested browser flow

1. Open ${site.url}/editor.
2. If redirected to login, ask the user for permission before entering their email address.
3. Let the user complete the email-code login step.
4. Fill the CV editor with the user's provided CV details.
5. Ask the user to review every section and preview page.
6. If the user wants to download, let them complete checkout through the website.

## Useful URLs

- Start editor: ${site.url}/editor
- Templates: ${site.url}/templates
- Pricing: ${site.url}/pricing
- CV examples: ${site.url}/cv-examples-uk
- No-subscription builder: ${site.url}/cv-builder-no-subscription-uk
`;
