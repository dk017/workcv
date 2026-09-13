import type { Metadata } from "next";

import { AdviceCard, BulletList, EditorialGuideShell, GuideSection } from "@/components/editorial-guide-shell";

const path = "/top-job-boards-uk";

export const metadata: Metadata = {
  title: "Best UK Job Sites and Job Boards: 2026 Guide",
  description: "Compare leading UK job sites by purpose, including Indeed, LinkedIn, Reed, GOV.UK, NHS Jobs and specialist boards, then use a safer search workflow.",
  alternates: { canonical: path },
  openGraph: { title: "Best UK Job Sites and Job Boards: 2026 Guide", description: "A practical comparison of general, official and specialist UK job sites.", url: path },
};

const generalBoards = [
  { name: "Indeed UK", href: "https://uk.indeed.com/", best: "Broad discovery", useful: "A wide mix of direct-employer and aggregated listings, useful filters, company information and alerts.", watch: "The same role can appear more than once. Check who posted it and follow the stated application route." },
  { name: "LinkedIn Jobs", href: "https://www.linkedin.com/jobs/", best: "Professional roles and networking", useful: "Useful when the recruiter, hiring team or employer activity adds context to a vacancy.", watch: "Do not rely on Easy Apply alone. A complete, role-relevant profile and tailored application still matter." },
  { name: "Reed", href: "https://www.reed.co.uk/jobs", best: "UK office, care, education and varied roles", useful: "Strong UK focus with salary, location, remote and sector filters, plus recruiter-posted roles.", watch: "Check whether a recruitment agency or the employer owns the listing so you know who will contact you." },
  { name: "Totaljobs", href: "https://www.totaljobs.com/", best: "Broad UK search and alerts", useful: "Helpful for searching nearby roles, comparing titles and setting alerts across multiple sectors.", watch: "Broad searches become noisy. Use title variants, a realistic radius and a minimum salary where appropriate." },
  { name: "CV-Library", href: "https://www.cv-library.co.uk/", best: "Recruiter visibility and UK vacancies", useful: "Lets job seekers search vacancies and make a CV discoverable to recruiters when they choose to.", watch: "Review profile visibility and contact settings before uploading personal information." },
  { name: "Adzuna", href: "https://www.adzuna.co.uk/", best: "Aggregated market scan", useful: "Good for discovering vacancies gathered from different sources and comparing title or salary wording.", watch: "Confirm the live advert, closing date and final application destination on the original source." },
  { name: "Glassdoor Jobs", href: "https://www.glassdoor.co.uk/Job/index.htm", best: "Employer research alongside vacancies", useful: "Combines job search with employee reviews and salary information that can inform your questions.", watch: "Treat reviews as individual experiences, not proof of how every team or manager operates." },
];

const specialistBoards = [
  ["GOV.UK Find a job", "https://www.gov.uk/find-a-job", "Full- and part-time roles in England, Scotland and Wales; GOV.UK points Northern Ireland users to a separate service."],
  ["Civil Service Jobs", "https://www.civilservicejobs.service.gov.uk/csr/index.cgi", "UK Civil Service vacancies, with grade, department and location information."],
  ["NHS Jobs", "https://www.jobs.nhs.uk/candidate/search", "NHS roles with filters for staff group, pay band, contract and working pattern."],
  ["Teaching Vacancies", "https://teaching-vacancies.service.gov.uk/", "The Department for Education service for teaching, leadership and school-support jobs in England."],
  ["Find an apprenticeship", "https://www.gov.uk/apply-apprenticeship", "The official starting point for paid apprenticeships in England, with separate routes for the other UK nations."],
  ["CharityJob", "https://www.charityjob.co.uk/search-jobs", "Charity and not-for-profit roles, including cause, contract, remote and salary filters."],
  ["jobs.ac.uk", "https://www.jobs.ac.uk/", "Academic, research, professional and support roles in universities and related organisations."],
  ["CWJobs", "https://www.cwjobs.co.uk/", "Technology and IT vacancies, useful for role-specific title and skills searches."],
  ["Caterer.com", "https://www.caterer.com/", "Hospitality roles across hotels, restaurants, catering and related services."],
] as const;

