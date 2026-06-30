export type RedundancyJurisdiction = "great-britain" | "northern-ireland";

export type RedundancyPayInput = {
  dateOfBirth: string;
  employmentStartDate: string;
  redundancyDate: string;
  grossWeeklyPay: number;
  jurisdiction: RedundancyJurisdiction;
  enhancedMultiplier?: number;
  enhancedUsesActualWeeklyPay?: boolean;
};

export type RedundancyServiceYear = {
  serviceYearEnding: string;
  ageAtStartOfYear: number;
  multiplier: 0.5 | 1 | 1.5;
  weeksPay: number;
  amount: number;
};

export type RedundancyPayResult = {
  eligible: boolean;
  completedServiceYears: number;
  countedServiceYears: number;
  ignoredServiceYears: number;
  ageAtRedundancy: number;
  weeklyPayCap: number;
  weeklyPayUsed: number;
  statutoryWeeks: number;
  statutoryPay: number;
  enhancedEstimate: number | null;
  enhancedWeeklyPayUsed: number | null;
  potentiallyTaxFreeAmount: number;
  serviceYears: RedundancyServiceYear[];
};

export class RedundancyPayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RedundancyPayError";
  }
}

export const redundancyRules = {
  effectiveFrom: "6 April 2026",
  greatBritainWeeklyCap: 751,
  northernIrelandWeeklyCap: 783,
  maximumServiceYears: 20,
  minimumServiceYears: 2,
  terminationPaymentTaxThreshold: 30_000,
} as const;

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function formatIsoDate(date: Date) {
  return [
    date.getUTCFullYear().toString().padStart(4, "0"),
    (date.getUTCMonth() + 1).toString().padStart(2, "0"),
    date.getUTCDate().toString().padStart(2, "0"),
  ].join("-");
}

function parseIsoDate(value: string, label: string) {
  const match = isoDatePattern.exec(value);
  if (!match) throw new RedundancyPayError(`Enter a valid ${label}.`);

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  if (formatIsoDate(date) !== value) {
    throw new RedundancyPayError(`Enter a valid ${label}.`);
  }
  return date;
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function subtractYears(value: string, years: number) {
  const date = parseIsoDate(value, "date");
  const targetYear = date.getUTCFullYear() - years;
  const targetDay = Math.min(
    date.getUTCDate(),
    daysInMonth(targetYear, date.getUTCMonth()),
  );
  return formatIsoDate(
    new Date(Date.UTC(targetYear, date.getUTCMonth(), targetDay)),
  );
}

export function ageOnDate(dateOfBirth: string, dateValue: string) {
  const birth = parseIsoDate(dateOfBirth, "date of birth");
  const date = parseIsoDate(dateValue, "date");
  if (birth.getTime() > date.getTime()) {
    throw new RedundancyPayError("Date of birth must be before the other dates.");
  }

  let age = date.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayThisYear = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      birth.getUTCMonth(),
      Math.min(
        birth.getUTCDate(),
        daysInMonth(date.getUTCFullYear(), birth.getUTCMonth()),
      ),
    ),
  );
  if (date.getTime() < birthdayThisYear.getTime()) age -= 1;
  return age;
}

export function completedYearsBetween(startValue: string, endValue: string) {
  const start = parseIsoDate(startValue, "employment start date");
  const end = parseIsoDate(endValue, "redundancy date");
  if (start.getTime() > end.getTime()) {
    throw new RedundancyPayError(
      "Employment start date must be before the redundancy date.",
    );
  }

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  if (subtractYears(endValue, years) < startValue) years -= 1;
  return Math.max(0, years);
}

function multiplierForAge(age: number): 0.5 | 1 | 1.5 {
  if (age < 22) return 0.5;
  if (age < 41) return 1;
  return 1.5;
}

export function calculateRedundancyPay(
  input: RedundancyPayInput,
): RedundancyPayResult {
  parseIsoDate(input.dateOfBirth, "date of birth");
  parseIsoDate(input.employmentStartDate, "employment start date");
  parseIsoDate(input.redundancyDate, "redundancy date");

  if (
    !Number.isFinite(input.grossWeeklyPay) ||
    input.grossWeeklyPay < 0 ||
    input.grossWeeklyPay > 1_000_000
  ) {
    throw new RedundancyPayError(
      "Gross weekly pay must be between £0 and £1,000,000.",
    );
  }
  if (
    input.enhancedMultiplier !== undefined &&
    (!Number.isFinite(input.enhancedMultiplier) ||
      input.enhancedMultiplier < 0.1 ||
      input.enhancedMultiplier > 10)
  ) {
    throw new RedundancyPayError(
      "Enhanced multiplier must be between 0.1 and 10.",
    );
  }

  const ageAtRedundancy = ageOnDate(
    input.dateOfBirth,
    input.redundancyDate,
  );
  if (ageAtRedundancy < 16) {
    throw new RedundancyPayError(
      "The redundancy date must be on or after the employee's 16th birthday.",
    );
  }

  const completedServiceYears = completedYearsBetween(
    input.employmentStartDate,
    input.redundancyDate,
  );
  const eligible =
    completedServiceYears >= redundancyRules.minimumServiceYears;
  const countedServiceYears = eligible
    ? Math.min(completedServiceYears, redundancyRules.maximumServiceYears)
    : 0;
  const weeklyPayCap =
    input.jurisdiction === "northern-ireland"
      ? redundancyRules.northernIrelandWeeklyCap
      : redundancyRules.greatBritainWeeklyCap;
  const weeklyPayUsed = Math.min(input.grossWeeklyPay, weeklyPayCap);

  const serviceYears: RedundancyServiceYear[] = [];
  for (let index = 0; index < countedServiceYears; index += 1) {
    const serviceYearStart = subtractYears(input.redundancyDate, index + 1);
    const serviceYearEnding = subtractYears(input.redundancyDate, index);
    const ageAtStartOfYear = ageOnDate(input.dateOfBirth, serviceYearStart);
    const multiplier = multiplierForAge(ageAtStartOfYear);
    serviceYears.push({
      serviceYearEnding,
      ageAtStartOfYear,
      multiplier,
      weeksPay: multiplier,
      amount: multiplier * weeklyPayUsed,
    });
  }

  const statutoryWeeks = serviceYears.reduce(
    (total, year) => total + year.weeksPay,
    0,
  );
  const statutoryPay = statutoryWeeks * weeklyPayUsed;
  const enhancedWeeklyPayUsed =
    input.enhancedMultiplier === undefined
      ? null
      : input.enhancedUsesActualWeeklyPay
        ? input.grossWeeklyPay
        : weeklyPayUsed;
  const enhancedEstimate =
    input.enhancedMultiplier === undefined || enhancedWeeklyPayUsed === null
      ? null
      : statutoryWeeks * enhancedWeeklyPayUsed * input.enhancedMultiplier;

  return {
    eligible,
    completedServiceYears,
    countedServiceYears,
    ignoredServiceYears: Math.max(
      0,
      completedServiceYears - countedServiceYears,
    ),
    ageAtRedundancy,
    weeklyPayCap,
    weeklyPayUsed,
    statutoryWeeks,
    statutoryPay,
    enhancedEstimate,
    enhancedWeeklyPayUsed,
    potentiallyTaxFreeAmount: Math.min(
      enhancedEstimate ?? statutoryPay,
      redundancyRules.terminationPaymentTaxThreshold,
    ),
    serviceYears,
  };
}

export function formatRedundancyDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(value, "date"));
}

