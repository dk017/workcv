import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-livecareer";

export const livecareer: Competitor = {
  slug: "livecareer",
  name: "LiveCareer",
  domain: "livecareer.co.uk",
  homepage: "https://www.livecareer.co.uk/",
  owner: "BOLD LLC",
  summary:
    "An AI CV and cover letter builder from BOLD LLC, sold in the UK as £1.95 14-day access that renews every four weeks.",
  category: "Subscription CV and cover letter builder",
  vsPath,
  altPath: "/livecareer-alternative",
  pricing: {
    headline: "£1.95 for 14 days, then £19.85 every 4 weeks",
    rows: [
      ["14-day access", "£1.95"],
      ["After 14 days", "£19.85 every 4 weeks until cancelled"],
      ["Annual plan", "£83.40 (shown as £6.95 a month)"],
      ["Guarantee", "Money back if unhappy in the first 14 days"],
    ],
    confidence: "uk-page",
    note: "LiveCareer's pricing page says the annual £83.40 is billed annually, but its FAQ wording is ambiguous. Confirm the billing frequency at checkout.",
    sourceUrl: "https://www.livecareer.co.uk/pricing",
    plans: [
      { label: "14-day access, then 4-weekly", first: { price: 1.95, days: 14 }, price: 19.85, days: 28 },
      { label: "Annual plan", price: 83.4, days: 365 },
    ],
  },
  facts: {
    billing: "£1.95 for 14 days, then renews automatically at £19.85 every 4 weeks. Annual plan £83.40.",
    free: "Build CVs and cover letters free; free downloads are plain text (TXT) only. PDF and Word need a paid plan.",
    formats: "TXT free; PDF and Word with a paid plan.",
    coverLetters: "Yes. CV and cover letter builder in one account.",
    ai: "Yes. Markets itself as an AI-powered CV maker.",
    ats: "Not a headline feature on the pages we checked.",
    design: "A template library covering several CV styles.",
    afterPaying: "Paid features stop when the plan ends; download your files first.",
    bestFor: "Short, intensive use of AI CV and cover letter tools.",
  },
  switching: {
    summary:
      "LiveCareer's help pages say you can cancel at any time, on the 14-day or annual plan, from your online dashboard. Download your documents first, cancel before the next renewal date and keep the cancellation email. Charges can appear as LiveCareer.co.uk, BLD*Livecareer.co.uk or PayPal *LIVECAREER.",
    href: "https://www.livecareer.co.uk/contact-us",
    label: "LiveCareer UK contact and help",
  },
  sources: [
    ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
    ["LiveCareer UK contact", "https://www.livecareer.co.uk/contact-us"],
    ["LiveCareer UK terms of service", "https://www.livecareer.co.uk/terms-of-service"],
    ["Bold company timeline", "https://www.bold.com/"],
  ],
  vs: {
    title: "WorkCV vs LiveCareer 2026: £1.95 Trial vs £7.99 Once",
    description:
      "LiveCareer is £1.95 for 14 days, then £19.85 every 4 weeks. WorkCV is £7.99 once per CV with no renewal. See the real cost over 1, 3 and 12 months.",
    answer:
      "LiveCareer is the better choice if you want AI to write your CV and cover letter content, and you will cancel before the £19.85 four-weekly renewal. WorkCV is the better choice if you want a UK CV and cover letter for a single £7.99 payment and nothing to cancel. LiveCareer's £1.95 is cheaper only if you finish within 14 days.",
    verdict: [
      "LiveCareer, operated by BOLD LLC like Zety, is a broad AI career-document builder. Its £1.95 entry price is one of the lowest in the UK, but it buys 14 days. After that, the plan renews at £19.85 every four weeks: £21.80 for a month and £61.50 for three months.",
      "WorkCV is narrower and UK-only. You build and preview a CV and matching cover letter free, then pay £7.99 once to download both as PDF and Word. Its AI suggests bullets and a profile summary that you approve, rather than drafting the whole CV, and the paid CV never expires.",
      "If you want AI to draft your CV and a cover letter this week, and you are organised about cancelling, LiveCareer's trial can be good value. If you would rather write your own CV and pay once, WorkCV is the simpler and, beyond two weeks, cheaper route.",
    ],
    competitorBetter: [
      "You want AI to draft much of your CV content",
      "You will finish and cancel within the 14-day £1.95 window",
      "You want a 14-day money-back guarantee on the subscription",
      "You prefer choosing from a wider template library",
    ],
    workcvBetter: [
      "You want one payment and no renewal to track",
      "You write your own content and want AI suggestions you approve",
      "You want to preview the complete CV before paying",
      "You expect to update the same CV again in a few months",
      "You want the cost fixed at £7.99 however long it takes",
    ],
    faqs: [
      {
        question: "Is LiveCareer cheaper than WorkCV?",
        answer:
          "Only for the first 14 days. LiveCareer costs £1.95 for 14 days, then £19.85 every 4 weeks, so a month costs £21.80 and three months £61.50. WorkCV costs £7.99 once for one saved CV and its cover letter. Prices checked 30 October 2026.",
      },
      {
        question: "Does LiveCareer have a money-back guarantee?",
        answer:
          "LiveCareer's UK pricing page offers money back if you are unhappy during the first 14 days of a subscription. Check the current terms on its pricing page before you rely on it.",
      },
      {
        question: "Is LiveCareer the same company as Zety?",
        answer:
          "Yes. Both name BOLD LLC in their terms. Bold's own timeline says it started with LiveCareer and acquired Zety in 2019.",
      },
      {
        question: "Does WorkCV include cover letters like LiveCareer?",
        answer:
          "Yes. Every WorkCV CV has a matching cover letter in the same design, and the £7.99 payment downloads both as PDF and Word.",
      },
      {
        question: "Can I move my LiveCareer CV to WorkCV?",
        answer:
          "Yes. Download your CV from LiveCareer as a PDF or Word file, then use Import CV in the WorkCV editor so you do not have to retype it; importing asks for your email and a one-time code. Cancel LiveCareer separately; importing does not stop its billing.",
      },
    ],
  },
  alt: {
    title: "LiveCareer Alternatives UK 2026: 6 Cheaper Options",
    description:
      "LiveCareer's £1.95 trial renews at £19.85 every 4 weeks. Compare 6 UK alternatives, including free builders and £7.99 one-off CVs, checked October 2026.",
    answer:
      "If you are leaving LiveCareer because of the £19.85 four-weekly renewal, the closest no-subscription alternative is WorkCV at £7.99 once per CV. FlowCV and Kickresume have free plans that download a CV, and Novorésumé sells a one-off monthly pass with nothing recurring.",
    why: [
      "The £1.95 entry price covers only 14 days before the £19.85 four-weekly renewal starts.",
      "A job search often takes longer than a fortnight, so the renewal is easy to trigger by accident.",
      "People who write their own content are paying every four weeks for AI drafting they may not use.",
    ],
    options: [
      workcvOption(vsPath, "One £7.99 payment for a UK CV and cover letter you build and preview first. No renewal and no cancellation step."),
      { slug: "flowcv", why: "Free plan with unlimited watermark-free PDF downloads for one CV." },
      { slug: "kickresume", why: "Free plan downloads without a watermark if you avoid premium design options; Premium adds AI." },
      { slug: "novoresume", why: "A one-off Pro Pass covers a month with nothing recurring, if you still want premium tools." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "What is a cheaper alternative to LiveCareer?",
        answer:
          "Free options are cheapest: FlowCV's free plan, Kickresume's free plan, WorkCV's free Word template and Barclays LifeSkills. For a guided UK CV builder without a subscription, WorkCV is £7.99 once, compared with LiveCareer's £19.85 every 4 weeks after the trial.",
      },
      {
        question: "What is the £19.85 LiveCareer charge?",
        answer:
          "It is LiveCareer UK's renewal price, charged every 4 weeks after the £1.95 14-day access ends, according to its pricing page checked 30 October 2026. It can appear as LiveCareer.co.uk, BLD*Livecareer.co.uk or PayPal *LIVECAREER on your statement.",
      },
      {
        question: "Can I cancel LiveCareer and keep my CV?",
        answer:
          "Download your CV before you cancel. LiveCareer's help pages say cancellation is done from your online dashboard at any time. You can then import the downloaded file into another builder, including WorkCV.",
      },
      {
        question: "Is there a LiveCareer alternative with AI but no subscription?",
        answer:
          "Novorésumé sells a one-off Pro Pass covering one month that does not renew. FlowCV's paid plan includes AI writing at a lower monthly price. WorkCV's editor suggests bullets and a profile summary you approve, with no subscription.",
      },
      {
        question: "Which LiveCareer alternative is best for a UK CV?",
        answer:
          "Choose a tool that uses a UK CV structure: no photo, no date of birth and usually no more than two A4 pages. WorkCV is built only for UK CVs; the free WorkCV Word template follows the same structure.",
      },
    ],
  },
  asAlternative: {
    bestFor: "Two weeks of AI CV and cover letter help",
    price: "£1.95 for 14 days, then £19.85 every 4 weeks",
    tradeOff: "Renews automatically unless cancelled before day 14.",
  },
  related: ["zety", "myperfectcv", "resume-io"],
};
