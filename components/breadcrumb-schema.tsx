"use client";

import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

const toolLabels: Record<string, string> = {
  "ats-score-checker": "ATS CV checker",
  "blank-cv-template-uk": "Blank CV template",
  "cover-letter-generator-uk": "Cover letter generator",
  "cover-letter-template-uk": "Cover letter template",
  "cv-bullet-point-generator": "CV bullet point generator",
  "cv-gap-detector-uk": "CV gap detector",
  "cv-keyword-density-checker": "CV keyword density checker",
  "cv-readability-checker": "CV readability checker",
  "cv-summary-generator-uk": "CV summary generator",
  "cv-template-word-uk": "CV template for Word",
  "cv-word-count-checker": "CV word count checker",
  "notice-period-calculator": "Notice period calculator",
  "redundancy-pay-calculator": "Redundancy pay calculator",
  "take-home-pay-calculator-uk": "Take-home pay calculator",
  "uk-living-wage-checker": "UK Living Wage checker",
  "uk-salary-by-job-title": "UK salary checker",
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BreadcrumbSchema() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "tools" && segments[0] !== "situations") {
    return null;
  }

  const items =
    segments[0] === "tools"
      ? [
          ["Home", "/"],
          ["Tools", "/tools"],
          ...(segments[1]
            ? [[toolLabels[segments[1]] || titleFromSlug(segments[1]), pathname]]
            : []),
        ]
      : [
          ["Home", "/"],
          ...(segments[1]
            ? [[titleFromSlug(segments[1]), pathname]]
            : [["Situations", "/situations"]]),
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
