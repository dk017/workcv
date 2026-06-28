"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  graduateSalarySources,
  onsSalarySource,
  SalaryRole,
  salaryRoles,
  searchSalaryRoles,
} from "@/lib/uk-salary-data";
import { site } from "@/lib/site";

const initialRole =
  salaryRoles.find((role) => role.slug === "software-engineer") ?? salaryRoles[0];

const popularRoleSlugs = [
  "registered-nurse",
  "primary-school-teacher",
  "software-engineer",
  "warehouse-operative",
  "care-worker",
  "delivery-driver",
  "customer-service-advisor",
  "accountant",
];

function formatSalary(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function SalaryResult({ role }: { role: SalaryRole }) {
  const range = role.high - role.low;
  const medianPosition =
    range === 0 ? 50 : ((role.median - role.low) / range) * 100;
  const labels =
    role.labels ??
    (["Lower quartile", "Median salary", "Upper quartile"] as [
      string,
      string,
      string,
    ]);
  const monthlyMedian = Math.round(role.median / 12);
  const weeklyMedian = Math.round(role.median / 52);
  const isOns = role.sourceKind === "ons-ashe";

  return (
    <section
      className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft"
      aria-live="polite"
    >
      <div className="border-b border-line bg-paper p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-success">
              {isOns ? "Official 2025 earnings distribution" : "Current graduate benchmarks"}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-navy md:text-5xl">
              {role.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {role.occupation}
              {role.socCode ? ` · SOC 2020 code ${role.socCode}` : ""}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-navy">
            {role.category}
          </span>
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.12em] text-muted">
          {isOns ? "Middle 50% of annual gross pay" : "Published starting-pay comparison"}
        </p>
        <p className="mt-2 font-display text-3xl font-semibold text-navy md:text-4xl">
          {formatSalary(role.low)}–{formatSalary(role.high)}
        </p>

        <div className="relative mt-7 h-4 rounded-full bg-[#dce5ea]">
          <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[#9cc9b1]" />
          <span
            className="absolute top-1/2 h-8 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy shadow"
            style={{ left: `${medianPosition}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-5 text-xs font-bold text-muted">
          <span>{formatSalary(role.low)}</span>
          <span className="text-center text-navy">
            Median {formatSalary(role.median)}
          </span>
          <span className="text-right">{formatSalary(role.high)}</span>
        </div>
      </div>

      <div className="grid gap-px border-b border-line bg-line sm:grid-cols-3">
        {[
          [labels[0], role.low],
          [labels[1], role.median],
          [labels[2], role.high],
        ].map(([label, value], index) => (
          <div key={String(label)} className="bg-white p-5 md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
              {String(label)}
            </p>
            <p
              className={`mt-3 font-display text-3xl font-semibold ${
                index === 1 ? "text-success" : "text-navy"
              }`}
            >
              {formatSalary(Number(value))}
            </p>
            {isOns ? (
              <p className="mt-2 text-xs leading-5 text-muted">
                {index === 0
                  ? "25% earned at or below this figure."
                  : index === 1
                    ? "Half earned less and half earned more."
                    : "25% earned above this figure."}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
            Median converted
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-line bg-paper p-4">
              <p className="font-display text-2xl font-semibold text-navy">
                {formatSalary(monthlyMedian)}
              </p>
              <p className="mt-1 text-xs font-bold text-muted">gross per month</p>
            </div>
            <div className="rounded-md border border-line bg-paper p-4">
              <p className="font-display text-2xl font-semibold text-navy">
                {formatSalary(weeklyMedian)}
              </p>
              <p className="mt-1 text-xs font-bold text-muted">gross per week</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Simple annual ÷ 12 and annual ÷ 52 conversions. These are before tax,
            pension, student loan and other deductions.
          </p>
        </div>

        <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h3 className="font-display text-2xl font-semibold text-navy">
            Read this result correctly
          </h3>
          {isOns ? (
            <div className="mt-4 grid gap-3 text-sm leading-7 text-muted">
              <p className="flex gap-3">
                <CalendarDays className="mt-1 h-4 w-4 shrink-0 text-gold" />
                April 2025 provisional annual gross pay for UK full-time employee
                jobs where the employee had been in the job for at least one year.
              </p>
              <p className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                National figures. Region, seniority, specialism, hours, sector and
                employer can move an individual salary outside this middle range.
              </p>
              <p className="flex gap-3">
                <Briefcase className="mt-1 h-4 w-4 shrink-0 text-gold" />
                The friendly title is mapped to the published ONS occupation shown
                above; compare the duties, not only the title.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted">
              “Graduate” spans many occupations, so these are three separate
              published benchmarks rather than percentiles from one population.
              Sector, employer size and location can matter more than the word
              graduate in the title.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line bg-[#edf4f8] p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-display text-2xl font-semibold text-navy">
              Applying for this role?
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Build a clear UK CV around the experience and skills the vacancy
              actually asks for. Preview before paying {site.price} for the PDF.
            </p>
          </div>
          <Link
            href="/editor?new=1"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"
          >
            Build my CV
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function UkSalaryChecker() {
  const [query, setQuery] = useState(initialRole.title);
  const [selectedRole, setSelectedRole] = useState<SalaryRole>(initialRole);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const suggestions = useMemo(() => searchSalaryRoles(query, 8), [query]);
  const popularRoles = popularRoleSlugs
    .map((slug) => salaryRoles.find((role) => role.slug === slug))
    .filter((role): role is SalaryRole => Boolean(role));

  function selectRole(role: SalaryRole) {
    setSelectedRole(role);
    setQuery(role.title);
    setShowSuggestions(false);
    setNoMatch(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const [firstMatch] = searchSalaryRoles(query, 1);
    if (!firstMatch) {
      setNoMatch(true);
      setShowSuggestions(false);
      return;
    }
    selectRole(firstMatch);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="salary-role" className="text-sm font-bold text-navy">
          Search by job title
        </label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="salary-role"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowSuggestions(true);
              setNoMatch(false);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="For example: nurse, software engineer, warehouse operative"
            autoComplete="off"
            className="min-h-14 w-full rounded-md border border-line-strong bg-white py-3 pl-12 pr-32 text-[16px] font-bold text-ink outline-none transition placeholder:font-normal placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15 sm:pr-40"
            aria-describedby="salary-search-help"
          />
          <button
            type="submit"
            className="absolute bottom-1.5 right-1.5 top-1.5 inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover sm:px-6"
          >
            Check salary
          </button>

          {showSuggestions && query.trim() ? (
            <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-md border border-line-strong bg-white shadow-soft">
              {suggestions.length > 0 ? (
                suggestions.map((role) => (
                  <button
                    key={role.slug}
                    type="button"
                    onClick={() => selectRole(role)}
                    className="grid w-full grid-cols-[1fr_auto] gap-4 border-b border-line px-4 py-3 text-left last:border-0 hover:bg-paper"
                  >
                    <span>
                      <span className="block text-sm font-bold text-navy">
                        {role.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {role.occupation}
                      </span>
                    </span>
                    <span className="self-center text-xs font-bold text-success">
                      {formatSalary(role.median)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-4 text-sm leading-6 text-muted">
                  No close title match. Try a shorter title such as “driver”,
                  “teacher”, “nurse” or “manager”.
                </p>
              )}
            </div>
          ) : null}
        </div>
        <p id="salary-search-help" className="mt-3 text-xs leading-5 text-muted">
          Search covers {salaryRoles.length} roles and common alternative titles.
          Select the closest match based on duties.
        </p>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {popularRoles.map((role) => (
          <button
            key={role.slug}
            type="button"
            onClick={() => selectRole(role)}
            className={`rounded-md border px-3 py-2 text-xs font-bold transition ${
              selectedRole.slug === role.slug
                ? "border-navy bg-navy text-white"
                : "border-line-strong bg-white text-navy hover:bg-paper"
            }`}
          >
            {role.title}
          </button>
        ))}
      </div>

      {noMatch ? (
        <div className="mt-6 rounded-md border border-[#ead39c] bg-[#fff8e8] p-4 text-sm font-bold text-[#76530b]">
          No close match was found for “{query}”. Try a shorter standard title or
          choose one of the popular roles above.
        </div>
      ) : null}

      <div className="mt-8">
        <SalaryResult role={selectedRole} />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-md border border-line bg-white p-5 text-sm leading-6 text-muted">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <p>
          <strong className="text-navy">Source transparency:</strong>{" "}
          {selectedRole.sourceKind === "ons-ashe" ? (
            <>
              <a
                href={onsSalarySource.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-navy underline"
              >
                {onsSalarySource.name}
              </a>
              , {onsSalarySource.table}, released {onsSalarySource.releaseDate}.
            </>
          ) : (
            <>
              Graduate figures link to{" "}
              {graduateSalarySources.map((source, index) => (
                <span key={source.label}>
                  {index > 0 ? index === graduateSalarySources.length - 1 ? " and " : ", " : ""}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-navy underline"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
