# WerkCV UK Conversion Spec

Research date: June 11, 2026

Status: validated planning spec for UK launch

This document combines:

- UK_CV_SPEC.md
- UK_CV_SPEC_ADDENDUM.md
- current WerkCV product and SEO evidence from the repo
- current UK CV standards and competitor pricing from official public sources

This is a conversion-first spec for a UK launch. It is not a broad feature wishlist. Every recommendation below is either validated from a current source or explicitly marked as an internal hypothesis that still needs measurement.

## Confirmed Launch Decisions

- Public domain: `workcv.co.uk`
- Launch path: separate domain
- Editor access: login required when the user enters the editor
- UK price: `GBP 4.99`

## Validation Standard

Rules for this spec:

- No unsupported social proof.
- No unsupported review claims.
- No claims about account-free use unless the product actually supports it.
- No UK CV advice that conflicts with current official guidance.
- No separate UK codebase for V1 unless there is a proven technical need.

## Executive Summary

The UK opportunity is real, but the gap is narrower than "people need a CV builder."

The real gap is:

- large incumbents sell broad subscription-driven career platforms
- many users only need one strong CV, fast
- official UK guidance explains what a CV should contain, but it does not provide a focused one-time commercial builder path
- the strongest purchase trigger is not "more templates" but "clear price, clear format, clear finish line"

WerkCV fits the UK market best as:

- a compact UK CV builder
- for people who want one good CV, not an ongoing platform
- with simple GBP pricing
- and no recurring billing logic

The first version should lead with:

1. transparent one-time pricing
2. UK-correct CV structure
3. fast completion
4. no-subscription positioning
5. targeted landing pages for early-career and comparison intent

## Current Market Facts

### 1. UK CV standards are straightforward and materially different from German-style CV norms

The current National Careers Service guidance says a CV should include:

- contact details
- an introduction
- education history
- work history
- references

It also says:

- do not include age
- do not include date of birth
- do not include marital status
- do not include nationality
- list work history with the most recent first
- if early in your career, education can come before work history
- references should usually be written as `references available on request` rather than listing someone else's contact details

Implication for product:

- UK defaults must not look continental
- no photo-first layout by default
- no DOB, nationality, or marital-status prompts
- education/work ordering should adapt to career stage

Primary source:

- National Careers Service, "How to write a CV", accessed June 11, 2026

### 2. The main UK commercial players still rely on trial-to-renewal or recurring billing

Validated public pricing as of June 11, 2026:

- MyPerfectCV:
  - free plan exists
  - premium 14 days is GBP 2.95
  - after 14 days it renews automatically for GBP 16.95 every 4 weeks
  - annual option is GBP 59.40 up front
- LiveCareer UK:
  - free basic plan exists
  - 14-day access is GBP 1.95
  - after 14 days it renews automatically for GBP 19.85 every 4 weeks
  - annual option is GBP 83.40 billed annually
- CVMaker UK:
  - free account exists
  - Pro is GBP 0.99 for 7 days
  - after the 7-day trial it renews at GBP 19.99 per month
- Resume.io:
  - the currently accessible public pricing page is international, not UK-localized
  - trial is USD 2.95 for 7 days
  - after 7 days it auto-renews to USD 29.95 billed every 4 weeks

Implication for positioning:

- the UK market does not need another "free to start" builder
- it does need a simpler commercial model
- WerkCV should compete on billing clarity and completion speed, not on being the only free-start product

### 3. Competitors are broad platforms, not narrow finish-the-CV products

Current public pages show that leading competitors bundle:

- CV builder
- cover letter builder
- large template libraries
- examples
- guides
- ATS content/checkers
- wider account-based career workflows

Implication:

- competing on breadth is a losing V1 strategy
- WerkCV should be deliberately smaller and clearer

## Internal WerkCV Evidence

These are internal observations, not market-wide facts.

### 1. Pricing and no-subscription messaging already exist as a core product strength

Current product truth in the repo:

- one-time payment messaging is already built into the editor and pricing flow
- the product explicitly says the same paid CV can later be reopened, edited, and downloaded again without paying again

### 2. Account-free messaging is not allowed in UK V1

