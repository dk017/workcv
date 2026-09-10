"use client";

import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const situationLabels: Record<string, string> = {
  "made-redundant": "Made redundant",
};

export function BreadcrumbSchema() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // BreadcrumbList is only emitted where the page has a matching visible
  // breadcrumb trail. Tool pages do not currently render that navigation.
  if (segments[0] !== "situations" || !segments[1]) {
    return null;
  }

  const items = [
    ["Home", "/"],
    [situationLabels[segments[1]] || titleFromSlug(segments[1]), pathname],
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${site.url}${path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
