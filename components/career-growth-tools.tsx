"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import {
  analyseCvFormat,
  buildFirstJobDraft,
  buildGapExplanation,
  convertResumeToUkCv,
  countToolWords,
  shortenCvText,
  translateTransferableSkills,
  type ConversionResult,
  type CvFormatAnalysis,
  type FirstJobDraft,
  type GapResult,
  type ShortenResult,
  type ToolCheck,
  type TransferableResult,
} from "@/lib/career-growth-tools";
import { writeCvToolHandoff } from "@/lib/cv-tool-handoff";
import { trackFunnelEvent } from "@/components/attribution-capture";

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15";
const textareaClass = `${inputClass} min-h-32 py-3`;

function ToolHandoffButton({
  source,
  patch,
  sourceText,
  children = "Use this in my CV",
}: {
  source: string;
  patch?: Parameters<typeof writeCvToolHandoff>[0]["patch"];
  sourceText?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        writeCvToolHandoff({ source, patch, sourceText });
        trackFunnelEvent("marketing_cta_clicked", {
          destination: "/editor",
          placement: `tool_${source.replace(/[^a-z0-9]+/gi, "_").slice(0, 64)}_editor`,
        });
        window.location.assign("/editor?from=career-tool&new=1");
      }}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      {children}
    </p>
  );
}

function ResultShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft" aria-live="polite">
      <div className="border-b border-line bg-[#edf4f8] p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-success">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-navy">{title}</h2>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

