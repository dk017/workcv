import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CvEditor } from "@/components/cv-editor";
import { getCurrentUser } from "@/lib/auth";
import { buildLoginHref } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "CV Editor",
  description:
    "Build a UK CV with guided sections, clean templates, and a live preview.",
  alternates: { canonical: "/editor" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: {
    template?: string;
    payment?: string;
    draftId?: string;
    roleTemplate?: string;
    new?: string;
    from?: string;
  };
}) {
  const user = await getCurrentUser();
  if (!user) {
    const editorParams = new URLSearchParams();
    if (searchParams.template) editorParams.set("template", searchParams.template);
    if (searchParams.payment) editorParams.set("payment", searchParams.payment);
    if (searchParams.draftId) editorParams.set("draftId", searchParams.draftId);
    if (searchParams.roleTemplate) editorParams.set("roleTemplate", searchParams.roleTemplate);
    if (searchParams.new) editorParams.set("new", searchParams.new);
    if (searchParams.from) editorParams.set("from", searchParams.from);
    redirect(
      buildLoginHref(
        `/editor${editorParams.toString() ? `?${editorParams.toString()}` : ""}`,
      ),
    );
  }

  return <CvEditor />;
}
