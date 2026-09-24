# Customer question implementation QA

Review date: 24 September 2026. Current status: implementation and production release verified. Release commit: `297f042a48c26ea8b89b72a7edfe7ead0026a1f9`; [GitHub Actions run #80](https://github.com/dk017/workcv/actions/runs/36002031943) completed successfully.

## Scope and preservation

- 24 question owners on 15 primary routes, plus two supporting content routes; privacy clarification is separate.
- Existing free DOCX endpoint, paid PDF entitlement, AI/scorer logic and job-board links have not been changed for this content task.
- Existing workspace changes outside this work are retained and will not be staged or removed as part of this task.

## Verification record

These are actual local results. “Not run” is not a pass.

| Check | Result | Evidence or limitation |
|---|---|---|
| Type check | Pass | `npm run type-check` |
| Content and long-tail tests | Pass | `npm run test:content` (7), `npm run test:long-tail` (6) |
| ATS and all tool tests | Pass | `npm run test:ats` (5), `npm run test:tools` (198, including four new customer-question tests) |
| Production build | Pass | `npm run build`; local compiled site served on port 3100 for browser checks |
| Existing browser guide checks | Pass | `node scripts/verify-content-guides.mjs` reported 30 responsive checks; no `--assets` flag |
| New 17-route browser and DOCX checks | Pass | `node --no-warnings --experimental-strip-types scripts/verify-customer-questions.mjs`: 18 pages including privacy × 390/768/1440px = 54 page-width checks, 24 answer anchors, eight tracked-link clicks and payloads, direct free DOCX, ATS result, application-pack generate/handoff and first-job generate/copy/handoff checked. Zero reported errors. See `tmp/customer-questions-qa/results.json` and screenshots. |
| Mocked ATS client result | Pass | Same browser script used a deterministic injected result: score-adjacent disclaimer and missing Sage evidence were visible. Not a live OpenAI call or employer ATS test. |
| Complete application-pack and first-job handoff payloads | Pass | Deep comparison covers the entire stored envelope and expected patch, rejects extra fields, checks version/source/fresh timestamp, and validates generated entry IDs. Pack: name, target role, profile, supported skills, advert, and every priority's category/title/action. First job: name, role, edited profile/skills, all experience and education fields; clipboard text must exactly match the edited draft after Windows line-ending normalisation. The destination editor is intercepted: this verifies outgoing handoff data and navigation, not authenticated editor consumption or saving. Pack responses are mocked; no paid provider call was made. |
| Acquisition source survives tracked clicks | Pass | Seeded distinct Google first-touch and Perplexity last-touch fixtures once per browser context. All eight links preserve both complete local-storage records before/after clicks and emit the expected last-touch source, medium, campaign and referrer, plus the correct destination/placement exactly once. These are synthetic test sources, not measured traffic. |
| Sitemap and robots on compiled local site | Pass | `/sitemap.xml` and `/robots.txt` returned 200; sitemap included reviewed dates and the job-board URL; robots linked the sitemap. |
| Manual example/price/privacy review | Pass within local scope | Compared rendered answer sections, examples, CTAs, price and privacy copy with the spec. Inspected mobile screenshots for money, pricing, ATS, first CV, contact and job boards; fixed the narrow job-board comparison to use cards. Automated browser checks covered all routes. |
| Real iPhone/iPad download | Not available in local automated checks | Browser viewport evidence must not be called a physical-device test |
| Live paid checkout and provider calls | Not part of local QA | Do not make a real charge or paid AI call for static content checks |
| Search Console baseline | Unavailable in this environment | No connected Search Console export or read-only access was available; no impressions or clicks are recorded as zero. |
| Growth-report baseline | Unavailable in this environment | `DATABASE_URL` was absent, so the existing database-backed report was not run. No sales, revenue or attribution values are invented. |
| Production health after deployment | Pass | New content pages, sitemap, robots, PDF worker, sample PDF, free DOCX, privacy, corrected job-board page and money page returned expected statuses/types; test-only editor route returned 404. See the release URL record. |

## Human acceptance checklist

The follow-up verifier run on 23 September 2026 passed all 54 page-width checks and ten explicit interaction checks (eight attribution-preserving clicks and two complete handoffs). Browser QA used a build with `NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED=true`, matching the production workflow. Analytics requests were intercepted, and editor navigation was fulfilled with a local test destination. Browser screenshots and detailed run output remained local QA artifacts and were not packaged with the release.

- [x] Every one of Q01–Q24 answers its visitor's question before a commercial pitch.
- [x] Paid and free options are clearly separate and consistently priced.
- [x] A paid customer is directed to the original saved document and support, never to another payment as troubleshooting.
- [x] Alex, Sam and Jordan examples remain fictional, distinct and internally consistent.
- [x] Sage remains not evidenced; no fabricated KPI, qualification, ATS result or interview guarantee appears.
- [x] ChatGPT file import and manual field entry are distinguished; real proof/sample assets remain accessible.
- [x] The checker discloses the processing path before submission and distinguishes its score from an employer's.
- [x] Job-board links go to real services; the graduate shortlist helps choose and verify a vacancy.
- [x] Mobile sections and comparison tables are readable at 390, 768 and 1440 pixels in the browser viewport checks.
- [x] The money-page CTA follows useful guidance; free download and support journeys are not obstructed.
- [x] Visible review date, Article date and sitemap date agree only on pages actually reviewed.
- [x] No duplicate FAQ claims conflict with visible sections; FAQ schema agrees with rendered FAQ answers.

## Baseline and source verification

Official pages checked 23 September 2026: Prospects graduate search, Gradcracker, GOV.UK Find a job and Greenhouse parsing guidance. Prospects' interactive search requires JavaScript. This check confirms the official starting links and their stated scope, not any live vacancy count or application outcome.

Production analytics and Search Console baselines were unavailable in this environment. Capture dated aggregate exports before or immediately after release if access is provided, with the limitation that a post-release export is not a true pre-release snapshot. Keep CV content and customer details out of this document. Physical-device download, live checkout, live provider response and production smoke remain unverified; they are separate release checks, not local passes.
