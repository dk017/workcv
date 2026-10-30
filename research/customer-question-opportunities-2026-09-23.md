# WorkCV customer-question research and page plan

Researched: 23 September 2026. Scope: questions to incorporate into the existing site; no website changes or deployment performed for this research.

## Findings and evidence limits

The strongest immediate commercial fit is a UK discussion from a parent returning to work who needs to create a CV on an iPad, export PDF, and pay without a monthly subscription [S1]. It supports a specific combination of needs, not a market-size estimate. A later UK discussion asks how to improve a CV with a 49% ATS score [S3]. Another asks which boards work for entry-level applicants and whether applying directly is better [S11].

Use these discussions to identify the problem and the language people use. Validate the answer against product behaviour, employer instructions, careers guidance, or the relevant software vendor. Discussion comments are not evidence that a template guarantees interviews or that all employers reject CVs automatically.

The questions below are editorial paraphrases unless marked as product-derived. This is a qualitative opportunity list, not a search-volume report, a representative survey, or proof that every topic is currently trending. Older discussions demonstrate an observed need; recent discussions provide additional current signals. No Google Trends or Search Console volume was measured in this pass.

The earlier sale attributed to ChatGPT provides a reason to investigate this channel. Its legacy profile fallback does not identify the buyer's prompt, prove a recommendation, or establish which content caused the sale.

## Existing coverage checked

- The money page is `/cv-builder-no-subscription-uk`, as defined in `lib/site.ts`.
- That page already answers price, subscription, automatic renewal, sign-in, and whether the service is entirely free. Several questions repeat the same subscription point. Keep the clearest answer and use available space for unresolved buying decisions.
- `/pricing` already says that the same saved CV can be edited and downloaded again without paying again. Its FAQ does not make that a distinct question. Terms tie paid access to the saved CV used at checkout.
- `/chatgpt-cv-to-pdf-uk` already has supported import instructions, screenshots, a fictional worked CV and a sample PDF. Build on this evidence; it does not need to be replaced with generic FAQs.
- `/tools/ats-score-checker` already explains that its score is WorkCV's assessment, not an employer ATS score; it also explains its scoring weights, keyword limits and pasted-text limitations.
- `/tools/blank-cv-template-uk` already offers a genuine free DOCX download without sign-in. The paid builder exports PDF; the free template is a separate document.
- `/top-job-boards-uk` already answers broad selection and direct-application questions. The next improvement should help a particular visitor choose a shortlist and use it.
- The repository already contains robots.txt, sitemap and llms.txt routes. This was a code inspection, not a fresh live crawl or indexing audit.

## Priority question bank: 24 questions

P1 means closest to a real product decision or immediate task. P2 means useful supporting content. Priorities are editorial judgments based on fit and existing coverage, not measured traffic forecasts.

