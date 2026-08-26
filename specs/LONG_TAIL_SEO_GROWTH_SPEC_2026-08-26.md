# WorkCV long-tail SEO and conversion growth release

**Execution specification for Luna Max**  
**Status:** Approved implementation brief  
**Prepared:** 26 August 2026  
**Repository:** `D:\DKPlayground\OneOffUKCV`  
**Site:** `https://workcv.co.uk`

## 1. Your assignment

Implement this specification end to end. Do not return another strategy document, a proposal, or a partial mock-up. Inspect the repository first, preserve the established WorkCV design system and product truth, implement the changes, add durable tests, run the full required verification, inspect the built pages at mobile, tablet, and desktop widths, and report any deviation.

The goal is to win useful UK long-tail searches by strengthening the pages WorkCV already owns. Do not create thin pages for every keyword variation. The existing route inventory already covers the required intent; the work is to make those pages demonstrably more useful, clearly differentiated, and internally coherent.

The release is complete only when:

1. Every target query cluster has one clear canonical owner.
2. The two overlapping Word-template pages have distinct search intent and content.
3. The core no-subscription proposition is accurate and prominent without implying a free PDF.
4. Role-specific pages answer the long-tail query with practical, unique evidence.
5. Internal links, structured data, sitemap dates, tests, download checks, and responsive QA pass.

## 2. Product truth to preserve

WorkCV is a UK CV builder.

- Email-code login is required before the editor opens.
- A visitor can build and preview a saved CV before payment.
- The standard product charges the current `site.price` once to unlock PDF access for one saved CV.
- It is not a monthly subscription and does not automatically renew.
- The finished WorkCV PDF is not free.
- The blank Microsoft Word template at `/api/tools/blank-cv-template` is genuinely free, requires no account, and downloads directly.
- WorkCV does not guarantee ATS parsing, interview selection, recruiter approval, or employment outcomes.

Use `site.price` or the repository's existing price helpers everywhere application copy needs the live price. Never hard-code `£7.99` in a reusable component or schema when a site-price helper is available.

## 3. Evidence and opportunity

The operator supplied a query/ranking export containing strong directional signals around:

- `online resume maker free`
- `build a resume free`
- `make a resume`
- `resume generator`
- `resume builder free download`
- `free resume builder online`
- `create resume online free`
- `resume editor free`
- `update resume for free`
- `resume preparation`
- `cv professional`

The same export contains many branded queries for Canva, Zety, Teal, FlowCV, Adobe, Kickresume, Enhancv, Rezi, Jobscan, Grammarly, and others. Treat the supplied rankings as directional position signals, not search volume, traffic forecasts, or proof that WorkCV should build a page for every phrase.

SERP checks on 26 August 2026 found that the generic `free CV builder`, `no signup`, and `free PDF` space already contains products making genuinely free claims. WorkCV must not compete by blurring its paid-download model. Its strongest honest commercial distinction is:

> Build and preview first. Pay once for the saved CV PDF. No monthly subscription, no automatic renewal, and nothing to cancel.

The free Word template is the legitimate entry point for `free CV template` and `free CV download` intent. The paid editor is the entry point for `no subscription`, `pay once`, and `preview before payment` intent.

## 4. Non-negotiable constraints

1. Do not claim that the WorkCV PDF download is free.
2. Do not claim no signup or no account on editor pages. Email-code login is required.
3. Do not use `free CV maker`, `free resume builder`, or `free PDF download` in a title/H1 for the paid editor.
4. Do not invent ratings, testimonials, customer counts, recruiter quotes, awards, interview results, ATS scores, or success rates.
5. Do not add `ATS approved`, `recruiter approved`, `guaranteed interviews`, `NHS approved`, or equivalent wording.
6. Do not create doorway pages for plural/singular, CV/resume, free/pay-once, or minor word-order variants.
7. Do not create a new `/free-cv-template-uk` content page. `/tools/blank-cv-template-uk` already owns that intent.
8. Preserve `/cv-builder-no-subscription` as the existing permanent redirect to `/cv-builder-no-subscription-uk`.
9. Keep `/resume-builder-uk-no-subscription` as a UK terminology bridge. It must not become a near-copy of `/cv-builder-no-subscription-uk`.
10. Do not change authentication, checkout, entitlement, editor persistence, database schema, live PDF rendering, or production infrastructure.
11. Do not replace source-backed copy with generic SEO filler.
12. Preserve all unrelated modified and untracked files. Do not clean the worktree or use destructive Git commands.
13. Use `apply_patch` for hand-written source changes.
14. Do not update a visible review date, schema `dateModified`, or sitemap `lastModified` unless the page and its cited sources were actually checked during implementation.
15. Do not deploy unless the operator separately authorises deployment.

