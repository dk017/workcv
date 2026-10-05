# Job Pass specification: additional research and verification
Checked 4 October 2026 · Scope: detailed page/tool requirements, following the two keyword research rounds.

## Method and limits

Read current product, pricing, handoff, generation, analytics, content and sitemap code. Reopened official competitor pricing, UK careers guidance, relevant competing articles, W3C form guidance and Google documentation. This is design research and code inspection, not a fresh keyword-volume purchase, a controlled Google UK ranking study, a live generation test or a completed checkout.

Historical search evidence remains in the linked research reports; it was not refreshed here. Search results returned irrelevant and non-UK sources as well as useful pages. In particular, an Australian recruiter survey was not used as UK prevalence evidence. Hays Australia's practical article is labelled as Australian and used only as qualitative context.

## Public sources and what changed in the specification

| Source | Observed information | Design consequence / limit |
|---|---|---|
| [National Careers Service: CV sections](https://nationalcareers.service.gov.uk/careers-advice/cv-sections) | Advises relevant content, clear sections and reverse-chronological employment with employer/title/dates. | Preserve chronology and actual titles while tailoring emphasis. Use as basic UK guidance, not proof of the commercial opportunity. |
| [National Careers Service: cover letters](https://nationalcareers.service.gov.uk/careers-advice/covering-letter) | Connect experience to a specific role, use factual support and check correspondence details. | Pair CVs with letters from the same fact bank; no invented employer research or recipient. |
| [Hays UK: common CV mistakes](https://www.hays.co.uk/career-advice/article/5-common-cv-mistakes) | Encourages role-relevant profiles and specific evidence. | Show visible profile/bullet decisions; do not copy a generic profile into every version. We do not adopt a blanket requirement for numerical achievements. |
| [Hays Australia: applying when overqualified](https://www.hays.com.au/career-advice/job-hunting/how-to-apply-for-a-role-you-are-overqualified-for) | Discusses motivation, relevant experience and possible employer concerns. | Include genuine motivation and practical scope; no diagnosis of an actual rejection. Australian source, not evidence of UK demand or law. |
| [CV Knowhow: multiple roles at one company](https://cvknowhow.co.uk/career-advice/how-to-format-your-resume-for-multiple-jobs-at-one-company) | Already contains several formatting scenarios, including different roles and leaving/returning. | The new page must go beyond formatting snippets: full UK application, unchanged-title example and usable timeline. No claim that existing results lack examples. |
| [CVCircuit: overqualified CV](https://cvcircuit.com/blog/how-to-write-a-cv-when-overqualified) | Detailed positioning advice and profile snippets; includes retitling advice. | WorkCV uses complete consistent CV/letter pairs and keeps actual historical titles. Do not adopt a suggested title change merely to conceal seniority. |
| [iCover: addressing overqualification](https://www.icover.org.uk/how-to-address-being-overqualified/) | Covers CV, letter and interview concerns. | Answer those related questions on one complete page. Salary acceptance and long-term intent are user facts, not default generated promises. |
| [MyPerfectCV official pricing](https://www.myperfectcv.co.uk/pricing) | Published UK trial £2.95, renewal £16.95 per four weeks; annual £59.40 upfront. | Centralised sourced pricing and fair duration comparison. Plain-text extraction includes unavailable free-tier features without their visual lock/cross indicators: recheck rendered feature matrix before publishing feature changes. |
| [LiveCareer official pricing](https://www.livecareer.co.uk/pricing) | Published trial £1.95, renewal £19.85 per four weeks. Annual card says £83.40 yearly, but a FAQ says that amount monthly. | Trial-path arithmetic is supported. Record annual inconsistency; do not use the contradictory FAQ to inflate a cost comparison. Recheck disputed annual billing before release. |
| [W3C WAI: form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) | Explains inline feedback, error summaries and clear success/error notification. | Worksheet and generator states need actionable errors, labelled controls and accessible feedback. This is not a completed accessibility audit. |
| [Google: helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Emphasises useful, original, reliable content with clear authorship. | Original complete examples and honest review/source notes; no manufactured authority or dozens of near-duplicate keyword pages. |
| [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Canonicals, redirects and sitemap signals influence preferred URL choice. | Preserve existing owners and consistent internal links. Canonical annotations are not ranking guarantees. |
| [Google: title links](https://developers.google.com/search/docs/appearance/title-link) | Descriptive page titles and visible headings help explain the page; Google may choose its own title link. | Proposed metadata is editorial copy, not a guarantee of the exact displayed search title. |
| [Google Search documentation updates](https://developers.google.com/search/updates) | June 15 entry confirms removal of FAQ rich-result documentation because the feature is no longer shown. The former FAQ documentation URL redirects here. | Keep useful FAQ content but do not plan around FAQ rich-result visibility. This updates older “government/health-only” advice. |

## Code findings that materially affect implementation

| Inspected files | Finding | Required response |
|---|---|---|
| lib/commerce.ts; lib/pass-rules.ts | £7.99 single, £24.99 Pass; 90-day window; old documents also covered; expiry does not relock covered documents. | Consistent honest offer copy; no “pay for every application” claim. |
| components/focused-alternative-page.tsx; app/myperfectcv-alternative-uk/page.tsx | Single-document language persists; C2 reads older competitorPricing while also importing newer competitorPlans. | Two-plan positioning and one source of brand pricing/date truth. |
| lib/competitor-plans.ts | Existing integer-money calculation counts charges strictly before duration end. | Reuse helper and boundary convention; do not build a standalone calculator page. |
| lib/job-application-pack.ts | Structured outputs with quality repair; numerical tokens checked against CV plus advert plus motivation. | Advert numbers must not be accepted as candidate achievement evidence. Add provenance checks and explicit user review. |
| Same module | Exact evidence excerpts checked, but requirement deduplication can reduce the output below the schema's pre-dedup minimum. | Handle insufficient unique criteria explicitly; do not fabricate replacement criteria. |
| API job-application-pack route and client | 35-second route limit, 36-second client timeout, 30-second SDK timeout plus retry and possible second generation. | One total deadline; bound repairs and SDK retries together. This is a potential failure path identified in code, not a measured production timeout rate. |
| Same route | 42,000-byte request cap; field limits count characters. | Client byte-size check and useful 413 recovery; no silent truncation. |
| components/job-application-pack.tsx | Clears result before regeneration; copy/handoff depend on generated result and source snapshot; generic paid promo centres £7.99. | Preserve last successful work, add reviewed-result state, contextual Pass option and correct handoff. |
| lib/cv-tool-handoff.ts | 30-minute session handoff with schema/size/time checks and protection against removing newer handoffs. | Reuse validated transfer; account for expiry and blocked browser storage. |
| lib/editor-data.ts; lib/cv-schema.ts | Experience is a flat list of dated role entries, no nested employer group. | Timeline exports individual roles with repeated employer where needed, avoiding an unnecessary model migration. |
| components/pass-offer-view.tsx | Offer visibility is already based on viewport proportion, duration and session deduplication. | Reuse genuine exposure logic rather than treating page load as offer view. |
| attribution-capture; funnel-events; editor-events; analytics-placements | Public metadata is allowlisted. | New dimensions/actions need coordinated client/server/report changes; no raw candidate content. |
| app/sitemap.ts; customer-content-review | Explicit route and review-date inventories. | Register new published articles and genuine review dates. |

The working tree changed during inspection because separate work is in progress. All production code was read only in this task. Re-inspect the current code at implementation time.

## Arithmetic independently checked

For days d greater than zero, start with trial entry charge and add renewals at day 14, 42 and 70 when each is strictly less than d.

| Days | LiveCareer pence | MyPerfectCV pence |
|---|---:|---:|
| 14 | 195 | 295 |
| 15 | 2180 | 1990 |
| 30 | 2180 | 1990 |
| 42 | 2180 | 1990 |
| 43 | 4165 | 3685 |
| 60 | 4165 | 3685 |
| 90 | 6150 | 5380 |

Single saved pairs: 3 × 799 = 2397 pence; 4 × 799 = 3196; 3196 − 2499 = 697. These are product-scope comparisons, not a claim that every application requires a separate purchase.

## Remaining release-time checks

- Actual rendered competitor feature inclusion and disputed annual billing.
- Latest source prices and supported WorkCV import formats.
- Authenticated handoff behaviour with current concurrent editor changes.
- Browser/mobile/accessibility behaviour after implementation.
- Real reference PDF/Word rendering if those optional assets are offered.
- Authoritative order attribution and operator/test exclusions.
- Current UK Search Console query/page data to decide expansion.

None of these limitations prevents writing the specification. They are explicit implementation or editorial release checks, not claims that this research already tested the finished product.
