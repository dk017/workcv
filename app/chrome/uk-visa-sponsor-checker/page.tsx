import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";
import { withAgentMetadata } from "@/lib/agent-metadata";

export const metadata: Metadata = withAgentMetadata("/chrome/uk-visa-sponsor-checker", {
  title: "UK Visa Sponsor Checker – Chrome extension",
  description:
    "Free Chrome extension that shows which employers hold a UK visa sponsor licence, with badges on job listings from the Home Office register.",
  alternates: { canonical: "/chrome/uk-visa-sponsor-checker" },
});

const badges = [
  ["Licensed sponsor", "An employer with this exact name is on the Home Office register. Click the badge to see its routes, locations and rating."],
  ["Similar name listed", "No exact match, but similar legal names are on the register. Job boards often show a brand name instead of the legal one."],
  ["Not found on register", "No employer with this exact name holds a licence. Large employers often hold it under a different legal name. Search any other name the employer trades under before ruling it out."],
  ["Agency advert", "The advert was posted by a recruitment agency. Its own licence does not cover its clients’ jobs, so ask who is hiring."],
];

export default function SponsorExtensionPage() {
  return (
    <>
      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Free Chrome extension
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-navy md:text-6xl">
            See who can sponsor your visa while you browse jobs.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            The UK Visa Sponsor Checker puts a badge next to each employer on
            job listings, showing whether it holds a licence to sponsor workers.
            Answers come from the Home Office register of licensed sponsors,
            which WorkCV reloads from GOV.UK twice a day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {site.sponsorExtensionUrl ? (
              <a
                href={site.sponsorExtensionUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-12 items-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"
              >
                Add to Chrome, free
              </a>
            ) : null}
            <Link
              href="/tools/uk-visa-sponsor-checker"
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:border-navy"
            >
              Search the register online
            </Link>
            <Link
              href="/chrome/uk-visa-sponsor-checker/privacy"
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:border-navy"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>What the badges mean</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy">
              Four answers, each explained.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              Badges appear on LinkedIn, Indeed, Reed, Totaljobs, CV-Library and
              Glassdoor job pages. On any other job advert, open the extension
              and choose “Find the employer on this page”, or type a name.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-line bg-paper p-5">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page max-w-3xl">
          <SectionLabel>What a licence does not tell you</SectionLabel>
          <p className="mt-5 text-base leading-8 text-muted">
            A sponsor licence means the employer can sponsor workers. It does
            not mean a particular job meets the skill or salary rules, or that
            the employer will sponsor you. Ask the employer, and check the
            rules on GOV.UK. This is information, not immigration advice; for
            advice on your situation, use a{" "}
            <a
              href="https://www.gov.uk/find-an-immigration-adviser"
              target="_blank"
              rel="noopener"
              className="font-bold text-navy underline"
            >
              regulated immigration adviser
            </a>
            .
          </p>
          <Link href="/right-to-work-cv-uk" className="mt-6 inline-block font-bold text-navy underline">
            How to show your right to work on a UK CV
          </Link>
        </div>
      </section>
    </>
  );
}
