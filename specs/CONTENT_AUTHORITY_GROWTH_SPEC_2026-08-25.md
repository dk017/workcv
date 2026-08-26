# WorkCV content authority and conversion upgrade

**Execution specification for Luna Max**  
**Status:** Approved implementation brief  
**Prepared:** 25 August 2026  
**Repository:** `D:\DKPlayground\OneOffUKCV`  
**Primary URL:** `https://workcv.co.uk/cv-personal-statement-uk`

## 1. Your assignment

Implement this specification end to end. Do not return a proposal, alternate plan, or partial mock-up. Inspect the existing code first, preserve the established WorkCV design system, make the changes, run the required checks, inspect the finished pages at desktop and mobile widths, and report exactly what changed and what remains intentionally gated.

The release has two goals:

1. Make `/cv-personal-statement-uk` materially more useful than its current six-example version by adding evidence-led examples and a transparent job-advert tailoring walkthrough.
2. Give prospective buyers concrete product proof on the main commercial journey without inventing testimonials, reviewers, customers, or outcomes.

The release is complete only when the page content, internal links, proof assets, structured data, tests, and visual checks described below are complete.

## 2. Product and editorial context

WorkCV is a UK CV builder. A visitor can create and preview a CV for free after email-code login. The product charges a one-time **£7.99** payment to unlock the PDF for one saved CV. It is not a subscription.

Current strengths to preserve:

- UK-specific terminology and examples.
- Direct, calm copy rather than inflated marketing claims.
- Visible one-time pricing and no-renewal positioning.
- Source-backed careers guidance.
- Responsive, accessible layouts using the existing colours, typography, spacing, cards, and marketing components.
- Explicit warnings not to copy examples blindly or invent achievements.

Current weaknesses this release must address:

- The personal-statement page contains only six examples and most are broad.
- It does not demonstrate the reasoning between a real advert and a tailored statement.
- It does not show enough quantified, outcome-led evidence.
- Commercial pages rely mainly on assertions and stylised previews rather than a downloadable finished sample.
- Existing organisation bylines are acceptable but do not establish a real named expert. This release must not solve that by inventing a person.

## 3. Non-negotiable constraints

1. **Never invent identity or social proof.** Do not create a fake author, reviewer, recruiter, customer, testimonial, star rating, usage total, success rate, interview result, or hiring outcome.
2. **Never invent a candidate claim without labelling the candidate fictional.** Every sample person and employer must be visibly described as fictional.
3. **Do not imply WorkCV wrote or guarantees a successful application.** Avoid “proven to get interviews”, “ATS-approved”, “recruiter approved”, “NHS approved”, or equivalent wording.
4. **Do not copy a full job advert.** Quote or paraphrase only the small set of criteria needed for teaching. Link to the source and name its reference and date.
5. **Do not present a CV profile as a Civil Service application personal statement.** A CV profile is a few lines. A Civil Service Success Profiles statement is typically a separate, longer application response. Add an explanatory note, not a misleading Civil Service example card.
6. **Do not change pricing or payment behaviour.** Always render the price from `site.price`; do not hard-code it in application components.
7. **Do not alter the editor, authentication, checkout, PDF entitlement, database schema, API behaviour, or production infrastructure.** Static sample generation is allowed; changing the live PDF flow is not.
8. Preserve all unrelated untracked and modified files. Do not clean the working tree or overwrite user files.
9. Use `apply_patch` for hand-written source edits. Do not use destructive Git commands.
10. Do not update a “checked”, “reviewed”, `dateModified`, or sitemap date unless the referenced page/source was actually checked during this implementation.

## 4. Scope

### In scope

- Rewrite and expand `app/cv-personal-statement-uk/page.tsx`.
- Add a reusable product-proof component for a sample CV.
- Add one downloadable fictional sample CV PDF under `public/samples/`.
- Add current local screenshots only if they accurately match the live/current product after visual review.
- Place the proof component on:
  - `/cv-personal-statement-uk`
  - `/cv-builder-no-subscription-uk`
  - `/pricing`
- Add contextual links to the personal-statement guide from relevant role/situation pages where the link is missing or weak.
- Update structured data and sitemap modification dates accurately.
- Add contract tests for the critical content, links, proof asset, pricing language, and anti-fabrication labels.
- Run type checking, tests, build, local visual QA, and the existing PDF runtime check.

