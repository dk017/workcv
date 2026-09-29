import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, Mail, ShieldCheck, Wallet } from "lucide-react";

import { ButtonLink, SectionLabel } from "@/components/marketing";
import { founder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About WorkCV - Who Builds It and How",
  description:
    "WorkCV is an independent UK CV builder run by Dhineshkumar R. How it is built, how guides are checked against UK sources, and how it makes money.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About WorkCV",
    description: "Who builds WorkCV, how guides are checked and how the site makes money.",
    url: "/about",
  },
};

const principles = [
  {
    icon: Wallet,
    title: "How WorkCV makes money",
    body: `Building and previewing a CV is free. People pay ${site.price} once to download a CV and its matching cover letter, or ${site.passPrice} once for a ${site.passDays}-day Job Search Pass. There are no subscriptions or automatic renewals, the site shows no ads, and usage data is not used for cross-site advertising (see the privacy policy).`,
  },
  {
    icon: BookOpenCheck,
    title: "How guides are checked",
    body: "Guides are written for UK applications and checked against primary sources such as GOV.UK, the National Careers Service, Acas and Prospects, which are linked on each page. Pages show the date their guidance was last reviewed, and examples are clearly marked as fictional.",
  },
  {
    icon: ShieldCheck,
    title: "What WorkCV will not claim",
    body: "No tool can guarantee an interview or a job. WorkCV avoids invented success rates and fake reviews, and guides link to the sources they rely on so you can check them yourself.",
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${site.url}/about`,
  name: "About WorkCV",
  mainEntity: {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: "contact@workcv.co.uk",
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      homeLocation: { "@type": "Country", name: founder.location },
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <SectionLabel>About WorkCV</SectionLabel>
          <h1 className="font-display text-5xl font-semibold leading-[1.04] text-navy md:text-6xl">
            A UK CV builder without the subscription trap.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            Many CV builders start with a low-cost trial that quietly turns into a repeating monthly charge. WorkCV was
            built to do the opposite: help you write a clear UK CV and cover letter, show you every page before you pay,
            and charge once.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page grid max-w-5xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Who builds it</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-navy">{founder.name}</h2>
            <p className="mt-2 text-sm font-bold text-muted">{founder.role}, WorkCV · based in {founder.location}</p>
          </div>
          <div className="space-y-4 text-base leading-8 text-muted">
            <p>
              WorkCV is an independent product built and run by {founder.name} from {founder.location}, for people
              applying for jobs in the UK. The aim is simple: a clear price, shown before you pay, and nothing to
              cancel afterwards.
            </p>
            <p>
              The editor, templates and free tools are designed around UK conventions: a CV rather than a resume, no
              photo or date of birth, two pages for most roles, and cover letters that use the correct UK greeting and
              sign-off.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16">
        <div className="container-page grid max-w-5xl gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-xl border border-line bg-white p-6">
              <Icon className="h-6 w-6 text-gold" />
              <h2 className="mt-4 font-display text-xl font-semibold text-navy">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page max-w-4xl">
          <SectionLabel>Get in touch</SectionLabel>
          <p className="text-base leading-8 text-muted">
            Questions, corrections or feedback on a guide are welcome. If you spot something out of date, tell us and it
            will be checked against the original source.
          </p>
          <p className="mt-4 flex items-center gap-2 font-bold text-navy">
            <Mail className="h-5 w-5" />
            <a href="mailto:contact@workcv.co.uk" className="underline">contact@workcv.co.uk</a>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/editor">Start building free</ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">See pricing</ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">
            Read the <Link href="/privacy" className="underline">privacy policy</Link>,{" "}
            <Link href="/terms" className="underline">terms</Link> and{" "}
            <Link href="/refund-policy" className="underline">refund policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
