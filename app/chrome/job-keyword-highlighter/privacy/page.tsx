import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chrome Extension Privacy Policy",
  description: "Privacy policy for the WorkCV Tailor Your CV to This Job Chrome extension.",
  alternates: { canonical: "/chrome/job-keyword-highlighter/privacy" },
};

export default function ChromeExtensionPrivacyPage() {
  return (
    <section className="bg-surface py-16">
      <article className="container-page max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
          WorkCV: Tailor Your CV to This Job
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-navy">
          Chrome extension privacy policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <p>
            The extension reads the active tab only after the user clicks one of
            its buttons. “Highlight keywords” analyses and highlights the visible
            text locally in Chrome and sends nothing anywhere.
          </p>
          <p>
            “Tailor my CV for this job” reads the job title, employer and advert
            text from that page (or the text the user has selected) and opens
            workcv.co.uk in a new tab with those details in the address fragment
            (the part after “#”). Browsers do not send the fragment to web
            servers. The WorkCV page removes it from the address bar, shows the
            details for the user to check, and saves them to the user’s WorkCV
            account only when the user continues. From that point the job details
            are covered by WorkCV’s{" "}
            <Link href="/privacy" className="font-bold text-navy underline">website privacy policy</Link>.
          </p>
          <p>
            The extension does not transmit browsing history, other tabs or
            personal information to WorkCV or a third party. It does not use
            analytics, advertising, remote code, background scraping or
            cross-tab history.
          </p>
          <p>
            The extension requests <code>activeTab</code> so it can access only
            the page the user chooses, and <code>scripting</code> so it can inject
            its packaged scanner, job reader and highlight stylesheet after that
            request.
          </p>
          <p>
            Clicking the optional WorkCV link opens workcv.co.uk in a new tab.
            That visit is then covered by WorkCV’s website privacy policy and
            includes campaign parameters identifying the extension as the
            referral source.
          </p>
          <p>Last updated: 3 October 2026.</p>
        </div>
        <Link href="/chrome/job-keyword-highlighter" className="mt-8 inline-block font-bold text-navy underline">
          Back to extension information
        </Link>
      </article>
    </section>
  );
}
