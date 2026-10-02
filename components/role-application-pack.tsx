import Link from "next/link";
import { roleTailoringNotes } from "@/lib/role-tailoring-notes";
import { getRoleApplicationPack, roleApplicationPacks } from "@/lib/role-application-packs";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site, commercialRoutes } from "@/lib/site";
import { TrackedLink } from "@/components/tracked-link";
import { RolePackForm } from "@/components/role-pack-form";
export function RoleApplicationPack({ id }: { id: string }) {
  const pack = getRoleApplicationPack(id);
  const tailoring = roleTailoringNotes[id];
  const cv = getRoleCvTemplate(pack.roleTemplate);
  const placement = `role_pack_${id.replaceAll("-", "_")}`;
  return <section id="application-pack" aria-labelledby="application-pack-title" className="scroll-mt-24 border-y border-line bg-surface py-16">
    <div className="container-page max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-wide text-muted">CV + matching cover letter</p>
      <h2 id="application-pack-title" className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">{pack.title} application pack</h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted">The CV example above and the letter below describe the same fictional applicant, {cv.fullName}. Use them to understand the structure, then enter your own facts. The example&apos;s jobs, qualifications and achievements are not copied into your draft.</p>
      <details className="mt-6 rounded-xl border border-line bg-white p-5">
        <summary className="cursor-pointer text-lg font-bold text-navy">Read the complete matching cover letter</summary>
        <article aria-label={`${pack.title} cover letter example`} className="mt-5 space-y-4 leading-7"><p>Dear Hiring Manager,</p>{pack.paragraphs.map(p => <p key={p}>{p}</p>)}<p>Yours faithfully,<br />{cv.fullName}</p></article>
        <h3 className="mt-6 font-bold text-navy">Why this matches the CV</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">{pack.why.map(p => <li key={p}>{p}</li>)}</ul>
      </details>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-5"><h3 className="text-xl font-bold text-navy">Free application checklist</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">{pack.checklist.map(p => <li key={p}>{p}</li>)}</ul><TrackedLink href={`/downloads/${id}-application-checklist.txt`} download placement={`${placement}_checklist`} className="mt-5 inline-block font-bold text-navy underline">Download the free checklist (.txt)</TrackedLink><p className="mt-2 text-sm text-muted">No account or payment needed.</p></div>
        <div className="rounded-xl border border-gold bg-gold-tint p-5"><h3 className="text-xl font-bold text-navy">{site.price} once when ready</h3><p className="mt-3 leading-7">Build and preview free. One payment unlocks one saved CV and its matching cover letter, each as PDF and editable Word. Edits and redownloads of the same pair are included; a separate new CV needs its own payment unless covered by a Job Search Pass.</p><TrackedLink href={commercialRoutes.moneyPage} placement={`${placement}_money`} className="mt-5 inline-block font-bold text-navy underline">See the no-subscription CV and letter offer</TrackedLink><p className="mt-4 text-sm leading-6"><TrackedLink href={commercialRoutes.pricing} placement={`${placement}_pricing`} className="font-bold text-navy underline">Keeping separate saved versions? Compare the Job Search Pass.</TrackedLink></p></div>
      </div>
      <details className="mt-8 rounded-xl border border-line bg-white p-5 md:p-7" open>
        <summary className="cursor-pointer text-xl font-bold text-navy">Build your own CV and letter</summary>
        <RolePackForm id={id} title={pack.title} targetRole={pack.targetRole} prompts={pack.prompts} educationFirst={pack.roleTemplate === "student"} />
      </details>
      {tailoring ? <div className="mt-10 rounded-xl border border-line bg-white p-6"><h3 className="font-display text-2xl font-semibold text-navy">{tailoring.title}</h3><div className="mt-5 grid gap-5 sm:grid-cols-2">{tailoring.variants.map(([heading,body])=><div key={heading}><h4 className="font-bold">{heading}</h4><p className="mt-2 leading-7">{body}</p></div>)}</div><p className="mt-5 text-sm leading-7 text-muted">{tailoring.caution}</p><div className="mt-5 flex flex-wrap gap-5 font-bold underline"><Link href="/tailor-cv-to-job-description-uk">See two applications from the same experience</Link><Link href="/tools/job-application-tracker-uk">Track the version you send</Link></div><p className="mt-5 text-sm leading-7">You can revise one paid CV and letter for {site.price} once. To keep separate saved versions, compare the {site.passPrice}, {site.passDays}-day Pass. Covered documents stay editable and downloadable afterwards.</p></div> : null}
      <p className="mt-5 text-sm leading-6 text-muted">Check the vacancy&apos;s requirements. Role guidance: <a href={pack.sourceUrl} className="font-bold text-navy underline">National Careers Service</a>. Examples and pack reviewed 2 October 2026.</p>
    </div>
  </section>;
}

export function RolePackLinks({ context }: { context: string }) {
  return <section className="bg-paper py-16"><div className="container-page"><h2 className="font-display text-3xl font-semibold text-navy">CV and cover letter application packs</h2><p className="mt-4 max-w-3xl leading-7 text-muted">See a matching example pair, get a free checklist and start your own application. Each pack also explains the one-time paid download offer.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.values(roleApplicationPacks).map(pack => <TrackedLink key={pack.id} href={pack.path} placement={`${context}_pack_${pack.id.replaceAll("-", "_")}`} className="rounded-xl border border-line bg-white p-5 font-bold text-navy underline">{pack.title} CV and letter pack</TrackedLink>)}</div></div></section>;
}
