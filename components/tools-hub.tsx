import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Banknote, BarChart3, CalendarCheck, FileCheck2, FileDown, FileSearch, FileText, ListChecks, Scale, Sparkles } from "lucide-react";

import { FaqSection } from "@/components/marketing";
import { site } from "@/lib/site";

type Tool = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

type Category = {
  title: string;
  description: string;
  tools: Tool[];
};

const categories: Category[] = [
  { title: "CV generators", description: "Turn your real experience into a focused first draft, then edit it in your own voice.", tools: [
    { title: "Cover Letter Generator", href: "/tools/cover-letter-generator-uk", description: "Create a tailored four-paragraph UK cover letter from the vacancy and evidence from your CV.", icon: Sparkles },
    { title: "CV Bullet Point Generator", href: "/tools/cv-bullet-point-generator", description: "Turn rough experience notes into five concise, evidence-led and editable UK CV bullet points.", icon: ListChecks },
    { title: "CV Summary Generator", href: "/tools/cv-summary-generator-uk", description: "Compare three concise UK CV summary options built around your target role and real evidence.", icon: FileText },
  ] },
  { title: "CV checkers", description: "Find content, targeting and length issues before you send an application.", tools: [
    { title: "ATS Score Checker", href: "/tools/ats-score-checker", description: "Compare your CV with a job advert and find matched or missing role-specific terms.", icon: FileCheck2 },
    { title: "CV Gap Detector", href: "/tools/cv-gap-detector-uk", description: "Paste CV text to find missing sections, dates, contact details and evidence signals.", icon: FileSearch },
    { title: "CV Word Count Checker", href: "/tools/cv-word-count-checker", description: "Count words, estimate A4 pages and get a result-specific UK CV length recommendation.", icon: FileText },
    { title: "CV Readability Checker", href: "/tools/cv-readability-checker", description: "Measure Flesch Reading Ease and review long sentences or possible passive wording.", icon: FileSearch },
    { title: "CV Keyword Density Checker", href: "/tools/cv-keyword-density-checker", description: "Find repeated words, phrases and vague wording without uploading your CV.", icon: BarChart3 },
  ] },
  { title: "Salary and employment tools", description: "Check pay, employment dates and market benchmarks using current published UK rules and data.", tools: [
    { title: "UK Take-Home Pay Calculator", href: "/tools/take-home-pay-calculator-uk", description: "Estimate pay after 2026/27 tax, National Insurance, student loans and salary sacrifice.", icon: Banknote },
    { title: "UK Living Wage Checker 2026", href: "/tools/uk-living-wage-checker", description: "Compare hourly pay or salary with current statutory and voluntary UK Living Wage rates.", icon: Scale },
    { title: "Redundancy Pay Calculator", href: "/tools/redundancy-pay-calculator", description: "Calculate statutory redundancy pay with current GB and Northern Ireland limits.", icon: Scale },
    { title: "Notice Period Calculator", href: "/tools/notice-period-calculator", description: "Find your earliest new-job start date and the UK statutory notice minimum.", icon: CalendarCheck },
    { title: "UK Salary by Job Title", href: "/tools/uk-salary-by-job-title", description: "Compare lower-quartile, median and upper-quartile gross pay for 60 roles using ONS data.", icon: BarChart3 },
  ] },
  { title: "Templates and downloads", description: "Start from a clean document without an email gate, payment screen or subscription.", tools: [
    { title: "Blank UK CV Template for Word", href: "/tools/blank-cv-template-uk", description: "Download a simple editable .docx with standard UK CV sections and practical prompts.", icon: FileDown },
    { title: "CV Template for Microsoft Word", href: "/tools/cv-template-word-uk", description: "Download a clean editable Word CV and follow practical DOCX editing and export guidance.", icon: FileText },
    { title: "Cover Letter Template", href: "/tools/cover-letter-template-uk", description: "Edit, copy or download a structured UK cover letter template with the correct sign-off.", icon: FileDown },
  ] },
];

const tools = categories.flatMap((category) => category.tools);
const faqs = [
  { question: "What are the best free CV tools in the UK?", answer: "Useful free tools solve a specific problem and explain their limits. WorkCV includes vacancy matching, CV content and length checks, writing generators, UK pay calculators and a direct Word template download. Choose the tool for the decision you need to make rather than relying on one generic score." },
  { question: "Is there a free CV checker in the UK with no signup?", answer: "Yes. WorkCV's ATS checker, CV gap detector and CV length checker work without an account. The gap and length checks run in your browser; the ATS checker compares pasted text with a vacancy." },
  { question: "Can I use a CV builder without a subscription?", answer: `Yes. WorkCV lets you build and preview a CV without subscribing. A finished PDF costs ${site.price} as a one-off purchase rather than a recurring plan.` },
  { question: "Are these tools completely accurate?", answer: "No tool can guarantee an interview, ATS result, payroll figure or legal outcome. Each page states what it checks, cites relevant sources where available and tells you what still needs human verification." },
];
const schemas = [
  { "@context": "https://schema.org", "@type": "ItemList", name: "Free UK CV tools", numberOfItems: tools.length, itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.title, url: `${site.url}${tool.href}` })) },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

export function ToolsHub() {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24"><div className="container-page"><p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">{tools.length} practical tools for UK job seekers</p><h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">Free UK CV Tools — No Signup Required</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-muted">Generate stronger application drafts, check your CV, understand UK pay and download a clean Word template. Every tool is free to start and works without a subscription.</p><p className="mt-6 text-sm font-bold text-navy">Last reviewed: July 2026</p></div></section>
    <div className="bg-surface">{categories.map((category, categoryIndex) => <section key={category.title} className={`py-16 md:py-20 ${categoryIndex ? "border-t border-line" : ""}`}><div className="container-page"><div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">{category.title}</h2><p className="max-w-2xl text-base leading-8 text-muted">{category.description}</p></div><div className={`mt-9 grid gap-4 ${category.tools.length === 1 ? "max-w-2xl" : "md:grid-cols-2 lg:grid-cols-3"}`}>{category.tools.map((tool) => <ToolCard key={tool.href} tool={tool} />)}</div></div></section>)}</div>
    <section className="border-y border-line bg-paper py-16"><div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><h2 className="font-display text-4xl font-semibold text-navy">How WorkCV reviews tools.</h2><div className="grid gap-5 text-sm leading-7 text-muted sm:grid-cols-2"><p>Rule-based calculators cite GOV.UK, HMRC, Acas or ONS sources and keep calculation logic separate from the interface for testing.</p><p>Writing and CV checks explain what is processed, avoid guarantees and expose limits a result cannot answer.</p></div></div></section>
    <FaqSection faqs={faqs} title="Free UK CV tool questions." />
  </>;
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return <Link href={tool.href} className="group flex min-h-full flex-col rounded-md border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-navy"><span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#edf4f8] text-navy"><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-display text-2xl font-semibold text-navy">{tool.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted">{tool.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">Try free <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>;
}
