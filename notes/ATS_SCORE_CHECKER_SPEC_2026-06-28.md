# ATS Score Checker: research and implementation specification

Last reviewed: 28 June 2026

## Product boundary

The tool compares pasted job-description text with pasted CV text in the browser.
It reports weighted exact keyword coverage. It does not upload files, inspect CV
layout, call an AI service, reproduce a named ATS, or predict an interview.

The UI must call the result a keyword match score and explain this boundary next
to the result.

## Evidence used

- National Careers Service advises tailoring a CV to the job advert, including
  the advert's essential criteria and requested skills:
  https://nationalcareers.service.gov.uk/careers-advice/cv-sections
- Prospects says ATS may screen for job-description keywords and recommends
  naming qualifications and certifications:
  https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/
- Roche's applicant guidance says recruiters may search parsed records for
  skills, qualifications, experience, qualities and the job title:
  https://careers.roche.com/global/en/resume-parsing-faq
- Applicant Tracking Software documents recruiter-defined, job-level keyword
  searches for important skills and experience:
  https://support.applicant-tracking.com/support/solutions/articles/3000034441-using-keywords-and-tags-to-organize-applicants-by-skill-experience
- Workable explains that parsers extract names, job titles, education, skills and
  work history, while formatting can affect extraction:
  https://resources.workable.com/stories-and-insights/how-ATS-reads-resumes

## Market observations

Current tools generally offer an overall score and missing keywords. Common gaps
are unexplained weighting, unsupported claims that a public score mirrors
employer systems, server-side CV uploads, and no distinction between mandatory
requirements and incidental words.

WorkCV differentiates through:

1. Local browser processing and an explicit privacy statement.
2. A visible scoring definition and honest limitation.
3. Separate job-title, skill/tool, qualification and action-verb categories.
4. Higher weighting for terms near requirement language and repeated terms.
5. Inflection matching for action verbs.
6. Action guidance that tells users not to claim missing skills they do not have.

## Scoring

- Job title base weight: 1.35
- Skill/tool base weight: 1.20
- Qualification base weight: 1.40
- Action verb base weight: 0.65
- Essential-context multiplier: 1.35
- Repeated-term multiplier: 1.15
- Additional repetition multiplier: 1.12 per repeat, capped at two repeats

Score = matched term weights / all extracted term weights, rounded to a whole
percentage.

The bands are WorkCV guidance, not an external ATS standard:

- 0-44: Low coverage
- 45-69: Partial coverage
- 70-100: Strong coverage

Input guardrails require at least 40 job-description words, 80 CV words and three
extracted terms. Maximum input lengths are 20,000 and 30,000 characters.

## Conversion

The result gives a concrete next action before showing the builder CTA. The CTA
uses the canonical price from `lib/site.ts` and links to a new Classic CV.

