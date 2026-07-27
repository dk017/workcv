# WorkCV Job Keyword Highlighter

A small Manifest V3 Chrome extension for UK job pages.

## What it does

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
- `scripting`: inject the local scanner and highlight styles after the user asks

## Store preparation

The listing requires final screenshots, the public support and privacy pages, a developer account and a packaged runtime-only ZIP.
