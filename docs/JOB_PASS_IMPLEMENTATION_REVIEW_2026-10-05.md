# Job Pass implementation and SEO/AEO review
5 October 2026 · Deployed and live

## Completed items and review decisions

### C1: LiveCareer alternative
Implemented two-plan positioning, optional needs chooser, sourced feature/billing comparison, 30/60/90-day trial-path calculator, switching guidance, clear FAQs and plan-preserving login links.
SEO/AEO review: keeps the existing canonical URL; answers the alternative/pricing question immediately; shows when the competitor costs less; separates provider facts from WorkCV opinion. Removed a duplicate breadcrumb after browser review. The disputed annual total is not promoted. Official pricing was reopened during implementation.

### C2: MyPerfectCV alternative
Uses the same tested comparison mechanics with brand-specific introduction, suitability guidance and data from competitor-plans. The old July pricing module is no longer used by this page.
SEO/AEO review: free building versus paid file formats is explained, the two WorkCV scopes appear early, recurring billing is described as four weeks, and questions have direct answers. Retains its existing canonical owner.

### L1: CV after long service
Added /cv-after-long-service-uk with complete fictional CV/letter, unchanged-title CV, chronological formatting scenarios, evidence mapping, second-vacancy changes and local-only timeline worksheet.
SEO/AEO review: distinct intent from generic CV length/career-change pages; full examples are server-rendered; both promotions and unchanged titles are answered; actual titles and date precision are preserved. Internal links, Article/BreadcrumbList, source links and sitemap entry included.

### O1: Overqualified CV
Added /overqualified-cv-example-uk with two complete CV/letter applications from the same factual candidate, comparison table, motivation guidance and local-only evidence selector.
SEO/AEO review: no inference that a rejection was caused by overqualification; no advice to falsify titles or invent salary acceptance; degree and chronology remain consistent. Full examples and question answers are readable without using the worksheet. Separate canonical and sitemap entry included.

### Supporting journey
- Added contextual links from the main CV guide, career-change guide, returner guide, redundancy page and cover-letter hub.
- Added evidence-bank download, a checked prompt and an explicit rejected suggestion to the existing tailoring guide.
- Added filename/version examples to the existing tracker and a truthful distinction between three tracked applications and purchase savings.
- Renamed the existing application-pack card to CV & Cover Letter Tailoring, keeping its URL.
- Updated shared guide footer to explain both plans and PDF/Word access.
- Added new articles to the existing application analytics cluster.
- Strengthened handoff size checks to reject oversized source text rather than silently truncate it.
- Worksheet events reuse existing allowed public tool lifecycle/CTA/exposure events; no candidate text is sent in event metadata.

## Verification performed

- Type checking passed.
- Production build passed and generated the new article routes.
- Full unit suite: 372 tests; 371 passed, 1 pre-existing database integration test skipped, 0 failures.
- New worksheet tests cover date precision, separate employment periods, invalid dates/IDs, uncertain evidence, original versus reviewed wording, invalid requirement mapping and aggregate size rejection.
- Existing handoff tests passed.
- Browser regression script: scripts/verify-job-pass-pages.mjs.
- Four routes returned 200, one H1, expected canonical, description and visible Pass price.
- All four fit a 320px viewport; desktop/mobile screenshots saved.
- 30-day comparison shows the lower competitor trial cost honestly.
- Pass selection appears in the safely encoded login destination.
- Timeline preserves year-only dates, blocks stale-result handoff and transfers the reviewed target/title.
- Evidence selector keeps original notes separate and transfers chosen bullets without inventing employment records.
- Browser tests reported no uncaught page errors.
- Existing tests that assumed exactly 18 reviewed pages and the old tool-card title were updated to assert the new reviewed routes and label.

Evidence: tmp/job-pass-review/checks.json and the screenshots beside/in that directory. Browser tests mock API endpoints and intercept editor navigation; they do not prove a real email-login, payment or production database save. No live AI request or purchase was made.

## T1: tailoring tool and letter handoff completed

The user authorised reuse of the existing API key. Existing environment configuration is reused; no key was printed or changed, and no live generation request was made.

