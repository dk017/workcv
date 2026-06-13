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
  title: "How to Cancel CVMaker UK Subscription",
  description:
    "Step-by-step guide to cancelling CVMaker UK. Stop automatic monthly renewal, keep proof, and compare a no-subscription CV builder.",
  alternates: {
    canonical: "/cancel-cvmaker-uk",
  },
  openGraph: {
    title: "How to Cancel CVMaker UK Subscription - WorkCV",
    description:
      "Current CVMaker UK cancellation steps, including Account Settings, Subscription, help desk fallback, confirmation email, and statement checks.",
    url: "/cancel-cvmaker-uk",
  },
};

const cancellationSteps = [
  {
    title: "Sign in to your CVMaker UK account",
    body: "Go to CVMaker.uk and log in with the email address used when you created the CV. If you are unsure which email was used, search your inbox for the CVMaker welcome or payment email.",
  },
  {
    title: "Click your name in the top right",
    body: "CVMaker's UK help centre says the account route starts by clicking your name in the top right after you have logged in.",
  },
  {
    title: "Open Account settings",
    body: "Choose Account settings from the account menu. This is where CVMaker says the subscription controls are located.",
  },
  {
    title: "Find the Subscription heading",
    body: "Under the Subscription heading, choose the option to cancel your subscription. CVMaker says account cancellations are processed immediately.",
  },
  {
    title: "Save the confirmation email",
    body: "CVMaker says you will always receive a cancellation confirmation by email. Keep that email as proof and check spam or junk if it does not appear.",
  },
  {
    title: "Check the next payment date and statement",
    body: "After cancelling, confirm that no further monthly collection is made. Keep a screenshot of your account status and compare it with your bank or card statement.",
  },
];

const routeCards = [
  {
    title: "Account settings",
    href: "https://www.cvmaker.uk/help/how-do-i-cancel-my-subscription",
    body: "Official CVMaker UK help says to log in, click your name, open Account settings, then use the Subscription cancellation option.",
    icon: FileCheck,
  },
  {
    title: "Help centre",
    href: "https://www.cvmaker.uk/help",
    body: "Use the help centre if the account screen has changed or if you need the latest cancellation wording from CVMaker.",
    icon: FileCheck,
  },
  {
    title: "Help desk",
    href: "https://www.cvmaker.uk/contact",
    body: "CVMaker says you can also cancel through its help desk. Keep a copy of the message and the confirmation email.",
    icon: Mail,
  },
];

const faqItems = [
  {
    question: "How do I cancel CVMaker UK?",
    answer:
      "Log in to CVMaker.uk, click your name in the top right, open Account settings, then use the cancellation option under the Subscription heading. CVMaker says it processes account cancellations immediately and sends a confirmation email.",
  },
  {
    question: "How much does CVMaker UK cost after the trial?",
    answer:
      "On the CVMaker UK costs page checked 13 June 2026, CVMaker listed Pro access at GBP 0.99 for 7 days, followed by automatic monthly renewal at GBP 19.99 per month.",
  },
  {
    question: "Can I cancel CVMaker UK without logging in?",
    answer:
      "CVMaker's UK help centre says you can cancel via Account settings after logging in, or by contacting its help desk. Use the help desk route if you cannot access the account.",
  },
  {
    question: "What proof should I keep after cancelling CVMaker?",
    answer:
      "Keep the cancellation confirmation email, screenshots of your Subscription page, any help desk messages, your account email, and the bank or card statement showing the last payment.",
  },
  {
    question: "What if CVMaker charges me after I cancel?",
    answer:
      "Contact CVMaker with your confirmation email and payment details. If the payment is a recurring card payment and it continues after you have cancelled, UK FCA guidance says you can also ask your card issuer to stop future payments.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel CVMaker UK",
  description:
    "Step-by-step guide to cancelling a CVMaker UK subscription and stopping automatic monthly renewal.",
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

export default function CancelCvmakerUkPage() {
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
            <span className="text-navy">Cancel CVMaker UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel CVMaker UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel CVMaker UK.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                CVMaker UK currently lists Pro access at GBP 0.99 for 7 days,
                followed by automatic renewal at GBP 19.99 per month. This guide
                shows the official account route, help desk fallback, and what
                to keep as proof after cancelling.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Official CVMaker UK help routes",
                  "Checked 13 June 2026",
                  "Confirmation email checklist",
                  "UK card-payment fallback guidance",
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
                {routeCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      className="block rounded-xl border border-line bg-paper p-4 transition hover:border-navy"
                      rel="nofollow noopener noreferrer"
                      target="_blank"
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
            "Cancel from Subscription",
            "Save the confirmation email",
            "Keep account screenshots",
            "Check the next statement",
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
              Complete the account flow, then keep written proof.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              CVMaker's UK help centre gives a specific route through Account
              settings and the Subscription heading. If that does not work,
              CVMaker says the help desk can also process cancellations.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public CVMaker UK pages checked{" "}
                {checkedDate}. CVMaker can change pricing, account screens,
                support routes, and cancellation wording.
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
            <SectionLabel>If the renewal continues</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Bring evidence before disputing a charge.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Start with CVMaker support and send your cancellation confirmation,
              account email, payment date, and any account screenshots. If you
              paid by debit or credit card and a recurring card payment still
              continues after cancellation, FCA guidance says you can ask your
              card issuer to stop future payments.
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
                "CVMaker account email",
                "Cancellation confirmation email",
                "Account Settings screenshot",
                "Help desk message or ticket",
                "Date and time of cancellation",
                "Bank or card statement showing the payment",
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
                Need a CV builder with nothing monthly to cancel?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                CVMaker offers a broader CV and cover-letter platform through a
                Pro subscription. If your immediate need is a finished UK CV
                PDF, WorkCV keeps the payment model simple: build first, then
                pay {site.price} when you download.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>CVMaker UK</span>
                <span>WorkCV</span>
              </div>
              {[
                ["GBP 0.99 for 7 days", "Free to build"],
                ["Renews at GBP 19.99 per month", "GBP 4.99 PDF download"],
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
            <ButtonLink href="/editor">Build my CV for GBP 4.99</ButtonLink>
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
            Verify the latest CVMaker details before you act.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["CVMaker UK cancellation help", "https://www.cvmaker.uk/help/how-do-i-cancel-my-subscription"],
              ["CVMaker UK costs", "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk"],
              ["CVMaker UK help centre", "https://www.cvmaker.uk/help"],
              ["CVMaker UK contact", "https://www.cvmaker.uk/contact"],
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

      <FaqSection faqs={faqItems} title="Questions about cancelling CVMaker." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
