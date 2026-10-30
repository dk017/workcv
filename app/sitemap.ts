import type { MetadataRoute } from "next";

import { comparisonCheckedIso, competitors } from "@/lib/competitors";
import { site } from "@/lib/site";

type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
};

const competitorRoutes: SitemapRoute[] = [
  { path: "/compare", priority: 0.9, changeFrequency: "monthly", lastModified: comparisonCheckedIso },
  ...competitors.flatMap((competitor): SitemapRoute[] => [
    { path: competitor.vsPath, priority: 0.85, changeFrequency: "monthly", lastModified: comparisonCheckedIso },
    { path: competitor.altPath, priority: 0.85, changeFrequency: "monthly", lastModified: comparisonCheckedIso },
  ]),
];

const routes = [
  { path: "/chatgpt-cv-to-pdf-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/convert-resume-to-uk-cv", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/shorten-cv-to-two-pages", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/cv-word-or-pdf-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-10-30" },
  { path: "/cv-builder-scams-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { path: "/cv-builder-no-subscription-uk", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-10-30" },
  { path: "/resume-builder-uk-no-subscription", priority: 0.9, changeFrequency: "weekly" },
  { path: "/resume-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/cv-vs-resume-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/cv-examples-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/templates", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/student-cv-template", priority: 0.75, changeFrequency: "monthly" },
  { path: "/school-leaver-cv-example", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cv-no-experience-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/career-change-cv-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/return-to-work-cv-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/cv-employment-gap-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/situations/made-redundant", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { path: "/cv-personal-statement-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-08-25" },
  { path: "/ats-cv-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/tools", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-07-10" },
  { path: "/tools/take-home-pay-calculator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/uk-living-wage-checker", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { path: "/tools/cover-letter-generator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/cv-bullet-point-generator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/cv-summary-generator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/cv-word-count-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/tools/cv-readability-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/cv-keyword-density-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/cv-gap-detector-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/blank-cv-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { path: "/tools/cv-template-word-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/tools/cover-letter-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/tools/redundancy-pay-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { path: "/tools/ats-score-checker", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/tools/uk-salary-by-job-title", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/tools/notice-period-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { path: "/tools/cv-format-checker-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/tools/first-job-cv-wizard-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/tools/transferable-skills-translator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/tools/cv-shortener-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/tools/uk-cv-converter", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/tools/career-gap-explainer-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { path: "/wordpress/uk-career-tools-plugin", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-27" },
  { path: "/wordpress/uk-career-tools-plugin/privacy", priority: 0.35, changeFrequency: "yearly", lastModified: "2026-07-27" },
  { path: "/chrome/job-keyword-highlighter", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-27" },
  { path: "/chrome/job-keyword-highlighter/privacy", priority: 0.35, changeFrequency: "yearly", lastModified: "2026-07-27" },
  { path: "/right-to-work-cv-uk", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-to-write-a-cv-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { path: "/professional-cv-template-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-customer-service-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { path: "/cv-template-engineer-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { path: "/cv-template-driver-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/cv-template-nurse-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { path: "/cv-template-teacher-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-warehouse-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { path: "/cv-template-graduate-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { path: "/cv-template-care-worker-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-06" },
  ...competitorRoutes,
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.35, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.45, changeFrequency: "yearly" },
] satisfies SitemapRoute[];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-13");

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: route.lastModified ? new Date(route.lastModified) : lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
