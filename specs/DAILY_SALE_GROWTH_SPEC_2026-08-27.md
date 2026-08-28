# WorkCV qualified-traffic and daily-sale growth release

**Execution specification for Luna Max**
**Status:** Approved implementation brief
**Prepared:** 27 August 2026
**Repository:** `D:\DKPlayground\OneOffUKCV`
**Site:** `https://workcv.co.uk`

## 1. Assignment

Implement this specification end to end. Start by inspecting the current repository and production-safe data model. Preserve unrelated user changes and the established WorkCV design system. Do not replace this specification with another strategy document, do not create speculative pages, and do not claim completion without testing the built application and the live deployment.

The commercial objective is to establish a measurable, repeatable path toward at least one genuine paid CV download per day. This release must improve the evidence available for decisions, remove a confirmed indexing defect, help more qualified visitors finish a CV, and concentrate search and AI authority on the pages already showing commercial promise.

The release is complete only when:

1. Anonymous landing visits and pre-signup CTA actions can be measured without collecting CV content or unnecessary personal data.
2. First-touch and last-touch source information can be tied safely to signup, activation, checkout, payment, and PDF download.
3. Login, editor, account, and parameterised authentication URLs cannot compete in search results or canonicalise to the homepage.
4. The no-subscription commercial page clearly answers the strongest under-GBP-10 and pay-once questions without creating another doorway page.
5. Visitors who create a CV receive a clearer route to import, completion, preview, and paid download.
6. High-impression informational pages offer relevant next steps without obscuring their primary answer.
7. A privacy-safe growth report can show the complete funnel by source and landing page.
8. Automated tests, a production build, responsive visual review, a real-response indexing check, and a post-deployment smoke test all pass.

## 2. Evidence baseline

Use this baseline when evaluating the release. Do not reinterpret the supplied exports as exact market-size forecasts.

### 2.1 Standard Google Search

The Search Console export dated 27 August 2026 ends its daily table on 24 August 2026 and reports:

- 5,184 impressions and 35 clicks over the available three-month period.
- 19 clicks from 3,239 impressions in the latest 28 days.
- 14 clicks from 1,882 impressions in the preceding 28 days.
- Latest-28-day impressions increased by approximately 72%; clicks increased by approximately 36%.
- The latest seven days produced 8 clicks from 795 impressions, a 1.01% CTR.
- Mobile: 20 clicks, 1,076 impressions, 1.86% CTR, average position 21.96.
- Desktop: 15 clicks, 4,083 impressions, 0.37% CTR, average position 44.43.

The strongest page-level opportunities were:

| Page | Clicks | Impressions | CTR | Average position | Interpretation |
|---|---:|---:|---:|---:|---|
| `/cv-builder-no-subscription-uk` | 10 | 186 | 5.38% | 12.22 | Best commercial SEO page; ranking improvement is the priority |
| `/right-to-work-cv-uk` | 6 | 309 | 1.94% | 6.19 | Proven information traffic; add a relevant product transition |
| `/cv-builder-scams-uk` | 3 | 262 | 1.15% | 9.77 | Commercially adjacent, already on page one |
| `/` | 3 | 51 | 5.88% | 19.63 | Strong CTR at low rank |
| `/pricing` | 2 | 242 | 0.83% | 16.64 | High intent but weak search click-through |
| `/tools/redundancy-pay-calculator` | 3 | 830 | 0.36% | 59.27 | Large informational exposure, lower immediate buying intent |
| `/cv-personal-statement-uk` | 0 | 566 | 0% | 40.19 | Large opportunity, but the page was materially upgraded after this report ended |

### 2.2 Generative-search visibility

The generative-AI page report contains approximately 440 impressions. Leading pages include:

- `/cv-builder-no-subscription-uk`: 66
- `/pricing`: 66
- `/tools/redundancy-pay-calculator`: 65
- `/cv-builder-scams-uk`: 60
- `/cancel-zety-uk`: 54
- `/right-to-work-cv-uk`: 38

The associated keyword export exposes 252 query impressions, one click, and a weighted average position of 4.69. The page and query totals need not reconcile because Search Console can suppress low-volume queries. Do not report the difference as a tracking defect.

The only click exposed in that query export was for `right to work on cvs`. Role-specific care, teacher, and nursing queries frequently appeared between positions one and four.

