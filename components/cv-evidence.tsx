import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";

import { ButtonLink, SectionLabel } from "@/components/marketing";
import {
  evidenceRows,
  forgottenDetails,
  guidanceQuotes,
  recruiterQuotes,
  type EvidenceRow,
} from "@/lib/cv-evidence";
import { founder } from "@/lib/site";

const skimStudy = guidanceQuotes[0];

export function EvidenceContrastSection({
  rows = evidenceRows,
  label = "Why good CVs get skipped",
  heading = "Nobody rejects a CV for being ordinary. They just move on to the next one.",
  ctaHref,
  ctaLabel,
  trackingLabel,
}: {
  rows?: EvidenceRow[];
  label?: string;
  heading?: string;
  ctaHref?: string;
  ctaLabel?: string;
  trackingLabel?: string;
}) {
  return (
    <section aria-labelledby="evidence-heading" className="border-b border-line bg-surface py-20">
      <div className="container-page">
        <SectionLabel>{label}</SectionLabel>
        <h2 id="evidence-heading" className="max-w-4xl font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
          {heading}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          In one well-known eye-tracking study, recruiters spent an average of{" "}
          <a href={skimStudy.href} target="_blank" rel="noopener noreferrer" className="font-bold text-navy underline underline-offset-4">
            7.4 seconds
          </a>{" "}
          on a first skim. In those seconds, &ldquo;hard-working team player&rdquo; says nothing. A number, a result
          or a responsibility you really had says you can do the job.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-line">
          <div className="hidden grid-cols-[9rem_1fr_1.3fr] gap-6 border-b border-line bg-paper px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-muted md:grid">
            <span>Role</span>
            <span>What most CVs say</span>
            <span className="text-navy">What makes a hiring manager stop</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((row) => (
              <li key={row.role} className="grid gap-3 bg-white px-5 py-5 md:grid-cols-[9rem_1fr_1.3fr] md:items-center md:gap-6 md:px-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-navy md:text-sm md:normal-case md:tracking-normal">
                  {row.role}
                </span>
                <p className="flex items-start gap-2 text-base leading-7 text-muted">
                  <X className="mt-1.5 h-4 w-4 shrink-0 text-muted/70" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Generic: </span>
                    <span className="line-through decoration-muted/50">{row.safe}</span>
                  </span>
                </p>
                <p className="flex items-start gap-2 border-l-2 border-gold pl-3 text-base font-semibold leading-7 text-navy md:border-l-0 md:pl-0">
                  <Check className="mt-1.5 hidden h-4 w-4 shrink-0 text-success md:block" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Specific: </span>
                    {row.specific}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          Examples only. Use your own numbers, and only write what you could explain in an interview.
        </p>

        {ctaHref && ctaLabel ? (
          <div className="mt-8">
            <ButtonLink href={ctaHref} variant="secondary" trackingLabel={trackingLabel}>
              {ctaLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ForgottenDetailsSection({
  ctaHref,
  trackingLabel,
}: {
  ctaHref: string;
  trackingLabel?: string;
}) {
  return (
    <section aria-labelledby="forgotten-heading" className="quiet-grid border-b border-line bg-paper py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionLabel>Worth putting on your CV</SectionLabel>
          <h2 id="forgotten-heading" className="font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
            The ordinary things you did are often the proof a manager is looking for.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Most people leave these out because they were &ldquo;just part of the job&rdquo;. Add the ones that are
            true for you, with a number or an example where you can.
          </p>
          <div className="mt-8">
            <ButtonLink href={ctaHref} trackingLabel={trackingLabel}>
              Start free with email code
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Not sure how it should read?{" "}
            <Link href="/cv-examples-uk" className="font-bold text-navy underline underline-offset-4">
              See 11 UK CV examples
            </Link>
            .
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {forgottenDetails.map((detail) => (
            <li key={detail} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-base leading-7 text-ink">
              <Check className="mt-1 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GuidanceQuotesSection() {
  return (
    <section aria-labelledby="guidance-heading" className="bg-surface py-20">
      <div className="container-page">
        <SectionLabel>What the guidance says</SectionLabel>
        <h2 id="guidance-heading" className="max-w-3xl font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
          Don&rsquo;t just take our word for it.
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          UK careers advisers say the same thing: drop the clichés and show evidence. WorkCV&rsquo;s examples are
          written that way, so you can see what a strong line looks like before you write your own.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {guidanceQuotes.map((item) => (
            <figure key={item.quote} className="flex flex-col rounded-xl border border-line bg-paper p-6">
              <blockquote className="flex-1 font-display text-2xl font-semibold leading-snug text-navy">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-bold text-navy">{item.source}</span>
                  <span className="text-muted"> · {item.context}</span>
                </span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-navy underline underline-offset-4"
                >
                  Source <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        {recruiterQuotes.length > 0 ? (
          <div className="mt-14">
            <h3 className="font-display text-3xl font-semibold text-navy">What UK recruiters told us</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recruiterQuotes.map((item) => (
                <figure key={item.name} className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-sm">
                  <blockquote className="flex-1 text-lg leading-8 text-ink">&ldquo;{item.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="block font-bold text-navy">{item.name}</span>
                    <span className="text-muted">
                      {item.role}, {item.company}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function FounderNote() {
  const firstName = founder.name.split(" ")[0];
  return (
    <section aria-labelledby="founder-heading" className="border-t border-line bg-paper py-20">
      <div className="container-page max-w-3xl">
        <SectionLabel>A note from the founder</SectionLabel>
        <h2 id="founder-heading" className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">
          Built to be the CV builder I would want to use.
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
          <p>
            Hi, I&rsquo;m {firstName}. I build and run WorkCV on my own, from {founder.location}, for people applying
            for jobs in the UK.
          </p>
          <p>
            Too many CV builders let you spend an hour on your CV, then ask for a subscription before you can download
            it. WorkCV does the opposite: you see every page first, pay once, and there is nothing to cancel.
          </p>
          <p>
            If anything on the site is unclear or wrong, email{" "}
            <a href="mailto:contact@workcv.co.uk" className="font-bold text-navy underline underline-offset-4">
              contact@workcv.co.uk
            </a>{" "}
            and I will look into it.
          </p>
        </div>
        <p className="mt-8 text-base">
          <span className="block font-display text-2xl font-semibold text-navy">{founder.name}</span>
          <span className="text-sm text-muted">
            {founder.role}, WorkCV ·{" "}
            <Link href="/about" className="font-bold text-navy underline underline-offset-4">
              More about WorkCV
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
}
