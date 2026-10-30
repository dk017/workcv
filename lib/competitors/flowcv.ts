import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-flowcv";

export const flowcv: Competitor = {
  slug: "flowcv",
  name: "FlowCV",
  domain: "flowcv.com",
  homepage: "https://flowcv.com/",
  summary:
    "A resume and CV builder whose free plan includes unlimited watermark-free PDF downloads, with a low-cost Pro plan for more documents and AI.",
  category: "Free resume builder with a Pro upgrade",
  vsPath,
  altPath: "/flowcv-alternative-uk",
  pricing: {
    headline: "Free plan with PDF downloads; Pro $5 a month",
    rows: [
      ["Free plan", "1 saved CV and 1 cover letter, unlimited watermark-free PDFs"],
      ["Pro monthly", "US$5 a month"],
      ["Pro yearly", "US$60 billed yearly"],
      ["Pro adds", "Unlimited documents and imports, AI writing and translation, job tracker"],
    ],
    confidence: "regional",
    note: "FlowCV's pricing page quotes US dollars. UK checkout may show a different amount.",
    sourceUrl: "https://flowcv.com/pricing",
  },
  facts: {
    billing: "Free, or Pro billed monthly or yearly; cancel any time.",
    free: "Genuinely free: one saved CV and cover letter, all templates, unlimited watermark-free PDF downloads.",
    formats: "PDF.",
    coverLetters: "Yes. One cover letter free, unlimited on Pro.",
    ai: "AI writing and translation on Pro.",
    ats: "Not a headline feature on the pages we checked.",
    design: "100+ templates with full design options on the free plan.",
    afterPaying: "The free plan keeps working; Pro extras stop when Pro ends.",
    bestFor: "A free, well-designed CV PDF.",
  },
  switching: {
    summary:
      "There is nothing to cancel on FlowCV's free plan. If you pay for Pro, cancel in your account before the next billing date; your free-plan CV and PDF downloads keep working.",
    href: "https://flowcv.com/pricing",
    label: "FlowCV pricing",
  },
  sources: [
    ["FlowCV pricing", "https://flowcv.com/pricing"],
    ["FlowCV homepage", "https://flowcv.com/"],
    ["FlowCV templates", "https://flowcv.com/resume-templates"],
  ],
  vs: {
    title: "WorkCV vs FlowCV 2026: Free CV Builder or £7.99 UK CV?",
    description:
      "FlowCV's free plan downloads watermark-free PDFs; WorkCV charges £7.99 once for a UK-specific CV. An honest comparison of when paying is worth it.",
    answer:
      "For most people who just need a well-designed CV PDF, FlowCV's free plan is hard to beat: it costs nothing and has no watermark. WorkCV is worth £7.99 if you want a builder made only for UK CVs, with UK section guidance, a conservative single-column layout and no account limits on the CV you pay for.",
    verdict: [
      "We will be direct: FlowCV's free plan does what many people need at no cost. It includes all templates and unlimited watermark-free PDF downloads for one saved CV and one cover letter. Pro, at US$5 a month, adds unlimited documents, AI writing and a job tracker.",
      "WorkCV charges £7.99 once per saved CV. What you pay for is focus: UK CV sections and prompts, three conservative single-column layouts and a preview of the exact PDF, with the CV staying editable afterwards. It has no AI writing and no cover letter builder in the editor.",
      "Start with FlowCV if price is what matters and you are confident about UK CV conventions. Choose WorkCV if you want the structure decided for you and a UK-only tool, or if you already use FlowCV's one free CV slot for something else.",
    ],
    competitorBetter: [
      "You want a CV PDF at no cost",
      "You want more design choice and templates",
      "You want a cover letter in the same tool",
      "You want AI writing for US$5 a month",
    ],
    workcvBetter: [
      "You want a builder made only for UK CVs",
      "You want UK section guidance rather than a blank design canvas",
      "You want a conservative single-column layout by default",
      "You need a second CV without a monthly plan",
    ],
    faqs: [
      {
        question: "Is FlowCV really free?",
        answer:
          "Yes. FlowCV's free plan includes one saved CV and one cover letter, all templates and unlimited PDF downloads with no watermark or FlowCV logo. Checked 30 October 2026.",
      },
      {
        question: "Why would I pay for WorkCV if FlowCV is free?",
        answer:
          "Only if you value a UK-specific structure and guidance, or need more than FlowCV's single free CV without a monthly plan. If FlowCV's free plan gives you the CV you need, there is no reason to pay.",
      },
      {
        question: "How much is FlowCV Pro?",
        answer:
          "FlowCV's pricing page lists Pro at US$5 a month or US$60 billed yearly, adding unlimited documents and imports, AI writing and translation, and a job tracker.",
      },
      {
        question: "Does FlowCV export Word?",
        answer:
          "FlowCV's free plan is built around PDF downloads. If you need Word, WorkCV's blank CV template is a free .docx and Barclays LifeSkills exports Word.",
      },
      {
        question: "Which is better for UK applications?",
        answer:
          "Both can produce a CV suitable for UK employers. FlowCV is a global resume builder, so you choose the sections; WorkCV builds only UK CVs, with no photo or date of birth and a single-column layout.",
      },
    ],
  },
  alt: {
    title: "FlowCV Alternatives UK 2026: 5 Options for UK CVs",
    description:
      "Looking beyond FlowCV? Compare 5 UK-friendly alternatives for more saved CVs, Word downloads or UK-specific structure, with prices checked October 2026.",
    answer:
      "If FlowCV's free plan works for you, keep using it. If you need a UK-specific structure, WorkCV charges £7.99 once per CV. If you need Word, WorkCV's free blank template and Barclays LifeSkills both export an editable document. Kickresume's free plan is another free builder with designed templates.",
    why: [
      "The free plan saves only one CV and one cover letter.",
      "It is a global resume tool, so UK conventions are up to you.",
      "Pro is priced in US dollars.",
    ],
    options: [
      workcvOption(vsPath, "A UK-only builder with section guidance; £7.99 once per saved CV, no monthly plan."),
      { slug: "kickresume", why: "Another free builder, with PDF or Word downloads on free design options." },
      blankTemplateOption,
      barclaysOption,
      { slug: "canva", why: "Free templates with complete design freedom, for creative roles." },
    ],
    faqs: [
      {
        question: "What is a good alternative to FlowCV for UK CVs?",
        answer:
          "WorkCV is built only for UK CVs and charges £7.99 once per saved CV. For free, WorkCV's blank Word CV template follows a UK structure with no sign-up.",
      },
      {
        question: "Is there a FlowCV alternative with Word export?",
        answer:
          "Kickresume's free plan downloads PDF or Word, Barclays LifeSkills exports Word, and WorkCV's blank CV template is a free .docx.",
      },
      {
        question: "How can I have more than one CV without paying monthly?",
        answer:
          "Use free Word templates for extra versions, or WorkCV, which charges £7.99 once per saved CV with no monthly plan. FlowCV's Pro plan allows unlimited CVs for US$5 a month.",
      },
      {
        question: "Can I import my FlowCV CV into WorkCV?",
        answer:
          "Yes. Download your FlowCV PDF and use Import CV in the WorkCV editor, then check each section.",
      },
    ],
  },
  asAlternative: {
    bestFor: "A free CV PDF with no watermark",
    price: "Free; Pro US$5 a month",
    tradeOff: "Free plan saves one CV and one cover letter; priced in US dollars.",
  },
  related: ["kickresume", "canva", "novoresume"],
};
