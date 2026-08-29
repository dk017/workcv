# WorkCV daily-sale growth release: remediation and completion specification

**Execution specification for Luna Max**
**Status:** Approved follow-up implementation brief
**Prepared:** 28 August 2026
**Repository:** `D:\DKPlayground\OneOffUKCV`
**Production site:** `https://workcv.co.uk`
**Base implementation:** commit `06aae77` (`Implement daily sale growth funnel`)
**Parent specification:** `specs/DAILY_SALE_GROWTH_SPEC_2026-08-27.md`

## 1. Assignment

Complete the daily-sale growth implementation by correcting the review findings in this document. Work directly in the existing application and preserve the successful parts of commit `06aae77`.

This is a remediation release, not a redesign. Do not create new SEO pages, change the price, add payment plans, reopen crawler-training policy, replace the design system, or rewrite unrelated content. Do not enable saved-CV reminder delivery in production.

Implement, test, deploy, and verify the changes end to end. Do not report completion merely because TypeScript compiles or source files contain expected strings. The release is complete only when the behaviour-level, visual, database, and live-response gates in this specification pass.

Where this document conflicts with the 27 August parent specification, this document governs the remediation. All unaffected parent-spec requirements remain in force.

## 2. Required outcome

After this release:

1. Raw visitor and session identifiers never enter any database column, JSON document, log, report, or error message.
2. Public funnel events use a dedicated allowlisted endpoint; the authenticated editor-event endpoint is authenticated for every request.
3. Only a first public landing can produce `landing_view`; private and API routes cannot inflate qualified sessions.
4. Document creation, payment confirmation, and successful PDF delivery have authoritative server-side sources.
5. The growth report is complete, time-bounded, privacy-safe, and useful by first source, last source, first landing, device class, and UTC week.
6. Positive production orders, test orders, and zero-value orders are visibly separated.
7. `/login` consistently emits `noindex, follow`, including parameterised responses.
8. The under-GBP-10 answer remains truthful if the live price changes.
9. Every required commercial and contextual transition has a stable, unique placement label, and login engagement can be attributed to the initiating CTA.
10. Reminder eligibility is correct and fully tested, while delivery remains disabled pending legal approval.
11. The deployed schema, event ingestion, reporting, indexing, checkout boundary, and paid-PDF boundary are verified without counting test activity as a sale.

## 3. Non-negotiable product and safety invariants

Preserve these truths:

- Email-code login is required before editing.
- Building and previewing a saved CV are available before payment.
- `site.price`/`site.priceGbp` is charged once to unlock one saved CV PDF.
- There is no monthly subscription or automatic renewal in the standard flow.
- The finished WorkCV PDF is not free.
- No ATS, interview, recruiter, or employment outcome is guaranteed.
- No fabricated testimonials, ratings, endorsements, usage totals, urgency, or scarcity may be introduced.
- Existing payment idempotency, consent handling, webhook verification, and conversion alerts must remain intact.
- Analytics failure must never block navigation, authentication, saving, checkout, webhook processing, or PDF delivery.
- Do not read, print, or copy CV content, emails, authentication codes, payment data, raw browser identifiers, or secrets during implementation or verification.
- Preserve all unrelated tracked and untracked user files.

## 4. Preflight and change discipline

Before editing:

1. Read this file and the parent specification completely.
2. Inspect `git status --short`; record unrelated changes and leave them untouched.
3. Confirm `HEAD`, `origin/main`, and the deployed image revision.
4. Read the existing implementations in:
   - `components/attribution-capture.tsx`
   - `components/tracked-link.tsx`
   - `app/api/events/editor/route.ts`
   - `lib/funnel-events.ts`
   - `lib/attribution.ts`
   - `lib/auth.ts`
   - `lib/db.ts`
   - `lib/editor-events.ts`
   - `components/cv-editor.tsx`
   - `scripts/report-growth.mjs`
   - `lib/saved-cv-reminders.ts`
   - `middleware.ts`
5. Keep changes additive and rolling-deployment safe. Never require destructive table recreation.
6. Make small, reviewable commits or one focused release commit. Do not include unrelated untracked files.

## 5. Workstream A: eliminate raw identifier persistence

