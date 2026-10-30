import { blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-kickresume";

export const kickresume: Competitor = {
  slug: "kickresume",
  name: "Kickresume",
  domain: "kickresume.com",
  homepage: "https://www.kickresume.com/",
  summary:
    "An AI resume and cover letter builder with a usable free plan and Premium billed monthly or yearly.",
  category: "Freemium AI resume builder",
  vsPath,
  altPath: "/kickresume-alternative-uk",
  pricing: {
    headline: "Free plan; Premium $9 a month or $48 a year (US dollars)",
    rows: [
      ["Free plan", "Unlimited downloads with the 4 basic templates and free options"],
      ["One month", "$9, renews every 30 days"],
      ["One year", "$48, with auto-renew selected"],
      ["Guarantee", "14-day money-back guarantee"],
    ],
    confidence: "regional",
    note: "Kickresume's pricing page showed US dollars when WorkCV checked on 4 October 2026; some of its help pages quote higher monthly figures, such as $24. UK checkout may show a different amount.",
    sourceUrl: "https://www.kickresume.com/en/pricing/",
  },
  facts: {
    billing: "Free plan, or Premium billed monthly or yearly and renewing automatically. 14-day money-back guarantee.",
    free: "Unlimited downloads without a watermark if you use the 4 basic templates and free customisation options.",
    formats: "PDF or Word (.doc); the Word export is plain text without graphics.",
    coverLetters: "Yes. Cover letter builder and AI cover letter writer.",
    ai: "Yes. AI resume writer and AI feedback on Premium.",
    ats: "Resume score checks for design, structure and content.",
    design: "A large library of designed templates; some sections and options are Premium-only.",
    afterPaying: "Free downloads continue on free options after Premium ends.",
    bestFor: "A free designed CV, or AI writing help on a short Premium plan.",
  },
  switching: {
    summary:
      "Kickresume offers a 14-day money-back guarantee on paid plans. Download your CV as PDF or Word, cancel Premium in your account before the next billing date, and keep the confirmation. Free-plan documents stay downloadable.",
    href: "https://www.kickresume.com/en/help-center/general/",
    label: "Kickresume help centre",
  },
  sources: [
    ["Kickresume pricing", "https://www.kickresume.com/en/pricing/"],
    ["Kickresume terms", "https://www.kickresume.com/terms/"],
    ["Kickresume FAQ", "https://www.kickresume.com/en/help-center/general/"],
    ["Kickresume free templates", "https://www.kickresume.com/en/templates/resume/free/"],
  ],
  vs: {
    title: "WorkCV vs Kickresume 2026: Free Plan, AI and UK CVs",
    description:
      "Kickresume has a free plan and AI Premium from $9 a month; WorkCV is £7.99 once for a UK CV and letter. Compare free downloads, AI, Word and UK fit.",
    answer:
      "Kickresume is the better choice if you want a free designed CV or AI writing help, and you will stick to free design options or a short Premium plan. WorkCV is the better choice if you want a UK-specific CV structure, a full preview and one £7.99 payment in pounds. Kickresume's free plan can cost nothing; WorkCV always charges for the PDF.",
    verdict: [
      "Kickresume's free plan is genuinely useful: unlimited PDF or Word downloads without a watermark, provided you avoid Premium sections and design options. Premium adds an AI resume writer, AI feedback and more templates for $9 a month or $48 a year on its pricing page, with a 14-day money-back guarantee.",
      "WorkCV is not free to download. It charges £7.99 once per saved CV and cover letter, in pounds, with PDF and Word included and no renewal. In return you get a UK-only structure (personal statement, work history, education, skills, no photo) and a full preview before paying.",
      "If cost is the deciding factor and you are comfortable with a global resume tool, start with Kickresume's free plan. If you want a builder that only does UK CVs and a fixed price in GBP, WorkCV is the straightforward choice.",
    ],
    competitorBetter: [
      "You want a CV without paying anything",
      "You want AI to write or review content",
      "You are a student or teacher eligible for free Premium",
      "You want a designed template with colour",
    ],
    workcvBetter: [
      "You want a builder made only for UK CVs",
      "You want a fixed price in pounds, not US dollars",
      "You need sections that the free Kickresume plan locks",
      "You want a matching cover letter and Word file in one payment",
    ],
    faqs: [
      {
        question: "Is Kickresume free?",
        answer:
          "Kickresume has a free plan with unlimited PDF or Word downloads and no watermark, as long as you stick to the 4 basic templates and free customisation options. Some sections, such as achievements and certifications, are Premium-only.",
      },
      {
        question: "How much is Kickresume Premium in the UK?",
        answer:
          "Kickresume's pricing page showed Premium at $9 a month or $48 a year when WorkCV checked on 4 October 2026; some of its help pages quote higher monthly figures. We found no GBP price, so the UK checkout amount may differ.",
      },
      {
        question: "Is WorkCV better than Kickresume for UK jobs?",
        answer:
          "WorkCV is built only for UK CVs, so its sections and guidance follow UK conventions. Kickresume is a global resume tool with more design and AI features. Both can produce a CV suitable for UK employers.",
      },
      {
        question: "Can students get Kickresume free?",
        answer:
          "Kickresume says students and teachers verified through ISIC, ITIC or UNiDAYS can get up to six months of Premium free.",
      },
      {
        question: "Does WorkCV have a free plan like Kickresume?",
        answer:
          "Building and previewing in WorkCV is free, but downloading the CV and cover letter costs £7.99 once. WorkCV's free tools, including the ATS checker and the blank Word CV template, cost nothing.",
      },
    ],
  },
  alt: {
    title: "Kickresume Alternatives UK 2026: UK CV Builders Compared",
    description:
      "Want a UK-focused alternative to Kickresume? Compare 5 options, from a £7.99 one-off UK CV builder to free PDF tools, with prices checked October 2026.",
    answer:
      "If you want a Kickresume alternative made for UK CVs, WorkCV costs £7.99 once in pounds with no renewal. If you want to stay free, FlowCV's free plan downloads watermark-free PDFs. For a UK builder with pre-written content, StandOut CV is UK-based but subscription-priced.",
    why: [
      "Premium is priced in US dollars, so the UK cost is less predictable.",
      "Useful sections are locked on the free plan.",
      "It is a global resume tool rather than one built around UK CV conventions.",
    ],
    options: [
      workcvOption(vsPath, "Built only for UK CVs, priced in pounds: £7.99 once per saved CV, no renewal."),
      { slug: "flowcv", why: "Free plan with all templates and unlimited watermark-free PDF downloads." },
      { slug: "standout-cv", why: "A UK-based builder with UK CV examples and pre-written content." },
      { slug: "novoresume", why: "A one-off monthly Pro Pass if you want premium tools without a subscription." },
      blankTemplateOption,
    ],
    faqs: [
      {
        question: "What is a UK alternative to Kickresume?",
        answer:
          "WorkCV and StandOut CV are both UK-focused. WorkCV charges £7.99 once per CV; StandOut CV uses a subscription. WorkCV's free blank Word CV template is another UK option at no cost.",
      },
      {
        question: "Is there a Kickresume alternative priced in pounds?",
        answer:
          "Yes. WorkCV charges £7.99 including VAT, once per saved CV. MyPerfectCV, LiveCareer and Zety also publish GBP prices but renew every four weeks.",
      },
      {
        question: "What is the best free Kickresume alternative?",
        answer:
          "FlowCV's free plan downloads unlimited watermark-free PDFs for one saved CV. For Word, WorkCV's blank template is free with no sign-up.",
      },
      {
        question: "Can I move my Kickresume CV to WorkCV?",
        answer:
          "Yes. Download the CV as a PDF or Word file, then use Import CV in the WorkCV editor.",
      },
    ],
  },
  asAlternative: {
    bestFor: "A free designed CV, with AI on Premium",
    price: "Free plan; Premium $9 a month or $48 a year",
    tradeOff: "Some sections are Premium-only; priced in US dollars.",
  },
  related: ["enhancv", "flowcv", "novoresume"],
};
