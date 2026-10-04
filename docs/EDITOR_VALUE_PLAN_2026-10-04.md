# WorkCV vs ResumAI: where we can truly add value (evidence-based plan)

Written 2026-10-04. Nothing in this document has been implemented yet.

## Status and decisions (updated 2026-10-04)

You asked me to decide the open questions in the way that is best for users. Decisions and reasons:

| # | Decision | Why |
|---|---|---|
| 1 | **Fix the "Sql"/"Crm" defect now.** Done in the working tree (not yet committed or deployed). | It writes wrongly-cased words onto a user's CV. It is live. |
| 2 | **Header on hand-off: do not put the advert's job title under the user's name.** Keep the vacancy title in `targeting.role`; leave the headline empty unless the imported CV has its own. AI features fall back to `targeting.role` when no headline is set. The existing "Add a specific target role" nudge then lets the user choose. | A CV that states a job title the person has never held is a misrepresentation they did not choose. The AI features still work because they use the vacancy role. **To build in Phase 1.** |
| 3 | **Live match panel: counts only, no single invented number.** Show keywords covered, results with numbers, date and heading checks, updating as the user edits. No estimated score and no re-check button for now. | Counts are instant, free, deterministic and cannot mislead. An estimated score would mix AI-judged and rule-based parts that cannot update live, and our own copy says the score is not an employer ATS result. **To build in Phase 2.** |
| 4 | **ResumAI comparison run: not done.** | It means uploading a file to a third party. Permission has to be a clear yes, and "do what is best for users" is not one. It is also low value: the comparison that matters is our own journey, which I have now run. Say "yes, run it" if you still want it. |
| 5 | **Funnel numbers: nothing for me to do.** | The data is yours and I cannot reach production analytics. The plan is ordered by correctness, not drop-off, so it is not blocked. If you export the numbers, I will check the ranking against them. |

**Phase 0 status:** 0.1–0.5 are implemented and tested (see "Phase 0 results" at the end). Two extra defects found while testing are also fixed: a keyword at the end of a sentence was never matched (for example "Updated records in Salesforce." found nothing), and "support worker" also counted as the verb "support".

## How to read this

Every claim carries a source tag. If there is no tag, it is a recommendation, not a fact.

| Tag | Meaning |
|---|---|
| **[code]** | Read in this repository on 2026-10-04 |
| **[ran]** | Observed by running our app locally on 2026-10-04 (throwaway database, real OpenAI calls) |
| **[theirs]** | Seen on ResumAI's public pages (homepage and `/resume-tools/ats-resume-checker`). These are marketing pages, so they show what ResumAI says and shows, not necessarily what its product does |
| **[research]** | From a file in `research/` or `docs/` (a dated snapshot) |
| **[unverified]** | Not checked. Listed so nobody mistakes it for a finding |

**What I did not do:** I did not run ResumAI's checker (it needs a file upload to a third party) and did not create an account on their site. So I have never seen their real editor or real checker output. See "Decisions needed".

---

## 1. Corrections to what I told you earlier

1. I said the ATS score was not split into parts and listed that as item 4. **That was wrong.** The fit assessment already shows five scored dimensions with bars (Vacancy relevance /35, Evidence /25, Role clarity /20, Structure /10, Completeness /10) under "Where the score comes from". **[code]** `lib/cv-fit-assessment.ts:241`, **[ran]**.
2. I said a "fix all" hand-off from the checker to the editor was missing (item 5). **That was wrong too.** "Fix these issues in my CV" already carries the CV text, vacancy, role and three priorities into the editor. **[code]** `components/ats-score-checker.tsx:379`, **[ran]**.
3. So items 4 and 5 are replaced by the findings below. The real gaps are different from the ones I listed.

---

## 2. How it is built today (current journey)

**Checker** (`/tools/ats-score-checker`, `components/ats-score-checker.tsx`) has two modes:

