// One short CV line per right-to-work situation. Shared by the line picker and
// the wording table on /right-to-work-cv-uk.

export type RightToWorkSituation = {
  id: string;
  label: string;
  line: string;
  note: string;
  needsSponsor?: boolean;
};

export const rightToWorkSituations: RightToWorkSituation[] = [
  {
    id: "citizen",
    label: "British or Irish citizen",
    line: "Right to work in the UK.",
    note: "No need to add passport details or nationality unless it is relevant and you choose to.",
  },
  {
    id: "settled",
    label: "Settled or pre-settled status, or indefinite leave",
    line: "Right to work in the UK. No visa sponsorship required.",
    note: "Leave out your share code and status reference. The employer checks those separately.",
  },
  {
    id: "limited",
    label: "Visa with permission to work (for example Graduate or dependant)",
    line: "Right to work in the UK; details available for employer checks.",
    note: "Avoid oversharing dates or document numbers on the CV. Be ready to explain accurately during hiring, including if the role would need sponsorship later.",
  },
  {
    id: "sponsor",
    label: "I need visa sponsorship",
    line: "Requires Skilled Worker visa sponsorship.",
    note: "Being upfront saves wasted applications. Apply to employers that hold a sponsor licence, for roles that can be sponsored.",
    needsSponsor: true,
  },
  {
    id: "overseas",
    label: "Applying from overseas, right to work starts later",
    line: "Eligible to work in the UK from [month/year], subject to employer right to work checks.",
    note: "Use cautious wording if your right to work starts later or depends on a process. Replace [month/year] before you send it.",
  },
];
