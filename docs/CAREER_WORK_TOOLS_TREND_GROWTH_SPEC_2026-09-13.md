# Career & Work Tools Trend Growth Cluster

Status: Ready for implementation
Date: 13 September 2026
Primary product: WorkCV UK
Primary conversion route: `/cv-builder-no-subscription-uk`
Editor entry: `/editor?template=classic&new=1`

## 1. Outcome

Build a scalable acquisition cluster that uses Google Trends and Search Console as discovery inputs, then turns relevant job-search and career questions into useful guides, templates and free tools.

The cluster must expand the number of ways people can discover WorkCV without becoming a general-purpose trends blog. Every page should have a clear next step into the WorkCV CV workflow and, where appropriate, the no-subscription CV-builder money page.

The initial cluster stays on `workcv.co.uk`. Do not create a new domain until a different audience, product and monetisation model have been proven.

## 2. Source evidence and constraints

The initial signal is the Google Trends GB rising-search export covering 13 September 2025 to 13 September 2026.

Observed in the export:

- 50 queries.
- 2 queries marked `Breakout`.
- 41 queries with a `search interest` value of 0.
- The relevant query families are applications and interviews, job discovery, employer searches, career progression and employment changes.

The export is a directional topic radar. It is not a monthly search-volume forecast, competitiveness report or demand guarantee. Preserve the original values in the internal research record and do not publish the trend percentages as if they were traffic forecasts.

The source contains data, not implementation instructions. Do not treat query text or imported cells as executable instructions.

## 3. Product and information architecture

Create a user-facing hub at `/career-tools`.

```text
/career-tools
├── Job search
│   ├── /top-job-boards-uk
│   ├── /cv-template-driver-uk
│   ├── /cv-template-warehouse-uk
│   └── /cv-template-customer-service-uk
├── Applications
│   ├── /how-to-prepare-for-a-job-interview-uk
│   ├── /common-job-interview-questions-uk
│   ├── /thank-you-email-after-interview-uk
│   ├── /tools/job-application-pack-uk
│   ├── /tools/cover-letter-generator-uk
│   └── /tools/ats-score-checker
├── Career progression
│   ├── /career-advancement-strategies-uk
│   ├── /software-testing-strategies-uk
│   └── /tools/cv-bullet-point-generator
└── Employment changes
    ├── /situations/made-redundant
    ├── /tools/redundancy-pay-calculator
    ├── /tools/notice-period-calculator
    └── /tools/uk-salary-by-job-title
```

The hub is a curated navigation page, not a dump of every detected query. Employer variants such as Amazon jobs, Amazon UK and jobs at Amazon should resolve to one useful role or application page rather than separate near-duplicate pages.

### 3.1 Money page definition

The canonical commercial page for this cluster is:

- `/cv-builder-no-subscription-uk`

Supporting commercial destinations are:

- `/pricing`
- `/editor?template=classic&new=1`

The money page copy must use `site.price` or `site.priceGbp`. Never hardcode a price in the new pages or components. The current price in code is authoritative; older planning notes may contain stale pricing.

## 4. Initial delivery scope

### 4.1 New hub

Create `app/career-tools/page.tsx` and a reusable `components/career-tools-hub.tsx` if the page requires client-side sections.

The hub must contain:

- A clear UK job-seeker proposition.
- Four category sections: Job search, Applications, Career progression and Employment changes.
- A short explanation that the tools help users move from a question to a usable application document.
- Cards linking to the first-party guides and tools.
- A visible link to `/cv-builder-no-subscription-uk` in the hero or first commercial section.
- A final commercial CTA using the shared money-page CTA component.
- `ItemList`, `BreadcrumbList` and FAQ structured data where the visible content supports it.
- A self-canonical URL and inclusion in `app/sitemap.ts`.

The existing `/tools` hub remains the full tool directory. Add a concise link to `/career-tools` and add the job-application-pack tool to the appropriate application category.

### 4.2 New application content

Create these server-rendered content pages using the established guide/page patterns:

1. `/how-to-prepare-for-a-job-interview-uk`
   - Direct answer in the opening section.
   - Preparation checklist.
   - How to use the job advert and CV together.
   - STAR-answer guidance.
   - Link to the Job Application Pack.
   - Link to the no-subscription CV builder after the practical answer and in the final CTA.

