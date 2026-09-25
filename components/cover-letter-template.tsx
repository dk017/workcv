"use client";

import { useRef, useState } from "react";
import { coverLetterTemplateText, changeCoverLetterRecipient } from "@/lib/cover-letter-template";
import { trackFunnelEvent } from "@/components/attribution-capture";

export function CoverLetterTemplate() {
  const [managerKnown, setManagerKnown] = useState(true);
  const [text, setText] = useState(() => coverLetterTemplateText(true));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  function begin() {
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("tool_started", { tool: "cover_letter_template" });
  }
  function completed(result: "success" | "error", placement: string) {
    trackFunnelEvent("tool_completed", { tool: "cover_letter_template", result, placement });
  }
  async function copy() {
    begin();
    try { await navigator.clipboard.writeText(text); setStatus("Your current letter has been copied."); completed("success", "cover_letter_copy"); }
    catch { setStatus("Copy was blocked. Select the text and copy it manually."); completed("error", "cover_letter_copy"); }
  }
  async function download() {
    begin(); setBusy(true); setStatus("");
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const document = new Document({ sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
        children: text.split(/\r?\n/).map((line) => new Paragraph({ spacing: { after: line ? 80 : 120 }, children: [new TextRun({ text: line, font: "Arial", size: 22 })] })),
      }] });
      const url = URL.createObjectURL(await Packer.toBlob(document));
      const link = window.document.createElement("a");
      link.href = url; link.download = "workcv-cover-letter.docx";
      window.document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus("Word file prepared from your current text. Check your downloads, replace remaining prompts and review page breaks before sending.");
      completed("success", "cover_letter_word");
    } catch { setStatus("The Word file could not be prepared. Your text is still here; copy it or try again."); completed("error", "cover_letter_word"); }
    finally { setBusy(false); }
  }
  return <div>
    <fieldset><legend className="text-sm font-bold text-navy">Do you know the hiring manager’s name?</legend>
      <div className="mt-2 grid min-h-12 grid-cols-2 rounded-md border border-line-strong bg-white p-1">
        {([[true, "Yes"], [false, "No"]] as const).map(([value, label]) => <button key={String(value)} type="button" aria-pressed={managerKnown === value} onClick={() => { begin(); setManagerKnown(value); setText((current) => changeCoverLetterRecipient(current, value)); setStatus("Standard greeting and sign-off updated. Your other text is unchanged; check any personalised greeting yourself."); }} className={`rounded px-3 text-sm font-bold ${managerKnown === value ? "bg-navy text-white" : "text-muted hover:bg-paper"}`}>{label}</button>)}
      </div>
    </fieldset>
    <label className="mt-6 block text-sm font-bold text-navy">Editable cover letter template
      <textarea aria-label="Editable UK cover letter template" maxLength={20000} value={text} onChange={(event) => { begin(); setText(event.target.value); setStatus(""); }} className="mt-2 min-h-[620px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15" />
    </label>
    <p className="mt-3 text-sm leading-6 text-muted">Copy and Word download include your current edits. Your letter stays in this browser and is not saved after you leave or reload. Keep your own copy. Limit: 20,000 characters.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={() => { if (window.confirm("Replace your current letter with the blank template? Copy or download it first if you want to keep it.")) { setText(coverLetterTemplateText(managerKnown)); setStatus("Blank template restored."); } }} className="min-h-11 rounded-md border border-line-strong px-4 text-sm font-bold text-navy">Reset template</button>
      <button type="button" disabled={!text.trim()} onClick={copy} className="min-h-11 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy disabled:opacity-50">Copy my letter</button>
      <button type="button" disabled={busy || !text.trim()} onClick={download} className="min-h-11 rounded-md bg-navy px-5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Preparing Word file…" : "Download my letter as Word"}</button>
    </div>
    <p role="status" aria-live="polite" className="mt-3 text-sm leading-6 text-navy">{status}</p>
    <a href="/api/tools/cover-letter-template" className="mt-3 inline-block text-sm font-bold text-navy underline">Download a blank Word template instead (does not include edits)</a>
  </div>;
}