### 2.3 Production funnel

The first non-test order was paid on Monday, 24 August 2026:

- Amount: GBP 7.99.
- Recorded first-touch UTM source: `chatgpt.com`.
- First landing path: `/`.
- Referrer: absent.
- Signup to payment: approximately seven minutes.
- The visitor imported a CV, previewed it, completed checkout, and downloaded the PDF.

Treat this as strong ChatGPT-tagged attribution, not irrefutable proof of the referring interface. UTM values can be copied or supplied manually.

In the preceding 30 days, production contained five new signups:

| Source and landing | Signups | Created a CV | Opened checkout | Started payment | Paid |
|---|---:|---:|---:|---:|---:|
| Google to `/pricing` | 2 | 2 | 0 | 0 | 0 |
| Google to `/` | 1 | 1 | 1 | 0 | 0 |
| ChatGPT-tagged to `/` | 1 | 1 | 1 | 1 | 1 |
| Direct or unknown to `/` | 1 | 1 | 0 | 0 | 0 |

This is too small a sample for a trustworthy conversion rate. It does show that signup and document creation work, and that the largest observed drop occurs before the PDF/checkout decision.

### 2.4 Measurement timing constraint

Commits `a566291` and `8b9a154` were deployed on 26 August 2026, after the report's daily data ended. They added major personal-statement, public-proof, long-tail, and AI-discovery improvements. Do not rewrite those changes merely because the 24 August report does not show their effect. Give them a clean observation window.

## 3. Primary outcome and leading indicators

### 3.1 Commercial outcome

The ultimate success condition is:

> At least 30 non-test, positive-value paid orders in a rolling 30-day period, without misleading claims, forced subscriptions, or degraded PDF reliability.

At GBP 7.99, this equals GBP 239.70 gross revenue before tax, processor fees, refunds, and support costs. Paid acquisition must not be introduced until contribution margin and a defensible acquisition-cost ceiling are known.

### 3.2 Funnel targets

Measure these by source, landing page, device class, and week. They are planning targets, not fabricated current performance:

- At least 95% of eligible human sessions receive one deduplicated `landing_view` event.
- Marketing-page CTA click rate of at least 8% on commercial landings.
- CTA-to-successful-signup rate of at least 35%.
- Signup-to-created-document rate of at least 70%.
- Created-document-to-PDF-click rate of at least 40%.
- Checkout-opened-to-payment-started rate of at least 60%.
- Payment-started-to-confirmed-payment rate of at least 80%.
- Long-term visitor-to-paid conversion target of 2% to 3% for qualified traffic.
- Qualified-traffic target of 40 to 50 visits per day, sufficient for roughly one sale per day at the target conversion rate.

Do not present one sale from five signups as evidence that the current conversion rate is 20%.

### 3.3 Staged milestones

1. Measurement milestone: a complete, privacy-safe funnel with no unexplained event gaps.
2. Early commercial milestone: at least two positive-value sales in a rolling 30 days.
3. Repeatability milestone: at least two positive-value sales per week for four consecutive weeks.
4. Scale milestone: 30 positive-value sales in a rolling 30-day period.

## 4. Product truth and content constraints

Preserve all of the following:

- WorkCV is a UK-focused CV builder.
- Email-code login is required before editing.
- A visitor can build and preview a saved CV before paying.
- The current `site.price` is charged once to unlock PDF access for one saved CV.
- There is no monthly subscription or automatic renewal in the standard flow.
- The finished WorkCV PDF is not free.
- The separate blank Word template is genuinely free and has different search intent.
- WorkCV does not guarantee ATS compatibility, interviews, recruiter approval, or employment.

Use `site.price`, `site.priceGbp`, or the repository's commerce helper. Do not hard-code GBP 7.99 in reusable UI, schema, tests, or email copy.

Never invent or imply:

- Testimonials, ratings, customer totals, recruiter endorsements, or verified outcomes.
- A free finished PDF.
- No-account editing.
- Guaranteed ATS results, interviews, or job offers.
- NHS, government, university, or recruiter approval.
- Urgency, scarcity, countdowns, or expiring prices that do not exist.

## 5. Scope and deliberate non-goals

### In scope

