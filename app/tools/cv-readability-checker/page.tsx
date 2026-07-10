import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Gauge, ShieldCheck } from "lucide-react";
import { CvReadabilityChecker } from "@/components/cv-readability-checker";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cv-readability-checker";
export const metadata: Metadata = {
  title: "Free CV Readability Checker UK - Flesch Score",
  description: "Check your CV's Flesch Reading Ease, sentence length and possible passive voice. Free, private and no signup required.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK CV Readability Checker", description: "Find dense sentences and readability issues in your CV without uploading it.", url: path },
};
const faqs = [
  { question: "What is a good readability score for a CV?", answer: "There is no official recruiter pass score. A higher Flesch Reading Ease score generally indicates shorter sentences and simpler words, but necessary job titles, qualifications and technical terms can lower a CV's result." },
  { question: "How is CV readability calculated?", answer: "This checker uses Flesch Reading Ease, which considers average sentence length and average syllables per word. It also separately flags sentences over 25 words and likely passive constructions." },
  { question: "Should I remove every difficult word from my CV?", answer: "No. Keep accurate technical terms, qualifications and role-specific language. Rewrite jargon, long clauses and vague wording only when a clearer alternative preserves the meaning." },
  { question: "Does a readability score predict interviews?", answer: "No. It measures aspects of language complexity, not candidate quality, evidence, relevance, formatting or employer decisions." },
  { question: "Is my CV text uploaded?", answer: "No. The readability calculation runs in your browser and WorkCV does not receive or save the pasted text." },
];
const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "WorkCV UK CV Readability Checker", applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

export default function Page() {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page"><div className="max-w-4xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Private browser-based CV check</p><h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Free CV readability checker.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Measure Flesch Reading Ease, average sentence length and possible passive voice. Review the exact sentences making your CV harder to scan.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy"><span className="flex items-center gap-2"><Gauge className="h-5 w-5 text-gold" />Explainable score</span><span className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-success" />Sentence-level flags</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />Nothing uploaded</span></div></div><div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><CvReadabilityChecker /></div></div></section>
    <section className="bg-surface py-20"><div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><SectionLabel>What the score can tell you</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Find friction, then read the sentence yourself.</h2><p className="mt-6 text-base leading-8 text-muted">Readability formulas are useful diagnostics, not hiring standards. WorkCV shows the underlying sentence-length and passive-language signals so you can judge whether a rewrite improves the CV.</p></div><div className="divide-y divide-line border-y border-line">{[["Long sentences","Review sentences over 25 words for stacked clauses or repeated context."],["Possible passive voice","Check whether the sentence hides what you personally did."],["Necessary complexity","Keep qualifications, tools and technical terms when they are accurate and relevant."]].map(([title, body]) => <article key={title} className="py-6"><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></article>)}</div></div></section>
    <section className="border-y border-line bg-paper py-20"><div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]"><div><SectionLabel>Method and limits</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">A transparent language measure.</h2><p className="mt-6 text-base leading-8 text-muted">Flesch Reading Ease returns a 0-to-100 measure based on sentence length and syllables. The NHS describes it as a readability aid; National Careers Service guidance separately recommends clear, concise CV writing and bullet points.</p><p className="mt-4 text-sm font-bold text-navy">Research reviewed 10 July 2026.</p></div><div className="grid content-start gap-3 text-sm font-bold text-navy"><a href="https://library.nhs.uk/wp-content/uploads/sites/4/2023/06/Health-Literacy-Toolkit.pdf" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">NHS Health Literacy Toolkit: Flesch Reading Ease</a><a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: clear CV writing</a><Link href="/tools/cv-keyword-density-checker" className="rounded-md border border-line bg-white p-4 hover:border-navy">Check repeated CV wording</Link></div></div></section>
    <FaqSection faqs={faqs} title="CV readability questions." />
  </>;
}
