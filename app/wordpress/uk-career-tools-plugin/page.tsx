import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Free UK Career Tools WordPress Plugin",
  description:
    "Add WorkCV take-home pay, Living Wage and redundancy calculators to WordPress with blocks or shortcodes.",
  alternates: { canonical: "/wordpress/uk-career-tools-plugin" },
};

const tools = [
  ["UK take-home pay calculator", "[workcv_take_home_pay]"],
  ["UK Living Wage checker", "[workcv_living_wage]"],
  ["UK redundancy pay calculator", "[workcv_redundancy_pay]"],
];

export default function WordPressPluginPage() {
  return (
    <>
      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Free WordPress plugin
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-navy md:text-6xl">
            Add maintained UK career tools to your website.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Give readers useful pay and employment calculators without rebuilding
            tax and statutory-limit logic inside WordPress. Add a Gutenberg block
            or shortcode; WorkCV maintains the hosted calculation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/downloads/workcv-uk-career-tools.zip"
              className="inline-flex min-h-12 items-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"
            >
              Download plugin ZIP
            </a>
            <Link
              href="/wordpress/uk-career-tools-plugin/privacy"
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:border-navy"
            >
              Privacy details
            </Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Version 0.1.0 · Requires WordPress 6.4 and PHP 8.0 or later
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Included tools</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy">
              Useful for career, HR and employee-support sites.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              Each tool is available as a block and a shortcode. The iframe
              resizes when results appear and supports white or warm-paper themes.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {tools.map(([name, shortcode]) => (
              <article key={name} className="py-6">
                <h3 className="font-display text-2xl font-semibold text-navy">{name}</h3>
                <code className="mt-3 inline-block rounded bg-paper px-3 py-2 text-sm text-ink">
                  {shortcode}
                </code>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div>
            <SectionLabel>Installation</SectionLabel>
            <ol className="mt-5 space-y-4 text-sm leading-7 text-muted">
              <li>1. Download the ZIP and upload it under Plugins → Add New.</li>
              <li>2. Activate “WorkCV UK Career Tools”.</li>
              <li>3. Add a WorkCV block or paste one of the shortcodes.</li>
              <li>4. Change optional defaults under Settings → WorkCV Tools.</li>
            </ol>
          </div>
          <div>
            <SectionLabel>Publisher-friendly</SectionLabel>
            <p className="mt-5 text-sm leading-7 text-muted">
              No account or API key is required. WorkCV call-to-action and credit
              links are optional and disabled by default. Embeds are marked
              noindex, so they do not compete with the publisher’s page in search.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              Publishers remain responsible for their surrounding copy and should
              review dated employment guidance when rules change.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
