import Link from "next/link";
import { ArrowRight, Briefcase, FileCheck2, RefreshCw, TrendingUp } from "lucide-react";

import { FaqSection, MoneyPageCta, SectionLabel } from "@/components/marketing";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { commercialRoutes, site } from "@/lib/site";

type HubCard = {
  title: string;
  href: string;
  description: string;
};

type HubCategory = {
  title: string;
  description: string;
  icon: typeof Briefcase;
  cards: HubCard[];
};

const categories: HubCategory[] = [
  {
    title: "Job search",
    description: "Move from a promising vacancy to a clearer application, with role-specific CV examples where they help.",
    icon: Briefcase,
    cards: [
      { title: "Best UK job sites compared", href: "/top-job-boards-uk", description: "Open real general, official and specialist job sites, compare what each is useful for and set up safer alerts." },
      { title: "Driver CV template", href: "/cv-template-driver-uk", description: "Focus your licence, route, safety and delivery evidence." },
      { title: "Warehouse CV template", href: "/cv-template-warehouse-uk", description: "Present warehouse, stock, equipment and reliability evidence clearly." },
      { title: "Customer service CV template", href: "/cv-template-customer-service-uk", description: "Turn service, communication and complaint-handling experience into useful evidence." },
    ],
  },
  {
    title: "Applications",
    description: "Prepare the documents and conversations that sit around a tailored CV.",
    icon: FileCheck2,
    cards: [
      { title: "Interview preparation checklist", href: "/how-to-prepare-for-a-job-interview-uk", description: "Follow a timed plan, build an evidence matrix and prepare for video, telephone, panel or task interviews." },
      { title: "21 common interview questions", href: "/common-job-interview-questions-uk", description: "See what each question tests, how to structure the answer and which common mistake to avoid." },
      { title: "Five interview follow-up emails", href: "/thank-you-email-after-interview-uk", description: "Copy examples for first, panel and final interviews, requested documents and delayed decisions." },
      { title: "Job Application Pack", href: "/tools/job-application-pack-uk", description: "Turn one vacancy and your real evidence into a reviewable application pack." },
      { title: "Cover letter generator", href: "/tools/cover-letter-generator-uk", description: "Connect your experience to the job advert in a focused UK draft." },
      { title: "ATS score checker", href: "/tools/ats-score-checker", description: "Find relevant terms and evidence gaps before you submit." },
    ],
  },
  {
    title: "Career progression",
    description: "Translate a progression goal into stronger evidence, clearer language and a document for the next role.",
    icon: TrendingUp,
    cards: [
      { title: "90-day career progression plan", href: "/career-advancement-strategies-uk", description: "Use a gap-analysis table, achievement log, manager script and 30-60-90 day action plan." },
      { title: "CV bullet point generator", href: "/tools/cv-bullet-point-generator", description: "Rewrite rough notes into concise, evidence-led CV bullets." },
      { title: "Transferable skills translator", href: "/tools/transferable-skills-translator-uk", description: "Reframe real responsibilities for a new target role." },
    ],
  },
  {
    title: "Employment changes",
    description: "Get practical help when a job change, redundancy or pay question affects your next application.",
    icon: RefreshCw,
    cards: [
      { title: "Made redundant? Start here", href: "/situations/made-redundant", description: "Work through immediate CV, pay and job-search decisions." },
      { title: "Redundancy pay calculator", href: "/tools/redundancy-pay-calculator", description: "Estimate statutory redundancy pay and check the assumptions." },
      { title: "Notice period calculator", href: "/tools/notice-period-calculator", description: "Plan an earliest start date around your notice period." },
      { title: "UK salary by job title", href: "/tools/uk-salary-by-job-title", description: "Compare published pay benchmarks before you target your next role." },
    ],
  },
];

const faqs = [
  { question: "What are WorkCV career tools?", answer: "They are focused guides and tools for UK job seekers: finding a vacancy, preparing an application, planning an interview and turning real experience into a clearer CV." },
  { question: "Does WorkCV list live jobs?", answer: "No. WorkCV does not present itself as a live vacancy database. The job-search guide explains how to choose useful boards, then the application tools help you prepare for a vacancy you find." },
  { question: "Can I use the tools without signing up?", answer: "The public guides and most tools are available without an account. AI tools may have fair-use limits, and every result should be checked against your own evidence." },
  { question: "How does the CV builder fit in?", answer: `Use the guides to clarify the application, then build and preview a UK CV. The final PDF costs ${site.price} as a one-off purchase rather than a recurring subscription.` },
];

export function CareerToolsHub() {
  const itemList = categories.flatMap((category) => category.cards).map((card, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: card.title,
    url: `${site.url}${card.href}`,
  }));
  const schemas = [
    { "@context": "https://schema.org", "@type": "ItemList", name: "WorkCV career and work tools", numberOfItems: itemList.length, itemListElement: itemList },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Career tools", item: `${site.url}/career-tools` }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionLabel>Career &amp; work tools</SectionLabel>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] text-navy md:text-7xl">Find the vacancy. Build the application. Prepare for the interview.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-muted md:text-xl">Choose what you need right now: real UK job sites, an application pack, detailed interview preparation, copy-ready follow-up emails or a practical progression plan.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/job-application-pack-uk" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover">I have found a vacancy <ArrowRight className="h-4 w-4" /></Link>
            <TrackedLink href={commercialRoutes.moneyPage} placement={analyticsPlacements.careerToolsHubMoneyHero} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5">I need to build my CV <ArrowRight className="h-4 w-4" /></TrackedLink>
          </div>
        </div>
        <aside className="rounded-2xl border border-line bg-white p-7 shadow-sm md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-dark">A simple workflow</p>
          <ol className="mt-6 grid gap-5">
            {["Find and verify a suitable vacancy", "Map its requirements to your real evidence", "Tailor the CV and supporting documents", "Prepare answers and preserve what you submitted"].map((item, index) => <li key={item} className="flex gap-4"><span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{index + 1}</span><span className="pt-1 text-sm leading-6 text-muted">{item}</span></li>)}
          </ol>
        </aside>
      </div>
    </section>

    <div className="bg-surface">
      {categories.map((category, index) => {
        const Icon = category.icon;
        return <section key={category.title} className={`py-16 md:py-20 ${index ? "border-t border-line" : ""}`}><div className="container-page"><div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"><div className="flex items-center gap-4"><span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-paper text-navy"><Icon className="h-6 w-6" /></span><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">{category.title}</h2></div><p className="max-w-2xl text-base leading-8 text-muted">{category.description}</p></div><div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{category.cards.map((card) => <Link key={card.href} href={card.href} className="group flex min-h-full flex-col rounded-md border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-navy"><h3 className="font-display text-2xl font-semibold text-navy">{card.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted">{card.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div></section>;
      })}
    </div>

    <section className="border-y border-line bg-paper py-16"><div className="container-page grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"><div><SectionLabel>Full directory</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Need a specific CV check or calculator?</h2></div><div><p className="text-base leading-8 text-muted">The career cluster is curated around application intent. For the full set of free CV checkers, generators, pay calculators and downloads, use the main tools directory.</p><Link href="/tools" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">See all free UK CV tools <ArrowRight className="h-4 w-4" /></Link></div></div></section>
    <MoneyPageCta heading="Build the CV behind your next application." body={`Once you know what the vacancy needs, build and preview your UK CV, then pay ${site.price} once only if you download the finished PDF.`} trackingContext="career_tools_hub" />
    <FaqSection faqs={faqs} title="Career and work tool questions." />
  </>;
}
