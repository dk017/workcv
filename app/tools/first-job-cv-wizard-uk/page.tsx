import type { Metadata } from "next";
import Link from "next/link";

import { CareerToolPage } from "@/components/career-tool-page";
import { customerQuestionHref } from "@/lib/customer-questions";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";

const path = "/tools/first-job-cv-wizard-uk";
export const metadata: Metadata = {
  title: "First Job CV Wizard UK - Free CV with No Experience",
  description: "Build an editable first-job UK CV draft from education, projects, volunteering and strengths. Free wizard with no signup required.",
  alternates: { canonical: path },
  openGraph: { title: "Free First-Job CV Wizard UK", description: "Turn education, projects and responsibilities into a truthful first CV draft.", url: path },
};

export default function FirstJobCvWizardPage() {
  return <CareerToolPage path={path} tool="first-job" eyebrow="First-job CV wizard UK" title="Build a first CV from what you have already done." intro="Add your education, projects, volunteering, responsibilities and strengths. The wizard turns those facts into a focused starting draft for an entry-level application." description="A first CV does not need invented employment. It needs a clear target role, specific evidence and a readable structure that makes school, community and project experience useful to an employer." howItHelps="Give early experience a proper place on the page." links={[["CV with no experience guide", "/cv-no-experience-uk"], ["Student CV template", "/student-cv-template"], ["Build the finished CV", "/editor?template=compact&new=1"]]} faqs={[{ question: "Can I use this if I have never had a job?", answer: "Yes. Add education, projects, volunteering, caring responsibilities, clubs, coursework or other evidence of reliability and skills. Keep the wording truthful." }, { question: "Will the wizard invent achievements?", answer: "No. It uses only the information you provide and gives editable wording for you to check." }, { question: "How do I finish the first-job CV?", answer: "Review the draft, add dates and details, tailor it to the vacancy and open it in the WorkCV editor to preview the final PDF." }]} afterToolContent={<section className="border-b border-line bg-paper py-14"><div className="container-page max-w-5xl space-y-4 text-base leading-8 text-ink"><h2 className="font-display text-3xl font-semibold text-navy">Use real first-job evidence</h2><p>Enter a target role, education and at least one actual project, volunteer activity or responsibility. The wizard builds its first draft locally from your entries; it cannot know details you did not provide. Check dates, grades, names and every suggested skill before copying the result.</p><p>See the <Link href={customerQuestionHref("Q18")} className="font-semibold underline">complete fictional first CV</Link> to understand how a school event, group project and volunteer task can support a retail application. The wizard’s Try example uses a different fictional person; do not combine their histories.</p><p className="text-sm text-muted">Reviewed <time dateTime={customerContentReview[path]}>{displayReviewDate(customerContentReview[path])}</time>.</p></div></section>} />;
}
