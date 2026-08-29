# WorkCV growth funnel operations

## What is recorded

WorkCV records three privacy-limited public events before authentication:

- `landing_view`
- `marketing_cta_clicked`
- `login_started`

Random first-party visitor and session identifiers are hashed on the server. Public events may contain a same-origin path, a labelled CTA placement, a same-origin destination, a normalised referral source, campaign fields, a referrer hostname, and a broad device class. The endpoint rejects unknown events and arbitrary metadata.

The browser posts these events only to `POST /api/events/funnel`. The authenticated `/api/events/editor` route does not accept anonymous public-funnel traffic. The public endpoint validates an allowlist, rate-limits by both hashed address and hashed session, and never stores an IP address.

Successful email verification links matching anonymous events to the user without persisting the raw browser identifier. Raw visitor and session IDs are replaced by one-way hashes before login-code or signup attribution JSON is written. The schema-preparation command also scrubs forbidden historical JSON keys.

Document creation, confirmed positive payment, and successful PDF generation are server-authoritative lifecycle events:

- `document_created` is emitted after a document is successfully inserted;
- `payment_confirmed` is emitted only after a verified payment webhook and only for a positive amount;
- `pdf_downloaded` is emitted only after the server successfully renders the PDF.

The browser cannot submit those event names. Historical `cv_created` rows remain readable for compatibility, but no new `cv_created` events are emitted. Preview readiness, PDF intent, checkout intent, and payment-start intent remain client events because they describe UI activity rather than completed server outcomes.

Never add CV text, imported document text, job-advert text, email addresses, authentication codes, payment details, or full external URLs to either analytics event table.

## Feature flags and schema preparation

Public measurement requires both flags:

```text
NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED=true
WORKCV_FUNNEL_INGEST_ENABLED=true
```

The first is compiled into the browser bundle; the second is a runtime server gate. Before enabling them for a new environment, run:

```text
npm run db:prepare:growth
```

The command prints the target host/database without credentials, applies additive idempotent schema changes in a transaction, verifies required columns and indexes, and asserts that no raw `visitorId` or `sessionId` keys remain in persisted attribution JSON.

Optional smoke traffic is classified as test data only when `X-WorkCV-Smoke-Token` exactly matches the server-only `WORKCV_FUNNEL_SMOKE_SECRET`. Browser input cannot otherwise mark an event as test. Approved operator accounts are listed with the server-only comma-separated `WORKCV_TEST_USER_IDS`; checkout and webhook code propagate that trusted classification to orders. Production funnel and revenue totals exclude test rows and zero-value orders.

## Reports

With `DATABASE_URL` configured, run:

```text
npm run report:growth -- --days=7
npm run report:growth -- --days=14
npm run report:growth -- --days=30
npm run report:growth -- --days=90
```

The report captures one half-open UTC window (`window_start <= occurred_at < report_end`) and reuses it for every query. It contains no email addresses or CV content, shows first-touch source/landing acquisition and last-touch production revenue separately, and separates positive production orders from test or zero-value orders.

## Retention

Detailed first-party funnel events have a 180-day retention period. Schedule this command at least monthly:

```text
npm run cleanup:growth-events
```

Do not run the cleanup against an unexpected database. Confirm `DATABASE_URL` belongs to WorkCV UK before execution.

## Saved-CV reminder safety gate

The one-time saved-CV reminder is disabled unless both variables are exactly `true`:

```text
SAVED_CV_REMINDER_ENABLED=true
SAVED_CV_REMINDER_LEGAL_APPROVED=true
```

Leave both unset in production until the operator has reviewed the lawful basis, privacy copy, message copy, and suppression behavior. A dry run or send is requested through the protected internal feedback-outreach route with `kind: "saved_cv_reminder"`. The existing outreach secret remains required.

Eligibility uses the user's latest saved document, requires meaningful CV content and at least 24 hours of inactivity across the account, document and editor activity, and suppresses an opted-out user or any document with a positive non-test order. The final claim repeats the latest-document, inactivity, payment and opt-out checks atomically. A successful reminder is sent at most once per user; failed/sending claims have bounded retry and cooldown rules. Keep both flags false for this release: no reminder delivery is authorised.

## Search indexing verification

After starting a production build locally or deploying it, run:

```text
WORKCV_VERIFY_BASE_URL=https://workcv.co.uk npm run verify:indexing
```

This checks real responses for login canonical/noindex-follow behavior, public homepage indexability, private editor noindex-nofollow headers, anonymous editor-event rejection, dedicated funnel-route content validation, and nested return-path encoding.
