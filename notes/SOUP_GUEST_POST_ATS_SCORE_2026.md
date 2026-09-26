# Soup.io Guest Post Submission Package

## Recommended Title

**The Myth of the Universal ATS Score: What Job Seekers Should Optimise Instead**

Alternative title: **Your CV Does Not Have One “ATS Score” - Here Is What Recruitment Software Actually Sees**

Category: Technology or Business

## Refined Outline

1. Open with the central misconception: a CV does not carry one portable ATS score.
2. Prove the point using current documentation from four recruitment platforms:
   - Lever parses CV content into candidate fields.
   - Greenhouse supports exact-keyword and Boolean retrieval.
   - Oracle generates separate 0–5 ratings for four categories.
   - Workable calculates a percentage of criteria met and permits human overrides.
3. Explain what we learned while designing a responsible CV-fit checker:
   - deterministic checks and AI judgement should be separated;
   - AI should cite CV evidence rather than invent a score;
   - “not evidenced” is more accurate than “missing”;
   - no checker should promise an interview outcome.
4. Give job seekers a five-part, system-agnostic method:
   - make the file extractable;
   - mirror truthful vacancy language;
   - convert claims into evidence;
   - map essential requirements;
   - optimise for human verification.
5. Add the employer-side responsibility: transparency, testing and human review.
6. Conclude with a durable principle: do not write for a mythical robot; make evidence easy for software to retrieve and people to trust.

## Expert Editorial Review

**Why this deserves publication**

- It challenges a common but oversimplified claim with current product evidence.
- It fits both Soup.io's Technology and Business categories.
- It gives readers a practical framework rather than generic “ATS-friendly CV” tips.
- It uses an original product-development lesson without becoming a product advert.
- Every material number is traceable to a primary or first-party source.

**Claims deliberately removed**

- “75% of CVs are rejected by ATS.”
- “Most employers use ATS.”
- “An ATS rejects a CV in six seconds.”
- Any promised increase in interview probability.

These figures are widely repeated but rarely supported by a reliable, current primary source.

**Link discipline**

- One contextual WorkCV tool link in the article.
- One WorkCV homepage link in the author bio.
- No promotional call to action inside the article.

---

<!-- ARTICLE START -->

# The Myth of the Universal ATS Score: What Job Seekers Should Optimise Instead

Type “ATS score” into a search engine and you will find tools offering a precise verdict on your CV: 62%, 81%, perhaps 94% after a few keyword changes. The number feels scientific. It also encourages a misleading idea - that every CV carries one fixed score which travels with it from employer to employer.

It does not.

Applicant tracking system, or ATS, is a broad label for recruitment software with very different features, configurations and decision rules. Some products primarily parse a CV into fields. Some let recruiters run exact or Boolean searches. Others use machine learning to compare candidate information with a vacancy. Even when two systems both display a score, they may be measuring different inputs on different scales.

For job seekers, this distinction matters. The sensible objective is not to chase a universal score. It is to make relevant, truthful evidence easy for software to retrieve and easy for a person to verify.

## An ATS is a category, not a single judge

Current product documentation shows how varied the machinery is.

