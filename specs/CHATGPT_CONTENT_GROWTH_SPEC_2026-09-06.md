# WorkCV: ten-page content growth specification

Prepared: 6 September 2026
Site: https://workcv.co.uk
Scope: four new articles and six substantive updates to existing pages
Status: implementation brief; this document does not publish or deploy changes

## 1. Objective and evidence

Make WorkCV useful for specific questions UK job seekers ask while drafting, checking, formatting and downloading a CV. Each target page must answer its question fully and provide a relevant next step into an existing WorkCV template, tool or editor.

The commercial objective is more attributable paid CV downloads from relevant visitors, including ChatGPT referrals. Search citations, visits and signups are intermediate signals.

The operator reported a couple of sales over the last two weeks and suspects ChatGPT referrals. Their source has not been verified. The questions below are editorial hypotheses, not measured ChatGPT query volumes or proof of future recommendations. Establish a baseline before attributing results to this release.

Repository inspection confirms existing role/situation content, a free Word-template endpoint, a paid PDF editor, source attribution and a growth report. It does not establish the current production state. Verify deployment and product behaviour before publishing factual walkthroughs.

OpenAI documents that OAI-SearchBot supports ChatGPT search and that GPTBot training controls are separate: https://developers.openai.com/api/docs/bots (consulted 6 September 2026). The repository already allows OAI-SearchBot and ChatGPT-User. Preserve that access and verify the live response and any infrastructure restrictions. Crawl access is a prerequisite, not a promise of indexing, citation or recommendation.

## 2. Scope and product constraints

- Deliver exactly four new indexable article routes and improvements to the six existing routes listed below. Related-page link edits, proof assets, metadata, sitemap updates and existing analytics placement wiring are included.
- Preserve the current design system and useful existing content. Review each existing page before expanding it; merge overlapping sections instead of appending repetitive copy.
- Current repository price is £7.99 once. Application copy and structured data must use existing price helpers such as `site.price`, not a duplicated hard-coded price.
- Build and preview require email-code login. Payment unlocks PDF access for one saved CV under the current entitlement rules. Verify those rules before describing subsequent edits or downloads.
- The finished editor PDF is paid. The separate blank Word template is free and requires no account. Do not imply that the editor provides free PDF downloads or editable Word export.
- Do not claim employer ATS approval, guaranteed parsing, interviews, jobs or a universal ATS score.
- Use clearly labelled fictional candidates and employers for examples. Do not invent reviewers, qualifications, testimonials, customer counts or performance claims. Never encourage candidates to invent achievements or metrics.
- Content and examples must use UK English and appropriate UK CV terminology.
- No new editor, authentication, import, checkout, payment, database or AI functionality is included. If a desired demonstration needs an unsupported feature, document a supported workflow instead and record the limitation.
- Preserve unrelated working-tree changes. Inspect applicable repository instructions and use `apply_patch` for hand-written source edits.
- Implementation does not include production deployment, outreach, paid promotion or recurring automations. Execute those only under separate user instructions.

## 3. Page inventory and ownership

| ID | Action | Canonical route | Primary question / intent |
| --- | --- | --- | --- |
| N1 | New | `/chatgpt-cv-to-pdf-uk` | You have written my CV; how do I turn it into a formatted UK PDF? |
| N2 | New | `/convert-resume-to-uk-cv` | How do I adapt an overseas resume for UK applications? |
| N3 | New | `/shorten-cv-to-two-pages` | How do I reduce a three-page CV without losing relevant evidence? |
| N4 | New | `/cv-word-or-pdf-uk` | Should I submit my CV as Word or PDF? |
| E1 | Expand | `/cv-builder-no-subscription-uk` | Where can I build a UK CV without recurring charges? |
| E2 | Expand | `/tools/blank-cv-template-uk` | Where can I download a free UK Word CV template without an account? |
| E3 | Expand | `/cv-template-care-worker-uk` | What should a care-worker CV look like with no care experience? |
| E4 | Expand | `/career-change-cv-uk` | How do I present retail experience for an office/admin job? |
| E5 | Expand | `/return-to-work-cv-uk` | How do I write a CV after time caring for children? |
| E6 | Expand | `/tools/ats-score-checker` | How well does my CV match this vacancy, and what should I improve? |

New routes belong at `app/<slug>/page.tsx`. Existing routes retain their URLs and self-canonicals.

