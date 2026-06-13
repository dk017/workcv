import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.95, changeFrequency: "weekly" },
  { path: "/cv-builder-no-subscription-uk", priority: 0.95, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-builder", priority: 0.8, changeFrequency: "monthly" },
  { path: "/student-cv-template", priority: 0.75, changeFrequency: "monthly" },
  { path: "/school-leaver-cv-example", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cv-with-no-experience", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cv-no-experience-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/career-change-cv-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/return-to-work-cv-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-employment-gap-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-personal-statement-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ats-cv-template-uk", priority: 0.85, changeFrequency: "monthly" },
  { path: "/myperfectcv-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/resume-io-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cvmaker-alternative", priority: 0.75, changeFrequency: "monthly" },
  { path: "/livecareer-alternative", priority: 0.75, changeFrequency: "monthly" },
  { path: "/cancel-myperfectcv-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cancel-resume-io-uk", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cancel-cvmaker-uk", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cancel-livecareer-uk", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cancel-enhancv-uk", priority: 0.75, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.35, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.45, changeFrequency: "yearly" },
  { path: "/editor", priority: 0.65, changeFrequency: "monthly" },
] satisfies Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-13");

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
