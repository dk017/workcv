# Competitor comparison source log — 30 October 2026

Research for the `/compare` hub, the `WorkCV vs <brand>` pages and the `<brand> alternatives` pages.
Official competitor sites could not be fetched directly from the research environment, so figures were
taken from search-engine copies of each brand's own pages (restricted to the brand's domain) and
cross-checked against third-party reviews. Third-party prices were only used to flag conflicts, never
as the published figure.

Confidence labels used in `lib/competitors.ts`:

- `uk-page` — GBP figure on the brand's own UK pricing page.
- `uk-page-conflict` — GBP figures on the brand's own pages disagree; both are disclosed.
- `regional` — the brand's own pages quote USD or EUR; UK checkout may show a different GBP amount.

## Overrides from WorkCV's direct check of 4 October 2026

`lib/competitor-plans.ts` records prices read directly from official pages on 4 October 2026. Where it
disagrees with the search-engine copies above, the direct check wins and a test keeps the two files in step:

- Zety: the UK pricing address redirected to the US-dollar page ($1.95 for 14 days, then $25.95 every 4 weeks;
  $71.40 a year). The older £2.95 / £20.95 UK figures are mentioned only as older.
- Kickresume: pricing page $9 a month or $48 a year; free with the 4 basic templates and free options.
- MyPerfectCV, LiveCareer, Zety: each site's terms name BOLD LLC; free downloads are TXT only.

## WorkCV (product facts from the live code)

- £7.99 once per saved CV and matching cover letter, downloaded as PDF and editable single-column Word.
- £24.99 Job Search Pass: unlimited new CVs and letters for 90 days; never renews.
- Build and preview with no account; email code to save, download or import. Import reads PDF and DOCX, not pasted text.
- AI suggests CV bullets and a profile summary, applied only on approval. Free ATS checker (five-part score) and job tracker.
- Three layouts: single-column Classic; Modern and Compact with a sidebar.

## WorkCV (product facts from the old main branch, superseded)

- £7.99 one-time unlock for one saved CV (`lib/commerce.ts`), VAT inclusive, edit and redownload that CV without paying again.
- Build and preview free; email-code login required; PDF export only (no DOCX from the editor).
- Three layouts (classic, modern, compact). Import of an existing CV uses an AI parser (`lib/cv-import.ts`).
- No AI writing, no cover-letter builder and no ATS score inside the editor. Free separate tools on the site:
  blank Word CV template, cover letter template and generator, ATS keyword checker.
- Refunds: if access fails or a duplicate charge occurs; cancellation rights may be affected once immediate digital access starts (`/refund-policy`).

## MyPerfectCV — Bold LLC

- myperfectcv.co.uk/pricing: £2.95 for 14 days, then £16.95 every 4 weeks; annual £59.40 upfront (£4.95/month), auto-renews yearly. Currency symbols partly stripped on the page; £ confirmed by homepage and structured data.
- Formats: PDF, Word (DOC/DOCX), TXT per FAQ and pricing page. AI CV builder, AI cover letter tool, ATS checker.
- Terms: renews automatically until cancelled; recurring charge set at the price agreed at purchase.

## LiveCareer UK — Bold LLC

- livecareer.co.uk/pricing: £1.95 for 14 days, then £19.85 every 4 weeks; annual £83.40 (£6.95/month). The same page's FAQ is ambiguous about annual billing frequency — disclosed.
- 14-day money-back guarantee on the pricing page. Cancel any time in the online dashboard (help article).
- Statement descriptors on the contact page: LiveCareer.co.uk, BLD*Livecareer.co.uk, PayPal *LIVECAREER.

## Zety — Bold LLC (acquired 2019 per bold.com timeline)

- zety.com/uk/pricing: £2.95 for 14 days, then £20.95 every 4 weeks; annual £59.40 (£4.95/month). Indexed copy is older; a July 2026 check saw the UK URL redirect to non-UK pricing — confirm at checkout.
- Documents stay in the account after cancelling (Zety).

## Resume.io

- resume.io/uk/pricing: £2.95 for 7 days, then £20.95 every 4 weeks; quarterly £49.95 every 3 months. Free plan: one CV and one cover letter, TXT download only.
- Premium: PDF and Word downloads, unlimited CVs and cover letters. 7-day money-back guarantee. Pricing varies by location (help centre).
- Previous WorkCV figure (£19.95, checked 23 July 2026) superseded.

## CVmaker (cvmaker.uk)

- Pricing page: Pro £21.99 per month after a 7-day £2.95 trial, auto-renews. Help article: £0.99 for 7 days then £19.99 per month. Conflict disclosed.
- Free Basic plan: build CVs and cover letters with AI assistance; download needs Pro.
- Terms: no refund or pro-rata refund for the current period after cancelling; access continues to the date in the confirmation email.

## Enhancv

- enhancv.com/uk/pricing ("from £12.99"): structured data Pro Monthly £24.59, Quarterly £48.98, Semi-annual £77.96; visible text differs in places. Taxes and currency may vary by region.
- 7-day free plan with Enhancv branding and section limits; no card per help centre.
- Builder exports PDF or TXT, not DOCX (pricing FAQ).

## Kickresume

- Own pages: $24/month monthly, $18/month quarterly, $8/month yearly ($96/year); EUR figures elsewhere. No GBP found.
- Free plan: unlimited PDF or Word downloads without watermark if only free customisation options are used. Account required.
- 14-day money-back guarantee; students and teachers up to 6 months Premium free (ISIC/ITIC/UNiDAYS).

## Canva

- Canva Pro US$12/month billed yearly or US$18 monthly (help centre, US prices; UK price set per country at canva.com/pricing).
- Free plan: free CV templates; PDF, JPG, PNG download; no Word export; premium elements watermarked unless upgraded.
- General design tool, not a CV-specific builder.

## Novorésumé

- Free Basic: one single-page CV, predefined layouts, 3 fonts.
- Pro: subscription billed monthly, quarterly or yearly, plus a one-off Pro Pass (single payment for one month, nothing recurring). Prices conflict across own pages (about $19.99–$23.99 for a month). 14-day money-back guarantee.

## StandOut CV (UK)

- Pricing page: all plans include unlimited CV edits, unlimited PDF downloads, unlimited versions; pay only when happy with the CV. Plan amounts not visible in indexed copy.
- StandOut blog (older): £2.70 for first 14 days, then £16.95 per month. Treated as unconfirmed.
- Cancel within the account; access continues to the end of the term.

## CV Genius

- Free CV maker with unlimited TXT downloads; PDF and Word downloads need a paid plan.
- FAQ (older): £2.90 for the first two weeks; renewal price not found. Terms: cancellation takes effect at end of the billing period, no refund of remaining time; 14-day refunds via support before trial ends.

## FlowCV

- Free plan: one saved resume and one cover letter, all templates, unlimited watermark-free PDF downloads, 3 imports.
- Pro: US$5/month or US$60 billed yearly — unlimited documents, AI writing and translation, job tracker.

## Free UK options referenced on alternatives pages

- Barclays LifeSkills CV builder: free account, download as a Word document (barclayslifeskills.com).
- WorkCV blank Word CV template: free .docx, no sign-up (`/tools/blank-cv-template-uk`).

## Ownership

- Bold LLC operates LiveCareer, Zety, MyPerfectCV and other builders (bold.com timeline; disclosures on Bold-operated review pages). A 2026 antitrust lawsuit about Bold's brand portfolio is an allegation only and is not referenced on WorkCV pages.