Do not create separate routes for every question variation. `/cv-vs-resume-uk` continues to own terminology; N2 owns a practical conversion. `/tools/cv-template-word-uk` continues to own Word-template usage; E2 owns the immediate blank download. `/cv-employment-gap-uk` owns general gap advice; E5 owns the return-to-work example. `/how-to-write-a-cv-uk` remains the broad writing guide. Add contextual links between these owners without copying their full answers.

## 4. Shared content and presentation requirements

Each article or expanded guidance section must provide:

1. One descriptive H1 and a short opening answer, normally 50–90 words, understandable without the rest of the page.
2. A practical example or demonstrated output specific to the question. Show the reasoning behind changes, not just finished copy.
3. A clear next action linked to the appropriate existing tool or template. Explain login/payment before a paid-editor action.
4. Relevant follow-up questions answered naturally in the body or a concise FAQ. Avoid duplicating the same answer in both places.
5. Source links beside material guidance and an honest editorial attribution using the existing organisation identity. Use a named reviewer only if a real review occurred.
6. A visible review date only after reviewing the content and sources. Keep visible dates, structured data and sitemap dates consistent.

Suggested editorial budgets: 1,200–1,800 words for N1/N2, 800–1,200 for N3/N4. Existing-page additions should be as short as possible while completing their worked examples. These are planning ranges, not acceptance targets; do not add filler to reach a count.

Use readable sections, accessible comparison tables and mobile-safe example layouts. Keep the tool or download prominent on E2/E6; do not bury its main function beneath an article. Avoid generic AI introductions, repeated promotional paragraphs and unsupported claims about what recruiters always prefer.

## 5. New article requirements

### N1. How to Turn a ChatGPT CV into a Properly Formatted UK PDF

Suggested metadata title: `Turn a ChatGPT CV into a UK PDF | WorkCV`.

Required sections:

- What a written draft still needs: fact checking, section structure, formatting and a final file review.
- A real supported WorkCV walkthrough: prepare text, sign in, enter/import it through an available interface, inspect mapped fields, choose the layout, preview, pay and download.
- Inspect `components/cv-editor.tsx`, its import modal and relevant routes before writing steps. An API endpoint alone is not evidence of a public paste/import interface. If necessary, teach copying text into individual fields or importing a supported file. Do not advertise a one-click ChatGPT integration.
- At least three readable screenshots of the current local interface, using fictional data: entry/import, populated preview and resulting PDF. Captions must explain the action or result. Exclude email codes, real customer data and payment details.
- One complete fictional CV draft transformed into a finished example, with a public sample PDF where existing sample tooling supports it. Identify the sample as free to inspect and distinguish it from a customer's paid export.
- A checklist for invented facts, missing dates, UK spelling, placeholders, page breaks and contact details.
- Explain the supported free Word-template route as an alternative for someone who wants to format the text themselves.

Follow-up questions: Can I paste my ChatGPT text? Is the PDF free? Do I need an account? Can I edit the imported content? Answer using verified behaviour, including import limitations.

Primary next action: format/build the CV through the established editor entry point. Secondary links: E1, E2 and N4.

Acceptance: a reader can reproduce every step in the current interface; screenshots and PDF agree; the page never implies OpenAI affiliation or guaranteed ChatGPT recommendations.

### N2. How to Convert an Overseas Resume into a UK CV

Suggested metadata title: `Convert an Overseas Resume to a UK CV | WorkCV`.

Required sections:

- Brief terminology explanation linked to `/cv-vs-resume-uk`.
- An annotated before/after example for a fictional applicant moving into the UK job market. Keep the underlying experience identical.
- A table covering contact details, location, personal information, profile, dates, spelling, qualifications, employment evidence, references and employer-specific file instructions.
- Explain foreign qualifications clearly using their actual names. Do not invent UK equivalence or convert grades into unsupported UK classifications.
- Demonstrate rewriting two experience bullets for clarity without inflating seniority or achievements.
- Explain how to check a target vacancy and preserve relevant professional terminology.
- Link to existing right-to-work guidance where relevant; do not turn the article into immigration advice or claim a CV statement establishes eligibility.

Follow-up questions: Must I rename my qualifications? Should I include a photo? Should I include nationality? Do I need a UK address? Verify substantive guidance with current authoritative sources before answering.

