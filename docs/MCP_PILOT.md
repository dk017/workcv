# WorkCV MCP pilot

Status: local, disabled-by-default prototype. Not deployed, connected to ChatGPT, or submitted to a directory. No billing tools or paid PDF export are exposed.

## What this experiment proves

A compatible agent can choose a WorkCV template, create a saved CV, read it, replace its content using user-provided facts, and run the existing completeness checks. The Next.js `/mcp` route uses the same CV table, ownership checks, validation, and optimistic update control as the website. There is no new model call: the connected agent supplies the text.

This is a **tool-only** application. The implementation follows the official MCP server example and uses `@modelcontextprotocol/sdk` with stateless Streamable HTTP JSON responses. The UI-heavy Pizzaz example was considered but is unnecessary for this first experiment. A separate deployment or visual widget is not required to expose MCP tools.

## Tools

| Tool | Purpose | Mutates data? |
| --- | --- | --- |
| `list_cv_templates` | Lists Classic UK, Modern, and Compact | No |
| `create_cv` | Creates a blank saved CV with a chosen template | Yes |
| `get_cv` | Reads an owned CV, including its update version | No |
| `update_cv` | Replaces the full CV content or changes template | Yes |
| `review_cv` | Returns CV content and deterministic completeness checks | No |

`review_cv` is a text review, not a rendered PDF, pagination check, or ATS score. The resource `workcv://cv-input-schema` describes the complete input object. There is no checkout, charge, subscription, credit purchase, or paid-download tool.

Create requests require a UUID `requestId`. Reuse it on retries. The document ID is derived from the authenticated account and request ID; the database unique constraint handles concurrent attempts. A retry returns the existing document without resetting later edits. A different `requestId` creates a different CV. Changing the template on a retry does not modify an existing CV; use `update_cv` for that.

Updates require the `updatedAt` returned by `get_cv` as `expectedUpdatedAt`. A stale update fails. Read again before deciding whether to retry; do not automatically overwrite another edit. Unknown CV fields and invalid values are rejected. Tools never accept an account ID from the agent.

## Run the isolated experiment

Requirements: Node 22.13 or newer and dependencies installed with `npm ci`.

```powershell
npm run test:mcp
npm run smoke:mcp
```

The HTTP smoke command starts an ephemeral server on loopback, generates a temporary credential internally, connects the official MCP client, exercises the workflow using a synthetic in-memory store, and shuts down. It prints no credential or personal data. It does not read `.env`, call a model, contact a payment provider, or use the production database.

## Try with an isolated WorkCV account

1. Run a development WorkCV database and sign in to the local website with a dedicated test account. Use synthetic CV details.
2. Obtain that account's existing `workcv_users.id` from your development database. Account IDs come from operator configuration, not a tool input. No production account was selected or provisioned by this implementation.
3. Generate a random 32-byte base64url token with a cryptographic generator. Keep the original only in the MCP client's credential storage. Compute its SHA-256 hex digest for the server configuration. Do not reuse a browser cookie, session secret, or an OpenAI key.
4. Set the following values in local server configuration, keeping secrets out of Git:

```dotenv
WORKCV_MCP_PILOT_ENABLED=true
WORKCV_MCP_PILOT_TOKEN_SHA256=<64-character lowercase SHA-256 hex digest>
WORKCV_MCP_PILOT_USER_ID=<existing development test-account ID>
WORKCV_MCP_PILOT_EXPIRES_AT=<near-future ISO timestamp, preferably within 24 hours>
```

5. Start the website: `npm run dev -- --port 3100`.
6. Configure a compatible MCP client for Streamable HTTP at `http://localhost:3100/mcp` with `Authorization: Bearer <original-token>`. The endpoint returns 401 when the credential is absent, invalid, expired, or misconfigured. GET and DELETE return 405 for valid credentials; this stateless transport does not expose a long-lived SSE session.
7. Ask: “List WorkCV templates, then create a new CV using the Classic UK template. Add only the facts I provide. Review its completeness.” Keep the returned document ID. Sign in to the same local test account and open `/editor?draftId=<document-id>` manually to inspect the existing website preview.
8. Disable `WORKCV_MCP_PILOT_ENABLED` and restart the server to end the pilot, or remove/rotate the configured hash to revoke the credential. Without the flag, `/mcp` returns 404.

The pilot grants one configured account access to its CVs. It does not implement self-service API keys, per-tool scopes, OAuth, refresh tokens, or consent UI. Browser-origin requests from another origin are rejected; configure credentials in an MCP client's backend, not in a web page.

## ChatGPT testing and hosting

The shared tool layer is intended to be reusable in ChatGPT and other MCP clients, but compatibility has only been exercised using the official MCP SDK client. Do not describe this as a connected or approved ChatGPT app.

