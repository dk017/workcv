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
  title: "How to Cancel Resume.io UK - Stop Subscription",
  description:
    "Step-by-step guide to cancelling Resume.io in the UK. Use the cancellation form, confirm by email, and stop automatic renewal.",
  alternates: {
    canonical: "/cancel-resume-io-uk",
  },
  openGraph: {
    title: "How to Cancel Resume.io UK - WorkCV",
    description:
      "Current UK cancellation steps for Resume.io, including the cancellation form, account settings route, confirmation email, and support fallback.",
    url: "/cancel-resume-io-uk",
  },
};

const cancellationSteps = [
  {
    title: "Open Resume.io's cancellation form",
    body: "Resume.io provides a dedicated cancellation form at resume.io/contact/cancel-subscription. You can use it without logging into the app.",
  },
  {
    title: "Enter the email used for your Resume.io account",
    body: "Resume.io says the only thing needed for the public cancellation form is the email address used when registering. If you are unsure, search your inbox for the welcome email from resume.io.",
  },
  {
    title: "Click the cancellation button",
    body: "If Resume.io finds your email address, follow the prompts and click the cancel subscription button.",
  },
  {
    title: "Confirm the cancellation from your email",
    body: "Resume.io says it sends a confirmation email and that you need to follow the steps in that email. Check spam or search your inbox for resume.io if it does not arrive quickly.",
  },
  {
    title: "Use Account Settings if the form does not work",
    body: "Resume.io's help page says you can log in, open the profile menu, choose Account Settings, and downgrade or cancel from the top of that page.",
  },
  {
    title: "Email support if you still cannot cancel",
    body: "Resume.io's help page lists support@resume.io as the fallback if the email lookup, confirmation email, or in-app cancellation route does not work.",
  },
];

const supportCards = [
  {
    title: "Cancellation form",
    href: "https://resume.io/contact/cancel-subscription",
    body: "Fastest official route. Enter the account email and complete the email confirmation step.",
    icon: FileCheck,
  },
  {
    title: "UK contact page",
    href: "https://resume.io/uk/contact",
    body: "Use the Cancel Subscription topic or support contact form if the cancellation form is not enough.",
    icon: FileCheck,
  },
  {
    title: "Support email",
    href: "mailto:support@resume.io",
    body: "Use this if the account email is not found or you do not receive the confirmation email.",
    icon: Mail,
  },
];

const faqItems = [
  {
    question: "How do I cancel Resume.io in the UK?",
    answer:
      "Use Resume.io's cancellation form at resume.io/contact/cancel-subscription, enter the account email, then complete the confirmation steps sent by email. You can also cancel from Account Settings after logging in.",
  },
  {
    question: "How much does Resume.io cost in the UK?",
    answer:
      "On the UK pricing page checked 13 June 2026, Resume.io listed a 7-day trial at GBP 2.95 that auto-renews to GBP 20.95 billed every 4 weeks.",
  },
  {
    question: "Why did Resume.io charge me after I tried to cancel?",
    answer:
      "Resume.io's help centre says this can happen if the full cancellation process was not completed, including the confirmation email step, or if an extension was selected rather than cancellation.",
  },
  {
    question: "Can I get a Resume.io refund?",
    answer:
      "Resume.io's UK pricing page says it offers a 7-day money-back guarantee. Its help centre says refund eligibility depends on timing and that refunds are generally not available after more than 7 days from account creation.",
  },
  {
    question: "What proof should I keep after cancelling Resume.io?",
    answer:
      "Keep the cancellation email, support message, account email, payment receipt, bank statement, and any screenshots showing account status or cancellation confirmation.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel Resume.io UK",
  description:
    "Step-by-step guide to cancelling a Resume.io UK subscription and stopping automatic renewal.",
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

export default function CancelResumeIoUkPage() {
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
            <span className="text-navy">Cancel Resume.io UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel Resume.io UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel Resume.io in the UK.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                Resume.io currently lists a GBP 2.95 7-day trial in the UK,
                followed by automatic renewal at GBP 20.95 every 4 weeks. This
                guide focuses on the official cancellation form, email
                confirmation, and account settings fallback.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Official cancellation form",
                  "Email confirmation step",
                  "Checked 13 June 2026",
                  "Support fallback included",
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
                    <a
                      key={card.title}
                      href={card.href}
                      className="block rounded-xl border border-line bg-paper p-4 transition hover:border-navy"
                      rel={card.href.startsWith("http") ? "nofollow noopener noreferrer" : undefined}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
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
            "Use the account email",
            "Confirm by email",
            "Save proof",
            "Check next statement",
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
              Do not stop before the confirmation email.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Resume.io's help centre says cancellation can be started from the
              public cancellation form, but the confirmation email is part of
              the process. If that email does not arrive, use account settings
              or support.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public Resume.io pages checked{" "}
                {checkedDate}. Resume.io can change pricing, account screens,
                and cancellation steps.
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
            <SectionLabel>Refund and charge checks</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Resume.io charging me after cancellation: check the confirmation.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Resume.io says its 7-day trial has a money-back guarantee. Its
              help centre also says a successful cancellation sends a
              confirmation email, and that some post-cancellation charges happen
              when the full cancellation process was not completed.
            </p>
            <a
              href="https://help.resume.io/en/articles/3888960"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Read Resume.io billing help
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-3xl font-semibold text-navy">
              Keep this evidence together.
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Resume.io account email",
                "Cancellation confirmation email",
                "Account Settings screenshot",
                "Support ticket or email thread",
                "Payment receipt and billing date",
                "Bank or PayPal transaction screenshot",
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
                Need one CV without another subscription?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Resume.io gives full trial access to CV tools, templates, cover
                letters, and download formats. If you only need one UK CV PDF,
                WorkCV keeps the model narrower: build first, pay {site.price}
                when you download.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>Resume.io UK</span>
                <span>WorkCV</span>
              </div>
              {[
                ["GBP 2.95 for 7 days", "Free to build"],
                ["Renews at GBP 20.95 every 4 weeks", `${site.priceGbp} PDF download`],
                ["Confirmation email required to cancel", "No monthly subscription"],
                ["Broad CV and cover-letter tools", "Focused UK CV builder"],
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
            Verify the latest Resume.io details.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Resume.io UK pricing", "https://resume.io/uk/pricing"],
              ["Resume.io cancellation form", "https://resume.io/contact/cancel-subscription"],
              ["Resume.io cancellation help", "https://help.resume.io/en/articles/3784896"],
              ["Resume.io billing help", "https://help.resume.io/en/articles/3888960"],
              ["Resume.io UK contact", "https://resume.io/uk/contact"],
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

      <FaqSection faqs={faqItems} title="Questions about cancelling Resume.io." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
