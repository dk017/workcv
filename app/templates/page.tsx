import type { Metadata } from "next";

import { TemplateGallery } from "@/components/template-gallery";

export const metadata: Metadata = {
  title: "Editable UK CV Templates - Open in the CV Editor",
  description:
    "Compare editable UK CV templates, open any layout in the editor and preview every page before paying for your finished PDF.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Editable UK CV Templates - WorkCV",
    description:
      "Choose a UK CV layout, replace the example with your details and preview the finished pages before paying.",
    url: "/templates",
  },
};

export default function Page() {
  return <TemplateGallery />;
}
