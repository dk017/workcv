// "WorkCV vs <brand>" pages: one head-to-head per competitor, replacing the old
// /cancel-<brand>-uk guides (which now redirect here). Each brand keeps a short,
// dated cancellation section because people still arrive asking how to cancel.
// Renewal figures for the BOLD brands come from competitor-plans.ts; the rest are
// recorded here with the date their official pages were checked.

import { competitorPlans, type RenewingPlan } from "./competitor-plans.ts";

export type WorkcvVsBrand = {
  path: string;
  /** The redirected cancellation guide this page replaces. */
  replaces: string;
  brand: string;
  alternativeHref: string;
  title: string;
  description: string;
  shortAnswer: string[];
  pricing: {
    checked: string;
    source: string;
    freePlan: string;
    /** A renewing trial we can total over time; omitted when no stable UK price is published. */
    trial?: RenewingPlan;
    otherPlans: string;
    note?: string;
  };
  /** Shown when the brand's terms name a company that also runs other CV builders. */
  operatorNote?: string;
  /** Rows of [area, brand, WorkCV]. */
  rows: string[][];
  chooseBrand: string[];
  cancel: {
    checked: string;
    steps: string[];
    afterCancelling: string;
    statement?: string;
    sources: Array<[string, string]>;
  };
  faqs: Array<{ question: string; answer: string }>;
};

const bold = "BOLD LLC, which also runs MyPerfectCV, LiveCareer and Zety. Plans across these brands follow the same pattern: a low first payment, then an automatic four-weekly renewal.";
const cancelChecked = "23 July 2026";

const { myPerfectCv, liveCareer, zety } = competitorPlans;

