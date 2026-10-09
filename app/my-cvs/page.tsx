import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { Dashboard, type DashboardCv } from "@/components/app/dashboard";
import { stepForIssue } from "@/components/editor/steps";
import { requireAppUser } from "@/lib/app-shell-data";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { listCvDocuments } from "@/lib/cv-documents";
import { cvDisplayTitle } from "@/lib/cv-label";
import { calculateCvReadiness } from "@/lib/cv-readiness";
import { templates } from "@/lib/editor-data";
import { greetingFor, timeAgo } from "@/lib/relative-time";

export const metadata: Metadata = {
  title: "My CVs",
  description: "Open your saved WorkCV documents or create a new UK CV.",
  alternates: { canonical: "/my-cvs" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function MyCvsPage() {
  const { user, pass } = await requireAppUser("/my-cvs");
  const documents = await listCvDocuments(user.id);
  const now = new Date();

  const cvs: DashboardCv[] = documents.map((document) => {
    const cv = document.data;
    const readiness = calculateCvReadiness(cv);
    const next = readiness.issues[0];
    const employer = cv.coverLetter?.employer.trim();
    return {
      id: document.id,
      title: cvDisplayTitle(cv),
      templateName: templates.find((template) => template.id === document.template)?.name || "Classic",
      paid: document.paid,
      tailored: Boolean(cv.targeting),
      hasLetter: hasCoverLetterContent(cv),
      letterTitle: employer ? `Letter to ${employer}` : `Letter for ${cv.coverLetter?.jobTitle.trim() || cv.targetRole.trim() || "your CV"}`,
      score: readiness.score,
      nextIssue: next?.message ?? null,
      nextStep: next ? stepForIssue(next) : "finish",
      edited: timeAgo(document.updatedAt, now),
      editedAt: document.updatedAt,
      data: cv,
    };
  });

  const firstName = documents[0]?.data.fullName.trim().split(/\s+/)[0];
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" }).format(now);

  return (
    <AppShell email={user.email} pass={pass}>
      <Dashboard heading={`${greetingFor(now)}${firstName ? `, ${firstName}` : ""}`} today={today} documents={cvs} />
    </AppShell>
  );
}
