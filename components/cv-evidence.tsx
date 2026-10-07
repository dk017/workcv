import { Check, X } from "lucide-react";

import { ButtonLink, SectionLabel } from "@/components/marketing";
import {
  evidenceRows,
  guidanceQuotes,
  type EvidenceRow,
} from "@/lib/cv-evidence";

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

