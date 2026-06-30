export type TaxRegion = "rest-of-uk" | "scotland";
export type StudentLoanPlan = "none" | "plan-1" | "plan-2" | "plan-4" | "plan-5";

export type TakeHomePayInput = {
  annualSalary: number;
  annualBonus: number;
  salarySacrificePension: number;
  taxRegion: TaxRegion;
  studentLoanPlan: StudentLoanPlan;
  hasPostgraduateLoan: boolean;
  hasBlindPersonsAllowance: boolean;
};

export type TakeHomePayResult = {
  grossPay: number;
  adjustedGrossPay: number;
  personalAllowance: number;
  taxablePay: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  postgraduateLoan: number;
  pension: number;
  takeHomePay: number;
  totalDeductions: number;
  effectiveDeductionRate: number;
};

export class TakeHomePayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TakeHomePayError";
  }
}

export const takeHomePayRules = {
  taxYear: "2026/27",
  standardPersonalAllowance: 12_570,
  blindPersonsAllowance: 3_250,
  personalAllowanceTaperStarts: 100_000,
  nationalInsurancePrimaryThreshold: 12_570,
  nationalInsuranceUpperEarningsLimit: 50_270,
  studentLoanThresholds: {
    "plan-1": 26_900,
    "plan-2": 29_385,
    "plan-4": 33_795,
    "plan-5": 25_000,
  } satisfies Record<Exclude<StudentLoanPlan, "none">, number>,
  postgraduateLoanThreshold: 21_000,
} as const;

const restOfUkTaxBands = [
  { upper: 37_700, rate: 0.2 },
  { upper: 125_140, rate: 0.4 },
  { upper: Number.POSITIVE_INFINITY, rate: 0.45 },
] as const;

const scottishTaxBands = [
  { upper: 3_967, rate: 0.19 },
  { upper: 16_956, rate: 0.2 },
  { upper: 31_092, rate: 0.21 },
  { upper: 62_430, rate: 0.42 },
  { upper: 125_140, rate: 0.45 },
  { upper: Number.POSITIVE_INFINITY, rate: 0.48 },
] as const;

function validateMoney(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 10_000_000) {
    throw new TakeHomePayError(`${label} must be between £0 and £10,000,000.`);
  }
}

function taxFromBands(
  taxablePay: number,
  bands: ReadonlyArray<{ upper: number; rate: number }>,
) {
  let tax = 0;
  let lower = 0;

  for (const band of bands) {
    const amountInBand = Math.max(0, Math.min(taxablePay, band.upper) - lower);
    tax += amountInBand * band.rate;
    if (taxablePay <= band.upper) break;
    lower = band.upper;
  }

  return tax;
}

function calculatePersonalAllowance(
  adjustedGrossPay: number,
  hasBlindPersonsAllowance: boolean,
) {
  const taper = Math.max(
    0,
    (adjustedGrossPay - takeHomePayRules.personalAllowanceTaperStarts) / 2,
  );
  const standardAllowance = Math.max(
    0,
    takeHomePayRules.standardPersonalAllowance - taper,
  );
  return (
    standardAllowance +
    (hasBlindPersonsAllowance ? takeHomePayRules.blindPersonsAllowance : 0)
  );
}

export function calculateUkTakeHomePay(
  input: TakeHomePayInput,
): TakeHomePayResult {
  validateMoney(input.annualSalary, "Annual salary");
  validateMoney(input.annualBonus, "Annual bonus");
  validateMoney(input.salarySacrificePension, "Salary-sacrifice pension");

  const grossPay = input.annualSalary + input.annualBonus;
  if (input.salarySacrificePension > grossPay) {
    throw new TakeHomePayError(
      "Salary-sacrifice pension cannot be more than salary plus bonus.",
    );
  }

  const adjustedGrossPay = grossPay - input.salarySacrificePension;
  const personalAllowance = calculatePersonalAllowance(
    adjustedGrossPay,
    input.hasBlindPersonsAllowance,
  );
  const taxablePay = Math.max(0, adjustedGrossPay - personalAllowance);
  const incomeTax = taxFromBands(
    taxablePay,
    input.taxRegion === "scotland" ? scottishTaxBands : restOfUkTaxBands,
  );

  const niMainBand = Math.max(
    0,
    Math.min(
      adjustedGrossPay,
      takeHomePayRules.nationalInsuranceUpperEarningsLimit,
    ) - takeHomePayRules.nationalInsurancePrimaryThreshold,
  );
  const niUpperBand = Math.max(
    0,
    adjustedGrossPay - takeHomePayRules.nationalInsuranceUpperEarningsLimit,
  );
  const nationalInsurance = niMainBand * 0.08 + niUpperBand * 0.02;

  const studentLoanThreshold =
    input.studentLoanPlan === "none"
      ? null
      : takeHomePayRules.studentLoanThresholds[input.studentLoanPlan];
  const studentLoan =
    studentLoanThreshold === null
      ? 0
      : Math.max(0, adjustedGrossPay - studentLoanThreshold) * 0.09;
  const postgraduateLoan = input.hasPostgraduateLoan
    ? Math.max(
        0,
        adjustedGrossPay - takeHomePayRules.postgraduateLoanThreshold,
      ) * 0.06
    : 0;

  const takeHomePay =
    adjustedGrossPay -
    incomeTax -
    nationalInsurance -
    studentLoan -
    postgraduateLoan;
  const totalDeductions = grossPay - takeHomePay;

  return {
    grossPay,
    adjustedGrossPay,
    personalAllowance,
    taxablePay,
    incomeTax,
    nationalInsurance,
    studentLoan,
    postgraduateLoan,
    pension: input.salarySacrificePension,
    takeHomePay,
    totalDeductions,
    effectiveDeductionRate: grossPay === 0 ? 0 : totalDeductions / grossPay,
  };
}