### Out of scope

- A new Civil Service application-statement guide.
- A new testimonial system or feedback collection flow.
- Publishing a named expert reviewer without a real approved person, role, bio, and consent.
- New CV templates or editor functionality.
- Rewriting every commercial or role page.
- Redesigning the global header, footer, homepage, or design system.
- Backlink outreach, directory submissions, or Search Console work.
- Production deployment unless the operator separately asks for it.

## 5. Required implementation order

Execute in this order so the release always has a coherent core:

1. Inspect repository instructions, Git status, the target pages, `components/marketing.tsx`, `lib/role-cv-templates.ts`, the sitemap, and existing tests.
2. Implement the complete personal-statement page upgrade.
3. Generate and visually verify the static fictional sample PDF.
4. Implement and place the reusable product-proof component.
5. Add contextual internal links.
6. Add structured data, sitemap dates, and tests.
7. Run all automated checks.
8. Run responsive visual QA and fix any issues found.
9. Summarise the implementation and explicitly list gated items.

Do not stop after writing content or tests. Continue through verification.

## 6. Personal-statement page requirements

### 6.1 Metadata and semantic structure

Keep the canonical URL `/cv-personal-statement-uk`.

Use metadata that accurately reflects the expanded page:

- Title concept: `CV Personal Statement UK: 12 Examples + Job-Advert Walkthrough`
- Description concept: mention 12 UK examples, tailoring to a real advert, evidence-led wording, and the one-time-price CV builder. Keep within a sensible search snippet length.
- Add an Open Graph title, description, and URL consistent with the page.

The page must have:

- Exactly one visible `h1`.
- Logical `h2`/`h3` nesting.
- A top-level `<article>` around editorial content if this does not conflict with existing section structure.
- Existing FAQ schema retained and updated where necessary.
- An `Article` JSON-LD block in addition to `FAQPage`.
- `datePublished` equal to the page's true original publication date if known from repository history; otherwise use `2026-06-13`, matching the earliest existing page check.
- `dateModified` equal to the actual implementation date, not a future date.
- `author` and `reviewedBy` set to the honest organisation identity `WorkCV Editorial Team` unless the operator supplies a real approved person before implementation finishes.
- `publisher`, `mainEntityOfPage`, headline, and description.

Do not add `Person` schema for an unverified person. Do not add fake credentials.

### 6.2 Hero and introductory promise

Preserve the current hero's core message: a personal statement is a short, targeted opening, not a life story. Update the supporting copy so the page clearly promises:

- 12 examples.
- A real-advert walkthrough.
- A method for replacing generic claims with facts.

Keep two actions:

- Primary: open the editor.
- Secondary: jump to the advert walkthrough or examples on the same page.

Use real anchor IDs such as `#advert-walkthrough` and `#examples`. Ensure anchored headings have appropriate scroll margin.

### 6.3 Definition and formula

Retain the three-part formula:

1. **Target:** the role, level, or setting sought.
2. **Evidence:** relevant experience, qualification, tool, responsibility, scale, or result.
3. **Fit:** what that evidence enables the candidate to contribute.

Add a short fourth editing check called **Truth test**: every concrete claim must be supported elsewhere in the CV and must be something the candidate can explain at interview.

Do not state that every profile must contain a number. Say quantified evidence is useful when it is genuine and relevant.

### 6.4 Exactly 12 example cards

Replace the existing six-item `examples` set with exactly 12 examples. Each card must include:

- `title`
- `audience` or `context` as a short visible label
- `statement`
- `whyItWorks`, containing two or three short annotations
- `relatedHref` when a matching WorkCV page exists

Six cards must be “fully annotated” and six may use a more compact annotation treatment. On mobile, every card must remain readable without horizontal scrolling. Do not use a wide comparison table.

Use these 12 categories and no duplicates:

1. NHS administrative assistant
2. Care worker
3. Graduate data analyst
4. Retail supervisor
5. Mechanical engineer
6. Career changer: retail to office administration
7. Customer service adviser
8. Warehouse operative
9. Return to work
10. School leaver / no experience
11. Redundancy / experienced professional
12. Project or operations manager

