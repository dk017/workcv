import type { Metadata } from "next";

import {
  FocusedAlternativePage,
  type FocusedAlternativeConfig,
} from "@/components/focused-alternative-page";
import { site } from "@/lib/site";

const slug = "/livecareer-alternative";

export const metadata: Metadata = {
  title: "LiveCareer Alternative UK - No Subscription CV Builder",
  description:
    `Compare LiveCareer with WorkCV's ${site.price} saved-CV PDF unlock, including CV tools, cover letters, billing and cancellation links.`,
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
  checkedDate: "23 July 2026",
  kicker: "LiveCareer alternative UK",
  heading: "LiveCareer combines CV and cover-letter tools. WorkCV keeps one UK CV separate.",
  intro:
    `LiveCareer may suit people who want guided CV content and cover-letter tools through an ongoing service. WorkCV focuses on one saved UK CV and a ${site.price} PDF unlock without a monthly WorkCV subscription.`,
  competitorFit: [
    "You want integrated CV and cover-letter tools",
    "You value guided content across several career documents",
    "Its current trial, renewal and access terms suit your workflow",
    "You have checked the live support and cancellation routes",
  ],
  comparisonRows: [
    ["Primary focus", "CV, cover-letter and career-document platform", "Focused UK CV builder"],
    ["Before payment", "Check current trial and download access", "Build and inspect the preview"],
    ["Paid model", "Trial or subscription terms shown by LiveCareer", `${site.price} unlock for the selected saved CV`],
    ["Renewal", "Check the live renewal terms before paying", "No automatic WorkCV renewal"],
    ["Cover letters", "Available within LiveCareer's wider tool set", "Not included currently"],
    ["Current limits", "Features and access depend on the selected plan", "No AI scoring or application tracking"],
    ["Best fit", "Several career documents and ongoing tools", "One practical UK CV without recurring billing"],
  ],
  cancellationHref: "/cancel-livecareer-uk",
  cancellationCopy:
    "Starting a WorkCV document does not stop LiveCareer billing. Cancel through LiveCareer's official route, save the confirmation and check the next payment statement.",
  sources: [
    ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
    ["LiveCareer UK contact", "https://www.livecareer.co.uk/contact-us"],
    ["LiveCareer UK terms", "https://www.livecareer.co.uk/terms-of-use"],
  ],
  faqs: [
    { question: "What is a good LiveCareer alternative in the UK?", answer: `WorkCV may suit someone who needs one saved UK CV rather than an ongoing career-document service. It costs ${site.price} to unlock the selected CV PDF.` },
    { question: "How is WorkCV different from LiveCareer?", answer: "LiveCareer offers a wider set of CV and cover-letter tools. WorkCV is narrower: one saved UK CV, three layouts and no monthly WorkCV subscription." },
    { question: "Does WorkCV include cover letters?", answer: "Not currently. Use LiveCareer or another service when integrated cover-letter creation is an essential part of the product choice." },
    { question: "How do I cancel LiveCareer?", answer: "Use LiveCareer's official account or support route. The separate WorkCV guide links to official sources and explains what evidence to keep." },
  ],
};

export default function LiveCareerAlternativePage() {
  return <FocusedAlternativePage config={config} />;
}
