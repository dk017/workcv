import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { ExampleLibrary } from "@/components/home/example-library";
import { HeroVisual } from "@/components/home/hero-visual";
import { StickyStartBar } from "@/components/home/sticky-start-bar";
import { passStartHref } from "@/components/pass-offer";
import { PassOfferView } from "@/components/pass-offer-view";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { buildLoginHref } from "@/lib/safe-redirect";
import { founder, site } from "@/lib/site";

const startHref = buildLoginHref("/editor");

export const metadata: Metadata = {
  title: "Turn Your Experience into a Professional UK CV",
  description:
    `Build and preview a professional UK CV and matching cover letter. Pay ${site.price} once for PDF and Word downloads. No subscription.`,
};

const homepageFaqs = [
  {
    question: "How much does WorkCV cost?",
    answer: `Build and preview free. Pay ${site.price} once for one saved CV and its matching cover letter, each as PDF and editable Word. Edits and redownloads of that saved CV and letter are included; a separate new CV needs its own payment.`,
  },
  {
    question: "Is WorkCV a subscription?",
    answer:
      "No. Pay once to unlock your saved CV and matching cover letter as PDF and Word. There is no automatic renewal.",
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
      "Yes. Return to the same saved CV, edit it and its matching cover letter, and download updated PDF and Word files without paying again. A separate new CV has its own one-time unlock.",
  },
];

const facts = ["CV and cover letter together", "PDF and editable Word", "Built for UK CV conventions", "Nothing to cancel, ever"];

const startingRoutes = [
  { label: "I have a CV and a job in mind", href: "/tools/job-application-pack-uk", placement: analyticsPlacements.homeExistingCv },
  { label: "I’m writing my first CV", href: "/tools/first-job-cv-wizard-uk", placement: analyticsPlacements.homeFirstCv },
  { label: "I have an AI-written draft", href: "/chatgpt-cv-to-pdf-uk", placement: analyticsPlacements.homeAiDraft },
];

const features = [
  { title: "A copy for every job", body: "Keep your main CV safe and tailor a separate version for each advert, all saved in My CVs." },
  { title: "See what the advert asks for", body: "Free ATS keyword check against any job advert, with honest suggestions you approve one by one.", link: { label: "Try the ATS checker", href: "/tools/ats-score-checker" } },
  { title: "Check visa sponsors", body: "Applying from abroad? See if an employer is on the Home Office sponsor register before you apply.", link: { label: "Check a sponsor", href: "/tools/uk-visa-sponsor-checker" } },
  { title: "A letter that matches", body: "Every CV comes with a cover letter in the same style, ready for the employer’s name." },
];

