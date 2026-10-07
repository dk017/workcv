import Link from "next/link";
import { cancelGuides } from "@/components/cancel-guide-links";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/tracked-link";
import { commercialRoutes, site } from "@/lib/site";

type Faq = {
  question: string;
  answer: string;
};

const footerGroups: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Product",
    links: [
      ["Templates", "/templates"],
      ["Pricing", "/pricing"],
      ["CV examples", "/cv-examples-uk"],
      ["No subscription", "/cv-builder-no-subscription-uk"],
      ["CV builder guide", "/best-cv-builder-uk"],
      ["CV builder charges", "/cv-builder-scams-uk"],
    ],
  },
  {
    title: "Free tools",
    links: [
      ["ATS CV checker", "/tools/ats-score-checker"],
      ["Visa sponsor checker", "/tools/uk-visa-sponsor-checker"],
      ["Job tracker", "/tools/job-application-tracker-uk"],
      ["CV length checker", "/tools/cv-word-count-checker"],
      ["Statement generator", "/tools/cv-summary-generator-uk"],
      ["All free tools", "/tools"],
    ],
  },
  {
    title: "Money and work",
    links: [
      ["UK salary checker", "/tools/uk-salary-by-job-title"],
      ["Take-home pay", "/tools/take-home-pay-calculator-uk"],
      ["Notice calculator", "/tools/notice-period-calculator"],
      ["Redundancy pay", "/tools/redundancy-pay-calculator"],
      ["CV guide", "/how-to-write-a-cv-uk"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Refunds", "/refund-policy"],
    ],
  },
];

