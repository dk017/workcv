# Chrome Web Store Draft

## Name

WorkCV: Tailor Your CV to This Job

## Short description

Send the UK job advert you are viewing to WorkCV to tailor a copy of your CV, and highlight the skills it asks for.

## Detailed description

Looking at a job on Indeed, Reed, NHS Jobs or a company careers page? Click "Tailor my CV for this job" and WorkCV opens with the advert ready. It makes a separate copy of your saved CV for that vacancy, so your original stays as it is, and walks you through the advert's keywords one at a time, adding only what you have really done.

Applying from outside the UK? "Check sponsor licence" looks up the employer on the Home Office register of licensed sponsors, so you can see whether it can sponsor a work visa before you apply.

The extension can also scan the job page itself, highlighting CV-relevant wording and grouping the strongest terms in a compact popup.

Use it to spot:

- skills and tools such as Excel, customer service, Power BI, safeguarding or project management
- UK qualifications such as GCSE, NVQ, DBS, NMC, QTS, CIPD or AAT
- ways of working such as analytical, organised, collaborative or proactive
- action verbs and repeated signals worth considering when tailoring a CV

The extension is intentionally narrow:

- it works only after you click on the current tab
- keyword highlighting runs locally in the browser
- the advert is sent to WorkCV only when you click Tailor, and you check it before anything is saved
- a sponsor check sends only the employer name
- highlighting needs no account; tailoring uses your free WorkCV account
- it stores no job-page history
- it does not scrape tabs in the background

Only claim skills and qualifications you genuinely have. Reusing relevant language can make a CV clearer, but keyword matching cannot guarantee an interview or ATS result.

## Single purpose

Help the user tailor their CV to the job advert open in the active tab: send that advert to WorkCV, or highlight its CV-relevant skills, qualifications and wording.

## Permission justification

- `activeTab`: lets the extension access only the page the user explicitly chooses
- `scripting`: injects the packaged local scanner, job reader and highlight stylesheet after the user clicks a button

## URLs

- Support: https://workcv.co.uk/chrome/job-keyword-highlighter
- Privacy: https://workcv.co.uk/chrome/job-keyword-highlighter/privacy

## Screenshot captions

Upload in this order (all 1280x800, in `store-assets/`):

1. `screenshot-2-tailor-and-sponsor-1280x800.jpg`: Tailor your CV to the job you are viewing, and check the employer's sponsor licence
2. `screenshot-4-tailor-page-1280x800.jpg`: The advert opens in WorkCV, ready to tailor a copy of your saved CV
3. `screenshot-3-keyword-highlights-1280x800.jpg`: Highlight the skills, qualifications and ways of working the advert asks for

The original `screenshot-1-job-keyword-highlighter-1280x800.jpg` shows the old popup; remove it from the listing.

## Store item

Published 27 July 2026 as "WorkCV Job Keyword Highlighter" 0.1.0. Ship new versions as an update to that item (Package > Upload new package), not as a new item.