Use the following as the approved content baseline. Luna may make small edits for clarity or line length, but must not weaken specificity, add unsupported claims, or change the factual meaning.

#### 1. NHS administrative assistant

> Administrative assistant with three years' experience managing appointments, confidential records and high-volume telephone enquiries in a community service. Proficient in Microsoft 365 and accurate data entry, with a track record of prioritising competing requests and supporting colleagues to meet daily deadlines. Now seeking an NHS administration role where calm communication and careful handling of patient information are essential.

Annotations: names the setting; proves relevant systems and responsibilities; connects evidence to confidentiality and patient contact.

#### 2. Care worker

> Care worker with two years' experience supporting up to eight residents per shift with personal care, mobility, meals and accurate daily notes. Trained in safeguarding and moving and handling, with a consistent focus on dignity, choice and prompt escalation of wellbeing concerns. Seeking a residential care role where dependable teamwork and person-centred support matter.

Annotations: gives honest scale; names trained responsibilities; does not imply clinical or medication authority.

#### 3. Graduate data analyst

> Mathematics graduate with practical experience cleaning, analysing and presenting datasets through university and volunteer projects using Excel, SQL and Power BI. Built a dashboard from 12,000 anonymised records that reduced a charity team's monthly reporting process from several spreadsheets to one repeatable view. Seeking a junior data analyst role focused on clear reporting and evidence-led decisions.

Annotations: specifies tools; gives project scale and a process outcome; clearly states target level.

#### 4. Retail supervisor

> Retail supervisor with four years' experience leading shifts of up to ten colleagues in a high-footfall store. Trusted with rota changes, cashing up, stock investigations and customer escalations, while helping the team maintain service during peak weekend periods. Seeking a store supervisor role that values visible leadership, commercial awareness and reliable follow-through.

Annotations: gives team scale; replaces “leadership skills” with responsibilities; avoids an invented sales percentage.

#### 5. Mechanical engineer

> Mechanical engineer with five years' experience supporting design changes, root-cause investigations and planned maintenance in a regulated manufacturing environment. Confident using SolidWorks, drawing control and cross-functional problem solving, with recent work reducing repeat equipment stoppages through an updated inspection routine. Seeking a maintenance or design role where safety, reliability and practical engineering judgement are central.

Annotations: names discipline, tools, and setting; describes an outcome without inventing a percentage; identifies role fit.

#### 6. Career changer: retail to office administration

> Organised retail supervisor moving into office administration after five years coordinating rotas, reconciling daily records and resolving high-volume customer queries. Uses Excel trackers, written handovers and calm prioritisation to keep work accurate during busy shifts. Ready to transfer those skills into an administrative assistant role with clear deadlines and customer contact.

Annotations: names the change directly; translates rather than hides retail evidence; states the target role.

#### 7. Customer service adviser

> Customer service adviser with three years' experience handling phone, email and live-chat enquiries for an online retailer. Regularly resolves delivery, refund and account issues at first contact while keeping notes accurate for follow-up teams. Seeking a customer support role where clear explanations, ownership and calm complaint handling are valued.

Annotations: names channels and query types; shows how work is completed; uses no unverifiable superlative.

#### 8. Warehouse operative

> Warehouse operative with experience in handheld scanning, picking, packing, stock checks and safe manual handling across rotating shifts. Accustomed to working to daily targets while checking item codes and reporting discrepancies before dispatch. Seeking a permanent warehouse role that values reliable attendance, accuracy and safe teamwork.

Annotations: names relevant tasks and tools; connects accuracy to dispatch; states availability goal without claiming a perfect record.

#### 9. Return to work

> Customer service professional returning to paid work after a planned career break, bringing earlier experience in appointment booking, complaint handling and accurate record updates. Recently refreshed Microsoft 365 skills through structured online training and is now seeking a part-time customer support role. Offers calm communication, current digital confidence and reliable organisation.

Annotations: addresses the break briefly; includes a current action; avoids apology or unnecessary personal detail.

#### 10. School leaver / no experience

> Reliable school leaver seeking an entry-level retail role, with customer-facing experience from weekly charity-shop volunteering and strong attendance throughout the final school year. Comfortable organising donated stock, greeting customers and working with volunteers of different ages. Ready to learn store processes and contribute to a supportive team.