### 5.1 Confirmed defect

`sanitizeSignupAttribution` currently retains raw `visitorId` and `sessionId`. The full object can then be stored in `workcv_login_codes.attribution` and `workcv_signup_events.attribution`. Hashing only the identifiers stored in `workcv_funnel_events` is insufficient.

### 5.2 Required data contract

Use two distinct types:

- `BrowserSignupAttribution`: may temporarily contain raw `visitorId` and `sessionId` in process memory.
- `PersistedSignupAttribution`: must never contain those fields. It may contain `visitorHash` and `sessionHash` plus the existing length-limited landing, referrer-host, and UTM fields.

Create a server-only conversion function that:

1. sanitises the browser payload;
2. hashes valid identifiers immediately with `hashAnalyticsIdentifier`;
3. returns the persisted shape;
4. does not mutate or log the browser payload;
5. drops invalid identifiers instead of preserving them.

The login-code row may store only the persisted shape. Verification must link funnel rows using the stored visitor hash directly; it must never reconstruct or retrieve the raw browser identifier.

`recordSignupEvent` must accept only `PersistedSignupAttribution`. TypeScript should make passing the browser shape a compile-time error.

### 5.3 Existing-row scrub

Add an idempotent, narrowly scoped migration step that removes only these JSON keys if they exist:

- `visitorId`
- `sessionId`

Apply it to:

- `workcv_login_codes.attribution`
- `workcv_signup_events.attribution`

Do not delete rows or alter other attribution fields. Before and after deployment, report only the count of rows containing the forbidden keys, never their values. The required post-migration count is zero.

### 5.4 Privacy copy

Retain the current privacy statement that identifiers are hashed before storage, but only after the implementation makes that statement true for every persistence path.

### 5.5 Acceptance tests

Add tests that invoke the authentication service with valid raw identifiers and inspect captured database parameters. Assert that:

- no serialised database value contains the raw visitor or session identifier;
- the expected deterministic hashes are present where linkage requires them;
- signup completion links matching hashed funnel rows to the user;
- invalid identifiers are dropped;
- logs and thrown errors do not contain raw identifiers.

Searching source text is not sufficient.

## 6. Workstream B: restore endpoint separation and safe delivery

### 6.1 Dedicated public endpoint

Create:

`POST /api/events/funnel`

Move public-event handling out of `POST /api/events/editor`.

After the change:

- `/api/events/funnel` accepts only `landing_view`, `marketing_cta_clicked`, and `login_started`.
- `/api/events/editor` requires an authenticated user before event-name processing and accepts only authenticated editor events.
- An anonymous request to `/api/events/editor` always returns `401`, even if its body resembles a public funnel event.
- The client sends public events only to `/api/events/funnel`.

### 6.2 Validation

Preserve and test these server rules:

- JSON content type is required.
- Event, visitor, session, and path fields are bounded.
- Paths and CTA destinations are same-origin application paths with query values stripped.
- Full URLs, protocol-relative paths, backslashes, control characters, and parser-confusion payloads are rejected.
- Referrers are persisted as valid hostnames only.
- Metadata is a small exact allowlist; arbitrary keys are discarded.
- Email, name, CV text, job-advert text, authentication codes, payment details, and arbitrary nested objects cannot be persisted.
- Visitor, session, and event identifiers are hashed before insertion.
- Duplicate `landing_view` events for one session are ignored.

### 6.3 Rate limiting

Replace the database count keyed only by the client-controlled session ID.

Reuse `lib/tool-rate-limit.ts` or extract a shared equivalent. Build the limiter key from a server-side HMAC of the best trusted request address plus the validated session hash. Do not persist the raw address and do not use it for visitor identification or reporting.

Requirements:

- per-session burst limit;
- per-address burst limit to prevent session rotation;
- `429` with rate-limit headers;
- bounded in-memory cleanup;
- production-safe behaviour with an `unknown` address;
- tests for limit, reset, and session rotation.

### 6.4 Non-blocking client behaviour

Public tracking must remain fire-and-forget. Failed, timed-out, disabled, or rate-limited requests must not prevent the original link action or form submission.

### 6.5 Trusted smoke-event classification

