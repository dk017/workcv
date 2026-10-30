"use client";
import { useEffect, useState } from "react";
import { EvidenceRow, buildStatement, evidenceStatus, statementExample, statementWordCount } from "@/lib/supporting-statement";
import { trackFunnelEvent } from "@/components/attribution-capture";
const blank = (): EvidenceRow => ({ criterion: "", essential: true, context: "", action: "", outcome: "" });
export function SupportingStatementPlanner() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [rows, setRows] = useState<EvidenceRow[]>([blank()]);
  const [limit, setLimit] = useState(500);
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);
  const draft = buildStatement(rows);
  const words = statementWordCount(draft);
  function update(index: number, patch: Partial<EvidenceRow>) {
    if (!started) { trackFunnelEvent("tool_started", { tool: "supporting-statement" }); setStarted(true); }
    setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
    setMessage("");
  }
  return <section className="space-y-6 rounded-lg border border-line bg-white p-5 md:p-8" aria-label="Supporting statement planner">
    <p className="text-sm leading-7">Private browser-only worksheet. No AI generation, account or upload. Text disappears when you leave or reload unless you copy or download it. Do not include patient, client or colleague identifiers.</p>
    <label className="block font-bold">Your advert's word limit<input className="ml-3 w-28 rounded border border-line p-2" type="number" min={50} max={5000} value={limit} onChange={(e) => setLimit(Math.max(50, Math.min(5000, Number(e.target.value) || 50)))} /></label>
    <p className="text-sm">500 is a starting value, not an official limit. Follow your vacancy's instructions. If it specifies characters instead, use the character count below.</p>
    {rows.map((row, index) => <fieldset className="space-y-4 rounded border border-line p-4" key={index}><legend className="px-2 font-bold">Criterion {index + 1}: {evidenceStatus(row)}</legend>
      <label className="block text-sm font-bold">Exact criterion from the advert<textarea className="mt-2 w-full rounded border border-line p-3" maxLength={500} value={row.criterion} onChange={(e) => update(index, { criterion: e.target.value })} /></label>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={row.essential} onChange={(e) => update(index, { essential: e.target.checked })} />Essential criterion</label>
      {([["context", "Situation and responsibility"], ["action", "What you personally did"], ["outcome", "What happened or what you learned"]] as const).map(([key, label]) => <label className="block text-sm font-bold" key={key}>{label}<textarea rows={3} className="mt-2 w-full rounded border border-line p-3 font-normal" maxLength={4000} value={row[key]} onChange={(e) => update(index, { [key]: e.target.value })} /></label>)}
      {rows.length > 1 && <button type="button" className="min-h-11 text-sm underline" onClick={() => { if (window.confirm("Remove this criterion and its evidence?")) setRows(rows.filter((_, i) => i !== index)); }}>Remove criterion {index + 1}</button>}
    </fieldset>)}
    <button type="button" className="min-h-11 rounded border border-line px-4 font-bold disabled:opacity-50" disabled={rows.length >= 12} onClick={() => setRows([...rows, blank()])}>Add criterion (up to 12)</button>
    {!rows.some((r) => r.criterion || r.context || r.action || r.outcome) && <button type="button" disabled={!ready} className="ml-4 min-h-11 underline" onClick={() => setRows([{ ...statementExample }])}>Load the fictional example</button>}
    <h2 className="text-2xl font-bold">Your evidence draft</h2>
    <p className="text-sm leading-7">This joins your own sentences; it does not assess suitability or write missing evidence. Empty criteria are not proof of a match. Review every essential criterion, add transitions and follow anonymisation and AI-use rules in the advert.</p>
    <p role="status" className={words > limit ? "font-bold text-red-700" : "font-bold"}>{words} / {limit} words · {draft.length} characters{words > limit ? " — over your limit; shorten before submitting" : ""}</p>
    <ul className="list-disc pl-5 text-sm">{rows.filter((r) => r.essential && evidenceStatus(r) !== "Draft evidence entered").map((r, i) => <li key={i}>Essential criterion needs evidence: {r.criterion || "Untitled criterion"}</li>)}</ul>
    <textarea aria-label="Statement draft" className="min-h-64 w-full rounded border border-line p-4 text-sm leading-7" readOnly value={draft} />
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={!draft} className="min-h-11 rounded bg-navy px-4 font-bold text-white disabled:opacity-50" onClick={async () => { try { await navigator.clipboard.writeText(draft); setMessage("Copied. Review the draft against the advert before submitting."); trackFunnelEvent("tool_completed", { tool: "supporting-statement", result: "success" }); } catch { setMessage("Select the draft above and copy it manually."); } }}>Copy draft</button>
      <button type="button" disabled={!draft} className="min-h-11 rounded border border-line px-4 font-bold disabled:opacity-50" onClick={() => { const blob = new Blob([draft], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "supporting-statement-draft.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); trackFunnelEvent("tool_completed", { tool: "supporting-statement", result: "success" }); }}>Download free text draft</button>
      <button type="button" className="min-h-11 underline" onClick={() => { if (window.confirm("Clear this worksheet? Copy or download it first.")) { setRows([blank()]); setMessage(""); } }}>Clear worksheet</button>
    </div><p role="status" className="text-sm">{message}</p>
  </section>;
}
