# WorkCV growth funnel operations

## What is recorded

WorkCV records three privacy-limited public events before authentication:

- `landing_view`
- `marketing_cta_clicked`
- `login_started`

Random first-party visitor and session identifiers are hashed on the server. Public events may contain a same-origin path, a labelled CTA placement, a same-origin destination, a normalised referral source, campaign fields, a referrer hostname, and a broad device class. The endpoint rejects unknown events and arbitrary metadata.

Existing authenticated editor events remain the source of truth for document progress, preview readiness, PDF interaction, checkout, payment state, and PDF download. Successful email verification links matching anonymous events to the user without persisting the raw browser identifier.

Never add CV text, imported document text, job-advert text, email addresses, authentication codes, payment details, or full external URLs to either analytics event table.

## Reports

With `DATABASE_URL` configured, run:

```text
npm run report:growth -- --days=7
npm run report:growth -- --days=14
npm run report:growth -- --days=30
npm run report:growth -- --days=90
```

The report is UTC-labelled, contains no email addresses or CV content, and separates positive-value orders from test or zero-value orders.

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

Leave both unset in production until the operator has reviewed the lawful basis, privacy copy, message copy, and suppression behavior. A dry run or send is requested through the protected internal feedback-outreach route with `kind: "saved_cv_reminder"`. The existing outreach secret remains required. A paid user is never eligible, a user with an opt-out is never eligible, and the reminder is limited to one successfully sent message per user.

## Search indexing verification

After starting a production build locally or deploying it, run:

```text
WORKCV_VERIFY_BASE_URL=https://workcv.co.uk npm run verify:indexing
```

This checks real responses for login canonical/noindex behavior, public homepage indexability, private editor headers, and nested return-path encoding.
