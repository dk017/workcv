import {
  Check,
  ClipboardCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
  ButtonLink,
  FaqSection,
  MoneyPageCta,
  RelatedLinksSection,
  SectionLabel,
} from "@/components/marketing";
import { commercialRoutes, site } from "@/lib/site";

export type CareerGuideSection = {
  title: string;
  body: string;
  points?: string[];
};

export type CareerGuideLink = [string, string];

export type CareerGuidePageProps = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  answer: string;
  actionHref: string;
  actionLabel: string;
  actionPlacement: string;
  sections: CareerGuideSection[];
  relatedLinks: CareerGuideLink[];
  faqs: Array<{ question: string; answer: string }>;
  reviewDate: string;
  template?: {
    title: string;
    body: string;
    alternatives?: string[];
  };
  moneyHeading?: string;
  moneyBody?: string;
};

function formatReviewDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month - 1];
  return year && monthName && day ? `${day} ${monthName} ${year}` : value;
}

export function CareerGuidePage({
  path,
  eyebrow,
  title,
  intro,
  answer,
  actionHref,
  actionLabel,
  actionPlacement,
  sections,
  relatedLinks,
  faqs,
  reviewDate,
  template,
  moneyHeading,
  moneyBody,
}: CareerGuidePageProps) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: intro,
      dateModified: reviewDate,
      inLanguage: site.locale,
      mainEntityOfPage: `${site.url}${path}`,
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Career tools", item: `${site.url}/career-tools` },
        { "@type": "ListItem", position: 3, name: title, item: `${site.url}${path}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
  const links = relatedLinks.some(([, href]) => href === commercialRoutes.moneyPage)
    ? relatedLinks
    : [...relatedLinks, ["Build a CV without a subscription", commercialRoutes.moneyPage] as CareerGuideLink];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
              <Link href="/" className="hover:text-navy">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/career-tools" className="hover:text-navy">Career tools</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            <SectionLabel>{eyebrow}</SectionLabel>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] text-navy md:text-7xl">{title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted md:text-xl">{intro}</p>
            <p className="mt-4 text-sm text-muted">WorkCV · Reviewed <time dateTime={reviewDate}>{formatReviewDate(reviewDate)}</time></p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={actionHref} trackingLabel={actionPlacement}>{actionLabel}</ButtonLink>
              <ButtonLink href={commercialRoutes.moneyPage} variant="secondary" trackingLabel={`${actionPlacement}_money`}>Build the CV next</ButtonLink>
            </div>
          </div>

          <aside className="rounded-2xl border border-line bg-white p-7 shadow-sm md:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-dark">The short answer</p>
            <p className="mt-5 text-lg leading-8 text-navy">{answer}</p>
            <div className="mt-7 grid gap-4 border-t border-line pt-6 text-sm leading-6 text-muted">
              <p className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />Use the vacancy and your own evidence together.</p>
              <p className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />Keep every example truthful and specific.</p>
              <p className="flex gap-3"><FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold" />Turn the useful detail into an application document.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-24">
        <div className="container-page">
          <SectionLabel>Practical guide</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">A useful next step starts with the evidence you already have.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {sections.map((section, index) => (
              <article key={section.title} className="rounded-xl border border-line bg-paper p-7">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-bold text-navy">{index + 1}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
                {section.points?.length ? <ul className="mt-5 grid gap-3 text-sm leading-6 text-ink">{section.points.map((point) => <li key={point} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-success" />{point}</li>)}</ul> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {template ? (
        <section className="bg-surface py-16">
          <div className="container-page grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div><SectionLabel>Copyable template</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">{template.title}</h2><p className="mt-4 text-sm leading-7 text-muted">Replace the bracketed prompts and remove anything that is not accurate.</p></div>
            <div><pre className="whitespace-pre-wrap rounded-xl border border-line bg-paper p-6 text-sm leading-7 text-ink">{template.body}</pre>{template.alternatives?.length ? <div className="mt-5 grid gap-3 md:grid-cols-2">{template.alternatives.map((alternative) => <p key={alternative} className="rounded-md border border-line bg-white p-4 text-sm leading-6 text-muted">{alternative}</p>)}</div> : null}</div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-paper py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><SectionLabel>Use the result</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Make the next application easier to review.</h2></div>
          <div className="grid gap-4 text-base leading-8 text-muted"><p>Keep the advert open while you edit. Remove anything you cannot support, replace generic language with a real example and follow the employer&apos;s instructions.</p><p className="flex gap-3 text-sm leading-7"><ClipboardCheck className="mt-1 h-5 w-5 shrink-0 text-gold-dark" />A clear CV gives every later application step a stronger starting point.</p></div>
        </div>
      </section>

      <MoneyPageCta heading={moneyHeading} body={moneyBody} trackingContext={`${actionPlacement}_money_cta`} />
      <RelatedLinksSection title="Continue with your application." links={links} />
      <FaqSection faqs={faqs} title={`${eyebrow} questions.`} />
    </>
  );
}
