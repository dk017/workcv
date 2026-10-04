import type { Metadata } from "next";

import {
  FocusedAlternativePage,
  type FocusedAlternativeConfig,
} from "@/components/focused-alternative-page";
import { competitorPlans, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";

const liveCareer = competitorPlans.liveCareer;
const gbp = (minor: number) => formatMinor(minor, "GBP");

const slug = "/livecareer-alternative";

export const metadata: Metadata = {
  title: "LiveCareer Alternative UK - No Subscription",
  description:
    `Compare LiveCareer with WorkCV's ${site.price} one-time CV and cover letter bundle, including CV tools, billing and cancellation links.`,
  alternates: { canonical: slug },
  openGraph: {
    title: "LiveCareer Alternative UK - WorkCV",
    description:
      "An independent comparison between LiveCareer's wider career tools and WorkCV's focused one-CV model.",
    url: slug,
  },
};

const config: FocusedAlternativeConfig = {
  brand: "LiveCareer",
  slug,
  checkedDate: liveCareer.checked,
  kicker: "LiveCareer alternative UK",
  heading: "LiveCareer combines CV and cover-letter tools. WorkCV keeps one UK CV separate.",
  intro:
    `LiveCareer may suit people who want guided CV content and cover-letter tools through an ongoing service. WorkCV focuses on UK CVs with matching cover letters, sold as one-time payments: ${site.price} for one CV, or ${site.passPrice} for unlimited CVs and letters over ${site.passDays} days.`,
  competitorFit: [
    "You want integrated CV and cover-letter tools",
    "You value guided content across several career documents",
    "Its current trial, renewal and access terms suit your workflow",
    "You have checked the live support and cancellation routes",
  ],
  comparisonRows: [
    ["Primary focus", "CV, cover-letter and career-document platform", "Focused UK CV builder"],
    ["Before payment", "Build free; free downloads are TXT only", "Build and inspect the preview"],
    ["Paid model", `${gbp(liveCareer.trial.entryMinor)} for 14 days, or ${gbp(liveCareer.annual.totalMinor)} a year`, `${site.price} once per saved CV, or ${site.passPrice} once for ${site.passDays} days`],
    ["Renewal", `${gbp(liveCareer.trial.renewalMinor)} every 4 weeks after the trial until cancelled`, "No automatic WorkCV renewal"],
    ["Cover letters", "Available within LiveCareer's wider tool set", "Matching cover letter included with each CV"],
    ["Current limits", "Features and access depend on the selected plan", "Three CV layouts; no expert review service"],
    ["Company", `${liveCareer.operator}, which also runs MyPerfectCV and Zety`, "WorkCV, an independent UK CV builder"],
    ["Best fit", "Several career documents and ongoing tools", "UK CVs and cover letters without recurring billing"],
  ],
  cancellationHref: "/cancel-livecareer-uk",
  freePlan: `Partly. ${liveCareer.freePlan} The 14-day trial costs ${gbp(liveCareer.trial.entryMinor)} and then renews at ${gbp(liveCareer.trial.renewalMinor)} every four weeks unless you cancel. LiveCareer is run by ${liveCareer.operator}, which also runs MyPerfectCV.`,
  relatedComparisons: [["MyPerfectCV vs LiveCareer", "/myperfectcv-vs-livecareer-uk"]],
  cancellationCopy:
    "Starting a WorkCV document does not stop LiveCareer billing. Cancel through LiveCareer's official route, save the confirmation and check the next payment statement.",
  sources: [
    ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
    ["LiveCareer UK contact", "https://www.livecareer.co.uk/contact-us"],
    ["LiveCareer UK terms", "https://www.livecareer.co.uk/terms-of-use"],
  ],
  faqs: [
    { question: "What is a good LiveCareer alternative in the UK?", answer: `WorkCV may suit someone who wants UK CVs and cover letters without an ongoing subscription. It costs ${site.price} once for one saved CV and its matching cover letter as PDF and Word.` },
    { question: "How is WorkCV different from LiveCareer?", answer: "LiveCareer offers a wider set of career-document tools. WorkCV is narrower: UK CVs with matching cover letters, three layouts and no monthly WorkCV subscription." },
    { question: "Does WorkCV include cover letters?", answer: "Yes. Each saved CV includes a matching cover letter, and both download as PDF and editable Word for the same one-time payment." },
    { question: "Is LiveCareer free?", answer: `Partly. ${liveCareer.freePlan} The 14-day trial costs ${gbp(liveCareer.trial.entryMinor)}, then ${gbp(liveCareer.trial.renewalMinor)} every four weeks unless cancelled (checked ${liveCareer.checked}).` },
    { question: "How do I cancel LiveCareer?", answer: "Use LiveCareer's official account or support route. The separate WorkCV guide links to official sources and explains what evidence to keep." },
  ],
};

export default function LiveCareerAlternativePage() {
  return <FocusedAlternativePage config={config} />;
}
