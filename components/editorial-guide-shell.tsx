import Link from "next/link";

import { FaqSection, MoneyPageCta, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

type Faq = { question: string; answer: string };

export function EditorialGuideShell({ path, eyebrow, title, intro, answer, reviewed, children, faqs, relatedLinks, ctaHeading, ctaBody, trackingContext }: {
  path: string; eyebrow: string; title: string; intro: string; answer: string; reviewed: string;
  children: React.ReactNode; faqs: Faq[]; relatedLinks: Array<[string, string]>;
  ctaHeading: string; ctaBody: string; trackingContext: string;
}) {
  const reviewedIso = new Date(`${reviewed} UTC`).toISOString().slice(0, 10);
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: title, description: intro, dateModified: reviewedIso, mainEntityOfPage: `${site.url}${path}`, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20"><div className="container-page max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-7 text-sm text-muted"><Link href="/" className="hover:text-navy">Home</Link><span aria-hidden="true"> / </span><Link href="/career-tools" className="hover:text-navy">Career tools</Link><span aria-hidden="true"> / </span><span className="text-navy">{eyebrow}</span></nav>
      <SectionLabel>{eyebrow}</SectionLabel><h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">{title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
      <div className="mt-8 rounded-lg border border-line-strong bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-dark">The short answer</p><p className="mt-3 text-lg leading-8 text-navy">{answer}</p></div>
      <p className="mt-5 text-sm text-muted">Researched and reviewed {reviewed}. Links and services can change; verify the vacancy or process on the destination website.</p>
    </div></section>
    <div className="bg-surface">{children}</div>
    <MoneyPageCta heading={ctaHeading} body={ctaBody} trackingContext={trackingContext} />
    <RelatedLinksSection title="Continue your application." links={relatedLinks} />
    <FaqSection faqs={faqs} title="Questions job seekers ask." />
  </>;
}

export function GuideSection({ label, title, intro, children, tone = "white" }: { label: string; title: string; intro?: string; children: React.ReactNode; tone?: "white" | "paper" }) {
  return <section className={`border-b border-line py-16 md:py-20 ${tone === "paper" ? "bg-paper" : "bg-surface"}`}><div className="container-page max-w-6xl">
    <SectionLabel>{label}</SectionLabel><h2 className="max-w-4xl font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">{title}</h2>{intro ? <p className="mt-5 max-w-4xl text-base leading-8 text-muted">{intro}</p> : null}<div className="mt-9">{children}</div>
  </div></section>;
}

export function AdviceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-lg border border-line bg-white p-6 shadow-sm"><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><div className="mt-3 space-y-3 text-sm leading-7 text-muted">{children}</div></article>;
}

export function BulletList({ items }: { items: string[] }) {
  return <ul className="grid gap-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-muted"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />{item}</li>)}</ul>;
}

export function CopyTemplate({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-line-strong bg-navy p-6 text-white md:p-8"><h3 className="font-display text-2xl font-semibold">{title}</h3><div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/85">{children}</div></div>;
}