Confirmed decision:

- editor access will require login when the user enters the editor

Implication:

- the UK site must not claim `no account needed`
- V1 copy should say `free to start` and `pay once when you download`

### 3. Cancel / alternative pages are a justified acquisition bet for WerkCV

Internal repo evidence says:

- competitor cancel pages already show acquisition potential in the NL strategy
- the SEO tracker explicitly notes that existing cancel pages already prove acquisition potential

Important nuance:

- that supports building UK comparison/cancel pages
- it does not mean every cancel page should be shipped before official-source verification of the current cancellation flow

## Market Gap

### Where the market is crowded

WerkCV should not try to win the UK market on:

- number of templates
- platform breadth
- generic "build a CV for free" language
- generic SaaS polish alone

### Where the market is still weak

The best gap is this user job:

`I need one strong UK CV quickly, I do not want a recurring subscription, and I want to know exactly what I will pay before I start.`

### Where WerkCV fits

WerkCV fits best for:

- school leavers
- students
- first-job applicants
- career switchers
- people updating one CV for a current application round
- people leaving a recurring CV-builder subscription
- users who care more about a finished PDF than about a long-running career platform

WerkCV is not the best fit for:

- users who want a broad ongoing account suite
- users who want dozens of premium templates and auxiliary tools more than pricing clarity
- users who expect a full career platform with job tracking, AI scoring, and extensive extras

## What Will Move The Trigger Fastest In V1

### Trigger 1: price clarity

This is the primary trigger.

Users should understand within seconds:

- free to build
- GBP 4.99 when downloading the PDF
- no subscription
- no automatic renewal

### Trigger 2: UK-correctness

Users need immediate proof that this is made for UK jobs:

- no photo-first assumptions
- no DOB prompt
- no nationality field
- UK spelling and examples
- contact/profile/work/education/references structure

### Trigger 3: narrow promise

The promise should be:

- finish one good CV fast

Not:

- manage your whole career platform

### Trigger 4: comparison intent

Comparison pages should make the cost difference legible, especially against:

- MyPerfectCV
- LiveCareer
- CVMaker UK

### Trigger 5: early-career examples

For initial SEO and conversion, early-career pages are better than broad enterprise-style role coverage.

Priority pages should target:

- no experience
- student
- school leaver
- 16-year-old / first CV

## Product Truth Constraints

### Must not claim in V1

- `No account needed`
- `Used by 10,000+ job seekers`
- `Thousands of Trustpilot complaints`
- `Works with Reed, Indeed, Totaljobs` unless tested and phrased carefully
- `Free Word download` unless those files actually exist and are maintained
- any aggregate rating unless there is a real visible review source

### Safe claims in V1

- `Build your CV free`
- `Pay GBP 4.99 when you download`
- `No subscription`
- `No automatic renewal`
- `Built for UK job applications`
- `Structured around current UK CV guidance`

## Recommended UK Positioning

### Core position

`A UK CV builder for people who want one strong CV without a subscription.`

### Value proposition

`Build free. Pay GBP 4.99 when you download. UK-ready structure. No recurring billing.`

### Message hierarchy

1. Finish your CV fast
2. Pay once
3. UK-correct format
4. Reopen and re-download the same paid CV later

### Anti-positioning

Do not position WerkCV as:

- the biggest template library
- the most feature-rich career platform
- the only free CV builder

## V1 Scope

### Technical approach

Use the existing Next.js app.

Do not create:

- /sites/werkcv-uk/
- a sibling UK app
- a parallel codebase

For V1, add:

- UK site config
- UK route layer
- UK content and metadata
- UK pricing constants
- UK editor copy defaults

### Design direction

Keep the strongest parts of the original UK spec:

- clean SaaS layout
- editorial headline font
- navy/gold palette
- strong comparison section
- single clear price tier

But V1 design must serve trust and clarity first, not visual novelty.

### Minimum shippable UK page set

#### Core conversion pages

1. /
2. /pricing
3. /cv-builder-uk
4. /cv-template-uk
5. /cv-builder-no-subscription

#### Early-career pages

6. /cv-with-no-experience-uk
7. /student-cv-template-uk
8. /school-leaver-cv-example