- **No advert:** runs in the browser, no AI. `lib/cv-readability-check.ts` returns 6–8 pass/warn/fail checks (readable text, length, contact, headings, dates, bullets, personal details, two-column layout) and a score that is the average of them. **[code]**
- **With advert:** sends CV and advert to `/api/tools/cv-fit-assessment`. OpenAI (default `gpt-5.4-mini`) classifies 3–8 requirements as evidenced / partly / not evidenced and writes 3 priorities and up to 5 vague phrases. Our code then computes the score deterministically and filters any quote the model cites that is not verbatim in the CV. **[code]**
- If the AI call fails, it falls back to a keyword-only percentage. **[code]**

**Hand-off** (`lib/cv-fit-handoff.ts`) carries only: `cvText`, `jobDescription`, `targetRole`, `priorities` (3 items), kept in `sessionStorage` for 30 minutes. It does **not** carry the per-requirement results, the vague phrases, or the readability checks. **[code]**

**Editor** (login by email code, then `/api/cv/import-text`, an LLM parse with `gpt-4o-mini`): **[code]**

- Readiness banner: completeness only (`lib/cv-readiness.ts`): contact, profile length, one complete role or education entry, three skills.
- Per-issue action buttons, weak-bullet rewrite with Accept / Try again, and the keyword card (built this week, live).
- The three AI priorities are shown as static text ("Fix 1/2/3").

**Pricing gate:** scanning is free with no account; the editor needs an email-code login; download is £7.99 once. **[code]**

---

## 3. How ResumAI compares (only what is visible to me)

| Area | ResumAI | WorkCV |
|---|---|---|
| Free first scan, no signup | "No signup needed for your first scan"; account to save and let AI fix **[theirs]** | Free, no account; fixing needs email-code login **[ran]**. Same shape |
| Score breakdown | Four parts: Formatting, Sections, Keywords, Content quality **[theirs, sample report]** | Five dimensions with bars (fit mode); a pass/warn/fail list (CV-only mode) **[ran]**. We have it |
| Per-check fix button | "Fix 1 date", "Rewrite with AI", "Add missing keywords" **[theirs]** | Editor has buttons (built this week); checker page itself has one CTA for everything **[ran]** |
| Keyword yes/skip | "Is this missing keyword relevant to your experience?" Yes add bullet / Skip **[theirs]** | Built this week, live **[code]** |
| Live score while editing | Score gauge in editor mock ("58 Needs improvement") **[theirs]** | None. Editor shows "readiness %" (completeness) and "3 of 10 keywords" **[ran]** |
| Layout controls | Auto-adjust, template, font, size, spacing, page size, share **[theirs, editor mock]** | No font, size, spacing or fit-to-page control; no LinkedIn import (zero matches in code) **[code]** |
| Import | PDF, Word, LinkedIn **[theirs]** | PDF, Word **[code]** |
| Templates | "18 ATS-friendly designs" **[theirs]** | 3 styles + 4 layout presets **[code]** |
| Download | Free PDF and Word, "no watermark"; Pro adds unlimited AI, tailoring, cover letters, interview practice **[theirs, FAQ]** | £7.99 once covers CV and cover letter, PDF and Word **[code]** |
| Also | Job search, mock interview, auto-apply extension, mobile app, MCP connector **[theirs]** | Job tracker, Chrome keyword highlighter, tailor-from-tracker, MCP server **[code]**. No job search, interview practice or auto-apply |

---

## 4. Findings from running our own journey

Test: a deliberately weak, realistic CV (a Sales Assistant with vague bullets) against a Customer Service Advisor advert, through checker, hand-off and editor. **[ran]**

