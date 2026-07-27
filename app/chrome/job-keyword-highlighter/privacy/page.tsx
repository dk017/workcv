import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chrome Extension Privacy Policy",
  description: "Privacy policy for the WorkCV Job Keyword Highlighter Chrome extension.",
  alternates: { canonical: "/chrome/job-keyword-highlighter/privacy" },
};

export default function ChromeExtensionPrivacyPage() {
  return (
    <section className="bg-surface py-16">
      <article className="container-page max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
          WorkCV Job Keyword Highlighter
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-navy">
          Chrome extension privacy policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <p>
            The extension analyses visible text on the active tab only after the
            user clicks “Scan this page”. The analysis and highlighting run
            locally in Chrome.
          </p>
          <p>
            The extension does not transmit job-page text, browsing history,
            personal information or scan results to WorkCV or a third party. It
            does not use analytics, advertising, remote code, background scraping
            or cross-tab history.
          </p>
          <p>
            The extension requests <code>activeTab</code> so it can access only
            the page the user chooses, and <code>scripting</code> so it can inject
            its packaged scanner and highlight stylesheet after that request.
          </p>
          <p>
            Clicking the optional WorkCV link opens workcv.co.uk in a new tab.
            That visit is then covered by WorkCV’s website privacy policy and
            includes campaign parameters identifying the extension as the
            referral source.
          </p>
          <p>Last updated: 27 July 2026.</p>
        </div>
        <Link href="/chrome/job-keyword-highlighter" className="mt-8 inline-block font-bold text-navy underline">
          Back to extension information
        </Link>
      </article>
    </section>
  );
}