## 5. Scope

### 5.1 Primary pages

Implement substantive improvements on:

- `app/cv-builder-no-subscription-uk/page.tsx`
- `app/pricing/page.tsx`
- `app/tools/blank-cv-template-uk/page.tsx`
- `app/tools/cv-template-word-uk/page.tsx`

### 5.2 Role and situation pages

Apply focused long-tail improvements without turning them into clones:

- `app/cv-template-customer-service-uk/page.tsx`
- `app/cv-template-care-worker-uk/page.tsx`
- `app/cv-template-warehouse-uk/page.tsx`
- `app/cv-template-nurse-uk/page.tsx`
- `app/cv-template-graduate-uk/page.tsx`
- `app/cv-template-engineer-uk/page.tsx`
- `app/career-change-cv-uk/page.tsx`
- `app/return-to-work-cv-uk/page.tsx`

### 5.3 Supporting files

Update as required:

- `components/tools-hub.tsx`
- `app/sitemap.ts`
- shared marketing, schema, or link components only when reuse is genuinely cleaner
- `tests/long-tail-seo-pages.test.ts` as a new durable contract suite
- `research/long-tail-seo-review-YYYY-MM-DD.md` using the true implementation date

### 5.4 Routes to inspect but not rewrite without a specific need

- `app/resume-builder-uk-no-subscription/page.tsx`
- `app/cv-personal-statement-uk/page.tsx`
- `app/ats-cv-template-uk/page.tsx`
- `app/cv-no-experience-uk/page.tsx`
- `app/how-to-write-a-cv-uk/page.tsx`
- `app/templates/page.tsx`
- `app/tools/page.tsx`

These are internal-link destinations and collision checks. Make only small link or metadata adjustments if the ownership map below requires them.

### 5.5 Out of scope

- New brand-comparison pages for Canva, Zety, Teal, FlowCV, Adobe, or other competitors.
- A separate page for every `resume maker` word order.
- A new free PDF product.
- New editor features or a new CV template.
- Keyword-volume estimates not supported by a real data source.
- Backlink outreach, directory submission, paid search, or production Search Console changes.

## 6. Keyword ownership map

Each primary query belongs to exactly one canonical route.

