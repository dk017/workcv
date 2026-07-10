import type { Metadata } from "next";

import { ToolsHub } from "@/components/tools-hub";

export const metadata: Metadata = {
  title: "Free UK CV Tools - No Signup Required",
  description:
    "Free UK CV tools: ATS checker, personal statement generator, salary calculator, and more. No signup, no subscription.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free UK CV Tools - No Signup Required",
    description:
      "Free CV generators, checkers, salary calculators and Word templates for UK job seekers.",
    url: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsHub />;
}
