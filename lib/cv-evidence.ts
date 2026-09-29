// Copy for the "safe vs specific" and "what the guidance says" sections.
// Contrast rows are illustrative examples, not claims about real people.

export type EvidenceRow = {
  role: string;
  safe: string;
  specific: string;
};

export const evidenceRows: EvidenceRow[] = [
  {
    role: "Customer service",
    safe: "Excellent communication skills.",
    specific: "Handled around 60 calls a day and resolved most complaints without passing them to a supervisor.",
  },
  {
    role: "Care worker",
    safe: "Caring and compassionate.",
    specific: "Supported eight residents on a dementia unit with personal care, medication prompts and daily care notes.",
  },
  {
    role: "Warehouse",
    safe: "Hard-working and reliable.",
    specific: "Kept a pick rate of 150 units an hour at 99.8% accuracy and covered weekend shifts at short notice.",
  },
  {
    role: "Retail",
    safe: "Good team player.",
    specific: "Trained four new starters on the till, refunds and opening checks during the Christmas peak.",
  },
  {
    role: "Delivery driver",
    safe: "Good time management.",
    specific: "Completed 110 to 140 drops a day across Leeds with a 99% first-time delivery rate.",
  },
  {
    role: "Graduate",
    safe: "Strong analytical skills.",
    specific: "Analysed 2,000 survey responses in Excel for my dissertation and presented the findings to staff.",
  },
];

export const forgottenDetails = [
  "You covered extra shifts when the team was short",
  "You trained or buddied new starters",
  "You were trusted with keys, the cash-up or the float",
  "You calmed an angry customer and kept their business",
  "You hold a licence or ticket: forklift, CSCS, SIA, food hygiene or a full UK driving licence",
  "You kept records accurate: care notes, stock counts or delivery logs",
  "You speak another language at work",
  "You fixed something that kept going wrong",
];

export type GuidanceQuote = {
  quote: string;
  source: string;
  context: string;
  href: string;
};

// Verbatim, checked against the source page on 30 September 2026. Keep quotes short and attributed.
export const guidanceQuotes: GuidanceQuote[] = [
  {
    quote: "Today's recruiters skim resumes for an average of 7.4 seconds.",
    source: "HR Dive",
    context: "Reporting Ladders' 2018 eye-tracking study of recruiters",
    href: "https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/",
  },
  {
    quote: "Avoid generic, over-used phrases such as 'team player', 'hardworking' and 'multitasker'.",
    source: "Prospects",
    context: "How to write a CV",
    href: "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  },
  {
    quote: "Anyone can write on their CV that they are able to remain calm under pressure.",
    source: "Prospects",
    context: "On backing up claims with evidence",
    href: "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  },
  {
    quote: "Make your introduction sound like you're the right person for the job.",
    source: "National Careers Service",
    context: "How to write a CV",
    href: "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  },
];

export type RecruiterQuote = {
  quote: string;
  name: string;
  role: string;
  company: string;
  // Date the person agreed, in writing, to be quoted with their name. Never add a quote without it.
  permissionDate: string;
};

// Real UK recruiter or hiring-manager quotes, added only with written permission.
// The section stays hidden while this list is empty.
export const recruiterQuotes: RecruiterQuote[] = [];
