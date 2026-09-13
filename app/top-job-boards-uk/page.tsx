import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/top-job-boards-uk";

export const metadata: Metadata = {
  title: "Top Job Boards UK: How to Choose One",
  description:
    "How to choose job boards in the UK by sector, location, seniority and working pattern, then turn a useful vacancy into a tailored application.",
  alternates: { canonical: path },
  openGraph: {
    title: "Top Job Boards in the UK: A Practical Guide",
    description:
      "Choose a useful job board for your sector and working pattern, then prepare the application properly.",
    url: path,
  },
};

const faqs = [
  { question: "What are the best job boards in the UK?", answer: "The best board depends on the sector, location, seniority and working pattern you need. Check broad boards, specialist boards, employer career pages and public-sector sources rather than treating one list as universal." },
  { question: "Should I apply through a job board or the employer website?", answer: "Follow the vacancy's stated process. If the employer asks you to apply on its own site, use that route; if a board is the official application channel, complete the required steps there." },
  { question: "Does WorkCV show live job vacancies?", answer: "No. WorkCV is not a live jobs database. This guide helps you choose where to search and what to check after you find a relevant vacancy." },
  { question: "How do I improve my chances after finding a vacancy?", answer: "Read the full advert, tailor the CV to truthful evidence, follow the application instructions and prepare for the likely conversation. A job board cannot replace a relevant, accurate application." },
];

export default function JobBoardsPage() {
  return <CareerGuidePage path={path} eyebrow="Job search UK" title="Top job boards in the UK: choose by fit, not by a generic list." intro="The useful job board is the one that reaches your sector, location, seniority and working pattern. Once you find a vacancy, the application work starts." answer="There is no single best job board for every UK job seeker. Choose the source that matches the role, verify the vacancy on the employer's instructions and then tailor your application to the evidence it asks for." actionHref="/cv-template-driver-uk" actionLabel="See a role CV example" actionPlacement="job_boards_role_template" reviewDate="2026-09-13" sections={[
    { title: "Choose by sector", body: "Start with where your target roles are normally posted. Broad boards can help with discovery; specialist boards, professional networks and employer sites may be more relevant for particular fields.", points: ["Search the exact role title and close variants", "Look for sector-specific sources where the vacancy naturally belongs", "Check the employer's own careers page when named"] },
    { title: "Filter by location and working pattern", body: "A high number of results is not useful if the commute, remote arrangement, shift pattern or right-to-work requirements do not fit your situation.", points: ["Set a realistic location radius", "Check on-site, hybrid, remote and shift wording", "Read the full advert before spending time tailoring"] },
    { title: "Check seniority and employer details", body: "Titles vary between organisations. Use responsibilities, reporting lines, required experience and pay information to decide whether the role is genuinely at your level.", points: ["Compare the duties with your actual experience", "Check the closing date and application route", "Look for clear employer and contact details"] },
    { title: "Treat the advert as the application brief", body: "Save the advert or note its key requirements before applying. Identify the three or four points your CV and cover letter must answer truthfully.", points: ["Mirror accurate role language", "Put the strongest relevant evidence where it can be found", "Follow requested file type, page limit and questions"] },
    { title: "Use a repeatable application checklist", body: "A simple checklist stops the search from becoming a stream of rushed applications. Quality and fit matter more than sending the same document everywhere.", points: ["Vacancy saved and employer verified", "CV tailored and final file checked", "Cover letter or questions completed", "Interview preparation started"] },
  ]} relatedLinks={[["Driver CV template", "/cv-template-driver-uk"], ["Warehouse CV template", "/cv-template-warehouse-uk"], ["Customer service CV template", "/cv-template-customer-service-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
