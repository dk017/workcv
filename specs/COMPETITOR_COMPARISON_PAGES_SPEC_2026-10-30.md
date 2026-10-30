# Competitor comparison pages — 30 October 2026

Replace the six cancellation guides with two page types per competitor — `WorkCV vs <brand>` and
`<brand> alternatives UK` — plus a `/compare` hub. Sources: `research/competitor-comparison-source-log-2026-10-30.md`.

## Competitors (12)

MyPerfectCV, LiveCareer, Zety, Resume.io, CVmaker, Enhancv, Kickresume, Canva, Novorésumé, StandOut CV, CV Genius, FlowCV.

## URL map

| Competitor | WorkCV vs page | Alternatives page |
|---|---|---|
| MyPerfectCV | `/workcv-vs-myperfectcv` | `/myperfectcv-alternative-uk` (kept) |
| LiveCareer | `/workcv-vs-livecareer` | `/livecareer-alternative` (kept) |
| Zety | `/workcv-vs-zety` | `/zety-alternative-uk` (kept) |
| Resume.io | `/workcv-vs-resume-io` | `/resume-io-alternative-uk` (kept) |
| CVmaker | `/workcv-vs-cvmaker` | `/cvmaker-alternative` (kept) |
| Enhancv | `/workcv-vs-enhancv` | `/enhancv-alternative-uk` (kept) |
| Kickresume | `/workcv-vs-kickresume` | `/kickresume-alternative-uk` (new; URL already had Bing impressions) |
| Canva | `/workcv-vs-canva` | `/canva-cv-alternative-uk` (kept) |
| Novorésumé | `/workcv-vs-novoresume` | `/novoresume-alternative-uk` (new) |
| StandOut CV | `/workcv-vs-standout-cv` | `/standout-cv-alternative-uk` (new) |
| CV Genius | `/workcv-vs-cv-genius` | `/cv-genius-alternative-uk` (new) |
| FlowCV | `/workcv-vs-flowcv` | `/flowcv-alternative-uk` (new) |

Existing alternative URLs keep their equity; only their content changes.

Permanent redirects: each `/cancel-<brand>-uk` to that brand's alternatives page (which keeps a short,
sourced "switching from <brand>" section so the redirect still answers the visitor), and
`/myperfectcv-vs-livecareer-uk` (404 with Bing impressions) to `/compare`.

## Page anatomy

**WorkCV vs <brand>** (head-to-head, decision intent)

1. H1 `WorkCV vs <brand>` + one-paragraph answer that names who should pick each.
2. Key facts box: prices, billing model, free option, formats — each with checked date and source.
3. Side-by-side table (semantic `<table>`, caption).
4. "What it costs if you need a CV for 1, 3 or 12 months" — computed only from `uk-page` figures.
5. When <brand> is the better choice (honest) / when WorkCV is.
6. Switching notes (keep <brand>'s files, cancel via its official route — link only).
7. FAQ (question-form, answer-first sentences) + sources + related comparisons.

**<brand> alternatives UK** (list intent)

1. H1 `<brand> alternatives UK` + answer naming the best option per need.
2. Why people look for an alternative (from that brand's real pricing/model).
3. Ranked list (ItemList schema) of 4–6 options with "best for", price model and the trade-off; WorkCV
   is one option, free tools are included where they fit better.
4. Quick comparison table of the listed options.
5. Switching from <brand> (official cancellation route link, what to keep).
6. FAQ, sources, related links.

**/compare** hub: one table of every builder (price model, entry price, renewal, free option, formats),
links to all 24 pages, CollectionPage + ItemList schema.

## SEO and AEO checklist (audit every page)

- Unique `<title>` ≤ 60 characters before the ` | WorkCV` suffix; primary keyword first.
- Meta description 120–160 characters with the decisive fact (price or model).
- One H1; H2s phrased as the questions people ask; no duplicated H2 sets across sibling pages.
- First 60 words answer the query directly and name both brands.
- Every competitor price carries a checked date and links its official source; conflicts disclosed.
- Semantic table with caption; numbers in text, not only in images.
- Schema: Article (dateModified, publisher), BreadcrumbList, FAQPage; ItemList on alternatives;
  CollectionPage on hub. No Review/AggregateRating.
- Canonical, Open Graph, sitemap entry with lastModified, linked from the hub and footer.
- Internal links: vs ⇄ alternatives for the same brand, hub, 2–3 sibling comparisons, pricing.
- Honest: says when the competitor or a free tool is the better fit; no disparagement, no invented
  ratings, no "free" claim for the WorkCV PDF, no claim WorkCV has AI writing or cover letters.
- Copy unique per page (no doorway duplication): brand-specific verdict, fit lists, FAQs and alternatives.
- `llms.txt` lists the comparison pages.
