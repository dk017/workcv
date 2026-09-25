# Organic growth sprint: cover letters and purchase proof

Status: released 25 September 2026. Budget: organic-only. No ads, paid placements, outreach or marketing emails.

## Evidence and scope

The supplied exports end on 22 September 2026, before the 24 September deployment. The matching recent 28-day period has 57 Google search clicks and 9 Bing search clicks. The earlier 28 days have 19 and 1 respectively. Google AI impressions grew from 350 to 668; Bing AI citations from 310 to 1,248. These are separate metrics, not visits or buyers.

The no-subscription page has 16 Google clicks from 357 impressions over the full exported period. Cover-letter queries account for 333 citations among 650 citations in the 24 exported Bing grounding-query rows, not among all 1,603 overview citations. Cited URLs for those queries are not provided. The duplicate PageTrafficReport export is ordinary search traffic, not AI-cited pages.

## Research

Reviewed 25 September 2026:
- https://nationalcareers.service.gov.uk/careers-advice/covering-letter — specific evidence, a concise letter, recipient/sign-off conventions and consistency with the CV.
- https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/cover-letters/sample-cover-letter/ — a worked example helps explain structure; applicants must adapt facts to their own experience.

The new Alex Morgan / Birch example is original fictional content, not a customer outcome or a copied source example.

## Changes

- Corrected the cover-letter tool so the main Word download uses the current edited text, generated in the browser without uploading it.
- Kept the existing anonymous blank Word endpoint as an explicitly labelled separate option.
- Recipient selection updates only standard greeting/sign-off lines, retaining other edits. Personalised greetings require manual review.
- Reset requests confirmation; copy/download errors retain the text. Empty copy/download is disabled.
- Explained temporary browser state and the need to keep a copy.
- Added an original complete example, adaptation steps and a before-sending checklist.
- Added an optional paid-CV link with the exact price/entitlement and a separate free blank-CV alternative.
- Added a sample PDF link beside the no-subscription page's main action. Login and payment rules are unchanged.

## Verification

TypeScript and 16 focused tests passed. The report passed its JavaScript syntax check; its database query has not been run against production. Browser checks passed at 375, 768 and 1440 pixels. An actual browser-generated DOCX was extracted with Mammoth and checked for edited content and the selected sign-off. Reset cancellation and empty-input protection passed, with no page runtime errors. A full-page mobile screenshot was inspected for overall layout; no Microsoft Word page-layout sign-off is claimed. No production deployment or payment test was performed.

## Measurement

Existing funnel events are gated by NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED. No letter text is included in events.

- tool_started: cover_letter_template, once per mounted tool on first interaction.
- tool_completed: cover_letter_template, success/error plus cover_letter_copy or cover_letter_word placement.
- Word success means a file was prepared and a browser download was requested, not proof it was saved, read or submitted.
- CTA placements: cover_letter_money, cover_letter_blank_cv, no_subscription_hero_sample.
- The growth report separates tool action placement and success/error. Do not add distinct sessions across these rows: one session can perform several actions.

Release: 25 September 2026. The release workflow ran its standard growth-schema preparation. The read-only production baseline and live funnel-event receipt still need confirmation.

Weekly review: use the same date windows for search clicks, tool actions, editor previews, paid orders and successful CV downloads. Compare original public landing/source acquisition separately from checkout attribution. Clicks on the optional CV offer are not purchases. Exclude test orders; do not infer causation from small before/after samples.

Organic work after this sprint: confirm the Bing cited-page mapping; prioritise ATS checker and right-to-work journeys using purchases, not impressions alone. Keep existing useful free content. Earn unpaid references through reproducible evidence and genuinely useful demonstrations; no unsolicited outreach performed.
