import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-cv-genius";

export const cvGenius: Competitor = {
  slug: "cv-genius",
  name: "CV Genius",
  domain: "cvgenius.com",
  homepage: "https://cvgenius.com/",
  summary:
    "A UK-focused CV and cover letter builder that is free to use with TXT downloads, and paid for PDF and Word.",
  category: "Free-to-build, trial-to-download builder",
  vsPath,
  altPath: "/cv-genius-alternative-uk",
  pricing: {
    headline: "Free TXT downloads; PDF and Word need a paid plan",
    rows: [
      ["Free use", "Build a CV with unlimited TXT downloads"],
      ["Older published trial", "£2.90 for the first two weeks"],
      ["After the trial", "Renews at full price; amount not published on the pages we checked"],
      ["Cancelling", "Takes effect at the end of the billing period; no refund of remaining time"],
    ],
    confidence: "unconfirmed",
    note: "The £2.90 figure comes from an older CV Genius FAQ and the renewal price was not visible on the pages we could check. Confirm both at checkout.",
    sourceUrl: "https://cvgenius.com/faq/how-much-does-a-cv-cost",
  },
  facts: {
    billing: "Low-cost two-week trial that continues on a paid plan unless cancelled.",
    free: "Build free with unlimited plain text (TXT) downloads.",
    formats: "TXT free; PDF and Word with a paid plan.",
    coverLetters: "Yes. A UK cover letter builder.",
    ai: "Not a headline feature on the pages we checked.",
    ats: "Not a headline feature on the pages we checked.",
    design: "A range of UK CV templates.",
    afterPaying: "PDF and Word downloads stop when the plan ends; TXT stays free.",
    bestFor: "A UK CV and cover letter during a short trial.",
  },
  switching: {
    summary:
      "CV Genius' FAQ describes cancelling from My account, then Plan details, then Cancel subscription. Its terms say cancellation takes effect at the end of the current billing period and remaining time is not refunded; refunds on the 14-day term need a request to support before the trial ends.",
    href: "https://cvgenius.com/terms-of-use",
    label: "CV Genius terms of use",
  },
  sources: [
    ["CV Genius: how much does a CV cost", "https://cvgenius.com/faq/how-much-does-a-cv-cost"],
    ["CV Genius terms of use", "https://cvgenius.com/terms-of-use"],
    ["CV Genius homepage", "https://cvgenius.com/"],
  ],
  vs: {
    title: "WorkCV vs CV Genius 2026: Trial vs One-Off UK CV",
    description:
      "CV Genius is free for TXT but charges for PDF and Word through a renewing trial. WorkCV is £7.99 once for a UK CV PDF. Compare cost, formats and features.",
    answer:
      "CV Genius suits people who want a UK CV and a matching cover letter, need a Word file, and will cancel before the two-week trial renews. WorkCV suits people who want one UK CV PDF for a single £7.99 payment with nothing to cancel. Both are free to build; both charge for a formatted download.",
    verdict: [
      "CV Genius is free to build and lets you download plain text without paying, but a formatted PDF or Word CV needs a paid plan. Its older FAQ puts the first two weeks at £2.90; after that the plan continues at full price, which we could not confirm on its current pages.",
      "Its terms matter if you cancel late: cancellation takes effect at the end of the billing period and remaining time is not refunded. WorkCV charges £7.99 once for the saved CV and never renews, so there is no billing period to manage.",
      "CV Genius gives you more for a short trial: cover letters and Word export. WorkCV gives you a fixed price. If you can finish everything in a fortnight and cancel, CV Genius' trial may cost less; otherwise WorkCV is the predictable option.",
    ],
    competitorBetter: [
      "You need a matching UK cover letter",
      "You need an editable Word CV",
      "You will finish within the two-week trial and cancel",
      "Plain text is enough for an online application form",
    ],
    workcvBetter: [
      "You want one known price and no renewal",
      "You need longer than two weeks",
      "You want to preview the exact PDF before paying",
      "You want to edit the same CV later without a plan",
    ],
    faqs: [
      {
        question: "Is CV Genius free?",
        answer:
          "Building is free and plain text (TXT) downloads are unlimited, according to CV Genius. PDF and Word downloads need a paid plan.",
      },
      {
        question: "How much does CV Genius cost?",
        answer:
          "An older CV Genius FAQ gives £2.90 for the first two weeks, after which the plan continues at full price. We could not see the current renewal price on its pages, so check at checkout. Checked 30 October 2026.",
      },
      {
        question: "Does CV Genius refund unused time?",
        answer:
          "Its terms say cancellation takes effect at the end of the current billing period and remaining paid time is not refunded. Refunds for the 14-day term require contacting support before the trial ends.",
      },
      {
        question: "Is WorkCV cheaper than CV Genius?",
        answer:
          "If you need the CV for more than two weeks, almost certainly: WorkCV is £7.99 once per saved CV with no renewal. If you finish and cancel within CV Genius' trial, the trial may cost less.",
      },
      {
        question: "Can WorkCV export Word like CV Genius?",
        answer:
          "No. WorkCV exports PDF. Its free blank Word CV template is available separately with no sign-up.",
      },
    ],
  },
  alt: {
    title: "CV Genius Alternatives UK 2026: Free and One-Off Options",
    description:
      "CV Genius charges for PDF and Word through a renewing trial. Compare 5 UK alternatives with free PDF or Word downloads or a £7.99 one-off price.",
    answer:
      "If you want a formatted CV without CV Genius' trial, WorkCV charges £7.99 once for a UK CV PDF. For free formatted downloads, FlowCV's free plan exports PDF and Barclays LifeSkills exports Word. WorkCV's blank Word template is free with no account.",
    why: [
      "Only plain text downloads are free; PDF and Word need a paid plan.",
      "The low first-fortnight price continues at full price unless you cancel.",
      "Cancelling does not refund the rest of the billing period.",
    ],
    options: [
      workcvOption(vsPath, "A formatted UK CV PDF for £7.99 once. No trial, no renewal and no billing period."),
      { slug: "flowcv", why: "Free plan with unlimited watermark-free PDF downloads." },
      barclaysOption,
      blankTemplateOption,
      { slug: "kickresume", why: "Free PDF or Word downloads on free design options." },
    ],
    faqs: [
      {
        question: "Which CV Genius alternative gives a free PDF?",
        answer:
          "FlowCV's free plan includes unlimited watermark-free PDF downloads, and Kickresume's free plan downloads PDF or Word on free options. WorkCV's PDF costs £7.99 once.",
      },
      {
        question: "Is there a CV Genius alternative with a free Word download?",
        answer:
          "Yes. Barclays LifeSkills exports a Word CV with a free account, Kickresume's free plan downloads Word, and WorkCV's blank CV template is a free .docx with no sign-up.",
      },
      {
        question: "How do I stop CV Genius charging me?",
        answer:
          "Cancel from My account, then Plan details, then Cancel subscription, as CV Genius' FAQ describes. Cancellation takes effect at the end of the current billing period.",
      },
      {
        question: "Can I move my CV from CV Genius to WorkCV?",
        answer:
          "Yes. Download your CV, even as TXT, and paste or import it into the WorkCV editor. Import works best with PDF or Word files.",
      },
    ],
  },
  asAlternative: {
    bestFor: "A UK CV and cover letter on a short trial",
    price: "Free TXT; paid plan for PDF and Word",
    tradeOff: "Trial continues at full price unless cancelled.",
  },
  related: ["standout-cv", "myperfectcv", "resume-io"],
};
