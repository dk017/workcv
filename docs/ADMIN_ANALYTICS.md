# Private WorkCV analytics

Open `/admin/analytics` after signing in with an email explicitly included in `ANALYTICS_ADMIN_EMAILS` (comma-separated). Empty configuration denies every account. Approved accounts also see an Analytics link in the site header. No WerkCV customer records are imported.

Views: Overview, Live activity, Acquisition, Conversion, Checkout & sales, Job Pass, Pages & tools. Rolling ranges: 24 hours, 7 days, 30 days. Optional foreground refresh runs every 60 seconds.

## Enable on deployment

Set `ANALYTICS_ADMIN_EMAILS` to the owner's confirmed WorkCV sign-in email(s) in the deployment environment and restart the app. Do not use the synthetic QA identities below. Existing authentication, payment and analytics tables must already be provisioned. `WORKCV_FUNNEL_INGEST_ENABLED=true` is needed for ongoing public event collection. Reporting itself uses read-only repeatable-read transactions and never initializes or changes production tables.

## Interpretation and privacy

- Visitors are observed browser identities, not guaranteed unique people. Live activity means public events within 15 minutes, not presence monitoring. No location tracking is added.
- Conversion milestones use one landing cohort, with each account assigned to at most one browser identity; stages are independent. Orders and editor totals also include customers whose visits could not be linked.
- Sales use stored checkout attribution; missing snapshots remain identified. Source traffic and attributed sales are different populations.
- Positive paid orders exclude test orders and configured admin/test accounts. Revenue is gross before fees, refunds and tax; currencies remain separate. Refund flags are not refunded amounts.
- Public tracking coverage can differ from order coverage. Signed-out operator activity, bots and browser blocking can affect totals.
- Timestamps display in IST; chart buckets use UTC. Boundary buckets are partial.
- Admin pages require server-side authorization, disable caching/indexing, and omit third-party analytics. No CV text, customer emails or raw payment payloads appear in the report.

## Verification

`npm run type-check`, `npm run test:tools`, `npm run build`.

Optional PostgreSQL integration test: start a dedicated disposable postgres:16-alpine container on localhost port 55439, database/user `analytics_qa`; set `ADMIN_ANALYTICS_TEST_DATABASE_URL` and run `node --no-warnings --test --experimental-strip-types tests/admin-analytics.test.ts`. The fixture refuses other hosts, ports, database names or users. It truncates only that isolated QA database. Never point it at a real database.

Browser QA script `scripts/admin-analytics-browser-qa.mjs` expects localhost:43189 with the synthetic fixture, `AUTH_SESSION_SECRET=analytics-local-qa-secret` and `ANALYTICS_ADMIN_EMAILS=admin@example.invalid`. It tests guest/customer denial, seven admin views, refresh, mobile overflow, browser errors and external tracking requests. Screenshots in `tmp/analytics-*.png` contain synthetic data only.