export const workcvVsBrands: WorkcvVsBrand[] = [
  {
    path: "/workcv-vs-myperfectcv-uk",
    replaces: "/cancel-myperfectcv-uk",
    brand: "MyPerfectCV",
    alternativeHref: "/myperfectcv-alternative-uk",
    title: "WorkCV vs MyPerfectCV (UK): Price, Renewal, Cancelling",
    description: "MyPerfectCV starts at £2.95 then renews at £16.95 every 4 weeks. WorkCV is £7.99 once with no renewal. Compare costs, downloads and how to cancel MyPerfectCV.",
    shortAnswer: [
      "MyPerfectCV is free to build in, but PDF and Word downloads need a paid plan: £2.95 for 14 days, which then renews at £16.95 every four weeks until you cancel. WorkCV charges £7.99 once for one CV and its matching cover letter as PDF and Word, and nothing renews.",
      "MyPerfectCV gives you more templates and unlimited documents while your plan is active. WorkCV is cheaper for anyone who needs one finished CV, or several applications over three months, and doesn't want to remember to cancel.",
    ],
    pricing: { checked: myPerfectCv.checked, source: myPerfectCv.pricingSource, freePlan: myPerfectCv.freePlan, trial: myPerfectCv.trial, otherPlans: "Premium Annual: £59.40 upfront, renews yearly." },
    operatorNote: bold,
    rows: [
      ["Free use", "Build CVs and letters; free download is TXT only", "Build and preview free; no account to start"],
      ["Downloads", "PDF and Word on a paid plan", "PDF and editable Word for the paid CV and its letter"],
      ["Documents", "Unlimited while the plan is active", "One saved CV and letter, or any number for 90 days with the Pass"],
      ["Templates", "Large template catalogue", "Three UK layouts"],
      ["After you stop paying", "Check MyPerfectCV's account terms", "Paid documents stay editable and downloadable"],
      ["Cancelling", "Account settings or phone support; keep the reference", "Nothing to cancel"],
    ],
    chooseBrand: ["You want a wide choice of designs", "You need many different CVs this fortnight and will cancel in time", "You already have documents saved there"],
    cancel: {
      checked: cancelChecked,
      steps: [
        "Sign in with the email address the subscription uses.",
        "Open My accounts or My settings and look for subscription or billing.",
        "Complete every step of the cancellation flow; don't leave at the first confirmation screen.",
        "If there's no online option, use the phone number or contact form on MyPerfectCV's contact page (it listed 0808 189 0676 when checked).",
        "Keep the cancellation email: MyPerfectCV's terms say it includes a cancellation reference.",
      ],
      afterCancelling: "Check that no renewal appears after the next billing date.",
      statement: "MYPERFECTCV.CO.UK, BLD*MYPERFECTCV.CO.UK or PayPal *MPCVUK",
      sources: [["MyPerfectCV contact page", "https://www.myperfectcv.co.uk/contact-us"], ["MyPerfectCV terms", "https://www.myperfectcv.co.uk/terms-of-use"]],
    },
    faqs: [
      { question: "Is MyPerfectCV free?", answer: "You can build a CV free, but the free download is plain text. PDF and Word downloads need a paid plan, which starts at £2.95 for 14 days and then renews at £16.95 every four weeks unless cancelled." },
      { question: "Can I move my CV from MyPerfectCV to WorkCV?", answer: "Download what you can from MyPerfectCV first, then paste or import the content into the WorkCV editor and check the dates, titles and layout. WorkCV doesn't transfer accounts or cancel other subscriptions for you." },
    ],
  },
  {
    path: "/workcv-vs-zety-uk",
    replaces: "/cancel-zety-uk",
    brand: "Zety",
    alternativeHref: "/zety-alternative-uk",
    title: "WorkCV vs Zety (UK): Price, Renewal and Cancelling",
    description: "Zety's trial renews every 4 weeks until cancelled; WorkCV is £7.99 once with no renewal. Compare costs, downloads, templates and how to cancel Zety.",
    shortAnswer: [
      "Zety lets you build a CV free, but PDF and Word downloads need its Pro package: a 14-day trial that renews every four weeks until you cancel. When we checked, Zety's UK pricing address redirected to a US-dollar page ($1.95, then $25.95 every four weeks), so we can't quote a pound price. WorkCV is £7.99 once for one CV and matching letter, as PDF and Word, with no renewal.",
      "Zety suits people who want its larger template range and are disciplined about cancelling. WorkCV suits people who want a finished UK CV and a price that doesn't change.",
    ],
    pricing: { checked: zety.checked, source: zety.pricingSource, freePlan: zety.freePlan, trial: zety.trial, otherPlans: "Annual Package: $71.40 upfront, renews yearly.", note: zety.priceScope },
    operatorNote: bold,
    rows: [
      ["Free use", "Build a CV and letter; free download is TXT only", "Build and preview free; no account to start"],
      ["Downloads", "PDF and Word on the Pro package", "PDF and editable Word for the paid CV and its letter"],
      ["Price in pounds", "Not shown: the UK pricing page redirected to US dollars", "£7.99 once, or £24.99 for the 90-day Pass"],
      ["Templates", "Large template catalogue", "Three UK layouts"],
      ["Spelling and terms", "Check the regional version you're using", "UK CV conventions and British English throughout"],
      ["Cancelling", "From the account dashboard; keep proof", "Nothing to cancel"],
    ],
    chooseBrand: ["You want many designs to choose from", "You'll finish within the trial and cancel straight away", "Your documents are already in Zety"],
    cancel: {
      checked: cancelChecked,
      steps: [
        "Sign in with the email used for the paid plan.",
        "Open your account dashboard and go to My Plan (Zety's UK terms also refer to My Accounts and My Settings).",
        "Choose the cancel or manage subscription option and finish every confirmation step.",
        "If that fails, use the support route shown in your account or on Zety's live contact page.",
        "Keep emails, chat transcripts or ticket numbers as proof.",
      ],
      afterCancelling: "Check your card or PayPal statement after the next renewal date.",
      statement: "Zety.com, BLD*Zety.com or PP*ZETY",
      sources: [["Zety pricing", "https://zety.com/pricing"], ["Zety terms", "https://zety.com/terms-of-service"]],
    },
    faqs: [
      { question: "Is Zety free?", answer: "You can build a CV and cover letter free, but free downloads are plain text. PDF and Word need the Pro package, which renews every four weeks after its 14-day trial unless cancelled." },
      { question: "Why doesn't this page show Zety's price in pounds?", answer: "When we checked, Zety's UK pricing address redirected to a page priced in US dollars. Rather than guess a pound figure, we show the dollar prices we saw and link to Zety's pricing page." },
    ],
  },
  {
    path: "/workcv-vs-livecareer-uk",
    replaces: "/cancel-livecareer-uk",
    brand: "LiveCareer",
    alternativeHref: "/livecareer-alternative",
    title: "WorkCV vs LiveCareer (UK): Price, Renewal, Cancelling",
    description: "LiveCareer costs £1.95 for 14 days, then £19.85 every 4 weeks. WorkCV is £7.99 once with no renewal. Compare costs, downloads and how to cancel LiveCareer.",
    shortAnswer: [
      "LiveCareer is free to build in, but Word and PDF downloads need paid access: £1.95 for 14 days, then £19.85 every four weeks until you cancel. WorkCV is £7.99 once for one CV and its matching cover letter, as PDF and Word, with no renewal.",
      "LiveCareer's trial is the cheapest way in if you finish and cancel inside 14 days. Left running for 90 days, it costs £61.50, more than twice the £24.99 for WorkCV's 90-day Pass.",
    ],
    pricing: { checked: liveCareer.checked, source: liveCareer.pricingSource, freePlan: liveCareer.freePlan, trial: liveCareer.trial, otherPlans: "Annual access: £83.40 a year, renews yearly." },
    operatorNote: bold,
    rows: [
      ["Free use", "Build CVs and letters; free download is TXT only", "Build and preview free; no account to start"],
      ["Downloads", "Word and PDF on paid access", "PDF and editable Word for the paid CV and its letter"],
      ["Documents", "Unlimited while access is active", "One saved CV and letter, or any number for 90 days with the Pass"],
      ["Templates and content", "Wider template range and guided content", "Three UK layouts; AI suggestions you approve"],
      ["After you stop paying", "Check LiveCareer's account terms", "Paid documents stay editable and downloadable"],
      ["Cancelling", "Settings, then Subscription; keep the reference", "Nothing to cancel"],
    ],
    chooseBrand: ["You'll finish inside the 14-day trial and cancel", "You like LiveCareer's guided content", "Your documents are already there"],
    cancel: {
      checked: cancelChecked,
      steps: [
        "Log in with the email linked to the subscription.",
        "Click your name on the dashboard and open Settings.",
        "Choose Subscription, then Cancel.",
        "Follow the prompts until you see a clear cancellation result.",
        "Keep the email with your cancellation reference; LiveCareer's UK terms say one is sent.",
      ],
      afterCancelling: "Check that no new renewal appears on your statement.",
      statement: "LiveCareer.co.uk, BLD*Livecareer.co.uk or PayPal *LIVECAREER",
      sources: [["LiveCareer pricing", "https://www.livecareer.co.uk/pricing"], ["LiveCareer terms", "https://www.livecareer.co.uk/terms-of-service"]],
    },
    faqs: [
      { question: "Is LiveCareer free?", answer: "Building is free, but the free download is plain text. Word and PDF need paid access, which costs £1.95 for 14 days and then renews at £19.85 every four weeks unless cancelled." },
      { question: "Are LiveCareer and MyPerfectCV the same company?", answer: "Both name BOLD LLC in their terms of use, as does Zety. See our MyPerfectCV vs LiveCareer comparison for how their plans differ." },
    ],
  },
  {
    path: "/workcv-vs-resume-io-uk",
    replaces: "/cancel-resume-io-uk",
    brand: "Resume.io",
    alternativeHref: "/resume-io-alternative-uk",
    title: "WorkCV vs Resume.io (UK): Price, Renewal, Cancelling",
    description: "Resume.io's 7-day trial renews every 4 weeks; WorkCV is £7.99 once with no renewal. Compare costs, downloads, templates and how to cancel Resume.io.",
    shortAnswer: [
      "Resume.io's free plan covers one resume and one cover letter, downloadable as plain text. PDF downloads need a paid plan: when we checked its UK pricing, £2.95 for 7 days, then £19.95 every four weeks until you cancel. WorkCV is £7.99 once for one CV and matching letter, as PDF and Word, with no renewal.",
      "Resume.io has more designs to choose from. WorkCV costs less unless you finish within a week and cancel, and you never have to cancel anything.",
    ],
    pricing: {
      checked: "23 July 2026",
      source: "https://resume.io/uk/pricing",
      freePlan: "One resume and one cover letter, with downloads in TXT format only.",
      trial: { label: "7-day trial", currency: "GBP", entryMinor: 295, entryDays: 7, renewalMinor: 1995, cycleDays: 28, renewalWording: "£2.95 for 7 days, then £19.95 every 4 weeks." },
      otherPlans: "A quarterly plan at £49.95 every 3 months. Resume.io's help centre says six-month and yearly plans don't auto-renew.",
      note: "Rechecked on 1 November 2026, Resume.io's pricing page showed us prices in rupees, so the pound figures date from 23 July 2026. The 7-day money-back guarantee and TXT-only free plan were still listed.",
    },
    rows: [
      ["Free use", "One resume and one letter; TXT download", "Build and preview free; no account to start"],
      ["Downloads", "Unlimited PDF on a paid plan", "PDF and editable Word for the paid CV and its letter"],
      ["Money-back guarantee", "7 days on the trial plan", "See WorkCV's refund policy"],
      ["Templates", "Larger design range", "Three UK layouts"],
      ["After you stop paying", "Check Resume.io's account terms", "Paid documents stay editable and downloadable"],
      ["Cancelling", "Public cancellation form, then confirm by email", "Nothing to cancel"],
    ],
    chooseBrand: ["You want Resume.io's designs", "You'll finish within 7 days and cancel, or rely on its money-back guarantee", "You need many versions in a short burst"],
    cancel: {
      checked: "1 November 2026",
      steps: [
        "Go to Resume.io's contact page and open the Cancel Subscription tab. You don't need to log in.",
        "Enter the email address on the account and click the cancel button.",
        "Confirm the cancellation from the email Resume.io sends. Check spam if it doesn't arrive.",
        "If your email isn't found, log in, click your profile photo, open Account Settings and use the downgrade option at the top.",
        "If neither works, email support@resume.io.",
      ],
      afterCancelling: "Deleting your account is a separate, permanent step in Account Settings; you don't need it to stop payments.",
      sources: [["Resume.io cancellation form", "https://resume.io/contact/cancel-subscription"], ["Resume.io help: cancelling", "https://help.resume.io/en/articles/3784896"]],
    },
    faqs: [
      { question: "Is Resume.io free?", answer: "The free plan includes one resume and one cover letter, downloadable as plain text. PDF downloads need a paid plan that renews every four weeks after a 7-day trial." },
      { question: "Can I cancel Resume.io without logging in?", answer: "Yes. Its cancellation form only needs the email address on the account, then you confirm from the email it sends." },
    ],
  },
  {
    path: "/workcv-vs-cvmaker-uk",
    replaces: "/cancel-cvmaker-uk",
    brand: "CVMaker",
    alternativeHref: "/cvmaker-alternative",
    title: "WorkCV vs CVMaker (UK): Price, Renewal and Cancelling",
    description: "CVMaker costs £0.99 for 7 days, then £19.99 a month. WorkCV is £7.99 once with no renewal. Compare costs, downloads and how to cancel CVMaker UK.",
    shortAnswer: [
      "CVMaker UK lets you build with a live preview for free, but downloading a CV or cover letter needs Pro: £0.99 for 7 days, then £19.99 a month until you cancel. WorkCV is £7.99 once for one CV and matching letter, as PDF and Word, with no renewal.",
      "CVMaker is the cheaper choice only if you download within the first week and cancel. Left running for 90 days, it costs £60.96, against £24.99 for WorkCV's 90-day Pass.",
    ],
    pricing: {
      checked: "1 November 2026",
      source: "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk",
      freePlan: "Build a CV with a live preview and save cover letters free. Downloading CVs and cover letters needs Pro.",
      trial: { label: "Pro trial", currency: "GBP", entryMinor: 99, entryDays: 7, renewalMinor: 1999, cycleDays: 30, renewalWording: "After this 7 day trial period, your account will automatically renew monthly for £19.99 per month." },
      otherPlans: "No other plan listed on the costs page.",
      note: "CVMaker bills monthly; totals below assume renewals 30 days apart.",
    },
    rows: [
      ["Free use", "Build with live preview; no downloads", "Build and preview free; no account to start"],
      ["Downloads", "CV and letter downloads on Pro", "PDF and editable Word for the paid CV and its letter"],
      ["Renewal", "£19.99 a month after the 7-day trial", "None"],
      ["Extras", "Vacancy search and CV examples", "Free ATS checker, job tracker and UK guides"],
      ["After you stop paying", "Access until the date in your cancellation email", "Paid documents stay editable and downloadable"],
      ["Cancelling", "Account settings, under Subscription", "Nothing to cancel"],
    ],
    chooseBrand: ["You'll download within 7 days and cancel straight away", "You want CVMaker's templates", "Your CV is already there"],
    cancel: {
      checked: "1 November 2026",
      steps: [
        "Log in to CVMaker.",
        "Click your name in the top right and choose Account settings.",
        "Under the Subscription heading, choose the cancel option. Cancelling here is processed immediately.",
        "Or ask the help desk through the contact page; that is processed once a member of staff handles it.",
        "Keep the confirmation email. It states the date your access ends.",
      ],
      afterCancelling: "You can use all features until the date in the email; download what you need before then.",
      sources: [["CVMaker: how to cancel", "https://www.cvmaker.uk/help/how-do-i-cancel-my-subscription"], ["CVMaker: costs", "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk"]],
    },
    faqs: [
      { question: "Is CVMaker free?", answer: "You can build a CV with a live preview free, but downloading CVs and cover letters needs Pro: £0.99 for 7 days, then £19.99 a month unless cancelled." },
      { question: "Does CVMaker cancel immediately?", answer: "Cancelling from your account is processed immediately, and you keep access until the date in the confirmation email." },
    ],
  },
  {
    path: "/workcv-vs-enhancv-uk",
    replaces: "/cancel-enhancv-uk",
    brand: "Enhancv",
    alternativeHref: "/enhancv-alternative-uk",
    title: "WorkCV vs Enhancv (UK): Price, Features, Cancelling",
    description: "Enhancv Pro is a renewing subscription with AI and ATS tools; WorkCV is £7.99 once with no renewal. Compare features, free plans and how to cancel Enhancv.",
    shortAnswer: [
      "Enhancv is a broader resume platform: Pro adds AI content suggestions, an ATS check, tailoring and up to 300 documents, on monthly, quarterly or semiannual plans that renew automatically. Its free plan lasts 7 days, with Enhancv branding and a limit of 12 section items. WorkCV is £7.99 once for one UK CV and matching letter, as PDF and Word, with no renewal.",
      "Pick Enhancv if you want its design range and career tools over several months. Pick WorkCV if you want a finished UK CV without a subscription.",
    ],
    pricing: {
      checked: "1 November 2026",
      source: "https://enhancv.com/pricing/",
      freePlan: "Valid for 7 days, with all templates and design tools, basic sections, Enhancv branding and a maximum of 12 section items.",
      otherPlans: "Pro on monthly, quarterly or semiannual billing, each renewing automatically.",
      note: "When we checked, Enhancv's pricing page showed euro placeholders instead of a Pro price (its page title said \"Starting from $16.50\"). Enhancv says prices vary by region and tax, so we don't quote a pound figure.",
    },
    rows: [
      ["Focus", "Global resume and career-tool platform", "UK CVs and cover letters"],
      ["Free use", "7-day free plan with branding and a 12-item limit", "Build and preview free; no account to start"],
      ["Paid model", "Pro subscription, renews automatically", "£7.99 once, or £24.99 for the 90-day Pass"],
      ["AI and checks", "Content suggestions, ATS check, tailoring, feedback", "AI suggestions you approve; free ATS checker"],
      ["Documents", "Up to 300 resumes and cover letters on Pro", "One saved CV and letter, or any number for 90 days with the Pass"],
      ["After you stop paying", "Account becomes read-only; existing documents can still be downloaded", "Paid documents stay editable and downloadable"],
    ],
    chooseBrand: ["You want a large design catalogue and career tools", "You'll keep refining resumes over several months", "You apply internationally as well as in the UK"],
    cancel: {
      checked: "1 November 2026",
      steps: [
        "While logged in, open the Billing page at app.enhancv.com/billing.",
        "Click Cancel Subscription.",
        "Answer the short survey and click Continue.",
        "Confirm. A popup shows when the cancellation succeeds.",
        "Refresh the Billing page: it should show Canceled and the date Pro access ends.",
      ],
      afterCancelling: "Pro access continues to the end of the paid period. After that the account is read-only: you can download existing documents but not edit or create new ones. Unsubscribing from the newsletter does not stop payments.",
      sources: [["Enhancv help: cancel your plan", "https://help.enhancv.com/en/articles/2794038-how-do-i-cancel-my-plan-and-stop-future-charges"], ["Enhancv terms", "https://enhancv.com/terms/"]],
    },
    faqs: [
      { question: "Is Enhancv free?", answer: "Enhancv's free plan lasts 7 days and includes Enhancv branding and a limit of 12 section items. Pro removes those limits on a renewing subscription." },
      { question: "What happens to my Enhancv resumes after I cancel?", answer: "You keep Pro until the end of the period you paid for. Then the account becomes read-only: existing documents can still be downloaded, but not edited." },
    ],
  },
];

export const workcvVsLinks = workcvVsBrands.map(({ path, brand }) => ({ href: path, name: brand }));

export function workcvVsPage(path: string) {
  const page = workcvVsBrands.find((item) => item.path === path);
  if (!page) throw new Error(`No WorkCV comparison for ${path}`);
  return page;
}
