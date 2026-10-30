// Statutory rates change each 1 April. Real Living Wage rates are announced each October
// (2026–27 on 15 October 2026; accredited employers have until 1 May 2027 to pay them).
export const wageRates2026 = {
  age21Plus: 12.71,
  age18To20: 10.85,
  age16To17: 8,
  apprentice: 8,
  realLivingWage: 14.1,
  londonLivingWage: 15.45,
  accommodationOffsetDaily: 11.1,
} as const;

// Announced 28 October 2026 (Low Pay Commission recommendations accepted in full).
export const wageRates2027 = {
  ...wageRates2026,
  age21Plus: 13.21,
  age18To20: 11.27,
  age16To17: 8.31,
  apprentice: 8.31,
} as const;

export type WagePeriod = "current" | "april-2027";
type WageRates = { [Key in keyof typeof wageRates2026]: number };

export const wagePeriods: Record<WagePeriod, { label: string; rates: WageRates }> = {
  current: { label: "Now (from 1 April 2026)", rates: wageRates2026 },
  "april-2027": { label: "From 1 April 2027", rates: wageRates2027 },
};

export type LivingWageInput = {
  payType: "hourly" | "annual";
  pay: number;
  paidHoursPerWeek: number;
  paidWeeksPerYear: number;
  age: number;
  apprentice: boolean;
  firstApprenticeshipYear: boolean;
  location: "london" | "rest-uk";
  period?: WagePeriod;
};

export type LivingWageResult = {
  effectiveHourlyPay: number;
  statutoryRate: number;
  statutoryLabel: string;
  meetsStatutoryRate: boolean;
  statutoryDifferencePerHour: number;
  realLivingWageRate: number;
  realLivingWageLabel: string;
  meetsRealLivingWage: boolean;
  realLivingDifferencePerHour: number;
  annualGrossPay: number;
  statutoryAnnualEquivalent: number;
  realLivingAnnualEquivalent: number;
};

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function statutoryWageFor(input: Pick<LivingWageInput, "age" | "apprentice" | "firstApprenticeshipYear" | "period">) {
  const rates = wagePeriods[input.period ?? "current"].rates;
  if (input.apprentice && (input.age < 19 || input.firstApprenticeshipYear)) return { rate: rates.apprentice, label: "Apprentice rate" };
  if (input.age >= 21) return { rate: rates.age21Plus, label: "National Living Wage (age 21+)" };
  if (input.age >= 18) return { rate: rates.age18To20, label: "National Minimum Wage (age 18–20)" };
  return { rate: rates.age16To17, label: "National Minimum Wage (age 16–17)" };
}

export function calculateLivingWage2026(input: LivingWageInput): LivingWageResult {
  if (!Number.isFinite(input.pay) || input.pay <= 0) throw new Error("Pay must be greater than zero.");
  if (!Number.isFinite(input.paidHoursPerWeek) || input.paidHoursPerWeek <= 0 || input.paidHoursPerWeek > 100) throw new Error("Paid hours must be between 0 and 100 per week.");
  if (!Number.isFinite(input.paidWeeksPerYear) || input.paidWeeksPerYear <= 0 || input.paidWeeksPerYear > 53) throw new Error("Paid weeks must be between 0 and 53 per year.");
  if (!Number.isInteger(input.age) || input.age < 16 || input.age > 100) throw new Error("Age must be a whole number between 16 and 100.");

  const annualGrossPay = input.payType === "annual" ? input.pay : input.pay * input.paidHoursPerWeek * input.paidWeeksPerYear;
  const effectiveHourlyPay = input.payType === "hourly" ? input.pay : annualGrossPay / (input.paidHoursPerWeek * input.paidWeeksPerYear);
  const statutory = statutoryWageFor(input);
  const rates = wagePeriods[input.period ?? "current"].rates;
  const realRate = input.location === "london" ? rates.londonLivingWage : rates.realLivingWage;
  return {
    effectiveHourlyPay: money(effectiveHourlyPay),
    statutoryRate: statutory.rate,
    statutoryLabel: statutory.label,
    meetsStatutoryRate: effectiveHourlyPay >= statutory.rate,
    statutoryDifferencePerHour: money(effectiveHourlyPay - statutory.rate),
    realLivingWageRate: realRate,
    realLivingWageLabel: input.location === "london" ? "London Living Wage (voluntary)" : "Real Living Wage (voluntary)",
    meetsRealLivingWage: effectiveHourlyPay >= realRate,
    realLivingDifferencePerHour: money(effectiveHourlyPay - realRate),
    annualGrossPay: money(annualGrossPay),
    statutoryAnnualEquivalent: money(statutory.rate * input.paidHoursPerWeek * input.paidWeeksPerYear),
    realLivingAnnualEquivalent: money(realRate * input.paidHoursPerWeek * input.paidWeeksPerYear),
  };
}
