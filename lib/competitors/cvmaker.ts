import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-cvmaker";

export const cvmaker: Competitor = {
  slug: "cvmaker",
  name: "CVmaker",
  domain: "cvmaker.uk",
  homepage: "https://www.cvmaker.uk/",
  summary:
    "A UK-facing CV and cover letter builder with a free Basic plan for writing and a monthly Pro plan for downloads.",
  category: "Free-to-write, subscription-to-download builder",
  vsPath,
  altPath: "/cvmaker-alternative",
  pricing: {
    headline: "7-day trial, then about £20–£22 a month",
    rows: [
      ["Pricing page", "£2.95 for 7 days, then £21.99 a month"],
      ["Help article", "£0.99 for 7 days, then £19.99 a month"],
      ["Free Basic plan", "Write unlimited CVs and cover letters; no downloads"],
      ["Refunds", "No refund or pro-rata refund for the current period after cancelling"],
    ],
    confidence: "uk-page-conflict",
    note: "CVmaker's own pricing page and its help article show different trial and monthly prices. The amount at checkout is the one that applies.",
    sourceUrl: "https://www.cvmaker.uk/pricing",
  },
  facts: {
    billing: "Short trial (£0.99 or £2.95 for 7 days), then renews monthly (£19.99 or £21.99) until cancelled.",
    free: "Free Basic plan: create unlimited CVs and cover letters, but downloading needs Pro.",
    formats: "Downloads with Pro (unlimited CV and cover letter downloads).",
    coverLetters: "Yes. Write and save cover letters free; download with Pro.",
    ai: "Yes. AI assistance is included in the free Basic plan.",
    ats: "Not a headline feature on the pages we checked.",
    design: "Simple, modern, professional and creative template ranges.",
    afterPaying: "Access continues until the date in the cancellation email, then downloads stop.",
    bestFor: "Writing several CVs and cover letters free, then paying for a month of downloads.",
  },
  switching: {
    summary:
      "CVmaker's terms say cancellation can be done in your account or by contacting the company, takes effect immediately with a confirmation email showing your access end date, and gives no refund for the current period. Download your files before that date.",
    href: "https://www.cvmaker.uk/help/how-do-i-cancel-my-subscription",
    label: "CVmaker: cancel your subscription",
  },
  sources: [
    ["CVmaker pricing", "https://www.cvmaker.uk/pricing"],
    ["CVmaker costs (help)", "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk"],
    ["CVmaker terms and conditions", "https://www.cvmaker.uk/terms-and-conditions"],
    ["CVmaker cancellation help", "https://www.cvmaker.uk/help/how-do-i-cancel-my-subscription"],
    ["CVmaker on your statement", "https://www.cvmaker.uk/help/is-cvmaker-uk-on-your-bank-or-credit-card-statement"],
  ],
  vs: {
    title: "WorkCV vs CVmaker 2026: Free to Write, Paid to Download",
    description:
      "CVmaker lets you write CVs free but downloads need a monthly Pro plan (about £20–£22). WorkCV is £7.99 once per CV. Compare cost, AI and cover letters.",
    answer:
      "CVmaker is the better fit if you want AI help and cover letters, and plan to download everything within one paid month. WorkCV is the better fit if you want one UK CV and a single £7.99 payment, with no monthly plan. Both let you write before paying; the difference is a one-off charge versus a renewing subscription.",
    verdict: [
      "CVmaker and WorkCV share the same idea: write first, pay to download. CVmaker's free Basic plan is generous, with unlimited CVs and cover letters and AI assistance, but every download needs Pro, which renews monthly after a 7-day trial.",
      "CVmaker's own pages disagree on price: the pricing page shows £2.95 for 7 days then £21.99 a month, while a help article shows £0.99 then £19.99. Its terms add that cancelling gives no refund for the current period.",
      "WorkCV charges £7.99 once for the saved CV, and the paid CV stays editable with no renewal. It has no AI writing and no cover letter builder in the editor. If you will use CVmaker's AI and cover letters, its Pro month can be worth it; if not, a one-off payment is cheaper and simpler.",
    ],
    competitorBetter: [
      "You want AI help writing your CV, free while drafting",
      "You need several CVs and cover letters downloaded in one go",
      "You want to search vacancies inside the same tool",
      "You are comfortable cancelling within the 7-day trial",
    ],
    workcvBetter: [
      "You want a fixed £7.99 price rather than a monthly plan",
      "You do not want to manage a cancellation date",
      "You want to keep editing and redownloading the same CV later",
      "You are writing the content yourself",
    ],
    faqs: [
      {
        question: "Is CVmaker free?",
        answer:
          "Writing is free. CVmaker's Basic plan lets you create unlimited CVs and cover letters with AI assistance, but downloading them needs a Pro plan, which renews monthly after a 7-day trial.",
      },
      {
        question: "How much does CVmaker Pro cost?",
        answer:
          "CVmaker's pricing page lists £2.95 for 7 days, then £21.99 a month. Its help article lists £0.99 for 7 days, then £19.99 a month. The checkout price is the one that applies. Checked 30 October 2026.",
      },
      {
        question: "Is WorkCV cheaper than CVmaker?",
        answer:
          "For one CV, yes. A 7-day trial plus one month of CVmaker Pro costs £20.98 to £24.94, depending on which of CVmaker's published prices applies. WorkCV is £7.99 once for one saved CV, with no renewal.",
      },
      {
        question: "Does CVmaker refund the rest of the month if I cancel?",
        answer:
          "No. CVmaker's terms say cancelling stops the next renewal but there is no refund or pro-rata refund for the current period. Access continues until the date in your cancellation email.",
      },
      {
        question: "Does WorkCV have AI like CVmaker?",
        answer:
          "No. WorkCV has no AI writing. It provides a UK CV structure and prompts, and only uses AI to read a CV you import.",
      },
    ],
  },
  alt: {
    title: "CVmaker Alternatives UK 2026: Download Without Pro",
    description:
      "CVmaker downloads need a monthly Pro plan. Compare 6 UK alternatives that download free or charge once, with prices checked October 2026.",
    answer:
      "The closest CVmaker alternative without a monthly plan is WorkCV: build and preview free, then pay £7.99 once to download your UK CV. For a free download, FlowCV's free plan exports watermark-free PDFs, and Barclays LifeSkills exports a free Word CV.",
    why: [
      "You can write for free, but every download requires Pro, which renews monthly.",
      "CVmaker's own pages show two different prices, which makes the cost unclear.",
      "Cancelling gives no refund for the rest of the current period.",
    ],
    options: [
      workcvOption(vsPath, "Same write-first approach, but one £7.99 payment instead of a monthly Pro plan."),
      { slug: "flowcv", why: "Downloads are free: the free plan includes unlimited watermark-free PDFs." },
      { slug: "kickresume", why: "Free downloads in PDF or Word on free design options, with AI on Premium." },
      { slug: "novoresume", why: "A one-off monthly Pro Pass that does not renew, if you want premium tools for a month." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "What is a free alternative to CVmaker?",
        answer:
          "FlowCV's free plan downloads PDFs without a watermark, Kickresume's free plan downloads PDF or Word on free options, and Barclays LifeSkills exports a Word CV for free. WorkCV's blank Word template is also free with no sign-up.",
      },
      {
        question: "Is there a CVmaker alternative that charges once?",
        answer:
          "Yes. WorkCV charges £7.99 once per saved CV, with no renewal. Novorésumé's Pro Pass is a single payment for one month that does not renew.",
      },
      {
        question: "Why is CVmaker on my bank statement?",
        answer:
          "It is likely the Pro subscription renewing after the 7-day trial. CVmaker has a help article on identifying its charges; cancel in your account if you do not want to continue.",
      },
      {
        question: "Can I take my CVmaker CV to another builder?",
        answer:
          "Download it while Pro is active, then import the file. WorkCV's Import CV reads PDF and Word files so you can edit without retyping.",
      },
      {
        question: "Which CVmaker alternative is best for UK jobs?",
        answer:
          "For a conventional UK CV, choose a single-column layout with a personal statement, work history, education and skills. WorkCV and its free Word template follow that structure.",
      },
    ],
  },
  asAlternative: {
    bestFor: "Writing CVs and cover letters free with AI help",
    price: "Free to write; Pro about £20–£22 a month",
    tradeOff: "Every download needs Pro, which renews monthly.",
  },
  related: ["myperfectcv", "livecareer", "flowcv"],
};
