import { firstJobExamples } from "@/lib/first-job-examples";
import { ButtonLink } from "@/components/marketing";

export function FirstJobExample({ id }: { id: string }) {
  const example = firstJobExamples[id];
  if (!example) return null;
  return <section id="no-experience-example" className="scroll-mt-24 border-y border-line bg-paper py-12"><div className="container-page max-w-5xl">
    <h2 className="font-display text-3xl font-semibold text-navy">{example.role} CV with no paid experience</h2>
    <p className="mt-5 leading-8 text-muted">A complete first-job CV and matching letter. {example.name}, the organisations and the vacancy are fictional. Use your own school, volunteering or project evidence; these facts are never copied into your application.</p>
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <article aria-label="First-job CV example" className="rounded-xl border border-line bg-white p-6"><h3 className="text-2xl font-bold text-navy">{example.name}</h3><p className="mt-2 text-sm">{example.town} • [your email] • [your phone]</p><h4 className="mt-5 font-bold">Profile</h4><p className="mt-2 leading-7">{example.profile}</p><h4 className="mt-5 font-bold">Education</h4><p className="mt-2 leading-7">{example.education}</p><h4 className="mt-5 font-bold">Relevant skills</h4><ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{example.skills.map(s=><li key={s}>{s}</li>)}</ul><h4 className="mt-5 font-bold">Volunteering and projects</h4>{example.experience.map(e=><div key={e.heading} className="mt-4"><h5 className="font-bold">{e.heading}</h5><p className="text-sm text-muted">{e.dates}</p><ul className="mt-2 list-disc space-y-2 pl-5 leading-7">{e.bullets.map(b=><li key={b}>{b}</li>)}</ul></div>)}</article>
      <article aria-label="First-job matching cover letter" className="rounded-xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-navy">Letter for {example.employer}</h3><p className="mt-5 leading-7">Dear Hiring Manager,</p>{example.letter.map(p=><p key={p} className="mt-4 leading-7">{p}</p>)}<p className="mt-4 leading-7">Yours faithfully,<br />{example.name}</p></article>
    </div>
    <h3 className="mt-7 text-xl font-bold text-navy">Why this pair works</h3><ul className="mt-4 list-disc space-y-3 pl-5 leading-7">{example.why.map(w=><li key={w}>{w}</li>)}</ul>
    <div className="mt-6"><ButtonLink href="#application-pack" trackingLabel={`role_pack_${id}_first_job`}>Build my application using my own facts</ButtonLink></div>
  </div></section>;
}
