"use client";
import { useState } from "react";
import { CvData, CvLayoutPreset, cvSectionLabels, orderedCvSections } from "@/lib/editor-data";
const field = "mt-2 w-full rounded border border-line bg-white p-3 text-sm text-ink";
const button = "min-h-11 rounded border border-line px-3 text-sm font-bold text-navy disabled:opacity-40";
export function CvStructureForm({ cv, onChange }: { cv: CvData; onChange: (value: CvData) => void }) {
  const order = orderedCvSections(cv);
  return <section className="mt-6 space-y-5 border-t border-line pt-6">
    <h2 className="text-xl font-bold text-navy">Sections and layout</h2>
    <p className="text-sm"><a href="/cv-layout-tests-uk" target="_blank" rel="noreferrer" className="underline">Compare sample PDFs and extraction results</a></p>
    <label className="block text-sm font-bold">Single-column preset
      <select className={field} value={cv.layoutPreset || "standard"} onChange={(e) => onChange({ ...cv, layoutPreset: e.target.value as CvLayoutPreset, sectionOrder: undefined })}>
        <option value="standard">Use chosen Classic / Modern / Compact design</option><option value="education-first">Education first</option><option value="compact-single">Compact single column</option><option value="experienced">Experienced professional</option>
      </select>
    </label>
    <p className="text-sm leading-6 text-muted">Presets keep your wording but reset section order. Page count depends on your content; preview before paying. In the standard Modern and Compact designs, skills remain in the sidebar.</p>
    <ol className="space-y-2">{order.map((section, index) => <li key={section} className="flex flex-wrap items-center gap-2"><span className="mr-auto text-sm">{cvSectionLabels[section]}</span>
      {([-1, 1] as const).map((direction) => <button key={direction} type="button" className={button} disabled={index + direction < 0 || index + direction >= order.length} aria-label={`Move ${cvSectionLabels[section]} ${direction < 0 ? "up" : "down"}`} onClick={() => { const next = [...order]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; onChange({ ...cv, sectionOrder: next }); }}>{direction < 0 ? "Up" : "Down"}</button>)}
    </li>)}</ol>
    {(["projects", "certifications", "volunteering", "languages"] as const).map((section) => <label key={section} className="block text-sm font-bold">{cvSectionLabels[section]} (optional)
      <textarea aria-label={cvSectionLabels[section] + " (optional)"} className={field} rows={4} maxLength={5000} value={cv.additionalSections?.[section] || ""} placeholder={section === "languages" ? "Language and honest proficiency level" : "Title, organisation, dates and your own evidence. Leave blank to omit."} onChange={(e) => onChange({ ...cv, additionalSections: { ...cv.additionalSections, [section]: e.target.value } })} />
    </label>)}
  </section>;
}
export function ApplicationPackReview({ cv, onChange }: { cv: CvData; onChange: (value: CvData) => void }) {
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const pack = cv.applicationPack;
  if (!pack) return null;
  return <section className="mt-6 space-y-4 border-t border-line pt-6"><h2 className="text-xl font-bold text-navy">Your application pack</h2>
    <p className="text-sm leading-6 text-muted">Original experience is retained. Edit each suggestion, confirm it is true, then add it to the correct role. Nothing is applied automatically. These notes are saved with this CV but do not appear in its PDF. To send the letter below, use it in the Cover letter tab.</p>
    <label className="block text-sm font-bold">Role for a reviewed bullet<select className={field} value={roleId} onChange={(e) => setRoleId(e.target.value)}><option value="">Choose a role</option>{cv.experience.map((role) => <option key={role.id} value={role.id}>{role.role || "Untitled role"} — {role.company}</option>)}</select></label>
    {pack.bullets.map((bullet, index) => <div key={index}><label className="block text-sm">Suggested bullet {index + 1}<textarea className={field} maxLength={1000} value={bullet} onChange={(e) => onChange({ ...cv, applicationPack: { ...pack, bullets: pack.bullets.map((text, i) => i === index ? e.target.value : text) } })} /></label>
      <button type="button" className={button} disabled={!roleId || !bullet.trim()} onClick={() => {
        const role = cv.experience.find((item) => item.id === roleId);
        if (!role || role.bullets.split("\n").includes(bullet.trim())) { setMessage("Already present, or the role was removed."); return; }
        if (role.bullets.split("\n").length >= 50 || role.bullets.length + bullet.length + 1 > 20000) { setMessage("Shorten this role's existing bullets first."); return; }
        onChange({ ...cv, experience: cv.experience.map((item) => item.id === roleId ? { ...item, bullets: [item.bullets.trim(), bullet.trim()].filter(Boolean).join("\n") } : item) }); setMessage("Reviewed bullet added. Existing bullets kept.");
      }}>I confirm this is true — add to role</button></div>)}
    <p role="status" className="text-sm">{message}</p>
    <label className="block text-sm font-bold">Cover letter (editable; select text to copy)<textarea className={field} rows={12} maxLength={10000} value={pack.coverLetter} onChange={(e) => onChange({ ...cv, applicationPack: { ...pack, coverLetter: e.target.value } })} /></label>
    <details><summary className="cursor-pointer py-3 font-bold">Original CV and evidence review</summary><p className="whitespace-pre-line text-sm">{pack.originalCvText}</p><ul className="mt-4 list-disc space-y-3 pl-5 text-sm">{pack.evidenceReview?.map((text, i) => <li key={i}>{text}</li>)}</ul></details>
    <details><summary className="cursor-pointer py-3 font-bold">Interview prompts and follow-up email</summary><ol className="list-decimal space-y-3 pl-5 text-sm">{pack.interviewPrompts.map((prompt, i) => <li key={i}>{prompt}</li>)}</ol><p className="mt-4 whitespace-pre-line text-sm">{pack.thankYouEmail}</p></details>
  </section>;
}