#### Comparison pages

9. /myperfectcv-alternative-uk
10. /livecareer-alternative-uk
11. /cvmaker-uk-alternative

### Gated pages that require fresh source validation before build

These are good opportunities, but do not ship them until the current official cancellation flow is rechecked on the competitor's own help/contact/terms pages:

- /cancel-myperfectcv-uk
- /cancel-livecareer-uk
- /cancel-cvmaker-uk
- /cancel-resume-io-uk

## Page Strategy

### Homepage

Job:

- establish trust
- explain the billing model
- show UK-correct structure
- route to editor or pricing

Required sections:

- hero
- pricing/trust badge row
- subscription-vs-one-time comparison
- how it works
- sample template preview
- FAQ
- final CTA

Homepage must not include unsupported claims about usage volume or ratings.

### Pricing page

This is the most important commercial explainer page.

It should:

- compare official public competitor pricing
- show trial-to-renewal math clearly
- explain what WerkCV includes
- answer direct price questions
- route into editor

### Comparison pages

These pages should follow the existing WerkCV comparison pattern:

- help the user understand who each product is for
- explain why WerkCV is better for a one-CV use case
- explicitly say when the competitor may be a better fit

### Early-career pages

These should be example-driven, not fluffy.

Each page should include:

- what UK employers expect
- what to include
- what not to include
- a copy-ready structure
- direct CTA into builder/template flow

## UK Content Rules

Every UK-facing template/example page must follow these rules unless new official evidence says otherwise.

### Include by default

- name
- phone number
- email address
- LinkedIn or similar work profile if relevant
- short profile/introduction
- education
- work history
- volunteering, work placements, or projects where useful
- references available on request

### Exclude by default

- age
- date of birth
- marital status
- nationality
- referee contact details on the page

### Ordering rules

- early career: introduction, education, work/placements/projects, skills
- experienced candidates: introduction, work history first, then education

### Writing rules

- concise bullet-led work history
- recent experience first
- tailor content to the target job
- plain, readable structure

## Measurement Plan

### Events that matter in UK V1

- landing page session
- click to editor
- click to pricing
- template preview
- checkout started
- checkout completed
- return download on same CV

### Primary V1 success signals

- homepage to editor click-through
- pricing page to editor click-through
- comparison page to pricing/editor click-through
- no-experience page to editor/templates click-through
- checkout completion rate

### What not to optimise for first

- raw traffic
- blog output volume
- template count

V1 is a trust and purchase-intent test, not a publishing race.

## Quality Bar

This launch should not ship with:

- generic AI copy
- unsupported trust claims
- UK pages that still sound Dutch or US-English
- role pages with duplicated copy
- cancellation pages based on stale competitor flows

This launch should ship with:

- factual pricing comparisons
- truthful product copy
- UK-consistent examples
- precise CTA hierarchy
- clear differences between WerkCV and larger subscription platforms

## Recommended Build Sequence

### Phase 1

- UK site config
- UK homepage
- UK pricing page
- UK editor copy/localization
- /cv-builder-uk
- /cv-template-uk
- /cv-builder-no-subscription

### Phase 2

- /cv-with-no-experience-uk
- /student-cv-template-uk
- /school-leaver-cv-example
- comparison pages

### Phase 3

- cancel pages after fresh official-source validation
- deeper role library
- broader SEO expansion

## Open Questions That Remain

1. Will UK V1 offer free example assets such as PDF or Word files?
2. Do we want to ship comparison pages first and delay cancel pages until every official cancel flow is revalidated?
3. What trust proof will UK V1 use if we avoid unsupported usage counts and rating claims?
4. Do we keep the first public wave tight at 8 to 11 pages, or do we expand the initial launch set?

## Source Log

External sources checked June 11, 2026:

- National Careers Service: https://nationalcareers.service.gov.uk/careers-advice/cv-sections
- MyPerfectCV pricing: https://www.myperfectcv.co.uk/pricing
- LiveCareer UK pricing: https://www.livecareer.co.uk/pricing
- CVMaker UK costs/help: https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk
- Resume.io pricing: https://resume.io/pricing