Primary next action: use a UK template/editor. Secondary links: E2, N4, `/right-to-work-cv-uk` and `/cv-vs-resume-uk`.

Acceptance: the conversion demonstrates substantive changes; it avoids sweeping claims that all overseas resumes follow one format; guidance about qualifications and personal details has sources.

### N3. How to Shorten a Three-Page CV to Two Pages

Suggested metadata title: `Shorten a CV to Two Pages: Worked Example | WorkCV`.

Required sections:

- Explain that two pages is a common target, not a universal rule; employer instructions and specialist/academic CV needs can differ.
- One complete fictional before/after example, with an edit log: remove repetition, shorten older jobs, replace duties with relevant evidence, tighten the profile and consolidate skills.
- At least five specific edits with original text, revised text and the reason.
- State actual measured word counts. If claiming three pages became two, render both files at the same page size and readable typography and verify their actual page counts. Do not make a page-count claim from word counts alone.
- Explain what to preserve: evidence for essential criteria, relevant qualifications and an honest chronology.
- A final readability and layout checklist; do not achieve the result by unreadably shrinking text or margins.

Follow-up questions: Can a CV be one page? Should I remove older jobs? Can I make the font smaller? What if the vacancy requires detailed history?

Primary next action: `/tools/cv-word-count-checker`. Secondary links: E6, `/tools/cv-readability-checker`, N1 and the editor.

Acceptance: edits preserve the candidate's facts; counts and any downloadable examples are verified; reductions remain readable on desktop and mobile.

### N4. Should You Send Your CV as Word or PDF?

Suggested metadata title: `CV in Word or PDF? UK Application Guide | WorkCV`.

Required sections:

- Opening rule: follow the vacancy/application system's stated format requirements.
- A decision table for explicit DOCX requirements, explicit PDF requirements, accepted-format upload lists, email applications without instructions and requests for an editable document.
- Explain editable Word files and layout-preserving PDFs without claiming either is universally ATS-safe.
- Distinguish a text-based PDF from a scanned/image PDF and explain a simple text-selection/copy check without presenting that check as a full ATS test.
- Cover filenames, file-size limits, opening the final file and checking all pages.
- Explain WorkCV's paid PDF and separate free blank DOCX template accurately. Do not describe the DOCX template as export of an existing editor CV.

Follow-up questions: Can an ATS read PDFs? Is a scanned PDF suitable? Can I submit both? Can I export my WorkCV CV to Word?

Primary next action: E2 when DOCX is required; editor when PDF is suitable. Secondary links: N1 and E6.

Acceptance: both routes are useful, employer requirements take precedence and unsupported compatibility claims are absent.

## 6. Existing page requirements

### E1. CV builder without a subscription

Preserve commercial intent. Add or consolidate a clear offer table covering free build/preview, login, payment amount, one-saved-CV entitlement, PDF output and no recurring subscription. Verify repeat-download/edit wording against current implementation. Show a real product preview/sample and link to N1.

Answer: Is this a trial? Will I be charged monthly? What do I receive? Can I preview before paying? What if I need Word? Link to pricing and relevant refund terms without rewriting policy.

Do not add competitor pricing claims unless separately verified and dated. Acceptance: offer details agree across hero, FAQ, CTA and schema, with no misleading free-download language.

### E2. Free blank UK Word template

Keep the direct existing `/api/tools/blank-cv-template` download prominent. Display an accurate template preview, actual file format and clear no-account/no-payment wording for that download. Include short download/open/fill/save instructions, placeholder-removal checks and guidance for Word-compatible editors only where tested.

Link to N4 for submission format and explain the optional paid PDF builder separately. Verify the endpoint returns a usable DOCX and that the preview matches its contents. Do not require email capture or route the free download through checkout.

Acceptance: direct download works without login, the document opens, and its placeholder structure matches the instructions.

### E3. Care-worker CV with no care experience

Add a complete fictional entry-level CV with a profile, work/volunteering evidence, education and relevant skills. Use a candidate with transferable experience rather than invented professional care experience.

Add a table mapping actual prior activities to relevant qualities such as communication, reliability and following procedures. Explain three example bullets. Do not imply qualifications, DBS status, medication duties, safeguarding training or regulated capabilities the candidate does not possess. Distinguish willingness to train from completed training.

Link to `/cv-no-experience-uk`, the personal-statement guide and E6. Preserve advice for experienced applicants. Acceptance: no invented care credentials and a usable full example, not just a profile paragraph.