export function Footer({ line = site.summary }: { line?: string }) {
  return (
    <footer className="border-t border-line bg-paper text-sm">
      <div className="container-page grid gap-x-4 gap-y-8 py-10 sm:py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-x-8">
        <div className="flex flex-col gap-2.5">
          <span className="flex items-center gap-2 font-display text-xl font-extrabold text-navy">
            <svg aria-hidden="true" viewBox="0 0 64 64" className="h-[26px] w-[26px] shrink-0">
              <rect width="64" height="64" rx="12" fill="#0F2942" />
              <path d="M12 16h9l6 28h-8L12 16Zm17 0h7l-5 28h-8l6-28Zm9 0h8l-3 28h-8l3-28Zm10 0h8l-7 28h-8l7-28Z" fill="#fff" />
              <rect x="12" y="50" width="40" height="4" rx="2" fill="#D4A843" />
            </svg>
            WorkCV
          </span>
          <p className="max-w-xs leading-relaxed text-muted">{line}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8 lg:contents">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col">
              <p className="pb-1 font-bold text-navy">{group.title}</p>
              {group.links.map(([label, href]) => (
                <Link key={href} href={href} className="flex min-h-9 items-center text-muted hover:text-navy">
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="container-page flex flex-wrap gap-x-5 gap-y-1 border-t border-line pb-10 pt-5">
        <p className="w-full py-1 font-bold text-navy sm:w-auto">Cancel a CV builder subscription:</p>
        {cancelGuides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="flex min-h-9 items-center text-muted hover:text-navy sm:min-h-0">
            {guide.name}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  trackingLabel = "button_link",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  trackingLabel?: string;
}) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
      : "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5";

  return (
    <TrackedLink href={href} className={className} placement={trackingLabel}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </TrackedLink>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
      {children}
    </p>
  );
}

export function NoSubscriptionCtaStrip() {
  return (
    <section className="border-y border-line bg-navy py-8 text-white">
      <div className="container-page flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">
            No-subscription CV builder
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Tired of CV builders charging you monthly?
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
            Pay {site.price} once for your CV and matching cover letter as PDF and Word. No monthly
            subscription, no automatic renewal, and nothing to cancel later.
          </p>
        </div>
        <Link
          href={commercialRoutes.moneyPage}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5"
        >
          See how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function MoneyPageCta({
  heading = "Build the CV behind your next application.",
  body = `Build and preview free. Pay ${site.price} once for one saved UK CV and its matching cover letter, each as PDF and Word. No subscription; edits and redownloads of the same saved CV and letter are included.`,
  trackingContext = "money_page_cta",
  secondary = true,
}: {
  heading?: string;
  body?: string;
  trackingContext?: string;
  secondary?: boolean;
}) {
  return (
    <section className="border-y border-line bg-navy py-16 text-white">
      <div className="container-page text-center">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">{heading}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={commercialRoutes.moneyPage}
            placement={`${trackingContext}_money`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-navy"
          >
            See the no-subscription CV builder
            <ArrowRight className="h-4 w-4" />
          </TrackedLink>
          {secondary ? (
            <TrackedLink
              href={commercialRoutes.editor}
              placement={`${trackingContext}_editor`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-6 py-3 text-sm font-bold text-white"
            >
              Start building free
              <ArrowRight className="h-4 w-4" />
            </TrackedLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const sampleCards = [
  {
    name: "Emily Thompson",
    role: "Customer Service Assistant",
    city: "Leeds",
    template: "Classic UK",
    accent: "bg-gold",
    lines: [92, 84, 68],
    sections: ["Profile", "Experience", "Skills"],
  },
  {
    name: "Oliver Hughes",
    role: "Junior Data Analyst",
    city: "Bristol",
    template: "Modern",
    accent: "bg-success",
    lines: [88, 74, 82],
    sections: ["Projects", "Education", "Tools"],
  },
  {
    name: "Sophie Clarke",
    role: "Student Retail CV",
    city: "Nottingham",
    template: "Compact",
    accent: "bg-navy",
    lines: [80, 90, 64],
    sections: ["Education", "Part-time work", "Achievements"],
  },
];

export function CvPreview() {
  return (
    <div className="hero-preview relative mx-auto w-full max-w-[520px]">
      <div className="absolute inset-x-6 bottom-6 top-12 rounded-xl bg-gold-tint/60" />
      <div className="relative h-[430px] sm:h-[460px]">
        {sampleCards.map((sample, index) => (
          <Link
            key={sample.name}
            href={`/editor?template=${sample.template === "Classic UK" ? "classic" : sample.template.toLowerCase()}&new=1`}
            className={`hero-template-card hero-template-card-${index + 1} group absolute block rounded-lg border border-line-strong bg-white p-4 shadow-soft transition hover:border-navy`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {sample.template}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${sample.accent}`} />
            </div>

            <div className="rounded-md border border-line bg-paper p-4">
              <div className={`mb-4 h-1.5 w-20 ${sample.accent}`} />
              <h3 className="font-display text-2xl font-semibold leading-none text-navy">
                {sample.name}
              </h3>
              <p className="mt-2 text-xs font-bold leading-4 text-ink">{sample.role}</p>
              <p className="mt-1 text-xs text-muted">{sample.city}, UK</p>

              <div className="mt-5 space-y-4">
                {sample.sections.map((section, sectionIndex) => (
                  <PreviewSection
                    key={section}
                    title={section}
                    lines={[
                      sample.lines[sectionIndex],
                      Math.max(48, sample.lines[sectionIndex] - 14),
                      Math.max(38, sample.lines[sectionIndex] - 28),
                    ]}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-navy">
              Open in editor
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-line-strong bg-white px-3 py-2 text-xs font-bold text-navy shadow-sm">
          <span className="h-2 w-5 rounded-full bg-navy" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ml-2">3 clean templates</span>
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  lines,
  compact = false,
}: {
  title: string;
  lines: number[];
  compact?: boolean;
}) {
  return (
    <div>
      <div
        className={`mb-2 font-bold uppercase tracking-[0.12em] text-navy ${
          compact ? "text-[9px]" : "text-xs"
        }`}
      >
        {title}
      </div>
      <div className={compact ? "space-y-1.5" : "space-y-2"}>
        {lines.map((line) => (
          <div
            key={line}
            className={`${compact ? "h-1.5" : "h-2"} rounded-full bg-[#E9E6DE]`}
            style={{ width: `${line}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function FaqSection({ faqs, title }: { faqs: Faq[]; title: string }) {
  return (
    <section id="faq" className="bg-paper py-24">
      <div className="container-page">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
          {title}
        </h2>
        <div className="mt-10 divide-y divide-line rounded-xl border border-line bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="cursor-pointer list-none font-bold text-navy">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-xl text-gold">+</span>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedLinksSection({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <section className="bg-surface py-16">
      <div className="container-page">
        <h2 className="font-display text-3xl font-semibold text-navy">{title}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md border border-line-strong bg-white px-4 py-3 text-sm font-bold text-navy hover:border-navy"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({
  heading,
  body,
  primaryHref = "/editor",
  primary = "Create my CV, pay at download",
  secondaryHref = "/pricing",
  secondary = "See pricing",
  trackingContext = "final_cta",
}: {
  heading: string;
  body: string;
  primaryHref?: string;
  primary?: string;
  secondaryHref?: string | null;
  secondary?: string | null;
  trackingContext?: string;
}) {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="container-page text-center">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">{heading}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={primaryHref}
            placement={`${trackingContext}_primary`}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-bold text-navy"
          >
            {primary}
          </TrackedLink>
          {secondaryHref && secondary && (
            <TrackedLink
              href={secondaryHref}
              placement={`${trackingContext}_secondary`}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/35 px-6 py-3 text-sm font-bold text-white"
            >
              {secondary}
            </TrackedLink>
          )}
        </div>
      </div>
    </section>
  );
}
