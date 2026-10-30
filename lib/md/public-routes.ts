import { customerReviewDate } from "../customer-content-review.ts";

export type PublicRouteSection = "core" | "guides" | "templates" | "tools" | "comparisons" | "extensions" | "legal";
export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export type PublicRoute = {
  section: PublicRouteSection;
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified?: string;
};

// Every indexable page. The sitemap, the markdown versions, llms.txt, llms-full.txt and the
// middleware's markdown negotiation all read this list, so a new public page is added here once.
export const publicRoutes = [
  { section: "guides", path: "/cv-after-long-service-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-05" },
  { section: "guides", path: "/overqualified-cv-example-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-05" },
  { section: "guides", path: "/tailor-cv-to-job-description-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "templates", path: "/cv-template-retail-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "guides", path: "/cv-layout-tests-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-24" },
  { section: "tools", path: "/tools/supporting-statement-planner-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-24" },
  { section: "guides", path: "/chatgpt-cv-to-pdf-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "guides", path: "/convert-resume-to-uk-cv", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "guides", path: "/shorten-cv-to-two-pages", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "guides", path: "/cv-word-or-pdf-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "core", path: "/", priority: 1.0, changeFrequency: "weekly" },
  { section: "core", path: "/career-tools", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-09-13" },
  { section: "guides", path: "/top-job-boards-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "guides", path: "/how-to-prepare-for-a-job-interview-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "guides", path: "/common-job-interview-questions-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "guides", path: "/thank-you-email-after-interview-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "guides", path: "/career-advancement-strategies-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "core", path: "/pricing", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-10-02" },
  { section: "comparisons", path: "/best-cv-builder-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-10" },
  { section: "comparisons", path: "/cv-builder-scams-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-29" },
  { section: "core", path: "/cv-builder-no-subscription-uk", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-10-02" },
  { section: "guides", path: "/resume-builder-uk-no-subscription", priority: 0.9, changeFrequency: "weekly" },
  { section: "guides", path: "/cv-vs-resume-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "core", path: "/cv-examples-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "core", path: "/templates", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-24" },
  { section: "templates", path: "/student-cv-template", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "templates", path: "/school-leaver-cv-example", priority: 0.75, changeFrequency: "monthly" },
  { section: "guides", path: "/cv-no-experience-uk", priority: 0.85, changeFrequency: "monthly" },
  { section: "guides", path: "/career-change-cv-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "guides", path: "/return-to-work-cv-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "guides", path: "/cv-employment-gap-uk", priority: 0.85, changeFrequency: "monthly" },
  { section: "guides", path: "/situations/made-redundant", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "guides", path: "/cv-personal-statement-uk", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-08-25" },
  { section: "templates", path: "/ats-cv-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-22" },
  { section: "core", path: "/tools", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/take-home-pay-calculator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/uk-visa-sponsor-checker", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-10-05" },
  { section: "tools", path: "/tools/uk-living-wage-checker", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { section: "tools", path: "/tools/cover-letter-generator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/job-application-pack-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-13" },
  { section: "tools", path: "/tools/job-application-tracker-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "tools", path: "/tools/cv-bullet-point-generator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/cv-summary-generator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/cv-word-count-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "tools", path: "/tools/cv-readability-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/cv-keyword-density-checker", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/cv-gap-detector-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { section: "tools", path: "/tools/blank-cv-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { section: "tools", path: "/tools/cv-template-word-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-06" },
  { section: "core", path: "/about", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-09-29" },
  { section: "guides", path: "/how-long-should-a-cv-be-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-29" },
  { section: "core", path: "/cover-letter-examples-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "tools", path: "/tools/cover-letter-template-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { section: "tools", path: "/tools/redundancy-pay-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-06-30" },
  { section: "tools", path: "/tools/ats-score-checker", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "tools", path: "/tools/uk-salary-by-job-title", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { section: "tools", path: "/tools/notice-period-calculator", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-30" },
  { section: "tools", path: "/tools/cv-format-checker-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-24" },
  { section: "tools", path: "/tools/first-job-cv-wizard-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { section: "tools", path: "/tools/transferable-skills-translator-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { section: "tools", path: "/tools/cv-shortener-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { section: "tools", path: "/tools/uk-cv-converter", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { section: "tools", path: "/tools/career-gap-explainer-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-09-08" },
  { section: "extensions", path: "/wordpress/uk-career-tools-plugin", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-27" },
  { section: "extensions", path: "/wordpress/uk-career-tools-plugin/privacy", priority: 0.35, changeFrequency: "yearly", lastModified: "2026-07-27" },
  { section: "extensions", path: "/chrome/job-keyword-highlighter", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-27" },
  { section: "extensions", path: "/chrome/job-keyword-highlighter/privacy", priority: 0.35, changeFrequency: "yearly", lastModified: "2026-07-27" },
  { section: "guides", path: "/right-to-work-cv-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-05" },
  { section: "guides", path: "/how-to-write-a-cv-uk", priority: 0.95, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "templates", path: "/professional-cv-template-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-29" },
  { section: "templates", path: "/cv-template-customer-service-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "templates", path: "/cv-template-engineer-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { section: "templates", path: "/cv-template-driver-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
  { section: "templates", path: "/cv-template-nurse-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { section: "templates", path: "/cv-template-teacher-uk", priority: 0.9, changeFrequency: "monthly" },
  { section: "templates", path: "/cv-template-warehouse-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "templates", path: "/cv-template-graduate-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-26" },
  { section: "templates", path: "/cv-template-care-worker-uk", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-02" },
  { section: "comparisons", path: "/myperfectcv-alternative-uk", priority: 0.85, changeFrequency: "weekly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/myperfectcv-vs-livecareer-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/zety-vs-myperfectcv-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/kickresume-alternative-uk", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/resume-io-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { section: "comparisons", path: "/zety-alternative-uk", priority: 0.85, changeFrequency: "weekly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/canva-cv-alternative-uk", priority: 0.8, changeFrequency: "monthly" },
  { section: "comparisons", path: "/enhancv-alternative-uk", priority: 0.85, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cvmaker-alternative", priority: 0.75, changeFrequency: "monthly" },
  { section: "comparisons", path: "/livecareer-alternative", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-10-04" },
  { section: "comparisons", path: "/cancel-myperfectcv-uk", priority: 0.85, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cancel-resume-io-uk", priority: 0.85, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cancel-cvmaker-uk", priority: 0.8, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cancel-livecareer-uk", priority: 0.8, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cancel-enhancv-uk", priority: 0.75, changeFrequency: "weekly" },
  { section: "comparisons", path: "/cancel-zety-uk", priority: 0.8, changeFrequency: "weekly" },
  { section: "core", path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { section: "legal", path: "/privacy", priority: 0.35, changeFrequency: "yearly", lastModified: "2026-09-23" },
  { section: "legal", path: "/terms", priority: 0.35, changeFrequency: "yearly" },
  { section: "legal", path: "/refund-policy", priority: 0.45, changeFrequency: "yearly" },
] as const satisfies readonly PublicRoute[];

// Pages that exist under app/ but are deliberately not public. tests/agent-markdown.test.ts
// fails when a page is in neither list.
export const nonPublicRoutes: Record<string, string> = {
  "/account": "signed-in account page",
  "/admin": "admin only",
  "/admin/analytics": "admin only",
  "/cv-builder": "redirects to /cv-builder-no-subscription-uk",
  "/cv-builder-no-subscription": "redirects to /cv-builder-no-subscription-uk",
  "/cv-with-no-experience": "redirects to /cv-no-experience-uk (next.config.js)",
  "/cv-pdf/[documentId]": "private PDF render of a user's CV",
  "/cv-pdf/[documentId]/cover-letter": "private PDF render of a user's cover letter",
  "/cv-pdf-parity": "internal PDF test page",
  "/editor": "signed-in editor",
  "/login": "sign-in form",
  "/my-cvs": "signed-in app",
  "/my-cvs/samples": "signed-in app",
  "/my-cvs/tailor": "signed-in app",
  "/my-cvs/tracker": "signed-in app",
  "/software-testing-strategies-uk": "noindex page",
  "/tailor": "noindex landing used by the Chrome extension",
  "/feedback/unsubscribe": "noindex email unsubscribe page",
  "/embed/living-wage-checker": "noindex iframe embed",
  "/embed/redundancy-pay-calculator": "noindex iframe embed",
  "/embed/take-home-pay-calculator": "noindex iframe embed",
};

// Path prefixes that are never public content. robots.txt and ai.txt both read this list.
// Pages that public pages link to (the editor, sign-in, My CVs) stay crawlable and rely on their
// noindex header: a robots.txt block would hide that header and leave the bare URL indexable.
export const privatePaths = [
  { path: "/admin", robotsDisallow: true },
  { path: "/api/", robotsDisallow: true },
  { path: "/cv-pdf", robotsDisallow: true },
  { path: "/embed/", robotsDisallow: true },
  { path: "/feedback/", robotsDisallow: true },
  { path: "/editor", robotsDisallow: false },
  { path: "/login", robotsDisallow: false },
  { path: "/my-cvs", robotsDisallow: false },
  { path: "/account", robotsDisallow: false },
] as const;

const publicPaths = new Set<string>(publicRoutes.map((route) => route.path));

export function isPublicRoute(path: string) {
  return publicPaths.has(path);
}

export function findPublicRoute(path: string): PublicRoute | undefined {
  return publicRoutes.find((route) => route.path === path);
}

export function routeLastModified(route: PublicRoute) {
  return customerReviewDate(route.path) ?? route.lastModified;
}
