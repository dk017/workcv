# Matching cover letter in the same purchase — plan

Date: 26 September 2026. Status: Phase 1 implemented locally (not committed or deployed); Phases 2–3 pending.

## Phase 1 implementation record

- Data: `CoverLetter` type and `COVER_LETTER_MAX_PARAGRAPHS` in `lib/editor-data.ts`; strict `coverLetterSchema` in `lib/cv-schema.ts` (repair drops an invalid letter and keeps the CV).
- Rules: `lib/cover-letter-document.ts` handles greeting and sign-off, subject, the UK date, guided paragraphs, checks, plain-text copy and the application-pack split.
- Output: `components/editor/cover-letter-document.tsx` (preview/PDF, with Classic, Modern and Compact headers); `lib/cover-letter-docx.ts` (Word); `app/cv-pdf/[documentId]/cover-letter` (token-protected render); `app/api/cv/cover-letter?format=pdf|docx` (401/400/404/402, then 400 if the letter is empty); print CSS in `app/globals.css` (`.letter-document`).
- Editor: "Cover letter" tab (`components/editor/cover-letter-form.tsx`). The preview switches to the letter while the tab is open, and the fit-to-width zoom now also applies to the letter. After payment, a Download menu offers CV PDF/Word and letter PDF/Word. Download errors after payment are now shown; before, they only appeared inside the checkout sheet. The checkout sheet, readiness banner and payment message list the letter.
- Events: client `cover_letter_opened|copied|download_clicked|generation_failed|pack_imported`; server `cover_letter_downloaded` with `format`.
- Copy: terms, refund policy, pricing, FAQ Q06, agent discovery / `llms.txt` and product schema.
- Verification: `tests/cover-letter-document.test.ts` (9 tests); full suite 225/225. Letter printed through Playwright (headless Edge) came out as one A4 page for all three styles, with extractable text. Mobile (375px) form showed no horizontal overflow. Interactive checks covered pack import, the recipient changing the sign-off, and the checks. **Not verified:** the paid end-to-end flow in the running editor, which needs a login, a database and a paid order.

## Why

Bing AI Performance export (26 September 2026, 1,756 citations): cover-letter pages account for 659 citations (~37%). `/tools/cover-letter-template-uk` is the most-cited page (512) and "cover letter template word format" the largest grounding query (190, 25.1% share). These visitors want a finished letter, usually in Word. The paid product currently sells a CV only, so this demand has no paid path.

Goal: one £7.99 purchase per saved CV unlocks the CV (PDF + Word) **and** a matching cover letter (PDF + Word). Primary metric: paid orders per week, and the share of orders from sessions that landed on a cover-letter page. Guardrail: checkout-sheet-to-paid rate must not fall.

## What already exists

| Asset | Where | Reuse |
|---|---|---|
| `applicationPack.coverLetter` string on `CvData` | `lib/editor-data.ts`, `lib/cv-schema.ts` | Prefill source only; the pack's other fields stay as they are |
| Editable pack letter textarea, "not in PDF" | `components/editor/cv-structure-form.tsx` (`ApplicationPackReview`) | Replace with a link to the new tab |
| Letter template text + recipient/sign-off switching | `lib/cover-letter-template.ts` | "Start from template" and greeting logic |
| AI letter generator with fact checks (no invented numbers, exact role/employer) | `lib/cover-letter-generator.ts`, `/api/tools/cover-letter` | Drafting inside the editor from saved CV evidence |
| Job advert saved on the CV | `cv.targeting.jobDescription` | Tailoring input for the letter |
| Paid check per saved CV | `lib/cv-entitlement.ts` | Same order unlocks the letter |
| DOCX builder + PDF render pipeline | `lib/cv-docx.ts`, `lib/pdf-renderer.ts`, `app/cv-pdf/[documentId]` | Letter Word/PDF output with the CV's header |
| Tool → editor handoff | `lib/cv-tool-handoff.ts` | Carry text from the free letter tools into the editor |

## Scope decisions (confirmed by owner, 26 September 2026)