function CheckList({ checks }: { checks: ToolCheck[] }) {
  return (
    <div className="grid gap-4">
      {checks.map((item) => (
        <div key={item.id} className="flex gap-3">
          {item.status === "good" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          ) : (
            <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${item.status === "warning" ? "text-[#a74848]" : "text-gold"}`} />
          )}
          <div>
            <p className="text-sm font-bold text-navy">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CvFormatCheckerTool() {
  const example = `Amira Khan\namira@example.com | 07700 900123 | Leeds\n\nPROFILE\nCustomer service team leader with experience improving complaint handling.\n\nKEY SKILLS\nCustomer service\nSalesforce\nTeam coaching\n\nEXPERIENCE\nCustomer Service Team Leader | Northstar Retail | Jan 2022 - Present\n- Led eight advisers and coached four new starters.\n- Reduced overdue complaints by 18% through a new triage process.\n\nEDUCATION\nLevel 3 Diploma in Customer Service | City College | 2021`;
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<CvFormatAnalysis | null>(null);
  const [error, setError] = useState("");
  const liveWords = useMemo(() => countToolWords(text), [text]);
  function run() {
    if (liveWords < 40) {
      setError("Paste at least 40 words from your CV for a useful format check.");
      return;
    }
    setError("");
    setAnalysis(analyseCvFormat(text));
  }
  return (
    <div>
      <label className="block text-sm font-bold text-navy">
        Paste selectable CV text
        <span className="mt-1 block font-normal leading-6 text-muted">This checks text structure and gives warnings to inspect in the actual PDF or DOCX. It cannot see fonts, columns or images from pasted text.</span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={30000} className={`${textareaClass} min-h-[340px]`} placeholder="Paste the version you plan to submit..." />
      </label>
      {error ? <p className="mt-3 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}
      <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <PrivacyNote>The check runs in your browser. Your pasted CV is not uploaded or saved.</PrivacyNote>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setText(example); setAnalysis(null); setError(""); }} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>
          {text ? <button type="button" onClick={() => { setText(""); setAnalysis(null); setError(""); }} aria-label="Clear pasted CV" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}
          <button type="button" onClick={run} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><ScanSearch className="h-4 w-4" />Check format signals</button>
        </div>
      </div>
      {analysis ? <ResultShell eyebrow={`${analysis.score}% text-structure score · ${analysis.wordCount} words`} title={analysis.summary}>
        <CheckList checks={analysis.checks} />
        <div className="mt-8 flex flex-col gap-4 border-l-4 border-success bg-[#edf7f1] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="font-display text-2xl font-semibold text-navy">Ready for a clean CV file?</h3><p className="mt-2 text-sm leading-6 text-muted">Carry the source text into the editor, review every imported field and preview the finished pages.</p></div>
          <ToolHandoffButton source="format-checker" sourceText={text} />
        </div>
      </ResultShell> : null}
    </div>
  );
}

export function FirstJobCvWizard() {
  const empty = { fullName: "", targetRole: "", education: "", projects: "", volunteering: "", strengths: "", availability: "" };
  const example = { fullName: "Sam Taylor", targetRole: "Retail Assistant", education: "A Levels in Business and English, Northside Sixth Form", projects: "Organised a student enterprise project and presented the results to a class panel", volunteering: "Welcomed visitors at a community food bank and sorted weekly donations", strengths: "Customer service, teamwork, reliable organisation", availability: "for part-time weekend work" };
  const [fields, setFields] = useState(empty);
  const [draft, setDraft] = useState<FirstJobDraft | null>(null);
  const [error, setError] = useState("");
  const update = (key: keyof typeof empty, value: string) => setFields((current) => ({ ...current, [key]: value }));
  function generate() {
    if (!fields.fullName.trim() || !fields.targetRole.trim() || (!fields.education.trim() && !fields.projects.trim() && !fields.volunteering.trim() && !fields.strengths.trim())) {
      setError("Add your name, target role and at least one piece of evidence, such as education, a project, volunteering or a strength.");
      return;
    }
    setError("");
    setDraft(buildFirstJobDraft(fields));
  }
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-navy">Your name<input value={fields.fullName} onChange={(event) => update("fullName", event.target.value)} className={inputClass} placeholder="e.g. Sam Taylor" maxLength={100} /></label>
        <label className="text-sm font-bold text-navy">Target role<input value={fields.targetRole} onChange={(event) => update("targetRole", event.target.value)} className={inputClass} placeholder="e.g. Retail Assistant" maxLength={120} /></label>
      </div>
      <label className="mt-5 block text-sm font-bold text-navy">Education or training<span className="mt-1 block font-normal leading-6 text-muted">Include the qualification, subjects, institution or course that is relevant.</span><textarea value={fields.education} onChange={(event) => update("education", event.target.value)} className={textareaClass} placeholder="e.g. A Levels in Business and English, Northside Sixth Form" maxLength={1500} /></label>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-navy">Projects and achievements<span className="mt-1 block font-normal leading-6 text-muted">One project or achievement per line.</span><textarea value={fields.projects} onChange={(event) => update("projects", event.target.value)} className={textareaClass} placeholder="e.g. Organised a student enterprise project..." maxLength={2500} /></label>
        <label className="text-sm font-bold text-navy">Volunteering, caring or responsibilities<span className="mt-1 block font-normal leading-6 text-muted">Unpaid experience counts when you describe what you did.</span><textarea value={fields.volunteering} onChange={(event) => update("volunteering", event.target.value)} className={textareaClass} placeholder="e.g. Welcomed visitors at a community food bank..." maxLength={2500} /></label>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-navy">Strengths<span className="mt-1 block font-normal leading-6 text-muted">Separate strengths with commas or new lines.</span><textarea value={fields.strengths} onChange={(event) => update("strengths", event.target.value)} className={textareaClass} placeholder="e.g. Customer service, teamwork, reliable organisation" maxLength={1000} /></label>
        <label className="text-sm font-bold text-navy">Availability <span className="font-normal text-muted">(optional)</span><input value={fields.availability} onChange={(event) => update("availability", event.target.value)} className={inputClass} placeholder="e.g. for part-time weekend work" maxLength={160} /></label>
      </div>
      {error ? <p role="alert" className="mt-4 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}
      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><PrivacyNote>This draft is generated in your browser from the facts you provide. It does not invent jobs, qualifications or results.</PrivacyNote><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFields(example); setDraft(null); setError(""); }} className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{Object.values(fields).some(Boolean) ? <button type="button" onClick={() => { setFields(empty); setDraft(null); setError(""); }} aria-label="Clear wizard" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="button" onClick={generate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><Sparkles className="h-4 w-4" />Build my first-job draft</button></div></div>
      {draft ? <FirstJobResult draft={draft} fullName={fields.fullName} targetRole={fields.targetRole} /> : null}
    </div>
  );
}

function FirstJobResult({ draft, fullName, targetRole }: { draft: FirstJobDraft; fullName: string; targetRole: string }) {
  const [profile, setProfile] = useState(draft.profile);
  const [skills, setSkills] = useState(draft.skills);
  const patch = { ...draft.patch, fullName, targetRole, profile, skills };
  return <ResultShell eyebrow="Editable first-job draft" title="A truthful starting point for your first application."><div className="grid gap-6 lg:grid-cols-2"><label className="text-sm font-bold text-navy">Profile<textarea value={profile} onChange={(event) => setProfile(event.target.value)} className={`${textareaClass} min-h-40`} /></label><label className="text-sm font-bold text-navy">Key skills<textarea value={skills} onChange={(event) => setSkills(event.target.value)} className={`${textareaClass} min-h-40`} /></label></div>{draft.experience.length ? <div className="mt-6 rounded-md border border-line bg-paper p-5"><h3 className="font-display text-2xl font-semibold text-navy">Evidence to review</h3><p className="mt-3 text-sm leading-7 text-muted">{draft.experience[0].bullets}</p></div> : null}<div className="mt-8 flex flex-wrap gap-3"><CopyButton value={`${profile}\n\nKEY SKILLS\n${skills}`} label="Copy draft" /><ToolHandoffButton source="first-job-wizard" patch={patch}>Open editable CV</ToolHandoffButton></div></ResultShell>;
}

export function TransferableSkillsTranslator() {
  const example = { previousRole: "Retail supervisor", experience: "Managed daily rotas, trained new starters, handled customer complaints, used Excel to track stock and supported weekly sales targets.", targetRole: "Operations coordinator" };
  const empty = { previousRole: "", experience: "", targetRole: "" };
  const [fields, setFields] = useState(empty);
  const [result, setResult] = useState<TransferableResult | null>(null);
  const [error, setError] = useState("");
  const update = (key: keyof typeof empty, value: string) => setFields((current) => ({ ...current, [key]: value }));
  function translate() {
    if (fields.experience.trim().length < 30) { setError("Describe at least 30 characters of real experience so the translator has evidence to work with."); return; }
    setError(""); setResult(translateTransferableSkills(fields));
  }
  return <div><div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold text-navy">Previous role or context<input value={fields.previousRole} onChange={(event) => update("previousRole", event.target.value)} className={inputClass} placeholder="e.g. Retail supervisor" maxLength={140} /></label><label className="text-sm font-bold text-navy">Target role <span className="font-normal text-muted">(optional)</span><input value={fields.targetRole} onChange={(event) => update("targetRole", event.target.value)} className={inputClass} placeholder="e.g. Operations coordinator" maxLength={140} /></label></div><label className="mt-5 block text-sm font-bold text-navy">What did you do?<span className="mt-1 block font-normal leading-6 text-muted">List responsibilities, tools, people, scale and outcomes. The tool only uses the facts you provide.</span><textarea value={fields.experience} onChange={(event) => update("experience", event.target.value)} className={`${textareaClass} min-h-48`} placeholder="e.g. Managed daily rotas, trained new starters..." maxLength={5000} /></label>{error ? <p role="alert" className="mt-4 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}<div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><PrivacyNote>This translation runs in your browser. Verify each suggested phrase and keep only what your experience supports.</PrivacyNote><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFields(example); setResult(null); setError(""); }} className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{Object.values(fields).some(Boolean) ? <button type="button" onClick={() => { setFields(empty); setResult(null); setError(""); }} aria-label="Clear translator" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="button" onClick={translate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><Target className="h-4 w-4" />Translate my skills</button></div></div>{result ? <TransferableResultView result={result} /> : null}</div>;
}

function TransferableResultView({ result }: { result: TransferableResult }) {
  const [profile, setProfile] = useState(result.profile);
  const [skills, setSkills] = useState(result.skills);
  return <ResultShell eyebrow={`${result.matches.length} transferable strengths found`} title="Use the language that makes your next role understandable."><label className="block text-sm font-bold text-navy">Suggested profile<textarea value={profile} onChange={(event) => setProfile(event.target.value)} className={`${textareaClass} min-h-36`} /></label><label className="mt-5 block text-sm font-bold text-navy">Skills to consider<textarea value={skills} onChange={(event) => setSkills(event.target.value)} className={`${textareaClass} min-h-32`} /></label><div className="mt-7 grid gap-4 md:grid-cols-2">{result.matches.map((match) => <article key={match.skill} className="rounded-md border border-line bg-paper p-5"><h3 className="font-display text-xl font-semibold text-navy">{match.skill}</h3><p className="mt-2 text-sm leading-6 text-muted">{match.evidence}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-success">Useful for {match.usefulFor.join(", ")}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-3"><CopyButton value={`${profile}\n\nKEY SKILLS\n${skills}`} label="Copy wording" /><ToolHandoffButton source="transferable-skills" patch={{ ...result.patch, profile, skills }}>Open career-change CV</ToolHandoffButton></div></ResultShell>;
}

export function CvShortenerTool() {
  const example = `EMILY THOMPSON\nCustomer Service Advisor | Leeds\n\nPROFILE\nCustomer service professional with three years of retail and online support experience. Confident handling high-volume enquiries and resolving complaints. Seeking a customer service advisor role.\n\nKEY SKILLS\nCustomer service and complaint resolution\nSalesforce CRM and Microsoft Excel\nTeam support and accurate record keeping\n\nEXPERIENCE\nCustomer Service Assistant | North Retail Ltd | 2023-Present\n- Resolve 40 to 50 customer enquiries each day by telephone and email while meeting response targets.\n- Investigate delayed deliveries and record every action in Salesforce.\n- Created a clearer handover note that reduced repeated follow-up questions.\n- Support new starters with systems and escalation routes.\n\nRetail Assistant | City Stores | 2021-2023\n- Helped customers choose products, processed payments and resolved returns.\n- Reconciled the till and supported weekly stock counts.\n- Worked across checkout, collection and service areas during busy periods.\n\nEDUCATION\nLevel 3 Diploma in Business Administration | Leeds College | 2021\nReferences available on request.`;
  const [text, setText] = useState("");
  const [targetWords, setTargetWords] = useState("550");
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState("");
  function run() { if (countToolWords(text) < 40) { setError("Paste at least 40 words from your CV first."); return; } setError(""); setResult(shortenCvText(text, Number(targetWords))); }
  return <div><div className="grid gap-5 md:grid-cols-[1fr_180px]"><label className="text-sm font-bold text-navy md:col-span-2">Paste your CV text<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${textareaClass} min-h-[360px]`} placeholder="Paste the full version you want to tighten..." maxLength={40000} /></label><label className="text-sm font-bold text-navy">Target words<select value={targetWords} onChange={(event) => setTargetWords(event.target.value)} className={inputClass}><option value="450">About 450</option><option value="550">About 550</option><option value="700">About 700</option></select></label></div>{error ? <p role="alert" className="mt-4 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}<div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><PrivacyNote>Shortening happens in your browser. The result is a suggested edit, not a claim that every CV must be two pages.</PrivacyNote><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setText(example); setResult(null); setError(""); }} className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{text ? <button type="button" onClick={() => { setText(""); setResult(null); setError(""); }} aria-label="Clear CV" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="button" onClick={run} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><ScanSearch className="h-4 w-4" />Suggest shorter version</button></div></div>{result ? <ShortenResultView result={result} /> : null}</div>;
}

function ShortenResultView({ result }: { result: ShortenResult }) {
  const [text, setText] = useState(result.shortenedText);
  return <ResultShell eyebrow={`${result.removedWords} words removed · ${result.shortenedWords} words left`} title="A tighter draft that keeps the lines most likely to prove fit."><label className="block text-sm font-bold text-navy">Edit the suggested version<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${textareaClass} min-h-[380px]`} /></label><div className="mt-7 rounded-md border border-line bg-paper p-5"><h3 className="font-display text-xl font-semibold text-navy">Review before sending</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">{result.suggestions.map((suggestion) => <li key={suggestion}>• {suggestion}</li>)}</ul></div><div className="mt-8 flex flex-wrap gap-3"><CopyButton value={text} label="Copy shorter CV" /><ToolHandoffButton source="cv-shortener" sourceText={text}>Open shorter CV</ToolHandoffButton></div></ResultShell>;
}

export function UkCvConverterTool() {
  const example = `PRIYA SHARMA\nOperations Executive\nPune, India | priya@example.com\nDate of Birth: 14 May 1994\n\nSUMMARY\nOrganized operations executive with vendor follow-up and MIS experience.\n\nWORK EXPERIENCE\nOperations Executive | Northstar Imports | 2021 - Present\n- Responsible for vendor follow-ups and weekly reports.\n- Analyzed delivery issues and organized updates.\n\nEDUCATION\nBachelor of Commerce | City University | 2018`;
  const [text, setText] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  function run() { if (countToolWords(text) < 30) { setError("Paste at least 30 words from the resume first."); return; } setError(""); setResult(convertResumeToUkCv(text)); }
  return <div><label className="block text-sm font-bold text-navy">Paste your existing resume<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${textareaClass} min-h-[360px]`} placeholder="Paste the selectable text from your resume..." maxLength={30000} /></label>{error ? <p role="alert" className="mt-4 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}<div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><PrivacyNote>The conversion runs in your browser. It preserves facts, flags omitted personal-detail lines and does not silently invent UK experience.</PrivacyNote><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setText(example); setResult(null); setError(""); }} className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{text ? <button type="button" onClick={() => { setText(""); setResult(null); setError(""); }} aria-label="Clear resume" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="button" onClick={run} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><FileText className="h-4 w-4" />Convert to UK structure</button></div></div>{result ? <ConverterResultView result={result} /> : null}</div>;
}

function ConverterResultView({ result }: { result: ConversionResult }) {
  const [text, setText] = useState(result.convertedText);
  return <ResultShell eyebrow={`${result.wordCount} words · UK structure suggested`} title="Review the adapted version before you use it."><label className="block text-sm font-bold text-navy">Editable UK version<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${textareaClass} min-h-[380px]`} /></label><div className="mt-7 grid gap-6 md:grid-cols-2"><div><h3 className="font-display text-xl font-semibold text-navy">Changes made</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">{result.changes.map((change) => <li key={change}>• {change}</li>)}</ul></div><div><h3 className="font-display text-xl font-semibold text-navy">Set aside for review</h3>{result.omittedLines.length ? <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">{result.omittedLines.map((line) => <li key={line}>• {line}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-muted">No common personal-detail lines were found.</p>}</div></div><div className="mt-8 flex flex-wrap gap-3"><CopyButton value={text} label="Copy UK version" /><ToolHandoffButton source="uk-cv-converter" sourceText={text}>Open editable UK CV</ToolHandoffButton></div></ResultShell>;
}

export function CareerGapExplainerTool() {
  const example = { reason: "Career break for family caring responsibilities", start: "2023", end: "2026", learning: "completed an online Excel course and kept up with customer-service practice", targetRole: "Customer Support Assistant", readiness: "I am now ready to return to paid work" };
  const empty = { reason: "", start: "", end: "", learning: "", targetRole: "", readiness: "" };
  const [fields, setFields] = useState(empty);
  const [result, setResult] = useState<GapResult | null>(null);
  const [error, setError] = useState("");
  const update = (key: keyof typeof empty, value: string) => setFields((current) => ({ ...current, [key]: value }));
  function generate() { if (!fields.reason.trim()) { setError("Add a short, truthful reason for the gap, such as study, caring, redundancy, travel or a career break."); return; } setError(""); setResult(buildGapExplanation(fields)); }
  return <div><label className="block text-sm font-bold text-navy">Reason or neutral label<input value={fields.reason} onChange={(event) => update("reason", event.target.value)} className={inputClass} placeholder="e.g. Career break for family caring responsibilities" maxLength={180} /></label><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-bold text-navy">Start <span className="font-normal text-muted">(optional)</span><input value={fields.start} onChange={(event) => update("start", event.target.value)} className={inputClass} placeholder="e.g. January 2023" maxLength={60} /></label><label className="text-sm font-bold text-navy">End <span className="font-normal text-muted">(optional)</span><input value={fields.end} onChange={(event) => update("end", event.target.value)} className={inputClass} placeholder="e.g. March 2026" maxLength={60} /></label></div><label className="mt-5 block text-sm font-bold text-navy">Learning, activity or transferable evidence <span className="font-normal text-muted">(optional)</span><textarea value={fields.learning} onChange={(event) => update("learning", event.target.value)} className={textareaClass} placeholder="e.g. completed an online Excel course and volunteered..." maxLength={1200} /></label><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-bold text-navy">Target role <span className="font-normal text-muted">(optional)</span><input value={fields.targetRole} onChange={(event) => update("targetRole", event.target.value)} className={inputClass} placeholder="e.g. Customer Support Assistant" maxLength={140} /></label><label className="text-sm font-bold text-navy">Readiness signal <span className="font-normal text-muted">(optional)</span><input value={fields.readiness} onChange={(event) => update("readiness", event.target.value)} className={inputClass} placeholder="e.g. I am now ready to return to paid work" maxLength={200} /></label></div>{error ? <p role="alert" className="mt-4 flex gap-2 text-sm font-bold text-[#8d3030]"><AlertTriangle className="h-4 w-4" />{error}</p> : null}<div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><PrivacyNote>This tool does not ask for private medical or family detail. Keep only what you are comfortable sharing and verify the wording.</PrivacyNote><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFields(example); setResult(null); setError(""); }} className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper">Try example</button>{Object.values(fields).some(Boolean) ? <button type="button" onClick={() => { setFields(empty); setResult(null); setError(""); }} aria-label="Clear gap tool" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"><RotateCcw className="h-4 w-4" /></button> : null}<button type="button" onClick={generate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"><Sparkles className="h-4 w-4" />Write a clear gap line</button></div></div>{result ? <GapResultView result={result} /> : null}</div>;
}

function GapResultView({ result }: { result: GapResult }) {
  const [explanation, setExplanation] = useState(result.explanation);
  const [profileLine, setProfileLine] = useState(result.profileLine);
  return <ResultShell eyebrow="Editable, factual wording" title="Give the timeline context, then return to your current fit."><div className="grid gap-6 md:grid-cols-2"><label className="text-sm font-bold text-navy">Career-break line<textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} className={`${textareaClass} min-h-36`} /></label><label className="text-sm font-bold text-navy">Profile readiness line<textarea value={profileLine} onChange={(event) => setProfileLine(event.target.value)} className={`${textareaClass} min-h-36`} /></label></div><div className="mt-7 rounded-md border border-line bg-paper p-5"><h3 className="font-display text-xl font-semibold text-navy">Before you use it</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">{result.suggestions.map((suggestion) => <li key={suggestion}>• {suggestion}</li>)}</ul></div><div className="mt-8 flex flex-wrap gap-3"><CopyButton value={explanation} label="Copy gap line" /><ToolHandoffButton source="career-gap-explainer" patch={{ ...result.patch, profile: profileLine }}>Add to my CV</ToolHandoffButton></div></ResultShell>;
}