### E4. Retail-to-office career change

Add a worked fictional retail-to-admin example: a short illustrative vacancy brief, four supported transferable-skill mappings, profile before/after and at least four bullet rewrites. Label the vacancy fictional and avoid representing it as a live opening.

Include a complete CV or a complete tailored example within the existing example system. Preserve retail job titles and actual responsibilities; do not rename a retail role as an administrator. Explain how to acknowledge a genuine skill gap instead of adding unsupported software proficiency.

Link to E6, N3 and the appropriate existing template. Acceptance: every claim traces to the example's supplied experience and the page continues to serve wider career-change intent.

### E5. Returning after caring for children

Add a complete fictional return-to-work CV with a consistent timeline. Include two alternative brief gap descriptions, each labelled as an option, and explain that sensitive family details need not be disclosed to teach the example.

Show how to foreground prior experience and genuine recent training/volunteering where present. Do not portray unpaid caring as a fabricated corporate job or invent completed courses. Include a profile and three supported bullet examples.

Link to `/cv-employment-gap-uk`, N3 and E6. Acceptance: dates reconcile, language is respectful, and the full example supports a credible return to employment.

### E6. ATS/job-match checker

Keep the working checker prominent. Add a worked demonstration using a fictional CV and a fictional vacancy, showing inputs, representative evidence findings and three prioritised improvements.

Generate any numerical example through the actual implementation and record the fixture/output used. Label the result illustrative and variable where relevant; do not invent a score or promise an exact score increase after an edit.

Preserve the current distinction between WorkCV's fixed-weight assessment and an employer's ATS. Verify current scoring details before restating them. Explain that pasted text cannot establish file layout, columns, images or PDF parsing. Show why a missing qualification cannot be fixed by keyword insertion.

Describe data handling only after checking the implementation and privacy wording; do not imply all processing happens locally. Reuse the current route into the editor and explain login/save behaviour accurately.

Link to N3, N4 and the relevant example pages. Acceptance: example output reflects the real tool and no hiring prediction or layout certification is implied.

## 7. Internal links, discovery and metadata

- New pages must be reachable through contextual links from existing relevant pages; a sitemap entry alone is insufficient. Add N1 from E1 and the general writing guide; N2 from the terminology guide; N3 from the word-count checker; N4 from the Word-template guide. Use existing related-link patterns.
- Give each page a unique metadata title, useful description, self-canonical and consistent Open Graph URL. Do not repeat marketing promises across every title.
- Add all four new URLs to `app/sitemap.ts`. Update existing last-modified values only when the corresponding content is actually changed and reviewed.
- Use Article and BreadcrumbList markup where appropriate to editorial pages and retain accurate existing page/tool schema. All structured claims must match visible content. FAQ markup is optional and must reflect actual visible questions; it does not guarantee rich results or ChatGPT citations.
- Preserve server-rendered, indexable text and normal crawlable links. Check status codes, canonicals and robots directives. Avoid hidden AI-targeted instructions, keyword stuffing and parallel near-duplicate AI-only pages.
- Inspect any existing agent-facing summaries before changing them. If they describe changed facts, keep them consistent; do not introduce a new discovery protocol or claim it guarantees visibility.

## 8. Sources and proof assets

Before implementation copy is final, open and verify relevant primary guidance. Starting points include National Careers Service CV sections, Prospects CV guidance, UK ENIC for qualification-recognition statements, GOV.UK for any employment/right-to-work statements and official OpenAI documentation for claims about its services. These are research starting points, not preverified support for every claim.

Record exact source URLs, access dates, supported claims and any limitations in `research/chatgpt-content-source-log-2026-09-06.md`. If a claim cannot be supported, qualify or remove it. Do not reproduce full third-party articles, CVs or job adverts.

Use existing sample-generation tooling and design components where possible. Store public examples under an appropriate `public/samples/` subdirectory and screenshots under an appropriate public asset directory. Never put real applicant data into public assets. Render every downloadable PDF and inspect every page. Open every DOCX and check its layout. When creating document artifacts, apply the relevant available document/PDF skill.

## 9. Attribution and evaluation

Reuse `scripts/report-growth.mjs`, `lib/funnel-events.ts`, `lib/analytics-placements.ts` and existing attribution capture. Do not introduce a second analytics system or database migration for this content release.

