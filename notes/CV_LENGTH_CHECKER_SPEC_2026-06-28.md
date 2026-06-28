# CV Length Checker: research and implementation specification

Last reviewed: 28 June 2026

## Product boundary

The tool counts pasted CV text locally in the browser. It returns a word count,
an estimated A4 page count, a verdict and result-specific editing actions. It
does not inspect an uploaded file or claim to know the actual rendered page
count.

## Evidence used

- University of Edinburgh: two pages is standard for a UK CV.
  https://careers.ed.ac.uk/cvs-and-applications/building-your-cv
- Reed: 91% of recruiters in its survey selected two pages as ideal; most
  two-page CVs contain roughly 700 to 1,000 words; one page can work for recent
  graduates.
  https://www.reed.co.uk/career-advice/how-long-should-a-cv-be/
- University of Reading: CVs are normally one or two complete pages; academic
  CVs may be four to eight pages because they contain additional sections.
  https://www.reading.ac.uk/essentials/Careers/Applications-and-interviews/Applications/CV-Overview
- University of Nottingham: a student CV should be one or two pages, with the
  most relevant material on page one.
  https://www.nottingham.ac.uk/careers/students/applications/cvs/checklist.aspx

## Market gap

Generic word counters return document statistics but do not interpret them for
UK CVs. CV review tools commonly require file uploads or combine length with an
opaque overall score. WorkCV keeps this tool narrow and transparent:

1. Exact word count and a clearly labelled 400-words-per-page estimate.
2. UK-specific verdict and exceptions.
3. Exact distance above or below the guidance range.
4. Paragraph, bullet and over-80-word paragraph diagnostics.
5. Result-specific actions that prioritise relevance over padding or arbitrary
   cutting.
6. Browser-only processing with no account.

## Rules

- Under 300 words: Too short.
- 300 to 800 words inclusive: Good length.
- Over 800 words: Too long.
- Estimated pages: words divided by 400 and rounded to one decimal.
- Minimum submitted input: 20 words.
- Maximum input: 40,000 characters.

These are WorkCV editorial bands, not official limits. Actual pages depend on
font, margins, spacing, headings and bullets. Employer instructions override the
tool. Academic, research, medical and some specialist CVs may legitimately be
longer.

## Conversion

The result gives a concrete editing plan before the builder CTA. The CTA uses
the canonical price from `lib/site.ts`.

