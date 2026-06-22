import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileText,
  LogIn,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import {
  ButtonLink,
  CvPreview,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Resume Builder UK No Subscription - ${site.price} PDF`,
  description:
    `Build a UK resume or CV without a monthly subscription. Log in by email code, build and preview free, then pay ${site.price} to unlock your saved CV PDF.`,
  alternates: {
    canonical: "/resume-builder-uk-no-subscription",
  },
  openGraph: {
    title: "Resume Builder UK Without a Subscription - WorkCV",
    description:
      `Create the document UK employers usually call a CV. Build and preview first, then pay ${site.price} to unlock the saved CV with no automatic renewal.`,
    url: "/resume-builder-uk-no-subscription",
  },
};

const steps = [
  {
    title: "Log in by email code",
    body:
      "WorkCV requires an email-code login before the editor opens. This connects the CV to your account so it can be saved and reopened.",
    icon: LogIn,
  },
  {
    title: "Build and preview before paying",
    body:
      "Add your own profile, experience, education and skills. You can switch templates and inspect the live preview before checkout.",
    icon: FileText,
  },
  {
    title: `Pay ${site.price} for the saved CV`,
    body:
      "Payment unlocks PDF access for that saved CV. The checkout is not a monthly membership and does not start automatic renewal.",
    icon: WalletCards,
  },
  {
    title: "Edit and reopen the same CV",
    body:
      "Because access is linked to the saved CV, you can return to that document, make corrections and download its updated PDF without starting a subscription.",
    icon: RefreshCcw,
  },
];

const terminologyRows = [
  [
    "What should I call it?",
    "For most UK job applications, use the employer's wording. UK careers guidance normally calls the document a CV.",
  ],
  [
    "What if the advert says resume?",
    "You can still use WorkCV. Check whether the employer wants a standard UK CV, a shorter resume, or a specific application form before submitting.",
  ],
  [
    "Does the filename matter?",
    "Use a clear filename such as Priya-Shah-CV.pdf unless the application instructions specify a naming format.",
  ],
  [
    "Should I create both?",
    "Not automatically. Start with the document requested by the employer and tailor it to that role rather than maintaining duplicate generic versions.",
  ],
];

const included = [
  "Email-code login and saved CV access",
  "Profile, experience, education and skills sections",
  "Classic, modern and compact CV layouts",
  "Live document preview before checkout",
  "Import support for an existing PDF or DOCX CV",
  `${site.price} unlock for the selected saved CV`,
  "No monthly WorkCV subscription",
  "No automatic renewal or cancellation step",
];

const notIncluded = [
  "A completely free PDF download",
  "A cover-letter builder in the current version",
  "A promise of interviews, ATS scores or employer approval",
  "Writing or verifying your experience for you",
  "A subscription to ongoing career tools",
];

const cvSections = [
  [
    "Contact details",
    "Name, phone number, professional email, location and a relevant LinkedIn or portfolio link where useful.",
  ],
  [
    "Introduction",
    "A short profile focused on the target role, relevant experience and evidence you can support elsewhere in the CV.",
  ],
  [
    "Work history",
    "Recent roles first for experienced candidates, with clear dates, employers and specific responsibilities or achievements.",
  ],
  [
    "Education",
    "Qualifications and relevant training. Early-career applicants may place this before work history when it is stronger evidence.",
  ],
  [
    "Skills",
    "Concrete skills matched to the advert and supported by work, study, projects, volunteering or training.",
  ],
  [
    "References",
    "State that references are available on request rather than publishing someone else's contact details on a general CV.",
  ],
];

const fitRows = [
  [
    "WorkCV may fit",
    "You need one focused UK CV, want to preview it before paying, and do not want recurring CV-builder billing.",
  ],
  [
    "A subscription platform may fit",
    "You want ongoing access to cover letters, application tracking, coaching, repeated document types or a larger career toolkit.",
  ],
  [
    "A free document editor may fit",
    "You are comfortable creating the structure yourself and need a completely free file rather than a guided CV product.",
  ],
];

const faqItems = [
  {
    question: "Is WorkCV a resume builder or a CV builder?",
    answer:
      "WorkCV is a UK CV builder. People who search for a UK resume builder can use the same editor, but should follow the terminology and document requirements in the employer's advert.",
  },
  {
    question: "Can I use WorkCV without a subscription?",
    answer:
      `Yes. WorkCV does not use a monthly subscription for its standard CV flow. You build and preview first, then pay ${site.price} to unlock PDF access for the selected saved CV.`,
  },
  {
    question: "Is the WorkCV resume builder completely free?",
    answer:
      `No. Building and previewing are free before checkout, but PDF access for the saved CV costs ${site.price}. The price is shown before payment.`,
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. You log in using a code sent to your email address. Login lets WorkCV save the CV and reconnect it to its payment status.",
  },
  {
    question: "What does one payment unlock?",
    answer:
      "The payment unlocks PDF access for the saved CV used at checkout. It is not a site-wide subscription or an automatic renewal plan.",
  },
  {
    question: "Can I edit the CV after payment?",
    answer:
      "Yes. The payment status is linked to that saved CV, so you can reopen it, correct the content and download the updated version without beginning a monthly subscription.",
  },
  {
    question: "Does WorkCV guarantee that my resume will pass an ATS?",
    answer:
      "No. WorkCV provides clear layouts and standard sections, but no builder can guarantee parsing, ranking, interviews or employer decisions. Tailor truthful evidence to each advert.",
  },
];

const relatedLinks = [
  ["CV vs resume UK", "/cv-vs-resume-uk"],
  ["UK resume template", "/resume-template-uk"],
  ["CV builder without subscription", "/cv-builder-no-subscription-uk"],
  ["Compare CV builder pricing", "/pricing"],
  ["Professional CV template UK", "/professional-cv-template-uk"],
  ["How to write a CV UK", "/how-to-write-a-cv-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["See all CV templates", "/templates"],
];

const productSchema = buildWorkCvProductSchema({
  description:
    `UK CV and resume builder with saved documents, a ${site.price} PDF unlock and no monthly subscription in the standard CV flow.`,
  url: `${site.url}/resume-builder-uk-no-subscription`,
});

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

export default function ResumeBuilderUkNoSubscriptionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Resume builder UK — no subscription
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build the CV UK employers ask for, without monthly billing.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Searched for a UK resume builder? WorkCV helps you create the
              document usually called a CV in UK applications. Log in by email
              code, build and preview first, then pay {site.price} to unlock the
              selected saved CV PDF.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Build and preview before payment",
                `${site.price} for the saved CV`,
                "No monthly subscription",
                "No automatic renewal",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my UK CV</ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary">
                See exactly how payment works
              </ButtonLink>
            </div>
          </div>
          <CvPreview />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Email-code login",
            "Saved CV editor",
            `${site.price} PDF unlock`,
            "Nothing renews",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
              <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Exact product flow</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Know what happens before entering the editor.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            “No subscription” does not mean “no payment” or “no account.” These
            are the four steps in the current WorkCV flow.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-xl border border-line bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-7 w-7 text-gold" />
                    <span className="text-sm font-bold text-muted">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Resume or CV?</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Follow the employer's language, not a generic internet rule.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              UK careers services normally describe this document as a CV. An
              international company may say resume instead. Read the advert and
              application instructions before deciding what to submit.
            </p>
          </div>
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {terminologyRows.map(([question, answer]) => (
              <div key={question} className="grid gap-3 p-5 sm:grid-cols-[190px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{question}</h3>
                <p className="text-sm leading-7 text-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-navy bg-white p-7 shadow-sm">
            <FileCheck2 className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Included in the current product
            </h2>
            <ul className="mt-6 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-paper p-7">
            <ShieldCheck className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Not included or promised
            </h2>
            <ul className="mt-6 space-y-4">
              {notIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>UK CV structure</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Build around the sections UK guidance expects.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                National Careers Service guidance covers contact details, an
                introduction, education, work history and references. WorkCV
                adds a dedicated skills field and lets you order the evidence
                around your career stage.
              </p>
              <a
                href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              >
                Read official CV guidance
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {cvSections.map(([title, body]) => (
                <article key={title} className="rounded-xl border border-line bg-white p-5">
                  <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Choose the right tool</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            No-subscription is useful only when the narrower product fits.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {fitRows.map(([title, body], index) => (
              <article
                key={title}
                className={`rounded-xl p-6 ${
                  index === 0
                    ? "border-2 border-navy bg-white shadow-sm"
                    : "border border-line bg-paper"
                }`}
              >
                <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Related resources</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy transition hover:-translate-y-1 hover:border-navy"
              >
                <span className="font-bold">{label}</span>
                <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="Questions about UK resume builders without subscriptions." />
      <FinalCta
        heading="Build the CV first. Pay only when this saved CV is ready."
        body={`Log in by email code, create and preview your CV, then pay ${site.price} to unlock its PDF. No monthly subscription and no automatic renewal.`}
        primaryHref="/editor"
        primary="Build my UK CV"
        secondaryHref="/pricing"
        secondary="Check pricing details"
      />
    </>
  );
}