| # | Finding | Evidence |
|---|---|---|
| **F0** | **Defect I shipped and that is live:** the keyword card capitalises only the first letter, so adding "crm", "sql", "seo", "javascript" to skills writes **"Crm", "Sql", "Seo", "Javascript"** onto the user's CV. | `displayKeyword` in `lib/keyword-triage.ts`; probe output `crm -> Crm`, `sql -> Sql`, `seo -> Seo`. Dictionary stores them lowercase |
| F1 | **Conflicting verdicts for one CV:** on the checker page the user sees fit **53** and, lower down, readability **86/100**; the editor then says "Your CV is ready to preview". A third figure, keyword coverage **25%**, is what the keyword analyser gives and is what the user sees if the AI call fails. | Page text; analyser probe; `components/ats-score-checker.tsx` fallback |
| F2 | **The best advice dies at the hand-off.** The checker found three requirements "Not evidenced" (CRM, Excel, calls/emails) and gave reasons, but the editor receives only the 3 priority sentences as static text. | `CvFitHandoff` type; editor page text |
| F3 | **Checker and editor can disagree.** The checker marked the requirement "…including complaint handling" as Evidenced, but the dictionary lists "complaint handling" as missing, so the editor's keyword queue still contains it and would ask the user about it. The AI's unmet requirements "calls and emails" and "log cases and follow up" were not extracted by the dictionary from this advert, so the card would never ask about them. | Probe MISSING list vs checker output (I did not click through the whole queue) |
| F4 | **Importance is wrong.** "A full UK driving licence is desirable" is labelled **Essential** and is the first question the card asks a customer-service applicant. Cause: importance is judged per line; the regex includes `licen[cs]e` and has no "desirable" handling; an "Essential:" heading on its own line does not reach the bullets under it. | `lib/ats-keyword-checker.ts:243`, `:297-310`; probe |
| F5 | **False keyword "drive" (Essential):** the verb "drive" has the variant "driving", which matches inside "driving licence". | `lib/ats-keyword-checker.ts:206` |
| F6 | **Editor says "ready" and prompts to pay £7.99** for a CV the checker rated "Promising 53" with 3 requirements not evidenced. Readiness only measures completeness. | Editor page text vs checker |
| F7 | **Header gets the vacancy's job title.** The imported CV shows "Customer Service Advisor" under the name of someone whose jobs are Sales Assistant and Warehouse Operative. | Editor preview text |
| F8 | **Visible copy bugs:** nested quotes (“"three years…"”), "at mid-level level", lowercase "crm" / "excel" chips. | Checker page text; `components/ats-score-checker.tsx:589` |
| F9 | **A date warning is lost.** Checker flags "mixed date formats"; the imported CV keeps "March 2019 – 12/2020" and the editor has no date check. | Probe vs `lib/cv-readiness.ts` |
| F10 | **No feedback loop.** Fixing something never shows the user their position improving, apart from "x of y keywords". | Editor |
| F11 | **Import fidelity was good in this one test.** Every line was preserved verbatim. One CV is not a sample. | Preview text |
| F12 | **Scale:** Search Console, 3 months: 96 clicks / 9,518 impressions; the ATS checker is the #2 clicked page with 18 clicks. At this volume nothing can be A/B tested, so changes must be judged on correctness and on direct user feedback. | `research/customer-profiles-and-pricing-2026-09-26.md` (snapshot dated 2026-09-26) |

---

## 5. What would truly make a difference, ranked

Ranking rule: first anything that makes us **wrong or inconsistent** in front of a user (trust), then anything that **makes the user's next action obvious**, then features. Effort: S = under a day, M = 1–3 days, L = more.

### Phase 0: Trust fixes (S, no product decisions)

