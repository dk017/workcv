import type { Metadata } from "next";

import { TemplateGallery } from "@/components/template-gallery";
import { site } from "@/lib/site";

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
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "WorkCV UK CV templates",
    numberOfItems: 3,
    itemListElement: ["Classic", "Modern", "Compact"].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${name} WorkCV template`,
        url: `${site.url}/templates`,
        offers: {
          "@type": "Offer",
          price: site.priceAmount.toFixed(2),
          priceCurrency: site.priceCurrency,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <TemplateGallery />
    </>
  );
}