| Canonical route | Primary query | Supporting long-tail phrases | Intent |
| --- | --- | --- | --- |
| `/cv-builder-no-subscription-uk` | `cv builder no subscription uk` | `one off cv builder uk`, `cv maker no monthly fee uk`, `cv builder no automatic renewal`, `uk cv builder pay once pdf`, `cv builder preview before payment` | Commercial product |
| `/pricing` | `cv builder pricing uk` | `cv maker pay once uk`, `cv builder one time payment`, `how much does a cv builder cost uk` | Price validation |
| `/tools/blank-cv-template-uk` | `free cv template uk download` | `free blank cv template uk`, `editable cv template word uk`, `free cv template no signup`, `uk cv template docx download` | Genuinely free download |
| `/tools/cv-template-word-uk` | `how to edit a cv template in word uk` | `format a cv in microsoft word`, `save a word cv as pdf`, `edit cv template without breaking layout` | Informational Word guide |
| `/resume-builder-uk-no-subscription` | `resume builder uk no subscription` | `is a resume the same as a cv uk`, `uk resume maker pay once` | Resume-to-CV terminology bridge |
| `/cv-template-customer-service-uk` | `customer service cv template uk with examples` | `customer service adviser cv example uk`, `call centre cv example uk` | Role template |
| `/cv-template-care-worker-uk` | `care worker cv template uk` | `care assistant cv example uk`, `support worker cv skills uk` | Role template |
| `/cv-template-warehouse-uk` | `warehouse operative cv example uk` | `picker packer cv template uk`, `warehouse cv skills uk` | Role template |
| `/cv-template-nurse-uk` | `nurse cv template uk` | `registered nurse cv example uk`, `nhs nurse cv skills` | Role template |
| `/cv-template-graduate-uk` | `graduate cv template uk` | `entry level cv example uk`, `graduate cv personal statement example` | Early-career template |
| `/cv-template-engineer-uk` | `engineer cv template uk` | `mechanical engineer cv example uk`, `engineering cv skills uk` | Role template |
| `/career-change-cv-uk` | `career change cv example uk` | `career change cv personal statement uk`, `transferable skills cv example` | Situation guide |
| `/return-to-work-cv-uk` | `return to work cv example uk` | `cv after career break uk`, `returning to work personal statement` | Situation guide |
| `/cv-personal-statement-uk` | `cv personal statement examples uk` | `cv personal profile examples by role`, `career change personal statement example` | Editorial hub |

### Ownership rules

- Use the primary query naturally in the title concept, H1, introduction, or a close grammatical variant. Do not repeat it mechanically.
- Supporting phrases should appear only where useful to the reader: subheadings, FAQs, labels, related-link anchors, or concise body copy.
- `CV` is the primary term on UK product and template pages.
- `Resume` belongs primarily on `/resume-builder-uk-no-subscription`, comparison content, or a short terminology FAQ. Do not rename UK CV pages around US terminology.
- Do not add the exact same primary phrase to multiple page titles or H1s.
- Do not make `/pricing` a duplicate sales page; it answers price and purchase-model questions.
- Do not make `/tools/cv-template-word-uk` another free-download landing page; it is a Word editing and export guide.

## 7. Required implementation order

1. Inspect repository instructions, `git status`, all scoped pages, shared components, schemas, sitemap, and existing tests.
2. Record a before-state metadata/internal-link matrix in the research note.
3. Implement the free-template and Word-guide differentiation first.
4. Refine the no-subscription and pricing cluster.
5. Apply the role-page upgrades using one consistent data shape or component where sensible.
6. Implement the internal-link map.
7. Update schema and accurate sitemap dates.
8. Add tests.
9. Run automated checks.
10. Run download, document-render, responsive, keyboard, console, and structured-data QA.
11. Fix every in-scope issue found and rerun affected checks.
12. Produce the final implementation report described in section 18.

## 8. `/cv-builder-no-subscription-uk` requirements

### Search intent

This is the main commercial owner for people who want a UK CV builder without recurring billing. Preserve the useful existing comparison, proof, and product-truth content. Improve organisation and query fit; do not replace strong content simply to change wording.

### Metadata concept

- Title: `CV Builder No Subscription UK - Pay Once | WorkCV`
- Description: explain build/preview before payment, one payment using the live price, PDF access for one saved CV, and no automatic renewal.
- Canonical: `/cv-builder-no-subscription-uk`
- Open Graph metadata must match the visible proposition.

Keep titles within normal search-result length where practical. The exact punctuation may change for readability, but the meaning must not.

### Visible page contract

The first viewport must make all four facts clear:

1. UK-focused CV builder.
2. Build and preview before payment.
3. Pay `site.price` once for PDF access to the selected saved CV.
4. No monthly subscription or automatic renewal.

Use exactly one `h1`. Recommended H1 concept:

> A UK CV builder with no subscription.

The page must retain or add:

- a concise `How payment works` section;
- a `No subscription does not mean a free PDF` clarification near the first purchase CTA;
- a direct explanation of email-code login;
- the downloadable fictional sample proof already used by WorkCV;
- a comparison section only where competitor facts are sourced and dated;
- a fit section explaining when WorkCV, a free document editor, or a subscription suite may be more appropriate;
- a related-link block to pricing, the free blank template, templates, the personal-statement guide, and the Word guide.