| Step | Change | Files | Done when |
|---|---|---|---|
| 0.1 | Fix F0: sentence-case only ordinary words. Keep a short list of known acronyms (CRM, SQL, SEO, HTML, CSS, API, KPI, VAT, ERP, SAP, GDPR, AWS, CAD, CPR, DBS, NVQ…) and special casing (JavaScript, TypeScript). Better still, store display forms in the dictionary. | `lib/keyword-triage.ts`, `lib/ats-keyword-checker.ts` | Unit test: crm→CRM, sql→SQL, seo→SEO, javascript→JavaScript, excel→Excel; checker chips use the same display |
| 0.2 | Fix F4: track the section heading ("Essential", "Required", "Desirable", "Preferred", "Nice to have") and apply it to the bullets beneath it; add desirable signals ("desirable", "preferred", "ideally", "a plus", "advantageous", "bonus") that cap importance at Relevant; drop bare `licen[cs]e` as an essential signal | `lib/ats-keyword-checker.ts` | Test using this session's advert: CRM, Salesforce, Excel are Essential; driving licence is Relevant |
| 0.3 | Fix F5: mask longer matched phrases (e.g. "driving licence") before matching action verbs | `lib/ats-keyword-checker.ts` | Test: advert with "driving licence" and no verb "drive" produces no "drive" keyword |
| 0.4 | Fix F8: strip wrapping quote marks from model-cited evidence and phrases; map seniority to a readable label ("entry level", "mid-level", "senior level", "leadership level"); display-case chips | `lib/cv-fit-assessment.ts`, `components/ats-score-checker.tsx` | Checker output for the test CV shows single quotes only and no "level level" |
| 0.5 | Fix F9: add a mixed-date-format check to editor readiness (improve severity, action "go to Experience") | `lib/cv-readiness.ts` | Test: "Jan 2024" plus "01/2024" in one CV raises an issue |

Add 0.1–0.5 to the existing test suites and to `scripts/verify-editor-fix-flows.mjs` where UI-visible.

### Phase 1: Make the advice survive the hand-off (M). This is the biggest user value

Goal: whatever the checker told the user, the editor turns into **actions**, and the two never contradict.

1. **Carry the assessment.** Extend `CvFitHandoff` and `CvTargeting` with the unmet requirements (status `partly-supported` / `not-evidenced`, short text, explanation) and the vague phrases. Cap sizes (it must pass the strict save schema and the 100 KB payload limit). Optional fields, so saved CVs stay valid. Files: `lib/cv-fit-handoff.ts`, `components/ats-score-checker.tsx` (`prepareEditorHandoff`), `lib/editor-data.ts`, `lib/cv-schema.ts` (`targetingSchema`), `components/cv-editor.tsx` (hand-off block around line 324).
2. **Replace static "Fix 1/2/3" with actionable items.** Each unmet requirement uses the question flow we already built ("Is this part of your real experience? Write a bullet / Skip"), generalised from keywords to requirements. Each vague phrase gets "Rewrite with AI" aimed at the profile or the bullet containing it. Files: `components/editor/keyword-triage.tsx`, `components/cv-editor.tsx`.
3. **Make the two sources agree.** When the AI has judged a requirement Evidenced, the keyword card must not ask about its keyword. Order the queue by the AI's status first (not evidenced, then partly), then dictionary weight. Files: `lib/keyword-triage.ts`.
4. **Fix F7:** do not silently write the vacancy title as the user's headline. Either leave the headline empty and use `targeting.role` for tailoring, or set it and say so ("We set your headline to the job you are applying for. Change it if it isn't your current role"). Needs a decision.

Done when (extend `verify-editor-fix-flows.mjs`): hand-off with 3 unmet requirements shows 3 requirement questions; an Evidenced requirement is never asked; answering one with a drafted bullet adds it to the chosen role; reload keeps state; mobile has no horizontal scroll.

### Phase 2: One honest story about "how good is this CV" (M)

Fix F1 and F6 together:

1. Show **one headline number** per mode, with named parts, and demote the other to a checklist: in the checker, readability stops being a second 0–100 score and becomes the "Formatting" part; the keyword-only fallback is labelled as such.
2. Editor banner: when a vacancy is targeted and requirements remain unevidenced, say so ("Complete, but 3 advert requirements still aren't evidenced") instead of "ready to preview".
3. **Optional, needs your decision:** a live "match progress" panel in the editor updating as the user fixes things. Only deterministic parts can update live (keyword coverage, evidence/number count, dates, headings, contact). AI-judged parts (requirement support, role clarity) cannot run per keystroke without cost and delay. Honest options: (a) show live counts only ("keywords 3→5 of 10, results with numbers 0→1"), no single number; (b) show a number labelled "estimate, refreshed on re-check" with a "Re-check against the advert" button that calls the assessment again.

