# Chrome Web Store Draft

## Name

WorkCV: Tailor Your CV to This Job

## Short description

Send the UK job advert you are viewing to WorkCV to tailor a copy of your CV, and highlight the skills it asks for.

## Detailed description

Looking at a job on Indeed, Reed, NHS Jobs or a company careers page? Click "Tailor my CV for this job" and WorkCV opens with the advert ready. It makes a separate copy of your saved CV for that vacancy, so your original stays as it is, and walks you through the advert's keywords one at a time, adding only what you have really done.

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

1. Tailor your saved CV to the job advert you are viewing
2. Scan a UK job advert and highlight relevant wording
3. Group skills, qualifications and ways of working
4. Minimal browser permissions: only the tab you choose, only when you click
