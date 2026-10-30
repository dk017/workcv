import { ArrowRight, Briefcase } from "lucide-react";

import { TrackedLink } from "@/components/tracked-link";
import { commercialRoutes, site } from "@/lib/site";

// A short CV prompt for job-move tools (living wage, notice period). Visitors arrive for a
// wage figure or a date, so the prompt names their situation and stays secondary to the answer.
export function JobMoveCvPrompt({
  heading,
  placement,
  cta = "Update my CV",
  className = "",
}: {
  heading: string;
  placement: string;
  cta?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line-strong bg-[#edf4f8] p-5 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="text-base font-bold text-navy">{heading}</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Build and preview your UK CV and matching cover letter free, with no account. Pay {site.price} once to
              download both as PDF and Word. No subscription.
            </p>
          </div>
        </div>
        <TrackedLink
          href={commercialRoutes.editor}
          placement={placement}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
        >
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </TrackedLink>
      </div>
    </div>
  );
}