Add `is_test BOOLEAN NOT NULL DEFAULT FALSE` to `workcv_funnel_events`. A public JSON property must never be able to set it.

For live ingestion verification only, allow the server to set `is_test = true` when an `X-WorkCV-Smoke-Token` header matches `WORKCV_FUNNEL_SMOKE_SECRET` using a timing-safe comparison. If the secret is absent, smoke classification is unavailable. Never log the token. Production funnel totals must exclude test events and show their count only in the data-quality table.

### 6.6 Feature flag

Introduce two documented public-funnel controls:

`NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED`

`WORKCV_FUNNEL_INGEST_ENABLED`

Rules:

- both default off when unset;
- the public flag controls whether the browser sends funnel events and is fixed when the immutable Next.js image is built;
- the server flag is a runtime emergency control for database ingestion;
- enable both locally only after route and persistence tests pass;
- run production schema preparation before building the release image with the public flag enabled;
- deploy with server ingestion enabled only after schema verification passes;
- when server ingestion is disabled, the endpoint should return a harmless no-store response and must not write data;
- disabling either control must not break first-touch attribution needed for authentication;
- the server endpoint must validate every request even when the client flag is expected to prevent delivery.

## 7. Workstream C: count only public landing sessions

Create and test a single `isPublicMeasurementPath(pathname)` helper.

It must return false for at least:

- `/login` and parameter variants;
- `/editor` and parameter variants;
- `/my-cvs`;
- `/cv-pdf/*`;
- `/api/*`;
- internal agent-rendering or embedded/noindex utility routes not intended as acquisition landings.

`AttributionCapture` may remain in the root layout, but it must not set the session-level `landingTracked` marker on an excluded route. If the visitor subsequently reaches a public page in the same browser session, that first public page must receive the one `landing_view` event.

Keep first touch immutable. Keep the existing 30-day rule that prevents direct traffic overwriting a known recent last touch.

Add regression tests for:

- first load on `/login`, then `/pricing`;
- first load on `/editor`, then `/`;
- first load on a public commercial page;
- multiple public navigations in one session;
- a new browser session with an existing visitor identifier.

## 8. Workstream D: authoritative lifecycle events

### 8.1 Stable event vocabulary

The canonical event name is `document_created`, not `cv_created`.

Keep historical `cv_created` rows readable for compatibility, but stop emitting new ones. Document the compatibility rule in `docs/GROWTH_FUNNEL.md`.

### 8.2 Server event helper and idempotency

Create a server-only event writer for authoritative editor lifecycle events. It must:

- accept only a server-event allowlist;
- accept user and document associations from trusted server state;
- allow a stable deduplication key for events that must occur once;
- catch and report analytics failures without failing the underlying product action;
- never accept arbitrary metadata.

Add an additive nullable `event_key` column to `workcv_editor_events` and a partial unique index over non-null values. Use it for authoritative once-only events. Existing rows retain null keys and must continue to work.

### 8.3 `document_created`

Emit after a CV document is successfully created on the server, including auto-created current documents and `/api/cv/new` documents.

Required metadata:

- `creation_method`: one of `blank`, `template`, or `role_template`;

`import_started` and `import_succeeded` remain separate events. Do not relabel an import as document creation.

Emit at most once per document.

### 8.4 `preview_ready`

Continue recording this once per document readiness transition. Add a stable `completion_band` property such as `useful_preview_ready`; a numeric readiness score may remain as an additional bounded property.

### 8.5 `payment_confirmed`

Remove `payment_confirmed` from browser-postable event paths.

The Dodo webhook/order insertion is the source of truth. After a verified positive-value order is safely recorded, write an idempotent server event associated with the trusted user and draft. The event must not contain an email, amount, checkout URL, or provider payload.

The growth report must continue to count the order table—not the analytics event—as commercial revenue truth.

### 8.6 `pdf_downloaded`

Record successful PDF delivery in `app/api/cv/pdf/route.ts` only after rendering succeeds and immediately before returning the PDF response. This server event must be best-effort: analytics failure cannot turn a successful PDF into an error.

Remove the client-side `pdf_downloaded` emission to prevent duplicates. A browser click remains `pdf_clicked`.

### 8.7 Tests