2. `/common-job-interview-questions-uk`
   - Questions grouped by general, competency, role-specific and follow-up categories.
   - Answer-planning prompts rather than invented candidate claims.
   - Link to the Job Application Pack and the CV editor.
   - Include a short warning that examples must be truthful and adapted to the employer.

3. `/thank-you-email-after-interview-uk`
   - Plain UK email structure.
   - Copyable template with optional variations.
   - Guidance on timing, tone and what not to claim.
   - Link to the Job Application Pack and the money page.

4. `/top-job-boards-uk`
   - Explain how to choose a board by sector, location, seniority and shift pattern.
   - Do not present WorkCV as a live vacancy database.
   - Include a job-application checklist and role-template links.
   - Link to the money page as the next step after finding a vacancy.

5. `/career-advancement-strategies-uk`
   - Turn progression goals into evidence, achievements and target-role language.
   - Link to the bullet-point generator, transferable-skills translator and money page.

6. `/software-testing-strategies-uk`
   - Treat this as career and application guidance, not a technical reference manual.
   - Explain how to evidence testing methods, defect reporting, automation, collaboration and outcomes on a CV.
   - Publish only if the topic survives validation in a subsequent trend snapshot or Search Console.

Existing pages to refresh and connect rather than duplicate:

- `/cv-vs-resume-uk`
- `/convert-resume-to-uk-cv`
- `/tools/cover-letter-generator-uk`
- `/tools/cv-bullet-point-generator`
- `/tools/ats-score-checker`
- `/cv-template-driver-uk`
- `/cv-template-warehouse-uk`
- `/situations/made-redundant`
- `/tools/redundancy-pay-calculator`
- `/tools/notice-period-calculator`
- `/tools/uk-salary-by-job-title`

The refresh must add contextual links and CTA coverage. It must not create duplicate versions of existing content.

### 4.3 Job Application Pack tool

Create:

- `app/tools/job-application-pack-uk/page.tsx`
- `components/job-application-pack.tsx`
- `app/api/tools/job-application-pack/route.ts`
- `lib/job-application-pack.ts`
- `lib/job-application-pack-handoff.ts` if the existing generic handoff cannot safely represent the result.

The first version accepts:

- Target role.
- Employer name, optional.
- Job advert text.
- Existing CV text or evidence notes.
- Optional motivation for applying.

The first result should return structured sections:

- Vacancy keywords and requirements.
- Evidenced, partly evidenced and not-yet-evidenced requirements.
- Five tailored CV bullet suggestions based only on supplied evidence.
- A concise profile or summary suggestion.
- A tailored cover-letter draft.
- Eight likely interview questions with answer prompts.
- A short post-interview thank-you email draft.

The UI must:

- Work without signup for the first result.
- Include a `Try example` action.
- Show input limits and a clear privacy note.
- Show loading, validation, rate-limit and provider-failure states.
- Keep generated sections separately copyable.
- Label generated material as a draft that must be checked.
- Offer `Use these details in my CV` or equivalent handoff after a result.
- Offer the money page as the commercial next step after the user has received value.

Reuse the existing domain libraries and patterns where possible:

- `assessCvFit` and the local keyword fallback from `lib/cv-fit-assessment.ts`.
- `generateCvBulletPoints` from `lib/cv-bullet-point-generator.ts`.
- `generateCoverLetter` from `lib/cover-letter-generator.ts`.
- `TrackedLink`, `FinalCta`, `RelatedLinksSection` and the existing tool-page layout.
- `cvToolHandoff` or `cvFitHandoff` for a short-lived editor handoff.

Do not make the new API route call WorkCV's own HTTP routes. Orchestrate shared library functions directly, or use one structured generation request if that is cheaper and easier to validate.

#### API and privacy requirements

- Parse the request with Zod.
- Bound the request body and each text field.
- Use `Cache-Control: no-store` on all responses.
- Apply a stricter rate limit than a single lightweight generator because the pack returns multiple outputs.
- Do not log job advert text, CV text, names, email addresses or generated content.
- Do not send user text in funnel metadata.
- Return partial results only when the missing section is clearly labelled; do not turn provider errors into plausible empty success.
- Preserve the existing OpenAI credential gate and error handling conventions.
- Never promise an interview, ATS result or hiring outcome.

