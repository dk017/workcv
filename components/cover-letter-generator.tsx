"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clipboard,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { site } from "@/lib/site";

type Fields = {
  fullName: string;
  targetRole: string;
  company: string;
  hiringManager: string;
  jobDescription: string;
  evidence: string;
  motivation: string;
};

type GeneratedResult = {
  letter: string;
  paragraphs: string[];
  wordCount: number;
};

const emptyFields: Fields = {
  fullName: "",
  targetRole: "",
  company: "",
  hiringManager: "",
  jobDescription: "",
  evidence: "",
  motivation: "",
};

const example: Fields = {
  fullName: "Amira Khan",
  targetRole: "Customer Service Team Leader",
  company: "Northstar Retail",
  hiringManager: "Ms Patel",
  jobDescription:
    "Lead a customer service team, coach colleagues, review service quality and use Salesforce to resolve escalated complaints while meeting response targets.",
  evidence:
    "Led eight advisers, coached four new starters, used Salesforce daily and reduced overdue complaints by 18% through a new triage process.",
  motivation:
    "I want to lead a larger service team and improve how customers with complex cases are supported.",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15";

export function CoverLetterGenerator() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [tone, setTone] = useState<"professional" | "warm">("professional");
  const [length, setLength] = useState<"concise" | "standard">("standard");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  function update(name: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, tone, length }),
        signal: controller.signal,
      });
      const data = (await response.json()) as GeneratedResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The letter could not be generated.");
      }
      setResult(data);
      window.setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The request took too long. Please try again."
          : requestError instanceof Error
            ? requestError.message
            : "The letter could not be generated.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  async function copyLetter() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.letter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setError("Copy was blocked. Select the letter and copy it manually.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Your name" name="fullName" value={fields.fullName} onChange={update} required maxLength={100} placeholder="e.g. Amira Khan" />
          <TextField label="Hiring manager (optional)" name="hiringManager" value={fields.hiringManager} onChange={update} maxLength={100} placeholder="e.g. Ms Patel" />
          <TextField label="Target role" name="targetRole" value={fields.targetRole} onChange={update} required maxLength={140} placeholder="e.g. Customer Service Team Leader" />
          <TextField label="Employer" name="company" value={fields.company} onChange={update} required maxLength={140} placeholder="e.g. Northstar Retail" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TextArea label="Job description" hint="Paste the duties and requirements that matter." name="jobDescription" value={fields.jobDescription} onChange={update} minLength={80} maxLength={6000} placeholder="Paste the job advert here..." />
          <TextArea label="Your relevant evidence" hint="Use facts from your CV: experience, skills and measured results." name="evidence" value={fields.evidence} onChange={update} minLength={50} maxLength={3000} placeholder="e.g. Led eight advisers, coached four starters..." />
        </div>
        <TextArea label="Why this role?" hint="Give a genuine reason, not generic enthusiasm." name="motivation" value={fields.motivation} onChange={update} minLength={10} maxLength={1000} placeholder="e.g. I want to lead a larger service team..." wrapperClassName="mt-6" compact />

        <div className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
          <ChoiceGroup label="Tone" value={tone} options={[["professional", "Professional"], ["warm", "Warm"]]} onChange={(value) => setTone(value as typeof tone)} />
          <ChoiceGroup label="Length" value={length} options={[["standard", "Standard"], ["concise", "Concise"]]} onChange={(value) => setLength(value as typeof length)} />
        </div>

        {error ? (
          <div role="alert" className="mt-5 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 lg:flex-row lg:items-end lg:justify-between">
          <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Your entries are sent to OpenAI for this generation and are not saved by WorkCV. Do not include sensitive data the letter does not need.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setFields(example); setResult(null); setError(""); }} disabled={isLoading} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60">Try example</button>
            {Object.values(fields).some(Boolean) ? (
              <button type="button" onClick={() => { setFields(emptyFields); setResult(null); setError(""); }} disabled={isLoading} aria-label="Clear all fields" title="Clear all fields" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper disabled:opacity-60"><RotateCcw className="h-4 w-4" /></button>
            ) : null}
            <button type="submit" disabled={isLoading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Writing letter</> : <><Sparkles className="h-4 w-4" />Generate letter</>}
            </button>
          </div>
        </div>
      </form>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="border-b border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-success">Draft ready</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-navy">Your tailored cover letter</h2>
                </div>
                <button type="button" onClick={copyLetter} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">
                  {copied ? <><Check className="h-4 w-4 text-success" />Copied</> : <><Clipboard className="h-4 w-4" />Copy</>}
                </button>
              </div>
              <textarea aria-label="Generated cover letter" readOnly value={result.letter} className="mt-6 min-h-[560px] w-full resize-y rounded-md border border-line bg-white p-5 text-base leading-8 text-ink outline-none focus:border-navy md:p-7" />
              <p className="mt-3 text-xs font-bold text-muted">{result.wordCount} body words · 4 paragraphs · UK English</p>
            </div>
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy">Check every claim</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-ink">
                  {["The examples match your CV exactly.", "The reason for applying sounds like you.", "Names, role title and spelling are correct."].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1.5 h-4 w-4 shrink-0 text-success" />{item}</li>)}
                </ul>
              </div>
              <p className="border-t border-line pt-7 text-sm leading-7 text-muted lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">Edit the draft before sending it. A strong cover letter connects your real evidence to this vacancy instead of merely repeating your CV or the advert.</p>
            </div>
            <div className="border-t border-line bg-paper p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div><p className="font-display text-2xl font-semibold text-navy">Make the CV match the letter.</p><p className="mt-2 text-sm text-muted">Build and preview free, then unlock your chosen CV PDF once for {site.price}.</p></div>
                <Link href="/editor?new=1" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Build my CV <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function TextField({ label, name, value, onChange, required = false, maxLength, placeholder }: { label: string; name: keyof Fields; value: string; onChange: (name: keyof Fields, value: string) => void; required?: boolean; maxLength: number; placeholder: string }) {
  return <label className="block"><span className="text-sm font-bold text-navy">{label}</span><input type="text" value={value} onChange={(event) => onChange(name, event.target.value)} required={required} minLength={required ? 2 : undefined} maxLength={maxLength} placeholder={placeholder} className={inputClass} /></label>;
}

function TextArea({ label, hint, name, value, onChange, minLength, maxLength, placeholder, wrapperClassName = "", compact = false }: { label: string; hint: string; name: keyof Fields; value: string; onChange: (name: keyof Fields, value: string) => void; minLength: number; maxLength: number; placeholder: string; wrapperClassName?: string; compact?: boolean }) {
  return <label className={`block ${wrapperClassName}`}><span className="flex items-end justify-between gap-3"><span className="text-sm font-bold text-navy">{label}</span><span className="text-xs font-bold text-muted">{value.length}/{maxLength.toLocaleString()}</span></span><span className="mt-1 block text-xs leading-5 text-muted">{hint}</span><textarea value={value} onChange={(event) => onChange(name, event.target.value)} required minLength={minLength} maxLength={maxLength} placeholder={placeholder} className={`${inputClass} resize-y py-3 leading-7 ${compact ? "min-h-[110px]" : "min-h-[150px]"}`} /></label>;
}

function ChoiceGroup({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return <fieldset><legend className="text-sm font-bold text-navy">{label}</legend><div className="mt-2 grid grid-cols-2 rounded-md border border-line-strong bg-white p-1">{options.map(([option, text]) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`min-h-10 rounded px-3 text-sm font-bold ${value === option ? "bg-navy text-white" : "text-navy hover:bg-paper"}`}>{text}</button>)}</div></fieldset>;
}
