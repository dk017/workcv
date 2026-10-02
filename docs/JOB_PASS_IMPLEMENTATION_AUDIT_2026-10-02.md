# Job Search Pass implementation and audit

Date: 2 October 2026. Scope: implement the current priorities from the Job Pass content plan, with review checkpoints. No price change, new paid plan, outreach or bulk article publication.

## 1. Pricing and selected plan

Completed: two clear choices near the top, phone jump links showing both prices, precise saved-document scope, expiry rules, four-separately-purchased-CVs comparison, and a short product workflow. Restored the existing sample CV proof and free-resource links after regression checks caught their omission. Removed the broad subscription-cost claim and stale multi-provider table. Kept one named, dated comparison checked against https://www.myperfectcv.co.uk/pricing on 2 October.

Audit: compared wording with commerce and pass unlock rules. The Pass link retains `/editor?plan=pass` through the sign-in destination; single-CV choice uses `plan=cv`. Explicit choice wins over remembered choice even with blocked storage. Checkout plan changes update remembered intent. Regression test covers Pass, single-CV override, invalid values, remembered intent and unavailable storage. Browser clicked Pass and reached the expected login URL. No email code was sent and no authenticated checkout or payment was performed.

## 2. Measurement and reporting

Completed: public price-block exposure after at least 50% visibility for one continuous second in a foreground tab, once per session/page/placement/version. Sanitizer accepts only the fixed offer version and a bounded placement, on public paths. Shared offers, pricing and the contextual tracker prompt use it. Existing editor events now appear in the encrypted aggregate report, including plan selection, payment starts/failures/cancellation, Pass/upgrade offers and editor arrival. Added actual route views, page-level clicks, Pass price groups and refund flags.

Audit: ingestion/privacy and encrypted-report tests passed. No CV text, advert, employer, email or customer identifier is added to reporting. A discounted order is labelled discounted, not asserted to be an upgrade. Non-GBP orders are not compared with a GBP amount. Refund flags do not measure partial refunds or net receipts; the dashboard states these limits. Historical absent exposure is not described as zero views. Production query execution passed; both reporting windows contain all five new report arrays. See release verification below.

## 3. Tailoring guide

Completed: `/tailor-cv-to-job-description-uk`, with one original fictional applicant, fixed evidence, two original vacancy briefs, two CV versions and matching letters, profile before/after, bullet ordering, missing-requirement discussion, version naming and a final checklist. Links lead to the application-pack tool, ATS checker, tracker, role packs and pricing. Added metadata, Article schema, sitemap and breadcrumb. Career method sources: National Careers Service and JobHelp, read on 2 October.

Audit: manually compared the applicant's employers, dates, education, duties and tools across both examples. No unsupported numerical achievements, CRM or advanced Excel claims. Letters acknowledge missing experience. Content is read-only and cannot populate a user's draft. Phone-width browser review passed for the guide opening. No fabricated screenshot or recruiter endorsement. Actual duplication instructions were checked against the editor's button label; a signed-in screenshot was not available.

## 4. Tracker and ATS journey

Completed: free online and Excel choices near the top, a fictional spreadsheet-style preview, saved-job-to-application walkthrough and contextual guide/pack links. ATS results and related links lead to the worked guide. Preserved existing upload, scoring and handoff logic.

Audit found and fixed: loading three demo jobs previously counted toward real-use milestones and the contextual Pass prompt. Demo rows now carry a persisted flag, retained through CSV backup/import, and use a separate demo CTA placement. Returning use has a separate placement from first-job activity; real-data CSV export is reported. No tracked job details are sent as metadata. Browser loaded three demos and showed the fictional-practice notice without the contextual Pass prompt. Historical demo events and old unflagged saved examples cannot be reliably reclassified. Existing tracker import/export, formula safety and job handoff tests passed.

## 5. Retail pack checkpoint

Completed: original first-paid-job CV and matching letter for Alex Morgan, with education, school sale volunteering and a group project. Existing experienced sample and own-facts form remain. Added example-choice navigation and supermarket/stock versus product-advice guidance.

Audit: matched education and volunteering dates across the pair; no paid work, till operation or sales numbers invented. First-job section cannot prefill personal facts. Existing pack handoff tests passed; phone-width screenshot showed readable stacked content and no clipping.

