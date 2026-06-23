import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# WorkCV auth and agent access

WorkCV does not currently provide OAuth/OIDC agent registration or a public third-party API.

## User authentication

Users sign in to WorkCV with a one-time email code through the website. This lets the site save and reopen a user's CV.

## Agent guidance

- Agents should use the normal website flow unless WorkCV publishes a dedicated API in the future.
- Agents must ask the user before entering an email address, payment details, verification code or other personal data.
- Agents should not attempt to bypass checkout, login, payment or download controls.

## Current useful endpoints

- Website: ${site.url}
- Editor: ${site.url}/editor
- Pricing: ${site.url}/pricing
- API catalog: ${site.url}/.well-known/api-catalog
- Health: ${site.url}/api/health
- Agent skills: ${site.url}/.well-known/agent-skills/index.json
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