const guides = [
  ["UK CV examples", "/cv-examples-uk"],
  ["How to write a CV", "/how-to-write-a-cv-uk"],
  ["ATS CV template", "/ats-cv-template-uk"],
  ["Professional CV template", "/professional-cv-template-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
  ["Compare UK CV builders", "/best-cv-builder-uk"],
];

const primaryButton =
  "inline-flex min-h-[52px] items-center justify-center rounded-lg bg-navy px-6 font-bold text-white transition hover:bg-navy-hover";
const secondaryButton =
  "inline-flex min-h-[52px] items-center justify-center rounded-lg border border-line-strong bg-white px-6 font-bold text-navy transition hover:border-navy";
const sectionHeading = "font-display text-[1.625rem] font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.5rem]";

export default function HomePage() {
  const initials = founder.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="bg-white">
      <section className="container-page grid items-center gap-10 py-8 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-20">
        <div className="min-w-0 max-w-xl">
          <p className="mb-4 inline-flex rounded-full bg-gold-tint px-3.5 py-1.5 text-sm font-bold text-navy sm:mb-5">
            UK CV builder · No subscription
          </p>
          <h1 className="font-display text-[2.125rem] font-extrabold leading-[1.08] text-navy sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            A UK CV you’re proud to send, tailored to every job.
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted sm:mt-6 sm:text-xl">
            Write your experience in your own words. WorkCV shapes it into a clear UK CV and matching cover letter,
            then helps you tailor a copy to each advert.
          </p>
          <div id="home-hero-actions" className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <TrackedLink href={startHref} placement={analyticsPlacements.homeHeroEditor} className={primaryButton}>
              Build my CV free
            </TrackedLink>
            <TrackedLink
              href="/samples/workcv-customer-service-cv-example.pdf"
              placement={analyticsPlacements.homeSamplePdf}
              className={secondaryButton}
            >
              See a sample CV
            </TrackedLink>
          </div>
          <p className="mt-3 text-center text-sm text-muted sm:mt-4 sm:text-left sm:text-[0.9375rem]">
            Free to build and preview. {site.price} once to download.
          </p>
        </div>
        <HeroVisual />
      </section>

      <section aria-label="What you get" className="mt-6 border-y border-line bg-paper lg:mt-0">
        <ul className="container-page grid gap-3 py-5 font-bold text-navy sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <li key={fact} className="flex items-center gap-2.5">
              <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-success" />
              {fact}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-14 sm:py-20 lg:py-24">
        <h2 className={`max-w-2xl ${sectionHeading}`}>Three steps from blank page to finished CV</h2>
        <ol className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-3 md:gap-6">
          <li className="flex flex-col gap-3.5">
            <div aria-hidden="true" className="hidden h-[170px] flex-col gap-2.5 rounded-2xl bg-sand p-5 md:flex">
              <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-muted">
                <span className="block text-[11px] font-bold text-navy">Job title</span>Customer Service Adviser
              </div>
              <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-muted">
                <span className="block text-[11px] font-bold text-navy">What did you do there?</span>Handled 45 to 60 enquiries…
              </div>
            </div>
            <h3 className="text-lg font-bold text-navy">1. Add your experience</h3>
            <p className="leading-relaxed text-muted">
              One section at a time, in your own words, with examples for your kind of job. Or upload the CV you already have.
            </p>
          </li>
          <li className="flex flex-col gap-3.5">
            <div aria-hidden="true" className="hidden h-[170px] flex-col justify-center gap-2.5 rounded-2xl bg-greensoft p-5 md:flex">
              <p className="text-sm leading-snug text-ink">
                The advert asks for <strong>CRM reporting</strong>. Is it part of your experience?
              </p>
              <div className="flex gap-2 text-xs font-bold">
                <span className="rounded-md bg-navy px-3 py-1.5 text-white">Yes, add a bullet</span>
                <span className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-navy">Skip</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-navy">2. Tailor it to the job</h3>
            <p className="leading-relaxed text-muted">
              Paste an advert and WorkCV makes a separate copy, then walks you through what the employer asks for. You only
              add what you’ve really done.
            </p>
          </li>
          <li className="flex flex-col gap-3.5">
            <div aria-hidden="true" className="hidden h-[170px] items-center justify-center gap-3.5 rounded-2xl bg-gold-tint p-5 md:flex">
              <span className="grid h-[92px] w-[74px] place-items-center rounded-md bg-white font-extrabold text-red-700 shadow-[0_6px_16px_rgba(15,41,66,0.12)]">PDF</span>
              <span className="grid h-[92px] w-[74px] place-items-center rounded-md bg-white font-extrabold text-blue-700 shadow-[0_6px_16px_rgba(15,41,66,0.12)]">Word</span>
            </div>
            <h3 className="text-lg font-bold text-navy">3. Download and apply</h3>
            <p className="leading-relaxed text-muted">
              Check every page first. Then download your CV and matching cover letter as PDF and Word.
            </p>
          </li>
        </ol>
        <nav
          aria-label="Other starting points"
          className="mt-8 flex flex-col rounded-2xl border border-line bg-paper px-4 py-3 sm:mt-10 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:px-6"
        >
          <p className="py-2 font-bold text-navy">Starting from somewhere else?</p>
          {startingRoutes.map((route) => (
            <TrackedLink
              key={route.href}
              href={route.href}
              placement={route.placement}
              className="flex min-h-11 items-center justify-between gap-2 border-t border-line font-bold text-navy underline-offset-4 hover:underline md:border-0 md:underline"
            >
              {route.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </TrackedLink>
          ))}
        </nav>
      </section>

      <section className="bg-navy text-white">
        <div className="container-page py-14 sm:py-20 lg:py-24">
          <h2 className="max-w-2xl font-display text-[1.625rem] font-extrabold leading-tight sm:text-4xl lg:text-[2.5rem]">
            Everything you need to apply, in one place
          </h2>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="flex flex-col gap-2.5 rounded-2xl bg-navy-hover p-5 sm:p-6">
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="leading-relaxed text-[#D6DEE6]">{feature.body}</p>
                {feature.link && (
                  <Link href={feature.link.href} className="mt-auto inline-flex min-h-11 items-center gap-1.5 font-bold text-gold-tint underline-offset-4 hover:underline">
                    {feature.link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" aria-labelledby="examples-heading" className="container-page py-14 sm:py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="examples-heading" className={sectionHeading}>CV examples for real UK jobs</h2>
            <p className="mt-3 leading-relaxed text-muted sm:text-lg">
              Each one is a complete CV in a WorkCV template. Open the closest to your job and make it yours.
            </p>
          </div>
          <TrackedLink
            href="/cv-examples-uk"
            placement={analyticsPlacements.homeExamplesAll}
            className="hidden min-h-11 items-center gap-1.5 font-bold text-navy underline-offset-4 hover:underline sm:inline-flex"
          >
            See all CV examples
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </TrackedLink>
        </div>
        <ExampleLibrary />
        <TrackedLink
          href="/cv-examples-uk"
          placement={analyticsPlacements.homeExamplesAll}
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-navy sm:hidden"
        >
          See all CV examples
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </TrackedLink>
        <p className="mt-6 leading-relaxed text-muted">
          <strong className="text-navy">Three templates:</strong> Classic, Modern and Compact. Switch at any time in the
          editor; your words stay the same.{" "}
          <TrackedLink
            href="/templates"
            placement={analyticsPlacements.homeTemplates}
            className="font-bold text-navy underline underline-offset-4"
          >
            Compare templates
          </TrackedLink>
        </p>
      </section>

      <section id="pricing" aria-labelledby="pricing-heading" className="border-t border-line bg-paper">
        <div className="container-page max-w-4xl py-14 sm:py-20 lg:py-24">
          <h2 id="pricing-heading" className={`${sectionHeading} sm:text-center`}>Pay once. Nothing to cancel.</h2>
          <p className="mt-3 text-muted sm:text-center sm:text-lg">Build and preview for free. Choose when you’re ready to download.</p>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 md:gap-5">
            <article className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 sm:p-7">
              <h3 className="text-lg font-bold text-navy">One CV</h3>
              <p className="font-display text-[1.875rem] font-extrabold text-navy sm:text-[2.75rem]">
                {site.price} <span className="font-sans text-base font-medium text-muted">once</span>
              </p>
              <p className="leading-relaxed text-muted">
                One CV and its matching cover letter, as PDF and Word. Edit and redownload them any time.
              </p>
              <TrackedLink
                href={buildLoginHref("/editor?plan=cv")}
                placement={analyticsPlacements.homeBundleMoney}
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-lg border border-navy font-bold text-navy transition hover:bg-paper"
              >
                Start with one CV
              </TrackedLink>
            </article>
            <article className="flex flex-col gap-3 rounded-2xl border-2 border-gold bg-white p-5 shadow-[0_20px_50px_rgba(15,41,66,0.10)] sm:p-7">
              <PassOfferView placement={analyticsPlacements.homePassStart}>
                <h3 className="flex flex-wrap items-center gap-2.5 text-lg font-bold text-navy">
                  Job Search Pass
                  <span className="rounded-full bg-gold-tint px-2.5 py-0.5 text-xs">Best for several jobs</span>
                </h3>
                <p className="mt-3 font-display text-[1.875rem] font-extrabold text-navy sm:text-[2.75rem]">
                  {site.passPrice} <span className="font-sans text-base font-medium text-muted">for {site.passDays} days</span>
                </p>
              </PassOfferView>
              <p className="leading-relaxed text-muted">
                Unlimited new CVs and letters for {site.passDays} days, so every application gets its own tailored copy.
                Never renews.
              </p>
              <TrackedLink
                href={passStartHref}
                placement={analyticsPlacements.homePassStart}
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-lg bg-navy font-bold text-white transition hover:bg-navy-hover"
              >
                Get the Job Search Pass
              </TrackedLink>
            </article>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            <TrackedLink
              href="/pricing"
              placement={analyticsPlacements.homePricingProof}
              className="font-bold text-navy underline underline-offset-4"
            >
              See exactly what each payment includes
            </TrackedLink>
          </p>
        </div>
      </section>

      <section aria-label="A note from the founder" className="container-page max-w-3xl pt-14 sm:pt-20">
        <figure className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:gap-5 sm:border-0 sm:bg-transparent sm:p-0">
          <span aria-hidden="true" className="hidden h-14 w-14 shrink-0 place-items-center rounded-full bg-navy text-lg font-extrabold text-gold sm:grid">
            {initials}
          </span>
          <div>
            <blockquote className="text-base leading-relaxed text-ink sm:text-[1.1875rem]">
              “Too many CV builders let you spend an hour on your CV, then ask for a subscription before you can download
              it. WorkCV does the opposite: you see every page first, pay once, and there is nothing to cancel.”
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted sm:text-[0.9375rem]">
              <strong className="text-navy">{founder.name}</strong>, {founder.role.toLowerCase()} of WorkCV ·{" "}
              <Link href="/about" className="font-bold text-navy underline underline-offset-4">About WorkCV</Link>
            </figcaption>
          </div>
        </figure>
      </section>

      <section aria-labelledby="guides-heading" className="container-page pt-12 sm:pt-16">
        <h2 id="guides-heading" className="font-display text-[1.375rem] font-extrabold text-navy sm:text-[1.75rem]">
          Popular guides and examples
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-6">
          {guides.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-[76px] items-end justify-between gap-2 rounded-xl border border-line p-3.5 text-sm font-bold leading-snug text-navy transition hover:border-navy sm:min-h-[96px] sm:flex-col sm:items-start sm:p-[18px] sm:text-[0.9375rem]"
            >
              {label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="container-page max-w-3xl py-14 sm:py-20">
        <h2 id="faq-heading" className="font-display text-[1.375rem] font-extrabold text-navy sm:text-[2rem]">
          Common questions before you start
        </h2>
        <div className="mt-4 border-t border-line sm:mt-5">
          {homepageFaqs.map((faq) => (
            <details key={faq.question} className="group border-b border-line py-4 sm:py-[18px]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy sm:text-[1.0625rem]">
                {faq.question}
                <span aria-hidden="true" className="text-xl text-navy transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2.5 leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="home-final-cta" className="bg-navy text-white">
        <div className="container-page flex flex-col gap-5 py-10 sm:py-16 md:flex-row md:items-center md:justify-between md:gap-6 lg:py-[72px]">
          <h2 className="max-w-2xl font-display text-[1.625rem] font-extrabold leading-tight sm:text-4xl">
            Your next application deserves a CV that feels ready.
          </h2>
          <TrackedLink
            href={startHref}
            placement={`${analyticsPlacements.homeFinal}_primary`}
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-lg bg-gold px-6 font-bold text-navy transition hover:bg-gold-tint"
          >
            Build my CV free
          </TrackedLink>
        </div>
      </section>

      <StickyStartBar href={startHref} heroId="home-hero-actions" endId="home-final-cta" />
    </div>
  );
}
