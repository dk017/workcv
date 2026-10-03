import type { Metadata } from "next";

import { JobTailorLanding } from "@/components/job-tailor-landing";

export const metadata: Metadata = {
  title: "Tailor your CV for this job",
  description: "Make a separate copy of your saved WorkCV CV for one vacancy and check it against the job advert.",
  alternates: { canonical: "/tailor" },
  robots: { index: false, follow: false, nocache: true },
};

export default function TailorPage() {
  return <JobTailorLanding />;
}
