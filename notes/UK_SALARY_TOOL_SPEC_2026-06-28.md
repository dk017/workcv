# UK Salary by Job Title: research and implementation specification

Last reviewed: 28 June 2026

## Primary dataset

Office for National Statistics, Annual Survey of Hours and Earnings (ASHE),
2025 provisional, Table 14.7a, annual gross pay for full-time employee jobs by
four-digit SOC 2020 occupation:

https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/occupation4digitsoc2010ashetable14

Release date: 23 October 2025. Reference period: April 2025.

The tool uses three published cells for each mapped occupation:

- Low: 25th percentile.
- Typical: median (50th percentile).
- High: 75th percentile.

This describes the middle 50% of the distribution, not an absolute minimum and
maximum. The implementation excludes occupations where any required percentile
is suppressed or marked unreliable in the workbook.

The figures cover UK full-time employee jobs where the employee had been in the
job for at least one year. They are annual gross pay, not take-home pay,
contractor rates or live advertised salaries. ONS says the 2025 ASHE achieved
sample was 174,000 and was selected from PAYE records.

## Graduate result

Graduate is not an occupation and must not be mapped to an SOC code. The result
uses three separately labelled benchmarks:

- GBP 28,500: HESA Graduate Outcomes broader-market average reported by the
  University of Sheffield.
- GBP 33,000: Institute of Student Employers 2024/25 median graduate starting
  salary.
- GBP 35,000: High Fliers 2026 median at the UK's 100 leading graduate
  employers.

These are not presented as percentiles from one population.

## Coverage

The static dataset contains 60 results: 59 unique ONS four-digit occupations and
one graduate benchmark. Friendly titles have aliases but every result displays
the underlying ONS occupation and SOC code.

## Market gap

Job-board tools commonly show advertised averages; self-report tools commonly
show estimated title/location ranges. WorkCV differentiates through:

1. Direct official-pay percentiles rather than an unexplained average.
2. Visible occupation mapping and SOC code.
3. Explicit date, employment scope and percentile definitions.
4. Search aliases without hiding the underlying classification.
5. Gross monthly and weekly conversions with the arithmetic explained.
6. No account, salary disclosure or personal data input.

## Conversion

The result first answers the salary query, then links to the CV builder. The CTA
uses the canonical price from `lib/site.ts`.

