import type { Metadata } from "next";

import { TemplateGallery } from "@/components/template-gallery";
import { site } from "@/lib/site";
import { withAgentMetadata } from "@/lib/agent-metadata";

export const metadata: Metadata = withAgentMetadata("/templates", {
  title: "CV Designs: Classic, Modern and Compact Layouts",
  description:
    "Compare the Classic, Modern and Compact CV designs, open any layout in the editor and preview every page before you pay.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "CV Designs: Classic, Modern and Compact - WorkCV",
    description:
      "Choose a UK CV layout, replace the example with your details and preview the finished pages before paying.",
    url: "/templates",
  },
}, `WorkCV's three CV designs, Classic, Modern and Compact, shown with the same fictional sample CV. Each opens in the editor; downloading the finished CV costs ${site.price} once.`);

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