### Approved truth copy

Use this meaning, with minor editorial edits allowed:

> Building and previewing are free before checkout. Downloading the WorkCV PDF is paid. One payment unlocks PDF access for the saved CV used at checkout; it does not start a monthly subscription or automatic renewal.

### FAQ questions

Include durable answers to:

1. Is WorkCV free to use?
2. Is the finished PDF free?
3. Does WorkCV require an account?
4. What does one payment unlock?
5. Can I edit the same CV after payment?
6. Is there a subscription or automatic renewal?
7. Does WorkCV guarantee ATS results or interviews?

Render matching `FAQPage` schema from the same FAQ data.

## 9. `/pricing` requirements

### Search intent

This page answers `cv builder pricing uk`, `pay once`, and cost-transparency queries. It should be the shortest route to understanding the product's price and scope.

### Metadata concept

- Keep or refine the current price-led title using the live price helper.
- Description must include `one-time payment`, `one saved CV`, `PDF`, and `no monthly subscription`.
- Canonical remains `/pricing`.

### Visible page contract

Above the fold show:

- the current price from `site.price`/`site.priceGbp`;
- what is free before checkout;
- exactly what payment unlocks;
- no automatic renewal;
- primary CTA to build and preview;
- secondary link to the fictional sample PDF.

Do not repeat the entire no-subscription page. The pricing page must focus on purchase scope, refund-policy link, payment flow, and what is or is not included.

Add a compact `Compare your options` section:

- Free Word template: free download, self-edited.
- WorkCV: guided builder, preview first, one saved CV PDF unlock.
- Subscription suite: potentially broader ongoing tools, recurring cost depends on provider.

Do not disparage competitors. Do not use stale competitor prices outside the existing dated pricing source model.

## 10. `/tools/blank-cv-template-uk` requirements

### Search intent

This is the canonical transactional owner for a genuinely free UK Word CV template. It must be substantially more useful than a thin download page.

### Metadata concept

- Title: `Free CV Template UK - Editable Word Download | WorkCV`
- Description: mention a direct editable DOCX download, standard UK sections, no signup, no payment, and no subscription.
- Canonical: `/tools/blank-cv-template-uk`
- H1 concept: `Free UK CV template to download and edit.`

### Required page sections

1. **Hero and direct download**
   - Primary CTA: `/api/tools/blank-cv-template`
   - Visible file type: `.docx`
   - State `No signup`, `No email gate`, and `No payment` because these are true for this asset.
   - Secondary CTA to the WorkCV editor labelled honestly: build/preview first, paid PDF download.

2. **What is inside the template**
   - contact details;
   - personal profile prompt;
   - key skills;
   - reverse-chronological work experience;
   - education and qualifications;
   - additional information;
   - references line;
   - evidence-led bullet prompts.

3. **How to use it in three steps**
   - Download and open in Word or a compatible editor.
   - Replace every placeholder with truthful, role-relevant evidence.
   - Remove unused guidance and export in the employer's requested format.

4. **UK CV structure explanation**
   - no routine need for a photo;
   - avoid unnecessary personal data;
   - clear headings and consistent formatting;
   - one or two pages as a context-dependent guideline, not a universal guarantee;
   - tailor the profile, skills, and evidence to the advert.

5. **Free Word template versus WorkCV**
   - Use a compact accessible comparison, not a horizontally scrolling table on mobile.
   - Explain manual Word editing versus guided browser editing and preview.
   - State that WorkCV's finished PDF costs `site.price`.

6. **Role-specific next steps**
   - Link to customer service, care worker, warehouse, nurse, graduate, engineer, career-change, and return-to-work pages using useful anchor text.

7. **FAQ**
   - Is the template genuinely free?
   - Is signup required?
   - Is it a real Word document?
   - Can it be opened in Google Docs or another editor? Use cautious compatibility wording.
   - Is it ATS-friendly? Explain design choices without a guarantee.
   - How do I save it as a PDF?
   - What must I replace before applying?

