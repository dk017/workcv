"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, BookOpen, Gauge, ListChecks, RotateCcw, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { analyseCvReadability, cvWords, ReadabilityAnalysis } from "@/lib/cv-text-analysis";

const example = `PROFILE
Customer service team leader with experience managing phone and email support. Led eight advisers and introduced a complaint triage process that reduced overdue cases by 18%.

EXPERIENCE
Customer Service Team Leader | Northstar Retail | 2023–Present
- Lead daily workloads for eight advisers and coach colleagues on complaint handling.
- Review service data each week to identify recurring customer issues.
- Resolve escalated cases and record clear next steps in Salesforce.
- Introduced a triage process that reduced overdue complaints by 18%.

SKILLS
Customer service, team coaching, Salesforce, complaint resolution and service reporting.`;

export function CvReadabilityChecker() {
  const [text, setText] = useState(""); const [result, setResult] = useState<ReadabilityAnalysis | null>(null); const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null); const wordCount = useMemo(() => cvWords(text).length, [text]);
  function submit(event: FormEvent) { event.preventDefault(); setError(""); if (wordCount < 50) { setResult(null); setError("Paste at least 50 words so the readability score is meaningful."); return; } setResult(analyseCvReadability(text)); window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); }
  const flagged = result?.sentences.filter((sentence) => sentence.isLong || sentence.mayBePassive).slice(0, 8) ?? [];
  const metrics: Array<{ label: string; value: string | number; icon: LucideIcon }> = result ? [
    { label: "Words", value: result.wordCount, icon: BookOpen },
    { label: "Sentences", value: result.sentenceCount, icon: ListChecks },
    { label: "Avg. sentence", value: `${result.averageSentenceLength} words`, icon: Gauge },
    { label: "Long sentences", value: result.longSentenceCount, icon: AlertTriangle },
  ] : [];
  return <div><form onSubmit={submit}><label className="block"><span className="flex items-end justify-between gap-3"><span><span className="block text-sm font-bold text-navy">Paste your CV text</span><span className="mt-1 block text-xs leading-5 text-muted">Include the sections and bullet points a recruiter will read.</span></span><span className="text-xs font-bold text-muted">{wordCount} words</span></span><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={40000} placeholder="Paste your complete CV text here..." className="mt-3 min-h-[340px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15" /></label>{error ? <div role="alert" className="mt-4 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-5 w-5 shrink-0" />{error}</div> : null}<div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex max-w-xl gap-2 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />This analysis runs entirely in your browser. Your CV is not uploaded or saved.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setText(example); setResult(null); setError(""); }} className="min-h-11 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{text ? <button type="button" onClick={() => { setText(""); setResult(null); setError(""); }} aria-label="Clear CV text" title="Clear CV text" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Check readability <ArrowRight className="h-4 w-4" /></button></div></div></form>
    {result ? <div ref={resultRef} className="scroll-mt-24 pt-12" aria-live="polite"><section className="border-y border-line-strong py-7"><div className="grid gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Flesch Reading Ease</p><p className="mt-3 font-display text-6xl font-semibold text-navy">{result.fleschReadingEase}</p><h2 className="mt-2 font-display text-3xl font-semibold text-navy">{result.label}</h2></div><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <div key={metric.label} className="bg-white p-4"><Icon className="h-4 w-4 text-gold" /><p className="mt-4 font-display text-2xl font-semibold text-navy">{metric.value}</p><p className="mt-1 text-[11px] font-bold uppercase text-muted">{metric.label}</p></div>; })}</div></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><div><h3 className="font-display text-2xl font-semibold text-navy">How to use this score</h3><p className="mt-3 text-sm leading-7 text-muted">Treat it as a prompt to inspect sentence length and wording, not as a pass mark. Names, qualifications and technical vocabulary can lower the score even when they belong in the CV.</p><p className="mt-4 text-xs leading-6 text-muted">Passive-voice detection is a simple language pattern and can produce false positives.</p></div><div><h3 className="font-display text-2xl font-semibold text-navy">Sentences to review</h3>{flagged.length ? <ol className="mt-4 divide-y divide-line border-y border-line">{flagged.map((sentence, index) => <li key={`${sentence.text}-${index}`} className="py-4"><div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase text-muted">{sentence.isLong ? <span>Long: {sentence.wordCount} words</span> : null}{sentence.mayBePassive ? <span>Possible passive voice</span> : null}</div><p className="mt-2 text-sm leading-7 text-ink">{sentence.text}</p></li>)}</ol> : <p className="mt-4 border-l-4 border-success bg-[#edf7f1] p-4 text-sm leading-7 text-ink">No sentences over 25 words or obvious passive constructions were detected.</p>}</div></div>
      <div className="mt-8 flex flex-col gap-4 border-l-4 border-gold bg-paper p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-7 text-ink">Readability cannot tell whether your evidence matches the vacancy.</p><Link href="/tools/ats-score-checker" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white">Check vacancy relevance <ArrowRight className="h-4 w-4" /></Link></div></section></div> : null}</div>;
}
