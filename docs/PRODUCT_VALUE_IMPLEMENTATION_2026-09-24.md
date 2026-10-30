# Product value improvements — 24 September 2026

Scope: implement the competitor-review findings without copying unsupported ATS or hiring claims. Deployed to production on 24 September 2026; release commit `297f042a48c26ea8b89b72a7edfe7ead0026a1f9`, [GitHub Actions run #80](https://github.com/dk017/workcv/actions/runs/36002031943).

## Verification checklist

- [x] Preserve first public landing; classify Brave separately; regression-test internal navigation.
- [x] Backward-compatible optional CV sections, section ordering and useful single-column presets.
- [x] Preserve original CV and complete application-pack outputs; explicitly review bullets before applying.
- [x] Inspect PDF/DOCX files locally with extracted text, limitations, accessible error states and no upload requirement.
- [x] Publish reproducible fictional layout samples and extraction results; inspect generated PDFs.
- [x] Add an evidence-led supporting-statement planner with a complete example, sources and free copy/download.
- [x] Integrate tools, relevant commercial links and sitemap; preserve pricing clarity and privacy.
- [x] Run automated tests, production build and browser/PDF checks. Record limits honestly.

Success measurement: completed useful actions, editor starts, paid orders and attributed public landings. Citations/rankings are observations, not promised outcomes. Separate Brave Search referrals from verified AI citations. Do not expose personal CVs as public examples.

## Implemented behaviour

- Existing saved CVs retain their schema compatibility. Optional text sections: projects, certifications, volunteering and languages. Section order uses keyboard-accessible buttons. Education-first and experienced presets change section priority; compact single-column changes spacing without reducing the body font. Switching back to a named design disables the preset.
- Application packs preserve the original source text, import the original CV, retain its skills and store bullets, editable cover letter, evidence review, interview prompts and follow-up email separately from the PDF. Applying a bullet requires role selection and explicit confirmation; duplicate additions are blocked. A populated current CV requires confirmation before import. Failed imports retain the temporary handoff for retry; successful imports remove it.
- Local file inspection: PDF.js 6.0.227 and Mammoth 1.12.0; 5 MB files, maximum 10 PDF pages, 50,000 extracted characters. DOCX ZIP declarations are checked before decompression. No OCR, legacy DOC, password-protected documents or employer-specific ATS simulation. Only explicit continuation sends text to the authenticated editor import service.
- Layout evidence: six fictional PDFs, PNG previews, complete extracted text and a versioned JSON test record under public/samples/layouts. Rendered pages were inspected. Testing found and fixed spaced heading extraction, sidebar print contrast and excessive spacing. Sample page counts do not promise page counts for a user's CV.
- Civil Service statement planner: browser-only, criterion/evidence/action/outcome worksheet, word/character counts, missing-essential-evidence prompts, free text copy/download and a substantive fictional example. It does not generate claims or assess selection chances.
- Existing evidence matching already validates source quotations; it was retained and connected to the complete pack. No duplicate matcher page or unsupported score was introduced.
- Reporting separates Brave and adds original-acquisition sales and per-tool activity alongside existing checkout attribution. Historical private-path snapshots are not fabricated or silently rewritten.

## Routes for release

New: /cv-layout-tests-uk, /tools/supporting-statement-planner-uk.
Improved: /tools/cv-format-checker-uk, /tools/job-application-pack-uk, /templates, /editor, /privacy and education-first role templates.
Supporting asset endpoint: /pdf-worker.mjs (build-time static JavaScript, not a content page).

## Verification and remaining release checks

- 204 unit/regression tests passed; type check passed.
- Public-tool browser checks passed at 390px and 1440px: PDF/DOCX extraction, malformed-file feedback, statement example and limit, free download, no content POSTs or browser exceptions.
- Actual editor component tested with mocked account APIs: ordering, presets, optional content, explicit bullet application, duplicate prevention, source/skills preservation, schema-validated saves and reload.
- Six generated PDF layouts visually reviewed. Public sample results record actual parser, renderer, heading order, word counts and page counts.
- Production build passed, including type checking and generation of 136 static pages. Post-build public-tool browser checks passed: eight responsive checks, PDF/DOCX extraction, malformed-file feedback, statement example, word limit and free download, with zero content POSTs or browser exceptions.
- Post-build customer-journey checks passed: 18 pages and 24 answers at three widths, eight tracked links, ATS, complete application-pack and first-job handoffs, and free DOCX download. Account/AI-dependent journeys use mocked APIs; no payment, email or live AI generation was performed.
- Production deployment completed successfully. The workflow built and pushed the image, prepared the existing growth schema and restarted `workcv-app-1` on commit `297f042a48c26ea8b89b72a7edfe7ead0026a1f9`.
- Live HTTP checks passed: both new routes returned 200 and their canonical links; sitemap and robots returned 200 and listed the new pages; PDF worker returned JavaScript; sample PDF and free DOCX returned their expected MIME types; visual-test editor route returned 404; corrected job-board and money pages returned 200.
- Docker cleanup removed three old WorkCV image tags that no running or stopped container referenced, kept the active release image, and left other repositories and volumes untouched. The existing dangling-image prune reclaimed 0 B.
- After release, check crawl/index status and compare actual tool completions and paid-order cohorts over comparable windows. Observe AI citations separately from referral sources. No ranking, citation or revenue increase is guaranteed.