Annotations: uses volunteering as evidence; names real tasks; does not pretend the candidate has paid experience.

#### 11. Redundancy / experienced professional

> Operations coordinator with seven years' experience scheduling field teams, maintaining service records and producing weekly performance reports for senior managers. Recently made redundant following a site closure and now seeking a similar coordination role. Brings strong Excel reporting, stakeholder communication and a practical record of keeping work moving through changing priorities.

Annotations: explains redundancy neutrally; leads with transferable value; avoids implying redundancy was performance-related.

#### 12. Project or operations manager

> Project manager with eight years' experience coordinating cross-functional technology and operations work from scope through delivery. Led a six-person implementation team that brought a new case-management process into service across four locations, with clear risk logs, training and stakeholder reporting. Seeking a delivery role where structured planning and practical change management improve day-to-day operations.

Annotations: gives team and rollout scale; names delivery mechanisms; links the example to operational value.

Every example section must visibly say:

> These are fictional examples for structure and editing practice. Replace every fact, number, tool and outcome with evidence you can support.

### 6.5 Real job-advert walkthrough

Add a visually distinct section with `id="advert-walkthrough"` before the 12-example grid.

Use this dated source:

- Source: NHS Jobs, “Mental Health Administrative Assistant - South West Staffs”
- Advert reference/URL: `https://www.jobs.nhs.uk/candidate/jobadvert/C9301-26-0052`
- Advert date shown in the source: 13 January 2026
- Clearly label it as a closed/archived advert used for teaching, if the page is no longer accepting applications.
- Record the source check in a repository research note. If the URL becomes unavailable, use the Internet Archive or replace it with another publicly accessible NHS Jobs advert with equivalent administrative criteria; document the replacement and do not silently retain unsupported copy.

Only extract or closely paraphrase these teaching criteria:

- office or customer-service experience
- Microsoft Office proficiency
- prioritising conflicting demands and deadlines
- confidentiality
- teamwork
- accurate documents or reports

Use this visibly labelled fictional candidate evidence:

- three years as an administrator in a community charity
- managed a shared inbox and appointment diary
- handled confidential client records
- used Word, Excel and Outlook
- created a weekly spreadsheet that combined overdue actions for a five-person team
- dealt with telephone enquiries and competing deadlines
- no NHS or RiO experience

Show four steps:

1. **Read the advert:** list the six criteria above.
2. **Inventory the candidate's facts:** list only the supplied fictional facts.
3. **Map evidence to criteria:** show at least four concise mappings, for example `confidentiality → handled confidential client records`.
4. **Write and audit the result:** show the finished statement and annotation.

Approved finished statement:

> Administrative professional with three years' experience managing a shared inbox, appointment diary and confidential client records for a community charity. Proficient in Word, Excel and Outlook, including creating a weekly overdue-actions tracker for a five-person team. Used to balancing telephone enquiries with competing deadlines and now seeking an NHS administrative assistant role where accuracy, confidentiality and dependable teamwork are essential.

Annotations must explain:

- “Administrative professional” establishes relevant experience without falsely claiming NHS experience.
- The inbox, diary, records and Microsoft tools match observable criteria.
- The five-person tracker adds credible scale and teamwork evidence.
- The closing line reflects the advert without keyword stuffing.
- RiO and NHS experience were not added because the fictional candidate does not have them.

Add a warning immediately below:

> Never fill a gap by inventing a system, qualification or result. If a criterion is desirable rather than essential, show adjacent experience and willingness to learn.

### 6.6 Before/after and checklist

Retain the current before/after section, but improve its labels so screen-reader and visual users can distinguish `Weak version` and `Evidence-led version`. Do not rely on colour alone.

Keep the existing checklist and add:

- Every number and outcome can be explained and supported.
- The strongest evidence also appears in the experience, education, project, or skills section.
- No protected or unnecessary personal information is included.

### 6.7 Civil Service clarification

Add a small callout titled `Applying to the Civil Service?` with this substance:

> A short CV profile is not the same as a Civil Service application personal statement. Civil Service recruitment may ask for a longer statement against Success Profiles behaviours, strengths, experience, ability or technical criteria. Follow the word limit and instructions in that vacancy. Use this page only for the short profile at the top of a CV.

