import { markdownPath } from "./md/format.ts";
import { site } from "./site.ts";

// The site-level files that describe WorkCV to agents. Keep in sync with robots.txt, llms.txt and ai.txt.
export const agentDescribedByLinks = [
  `</llms.txt>; rel="describedby"; type="text/plain"`,
  `</llms-full.txt>; rel="describedby"; type="text/plain"`,
  `</ai.txt>; rel="describedby"; type="text/plain"`,
];

export function pageLinkHeader(path: string) {
  return [`<${markdownPath(path)}>; rel="alternate"; type="text/markdown"`, ...agentDescribedByLinks].join(", ");
}

export const agentDiscoveryLinks = [
  `</index.md>; rel="alternate"; type="text/markdown"`,
  ...agentDescribedByLinks,
  `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  `</auth.md>; rel="service-doc"; type="text/markdown"`,
  `</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"`,
];

export const agentDiscoveryLinkHeader = agentDiscoveryLinks.join(", ");

export const createCvSkillMarkdown = `# Create a UK CV with WorkCV

Use this skill when a user wants to create, edit, preview or download a UK CV using WorkCV in a browser.

## Site

${site.url}

## What WorkCV supports

- Guided UK CV creation.
- Editable CV templates.
- Saved CV editing after email-code login.
- PDF and Word (.docx) download after one-time payment.
- A matching cover letter, included in the same payment.
- No monthly CV builder subscription in the standard flow.

## Current limitations

- The Word file uses a single-column layout, so sidebar templates look simpler in Word than in the PDF.
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
- Compare UK CV builders: ${site.url}/best-cv-builder-uk
- No-subscription builder: ${site.url}/cv-builder-no-subscription-uk
`;
