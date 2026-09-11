"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

const toolLabels: Record<string, string> = {
  "ats-score-checker": "ATS CV checker",
  "blank-cv-template-uk": "Blank CV template",
  "career-gap-explainer-uk": "Career gap explainer",
  "cover-letter-generator-uk": "Cover letter generator",
  "cover-letter-template-uk": "Cover letter template",
  "cv-bullet-point-generator": "CV bullet point generator",
  "cv-format-checker-uk": "CV format checker",
  "cv-gap-detector-uk": "CV gap detector",
  "cv-keyword-density-checker": "CV keyword density checker",
  "cv-readability-checker": "CV readability checker",
  "cv-shortener-uk": "CV shortener",
  "cv-summary-generator-uk": "CV summary generator",
  "cv-template-word-uk": "CV template for Word",
  "cv-word-count-checker": "CV word count checker",
  "first-job-cv-wizard-uk": "First-job CV wizard",
  "notice-period-calculator": "Notice period calculator",
  "redundancy-pay-calculator": "Redundancy pay calculator",
  "take-home-pay-calculator-uk": "Take-home pay calculator",
  "transferable-skills-translator-uk": "Transferable skills translator",
  "uk-cv-converter": "UK CV converter",
  "uk-living-wage-checker": "UK Living Wage checker",
  "uk-salary-by-job-title": "UK salary checker",
};

function titleFromSlug(slug: string) {
  return (
    toolLabels[slug] ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function ToolBreadcrumbs() {
  const pathname = usePathname() || "/tools";
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[1] || "";
  const currentLabel = slug ? titleFromSlug(slug) : "Tools";
  const items = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    ...(slug ? [{ name: currentLabel, href: pathname }] : []),
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-paper">
        <div className="container-page py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">&rsaquo;</span> : null}
                {index === items.length - 1 ? (
                  <span aria-current="page" className="text-navy">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-navy">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
