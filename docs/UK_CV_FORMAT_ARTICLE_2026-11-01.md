# UK CV format article: competitor gap and release notes

Prepared 1 November 2026. New page: `/uk-cv-format` (`app/uk-cv-format/page.tsx`). Status: local only, not committed or deployed.

## Why this keyword

From the project's DataForSEO research (26 September 2026, not refreshed): "uk cv format" ≈ 12,100 UK searches/month, KD 21. WorkCV had no page for this intent. `/how-to-write-a-cv-uk` covers the writing process; `/cv-layout-tests-uk` and `/cv-word-or-pdf-uk` cover narrower questions. The new page is the reference for "what a UK CV looks like", and it links out to those pages rather than repeating them.

Rankings were not checked: no Search Console export or SERP API was available, and the web search used is US-based. The competitor below was chosen because it ranks in that search and is a typical "UK CV format" page, not because its UK position was verified.

## Competitor: novoresume.com/career-blog/uk-cv-format

Updated 24 February 2026, about 3,000 words, by a CPRW-credentialed author.

**Does well:** a clear section-by-section walkthrough, before/after personal statement examples, a named author with credentials.

**Falls short:**
- No external sources at all; "most UK companies use ATS" and similar claims are unsupported.
- Contradicts itself on dates: mm/yyyy in one place, dd/mm/yyyy in another (with a typo).
- Says UK employers *expect* "References available upon request"; Prospects calls it optional.
- Says a full address with postcode is expected; Prospects advises against it on any CV posted online, and the National Careers Service doesn't list it.
- PDF only; never mentions following the employer's requested format or Word.
- Points readers to "UK NARIC", which has been UK ENIC since 2021.
- Nothing on date of birth, marital status, right to work or visa status, which are the questions overseas applicants most need answered.
- No tables, no FAQ, no complete CV example, and US spellings in a guide that tells readers to use British spelling.
- Its table of contents lists two sections that don't exist in the body.

## What the WorkCV page adds

1. A one-table answer at the top: every convention, with the reason behind it and the exception.
2. Section order by situation (experienced, school leaver or graduate, career changer, returner) instead of one fixed order.
3. What to leave off, sourced to GOV.UK (date of birth only for minimum-age jobs; no marital-status questions) and Acas.
4. Right to work: when a line helps, and why share codes and NI numbers don't belong on a CV (GOV.UK).
5. **Original evidence:** WorkCV's own layout test (24 September 2026, PDF.js). Single-column layouts kept the page order; both sidebar designs moved Skills to the start or end of the extracted text. The limits are stated: one parser, not an ATS test.
6. A complete fictional UK CV example, plus a resume-to-UK-CV conversion table.
7. Correct, current details: UK ENIC, month-and-year dates, the spellcheck pairs that slip through, file format by employer instruction.

## Self-audit (1–10, honest)

| Category | Competitor | WorkCV | Note |
|---|---:|---:|---|
| Search intent | 7 | 8 | Ours answers in the first paragraph and the first table |
| Depth | 7 | 7 | Similar coverage; ours is shorter (~2,250 words) and adds right to work and leave-offs |
| Accuracy | 5 | 8 | Competitor has date, references, address and NARIC problems |
| Practical use | 6 | 8 | Situation table, full example, conversion table |
| Original information | 3 | 7 | Layout extraction test is WorkCV's own data |
| Readability | 7 | 7 | Our tables are dense; the mobile view stacks them into cards |
| Trust and sourcing | 4 | 7 | Six primary sources. Weakness: author is "WorkCV", not a named person with credentials |
| SEO structure | 7 | 7 | Ours lacks FAQ schema and images |

**Remaining weaknesses:** no named author or reviewer; no image of a formatted CV (the example is text); FAQ isn't marked up. Adding a rendered sample PDF/PNG of the example CV would be the most useful next improvement.

## Metadata

- Title: `UK CV Format 2026: Sections, Order and Rules | WorkCV`
- Description: `The standard UK CV format: up to two A4 pages, newest job first, no photo or date of birth. Section order, date style, layout, file type and a full example.`
- Slug: `/uk-cv-format`

## Internal links

Out from the new page: how-to-write-a-cv-uk, how-long-should-a-cv-be-uk, right-to-work-cv-uk, cv-word-or-pdf-uk, convert-resume-to-uk-cv, career-change-cv-uk, cv-employment-gap-uk, cv-personal-statement-uk, cv-layout-tests-uk, shorten-cv-to-two-pages, cv-examples-uk, cv-vs-resume-uk, tools/ats-score-checker, tools/uk-visa-sponsor-checker, tools/blank-cv-template-uk.

In: `/how-to-write-a-cv-uk` related links now lead with "UK CV format". Worth adding later: a contextual link from `/convert-resume-to-uk-cv` and `/cv-vs-resume-uk`.

## Also fixed

`/cv-word-or-pdf-uk` said the editor only downloads PDF and that Word was a separate blank template. Word export shipped in c104042: the paid download includes PDF and an editable single-column DOCX. Table, paragraph and FAQ updated; review date moved to 1 November 2026.

## Sources

- Prospects, How to write a CV (May 2025): https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv
- National Careers Service, CV sections: https://nationalcareers.service.gov.uk/careers-advice/cv-sections
- GOV.UK, Employers: preventing discrimination in recruitment: https://www.gov.uk/employer-preventing-discrimination/recruitment
- Acas, Following discrimination law in recruitment (updated 30 June 2026): https://www.acas.org.uk/recruitment/follow-discrimination-law
- GOV.UK, Prove your right to work: https://www.gov.uk/prove-right-to-work
- UK ENIC: https://www.enic.org.uk/

## Next articles in the same mould

Ranked by the September research; each still needs a live SERP check before writing.

| Target | Est. volume / KD | WorkCV page | Approach |
|---|---|---|---|
| what to put on a cv | 1,000 / 11 | none | New short reference page; risk of overlap with this one, so consider a section here instead |
| how long should a cv be | 2,900 / 0 | `/how-long-should-a-cv-be-uk` | Improve: competitors (LiveCareer, Zety, CV Genius) repeat "two pages" without evidence; add WorkCV's word-count data |
| cover letter example uk + role letters | 6,600 / 9; roles KD 0–4 | `/cover-letter-examples-uk` | Add the KD-0 role letters (internship, law, engineering, student) |
| cv summary example | 1,300 / 6 | `/cv-personal-statement-uk` | Check whether "summary" queries land there; add a summary-vs-statement section |
| career change at 50 | 1,000 / 0 | `/career-change-cv-uk` | New angle on age: the leave-off advice above, applied |
