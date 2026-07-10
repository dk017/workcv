"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Clipboard, Copy, HelpCircle, Loader2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type Fields = { background: string; targetRole: string; evidence: string; jobDescription: string };
type Result = { variants: Array<{ label: "Balanced" | "Achievement-led" | "Concise"; summary: string; wordCount: number }>; followUpQuestions: string[] };
const empty: Fields = { background: "", targetRole: "", evidence: "", jobDescription: "" };
const example: Fields = { background: "Customer service team leader managing retail support teams across phone and email channels.", targetRole: "Customer Experience Manager", evidence: "Led eight advisers, coached four starters, used Salesforce and reduced overdue complaints by 18% through a new triage process.", jobDescription: "Lead service teams, improve customer experience and use performance data to resolve recurring issues." };
const inputClass = "mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15";

export function CvSummaryGenerator() {
  const [fields, setFields] = useState<Fields>(empty);
  const [careerStage, setCareerStage] = useState<"early" | "experienced" | "career-change">("experienced");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const update = (key: keyof Fields, value: string) => setFields((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true); setCopied(null);
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 35_000);
    try {
      const response = await fetch("/api/tools/cv-summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, careerStage }), signal: controller.signal });
      const data = (await response.json()) as Result & { error?: string };
      if (!response.ok) throw new Error(data.error || "The summaries could not be generated.");
      setResult(data); window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    } catch (requestError) {
      setResult(null); setError(requestError instanceof DOMException && requestError.name === "AbortError" ? "The request took too long. Please try again." : requestError instanceof Error ? requestError.message : "The summaries could not be generated.");
    } finally { window.clearTimeout(timeout); setLoading(false); }
  }

  async function copy(value: string, key: string) {
    try { await navigator.clipboard.writeText(value); setCopied(key); window.setTimeout(() => setCopied(null), 2_000); }
    catch { setError("Copy was blocked. Select the text and copy it manually."); }
  }

  return <div>
    <form onSubmit={submit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="text-sm font-bold text-navy">Professional or educational background<span className="mt-1 block font-normal leading-6 text-muted">State what you do, your sector and the scope of your experience.</span><textarea required minLength={40} maxLength={2000} value={fields.background} onChange={(event) => update("background", event.target.value)} className={`${inputClass} min-h-32 py-3`} placeholder="e.g. Customer service team leader managing retail support..." /></label>
        <label className="text-sm font-bold text-navy">Skills and evidence<span className="mt-1 block font-normal leading-6 text-muted">Add qualifications, tools, achievements and measured outcomes.</span><textarea required minLength={40} maxLength={2000} value={fields.evidence} onChange={(event) => update("evidence", event.target.value)} className={`${inputClass} min-h-32 py-3`} placeholder="e.g. Led eight advisers and reduced overdue complaints..." /></label>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-navy">Target role<input required maxLength={120} value={fields.targetRole} onChange={(event) => update("targetRole", event.target.value)} className={inputClass} placeholder="e.g. Customer Experience Manager" /></label>
          <fieldset className="mt-6"><legend className="text-sm font-bold text-navy">Career stage</legend><div className="mt-2 grid min-h-12 grid-cols-3 rounded-md border border-line-strong bg-white p-1">{([['early','Early career'],['experienced','Experienced'],['career-change','Career change']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={careerStage === value} onClick={() => setCareerStage(value)} className={`rounded px-2 text-xs font-bold ${careerStage === value ? "bg-navy text-white" : "text-muted hover:bg-paper"}`}>{label}</button>)}</div></fieldset>
        </div>
        <label className="text-sm font-bold text-navy">Job description <span className="font-normal text-muted">(optional)</span><span className="mt-1 block font-normal leading-6 text-muted">Used to prioritise supported evidence, not to add missing experience.</span><textarea maxLength={5000} value={fields.jobDescription} onChange={(event) => update("jobDescription", event.target.value)} className={`${inputClass} min-h-32 py-3`} placeholder="Paste the main duties and requirements..." /></label>
      </div>
      {error ? <div role="alert" className="mt-5 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />{error}</div> : null}
      <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 lg:flex-row lg:items-end lg:justify-between">
        <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />Your entries are sent to OpenAI for this generation and are not saved by WorkCV. Verify every claim before using it.</p>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFields(example); setResult(null); setError(""); }} disabled={loading} className="min-h-11 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{Object.values(fields).some(Boolean) ? <button type="button" onClick={() => { setFields(empty); setResult(null); setError(""); }} aria-label="Clear all fields" title="Clear all fields" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="submit" disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:opacity-70">{loading ? <><Loader2 className="h-4 w-4 animate-spin" />Writing summaries</> : <><Sparkles className="h-4 w-4" />Generate three summaries</>}</button></div>
      </div>
    </form>
    {result ? <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
      <section className="border-y border-line-strong py-7"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Three editable approaches</p><h2 className="mt-2 font-display text-3xl font-semibold text-navy">Your CV summaries</h2></div>
        <div className="mt-7 divide-y divide-line border-y border-line">{result.variants.map((variant, index) => <article key={variant.label} className="py-6"><div className="flex items-center justify-between gap-4"><div><h3 className="font-display text-2xl font-semibold text-navy">{variant.label}</h3><p className="mt-1 text-xs font-bold text-muted">{variant.wordCount} words</p></div><button type="button" onClick={() => copy(variant.summary, variant.label)} aria-label={`Copy ${variant.label} summary`} title={`Copy ${variant.label} summary`} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper">{copied === variant.label ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button></div><textarea aria-label={`${variant.label} CV summary`} value={variant.summary} onChange={(event) => setResult((current) => current ? { ...current, variants: current.variants.map((item, itemIndex) => itemIndex === index ? { ...item, summary: event.target.value } : item) } : current)} className="mt-4 min-h-36 w-full resize-y rounded-md border border-line bg-white p-4 text-[16px] leading-7 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15" /></article>)}</div>
        <div className="mt-7 grid gap-4 border-l-4 border-gold bg-paper p-5 sm:grid-cols-[28px_1fr]"><HelpCircle className="h-6 w-6 text-navy" /><div><h3 className="font-display text-xl font-semibold text-navy">Evidence worth adding</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-muted">{result.followUpQuestions.map((question) => <li key={question}>• {question}</li>)}</ul></div></div>
      </section>
      <div className="mt-8 flex flex-col gap-5 border-l-4 border-success bg-[#edf7f1] p-6 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-display text-2xl font-semibold text-navy">Use your chosen summary in a complete CV</h3><p className="mt-2 text-sm text-muted">Edit it in your own voice, then add it to the top of your WorkCV draft.</p></div><Link href="/editor" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Open CV builder <ArrowRight className="h-4 w-4" /></Link></div>
    </div> : null}
  </div>;
}