Test actual handlers/services with a fake database boundary:

- first document creation produces exactly one `document_created` event and the correct method;
- duplicate creation handling does not duplicate the event;
- an authenticated client cannot post `payment_confirmed`;
- a verified positive order produces one server confirmation event;
- duplicate webhook delivery does not duplicate it;
- a successful PDF response records `pdf_downloaded`;
- PDF-event persistence failure still returns the PDF;
- a failed PDF render never records a successful download.

## 9. Workstream E: decision-grade growth reporting

### 9.1 Command contract

Retain:

`npm run report:growth -- --days=7|14|30|90`

Add an explicit `--timezone=UTC` default. Reject unsupported windows or timezones rather than silently changing them.

The report must never print email, name, CV content, raw identifiers, checkout URLs, provider payloads, or individual user/document IDs.

### 9.2 Time-window rule

Every reported stage must use the same half-open UTC window:

`window_start <= occurred_at < report_generated_at`

No downstream `EXISTS` query may count an event or order outside that window. Print the exact start, end, timezone, and report generation time.

Do not label the output as a signup cohort unless it is actually cohort-based. The default report is an operational event-window report.

### 9.3 Required headline totals

Output all of these separately:

- qualified public sessions;
- marketing CTA clickers and clicks;
- login starters;
- completed signups;
- activated users;
- created documents;
- preview-ready users;
- PDF clickers;
- checkout-sheet openers;
- payment starters;
- positive-value non-test production orders;
- gross production revenue in minor units and formatted GBP where currency is GBP;
- zero-value orders;
- explicitly marked test/operator orders;
- successful server-confirmed PDF downloaders and downloads.

Never combine positive production orders with zero/test orders.

### 9.4 Order classification

Add `is_test BOOLEAN NOT NULL DEFAULT FALSE` to both `workcv_payment_checkouts` and `workcv_orders`.

Define `WORKCV_TEST_USER_IDS` as a server-only comma-separated allowlist of approved operator/test user IDs. The authenticated checkout route determines `is_test` from the trusted current user and persists it on the checkout. The verified webhook copies that trusted checkout value to the order. Do not accept `is_test` from a browser body or provider metadata.

Before using the report commercially, audit existing known operator/test orders using aggregate-safe criteria and explicitly mark only verified test rows. Do not reclassify an existing positive order based on a guess.

Only trusted server paths may mark an order as test. Never accept this classification from a public browser event. Document how operator and smoke-test orders are marked.

Definitions:

- production order: `amount_cents > 0 AND is_test = false`;
- zero-value order: `amount_cents IS NULL OR amount_cents <= 0`;
- test/operator order: `is_test = true`, shown separately regardless of value.

Do not infer that every provider sandbox marker is production-safe without checking the actual webhook payload contract.

### 9.5 Required grouped tables

Produce these tables:

1. **First-touch funnel by source and first public landing**
   - source;
   - first landing path;
   - qualified sessions;
   - CTA clickers;
   - login starters;
   - signups;
   - activated users/documents;
   - preview-ready users;
   - PDF clickers;
   - checkout openers;
   - payment starters;
   - production buyers;
   - successful PDF downloaders.

2. **Acquisition sessions by source, landing, device, and UTC week**
   - source;
   - landing path;
   - device class;
   - UTC week start;
   - sessions;
   - CTA clicks;
   - CTA click rate.

3. **Last-touch production orders**
   - last-touch normalised source;
   - last-touch landing path where known;
   - production orders;
   - revenue.

4. **Data-quality table**
   - unattributed signups;
   - linked versus anonymous landing events;
   - private-path landing events, which must be zero after release;
   - duplicate event conflict count where measurable;
   - zero/test order counts;
   - missing user or document associations for authoritative events.

### 9.6 Source normalisation

Correctly and separately normalise:

- Google;
- Bing;
- ChatGPT;
- Claude;
- Gemini;
- Perplexity;
- Copilot;
- other directory/referral;
- direct/unknown.

In particular, `copilot.microsoft.com` and a Copilot UTM must produce `copilot`, not `bing`. `bing.com` must remain `bing`.

