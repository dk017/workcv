import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { JobTailorLanding } from "@/components/job-tailor-landing";
import { requireAppUser } from "@/lib/app-shell-data";
import { listCvDocuments } from "@/lib/cv-documents";
import { cvDisplayTitle } from "@/lib/cv-label";
import { timeAgo } from "@/lib/relative-time";

export const metadata: Metadata = {
  title: "Tailor a CV to a job",
  description: "Make a separate copy of one of your CVs for a vacancy and check it against the job advert.",
  alternates: { canonical: "/my-cvs/tailor" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function TailorInAppPage() {
  const { user, pass } = await requireAppUser("/my-cvs/tailor");
  const documents = await listCvDocuments(user.id);
  const now = new Date();
  const sourceCvs = documents.map((document) => ({
    id: document.id,
    title: cvDisplayTitle(document.data),
    detail: `edited ${timeAgo(document.updatedAt, now)}`,
  }));
  return (
    <AppShell email={user.email} pass={pass}>
      <JobTailorLanding sourceCvs={sourceCvs} />
    </AppShell>
  );
}
