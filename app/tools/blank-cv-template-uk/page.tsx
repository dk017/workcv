import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download, FileText, ShieldCheck } from "lucide-react";

import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/blank-cv-template-uk";

export const metadata: Metadata = {
  title: "Free Blank CV Template UK - Word Download",
  description:
    "Download a free blank UK CV template in editable Microsoft Word format. Simple single-column layout, no signup and no subscription.",
  alternates: { canonical: path },
  openGraph: { title: "Free Blank UK CV Template for Word", description: "Download a clean, editable single-column UK CV template with no signup.", url: path },
};

const faqs = [
  { question: "Is the blank CV template really free?", answer: "Yes. The editable Word document downloads directly with no signup, email gate, payment or subscription." },
  { question: "What format is the CV template?", answer: "It is a real .docx document for Microsoft Word. It can also be opened by many compatible document editors." },
  { question: "Is the template ATS-friendly?", answer: "The template uses a simple single-column structure, standard headings and ordinary text rather than tables, text boxes, icons or graphics. No template can guarantee how every applicant tracking system will parse a file, so check the employer's required format." },
  { question: "What should I remove before sending it?", answer: "Replace every grey instruction, remove unused sections, check contact details and tailor the profile, skills and evidence to the vacancy." },
];

const schemas = [
  { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "WorkCV Blank UK CV Template", applicationCategory: "BusinessApplication", operatingSystem: "Microsoft Word compatible", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

export default function BlankCvTemplatePage() {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-center"><div><p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free Word download</p><h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Blank UK CV template for Microsoft Word.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Start with a clean single-column document containing the standard UK CV sections, practical placeholders and no decorative elements to remove.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="/api/tools/blank-cv-template" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"><Download className="h-4 w-4" />Download Word template</a><Link href="/editor?new=1" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 text-sm font-bold text-navy hover:bg-surface">Build online <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy"><span className="flex items-center gap-2"><FileText className="h-5 w-5 text-gold" />Editable .docx</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" />No signup</span></div></div><div className="border border-line-strong bg-white p-7 shadow-soft"><p className="text-center font-display text-2xl font-semibold text-navy">YOUR NAME</p><p className="mt-2 text-center text-xs text-muted">Town · Phone · Email · LinkedIn</p>{["PERSONAL PROFILE", "KEY SKILLS", "WORK EXPERIENCE", "EDUCATION AND QUALIFICATIONS"].map((heading) => <div key={heading} className="mt-6"><p className="border-b border-navy pb-1 text-xs font-bold text-navy">{heading}</p><div className="mt-3 grid gap-2"><span className="h-2 w-full bg-line" /><span className="h-2 w-5/6 bg-line" /><span className="h-2 w-3/4 bg-line" /></div></div>)}</div></div></section>
    <section className="bg-surface py-20"><div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><SectionLabel>Inside the document</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Useful structure, deliberately plain.</h2><p className="mt-6 text-base leading-8 text-muted">The template keeps content in the document body, uses recognisable section names and avoids layout tables, sidebars, photos and skill charts. That makes it straightforward to edit and reduces avoidable parsing risk.</p></div><ul className="grid gap-4 sm:grid-cols-2">{["Contact details", "Personal profile", "Key skills", "Work experience", "Education and qualifications", "Additional information", "References line", "Evidence-led bullet prompts"].map((item) => <li key={item} className="flex gap-3 border-t border-line pt-4 text-sm font-bold text-navy"><Check className="h-5 w-5 shrink-0 text-success" />{item}</li>)}</ul></div></section>
    <section className="border-y border-line bg-paper py-20"><div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]"><div><SectionLabel>Before you apply</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">The template is a starting point.</h2><p className="mt-6 text-base leading-8 text-muted">Replace every placeholder, tailor the evidence to the job advert and keep only relevant sections. The National Careers Service recommends clear formatting, consistent style, headings, bullets and concise wording.</p><p className="mt-4 text-sm font-bold text-navy">Template reviewed 10 July 2026.</p></div><a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="h-fit rounded-md border border-line bg-white p-4 text-sm font-bold text-navy hover:border-navy">National Careers Service: how to write a CV</a></div></section>
    <RelatedLinksSection title="Choose how to continue." links={[["Word editing and export guide", "/tools/cv-template-word-uk"], ["Compare WorkCV templates", "/templates"], ["Read the UK CV guide", "/how-to-write-a-cv-uk"]]} />
    <FaqSection faqs={faqs} title="Blank UK CV template questions." />
  </>;
}
