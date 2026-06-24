import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { routes, site } from "@/lib/site";

type Faq = {
  question: string;
  answer: string;
};

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-semibold text-navy">
          WorkCV
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {routes.slice(1).map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-navy">
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="hidden rounded-md border border-line-strong px-4 py-2 text-sm font-bold text-navy hover:bg-white sm:inline-flex"
          >
            See example
          </Link>
          <Link
            href="/editor"
            className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-navy-hover"
          >
            Build my CV
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer({ line = site.summary }: { line?: string }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl font-display text-2xl font-semibold leading-tight text-navy">
            {line}
          </p>
          <div className="flex flex-wrap gap-5 text-sm font-medium text-navy">
            <Link href="/pricing">Pricing</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/how-to-write-a-cv-uk">CV guide</Link>
            <Link href="/cv-builder-no-subscription-uk">No subscription</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refunds</Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://dang.ai"
            target="_blank"
            rel="dofollow noopener"
            className="inline-block no-underline"
            aria-label="Verified on DANG"
          >
            <img
              src="https://assets.dang.ai/badges/dang-verified-dark.png"
              alt="Verified on DANG!"
              width={260}
              height={94}
              className="block h-auto max-w-full border-0"
            />
          </a>
          <a
            href="https://www.scrolllaunch.com/products/workcv?ref=badge"
            target="_blank"
            rel="noopener"
            className="inline-block"
            aria-label="WorkCV featured on ScrollLaunch"
          >
            <img
              src="https://www.scrolllaunch.com/api/badge/workcv?variant=launched&theme=light"
              alt="WorkCV - Featured on ScrollLaunch"
              className="block h-auto max-w-full border-0"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
      : "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5";

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
      {children}
    </p>
  );
}

export function TrustStrip() {
  const items = [
    "Guided UK sections",
    "Formatting handled",
    "Preview every page",
    "Save and update anytime",
  ];

  return (
    <section className="border-y border-line bg-surface">
      <div className="container-page grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
            <ShieldCheck className="h-5 w-5 text-success" />
            {item}
          </div>
        ))}
      </div>
    </section>
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
            WorkCV costs {site.price} when you download your PDF. No monthly
            subscription, no automatic renewal, and nothing to cancel later.
          </p>
        </div>
        <Link
          href="/cv-builder-no-subscription-uk"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5"
        >
          See how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
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
            href={`/editor?template=${sample.template === "Classic UK" ? "classic" : sample.template.toLowerCase()}`}
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

const transformationDetails = [
  "Resolved customer queries and complaints",
  "Trained two new starters",
  "Covered high-volume weekend shifts",
];

function TransformationField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-sm font-bold text-navy">{label}</div>
      <div className="rounded-md border border-line-strong bg-paper px-4 py-3 text-sm text-ink">
        {value}
      </div>
    </div>
  );
}

export function TransformationSection() {
  return (
    <section id="transformation" className="quiet-grid scroll-mt-16 bg-paper py-16">
      <div className="container-wide">
        <SectionLabel>From details to document</SectionLabel>
        <h2 className="max-w-4xl font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
          Your details go in. A polished UK CV comes out.
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          You add the content. WorkCV takes care of the structure, spacing,
          hierarchy, and page layout.
        </p>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_auto_1.1fr]">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              What you add
            </h3>
            <div className="space-y-4 rounded-xl border border-line-strong bg-white p-5 shadow-sm sm:p-6">
              <TransformationField label="Role" value="Customer Service Assistant" />
              <TransformationField label="Employer" value="Northline Retail" />
              <TransformationField label="Location" value="Leeds" />
              <div>
                <div className="mb-2 text-sm font-bold text-navy">Experience</div>
                <div className="space-y-2 rounded-md border border-line-strong bg-paper px-4 py-3 text-sm leading-6 text-ink">
                  {transformationDetails.map((detail) => (
                    <div key={detail}>{detail}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ArrowRight
            aria-hidden="true"
            className="mx-auto h-10 w-10 rotate-90 text-navy lg:rotate-0"
            strokeWidth={1.75}
          />

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              What you get
            </h3>
            <div className="rounded-xl border border-line-strong bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="h-1.5 w-20 bg-gold" />
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-navy">
                  Classic UK
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                </div>
              </div>
              <h3 className="mt-8 font-display text-4xl font-semibold leading-none text-navy sm:text-5xl">
                Emily Thompson
              </h3>
              <p className="mt-3 text-base font-bold text-ink">Customer Service Assistant</p>
              <p className="mt-1 text-sm text-muted">Leeds, UK</p>
              <div className="my-6 border-t border-line" />
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-navy">
                Experience
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-ink">
                {transformationDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <ButtonLink href="/editor">Start with my details</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function ProofSection() {
  const proofPoints = [
    {
      stat: `${site.price}`,
      title: "shown before the editor",
      body:
        "The price is not saved for the last click. You see the one-time PDF price before you start.",
    },
    {
      stat: "0",
      title: "renewals to cancel",
      body:
        "The checkout unlocks one saved CV PDF. There is no monthly plan, renewal date, or account trap.",
    },
    {
      stat: "2026",
      title: "UK pricing checked",
      body:
        "The pricing page compares WorkCV against trial-and-renewal CV builders using dated source checks.",
    },
  ];

  return (
    <section className="bg-surface py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <SectionLabel>Proof before payment</SectionLabel>
          <h2 className="font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
            The promise is visible before you pay.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            CV builders make people nervous because the cheap trial is often not
            the real price. WorkCV keeps the proof close to the action: price,
            preview, and no renewal are all clear before checkout.
          </p>
          <div className="mt-8">
            <ButtonLink href="/pricing" variant="secondary">
              Check the pricing proof
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {proofPoints.map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-paper p-6">
              <div className="font-display text-5xl font-semibold leading-none text-navy">
                {item.stat}
              </div>
              <h3 className="mt-4 text-base font-bold text-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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

export function FinalCta({
  heading,
  body,
  primaryHref = "/editor",
  primary = "Create my CV, pay at download",
  secondaryHref = "/pricing",
  secondary = "See pricing",
}: {
  heading: string;
  body: string;
  primaryHref?: string;
  primary?: string;
  secondaryHref?: string | null;
  secondary?: string | null;
}) {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="container-page text-center">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">{heading}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-bold text-navy"
          >
            {primary}
          </Link>
          {secondaryHref && secondary && (
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/35 px-6 py-3 text-sm font-bold text-white"
            >
              {secondary}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
