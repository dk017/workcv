# Ten-page content release handoff

Implemented locally on 6 September 2026. Not committed or deployed.

## Delivered pages

| Route | Delivered |
| --- | --- |
| `/chatgpt-cv-to-pdf-uk` | New guide with supported manual-entry/file-import workflow, More-menu instructions, three interface/output images, complete fictional draft and free sample PDF. |
| `/convert-resume-to-uk-cv` | New guide with a full fictional before/after example, section comparison, two explained bullet rewrites and qualification guidance. |
| `/shorten-cv-to-two-pages` | New guide with six edits and complete before/after drafts. Final counted text is 374 words before and 189 after; no unverified page-count conversion claim. |
| `/cv-word-or-pdf-uk` | New format decision guide with employer-instruction precedence, selectable-text checks and accurate distinction between free DOCX and paid editor PDF. |
| `/cv-builder-no-subscription-uk` | Offer/entitlement table and new guide links. Corrected “pay once per PDF download” to “pay once for one saved CV”. Existing product proof retained. |
| `/tools/blank-cv-template-uk` | Actual Word-file preview, fill/save checklist, tracked direct download and editor actions, and link to format guidance. Download endpoint unchanged. |
| `/cv-template-care-worker-uk` | Complete fictional first-care-job CV and three supported transferable-skill mappings without invented care credentials. |
| `/career-change-cv-uk` | Complete retail-to-admin CV, fictional vacancy, profile rewrite and four supported bullet mappings. |
| `/return-to-work-cv-uk` | Complete childcare-returner CV with consistent dates, two alternative gap descriptions and explained previous-work evidence. |
| `/tools/ats-score-checker` | Reproducible worked example using editorial classifications through the real production scoring function. Calculated example: 73/100; missing Sage experience remains not evidenced. Clearly distinguished from live AI output and employer assessment. |

Shared rendering preserves the WorkCV design system. Three-column comparisons become labelled stacked rows below 640px; larger screens retain semantic tables. New guides have server-rendered content, Article/BreadcrumbList JSON-LD, unique metadata and self-canonicals. Existing pages link into each new canonical owner. Sitemap dates reflect edited content; historical competitor/source check dates were not falsely refreshed.

## Public proof assets

- `public/samples/chatgpt-cv-alex-morgan.pdf`: one page, real WorkCV Classic rendering, visibly labelled fictional.
- `public/product-proof/chatgpt-cv-import.png`: current file-import dialog.
- `public/product-proof/chatgpt-cv-editor.png`: current editor with fictional local response data.
- `public/product-proof/chatgpt-cv-pdf.png`: rendered first page of the sample PDF.
- `public/product-proof/blank-word-template.png`: actual existing DOCX rendered through Microsoft Word.

The sample source uses the same fictional text as the article. Screenshots are local demonstrations, not proof of a live import, customer account or checkout. The asset-only page is temporarily created by the QA script and removed afterwards; it is absent from the production build.

## Verification

- `npm run type-check`: passed; production build also completed its type/lint validation.
- `npm run test:content`: 7 passed.
- `npm run test:long-tail`: 5 passed after updating the historical date assertion to allow later reviewed dates.
- `npm run test:tools`: 177 passed, including the three new content contracts.
- Final focused content-contract rerun after the example edit: 3 passed.
- `npm run test:pdf-runtime`: passed.
- `npm run build`: passed, 117 static pages generated; new guides are statically rendered.
- `node scripts/verify-content-guides.mjs`: passed on the final production build, all ten pages at 390px, 768px and 1440px. HTTP status, single H1, canonical, JSON-LD parsing, local-image availability, runtime errors and document overflow checked.
- Visual review: inspected guide layouts and worked examples; replaced cramped mobile comparisons with stacked rows. Sample PDF and actual Word preview were rasterised and visually checked.
- `git diff --check`: passed.

QA evidence is under `tmp/content-guides-qa/`, including `routes.json`, `tests.log`, sample render details, full-page screenshots and visual review sheets. Test traffic is prevented from contacting external analytics; event requests use local fixtures. No paid model request, real purchase or production data mutation was used.

## Reproduction

1. Run the local dev server with `CV_VISUAL_TESTS=1` on port 3100 if regenerating assets.
2. `node scripts/verify-content-guides.mjs --assets --assets-only` generates the PDF and interface screenshots, and downloads the existing DOCX for inspection. It temporarily installs `scripts/fixtures/content-proof-page.tsx` as a local route using exclusive creation, then removes it.
3. On this Windows environment, `scripts/render-content-word-preview.ps1` opens the downloaded DOCX read-only in hidden Microsoft Word and exports a QA PDF. `node scripts/rasterize-content-word.mjs` creates the public preview and page images.
4. Against the dev or production server, run `node scripts/verify-content-guides.mjs` for all 30 responsive checks. Set `CONTENT_BASE_URL` for another port. `node scripts/content-visual-sheets.mjs` makes compact visual review sheets.

## Limitations and deviations

- Sales attribution remains unknown. The plain local growth command lacked DATABASE_URL; loading the existing environment revealed a Docker database hostname that is unresolvable here, including outside the sandbox. No order records were read. Run the existing read-only report in the configured production environment before attributing the reported sales to ChatGPT.
- The bundled DOCX renderer was attempted but LibreOffice is unavailable. Installed Microsoft Word provided the actual render instead; the DOCX contents were not changed.
- Some existing workspace files were blocked by the sandbox and the patch tool reported reparse-point errors despite ordinary file/parent attributes. Approved exact-replacement scripts completed those edits outside the sandbox. Those one-off edit scripts were removed after use.
- No deployment or index submission was performed. Public crawler/infrastructure behaviour and post-release referral changes need checking when this release is published. Repository crawler permissions were preserved.

Sources and claim boundaries are recorded in `research/chatgpt-content-source-log-2026-09-06.md`. The implemented scope is the four new articles and six existing-page improvements from `specs/CHATGPT_CONTENT_GROWTH_SPEC_2026-09-06.md`.
