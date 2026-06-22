import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  FileCheck,
  Mail,
  Phone,
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
  title: "How to Cancel LiveCareer UK - Step by Step",
  description:
    "How to cancel LiveCareer in the UK. Stop automatic renewal charges with account settings, support routes, and a confirmation checklist.",
  alternates: {
    canonical: "/cancel-livecareer-uk",
  },
  openGraph: {
    title: "How to Cancel LiveCareer UK - WorkCV",
    description:
      "Current LiveCareer UK cancellation steps, including Settings, Subscription, support contact, cancellation reference, and statement checks.",
    url: "/cancel-livecareer-uk",
  },
};

const cancellationSteps = [
  {
    title: "Log in to your LiveCareer UK account",
    body: "Use the email address linked to your LiveCareer subscription. If you are not sure which email was used, search your inbox and spam folder for LiveCareer payment or welcome messages.",
  },
  {
    title: "Open Settings from your dashboard",
    body: "LiveCareer's UK technical FAQ says to go to the Settings link from your dashboard by clicking your name.",
  },
  {
    title: "Click Subscription",
    body: "Inside Settings, choose Subscription. This is the account area LiveCareer identifies for managing the paid plan.",
  },
  {
    title: "Click Cancel and complete the prompts",
    body: "Follow the cancellation prompts until the flow is finished. Do not stop after reaching the Subscription screen; wait for a clear cancellation result.",
  },
  {
    title: "Save the cancellation reference email",
    body: "LiveCareer's UK terms say the provider sends an email with a cancellation reference. If it does not arrive, check spam or contact customer service.",
  },
  {
    title: "Check your next statement",
    body: "LiveCareer lists statement descriptors including LiveCareer.co.uk, BLD*Livecareer.co.uk, and PayPal *LIVECAREER. Check that no new renewal appears after cancellation.",
  },
];

const supportCards = [
  {
    title: "Account settings",
    href: "https://www.livecareer.co.uk/faq/technical-questions",
    body: "Official UK FAQ route: log in, click your name, open Settings, choose Subscription, then Cancel.",
    icon: FileCheck,
  },
  {
    title: "UK phone support",
    href: "tel:08081890354",
    body: "LiveCareer UK lists 0808-189-0354, Monday to Sunday, 9am-9pm GMT.",
    icon: Phone,
  },
  {
    title: "Email or contact form",
    href: "https://www.livecareer.co.uk/contact",
    body: "Use customerservice@livecareer.co.uk or the contact form. Include your account email and request cancellation in writing.",
    icon: Mail,
  },
];

const faqItems = [
  {
    question: "How do I cancel LiveCareer UK?",
    answer:
      "Log in to LiveCareer, click your name from the dashboard, open Settings, choose Subscription, then click Cancel. LiveCareer also says you can contact customer support or use live chat.",
  },
  {
    question: "How much does LiveCareer UK cost after the trial?",
    answer:
      "On the UK pricing page checked 13 June 2026, LiveCareer listed a 14-day access plan at GBP 1.95 that automatically renews at GBP 19.85 billed every four weeks if you do not cancel.",
  },
  {
    question: "Does LiveCareer send cancellation proof?",
    answer:
      "LiveCareer's UK terms say the provider sends an email with a cancellation reference to confirm any cancellation request. Keep that email and contact support if it does not arrive.",
  },
  {
    question: "What LiveCareer billing names should I look for?",
    answer:
      "LiveCareer UK's contact page says statement descriptors can include LiveCareer.co.uk, BLD*Livecareer.co.uk, and PayPal *LIVECAREER.",
  },
  {
    question: "What if LiveCareer charges me after I cancel?",
    answer:
      "Contact LiveCareer with your cancellation reference, account email, and payment details. If a recurring card payment continues after cancellation, FCA guidance says you can ask your card issuer to stop future payments.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel LiveCareer UK",
  description:
    "Step-by-step guide to cancelling a LiveCareer UK subscription and stopping automatic renewal.",
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

export default function CancelLiveCareerUkPage() {
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
            <span className="text-navy">Cancel LiveCareer UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel LiveCareer UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel LiveCareer in the UK.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                LiveCareer UK currently lists 14-day access at GBP 1.95,
                followed by automatic renewal at GBP 19.85 every four weeks.
                This guide shows the account settings route, support options,
                and the proof to keep after cancelling.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Official UK FAQ route",
                  "Checked 13 June 2026",
                  "Cancellation reference checklist",
                  "Statement descriptors included",
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
            "Settings then Subscription",
            "Save the reference email",
            "Use UK support if blocked",
            "Check billing descriptors",
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
              Finish the cancellation and check for the reference.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              LiveCareer's UK FAQ gives a short account route, while the terms
              explain that cancellation can also be handled through customer
              service and should be confirmed by email reference.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public LiveCareer UK pages checked{" "}
                {checkedDate}. LiveCareer can change pricing, account screens,
                support availability, and cancellation wording.
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
            <SectionLabel>If you need support</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Use the UK contact routes and keep everything written down.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              LiveCareer UK lists phone, chat, contact form, and email support.
              If you call, record the date, time, number used, and outcome. If
              you use chat or the form, save a transcript or screenshot before
              closing the page.
            </p>
            <a
              href="https://www.livecareer.co.uk/contact"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Open LiveCareer UK contact page
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-3xl font-semibold text-navy">
              Keep this evidence together.
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "LiveCareer account email",
                "Cancellation reference email",
                "Settings or Subscription screenshot",
                "Support chat, form, or call notes",
                "Payment date and billing descriptor",
                "Bank or PayPal statement screenshot",
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
                Want a finished UK CV without recurring billing?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                LiveCareer includes CV and cover-letter tools, templates, and
                ongoing account storage. WorkCV is deliberately narrower for UK
                job seekers who need one clean CV PDF and no monthly renewal.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>LiveCareer UK</span>
                <span>WorkCV</span>
              </div>
              {[
                ["GBP 1.95 for 14 days", "Free to build"],
                ["Renews at GBP 19.85 every 4 weeks", `${site.priceGbp} PDF download`],
                ["Cancellation reference needed", "No monthly subscription"],
                ["CV and cover-letter platform", "Focused UK CV builder"],
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
            Verify the latest LiveCareer details before you act.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
              ["LiveCareer UK technical FAQ", "https://www.livecareer.co.uk/faq/technical-questions"],
              ["LiveCareer UK contact", "https://www.livecareer.co.uk/contact"],
              ["LiveCareer UK terms", "https://www.livecareer.co.uk/terms-of-service"],
              ["FCA recurring card payments", "https://www.fca.org.uk/consumers/recurring-card-payments"],
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

      <FaqSection faqs={faqItems} title="Questions about cancelling LiveCareer." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
