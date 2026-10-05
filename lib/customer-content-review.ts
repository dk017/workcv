// Set after the content on each route has actually been reviewed. Publication dates remain separate.
export const customerContentReview = {
  "/cv-after-long-service-uk": "2026-10-05",
  "/overqualified-cv-example-uk": "2026-10-05",
  "/livecareer-alternative": "2026-10-05",
  "/myperfectcv-alternative-uk": "2026-10-05",
  "/cv-builder-no-subscription-uk": "2026-10-02",
  "/pricing": "2026-10-02",
  "/tools/blank-cv-template-uk": "2026-09-23",
  "/tools/cv-template-word-uk": "2026-09-23",
  "/chatgpt-cv-to-pdf-uk": "2026-09-23",
  "/tools/job-application-pack-uk": "2026-10-05",
  "/tools/ats-score-checker": "2026-10-02",
  "/canva-cv-alternative-uk": "2026-09-23",
  "/cv-word-or-pdf-uk": "2026-09-23",
  "/shorten-cv-to-two-pages": "2026-09-23",
  "/cv-personal-statement-uk": "2026-09-29",
  "/cv-no-experience-uk": "2026-09-23",
  "/tools/first-job-cv-wizard-uk": "2026-09-23",
  "/return-to-work-cv-uk": "2026-09-23",
  "/tools/cv-bullet-point-generator": "2026-09-23",
  "/top-job-boards-uk": "2026-09-23",
  "/contact": "2026-09-23",
  "/privacy": "2026-10-01",
} as const satisfies Record<string, string>;

export function customerReviewDate(path: string): string | undefined {
  return customerContentReview[path as keyof typeof customerContentReview];
}

export function displayReviewDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${isoDate}T00:00:00Z`));
}