#### Editor handoff

The handoff must be versioned and expire after the existing short session window. It may contain only the minimum data required to seed the editor:

- Target role.
- Job description or derived targeting context, subject to the existing handoff limits.
- Profile and skills suggestions.
- Structured experience bullets where the user explicitly chooses to carry them across.

Remove the handoff after a successful import. Keep generated cover letters, interview answers and thank-you notes out of the CV document unless the user explicitly chooses a supported field.

If the editor creation path needs attribution, extend the existing `creation_method` value with a safe `job_application_pack` value rather than adding raw content to analytics.

## 5. Reusable page and CTA system

### 5.1 Guide template

Every new guide should follow this order:

1. Search-intent answer and clear H1.
2. Immediate practical checklist or example.
3. Explanation and limitations.
4. Embedded or linked first-party tool.
5. Money-page CTA.
6. Related guides and tools.
7. Sources and review date where claims can change.
8. FAQ only for genuine unanswered questions.
9. Final CTA.

Use UK spelling, direct language and the existing WorkCV visual system. Do not use fake usage counts, unsupported ratings, copied employer instructions or generic keyword paragraphs.

### 5.2 Money-page CTA component

Add a reusable `MoneyPageCta` component, either in `components/marketing.tsx` or as a small component that uses the existing marketing primitives.

Required behaviour:

- Destination: `/cv-builder-no-subscription-uk`.
- Use dynamic pricing from `site.price` or `site.priceGbp`.
- Include a secondary link to `/pricing` only where it helps the decision.
- Use `TrackedLink` or `ButtonLink` with a supplied placement identifier.
- Accept a page-specific heading, body and placement prefix.
- Keep the main action distinct from the direct editor handoff.

Every new public guide or tool must include the money page in at least two relevant places:

- One contextual placement after the visitor receives the first useful answer or result.
- One closing CTA or related-link placement.

Tools that generate or assess application content should also include a direct editor handoff. The money page remains the explanation and trust step; the editor remains the action step.

Follow the existing CTA rule of no more than one primary CTA per section. Do not repeat the money link as a keyword-stuffed link in every paragraph.

Natural anchor text examples:

- `See the no-subscription UK CV builder`
- `Build and preview the CV for this application`
- `Make the CV match the application`
- `See how the one-time PDF process works`

### 5.3 Internal-link matrix

| Source page or cluster | Required commercial link | Required supporting links |
|---|---|---|
| `/career-tools` | Money page in hero or first commercial section and final CTA | `/tools`, interview guide, application pack |
| Interview guides | Money page after checklist and final CTA | Application pack, cover-letter generator, ATS checker |
| `/tools/job-application-pack-uk` | Money page after results | Editor handoff, ATS checker, cover-letter generator |
| `/top-job-boards-uk` | Money page after job-search checklist | Driver, warehouse, customer-service templates |
| Career progression guides | Money page after evidence examples and final CTA | Bullet generator, transferable-skills translator |
| Redundancy/employment guides | Money page after the CV recovery step | Redundancy pay, notice period, employment-gap guide |
| Pay and salary pages | Money page after the job-change/application explanation | Salary, take-home-pay and relevant role templates |
| Employer or role pages | Money page in the application section and final CTA | Matching role template or application tool |

The money page should also link back to `/career-tools` in its related-content area so the relationship works in both directions.

## 6. Trend Radar operating system

Create an internal research area. It must not be exposed as public SEO content by default.

Suggested files:

- `research/trend-radar/README.md`
- `research/trend-radar/raw/` for dated source snapshots.
- `research/trend-radar/opportunities.csv` for human-reviewed opportunities.
- `scripts/prepare-trend-radar.mjs` for repeatable parsing and normalisation.

Add a package script such as:

```text
npm run trend:prepare -- --input=<csv> --as-of=YYYY-MM-DD
```

The preparation script should:

