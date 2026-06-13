import type { Metadata } from "next";

import { CvEditor } from "@/components/cv-editor";

export const metadata: Metadata = {
  title: "CV editor",
  description:
    "Build a UK CV with guided sections, clean templates, and a live preview.",
};

export default function EditorPage() {
  return <CvEditor />;
}