Link to the current official GOV.UK Success Profiles guidance after checking it at implementation time. Open external links in a new tab with appropriate `rel` attributes.

Do not add “Civil Service” as one of the 12 example cards in this release.

### 6.8 Research and byline section

Replace the stale “Last checked 13 June 2026” sentence with an honest review block.

At minimum, re-check and cite:

- National Careers Service: `https://nationalcareers.service.gov.uk/careers-advice/cv-sections`
- Prospects personal-statement guidance currently linked from the page.
- The NHS Jobs advert used in the walkthrough.
- GOV.UK Success Profiles guidance used in the Civil Service clarification.

The visible block must state:

- the actual review date;
- `Written and reviewed by the WorkCV Editorial Team` unless a verified named author is supplied;
- what was checked;
- that examples are fictional and not guarantees of interview success.

If, before finishing, the operator provides a real author or reviewer, require all of the following before publishing the name:

- full display name;
- accurate current role/credential;
- consent to public attribution;
- a stable WorkCV author URL or a modest inline bio;
- no claim of recruiter review unless that person actually reviewed this exact page.

If any item is missing, retain the organisation byline and report the named-author task as gated. This does not block the release.

## 7. Product-proof requirements

### 7.1 Static sample PDF

Create one downloadable sample:

- Path: `public/samples/workcv-customer-service-cv-example.pdf`
- Public URL: `/samples/workcv-customer-service-cv-example.pdf`
- Candidate: use the existing fictional `customer-service` role template from `lib/role-cv-templates.ts` unless visual inspection finds it unsuitable.
- Template: `classic` unless another existing template produces a clearly better two-page-or-less result.
- PDF metadata title: `WorkCV fictional customer service CV example`
- The sample must contain no real person's contact details. Existing obvious fictional addresses and telephone formats may be retained only after review.
- The rendered document must contain a small unobtrusive line such as `Fictional example — replace all details before applying` if it can be added without changing the live editor template for real users. Prefer a sample-only data/footer mechanism. Do not add this line to user-generated PDFs.

Generate the PDF through the same HTML/Chromium rendering path used by the product or the existing parity fixture. Do not hand-design an unrelated ReportLab PDF. Add a deterministic generation script if needed, for example `scripts/generate-public-cv-sample.mjs`, and a package script such as `generate:public-sample`. The generated binary is committed because it is a public download asset.

Verify:

- valid PDF signature;
- non-trivial file size;
- one or two A4 pages;
- selectable text;
- no clipping or blank pages;
- fonts, colours, spacing, headings and page breaks visually match the current WorkCV output;
- the phrase `Fictional example` is present in extracted text or directly next to the download link if adding it inside the PDF is technically disproportionate.

### 7.2 Reusable proof component

Create a reusable server component, suggested location:

- `components/sample-cv-proof.tsx`

It must accept only the props actually needed, for example a compact/full variant or heading override. Avoid a generic component framework.

The component must show:

- heading: `See the document before you pay.`
- a current local screenshot or thumbnail of the sample CV/product preview;
- a direct `Download fictional sample PDF` link with the `download` attribute;
- a primary editor CTA;
- concise proof copy: visitors can build and preview for free, and pay the current `site.price` once to unlock one saved CV PDF, with no subscription or automatic renewal;
- a visible `Fictional sample` label.

Accessibility requirements:

- descriptive image `alt` text when the screenshot communicates useful information;
- explicit link/button names;
- visible focus state inherited from or consistent with the site;
- no auto-playing carousel;
- no interaction required merely to see the proof;
- layout stacks cleanly at 390px width.

### 7.3 Screenshot assets

First inspect these existing assets:

- `public/directory-assets/workcv-home-desktop-1280x720.png`
- `public/directory-assets/workcv-home-mobile-390x844.png`
- `public/directory-assets/workcv-templates-desktop-1280x720.png`
- `public/directory-assets/workcv-pricing-desktop-1280x720.png`

