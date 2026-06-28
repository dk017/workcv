export type NoticeUnit = "days" | "weeks" | "months";
export type NoticeTargetKind = "new-start" | "last-day";

export type NoticePeriod = {
  amount: number;
  unit: NoticeUnit;
};

export type NoticeCalculationInput = {
  employmentStartDate: string;
  contractualPeriod: NoticePeriod | null;
  targetKind: NoticeTargetKind;
  targetDate: string;
  noticeGivenDate: string;
};

export type NoticeCalculation = {
  noticeGivenDate: string;
  noticeStartsDate: string | null;
  minimumEmploymentEndDate: string;
  earliestNewStartDate: string;
  targetEmploymentEndDate: string;
  latestNoticeDate: string | null;
  targetMet: boolean;
  daysMargin: number;
  completedServiceMonths: number;
  completedServiceYears: number;
  employeeStatutoryNoticeWeeks: number;
  employerStatutoryNoticeWeeks: number;
  effectiveNoticeSource: "contract" | "statutory" | "both" | "none";
  effectiveNoticeLabel: string;
};

export class NoticeCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoticeCalculationError";
  }
}

const dayMs = 24 * 60 * 60 * 1_000;
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseIsoDate(value: string) {
  const match = isoDatePattern.exec(value);
  if (!match) throw new NoticeCalculationError("Enter a valid date.");

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  if (formatIsoDate(date) !== value) {
    throw new NoticeCalculationError("Enter a valid date.");
  }
  return date;
}

function formatIsoDate(date: Date) {
  return [
    date.getUTCFullYear().toString().padStart(4, "0"),
    (date.getUTCMonth() + 1).toString().padStart(2, "0"),
    date.getUTCDate().toString().padStart(2, "0"),
  ].join("-");
}

export function addCalendarDays(value: string, amount: number) {
  const date = parseIsoDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return formatIsoDate(date);
}

function daysInMonth(year: number, zeroBasedMonth: number) {
  return new Date(Date.UTC(year, zeroBasedMonth + 1, 0)).getUTCDate();
}

export function addCalendarMonths(value: string, amount: number) {
  const source = parseIsoDate(value);
  const sourceDay = source.getUTCDate();
  const sourceLastDay = daysInMonth(source.getUTCFullYear(), source.getUTCMonth());
  const sourceIsMonthEnd = sourceDay === sourceLastDay;

  const targetMonthIndex = source.getUTCMonth() + amount;
  const targetYear =
    source.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const targetLastDay = daysInMonth(targetYear, targetMonth);
  const targetDay = sourceIsMonthEnd
    ? targetLastDay
    : Math.min(sourceDay, targetLastDay);

  return formatIsoDate(new Date(Date.UTC(targetYear, targetMonth, targetDay)));
}

export function calculateNoticeEndDate(
  noticeGivenDate: string,
  period: NoticePeriod,
) {
  if (!Number.isInteger(period.amount) || period.amount < 0) {
    throw new NoticeCalculationError("Enter a valid notice period.");
  }
  if (period.unit === "days") {
    return addCalendarDays(noticeGivenDate, period.amount);
  }
  if (period.unit === "weeks") {
    return addCalendarDays(noticeGivenDate, period.amount * 7);
  }
  return addCalendarMonths(noticeGivenDate, period.amount);
}

