import type { Metadata } from "next";
import Link from "next/link";
import { Hash, ShieldCheck, Tags } from "lucide-react";
import { CvKeywordDensityChecker } from "@/components/cv-keyword-density-checker";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cv-keyword-density-checker";
export const metadata: Metadata = {
  title: "Free CV Keyword Density Checker UK",
  description: "Find repeated words, phrases and vague wording in your CV. Free browser-based keyword density analysis with no signup or upload.",
  alternates: { canonical: path },
  openGraph: { title: "Free CV Keyword Density Checker", description: "See the most repeated words and phrases in your CV without uploading it.", url: path },
};
const faqs = [
  { question: "What is CV keyword density?", answer: "Keyword density is the percentage of analysed words represented by a term. This tool also counts repeated two- and three-word phrases after excluding common words." },
  { question: "What keyword density should a CV have?", answer: "There is no universal target percentage. Relevant job titles, tools and qualifications may repeat naturally. Use the result to spot monotonous or vague wording, not to chase a score." },
  { question: "Does repeating keywords help with ATS software?", answer: "Relevant terminology can help describe fit, but unsupported repetition and keyword stuffing weaken the CV. Match the vacancy only where your experience provides evidence." },
  { question: "Does this compare my CV with a job description?", answer: "No. This page analyses repetition inside the CV. Use WorkCV's ATS checker when you need to compare supported CV evidence with a specific vacancy." },
  { question: "Is the keyword checker private?", answer: "Yes. The analysis runs in your browser. The pasted CV text is not uploaded or saved by WorkCV." },
];
const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "WorkCV CV Keyword Density Checker", applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

export default function Page() {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page"><div className="max-w-4xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Private browser-based CV check</p><h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Free CV keyword density checker.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">See which meaningful words and phrases dominate your CV. Find repetitive bullets, vague wording and opportunities to use more specific evidence.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy"><span className="flex items-center gap-2"><Hash className="h-5 w-5 text-gold" />Word frequency</span><span className="flex items-center gap-2"><Tags className="h-5 w-5 text-success" />Repeated phrases</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />Nothing uploaded</span></div></div><div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><CvKeywordDensityChecker /></div></div></section>
    <section className="bg-surface py-20"><div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><SectionLabel>Use frequency with context</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Repetition is a clue, not a verdict.</h2><p className="mt-6 text-base leading-8 text-muted">A repeated technical skill may be central to the role. A repeated vague phrase may be wasting space. Review the surrounding bullets and replace repetition only when a more specific action or result improves the evidence.</p></div><div className="divide-y divide-line border-y border-line">{[["Keep accurate terms","Do not replace an official qualification, system or job title merely to reduce repetition."],["Rewrite repeated duties","Vary the evidence and outcome, not just the opening verb."],["Avoid stuffing","Never add an advertised term unless your experience supports the claim."]].map(([title, body]) => <article key={title} className="py-6"><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></article>)}</div></div></section>
    <section className="border-y border-line bg-paper py-20"><div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]"><div><SectionLabel>Different from vacancy matching</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">This tool measures your CV, not an ATS.</h2><p className="mt-6 text-base leading-8 text-muted">National Careers Service guidance recommends tailoring a CV to the advert and highlighting supported skills. Density alone cannot decide relevance, importance or where a keyword belongs.</p><p className="mt-4 text-sm font-bold text-navy">Research reviewed 10 July 2026.</p></div><div className="grid content-start gap-3 text-sm font-bold text-navy"><a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: tailoring a CV</a><Link href="/tools/ats-score-checker" className="rounded-md border border-line bg-white p-4 hover:border-navy">Compare your CV with a vacancy</Link><Link href="/tools/cv-readability-checker" className="rounded-md border border-line bg-white p-4 hover:border-navy">Check CV readability</Link></div></div></section>
    <FaqSection faqs={faqs} title="CV keyword density questions." />
  </>;
}
