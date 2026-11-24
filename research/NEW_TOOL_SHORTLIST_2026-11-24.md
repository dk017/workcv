# New free tool: shortlist (24 November 2026)

## What WorkCV's own data says first

WorkCV already has 26 free tools. In the 30 days to 24 November, only six got more than a handful of search or AI visitors:

| Tool | Search | AI | Why it works |
|---|---|---|---|
| ATS CV checker | 18 | 30 | Matches a well-known query ("ats cv checker", 2,400/month, KD 11) and ChatGPT recommends it |
| Job application tracker | 31 | 1 | Matches "job application tracker" (590/month) |
| Living wage checker | 16 | 0 | Matches a dated, factual query |
| Salary by job title | 11 | 0 | Same |
| Blank CV template | 9 | 0 | Matches the template cluster |
| Cover letter generator | 1 | 4 | ChatGPT only |

The other 20 tools got 0–4 search visitors each. The redundancy pay calculator gets none, although "redundancy calculator" is the largest pool in the September research (49,500/month, KD 17).

**Lesson:** a tool brings traffic when it matches one plain, high-volume query people already type, and the top results are beatable. Building a tool around a phrase nobody searches (several of the 26) brings nothing. A 27th tool is only worth it if it passes that test.

## Candidates

Volumes below are not measured: DataForSEO was not available in this session, and the September research did not cover these phrases. SERP notes come from web searches on 24 November (US-based search, so UK results may differ).

| Candidate | Demand | Top results | CV fit | Build | Verdict |
|---|---|---|---|---|---|
| **Resignation letter generator UK** (letter plus correct last working day) | Head term widely searched; unmeasured | Acas template, Hays, Robert Half, LiveCareer, Zety, generic AI generators. None we saw works out the last day from the contract or statutory notice | Medium: people resigning are changing jobs | Small. Reuses `lib/notice-period-calculator.ts`; template-based, no AI cost | **Best new candidate** |
| Job description keyword finder | Unmeasured | Crowded: Teal, Resume Worded, Huntr, AIApply, Careerist, Himalayas | Very high | Small (reuses ATS keyword logic) | Overlaps the ATS checker; crowded. Add as an ATS checker mode instead |
| STAR interview answer builder (with Civil Service 250-word behaviours) | STAR method is popular; unmeasured | Crowded with AI tools (AIApply, LoopCV, Resume Worded, MiniWebtool). Civil Service angle served by GOV.UK, LiveCareer, MyPerfectCV guides | Medium | Medium (AI) | WorkCV's Civil Service supporting statement planner already gets 0 search visitors, so the UK angle alone has not pulled traffic |
| Skills for a CV by job title | High ("skills for cv"); unmeasured | MyPerfectCV, LiveCareer, Enhancv, Resume Worded own it with content and generators | High | Medium | Strong incumbents; better as content on existing role pages |

## Recommendation

1. **Build the resignation letter generator UK**, with the last working day worked out from contractual or statutory notice (the existing notice-period logic), a letter and an email version, and Acas-consistent wording. It is UK-specific where the rival generators are generic, cheap to run, and links naturally to the notice-period calculator and the CV editor ("Updating your CV for the next role?").
2. **Before building, check volume** for "resignation letter", "resignation letter template uk" and "resignation letter generator" in DataForSEO, Google Keyword Planner or Search Console. Build only if the UK head term is in the thousands per month.
3. **Consider the redundancy calculator first.** It targets the largest measured pool and gets no traffic. Improving and promoting an existing tool there may beat any new tool.

## Sources

- [Acas resignation letter template](https://www.acas.org.uk/resignation-letter-template)
- [Acas: how to resign](https://www.acas.org.uk/how-to-resign)
- [Hays resignation letter template](https://www.hays.co.uk/career-advice/article/resignation-letter-template)
- [Robert Half: how to write a resignation letter](https://www.roberthalf.com/gb/en/insights/career-development/how-write-resignation-letter)
- [LiveCareer UK resignation letter](https://www.livecareer.co.uk/career-advice/resignation-letter)
- [Grammarly resignation letter generator](https://www.grammarly.com/ai/ai-writing-tools/resignation-letter-generator)
- [Teal job description keyword finder](https://tealhq.com/tool/job-description-keyword-finder)
- [Resume Worded job description keyword finder](https://resumeworded.com/job-description-keyword-finder)
- [AIApply STAR method generator](https://aiapply.co/tools/star-method-generator)
- [GOV.UK Success Profiles: Civil Service behaviours](https://www.gov.uk/government/publications/success-profiles/success-profiles-civil-service-behaviours)
- [MyPerfectCV skills](https://www.myperfectcv.co.uk/cv/skills)
- [LiveCareer UK top skills per job title](https://www.livecareer.co.uk/cv/top-skills-per-job-title)
- WorkCV production growth report, 24 November 2026 (private)
- research/keyword-research-dataforseo-2026-09-26.md
