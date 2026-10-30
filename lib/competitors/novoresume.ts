import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-novoresume";

export const novoresume: Competitor = {
  slug: "novoresume",
  name: "Novorésumé",
  domain: "novoresume.com",
  homepage: "https://novoresume.com/",
  summary:
    "A resume and CV builder with a free one-page plan and a Pro upgrade sold either as a subscription or a one-off monthly pass.",
  category: "Freemium resume builder with a one-off pass",
  vsPath,
  altPath: "/novoresume-alternative-uk",
  pricing: {
    headline: "Free one-page plan; Pro about $20–$24 for a month",
    rows: [
      ["Free Basic", "One single-page CV, predefined layouts, 3 fonts"],
      ["Pro Pass", "One payment for one month, nothing recurring"],
      ["Pro subscription", "Billed monthly, quarterly or yearly"],
      ["Guarantee", "14-day money-back guarantee"],
    ],
    confidence: "regional",
    note: "Novorésumé's own pages quote US dollars and disagree on the one-month price (from about $19.99 to $23.99). Check the amount at checkout.",
    sourceUrl: "https://novoresume.com/page/pricing",
  },
  facts: {
    billing: "Free, a one-off Pro Pass for a month, or a Pro subscription.",
    free: "One single-page CV with predefined layouts and 3 fonts, no card or trial.",
    formats: "PDF.",
    coverLetters: "Yes on Pro; no matching cover letter on the free plan.",
    ai: "AI career tools for resumes and cover letters.",
    ats: "Promotes ATS-friendly layouts and an ATS checker among its AI tools.",
    design: "Clean modern layouts; the free plan has fewer templates and is limited to one page.",
    afterPaying: "A Pro Pass expires by itself after a month.",
    bestFor: "A one-page CV for free, or a month of Pro with no renewal.",
  },
  switching: {
    summary:
      "If you bought a Pro Pass, it ends by itself after a month; nothing needs cancelling. If you subscribed, cancel in your account before the next billing date. Download your CV as a PDF first.",
    href: "https://novoresume.com/page/pricing",
    label: "Novorésumé pricing and FAQ",
  },
  sources: [
    ["Novorésumé pricing", "https://novoresume.com/page/pricing"],
    ["Novorésumé CV maker", "https://novoresume.com/cv-maker"],
    ["Novorésumé homepage", "https://novoresume.com/"],
    ["Prospects: how to write a CV", "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/"],
  ],
  vs: {
    title: "WorkCV vs Novorésumé 2026: One-Page vs UK Two-Page CVs",
    description:
      "Novorésumé's free plan allows one single-page CV; its Pro Pass is a one-off month in dollars. WorkCV is £7.99 once with no page limit. Compare for UK CVs.",
    answer:
      "Novorésumé is the better choice if a one-page CV is enough (free) or you want a month of premium tools with no renewal (the Pro Pass). WorkCV is the better choice if you need a standard two-page UK CV for a fixed £7.99, with a UK-only structure. Both avoid forced subscriptions.",
    verdict: [
      "Novorésumé and WorkCV are closer than most pairs here: both let you avoid a renewing subscription. Novorésumé's Pro Pass is one payment for a month that expires by itself, priced in US dollars at roughly $20–$24. WorkCV charges £7.99 once per saved CV and cover letter, and they never expire.",
      "The free Novorésumé plan is limited to a single one-page CV. That suits graduates and short careers, but many UK CVs run to two A4 pages, the maximum UK careers advisers quoted by Prospects recommend.",
      "Choose Novorésumé if you want its AI career tools and designs for a month. Choose WorkCV if you want a UK-specific two-page CV, a lower fixed price in pounds and the ability to edit the same CV months later without paying again.",
    ],
    competitorBetter: [
      "One page is enough and you want it free",
      "You want its AI career tools for a month",
      "You like Novorésumé's modern designs",
      "You want a money-back guarantee on the paid pass",
    ],
    workcvBetter: [
      "You need a two-page UK CV",
      "You want to pay less, once, in pounds",
      "You want the CV to stay editable after a month",
      "You want a builder that follows UK CV conventions only",
    ],
    faqs: [
      {
        question: "Is Novorésumé free?",
        answer:
          "Novorésumé has a free Basic plan with one single-page CV, predefined layouts and 3 fonts, with no card needed. Longer CVs, more templates and cover letters need Pro.",
      },
      {
        question: "Does Novorésumé renew automatically?",
        answer:
          "Not if you buy the Pro Pass, which Novorésumé describes as a single payment covering one month with nothing recurring. Its Pro subscription, billed monthly, quarterly or yearly, does renew.",
      },
      {
        question: "How long should a UK CV be?",
        answer:
          "Usually no more than two A4 pages. Prospects quotes university careers advisers recommending a two-page maximum, and notes that a CV with little experience may fit on one page.",
      },
      {
        question: "Is WorkCV cheaper than a Novorésumé Pro Pass?",
        answer:
          "Yes. WorkCV is £7.99 once per saved CV and cover letter. Novorésumé's own pages put a month of Pro at about $19.99 to $23.99, before any currency conversion. Checked 30 October 2026.",
      },
      {
        question: "Can I keep editing my CV after paying?",
        answer:
          "With WorkCV, yes: the paid CV stays unlocked to edit and redownload. A Novorésumé Pro Pass lasts one month; after it ends you return to the free plan's limits.",
      },
    ],
  },
  alt: {
    title: "Novorésumé Alternatives UK 2026: Two-Page CV Options",
    description:
      "Novorésumé's free plan is limited to one page. Compare 5 UK alternatives for two-page CVs, from free tools to a £7.99 one-off builder, checked October 2026.",
    answer:
      "If you need more than Novorésumé's free one-page CV, FlowCV's free plan and WorkCV's free Word template have no page limit. For a guided UK CV without a subscription, WorkCV costs £7.99 once. Kickresume's free plan is another no-cost option with designed templates.",
    why: [
      "The free plan allows only one single-page CV, but many UK CVs run to two pages.",
      "Pro is priced in US dollars, and Novorésumé's own pages disagree on the monthly price.",
      "A Pro Pass lasts one month, after which editing is limited again.",
    ],
    options: [
      workcvOption(vsPath, "Two-page UK CVs, £7.99 once in pounds, and the CV stays editable after you pay."),
      { slug: "flowcv", why: "Free plan with unlimited watermark-free PDF downloads." },
      { slug: "kickresume", why: "Free downloads in PDF or Word on free design options." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "What is a free alternative to Novorésumé for a two-page CV?",
        answer:
          "FlowCV's free plan downloads watermark-free PDFs, Kickresume's free plan downloads PDF or Word on free options, and WorkCV's blank Word CV template is a free two-page UK layout with no sign-up.",
      },
      {
        question: "Is there a Novorésumé alternative priced in pounds?",
        answer:
          "Yes. WorkCV charges £7.99 including VAT, once per saved CV. MyPerfectCV, LiveCareer and Zety publish pound prices too, but renew every four weeks.",
      },
      {
        question: "Which alternative has no subscription, like the Novorésumé Pro Pass?",
        answer:
          "WorkCV charges once per saved CV with no renewal, and the CV stays editable. Free tools such as FlowCV and the WorkCV Word template have nothing to cancel.",
      },
      {
        question: "Can I import my Novorésumé CV into WorkCV?",
        answer:
          "Yes. Download your CV as a PDF and use Import CV in the WorkCV editor (importing asks for your email and a one-time code), then check each section.",
      },
    ],
  },
  asAlternative: {
    bestFor: "A month of premium tools with no renewal",
    price: "Free one-page plan; one-off Pro Pass about $20–$24",
    tradeOff: "Free plan is one page only; priced in US dollars.",
  },
  related: ["kickresume", "flowcv", "enhancv"],
};