Done when: the same CV never shows two different 0–100 scores on one screen; a user who fixes keywords sees something change.

### Phase 3: Only with evidence of demand (do not build yet)

Layout controls / fit-to-one-page, LinkedIn import, more templates, share link, live gauge as a marketing feature, job search, mock interviews, auto-apply, mobile app. ResumAI shows them **[theirs]**, but I have no evidence our users want them **[unverified]**, and at 18 clicks per quarter on the checker we cannot measure demand with analytics. Cheapest honest test: add one optional free-text question to the existing post-download survey (`components/editor/purpose-survey.tsx`) asking "What was missing?", and read the answers after a month. Check first whether the survey store can hold free text (it is deliberately fixed-choice today **[code]**, `lib/editor-events.ts`), because adding free text would change the privacy posture.

---

## 6. Risks and constraints

- **Cost and latency:** Phase 1 adds no extra AI calls (it reuses the assessment already paid for). Phase 2 option (b) adds one per re-check.
- **Strict schema:** `targetingSchema` is `.strict()` and capped **[code]**. Any new field must be added there and in `repairCvData`, or saves will fail validation.
- **Privacy:** the hand-off already moves CV text through `sessionStorage` and the server; carrying requirement text adds nothing new, but the copy on the checker page ("CV text goes to OpenAI") stays accurate and must not be loosened.
- **Dictionary limits:** fixing importance (0.2) improves the dictionary but it still only knows the terms in the dictionary. Phase 1 reduces reliance on it; it does not remove it.
- **Test data:** my tests used one weak CV and one advert. The fixes should be validated on at least 8–10 varied UK adverts (retail, care, driver, admin, graduate, tradesperson) before release.

## 7. Decisions needed from you

1. **Fix F0 now?** It is a live defect (the CV gets "Sql"). I recommend fixing and deploying 0.1 immediately, separately from the rest.
2. **Headline on hand-off (F7):** leave empty, set with a visible note, or keep as is?
3. **Live match panel (Phase 2, step 3):** counts only (a), or an estimated number with a re-check button (b)? Or neither?
4. **Permission to compare against ResumAI's real checker:** I would upload a dummy CV (fictional person) to their free checker and record the output. It is a form submission to a third party, so I will not do it without your explicit yes. Without it, section 3 stays marketing-based.
5. **Usage data:** the private analytics dashboard exists in production **[code]** but I cannot reach it. If you can export funnel numbers (checker started / completed / hand-off clicked / editor reached / paid), I can replace guesses about where users drop with facts. Until then, nothing here is ranked by measured drop-off.

## 8. Suggested order

1. Phase 0 (all S): one release, with tests. Fix 0.1 first and alone if you want it live today.
2. Phase 1: one release, behind the extended browser test.
3. Phase 2 steps 1–2: one release. Step 3 after your decision.
4. Phase 3: only after the survey shows demand.

## Appendix: evidence log (2026-10-04)

