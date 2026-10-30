import { site } from "../../lib/site.ts";

export const dynamic = "force-static";

export function GET() {
  const body = `# WorkCV auth and agent access

WorkCV does not currently provide OAuth/OIDC agent registration or a public third-party API.

## User authentication

A new CV needs no account. The editor opens straight away, and the draft is kept in the browser until the user saves it.

WorkCV asks for an email address and a one-time code (there is no password) when the user downloads a CV, uploads an existing CV or saves the draft to their account. Signing in is also needed to reopen a saved CV from My CVs, to return from checkout, and to carry results from WorkCV's free tools into the editor.

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
- LLM orientation: ${site.url}/llms.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
