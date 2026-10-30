import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-myperfectcv";

export const myperfectcv: Competitor = {
  slug: "myperfectcv",
  name: "MyPerfectCV",
  domain: "myperfectcv.co.uk",
  homepage: "https://www.myperfectcv.co.uk/",
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
      ["Free use", "Write and preview free; downloads need premium"],
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
    free: "Write and preview a CV free. Every download format needs premium access.",
    formats: "PDF, Word (DOC/DOCX) and TXT with premium.",
    coverLetters: "Yes. An AI cover letter builder is part of premium.",
    ai: "Yes. An AI CV builder helps write content.",
    ats: "Yes. An ATS CV checker with improvement suggestions.",
    design: "A large library of UK CV templates, including Word-style designs.",
    afterPaying: "Downloads are a premium feature, so download final files before access ends.",
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
      "MyPerfectCV suits people who want AI writing, cover letters and Word downloads, and who will manage a renewal. WorkCV suits people who want one finished UK CV for a single £7.99 payment with nothing to cancel. If you can finish and download within 14 days, MyPerfectCV's £2.95 access is cheaper; after that, WorkCV costs less.",
    verdict: [
      "The two products do different jobs. MyPerfectCV is a full career-document platform: AI-assisted CV writing, cover letters, an ATS checker and downloads in PDF, Word and TXT, all behind a premium plan. WorkCV does one thing: a single-column UK CV that you build and preview free, then unlock for a one-off £7.99.",
      "The biggest difference is billing. MyPerfectCV's £2.95 buys 14 days; if you do not cancel, it continues at £16.95 every four weeks, which is £53.80 over three months. WorkCV charges once per saved CV and the paid CV stays editable, so there is no renewal date to remember.",
      "Choose on features if you genuinely need them. If a cover letter and a Word file matter, MyPerfectCV is the stronger product. If you need a clean PDF CV and no ongoing plan, WorkCV is simpler and costs less once the first fortnight has passed.",
    ],
    competitorBetter: [
      "You want a matching cover letter written with AI help in the same tool",
      "You need your CV as an editable Word file, not only a PDF",
      "You will finish, download and cancel inside the 14-day £2.95 window",
      "You want an ATS checker and suggestions while you write",
      "You need many CV versions over the next few weeks",
    ],
    workcvBetter: [
      "You need one finished UK CV, not a career platform",
      "You want to see the whole CV before paying anything",
      "You do not want a renewal date or a cancellation step",
      "You may return to edit the same CV months later without paying again",
      "A clean single-column PDF is all the employer asks for",
    ],
    faqs: [
      {
        question: "Is WorkCV cheaper than MyPerfectCV?",
        answer:
          "Yes, unless you finish within 14 days. MyPerfectCV costs £2.95 for the first 14 days and £16.95 every 4 weeks after that, so one month costs £19.90 and three months £53.80. WorkCV is £7.99 once for one saved CV, however long you keep editing it. Prices checked 30 October 2026.",
      },
      {
        question: "Does MyPerfectCV renew automatically?",
        answer:
          "Yes. MyPerfectCV's terms say an active subscription renews automatically until you cancel, at the price agreed when you bought it. The 14-day access renews at £16.95 every 4 weeks and the annual plan renews yearly.",
      },
      {
        question: "Can I get a Word CV from WorkCV?",
        answer:
          "The WorkCV editor exports PDF only. If you need Word, use WorkCV's free blank Word CV template, or a builder such as MyPerfectCV that exports DOC and DOCX with premium.",
      },
      {
        question: "Does WorkCV write my CV with AI like MyPerfectCV?",
        answer:
          "No. WorkCV gives you a UK CV structure and prompts, and you write the content. AI is only used to read an existing CV you upload so you do not have to retype it.",
      },
      {
        question: "Which is better for a UK CV, WorkCV or MyPerfectCV?",
        answer:
          "Both produce UK-style CVs. MyPerfectCV is better if you need cover letters, Word files or AI writing. WorkCV is better if you want one clean CV, a single payment and no subscription to manage.",
      },
    ],
  },
  alt: {
    title: "MyPerfectCV Alternatives UK 2026: 6 Options Compared",
    description:
      "Leaving MyPerfectCV's £16.95 four-weekly renewal? Compare 6 UK alternatives, from free Word templates to one-off payments, with prices checked October 2026.",
    answer:
      "The best MyPerfectCV alternative depends on why you are leaving. For one UK CV with no subscription, WorkCV costs £7.99 once. For a free CV with a PDF download, FlowCV's free plan or WorkCV's free Word template cost nothing. For premium tools without a renewal, Novorésumé sells a one-off monthly pass.",
    why: [
      "The £2.95 access lasts 14 days and then renews at £16.95 every 4 weeks unless you cancel, which is easy to miss in the middle of a job search.",
      "Writing and previewing are free, but every download format, including PDF, needs premium access.",
      "Many people only need one CV for one round of applications, not an ongoing plan.",
    ],
    options: [
      workcvOption(vsPath, "Build and preview first, then pay £7.99 once. Nothing renews, and the paid CV stays editable."),
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
          "Download your CV before premium access ends; Word is the most useful format because you can edit it anywhere. WorkCV can import an existing Word or PDF CV so you do not have to retype it.",
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
    tradeOff: "Renews automatically unless cancelled; downloads need premium.",
  },
  related: ["livecareer", "zety", "resume-io"],
};