- Privacy-safe landing and funnel measurement.
- First-touch and last-touch attribution.
- A source and funnel reporting command.
- Search indexing corrections for authentication and private-product routes.
- Centralised, correctly encoded login-return URLs.
- Conversion improvements to homepage, pricing, no-subscription page, and editor entry/completion states.
- Contextual commercial transitions on proven informational pages.
- Internal-link improvements that consolidate authority.
- Tests, documentation, deployment verification, and monitoring instructions.

### Not in scope

- New payment plans, subscriptions, coupons, or price changes.
- Paid advertising campaigns.
- A new analytics SaaS unless the operator explicitly approves it.
- Cookie-based advertising, cross-site tracking, fingerprinting, or session replay.
- Bulk creation of new SEO pages.
- Rewriting the 26 August personal-statement and proof work before its observation window ends.
- Blocking search crawlers from authentication pages in `robots.txt`; crawlers must be able to see `noindex`.
- Testimonials unless a real customer supplies one and explicitly approves publication.

## 6. Workstream A: privacy-safe full-funnel measurement

### 6.1 Architecture

Implement a first-party funnel event system for pre-authentication and post-authentication events. Reuse existing database and server conventions, but do not weaken the current authenticated editor-event route.

Create a dedicated allowlisted endpoint, for example:

`POST /api/events/funnel`

The implementation must:

- Accept only known event names.
- Accept only same-origin application paths, never full arbitrary URLs.
- Strip query values except explicitly allowlisted campaign fields.
- Normalise referrers to hostname only before persistence.
- Never accept or persist email, name, CV text, job-advert text, payment details, authentication codes, or arbitrary client metadata.
- Rate-limit abusive clients using the repository's established patterns.
- Return quickly and never block navigation or checkout.
- Treat analytics failure as non-fatal.

### 6.2 Visitor and session identifiers

- Generate a cryptographically random first-party visitor identifier and store it in local storage.
- Generate a separate session identifier in session storage.
- Hash both values server-side before database persistence.
- Do not use IP address or user-agent fingerprinting to recreate visitors.
- Allow the identifiers to be associated with a user after successful authentication without exposing raw identifiers in reports.
- Document a retention period. Default to 180 days for detailed funnel events unless the existing privacy policy requires a shorter period.

### 6.3 Required events

Use stable snake-case names and document their exact firing rule:

| Event | Firing rule | Required properties |
|---|---|---|
| `landing_view` | Once per session for the first public landing | path, source, medium, campaign, referrer_host, device_class |
| `marketing_cta_clicked` | User activates an editor/login CTA | path, destination, placement |
| `login_started` | Login form is meaningfully engaged | path, destination |
| `signup_completed` | A new user successfully verifies | user association, first landing, signup next path |
| `document_created` | First saved CV exists for the user | document association, creation method |
| `import_started` | Existing CV import begins | existing editor route/event may remain source of truth |
| `import_succeeded` | Existing CV import succeeds | existing editor route/event may remain source of truth |
| `preview_ready` | Minimum viable CV is ready for useful preview | document association, completion band |
| `pdf_clicked` | Locked or unlocked PDF action is selected | access state, document association |
| `checkout_sheet_opened` | Price and consent sheet appears | document association |
| `payment_started` | Browser is sent to the payment provider | document association, checkout association |
| `payment_confirmed` | Server has a positive-value order | server-derived only |
| `pdf_downloaded` | Paid PDF response succeeds | server-derived where feasible |

Do not double-count editor events already recorded. Either build a reporting view over both event tables or migrate deliberately with compatibility tests.

### 6.4 Attribution rules

Preserve the existing first-touch attribution and add last-touch data:

- First touch never changes after it is captured.
- Last touch updates only when a new external referral or explicit UTM campaign begins a session.
- Direct visits must not overwrite a known non-direct last touch within 30 days.
- Normalise at minimum: Google, Bing, ChatGPT, Claude, Gemini, Perplexity, Copilot, directory/referral, and direct/unknown.
- Keep the original raw UTM source in a length-limited safe field and maintain a separate normalised channel value.
- A `chatgpt.com` UTM with no referrer must be described as ChatGPT-tagged, not guaranteed ChatGPT referral.
- Existing users and historical rows must continue to work when new attribution columns are null.

### 6.5 Database requirements

Use additive, idempotent schema setup consistent with `lib/db.ts`. A suitable event table includes:

