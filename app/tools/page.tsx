import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  CalendarCheck,
  FileCheck2,
  FileText,
  Scale,
  Sparkles,
} from "lucide-react";

import { SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free UK CV, Salary and Employment Tools",
  description:
    "Use free UK tools for take-home pay, redundancy pay, notice periods, salary benchmarks, ATS matching, CV length and personal statements.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free UK Career Tools - WorkCV",
    description:
      "Practical UK calculators and CV checks with current rules, transparent sources and no login required.",
    url: "/tools",
  },
};

const tools = [
  {
    title: "UK Take-Home Pay Calculator",
    href: "/tools/salary-calculator",
    description:
      "Estimate salary after 2026/27 Income Tax, National Insurance, student loans and salary-sacrifice pension.",
    label: "Salary after tax",
    icon: Banknote,
    featured: true,
  },
  {
    title: "Redundancy Pay Calculator",
    href: "/tools/redundancy-pay-calculator",
    description:
      "Calculate statutory redundancy pay with current GB and Northern Ireland caps and a year-by-year breakdown.",
    label: "Employment rights",
    icon: Scale,
    featured: true,
  },
  {
    title: "UK Salary by Job Title",
    href: "/tools/uk-salary-by-job-title",
    description:
      "Search 60 roles and compare lower-quartile, median and upper-quartile gross pay from ONS data.",
    label: "Salary benchmark",
    icon: BarChart3,
    featured: false,
  },
  {
    title: "Notice Period Calculator",
    href: "/tools/notice-period-calculator",
    description:
      "Find your earliest new-job start date, contract end date and UK statutory notice minimum.",
    label: "Leaving a job",
    icon: CalendarCheck,
    featured: false,
  },
  {
    title: "ATS Score Checker",
    href: "/tools/ats-score-checker",
    description:
      "Compare a vacancy with your CV and see matched and missing skills, qualifications and action terms.",
    label: "CV targeting",
    icon: FileCheck2,
    featured: false,
  },
  {
    title: "CV Length Checker",
    href: "/tools/cv-length-checker",
    description:
      "Count words, estimate A4 pages and get a result-specific UK CV length recommendation.",
    label: "CV structure",
    icon: FileText,
    featured: false,
  },
  {
    title: "Personal Statement Generator",
    href: "/tools/personal-statement-generator",
    description:
      "Create a concise UK CV profile from your background, target role and evidence, then copy and refine it.",
    label: "CV writing",
    icon: Sparkles,
    featured: false,
  },
] as const;

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free UK career tools",
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.title,
    url: `${site.url}${tool.href}`,
  })),
};

export default function ToolsPage() {
  const featuredTools = tools.filter((tool) => tool.featured);
  const cvAndCareerTools = tools.filter((tool) => !tool.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Free UK career tools
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
            Get the number, date or CV answer you need.
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-muted">
            Practical calculators and checks for UK pay, employment changes and
            job applications. Each tool gives a concrete result, shows its
            assumptions and works without a login.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} prominent />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>CV and career tools</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Move from research to a stronger application.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cvAndCareerTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>How WorkCV builds tools</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Current sources and visible limits.
            </h2>
          </div>
          <div className="grid gap-6 text-base leading-8 text-muted sm:grid-cols-2">
            <p>
              Rule-based calculators cite the relevant GOV.UK, HMRC, Acas or
              ONS source and state the date reviewed. Calculation logic is
              tested separately from the page interface.
            </p>
            <p>
              Results are estimates where payroll, contracts or individual
              circumstances can change the answer. Each page tells you what is
              included and what to verify before acting.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ToolCard({
  tool,
  prominent = false,
}: {
  tool: (typeof tools)[number];
  prominent?: boolean;
}) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className={`group flex min-h-full flex-col border bg-white p-6 transition hover:-translate-y-1 hover:border-navy ${
        prominent
          ? "rounded-lg border-line-strong shadow-soft md:p-8"
          : "rounded-md border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#edf4f8] text-navy">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-success">
          {tool.label}
        </span>
      </div>
      <h2
        className={`mt-6 font-display font-semibold text-navy ${
          prominent ? "text-3xl" : "text-2xl"
        }`}
      >
        {tool.title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-muted">
        {tool.description}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">
        Open free tool
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
