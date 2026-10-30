import { calculateRedundancyPay, redundancyRules } from "./redundancy-pay-calculator.ts";

// Worked statutory redundancy examples produced by the same calculator the
// page uses, so the table can never disagree with the tool. Assumes Great
// Britain, continuous service and a redundancy date of 1 October 2026.
export const redundancyExampleDate = "2026-10-01";
export const redundancyExamplePayLevels = [500, 900] as const;

export const redundancyExampleScenarios = [
  { age: 25, years: 4 },
  { age: 35, years: 10 },
  { age: 45, years: 10 },
  { age: 49, years: 15 },
  { age: 50, years: 15 },
  { age: 55, years: 20 },
  { age: 58, years: 25 },
  { age: 62, years: 30 },
] as const;

function yearsBefore(isoDate: string, years: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${String(y - years).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function redundancyExamples() {
  return redundancyExampleScenarios.map(({ age, years }) => {
    const byPay = redundancyExamplePayLevels.map((grossWeeklyPay) => {
      const result = calculateRedundancyPay({
        // Born one day before the anniversary, so the age is exactly `age`.
        dateOfBirth: yearsBefore("2026-09-30", age),
        employmentStartDate: yearsBefore(redundancyExampleDate, years),
        redundancyDate: redundancyExampleDate,
        grossWeeklyPay,
        jurisdiction: "great-britain",
      });
      return { grossWeeklyPay, weeks: result.statutoryWeeks, pay: result.statutoryPay, counted: result.countedServiceYears };
    });
    return { age, years, counted: byPay[0].counted, weeks: byPay[0].weeks, atFiveHundred: byPay[0].pay, atCap: byPay[1].pay };
  });
}

export const redundancyExampleCap = redundancyRules.greatBritainWeeklyCap;
