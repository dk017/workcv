# UK Visa Sponsor Checker by WorkCV

A Manifest V3 Chrome extension that badges employers on UK job boards with their Home Office sponsor licence status.

## How it works

- `content.js` runs on the job boards listed in `manifest.json`. `sites.js` finds the employer names on the page (per-board rules, falling back to the page's JobPosting data) and a badge goes next to each one. A MutationObserver re-scans as boards load more results.
- `background.js` answers lookups: it serves names cached in `chrome.storage.local` for 24 hours and sends the rest, up to 40 at a time, to `POST https://workcv.co.uk/api/tools/sponsor-check/batch` (`app/api/tools/sponsor-check/batch/route.ts`), which uses the same `searchSponsors` as the site's checker.
- Names that look like recruitment agencies (`isLikelyAgency` in `employers.js`) get an "Agency advert" badge and are never sent.
- The popup switches badges on or off, checks a typed name, and on any other site reads the employer from the current advert after a click (`activeTab` + `scripting`).

Board markup changes often. LinkedIn (current and older layouts), Indeed and Reed were checked against live pages on 31 October 2026. Totaljobs, CV-Library and Glassdoor block automated browsers, so their selectors are unverified; those pages still fall back to JobPosting data on single adverts.

## Local test

1. `chrome://extensions` > Developer mode > Load unpacked > select this folder.
2. Open a job search on one of the supported boards.

Badges call the production API, so the batch endpoint must be deployed first.

## Tests

`tests/uk-visa-sponsor-extension.test.ts` covers name cleaning, agency detection, links, manifest permissions and the store-listing rule.

## Packaging

Zip only the runtime files: `manifest.json`, `background.js`, `content.js`, `employers.js`, `sites.js`, `popup.html`, `popup.css`, `popup.js` and `icons/`.
