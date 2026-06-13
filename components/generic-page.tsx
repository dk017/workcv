import type { Metadata } from "next";
import { Check } from "lucide-react";

import {
  ButtonLink,
  CvPreview,
  FaqSection,
  FinalCta,
  NoSubscriptionCtaStrip,
  SectionLabel,
} from "@/components/marketing";
import { site } from "@/lib/site";

export type GenericPageConfig = {
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  points: string[];
  sectionTitle: string;
  sectionBody: string;
};

export function metadataFor(config: GenericPageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
  };
}

export function GenericMarketingPage({ config }: { config: GenericPageConfig }) {
  const faqs = [
    {
      question: "Is WorkCV built for UK CVs?",
      answer:
        "Yes. WorkCV uses a UK-focused CV structure with clear contact details, a direct profile, recent experience first, and practical sections.",
    },
    {
      question: "How much does it cost?",
      answer: `You can build free and pay ${site.price} when you download the final PDF.`,
    },
    {
      question: "Is it a subscription?",
      answer:
        "No. WorkCV does not use a monthly subscription for the standard CV download flow.",
    },
    {
      question: "Do I need to log in?",
      answer:
        "Yes. Login is required when you enter the editor so your CV can be saved and reopened later.",
    },
  ];

  return (
    <>
      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              {config.label}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              {config.heading}
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">{config.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my CV</ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>
          <CvPreview />
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>UK CV guidance</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              {config.sectionTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">{config.sectionBody}</p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-6">
            <ul className="space-y-4">
              {config.points.map((point) => (
                <li key={point} className="flex gap-3 font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NoSubscriptionCtaStrip />
      <FaqSection faqs={faqs} title="Common questions." />
      <FinalCta
        heading="Build your CV without the monthly fees."
        body={`Start free. Pay ${site.price} when you download. No subscription and no recurring billing to keep track of.`}
      />
    </>
  );
}
