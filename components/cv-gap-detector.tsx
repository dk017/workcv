"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import { analyseCvGaps } from "@/lib/cv-gap-detector";

const example = `Amira Khan
amira@example.com | 07700 900123

PERSONAL PROFILE
Customer service team leader with experience improving complaint handling.

KEY SKILLS
- Salesforce
- Team coaching
- Complaint resolution

WORK EXPERIENCE
Customer Service Team Leader | Northstar Retail | January 2022 - Present
- Led eight advisers and coached four new starters.
- Reduced overdue complaints by 18% through a new triage process.
- Reviewed service quality and escalated complex cases.

EDUCATION AND QUALIFICATIONS
Level 3 Diploma in Customer Service | City College | 2021`;

export function CvGapDetector() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const result = useMemo(
    () => (submittedText ? analyseCvGaps(submittedText) : null),
    [submittedText],
  );

  function analyse() {
    if (text.trim().length < 80) return;
    setSubmittedText(text);
    window.setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }

  return (
    <div>
      <label className="block">
        <span className="flex items-end justify-between gap-3">
          <span className="text-sm font-bold text-navy">Paste your CV text</span>
          <span className="text-xs font-bold text-muted">{text.length.toLocaleString()}/15,000</span>
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted">Copy all selectable text from your CV. Formatting is not uploaded or checked.</span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={15000} placeholder="Paste your complete CV here..." className="mt-3 min-h-[360px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15" />
      </label>
      {text.length > 0 && text.trim().length < 80 ? <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />Paste at least 80 characters from your CV.</p> : null}
      <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-xl gap-2 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />The check runs entirely in this browser. Your CV text is not sent to WorkCV or any AI service.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setText(example); setSubmittedText(""); }} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>
          {text ? <button type="button" onClick={() => { setText(""); setSubmittedText(""); }} aria-label="Clear CV text" title="Clear CV text" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}
          <button type="button" onClick={analyse} disabled={text.trim().length < 80} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"><ScanSearch className="h-4 w-4" />Find content gaps</button>
        </div>
      </div>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="border-b border-line bg-[#edf4f8] p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-success">Check complete</p>
              <div className="mt-3 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div><h2 className="font-display text-3xl font-semibold text-navy">{result.essentialsFound} of {result.essentialsTotal} essential areas found</h2><p className="mt-2 text-sm leading-7 text-muted">This detects content signals in pasted text. It cannot judge design, truthfulness or relevance to a particular vacancy.</p></div>
                <p className="text-sm font-bold text-navy">{result.wordCount} words checked</p>
              </div>
            </div>
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <CheckList title="Found" checks={result.checks.filter((check) => check.status === "present")} positive />
              <CheckList title="Review or add" checks={result.checks.filter((check) => check.status !== "present")} />
            </div>
            <div className="border-t border-line bg-paper p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-display text-2xl font-semibold text-navy">Need a deeper check?</p><p className="mt-2 text-sm leading-6 text-muted">Compare the finished CV with a real job advert to find missing role-specific terms.</p></div><Link href="/tools/ats-score-checker" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Check vacancy match <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function CheckList({ title, checks, positive = false }: { title: string; checks: ReturnType<typeof analyseCvGaps>["checks"]; positive?: boolean }) {
  return <div><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>{checks.length ? <ul className="mt-5 grid gap-4">{checks.map((check) => <li key={check.id} className="flex gap-3">{positive ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${check.status === "caution" ? "text-gold" : "text-[#a74848]"}`} />}<div><p className="text-sm font-bold text-navy">{check.title}</p><p className="mt-1 text-sm leading-6 text-muted">{check.detail}</p></div></li>)}</ul> : <p className="mt-4 text-sm text-muted">Nothing in this group.</p>}</div>;
}
