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
  title: "How to Cancel Zety UK - Stop Subscription",
  description:
    "Step-by-step guide to cancelling your Zety subscription in the UK. Use account settings, support, and confirmation checks to stop renewal.",
  alternates: {
    canonical: "/cancel-zety-uk",
  },
  openGraph: {
    title: "How to Cancel Zety UK - WorkCV",
    description:
      "Current UK cancellation steps for Zety, including account dashboard, support routes, billing descriptors, and renewal checks.",
    url: "/cancel-zety-uk",
  },
};

const officialLinks = [
  ["Zety UK pricing", "https://zety.com/uk/pricing"],
  ["Zety UK contact", "https://zety.com/uk/contact"],
  ["Zety contact FAQ", "https://zety.com/contact"],
  ["Zety UK terms", "https://zety.com/uk/terms-of-service"],
  ["FCA recurring card payment guidance", "https://www.fca.org.uk/consumers/recurring-card-payments"],
];

const cancellationSteps = [
  {
    title: "Sign in to your Zety account",
    body:
      "Go to Zety and sign in with the email address used for the paid plan. If you cannot access the account, use password reset before contacting support.",
  },
  {
    title: "Open the account dashboard",
    body:
      "Zety's contact FAQ says you can cancel from your account dashboard's My Plan section. Zety's UK terms also refer to My Accounts and My Settings.",
  },
  {
    title: "Find My Plan or subscription settings",
    body:
      "Look for plan, billing, subscription, renewal, cancel, or manage subscription options. Complete every confirmation step before leaving the page.",
  },
  {
    title: "Use phone, chat, or email if the account route fails",
    body:
      "Zety says the easiest way to cancel is to call support or contact them on chat. The UK contact page lists support@zety.com and 0808 196 5805.",
  },
  {
    title: "Save proof of cancellation",
    body:
      "Keep emails, chat transcripts, screenshots, support ticket numbers, and the date and time of any call. If you speak to support, write down the agent name if given.",
  },
  {
    title: "Check your next statement",
    body:
      "Zety says transactions may appear as Zety.com, BLD*Zety.com, or PP*ZETY. Check your card, PayPal, or bank statement after the next renewal date.",
  },
];

const supportCards = [
  {
    title: "Account dashboard",
    body: "Use My Plan, My Account, or My Settings if the cancellation option appears in your Zety account.",
    icon: FileCheck,
  },
  {
    title: "Phone",
    body: "Zety UK contact page lists 0808 196 5805. Working hours are listed in CET on the official contact page.",
    icon: Phone,
  },
  {
    title: "Email",
    body: "Zety UK contact page lists support@zety.com. Include the account email and a clear cancellation request.",
    icon: Mail,
  },
];

const faqItems = [
  {
    question: "How do I cancel Zety in the UK?",
    answer:
      "Start by signing in to your Zety account and checking the dashboard's My Plan section. Zety also says you can cancel by calling support or contacting support on chat. The UK contact page lists support@zety.com and 0808 196 5805.",
  },
  {
    question: "How much does Zety cost in the UK?",
    answer:
      "On the official UK pricing page checked 13 June 2026, Zety listed a £2.95 14-day trial and automatic renewal at £20.95 every 4 weeks. It also listed annual access at £59.40.",
  },
  {
    question: "What billing names should I look for?",
    answer:
      "Zety's contact page says transactions may appear as Zety.com, BLD*Zety.com, or PP*ZETY.",
  },
  {
    question: "Can I get a refund from Zety?",
    answer:
      "Zety's public FAQ says refund requests should be made by email and refers to timing and download activity. Check Zety's official FAQ and terms for the current refund rules before relying on third-party summaries.",
  },
  {
    question: "What if Zety keeps charging after cancellation?",
    answer:
      "Contact Zety with your proof of cancellation first. If a recurring card payment continues after you have cancelled it, FCA guidance says you can ask your card issuer to stop future recurring card payments and dispute unauthorised payments.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel Zety UK",
  description:
    "Step-by-step guide to cancelling a Zety UK subscription and stopping automatic renewal.",
  totalTime: "PT15M",
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

export default function CancelZetyUkPage() {
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
            <span className="text-navy">Cancel Zety UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel Zety UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel Zety in the UK.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                Zety UK currently lists a £2.95 14-day trial, followed by
                automatic renewal at £20.95 every 4 weeks. This guide shows the
                official account, support, and statement-check routes.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Account dashboard route",
                  "Phone and email fallback",
                  "Checked 13 June 2026",
                  "Billing descriptor checklist",
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
                  return (
                    <div key={card.title} className="rounded-xl border border-line bg-paper p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-success" />
                        <h3 className="font-bold text-navy">{card.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{card.body}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm leading-6 text-muted">
                Verify the latest steps on Zety's official pages before relying
                on any cancellation guide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Cancel before renewal",
            "Save written proof",
            "Check Zety billing names",
            "Use card issuer if needed",
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
              Cancel through Zety, then check the next renewal.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Zety's contact FAQ says cancellation can be done from the account
              dashboard's My Plan section, or through support by phone or chat.
              The UK terms also refer to My Accounts and My Settings.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public Zety pages checked {checkedDate}.
                Zety can change pricing, account screens, support hours, and
                cancellation steps.
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
            <SectionLabel>If payments continue</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Keep proof and use your card provider if needed.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              If a recurring card payment continues after cancellation, FCA
              guidance says you can ask your card issuer to stop future
              recurring card payments and dispute unauthorised payments. Still
              keep your Zety cancellation evidence together.
            </p>
            <a
              href="https://www.fca.org.uk/consumers/recurring-card-payments"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Read FCA recurring card payment guidance
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-3xl font-semibold text-navy">
              Keep this evidence together.
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Zety account email",
                "Cancellation confirmation or support response",
                "Chat transcript or call notes",
                "Screenshot of My Plan or account status",
                "Billing descriptor: Zety.com, BLD*Zety.com, or PP*ZETY",
                "Payment date and amount",
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
                Need a CV builder with no renewal?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Zety is a broad CV and cover letter platform. If you only need a
                focused UK CV PDF, WorkCV lets you build first and pay{" "}
                {site.price} only when you download.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>Zety UK</span>
                <span>WorkCV</span>
              </div>
              {[
                ["£2.95 for 14 days", "Free to build"],
                ["Renews at £20.95 every 4 weeks", "£4.99 PDF download"],
                ["Subscription cancellation needed", "No monthly subscription"],
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
            <ButtonLink href="/editor">Build my CV for £4.99</ButtonLink>
            <ButtonLink href="/cv-builder-no-subscription-uk" variant="secondary">
              See no-subscription details
            </ButtonLink>
            <ButtonLink href="/zety-alternative-uk" variant="secondary">
              Compare Zety alternative
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Official sources</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Verify the latest Zety details.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officialLinks.map(([label, href]) => (
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

      <FaqSection faqs={faqItems} title="Questions about cancelling Zety." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
