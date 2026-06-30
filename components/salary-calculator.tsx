"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Info,
  Landmark,
  PiggyBank,
  Receipt,
} from "lucide-react";

import {
  calculateUkTakeHomePay,
  StudentLoanPlan,
  TakeHomePayError,
  takeHomePayRules,
  TaxRegion,
} from "@/lib/uk-take-home-pay";
import { site } from "@/lib/site";

type ResultPeriod = "annual" | "monthly" | "weekly";

const periodDivisors: Record<ResultPeriod, number> = {
  annual: 1,
  monthly: 12,
  weekly: 52,
};

const studentLoanOptions: Array<{ value: StudentLoanPlan; label: string }> = [
  { value: "none", label: "No undergraduate loan" },
  { value: "plan-1", label: "Plan 1" },
  { value: "plan-2", label: "Plan 2" },
  { value: "plan-4", label: "Plan 4" },
  { value: "plan-5", label: "Plan 5" },
];

function money(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits,
  }).format(value);
}

function parseMoney(value: string) {
  const number = Number(value.replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export function SalaryCalculator() {
  const [salary, setSalary] = useState("42000");
  const [bonus, setBonus] = useState("0");
  const [pension, setPension] = useState("0");
  const [region, setRegion] = useState<TaxRegion>("rest-of-uk");
  const [studentPlan, setStudentPlan] = useState<StudentLoanPlan>("none");
  const [postgraduateLoan, setPostgraduateLoan] = useState(false);
  const [blindAllowance, setBlindAllowance] = useState(false);
  const [period, setPeriod] = useState<ResultPeriod>("monthly");

  const calculation = useMemo(() => {
    try {
      return {
        result: calculateUkTakeHomePay({
          annualSalary: parseMoney(salary),
          annualBonus: parseMoney(bonus),
          salarySacrificePension: parseMoney(pension),
          taxRegion: region,
          studentLoanPlan: studentPlan,
          hasPostgraduateLoan: postgraduateLoan,
          hasBlindPersonsAllowance: blindAllowance,
        }),
        error: "",
      };
    } catch (error) {
      return {
        result: null,
        error:
          error instanceof TakeHomePayError
            ? error.message
            : "Check the figures and try again.",
      };
    }
  }, [
    salary,
    bonus,
    pension,
    region,
    studentPlan,
    postgraduateLoan,
    blindAllowance,
  ]);

  const divisor = periodDivisors[period];
  const result = calculation.result;
  const chartItems = result
    ? [
        { label: "Take-home", value: result.takeHomePay, colour: "#2d7d52" },
        { label: "Income Tax", value: result.incomeTax, colour: "#0f2942" },
        { label: "National Insurance", value: result.nationalInsurance, colour: "#d4a843" },
        {
          label: "Student loans",
          value: result.studentLoan + result.postgraduateLoan,
          colour: "#63788c",
        },
        { label: "Pension", value: result.pension, colour: "#b85c5c" },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <MoneyField
              id="annual-salary"
              label="Annual gross salary"
              value={salary}
              onChange={setSalary}
              hint="Before tax, pension and other deductions."
            />
            <MoneyField
              id="annual-bonus"
              label="Annual bonus or overtime"
              value={bonus}
              onChange={setBonus}
              hint="Total expected in this tax year."
            />
            <MoneyField
              id="salary-sacrifice"
              label="Salary-sacrifice pension"
              value={pension}
              onChange={setPension}
              hint="Annual amount exchanged before Income Tax and NI."
            />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-navy">Tax region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value as TaxRegion)}
              className="mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            >
              <option value="rest-of-uk">England, Wales or Northern Ireland</option>
              <option value="scotland">Scotland</option>
            </select>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-navy">Student loan plan</span>
            <select
              value={studentPlan}
              onChange={(event) =>
                setStudentPlan(event.target.value as StudentLoanPlan)
              }
              className="mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            >
              {studentLoanOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 space-y-3">
            <CheckField
              checked={postgraduateLoan}
              onChange={setPostgraduateLoan}
              label="Also repay a Postgraduate Loan"
            />
            <CheckField
              checked={blindAllowance}
              onChange={setBlindAllowance}
              label={`Claim Blind Person's Allowance (${money(
                takeHomePayRules.blindPersonsAllowance,
              )})`}
            />
          </div>

          <div className="mt-5 flex gap-3 rounded-md border border-line bg-paper p-4 text-xs leading-6 text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <p>
              Pension input is specifically salary sacrifice. Relief-at-source
              and net-pay pension schemes can produce a different NI and
              take-home result.
            </p>
          </div>
        </div>

        <div aria-live="polite">
          {result ? (
            <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
              <div className="border-b border-line bg-navy p-6 text-white md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                      Estimated take-home
                    </p>
                    <p className="mt-3 font-display text-5xl font-semibold">
                      {money(result.takeHomePay / divisor, 2)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white/70">
                      per {period === "annual" ? "year" : period.slice(0, -2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 rounded-md bg-white/10 p-1">
                    {(["annual", "monthly", "weekly"] as ResultPeriod[]).map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setPeriod(option)}
                          aria-pressed={period === option}
                          className={`rounded px-3 py-2 text-xs font-bold capitalize ${
                            period === option
                              ? "bg-white text-navy"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          {option}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <p className="mt-6 text-sm leading-6 text-white/70">
                  From {money(result.grossPay)} gross. Estimated deductions and
                  pension are {money(result.totalDeductions)} (
                  {(result.effectiveDeductionRate * 100).toFixed(1)}%).
                </p>
              </div>

              <div className="p-6 md:p-8">
                <div
                  className="flex h-5 overflow-hidden rounded-full bg-paper"
                  aria-label="Gross pay breakdown"
                >
                  {chartItems.map((item) => (
                    <span
                      key={item.label}
                      style={{
                        width: `${(item.value / result.grossPay) * 100}%`,
                        backgroundColor: item.colour,
                      }}
                      title={`${item.label}: ${money(item.value)}`}
                    />
                  ))}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {chartItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-xs font-bold text-muted">
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: item.colour }}
                        />
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-navy">
                        {money(item.value / divisor, 2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                  {[
                    { label: "Income Tax", value: result.incomeTax, icon: Receipt },
                    {
                      label: "National Insurance",
                      value: result.nationalInsurance,
                      icon: Landmark,
                    },
                    {
                      label: "Student loan",
                      value: result.studentLoan + result.postgraduateLoan,
                      icon: Banknote,
                    },
                    { label: "Pension", value: result.pension, icon: PiggyBank },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                    <div key={item.label} className="bg-paper p-4">
                      <Icon className="h-4 w-4 text-gold" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                        {item.label}
                      </p>
                      <p className="mt-1 font-display text-2xl font-semibold text-navy">
                        {money(item.value / divisor, 2)}
                      </p>
                    </div>
                    );
                  })}
                </div>

                <p className="mt-5 text-xs leading-6 text-muted">
                  Annual estimate using a standard employee NI category and
                  current {takeHomePayRules.taxYear} thresholds. Actual PAYE can
                  differ because payroll works by pay period, tax code, benefits,
                  irregular pay and prior earnings.
                </p>
              </div>
            </section>
          ) : (
            <div className="rounded-md border border-[#e3b5b5] bg-[#fff5f5] p-5 text-sm font-bold text-[#8b3434]">
              {calculation.error}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 rounded-lg border border-line-strong bg-[#edf4f8]/95 p-4 shadow-soft backdrop-blur md:sticky md:bottom-3 md:z-20">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-3">
            <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-bold text-navy">Looking for a better-paid role?</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Build a focused UK CV, preview it free, then unlock this saved CV
                once for {site.price}.
              </p>
            </div>
          </div>
          <Link
            href="/editor?new=1"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
          >
            Build my CV
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-bold text-navy">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-muted">{hint}</span>
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">
          £
        </span>
        <input
          id={id}
          type="number"
          min="0"
          max="10000000"
          step="100"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-12 w-full rounded-md border border-line-strong bg-white pl-9 pr-4 text-[16px] font-bold text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
        />
      </span>
    </label>
  );
}

function CheckField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-white p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[#0f2942]"
      />
      <span className="text-sm font-bold leading-6 text-navy">{label}</span>
    </label>
  );
}
