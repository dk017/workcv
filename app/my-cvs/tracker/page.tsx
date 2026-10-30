import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { JobApplicationTracker } from "@/components/job-application-tracker";
import { requireAppUser } from "@/lib/app-shell-data";

export const metadata: Metadata = {
  title: "Job tracker",
  description: "Track the jobs you apply for, their closing dates and what to do next.",
  alternates: { canonical: "/my-cvs/tracker" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function TrackerPage() {
  const { user, pass } = await requireAppUser("/my-cvs/tracker");
  return (
    <AppShell email={user.email} pass={pass}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Job tracker</h1>
          <p className="mt-2 max-w-2xl text-muted">Keep every application, closing date and follow-up in one place. The tracker is saved in this browser only, so it isn’t shared with your other devices.</p>
        </div>
        <JobApplicationTracker />
      </div>
    </AppShell>
  );
}
