import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  FileCheck,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { site } from "@/lib/site";

const checkedDate = "13 June 2026";

export const metadata: Metadata = {
  title: "How to Cancel Enhancv UK - Stop Monthly Charges",
  description:
    "Step-by-step guide to cancelling your Enhancv Pro subscription from the UK. Use the Billing page, confirm cancellation, and keep proof.",
  alternates: {
    canonical: "/cancel-enhancv-uk",
  },
  openGraph: {
    title: "How to Cancel Enhancv UK - WorkCV",
    description:
      "Current Enhancv cancellation steps, including Billing page, Cancel Subscription, confirmation, Pro access expiry, and support fallback.",
    url: "/cancel-enhancv-uk",
  },
};

const cancellationSteps = [
  {
    title: "Go to the Enhancv Billing page",
    body: "Enhancv's help centre says to open https://app.enhancv.com/billing while logged in. This is the official place to manage a Pro subscription.",
  },
  {
    title: "Click Cancel Subscription",
    body: "On the Billing page, choose the Cancel Subscription link. Enhancv notes that unsubscribing from its newsletter does not stop a paid plan.",
  },
  {
    title: "Answer the cancellation survey",
    body: "Enhancv's cancellation flow asks you to answer a short survey and click Continue before the cancellation is complete.",
  },
  {
    title: "Confirm the cancellation",
    body: "Finish the final confirmation step. Enhancv says a successful cancellation shows a confirmation popup.",
  },
  {
    title: "Check when Pro access expires",
    body: "Refresh the Billing page to see the updated status and Pro access expiry date. Enhancv says access usually continues until the paid period expires.",
  },
  {
    title: "Save the confirmation email",
    body: "Enhancv's terms say you receive an email confirmation after successful cancellation. Keep it with the billing-page screenshot and any invoice details.",
  },
];

const supportCards = [
  {
    title: "Billing page",
    href: "https://app.enhancv.com/billing",
    body: "Official cancellation route for Enhancv Pro. Use it while logged in and continue until the confirmation step is complete.",
    icon: FileCheck,
  },
  {
    title: "Cancellation help",
    href: "https://help.enhancv.com/en/articles/2794038-how-do-i-cancel-my-plan-and-stop-future-charges",
    body: "Enhancv's help article lists the current Billing page steps, survey step, final confirmation, and expiry check.",
    icon: FileCheck,
  },
  {
    title: "Support email",
    href: "mailto:help@enhancv.com",
    body: "Use help@enhancv.com if the Billing page is inaccessible or you need help identifying a charge.",
    icon: Mail,
  },
];

