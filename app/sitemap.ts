import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.95, changeFrequency: "weekly" },
  { path: "/cv-builder-scams-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-29" },
  { path: "/cv-builder-no-subscription-uk", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-06-22" },
  { path: "/resume-builder-uk-no-subscription", priority: 0.9, changeFrequency: "weekly" },
  { path: "/resume-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/cv-vs-resume-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/cv-examples-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/templates", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/student-cv-template", priority: 0.75, changeFrequency: "monthly" },
  { path: "/school-leaver-cv-example", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cv-no-experience-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/career-change-cv-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/return-to-work-cv-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-employment-gap-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/situations/made-redundant", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { path: "/cv-personal-statement-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ats-cv-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { path: "/tools", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-06-30" },
  { path: "/tools/salary-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { path: "/tools/redundancy-pay-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { path: "/tools/ats-score-checker", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/tools/cv-length-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/tools/uk-salary-by-job-title", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/tools/personal-statement-generator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/tools/notice-period-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-28" },
  { path: "/right-to-work-cv-uk", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-to-write-a-cv-uk", priority: 0.95, changeFrequency: "monthly" },
  { path: "/professional-cv-template-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-customer-service-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/cv-template-engineer-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/cv-template-driver-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { path: "/cv-template-nurse-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-teacher-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-warehouse-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-graduate-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cv-template-care-worker-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/myperfectcv-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/resume-io-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/zety-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/canva-cv-alternative-uk", priority: 0.8, changeFrequency: "monthly" },
  { path: "/enhancv-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cvmaker-alternative", priority: 0.75, changeFrequency: "monthly" },
  { path: "/livecareer-alternative", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cancel-myperfectcv-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cancel-resume-io-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cancel-cvmaker-uk", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cancel-livecareer-uk", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cancel-enhancv-uk", priority: 0.75, changeFrequency: "weekly" },
  { path: "/cancel-zety-uk", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.35, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.45, changeFrequency: "yearly" },
  { path: "/editor", priority: 0.65, changeFrequency: "monthly" },
] satisfies Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-13");

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: route.lastModified ? new Date(route.lastModified) : lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
