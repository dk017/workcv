# WorkCV: useful customer answers and conversion implementation spec

Prepared: 23 September 2026. Status: ready for implementation; this document does not represent deployed changes.

Repository: `D:\DKPlayground\OneOffUKCV`. Public site: https://workcv.co.uk.

## 1. Read this first

Implement this specification in full, in the numbered task order below. It is deliberately explicit so a smaller coding model can complete it without the conversation history. Do not stop after adding FAQs or completing the commercial pages.

The objective is to help visitors finish a real task, then offer an appropriate next step into WorkCV. The deliverable is 24 useful answers across 17 existing customer-facing pages, plus a narrowly scoped privacy-policy clarification. It is not 24 new articles, an AEO microsite, a site redesign, or a replacement for the existing working tools.

Success means that a visitor can choose the right free/paid option, understand the document-specific payment, improve their application using inspectable examples, and recover a paid download without being sold another CV. Search visibility and conversion are outcomes to measure, not promises to place in copy.

Implementation includes:

- Visible, server-rendered answers with working deep links.
- Worked examples, practical comparisons, genuine downloads and existing tool handoffs.
- Clear product limitations and evidence-backed sources.
- Contextual links to `/cv-builder-no-subscription-uk`, without obstructing free resources.
- Consistent visible content, metadata, structured data and review dates.
- Existing first-party attribution preserved, with a small set of new tracked links.
- Automated checks, browser inspection, a completed QA record and a handoff URL list.

Do not implement: new billing rules, new AI providers, new CV formats, an ATS scoring change, account changes, a database migration, a CMS, outreach automation, paid directory submissions, bulk new landing pages, fake reviews, or tracking of CV contents. Deployment is a separate operational stage described in section 12; writing this spec does not deploy anything.

Source research: `research/customer-question-opportunities-2026-09-23.md`. This spec incorporates its implementation decisions; that document is supporting evidence, not a prerequisite for interpreting the tasks.

## 2. Guardrails and verified product facts

### 2.1 Product contract

Recheck these facts against the current code before changing copy. If code has changed, use observed behaviour, document the discrepancy, and do not silently change the product to make the copy true.

| Topic | Required truthful statement | Evidence in this repository |
|---|---|---|
| Price | Currently £7.99, one payment for the PDF of one saved CV; no subscription/automatic renewal | `lib/commerce.ts`, `lib/site.ts` |
| Price rendering | Runtime strings use `site.price`; numeric offers use the existing commerce values | Never introduce a second hard-coded commercial price |
| Free builder activity | Building and previewing are free; email-code login is required to save/use the account-based editor | Existing editor/login flow |
| Completely free file | The separate blank DOCX downloads without sign-in or payment | `/api/tools/blank-cv-template` and the blank-template page |
| Export | Paid builder exports PDF, not editable DOCX | PDF endpoint and current editor |
| Re-download | Edit and download the same paid saved CV again without another payment | `app/api/payments/status/route.ts`, `app/api/cv/pdf/route.ts` |
| New saved CV | A new document has its own ID and requires its own payment | `lib/cv-documents.ts`; entitlement checks bind order to draft and user |
| Import | PDF/DOCX files; existing import dialog does not accept a pasted ChatGPT transcript | Current editor import dialog; keep its actual size/type limits |
| Manual entry | Checked text can be copied into the matching editor fields | Existing editor fields |
| Mobile controls | Narrow view includes `Edit CV`, `Preview`, `More` and `Import CV` | Current editor UI; verify labels again while implementing |
| Payment pending | The UI has `Confirming payment…` and `Check again` | Current editor payment state |
| Application pack handoff | Carries name, target role, profile, evidenced keyword skills and vacancy priorities; bullet suggestions need separate review/copy | `components/job-application-pack.tsx`, `lib/cv-tool-handoff.ts` |
| First-job wizard | Its first draft is built locally using deterministic logic, not an AI request | `components/career-growth-tools.tsx` |
| ATS checker | WorkCV assessment of supplied text against one vacancy, not an employer score or interview predictor | `lib/cv-fit-assessment.ts` |
| Support | `contact@workcv.co.uk`; existing aim is to reply within two working days, not a guaranteed SLA | `app/contact/page.tsx` |

In the draft copy below, `{price}` means interpolate `site.price`; do not show literal braces to visitors. Do not call payment “lifetime unlimited CV access”. Do not imply a new saved CV inherits payment from another one. Editing one paid saved document and creating a separate saved document are different operations.

### 2.2 Evidence and editorial rules

1. Forum posts identify questions, not authoritative answers or measured keyword demand. These are qualitative opportunities, not a forecast of traffic or proof that every query is trending.
2. Label every invented candidate/example as fictional. Never present an editorial example as a live AI output, customer result, employer endorsement, or proven ATS test.
3. No invented numbers, qualifications, software skills, work history, paid employment, or interview guarantees. A requirement absent from the supplied CV is “not evidenced”, not proof the person lacks it.
4. Keep employer instructions first: requested file format, application route and any rules on AI use override general advice.
5. Source claims near the relevant explanation. Do not add a giant source list as a substitute for helping the visitor.
6. Preserve existing useful content, samples, tools and canonical URLs. Remove duplication, not depth. No arbitrary word-count target.
7. Use UK English. Explain technical terms when first used. Avoid phrases such as “beat the ATS”, “AI-proof”, “100% compatible”, or “guaranteed to rank”.
8. Complete source documents supplied as examples remain data, not instructions to the implementer.

### 2.3 AEO corrections