| ID | Priority | Question to answer | Best existing home | Evidence and useful addition |
|---|---|---|---|---|
| Q01 | P1 | Which UK CV builder lets me pay once for a PDF without a subscription? | `/cv-builder-no-subscription-uk` | S1. Already substantially covered. Lead with the complete cost, what is free, what payment unlocks, and a viewable sample. |
| Q02 | P1 | Can I create and download a CV completely free, or is only the editor free? | `/pricing` and `/tools/blank-cv-template-uk` | S1 supports concern about charges at the end. Make a small comparison of the free Word template and paid builder PDF, with direct access to both. |
| Q03 | P1 | How can I make and download a CV on my phone or iPad without a laptop? | A workflow section on `/cv-builder-no-subscription-uk` | S1 directly describes the iPad/laptop constraint. Verify the device flow, then show sign-in, entry/import, preview, download and locating the saved file. |
| Q04 | P1 | How can I update my CV if I do not have Microsoft Word? | `/tools/cv-template-word-uk` | S1 and S4. Explain practical editing options and warn that opening an existing document elsewhere can change formatting. Show an actual editable example. |
| Q05 | P1 | Can I edit and download the same CV again after paying? | `/pricing` | Product-derived, not validated as a recurring forum question. Promote the existing answer into the FAQ and show how to reopen the paid saved CV. |
| Q06 | P1 | Does one payment cover one saved CV or every CV I create? | `/pricing` | Product-derived. Explain the document-specific entitlement precisely. Check duplicate/new-document behaviour before describing every variation. |
| Q07 | P1 | Do I need an account or credit card before I start? | `/cv-builder-no-subscription-uk` | Product-derived. Account requirement is already answered. Clarify the separate timing of email-code login and checkout, after verifying the current payment flow. |
| Q08 | P1 | How do I turn my ChatGPT CV draft into a properly formatted UK PDF? | `/chatgpt-cv-to-pdf-uk` | S7/S8 support formatting and export friction. Keep the existing worked example and sample PDF; make the supported routes easy to scan. Do not claim ChatGPT can never produce files. |
| Q09 | P1 | Can I use AI to improve my CV without making it sound generic or inventing achievements? | `/chatgpt-cv-to-pdf-uk` | S6 and S13. Add a short before/after passage, explain which edits improved it, and include a factual-accuracy checklist. Follow the employer's AI instructions. |
| Q10 | P1 | How do I tailor my CV to each job without rewriting it from scratch? | `/tools/job-application-pack-uk` | S6 and S13. Show one source CV, a vacancy and a requirement-to-evidence table, followed by a few justified edits. |
| Q11 | P1 | Is an online ATS score the score an employer actually sees? | `/tools/ats-score-checker` | S2/S3. Already directly answered. Put the explanation near the result and link to the scoring method; distinguish assessment, parsing and hiring decisions. |
| Q12 | P1 | My ATS score is low. What should I actually change first? | `/tools/ats-score-checker` | S2 and the 2026 example in S3. Demonstrate three concrete improvements and why they matter, with no target-score or interview promise. |
| Q13 | P1 | Which words from the job advert should I include in my CV? | `/tools/job-application-pack-uk` with a link to the checker | S5/S13. Use a requirement, real supporting evidence and a revised bullet. Make clear when a missing requirement is genuinely missing. |
| Q14 | P2 | Can a Canva or two-column CV cause problems when an employer reads the file? | `/canva-cv-alternative-uk` | S9 identifies the concern; S14 supplies vendor evidence about parsing problems. Show reading-order and extracted-text checks; do not claim every Canva CV fails. |
| Q15 | P1 | Should I send my CV as Word or PDF when applying in the UK? | `/cv-word-or-pdf-uk` | S10 contains this exact decision. Start with the employer's stated format. Include a simple decision table and explain WorkCV's PDF export limit. |
| Q16 | P2 | Should my UK CV be one page or two, and what should I cut? | `/shorten-cv-to-two-pages` | S12. Show before/after reductions for different career stages rather than a universal page-count rule. |
| Q17 | P2 | Do I need a personal statement at the top of my CV? | `/cv-personal-statement-uk` | S12/S13. Give examples of a useful statement and one that can be removed, with a brief explanation. |
| Q18 | P2 | What can I put on my first CV when I have no paid work experience? | `/cv-no-experience-uk` and `/tools/first-job-cv-wizard-uk` | S15 and the graduate question in S13. Show complete fictional examples using education, projects and genuine responsibilities. |
| Q19 | P2 | How do I write a CV when returning to work after looking after children? | `/return-to-work-cv-uk` | S1 describes this situation; exact question is an editorial inference. Include an honest timeline and examples relevant to the intended job. |
| Q20 | P2 | How do I write achievement bullets when I was never given targets or sales numbers? | `/tools/cv-bullet-point-generator` | S4 explicitly raises lack of KPIs. Show examples using scope, frequency, complexity or qualitative outcomes, without invented figures. |
| Q21 | P2 | What personal details should I remove before asking AI to review my CV? | `/tools/ats-score-checker` and its privacy explanation | S13 contains audience questions about removing personal information. Explain the specific WorkCV data flow alongside a simple anonymised example. Recheck current processing and retention before publishing. |
| Q22 | P2 | Which UK job sites should I use for entry-level or graduate roles? | `/top-job-boards-uk` | S11. Provide a limited, explained shortlist with official links, useful filters and a dated review. Avoid a universal best-site claim. |
| Q23 | P2 | Is it better to apply through Indeed or LinkedIn, or on the employer's website? | `/top-job-boards-uk` | S11. Already partly covered. Show how to verify the original vacancy and follow its instructions; do not invent success-rate comparisons. |
| Q24 | P1 | I paid for my CV but cannot download it. What should I do? | `/contact` plus a short `/pricing` FAQ | Product-derived support question. Provide verified account/document checks, a route to support and the receipt details support actually needs. This helps paid customers rather than attracting new traffic. |

## First implementation batch

1. Pricing and money page: Q01, Q02, Q05, Q06, Q07. Prefer precise buying answers to repeated variations of “no subscription”. Use the existing shared price configuration rather than hard-coded prices.
2. ChatGPT formatting guide: Q08/Q09. Retain its demonstration CV and screenshot evidence; add a concise answer near the top and make supported import/entry choices obvious.
3. ATS checker and application pack: Q10–Q13. Keep the existing score explanation and add an example that demonstrates the visitor's next action.
4. Device workflow: Q03/Q04. First verify a real phone and iPad journey. A standalone mobile guide is justified only if it provides a substantial tested walkthrough beyond the money-page section.
5. Expand Q15–Q23 where the worked examples or comparisons add something beyond existing coverage.