Raw UTM source may remain in its safe, bounded field, while output uses the normalised value. Continue describing UTM-only ChatGPT traffic as ChatGPT-tagged, not guaranteed referral.

### 9.7 Report tests

Create a deterministic fixture containing:

- anonymous sessions;
- linked sessions;
- every funnel stage;
- events immediately before, inside, and immediately after the window;
- one positive production order;
- one zero-value order;
- one positive test order;
- first- and last-touch differences;
- Google, Bing, ChatGPT, Claude, Gemini, Perplexity, Copilot, referral, and direct traffic;
- a private-path event to exercise the data-quality warning.

Run the same report aggregation code used by production against the fixture and assert exact totals and group rows. Add a read-only production smoke that verifies the command executes, prints no PII column, and clearly labels the timeframe and order categories.

## 10. Workstream F: saved-CV reminder correctness

### 10.1 Delivery state

Keep both production flags unset/false:

- `SAVED_CV_REMINDER_ENABLED`
- `SAVED_CV_REMINDER_LEGAL_APPROVED`

Do not send any reminder during implementation, testing, deployment, or live verification.

### 10.2 Schema preparation

Create `workcv_saved_cv_reminders` during an explicit pre-deployment schema-preparation step, even while delivery remains disabled. Do not rely on the first enabled send attempt to create the table.

The preparation step must be idempotent and exit non-zero if the table or expected indexes cannot be confirmed.

### 10.3 Eligibility

Select each user's latest saved CV before applying inactivity rules. Do not filter old documents first and then use `DISTINCT ON`.

A user is eligible only when all conditions are true at claim time:

- the latest relevant CV contains meaningful user-entered or imported content; an automatically created blank CV is insufficient;
- there has been no account/editor/document activity for at least 24 hours;
- the selected document has no positive-value, non-test order;
- applicable communication preferences have not opted out;
- no successful saved-CV reminder has ever been sent to that user;
- a failed/sending attempt satisfies the bounded retry delay and attempt limit.

Payment suppression must be document-specific because the purchase unlocks one saved CV PDF. Recheck payment and opt-out suppression atomically immediately before a send claim so a payment completed during candidate selection cannot be followed by a reminder.

### 10.4 Concurrency and retries

Use one atomic claim operation. Concurrent workers must not send two messages. Preserve:

- at most three attempts;
- at least 30 minutes between retries;
- terminal `sent` state;
- safe, bounded error text;
- one successfully delivered reminder per user.

### 10.5 Behaviour tests

Use eligibility fixtures or a test database and cover:

- one old meaningful CV: eligible;
- recent latest CV plus older CV: not eligible;
- blank auto-created CV: not eligible;
- latest document already purchased: not eligible;
- older document purchased but latest document unpaid: evaluate the latest document correctly;
- opt-out: not eligible;
- already sent: not eligible;
- failed retry before delay: not eligible;
- failed retry after delay and below cap: eligible;
- concurrent claims: only one succeeds;
- payment appears between selection and claim: send is suppressed;
- both feature flags are required;
- dry run never claims or sends;
- SMTP failure is recorded without exposing the email in logs.

## 11. Workstream G: indexing correction

### 11.1 Header policy

Separate `/login` from private workflow paths in middleware:

- `/login`: `X-Robots-Tag: noindex, follow, noarchive`;
- `/editor`, `/my-cvs`, `/cv-pdf/*`: `X-Robots-Tag: noindex, nofollow, noarchive`.

Keep the existing self-canonical metadata:

- `/login` -> `/login`;
- `/editor` -> `/editor` if rendered;
- `/my-cvs` -> `/my-cvs` if rendered.

Do not disallow `/login` in `robots.txt`. Do not add private routes to the sitemap.

### 11.2 Response-level tests

Extend the production-server verifier to assert the full token policy, not merely the presence of `noindex`:

- parameterised `/login` contains `noindex` and `follow`, and does not contain `nofollow`;
- editor/account responses or redirects contain `noindex`, `nofollow`, and `noarchive`;
- public commercial pages contain no `noindex` response header and self-canonicalise;
- login does not canonicalise to `/`;
- sitemap and robots behaviour remain correct.

## 12. Workstream H: price-truth correction

Use `site.priceAmount` for the under-GBP-10 decision.

