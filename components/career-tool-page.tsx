import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import {
  CareerGapExplainerTool,
  CvFormatCheckerTool,
  CvShortenerTool,
  FirstJobCvWizard,
  TransferableSkillsTranslator,
  UkCvConverterTool,
} from "@/components/career-growth-tools";
import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export type CareerToolId = "format" | "first-job" | "transferable" | "shorten" | "converter" | "gap";

type CareerToolPageProps = {
  path: string;
  tool: CareerToolId;
  eyebrow: string;
  title: string;
  intro: string;
  description: string;
  howItHelps: string;
  links: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
};

export function CareerToolPage({ path, tool, eyebrow, title, intro, description, howItHelps, links, faqs }: CareerToolPageProps) {
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: title, applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, description, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];
  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page"><div className="max-w-4xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">{eyebrow}</p><h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p><div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy"><span className="flex items-center gap-2"><Check className="h-5 w-5 text-success" />Free to use</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" />No signup for the result</span><span className="flex items-center gap-2"><ArrowRight className="h-5 w-5 text-gold" />Editable CV handoff</span></div></div><div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><ToolSwitch tool={tool} /></div></div></section>
    <section className="bg-surface py-20"><div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionLabel>Why this tool exists</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">{howItHelps}</h2></div><div className="grid gap-5 text-base leading-8 text-muted"><p>{description}</p><p>Use the result as a working draft. Keep the facts accurate, tailor them to the vacancy and inspect the final PDF or DOCX before you submit it.</p></div></div></section>
    <RelatedLinksSection title="Continue with your application." links={links} />
    <FaqSection faqs={faqs} title={`${eyebrow} questions.`} />
  </>;
}

function ToolSwitch({ tool }: { tool: CareerToolId }) {
  if (tool === "format") return <CvFormatCheckerTool />;
  if (tool === "first-job") return <FirstJobCvWizard />;
  if (tool === "transferable") return <TransferableSkillsTranslator />;
  if (tool === "shorten") return <CvShortenerTool />;
  if (tool === "converter") return <UkCvConverterTool />;
  return <CareerGapExplainerTool />;
}