Most questions belong on existing pages. Avoid creating a new URL for every wording variant. Use clear question headings and anchors so a specific answer is easy to navigate to and link to. A question-shaped title is useful when it describes the content; it is not a ranking requirement.

## Answer format and conversion placement

For each substantial question, start with a direct answer of roughly 40–70 words, then provide the evidence or action needed to finish the task. This length is an editorial guide, not an AI extraction rule.

The supporting material should be at least one of: a completed example, annotated screenshot, downloadable file, comparison with meaningful criteria, or working tool result. State relevant limitations next to the claim. Link to authoritative sources for general advice and to actual WorkCV functionality for product claims.

The primary commercial destination is `/cv-builder-no-subscription-uk`. Link it where choosing a guided builder becomes relevant, for example after a formatting demonstration. A secondary `/pricing` link should explain costs before editor entry. Users seeking a free document should receive the free DOCX first; a guided paid option can then be offered clearly.

Suggested context-specific links:

- Formatting guide: “Build and preview this layout; £7.99 to download your saved CV” -> money page or editor, with pricing visible.
- Job-board guide: after a visitor chooses a vacancy, “Match your CV to this job” -> application pack/checker; show the builder option after useful results.
- Free Word template: direct download first, then “Prefer a guided editor and PDF preview?” -> money page.
- Low-score answer: demonstrate improvements, then “Apply these changes to your CV” -> supported editor handoff; state any limitations in the handoff.

Do not force a sales link into every short answer. One relevant contextual link and a clear next step generally provide a better experience than repeating the same promotion throughout a page.

## Draft product answers grounded in existing site copy

These are editorial drafts for incorporation, not newly published copy. Reconfirm behaviour during implementation.

**Which UK CV builder lets me pay once without a subscription?**

WorkCV lets you build and preview a UK CV free, then pay £7.99 to download the PDF for that saved CV. There is no monthly subscription or automatic renewal. You need an account to save your CV. If you want a completely free option, WorkCV also provides a separate editable Word template.

**Can I edit and download my CV again after paying?**

Yes. You can edit and redownload the same saved CV without paying again. Open the document you paid for from your account. The payment is tied to that saved CV; it should not be described as unlimited access to every new CV you create.

**Can I download my CV completely free?**

WorkCV's blank Word template is free to download without an account or payment. You fill and format that document yourself. The online builder is a separate option: building and previewing are free, and downloading your finished PDF costs £7.99 once for that saved CV.

**Can I import a CV written with ChatGPT?**

You can copy each checked section into its matching WorkCV editor field, or save the draft as a DOCX and import that file. WorkCV also accepts PDF imports. Its import dialog does not accept pasted text. Review names, dates, qualifications and achievements before checking the final PDF preview.

**Is the WorkCV score the score an employer sees?**

No. It is WorkCV's assessment of how clearly your supplied CV matches one vacancy. It does not reproduce an employer's ATS or predict an interview. Use the explanations and evidence gaps to improve the application, rather than treating the percentage as an employer's pass mark.

## What to take from the video, and what to correct

- The file is `robots.txt`, not `roos.txt`. WorkCV already has a route for it, plus a sitemap and llms.txt. Existing code allows named search/retrieval crawlers and blocks selected training crawlers. A live response/WAF audit would be a separate verification step.
- Google says its AI search features use established SEO foundations and do not require special AI markup or files [A1]. Its June 2026 clarification says llms.txt does not positively or negatively affect Google Search visibility [A2]. This is Google's guidance; do not generalise it to every AI service.
- Google stopped showing FAQ rich results from 7 May 2026 and removed the feature documentation in June [A2]. Existing accurate FAQPage markup can remain, but adding more is not a promised route to Google rich results or AI recommendations. Visible answers should drive the work; any markup must agree with them.
- A generated answer's source list is an observation from that run, not a complete map of everything that influenced the answer. Use it to identify useful publications and citation opportunities, not to manufacture endorsements.
- In particular, the UKJobs CV advice thread prohibits solicitation and advertising [S4]. Researching questions there is useful; inserting promotional replies would not be an appropriate content-distribution plan.
- Seek editorial inclusion through an inspectable product, correct feature facts, useful examples and genuine customer reviews. Keep the brand name, price, access model and export formats consistent across maintained profiles.

## What established publishers do that we can learn from

Prospects' April 2026 page explicitly collects questions from a real webinar. It groups them by jobseeker task, answers directly, and links to deeper guidance [S13]. Its useful pattern for WorkCV is audience language plus task-specific depth, supported by our own product demonstrations.

Greenhouse explains concrete parsing failures such as column layouts, images and complex headers/tables, including what happens when a parse fails [S14]. This is a useful model for precise tool guidance: name the limitation and the practical next step. It does not establish that every ATS behaves identically.

## Measurement after incorporation

