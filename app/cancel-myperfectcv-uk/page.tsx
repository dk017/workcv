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
  title: "How to Cancel MyPerfectCV UK - Step by Step",
  description:
    "Step-by-step guide to cancelling your MyPerfectCV subscription in the UK. Stop automatic renewals, keep proof, and compare a no-subscription CV builder.",
  alternates: {
    canonical: "/cancel-myperfectcv-uk",
  },
  openGraph: {
    title: "How to Cancel MyPerfectCV UK - WorkCV",
    description:
      "Current UK cancellation steps for MyPerfectCV, including official support routes, confirmation checks, and what to do if payments continue.",
    url: "/cancel-myperfectcv-uk",
  },
};

const officialLinks = [
  {
    label: "MyPerfectCV pricing",
    href: "https://www.myperfectcv.co.uk/pricing",
  },
  {
    label: "MyPerfectCV FAQ",
    href: "https://www.myperfectcv.co.uk/faq",
  },
  {
    label: "MyPerfectCV contact page",
    href: "https://www.myperfectcv.co.uk/contact-us",
  },
  {
    label: "MyPerfectCV terms",
    href: "https://www.myperfectcv.co.uk/terms-of-use",
  },
  {
    label: "FCA recurring card payment guidance",
    href: "https://www.fca.org.uk/consumers/recurring-card-payments",
  },
];

const cancellationSteps = [
  {
    title: "Sign in to your MyPerfectCV account",
    body: "Go to the MyPerfectCV sign-in page and log in with the email address used for the subscription. If you cannot remember the password, use the password reset flow first.",
  },
  {
    title: "Open account or subscription settings",
    body: "MyPerfectCV's terms refer to cancellation through My accounts and My settings. Look for subscription, billing, plan, or cancellation options in that area.",
  },
  {
    title: "Use the online cancellation option if it is available",
    body: "Follow the cancellation prompts carefully and do not leave the page until the cancellation flow is complete.",
  },
  {
    title: "Contact MyPerfectCV support if needed",
    body: "MyPerfectCV's FAQ says you can cancel by contacting its team. The UK phone number listed is 0808 189 0676, and the FAQ lists customerservice@myperfectcv.co.uk.",
  },
  {
    title: "Keep the cancellation confirmation",
    body: "MyPerfectCV's terms say they send an email with a cancellation reference. Save that email, and check your spam or junk folder if it does not arrive.",
  },
  {
    title: "Check your next bank or card statement",
    body: "Look for billing descriptors such as MYPERFECTCV.CO.UK, BLD*MYPERFECTCV.CO.UK, or PayPal *MPCVUK, which MyPerfectCV lists on its contact page.",
  },
];

const supportOptions = [
  {
    title: "Phone",
    body: "0808 189 0676. MyPerfectCV lists UK support as Monday to Sunday, 09:00 to 21:00.",
    icon: Phone,
  },
  {
    title: "Email",
    body: "customerservice@myperfectcv.co.uk is listed in the cancellation FAQ. Include your account email and a clear cancellation request.",
    icon: Mail,
  },
  {
    title: "Contact form",
    body: "Use the official contact page if you prefer a web form. Keep a copy or screenshot of the message you send.",
    icon: FileCheck,
  },
];

const faqItems = [
  {
    question: "How do I cancel MyPerfectCV in the UK?",
    answer:
      "Start by logging into your MyPerfectCV account and checking My accounts or My settings for cancellation options. MyPerfectCV also says you can cancel by contacting support on 0808 189 0676 or by email at customerservice@myperfectcv.co.uk.",
  },
  {
    question: "How much does MyPerfectCV cost after the trial?",
    answer:
      "On the official pricing page checked 13 June 2026, MyPerfectCV listed Premium - 14 days at GBP 2.95, then automatic renewal at GBP 16.95 charged every 4 weeks.",
  },
  {
    question: "What proof should I keep after cancelling?",
    answer:
      "Keep the cancellation confirmation email, cancellation reference, support ticket, chat transcript, call notes, and any screenshots from your account settings. MyPerfectCV's terms say a cancellation reference is sent by email.",
  },
  {
    question: "What if MyPerfectCV charges me after I cancel?",
    answer:
      "First contact MyPerfectCV with your cancellation reference. If a recurring card payment continues after you have cancelled it, FCA guidance says you can also contact your card issuer about stopping future payments and disputing unauthorised payments.",
  },
  {
    question: "Can I still access my CV after cancelling MyPerfectCV?",
    answer:
      "MyPerfectCV's FAQ says that after cancellation documents are stored in your account, but you will not be able to download, email, or print them without an active plan.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Cancel MyPerfectCV UK",
  description:
    "Step-by-step guide to cancelling a MyPerfectCV UK subscription and stopping automatic renewal.",
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

export default function CancelMyPerfectCvUkPage() {
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
            <span className="text-navy">Cancel MyPerfectCV UK</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Cancel MyPerfectCV UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                How to cancel MyPerfectCV in the UK.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                MyPerfectCV currently lists a 14-day premium plan at GBP 2.95,
                followed by automatic renewal at GBP 16.95 every 4 weeks. This
                guide shows the official cancellation routes and what to check
                after cancelling.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "Official support routes included",
                  "Checked 13 June 2026",
                  "Confirmation checklist",
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
                {supportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.title} className="rounded-xl border border-line bg-paper p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-success" />
                        <h3 className="font-bold text-navy">{option.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{option.body}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm leading-6 text-muted">
                Use the official MyPerfectCV pages for the latest process before
                relying on any third-party cancellation guide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Cancel before renewal",
            "Save the reference email",
            "Check billing descriptors",
            "Keep support evidence",
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
              Cancel first, then verify it actually stopped.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              MyPerfectCV says cancellation can be handled through support, and
              its terms also refer to an online cancellation page inside account
              settings. The safest approach is to complete the online flow if
              available, then keep written proof.
            </p>
            <div className="mt-7 rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                This guide is based on public MyPerfectCV pages checked{" "}
                {checkedDate}. MyPerfectCV can change its account screens,
                support channels, pricing, and cancellation process.
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
              Know the UK recurring card payment fallback.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              If you paid by debit or credit card and cannot stop a recurring
              payment through MyPerfectCV, FCA guidance says you can ask your
              card issuer to cancel the recurring card payment. Where possible,
              still tell MyPerfectCV that you are cancelling so the contract
              position is clear.
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
                "Date and time you cancelled",
                "Cancellation reference email",
                "Account email used for MyPerfectCV",
                "Support ticket or contact form copy",
                "Name of any support agent you spoke to",
                "Bank statement descriptor and payment date",
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
                Want a CV builder with nothing to cancel?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Many people cancelling a trial-to-renewal CV tool only need one
                finished CV. WorkCV is built for that use case: build first,
                then pay {site.price} when you download your PDF.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-2 bg-navy px-5 py-4 text-sm font-bold text-white">
                <span>MyPerfectCV</span>
                <span>WorkCV</span>
              </div>
              {[
                ["GBP 2.95 for 14 days", "Free to build"],
                ["Renews at GBP 16.95 every 4 weeks", "GBP 4.99 PDF download"],
                ["Subscription cancellation needed", "No monthly subscription"],
                ["PDF download needs premium access", "PDF download paid once"],
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
            Verify the latest details before you act.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <span className="font-bold">{link.label}</span>
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

      <FaqSection faqs={faqItems} title="Questions about cancelling MyPerfectCV." />
      <FinalCta
        heading="Build your next CV without a renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