- **One letter per saved CV**, editable and re-downloadable without paying again, the same way CV re-downloads already work. Several letters per CV can come later if customers ask for it.
- **Writing and previewing stay free**; only downloads need the paid order. This keeps the "build free, pay once" promise.
- **Price stays £7.99** for the first release. The goal is more orders, not a higher order value. Consider a price test only after the purchase flow shows a baseline.
- **"Matching"** means the letter uses the CV's name, contact line, template colours and header style, so the two documents look like a set.

## Research (reviewed 26 September 2026)

UK guidance:
- National Careers Service, https://nationalcareers.service.gov.uk/careers-advice/covering-letter: 3–5 paragraphs; job title and reference in the opening; name a person where possible; "Yours sincerely" with a name, "Yours faithfully" with "Dear Sir or Madam"; send as an email for online applications; **match the CV's font and size**; write a new letter for each job.
- Prospects, https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/cover-letters: no more than one A4 page; four-paragraph structure (the role and where it was seen / evidence against the advert / fit and motivation / close with availability); "Dear Hiring Manager" is acceptable when no name can be found; PDF preserves formatting; putting the text in the email body is often better than an attachment; complement the CV rather than repeating it.
- Indeed UK, https://uk.indeed.com/career-advice/cvs-cover-letters/how-to-write-a-cover-letter: an attached letter can reuse the CV heading; online forms don't need an address block; avoid "To Whom It May Concern"; sample letters are under 300 words.
- UK date convention: day month year, e.g. "26 September 2026".

Competitors: Resume.io UK's cover letter builder (https://resume.io/uk/cover-letter-builder) promises matching templates, guiding samples and several letters per account. Its page mentions **PDF download only**, with no Word and no plain text, all behind a subscription.

WorkCV's own evidence: the free `/tools/cover-letter-template-uk` already gives away copying and a Word download of edited text, but the text is **lost on reload** and has no design. So the paid letter can't sell Word alone. Its value is being saved with the CV, filled in from the CV, matched to the CV's design, guided, and downloadable again at any time.

## User perspective → design decisions

| What the user is thinking | Design response |
|---|---|
| "I've just finished my CV; I don't want to type my details again." | The header (name, phone, email, location, LinkedIn) comes from the CV, and the sign-off name is the CV name. |
| "I don't know how to start." | Four guided paragraph boxes based on the NCS/Prospects structure, each with a one-line purpose and a greyed example. No blank page. |
| "Who do I address it to?" | Optional hiring manager name. Given → "Dear {name}, … Yours sincerely". Blank → choose "Dear Hiring Manager" (default) or "Dear Sir or Madam", both ending "Yours faithfully". Handled automatically. |
| "The portal just has a text box" / "I'm sending it by email." | **Copy letter text** is free: greeting, body and sign-off as plain text, ready to paste. |
| "I want it to look like my CV." | The letter uses the CV's template header and colours (single-column presets use Classic). |
| "Will it fit on one page?" | A live word count against a 250–400 word target, with a warning above 450. |
| "Did I forget to change something?" | Checks for leftover [bracket] prompts, a missing employer or job title in the letter, and missing contact details on the CV. |
| "I'm applying for several jobs." | One saved letter per CV. Change the employer and paragraphs, then download again at no extra cost. |
| "I already made a letter with the application pack." | A one-tap "Use my application-pack letter" that splits it into paragraphs without overwriting anything unasked. |
| "Mostly on my phone." | It's a normal editor tab, and the mobile Preview toggle shows the letter while that tab is open. |

Optional fields sit behind "More details": job reference, employer address (for posted or formal letters) and the date on/off switch (on by default, UK format, the day of download).

## Phase 1 — bundle MVP (ship first)