Reuse an asset only if it accurately matches the current page and does not expose stale pricing or UI. Otherwise capture new local screenshots after the implementation and store narrowly scoped assets under `public/product-proof/` with descriptive lowercase filenames. Optimise them to a reasonable web size without making text illegible. Use `next/image` for raster assets unless the current component context has a documented reason not to.

Do not load proof screenshots from third-party URLs.

### 7.4 Placement

Place the reusable proof component:

- on `/cv-personal-statement-uk`, after the examples/checklist and before the final research/FAQ/CTA sequence;
- on `/cv-builder-no-subscription-uk`, near the first detailed explanation of the one-time purchase and before the final CTA;
- on `/pricing`, after the primary price explanation and before FAQs or the final CTA.

Use one component instance per page. Do not repeat the same component twice on a page.

Do not add testimonials in this release. Do not turn the single recorded sale or referrer data into public proof.

## 8. Internal-link requirements

The following pages must contain one contextual link to `/cv-personal-statement-uk`, ideally near profile/personal-statement guidance rather than only in a generic footer grid:

- `/cv-template-nurse-uk`
- `/cv-template-care-worker-uk`
- `/cv-template-engineer-uk`
- `/cv-template-graduate-uk`
- `/cv-template-customer-service-uk`
- `/cv-template-warehouse-uk`
- `/career-change-cv-uk`
- `/return-to-work-cv-uk`
- `/cv-no-experience-uk`
- `/situations/made-redundant`

Many of these already include the URL in a related-links block. For each page:

- If there is already a relevant in-body or related link, keep it and do not create awkward duplicate links.
- If the link exists only in a generic related-links grid, add at most one natural contextual link where the page discusses the CV profile, but only if it reads naturally.
- Use descriptive anchors such as `personal statement examples for a care worker CV`, not repeated exact-match boilerplate on every page.
- Do not add links to unrelated commercial-alternative pages.

Add reverse links from the matching example cards to the strongest existing role/situation pages. Do not create new role routes.

## 9. Structured data and sitemap

For `/cv-personal-statement-uk`:

- emit valid `Article` and `FAQPage` JSON-LD as two separate script blocks;
- ensure visible author/review claims match schema exactly;
- update `app/sitemap.ts` with the actual modification date for this route;
- do not update last-modified dates for pages receiving only trivial link additions unless their substantive content was reviewed and changed;
- do not use `HowTo` schema merely because the page contains steps;
- do not add review/rating schema.

Validate generated JSON-LD by parsing it in a test. At minimum, verify required fields and ISO date format.

## 10. Analytics and measurement

Do not introduce a third-party analytics product.

If the existing event endpoint can accept additional names without a database migration and there is an established non-editor event pattern, track:

- sample PDF click;
- personal-statement page editor CTA click;
- advert walkthrough anchor click.

If adding these events would require broadening the editor-only event model, database changes, or a client wrapper across server components, skip analytics in this release and document the reason. Do not distort existing editor event names to represent marketing-page clicks.

After deployment, success should be assessed over at least 28 days against the prior period using:

- Search Console impressions, clicks, CTR and average position for `/cv-personal-statement-uk`;
- visits from the guide to `/editor`;
- sample PDF downloads, only if implemented reliably;
- signup and paid-order counts, treated as directional because traffic is still small.

Do not promise a ranking or conversion lift.

## 11. Tests

Add or extend a focused source-contract test, suggested path:

- `tests/content-authority-pages.test.ts`

Tests must read source files and public assets using repository-relative paths, following existing test conventions. They must verify at least:

1. The personal-statement page defines exactly 12 example entries.
2. All 12 required category titles are present.
3. The NHS Jobs advert URL and reference are present.
4. The walkthrough contains the visible fictional-candidate label.
5. The warning against inventing systems, qualifications, or results is present.
6. The Civil Service clarification distinguishes a CV profile from an application personal statement and links to GOV.UK.
7. The visible page and `Article` schema use an honest organisation byline unless a real named author was deliberately configured.
8. `Article` and `FAQPage` schema are present.
9. The sitemap has an explicit current `lastModified` for `/cv-personal-statement-uk`.
10. The sample PDF exists, begins with `%PDF`, and exceeds a conservative minimum size such as 10 KB.
11. The proof component labels the file fictional, uses `site.price`, says no subscription/automatic renewal, and links to the sample path.
12. All three required pages import and render the proof component.
13. Required reverse/contextual links exist without introducing broken internal routes.
14. No prohibited phrases such as `guaranteed interviews`, `NHS approved`, `recruiter approved`, or a fabricated rating appear in the changed files.