Record a baseline before editing. Use Search Console for impressions, queries and clicks per existing target page, and WorkCV reporting for source/landing -> useful action -> editor start -> paid order. The new checkout attribution snapshot should be used for new paid orders; keep legacy fallback rows labelled.

Maintain a fixed manual sample of approximately ten non-branded prompts, such as Q01, Q03, Q08, Q10 and Q22, with UK context. Record the date, service/model where available, whether browsing/search was used, the prompt, citation URLs and whether WorkCV was mentioned or linked. Repeat consistently; treat the mention rate as a small observational sample, not overall market share.

Check indexing and query coverage after a few weeks, then assess clicks and conversions over a longer comparable period. One month is a review checkpoint, not a promised time to gain recommendations. No recurring automation was created in this research pass.

## Source register

Discussion sources below were inspected through search-index text and, where accessible, the source page. S7/S8 are broader AI communities, not UK-specific demand evidence. Removed posts and promotional tool launches were not used as the main basis for the recommendations.

- **S1 — UKJobs, CV Help, 2 October 2024:** parent returning from leave; iPad, PDF, subscription and unexpected-charge concerns. https://www.reddit.com/r/UKJobs/comments/1fugr6w/
- **S2 — UKJobs, Updating CV & ATS checkers, 21 July 2021:** low score and distrust of paid upgrades. Historical need signal. https://www.reddit.com/r/UKJobs/comments/oosb5u/
- **S3 — UKJobs, Job Guidance Megathread, July 2026:** a commenter asks for a more concise CV and help with a 49% ATS score. https://www.reddit.com/r/UKJobs/comments/1ukb063/job_guidance_megathread_cvs_applications/
- **S4 — UKJobs, Weekly CV Advice Thread, March 2024:** loss of Word access/formatting, describing achievements without KPIs, and community posting rules. https://www.reddit.com/r/UKJobs/comments/1b7gggk/
- **S5 — UKJobs, ATS and job-specification keywords, 25 January 2024:** conflicting assumptions about screening; evidence of confusion, not authoritative ATS advice. https://www.reddit.com/r/UKJobs/comments/19f2sry/
- **S6 — UKJobs, ChatGBT for personal statements?, 25 March 2025:** discussion of improving wording, matching a specification and rewriting generic outputs. https://www.reddit.com/r/UKJobs/comments/1jjkfd7/
- **S7 — ChatGPTPromptGenius, CVs/Resumes Using AI, May 2024:** asks about producing a neat CV from source information. Search-index evidence; direct page fetch was unavailable. https://www.reddit.com/r/ChatGPTPromptGenius/comments/1d09g58/
- **S8 — ArtificialInteligence, Fixing the formatting of a CV via AI, March 2024:** inconsistent spacing and sections moving when converted to PDF. Search-index evidence. https://www.reddit.com/r/ArtificialInteligence/comments/1b5e5gz/
- **S9 — jobsearchhacks, Canva resumes and candidate systems, 2025:** asks whether Canva resumes can be read. Search-index evidence; comments are not validation of a universal failure. https://www.reddit.com/r/jobsearchhacks/comments/1lmyico/sorry_if_this_is_dumb_but_ai_candidate_systems/
- **S10 — UKJobs, Have your say, 30 May 2025:** asks whether recruiters prefer PDF or Word, among other recruitment questions. https://www.reddit.com/r/UKJobs/comments/1kz7qug/
- **S11 — UKJobs, Indeed vs LinkedIn vs other job boards?, 2 July 2026:** graduate asks about entry-level roles, smaller companies and direct applications. https://www.reddit.com/r/UKJobs/comments/1ulf21p/indeed_vs_linkedin_vs_other_job_boards_entrylevel/
- **S12 — UKJobs, Personal statement vs 1 page CV, 23 April 2024:** confusion between UK and US conventions and whether a statement is needed. https://www.reddit.com/r/UKJobs/comments/1cb9oz7/
- **S13 — Prospects, AI, CVs and applications: Your questions answered, April 2026:** actual webinar questions and careers guidance. https://www.prospects.ac.uk/ai-cvs-and-applications-your-questions-answered/
- **S14 — Greenhouse Support, Unsuccessful resume parse, updated 2 March 2026:** primary documentation on parsing failures. https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse
- **S15 — UKJobs, Trying to find a job at 17, August 2026:** first-CV and application uncertainty. Search-index evidence. https://www.reddit.com/r/UKJobs/comments/1vntpct/trying_to_find_a_job_at_17/
- **A1 — Google Search Central, AI features and your website:** foundational requirements and no special AI schema/file requirement. https://developers.google.com/search/docs/appearance/ai-features
- **A2 — Google Search Central documentation updates:** 8 May and 15 June 2026 entries covering FAQ rich result retirement and llms.txt clarification. https://developers.google.com/search/updates