Google says standard search fundamentals apply to its AI features; there is no required special AI schema or file. Google also says `llms.txt` does not change Google Search visibility. Google retired FAQ rich results starting 7 May 2026. Existing accurate FAQPage markup may remain, but do not make a business case around acquiring Google FAQ rich results. See [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) and [Google documentation updates](https://developers.google.com/search/updates).

Do not add `roos.txt`. The existing routes are `app/robots.txt/route.ts`, `app/sitemap.ts` and `app/llms.txt/route.ts`. Do not loosen private-route protections or training-crawler policy to pursue mentions. Being crawlable does not guarantee indexing, citation, recommendations or conversion.

## 3. Ownership, URLs and keyword intent

Each question has exactly one primary page and one permanent primary anchor. Secondary pages use a short contextual summary and link to that owner; they do not publish another full answer with the same question marker.

Search terms below are intent labels, not measured search volumes. Preserve existing page titles/canonicals unless section 7 explicitly calls for an adjustment. Do not insert every variant into headings.

| ID | Primary page | Anchor | Intent / query family |
|---|---|---|---|
| Q01 | `/cv-builder-no-subscription-uk` | `pay-once-cv-builder` | CV builder no subscription UK; one-off PDF |
| Q02 | `/pricing` | `free-vs-paid-cv` | free CV download; editor free vs PDF paid |
| Q03 | `/cv-builder-no-subscription-uk` | `cv-on-phone-or-ipad` | make CV on phone/iPad without laptop |
| Q04 | `/tools/cv-template-word-uk` | `edit-cv-without-word` | edit CV without Microsoft Word |
| Q05 | `/pricing` | `edit-and-redownload` | edit paid CV; download again |
| Q06 | `/pricing` | `one-payment-one-saved-cv` | one-off CV payment coverage |
| Q07 | `/cv-builder-no-subscription-uk` | `account-and-payment` | account/card before creating CV |
| Q08 | `/chatgpt-cv-to-pdf-uk` | `turn-draft-into-pdf` | ChatGPT CV to PDF UK |
| Q09 | `/chatgpt-cv-to-pdf-uk` | `ai-without-invented-facts` | AI CV generic wording; accurate achievements |
| Q10 | `/tools/job-application-pack-uk` | `tailor-cv-to-one-job` | tailor CV to job description |
| Q11 | `/tools/ats-score-checker` | `what-the-score-means` | is ATS score real; employer score |
| Q12 | `/tools/ats-score-checker` | `improve-a-low-score` | low ATS score what to change |
| Q13 | `/tools/job-application-pack-uk` | `job-advert-keywords` | job description keywords in CV |
| Q14 | `/canva-cv-alternative-uk` | `columns-and-parsing` | Canva CV ATS; two-column reading order |
| Q15 | `/cv-word-or-pdf-uk` | `choose-word-or-pdf` | CV Word or PDF UK |
| Q16 | `/shorten-cv-to-two-pages` | `one-page-or-two` | UK CV length; what to cut |
| Q17 | `/cv-personal-statement-uk` | `do-i-need-a-profile` | is CV personal statement necessary |
| Q18 | `/cv-no-experience-uk` | `first-cv-without-paid-work` | first CV no experience UK |
| Q19 | `/return-to-work-cv-uk` | `returning-after-childcare` | return to work CV childcare gap |
| Q20 | `/tools/cv-bullet-point-generator` | `achievements-without-numbers` | CV achievements without metrics/KPIs |
| Q21 | `/tools/ats-score-checker` | `remove-personal-details` | anonymise CV before AI review |
| Q22 | `/top-job-boards-uk` | `entry-level-and-graduate-sites` | UK entry-level/graduate job boards |
| Q23 | `/top-job-boards-uk` | `board-or-employer-website` | apply Indeed/LinkedIn vs directly |
| Q24 | `/contact` | `paid-but-cannot-download` | paid CV PDF download help |

The 17 edited content routes are the 15 distinct owners above plus `/tools/blank-cv-template-uk` and `/tools/first-job-cv-wizard-uk`. `/privacy` is an additional support-policy edit, not an SEO landing page. No new public routes are required.

## 4. Shared implementation design

### 4.1 New content registry

Create `lib/customer-questions.ts`. Export:

```ts
export type CustomerQuestionId =
  | "Q01" | "Q02" | "Q03" | "Q04" | "Q05" | "Q06"
  | "Q07" | "Q08" | "Q09" | "Q10" | "Q11" | "Q12"
  | "Q13" | "Q14" | "Q15" | "Q16" | "Q17" | "Q18"
  | "Q19" | "Q20" | "Q21" | "Q22" | "Q23" | "Q24";

export type CustomerQuestion = {
  id: CustomerQuestionId;
  ownerPath: string;
  anchor: string;
  question: string;
  answer: string;
};

export const customerQuestions: Record<CustomerQuestionId, CustomerQuestion>;
export function customerQuestionHref(id: CustomerQuestionId): string;
```

The declaration above is a contract, not code to paste without implementations. Populate all 24 entries using sections 3 and 5, import `site` for prices, and return `ownerPath + "#" + anchor` from the URL helper. Follow the repository's relative-import conventions for code loaded by Node's TypeScript test runner. Do not introduce a JSON loader, database, search endpoint, or client bundle containing all the content.

Create `components/customer-answer.tsx`, a server component:

```ts
type CustomerAnswerProps = {
  questionId: CustomerQuestionId;
  children: React.ReactNode;
  className?: string;
};
```

Render one `<section id={anchor} data-customer-question={id} aria-labelledby={`${anchor}-heading`}>`, an H2 with that heading ID, the registry's direct answer in a paragraph, then `children` containing the useful example/action. Apply `scroll-mt-24`, existing typography and spacing tokens. It must not add its own full-width container, CTA, schema, disclosure control, client state or fixed card chrome. This lets pages provide their normal layout around it. All primary answers are visible without opening accordions or running JavaScript.

Use this component once per owned question. If the current page already has an equivalent section, replace that section's wrapper/lead answer and keep its useful children; do not append a duplicate at the bottom. Existing generic H1s stay. Supporting pages link with `customerQuestionHref` and do not render the primary marker. For pages with several answers, place a small `nav aria-label="On this page"` after the intro linking to those sections. Do not add a global mega-FAQ.

### 4.2 Minimal shared component changes

| File | Change |
|---|---|
| `components/cv-guide.tsx` | Add optional `reviewed?: string` and `published?: string` ISO date props to `Guide`. Defaults preserve current `2026-09-06` behaviour. Article `dateModified` and visible `<time>` use reviewed; `datePublished` uses published/default original value, never the new review date. Add optional `reviewed` to `WorkedSection`, preserving its existing default. Use a deterministic UTC/en-GB date formatter. |
| `components/career-tool-page.tsx` | Add optional `afterToolContent?: ReactNode`; render immediately after the hero/tool section and before “Why this tool exists”. Use it only for first-job supplemental content. Existing consumers without it must be unchanged. |
| `components/editorial-guide-shell.tsx` | No rewrite. Retain existing shell, FAQ and CTA. Wrap new question blocks in the existing page-width layout. Change reviewed prop at the job-board page, not a global default. |
| `components/marketing.tsx` | Reuse `MoneyPageCta`, `FaqSection`, `RelatedLinksSection`, `ButtonLink`. No new global CTA or FAQ implementation needed. |
| `lib/analytics-placements.ts` | Add only the scoped placement constants in section 8. Preserve existing names. |

Use existing `GuideTable` for string-only comparisons. For a table requiring clickable URLs, implement a small page-local accessible table/list rather than casting React nodes to strings. On narrow viewports, stack cards or use a labelled local scroll region. Never hide essential columns.

### 4.3 Review dates

Create `lib/customer-content-review.ts` exporting a route-keyed map of ISO review dates for the 17 content routes and privacy once reviewed. Dates are explicit values committed at review time, not `new Date()` on requests/builds. The implementer sets the actual QA/review date; do not automatically reuse this spec's date if implementation happens later.

Use this map for the updated page's visible review label, any existing Article `dateModified`, and its sitemap `lastModified`. In `app/sitemap.ts`, use the map value when present and preserve each other route's current date/default, priority and frequency. Do not backdate a new review, change original publication dates, mark all guides reviewed, or refresh competitors' price-check dates without checking those prices.

Pages without Article schema do not need a new Article merely to show a review date. Use a small visible `<time>` near the new substantive content. Privacy uses the existing `LegalPage.lastUpdated` prop. Preserve author identity as WorkCV; do not invent a careers adviser or reviewer credential.

## 5. Exact answer copy and required supporting value

These are the initial publishable drafts. Modest editing for flow is allowed, but preserve every limitation and product distinction. Do not substitute filler. Each question's supporting requirement is mandatory unless equivalent useful content already exists and is retained in the owned section.

### Q01 — Which UK CV builder lets me pay once for a PDF without a subscription?

**Answer:** WorkCV lets you build and preview a UK CV free, then pay {price} once to download the PDF for that saved CV. There is no monthly subscription or automatic renewal. An account is required to save your CV. If you need a completely free file instead, use the separate editable Word template.

**Supporting value:** Retain the real sample PDF and product proof. Show the actual sequence: email-code login → build/preview → pay for this saved CV → download PDF. Link the free DOCX page and pricing scope anchors. This is a statement about WorkCV, not an unsupported “best in the UK” comparison.

### Q02 — Can I create and download a CV completely free, or is only the editor free?

**Answer:** WorkCV's blank Word template is free to download without an account or payment. You fill and format that document yourself. The online builder is separate: building and previewing are free after sign-in, while downloading the finished PDF costs {price} once for that saved CV. Choose the option that matches the file and help you need.

**Supporting value:** A two-option comparison with rows: cost, account requirement, editable format, who does formatting, export, repeat downloads. Free DOCX: £0, no WorkCV account, DOCX, visitor edits in a compatible editor, export depends on that editor, direct file remains free. Builder: {price} per saved CV PDF, account required, saved WorkCV document rather than downloadable DOCX, guided layout/preview, PDF, same paid saved CV can be edited/redownloaded. Put direct free download and clearly priced builder buttons beside their own options. Never make the free button lead through checkout.

### Q03 — How can I make and download a CV on my phone or iPad without a laptop?

**Answer:** Open WorkCV in your browser, sign in with your email code, and enter your CV details or import a supported PDF or DOCX. On the narrow layout, switch between Edit CV and Preview to check the pages. PDF download costs {price} for that saved CV. Your browser and device control where the downloaded file is saved.

**Supporting value:** Six numbered steps: sign in; enter details or `More` → `Import CV`; review all imported fields; use `Preview`; complete checkout only when ready; open/save the PDF and check the saved file. Explain that import takes a file, not pasted raw text. Include a screenshot of the real narrow editor with fictional content if a safe local fixture is available. Caption it accurately as a mobile-layout demonstration, not a real-device certification. Link Apple's [download help](https://support.apple.com/en-gb/102440): on iPhone/iPad, check Safari's download list or the Files app's Downloads location. Avoid claiming every device uses iCloud; location can differ. For other browsers, direct visitors to the browser's downloads list. Link Q24 if payment succeeded but the file is missing.

**Validation boundary:** Test responsive layout locally. Only say “tested on iPad/iPhone” if an actual device/browser test was performed and recorded. If unavailable, publish the code-verified workflow with the browser-dependent caveat, omit certification claims, and record that physical-device verification remains outstanding. Do not block all other pages for lack of a device.

### Q04 — How can I update my CV if I do not have Microsoft Word?

**Answer:** You can edit a DOCX in a compatible editor such as Google Docs without using the desktop version of Microsoft Word. Keep an unchanged copy first, then check headings, bullets and page breaks after editing. WorkCV's blank DOCX is a free starting point. Its separate guided builder is another option if you want a PDF rather than an editable Word download.

**Supporting value:** A short Google Docs workflow: keep a backup; upload the DOCX to Drive; open/edit it in Docs; replace content rather than adding screenshots of text; download the required file format; reopen the exported file and inspect every page. Link [official Office-file help](https://support.google.com/docs/answer/9406611?hl=en). Explain this uses Google's service/account, not WorkCV's free file download flow. Retain all useful existing Microsoft Word instructions. Show the actual blank document preview and direct download; do not say importing to WorkCV preserves the source Word layout.

### Q05 — Can I edit and download the same CV again after paying?

**Answer:** Yes. You can edit and redownload the same saved CV without paying again. Sign in to the same WorkCV account, open My CVs, and reopen the document you paid for. Make your changes and download its PDF again. The payment belongs to that saved CV, not every new document you create.

**Supporting value:** Three-step “reopen, edit, download” path with a `/my-cvs` link. Beside it, a warning that creating a new saved CV is different. Link Q24 for unexpected payment prompts. No `new=1` link in this help flow.

### Q06 — Does one payment cover one saved CV or every CV I create?

**Answer:** One payment unlocks PDF downloads for one saved CV. You can keep editing and downloading that same document without another payment. A separate new saved CV has its own payment requirement. For example, changing the wording in your existing paid CV is different from creating a second saved CV for another application.

**Supporting value:** Three explicit cases: revise paid document A → covered; download A again → covered; create document B → separate payment. Do not describe a duplicate button or workflow unless it actually exists. Link Q05 and the existing terms. Do not rename draft IDs or change entitlement logic.

### Q07 — Do I need an account or credit card before I start?

**Answer:** You need an email-code sign-in to use and save a CV in the WorkCV editor. You do not need to enter payment details just to build and preview it. Checkout comes when you choose the paid PDF download. If you only want the free blank Word template, you can download that separate file without a WorkCV account.

**Supporting value:** Distinguish the three stages: login, free editing/preview, paid download. Do not guarantee a particular checkout payment method. Link pricing and the free template; preserve an existing editor entry button rather than adding a competing hero.

### Q08 — How do I turn my ChatGPT CV draft into a properly formatted UK PDF?

**Answer:** First check the draft's facts. Then copy each section into its matching WorkCV editor field, or save a DOCX and import that file; PDF import is also supported. The import dialog does not accept pasted text. Review the imported details and final preview before downloading. Building and previewing are free after sign-in; the saved CV's PDF costs {price}.

**Supporting value:** Keep the existing route-choice table, import/editor/PDF screenshots, complete Alex Morgan CV and downloadable sample. Clearly distinguish manual field entry from file import and from using a separate word processor. Preserve PDF/DOCX size restrictions from the actual UI. Do not claim ChatGPT never creates files, and do not promise the original imported layout is retained.

### Q09 — Can I use AI to improve my CV without making it sound generic or inventing achievements?

**Answer:** Use AI to organise and clarify facts you can verify, not to supply missing experience. Give it your real responsibilities and the vacancy, then check every suggested claim against your records. Remove inflated language and unsupported numbers or skills. Keep wording you can explain at interview, and follow any employer instructions about AI-assisted applications.

**Supporting value:** Use this fictional Alex comparison, grounded in `retailAdminCv`:

- Generic: “Dynamic team player with excellent organisational skills and a proven track record of success.”
- Evidence-led: “Retail supervisor moving into office administration, with experience coordinating a 12-person rota, updating an Excel delivery tracker and replying to customer order enquiries.”
- Reject: “Reduced stock errors by 40% and became an expert Sage user.” Neither claim is present in the source CV.

Explain why the second is better: identifiable role, relevant tasks, verified scope. Provide an optional user prompt: “Rewrite this using only the facts I provide. Keep my job titles and dates. Do not invent numbers, qualifications, software skills or outcomes. Flag missing evidence as a question for me instead of filling it in.” This is visitor guidance, not a new AI endpoint. A checklist must cover dates, role names, qualifications, figures, software skills and interview defensibility.

### Q10 — How do I tailor my CV to each job without rewriting it from scratch?

**Answer:** Keep a factual master CV, then compare one vacancy with your existing evidence. Change the target role, profile, order of relevant skills and a few supporting bullets where the facts justify it. Keep job titles, dates and qualifications accurate. The application pack can suggest edits, but you should review them rather than copying every suggestion automatically.

**Supporting value:** Reuse Alex's source CV and the fictional Birch Office Services advert from `lib/content-checker-example.ts`. Show five steps: retain master; highlight requirements; match evidence; make two or three edits; check facts/format. Provide the requirement table in section 6.1. Explain the handoff precisely: profile, evidenced keywords and priorities transfer; bullet suggestions must be reviewed/copied to the correct job; cover letter/interview notes/follow-up email remain separate. Do not claim the complete CV is automatically rewritten or that handoff preserves paid entitlement for a new document.

### Q11 — Is an online ATS score the score an employer actually sees?

**Answer:** No. WorkCV's score is its own assessment of how clearly your supplied CV matches one vacancy. It does not reproduce an employer's applicant-tracking system or predict an interview. Parsing a file, assessing its contents and making a hiring decision are different steps. Use the explanations and evidence gaps, not the percentage as an employer pass mark.

**Supporting value:** Preserve the existing scoring-method explanation and weights. Put a short version beside the interactive result score: “WorkCV assessment — not an employer ATS score or interview prediction.” Link that note to this answer. Explain that pasted text cannot reveal the original file's columns, fonts or reading order. Do not change score weights, normalisation or prompts.

### Q12 — My ATS score is low. What should I actually change first?

**Answer:** Start with the explanations, not a target percentage. Check whether the vacancy's essential requirements are evidenced, make relevant experience easier to find, and replace vague claims with specific facts. If you genuinely lack a requirement, do not add it as a keyword. Decide whether to apply, clarify the requirement, or choose a better-fitting vacancy.

**Supporting value:** Extend `CheckerWorkedExample` rather than creating a competing fake AI result. Show the Alex/Birch three-action list in section 6.1. Preserve the missing Sage evidence and exact supporting quotes. Link the word/PDF guide for file checks and the application pack for edits. Never fabricate a before/after score uplift or imply every low score is fixable through wording.

### Q13 — Which words from the job advert should I include in my CV?

**Answer:** Use the employer's terminology when it accurately describes something you have done or can demonstrate. Connect each important term to a qualification, task or example instead of repeating a keyword list. If the advert asks for software you have not used, do not add it as a skill. Make the genuine match clearer without inventing one.

**Supporting value:** Use the evidence-to-keyword table in section 6.1, including a missing requirement row. Show a stronger factual Excel bullet and why it fits. No keyword-density target, white-text keywords or copied job-description block. Link Q11/Q12 for checking the result.

### Q14 — Can a Canva or two-column CV cause problems when an employer reads the file?

**Answer:** Some complex layouts can make text extraction or reading order less reliable, but that does not mean every Canva or two-column CV fails. Follow the employer's instructions and check the exported file. Can you select and copy its text in a sensible order, and are your name, contact details, headings and dates still clear?

**Supporting value:** A five-minute check: open PDF; select/copy all text into plain text; inspect name/contact information and section order; check dates align to the correct roles; simplify and repeat if needed. Add a tiny editorial reading-order demonstration labelled “Illustration of a possible extraction problem; not an ATS test”: expected “Experience → role/date → bullets; Education → course/date”; possible mixed order “Experience → Education → role → course → date → date”. Do not label it as measured Canva output. Link Greenhouse's vendor documentation and explain its scope: it documents problems including columns/images/headers/tables; it does not establish universal automatic rejection. Keep the existing product comparison honest.

### Q15 — Should I send my CV as Word or PDF when applying in the UK?

**Answer:** Send the format the employer asks for. If both are accepted and no preference is given, a text-based PDF can preserve the layout; keep an editable master as well. Use DOCX when it is requested. Check the final file rather than assuming its extension guarantees readability. WorkCV's paid builder exports PDF; its separate free template is DOCX.

**Supporting value:** Retain the existing six-row format decision table and extraction checklist; make it the body of Q15. It must cover PDF requested, DOCX requested, either accepted, portal restrictions, recruiter editable-copy request, and scanned/image-only files. Do not add another contradictory Word/PDF table elsewhere. Link directly to the free DOCX when Word is required.

### Q16 — Should my UK CV be one page or two, and what should I cut?

**Answer:** Use enough space to show relevant evidence without repeating yourself. A first CV may fit on one page; a more experienced applicant may need two. Specialist or academic applications can have different requirements. Cut repeated duties, generic claims and irrelevant detail before shrinking the text. Keep dates, role context and evidence the employer needs.

**Supporting value:** Add a three-case table: first job → prioritise education/projects/responsibilities; experienced non-academic → prioritise recent relevant achievements and condense older roles; specialist/academic → follow the required format rather than forcing this rule. Keep `longerCv`, `shorterCv`, six existing edits and computed word counts. Say reduced word count, not “proved three pages became two”, unless the same rendered document was actually measured. Do not remove chronology to hide gaps or reduce font size below readable settings.

### Q17 — Do I need a personal statement at the top of my CV?

**Answer:** A short profile is useful when it quickly explains your relevant experience, target role or career change. It is not a place for generic claims that repeat the rest of the CV. If it adds no useful context, shorten it or leave it out unless the application asks for one. A supporting statement requested separately is a different task.

**Supporting value:** Place a keep/rewrite/remove decision before the existing advert walkthrough. Reuse the generic and evidence-led Alex profile from Q09, but do not repeat the whole AI lesson. Keep the existing role examples, `#examples`, `#advert-walkthrough`, sample proof and current useful FAQs. Link to Q09 only for AI-specific factual checking.

### Q18 — What can I put on my first CV when I have no paid work experience?

**Answer:** Use genuine evidence from education, projects, volunteering, clubs and responsibilities. Explain what you did and which skills it demonstrates, even if it was unpaid. Label those activities honestly rather than turning them into job titles. Include relevant qualifications and availability, and tailor the examples to the role. You do not need to invent a work history.

**Supporting value:** Publish the complete fictional Jordan example in section 6.2, with three annotations connecting tasks to evidence. Offer the first-job wizard after the example. On the wizard page, keep the actual working form above explanatory content, use the optional `afterToolContent` slot for a brief example/limitations, and link to this primary answer. Do not call the wizard an AI tool or promise it invents experience.

### Q19 — How do I write a CV when returning to work after looking after children?

**Answer:** Keep the timeline honest and focus on evidence relevant to the job you want now. A brief “Career break — childcare” entry can explain the period without sharing private family details. Include any genuine recent learning or volunteering separately from paid employment. Do not turn caring responsibilities into an invented professional role or hide the dates of earlier work.

**Supporting value:** Retain the complete `returnerCv` and `ReturnerExample`. Show its timeline: paid office administrator August 2017–December 2021; childcare break January 2022–present; volunteer booking helper March 2026–present. Explain that volunteering can overlap a career break without becoming paid employment. Show an appropriate factual admin profile and point to relevant booking/email evidence. Do not imply childcare itself qualifies someone for regulated work.

### Q20 — How do I write achievement bullets when I was never given targets or sales numbers?

**Answer:** A useful bullet does not need a percentage. Describe the task, the context and what your work helped accomplish, using facts you can support. Scope, frequency, complexity and the people you helped can make it specific. If no reliable number or outcome is known, leave it out rather than guessing or turning an ordinary duty into an exaggerated achievement.

**Supporting value:** Keep the working generator and add the three fully specified before/after examples in section 6.3. State that numbers are optional and a clear responsibility is better than an invented measurable result. Generated suggestions remain drafts to check. Do not change the generator's API or validation for this editorial task.

### Q21 — What personal details should I remove before asking AI to review my CV?

**Answer:** For a wording or job-fit review, replace your name, email, phone number and full address with placeholders. Remove identification numbers, referee contact details and private medical or family information. Keep the relevant job history and evidence needed for the review. WorkCV's AI checker sends the submitted text to its processing service; read the privacy explanation before using real personal data.

**Supporting value:** Show the sanitised example in section 6.4, a specific processing note beside the checker inputs, and a link to `/privacy`. Add the narrow privacy-policy clarification described there. Do not say “anonymous”, “never stored”, “zero retention”, “never leaves your browser” or “not used for training” based only on `store: false` or `Cache-Control: no-store`. Provider/account retention and infrastructure logs require separate evidence. The first-job wizard has a different, local draft-generation path; do not paste the checker privacy description onto every tool.

### Q22 — Which UK job sites should I use for entry-level or graduate roles?

**Answer:** Choose a small set that fits your target role instead of checking every board. For graduate roles, start with a graduate-focused service such as Prospects; for STEM roles, consider Gradcracker. Add one broad board and check the careers pages of employers you want to join. Compare actual requirements and application routes, not just the “entry-level” label.

**Supporting value:** Keep the existing real general/specialist board links. Add the five-row shortlist and worked search plan in section 6.5. Include official links, audience, a useful filter/search example and limitations. Review destination pages during implementation; if a link is inaccessible, mark it unverified in QA and do not fabricate a test result. No scraped vacancies, live vacancy counts, affiliate rankings or claims one board has the highest success rate.

### Q23 — Is it better to apply through Indeed or LinkedIn, or on the employer's website?

**Answer:** Follow the vacancy's application instructions. A job board can help you discover a role, while the employer's careers page can help confirm that it is genuine and still open. If both routes lead to the same vacancy, choose the instructed route and avoid duplicate applications unless requested. There is no universal rule that one route gives you a better chance.

**Supporting value:** Show a fictional application check: record employer/title/reference/location/deadline from board; independently visit employer's official careers page; match reference and details; follow the stated route; record submission. If no matching posting exists, check directly through official employer contact details; absence alone does not prove fraud. Do not send visitors to unverified recruiter contact details or tell them all board applications are inferior.

### Q24 — I paid for my CV but cannot download it. What should I do?

**Answer:** Sign in to the same WorkCV account and reopen the saved CV you paid for from My CVs. If the editor is still confirming payment, use Check again before trying another payment. Check your browser's downloads too. If it still fails, contact WorkCV with your receipt email, payment time and a description of the problem. Do not pay again just to troubleshoot.

**Supporting value:** Put troubleshooting before sales content. Steps: verify account; reopen original document; check pending state; retry PDF download/check browser downloads; contact support. Link `/my-cvs`, not `/editor?new=1`. Request receipt/order reference if available, payment time and timezone, browser/device, visible error, and a redacted screenshot if helpful. Never request a card number, password, email login code or full CV. Keep refund-policy link and the existing two-working-day aim. Add a short pricing-page link to this answer, not a second full support article. Remove/replace any support CTA that accidentally starts a new document.

## 6. Worked-example content contracts

### 6.1 One consistent source CV and vacancy for Q09–Q13

Reuse `lib/content-cv-examples.ts` (`retailAdminCv`) and `lib/content-checker-example.ts` (`checkerExampleInput`, `checkerExampleClassification`). Use imports rather than duplicating the full Alex CV in a new constant. The classification is an editorial fixture, not a captured live provider response.

| Vacancy requirement | Source evidence | Action / truthful wording |
|---|---|---|
| Excel records | “Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.” | Put this near relevant admin evidence; do not upgrade it to advanced Excel or invent error reductions. |
| Customer email replies | “Replied to customer order enquiries by email, recording the agreed next step in the order log.” | Use customer enquiries/email/order log language naturally in context. |
| Scheduling | “Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.” | Connect rota coordination to scheduling; keep the actual retail job title. |
| Sage, stated as essential in fictional advert | No supporting evidence supplied | Do not insert Sage into skills. Confirm whether the candidate has genuine unlisted evidence; otherwise acknowledge the gap and assess suitability. |

The three priorities for Q12:

1. Check the essential Sage requirement first. Wording cannot repair a genuine qualification/skill mismatch.
2. Surface the supported Excel/customer-email evidence and clarify its purpose. Add outcomes only if known.
3. Replace a generic profile with the factual retail-to-admin profile, retaining real titles and dates.

Keep existing deterministic scoring through `scoreCvFit` where used. No arbitrary “49 → 92” demonstration. If the example UI displays a numeric score, it must come from the actual scorer/fixture and clearly say illustrative.

### 6.2 Complete no-paid-work example for Q18

Add this example to `lib/customer-answer-examples.ts` as structured strings, then render with existing `CvTextExample`. Label all candidate, school and organisation details fictional. This is a CV example, not a claim that a real person got hired.

```text
JORDAN REED
Leeds | jordan.reed@example.com
Target role: Retail assistant

PROFILE
School leaver seeking a first retail role, with experience welcoming visitors at
school events, organising a group project and sorting donations as a volunteer.
Comfortable following instructions, checking details and asking for help when needed.

RELEVANT SKILLS
Customer communication: welcomed visitors and explained where activities were held.
Organisation: maintained a shared task list for a school group project.
Teamwork: agreed responsibilities with classmates and helped prepare a presentation.
Accuracy: sorted donated items using the community group's category guidance.

EDUCATION
Northside School, Leeds | September 2021–June 2026
GCSEs: English Language 5, Mathematics 5, Combined Science 5–5,
Business 6, Geography 5 and Art 5.

PROJECTS AND RESPONSIBILITIES
School enterprise project | January–March 2026
Maintained the group's task list and checked progress before class presentations.
Compared supplier information and explained the group's choice in the final presentation.

School open-evening helper | October 2025
Welcomed visitors, gave directions and referred questions to the relevant teacher.
Helped arrange display materials and returned them after the event.

VOLUNTEERING
Cedar Community Group donation helper | April–June 2026
Sorted donated items into agreed categories and asked the coordinator about unclear items.
Kept the sorting area organised and passed completed boxes to other volunteers.

AVAILABILITY
Available for part-time work; can discuss shifts required by the role.
```

Annotations: visitor help → customer communication; task list → organisation; sorting with escalation → accuracy and following procedures. Explain that the fictional grades/dates are not a template to copy as personal facts. Visitors replace every detail with their own. Do not include DOB, photo, full address, references' contact details, National Insurance number or unearned certificates.

The first-job wizard's existing “Try example” uses another fictional person. It may remain; do not silently merge that person's identity/history with Jordan. Show Jordan's content on the guide and a short independent explanation/link on the tool page.

### 6.3 No-metrics examples for Q20

Store the following as a three-item array in `lib/customer-answer-examples.ts`. Render original task, known facts, improved bullet, and why no metric was added.

| Original | Known facts | Improved bullet |
|---|---|---|
| “Answered emails.” | Customer order enquiries; shared inbox; next step recorded in order log | “Replied to customer order enquiries from the shared inbox and recorded the agreed next step in the order log.” |
| “Helped with deliveries.” | Compared delivered items to delivery notes; discrepancies passed to supervisor | “Checked delivered items against delivery notes and flagged discrepancies to the supervisor before stock was put away.” |
| “Did admin for a community group.” | Maintained booking list; sent reminders; unresolved queries passed to organiser | “Updated the community group's booking list, sent agreed reminders and referred unresolved booking queries to the organiser.” |

All are fictional illustrative facts. No made-up speed, revenue, satisfaction or error-reduction claim. Explain that a verifiable responsibility can be strong evidence even without an outcome metric.

### 6.4 Privacy example and processing disclosure

Show an anonymised example without first exposing a realistic full private record:

```text
[NAME]
[EMAIL] | [PHONE] | [TOWN OR REGION]
Retail supervisor, [EMPLOYER A] | September 2022–present
Updated the Excel delivery tracker and checked discrepancies against delivery notes.
```

Explain that role titles, durations and factual tasks can remain useful; placeholder employer names are an option for confidential material. Do not send private third-party contact information. Warn that context can still identify someone, so replacing names is not guaranteed anonymity.

In `components/ats-score-checker.tsx`, keep the existing `#privacy-note` anchor and add a link to Q21 plus `/privacy`. Use this narrow disclosure, adjusted only if code tracing establishes a different current path:

> To generate an assessment, the CV text and job advert you submit are sent to WorkCV's server and then to OpenAI for processing. Remove contact details and sensitive information you do not need reviewed. This text review does not inspect the original document layout. Read our privacy policy before submitting personal data.

Add an “AI-assisted career tools” section in `app/privacy/page.tsx` explaining these particular AI tools process supplied text via WorkCV and OpenAI. Explain that choosing an editor handoff may carry selected text into the editor and that saved CV content follows the existing account-storage policy. Do not imply simply reading a page transmits a CV. Preserve the existing analytics/payment/research-email policy sections.

Before finalising this section, trace the current three routes and libraries: `app/api/tools/cv-fit-assessment/route.ts`, `app/api/tools/job-application-pack/route.ts`, `app/api/tools/cv-bullet-points/route.ts`, `lib/cv-fit-assessment.ts`, `lib/job-application-pack.ts`, `lib/cv-bullet-point-generator.ts`, plus the actual handoff implementation. Current checker/pack calls set `store: false`, while error logging includes error messages. These facts do not prove zero retention throughout the system. Do not add an unverified retention period or make new legal commitments. If a logging/privacy defect is discovered, document it separately; do not quietly expand this content task into an infrastructure change.

### 6.5 Entry-level/graduate shortlist for Q22

Use these official starting URLs and explain the scope, without ranking them by an unmeasured outcome:

| Service | Official URL | Who it helps | Useful action | Limitation |
|---|---|---|---|---|
| Prospects | https://www.prospects.ac.uk/graduate-jobs | Graduates exploring relevant graduate opportunities | Start with desired role/sector and location; inspect eligibility and closing date | Not every first job is a graduate scheme |
| Gradcracker | https://www.gradcracker.com/ | STEM students/graduates | Check discipline and opportunity type, then employer requirements | STEM focus; not a general retail/admin board |
| Indeed UK | https://uk.indeed.com/ | Broad role discovery | Search an actual title, e.g. “junior administrator”, plus town and a recent-posting filter if available | “Entry level” does not guarantee no experience requirement |
| LinkedIn Jobs | https://www.linkedin.com/jobs/ | Broad discovery and employer research | Search role/location and inspect the application destination | Listings can redirect; account requirements/features may vary |
| Employer careers pages | Navigate from the employer's verified official website | Applicants targeting particular employers | Match role/reference/location and apply by stated route | Vacancies may be spread across separate employer systems |

Worked search plan, explicitly illustrative: a Leeds graduate seeking junior operations/admin work chooses Prospects + one broad board + three target employers. Searches include “graduate operations”, “junior administrator” and “operations assistant”. Use location and acceptable commute, read essential requirements, record deadline/reference/application URL, and review a small shortlist. Do not promise these exact searches currently return vacancies.

Keep existing specialist links such as NHS Jobs, Civil Service Jobs and apprenticeships, with their actual jurisdiction limits. Do not present an England-only route as UK-wide. Existing broad board comparisons stay; avoid repeating the same full rows in multiple places.

## 7. Page-by-page integration instructions

For every page: read the full current component first; preserve canonical URL, working interactions, useful existing examples and internal anchors. Placement is relative to semantic sections, not brittle line numbers.

| File | Required placement and edits | Completion evidence |
|---|---|---|
| `app/cv-builder-no-subscription-uk/page.tsx` | Q01 immediately after hero/in existing “What you receive when you pay once” material; keep sample proof. Q07 next to free-start/payment stages. Q03 before late sales CTA. Consolidate repeated subscription FAQs into one concise residual FAQ if needed. Keep distinct product questions, not five paraphrases of monthly billing. | All three owner anchors; real sample link; honest login/price; phone steps; no duplicate Q01 block. |
| `app/pricing/page.tsx` | Q02 comparison after main price card and before competitor comparison. Q05 and Q06 together after it. Add short Q24 support link. Keep current competitor price checks and sample proof; do not re-date them without verifying. | Visitor can get free DOCX directly, understand document scope, reopen a paid CV and find support. |
| `app/tools/blank-cv-template-uk/page.tsx` | Keep immediate actual DOCX download, real preview and instructions. Add short “Need a guided PDF instead?” explanation linking Q02 and money page below free-file value. | No signup/paywall introduced; DOCX content/preview remains genuine; no full duplicate Q02. |
| `app/tools/cv-template-word-uk/page.tsx` | Add Q04 after introductory download choice, before detailed Word-only steps. Preserve existing Word formatting guidance. | Google Docs option, official help, backup/export checks, free download, paid-format distinction. |
| `app/chatgpt-cv-to-pdf-uk/page.tsx` | Make supported-entry section Q08 near top. Add Q09 around factual-check section. Preserve three proof screenshots, full example and sample PDF. | Both anchors, actual import limitations, facts-only before/after, contextual money-page link. |
| `app/tools/job-application-pack-uk/page.tsx` | Keep interactive tool in hero. Q10 below it; Q13 owns the keyword-evidence table, linked from Q10 rather than duplicated. Keep actual result outputs and handoff. | Evidence table includes missing Sage; handoff limits match code; tool remains usable. |
| `app/tools/ats-score-checker/page.tsx` | Below tool, Q11/method explanation; Q12 wraps existing worked example and priorities; Q21 near privacy guidance. In client component add score-adjacent note and privacy links only. | No scorer/prompt changes; 3 anchors; score disclaimer visible after result; privacy before submission. |
| `app/canva-cv-alternative-uk/page.tsx` | Put Q14 after existing meaningful comparison and before conversion footer. Remove conflicting blanket parsing claims if any. | Select/copy/read-order instructions; primary vendor source; illustration honestly labelled. |
| `app/cv-word-or-pdf-uk/page.tsx` | Turn current decision/table section into Q15. Retain text extraction and file checks. | Existing six cases covered once, free DOCX link when needed, PDF limitation clear. |
| `app/shorten-cv-to-two-pages/page.tsx` | Add Q16 before current before/after. Keep six edits, full versions, computed word counts, chronology. | Career-stage distinctions and no unverified measured-page claim. |
| `app/cv-personal-statement-uk/page.tsx` | Q17 before `#advert-walkthrough`; keep `#examples`, useful role examples and sample proof. | Clear keep/rewrite/remove decision, factual contrast, no loss of existing depth. |
| `app/cv-no-experience-uk/page.tsx` | Q18 after hero and before generic tips; reuse any existing equivalent complete example only if it meets section 6.2's evidence standard. Default is the Jordan example. Link wizard after the example. | Complete usable example, truthful unpaid labels, qualifications caveat, functional wizard link. |
| `app/tools/first-job-cv-wizard-uk/page.tsx` | Add supplemental example guidance through `afterToolContent`; link Q18. Keep existing form and local generation. | No second primary Q18 marker; form/generation/copy/handoff still work; no AI processing claim. |
| `app/return-to-work-cv-uk/page.tsx` | Wrap/extend returner example with Q19; keep actual timeline and full CV. | Gap plus overlapping volunteer work explained; no fictional paid childcare role. |
| `app/tools/cv-bullet-point-generator/page.tsx` | Keep generator in hero; Q20 and examples below it, before MoneyPageCta. | Three known-facts examples, numbers optional, generator unaffected. |
| `app/top-job-boards-uk/page.tsx` | Keep existing general/specialist boards. Q22 after broad comparison; Q23 beside existing verification/application guidance. Use existing editorial shell/CTA. | Real official links, graduate shortlist, fictional search workflow, no fake jobs/counts. |
| `app/contact/page.tsx` | Q24 near top, before generic contact links. Replace any new-document recovery CTA with `/my-cvs`. No sales block required. | Five-step recovery, receipt details not secrets, do-not-repay warning, policy/support access. |
| `app/privacy/page.tsx` | Add the scoped AI-assisted tools section from 6.4; update actual reviewed date. | Processing statement agrees with code; unrelated policy remains intact. |

### Metadata instructions

- Keep current canonical paths and established H1 intent. No year added merely to imply freshness.
- On the Word guide only, broaden title to `Edit a UK CV With or Without Microsoft Word | WorkCV`; description: `Edit a UK CV in Word or a compatible editor, check formatting and export the right file. Includes a free DOCX template and a guided PDF option.` Ensure rendered title does not append WorkCV twice through the layout template.
- On other pages, retain current relevant titles. Update a description only if it contradicts the new facts, hides a material paid limitation, or describes missing content. Include substantive intent, not keyword lists.
- Preserve Open Graph/canonical consistency. No additional canonical for a question anchor. Anchors are not new pages.
- Do not reclassify support/privacy as acquisition articles or add Product/Review/AggregateRating markup to examples.

### FAQ and structured data deduplication

Primary answers are full visible sections, not another FAQ farm. For each modified page, remove equivalent repeated FAQ items or reduce them to genuinely different questions. Preserve remaining FAQ data and its renderer together so schema cannot drift from visible answers. If an existing FAQ item remains, generate its visible text and schema from the same array. Do not add a separate FAQPage schema for each `CustomerAnswer`. Do not emit questions whose answers are absent from the page. Existing Article/WebApplication/Breadcrumb schemas stay appropriate to the page. Escape `<` when serialising JSON-LD, following the existing safe pattern.

## 8. Internal links, conversion and attribution

### 8.1 Routing rules

Use `commercialRoutes.moneyPage` from `lib/site.ts` for the commercial explanation page. Use existing editor/handoff routes for real editor actions. Do not change tool handoff destinations to generic links that discard user work.

| Context | First useful action | Commercial follow-up |
|---|---|---|
| Free document / no Word | Download or edit the actual free DOCX | “Prefer a guided editor and PDF preview?” → money page; disclose {price} PDF. |
| AI formatting | Follow supported entry/import and inspect sample | “Build and preview your CV; {price} for this saved CV's PDF” → money page or existing editor action. |
| Tailoring / score | Understand evidence and apply supported edits | Preserve real tool handoff; the existing page CTA explains the paid PDF. |
| First CV / returner / bullets | Read complete example or use the tool | “Use your checked wording in the CV builder” → money page, with pricing nearby. |
| Job boards | Choose a board and verify one vacancy | Application pack/checker first; existing money-page CTA after useful guidance. |
| Paid download problem | Reopen the paid saved CV / contact support | No upsell or new-document CTA. |

Retain existing functioning `MoneyPageCta` blocks. Do not add another large sales panel just because an answer was added. Where `Guide` already supplies an action plus MoneyPageCta, make the action task-specific (e.g. free file/checker) and retain one commercial explanation block. Add at most one new inline money-page link per substantive worked-example group, and none inside every short answer. Do not link the money page to itself.

### 8.2 Scoped tracking additions

Reuse `TrackedLink`/`ButtonLink` and existing `marketing_cta_clicked`. Add the following constants only when the corresponding new link is present. Existing CTAs retain their current placement IDs.

| Constant in `analyticsPlacements` | Value | Link |
|---|---|---|
| `customerQ02FreeDownload` | `customer_q02_free_download` | Pricing comparison → `/api/tools/blank-cv-template` with `download` |
| `customerQ02Money` | `customer_q02_money` | Pricing comparison → money page |
| `customerQ03Support` | `customer_q03_support` | Device workflow → Q24 |
| `customerQ04FreeDownload` | `customer_q04_free_download` | No-Word workflow → free DOCX |
| `customerQ08Money` | `customer_q08_money` | Formatting example → money page |
| `customerQ18Wizard` | `customer_q18_wizard` | No-experience example → first-job wizard |
| `customerQ22Pack` | `customer_q22_pack` | Job-board workflow → application pack |
| `customerQ24MyCvs` | `customer_q24_my_cvs` | Support recovery → `/my-cvs` |

Use ordinary links for source citations, local anchors and most related-reading links. Do not add internal UTM parameters: preserve the original acquisition source. Do not send CV text, prompts, names, email addresses, document IDs or error screenshots in event metadata. Existing placement validation is lower-case alphanumeric/underscore, 3–80 characters. These values comply.

Do not add an event on every question view or accordion open. Existing page/tool/editor/payment/PDF events and these links are enough for the first iteration. A download-link click is not proof of a completed download; report it as a click. Tool completion is not equivalent to a paid conversion. Prevent nested tracked links or double handlers firing the same event twice.

## 9. Measurement, future topics and external trust

### 9.1 Baseline and after-launch report

Create `docs/CUSTOMER_QUESTIONS_QA.md` during implementation. Record commit/build under test, review date, routes, checks, evidence paths and unresolved external limitations. Store aggregate reporting only, not buyer details, CVs or secrets.

Baseline: if configured read-only access exists, capture the previous 30 days of existing growth reporting and Search Console page/query metrics. Use `npm run report:growth -- --days=30` in its existing configured environment; do not print environment secrets or provision credentials. If unavailable, explicitly record “baseline unavailable” and continue implementation; do not invent zero values or run a schema migration just to get a report.

Track these separately:

- Acquisition: impressions/clicks and queries for the 17 existing routes, by relevant country/device where available.
- Value: actual tool starts/completions; free-template/sample clicks as clicks, not completed outcomes.
- Commercial journey: content/money-page visits → editor/login milestones → checkout → paid order/PDF.
- Attribution: source and landing page, using checkout-time attribution where recorded; label legacy fallback separately. Keep direct/unknown as unknown rather than attributing it to AI.

Use existing reports rather than building a dashboard/database. If a desired cut is absent, document that limitation; do not infer a per-question paid-conversion rate from a page-level report. Compare equivalent windows after launch and account for low counts, seasonality and other releases. Review crawl/query coverage after a few weeks and conversion after a longer comparable window. No claimed uplift without observed data.

### 9.2 Manual AI observation sample

Add `docs/CUSTOMER_QUESTIONS_MEASUREMENT.md` with a log template: date/time; service/model if shown; browsing mode; exact prompt; WorkCV mentioned yes/no; linked yes/no; cited URL(s); apparent inaccuracies; screenshot/reference; notes. Use the same ten non-branded prompts when sampling:

1. “Which UK CV builder lets me pay once to download a PDF without a subscription?”
2. “How can I make a CV on an iPad without Microsoft Word?”
3. “Where can I download a genuinely free editable UK CV template?”
4. “How do I turn a ChatGPT CV draft into a well-formatted UK PDF?”
5. “How do I tailor my CV to a UK job advert without inventing skills?”
6. “Does an online ATS score tell me what the employer will see?”
7. “Should I send a Word or PDF CV for a UK job?”
8. “What should I put on a first CV with no paid work experience?”
9. “How do I explain a childcare career break on my CV?”
10. “Which UK job sites should a graduate use, and should I apply directly?”

This is a small observational sample, not AI market share or a citation guarantee. No scheduled monitor is part of implementation. Do not claim a source list reveals every influence on an AI answer.

### 9.3 Repeatable future-topic intake

Add a section to the measurement document with this intake template: observed question; dated demand evidence and link/export; intent; existing owner URL; authoritative answer source; unique example/tool value; natural next action; claim/maintenance risks; priority; decision. A trend must pass all of these gates before becoming a page:

1. Relevant to a UK jobseeker problem WorkCV can genuinely help with.
2. Actual question/demand evidence, not a random rising keyword unrelated to the product.
3. Existing-page fit checked first; consolidate related questions rather than cannibalising URLs.
4. A useful answer plus an original example, validated comparison, real file or functioning tool.
5. A trustworthy source and an owner/review trigger for facts that can change.
6. A natural next action and a measurable signal; not necessarily an immediate sale.

Default to adding a section to an existing owner. A new URL needs a distinct task and enough unique value to stand alone. Do not create a new trend cluster, new tools or routes in this implementation merely because this intake process exists. The old Google Trends CSV is not reanalysed by this spec; future trend claims require a fresh, dated analysis.

### 9.4 External corroboration: planning only

The measurement document should include a factual brand sheet: WorkCV; official URL; UK CV builder; email-code account; build/preview free; one-time price from configuration; PDF for one saved CV; separate free DOCX; support URL; real example URLs. This is for later profile consistency work, not a reason to edit external accounts now.

Maintain a candidate-publication list only when a real relevant editorial source is found. Record fit, guidelines, evidence offered and disclosure requirements. No fabricated customer reviews, self-authored “independent” rankings, purchased undisclosed endorsements, or unsolicited promotional replies. In particular, the researched UKJobs CV-advice thread prohibits solicitation. External messages, profile changes and submissions are not authorised by this implementation spec.

## 10. Build sequence and checkpoints

Each checkpoint is a verification point, not an instruction to pause and ask the user after every phase. Continue through all safe, in-scope tasks; report genuinely unavailable external checks accurately.

### Task 0 — Baseline and preservation

- [ ] Read repository instructions and inspect current git status/diff before editing.
- [ ] Inventory the 17 pages, privacy, shared components and product contracts in section 2.
- [ ] Preserve unrelated existing work. At spec preparation, there are dirty package/README/environment files and untracked MCP, distribution, research, notes and temporary assets. Recheck rather than assuming this list is exhaustive.
- [ ] Capture baseline checks and any pre-existing failures in the QA document. Do not reset/reformat the repository.
- [ ] Record source access dates and current product facts; inspect private data only if required and do not copy it into docs.

**Checkpoint:** scope known, no unrelated edits lost, no proposed product claim contradicted by code.

### Task 1 — Shared content infrastructure

- [ ] Add registry, `customerQuestionHref`, `CustomerAnswer`, example fixtures and route review-date map.
- [ ] Add only the backward-compatible `Guide`/`WorkedSection` date props and CareerToolPage slot described above.
- [ ] Add unit checks for 24 unique IDs, valid owner paths, unique owner/anchor pairs, nonempty answers and valid links.
- [ ] Ensure registry can be loaded by the existing Node test runner without Next aliases breaking imports.

**Checkpoint:** type check succeeds for the new code; existing consumers without new props retain their output/behaviour. Do not mark empty example placeholders as complete.

### Task 2 — Commercial clarity and paid recovery

- [ ] Money page: Q01/Q03/Q07.
- [ ] Pricing: Q02/Q05/Q06 plus Q24 link.
- [ ] Free DOCX and Word guide: supporting Q02 and owned Q04.
- [ ] Contact: Q24 and safe original-document route.
- [ ] Add the specific tracked links, remove redundant subscription copy, preserve samples and existing entitlement.

**Checkpoint:** free file is genuinely downloadable, price visible before paid flow, account vs payment clear, same-document vs new-document clear, paid support does not create another CV.

### Task 3 — AI drafting, tailoring, ATS and privacy

- [ ] ChatGPT guide: Q08/Q09 and preserved proof assets.
- [ ] Application pack: Q10/Q13 plus requirement/evidence example.
- [ ] Checker: Q11/Q12/Q21, result disclaimer, input privacy note, preserved real scorer.
- [ ] Privacy policy: source-code-grounded processing clarification; no broad unsupported retention claims.
- [ ] Verify real result/handoff copy matches the fields actually transferred.

**Checkpoint:** Sage remains unsupported, no fabricated result or score promise, no feature regressions, no sensitive tracking payloads. Mock tests are labelled mock; they are not called live-provider QA.

### Task 4 — Application-quality guides and tools

- [ ] Canva Q14, format Q15, length Q16, profile Q17.
- [ ] No-experience Q18 and first-job supplemental content.
- [ ] Returner Q19; no-metrics Q20.
- [ ] Preserve old anchors, complete examples, chronology and working tool controls.

**Checkpoint:** visitors receive substantive examples and practical decisions; no misleading career history, parsing guarantee or measured page-count claim.

### Task 5 — Job-board utility

- [ ] Q22 shortlist, official links and worked search plan.
- [ ] Q23 route-verification example and clear application instructions.
- [ ] Preserve general/specialist tables and jurisdiction labels.
- [ ] Add useful application-pack transition, retain one existing commercial CTA.

**Checkpoint:** page actually links to usable job services and helps choose/search/verify, without inventing job listings or success rates.

### Task 6 — Technical consistency and reporting documents

- [ ] Deduplicate visible FAQs and keep their schema in sync.
- [ ] Apply actual review dates only to reviewed routes/sections; preserve publication dates.
- [ ] Update sitemap dates from the route map; preserve unrelated routes.
- [ ] Check canonical metadata, robots/sitemap/llms links without changing crawler policy.
- [ ] Complete measurement/intake/brand-sheet documentation and the implementation URL list.

**Checkpoint:** one owner per question; no schema-only answers; no new acquisition routes; conversion tracking preserves original source.

### Task 7 — Verification and final review

- [ ] Run section 11 checks, inspect screenshots and repair failures.
- [ ] Review the full diff against the 24-question matrix and all product guardrails.
- [ ] Complete the QA record with actual outcomes and limitations, not “should pass”.
- [ ] Report completed work, tests run, unresolved checks, changed URLs and deployment status.

**Checkpoint:** no unexplained missing question, placeholder text, dead CTA, unsupported claim or hidden failure. Do not declare deployed merely because local checks pass.

## 11. Verification specification

### 11.1 New automated checks

Create `tests/customer-questions.test.ts` using the repository's current Node test style. Test contracts, not the mere presence of this spec's wording in source files:

1. Exactly Q01–Q24 exist; ID matches key; every owner is a current route; anchors are unique on each owner.
2. `customerQuestionHref` gives expected owner+anchor for representative single/multi-question pages and all entries pass shape validation.
3. Commercial answers contain the configured price, not a conflicting hard-coded runtime value. Q05/Q06 distinguish same saved document from a new one.
4. New fixture data labels fictional examples and contains no unsupported Sage skill or invented metric uplift; existing scorer/example safeguards remain intact.
5. Added placement constants are unique, within accepted format/length and actually used.
6. Review map contains only this implementation's reviewed routes, and unrelated sitemap dates remain unchanged. Compare against the baseline snapshot rather than asserting every date equals today.

Create `scripts/verify-customer-questions.mjs` by reusing the browser-launch/base-URL conventions of `scripts/verify-content-guides.mjs`, not by introducing a new browser dependency. Support `CONTENT_BASE_URL`; default local port 3100. Do not reuse its asset-regeneration mode. The new verifier must not write to `public`, mutate production data, send emails, charge payments or invoke paid AI APIs.

Browser checks for all 17 content routes plus privacy:

- HTTP success, exactly one H1, canonical resolves to the correct public URL.
- Every owned question appears once with the expected visible H2, answer and working anchor. Supporting pages contain relevant owner links, not duplicate primary markers.
- Each primary section has meaningful supporting content beyond the short answer (table/list/example/steps/links specified above). This needs human review too; a child-count assertion is insufficient.
- Server-rendered HTML contains the answers; no-JavaScript browsing can read them and follow ordinary links. Interactive tool generation may still require JavaScript.
- JSON-LD parses; FAQ entries match visible FAQ text; no duplicated competing FAQPage blocks; Article dates agree with the actual reviewed page.
- No whole-page horizontal overflow at 390, 768 and 1440 pixels. Table regions may scroll locally and must be labelled/accessibly focusable.
- Internal answer links resolve to real anchors; key local sample/image/download URLs return expected types.
- Save representative full-page screenshots under `tmp/customer-questions-qa/`; inspect them, including mobile tables, pricing comparison, complete CV text, support steps and source links.
- Keyboard focus reaches links/tool inputs in a sensible order; jump links do not hide headings beneath the header; dark/light text has readable contrast using existing tokens.

For local browser verification, stub `/api/events` to capture payloads without writing live analytics. Block or mock AI endpoints so page checks do not spend money. Stub fixtures only in test routing, never add fake results to production code. If external resources are blocked, do not count a blocked official source as a dead link without a separate read-only check.

### 11.2 Critical journey acceptance tests

| Test | Steps | Pass condition |
|---|---|---|
| Free file | Open blank-template page and the new pricing free link without login; download | Actual nonempty DOCX (`PK` ZIP signature with Word document content), not HTML/login/payment; file opens; actual preview remains. |
| Paid scope | Read pricing cases; inspect existing entitlement tests/routes | Same paid document re-download remains covered; new document requires own payment. Do not perform a live charge for this check. |
| Support | Follow Q24 → My CVs with authenticated local/staging fixture if available | Original-document recovery route; no `new=1`, no encouragement to repay, pending-state instructions match real UI. Unauthenticated redirect may correctly require login. |
| Import guidance | Compare guide against actual import dialog and manual fields | Only supported file formats; no nonexistent paste/import button; exported layout not guaranteed to match original. |
| Mobile layout | Narrow editor fixture; Edit CV/Preview/More; static download help | No clipped controls, guidance labels match. Record whether emulated only or real device tested. |
| ATS result | Use existing injectable generator/mock result with Sage missing | Disclaimer beside score; true evidence displayed; privacy note before submit; method link works; scorer output unchanged. |
| Pack handoff | Generate mock result, invoke existing handoff in isolated local browser | Expected selected fields transfer; bullet suggestions not falsely described as auto-transferred; cover letter remains separate. |
| First-job tool | Try example, generate, copy and follow handoff locally | Existing deterministic tool still works; fallback text selection possible if clipboard blocked; no provider call added. |
| Content attribution | Click each new tracked link with events intercepted | One event with correct destination/placement; no PII; no internal UTM; existing acquisition source retained. |
| Examples | Read Alex, Jordan and Sam in rendered pages | Identities/timelines do not mix, fictional label visible, known facts preserved. |
| Sources | Open official job-board/help/source links read-only | Destination matches label/purpose; access limitations recorded; no invented verified status. |

### 11.3 Existing test and build commands

Use the installed project tooling. Do not update dependencies or overwrite dirty package files just to add scripts; invoke new tests/verifiers directly if simpler.

```powershell
npm run type-check
npm run test:content
npm run test:long-tail
npm run test:ats
npm run test:tools
npm run build
node scripts/verify-content-guides.mjs
node scripts/verify-customer-questions.mjs
```

Run browser verifiers against a separately started local server at the configured URL. Read the existing verifier before running it. In particular, **do not pass `--assets` to `verify-content-guides.mjs`**: it regenerates public proof assets and is outside this change unless an asset truly needs replacement.

`test:tools` already includes `tests/*.test.ts`; do not assume its name means only tools. Existing `tests/content-guide-contracts.test.ts` protects fixture accuracy, Sage absence, shortening and sample links. `tests/content-authority-pages.test.ts` contains a hard-coded personal-statement sitemap date; update that expectation to the explicit reviewed-route behaviour when legitimately changing the date. Do not delete a failing safeguard or loosen assertions to “string exists” to get green tests.

If a baseline failure or environment requirement blocks a check, record exact command, failure, whether pre-existing, what was still verified and the remaining risk. Missing credentials or a physical iPad do not justify inventing success. Do not claim production payment/provider QA from static tests.

### 11.4 Human review before completion

Read each page as its intended visitor. Can they perform the named task without paying first? Can they inspect the promised example/file? Is there a direct answer before promotion? Are important exceptions adjacent to the claim? Is the next action relevant and correctly priced? Does each new section add value not already said elsewhere? Check for stale placeholder braces, copied instructions, inconsistent identities, false review dates, duplicate headings, overlong repetitive intros and unsupported “best” claims.

## 12. Rollout, submission list and rollback

This spec requests implementation guidance, not an automatic production deployment. When deployment is part of the active authorised implementation task, use the existing workflow; do not invent a new hosting process or silently deploy unrelated dirty changes.

1. Review the explicit changed-file list, tests and QA record. Stage/commit only intended changes if committing is authorised; never use broad destructive cleanup or `git add .` on this dirty workspace.
2. Use `.github/workflows/build-app-image.yml` with the reviewed branch/ref and explicit `deploy=true`. Its default is false. Existing deployment performs its established preparation/restart process; do not add a new migration for these content changes.
3. Verify live target pages, free DOCX, sample PDF, privacy, sitemap and robots with read-only requests/rendering. Production smoke must not submit real CVs or create purchases.
4. Verify no server/render errors and that the deployed version actually contains the answers. Record release identifier/time and live smoke results.
5. For Docker housekeeping, only use the already authorised existing dangling-image cleanup in the deployment workflow. Do not expand this content rollout to delete all unused images, volumes or rollback assets.
6. If a release causes a functional regression, use the project's existing known-good image/release rollback process. Do not delete documents/orders, reset the user's working tree, or improvise database rollback for a content release.

Deliver `docs/CUSTOMER_QUESTIONS_RELEASE_URLS.md` listing these updated URLs for the owner. They are existing pages, not new pages. Include deploy status and actual date; do not tell the user to submit unshipped updates. Submission/indexing is separate from publication, and anchors are not individual sitemap URLs.

```text
https://workcv.co.uk/cv-builder-no-subscription-uk
https://workcv.co.uk/pricing
https://workcv.co.uk/tools/blank-cv-template-uk
https://workcv.co.uk/tools/cv-template-word-uk
https://workcv.co.uk/chatgpt-cv-to-pdf-uk
https://workcv.co.uk/tools/job-application-pack-uk
https://workcv.co.uk/tools/ats-score-checker
https://workcv.co.uk/canva-cv-alternative-uk
https://workcv.co.uk/cv-word-or-pdf-uk
https://workcv.co.uk/shorten-cv-to-two-pages
https://workcv.co.uk/cv-personal-statement-uk
https://workcv.co.uk/cv-no-experience-uk
https://workcv.co.uk/tools/first-job-cv-wizard-uk
https://workcv.co.uk/return-to-work-cv-uk
https://workcv.co.uk/tools/cv-bullet-point-generator
https://workcv.co.uk/top-job-boards-uk
https://workcv.co.uk/contact
```

List `/privacy` separately as an updated policy, not an acquisition priority. Do not submit URLs to third parties or create external accounts as part of writing the list. Use existing indexing tooling only when submission is included in the active request.

## 13. Source register and what each source supports

Demand evidence was gathered on 23 September 2026. Questions are editorial paraphrases. Q05/Q06/Q07/Q24 are product-derived rather than proven recurring public questions. Q19 is inferred from a returner's situation. Some discussions were accessible only through search-index text; treat that as weaker evidence, not as a verified full transcript. Recheck links and current primary guidance at implementation time; document access failures without fabricating content.

### Primary answer and product sources

- [Prospects: AI, CVs and applications — audience questions](https://www.prospects.ac.uk/ai-cvs-and-applications-your-questions-answered/): useful model of grouping real audience questions with focused answers and deeper help; not a source to reproduce wholesale.
- [Prospects: how to write a CV](https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/): UK careers guidance; recheck when supporting length/profile decisions.
- [National Careers Service: CV sections](https://nationalcareers.service.gov.uk/careers-advice/cv-sections): UK CV structure/evidence; link where relevant, do not imply government endorsement of WorkCV.
- [Greenhouse: unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse): a specific ATS vendor's parsing limitations; not every ATS and not an automatic-rejection rule.
- [Google Docs: work with Office files](https://support.google.com/docs/answer/9406611?hl=en): editing Office documents through Google's products.
- [Apple: find downloads on iPhone/iPad](https://support.apple.com/en-gb/102440): device download-location help; does not certify the WorkCV payment/download flow.
- [Prospects graduate jobs](https://www.prospects.ac.uk/graduate-jobs), [Gradcracker](https://www.gradcracker.com/) and [Gradcracker about](https://www.gradcracker.com/about-us): scope and official starting points for the shortlist.
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) and [documentation updates](https://developers.google.com/search/updates): technical search/AEO boundaries described in section 2.3.
- WorkCV source files in section 2: product behaviour is established from the implementation, not third-party marketing copy.

### Real-discussion demand signals

| Source | Questions informed | Link / caveat |
|---|---|---|
| UKJobs “CV Help”, October 2024 | Q01–Q04, Q19 | https://www.reddit.com/r/UKJobs/comments/1fugr6w/ — iPad, paid download and returner context; not market-size evidence |
| UKJobs ATS discussion, July 2021 | Q11/Q12 | https://www.reddit.com/r/UKJobs/comments/oosb5u/ — historical need signal |
| UKJobs guidance megathread, July 2026 | Q11/Q12 | https://www.reddit.com/r/UKJobs/comments/1ukb063/job_guidance_megathread_cvs_applications/ — low-score question, not scorer validation |
| UKJobs CV advice, March 2024 | Q04/Q20 | https://www.reddit.com/r/UKJobs/comments/1b7gggk/ — Word access, lack of KPIs; no solicitation |
| UKJobs keyword discussion, January 2024 | Q13 | https://www.reddit.com/r/UKJobs/comments/19f2sry/ — evidence of confusion, not an ATS rule |
| UKJobs ChatGPT personal statements, March 2025 | Q09/Q10 | https://www.reddit.com/r/UKJobs/comments/1jjkfd7/ — generic wording and tailoring concerns |
| ChatGPTPromptGenius, May 2024 | Q08 | https://www.reddit.com/r/ChatGPTPromptGenius/comments/1d09g58/ — search-index evidence, not UK-specific |
| ArtificialInteligence, March 2024 | Q08 | https://www.reddit.com/r/ArtificialInteligence/comments/1b5e5gz/ — formatting concern, search-index evidence |
| jobsearchhacks Canva discussion, 2025 | Q14 | https://www.reddit.com/r/jobsearchhacks/comments/1lmyico/sorry_if_this_is_dumb_but_ai_candidate_systems/ — question signal; vendor source supports answer |
| UKJobs format discussion, May 2025 | Q15 | https://www.reddit.com/r/UKJobs/comments/1kz7qug/ — Word/PDF decision |
| UKJobs length/profile discussion, April 2024 | Q16/Q17 | https://www.reddit.com/r/UKJobs/comments/1cb9oz7/ — UK/US convention confusion |
| UKJobs first CV, August 2026 | Q18 | https://www.reddit.com/r/UKJobs/comments/1vntpct/trying_to_find_a_job_at_17/ — search-index evidence |
| UKJobs entry-level boards, July 2026 | Q22/Q23 | https://www.reddit.com/r/UKJobs/comments/1ulf21p/indeed_vs_linkedin_vs_other_job_boards_entrylevel/ — shortlist/direct-application question |

Do not copy comments as testimonials, identify posters on public WorkCV pages, or bulk quote threads. Use the need signal to create original guidance grounded in product facts and primary sources.

## 14. Definition of done and implementer handoff

The implementation is complete only when:

- [ ] All Q01–Q24 are visibly answered at their primary anchors, with the specified practical evidence/action.
- [ ] All 17 existing content pages are covered; privacy clarification is accurate; no new thin URLs exist.
- [ ] Existing tools, free DOCX, real sample PDFs/screenshots, internal anchors and entitlement behaviour are preserved.
- [ ] Prices/account/export/payment scope are consistent across answers, CTAs, FAQ text and existing schema.
- [ ] No invented CV facts, provider results, ATS guarantees, success rates, qualifications, testimonials or review dates appear.
- [ ] Paid recovery routes to the existing paid document, never an accidental new purchase.
- [ ] Meaningful contextual money-page links exist without blocking value/free downloads or overwhelming the pages.
- [ ] New tracking uses the current pipeline and excludes personal content; attribution is not overwritten.
- [ ] Type/build/tests and browser checks have actual recorded outcomes; limitations are explicit.
- [ ] QA, measurement/future-topic intake and release-URL documents are complete.
- [ ] Full diff reviewed; unrelated workspace changes untouched; deployment status reported accurately.

### Ready-to-use instruction for Sol

> Implement `docs/CUSTOMER_QUESTIONS_IMPLEMENTATION_SPEC_2026-09-23.md` in full. Read it completely before editing. Follow Tasks 0–7 in order, covering all 24 questions across the 17 existing content pages plus the scoped privacy clarification. Preserve unrelated dirty work, working tools, free downloads, payment entitlement, useful examples and existing canonical URLs. Use the exact answer/example contracts and add the prescribed tests and QA documents. Do not stop after adding FAQs, do not create thin new pages, and do not claim tests or deployment you have not performed. Complete all safe in-scope work, record external verification limitations honestly, and finish with changed URLs, actual test results and deployment status. Do not deploy or contact external sites unless that is included in the active user request.
