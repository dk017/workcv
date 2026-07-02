import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CvEditor } from "@/components/cv-editor";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CV editor",
  description:
    "Build a UK CV with guided sections, clean templates, and a live preview.",
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
    const params = new URLSearchParams();
    const editorParams = new URLSearchParams();
    if (searchParams.template) editorParams.set("template", searchParams.template);
    if (searchParams.payment) editorParams.set("payment", searchParams.payment);
    if (searchParams.draftId) editorParams.set("draftId", searchParams.draftId);
    if (searchParams.roleTemplate) editorParams.set("roleTemplate", searchParams.roleTemplate);
    if (searchParams.new) editorParams.set("new", searchParams.new);
    if (searchParams.from) editorParams.set("from", searchParams.from);
    params.set("next", `/editor${editorParams.toString() ? `?${editorParams}` : ""}`);
    redirect(`/login?${params.toString()}`);
  }

  return <CvEditor />;
}
