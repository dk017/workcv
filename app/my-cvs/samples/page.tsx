import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { SamplesLibrary } from "@/components/app/samples-library";
import { requireAppUser } from "@/lib/app-shell-data";

export const metadata: Metadata = {
  title: "Samples",
  description: "Sample UK CVs for common jobs to start your own from.",
  alternates: { canonical: "/my-cvs/samples" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function SamplesPage() {
  const { user, pass } = await requireAppUser("/my-cvs/samples");
  return (
    <AppShell email={user.email} pass={pass}>
      <SamplesLibrary />
    </AppShell>
  );
}
