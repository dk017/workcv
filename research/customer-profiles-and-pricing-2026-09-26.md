# WorkCV customer profiles and pricing evidence

Date: 26 September 2026. Purpose: decide how to raise revenue per customer towards £2,500/month using evidence rather than guesses. No customer interviews have happened yet; see "What we still don't know".

## Evidence used

Own data (exports supplied 26 September 2026):
- Google Search Console, 3 months: 96 clicks / 9,518 impressions. Top clicked pages: right-to-work CV (20), ATS checker (18), no-subscription builder (16). Largest-impression page: redundancy pay calculator (1,706). The redundancy calculator also received AI Mode follow-up queries such as "i'm 49", "age 58", "i am 62", "currently 65", "59 years". Clicks come from the UK (73), India (3), Germany, Italy, Nigeria, Pakistan, South Africa and Kenya.
- Bing AI Performance, 1,756 citations: free Word templates and tools ~50%, cancel-subscription pages ~21% ("cancel My Perfect CV subscription" 46.9% citation share), salary tool ~15%.
- Google AI Mode queries where WorkCV ranks 1–5: "best cv builder under £10 for uk university students", "cheapest premium cv builder that includes cover letters", "resume builder one time payment".
- Current sales: about 1–2 a week at £7.99.

External (reviewed 26 September 2026):
- MyPerfectCV Trustpilot (4.4/5, ~4,370 reviews), https://uk.trustpilot.com/review/myperfectcv.co.uk. Praise: ease, templates, speed, AI suggestions. Complaints: surprise renewal after a £1.95–£2.95 trial (e.g. £16.95 twelve days later), cancellation difficulty, "free" marketing.
- Competitor renewals recorded in `lib/competitor-pricing.ts`: £16.95–£19.95 every 4 weeks, £19.99/month.
- UK job search: average search 122 days; ~16 applications/week; ~27 applications per interview; 46% of UK job seekers use AI in their search; graduates apply to ~29 schemes (StandOut CV compilation, https://standout-cv.com/stats/job-search-statistics-uk). Average applications per vacancy 43 in Q2 2025; retail 132 (https://wave-rs.co.uk/resources/report/recruitment-trends-reports/q2-2025-recruitment-trends/). *These are commercial compilations of varying quality: use them as orders of magnitude, not precise facts.*
- Professional CV writing: roughly £50–£250 typical, £75–£150 entry level, £150–£400 mid-career (e.g. https://topcv.co.uk/career-advice/cv-writing-service-cost).
- Over-50s: 918,000 people aged 50 to state pension age struggling to find work at the end of 2025; twice as likely as younger colleagues to struggle after redundancy (Centre for Ageing Better, https://ageing-better.org.uk/redundancy-support-over-50s). A reported case of a 59-year-old: 8 interviews from 598 applications.
- Outplacement: roughly £450–£950+ per employee for basic programmes, and far more for executive ones (e.g. https://www.cvscreen.co.uk/outplacement/outplacement-cost/, https://www.modernhr.co.uk/blogs/news/how-much-does-redundancy-outplacement-cost).
- Skilled Worker visa, from 22 July 2025: RQF 6 (degree-level) threshold reinstated, general salary threshold £41,700, ~180 occupations removed (e.g. https://www.legal500.com/intelligence/united-kingdom/immigration/upcoming-changes-to-skilled-worker-sponsorship-rqf-level-6-threshold-reinstated-from-22-july-2025). Incumbent free directories: MyVisaJobs (127,688 sponsors, ~24,357 live sponsored roles, monetised through the Tarve job board), https://www.myvisajobs.co.uk/sponsors.
- Graduates: forums advise one master CV adapted per vacancy and a fresh cover letter per application; many schemes use application forms instead of CVs (The Student Room threads, https://www.thestudentroom.co.uk/showthread.php?t=4992950). Universities already license tools such as CareerSet for free student use (e.g. https://sheffield.ac.uk/careers/support/services/careerset).
- Returners: Mumsnet threads focus on explaining gaps without apologising, skills-based CVs and recent references (https://www.mumsnet.com/talk/work/1700019-Tips-on-CV-writing-after-a-career-break).

Limits: Reddit could not be read directly by the research tools, so community voice comes from Trustpilot, Mumsnet, The Student Room and news coverage. No WorkCV buyer has been interviewed.

## Individual customer profiles

### 1. The subscription escapee — highest intent, already reaching us
- **Situation:** paid £1.95–£2.95 for a trial with MyPerfectCV, Zety, LiveCareer and similar, then got charged £16.95–£19.95 or fears it. Searches for how to cancel, and whether the product is free or how much it costs.
- **Evidence:** cancel pages are ~21% of Bing AI citations; the most common Trustpilot complaint is surprise renewal; Google queries such as "zety cancel subscription" and "my perfect cv price".
- **What they want:** get the CV they already wrote out of the other builder; finish today; own the file in Word and PDF; never face another charge; plain pricing up front.
- **How they want it:** import the existing PDF/DOCX (already supported), a price stated once, no card before value, a receipt that says "no renewal".
- **Willingness to pay:** already paid once and feels cheated. A clear one-time £10–£25 is credible; anything resembling a trial is poison.
- **Offer fit:** CV tier. The Pass works if they're still applying.

### 2. The active applicant — the volume job seeker
- **Situation:** employed or recently unemployed, sending many applications a week over a search that averages about 4 months; is told to tailor every CV and letter.
- **Evidence:** ~16 applications/week, 122-day average search, ~27 applications per interview; 46% already use AI; the ATS checker is our #2 clicked page.
- **What they want:** a different CV and letter per job in minutes, not an hour; to know which version went where; confidence that each matches the advert.
- **How they want it:** paste a job advert and get a tailored copy of the master CV plus a letter, then download. No per-document payment friction.
- **Willingness to pay:** paying £7.99 per CV version is irrational for them, so they either keep one generic CV (worse outcomes) or subscribe elsewhere. A time-boxed unlimited pass matches how they work.
- **Offer fit:** Job Search Pass. This is the main lever for raising order value.

### 3. The redundant experienced worker (45–65) — highest individual value
- **Situation:** made redundant after a long tenure; hasn't written a CV in 10–20 years; received a redundancy payment; worried about age bias and gaps.
- **Evidence:** the redundancy calculator is our largest-impression page and draws age-specific AI Mode follow-ups; over-50s are twice as likely to struggle after redundancy; hundreds of applications for few interviews; outplacement costs employers £450–£950+ per person.
- **What they want:** a modern UK CV that doesn't date them (dates, length, focus on recent roles), a way to present a long history in two pages, cover letters for career moves, interview confidence, and reassurance. Probably values a human touch.
- **How they want it:** guided, calm and explained. Desktop more likely. Wants to see an example of someone like them.
- **Willingness to pay:** highest among individuals. The comparison points are a £75–£400 CV writer or £450+ outplacement, and they have a redundancy payment.
- **Offer fit:** top tier with specific redundancy and experienced-worker help, and the B2B route through employers (see B1).

### 4. The graduate or student — high volume, low budget
- **Situation:** applying to ~29 schemes; many use online forms; needs a master CV plus a fresh letter per application.
- **Evidence:** AI Mode query "best cv builder under £10 for uk university students" (WorkCV at position ~2.6); graduate queries at low positions; universities provide free tools.
- **What they want:** cheap, fast, credible; a strong first CV from little experience; letters per application.
- **Willingness to pay:** low (£5–£10). Free alternatives exist through their university.
- **Offer fit:** keep an entry tier under £10. A Pass could appeal around application season. Not a B2B target (universities already license tools).

### 5. The frontline or hourly worker (care, warehouse, driving, retail)
- **Situation:** applies through Indeed and employer forms on a phone; many applicants per vacancy (retail ~132).
- **Evidence:** our role-template pages (care worker, warehouse, driver, nurse) get impressions; mobile CTR is higher than desktop.
- **What they want:** a decent CV fast on a phone, often a first CV, sometimes in a second language.
- **Willingness to pay:** low; many are supported by employability programmes or charities.
- **Offer fit:** entry tier; the main route is B2B vouchers through the organisations that support them (B2).

### 6. The international or right-to-work applicant
- **Situation:** overseas or newly arrived; needs a UK-format CV; may need sponsorship.
- **Evidence:** the right-to-work CV page is our #1 clicked page; clicks from India, Nigeria, Pakistan, South Africa and Kenya; the resume-to-UK-CV converter exists. But since July 2025 most sub-degree roles are no longer sponsorable (RQF 6 and £41,700), and free sponsor directories already dominate.
- **What they want:** UK conventions, an honest answer on eligibility, and sponsor-verified vacancies. This group is heavily targeted by scams.
- **Willingness to pay:** medium to high, but trust-sensitive. There's an ethical risk in selling job-search products to people who cannot legally be sponsored for the roles they want.
- **Offer fit:** UK CV conversion within the standard tiers. **Don't lead with a visa job board**: the market is narrowed by the 2025 rules and crowded by free incumbents.

### 7. The free-template seeker
- **Situation:** wants a free cover letter or CV in Word.
- **Evidence:** ~50% of Bing AI citations (cover letter template Word 512, blank CV template 212).
- **What they want:** free Word files now.
- **Willingness to pay:** very low. Their value is awareness plus a small conversion rate to a CV + letter in the same design (Phase 2 handoff).
- **Offer fit:** stays free; bridge to the entry tier.

## Organisation profiles (B2B)

### B1. The employer making redundancies (SME owner or HR)
- **Situation:** has to make redundancies; wants to support leavers but can't justify £450–£950+ per person outplacement.
- **Evidence:** Search Console shows employer-side redundancy queries ("redundancy calculator for employers", "employer redundancy calculator"); outplacement pricing above.
- **What they want:** a credible, low-cost support pack they can hand to each leaver today, with no admin.
- **Offer:** a redundancy support pack for each employee: a Pass or Complete code plus the redundancy guides we already have. Something like £29–£39 per employee, bought once. The contrast with outplacement is 10–30×.
- **Reach:** the redundancy calculator page (largest impressions) plus the employer queries; HR communities.

### B2. Employability organisations, charities, job clubs and career coaches
- **Situation:** Restart Scheme delivery partners, local job clubs, refugee and returner charities, housing associations and independent career coaches help many people with CVs.
- **Evidence:** Restart providers advertise CV-building help (e.g. https://est-serco.com/support-for-individuals/restart-individuals/restart-scheme-in-wales/). Large providers likely have their own tools; smaller partners and charities are the realistic target.
- **What they want:** simple bulk access with no subscription and no per-seat admin.
- **Offer:** voucher packs, e.g. 25 CVs for £99 or 100 for £299, never expiring.
- **Caveat:** each deal needs outreach. The software is the easy part.

## What this means for pricing (proposal to test, not a conclusion)

| Tier | Price | Built for | Why this price |
|---|---|---|---|
| CV | £9.99 | Escapees, graduates, frontline, free-seekers | Keeps the "under £10" position that AI answers already cite |
| Job Search Pass (90 days, never renews) | £24.99 | Active applicants, escapees still applying | Matches a ~4-month search and tailoring every application. Competitors charge £16.95–£19.95 every 4 weeks (£50–£60 over the same period) |
| Complete / Career Restart | £44.99–£49 | Redundant experienced workers, career changers | Anchored against £75–£400 CV writers and £450+ outplacement. **Only worth it if it contains genuinely new help**: experienced-CV condensing, gap and age-proofing guidance, LinkedIn text, interview prep for a vacancy |
| Redundancy pack (B2B) | £29–£39 per employee | SME employers | 10–30× cheaper than outplacement |
| Voucher packs (B2B) | e.g. £99/25, £299/100 | Employability organisations, charities, coaches | One-time, no seats |

Illustrative path to £2,500/month (assumptions, not forecasts): ~80 individual sales at an average of ~£21 (~£1,700) plus two or three B2B packs (~£600–£900).

## The job site (Roleward), in light of the profiles

- It fits profile 2 (active applicant) best: every job page can offer "Tailor your CV and letter for this job", which is the Pass's core use.
- A visa-sponsorship niche is **weaker than it looked** after the July 2025 rules and given free incumbents (MyVisaJobs, Tarve). Treat sponsor data as a filter, not the product.
- Keep job browsing and alerts free. The site's job is traffic and email capture for the Pass, not direct revenue.

## Measurement added 26 September 2026 (local, not deployed)

- **Optional post-download question** (`components/editor/purpose-survey.tsx`), shown once per saved CV after its first successful download. It asks what the CV is for (8 fixed choices matching the profiles above), then how many jobs they'll apply to (1–2 / 3–10 / more than 10, the Pass signal). Events: `cv_purpose_selected`, `cv_application_volume_selected`, `cv_purpose_dismissed`. The ingest route stores only a fixed-choice value (`surveyEventMetadata` in `lib/editor-events.ts`) and rejects anything else.
- **Redundancy calculator:** the sticky "Update my CV" button was an untracked link; it now records `marketing_cta_clicked` with placement `redundancy_calculator_sticky`.
- **Private growth report:** new sections "What buyers say the CV is for" and "CTA clicks by placement" (`scripts/production-growth-snapshot.mjs`, `scripts/production-growth-dashboard.mjs`).
- **Blocker:** `npm run report:growth:production` only runs from a pushed commit that contains the reporting scripts. Those scripts and workflow changes are still uncommitted.

## What we still don't know — and how to find out cheaply

1. **Who actually buys today.** Run `npm run report:growth:production` for source, landing page and device of paid orders.
2. **Why they bought.** Add a one-question post-download prompt: "What are you using this CV for?" (new job / redundancy / first job / leaving another builder / moving to the UK / other). Optional, no personal data.
3. **Whether the redundancy group converts.** Add a tracked "Update your CV after redundancy" CTA on the redundancy calculator and watch its clicks and purchases.
4. **Willingness to pay for the Pass.** Launch tiers and measure the tier mix over 4 weeks before building the Complete tier's extra features.
5. **B2B demand.** Five conversations with SME HR contacts or local employability organisations before building anything beyond voucher codes.
6. Interview 3–5 recent buyers (with consent) using the prompts in `docs/GROWTH_NEXT_ACTIONS_2026-09-24.md`.