1. **Data model.** Add optional `coverLetter` to `CvData`: `{ employer, role, recipient, body }` with length limits. Recipient present → "Dear {name}, … Yours sincerely"; absent → "Dear Sir or Madam, … Yours faithfully". Update `cvDataSchema` (strict), `repairCvData`, and add the field to `CvToolPatch`. If `applicationPack.coverLetter` exists and `coverLetter` doesn't, prefill from it once.
2. **Editor tab.** Add a sixth tab, "Cover letter". It has fields for employer, role (defaults to `targetRole`), optional recipient and the body, plus a "Start from template" button. While the tab is active, the preview pane shows the letter instead of the CV. The mobile Edit/Preview toggle stays as it is.
3. **Letter document component.** `components/editor/cover-letter-document.tsx` reuses the CV header (name, contact line, template accent) with the date, recipient block, "Re: {role}", greeting, body and sign-off, all on one A4 page.
4. **Downloads.**
   - `lib/cover-letter-docx.ts`: Word output using the same fonts and colours as `lib/cv-docx.ts`.
   - `/cv-pdf/[documentId]/cover-letter`: token-protected render page, printed through the existing Playwright renderer.
   - `/api/cv/cover-letter?draftId=…&format=pdf|docx`: same checks as the CV routes (auth, ownership, `hasPaidCvOrder`), and returns 400 if the letter body is empty.
   - Server event `cover_letter_downloaded` with a `format` metadata key.
5. **Download UI.** Once paid, replace the two header buttons with **Download ▾**, a menu with four options: CV PDF, CV Word, Cover letter PDF and Cover letter Word. The letter options are disabled with a hint while the letter is empty. The locked label changes to "Download · £7.99 once".
6. **Checkout sheet.** Show "Includes: CV as PDF + Word · matching cover letter as PDF + Word".
7. **Legal copy.** Update `app/terms` and `app/refund-policy`, which still describe a PDF-only purchase. The Word export already shipped, so this is overdue as well.

## Phase 2 — conversion bridges

1. **AI draft inside the editor.** Add a "Draft from my CV" button. It needs a job advert (`targeting.jobDescription`, or pasted in the tab) and one line saying why the person wants the job. Evidence comes from the saved CV's profile and experience bullets. The button calls an authenticated route (`/api/cv/cover-letter/draft`) that runs `generateCoverLetter` with its existing fact checks. It's limited per user (for example 10 a day), and nothing replaces existing text until the person confirms.
2. **Handoff from free tools.** On `/tools/cover-letter-template-uk` (512 citations) and `/tools/cover-letter-generator-uk` (147), add: "Put this letter and a matching CV together — Word + PDF, £7.99 once". It carries the letter text into the editor through `writeCvToolHandoff` (`patch.coverLetter`) and tracks placement labels on every CTA.
3. **Copy.** Update pricing, the no-subscription page, cancel pages, agent-discovery / `llms.txt`, product schema and FAQ Q01/Q02/Q06 to say "CV + matching cover letter, PDF and Word, £7.99 once". Keep the free template described honestly as free.

## Phase 3 — measure (2 and 4 full weeks after release)

- Orders per week, compared with the same number of weeks before release.
- Orders whose first-touch landing was a cover-letter page.
- Share of paid CVs with a non-empty letter, and letter downloads per paid CV.
- Checkout-sheet → paid rate (guardrail).
- Report absolute counts and don't claim causation from small numbers, as in the existing growth docs.

## Risks and mitigations

- **A crowded editor on mobile:** the letter lives in its own tab and the preview switches with it, so there are no new panels.
- **AI cost or abuse:** the route is authenticated and rate-limited per user, and generation stays free, as the public tool already is.
- **Invented claims:** reuse `assessCoverLetterQuality`, draft only from the saved CV text, and never auto-apply.
- **Refund expectations:** make the terms state that one purchase covers one saved CV and its one letter.
- **An empty letter at download:** the menu disables those options, and the API returns 400.

## Tests

- Schema: `coverLetter` limits, strict keys, repair, and the prefill from `applicationPack`.
- DOCX: header matches the CV, greeting/sign-off switching, body paragraphs, invalid characters stripped (mammoth extraction, as in `tests/cv-docx.test.ts`).
- API: 401 / 404 / 402 / 400 (empty) / 200 for each format; the event is recorded.
- Handoff: `coverLetter` patch accepted and validated.
- Existing suite (`npm run test:tools`) and `npx tsc --noEmit` stay green.

## Rough effort

Phase 1: about 1–1.5 days. Phase 2: about 1 day. Copy/legal: about 2 hours.