The visible FAQ question may remain “Is WorkCV a UK CV builder under £10?”, but the answer must be conditional:

- when `site.priceAmount < 10`, answer yes and state the current live price;
- when `site.priceAmount >= 10`, answer no and state the current live price without describing it as under GBP 10.

Do not hard-code £7.99 or duplicate a second price source.

Add tests that render or evaluate the copy with representative prices of £7.99, £9.99, £10.00, and £12.00. Tests must assert that no output makes a mathematically false claim.

## 13. Workstream I: complete placement attribution

### 13.1 Stable placement registry

Create a typed registry or constants for required placement labels. Do not rely on generic defaults for in-scope pages.

At minimum assign unique labels to:

- homepage hero primary, hero secondary/sample, templates transition, and final CTA;
- pricing hero editor, hero comparison, product card, comparison table, sample PDF, sample editor, and final CTA;
- no-subscription hero, fact-block/mid-page editor, comparison transition, sample PDF, sample editor, late editor CTA, and final CTA;
- personal-statement hero editor, walkthrough anchor, embedded tool, sample PDF, sample editor, and final CTA;
- right-to-work contextual editor transition;
- redundancy-result editor transition;
- ATS-assessment result handoff;
- salary-result role-tailoring transition;
- restrained transitions on scams, cancellation, and alternative pages changed by the parent release.

Labels must be stable snake case, page-specific, and unique by placement—not merely by destination.

### 13.2 CTA-to-login continuity

When a tracked editor/login CTA is activated, store a privacy-safe session handoff containing only:

- placement;
- same-origin destination path;
- timestamp.

The login form may use that handoff if it is recent and matches the intended destination. `login_started` must then carry the originating placement. Expired, malformed, or unrelated handoffs must be discarded. Do not put the placement into an unsafe redirect or persist it as arbitrary metadata.

Recommended expiry: 30 minutes.

### 13.3 Tracked ATS handoff

The actual post-assessment “Fix these issues in my CV” action must emit its unique marketing CTA event while still running the existing `prepareEditorHandoff` callback. Extend `TrackedLink` with a typed optional click callback if necessary; preserve normal link behaviour and accessibility.

Never place CV or job-advert contents into analytics metadata.

### 13.4 Tests

Add behaviour/component tests that render or invoke each in-scope placement and assert:

- no duplicate label exists within the required registry;
- the emitted placement matches the clicked control;
- the destination is sanitised;
- login engagement retains the initiating placement;
- expired handoff data is ignored;
- ATS handoff data remains separate from the analytics payload;
- navigation still occurs when event delivery fails.

## 14. Workstream J: complete the authority operations backlog

Update `notes/EARNED_AUTHORITY_OUTREACH_2026-08-27.md` and include it in the release commit.

Replace generic prospect types with at least ten named, legitimate prospects. Each row must contain:

- organisation name;
- exact public page URL;
- why the WorkCV destination is genuinely useful to that audience;
- suggested WorkCV destination;
- verified public contact/submission route;
- status;
- date researched;
- resulting live mention/link, initially blank.

Research current public pages before recording them. Do not guess email addresses, scrape private contact data, purchase links, submit anything automatically, or claim outreach occurred when it did not.

## 15. Database and migration plan

All database work must be additive and idempotent.

Required changes include:

- editor-event idempotency key and partial unique index;
- trusted `is_test` classification on funnel events, payment checkouts, and orders;
- prepared saved-CV reminder table and index;
- forbidden raw identifier JSON-key scrub;
- any index needed for bounded event-window reporting.

Provide this explicit schema-preparation command:

`npm run db:prepare:growth`

The command must:

1. require `DATABASE_URL`;
2. print the target database host/name without credentials;
3. refuse obviously missing or malformed configuration;
4. run additive setup in a transaction where PostgreSQL permits it;
5. verify required tables, columns, and indexes;
6. verify zero forbidden raw identifier keys;
7. never delete business rows;
8. exit non-zero on any failed assertion.

Run it locally/test first and in production before enabling the funnel client flag.

## 16. Required automated verification

Run all existing repository commands:

```text
npm run type-check
npm run test:tools
npm run test:content
npm run test:long-tail
npm run build
```

