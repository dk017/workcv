"use client";
import { useState, type FormEvent } from "react";
import { buildRolePackDraft, type RolePackFields } from "@/lib/role-pack-draft";
import { writeCvToolHandoff } from "@/lib/cv-tool-handoff";
import { trackFunnelEvent } from "@/components/attribution-capture";
import { rememberCtaHandoff } from "@/lib/cta-attribution";
import { coverLetterEditorRoute } from "@/lib/cover-letter-handoff";
export function RolePackForm({ id, title, targetRole, prompts, educationFirst = false }: { id: string; title: string; targetRole: string; prompts: [string, string]; educationFirst?: boolean }) {
  const [fields, setFields] = useState<RolePackFields>({ fullName: "", targetRole, company: "", profile: "", motivation: "", evidence: "", moreEvidence: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) { setError("Confirm that these are your own accurate details."); return; }
    try { writeCvToolHandoff({ source: `role-pack-${id}`, patch: buildRolePackDraft(fields, educationFirst) }); }
    catch (cause) { setError((cause instanceof Error ? cause.message : "Your draft could not be transferred.") + " Keep this page open and copy your wording before leaving if browser storage is blocked."); return; }
    const placement = `role_pack_${id.replaceAll("-", "_")}_editor`;
    try { rememberCtaHandoff(placement, coverLetterEditorRoute); } catch { /* Tracking must not block the draft. */ }
    trackFunnelEvent("marketing_cta_clicked", { destination: coverLetterEditorRoute, placement });
    window.location.assign(coverLetterEditorRoute);
  }
  const inputClass = "mt-2 w-full min-h-12 rounded-md border border-line-strong bg-white p-3 text-base text-ink focus:border-navy";
  return <form onSubmit={submit} className="mt-6 space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">{([["fullName", "Your name", 100], ["targetRole", "Job title from the advert", 140], ["company", "Employer you are applying to", 140]] as const).map(([name, label, max]) => <label key={name} className="block text-sm font-bold text-navy">{label}<input required maxLength={max} value={fields[name]} onChange={e => setFields({ ...fields, [name]: e.target.value })} className={inputClass} /></label>)}</div>
    {([["profile", "Your CV profile", "In your own words, summarise what you can offer this role. You can refine it in the editor.", 1000], ["motivation", "Why this role and employer?", "Give a genuine reason. This becomes part of your letter's opening.", 500], ["evidence", "Your strongest example", prompts[0], 1800], ["moreEvidence", "A second example", prompts[1], 1800]] as const).map(([name, label, hint, max]) => <label key={name} className="block text-sm font-bold text-navy">{label}<span className="mt-1 block font-normal leading-6 text-muted">{hint}</span><textarea required maxLength={max} rows={3} value={fields[name]} onChange={e => setFields({ ...fields, [name]: e.target.value })} className={inputClass} /></label>)}
    <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />These are my own accurate details. I have replaced the fictional example with my own evidence.</label>
    {error && <p role="alert" className="text-sm font-bold text-red-800">{error}</p>}
    <button type="submit" data-analytics-placement={`role_pack_${id.replaceAll("-", "_")}_editor`} className="min-h-12 w-full rounded-md bg-navy px-5 py-3 text-base font-bold text-white sm:w-auto">Start my {title.toLowerCase()} CV and letter</button>
    <p className="text-sm leading-6 text-muted">Continue in this tab within 30 minutes. After email-code sign-in, your profile and letter will be saved in a new CV. Add your contact details, work or volunteering history and education in the editor, then review both documents. This form assembles your wording without AI generation.</p>
  </form>;
}
