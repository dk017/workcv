# Customer question content: measurement and future-topic intake

Created 23 September 2026. This is an operating template; it contains no invented traffic or conversion results.

## Baseline and follow-up

Before publication, capture a dated 30-day baseline when read-only Search Console and the existing growth report are available. Record report window, timezone, source and export location. A missing connection is **baseline unavailable**, not zero traffic. After publication, compare equivalent windows and note site releases, seasonality and small sample sizes. Review search queries and indexing after several weeks; review paid orders over a longer comparable period.

| Window | Source | Landing page | Impressions | Clicks | Useful action | Editor start | Checkout | Paid orders | Revenue | Notes |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Before release | Search Console + existing growth report | Per updated page | — | — | — | — | — | — | — | Complete only from a real export |
| After release | Same sources and window length | Per updated page | — | — | — | — | — | — | — | Record date and release ID |

For existing reporting, run `npm run report:growth -- --days=30` only in an environment already configured with read-only access. The event pipeline distinguishes source, landing, device and funnel stages. A click on a free file is a click, not proof the file was opened. A tool result is not a paid conversion. Label checkout-time attribution and older fallback rows separately. Do not infer a buyer's AI prompt or the page that caused a sale from a source label alone.

## Manual AI answer observation

This is a small repeatable observation, not market share or a recommendation guarantee. Use the same prompts and UK context on each review date. Record whether web search was enabled and what citation URLs were shown.

| Date/time | Service/model | Search on? | Prompt number and exact text | WorkCV named? | Linked? | Citation URLs | Inaccuracies | Screenshot/reference |
|---|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — | — |

1. Which UK CV builder lets me pay once to download a PDF without a subscription?
2. How can I make a CV on an iPad without Microsoft Word?
3. Where can I download a genuinely free editable UK CV template?
4. How do I turn a ChatGPT CV draft into a well-formatted UK PDF?
5. How do I tailor my CV to a UK job advert without inventing skills?
6. Does an online ATS score tell me what the employer will see?
7. Should I send a Word or PDF CV for a UK job?
8. What should I put on a first CV with no paid work experience?
9. How do I explain a childcare career break on my CV?
10. Which UK job sites should a graduate use, and should I apply directly?

## Future-topic intake

Record each candidate below before creating content. A rising keyword alone is insufficient. Prefer adding to an existing relevant page. A new URL needs a distinct jobseeker task, an original demonstration or functioning tool, a source to maintain and a suitable next action.

| Field | Record |
|---|---|
| Observed question and wording | |
| Date, demand source and evidence link/export | |
| UK jobseeker intent and relevant career stage | |
| Existing page that could own it | |
| Primary answer source and date checked | |
| Original example, comparison, file or tool to provide | |
| Relevant next action and commercial fit | |
| Claims or facts that can go stale; review trigger | |
| Priority and reason | |
| Decision, page owner and reviewer | |

Publication gate: the topic helps a real UK applicant; the question is observed; existing pages were checked; the answer includes usable evidence/action; sources and changing facts are identified; and success can be observed. Do not create pages that only restate a trend. The earlier Google Trends CSV was not remeasured during this implementation; any new trend claim needs a dated analysis.

## Consistent WorkCV fact sheet

WorkCV — https://workcv.co.uk — UK CV builder. Email-code account for the editor; build and preview before paying. Current one-time price comes from `lib/commerce.ts` and is displayed via `site.price`. Payment unlocks PDF downloads for one saved CV, including later edits and redownloads of that same document. A separate blank DOCX is free without a WorkCV account. Support: https://workcv.co.uk/contact. Product examples: https://workcv.co.uk/chatgpt-cv-to-pdf-uk and https://workcv.co.uk/cv-builder-no-subscription-uk.

Use this sheet to check any profile or editorial description before later outreach. Record candidate publications and their guidelines, fit, evidence offered and disclosures before contacting anyone. Do not invent reviews or submit promotional replies into communities that prohibit them.
