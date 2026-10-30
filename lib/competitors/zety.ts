import { blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-zety";

export const zety: Competitor = {
  slug: "zety",
  name: "Zety",
  domain: "zety.com",
  homepage: "https://zety.com/",
  owner: "BOLD LLC",
  summary:
    "An AI CV and cover letter builder operated by BOLD LLC, sold as a low-cost 14-day trial that renews every four weeks.",
  category: "Subscription CV and cover letter builder",
  vsPath,
  altPath: "/zety-alternative-uk",
  pricing: {
    headline: "$1.95 for 14 days, then $25.95 every 4 weeks (US dollars)",
    rows: [
      ["14-day trial", "$1.95"],
      ["After 14 days", "$25.95 every 4 weeks until cancelled"],
      ["Annual package", "$71.40, renews yearly"],
      ["Free use", "Build free; free downloads are TXT only"],
    ],
    confidence: "regional",
    note: "When WorkCV checked on 4 October 2026, Zety's UK pricing address redirected to its US-dollar page, so no pound price is quoted. An older Zety UK page listed £2.95, then £20.95 every 4 weeks. The amount at checkout is the one that applies.",
    sourceUrl: "https://zety.com/pricing",
  },
  facts: {
    billing: "Low-cost 14-day trial that renews automatically every 4 weeks, or a yearly package.",
    free: "Build a CV and cover letter free; free downloads are plain text (TXT) only.",
    formats: "TXT free; PDF and Word with a paid plan.",
    coverLetters: "Yes. A cover letter generator in the same account.",
    ai: "Yes. Markets an AI CV builder with suggested content.",
    ats: "Promotes ATS-friendly templates.",
    design: "A large library of designed templates, including two-column layouts.",
    afterPaying: "Zety says documents stay in your account after cancelling.",
    bestFor: "AI-suggested content and designed templates for a few weeks.",
  },
  switching: {
    summary:
      "Zety says you can cancel at any time and your documents stay in your account. Download your CV first, cancel before the 14-day access renews and keep the confirmation email. Using another builder does not cancel Zety.",
    href: "https://zety.com/pricing",
    label: "Zety pricing and plan terms",
  },
  sources: [
    ["Zety pricing", "https://zety.com/pricing"],
    ["Zety terms of service", "https://zety.com/terms-of-service"],
    ["Zety CV maker", "https://zety.com/cv-maker"],
    ["Bold company timeline", "https://www.bold.com/"],
  ],
  vs: {
    title: "WorkCV vs Zety 2026: UK Price, Renewal and Templates",
    description:
      "Zety's 14-day trial renews every 4 weeks ($25.95 on the page UK visitors see). WorkCV is £7.99 once per CV and letter. Compare price, AI and templates.",
    answer:
      "Zety is the better pick if you want AI-suggested content throughout your CV and a wide choice of designed templates, and you will manage the renewal. WorkCV is the better pick if you want a UK CV and cover letter, a single £7.99 payment and no renewal. Zety's trial is cheaper only if you finish within 14 days.",
    verdict: [
      "Zety is one of the best-known builders worldwide and, like LiveCareer, is operated by BOLD LLC. It leans on AI-suggested phrases, a cover letter generator and many designed templates. When we checked, its UK pricing address showed US-dollar prices: $1.95 for 14 days, then $25.95 every four weeks, or $71.40 a year.",
      "WorkCV is narrower and UK-only: three layouts, a guided UK structure and a complete preview before payment. You pay £7.99 once for the CV and its matching cover letter, as PDF and Word, and can keep editing and redownloading them.",
      "Zety's breadth is worth paying for if you will use its AI suggestions and large template choice. If you mainly need a tidy, conventional UK CV, a one-off payment in pounds avoids four-weekly charges.",
    ],
    competitorBetter: [
      "You want AI to suggest content throughout the CV",
      "You want a very large template library",
      "You want more decorative designs with icons and colour",
      "Zety's annual plan suits you because you apply all year",
      "Your documents should stay in an account after cancelling",
    ],
    workcvBetter: [
      "You want a conventional UK CV with a single-column option",
      "You want a fixed price in pounds rather than US dollars",
      "You would rather pay once than track a renewal",
      "You want the full preview before checkout",
      "You need the CV for longer than 14 days but not all year",
      "You want a UK-only tool rather than a global one",
    ],
    faqs: [
      {
        question: "How much does Zety cost in the UK?",
        answer:
          "When WorkCV checked on 4 October 2026, Zety's UK pricing address redirected to its US-dollar page: $1.95 for 14 days, then $25.95 every 4 weeks, or $71.40 a year. An older Zety UK page listed £2.95, then £20.95 every 4 weeks. The amount at checkout is the one that applies.",
      },
      {
        question: "Is WorkCV cheaper than Zety?",
        answer:
          "Yes, if you need your CV for more than 14 days. After its trial Zety renews every 4 weeks, at $25.95 on the page we were shown. WorkCV is £7.99 once for a CV and its cover letter, with no renewal.",
      },
      {
        question: "Are Zety's two-column templates a problem for UK applications?",
        answer:
          "Not always, but simple single-column layouts are the safest choice when employers use applicant tracking systems or ask you to paste your CV into a form. WorkCV's Classic layout is single-column, and its Word download is single-column too.",
      },
      {
        question: "Does WorkCV have Zety-style AI suggestions?",
        answer:
          "Partly. WorkCV's editor suggests CV bullets and a profile summary and applies nothing until you approve it. Zety's AI suggestions run across more of its builder.",
      },
      {
        question: "Is Zety the same as LiveCareer?",
        answer:
          "They are separate products run by the same company, BOLD LLC. Both use low-cost 14-day trials that renew every four weeks.",
      },
    ],
  },
  alt: {
    title: "Zety Alternatives UK 2026: 5 Options Without the Renewal",
    description:
      "Zety's 14-day trial renews every 4 weeks unless cancelled. Compare 5 UK alternatives, from free PDF builders to a £7.99 one-off CV, checked October 2026.",
    answer:
      "For a Zety alternative without a subscription, WorkCV costs £7.99 once per UK CV. If you want Zety-style designed templates for free, Canva's free plan and FlowCV's free plan both download PDFs. Kickresume's free plan also exports PDF or Word if you avoid premium options.",
    why: [
      "After 14 days Zety renews every 4 weeks unless you cancel ($25.95 on the page UK visitors were shown).",
      "Its designed and two-column templates are more than many UK applications need.",
      "Some UK visitors have been shown non-UK pricing, which makes the real cost harder to judge.",
    ],
    options: [
      workcvOption(vsPath, "A UK-only builder with a single £7.99 payment, a full preview first and no renewal."),
      { slug: "flowcv", why: "Free plan with designed templates and unlimited watermark-free PDF downloads." },
      { slug: "canva", why: "Free designed CV templates and free PDF export, if visual design matters most." },
      { slug: "kickresume", why: "Designed templates with free PDF or Word downloads on free options, and AI on Premium." },
      blankTemplateOption,
    ],
    faqs: [
      {
        question: "What is the best free alternative to Zety?",
        answer:
          "FlowCV's free plan downloads watermark-free PDFs, Canva's free plan has free CV templates with PDF export, and Kickresume's free plan downloads PDF or Word on free design options. For a plain UK CV in Word, WorkCV's blank template is free with no sign-up.",
      },
      {
        question: "Why is Zety charging me every 4 weeks?",
        answer:
          "Zety's trial renews automatically every 4 weeks after 14 days unless you cancel: $25.95 on the US-dollar page its UK address showed on 4 October 2026, or £20.95 on an older UK page. Cancel in your Zety account and contact Zety about any charge you did not expect.",
      },
      {
        question: "Is there a Zety alternative made for UK CVs?",
        answer:
          "WorkCV is built only for UK CVs: personal statement, work history, education and skills, with no photo or date of birth, and a matching cover letter. StandOut CV is another UK-focused builder, but it uses a subscription.",
      },
      {
        question: "Can I keep my Zety CV if I switch?",
        answer:
          "Zety says documents stay in your account after cancelling. Download a copy anyway, then import the PDF or Word file into the builder you switch to. WorkCV's editor has an Import CV option.",
      },
      {
        question: "Is a cheaper Zety plan available?",
        answer:
          "Zety's annual package ($71.40 a year when we checked) costs less per month than the four-weekly renewal if you use it all year. For a single CV, a one-off payment or a free tool usually costs less.",
      },
    ],
  },
  asAlternative: {
    bestFor: "AI suggestions and designed templates",
    price: "$1.95 for 14 days, then $25.95 every 4 weeks",
    tradeOff: "Renews automatically unless cancelled before day 14.",
  },
  related: ["livecareer", "myperfectcv", "canva"],
};