const faqItems = [
  {
    question: "How do I cancel Enhancv Pro?",
    answer:
      "Go to the Enhancv Billing page, click Cancel Subscription, answer the survey, continue through the final confirmation, then check the Billing page for the updated status and Pro access expiry date.",
  },
  {
    question: "Does unsubscribing from Enhancv emails cancel my plan?",
    answer:
      "No. Enhancv's help centre says unsubscribing from the newsletter does not stop the paid plan. You still need to cancel the Pro subscription from the Billing page.",
  },
  {
    question: "Will Enhancv send a cancellation confirmation?",
    answer:
      "Enhancv's terms say you receive an email confirmation after successful cancellation. The help centre also says the Billing page will show the updated status.",
  },
  {
    question: "Can I use my resume after cancelling Enhancv?",
    answer:
      "Enhancv says you retain full edit and download access until the current paid period expires. After that, existing resumes remain available to download but cannot be edited until Pro is restarted.",
  },
  {
    question: "Can I get an Enhancv refund?",
    answer:
      "Enhancv says monthly fees are generally non-refundable. Quarterly and semiannual plans may be eligible for partial pro-rated refunds, depending on the plan and usage. Check Enhancv's refund help page for current terms.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel Enhancv UK",
  description:
    "Step-by-step guide to cancelling an Enhancv Pro subscription and stopping future charges.",
  totalTime: "PT10M",
  step: cancellationSteps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.body,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function CancelEnhancvUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            <Link href="/" className="hover:text-navy">
              Home
            </Link>
            <span>/</span>
            <span className="text-navy">Cancel Enhancv UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel Enhancv UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel Enhancv Pro.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                Enhancv cancellation is handled from the Billing page, not by
                unsubscribing from emails. This guide follows Enhancv's official
                steps so UK users can stop future charges, check the expiry
                date, and keep proof.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Official Billing page route",
                  "Checked 13 June 2026",
                  "Email confirmation checklist",
                  "Refund and access notes included",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 shrink-0 text-success" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border-2 border-navy bg-white p-7 shadow-soft">
              <h2 className="font-display text-3xl font-semibold text-navy">
                Quick cancellation routes
              </h2>
              <div className="mt-6 space-y-4">
                {supportCards.map((card) => {
                  const Icon = card.icon;
                  const isExternal = card.href.startsWith("http");
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      className="block rounded-xl border border-line bg-paper p-4 transition hover:border-navy"
                      rel={isExternal ? "nofollow noopener noreferrer" : undefined}
                      target={isExternal ? "_blank" : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-success" />
                        <h3 className="font-bold text-navy">{card.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{card.body}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Cancel from Billing",
            "Newsletter opt-out is not enough",
            "Save the confirmation email",
            "Check Pro expiry date",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
              <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Step-by-step guide</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Keep going until Enhancv confirms cancellation.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Enhancv's cancellation help article includes a survey and final
              confirmation step. The safest approach is to refresh Billing after
              the popup appears and save the updated status before closing the
              page.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public Enhancv pages checked{" "}
                {checkedDate}. Enhancv can change pricing, Billing screens,
                refund terms, and support routes.
              </p>
            </div>
          </div>

          <ol className="space-y-4">
            {cancellationSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-line bg-white p-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-3 leading-7 text-muted">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>Refund and access checks</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Check both billing status and document access.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Enhancv says cancelling stops future payments, while Pro access
              continues until the paid period expires. It also says monthly fees
              are generally non-refundable, while quarterly and semiannual plans
              may be eligible for partial pro-rated refunds.
            </p>
            <a
              href="https://help.enhancv.com/en/articles/2792040-how-can-i-get-a-refund"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Read Enhancv refund help
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-3xl font-semibold text-navy">
              Keep this evidence together.
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Enhancv account email",
                "Billing page screenshot",
                "Cancellation confirmation email",
                "Pro access expiry date",
                "Invoice or transaction record",
                "Support email thread if used",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>After cancelling</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Need one UK CV without another Pro plan?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Enhancv is a broad resume platform with AI tools, visual
                templates, and recurring Pro plans. WorkCV is focused on one
                outcome for UK job seekers: build the CV first, then pay{" "}
                {site.price} when you download the PDF.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>Enhancv Pro</span>
                <span>WorkCV</span>
              </div>
              {[
                ["Monthly, quarterly, or semiannual Pro plans", "Free to build"],
                ["Billed at the start of each period", `${site.priceGbp} PDF download`],
                ["Cancel from Billing page", "No monthly subscription"],
                ["AI resume platform", "Focused UK CV builder"],
              ].map(([left, right]) => (
                <div key={left} className="grid grid-cols-2 border-t border-line text-sm">
                  <div className="p-5 text-muted">{left}</div>
                  <div className="bg-greensoft p-5 font-bold text-navy">{right}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/editor">Build my CV for {site.priceGbp}</ButtonLink>
            <ButtonLink href="/cv-builder-no-subscription-uk" variant="secondary">
              See no-subscription details
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Official sources</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Verify the latest Enhancv details before you act.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Enhancv cancellation help", "https://help.enhancv.com/en/articles/2794038-how-do-i-cancel-my-plan-and-stop-future-charges"],
              ["Enhancv Billing page", "https://app.enhancv.com/billing"],
              ["Enhancv Pro plans help", "https://help.enhancv.com/en/articles/1195346-understanding-the-enhancv-pro-plans"],
              ["Enhancv refund help", "https://help.enhancv.com/en/articles/2792040-how-can-i-get-a-refund"],
              ["Enhancv terms", "https://enhancv.com/terms/"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <span className="font-bold">{label}</span>
                <ExternalLink className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </a>
            ))}
            <Link
              href="/pricing"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
            >
              <span className="font-bold">Compare CV builder pricing</span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="Questions about cancelling Enhancv." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/enhancv-alternative-uk"
        secondary="Compare the Enhancv alternative"
      />
    </>
  );
}
