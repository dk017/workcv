import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-myperfectcv";

export const myperfectcv: Competitor = {
  slug: "myperfectcv",
  name: "MyPerfectCV",
  domain: "myperfectcv.co.uk",
  homepage: "https://www.myperfectcv.co.uk/",
  owner: "BOLD LLC",
  summary:
    "A UK CV and cover letter builder with AI writing tools, sold as 14-day access that renews every four weeks.",
  category: "Subscription CV and cover letter builder",
  vsPath,
  altPath: "/myperfectcv-alternative-uk",
  pricing: {
    headline: "£2.95 for 14 days, then £16.95 every 4 weeks",
    rows: [
      ["14-day access", "£2.95"],
      ["After 14 days", "£16.95 every 4 weeks until cancelled"],
      ["Annual plan", "£59.40 upfront (£4.95 a month), renews yearly"],
      ["Free use", "Build free; free downloads are TXT only, PDF and Word need premium"],
    ],
    confidence: "uk-page",
    note: "Some currency symbols are missing on MyPerfectCV's pricing page; the £ amounts match its homepage and structured data.",
    sourceUrl: "https://www.myperfectcv.co.uk/pricing",
    plans: [
      { label: "14-day access, then 4-weekly", first: { price: 2.95, days: 14 }, price: 16.95, days: 28 },
      { label: "Annual plan", price: 59.4, days: 365 },
    ],
  },
  facts: {
    billing: "£2.95 for 14 days, then renews automatically at £16.95 every 4 weeks. Annual plan £59.40.",
    free: "Build CVs and cover letters free; free downloads are plain text (TXT) only. PDF and Word need premium.",
    formats: "TXT free; PDF and Word (DOC/DOCX) with premium.",
    coverLetters: "Yes. An AI cover letter builder is part of premium.",
    ai: "Yes. An AI CV builder helps write content.",
    ats: "Yes. An ATS CV checker with improvement suggestions.",
    design: "A large library of UK CV templates, including Word-style designs.",
    afterPaying: "PDF and Word downloads are premium, so download final files before access ends.",
    bestFor: "Several CVs and cover letters over a few weeks, with AI help.",
  },
  switching: {
    summary:
      "Download your CV in Word first so you keep an editable copy. Then cancel in your MyPerfectCV account or through its customer service before the next renewal date, and keep the confirmation email. Starting a CV elsewhere does not cancel MyPerfectCV.",
    href: "https://www.myperfectcv.co.uk/contact-us",
    label: "MyPerfectCV help and contact",
  },
  sources: [
    ["MyPerfectCV pricing", "https://www.myperfectcv.co.uk/pricing"],
    ["MyPerfectCV FAQ", "https://www.myperfectcv.co.uk/faq"],
    ["MyPerfectCV terms of use", "https://www.myperfectcv.co.uk/terms-of-use"],
    ["MyPerfectCV contact", "https://www.myperfectcv.co.uk/contact-us"],
  ],
  vs: {
    title: "WorkCV vs MyPerfectCV 2026: Price, Renewal and Features",
    description:
      "MyPerfectCV is £2.95 for 14 days, then £16.95 every 4 weeks. WorkCV is £7.99 once per CV. Compare cost over time, features and who each one suits.",
    answer:
      "MyPerfectCV suits people who want AI to help write their CV and cover letter and a large template library, and who will manage a four-weekly renewal. WorkCV suits people who want a UK CV and matching cover letter, as PDF and Word, for one £7.99 payment with nothing to cancel. If you finish within 14 days, MyPerfectCV's £2.95 access is cheaper; after that, WorkCV costs less.",
    verdict: [
      "Both cover the basics: a UK CV, a matching cover letter, PDF and Word downloads and some AI help. MyPerfectCV, operated by BOLD LLC, adds a larger template library, AI writing tools and an ATS checker inside its premium plan. WorkCV has three UK layouts, AI suggestions you approve one at a time, and a free ATS checker and job tracker.",
      "The biggest difference is billing. MyPerfectCV's £2.95 buys 14 days; if you do not cancel, it continues at £16.95 every four weeks, which is £53.80 over three months. WorkCV charges once per saved CV and the paid CV stays editable, so there is no renewal date to remember.",
      "Choose on how you want to pay and how much writing help you want. If you want AI to draft content and a wide choice of designs for a few weeks, MyPerfectCV fits. If you would rather write your own CV with suggestions and pay once, WorkCV is simpler and costs less once the first fortnight has passed.",
    ],
    competitorBetter: [
      "You want AI to draft content across your CV and cover letter",
      "You want a large library of templates to choose from",
      "You will finish, download and cancel inside the 14-day £2.95 window",
      "You apply all year and the £59.40 annual plan suits you better than one-off payments",
    ],
    workcvBetter: [
      "You want one payment and no renewal date to remember",
      "You want to see the whole CV and letter before paying anything",
      "You write your own content and want suggestions you approve",
      "You may return to edit the same CV months later without paying again",
      "You need several CVs over a few weeks: the £24.99 Job Search Pass covers 90 days",
    ],
    faqs: [
      {
        question: "Is WorkCV cheaper than MyPerfectCV?",
        answer:
          "Yes, unless you finish within 14 days. MyPerfectCV costs £2.95 for the first 14 days and £16.95 every 4 weeks after that, so one month costs £19.90 and three months £53.80. WorkCV is £7.99 once for a saved CV and its cover letter, however long you keep editing them, or £24.99 for 90 days of unlimited CVs. Prices checked 30 October 2026.",
      },
      {
        question: "Does MyPerfectCV renew automatically?",
        answer:
          "Yes. MyPerfectCV's terms say an active subscription renews automatically until you cancel, at the price agreed when you bought it. The 14-day access renews at £16.95 every 4 weeks and the annual plan renews yearly.",
      },
      {
        question: "Do MyPerfectCV and WorkCV both give you a Word file?",
        answer:
          "Yes. MyPerfectCV includes PDF and Word downloads with premium; its free downloads are plain text only. WorkCV's £7.99 payment includes your CV and cover letter as PDF and an editable single-column Word file.",
      },
      {
        question: "Does WorkCV use AI like MyPerfectCV?",
        answer:
          "Partly. WorkCV's editor suggests CV bullets and a profile summary, and nothing changes until you approve each suggestion. MyPerfectCV offers broader AI writing tools for CVs and cover letters within premium.",
      },
      {
        question: "Which is better for a UK CV, WorkCV or MyPerfectCV?",
        answer:
          "Both produce UK-style CVs with matching cover letters. MyPerfectCV is better if you want AI drafting and many templates on a short plan. WorkCV is better if you want a single payment, no subscription and the same CV editable later.",
      },
    ],
  },
  alt: {
    title: "MyPerfectCV Alternatives UK 2026: 6 Options Compared",
    description:
      "Leaving MyPerfectCV's £16.95 four-weekly renewal? Compare 6 UK alternatives, from free Word templates to one-off payments, with prices checked October 2026.",
    answer:
      "The best MyPerfectCV alternative depends on why you are leaving. For a UK CV and cover letter with no subscription, WorkCV costs £7.99 once. For a free CV with a PDF download, FlowCV's free plan or WorkCV's free Word template cost nothing. For premium tools without a renewal, Novorésumé sells a one-off monthly pass.",
    why: [
      "The £2.95 access lasts 14 days and then renews at £16.95 every 4 weeks unless you cancel, which is easy to miss in the middle of a job search.",
      "Building is free, but free downloads are plain text only; PDF and Word need premium access.",
      "Many people only need one CV for one round of applications, not an ongoing plan.",
    ],
    options: [
      workcvOption(vsPath, "Build and preview first, then pay £7.99 once for the CV and its cover letter as PDF and Word. Nothing renews."),
      { slug: "flowcv", why: "Its free plan downloads PDFs without a watermark, which covers a single CV at no cost." },
      { slug: "novoresume", why: "Sells a one-off Pro Pass for a month with nothing recurring, if you want premium tools without a subscription." },
      { slug: "kickresume", why: "The free plan downloads PDF or Word without a watermark if you stay on free design options." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "What is the best free alternative to MyPerfectCV?",
        answer:
          "FlowCV's free plan includes unlimited watermark-free PDF downloads for one saved CV. Kickresume's free plan downloads PDF or Word if you only use free design options. For Word, WorkCV's blank UK CV template is a free .docx with no sign-up, and Barclays LifeSkills has a free builder that exports Word.",
      },
      {
        question: "Is there a MyPerfectCV alternative without a subscription?",
        answer:
          "Yes. WorkCV charges £7.99 once per saved CV with no renewal. Novorésumé sells a one-off Pro Pass for a month that does not renew. Free tools such as FlowCV and the WorkCV Word template have nothing to cancel.",
      },
      {
        question: "Why has MyPerfectCV charged me £16.95?",
        answer:
          "£16.95 is MyPerfectCV's renewal price every 4 weeks after the £2.95 14-day access ends, on its pricing page checked 30 October 2026. If you did not mean to continue, cancel in your account or through customer service and ask them about the charge.",
      },
      {
        question: "Will I lose my CV if I leave MyPerfectCV?",
        answer:
          "Download your CV before premium access ends; Word is the most useful format because you can edit it anywhere. WorkCV can import an existing Word or PDF CV so you do not have to retype it; importing asks for your email and a one-time code.",
      },
      {
        question: "Does cancelling MyPerfectCV happen automatically if I use another builder?",
        answer:
          "No. Starting a CV elsewhere does not stop MyPerfectCV billing. Cancel through MyPerfectCV's own account settings or customer service and keep the confirmation.",
      },
    ],
  },
  asAlternative: {
    bestFor: "AI-assisted CVs and cover letters over a few weeks",
    price: "£2.95 for 14 days, then £16.95 every 4 weeks",
    tradeOff: "Renews automatically unless cancelled; PDF and Word need premium.",
  },
  related: ["livecareer", "zety", "resume-io"],
};
