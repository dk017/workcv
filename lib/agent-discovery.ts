import { site } from "@/lib/site";

export const agentDiscoveryLinks = [
  `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  `</auth.md>; rel="service-doc"; type="text/markdown"`,
  `</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"`,
];

export const agentDiscoveryLinkHeader = agentDiscoveryLinks.join(", ");

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