Also run:

```text
npm run db:prepare:growth
npm run report:growth -- --days=7 --timezone=UTC
npm run report:growth -- --days=14 --timezone=UTC
npm run report:growth -- --days=30 --timezone=UTC
npm run report:growth -- --days=90 --timezone=UTC
npm run verify:indexing
```

Add focused test commands if useful, but do not replace the repository suite.

Material acceptance tests must invoke handlers, services, rendered components, or a running production build. Source-string tests may remain as cheap supplementary guards, but cannot be the sole evidence for route behaviour, persistence, headers, payment state, PDF success, reminder selection, price truth, or CTA emission.

The implementation is not acceptable with skipped, flaky, snapshot-only, or environment-dependent tests silently treated as passes.

## 17. Manual and visual QA

Use the built production application. Inspect approximately 375 px, 768 px, and 1440 px widths.

Capture and review:

- homepage first viewport and primary/secondary routes;
- pricing first viewport, comparison CTA, sample proof, and final CTA;
- no-subscription fact block, conditional under-GBP-10 answer, sample proof, and final CTA;
- personal-statement hero, walkthrough, tool/sample transitions, and final CTA;
- right-to-work contextual transition;
- redundancy result followed by its CTA;
- ATS assessment result and handoff action;
- salary result and role-tailoring action;
- parameterised login page;
- first authenticated editor entry;
- imported CV readiness state;
- locked PDF action and checkout sheet;
- paid/unlocked PDF action;
- mobile navigation and keyboard focus.

Verify:

- no horizontal overflow;
- no CTA obscures the primary answer or tool output;
- focus is visible and ordered sensibly;
- touch targets are at least 44 px where practical;
- only one primary action dominates each commercial first viewport;
- price/no-subscription language is consistent;
- login returns to the exact nested editor path;
- analytics failure does not interrupt clicks or form submission;
- sample PDF opens and downloads;
- the first buyer's short import-to-payment path remains possible.

Record the inspected URL, viewport, state, result, and screenshot path. Do not claim a viewport was checked without evidence.

## 18. Deployment and live verification

### 18.1 Deployment order

1. Finish code and behaviour tests with both funnel controls off by default.
2. Run production schema preparation from the reviewed code before changing traffic behaviour.
3. Verify tables, indexes, and zero forbidden identifier keys.
4. Build the immutable production image with the public client flag enabled.
5. Deploy the image with runtime server ingestion enabled using the established workflow.
6. Verify health, logs, canonical, robots, sitemap, and private-route headers.
7. Exercise one marked test funnel event and confirm only hashes/safe fields persisted.
8. Verify a real public landing produces one event and private routes produce none.
9. Run the production growth report for 7, 14, 30, and 90 days.
10. Verify checkout creation, webhook/payment status, and paid PDF boundaries using an explicitly marked operator/test path. Do not count it as commercial success.
11. Submit only changed public canonical URLs through IndexNow. Do not resubmit the entire sitemap for this focused remediation.
12. Record deployment time and schedule 7-, 14-, and 30-day reviews.

### 18.2 Production database assertions

Use aggregate/count queries only. Confirm:

- required tables and indexes exist;
- forbidden raw identifier key count is zero;
- private-path `landing_view` count is zero for events created after the deployment timestamp;
- one marked funnel smoke event was accepted and contains hashed identifiers only;
- positive production, zero-value, and test orders are separated;
- reminder delivery flags remain false;
- no reminder was sent;
- server payment and PDF events have the required associations.

Do not print row-level user data.

### 18.3 Payment/PDF boundary

Do not create or label a genuine charge as a commercial sale for testing.

Use an approved test/operator account and trusted `is_test` classification. Confirm:

- checkout can be created once without duplicate checkout rows;
- webhook replay is idempotent;
- payment status resolves correctly;
- the paid PDF endpoint returns `application/pdf` with a non-empty body;
- one server `pdf_downloaded` event is recorded for the successful response;
- product and analytics failures remain isolated.

If the payment provider cannot safely run a test transaction in production, stop and report the exact unverified boundary. Do not fake a passing result.

### 18.4 Container cleanup

