"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Info,
  Scale,
  ShieldCheck,
} from "lucide-react";

import {
  calculateRedundancyPay,
  formatRedundancyDate,
  RedundancyJurisdiction,
  RedundancyPayError,
  RedundancyPayResult,
  redundancyRules,
} from "@/lib/redundancy-pay-calculator";
import { site } from "@/lib/site";

function money(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits,
  }).format(value);
}

function todayIsoDate() {
  const now = new Date();
  return [
    now.getFullYear().toString().padStart(4, "0"),
    (now.getMonth() + 1).toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
  ].join("-");
}

export function RedundancyPayCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [employmentStartDate, setEmploymentStartDate] = useState("");
  const [redundancyDate, setRedundancyDate] = useState(todayIsoDate());
  const [weeklyPay, setWeeklyPay] = useState("700");
  const [jurisdiction, setJurisdiction] =
    useState<RedundancyJurisdiction>("great-britain");
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [enhancedMultiplier, setEnhancedMultiplier] = useState("1.5");
  const [useActualPay, setUseActualPay] = useState(true);
  const [result, setResult] = useState<RedundancyPayResult | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const nextResult = calculateRedundancyPay({
        dateOfBirth,
        employmentStartDate,
        redundancyDate,
        grossWeeklyPay: Number(weeklyPay),
        jurisdiction,
        enhancedMultiplier: showEnhanced
          ? Number(enhancedMultiplier)
          : undefined,
        enhancedUsesActualWeeklyPay: useActualPay,
      });
      setResult(nextResult);
      window.setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        0,
      );
    } catch (calculationError) {
      setResult(null);
      setError(
        calculationError instanceof RedundancyPayError
          ? calculationError.message
          : "Check the details and try again.",
      );
    }
  }

  function loadExample() {
    setDateOfBirth("1981-06-30");
    setEmploymentStartDate("2011-06-30");
    setRedundancyDate("2026-06-30");
    setWeeklyPay("900");
    setJurisdiction("great-britain");
    setShowEnhanced(true);
    setEnhancedMultiplier("1.5");
    setUseActualPay(true);
    setResult(null);
    setError("");
  }

  return (
    <div>
      <form onSubmit={calculate}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <DateField
            id="date-of-birth"
            label="Date of birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            max={redundancyDate}
          />
          <DateField
            id="employment-start"
            label="Continuous employment started"
            value={employmentStartDate}
            onChange={setEmploymentStartDate}
            max={redundancyDate}
          />
          <DateField
            id="redundancy-date"
            label="Employment ends"
            value={redundancyDate}
            onChange={setRedundancyDate}
            min={employmentStartDate}
          />

          <label className="block">
            <span className="text-sm font-bold text-navy">Gross weekly pay</span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Before tax. Use the relevant 12-week average if pay varies.
            </span>
            <span className="relative mt-3 block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">
                £
              </span>
              <input
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                inputMode="decimal"
                value={weeklyPay}
                onChange={(event) => setWeeklyPay(event.target.value)}
                required
                className="min-h-12 w-full rounded-md border border-line-strong bg-white pl-9 pr-4 text-[16px] font-bold text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-navy">UK jurisdiction</span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              The statutory weekly cap differs in Northern Ireland.
            </span>
            <select
              value={jurisdiction}
              onChange={(event) =>
                setJurisdiction(event.target.value as RedundancyJurisdiction)
              }
              className="mt-3 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            >
              <option value="great-britain">England, Scotland or Wales</option>
              <option value="northern-ireland">Northern Ireland</option>
            </select>
          </label>

          <label className="flex min-h-[96px] cursor-pointer items-start gap-3 rounded-md border border-line bg-white p-4">
            <input
              type="checkbox"
              checked={showEnhanced}
              onChange={(event) => setShowEnhanced(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#0f2942]"
            />
            <span>
              <span className="block text-sm font-bold text-navy">
                Compare an employer-enhanced scenario
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                Only if your written scheme follows the statutory week count.
              </span>
            </span>
          </label>
        </div>

        {showEnhanced ? (
          <fieldset className="mt-6 rounded-md border border-line bg-paper p-5">
            <legend className="px-2 text-sm font-bold text-navy">
              Optional enhanced scenario
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="text-xs font-bold text-muted">
                  Employer multiplier
                </span>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={enhancedMultiplier}
                  onChange={(event) => setEnhancedMultiplier(event.target.value)}
                  required
                  className="mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] font-bold text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
                />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-white p-4">
                <input
                  type="checkbox"
                  checked={useActualPay}
                  onChange={(event) => setUseActualPay(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#0f2942]"
                />
                <span className="text-sm font-bold leading-6 text-navy">
                  Use actual weekly pay instead of the statutory cap
                </span>
              </label>
            </div>
            <p className="mt-4 flex gap-2 text-xs leading-6 text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Employer schemes vary. This scenario assumes the same age bands
              and service cap as the statutory formula, then applies the
              multiplier you enter.
            </p>
          </fieldset>
        ) : null}

        {error ? (
          <div className="mt-6 flex gap-3 rounded-md border border-[#e3b5b5] bg-[#fff5f5] p-4 text-sm font-bold text-[#8b3434]">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-sm font-bold text-white hover:bg-navy-hover"
          >
            <Scale className="h-4 w-4" />
            Calculate redundancy pay
          </button>
          <button
            type="button"
            onClick={loadExample}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line-strong bg-white px-6 text-sm font-bold text-navy hover:bg-paper"
          >
            Load worked example
          </button>
        </div>
      </form>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-8">
          {!result.eligible ? (
            <section className="rounded-lg border border-[#ead39c] bg-[#fff8e8] p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#8a6212]" />
                <div>
                  <h2 className="font-display text-3xl font-semibold text-navy">
                    No statutory redundancy pay yet.
                  </h2>
                  <p className="mt-3 leading-7 text-muted">
                    The dates give {result.completedServiceYears} complete{" "}
                    {result.completedServiceYears === 1 ? "year" : "years"} of
                    continuous service. Statutory redundancy pay normally
                    requires at least 2 complete years, although a contract or
                    employer scheme may provide more.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
              <div className="grid gap-px bg-line lg:grid-cols-[1.15fr_0.85fr]">
                <div className="bg-navy p-6 text-white md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                    Estimated statutory redundancy pay
                  </p>
                  <p className="mt-3 font-display text-5xl font-semibold">
                    {money(result.statutoryPay, 2)}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    {result.statutoryWeeks} weeks ×{" "}
                    {money(result.weeklyPayUsed, 2)} weekly pay used
                  </p>
                </div>
                <div className="bg-paper p-6 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                    Service counted
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold text-navy">
                    {result.countedServiceYears} years
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Age {result.ageAtRedundancy} when employment ends.
                    {result.ignoredServiceYears > 0
                      ? ` The oldest ${result.ignoredServiceYears} years are outside the 20-year cap.`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
                {[
                  ["Actual weekly pay", money(Number(weeklyPay), 2)],
                  ["2026 statutory cap", money(result.weeklyPayCap)],
                  ["Weekly pay used", money(result.weeklyPayUsed, 2)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
                      {label}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-navy">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {result.enhancedEstimate !== null ? (
                <div className="border-t border-line bg-[#edf4f8] p-6 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-success">
                    Employer-enhanced scenario, not a statutory entitlement
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold text-navy">
                    {money(result.enhancedEstimate, 2)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Uses {result.statutoryWeeks} statutory weeks,{" "}
                    {money(result.enhancedWeeklyPayUsed ?? 0, 2)} weekly pay and
                    a {Number(enhancedMultiplier).toFixed(1)}× multiplier. Check
                    the written employer scheme because its formula can differ.
                  </p>
                </div>
              ) : null}

              <div className="border-t border-line p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <p className="text-sm leading-7 text-muted">
                    Up to £30,000 of qualifying redundancy or termination
                    payments can usually fall within the Income Tax exemption.
                    Notice pay, holiday pay, wages and some other items are
                    taxable separately, so this calculator does not estimate tax
                    on a full leaving package.
                  </p>
                </div>
              </div>
            </section>
          )}

          {result.eligible ? (
            <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
              <div className="border-b border-line bg-paper p-5">
                <h2 className="font-display text-2xl font-semibold text-navy">
                  Year-by-year statutory breakdown
                </h2>
                <p className="mt-2 text-xs leading-6 text-muted">
                  The latest 20 complete years count. A higher age rate applies
                  only to a full service year that began in that age band.
                </p>
              </div>
              <div className="max-h-[520px] overflow-auto">
                <div className="hidden grid-cols-[1fr_0.8fr_0.8fr_1fr] bg-navy px-5 py-3 text-xs font-bold text-white sm:grid">
                  <span>Year ending</span>
                  <span>Age at start</span>
                  <span>Weeks</span>
                  <span>Amount</span>
                </div>
                {result.serviceYears.map((year) => (
                  <div
                    key={year.serviceYearEnding}
                    className="grid gap-3 border-t border-line p-5 text-sm sm:grid-cols-[1fr_0.8fr_0.8fr_1fr]"
                  >
                    <BreakdownCell label="Year ending">
                      {formatRedundancyDate(year.serviceYearEnding)}
                    </BreakdownCell>
                    <BreakdownCell label="Age at start">
                      {year.ageAtStartOfYear}
                    </BreakdownCell>
                    <BreakdownCell label="Weeks">{year.weeksPay}</BreakdownCell>
                    <BreakdownCell label="Amount">
                      {money(year.amount, 2)}
                    </BreakdownCell>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      <div className="mt-7 rounded-lg border border-line-strong bg-[#edf4f8]/95 p-4 shadow-soft backdrop-blur md:sticky md:bottom-3 md:z-20">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-3">
            <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-bold text-navy">
                Being made redundant? Make the next application easier.
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Update your UK CV now. Build and preview free, then unlock this
                saved CV once for {site.price}.
              </p>
            </div>
          </div>
          <Link
            href="/editor?new=1"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
          >
            Update my CV
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-bold text-navy">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-muted">
        Use the relevant employment date, not the notice date.
      </span>
      <span className="relative mt-3 block">
        <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          min={min}
          max={max}
          required
          className="min-h-12 w-full rounded-md border border-line-strong bg-white pl-11 pr-3 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
        />
      </span>
    </label>
  );
}

function BreakdownCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-muted sm:hidden">
        {label}
      </span>
      <span className="font-bold text-navy">{children}</span>
    </div>
  );
}
