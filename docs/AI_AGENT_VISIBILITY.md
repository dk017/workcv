# WorkCV AI-agent visibility

This document records the public discovery and crawler policy for WorkCV.

## Current policy

- Allow ChatGPT search through `OAI-SearchBot`.
- Allow user-directed ChatGPT retrieval through `ChatGPT-User` where robots rules apply.
- Block `GPTBot` model-training crawls.
- Allow Claude search and user-directed retrieval through `Claude-SearchBot` and `Claude-User`.
- Block `ClaudeBot` model-training crawls.
- Allow Google Search through `Googlebot`.
- Allow owner-requested Vertex AI agent crawls through `Google-CloudVertexBot`.
- Allow `Google-Extended` for broader visibility and grounding in Gemini Apps and Vertex AI. This is an intentional visibility-first choice and means eligible public content may also be used to improve Google's generative AI models.

The policy is implemented in `app/robots.txt/route.ts`. Provider-specific groups are used instead of custom signals so each crawler receives an explicit rule.

## Public discovery surfaces

- `/llms.txt` — concise, generated orientation document.
- `/agent-markdown` — markdown representation of the homepage for agents that request it.
- `/.well-known/agent-skills/index.json` — browser skill discovery index.
- `/.well-known/api-catalog` — public linkset catalog.
- `/.well-known/openapi.json` — discovery-only OpenAPI document; it is not a CV creation API.
- `/auth.md` — authentication and safe agent-use notes.

The homepage also advertises these surfaces through an HTTP `Link` header from `middleware.ts`.

## Scope boundary

These surfaces make public WorkCV content easier to discover. They do not provide agents with permission to enter personal data, bypass login, bypass payment or download a user's CV. A future agent-action integration would require a separately authenticated API or MCP/App surface with explicit user confirmation.

## Verification

Before and after each deployment, verify:

1. `/robots.txt` returns `200` with `text/plain` and the expected provider groups.
2. Public content pages return `200` HTML for normal and provider crawler user agents.
3. `/llms.txt` and all `.well-known` endpoints return `200` with their intended content types.
4. The sitemap contains canonical, indexable content URLs.
5. No private CV data appears in any discovery response.