After a successful deployment, list image IDs and container references before cleanup. Remove only verified dangling or unused images that are not referenced by any running or stopped container and are not the current or immediate rollback image. Report what was removed and preserve rollback safety.

## 19. Rollback and stop conditions

Rollback or stop the rollout if any of these occurs:

- raw visitor/session identifiers appear in persistence or logs;
- authentication or redirect behaviour regresses;
- public pages receive `noindex`;
- `/login` receives `nofollow`;
- valid CV saving, checkout, webhook, or PDF delivery fails;
- analytics errors propagate into product actions;
- report totals mix test/zero orders with production sales;
- reminder delivery becomes enabled or any reminder is sent;
- schema preparation requires destructive migration;
- a live test cannot be reliably excluded from commercial reporting.

The funnel flag is the first rollback lever for client instrumentation. Revert the application image only if disabling measurement does not contain the issue. Do not roll back additive schema columns unless separately reviewed.

## 20. Definition of done

Every item below must be true:

- [ ] No raw visitor/session identifier can be persisted by any auth or funnel path.
- [ ] Existing forbidden JSON keys are scrubbed and production count is zero.
- [ ] Public funnel events use `/api/events/funnel` only.
- [ ] `/api/events/editor` is authenticated for every request.
- [ ] Rate limiting resists client session rotation.
- [ ] Funnel delivery is feature-flagged and non-blocking.
- [ ] Only first public landings create qualified-session events.
- [ ] `document_created` is server-derived, correctly named, and idempotent.
- [ ] `payment_confirmed` is server-derived from a positive order.
- [ ] `pdf_downloaded` is server-derived after successful PDF rendering.
- [ ] Growth report stages share one explicit bounded UTC window.
- [ ] Grouped first-touch, acquisition/device/week, last-touch, and data-quality tables are present.
- [ ] Production, zero-value, and test orders are separately reported.
- [ ] All required source normalisation cases, including Copilot versus Bing, pass.
- [ ] Reminder schema exists while sending remains disabled.
- [ ] Reminder eligibility, suppression, retry, and concurrency tests pass.
- [ ] `/login` is `noindex, follow`; private product routes are `noindex, nofollow, noarchive`.
- [ ] Under-GBP-10 copy remains truthful at prices below, equal to, and above GBP 10.
- [ ] Every in-scope CTA has a stable unique label.
- [ ] `login_started` retains the initiating CTA placement when available.
- [ ] ATS handoff is tracked without analytics receiving CV/job-advert content.
- [ ] The outreach backlog contains named researched prospects and is committed.
- [ ] Type check, all existing tests, new tests, and production build pass.
- [ ] Visual QA evidence exists for 375, 768, and 1440 px states.
- [ ] Production schema, ingestion, indexing, report, checkout, webhook, and PDF assertions pass or an exact external blocker is reported.
- [ ] Changed public canonical URLs are submitted through the established indexing workflow.
- [ ] Deployment timestamp and 7-, 14-, and 30-day review dates are recorded.
- [ ] No unrelated user files are modified or committed.
- [ ] The daily-sale objective is not claimed as achieved without 30 genuine positive-value non-test orders in a rolling 30-day period.

## 21. Required final implementation report

Luna Max must finish with an evidence-backed report containing:

1. commit SHA and deployed image identifier;
2. exact files and additive schema changes;
3. raw-identifier handling before and after;
4. endpoint separation and rate-limit behaviour;
5. exact event firing rules and server/client provenance;
6. report definitions, timeframe, order classification, and sample privacy-safe output;
7. reminder eligibility logic and confirmation that delivery remains disabled;
8. indexing/header behaviour from real production responses;
9. price-truth and CTA-placement changes;
10. automated command results with pass counts;
11. visual QA matrix and screenshot paths;
12. live database assertions using counts only;
13. checkout/webhook/PDF boundary result and how test activity was excluded;
14. IndexNow URLs submitted;
15. deployment timestamp and scheduled 7-, 14-, and 30-day review dates;
16. remaining risks or genuinely blocked checks;
17. confirmation that the commercial objective has not been overstated.

Do not use “complete”, “fully verified”, or equivalent wording if any Definition of Done item is false or unverified.