Avoid brittle tests based on exact Tailwind class strings or full paragraphs. Test durable content and contracts.

Run:

```text
npm run type-check
npm run test:tools
npm run build
npm run test:pdf-runtime
```

If the repository's full test suite is not covered by `test:tools`, also run every relevant test command in `package.json`. A build warning is not automatically a failure, but explain any unresolved warning. Any TypeScript error, failing test, invalid route, or PDF smoke failure blocks completion.

## 12. Visual QA

Start the production build locally and inspect at minimum:

- `/cv-personal-statement-uk`
- `/pricing`
- `/cv-builder-no-subscription-uk`

At these viewport sizes:

- 390 × 844
- 768 × 1024
- 1280 × 720 or taller

Check:

- no horizontal overflow;
- hero CTAs remain visible and correctly ordered;
- advert mapping remains understandable when stacked;
- example cards do not create excessively narrow columns;
- long statements and annotations do not overflow;
- headings do not orphan awkwardly;
- proof screenshot remains legible and does not dominate mobile;
- sample link works and downloads a valid PDF;
- all anchors land below the fixed header, if any;
- focus order and keyboard activation work;
- external links open safely;
- colour is not the only cue for weak/strong comparisons;
- no hydration or console errors.

Render the sample PDF to images and inspect every page at readable scale. If layout is clipped, blank, or over two pages, fix the sample data or sample-only rendering rather than changing the global user PDF layout without approval.

## 13. Research record

Create `research/content-authority-review-2026-08-25.md` (use the actual execution date if later) containing:

- source title;
- canonical URL;
- access/review date;
- the limited claims used on WorkCV;
- whether the source is active, archived, or superseded;
- any wording changed because a source had changed;
- the final NHS Jobs reference used for the walkthrough.

This note is internal and should be concise. Do not paste full copyrighted articles or full job adverts.

## 14. Completion criteria

The implementation is complete when all of the following are true:

- [ ] The personal-statement page contains exactly 12 distinct, evidence-led examples.
- [ ] The NHS advert walkthrough visibly separates advert criteria, fictional facts, mapping, final copy, and audit notes.
- [ ] The page warns users not to invent evidence.
- [ ] Civil Service terminology is accurately separated.
- [ ] Research sources and the visible review date were actually checked.
- [ ] The byline is truthful and schema matches it.
- [ ] A visually verified fictional WorkCV sample PDF is downloadable.
- [ ] A reusable proof component appears on the three required pages.
- [ ] Price copy comes from `site.price` and accurately describes one saved CV/no renewal.
- [ ] No testimonial, review, outcome, or reviewer identity was fabricated.
- [ ] Contextual and reverse internal links are present without spammy duplication.
- [ ] Structured data parses and sitemap date is correct.
- [ ] Type check, test suite, production build, and PDF runtime smoke pass.
- [ ] Mobile, tablet, desktop, and PDF visual QA pass.
- [ ] Unrelated user files remain untouched.

## 15. Explicitly gated follow-ups

These are not reasons to delay this release:

1. **Named author:** gated until the operator provides a genuine identity, role, consent, and bio/URL.
2. **Named expert reviewer:** gated until a real careers professional or recruiter reviews this exact page and approves attribution.
3. **Testimonials:** gated until a real user gives informed permission to publish exact or lightly edited feedback.
4. **Verified outcomes:** gated until WorkCV has consented, auditable evidence linking product use to an outcome; do not infer outcomes from a sale.
5. **Civil Service guide:** consider as a separate page after query validation; it must cover Success Profiles and application word limits rather than reuse CV-profile copy.

## 16. Final implementation report format

When finished, report:

1. Outcome in one sentence.
2. Files changed and why.
3. Verification commands and results.
4. Visual/PDF QA results and viewport sizes.
5. The exact source/review date used.
6. Any deviations from this spec with reasons.
7. Gated follow-ups, especially author/reviewer/testimonial status.

Do not claim deployment unless production was actually deployed and smoke-tested.