## 6. Warehouse pack checkpoint

Completed after the retail checkpoint: original first-paid-job CV and matching letter for Jordan Evans, using a community food collection and school project. Added experience-level navigation and picking/packing versus goods-in guidance.

Audit: matched dates and responsibilities; equipment gaps are explicit; no forklift licence, warehouse system or productivity figure invented. Physical duties and availability remain applicant-specific. Existing handoff tests passed; phone-width screenshot showed readable first-job content.

## 7. Customer-service pack checkpoint

Completed: separate contact-centre and shop-floor evidence guidance; links to the worked guide and tracker; clear single-pair versus separate-version explanation.

Audit: channel and CRM claims are conditional on real use. No change to the existing matched pair's applicant facts or form transfer. Customer-service pack tests passed.

## 8. Care-worker pack checkpoint

Completed: residential versus first-care/home-care application guidance with setting-specific examples and links.

Audit: community or family support is not presented as clinical training; no invented medication, handling or safeguarding qualification. Travel and availability remain factual. Existing care pair and handoff tests passed.

## 9. Student pack checkpoint

Completed: contrast customer-facing and office/project-support evidence from the same education history. Connected the guide, tracker and plan comparison.

Audit: class projects are not presented as employment, qualification dates remain accurate, and the single-CV option remains clear. Existing education-first form and handoff tests passed.

## 10. Cover-letter hub and distribution

Completed: preserved all 13 samples and jump navigation, added links to applicable complete role packs, a second-employer worked explanation and contextual plan comparison. Fixed the warehouse-operative slug mapping. Added incoming links from CV writing and examples hubs. No duplicate role-letter URLs.

Audit: samples remain explicitly fictional, with consistent sign-offs and complete letters. Pack links say they are role examples, not the identical applicant from the hub. Cover-letter and link-cluster regression tests passed.

## 11. Redundancy and commercial journey

Completed: example weekly routine connecting the existing checklist to tracker, tailoring and role examples. Added a saved-version comparison to the no-subscription page. Existing urgent legal/financial guidance remains first and unchanged.

Audit: no required application quota, benefit eligibility promise or legal outcome added. No outreach sent. Money-page links explain their destination and preserve useful direct editor/tool routes.

## Verification

- Full test suite: 296 passed, 0 failed after review fixes.
- Source-only TypeScript check passed. Final clean Linux production build, lint/type validation and Docker PDF runtime smoke check also passed.
- Browser: pricing at desktop width; guide, retail and warehouse at 390px; Pass link to sign-in; tracker demo behaviour.
- Local HTTP audit: 14 changed pages returned 200, each with one H1, the expected canonical and no noindex. New guide is in the sitemap. Seven referenced downloads returned 200.
- Production build and deployment succeeded for commit `f2dc87f`: https://github.com/dk017/workcv/actions/runs/37043041328.
- Live HTTP audit on 2 October: all 14 changed pages passed status, single-H1, canonical and indexability checks; seven downloads returned nonempty files; the new guide appears in the sitemap. Updated pricing and both first-job examples were present.
- Live browser: the Job Search Pass button reached `/login?next=%2Feditor%3Fplan%3Dpass`; sign-in rendered correctly. Temporary viewport override was reset.
- Read-only encrypted production report succeeded at 17:50 UTC: https://github.com/dk017/workcv/actions/runs/37043441200. Both 7-day and 30-day windows contain page views, offer exposures, page CTA clicks, plan events and Pass order breakdowns. Ingestion is enabled. Private data remains in the ignored local report directory; no customer data or credentials were published. This verifies query execution and report structure, not a completed customer purchase or every browser event end to end.
- IndexNow accepted all 14 changed URLs. Acceptance does not guarantee crawling, indexing or ranking.
- No real purchase, authenticated checkout, discounted-upgrade transaction or fresh Search Console export was performed.

## Deliberately deferred

Admin/receptionist packs, price cuts, paid acquisition and upgrade-credit advertising await evidence or production verification as specified in the plan. No conversion or ranking uplift is claimed from a same-day release. Review qualified offer exposure and plan-specific payment activity after an observation period; new measurement cannot reconstruct older exposure.