An authenticated ChatGPT integration needs the documented OAuth 2.1 flow: protected-resource metadata, authorization-server discovery, PKCE, resource binding, and account consent. Implement and test that flow before attempting account linking. Do not put the pilot token in the endpoint URL or expose this operator credential as a public authentication design.

Once OAuth is ready, run locally and expose the test MCP endpoint through an HTTPS development tunnel; add its `/mcp` URL in ChatGPT developer settings and exercise the complete account-linking flow. A public release needs a stable HTTPS endpoint, review credentials, operational monitoring, and directory review where applicable. No tunnel, public deployment, or directory submission is included in this pilot.

## Monetisation hypothesis

The screenshot suggests exposing valuable SaaS capabilities to agents and charging for usage. That is a distribution and pricing hypothesis, not evidence of demand or guaranteed income.

Postiz already exposes authenticated tools using API keys or OAuth. Its MCP page says connecting MCP is included with the account, not an extra per-call charge. WorkCV can use a similar architecture without copying that pricing model.

For WorkCV, the strongest paid outcome to validate is a reliably rendered UK CV PDF. The customer brings their agent; WorkCV provides templates, layout, storage, rendering and delivery. Candidate business customers are career coaches, recruiters, outplacement providers, and job platforms. These are prospective segments, not validated customers.

Suggested commercial experiment:

- Keep the existing website offer while testing whether agents make it easier to complete a CV.
- Interview prospective business users before setting an API price. Offer a small, capped pilot sold through WorkCV separately from a ChatGPT plugin flow.
- Prefer billing for a successfully completed export over arbitrary tool calls. Template browsing, validation failures, reads and retries should not trigger charges.
- Define whether an export entitlement covers a particular CV version or a whole document, and disclose that before selling it. Do not silently alter existing website entitlements.
- Measure active accounts, successful CV workflows, paid exports, repeat use, rendering/support cost and gross margin. No metered billing is implemented here.

OpenAI's published-plugin guidelines checked on 6 September 2026 prohibit selling digital goods/services through plugins, including checkout links, credits and indirect upsells. They permit access to features in an existing paid account/subscription but disallow ChatGPT-specific surcharges. WorkCV's current per-document entitlement needs a specific eligibility assessment before claiming it fits that allowance. A general MCP API and an approved ChatGPT directory listing are separate distribution decisions.

## Requirements before a paid/public launch

1. OAuth account linking and scoped, revocable credentials; test wrong account, expired/replayed tokens and rejected consent.
2. Real rendered preview and paid export that reuse the existing renderer and verify ownership plus entitlement on every request. Never return an unprotected private-document URL.
3. Durable usage ledger, account quotas, explicit spend caps and idempotent export billing. Charge only once for a successful billable operation; test failed renders and payment webhooks.
4. Database-backed integration tests for concurrent creation, stale updates, cross-account access, and paid-download denial. The current protocol tests use a substitute store.
5. Distributed rate limits, request deadlines, safe operational logs, audit events identifying agent-created documents, retention/deletion rules and key rotation. The pilot's limit is 60 authenticated HTTP POSTs per minute per process and is not enterprise quota enforcement.
6. Real client testing, particularly OAuth account linking in ChatGPT, and a separate review of current directory commerce rules.

## Files and verification

- `app/mcp/route.ts`: disabled-by-default HTTP route and database adapter.
- `lib/mcp-auth.ts`: expiring, hash-verified pilot credential.
- `lib/mcp-http.ts`: HTTP transport, origin check, request-size limit and pilot rate limit.
- `lib/mcp-server.ts`: five tools and the input-schema resource.
- `tests/mcp-pilot.test.ts`: protocol and access-control tests.
- `scripts/mcp-pilot-smoke.mjs`: actual HTTP test using the official MCP client and synthetic store.

Verification on 7 September 2026:

- All 180 repository tests passed, including the three MCP test groups.
- The real HTTP smoke with the official MCP client passed.
- TypeScript validation passed. The production build compiled and generated all 117 static pages, but the default standalone output encountered a Windows file lock. A second build using isolated temporary output completed successfully with type checking and linting enabled. No production build configuration was changed.
- A running build returned HTTP 404 with `no-store` and `noindex` for disabled `/mcp`; the homepage returned HTTP 200.

Database-backed writes, payment-provider behaviour, visual preview, OAuth and ChatGPT host integration have not been exercised by this pilot.

## Sources

- [Postiz MCP architecture and authentication](https://docs.postiz.com/mcp/introduction)
- [Postiz MCP offering](https://postiz.com/mcp)
- [OpenAI MCP server guidance](https://developers.openai.com/plugins/build/mcp-server)
- [OpenAI MCP examples](https://developers.openai.com/plugins/build/examples)
- [OpenAI authentication requirements](https://developers.openai.com/plugins/build/auth)
- [OpenAI plugin commerce guidelines](https://developers.openai.com/plugins/app-guidelines)
- [OpenAI tools guidance](https://developers.openai.com/plugins/plan/tools)
