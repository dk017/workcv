# Updated WorkCV pages for submission

Prepared 24 September 2026. **Deployment status: deployed and live.** Both new pages and the updated URLs below were checked against the production sitemap. Anchors are sections, not separate URLs.

## New pages

1. https://workcv.co.uk/cv-layout-tests-uk
2. https://workcv.co.uk/tools/supporting-statement-planner-uk

Both new pages returned HTTP 200 with the expected canonical URL. Both appear in `/sitemap.xml`.

## Updated existing pages

1. https://workcv.co.uk/cv-builder-no-subscription-uk
2. https://workcv.co.uk/pricing
3. https://workcv.co.uk/tools/blank-cv-template-uk
4. https://workcv.co.uk/tools/cv-template-word-uk
5. https://workcv.co.uk/chatgpt-cv-to-pdf-uk
6. https://workcv.co.uk/tools/job-application-pack-uk
7. https://workcv.co.uk/tools/ats-score-checker
8. https://workcv.co.uk/canva-cv-alternative-uk
9. https://workcv.co.uk/cv-word-or-pdf-uk
10. https://workcv.co.uk/shorten-cv-to-two-pages
11. https://workcv.co.uk/cv-personal-statement-uk
12. https://workcv.co.uk/cv-no-experience-uk
13. https://workcv.co.uk/tools/first-job-cv-wizard-uk
14. https://workcv.co.uk/return-to-work-cv-uk
15. https://workcv.co.uk/tools/cv-bullet-point-generator
16. https://workcv.co.uk/top-job-boards-uk
17. https://workcv.co.uk/contact

`https://workcv.co.uk/privacy` is an updated policy page, not an acquisition priority.

Release: commit `297f042a48c26ea8b89b72a7edfe7ead0026a1f9`, deployed 24 September 2026 in [GitHub Actions run #80](https://github.com/dk017/workcv/actions/runs/36002031943).

Live smoke checks: new pages 200 and canonical; sitemap and robots 200; PDF worker 200 with JavaScript MIME type; sample PDF and free DOCX 200 with the expected document MIME types; test-only editor route 404; corrected job-board page and money page 200.

Docker cleanup removed three unreferenced local WorkCV image tags after checking all running and stopped containers; the active release image remains. The existing dangling-image prune reclaimed 0 B. Other repositories and volumes were left alone.
