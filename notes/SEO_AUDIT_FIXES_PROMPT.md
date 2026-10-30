# WorkCV — SEO & Copy Fix Brief (for a coding agent)

You are working in the **WorkCV** repo: a Next.js 14 (App Router, TypeScript, Tailwind) site at `workcv.co.uk`. It is a UK CV builder with a one-time pricing model (build & preview free, pay a single fee — value from `lib/site.ts` — at PDF download, no subscription). This brief is the output of a full SEO + copy audit of every indexable page. Implement the changes below. Work top-to-bottom (Critical → Low). Do not change unrelated code.

## Conventions you must follow
- **UK English** spelling and tone throughout (organise, personalise, favourite, etc.).
- Prices always come from `lib/site.ts` (`site.priceGbp` / `site.price`) via **template literals (backticks)** — never hardcode the number and never put `${...}` inside a plain `"..."` string.
- Do **not** invent reviews, ratings, star counts, customer numbers, or `AggregateRating`/`Review` schema — there is no review data.
- Do **not** add `HowTo` schema (deprecated by Google, no rich result).
- **FAQ rich results were retired by Google (May 2026).** Keep/render FAQ content for users and AI citation, but do not expect or claim a SERP rich result from `FAQPage` schema.
- Reuse existing shared components (`components/marketing.tsx`: `FaqSection`, `FinalCta`, `ButtonLink`, etc.) and existing helpers (`lib/product-schema.ts`).
- After changes, `npm run type-check` must pass.

---

## WORKSTREAM 1 — Global / systemic (do first, highest ROI)

### 1.1 [Critical] Fix the analytics tracker domain
`app/layout.tsx` loads Piqo analytics with `data-domain="werkcv.nl"` — that is a **different site**, so all WorkCV traffic is being attributed to the wrong property.
- Change `data-domain` to `"workcv.co.uk"`.
- Verify the `data-site="hq2xtnu4"` key is the correct site key for the WorkCV Piqo property (confirm with the owner if unsure — do not guess a new key).