- Kept the existing tool URL and canonical owner, with the new CV/letter tailoring title, H1 and search description.
- Added a full server-rendered fictional CV, advert, evidence review, profile, five selected bullets and matching letter. The example makes the unsupported appointment requirement explicit.
- Updated visible FAQs and matching structured data to distinguish free draft text from paid personalised PDF/Word exports, account saving, separate versions and Pass expiry.
- Evidence comes first, followed by editable profile, bullets and four letter paragraphs. Keyword review follows the primary outputs. Interview and post-interview material starts collapsed.
- Original generation is retained separately from reviewed wording. Section resets, individual bullet copy, section copy and labelled copy-all use the right version. Edited content is marked as not rechecked by generation.
- Changed inputs show a stale-result notice; handoff uses the source snapshot belonging to the result. Failed regeneration retains the successful draft and user edits.
- Added trimmed input checks, aggregate UTF-8 byte validation, server-derived cooldown, manual-copy fallback and discard confirmation. A failed storage write or invalid/oversized transfer preserves the page and draft.
- Provider calls share a 28-second deadline, with SDK automatic retries disabled and at most one quality repair within that same deadline. Sanitised logs omit provider message text.
- Added internal section-specific candidate-source quotations, exact quote-existence checks and numerical support checks against the cited candidate evidence. Advert-only metrics cannot pass as candidate achievements. Duplicate requirements trigger repair; an unresolved shortage asks for a fuller advert.
- Neutral and Pass actions preserve reviewed profile, bullets, original CV, letter paragraphs, source advert and notes. Bullets still need assignment to the correct employment role in the editor.
- Cover-letter generator offers a separate Pass action carrying its current letter paragraphs and original input context. Failed regeneration also retains its previous letter.
- Exposure and CTA events use fixed placement names and the existing safe measurement contract.

SEO/AEO review: the task answer and form appear before the long example; the public page promises reviewable wording rather than an automatic full CV rewrite. Free/paid boundaries and both plan scopes are explicit. Keyword coverage is labelled as text overlap, not an employer ATS score. Original titles, dates and qualifications remain source facts; gaps are review prompts. The tool, supporting guide and ATS checker retain distinct purposes and existing canonical URLs.

### Final additional verification

- Final production build passed after all T1 and letter changes, including compilation and type validation.
- Working-tree diff whitespace check passed.
- Full unit suite: 380 tests, 379 passed, one pre-existing database integration test skipped, zero failures.
- Nine application-pack tests cover optional input, neutral employer fallback, valid result formatting, advert-only metrics, numbers unrelated to a cited excerpt, fabricated quotations, duplicate-requirement repair, requirement downgrade and total-deadline cancellation.
- Browser script: scripts/verify-job-pass-tailoring.mjs, using mocked APIs throughout.
- Verified editable copy/reset, source-snapshot preservation, failed regeneration, Retry-After cooldown, Unicode byte-limit rejection without sending or truncating input, manual-copy fallback and blocked-storage recovery.
- Verified Pass handoff retains reviewed profile/bullets/letter and original CV; letter-generator Pass handoff retains its paragraphs.
- Tailoring page passes canonical/H1/static-example checks and 320px overflow check. Mobile result screenshot inspected. No uncaught browser errors.
- Evidence: tmp/job-pass-review/tailoring-checks.json and tailoring-mobile.png.
- Existing regression assertion updated to recognise the draft-preserving editor/Pass handoff instead of requiring a generic money-page link in the result component.

Source quotes and numerical checks do not establish semantic truth. Unsupported non-numerical claims can still escape automated checks; the UI requires human review and makes no accuracy guarantee. Fixture tests do not measure live model quality or latency, real email-login, production persistence or payment. Those release checks remain separate from this local implementation. No ranking, sales or indexing outcome has yet been measured.

## Deliberate scope decisions

- Deferred keyword clusters in the specification remain deferred; no admin/receptionist doorway pages, second ATS checker, second tracker or separate master-CV tool were added.
- No new AI service for the worksheets: they organise user-entered facts locally.
- The evidence selector hands reviewed bullets and original notes to the existing application-pack review area rather than importing a mixture of selected and excluded text as employment history. This avoids turning master-only notes into CV claims.
- The comparison demonstrates version workflow in text and links to the existing worked guide. No fabricated editor screenshot or unsupported feature claim was added.
- Optional reference PDF/Word downloads were not added. Full examples are HTML, with free text worksheet downloads. Personalised export entitlements are unchanged.
- Deployment was subsequently authorised and completed as recorded below. No real payment or provider-account changes were performed.
- Pre-existing editor, purpose-survey and production-report work was preserved.


## Production release — 5 October 2026

- Release commit: `59db89e34d6050438c4d0647c08bba78ecf04df5`.
- Successful build and deployment: https://github.com/dk017/workcv/actions/runs/37277884513.
- Production health passed after the container restart at approximately 13:01 IST.
- Live checks passed on both alternative pages, both new career articles, tailoring tool, letter generator, tailoring guide and tracker: HTTP 200, single H1, canonical and indexability.
- Both new articles appear in the production sitemap. The evidence-bank text download returns 200.
- Unauthenticated editor redirect retains `plan=pass` and `from=career-tool` through the login return URL.
- Cleanup deleted unused prior WorkCV image `sha-c78a0e6e52abb53d4f80bc22197f039f1c3f5c6f` and its unshared layers; active image `sha-59db89e34d6050438c4d0647c08bba78ecf04df5` remained. Cleanup was scoped to WorkCV images on the deployment host, not other repositories, volumes or container data. Registry images remain available for rollback.
- Separate uncommitted editor-survey and production-report work was excluded from this release.
- No live AI generation, email code, purchase or customer-data mutation was part of the smoke checks.
- IndexNow accepted all 14 submitted new/updated public URLs; acceptance does not guarantee indexing or rankings.
