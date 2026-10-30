import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-standout-cv";

export const standoutCv: Competitor = {
  slug: "standout-cv",
  name: "StandOut CV",
  domain: "standout-cv.com",
  homepage: "https://standout-cv.com/",
  summary:
    "A UK CV advice site and CV builder with pre-written content, sold as a subscription with unlimited PDF downloads.",
  category: "UK subscription CV builder",
  vsPath,
  altPath: "/standout-cv-alternative-uk",
  pricing: {
    headline: "Subscription; current prices shown on StandOut CV's pricing page",
    rows: [
      ["Every plan includes", "Unlimited edits, unlimited PDF downloads, unlimited CV versions"],
      ["When you pay", "Only once you are happy with the CV you have built"],
      ["Older published figure", "£2.70 for the first 14 days, then £16.95 a month"],
      ["Cancelling", "In your account; access continues to the end of the term"],
    ],
    confidence: "unconfirmed",
    note: "StandOut CV's pricing page lists plans, but the plan amounts were not visible in the copies we could check. The £2.70 and £16.95 figures come from an older StandOut CV article and may have changed.",
    sourceUrl: "https://standout-cv.com/about/cv-builder-pricing",
  },
  facts: {
    billing: "Subscription plans; build free and pay when you are ready to download.",
    free: "Create your first CV free; downloading, storing and continued editing need a plan.",
    formats: "PDF from the builder. Free Word and Google Docs templates on the site.",
    coverLetters: "Cover letter examples and templates on the site.",
    ai: "Pre-written expert content you can add to each section.",
    ats: "Promotes templates designed to pass ATS scans.",
    design: "A range of UK CV templates you customise in the builder.",
    afterPaying: "Access and downloads continue until the end of the paid term after cancelling.",
    bestFor: "UK job seekers who want pre-written content and many tailored versions.",
  },
  switching: {
    summary:
      "StandOut CV says you can cancel within your account or by email, and you keep access and downloads for the rest of your term. Download your final PDFs before the term ends.",
    href: "https://standout-cv.com/about/cancel-standout-cv-builder-subscription",
    label: "StandOut CV: cancel your subscription",
  },
  sources: [
    ["StandOut CV builder pricing", "https://standout-cv.com/about/cv-builder-pricing"],
    ["StandOut CV cancellation guide", "https://standout-cv.com/about/cancel-standout-cv-builder-subscription"],
    ["StandOut CV templates", "https://standout-cv.com/cv-templates"],
  ],
  vs: {
    title: "WorkCV vs StandOut CV 2026: Two UK CV Builders Compared",
    description:
      "StandOut CV is a UK subscription builder with pre-written content and unlimited PDF versions. WorkCV is £7.99 once per CV. Compare price, features and fit.",
    answer:
      "StandOut CV is the better choice if you want pre-written content and many tailored versions of your CV during an active job search. WorkCV is the better choice if you want one UK CV for a single £7.99 payment with nothing to cancel. Both are built for UK applications and let you build before paying.",
    verdict: [
      "This is the closest like-for-like comparison: both are UK-focused CV builders that let you create your CV before paying. StandOut CV pairs its builder with a large library of UK CV examples, pre-written section content and unlimited versions, on a subscription.",
      "WorkCV keeps it to one payment. You build and preview free, pay £7.99 once to unlock the saved CV, and keep editing and redownloading it without a plan. There is no pre-written content; you write your own, with UK prompts.",
      "If you will tailor many versions over several weeks, StandOut CV's subscription gives you room to do that. If you need one strong CV and want a known, fixed cost, WorkCV is simpler. We could not confirm StandOut CV's current plan prices, so check its pricing page.",
    ],
    competitorBetter: [
      "You want pre-written content to start each section",
      "You will tailor many CV versions for different roles",
      "You want UK CV examples for your sector in the same place",
      "You are comfortable with a subscription during an active search",
    ],
    workcvBetter: [
      "You want a single, fixed £7.99 payment",
      "You need one CV, not unlimited versions",
      "You do not want anything to cancel",
      "You want the paid CV to stay editable after the search ends",
    ],
    faqs: [
      {
        question: "How much does StandOut CV cost?",
        answer:
          "StandOut CV's pricing page lists its plans, but we could not see current amounts. An older StandOut CV article gave £2.70 for the first 14 days, then £16.95 a month. Check the pricing page before buying. Checked 30 October 2026.",
      },
      {
        question: "Is StandOut CV made for UK CVs?",
        answer:
          "Yes. StandOut CV focuses on UK CVs, with UK CV examples, templates and advice alongside a builder designed for UK applications.",
      },
      {
        question: "What do StandOut CV plans include?",
        answer:
          "StandOut CV says every plan includes unlimited CV edits and tailoring, unlimited PDF downloads and unlimited saved versions, and that you only pay once you are happy with your CV.",
      },
      {
        question: "Is WorkCV cheaper than StandOut CV?",
        answer:
          "For a single CV, WorkCV's £7.99 one-off price is lower than a month on the most recent StandOut CV subscription price we could find. If you need unlimited versions for months, compare the current StandOut CV plans.",
      },
      {
        question: "Does WorkCV have pre-written content like StandOut CV?",
        answer:
          "No. WorkCV gives section prompts and examples on its guides, but you write your own content. Free WorkCV tools such as the CV summary generator and bullet point generator help with phrasing.",
      },
    ],
  },
  alt: {
    title: "StandOut CV Alternatives UK 2026: 5 Options Compared",
    description:
      "Looking for an alternative to StandOut CV's subscription? Compare 5 UK options, including a £7.99 one-off CV builder and free Word templates.",
    answer:
      "For a UK CV builder without a subscription, WorkCV is the closest alternative to StandOut CV at £7.99 once per CV. If you want free, WorkCV's blank Word CV template and Barclays LifeSkills both give you an editable Word CV, and FlowCV's free plan downloads PDFs.",
    why: [
      "Downloading, storing and continued editing need a paid plan.",
      "Unlimited versions are more than many people need for one round of applications.",
      "Current plan prices are not easy to confirm before you sign up.",
    ],
    options: [
      workcvOption(vsPath, "Another UK-focused builder, but with one £7.99 payment and no subscription."),
      blankTemplateOption,
      barclaysOption,
      { slug: "flowcv", why: "Free plan with unlimited watermark-free PDF downloads." },
      { slug: "myperfectcv", why: "A UK builder with AI writing and cover letters, if you want more tools." },
    ],
    faqs: [
      {
        question: "What is a UK alternative to StandOut CV?",
        answer:
          "WorkCV is a UK CV builder that charges £7.99 once instead of a subscription. MyPerfectCV is another UK builder, with AI tools and a four-weekly renewal.",
      },
      {
        question: "Is there a free alternative to StandOut CV?",
        answer:
          "Yes. WorkCV's blank Word CV template is free with no sign-up, Barclays LifeSkills exports a free Word CV, and FlowCV's free plan downloads PDFs.",
      },
      {
        question: "Can I move my CV from StandOut CV to WorkCV?",
        answer:
          "Download your CV as a PDF before your term ends, then use Import CV in the WorkCV editor to bring the content across.",
      },
      {
        question: "Do I need to cancel StandOut CV?",
        answer:
          "Yes, if you do not want it to renew. StandOut CV says you can cancel within your account or by email and keep access until the end of your term.",
      },
    ],
  },
  asAlternative: {
    bestFor: "UK CVs with pre-written content and many versions",
    price: "Subscription; check current plans",
    tradeOff: "Downloads and storage need a paid plan.",
  },
  related: ["myperfectcv", "cv-genius", "livecareer"],
};