### Maintainability

Refactor the current compressed single-line JSX into readable components/data arrays while preserving design. Do not create a page that is difficult to review or update.

## 11. `/tools/cv-template-word-uk` requirements

### Anti-cannibalisation objective

This page currently overlaps strongly with the blank-template landing page. Reframe it as an instructional guide rather than a second download landing page.

### Metadata concept

- Title: `How to Edit a CV Template in Word - UK Guide | WorkCV`
- Description: explain editing headings, spacing, bullets, page length, and PDF export without breaking the layout.
- Canonical remains `/tools/cv-template-word-uk`.
- H1 concept: `How to edit a UK CV template in Microsoft Word.`

### Required page sections

1. Link to the free template with a clearly secondary download CTA.
2. Use Word styles instead of manually formatting every heading.
3. Keep dates, role titles, and bullets aligned without tables or text boxes.
4. Replace placeholders and delete instructional copy.
5. Control page breaks, paragraph spacing, widow/orphan behaviour where available, and bullet indentation.
6. Check one- versus two-page length based on experience and relevance.
7. Save/export to PDF and reopen the PDF to check layout.
8. Common problems: font substitution, broken bullets, accidental blank pages, clipped content, and inconsistent dates.
9. When the browser builder may be easier than manual Word formatting.

The phrase `free CV template UK download` may appear once as a contextual link, but must not be the page's title, H1, or primary repeated message.

## 12. Resume terminology bridge

Inspect `/resume-builder-uk-no-subscription` and keep it distinct.

- Primary purpose: answer UK visitors who searched for `resume` but need to understand whether the employer expects a CV.
- Retain self-canonical unless repository evidence shows an intentional consolidation decision.
- Keep a prominent link to `/cv-builder-no-subscription-uk`.
- Do not duplicate long comparison tables or every FAQ from the CV page.
- Use a short terminology table, employer-instruction guidance, filename guidance, and the honest product/payment explanation.
- Add a related link back to `/cv-vs-resume-uk`.

If its title is changed, use the concept:

`Resume Builder UK No Subscription - UK CV Format | WorkCV`

## 13. Role and situation page upgrade pattern

Do not rewrite all eight pages into the same template text. Preserve their existing unique data and examples. Apply the following contract to each:

1. Exactly one H1 containing a natural close variant of the page's primary query.
2. Metadata title and description unique to that role/situation.
3. The first 120 visible words must identify the intended applicant and what the example contains.
4. Include one evidence-led personal-profile example or link directly to the matching section on `/cv-personal-statement-uk`.
5. Include three to five role-specific evidence categories. Examples:
   - customer service: channels, complaint resolution, CRM accuracy, service volume;
   - care: dignity, safeguarding/escalation, records, handovers;
   - warehouse: accuracy, safe movement, stock flow, shift reliability;
   - nursing: NMC status, clinical setting, safe practice, communication;
   - graduate: degree/project evidence, tools, internships, commercial awareness;
   - engineering: discipline, technical tools, safety, project outcomes;
   - career change: target role, transferable evidence, rewritten duty examples;
   - return to work: recent activity, skills continuity, concise career-break explanation.
6. Include a short `What not to invent` or accuracy note where examples contain numbers, systems, qualifications, licences, registrations, or outcomes.
7. Add three to five unique FAQs where a real query is answered. Do not reuse identical answers across all pages.
8. Add contextual links to:
   - `/cv-personal-statement-uk`;
   - `/how-to-write-a-cv-uk`;
   - `/tools/blank-cv-template-uk`;
   - the editor;
   - one or two adjacent role/situation pages only when relevant.
9. Use the existing `lib/role-cv-templates.ts` data where possible; do not create conflicting sample facts.

### Recommended metadata concepts