- numeric primary key;
- visitor hash;
- session hash;
- nullable user ID;
- nullable document ID;
- allowlisted event name;
- same-origin path;
- normalised source, medium, and campaign;
- referrer hostname;
- small allowlisted JSON metadata;
- created timestamp.

Add indexes for event/time, source/time, landing/time, user/time, and visitor/time reporting. Never add a foreign-key constraint that prevents anonymous events or makes authentication failure block event delivery.

### 6.6 Growth reporting command

Add a read-only command such as:

`npm run report:growth -- --days=30`

It must output, without PII:

- qualified sessions;
- signups;
- activated users/documents;
- preview-ready users;
- PDF clickers;
- checkout openers;
- payment starters;
- positive-value paid orders;
- successful PDF downloaders;
- step-to-step conversion percentages;
- rows grouped by normalised source and first landing path;
- a clear separation between positive-value production orders and zero-value/test orders.

The command must support 7-, 14-, 30-, and 90-day windows and use UTC storage with an explicitly labelled reporting timezone.

## 7. Workstream B: indexing and canonical correction

### 7.1 Confirmed issue

Search Console reported a parameterised login URL. The live login response is indexable and inherits a homepage canonical. This can waste crawl attention and send incorrect canonical signals.

### 7.2 Required route policy

Apply explicit metadata to all authentication and private workflow routes:

| Route class | Index policy | Canonical policy |
|---|---|---|
| `/login` with or without parameters | `noindex, follow` | canonical `/login` |
| `/editor` with or without parameters | `noindex, nofollow, noarchive` | canonical `/editor` if rendered |
| `/my-cvs` and other account pages | `noindex, nofollow, noarchive` | self-canonical if rendered |
| API, webhook, and internal event routes | non-HTML; never added to sitemap | no canonical required |

Do not add these paths to the XML sitemap. Do not disallow `/login` in `robots.txt`, because a crawler must fetch it to receive `noindex`.

Where metadata alone cannot cover redirects or parameter variants, add a narrowly scoped `X-Robots-Tag` header. Do not add this header to public marketing pages.

### 7.3 Login-return URL helper

Create one helper for login links and return paths. It must:

- accept only a safe same-origin path;
- encode the entire nested path correctly;
- preserve allowed editor query parameters such as template and new-document intent;
- reject protocol-relative URLs, external origins, control characters, and double-decoding tricks;
- produce one stable result for all marketing and editor callers.

Replace hand-built `/login?next=` strings in shared marketing components and editor redirection code where appropriate.

### 7.4 Verification

Tests must inspect real built HTTP responses, not merely search source strings. Verify:

- `/login?next=...` returns or renders a `noindex` directive.
- It does not canonicalise to `/`.
- Public commercial pages remain indexable and self-canonical.
- The malformed historic login parameter cannot be generated by current helpers.
- The sitemap excludes login, editor, and account routes.

## 8. Workstream C: commercial-page consolidation

### 8.1 No-subscription page

Keep `/cv-builder-no-subscription-uk` as the single canonical owner of these closely related intents:

- CV builder without subscription UK;
- pay-once CV builder;
- one-time payment CV builder;
- CV builder under GBP 10;
- affordable CV builder for UK students;
- build and preview before paying.

Do not create a separate under-GBP-10 or student-pricing doorway page.

Add or verify a concise, extractable fact block near the first commercial CTA. It must communicate, using live price helpers:

> Build and preview your saved CV first. Pay the current one-time price only when the PDF is ready. There is no monthly subscription or automatic renewal. Email-code login is required before editing.

Add a visible question and answer for whether WorkCV costs under GBP 10. The answer must be generated from the live price and must not claim the PDF is free.

Do not replace the current title during the first observation window unless a real defect is found. Reconsider title testing only after at least 21 days of post-26-August Search Console data.

### 8.2 Pricing page

Preserve the recently improved title, comparison evidence, sample PDF proof, and current pricing truth.

Add event instrumentation to distinguish:

- hero editor CTA;
- comparison-table CTA;
- sample-PDF interaction;
- final CTA;
- login started after each placement.

Ensure the first mobile viewport communicates price, one-time payment, no automatic renewal, preview-before-payment, and one primary action without requiring the comparison table to load first.

### 8.3 Homepage

