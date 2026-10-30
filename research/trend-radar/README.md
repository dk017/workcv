# Trend radar

This folder is an internal review queue for trend signals that may become useful WorkCV guides, tools or templates. It is not a publishing queue.

## Prepare a review

```text
npm run trend:prepare -- --input="D:\\Downloads\\google-trends-export.csv" --as-of=2026-09-13 --window-start=2025-09-13 --window-end=2026-09-13
```

The script preserves the source values in a dated Markdown review, ranks breakout and higher-interest rows first, assigns a suggested cluster and marks every row for manual validation.

## Validation gate

Before building a page, check:

1. The query still appears in a fresh Google Trends snapshot for the intended country and time range.
2. Search Console or another first-party signal shows enough relevant impressions or clicks to justify the work.
3. The topic matches a real UK job-seeker intent that WorkCV can serve with an original guide, tool or template.
4. The result has a natural path into an existing WorkCV tool or the `/cv-builder-no-subscription-uk` money page.
5. The topic is not employer-variant duplication, unsafe advice, or a claim that would require current legal or financial verification.

Never auto-publish query text, trend percentages or employer variants. Keep generated reports internal, and record the decision to build, defer, refresh or reject each opportunity.
