import Link from "next/link";

export const cancelGuides = [
  { href: "/cancel-myperfectcv-uk", name: "MyPerfectCV" },
  { href: "/cancel-zety-uk", name: "Zety" },
  { href: "/cancel-livecareer-uk", name: "LiveCareer" },
  { href: "/cancel-resume-io-uk", name: "Resume.io" },
  { href: "/cancel-cvmaker-uk", name: "CVMaker" },
  { href: "/cancel-enhancv-uk", name: "Enhancv" },
] as const;

// Cross-links between the cancellation guides so each is reachable from the
// others and from the charges explainer.
export function CancelGuideLinks({ current }: { current: string }) {
  return (
    <section className="border-t border-line bg-surface py-12">
      <div className="container-page">
        <h2 className="font-display text-2xl font-semibold text-navy">Cancelling another CV builder?</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {cancelGuides
            .filter((guide) => guide.href !== current)
            .map((guide) => (
              <Link key={guide.href} href={guide.href} className="rounded-md border border-line-strong bg-white px-4 py-2 text-sm font-bold text-navy hover:border-navy">
                How to cancel {guide.name}
              </Link>
            ))}
          <Link href="/cv-builder-scams-uk" className="rounded-md border border-line-strong bg-white px-4 py-2 text-sm font-bold text-navy hover:border-navy">
            Why CV builders charge after a trial
          </Link>
        </div>
      </div>
    </section>
  );
}
