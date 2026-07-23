import type { Metadata } from "next";
import { FileSearch, ListChecks, ShieldCheck } from "lucide-react";

import { CvGapDetector } from "@/components/cv-gap-detector";
import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cv-gap-detector-uk";

export const metadata: Metadata = {
  title: "Free CV Gap Detector UK - Find Missing Sections",
  description:
    "Paste your CV and find missing sections, contact details, dates, skills and evidence. Free UK CV content check with no signup.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK CV Gap Detector", description: "Find missing CV sections and weak content signals without uploading a file.", url: path },
};

const faqs = [
  { question: "What does the CV gap detector check?", answer: "It checks pasted text for contact details, an introduction, experience or projects, education, skills, dates, bullets, evidence of outcomes and personal details UK guidance says to omit." },
  { question: "Does it detect gaps between jobs?", answer: "No. This tool finds content gaps and missing sections. Employment date gaps need careful timeline review and should not be guessed from pasted text." },
  { question: "Is my CV uploaded or stored?", answer: "No. The detector runs in your browser. The pasted text is not sent to WorkCV or an AI service." },
  { question: "Can this guarantee my CV will pass an ATS?", answer: "No. Applicant tracking systems differ, and pasted text does not preserve layout. Use the result as a practical checklist, then test the actual file and tailor it to the vacancy." },
];

const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "WorkCV UK CV Gap Detector", applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

export default function CvGapDetectorPage() {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page"><div className="max-w-4xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free private CV check</p><h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Find the content gaps in your UK CV.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Paste your CV text to check for missing sections, dates, contact details, scannable evidence and personal information that does not belong on a UK CV.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy"><span className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-success" />10 practical checks</span><span className="flex items-center gap-2"><FileSearch className="h-5 w-5 text-gold" />Instant result</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />Runs in your browser</span></div></div><div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><CvGapDetector /></div></div></section>
    <section className="bg-surface py-20"><div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div><SectionLabel>What it can see</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">A checklist grounded in UK CV structure.</h2><p className="mt-6 text-base leading-8 text-muted">The National Careers Service identifies contact details, an introduction, education, work history and references as standard CV content, while recognising projects and volunteering for candidates with limited paid experience. The detector uses flexible headings for those patterns.</p></div><div className="border-y border-line py-6 text-sm leading-7 text-muted"><p>It also checks for clear dates, bullets, a skills section and outcome evidence. These are recommendations, not a claim that every employer or tracking system uses one fixed score.</p><p className="mt-4">Because pasted text loses columns, tables, headers and fonts, this is a content-gap detector rather than a file-format test.</p></div></div></section>
    <section className="border-y border-line bg-paper py-20"><div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]"><div><SectionLabel>Source reviewed</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Clear limits, current guidance.</h2><p className="mt-6 text-base leading-8 text-muted">The section and personal-detail checks follow current National Careers Service guidance. Employment gaps are deliberately outside this tool because dates and life circumstances need human interpretation.</p><p className="mt-4 text-sm font-bold text-navy">Research reviewed 10 July 2026.</p></div><div className="grid content-start gap-3 text-sm font-bold text-navy"><a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: how to write a CV</a><a href="https://nationalcareers.service.gov.uk/careers-advice/explain-gaps-in-work-history/" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: explain employment gaps</a></div></div></section>
    <RelatedLinksSection title="Run the next CV check." links={[["Check vacancy fit", "/tools/ats-score-checker"], ["Check CV word count", "/tools/cv-word-count-checker"]]} />
    <FaqSection faqs={faqs} title="CV gap detector questions." />
  </>;
}
