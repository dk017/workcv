# Ten-page content source log

Reviewed 6 September 2026. Sources below were opened during implementation. Examples are original fictional teaching material; no customer CVs or third-party adverts were copied.

| Source | Use and limits |
| --- | --- |
| https://nationalcareers.service.gov.uk/careers-advice/cv-sections | Clear sections, job-specific evidence, contact details, omission of age/date of birth/marital status/nationality, readable font guidance. Does not establish hiring outcomes. |
| https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv | Standard CV length versus specialist needs, requested file extension, responsible AI-assisted drafting. Does not establish universal ATS compatibility. |
| https://www.enic.org.uk/individuals/statement-of-comparability | International qualification context; excludes grade comparisons and English proficiency. No equivalence is asserted for a fictional qualification. |
| https://nationalcareers.service.gov.uk/job-profiles/care-worker | Entry routes and transferable qualities. Does not establish an applicant's care competence or completed checks. |
| https://nationalcareers.service.gov.uk/careers-advice/explain-gaps-in-work-history | Honest explanation of employment gaps and genuine recent activities. Fictional wording is an editorial example. |
| https://developers.openai.com/api/docs/bots | Search crawling and training are separate controls. Consulted during specification research; no promise of citation or ranking is made. |

## Product evidence

- `components/cv-editor.tsx`: Import CV accepts PDF/DOCX up to 10MB; it does not offer a text paste field. Manual section editing is supported. Populated-draft import warnings are retained and reflected in the guide.
- `app/editor/page.tsx`: email-code authentication precedes the editor.
- `lib/commerce.ts`, `lib/site.ts`: current price helpers drive rendered copy.
- `app/api/cv/pdf/route.ts`: PDF access checks the saved document's successful order.
- `app/api/tools/blank-cv-template/route.ts`: direct unauthenticated DOCX, actual section names and replacement text. Its existing contents were preserved.
- `lib/cv-fit-assessment.ts`: bounded classifications, source-evidence validation and deterministic five-dimension scoring. The worked example explicitly uses editorial classifications through this production scoring function, not a fabricated live AI result. Inputs are in `lib/content-checker-example.ts`; live model output may differ.

## Editorial decisions

- Four canonical guides, rather than minor question-variant pages.
- N3 gives complete before/after drafts and computed word counts. It makes no false three-to-two-page claim for those particular text fixtures.
- Role and returner examples preserve job titles and dates. Contacts use example.com and fictional UK phone numbers. Names, employers and vacancy briefs are labelled fictional.
- Older source checks on untouched portions of existing pages retain their historical dates; each new worked section has its own 6 September review date. Competitor prices were not reverified or relabelled as newly checked.
- This is a content release: no credential provisioning, paid model requests, checkout changes or production database migrations were performed.

## Attribution baseline

Attempted `npm run report:growth -- --days=14 --timezone=UTC` on 6 September 2026. The local process has no DATABASE_URL and stopped before querying. Recent sales attribution remains unverified. Unknown/direct traffic must not be inferred to be ChatGPT traffic.

Use the existing report in an authorised configured environment to obtain exact UTC boundaries, source/landing-page counts and non-test paid orders. Record refunds and missing attribution separately. Compare 14/30-day windows after deployment, reporting absolute counts alongside rates without causal claims from a few sales.

A subsequent attempt loaded the existing .env configuration safely, but its Docker database host was unresolvable both inside and outside the sandbox. No order data was read.

The bundled DOCX renderer was attempted, but LibreOffice is not installed. The existing Word template was instead opened read-only in installed Microsoft Word and exported to PDF for rasterisation and visual review. No template content was changed.
