# WorkCV: Tailor Your CV to This Job

A small Manifest V3 Chrome extension for UK job pages. (The folder name is kept from its first version, the Job Keyword Highlighter.)

## What it does

- **Tailor my CV for this job**: reads the job title, employer and advert from the current tab (JobPosting structured data first, then any text the user selected, then the main page text) and opens `https://workcv.co.uk/tailor#job=...`. The job travels in the URL fragment, which is never sent to the server; the page asks the user to confirm before the editor copies their saved CV for the job. The link format must match `decodeJobFromHash` in `lib/job-tailor.ts` (covered by `tests/job-tailor.test.ts`).
- scans only the current tab after the user clicks the button
- highlights CV-relevant skills, tools, qualifications and action verbs
- groups repeated signals in the popup
- runs locally without an account, remote code or background scraping

## Local test

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select `chrome-extension/workcv-job-keyword-highlighter`.
5. Open a normal `http` or `https` job page and click the extension.

## Permissions

- `activeTab`: access only to the tab the user explicitly activates
- `scripting`: inject the local scanner, job reader and highlight styles after the user asks

`chrome.tabs.create` (opening WorkCV) needs no extra permission.

## Store preparation

The listing requires final screenshots, the public support and privacy pages, a developer account and a packaged runtime-only ZIP.
