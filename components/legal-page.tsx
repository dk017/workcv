import Link from "next/link";

type LegalSection = {
  title: string;
  body: React.ReactNode;
};

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            WorkCV policy
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-navy md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">{intro}</p>
          <p className="mt-4 text-sm font-bold text-navy">Last updated: 13 June 2026</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-line bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-navy">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-xl font-semibold text-navy">Need help?</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Email us at{" "}
              <a className="font-bold text-navy" href="mailto:contact@workcv.co.uk">
                contact@workcv.co.uk
              </a>
              .
            </p>
            <div className="mt-5 grid gap-3 text-sm font-bold text-navy">
              <Link href="/contact">Contact</Link>
              <Link href="/refund-policy">Refund policy</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