- Preserve the raw source snapshot.
- Parse quoted CSV safely.
- Normalise case, whitespace and duplicate query variants.
- Preserve `query`, `search interest` and `increase percent` as observed fields.
- Suggest a cluster and intent without auto-publishing anything.
- Flag `Breakout` and other freshness-sensitive records.
- Produce a compact review file sorted by cluster and signal strength.
- Be idempotent for the same input and as-of date.

The reviewed opportunity record should contain:

```text
id
query
captured_at
window_start
window_end
country
source
search_interest
increase_percent
suggested_cluster
approved_cluster
intent
freshness_risk
target_type
target_path
refresh_policy
status
notes
```

Use these lifecycle states:

```text
detected → triaged → validated → briefed → built → measured → refresh / retire
```

### 6.1 Triage rules

- `Applications`: high priority when the query implies a person is preparing, writing or checking an application.
- `Job search`: publish a guide or role pack only when it offers useful application help, not merely a list of vacancies.
- `Career progression`: publish when the topic can be translated into CV evidence, skills or a career decision.
- `Employment changes`: publish with official-source review and an explicit date; connect the employment issue to the CV recovery step.
- `Employer-specific`: consolidate variants and verify current requirements before publication.
- `Workplace productivity`: keep as an experiment outside the main WorkCV navigation unless it develops a clear user and conversion path.
- Health, entertainment, social-media and unrelated spikes: ignore.

Promote a topic from a guide candidate to a tool candidate when at least one of these is true:

- It appears in more than one trend snapshot.
- Search Console shows repeated impressions for the same intent family.
- Existing users are already completing a manual version of the task.
- The input and output are clear enough to validate safely.

Do not use a single breakout percentage as the reason to build a permanent product.

### 6.2 Refresh policies

- News, employer instructions and benefits: review before publishing and on a short explicit schedule.
- Salary, tax and statutory calculations: tie updates to the underlying official source release.
- Evergreen guides: review after the first 28 days, then at least quarterly while they receive traffic.
- Tools: maintain an owner, source note and test fixture; do not leave a stale “current” claim in the UI.

## 7. Analytics and attribution

Use the existing first-party funnel and do not put user content into analytics.

Existing events remain the core funnel:

```text
page_view → marketing_cta_clicked → login_started → document_created → payment_confirmed → pdf_downloaded
```

Add safe tool-completion measurement only if the current report cannot answer tool usage. If added:

- Extend the public event allowlist with `tool_started` and `tool_completed`.
- Allow only a fixed tool identifier, lifecycle step and result state in metadata.
- Reject arbitrary metadata and all user text.
- Update `docs/GROWTH_FUNNEL.md`, `lib/funnel-events.ts` and `components/attribution-capture.tsx` together.
- Keep server-authoritative purchase and PDF events unchanged.

Add a route-to-cluster map in a small shared module, for example `lib/marketing-clusters.ts`, so reporting can group pages without storing a cluster label in every event.

Extend the growth report to show, for each cluster and landing route:

- Public page views and sessions.
- Commercial CTA clickers and clicks.
- Tool starts and completions, if implemented.
- Login starters.
- Created documents.
- Positive production payments.
- PDF downloads.
- Paid PDF conversion per landing session.

Separate production totals from test, zero-value and failed records using the existing rules.

## 8. SEO and content requirements

Every public page must have:

- One clear H1.
- Unique title and meta description.
- Self-canonical URL under `https://workcv.co.uk`.
- `en-GB` language context through the existing site configuration.
- Server-rendered answer content.
- Breadcrumbs where the page is nested in the cluster.
- FAQ or application schema only when the visible page supports it.
- A dated review note for volatile claims.
- Inclusion in `app/sitemap.ts` with an accurate `lastModified` date.

The content should satisfy the searcher before asking for a click. The commercial link should feel like the natural next step, not an interruption.

Do not create:

- Thin pages for every employer keyword variant.
- Fake `jobs near me` listings.
- Pages that imply live salary or benefit data without a maintained source.
- General trend pages with no actionable user problem.
- Duplicates of existing CV, template or calculator routes.

## 9. Implementation sequence

### Phase 1: foundation

- Add the route-to-cluster map.
- Add the `MoneyPageCta` component and placement constants.
- Add `/career-tools`.
- Add trend-radar research structure and preparation command.
- Add sitemap, metadata and content-contract fixtures for the hub.