| Route | Title concept |
| --- | --- |
| `/cv-template-customer-service-uk` | `Customer Service CV Template UK + Example | WorkCV` |
| `/cv-template-care-worker-uk` | `Care Worker CV Template UK + Example | WorkCV` |
| `/cv-template-warehouse-uk` | `Warehouse Operative CV Template UK + Example | WorkCV` |
| `/cv-template-nurse-uk` | `Nurse CV Template UK + Example | WorkCV` |
| `/cv-template-graduate-uk` | `Graduate CV Template UK + Entry-Level Example | WorkCV` |
| `/cv-template-engineer-uk` | `Engineer CV Template UK + Example | WorkCV` |
| `/career-change-cv-uk` | `Career Change CV Example UK + Template | WorkCV` |
| `/return-to-work-cv-uk` | `Return to Work CV Example UK + Career Break Template | WorkCV` |

### Customer-service proof

Because the existing downloadable fictional WorkCV sample is a customer-service CV, add the compact `SampleCvProof` treatment to `/cv-template-customer-service-uk` if it fits cleanly without repeating an adjacent CTA. Do not add the same customer-service proof to unrelated role pages.

## 14. Internal-link map

Implement contextual links, not footer-style keyword dumps.

### Required outgoing links

- `/cv-builder-no-subscription-uk` -> pricing, blank template, Word guide, templates, personal-statement guide.
- `/pricing` -> no-subscription page, blank template, sample PDF, refund policy, editor.
- `/tools/blank-cv-template-uk` -> Word guide, how-to-write guide, templates, all eight scoped role/situation pages, editor.
- `/tools/cv-template-word-uk` -> blank template, how-to-write guide, editor.
- `/resume-builder-uk-no-subscription` -> CV no-subscription page and CV-vs-resume guide.
- Each scoped role page -> personal-statement guide, blank template, how-to-write guide, editor.

### Required reverse links

- `components/tools-hub.tsx` -> blank template using `Free blank UK CV template` or an equally natural label.
- `/templates` -> blank template in a free-resource context if not already present.
- `/how-to-write-a-cv-uk` -> blank template and personal-statement guide if missing.
- `/cv-personal-statement-uk` -> relevant role examples already present; add only missing, useful links.

### Link rules

- Do not repeat the same destination multiple times in one small section.
- Do not use exact-match anchor text unnaturally.
- Every internal href must resolve to an existing route.
- Download links must remain download actions, not be converted to client-side navigation.

## 15. Structured data and indexing

### Schema

- Commercial pages: retain valid Product/SoftwareApplication schema as appropriate to the existing repository model.
- Editorial/how-to pages: use `Article` only if the visible page has honest author/review/date information.
- FAQ schema must be produced from the same visible FAQ data.
- The free-template page may retain `SoftwareApplication` with an `Offer` price of `0 GBP` because that specific DOCX asset is genuinely free.
- Do not mark the paid WorkCV product as free.
- Do not add aggregate ratings or reviews.
- JSON-LD must parse as valid JSON.

### Canonicals and sitemap

- Preserve every canonical in the ownership map.
- Do not add redirected `/cv-builder-no-subscription` to the sitemap.
- Do not add a new `/free-cv-template-uk` route.
- Update `lastModified` only for pages materially changed and actually reviewed.
- Use the true implementation date, not the spec date if implementation occurs later.

## 16. Download and document requirements

The free DOCX is a core proof asset and must remain functional.

Verify `/api/tools/blank-cv-template` returns:

