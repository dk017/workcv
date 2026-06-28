"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";

import {
  addCalendarDays,
  addCalendarMonths,
  calculateNoticePeriod,
  formatUkDate,
  NoticeCalculation,
  NoticeCalculationError,
  NoticeTargetKind,
  NoticeUnit,
  todayIsoDate,
} from "@/lib/notice-period-calculator";
import { site } from "@/lib/site";

const noticeOptions = [
  { value: "1-week", label: "1 week" },
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "2-months", label: "2 months" },
  { value: "3-months", label: "3 months" },
  { value: "not-stated", label: "Not stated / not sure" },
  { value: "other", label: "Other" },
];

function presetPeriod(value: string) {
  if (value === "1-week") return { amount: 1, unit: "weeks" as const };
  if (value === "2-weeks") return { amount: 2, unit: "weeks" as const };
  if (value === "1-month") return { amount: 1, unit: "months" as const };
  if (value === "2-months") return { amount: 2, unit: "months" as const };
  if (value === "3-months") return { amount: 3, unit: "months" as const };
  return null;
}

function serviceLabel(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) {
    return `${months} complete ${months === 1 ? "month" : "months"}`;
  }
  if (remainingMonths === 0) {
    return `${years} complete ${years === 1 ? "year" : "years"}`;
  }
  return `${years} ${years === 1 ? "year" : "years"}, ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
}

export function NoticePeriodCalculator() {
  const today = todayIsoDate();
  const [employmentStartDate, setEmploymentStartDate] = useState("");
  const [noticeOption, setNoticeOption] = useState("1-month");
  const [customAmount, setCustomAmount] = useState("4");
  const [customUnit, setCustomUnit] = useState<NoticeUnit>("weeks");
  const [targetKind, setTargetKind] =
    useState<NoticeTargetKind>("new-start");
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<NoticeCalculation | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const contractualPeriod =
        noticeOption === "other"
          ? { amount: Number(customAmount), unit: customUnit }
          : presetPeriod(noticeOption);
      const nextResult = calculateNoticePeriod({
        employmentStartDate,
        contractualPeriod,
        targetKind,
        targetDate,
        noticeGivenDate: today,
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
        calculationError instanceof NoticeCalculationError
          ? calculationError.message
          : "Check the dates and try again.",
      );
    }
  }

  function loadExample() {
    setEmploymentStartDate(addCalendarMonths(today, -42));
    setNoticeOption("1-month");
    setCustomAmount("4");
    setCustomUnit("weeks");
    setTargetKind("new-start");
    setTargetDate(addCalendarMonths(today, 2));
    setResult(null);
    setError("");
  }

  function clear() {
    setEmploymentStartDate("");
    setNoticeOption("1-month");
    setCustomAmount("4");
    setCustomUnit("weeks");
    setTargetKind("new-start");
    setTargetDate("");
    setResult(null);
    setError("");
  }

  const resultStyle = result?.targetMet
    ? {
        background: "#F0FDF4",
        colour: "#2D7D52",
        label: "Target date is workable",
      }
    : {
        background: "#FFF5F5",
        colour: "#B54242",
        label: "Target date is too soon",
      };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-bold text-navy">
              Current job start date
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Used only to calculate statutory notice.
            </span>
            <input
              type="date"
              value={employmentStartDate}
              onChange={(event) => setEmploymentStartDate(event.target.value)}
              max={today}
              required
              className="mt-3 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-navy">
              Contract notice period
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Check your contract or written statement.
            </span>
            <select
              value={noticeOption}
              onChange={(event) => {
                setNoticeOption(event.target.value);
                setResult(null);
              }}
              className="mt-3 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
            >
              {noticeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-bold text-navy">Target date means</span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Choose what the date below represents.
            </span>
            <div className="mt-3 grid min-h-12 grid-cols-2 rounded-md border border-line-strong bg-paper p-1">
              {[
                { value: "new-start", label: "New job starts" },
                { value: "last-day", label: "Employment ends" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setTargetKind(option.value as NoticeTargetKind);
                    setResult(null);
                  }}
                  className={`rounded px-3 py-2 text-sm font-bold transition ${
                    targetKind === option.value
                      ? "bg-white text-navy shadow-sm"
                      : "text-muted hover:text-navy"
                  }`}
                  aria-pressed={targetKind === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {noticeOption === "other" ? (
          <fieldset className="mt-6 rounded-md border border-line bg-paper p-4">
            <legend className="px-2 text-sm font-bold text-navy">
              Custom contractual notice
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-xs font-bold text-muted">Amount</span>
                <input
                  type="number"
                  min="1"
                  max={
                    customUnit === "days"
                      ? "365"
                      : customUnit === "weeks"
                        ? "52"
                        : "24"
                  }
                  step="1"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  required
                  className="mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
                />
              </label>
              <label>
                <span className="text-xs font-bold text-muted">Calendar unit</span>
                <select
                  value={customUnit}
                  onChange={(event) =>
                    setCustomUnit(event.target.value as NoticeUnit)
                  }
                  className="mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
                >
                  <option value="days">Calendar days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Calendar months</option>
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              If your contract says “working days”, use its exact counting rule
              or confirm the date with HR. This calculator uses calendar time.
            </p>
          </fieldset>
        ) : null}

        <label className="mt-6 block">
          <span className="text-sm font-bold text-navy">
            {targetKind === "new-start"
              ? "Desired new job start date"
              : "Desired contractual end date"}
          </span>
          <span className="mt-1 block text-xs leading-5 text-muted">
            {targetKind === "new-start"
              ? "The calculator allows the previous calendar day for your current employment to end."
              : "This is the date your current employment contract ends, which may differ from your final day physically worked."}
          </span>
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            min={
              targetKind === "new-start" ? addCalendarDays(today, 1) : today
            }
            required
            className="mt-3 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
          />
        </label>

        {error ? (
          <div
            role="alert"
            className="mt-5 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Assumes notice is received today, {formatUkDate(today)}. Dates are
            calculated in your browser and are not uploaded or saved.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadExample}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              Try an example
            </button>
            {employmentStartDate || targetDate ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper"
                title="Clear calculator"
                aria-label="Clear calculator"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
            >
              Calculate my dates
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div
              className="grid gap-6 border-b border-line p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
              style={{ backgroundColor: resultStyle.background }}
            >
              <div>
                <p
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]"
                  style={{ color: resultStyle.colour }}
                >
                  {result.targetMet ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  {resultStyle.label}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">
                  {result.targetMet
                    ? result.daysMargin === 0
                      ? "Your target matches the minimum end date."
                      : `Your target end is ${result.daysMargin} ${
                          result.daysMargin === 1 ? "day" : "days"
                        } after the minimum.`
                    : `Your target end is ${Math.abs(result.daysMargin)} ${
                        Math.abs(result.daysMargin) === 1 ? "day" : "days"
                      } before the minimum.`}
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink">
                  {result.latestNoticeDate
                    ? `To meet this target, your notice needs to be received by ${formatUkDate(
                        result.latestNoticeDate,
                      )}.`
                    : "No notice date during this employment would satisfy the selected target and notice period."}
                </p>
              </div>
              <div className="rounded-md border border-line bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  Effective resignation notice
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-navy">
                  {result.effectiveNoticeLabel}
                </p>
                <p className="mt-3 text-xs leading-6 text-muted">
                  The calculator applies whichever produces the later end date:
                  your contractual period or the employee statutory minimum.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Your notice timeline
              </h3>
              <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Notice received",
                    value: formatUkDate(result.noticeGivenDate),
                    icon: Calendar,
                  },
                  {
                    label: "Notice starts",
                    value: result.noticeStartsDate
                      ? formatUkDate(result.noticeStartsDate)
                      : "No minimum period",
                    icon: Clock,
                  },
                  {
                    label: "Minimum contract end",
                    value: formatUkDate(result.minimumEmploymentEndDate),
                    icon: Briefcase,
                  },
                  {
                    label: "Earliest new start",
                    value: formatUkDate(result.earliestNewStartDate),
                    icon: ArrowRight,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="min-w-0 bg-white p-4">
                      <Icon className="h-5 w-5 text-gold" />
                      <p className="mt-4 text-sm font-bold leading-6 text-navy">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <article className="rounded-md border border-line bg-paper p-5">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-gold" />
                    <h3 className="font-display text-xl font-semibold text-navy">
                      Notice you give when resigning
                    </h3>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-navy">
                    {result.employeeStatutoryNoticeWeeks === 0
                      ? "No statutory minimum"
                      : "1 week"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Based on {serviceLabel(result.completedServiceMonths)} of
                    service. Your contract can require more.
                  </p>
                </article>
                <article className="rounded-md border border-line bg-[#edf4f8] p-5">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-[#63788c]" />
                    <h3 className="font-display text-xl font-semibold text-navy">
                      Notice an employer gives you
                    </h3>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-navy">
                    {result.employerStatutoryNoticeWeeks === 0
                      ? "No statutory minimum"
                      : `${result.employerStatutoryNoticeWeeks} ${
                          result.employerStatutoryNoticeWeeks === 1
                            ? "week"
                            : "weeks"
                        }`}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    This separate dismissal or redundancy minimum rises with
                    complete years of service and is capped at 12 weeks.
                  </p>
                </article>
              </div>

              <div className="mt-6 border-l-2 border-gold pl-4 text-xs leading-6 text-muted">
                Calendar dates include weekends and bank holidays. If the end
                date is not a normal working day, your final day physically
                worked may be earlier, but employment can continue. Holiday,
                garden leave, PILON, fixed-term clauses and an agreed early
                release can also change the practical outcome.
              </div>
            </div>

            <div className="border-t border-line bg-paper p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-navy">
                    Planning your next application?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Build and preview your UK CV free, then unlock the selected
                    PDF once for {site.price}. No subscription.
                  </p>
                </div>
                <Link
                  href="/editor?new=1"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"
                >
                  Build my CV for {site.price}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
