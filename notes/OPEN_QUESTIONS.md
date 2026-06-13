# Open Questions

Last updated: June 11, 2026

This file tracks the unresolved decisions that still affect UK V1 scope, messaging, and implementation.

## Resolved decisions

- Brand/domain: `workcv.co.uk`
- Launch path: separate domain
- Editor access: login required when the user enters the editor
- UK price: `GBP 4.99`

## 1. Free example asset policy

Question:

- Will UK V1 offer free example downloads such as PDF or Word files?

Why this matters:

- we should not promise free downloads unless we are ready to maintain them
- this affects template pages, CTA structure, and content production workload

Current safe assumption:

- avoid promising free downloadable assets in V1 unless explicitly approved and resourced

Decision needed from:

- product / content

## 2. Comparison pages vs cancel pages sequencing

Question:

- Do we want to ship comparison pages first and delay cancel pages until every official cancel flow is revalidated?

Why this matters:

- comparison pages are lower-risk and easier to keep accurate
- cancel pages can convert well, but only if the cancellation flow is current and correct

Current recommendation:

- ship comparison pages first
- gate cancel pages behind fresh official-source validation

Decision needed from:

- content / SEO / product

## 3. Trust proof policy

Question:

- What trust proof will UK V1 use if we avoid unsupported usage counts and rating claims?

Allowed directions:

- clear pricing
- truthful product explanation
- UK-format guidance
- sample template previews
- transparent FAQ

Not allowed without evidence:

- usage counts
- aggregate ratings
- review summaries
- complaint-volume claims about competitors

Decision needed from:

- product / brand / content

## 4. Initial page count

Question:

- Do we keep the first public wave tight at 8 to 11 pages, or do we expand the initial launch set?

Current recommendation:

- keep V1 small and conversion-focused
- ship core pages, early-career pages, and a few comparison pages first

Why this matters:

- lower execution risk
- easier QA
- less thin content risk
- faster path to real feedback

Decision needed from:

- product / content / implementation