- HTTP 200;
- `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
- a `Content-Disposition` filename ending in `.docx`;
- a non-trivial DOCX payload;
- a ZIP/DOCX structure that Word-compatible software can open.

If the document content is changed:

1. Keep metadata creator/title/description accurate.
2. Preserve A4 layout, ordinary document paragraphs, editable text, and accessible hierarchy.
3. Render the DOCX to PDF/PNG using the repository's document workflow.
4. Inspect every rendered page at readable scale.
5. Fix blank pages, clipped text, bad page breaks, inconsistent bullets, and placeholder overflow.
6. Confirm the direct download still works in the production build.

Do not change the DOCX merely to update a date. Change it only if the content or visual quality materially improves.

## 17. Design and accessibility requirements

- Preserve WorkCV's existing navy/gold/neutral palette, typography, spacing, borders, and restrained tone.
- Reuse `SectionLabel`, `FaqSection`, `RelatedLinksSection`, `SampleCvProof`, CTA components, and existing layout conventions where appropriate.
- Avoid a wall of nearly identical cards. Use hierarchy: hero, concise explanation, process, proof, comparison, related guidance, FAQ, CTA.
- Keep text line lengths readable.
- Use responsive grids that become a single column cleanly.
- Do not use wide tables that require horizontal scrolling on mobile.
- Exactly one H1 per page; use logical H2/H3 order.
- Buttons and links need visible focus states and at least a practical 44px touch target.
- Icons are decorative unless they convey unique meaning; hide decorative SVGs from assistive technology where appropriate.
- Colour must not be the only cue in comparisons.
- Anchor targets must not hide under the fixed header.
- External links must use safe `rel` values.
- No stock imagery is required. Prefer the real current product sample and the actual document preview.

## 18. Research record

Create `research/long-tail-seo-review-YYYY-MM-DD.md` using the true execution date.

Record:

- the supplied query phrases and the interpretation that rankings are directional, not volume;
- the canonical ownership matrix before and after implementation;
- each external source checked, canonical URL, access date, claim used, and status;
- competitor pages inspected only to understand search intent, not to copy wording;
- any search claim deliberately rejected because WorkCV cannot support it;
- the exact date used for visible review and sitemap updates;
- whether the DOCX was changed and visually re-rendered;
- the reason analytics were added or deliberately skipped.

At minimum re-check current official guidance used by the changed pages, such as the National Careers Service CV guidance. If competitor pricing remains visible, re-check every cited price/source and update `lib/competitor-pricing.ts` only when necessary and supported.

Do not paste copyrighted articles, full competitor pages, or full SERP exports into the note.

## 19. Analytics and measurement

Do not add a third-party analytics product.

If the existing event model can support marketing interactions without database changes or misusing editor event names, track only:

- free DOCX download click;
- blank-template editor CTA click;
- sample PDF click;
- no-subscription page editor CTA click.

If this requires broadening an editor-only API, a new database model, or client wrappers across server components, skip the events and document the reason.

Prepare a measurement checklist for the operator:

- Search Console impressions, clicks, CTR, and average position by canonical page;
- query groups: no subscription/pay once, free template/Word, role templates, resume terminology;
- compare 28 days before versus 28 days after indexing;
- review again after 56 days before creating additional pages;
- inspect conversions from the commercial routes separately from free-template downloads.

Do not promise ranking improvements or a deadline for results.

## 20. Automated tests

Add `tests/long-tail-seo-pages.test.ts` using the repository's existing Node test style.

Test durable contracts, not full paragraphs or exact Tailwind class strings.

Required assertions:

1. Every ownership-map route exists.
2. `/cv-builder-no-subscription-uk` contains a self-canonical, no-subscription positioning, live price helper, paid-PDF clarification, login clarification, and no-renewal statement.
3. `/pricing` uses the live price helper and accurately describes one saved CV/PDF access.
4. `/tools/blank-cv-template-uk` self-canonicals and accurately states direct free DOCX/no signup/no payment.
5. `/tools/cv-template-word-uk` has Word-editing intent and does not use the blank-template page's title/H1.
6. `/cv-builder-no-subscription` remains a permanent redirect to `/cv-builder-no-subscription-uk`.
7. `/resume-builder-uk-no-subscription` remains distinct and links to the CV route.
8. Every scoped role page contains its unique role phrase and links to the personal-statement guide, blank template, and editor.
9. The customer-service page renders `SampleCvProof` if that scoped improvement is implemented.
10. The free-template API source retains DOCX content type, filename, and cache headers.
11. Updated pages use valid internal hrefs.
12. Sitemap dates are explicit for materially changed routes and use the real execution date.
13. No prohibited fabricated-approval, guarantee, testimonial, rating, or outcome phrases appear in changed files.
14. The paid builder does not claim a free PDF or no-account editing.
15. The free DOCX page does not imply the separate WorkCV PDF is free.

If practical, add a focused DOCX smoke test that calls the route handler, checks status/headers, verifies payload size, and opens the ZIP structure. Do not add a heavyweight dependency solely for this test when the existing `docx`/ZIP tooling is sufficient.

## 21. Required verification commands

Run from the repository root:

```text
npm run type-check
npm run test:content
npm run test:tools
npm run build
npm run test:pdf-runtime
```

Also run any new focused test script if one is added to `package.json`.

Run `git diff --check` and confirm there are no unintended tracked deletions.

Any TypeScript error, failing test, build failure, invalid schema, broken route, broken direct download, or document-render defect blocks completion.

The existing Next.js edge-runtime/static-generation warning is not automatically a failure, but report it if it remains.

## 22. Production-build and visual QA

Start the production build locally and inspect at minimum:

- `/cv-builder-no-subscription-uk`
- `/pricing`
- `/tools/blank-cv-template-uk`
- `/tools/cv-template-word-uk`
- `/cv-template-customer-service-uk`
- one healthcare role page
- one manual/warehouse role page
- one situation page

Use these viewport sizes:

- 390 x 844
- 768 x 1024
- 1280 x 900

Check:

- HTTP 200 and correct canonical;
- no horizontal overflow;
- one visible H1;
- hero CTA order and truthfulness;
- no narrow comparison columns;
- cards, lists, and long headings wrap cleanly;
- role examples remain readable;
- sample screenshot loads at its natural aspect ratio;
- direct DOCX download returns the correct file;
- sample PDF link works;
- keyboard activation and focus order are sensible;
- external links open safely;
- JSON-LD parses;
- no hydration errors or local console errors.

Inspect the free DOCX rendered output if it changed. Inspect the fictional PDF only if its component or asset changed.

## 23. Completion criteria

The implementation is complete only when all are true:

- [ ] No new thin or duplicate public content route was created.
- [ ] The keyword ownership map is implemented without conflicting titles/H1s.
- [ ] `/cv-builder-no-subscription-uk` clearly owns no-subscription/pay-once intent.
- [ ] `/pricing` clearly owns pricing/cost intent.
- [ ] `/tools/blank-cv-template-uk` clearly owns the genuine free-download intent.
- [ ] `/tools/cv-template-word-uk` is a distinct Word editing/export guide.
- [ ] The resume route remains a terminology bridge rather than a duplicate CV page.
- [ ] All eight scoped role/situation pages contain unique, useful long-tail content.
- [ ] The customer-service page uses the relevant real product sample where appropriate.
- [ ] Free, login, pricing, saved-CV, and renewal claims are accurate.
- [ ] No social proof, author, reviewer, rating, approval, or outcome was fabricated.
- [ ] Internal links follow the required map without spammy repetition.
- [ ] Structured data parses and matches visible content.
- [ ] Sitemap dates are accurate.
- [ ] The DOCX download works and any changed document renders cleanly.
- [ ] Type checking, all tests, build, and PDF runtime smoke pass.
- [ ] Mobile, tablet, and desktop visual QA pass.
- [ ] Research and measurement notes are complete.
- [ ] Unrelated user files remain untouched.

## 24. Explicitly gated follow-ups

These are not blockers for this release:

1. Creating new pages for additional long-tail clusters; wait for 28/56-day query evidence.
2. Changing the free/paid product model.
3. Adding a named author or reviewer without a real approved identity and consent.
4. Publishing testimonials or verified outcomes without permission and auditable evidence.
5. Building competitor-comparison pages for new brands.
6. Backlink outreach or Search Console submission.
7. Production deployment.

## 25. Final implementation report format

Report:

1. Outcome in one sentence.
2. Canonical ownership changes.
3. Files changed and why.
4. Page-by-page content and UX changes.
5. Verification commands and exact results.
6. Responsive and document QA results with viewport sizes.
7. Sources checked and the exact review date.
8. Any deviations from this specification and reasons.
9. Analytics implemented or intentionally skipped.
10. Gated follow-ups.
11. Deployment status. Do not claim deployment unless production was actually deployed and smoke-tested.