Do not redesign the whole homepage. The first sale converted through this route.

Instrument the primary and secondary CTA placements. Verify that the first mobile and desktop viewport contains:

- UK CV builder context;
- the live one-time price;
- no-subscription wording;
- preview-before-payment wording;
- one clear primary editor action;
- a route to inspect a real sample PDF.

Any change must preserve the short, direct journey that allowed the first buyer to pay in about seven minutes.

### 8.4 Scams, cancellation, and alternative pages

These pages must answer their primary intent before promoting WorkCV.

- Keep cancellation steps factual and current.
- Do not imply that a competitor is fraudulent merely because it uses a disclosed subscription.
- Add one restrained comparison transition after the answer: visitors who want to avoid another subscription can inspect WorkCV's current one-time price and sample PDF.
- Use tracked placements and no invented urgency.
- Consolidate equivalent commercial links on `/cv-builder-no-subscription-uk` or `/pricing` rather than creating more variants.

## 9. Workstream D: editor activation and completion

### 9.1 New-user entry choice

On the first authenticated editor visit, make the two legitimate paths immediately understandable:

1. Import an existing CV to edit it faster.
2. Start from a clean UK CV structure.

Do not add a modal that blocks returning users. Remember a completed choice locally or infer it from document state.

### 9.2 Completion guidance

Use existing editor data to provide a small, truthful readiness state. Do not invent an ATS score.

At minimum, distinguish:

- empty or barely started;
- core details present;
- useful preview ready;
- paid PDF unlocked.

The state should explain the next action and never prevent preview. A visitor should be able to see when the CV is complete enough to inspect, then make an informed download decision.

### 9.3 Price and trust continuity

Near the locked PDF action and checkout sheet, clearly preserve:

- current one-time price;
- one saved CV PDF unlock;
- no automatic renewal;
- secure external payment provider;
- refund-policy link;
- sample-PDF link where it does not distract from checkout;
- no new account or plan created by payment.

Do not add extra consent boxes beyond legal/product requirements.

### 9.4 Abandonment recovery

Do not repurpose the existing feedback-research email as a sales reminder.

Implement at most one transactional saved-CV reminder for an authenticated user who:

- created or imported a CV;
- has not purchased it;
- has not opted out of applicable communication;
- has been inactive for at least 24 hours;
- has not already received the reminder.

The reminder must link to the user's saved-CV area, state the current one-time price accurately, identify WorkCV clearly, include support and unsubscribe/preferences routes where legally appropriate, and avoid urgency or discount language. Add a deduplicated outreach table and failure-safe retry behavior.

Do not send the reminder until its legal basis and privacy-copy alignment have been reviewed. Put delivery behind an environment flag defaulting to off.

## 10. Workstream E: contextual transitions from informational traffic

Add a relevant, unobtrusive next step to these existing pages without weakening their answer:

- `/right-to-work-cv-uk`: invite the visitor to place the correct short wording into a WorkCV structure; never ask them to put a share code or private document details on a CV.
- `/tools/redundancy-pay-calculator`: after the result, offer a next-role CV pathway for people preparing after redundancy.
- `/tools/ats-score-checker`: after the assessment, allow the visitor to carry permitted results into the editor; preserve the tool's limitations.
- `/tools/uk-salary-by-job-title`: after a useful result, offer help tailoring evidence for the selected role.
- `/cv-personal-statement-uk`: preserve the 26 August content and instrument the existing editor, walkthrough, tool, and sample-PDF transitions.

Each placement must have a unique analytics label. Do not put a product banner above the tool result or primary answer.

## 11. Workstream F: internal authority and AI visibility

### 11.1 Internal linking

Audit the following link relationships and add only missing, contextually useful links:

- Pricing, scams, cancellation, and alternative pages -> no-subscription page.
- Role templates and personal-statement examples -> relevant editor template or editor start.
- Redundancy calculator and made-redundant guidance -> career-change/return-to-work content and editor.
- Right-to-work guidance -> relevant CV structure and editor.
- Homepage and templates -> sample PDF and pricing.

Use descriptive anchor text. Avoid sitewide exact-match anchor stuffing.

### 11.2 AI discovery controls

Preserve the current crawler policy, `llms.txt`, agent documentation, structured data, and response-level tests unless a verified defect is found. This release must not reopen the training-crawler policy decision.

