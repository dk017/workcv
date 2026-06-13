import type { Metadata } from "next";

import { TemplateGallery } from "@/components/template-gallery";

export const metadata: Metadata = {
  title: "UK CV templates",
  description:
    "Compare clean UK CV templates for standard applications, experienced candidates, students, school leavers, and early-career CVs.",
};

export default function Page() {
  return <TemplateGallery />;
}