const faqs = [
  { question: "What is the best job site in the UK?", answer: "There is no universal winner. Use one broad board for coverage, one specialist or official board for relevance, and target-employer career pages for direct applications. The right mix depends on your sector, level and location." },
  { question: "Are all jobs on job boards genuine?", answer: "No platform can remove every risk. Check the employer, email domain, application destination and role details. Never pay a fee to apply, buy equipment through an unknown contact or send bank details before a legitimate hiring process requires them." },
  { question: "Should I apply on the job board or the company website?", answer: "Use the route stated in the advert. If the same vacancy is live on the employer website, the direct listing can help you verify details and may contain the complete person specification." },
  { question: "How many job boards should I use?", answer: "Start with two or three: one broad site, one sector-specific source and selected employer career pages. Good alerts and a simple tracker are usually more useful than repeating the same search across ten boards." },
];

export default function JobBoardsPage() {
  return <EditorialGuideShell path={path} eyebrow="UK job-search guide" title="The best UK job sites—compared by what they are actually useful for." intro="You came for places to find jobs, so this page starts with real job sites. Use the comparison to choose a small search stack, then follow the workflow to avoid duplicate listings, stale adverts and rushed applications." answer="For most people, start with Indeed or another broad board, add LinkedIn for professional visibility, and use the official or specialist site for your sector. Save target employers separately. One relevant alert is worth more than hundreds of unfiltered results." reviewed="13 September 2026" faqs={faqs} ctaHeading="Found a suitable vacancy? Build the CV for that vacancy." ctaBody="Use the advert as your brief, tailor your evidence and preview the finished UK CV. WorkCV charges once only if you choose to download the PDF—no monthly subscription." trackingContext="job_boards_editorial" relatedLinks={[["Job Application Pack", "/tools/job-application-pack-uk"], ["How to prepare for an interview", "/how-to-prepare-for-a-job-interview-uk"], ["Customer service CV example", "/cv-template-customer-service-uk"], ["Driver CV example", "/cv-template-driver-uk"], ["No-subscription CV builder", "/cv-builder-no-subscription-uk"]]}>
    <GuideSection label="Quick comparison" title="Seven broad UK job sites and when to use each." intro="These are not presented as a made-up league table. Each has a different role in a search; open the sites that match your situation and judge the live results for yourself.">
      <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-sm"><table className="w-full min-w-[820px] border-collapse text-left text-sm"><thead className="bg-navy text-white"><tr><th className="p-4">Job site</th><th className="p-4">Best for</th><th className="p-4">Why it can help</th><th className="p-4">Watch for</th></tr></thead><tbody>{generalBoards.map((board) => <tr key={board.name} className="border-t border-line align-top"><th className="p-4"><a className="font-bold text-navy underline" href={board.href} target="_blank" rel="noreferrer">{board.name}<span className="sr-only"> (opens in a new tab)</span></a></th><td className="p-4 font-semibold text-navy">{board.best}</td><td className="p-4 leading-6 text-muted">{board.useful}</td><td className="p-4 leading-6 text-muted">{board.watch}</td></tr>)}</tbody></table></div>
    </GuideSection>
    <GuideSection label="Specialist and official sources" title="Go where your type of role is naturally advertised." intro="A specialist board usually has fewer results than a general board, but the filters and employers can be much closer to your target.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{specialistBoards.map(([name, href, description]) => <AdviceCard key={name} title={name}><p>{description}</p><p><a href={href} target="_blank" rel="noreferrer" className="font-bold text-navy underline">Search {name}<span className="sr-only"> (opens in a new tab)</span></a></p></AdviceCard>)}</div>
    </GuideSection>
    <GuideSection label="Choose your search stack" title="Use three channels, not ten nearly identical searches." tone="paper"><div className="grid gap-5 md:grid-cols-3">
      <AdviceCard title="1. One broad board"><p>Use it to learn which employers, role titles and salary ranges are active in your area. Create a narrow alert rather than searching from scratch every day.</p></AdviceCard>
      <AdviceCard title="2. One specialist source"><p>Choose the official or sector board closest to your target. Search both the common title and nearby alternatives: “support worker”, “care assistant” and “healthcare assistant” may reveal different results.</p></AdviceCard>
      <AdviceCard title="3. Employer career pages"><p>Keep a shortlist of 10–20 organisations. Their own pages can contain the full person specification, closing date and application process before aggregators update.</p></AdviceCard>
    </div></GuideSection>
    <GuideSection label="A 30-minute setup" title="Turn browsing into a repeatable job-search system."><div className="grid gap-8 lg:grid-cols-2">
      <AdviceCard title="Create searches that return usable vacancies"><BulletList items={["Write one target role, two close title variants and any must-have qualification.", "Set a realistic commute or location; treat ‘remote’ as a filter to verify, not a promise.", "Add salary only when it will not hide suitable entry-level or career-change roles.", "Create daily alerts for urgent searches and weekly alerts for exploratory searches.", "Save the exact advert or person specification before the closing date."]} /></AdviceCard>
      <AdviceCard title="Track decisions, not just applications"><BulletList items={["Employer, exact role title, source link and closing date.", "Why the role fits and the three requirements your CV must prove.", "Date applied, version of CV sent and any named contact.", "Expected response date, interview stage and one follow-up date.", "Outcome and what you will change in the next application."]} /></AdviceCard>
    </div></GuideSection>
    <GuideSection label="Before you apply" title="Check the vacancy is current, credible and worth your time." tone="paper"><div className="grid gap-5 md:grid-cols-2">
      <AdviceCard title="Five-minute vacancy check"><BulletList items={["Find the employer’s real website and confirm the organisation and location exist.", "Compare the board listing with the employer’s careers page where possible.", "Check the closing date, contract, hours, salary wording and right-to-work requirements.", "Look for a recognisable company email domain and a clear application process.", "Search a distinctive sentence from the advert if the listing looks copied or duplicated."]} /></AdviceCard>
      <AdviceCard title="Leave immediately if…"><BulletList items={["Someone asks you to pay to apply, interview, release wages or buy equipment from them.", "The recruiter moves immediately to an encrypted chat and will not verify the employer.", "The pay is implausible for vague duties, or the job title changes during contact.", "You are asked for bank, passport or National Insurance details before a legitimate need is explained.", "The vacancy cannot be confirmed and the sender pressures you to act now."]} /></AdviceCard>
    </div></GuideSection>
    <GuideSection label="From advert to application" title="The board finds the vacancy. Your evidence earns the interview."><div className="grid gap-5 md:grid-cols-3">
      <AdviceCard title="Extract the brief"><p>Copy the essential criteria and repeated duties into a short checklist. Separate required evidence from nice-to-have wording.</p></AdviceCard>
      <AdviceCard title="Tailor truthfully"><p>Move the most relevant achievements up, use accurate language from the advert and remove generic claims that do not help this role.</p></AdviceCard>
      <AdviceCard title="Submit and preserve"><p>Follow the requested format, preview the PDF, save the submitted CV and keep the advert for interview preparation.</p></AdviceCard>
    </div></GuideSection>
    <GuideSection label="How this guide was built" title="Transparent selection, not affiliate rankings." tone="paper" intro="We included broad sites that help UK users discover roles and official or specialist services that solve a distinct search need. We compared purpose, filters, application route and common limitations. WorkCV receives no commission for these outbound links. We have not ranked boards by unverified vacancy counts, and availability can change.">
      <p className="text-sm leading-7 text-muted">Primary references include <a className="font-bold text-navy underline" href="https://www.gov.uk/find-a-job">GOV.UK Find a job</a>, <a className="font-bold text-navy underline" href="https://www.jobs.nhs.uk/candidate/search">NHS Jobs</a>, <a className="font-bold text-navy underline" href="https://www.gov.uk/apply-apprenticeship">Find an apprenticeship</a>, <a className="font-bold text-navy underline" href="https://nationalcareers.service.gov.uk/careers-advice">National Careers Service</a> and the live destination pages linked above.</p>
    </GuideSection>
  </EditorialGuideShell>;
}