### Phase 2: high-intent content

- Add interview preparation, common questions and thank-you email guides.
- Refresh `/cv-vs-resume-uk`, `/tools/cover-letter-generator-uk` and `/tools/ats-score-checker`.
- Add the money-page link contract to each page.
- Add responsive QA coverage at 390px, 768px and 1440px.

### Phase 3: flagship tool

- Implement the Job Application Pack API, shared generation logic and UI.
- Add rate limiting, no-store responses, validation and safe fallbacks.
- Add editor handoff and `creation_method` attribution if required.
- Add tool-completion analytics only if needed after checking current reporting.

### Phase 4: job-search and career extensions

- Add `/top-job-boards-uk`.
- Connect driver, warehouse, retail and customer-service pages.
- Add career-advancement content.
- Add software-testing content only after validation.
- Improve the redundancy/employment-change pathway.

### Phase 5: measurement and expansion

- Run the 7-, 14-, 30- and 90-day growth reports.
- Review Search Console queries and landing pages after 28 days.
- Promote repeated intents into new tools or role packs.
- Retire or consolidate pages that attract impressions but no useful engagement or application intent.

## 10. Definition of done

### Product

- A visitor can reach a relevant guide or tool from `/career-tools`.
- The Job Application Pack returns useful, structured output from a valid example.
- The user can carry selected CV-relevant output into the editor.
- The user can reach the money page from every new page through a natural contextual or closing CTA.
- Price copy is dynamic and consistent with `site.price`.

### SEO

- New pages have unique metadata, one H1, canonical URLs, valid internal links and sitemap entries.
- No duplicate employer-variant pages are created.
- Volatile claims have source notes and review dates.
- Existing related pages point to the new canonical owner.

### Analytics

- New CTA placements are recorded without storing user content.
- First-touch and last-touch attribution continue to work when a visitor moves from a trend page to the money page and then to the editor.
- Tool usage and commercial conversion can be segmented by route and cluster.
- Test and zero-value transactions are excluded from production conversion totals.

### Safety and quality

- Input limits, rate limits and error states are tested.
- No CV, job-advert, email or generated text appears in logs or analytics metadata.
- AI output is clearly labelled as draft material and does not invent evidence.
- Legal, salary, benefit and employer-specific content is checked against current authoritative sources before publication.

### Verification commands

Run the relevant existing checks plus new focused tests:

```text
npm run type-check
npm run test:tools
npm run test:content
npm run test:long-tail
npm run build
npm run verify:indexing
```

Add focused tests for:

- Trend CSV parsing and deduplication.
- Cluster assignment review fields.
- Money-page CTA presence and destination.
- Job Application Pack schema validation and rate-limit responses.
- Handoff expiry, removal and editor import.
- No raw user text in analytics payloads.
- Canonical, sitemap and structured-data contracts for every new route.

## 11. First implementation backlog

| Priority | Deliverable | Main files or areas | Outcome |
|---|---|---|---|
| P0 | Money-page CTA contract | `components/marketing.tsx`, `lib/analytics-placements.ts` | Consistent commercial path |
| P0 | Career Tools hub | `app/career-tools`, `components/career-tools-hub.tsx` | New cluster entry point |
| P0 | Interview guides | New `app/*/page.tsx` routes | Capture high-intent queries |
| P0 | Job Application Pack MVP | `components`, `lib`, `app/api/tools` | Reusable conversion product |
| P1 | Existing-page crosslinks | CV, tool and situation pages | Send qualified traffic to the cluster and money page |
| P1 | Trend Radar prep command | `research/trend-radar`, `scripts/prepare-trend-radar.mjs` | Repeatable future-topic intake |
| P1 | Job-board guide | `/top-job-boards-uk` | Capture job-discovery traffic |
| P1 | Cluster reporting | `scripts/report-growth.mjs`, `scripts/growth-report-core.mjs` | Compare traffic and paid conversion |
| P2 | Career advancement guide | `/career-advancement-strategies-uk` | Mid-funnel expansion |
| P2 | Software testing guide | `/software-testing-strategies-uk` | Validate niche expansion before deeper tooling |
| P2 | Employer/role packs | Curated routes only | Expand where repeated demand is proven |
