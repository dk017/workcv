import type { Metadata } from "next";
import Link from "next/link";
import { withAgentMetadata } from "@/lib/agent-metadata";

export const metadata: Metadata = withAgentMetadata("/chrome/uk-visa-sponsor-checker/privacy", {
  title: "UK Visa Sponsor Checker Privacy Policy",
  description: "Privacy policy for the UK Visa Sponsor Checker Chrome extension by WorkCV.",
  alternates: { canonical: "/chrome/uk-visa-sponsor-checker/privacy" },
});

export default function SponsorExtensionPrivacyPage() {
  return (
    <section className="bg-surface py-16">
      <article className="container-page max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
          UK Visa Sponsor Checker by WorkCV
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-navy">
          Chrome extension privacy policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <p>
            On LinkedIn, Indeed, Reed, Totaljobs, CV-Library and Glassdoor job
            pages, the extension reads the employer names shown on the page and
            sends only those employer names to WorkCV, which searches the public
            Home Office register of licensed sponsors and returns the matching
            entries. It does not send the page address, your searches, the job
            adverts or anything about you. Names that look like recruitment
            agencies are not sent.
          </p>
          <p>
            Each answer is kept in your browser’s extension storage for one day,
            so the same employer is not checked twice, and is then deleted. The
            on/off setting is kept in Chrome’s synced extension settings.
          </p>
          <p>
            WorkCV does not link the names to an account or store them with your
            details. As with any web request, our server sees your IP address; it
            is held in memory for up to ten minutes to limit excessive use.
          </p>
          <p>
            On other sites, the extension reads a page only when you click “Find
            the employer on this page” in its popup. It then reads the employer
            from the job advert’s structured data, or the text you selected, and
            sends only that name.
          </p>
          <p>
            The extension does not collect browsing history, other tabs or
            personal information, and does not use analytics, advertising or
            remote code. Nothing is sold or shared with third parties.
          </p>
          <p>
            Permissions: <code>storage</code> keeps the one-day answers and your
            on/off setting; <code>activeTab</code> and <code>scripting</code> let
            the popup read the current page only after you click; access to
            workcv.co.uk sends the employer names to the register search.
          </p>
          <p>
            Links in the extension open workcv.co.uk in a new tab with campaign
            parameters identifying the extension. That visit is covered by
            WorkCV’s{" "}
            <Link href="/privacy" className="font-bold text-navy underline">website privacy policy</Link>.
          </p>
          <p>Last updated: 31 October 2026.</p>
        </div>
        <Link href="/chrome/uk-visa-sponsor-checker" className="mt-8 inline-block font-bold text-navy underline">
          Back to extension information
        </Link>
      </article>
    </section>
  );
}
