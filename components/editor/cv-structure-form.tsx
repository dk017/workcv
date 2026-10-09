"use client";
import { useState } from "react";
import { CvData, CvLayoutPreset, cvSectionLabels, orderedCvSections } from "@/lib/editor-data";
const field = "mt-2 w-full rounded border border-line bg-white p-3 text-sm text-ink";
const button = "min-h-11 rounded-lg border border-line px-3 text-sm font-bold text-navy disabled:opacity-40";
const optionalSections = ["projects", "certifications", "volunteering", "languages"] as const;
const presets: Array<[CvLayoutPreset, string]> = [["standard", "Standard"], ["education-first", "Education first"], ["experienced", "Experienced professional"], ["compact-single", "Compact single column"]];

export function CvStructureForm({ cv, onChange }: { cv: CvData; onChange: (value: CvData) => void }) {
  const order = orderedCvSections(cv);
  const [open, setOpen] = useState<string[]>([]);
  // List only sections that will appear on the CV; moves swap them within the full saved order.
  const visible = order.filter((section) => !(optionalSections as readonly string[]).includes(section) || Boolean(cv.additionalSections?.[section as (typeof optionalSections)[number]]?.trim()));
  const move = (index: number, direction: -1 | 1) => {
    const from = order.indexOf(visible[index]);
    const to = order.indexOf(visible[index + direction]);
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    onChange({ ...cv, sectionOrder: next });
  };
  return <div className="space-y-8">
    <div className="space-y-2.5">
      {optionalSections.map((section) => {
        const value = cv.additionalSections?.[section] || "";
        const expanded = Boolean(value.trim()) || open.includes(section);
        const label = cvSectionLabels[section];
        return <div key={section} className={`rounded-xl ${expanded ? "border-[1.5px] border-navy p-4" : "border border-line"}`}>
          {expanded ? <>
            <div className="mb-2.5 flex items-center justify-between gap-3"><span className="font-extrabold text-navy">{label}</span>{value.trim() ? <span className="text-sm font-bold text-success">On your CV</span> : null}</div>
            <textarea aria-label={label + " (optional)"} className="w-full rounded-lg border border-line-strong bg-white px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint" rows={3} maxLength={5000} value={value} placeholder={section === "languages" ? "Language and honest proficiency level, one per line" : "Title, organisation, dates and your own evidence. Leave blank to leave it off your CV."} onChange={(e) => onChange({ ...cv, additionalSections: { ...cv.additionalSections, [section]: e.target.value } })} />
          </> : <button type="button" onClick={() => setOpen((current) => [...current, section])} className="flex min-h-14 w-full items-center justify-between px-4 text-left font-bold text-ink">{label}<span className="text-sm text-navy">+ Add</span></button>}
        </div>;
      })}
    </div>
    <div className="space-y-2.5">
      <div><h2 className="text-[0.9375rem] font-bold text-navy">Section order</h2><p className="text-sm text-muted">Most UK CVs put experience first. Move education up if you’re a recent graduate.</p></div>
      <ol className="divide-y divide-line rounded-xl border border-line">{visible.map((section, index) => <li key={section} className="flex min-h-12 items-center gap-3 pl-4 pr-2">
        <span className="w-5 shrink-0 text-[0.8125rem] font-bold text-muted">{index + 1}</span>
        <span className="flex-1 font-bold text-ink">{cvSectionLabels[section]}</span>
        {([-1, 1] as const).map((direction) => <button key={direction} type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-navy hover:bg-paper disabled:opacity-30" disabled={index + direction < 0 || index + direction >= visible.length} aria-label={`Move ${cvSectionLabels[section]} ${direction < 0 ? "up" : "down"}`} onClick={() => move(index, direction)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction < 0 ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} /></svg>
        </button>)}
      </li>)}</ol>
    </div>
    <fieldset className="space-y-2">
      <legend className="text-[0.9375rem] font-bold text-navy">Quick layouts</legend>
      <p className="text-sm text-muted">A preset sets a sensible order for you; your wording stays the same. In Modern and Compact, skills stay in the sidebar.</p>
      <div className="grid gap-2 sm:grid-cols-2">{presets.map(([preset, label]) => {
        const active = (cv.layoutPreset || "standard") === preset;
        return <label key={preset} className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm ${active ? "border-[1.5px] border-navy font-bold text-navy" : "border border-line text-ink"}`}>
          <input type="radio" name="layout-preset" className="h-4 w-4 accent-navy" checked={active} onChange={() => onChange({ ...cv, layoutPreset: preset, sectionOrder: undefined })} />{label}
        </label>;
      })}</div>
      <p className="text-sm"><a href="/cv-layout-tests-uk" target="_blank" rel="noreferrer" className="font-bold text-navy underline underline-offset-4">Compare sample PDFs for each layout</a></p>
    </fieldset>
  </div>;
}
export function ApplicationPackReview({ cv, onChange }: { cv: CvData; onChange: (value: CvData) => void }) {
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const pack = cv.applicationPack;
  if (!pack) return null;
  return <section className="mt-6 space-y-4 border-t border-line pt-6"><h2 className="text-xl font-bold text-navy">Your application pack</h2>
    <p className="text-sm leading-6 text-muted">Original experience is retained. Edit each suggestion, confirm it is true, then add it to the correct role. Nothing is applied automatically. These notes are saved with this CV but do not appear in its PDF. To send the letter below, use it in the Cover letter step.</p>
    <label className="block text-sm font-bold">Role for a reviewed bullet<select className={field} value={roleId} onChange={(e) => setRoleId(e.target.value)}><option value="">Choose a role</option>{cv.experience.map((role) => <option key={role.id} value={role.id}>{role.role || "Untitled role"} — {role.company}</option>)}</select></label>
    {pack.bullets.map((bullet, index) => <div key={index}><label className="block text-sm">Suggested bullet {index + 1}<textarea className={field} maxLength={1000} value={bullet} onChange={(e) => onChange({ ...cv, applicationPack: { ...pack, bullets: pack.bullets.map((text, i) => i === index ? e.target.value : text) } })} /></label>
      <button type="button" className={button} disabled={!roleId || !bullet.trim()} onClick={() => {
        const role = cv.experience.find((item) => item.id === roleId);
        if (!role || role.bullets.split("\n").includes(bullet.trim())) { setMessage("Already present, or the role was removed."); return; }
        if (role.bullets.split("\n").length >= 50 || role.bullets.length + bullet.length + 1 > 20000) { setMessage("Shorten this role's existing bullets first."); return; }
        onChange({ ...cv, experience: cv.experience.map((item) => item.id === roleId ? { ...item, bullets: [item.bullets.trim(), bullet.trim()].filter(Boolean).join("\n") } : item) }); setMessage("Reviewed bullet added. Existing bullets kept.");
      }}>I confirm this is true — add to role</button></div>)}
    <p role="status" className="text-sm">{message}</p>
    {cv.coverLetter ? <div className="text-sm leading-6"><p className="font-bold">Edit and download your letter in the Cover letter step.</p><details className="mt-2"><summary className="cursor-pointer font-bold">Original generated letter for reference</summary><p className="mt-3 whitespace-pre-line">{pack.coverLetter}</p></details></div> : <label className="block text-sm font-bold">Cover letter (editable; select text to copy)<textarea className={field} rows={12} maxLength={10000} value={pack.coverLetter} onChange={(e) => onChange({ ...cv, applicationPack: { ...pack, coverLetter: e.target.value } })} /></label>}
    <details><summary className="cursor-pointer py-3 font-bold">Original CV and evidence review</summary><p className="whitespace-pre-line text-sm">{pack.originalCvText}</p><ul className="mt-4 list-disc space-y-3 pl-5 text-sm">{pack.evidenceReview?.map((text, i) => <li key={i}>{text}</li>)}</ul></details>
    <details><summary className="cursor-pointer py-3 font-bold">Interview prompts and follow-up email</summary><ol className="list-decimal space-y-3 pl-5 text-sm">{pack.interviewPrompts.map((prompt, i) => <li key={i}>{prompt}</li>)}</ol><p className="mt-4 whitespace-pre-line text-sm">{pack.thankYouEmail}</p></details>
  </section>;
}
