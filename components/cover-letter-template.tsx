"use client";

import { useState } from "react";
import { Check, Clipboard, Download, RotateCcw } from "lucide-react";
import { coverLetterTemplateText } from "@/lib/cover-letter-template";

export function CoverLetterTemplate() {
  const [managerKnown, setManagerKnown] = useState(true);
  const [text, setText] = useState(() => coverLetterTemplateText(true));
  const [copied, setCopied] = useState(false);
  function choose(value: boolean) { setManagerKnown(value); setText(coverLetterTemplateText(value)); setCopied(false); }
  async function copy() { try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  return <div><fieldset><legend className="text-sm font-bold text-navy">Do you know the hiring manager’s name?</legend><div className="mt-2 grid min-h-12 grid-cols-2 rounded-md border border-line-strong bg-white p-1">{([[true,"Yes"],[false,"No"]] as const).map(([value, label]) => <button key={String(value)} type="button" aria-pressed={managerKnown === value} onClick={() => choose(value)} className={`rounded px-3 text-sm font-bold ${managerKnown === value ? "bg-navy text-white" : "text-muted hover:bg-paper"}`}>{label}</button>)}</div></fieldset><label className="mt-6 block text-sm font-bold text-navy">Editable cover letter template<textarea aria-label="Editable UK cover letter template" value={text} onChange={(event) => setText(event.target.value)} className="mt-2 min-h-[620px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15" /></label><div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setText(coverLetterTemplateText(managerKnown))} aria-label="Reset cover letter template" title="Reset template" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button><button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? "Copied" : "Copy template"}</button><a href="/api/tools/cover-letter-template" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><Download className="h-4 w-4" />Download Word template</a></div></div>;
}
