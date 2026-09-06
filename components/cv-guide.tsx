import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ButtonLink, RelatedLinksSection } from "@/components/marketing";
import { site } from "@/lib/site";

export const guideReviewed = "2026-09-06";
export function guideMetadata(path: string, title: string, description: string): Metadata {
  return { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path } };
}

export function Guide({ path, title, intro, children, links, action, placement }: {
  path: string; title: string; intro: string; children: ReactNode;
  links: Array<[string, string]>; action: [string, string]; placement: string;
}) {
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description: intro,
      mainEntityOfPage: `${site.url}${path}`, datePublished: guideReviewed, dateModified: guideReviewed,
      author: { "@type": "Organization", name: "WorkCV", url: site.url }, publisher: { "@type": "Organization", name: "WorkCV", url: site.url } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "UK CV guide", item: `${site.url}/how-to-write-a-cv-uk` },
      { "@type": "ListItem", position: 3, name: title, item: `${site.url}${path}` },
    ] },
  ];
  return <>
    {schemas.map((schema, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
      <div className="container-page max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted"><Link href="/">Home</Link> / <Link href="/how-to-write-a-cv-uk">UK CV guide</Link></nav>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-navy">Practical UK CV guide</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-navy md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
        <p className="mt-5 text-sm text-muted">By WorkCV · Reviewed <time dateTime={guideReviewed}>6 September 2026</time></p>
      </div>
    </section>
    <article className="container-page max-w-5xl space-y-12 py-12 md:py-16">{children}</article>
    <section className="border-y border-line bg-paper py-12"><div className="container-page max-w-5xl">
      <h2 className="font-display text-3xl font-semibold text-navy">Put the guidance into practice</h2>
      <p className="mb-6 mt-4 leading-7 text-muted">The blank Word template is free without an account. The WorkCV editor requires email-code login: build and preview free, then pay {site.price} once for the PDF of one saved CV. No subscription.</p>
      <ButtonLink href={action[1]} trackingLabel={placement}>{action[0]}</ButtonLink>
    </div></section>
    <RelatedLinksSection title="Continue with your CV" links={links} />
  </>;
}

export function GuideSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <section id={id} className="space-y-5 text-base leading-8 text-ink"><h2 className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">{title}</h2>{children}</section>;
}

export function GuideTable({ headings, rows, caption }: { headings: string[]; rows: string[][]; caption: string }) {
  const stackOnMobile = headings.length > 2;
  return <>
    {stackOnMobile && <div className="space-y-3 sm:hidden"><p className="font-bold text-navy">{caption}</p>{rows.map((row, i) => <dl key={i} className="space-y-3 rounded-lg border border-line bg-white p-5 text-sm leading-7">{row.map((cell, j) => <div key={j}><dt className="font-bold text-navy">{headings[j]}</dt><dd className="mt-1 text-ink">{cell}</dd></div>)}</dl>)}</div>}
    <div className={`${stackOnMobile ? "hidden sm:block" : "block"} overflow-x-auto rounded-lg border border-line`} tabIndex={0} role="region" aria-label={caption}>
    <table className="w-full border-collapse text-left text-sm leading-7"><caption className="bg-paper p-4 text-left font-bold text-navy">{caption}</caption>
      <thead className="bg-navy text-white"><tr>{headings.map(h => <th key={h} scope="col" className="p-4 align-top">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} className="border-t border-line bg-white">{row.map((cell, j) => j === 0 ? <th key={j} scope="row" className="p-4 align-top font-semibold text-navy">{cell}</th> : <td key={j} className="p-4 align-top">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div></>;
}

export function CvTextExample({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg border border-line-strong bg-white p-5 shadow-sm md:p-8">
    <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
    <p className="mb-5 mt-2 text-xs font-bold uppercase tracking-wide text-muted">Fictional candidate and organisations · Illustrative example</p>
    <div className="whitespace-pre-wrap break-words text-sm leading-7 text-ink">{text}</div>
  </div>;
}

export function GuideSource({ href, children }: { href: string; children: ReactNode }) {
  return <p className="text-sm leading-7 text-muted">Guidance: <a href={href} className="font-semibold text-navy underline underline-offset-4" rel="noopener noreferrer" target="_blank">{children}</a>.</p>;
}

export function WorkedSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-y border-line bg-paper py-16"><div className="container-page max-w-5xl space-y-6 text-base leading-8 text-ink">
    <p className="text-xs font-bold uppercase tracking-widest text-muted">WorkCV worked example · Reviewed 6 September 2026</p>
    <h2 className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">{title}</h2>{children}
  </div></section>;
}
