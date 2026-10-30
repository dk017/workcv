import { blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-zety";

export const zety: Competitor = {
  slug: "zety",
  name: "Zety",
  domain: "zety.com",
  homepage: "https://zety.com/",
  owner: "Bold LLC",
  summary:
    "An AI CV and cover letter builder owned by Bold LLC, sold in the UK as 14-day access that renews every four weeks.",
  category: "Subscription CV and cover letter builder",
  vsPath,
  altPath: "/zety-alternative-uk",
  pricing: {
    headline: "£2.95 for 14 days, then £20.95 every 4 weeks",
    rows: [
      ["14-day access", "£2.95"],
      ["After 14 days", "£20.95 every 4 weeks until cancelled"],
      ["Annual plan", "£59.40 (£4.95 a month), renews yearly"],
      ["Free use", "Build free; downloading needs a paid plan"],
    ],
    confidence: "uk-page",
    note: "Figures are from Zety's UK pricing page. In July 2026 that address redirected some visitors to non-UK pricing, so check the amount shown at checkout.",
    sourceUrl: "https://zety.com/uk/pricing",
    plans: [
      { label: "14-day access, then 4-weekly", first: { price: 2.95, days: 14 }, price: 20.95, days: 28 },
      { label: "Annual plan", price: 59.4, days: 365 },
    ],
  },
  facts: {
    billing: "£2.95 for 14 days, then renews automatically at £20.95 every 4 weeks. Annual plan £59.40.",
    free: "Build a CV free; downloading needs a paid plan.",
    formats: "Downloads with a paid plan.",
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
    href: "https://zety.com/uk/pricing",
    label: "Zety UK pricing and plan terms",
  },
  sources: [
    ["Zety UK pricing", "https://zety.com/uk/pricing"],
    ["Zety CV maker", "https://zety.com/cv-maker"],
    ["Bold company timeline", "https://www.bold.com/"],
  ],
  vs: {
    title: "WorkCV vs Zety 2026: UK Price, Renewal and Templates",
    description:
      "Zety is £2.95 for 14 days, then £20.95 every 4 weeks in the UK. WorkCV is £7.99 once per CV. Compare cost over time, AI tools, templates and UK fit.",
    answer:
      "Zety is the better pick if you want AI-suggested CV content, a cover letter and a wide choice of designed templates, and you will manage the renewal. WorkCV is the better pick if you want one UK CV, a single £7.99 payment and no renewal. Zety's £2.95 is cheaper only if you finish within 14 days.",
    verdict: [
      "Zety is one of the best-known builders worldwide and, like LiveCareer, belongs to Bold LLC. It leans on AI-suggested phrases, a cover letter generator and many designed templates. In the UK it is sold as £2.95 for 14 days, then £20.95 every four weeks: £23.90 for a month and £65.80 for three months, although the £59.40 annual plan is cheaper once you need it for more than about two months.",
      "WorkCV is narrower and UK-only. It offers three single-column layouts, a guided UK structure and a complete preview before payment. You pay £7.99 once for the saved CV and can keep editing and redownloading it.",
      "Zety's breadth is worth paying for if you will use the AI suggestions and cover letters. If you mainly need a tidy, conventional UK CV, a one-off payment avoids four-weekly charges.",
    ],
    competitorBetter: [
      "You want AI-suggested bullet points while you write",
      "You need a cover letter that matches the CV",
      "You want two-column or more decorative designs",
      "Zety's annual plan suits you because you apply all year",
      "Your documents should stay in an account after cancelling",
    ],
    workcvBetter: [
      "You want a conventional single-column UK CV",
      "You would rather pay once than track a renewal",
      "You want the full preview before checkout",
      "You need the CV for longer than 14 days but not all year",
      "You want a UK-only tool rather than a global one",
    ],
    faqs: [
      {
        question: "How much does Zety cost in the UK?",
        answer:
          "Zety's UK pricing page lists £2.95 for 14 days, then £20.95 every 4 weeks, or an annual plan at £59.40. Check the price at checkout, because Zety's UK page has redirected some visitors to non-UK pricing. Checked 30 October 2026.",
      },
      {
        question: "Is WorkCV cheaper than Zety?",
        answer:
          "Yes, if you need your CV for more than 14 days. On the 14-day plan Zety costs £23.90 for a month and £65.80 for three months; the annual plan is £59.40. WorkCV is £7.99 once for one saved CV.",
      },
      {
        question: "Are Zety's two-column templates a problem for UK applications?",
        answer:
          "Not always, but simple single-column layouts are the safest choice when employers use applicant tracking systems or ask you to paste your CV into a form. WorkCV only uses single-column layouts for that reason.",
      },
      {
        question: "Does WorkCV have Zety-style AI suggestions?",
        answer:
          "No. WorkCV does not generate CV content. It gives UK section prompts, and free separate tools such as the CV bullet point generator help you phrase your own experience.",
      },
      {
        question: "Is Zety the same as LiveCareer?",
        answer:
          "They are separate products owned by the same company, Bold LLC. Both use low-cost 14-day access that renews every four weeks in the UK.",
      },
    ],
  },
  alt: {
    title: "Zety Alternatives UK 2026: 5 Options Without the Renewal",
    description:
      "Zety renews at £20.95 every 4 weeks after a £2.95 trial. Compare 5 UK alternatives, from free PDF builders to a £7.99 one-off CV, checked October 2026.",
    answer:
      "For a Zety alternative without a subscription, WorkCV costs £7.99 once per UK CV. If you want Zety-style designed templates for free, Canva's free plan and FlowCV's free plan both download PDFs. Kickresume's free plan also exports PDF or Word if you avoid premium options.",
    why: [
      "After 14 days Zety renews at £20.95 every 4 weeks unless you cancel.",
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
        question: "Why has Zety charged me £20.95?",
        answer:
          "£20.95 is the renewal price every 4 weeks that Zety's UK pricing page lists after the £2.95 14-day access. If you did not intend to continue, cancel in your Zety account and contact Zety about the charge.",
      },
      {
        question: "Is there a Zety alternative made for UK CVs?",
        answer:
          "WorkCV is built only for UK CVs: personal statement, work history, education and skills in a single column, with no photo or date of birth. StandOut CV is another UK-based builder, but it uses a subscription.",
      },
      {
        question: "Can I keep my Zety CV if I switch?",
        answer:
          "Zety says documents stay in your account after cancelling. Download a copy anyway, then import the PDF or Word file into the builder you switch to. WorkCV's editor has an Import CV option.",
      },
      {
        question: "Is a cheaper Zety plan available?",
        answer:
          "Zety's annual plan works out at £4.95 a month (£59.40 a year) on its UK pricing page, cheaper than the four-weekly renewal if you will use it all year. For a single CV, a one-off payment or a free tool usually costs less.",
      },
    ],
  },
  asAlternative: {
    bestFor: "AI suggestions and designed templates",
    price: "£2.95 for 14 days, then £20.95 every 4 weeks",
    tradeOff: "Renews automatically unless cancelled before day 14.",
  },
  related: ["livecareer", "myperfectcv", "canva"],
};