export function completedServiceMonths(
  employmentStartDate: string,
  asOfDate: string,
) {
  const start = parseIsoDate(employmentStartDate);
  const asOf = parseIsoDate(asOfDate);
  if (start.getTime() > asOf.getTime()) {
    throw new NoticeCalculationError(
      "Your employment start date cannot be after the notice date.",
    );
  }

  let months =
    (asOf.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    asOf.getUTCMonth() -
    start.getUTCMonth();
  if (addCalendarMonths(employmentStartDate, months) > asOfDate) months -= 1;
  return Math.max(0, months);
}

export function statutoryNoticeForService(serviceMonths: number) {
  const completedYears = Math.floor(serviceMonths / 12);
  return {
    employeeWeeks: serviceMonths >= 1 ? 1 : 0,
    employerWeeks:
      serviceMonths < 1
        ? 0
        : serviceMonths < 24
          ? 1
          : Math.min(12, completedYears),
  };
}

export function describeNoticePeriod(period: NoticePeriod | null) {
  if (!period) return "No contractual period entered";
  const unit =
    period.amount === 1 ? period.unit.slice(0, -1) : period.unit;
  return `${period.amount} ${unit}`;
}

function differenceInDays(laterDate: string, earlierDate: string) {
  return Math.round(
    (parseIsoDate(laterDate).getTime() - parseIsoDate(earlierDate).getTime()) /
      dayMs,
  );
}

function effectiveNoticeEnd(
  employmentStartDate: string,
  noticeGivenDate: string,
  contractualPeriod: NoticePeriod | null,
) {
  const serviceMonths = completedServiceMonths(
    employmentStartDate,
    noticeGivenDate,
  );
  const { employeeWeeks } = statutoryNoticeForService(serviceMonths);
  const statutoryEnd =
    employeeWeeks > 0
      ? calculateNoticeEndDate(noticeGivenDate, {
          amount: employeeWeeks,
          unit: "weeks",
        })
      : noticeGivenDate;
  const contractEnd = contractualPeriod
    ? calculateNoticeEndDate(noticeGivenDate, contractualPeriod)
    : noticeGivenDate;

  if (contractEnd === statutoryEnd) {
    return {
      endDate: contractEnd,
      source:
        contractEnd === noticeGivenDate
          ? ("none" as const)
          : ("both" as const),
      employeeWeeks,
    };
  }
  if (contractEnd > statutoryEnd) {
    return {
      endDate: contractEnd,
      source: "contract" as const,
      employeeWeeks,
    };
  }
  return {
    endDate: statutoryEnd,
    source: "statutory" as const,
    employeeWeeks,
  };
}

function findLatestNoticeDate(
  employmentStartDate: string,
  targetEmploymentEndDate: string,
  contractualPeriod: NoticePeriod | null,
) {
  let low = parseIsoDate(employmentStartDate).getTime();
  let high = parseIsoDate(targetEmploymentEndDate).getTime();

  if (
    effectiveNoticeEnd(
      employmentStartDate,
      employmentStartDate,
      contractualPeriod,
    ).endDate > targetEmploymentEndDate
  ) {
    return null;
  }

  while (low < high) {
    const midpointDays = Math.ceil((high - low) / dayMs / 2);
    const midpoint = low + midpointDays * dayMs;
    const candidate = formatIsoDate(new Date(midpoint));
    const endDate = effectiveNoticeEnd(
      employmentStartDate,
      candidate,
      contractualPeriod,
    ).endDate;

    if (endDate <= targetEmploymentEndDate) {
      low = midpoint;
    } else {
      high = midpoint - dayMs;
    }
  }

  return formatIsoDate(new Date(low));
}

export function calculateNoticePeriod(
  input: NoticeCalculationInput,
): NoticeCalculation {
  const noticeGiven = parseIsoDate(input.noticeGivenDate);
  const target = parseIsoDate(input.targetDate);
  parseIsoDate(input.employmentStartDate);

  if (input.contractualPeriod) {
    const { amount, unit } = input.contractualPeriod;
    const maximum = unit === "days" ? 365 : unit === "weeks" ? 52 : 24;
    if (!Number.isInteger(amount) || amount < 1 || amount > maximum) {
      throw new NoticeCalculationError(
        `Enter between 1 and ${maximum} ${unit}.`,
      );
    }
  }

  const targetEmploymentEndDate =
    input.targetKind === "new-start"
      ? addCalendarDays(input.targetDate, -1)
      : input.targetDate;
  if (parseIsoDate(targetEmploymentEndDate).getTime() < noticeGiven.getTime()) {
    throw new NoticeCalculationError(
      input.targetKind === "new-start"
        ? "Your target start date must be after the notice date."
        : "Your target end date cannot be before the notice date.",
    );
  }

  const serviceMonths = completedServiceMonths(
    input.employmentStartDate,
    input.noticeGivenDate,
  );
  const statutory = statutoryNoticeForService(serviceMonths);
  const effective = effectiveNoticeEnd(
    input.employmentStartDate,
    input.noticeGivenDate,
    input.contractualPeriod,
  );
  const minimumEmploymentEndDate = effective.endDate;
  const earliestNewStartDate = addCalendarDays(minimumEmploymentEndDate, 1);
  const daysMargin = differenceInDays(
    targetEmploymentEndDate,
    minimumEmploymentEndDate,
  );
  const latestNoticeDate = findLatestNoticeDate(
    input.employmentStartDate,
    targetEmploymentEndDate,
    input.contractualPeriod,
  );

  const effectiveNoticeLabel =
    effective.source === "statutory"
      ? "1 week statutory minimum"
      : effective.source === "both"
        ? input.contractualPeriod
          ? `${describeNoticePeriod(input.contractualPeriod)} (contract and statutory minimum)`
          : "1 week statutory minimum"
        : effective.source === "contract"
          ? describeNoticePeriod(input.contractualPeriod)
          : "No minimum notice period";

  return {
    noticeGivenDate: input.noticeGivenDate,
    noticeStartsDate:
      effective.source === "none"
        ? null
        : addCalendarDays(input.noticeGivenDate, 1),
    minimumEmploymentEndDate,
    earliestNewStartDate,
    targetEmploymentEndDate,
    latestNoticeDate,
    targetMet: daysMargin >= 0,
    daysMargin,
    completedServiceMonths: serviceMonths,
    completedServiceYears: Math.floor(serviceMonths / 12),
    employeeStatutoryNoticeWeeks: statutory.employeeWeeks,
    employerStatutoryNoticeWeeks: statutory.employerWeeks,
    effectiveNoticeSource: effective.source,
    effectiveNoticeLabel,
  };
}

export function formatUkDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(value));
}

export function todayIsoDate() {
  const now = new Date();
  return [
    now.getFullYear().toString().padStart(4, "0"),
    (now.getMonth() + 1).toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
  ].join("-");
}

