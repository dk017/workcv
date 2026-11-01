# Chrome Web Store Draft

New item, separate from "WorkCV: Tailor Your CV to This Job". It is not a duplicate: this one badges every employer on job listings automatically, the Tailor extension works on one advert after a click.

## Name

UK Visa Sponsor Checker by WorkCV

## Short description

See which employers hold a UK visa sponsor licence, with badges on job listings from the official Home Office register.

## Category

Productivity > Tools (same as the closest competitors). Language: English (UK).

## Detailed description

Applying for jobs in the UK and need a Skilled Worker visa? This extension shows, next to each employer on the job listings you browse, whether it holds a licence to sponsor workers.

Answers come from the Home Office register of licensed sponsors. WorkCV reloads the register from GOV.UK twice a day, so newly licensed and removed employers show up quickly.

Each badge tells you one thing:

- Licensed sponsor: an employer with this name is on the register. Click it to see the licence routes, locations and rating.
- Similar name listed: no exact match, but similar legal names are on the register. Job sites often show a brand name rather than the legal name.
- Not found on register: no employer with this exact name holds a licence. Large employers often hold it under a different legal name, so the popup lets you search others.
- Agency advert: the job was posted by a recruitment agency, whose own licence does not cover its clients' jobs.

Badges work on the major UK job boards. On any other job advert, open the extension and choose "Find the employer on this page", or type an employer's name to check it.

Privacy:

- only the employer names shown on the page are sent to WorkCV, never the page address, your searches or the advert
- names that look like recruitment agencies are not sent at all
- each answer is kept in your browser for a day, then deleted
- no account, analytics, advertising or browsing history
- badges can be switched off at any time from the popup

A sponsor licence means the employer can sponsor workers. It does not mean a particular job meets the visa rules or that the employer will sponsor you. This is information, not immigration advice.

Store rule: never list example keywords, qualifications, employers or other sites' names in this description. The Tailor extension's 0.2.0 update was rejected as keyword spam ("Yellow Argon") for a list of example qualifications.

## Single purpose

Show whether the employers on UK job listings hold a Home Office licence to sponsor work visas.

## Permission justification

- `storage`: keeps each employer's register answer for one day, and the on/off setting
- `activeTab`: lets the popup read the employer from the current job advert, only after the user clicks "Find the employer on this page"
- `scripting`: runs the packaged employer reader in that tab after the same click
- Host access to workcv.co.uk: sends employer names to WorkCV's search of the public sponsor register
- Content scripts on six UK job boards: read the employer names shown on their job pages to place the badges

## Data usage disclosures

- Collected: "Website content" (employer names shown on job pages), sent to workcv.co.uk only to search the register.
- Not sold, not used for anything unrelated to the single purpose, not used for creditworthiness or lending.

## Remote code

No. All code is packaged; the extension only fetches JSON register results.

## URLs

- Homepage: https://workcv.co.uk/chrome/uk-visa-sponsor-checker
- Support: https://workcv.co.uk/chrome/uk-visa-sponsor-checker
- Privacy: https://workcv.co.uk/chrome/uk-visa-sponsor-checker/privacy

## Screenshot captions

Upload in this order (1280x800, in `store-assets/`; sources are the HTML mocks beside them, with a fictional job board and employers):

1. `screenshot-1-badges-1280x800.jpg`: A sponsor badge beside every employer; click one for the licence details
2. `screenshot-2-popup-1280x800.jpg`: Check any employer by name, or find the employer on the advert you are reading

## After publishing

Set `site.sponsorExtensionUrl` in `lib/site.ts` to the store link (by item ID) so the WorkCV page shows "Add to Chrome".
