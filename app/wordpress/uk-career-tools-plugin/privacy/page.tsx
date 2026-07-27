import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WordPress Plugin Privacy",
  description: "Privacy information for the WorkCV UK Career Tools WordPress plugin.",
  alternates: { canonical: "/wordpress/uk-career-tools-plugin/privacy" },
};

export default function WordPressPluginPrivacyPage() {
  return (
    <section className="bg-surface py-16">
      <article className="container-page max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
          WorkCV UK Career Tools
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-navy">
          Plugin privacy information
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <p>
            The plugin loads calculator interfaces from{" "}
            <code>https://workcv.co.uk/embed/</code> inside an iframe. Values entered
            into the included calculators are processed in the visitor’s browser
            and are not submitted to a WorkCV account.
          </p>
          <p>
            Loading an embed necessarily sends standard web-request information
            to WorkCV’s hosting provider, including IP address, user agent,
            referring page and request time. WorkCV uses this information for
            security, reliability and aggregate traffic measurement.
          </p>
          <p>
            The plugin stores only its appearance and optional-link settings in
            the publisher’s WordPress database. It does not create visitor cookies
            or collect names, email addresses, CVs or calculator inputs.
          </p>
          <p>
            Optional WorkCV links can include campaign parameters so aggregate
            referrals can be distinguished from other traffic. Both the call to
            action and credit link are disabled by default.
          </p>
          <p>Last updated: 27 July 2026.</p>
        </div>
        <Link href="/wordpress/uk-career-tools-plugin" className="mt-8 inline-block font-bold text-navy underline">
          Back to plugin information
        </Link>
      </article>
    </section>
  );
}
