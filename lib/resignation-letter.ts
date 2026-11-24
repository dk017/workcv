import {
  NoticeCalculationError,
  calculateNoticePeriod,
  describeNoticePeriod,
  formatUkDate,
  type NoticePeriod,
} from "./notice-period-calculator.ts";

// Builds a UK resignation letter and email from the visitor's details. The last
// day comes from the same notice rules as the notice period calculator: the
// longer of the contract and the statutory minimum, counted from the day after
// the letter is handed in.

export type ResignationInput = {
  name: string;
  managerName: string;
  jobTitle: string;
  employer: string;
  letterDate: string;
  employmentStartDate: string;
  contractualPeriod: NoticePeriod | null;
  /** A later last day the visitor would prefer. Ignored when empty. */
  preferredLastDay?: string;
  reason?: string;
  thanks: boolean;
  askHolidayPay: boolean;
  offerHandover: boolean;
};

export type ResignationResult =
  | {
      ok: true;
      lastDay: string;
      minimumLastDay: string;
      noticeLabel: string;
      noticeSource: "contract" | "statutory" | "both" | "none";
      letter: string;
      emailSubject: string;
      emailBody: string;
    }
  | { ok: false; error: string };

const or = (value: string, placeholder: string) => value.trim() || placeholder;

export function buildResignation(input: ResignationInput): ResignationResult {
  let notice;
  try {
    notice = calculateNoticePeriod({
      employmentStartDate: input.employmentStartDate,
      contractualPeriod: input.contractualPeriod,
      targetKind: "last-day",
      targetDate: input.letterDate,
      noticeGivenDate: input.letterDate,
    });
  } catch (error) {
    return { ok: false, error: error instanceof NoticeCalculationError ? error.message : "Check the dates and try again." };
  }

  const minimumLastDay = notice.minimumEmploymentEndDate;
  const preferred = input.preferredLastDay?.trim();
  if (preferred && preferred < minimumLastDay) {
    return {
      ok: false,
      error: `Your notice runs until ${formatUkDate(minimumLastDay)}. To leave earlier, ask your employer to agree it, and get the agreement in writing.`,
    };
  }
  const lastDay = preferred || minimumLastDay;
  const source = notice.effectiveNoticeSource;
  const noticeLabel =
    source === "contract" || (source === "both" && input.contractualPeriod)
      ? describeNoticePeriod(input.contractualPeriod)
      : source === "none"
        ? "no minimum notice"
        : "1 week";

  const role = or(input.jobTitle, "[job title]");
  const employer = or(input.employer, "[employer]");
  const lastDayText = formatUkDate(lastDay);

  const noticeSentence =
    source === "none"
      ? `As I have worked here for less than a month, I understand no minimum notice period applies, and I would like my last day to be ${lastDayText}.`
      : preferred && preferred > minimumLastDay
        ? `My notice period is ${noticeLabel}, and I would like my last day of employment to be ${lastDayText}.`
        : input.contractualPeriod
          ? `My notice period is ${noticeLabel}, so I understand my last day of employment will be ${lastDayText}. Please let me know if you calculate it differently.`
          : `I am giving ${noticeLabel}'s notice, so I understand my last day of employment will be ${lastDayText}. Please let me know if my contract requires a different notice period.`;

  const paragraphs = [
    `Please accept this as formal notice of my resignation from my position as ${role} at ${employer}.`,
    noticeSentence,
    input.reason?.trim() ? input.reason.trim() : "",
    input.offerHandover ? "I will do everything I can to hand over my work smoothly before I leave. Please let me know what you need from me." : "",
    input.askHolidayPay ? "Please could you confirm how much accrued holiday I have left, and what I will be paid in my final salary." : "",
    input.thanks ? `Thank you for the support and opportunities I have had during my time at ${employer}.` : "",
  ].filter(Boolean);

  const name = or(input.name, "[Your name]");
  const greeting = `Dear ${or(input.managerName, "[manager's name]")},`;
  const letter = [formatUkDate(input.letterDate), "", greeting, "", ...paragraphs.flatMap((p) => [p, ""]), "Yours sincerely,", "", name].join("\n");
  const emailBody = [greeting, "", ...paragraphs.flatMap((p) => [p, ""]), "Kind regards,", name].join("\n");

  return {
    ok: true,
    lastDay,
    minimumLastDay,
    noticeLabel,
    noticeSource: source,
    letter,
    emailSubject: `Resignation: ${input.name.trim() ? `${input.name.trim()}, ` : ""}${role}`,
    emailBody,
  };
}
