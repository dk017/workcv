import Link from "next/link";
import { jobPassExamples } from "@/lib/job-pass-examples";

const bullets = [
  "Coordinated the shared customer inbox and passed enquiries to the colleague responsible for the next action.",
  "Maintained Excel order-status sheets using filters and basic formulas to keep information available to the administration team.",
  "Checked dispatch information against customer orders and followed up differences with warehouse colleagues.",
  "Wrote a handover checklist used by the administration team.",
  "Trained two new colleagues on the internal order system.",
];

export function TailoringDemo() {
  return <section className="border-b border-line bg-white py-16"><div className="container-page max-w-5xl space-y-7">
    <h2 className="font-display text-3xl font-semibold text-navy">Worked example: sales administration to office administration</h2>
    <p className="leading-7">This fictional example is available without generating anything. Sam keeps the actual Senior Sales Administrator title and employment dates while making relevant records and coordination evidence easier to find. The target heading can say Office Administrator; the past job title stays unchanged.</p>
    <div className="grid gap-6 md:grid-cols-2"><Example title="Source CV" text={jobPassExamples.longCv} /><Example title="Target job advert" text={jobPassExamples.longAdvert} /></div>
    <h3 className="text-xl font-bold text-navy">Evidence review before writing</h3>
    <ul className="list-disc space-y-3 pl-6 leading-7"><li>Shared inbox: supported by the first bullet below.</li><li>Excel tracking: supported by filters and basic formulas. Do not upgrade this to advanced Excel.</li><li>Accurate records and communication: supported by checking dispatch information and following up with warehouse colleagues.</li><li>Appointment scheduling: not evidenced in this source CV. Ask Sam for a genuine example before claiming it.</li></ul>
    <Example title="Tailored profile" text="Administration professional experienced in shared-inbox coordination, Excel order records and checking dispatch information. Seeking an office administration role focused on accurate records and clear communication. Brings experience writing handover guidance and supporting new colleagues on established processes." />
    <h3 className="text-xl font-bold text-navy">Five selected CV bullets</h3>
    <ol className="list-decimal space-y-3 pl-6 leading-7">{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ol>
    <p className="text-sm leading-7">Each bullet is directly supported by Sam’s latest role above. Selecting and reordering truthful evidence can be enough; a measured achievement is not required. No appointment experience, technical-services background or performance improvement has been invented.</p>
    <Example title="Matching cover letter" text={jobPassExamples.longLetter} />
    <p className="leading-7">The letter connects records and inbox work to the vacancy while acknowledging the sector change. For another vacancy, reconsider the profile, evidence order and letter opening. Preserve actual titles, dates and qualifications. <Link href="/cv-after-long-service-uk" className="font-semibold underline">See the full long-service CV guide</Link> or <Link href="/tailor-cv-to-job-description-uk" className="font-semibold underline">use the evidence-bank workflow</Link>.</p>
  </div></section>;
}
function Example({ title, text }: { title: string; text: string }) {
  return <article className="min-w-0 rounded-lg border border-line bg-paper p-5"><h3 className="mb-4 text-xl font-bold text-navy">{title}</h3><div className="whitespace-pre-line break-words text-sm leading-7">{text}</div></article>;
}