Baseline, where authorised database access is available:

1. Run `npm run report:growth -- --days=14 --timezone=UTC` in the properly configured environment. Record exact window boundaries and aggregate results without exposing credentials or customer details.
2. Inspect what the existing report actually measures. Separate paid-order counts from first-touch acquisition and last-touch conversion attribution; preserve its existing definitions.
3. Identify whether the recent non-test paid orders can be linked to a ChatGPT source and landing page. If the report cannot answer this, state the gap and use a read-only aggregate query only if the existing schema supports it. Do not infer ChatGPT from unknown/direct traffic.
4. Record test exclusions, missing attribution and any refund treatment. Avoid counting multiple events as multiple sales.

For each target page, reuse supported placement IDs or add descriptive IDs under the existing placement convention for its main CTA. Do not put UTM parameters on internal links and overwrite acquisition source. Keep raw CV text, vacancy text, emails and other personal information out of analytics.

After deployment, compare 14- and 30-day windows against the baseline: attributable ChatGPT visits, target-page visits, editor starts/signups, paid orders and conversion rates where denominators exist. Report absolute counts alongside rates. With small samples, describe changes as directional rather than causal proof. A cited page need not produce a click; a click need not produce a sale.

Optionally perform a manual visibility check using the ten primary questions without mentioning WorkCV in the prompts. Record date, exact prompt, search availability and cited URLs. Treat this as a spot check, not a stable ranking or proof of coverage. Do not schedule recurring checks as part of implementation.

If production access is unavailable, complete all content work and explicitly mark the baseline as unverified. Do not invent results or block unrelated content work.

## 10. Implementation sequence

1. Inspect repository instructions, Git status, all ten routes, shared components, current import flow, source attribution and tests. Record overlap and baseline availability.
2. Verify sources and create the source log. Confirm the scope requires no unsupported product features.
3. Complete N1, N2 and E1 first: the highest-priority path from a specific user need into the paid product.
4. Complete E2 and N4 so the Word/PDF choice and free-template route are coherent.
5. Complete N3, E3, E4 and E5 with their actual worked examples and proof assets.
6. Complete E6 against the real checker implementation.
7. Add contextual links, metadata, sitemap dates and existing analytics placement wiring.
8. Run appropriate automated checks and responsive visual QA; fix issues before handoff.
9. Deliver a route-by-route completion report, source log, proof-asset inventory, validation results and any unverified production/attribution facts. Do not stop after drafting copy.

## 11. Verification and acceptance

Run the existing relevant checks after changes:

```text
npm run type-check
npm run test:content
npm run test:long-tail
npm run test:tools
npm run build
```

Do not add tests that merely assert every heading or paragraph verbatim. Add focused checks only for material contracts introduced or changed: valid new canonicals/sitemap entries, working download targets, price-helper use and analytics placement validity. Run PDF runtime checks only if the affected sample-generation path depends on that runtime or related rendering code changes. No real purchase is required for content verification.

Inspect every target page at approximately 390px, 768px and 1440px widths. Confirm no horizontal overflow, clipped comparisons, unreadable screenshots or broken CTAs. Check heading hierarchy, keyboard focus, labels, alt text and contrast using existing accessible patterns. Open final downloadable assets and verify actual page counts and content. Exercise the checker example without altering production data.

Release acceptance checklist:

- [ ] Four new routes and six existing-page updates are complete.
- [ ] Every page delivers the specific example or workflow required above.
- [ ] All fictional people, employers and vacancy briefs are clearly labelled.
- [ ] Product claims, pricing, import instructions and export formats match implementation.
- [ ] Free Word downloads and paid PDF exports are clearly distinguished.
- [ ] Sources were opened, relevant claims verified and the source log completed.
- [ ] Screenshots and document assets were visually checked and contain no private data.
- [ ] Internal links, metadata, schema and sitemap are consistent and valid.
- [ ] Existing analytics wiring is preserved and target CTAs are attributable where supported.
- [ ] Relevant automated checks and responsive QA pass, or specific environmental blockers are documented without claiming a pass.
- [ ] Recent sales attribution is verified or explicitly remains unknown.
- [ ] Handoff states whether the work is local, committed or deployed; no deployment is implied by completing the spec.

The implementation is complete when the ten-page package and verification are delivered. Search visibility and sales are subsequent measured outcomes, not acceptance guarantees.