Add AI-source normalisation to measurement so the operator can distinguish ChatGPT, Claude, Gemini, Perplexity, and Copilot traffic when a referral or UTM is available.

### 11.3 External authority operations

Create an operational outreach backlog, not automated spam. It should identify legitimate prospects such as UK careers publications, university career services, redundancy resources, role-specific communities, and editorial software directories.

For each prospect record:

- organisation and page;
- why WorkCV provides a genuinely useful resource;
- suggested destination page;
- contact/submission route;
- status and date;
- resulting live mention or link.

Do not purchase undisclosed links, mass-submit duplicate descriptions, or place misleading badges. The operating target is five thoughtful outreach attempts per week and one relevant earned mention per month.

## 12. Experiment and decision rules

Traffic is currently too low for conventional simultaneous A/B tests. Use sequential changes with dated annotations.

- Make one meaningful commercial-message change at a time.
- Preserve the prior copy and release date in the implementation notes.
- Observe at least 14 days for conversion behavior and 21 to 28 days for organic search behavior unless there is a confirmed defect.
- Compare sources and landing pages, not only sitewide totals.
- Exclude test and zero-value orders.

After at least 100 qualified visits, apply these rules:

| Evidence | Next action |
|---|---|
| Paid conversion below 1% | Prioritise product trust, editor completion, and checkout diagnosis |
| Paid conversion at or above 2%, fewer than 20 qualified visits/day | Prioritise traffic and external authority |
| Commercial CTA rate below 8% | Improve proposition clarity and CTA placement |
| CTA-to-signup below 35% | Diagnose login friction and return-path handling |
| Signup-to-document below 70% | Improve first editor entry and import/start choice |
| Document-to-PDF-click below 40% | Improve completion guidance and preview readiness |
| Payment-started-to-paid below 80% | Diagnose provider, payment-method, or return/webhook failure |

Do not start paid search until there are at least ten non-test sales, the visitor-to-paid rate is stable, and a contribution-margin-based acquisition ceiling has been approved.

## 13. Privacy, security, and reliability

- Update the privacy policy to describe first-party funnel measurement and retention accurately.
- Do not load third-party analytics, session replay, or advertising scripts by default.
- Never log authentication codes, full emails, CV contents, imported file contents, or payment-card data.
- Ensure arbitrary metadata cannot be written to the analytics database.
- Validate paths, origins, IDs, event names, field sizes, and content types on the server.
- Hash visitor and session identifiers before persistence.
- Add deduplication for landing events and reminder emails.
- Analytics failure must never block login, editor saving, checkout, webhook handling, or PDF download.
- Preserve payment idempotency and existing conversion-failure alerts.
- All schema setup must be additive and safe for a rolling deployment.

## 14. Required automated tests

Add behavior-level tests for all material changes.

### 14.1 Funnel events

- Valid allowlisted events are accepted.
- Unknown events are rejected.
- External paths, unsafe referrers, excessive field lengths, and arbitrary metadata are rejected or stripped.
- Visitor and session identifiers are not stored in raw form.
- Landing events deduplicate correctly.
- Analytics database failure does not break the page journey.
- Positive-value orders are separated from test/zero-value orders in reports.

### 14.2 Attribution

- Existing first-touch values remain immutable.
- A new non-direct session updates last touch.
- A direct return does not overwrite a recent known last touch.
- ChatGPT, Claude, Gemini, Perplexity, Copilot, Google, Bing, and unknown sources normalise correctly.
- Signup associates the anonymous journey without exposing raw identifiers.

### 14.3 Indexing and redirects

- Start a production build/server and inspect actual HTTP responses or rendered metadata.
- Parameterised login responses contain `noindex` and do not canonicalise to `/`.
- Editor and account pages are non-indexable.
- Public commercial pages remain indexable and self-canonical.
- Sitemap and robots responses remain correct.
- The central login-return helper encodes nested editor parameters correctly and rejects unsafe redirects.

### 14.4 Conversion UI

- Every required CTA placement has a stable analytics label.
- Price copy comes from the live price helper.
- Import and clean-start paths remain available.
- Preview remains available before payment.
- The locked PDF flow still opens checkout once and respects consent.
- Paid PDF download still works.
- Reminder eligibility and deduplication are correct, and sending is disabled by default.