[Lever explains](https://help.lever.co/hc/en-us/articles/20087345054749-Understanding-resume-parsing) that its parser extracts information such as a candidate's name, contact details and work history into profile fields. It also warns that image files such as JPG and PNG cannot be parsed. Its simple test is useful: if the text cannot be highlighted with a cursor, it is probably not machine-readable.

[Greenhouse Recruiting](https://support.greenhouse.io/hc/en-us/articles/202360199-Search-candidates-using-Boolean-queries), by contrast, documents full-text candidate searches using Boolean operators. Its June 2026 Talent Rediscovery guidance says a required keyword must exactly match the application to appear in those results.

Other platforms add matching models. [Oracle Recruiting](https://docs.oracle.com/en/cloud/saas/talent-management/farqa/evaluate-candidate-applications-using-ai-matching-ratings.html) can generate separate ratings from 0 to 5 for education, experience, skills and profile. [Workable's Screening Assistant](https://help.workable.com/hc/en-us/articles/23685011706775-Using-the-Screening-Assistant-AI-powered) represents the percentage of defined criteria met, and authorised recruiters can override the AI's assessment.

These are not four versions of one universal exam. They are different workflows: extraction, retrieval, comparison and human review. A public checker cannot know the employer's chosen product, enabled features, search terms, weighting or recruiter behaviour. A score can still be useful as a diagnostic, but it is not a transferable fact about the CV.

## What we learned by building a CV-fit assessment

We confronted this problem while developing the [WorkCV UK CV fit checker](https://workcv.co.uk/tools/ats-score-checker). Allowing a language model to read a CV and simply announce “78%” would have been easy. It would also have hidden too much judgement behind a confident number.

We therefore separated what software can measure consistently from what requires interpretation.

Deterministic checks cover items such as vacancy-keyword overlap, standard section headings, contact details and quantified outcomes. A structured AI review identifies the role and seniority communicated by the CV, maps vacancy requirements to evidence, and proposes three improvements. The application - not the model - calculates the final score from fixed dimensions.

The more important safeguard is evidence validation. If the assessment says a requirement is supported, it must point to words actually found in the CV. If it cannot, the result becomes “not evidenced.” That wording is intentional. A CV may fail to demonstrate a skill the candidate genuinely possesses; it does not prove that the skill is absent.

This design lesson applies beyond one tool: AI feedback becomes more useful when it shows its evidence, states its limits and avoids pretending to predict an interview.

## Five improvements that survive different systems

### 1. Make the document extractable

Use selectable text, conventional headings and a straightforward reading order. The UK's [National Careers Service](https://nationalcareers.service.gov.uk/careers-advice/cv-sections) recommends a clear font of at least 11 points, consistent styling, headings and bullet points. A visually elaborate CV that turns important content into images creates an avoidable parsing risk.

### 2. Use the vacancy's language - when it is true

If an advert asks for “complaint resolution” and your CV only says “dealt with difficult situations,” the precise, truthful phrase is easier to retrieve. The same applies to named software, licences, qualifications and recognised job terminology.

This is not permission to paste a hidden keyword block or claim skills you do not have. Relevance without evidence is fragile and dishonest.

### 3. Replace adjectives with verifiable evidence

“Excellent communicator” gives a recruiter little to test. “Handled 35-45 customer enquiries per day by phone and email, resolving billing and delivery complaints” communicates channel, scale and responsibility.

A useful evidence pattern is:

**action + context or scale + outcome**

Not every bullet needs a percentage. Team size, caseload, turnaround time, budget, frequency, territory or service level can all make work more concrete.

### 4. Map essential requirements before polishing

Create a small table with each essential criterion in the left column and the CV evidence in the right. If the evidence exists, make it visible in the relevant role, qualification or project. If it does not exist, do not manufacture it.

This exercise is more valuable than repeatedly rewriting a personal statement while a mandatory qualification remains unclear.

### 5. Optimise for verification, not just discovery

Keywords may help retrieve a CV, but context helps a person trust it. Keep dates, employers, job titles and qualifications internally consistent. Place strong evidence near the claim it supports. Remove generic phrases that consume space without adding proof.

The goal is a document that works at two speeds: structured enough for software to process and specific enough for a recruiter to assess quickly.

## Employers also carry responsibility

Candidates should not bear the entire burden of opaque recruitment technology.

In November 2024, the UK Information Commissioner's Office said its audits of AI recruitment providers produced [almost 300 recommendations](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/11/ico-intervention-into-ai-recruitment-tools-leads-to-better-data-protection-for-job-seekers/). It found examples of tools enabling filters involving protected characteristics, inferring gender and ethnicity from names, and retaining excessive personal data without candidates' knowledge.

The UK government's [Responsible AI in Recruitment guide](https://www.gov.uk/government/publications/responsible-ai-in-recruitment-guide/responsible-ai-in-recruitment) consequently emphasises impact assessments, performance testing, transparency, contestability and monitoring in the employer's real environment. Those are operational duties, not abstract principles.

## A better question than “What is my ATS score?”

No CV can be guaranteed to pass every recruitment system. Nor should candidates write for a mythical robot at the expense of the person making the hiring decision.

Ask instead: Can the document be parsed? Can the vacancy's essential requirements be found? Is each important claim supported by evidence? Can a recruiter understand the candidate's role, level and value without guessing?

That produces something more durable than a high score from an unknown formula: a CV whose relevant evidence is easy to retrieve, interpret and trust.

<!-- ARTICLE END -->

---

## Suggested Author Bio

The WorkCV team builds practical, transparent tools for UK job seekers, including a no-subscription CV builder and evidence-led vacancy matching. Learn more at [WorkCV](https://workcv.co.uk/).

## Suggested Pitch Email

**Subject:** Guest post submission: The Myth of the Universal ATS Score

Hello Soup.io editorial team,

I would like to submit the attached original article, “The Myth of the Universal ATS Score: What Job Seekers Should Optimise Instead,” for your Technology or Business section.

The article is approximately 1,150 words and uses current documentation from Greenhouse, Lever, Oracle and Workable, together with UK government and ICO guidance, to explain why a CV does not have one portable ATS score. It gives job seekers a practical five-part method for making evidence easier for recruitment software to retrieve and for recruiters to verify.

The piece has not been published elsewhere. We can provide a suitable original image and make reasonable editorial revisions if required.

Kind regards,

[Name]
WorkCV

## Source Verification Notes

- Soup.io requires 800-1,200 words and accepts Technology and Business submissions.
- Greenhouse Boolean search documentation updated 2 March 2026.
- Greenhouse Talent Rediscovery documentation updated 2 June 2026.
- Lever parsing documentation updated 25 November 2025.
- Oracle documents four AI rating categories on a 0-5 scale.
- Workable documents criteria percentages and recruiter overrides.
- ICO announced almost 300 recommendations on 6 November 2024.
- UK Responsible AI in Recruitment guidance was published 29 January 2025.
- National Careers Service guidance supports clear fonts, headings, bullet points and vacancy tailoring.
