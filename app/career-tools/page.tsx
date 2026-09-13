import type { Metadata } from "next";

import { CareerToolsHub } from "@/components/career-tools-hub";

export const metadata: Metadata = {
  title: "Career and Work Tools for UK Job Seekers",
  description:
    "Practical UK job-search guides and application tools for interviews, CVs, career progression and employment changes.",
  alternates: { canonical: "/career-tools" },
  openGraph: {
    title: "Career and Work Tools for UK Job Seekers",
    description:
      "Move from a job-search question to a clearer application and UK CV.",
    url: "/career-tools",
  },
};

export default function CareerToolsPage() {
  return <CareerToolsHub />;
}