### 14.5 Content truth

- No commercial page claims that the finished PDF is free.
- No editor page claims that no account is required.
- No invented testimonials, ratings, endorsements, or outcomes are added.
- New under-GBP-10 copy is generated from the live price and cannot become false after a price change.

## 15. Manual and visual quality assurance

Review the built site at approximately 375 px, 768 px, and 1440 px widths.

At minimum inspect:

- homepage first viewport and primary CTA;
- pricing first viewport, comparison area, and sample proof;
- no-subscription first viewport, fact block, under-GBP-10 answer, and final CTA;
- right-to-work answer and contextual CTA;
- redundancy result and contextual CTA;
- first authenticated editor entry;
- imported CV completion state;
- locked PDF and checkout sheet;
- login page with a nested editor return path;
- mobile navigation and keyboard focus.

Verify that:

- no CTA obscures tool output;
- mobile copy does not overflow;
- focus order and visible focus remain usable;
- touch targets are at least 44 px where practical;
- price and no-subscription wording remain consistent;
- the public sample PDF still opens and downloads;
- the first buyer's short import-to-payment journey remains possible.

## 16. Required verification commands

Run the repository's current commands rather than inventing replacements:

```text
npm run type-check
npm run test:tools
npm run test:content
npm run test:long-tail
npm run build
```

Also run:

- the new growth-report command against fixture/test data;
- real-response indexing integration tests;
- the relevant PDF runtime/parity smoke checks if editor or PDF code changed;
- a local production-server smoke test of landing -> login -> editor -> preview -> checkout boundary;
- a post-deployment live check of canonical, robots, sitemap, analytics ingestion, payment status, and PDF download.

No test may rely solely on searching a source file for expected strings when actual response or route behavior is under test.

## 17. Deployment order

1. Add additive database setup and server-side event validation.
2. Add client instrumentation behind a first-party analytics flag defaulting to enabled only after validation.
3. Add the reporting command and verify it against fixtures.
4. Correct authentication/private-route indexing and centralise login-return URLs.
5. Add conversion instrumentation before changing commercial copy or layout.
6. Apply the minimal commercial-page and editor improvements.
7. Add contextual informational-page transitions.
8. Run the complete automated and visual QA suite.
9. Build and deploy one immutable application image using the established production process.
10. Confirm database setup, real HTTP metadata, event ingestion, checkout creation, webhook completion, and paid PDF download.
11. Submit only changed public canonical URLs through the established indexing workflow.
12. Annotate the deployment date and begin 7-, 14-, and 30-day reporting.

Do not remove or alter production data. Do not count local, smoke-test, zero-value, or operator orders as commercial success.

## 18. Post-release monitoring

### Daily for the first seven days

- Positive-value orders and successful PDF downloads.
- Signup, activation, PDF click, checkout, and payment counts.
- Funnel-event ingestion errors and duplicate rate.
- Checkout/webhook/PDF conversion alerts.
- Source and landing attribution completeness.

### Weekly

- Qualified sessions by source and landing page.
- Funnel step conversion by source.
- Search clicks, impressions, CTR, and position for the five priority pages.
- AI-referred sessions and sales.
- Abandoned saved CVs and reminder outcomes, if the reminder flag is enabled.
- Earned mentions and links.

### After 21 to 28 days

- Evaluate the 26 August content and AI-discovery changes with post-deployment-only data.
- Decide whether `/cv-builder-no-subscription-uk` needs a title test.
- Decide whether pricing CTR needs snippet work or primarily a ranking improvement.
- Promote role/topic clusters only when impressions and engagement justify the work.
- Choose the next constraint using the decision table in section 12.

## 19. Final implementation report

When implementation is complete, report:

1. Files and schema changed.
2. Exact funnel events and attribution rules implemented.
3. Indexing/canonical behavior before and after.
4. Commercial and editor changes made.
5. Content deliberately left unchanged and why.
6. Automated commands and results.
7. Pages and viewport sizes visually inspected.
8. Live deployment verification, including a non-destructive payment/PDF boundary check.
9. Feature flags and any action still required before enabling reminders.
10. The baseline date and the first scheduled 7-, 14-, and 30-day reviews.

Do not report the daily-sale objective as achieved until production records contain at least 30 genuine positive-value orders in a rolling 30-day period.
