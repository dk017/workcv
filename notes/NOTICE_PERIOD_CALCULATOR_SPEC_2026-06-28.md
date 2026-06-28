# WorkCV UK Notice Period Calculator

Research and implementation review date: 28 June 2026.

## User outcome

Given the current employment start date, contractual notice period and either a
desired new-job start date or desired employment end date, return:

- whether the target is workable if notice is received today
- the minimum contractual employment end date
- the earliest new-job start date
- the latest date notice can be received to meet the target
- employee statutory resignation notice
- employer statutory dismissal or redundancy notice

## Evidence and rules

- GOV.UK and Acas: an employee with at least one month of service must normally
  give at least one week's notice. A contract can require more.
- Acas: under one month, no statutory resignation notice is required where the
  written statement does not specify a period.
- GOV.UK and Acas: unless the contract says otherwise, notice starts the day
  after it is received.
- GOV.UK: employer statutory notice is one week from one month to two years,
  then one week per complete year up to 12 weeks.
- DWP Decision Makers' Guide 26725: one week received on Monday expires the
  following Monday.
- DWP Decision Makers' Guide 26726: one month from 14 June expires 14 July;
  notice on the last day of February expires on the last day of March.

Sources:

- https://www.gov.uk/handing-in-your-notice/giving-notice
- https://www.acas.org.uk/notice-periods/notice-when-resigning
- https://www.acas.org.uk/notice-periods/when-the-notice-period-starts
- https://www.acas.org.uk/notice-periods/when-an-employee-is-not-required-to-work-their-notice
- https://www.gov.uk/redundancy-your-rights/notice-periods
- https://assets.publishing.service.gov.uk/media/67f8f87d04146682e61bc86a/dmg_chapter_26.pdf

## Product decisions

- Calculate locally with no API and no data persistence.
- Assume notice is received on the user's current local date and display that
  assumption beside the submit action.
- Treat weeks as seven calendar days and months as calendar months.
- Preserve the official last-day-of-month behaviour for month-based notice.
- Do not automatically move an employment end date off a weekend or bank
  holiday. That could misstate the contractual end date.
- Label the result "minimum contract end", not "last working day", because
  holiday, work patterns, garden leave and PILON can produce different dates.
- Apply the later result from contractual notice and the employee statutory
  minimum.
- Search candidate dates to return the latest day notice can be received,
  including month-end and statutory-service boundary effects.
- Support custom calendar days, weeks and months. Contracts using "working
  days" require their own counting rule and must be confirmed with HR.

## Boundaries

This is general information, not legal advice. It does not decide employment
status, constructive dismissal, fixed-term termination rights, contractual
receipt rules, implied notice, restrictive covenants or whether an early release
has been agreed.

