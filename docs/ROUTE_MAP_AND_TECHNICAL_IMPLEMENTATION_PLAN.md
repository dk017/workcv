# Route Map And Technical Implementation Plan

Last updated: June 11, 2026

Scope:

- separate UK domain: `workcv.co.uk`
- login required when entering the editor
- UK price: `GBP 4.99`

This document translates the strategy into implementation decisions.

## 1. Routing model

Recommended public route set for V1:

- `/`
- `/pricing`
- `/cv-builder-uk`
- `/cv-template-uk`
- `/cv-builder-no-subscription`
- `/cv-with-no-experience-uk`
- `/student-cv-template-uk`
- `/school-leaver-cv-example`
- `/myperfectcv-alternative-uk`
- `/livecareer-alternative-uk`
- `/cvmaker-uk-alternative`

## 2. Domain model

Confirmed decision:

- this launches on a separate domain: `workcv.co.uk`

Implementation implication:

- UK pages should not inherit Dutch-domain canonicals
- metadata, OG URLs, structured data URLs, and sitemap entries must resolve against the UK domain

## 3. Reuse strategy

Do not build a second product from scratch for V1.

Reuse from current app where sensible:

- shared layout patterns
- editor infrastructure
- pricing logic structure
- CTA tracking model
- comparison-page patterns
- FAQ/content components where adaptable

Adapt for UK:

- site config
- metadata/canonical domain
- page copy
- currency display
- UK CV defaults

## 4. Config requirements

Need a UK site config with at least:

- site name
- base URL = `https://workcv.co.uk`
- locale = `en-GB`
- currency = `GBP`
- price display = `GBP 4.99`
- UK-specific metadata defaults

## 5. Metadata requirements

Each UK page should have:

- unique title
- unique meta description
- canonical under `https://workcv.co.uk`
- `en-GB` language metadata where supported
- OG/Twitter metadata aligned to UK copy

## 6. Editor-entry behavior

Confirmed decision:

- login required when user enters the editor

Implementation implication:

- page copy may say `Build my CV`
- product flow should redirect to login when required
- FAQ and support copy should explain this plainly if needed
- marketing pages must not claim `no account needed`

## 7. Currency and pricing requirements

Confirmed price:

- `GBP 4.99`

Implementation checks:

- homepage
- pricing page
- editor checkout UI
- structured data offers
- CTA labels where price is shown
- FAQ answers

All must stay consistent.

## 8. UK CV defaults to implement

Editor and examples should default away from Dutch/continental assumptions.

Required UK defaults:

- no date of birth field in the standard visible flow
- no nationality field in the standard visible flow
- no marital-status assumptions
- no photo-first assumption
- work history shown most recent first
- early-career examples can place education before work history
- references phrased as `Available on request` style guidance where relevant

## 9. Shared component needs

Likely reusable/shared component groups for V1:

- hero section
- comparison table
- FAQ accordion
- CTA band
- template preview grid
- section label / eyebrow

The key is consistency, not excessive abstraction.

## 10. Page templates to implement

### Template A: core money page

Use for:

- homepage
- pricing
- cv-builder-uk
- cv-builder-no-subscription

Needs:

- hero
- comparison/trust block
- FAQ
- final CTA

### Template B: template/example page

Use for:

- cv-template-uk
- student-cv-template-uk
- school-leaver-cv-example
- cv-with-no-experience-uk

Needs:

- hero
- example/template section
- what to include
- mistakes / guidance
- FAQ
- direct CTA

### Template C: comparison page

Use for:

- myperfectcv-alternative-uk
- livecareer-alternative-uk
- cvmaker-uk-alternative

Needs:

- hero
- who each product fits
- pricing comparison
- scope comparison
- FAQ
- final CTA

## 11. Analytics events to wire

At minimum:

- landing page viewed
- hero primary CTA clicked
- hero secondary CTA clicked
- pricing CTA clicked
- comparison-page CTA clicked
- template/example CTA clicked
- editor flow entered
- checkout started
- checkout completed

## 12. Build order

### Wave 1

- site config / domain metadata support
- homepage
- pricing page
- cv-builder-uk
- cv-template-uk
- cv-builder-no-subscription

### Wave 2

- cv-with-no-experience-uk
- student-cv-template-uk
- school-leaver-cv-example

### Wave 3

- myperfectcv-alternative-uk
- livecareer-alternative-uk
- cvmaker-uk-alternative

## 13. QA checklist

Before launch, verify:

- all UK pages use correct domain in canonicals
- all displayed prices say `GBP 4.99`
- no page claims `no account needed`
- no page includes Dutch CV conventions by mistake
- no stale competitor pricing remains in comparison copy
- CTA routing is consistent
- login redirect from editor entry behaves as expected

## 14. What not to build yet

Do not include in V1 unless explicitly approved later:

- separate UK codebase
- giant template library
- free Word/PDF asset program across many pages
- cancel pages without fresh official-source validation
- broad TOFU blog expansion