- Test CV: "Sam Patel", Sales Assistant and Warehouse Operative, 118 words, vague bullets, mixed date formats. Test advert: Customer Service Advisor, 612 characters.
- Dictionary analyser: score 25, "Low coverage". Missing: driving licence [Qualification/Essential], customer service advisor [Job title/Repeated], crm [Skill/Essential], salesforce [Skill/Essential], complaint handling, excel, key performance indicators [Skill/Relevant], drive [Action verb/Essential], resolve [Action verb/Repeated]. Found: customer service, communication, sales.
- Readability: 86/100 (length: warn, dates: warn; others pass).
- AI fit assessment: 53/100 "Promising" (relevance 10/35, evidence 11/25, role clarity 12/20, structure 10/10, completeness 10/10); 1 of 6 requirements evidenced; "Not evidenced": CRM system, Excel, calls/emails/case logging; priorities: CRM, Excel, written communication.
- Editor after hand-off: "Your CV is ready to preview", priorities as static text, keyword card first asks "Driving licence ESSENTIAL", "3 of 10 advert keywords are on your CV", headline "Customer Service Advisor".
- `displayKeyword` probe: crm→Crm, sql→Sql, seo→Seo, javascript→Javascript, python→Python; acronyms already stored in capitals (NVQ, API, AWS, CAD, CPR, ERP, GDPR, HTML, SAP, VAT) are fine.
- Test environment: throwaway Postgres container and dev server, both removed afterwards. No production data or accounts were touched.

## Phase 0 results (2026-10-04, working tree, not committed)

| Item | Result |
|---|---|
| 0.1 Casing (F0) | New `lib/keyword-format.ts`: CRM, SQL, SEO, NHS, HR, API, VAT… upper-cased; JavaScript, TypeScript, Power BI, WordPress, Microsoft 365/Office/Teams, Google Analytics. Terms that already have capitals are untouched. Used by the editor card, "Add to skills" and the checker chips |
| 0.2 Importance (F4) | A requirement is now judged with its heading in view: bullets under "Essential:" / "Required" / "Must have" are Essential; under "Desirable:" / "Nice to have", or with "desirable", "preferred", "ideally", "a plus", "an advantage", "bonus", they are Relevant. Bare "licence" no longer means essential. A list ends at a blank line followed by ordinary text |
| 0.3 False verbs (F5) | Action verbs are matched after blanking longer known phrases (qualifications, job titles, main skill terms). "driving licence" no longer produces "drive" and "support worker" no longer produces "support". Verb-plus-noun variants such as "managed complaints" still count as the verb |
| 0.4 Copy (F8) | No doubled quote marks around cited evidence or vague phrases; "at mid-level level" is now "at mid-level" / "at entry level" / "at an unclear level"; chips use proper casing |
| 0.5 Dates (F9) | New editor issue "Dates use mixed formats…" only when a word-month date (March 2019) and a numeric date (12/2020) are both present |
| Extra | Keywords ending a sentence or bullet with a full stop are now found (the normaliser kept the dot). This bug existed since the first version of the checker and caused false "missing" results |

Checks: 11 new tests in `tests/phase0-trust-fixes.test.ts` plus the existing suite (344 pass, 0 fail, 1 pre-existing skip that needs a real PostgreSQL); typecheck clean; `scripts/verify-editor-fix-flows.mjs` 22/22 on three consecutive runs; the real checker page re-run on the same weak CV and advert: CRM, Excel and Salesforce cased correctly, "Driving licence" is Relevant, "drive" is gone, no nested quotes, "at entry level".

Not changed: the checker still lists action verbs ("Resolve") as keywords to review. That is noise rather than an error and belongs with Phase 2.

## Phase 1 results (2026-10-04, working tree, not committed)

What a user now gets after "Fix these issues in my CV":

- **Header (F7):** the advert's job title is no longer written under the user's name. It stays in `targeting.role`. AI suggestions fall back to it when the user has no headline. The readiness list says: "Add the job title you want under your name. This advert is for "X"; use it only if it matches your real experience."
- **The checker's findings survive the hand-off (F2):** unmet and partly-evidenced requirements (with the checker's reason), requirements it judged evidenced, and the vague phrases are saved with the CV (`targeting.requirements`, `evidencedRequirements`, `answeredRequirements`, `vaguePhrases`), clamped to the strict schema.
- **One question at a time, in order:** unmet requirements first (not evidenced before partly), each with "What the checker found: …" and Yes, write a bullet / Skip. The bullet is drafted from the user's own one-line note and the requirement, added to the role they choose, and the requirement is marked answered. Keyword questions come after.
- **Checker and editor agree (F3):** a requirement the checker judged evidenced is never asked about, and its keywords count as found. Keywords inside an unmet requirement are asked through the requirement, not twice.
- **Vague phrases:** listed with where they are (profile or a named role) and a Rewrite with AI button that opens the existing profile or bullet rewrite. A phrase drops off the list once the user edits it away.
- **The three static "Fix 1/2/3" cards** are collapsed under "The checker's top 3 fixes (answered below)". An older hand-off without requirements still shows them as before.

