"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

type Crumb = { name: string; href: string };

// Visible breadcrumb trail plus matching BreadcrumbList for content pages
// that do not render their own. Tools and situations pages keep their
// existing trails; unlisted routes (home, editor, account) render nothing.
const sections = {
  templates: { name: "CV templates", href: "/templates" },
  pricing: { name: "Pricing", href: "/pricing" },
} as const;

const pages: Record<string, { name: string; parent?: keyof typeof sections }> = {
  "/templates": { name: "CV templates" },
  "/ats-cv-template-uk": { name: "ATS CV template", parent: "templates" },
  "/professional-cv-template-uk": { name: "UK CV template", parent: "templates" },
  "/student-cv-template": { name: "Student CV template", parent: "templates" },
  "/school-leaver-cv-example": { name: "School leaver CV", parent: "templates" },
  "/cv-template-care-worker-uk": { name: "Care worker CV", parent: "templates" },
  "/cv-template-customer-service-uk": { name: "Customer service CV", parent: "templates" },
  "/cv-template-driver-uk": { name: "Driver CV", parent: "templates" },
  "/cv-template-engineer-uk": { name: "Engineer CV", parent: "templates" },
  "/cv-template-graduate-uk": { name: "Graduate CV", parent: "templates" },
  "/cv-template-nurse-uk": { name: "Nurse CV", parent: "templates" },
  "/cv-template-teacher-uk": { name: "Teacher CV", parent: "templates" },
  "/cv-template-warehouse-uk": { name: "Warehouse CV", parent: "templates" },
  "/pricing": { name: "Pricing" },
  "/cv-builder-no-subscription-uk": { name: "No-subscription CV builder", parent: "pricing" },
  "/resume-builder-uk-no-subscription": { name: "No-subscription resume builder", parent: "pricing" },
  "/cv-builder-scams-uk": { name: "CV builder charges", parent: "pricing" },
  "/cancel-cvmaker-uk": { name: "Cancel CVMaker", parent: "pricing" },
  "/cancel-enhancv-uk": { name: "Cancel Enhancv", parent: "pricing" },
  "/cancel-livecareer-uk": { name: "Cancel LiveCareer", parent: "pricing" },
  "/cancel-myperfectcv-uk": { name: "Cancel MyPerfectCV", parent: "pricing" },
  "/cancel-resume-io-uk": { name: "Cancel Resume.io", parent: "pricing" },
  "/cancel-zety-uk": { name: "Cancel Zety", parent: "pricing" },
  "/canva-cv-alternative-uk": { name: "Canva CV alternative", parent: "pricing" },
  "/cvmaker-alternative": { name: "CVMaker alternative", parent: "pricing" },
  "/enhancv-alternative-uk": { name: "Enhancv alternative", parent: "pricing" },
  "/livecareer-alternative": { name: "LiveCareer alternative", parent: "pricing" },
  "/myperfectcv-alternative-uk": { name: "MyPerfectCV alternative", parent: "pricing" },
  "/resume-io-alternative-uk": { name: "Resume.io alternative", parent: "pricing" },
  "/zety-alternative-uk": { name: "Zety alternative", parent: "pricing" },
  "/career-change-cv-uk": { name: "Career change CV" },
  "/cover-letter-examples-uk": { name: "Cover letter examples" },
  "/cv-employment-gap-uk": { name: "Employment gaps" },
  "/cv-examples-uk": { name: "CV examples" },
  "/cv-layout-tests-uk": { name: "CV layout tests" },
  "/cv-no-experience-uk": { name: "CV with no experience" },
  "/cv-personal-statement-uk": { name: "CV personal statement" },
  "/cv-vs-resume-uk": { name: "CV vs resume" },
  "/how-to-write-a-cv-uk": { name: "How to write a CV" },
  "/how-long-should-a-cv-be-uk": { name: "How long should a CV be" },
  "/return-to-work-cv-uk": { name: "Return to work CV" },
  "/right-to-work-cv-uk": { name: "Right to work on a CV" },
  "/about": { name: "About" },
  "/contact": { name: "Contact" },
  "/privacy": { name: "Privacy policy" },
  "/terms": { name: "Terms of use" },
  "/refund-policy": { name: "Refund policy" },
  "/chrome/job-keyword-highlighter": { name: "Chrome extension" },
  "/wordpress/uk-career-tools-plugin": { name: "WordPress plugin" },
};

const nestedPrivacy: Record<string, Crumb> = {
  "/chrome/job-keyword-highlighter/privacy": { name: "Chrome extension", href: "/chrome/job-keyword-highlighter" },
  "/wordpress/uk-career-tools-plugin/privacy": { name: "WordPress plugin", href: "/wordpress/uk-career-tools-plugin" },
};

export function breadcrumbTrail(pathname: string): Crumb[] | null {
  const path = pathname.replace(/\/$/, "") || "/";
  const privacyParent = nestedPrivacy[path];
  if (privacyParent) return [{ name: "Home", href: "/" }, privacyParent, { name: "Privacy", href: path }];
  const page = pages[path];
  if (!page) return null;
  const parent = page.parent ? sections[page.parent] : null;
  return [{ name: "Home", href: "/" }, ...(parent ? [parent] : []), { name: page.name, href: path }];
}

export function SiteBreadcrumbs() {
  const pathname = usePathname() || "/";
  const items = breadcrumbTrail(pathname);
  if (!items) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.href === "/" ? "" : item.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-paper">
        <div className="container-page py-3">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">&rsaquo;</span> : null}
                {index === items.length - 1 ? (
                  <span aria-current="page" className="text-navy">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-navy">{item.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
