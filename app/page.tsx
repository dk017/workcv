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
import { buildLoginHref } from "@/lib/safe-redirect";
import { site } from "@/lib/site";
import { analyticsPlacements } from "@/lib/analytics-placements";

const startHref = buildLoginHref("/editor");

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
      "Yes. WorkCV asks for a one-time email code first so your CV can be saved, reopened, and connected to the PDF you unlock. There is no password and no payment until download.",
  },
  {
    question: "Is the format right for UK jobs?",
    answer:
      "Yes. The structure is designed around UK CV expectations, with a clear layout and practical section order.",
  },
  {
    question: "Can I edit my CV later?",
    answer:
      "Yes. Return to the same saved CV, edit it, and download the updated PDF without paying again. A separate new CV has its own one-time unlock.",
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
                `Pay ${site.price} once at download`,
                "Email code first, then build free",
                "Edit and redownload without paying again",
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
              <ButtonLink href={startHref} trackingLabel={analyticsPlacements.homeHeroEditor}>Start free with email code</ButtonLink>
              <ButtonLink href="/samples/chatgpt-cv-alex-morgan.pdf" variant="secondary" trackingLabel={analyticsPlacements.homeSamplePdf}>See a sample PDF</ButtonLink>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
              One-time email code first · No payment until download
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">The sample uses fictional details and opens free, without signing in.</p>
          </div>
          <CvPreview />
        </div>
      </section>

      <TrustStrip />
      <section aria-labelledby="starting-point-heading" className="border-b border-line bg-surface py-16">
        <div className="container-page">
          <SectionLabel>Your starting point</SectionLabel>
          <h2 id="starting-point-heading" className="max-w-3xl font-display text-3xl font-semibold text-navy md:text-4xl">What do you need help with today?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">Try a free tool or follow a worked example before creating an account. Choose the route that matches what you already have.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "I have a CV and a job in mind",
                body: "Compare your real experience with the job advert. Review suggested bullets, missing evidence and a cover-letter draft before taking selected content into the editor.",
                detail: "Have your CV text and the job advert ready. The free tool uses AI; check every suggestion.",
                href: "/tools/job-application-pack-uk",
                label: "Match my CV to a job",
                placement: analyticsPlacements.homeExistingCv,
              },
              {
                title: "I am writing my first CV",
                body: "Use education, projects, volunteering and responsibilities to build a starting draft, even if you have never had a paid job.",
                detail: "Bring real examples of what you have done. No invented jobs or achievements needed.",
                href: "/tools/first-job-cv-wizard-uk",
                label: "Start my first-CV draft",
                placement: analyticsPlacements.homeFirstCv,
              },
              {
                title: "I have an AI-written draft",
                body: "Follow a complete example from checked text to a formatted PDF. Learn how to enter text by section or import a saved PDF or DOCX in the editor.",
                detail: "This is a step-by-step guide, not a connection to your ChatGPT account.",
                href: "/chatgpt-cv-to-pdf-uk",
                label: "See how to format my draft",
                placement: analyticsPlacements.homeAiDraft,
              },
            ].map((route) => (
              <article key={route.href} className="flex min-w-0 flex-col rounded-xl border border-line bg-paper p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">{route.title}</h3>
                <p className="mt-4 leading-7 text-muted">{route.body}</p>
                <p className="mb-6 mt-3 text-sm leading-6 text-muted">{route.detail}</p>
                <div className="mt-auto"><ButtonLink href={route.href} variant="secondary" trackingLabel={route.placement}>{route.label}</ButtonLink></div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted">These starting routes are free to access. Saving a CV in the editor requires an email code; your finished editor PDF costs {site.price} per saved CV, with no subscription. <Link href="/pricing" className="font-bold text-navy underline underline-offset-4">See exactly what the payment includes</Link>.</p>
        </div>
      </section>
      <TransformationSection />

      <section className="border-y border-line bg-surface py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionLabel>Edit your CV anytime</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              One payment keeps this saved CV unlocked.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-muted">
              Jobs change and your CV should change with them. After you unlock
              a saved CV, return to it, update your experience or skills, and
              download the revised PDF without paying again. A separate new CV
              has its own one-time unlock.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              See the full pricing breakdown
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A simpler route from blank page to finished CV.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "Verify your email",
                "Start with a one-time code so your CV is saved safely. No password and no payment at this stage.",
              ],
              [
                "Build and preview",
                "Add your profile, work history, education, and skills in a guided editor built for UK CVs.",
              ],
              [
                "Download when ready",
                `Check every page, then pay ${site.price} once to unlock this saved CV as a PDF.`,
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
              <ButtonLink href="/templates" variant="secondary" trackingLabel={analyticsPlacements.homeTemplates}>
                See templates
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Professional",
                body: "For experienced applicants who need a clear profile, recent roles, and measurable achievements.",
              },
              {
                name: "Early career",
                body: "For graduates and career starters balancing education, projects, placements, and first roles.",
              },
              {
                name: "Student",
                body: "For part-time work, societies, coursework, and transferable skills without overcomplicating the layout.",
              },
              {
                name: "No experience",
                body: "For first-job applications where education, volunteering, personal projects, and skills need more space.",
              },
            ].map(({ name, body }) => (
              <Link
                key={name}
                href="/templates"
                className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1"
              >
                <FileText className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {body}
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

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Popular guides &amp; examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Start with the guidance closest to your application.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ["UK CV examples", "/cv-examples-uk"],
              ["How to write a CV", "/how-to-write-a-cv-uk"],
              ["ATS CV template", "/ats-cv-template-uk"],
              ["Professional CV template", "/professional-cv-template-uk"],
              ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
              ["Compare UK CV builders", "/best-cv-builder-uk"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-line bg-white p-5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:border-navy"
              >
                {label}
                <span className="mt-4 block text-gold">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={homepageFaqs} title="Common questions before you start." />
      <FinalCta
        heading="Your next application deserves a CV that feels ready."
        body="Bring your experience. WorkCV helps you shape it into a clear, professional UK CV you can update and use again."
        primaryHref={startHref}
        trackingContext={analyticsPlacements.homeFinal}
        primary="Start free with email code"
        secondaryHref={null}
        secondary={null}
      />
    </>
  );
}
