# WorkCV: first growth experiment and owner actions

Date: 24 September 2026. Homepage experiment released 25 September 2026. No spend or outreach performed.

## Research and decision

The homepage leads with email-code login. Existing tools already serve different visitor needs without requiring editor signup first. Test whether making those paths discoverable improves eventual purchases; clicks alone do not establish a conversion improvement.

Primary research:
- National Careers Service, https://nationalcareers.service.gov.uk/careers-advice/cv-sections (reviewed 24 September): tailor the CV to the role and use relevant evidence. Supports the existing-CV plus vacancy route.
- National Careers Service, https://nationalcareers.service.gov.uk/careers-advice/identifying-skills-and-upskilling/ (reviewed 24 September): identify skills and relate them to the job description. Supports first-job evidence gathering.
- Google Search Central, https://developers.google.com/search/docs/appearance/ai-features (reviewed 24 September): useful, accessible content and ordinary SEO fundamentals; no special AI markup guarantees inclusion.

## Homepage changes released

- Keep the primary editor CTA and its existing tracking label.
- Add a free, fictional sample PDF beside it so visitors can inspect the product before signup.
- Add three routes below the trust strip: existing CV plus job advert, first-job draft, and an AI-draft formatting guide.
- Explain each route's inputs and limitations. Do not imply an automatic ChatGPT connection or free editor PDF.
- Use existing tracked links with distinct placements: home_sample_pdf, home_existing_cv, home_first_cv, home_ai_draft.
- Preserve login, payments, paid entitlements and original-source attribution. No new AI calls, providers or personal-data collection.

## First-week actions for the owner

1. Provide a Search Console export covering the last 90 days: queries and pages, plus country/device breakdown if available. Do not share passwords or account tokens. This allows prioritisation using actual impressions and clicks rather than invented search-volume estimates.
2. Invite five willing job seekers to try the mobile flow. Ask permission to observe; do not record or collect their CV without consent. Ask what they expect to receive, where they hesitate and whether the price/entitlement is clear. Avoid coaching them through the task.
3. Ask willing existing customers what brought them to WorkCV and why they paid. Obtain separate permission before publishing any quotation; request honest feedback, not positive ratings.
4. Identify five career advisers, tutors or training providers you already know. Request introductions or permission to demonstrate the product. No affiliate commitments until terms and margins are agreed.
5. Set a maximum 90-day experiment budget, including the possibility of zero advertising spend. No campaign should launch without an agreed cap and measurement.

Interview prompts: What were you trying to finish today? What did you try first? What almost stopped you using WorkCV? What did you expect the payment to include? Did the downloaded document meet that expectation?

## Measurement and decision rules

Before release, refresh the existing read-only growth report for 7 and 30 days and reconcile positive production orders with the payment records. The earlier five-orders/30-day snapshot is historical, not a current baseline.

Record deployment timestamp. Compare equivalent full-week periods, noting source/device changes and other releases. This is an observational experiment unless random assignment is implemented; do not claim causation or statistical significance from a few sales.

Primary metric: homepage-entry visitors who complete a paid order within seven days, using a reliable identity/session join where available. If cross-session joining is unavailable, report that limitation rather than claiming complete attribution.

Diagnostic metrics: each route's clicks per homepage visitor; tool completion; editor preview; checkout; successful download. The placement events measure link clicks, not automatic multi-step purchase attribution. Verify event receipt and available joins before attributing sales to a card. Do not send CV text into analytics.

Guardrails: overall homepage-to-purchase conversion, mobile editor starts, login failures, paid-download failures and complaints. Keep the sample and route CTAs only if they help users without material regression; route clicks rising while purchases fall is not a win.

Review after two full weeks and again after four, reporting absolute counts. Low sample sizes may remain inconclusive. Do not delay obvious usability fixes while waiting for significance. At day 30, concentrate content and distribution on the routes with buyer evidence.

## Verification before release

TypeScript check passed. Existing conversion-invariant tests passed (3/3), including unique CTA placement labels. Browser DOM checks found no horizontal overflow at 375, 768 and 1440 pixels. All three route destinations and the sample PDF returned HTTP 200 locally. The local environment blocked Google Fonts downloads, so layout checks used fallback fonts. Screenshot saving was blocked by filesystem permissions; visual checks of the released site are still useful.

## Scope deferred

Guest editor changes need a separate design for local persistence, privacy, account merge and abuse controls. Partner outreach, paid ads, testimonials, production deployment and marketing email activation have not been performed in this task. No ranking, AI citation or daily-sales guarantee is made.
