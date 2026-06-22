import type { Metadata } from "next";
import Link from "next/link";
import { Check, FileText, ShieldCheck } from "lucide-react";

import {
  ButtonLink,
  CvPreview,
  FaqSection,
  FinalCta,
  TransformationSection,
  SectionLabel,
  TrustStrip,
} from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Turn Your Experience into a Professional UK CV",
  description:
    "Add your experience in your own words, organise it with guided UK CV sections, preview every page, and download a professional CV when it is ready.",
};

const homepageFaqs = [
  {
    question: "How much does WorkCV cost?",
    answer: `You can build your CV free. You pay ${site.price} when you download the final PDF.`,
  },
  {
    question: "Is WorkCV a subscription?",
    answer:
      "No. WorkCV does not use a monthly subscription for the standard CV download flow. You pay once when you want the finished PDF.",
  },
  {
    question: "Do I need to log in before using the editor?",
    answer:
      "Yes. WorkCV asks you to log in with a one-time email code before the editor so your CV can be saved and reopened later. There is no password to remember.",
  },
  {
    question: "Is the format right for UK jobs?",
    answer:
      "Yes. The structure is designed around UK CV expectations, with a clear layout and practical section order.",
  },
  {
    question: "Can I edit my CV later?",
    answer:
      "Yes. The product flow is designed so you can return to the same CV, update it, and work on it again later.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-success/30 bg-greensoft px-4 py-2 text-xs font-bold text-navy sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
              No subscription · Pay once · Download instantly
            </div>
            <h1 className="max-w-[22rem] font-display text-4xl font-semibold leading-[1.02] text-navy sm:max-w-3xl sm:text-5xl md:text-7xl">
              Turn what you’ve done into a CV worth sending.
            </h1>
            <p className="mt-7 max-w-[22rem] text-lg leading-8 text-muted sm:max-w-2xl sm:text-xl">
              Add your experience in your own words. WorkCV gives it a clear,
              professional UK structure you can preview, refine, and use with
              confidence.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-3">
              {[
                `Pay ${site.price} once — no monthly subscription`,
                "Build and preview before paying",
                "Download as soon as payment is confirmed",
              ].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    {item}
                  </div>
                )
              )}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Create my CV</ButtonLink>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
              Price shown upfront · No automatic renewal
            </p>
          </div>
          <CvPreview />
        </div>
      </section>

      <TrustStrip />
      <TransformationSection />

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A simpler route from blank page to finished CV.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "Fill in your details",
                "Add your profile, work history, education, and skills in a guided editor built for UK CVs.",
              ],
              [
                "Choose a clean template",
                "Pick a practical layout that keeps your CV readable, structured, and easy to tailor for real applications.",
              ],
              [
                "Use it when you are ready",
                "Check every page, unlock the finished PDF, and use it for applications without rebuilding the layout elsewhere.",
              ],
            ].map(([title, body], index) => (
              <div key={title} className="rounded-xl border border-line bg-paper p-6">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-navy font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
                <p className="mt-4 leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionLabel>Templates</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Clean templates for UK job applications.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              WorkCV templates are designed to feel practical rather than flashy.
              The goal is simple: help recruiters scan your experience quickly
              and help you send a CV that feels professional without manual
              formatting work.
            </p>
            <div className="mt-8">
              <ButtonLink href="/templates" variant="secondary">
                See templates
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Professional", "Early career", "Student", "No experience"].map((name) => (
              <Link
                key={name}
                href="/templates"
                className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1"
              >
                <FileText className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Practical spacing, clear section order, and UK-friendly defaults.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Built for the UK</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Built around how UK CVs are expected to work.
            </h2>
            <div>
              <p className="text-lg leading-8 text-muted">
                UK CVs do not need the extra noise many people copy from other
                markets. WorkCV keeps the structure focused on what employers
                actually expect: clear contact details, a direct introduction,
                recent experience first, and a clean PDF you can use in real
                applications.
              </p>
              <ul className="mt-7 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
                {[
                  "No photo-first assumptions",
                  "No date of birth or nationality in the standard CV flow",
                  "Flexible for school leavers, students, and experienced applicants",
                  "Clear PDF output for job applications",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={homepageFaqs} title="Common questions before you start." />
      <FinalCta
        heading="Your next application deserves a CV that feels ready."
        body="Bring your experience. WorkCV helps you shape it into a clear, professional UK CV you can update and use again."
        primary="Create my CV"
        secondaryHref={null}
        secondary={null}
      />
    </>
  );
}