### 1.2 [High] Render the hidden FAQ content on 16 pages
These pages emit a `FAQPage` JSON-LD block with genuinely useful, unique Q&A, but **never render the answers on the page** (they don't use `FaqSection`). The answers are invisible to users and to engines/AI reading the rendered HTML — wasted, highly citable content, and a structured-data-visibility mismatch (markup should reflect visible content).

For each page below, render the existing FAQ array with the shared `FaqSection` component (already used correctly on `resume-template-uk` and `cv-vs-resume-uk`). Reuse the same array that feeds the JSON-LD — no new copy needed. Place it before the `FinalCta`.

```
career-change-cv-uk            cv-template-driver-uk        professional-cv-template-uk
cv-employment-gap-uk           cv-template-engineer-uk      return-to-work-cv-uk
cv-no-experience-uk            cv-template-graduate-uk      right-to-work-cv-uk
cv-personal-statement-uk       cv-template-nurse-uk         how-to-write-a-cv-uk
cv-template-care-worker-uk     cv-template-teacher-uk
cv-template-customer-service-uk  cv-template-warehouse-uk
```

### 1.3 [High] Add self-referencing canonicals
These indexable pages export only `title`/`description`, so Next emits **no canonical tag**. Add `alternates: { canonical: "/<slug>" }` to each (match the pattern already used on `cv-vs-resume-uk`, `pricing`, etc.):
- Guides: `how-to-write-a-cv-uk`, `cv-no-experience-uk`, `career-change-cv-uk`, `return-to-work-cv-uk`, `cv-employment-gap-uk`, `cv-personal-statement-uk`, `right-to-work-cv-uk`
- Role templates: `cv-template-care-worker-uk`, `cv-template-graduate-uk`, `cv-template-nurse-uk`, `cv-template-teacher-uk`, `cv-template-warehouse-uk`
- Thin pages in sitemap: `student-cv-template`, `school-leaver-cv-example`, `cvmaker-alternative`, `livecareer-alternative` (extend `metadataFor` in `components/generic-page.tsx` to accept/emit a canonical path)

### 1.4 [Medium] Add sitewide brand-entity schema
In `app/layout.tsx`, inject `Organization` + `WebSite` JSON-LD (name WorkCV, url, logo = `/opengraph-image` or a real logo, sameAs if any social profiles exist). This is a GEO/brand-entity signal currently missing (only 2 deep pages have `Organization`).

### 1.5 [Medium] Add BreadcrumbList schema
No page has `BreadcrumbList`. Add a small helper and emit it on nested routes: `/tools/*` (Home › Tools › X) and `/situations/*` (Home › X). Optionally extend to role/guide pages. `made-redundant` already has a visible breadcrumb — give it matching JSON-LD.

### 1.6 [Medium] Stop internal links from 301-hopping
`components/marketing.tsx` footer links to redirected slugs. Repoint to the live targets:
- `/tools/cv-length-checker` → `/tools/cv-word-count-checker`
- `/tools/personal-statement-generator` → `/tools/cv-summary-generator-uk`
- `/tools/salary-calculator` → `/tools/take-home-pay-calculator-uk`
Also fix `app/career-change-cv-uk/page.tsx` (links to `/tools/salary-calculator`) and `app/cv-builder-no-subscription-uk/page.tsx` (links to `/cv-with-no-experience` → repoint to `/cv-no-experience-uk`).

### 1.7 [Low] Cancel-page HowTo schema
The 6 `cancel-*` pages use deprecated `HowTo` schema (no rich result, harmless). Optional cleanup: remove the `HowTo` JSON-LD (do not replace it with new `HowTo`).

---

## WORKSTREAM 2 — Thin & duplicate pages

### 2.1 [Critical] Promote thin generic pages to the rich pattern
`student-cv-template` and `school-leaver-cv-example` are in the sitemap but render `<GenericMarketingPage>` (`components/generic-page.tsx` + `lib/pages.ts`): ~120–150 unique words, an identical shared 4-question FAQ, a generic CV preview, and **no canonical / OG / schema**. The 8 role pages have 6–8× the depth. Migrate both to the role-page pattern: add `student` and `schoolLeaver` entries to `lib/role-cv-templates.ts` (education-first CV — GCSEs/A-levels, part-time work, volunteering/DofE, no fabricated employment) and give each page its own `recruiterChecks` / `structure` / `bulletExamples` / `mistakes` / `sourceNotes` (National Careers Service, UCAS, Barclays LifeSkills are citable) plus canonical + OG. (Note: `/cv-template-graduate-uk` links to `student-cv-template` and `/cv-template-warehouse-uk` links to `school-leaver-cv-example`, so authority currently flows into the weakest pages.)

### 2.2 [High] Resolve the MyPerfectCV alternative duplicate
`app/myperfectcv-alternative/page.tsx` (thin, non-`-uk`) has **no redirect and no canonical** and competes with the rich `myperfectcv-alternative-uk`. 301-redirect `/myperfectcv-alternative` → `/myperfectcv-alternative-uk` in `next.config.js` (preferred), or set its canonical to the `-uk` URL.

### 2.3 [Medium] Upgrade the two canonical thin alternative pages
`cvmaker-alternative` and `livecareer-alternative` are the intended live pages (their `-uk` variants 301 to them) but are thin generic-template pages, despite having full subscription cancel guides. Promote them to rich comparison pages like `enhancv-alternative-uk` (see Workstream 6 for the gold-standard pattern). At minimum: add canonical + OG and a brand-specific cross-link to `/cancel-cvmaker-uk` / `/cancel-livecareer-uk`.

### 2.4 [Medium] Remove dead page files left behind by redirects
`next.config.js` 301s these routes, so their `page.tsx` never renders:
- Delete `app/tools/salary-calculator/page.tsx` (re-export stub).
- Delete `app/tools/personal-statement-generator/page.tsx` (a full 228-line tool now unreachable) and its component if unused elsewhere — `cv-summary-generator-uk` is the declared canonical tool.
- **Invert the length-checker module:** the live route is `/tools/cv-word-count-checker`, but the real content lives in `app/tools/cv-length-checker/page.tsx` (which `cv-word-count-checker/page.tsx` re-exports). Move the content into `cv-word-count-checker/page.tsx` and delete `cv-length-checker/page.tsx`.

### 2.5 [Low] Collapse a redirect chain
`/cv-builder-uk` → `/cv-builder` → (in-page `permanentRedirect`) → `/cv-builder-no-subscription-uk`. Point `/cv-builder-uk` directly to `/cv-builder-no-subscription-uk` in `next.config.js`.

---

## WORKSTREAM 3 — Role template pages (consistency & conversion)

The 8 role pages (`cv-template-{care-worker,customer-service,driver,engineer,graduate,nurse,teacher,warehouse}-uk`) are genuinely differentiated and high quality — these are refinements, not rewrites. Use `cv-template-customer-service-uk` as the reference for structure/metadata.

- **[High] Add `alternates.canonical` + `openGraph`** to the 5 pages missing them: `care-worker`, `graduate`, `nurse`, `teacher`, `warehouse` (customer-service/driver/engineer already have both). (Canonical also covered in 1.3.)
- **[High] Fix the FinalCta losing the pre-filled role draft** on those same 5 pages. They pass only `secondaryHref`, so the primary button falls back to the generic `/editor`. Pass `primaryHref={editorHref}` (the `/editor?template=classic&roleTemplate=<role>&new=1` value) and a role-specific label, e.g. `primary="Use nurse CV template"`.
- **[High] `care-worker` H1** — `"Show safe, person-centred care with evidence employers can trust."` contains neither "care worker" nor "CV". Rewrite, e.g. `"Build a care worker CV around safe, person-centred evidence."`
- **[Medium] De-clone the customer-service embedded CV.** `customerServiceCv` spreads `generalCv` and only re-writes profile/skills; the experience/education entries are byte-identical to the generic draft. Give it ≥1 contact-centre/live-chat-specific experience entry.
- **[Medium] Sibling interlinking:** add reciprocal `nurse ↔ care-worker` links (shared care-sector intent); add `warehouse → driver` (driver already links to warehouse — currently asymmetric; warehouse instead links the thin `school-leaver` page).
- **[Low]** `engineer` tailoring box heading `"Check for:"` → `"Check the advert for:"` to match siblings.
- **[Low]** Consider working "template" into 2–3 role H1s (currently all follow `"Build a [role] CV…"`; target term lives only in the kicker + title).
- **[Low]** Demote the supporting `<aside>` "What to avoid" heading from `<h2>` to `<h3>` (it sits beside a section that already has an `<h2>`). Same on `professional-cv-template-uk` and `ats-cv-template-uk`.

---

## WORKSTREAM 4 — Guide / informational pages

(Canonicals = 1.3; visible FAQ = 1.2.)
- **[Medium] `cv-builder-scams-uk` — verify load-bearing statutory figures.** The page states government research "published in April 2026" found "3.6 million unwanted UK subscriptions… £1.6 billion spent annually" and savings of "around £400 million a year," plus DMCC subscription rules "no earlier than autumn 2026." These are exactly the numbers AI engines will attribute to WorkCV. Confirm each figure and the April-2026 dating against the linked gov.uk source, or soften to "government research" without the specific month if it can't be verified.
- **[Low] E-E-A-T author signal** on `cv-builder-scams-uk` and `situations/made-redundant`: their `Article` schema uses `author: Organization` only. Add a named author/reviewer + review date — these are money/trust pages.
- **[Low] `career-change-cv-uk` hero is over-salesy** (`"WorkCV helps you turn previous roles into relevant UK CV evidence, then download for £X when ready."`). Keep the hero informational and defer price/CTA to the `FinalCta`, e.g. `"A career change CV bridges what you've done with what you want next — reframing previous roles as relevant, honest evidence for the target job."` Also add `relatedLinks` to `how-to-write-a-cv-uk` and `cv-personal-statement-uk`.
- **[Low] `cv-vs-resume-uk`** — outbound citations to Prospects / National Careers Service / GOV.UK carry `rel="nofollow"`. Drop `nofollow` on these editorial/authority citations (keep it on commercial competitor links). Review the same on the no-subscription pages' National Careers Service links.
- **[Low]** Add a `how-to-write-a-cv-uk → cv-vs-resume-uk` cross-link.

---

## WORKSTREAM 5 — Homepage, pricing & hub pages

- **[High] Homepage (`app/page.tsx`) internal-linking gap.** It only links to `/pricing` and `/templates`. As the top link-equity distributor, add a "Popular guides & examples" block linking to `/cv-examples-uk`, `/how-to-write-a-cv-uk`, `/ats-cv-template-uk`, `/professional-cv-template-uk`, and `/cv-builder-no-subscription-uk`.
- **[High] Pricing (`app/pricing/page.tsx`) primary CTA contradicts the model.** `"Build my CV for {price}"` implies building costs money, contradicting the page's own "build first, pay at download" thesis. Change to `"Start building free"` or `` `Build free — pay ${site.priceGbp} at download` ``.
- **[Medium] Homepage guarantee anchor mismatch.** `"See the no-hidden-fees guarantee"` links to `/pricing`, which has no "guarantee" section or that phrase. Either add a short guarantee block to `/pricing` or change the anchor to `"See the full pricing breakdown"`.
- **[Medium] `cv-examples-uk` hero CTA intent.** Primary CTA `"Open CV builder"` → `/cv-builder-no-subscription-uk` (a marketing page). A user on an examples page expects to start editing — point it at `/editor?template=classic&roleTemplate=general&new=1` (as this page's own footer CTA already does) and demote the marketing page to a text link. Also add a link to `/how-to-write-a-cv-uk`.
- **[High] `professional-cv-template-uk`** — emits `FAQPage` schema with no visible FAQ (fix via 1.2) and, unlike sibling template landers, has **no product schema**. Add `buildWorkCvProductSchema` for consistency.
- **[Low] `templates` page** emits no schema though it lists three named layouts with a price — add `ItemList` (or `Product`) schema.
- **[Low] `editor` page** metadata is `"CV editor"` (lowercase, no keyword). Unauthenticated users are redirected to `/login`, so either set `robots: { index: false }` here and confirm `/login` has clean metadata, or capitalise to `"CV Editor"`.

---

## WORKSTREAM 6 — Competitor "alternative" & "cancel" pages

`enhancv-alternative-uk` is the **gold standard** (refuses to invent an unverified GBP price, cites 5 official sources, states independence/trademark disclaimer, discloses WorkCV's own limitations, dated check). Bring the others up to it.

- **[High] De-duplicate the three near-identical alt pages** (`myperfectcv-alternative-uk`, `resume-io-alternative-uk`, `zety-alternative-uk`): same section order, identical `benefits`/`workCvBenefits` arrays, verbatim FAQ items, and H1s that differ only by brand (`"A [Brand] alternative without monthly CV billing."`). Rewrite each H1 to a distinct, fact-led line, e.g. `` `Resume.io renews at £20.95 every 4 weeks. WorkCV is one ${site.priceGbp} download.` `` and add brand-specific substance (ownership/group, the specific trial-to-renewal pattern, support channel).
- **[Medium] Convert comparison "tables" to semantic `<table>`.** Every alt page and the "After cancelling" block on the cancel pages render the comparison as `grid` `<div>`s with `<span>` headers. Use real `<table><thead><th>…` with a `<caption>` (e.g. `"MyPerfectCV vs WorkCV pricing, checked 21 July 2026"`) for reliable AI extraction and accessibility.
- **[Medium] Stale/hardcoded competitor pricing.** Alt + cancel pages hardcode competitor prices with a fixed `checkedDate = "13 June 2026"` (now stale). Move price + `checkedDate` into one dated data source you can refresh, or follow the `enhancv` approach and stop quoting a hard figure. Standardise price strings on `£` (some rows use `"GBP 2.95"`).
- **[High] Complete every brand cluster with reciprocal links** (alternative ↔ its cancel guide). Currently only Zety is fully bidirectional. Add links on: `cancel-myperfectcv-uk`, `cancel-resume-io-uk`, `cancel-cvmaker-uk`, `cancel-livecareer-uk` → their alternative page; and `myperfectcv-alternative(-uk)`, `cvmaker-alternative`, `livecareer-alternative` → their cancel page.
- **[Medium] `canva-cv-alternative-uk` ATS claim.** `"ATS caution — Depends heavily on template choice and layout"` implies Canva CVs are ATS-risky as a class. Reframe to a template-scoped, verifiable statement, e.g. `"Multi-column/graphic templates can reduce ATS parsing; simple layouts parse fine."`
- **[Medium] Verify cancel-page facts or hedge them.** Phone numbers, prices, and cancellation flows are stated as current fact (e.g. MyPerfectCV `0808 189 0676`; Zety `0808 196 5805`, descriptors `Zety.com/BLD*…`; LiveCareer `0808-189-0354`, `£1.95`→`£19.85`; CVMaker `£0.99`→`£19.99`; Resume.io cancel-form flow + 7-day rule). Confirm against each official source or add a hedge (`"as listed on the official contact page, checked …"`).
- **[Low] Add the independence/trademark disclaimer + "Official sources" block** (copy the enhancv pattern) to `myperfectcv-alternative-uk`, `resume-io-alternative-uk`, `zety-alternative-uk`, `canva-cv-alternative-uk`.
- **[Low]** Standardise alt-page hero CTAs (enhancv uses `"Build my UK CV"`; others use `"Build my CV for £X"` — pick one).

---

## WORKSTREAM 7 — Free tool pages

- **[High] `ats-score-checker` keyword mismatch.** The URL (and the `/tools/ats-cv-checker-uk` redirect) target "ATS/CV checker," but the title is `"Free AI CV Fit Checker UK…"` and the H1 `"Will your CV make your fit clear for this vacancy?"` contains none of ATS/CV/checker. Rewrite the H1, e.g. `"Free ATS CV checker: see how well your CV matches a UK job"`, and put "ATS" back in the `<title>`. Keep the honest "not a real ATS score" clarification in the body.
- **[Medium] Tool cross-linking gaps** (tools should link to related tools + a relevant guide/template):
  - `ats-score-checker` → `cv-bullet-point-generator`, `cv-keyword-density-checker`, `/ats-cv-template-uk`, `/how-to-write-a-cv-uk` (currently links only externally).
  - `cv-gap-detector-uk` → `ats-score-checker`, `cv-word-count-checker`.
  - `cover-letter-generator-uk` → `cover-letter-template-uk` (template links to generator, not reciprocal).
  - `blank-cv-template-uk` → `cv-template-word-uk` (reciprocal), `/templates`, `/how-to-write-a-cv-uk`.
  - `notice-period-calculator` → `redundancy-pay-calculator`, `/situations/made-redundant`, salary tools.
  - `cv-word-count-checker` → `cv-readability-checker`, `cv-keyword-density-checker`, `cv-gap-detector-uk`.
- **[Medium] `uk-living-wage-checker-2026` year-in-URL risk.** The slug hardcodes `-2026`; rates change every April. Rename to evergreen `/tools/uk-living-wage-checker`, 301 the `-2026` slug, keep "2026" only in title/H1/copy (the pattern already used by the redundancy and take-home tools). Also clearly label the two data vintages (statutory NLW "from 1 April 2026" vs Real Living Wage "2025–26").
- **[Medium] `blank-cv-template-uk` vs `cv-template-word-uk` near-duplicate.** Both serve the identical DOCX (`/api/tools/blank-cv-template`) and describe the same template. Sharpen the angles (blank = structure/placeholders; word = DOCX editing/export workflow), add the reciprocal link, and monitor for cannibalisation.
- **[Low]** `notice-period-calculator` FAQ question `"Do weekends and bank holidays count? "` has a trailing space (line ~38).
- **[Low]** Annual-refresh reminder (leave a code comment) on `redundancy-pay-calculator` (caps £751/£783, £22,530/£23,490), `take-home-pay-calculator-uk` (2026/27 thresholds), and the living-wage tool.

---

## Suggested order of execution
1. Workstream 1 (global) — analytics domain, visible FAQ, canonicals, brand + breadcrumb schema, link repointing.
2. Workstream 2 (thin/duplicate) — redirect fixes, dead-file cleanup, thin-page promotion.
3. Workstreams 3–7 (page-level) in priority order within each.

## Acceptance checklist
- [ ] `npm run type-check` passes.
- [ ] No hardcoded prices; all via `site.priceGbp`/`site.price` in backtick strings.
- [ ] Every page in the sitemap emits exactly one self-referencing canonical.
- [ ] No page emits `FAQPage` JSON-LD without a matching visible FAQ.
- [ ] No internal link points at a slug that 301-redirects.
- [ ] No new `HowTo` schema; no invented reviews/ratings.
- [ ] UK spelling throughout; informational pages keep hero copy informational.