Defects found by testing Phase 1 and fixed before this report:

1. **A requirement could silently disappear.** My first rule treated a requirement as answered once the CV contained its skill words. A live run showed "Excellent written communication" and "Log cases… with the sales team" vanish because "communication" and "sales" were already in the CV, even though the checker had judged them unmet. Now a requirement is only dismissed automatically when every skill keyword that was *missing when the checker ran* is now present (for example the user adds Excel). With no CV text at hand-off, nothing is dismissed automatically.
2. **Job titles were being asked about** ("Is *Customer service advisor* part of your real experience?"). Job titles are now left out of the keyword card, like action verbs.
3. The modal labelled the user's own note "Current text" for requirement drafts; it now says "Your note".

Checks: 15 tests in `tests/vacancy-fit.test.ts`; the whole suite 360 pass, 0 fail, 1 skip that needs PostgreSQL; typecheck clean; `scripts/verify-editor-fix-flows.mjs` 35/35 on three consecutive runs, including a mocked checker hand-off (header, order, covered keywords, vague phrases, reload, older hand-off). A real run with live AI also passed: checker (3 not evidenced, 2 partly, 1 evidenced) → hand-off → editor showing the user's own title "Sales Assistant" in the header, the CRM requirement first, then a live Excel bullet drafted from a one-line note and applied.

Known, left alone:

- When the checker flags several vague phrases inside the profile, each gets its own "Rewrite with AI" button and they all open the same profile rewrite. It is harmless but repetitive.
- Fixes still use the checker's judgement as of the hand-off; they are not re-assessed by AI after the user edits. (Phase 2 counts-only panel covers feedback while editing.)

## Phase 2 results (2026-10-04, working tree, not committed)

Goal: one honest story about how good the CV is, and a visible feedback loop while editing.

- **One score per screen (F1):** on the checker page with an advert, the second "CV readability: 86/100" figure is gone. The same checks now appear as an unnumbered "Layout and file checks" list that says it is separate from the score above and does not change it. The headline fit score is the only 0–100 number. In CV-only mode (no advert) the readability score is still the headline, because it is then the only score.
- **Honest banner (F6):** with a vacancy targeted and requirements still open, the editor banner now says "Your CV is complete, but N advert requirement(s) still aren't evidenced" and points to the vacancy panel, instead of "ready to preview". It goes back to "Your CV is ready to preview" once none are open. Skipping a requirement closes it. An already-paid CV keeps "Your CV is unlocked."
- **Live counts, no invented number (decision 3):** the vacancy panel shows four counts that change as the user edits and need no AI call: advert keywords on the CV (n of m), requirements answered (n of m; skipping is not progress), bullets showing a result (n of m), and bullets flagged as weak. Pure function `matchProgress` in `lib/vacancy-fit.ts`.
- Not done on purpose: no combined estimated score and no re-check button (the AI-judged parts of the checker's score cannot be recomputed live). The checker still lists action verbs such as "Resolve" under "Keywords to review"; that noise is unchanged.

Checks: 2 more unit tests (17 in `tests/vacancy-fit.test.ts`); whole suite 362 pass, 0 fail, 1 skip that needs PostgreSQL; typecheck clean; browser flows 37/37 on three consecutive runs, now also asserting the banner text at each step, the counts, and no horizontal scroll at 375px with the counts row (screenshots written to `tmp/editor-fix-flows/`); real checker page re-run with live AI: single 53/100 score, no second 0–100 figure.
