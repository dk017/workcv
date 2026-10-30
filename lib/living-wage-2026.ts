export const wageRates2026 = {
  age21Plus: 12.71,
  age18To20: 10.85,
  age16To17: 8,
  apprentice: 8,
  realLivingWage: 13.45,
  londonLivingWage: 14.8,
  accommodationOffsetDaily: 11.1,
} as const;

export type LivingWageInput = {
  payType: "hourly" | "annual";
  pay: number;
  paidHoursPerWeek: number;
  paidWeeksPerYear: number;
  age: number;
  apprentice: boolean;
  firstApprenticeshipYear: boolean;
  location: "london" | "rest-uk";
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

export function statutoryWageFor(input: Pick<LivingWageInput, "age" | "apprentice" | "firstApprenticeshipYear">) {
  if (input.apprentice && (input.age < 19 || input.firstApprenticeshipYear)) return { rate: wageRates2026.apprentice, label: "Apprentice rate" };
  if (input.age >= 21) return { rate: wageRates2026.age21Plus, label: "National Living Wage (age 21+)" };
  if (input.age >= 18) return { rate: wageRates2026.age18To20, label: "National Minimum Wage (age 18–20)" };
  return { rate: wageRates2026.age16To17, label: "National Minimum Wage (age 16–17)" };
}

export function calculateLivingWage2026(input: LivingWageInput): LivingWageResult {
  if (!Number.isFinite(input.pay) || input.pay <= 0) throw new Error("Pay must be greater than zero.");
  if (!Number.isFinite(input.paidHoursPerWeek) || input.paidHoursPerWeek <= 0 || input.paidHoursPerWeek > 100) throw new Error("Paid hours must be between 0 and 100 per week.");
  if (!Number.isFinite(input.paidWeeksPerYear) || input.paidWeeksPerYear <= 0 || input.paidWeeksPerYear > 53) throw new Error("Paid weeks must be between 0 and 53 per year.");
  if (!Number.isInteger(input.age) || input.age < 16 || input.age > 100) throw new Error("Age must be a whole number between 16 and 100.");

  const annualGrossPay = input.payType === "annual" ? input.pay : input.pay * input.paidHoursPerWeek * input.paidWeeksPerYear;
  const effectiveHourlyPay = input.payType === "hourly" ? input.pay : annualGrossPay / (input.paidHoursPerWeek * input.paidWeeksPerYear);
  const statutory = statutoryWageFor(input);
  const realRate = input.location === "london" ? wageRates2026.londonLivingWage : wageRates2026.realLivingWage;
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
