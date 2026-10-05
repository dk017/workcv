"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
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

import { trackFunnelEvent } from "@/components/attribution-capture";
import { PassOfferView } from "@/components/pass-offer-view";
import { rememberCtaHandoff } from "@/lib/cta-attribution";
import {
  type JobApplicationPackInput,
  type JobApplicationPackResult,
} from "@/lib/job-application-pack";
import { readCvToolHandoff, removeCvToolHandoff, writeCvToolHandoff } from "@/lib/cv-tool-handoff";
import { buildCoverLetterPatch } from "@/lib/cover-letter-handoff";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { jobPackPrefillKey, readJobPackPrefill } from "@/lib/job-tracker";
import { commercialRoutes, site } from "@/lib/site";

type Fields = JobApplicationPackInput;

const emptyFields: Fields = {
  fullName: "",
  targetRole: "",
  company: "",
  jobDescription: "",
  cvText: "",
  motivation: "",
};

const example: Fields = {
  fullName: "Amira Khan",
  targetRole: "Customer Service Team Leader",
  company: "Northstar Retail",
  jobDescription:
    "Lead a customer service team, coach colleagues, review service quality and use Salesforce to resolve escalated complaints while meeting response targets. The successful candidate will communicate clearly, organise daily priorities, support continuous improvement and handle customer issues calmly. Experience leading advisers and improving service processes is desirable.",
  cvText:
    "Customer service supervisor with experience leading busy front-line teams. Led eight advisers, coached four new starters and used Salesforce daily to record cases and follow up customer issues. Reduced overdue complaints by 18% through a new triage process. Reviewed weekly service reports, organised team priorities and supported colleagues with difficult conversations. Previously worked as a customer service adviser handling phone, email and face-to-face queries. Comfortable training colleagues, explaining processes clearly and working calmly when demand is high. Completed a Level 3 customer service qualification and regularly supported new starter induction.",
  motivation:
    "I want to lead a larger service team and improve how customers with complex cases are supported.",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15";

const careerToolEditorRoute = `${commercialRoutes.editor}&from=career-tool`;

export function JobApplicationPack() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [result, setResult] = useState<JobApplicationPackResult | null>(null);
  const [original, setOriginal] = useState<JobApplicationPackResult | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resultInput, setResultInput] = useState<Fields | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const leavingForEditor = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [fromTracker, setFromTracker] = useState<{ role: string; hasAdvert: boolean } | null>(null);

  // A job sent from the job application tracker pre-fills the role, employer and advert.
  useEffect(() => {
    try {
      const prefill = readJobPackPrefill(window.sessionStorage.getItem(jobPackPrefillKey));
      window.sessionStorage.removeItem(jobPackPrefillKey);
      if (!prefill) return;
      setFields((current) => ({
        ...current,
        targetRole: prefill.targetRole,
        company: prefill.company,
        jobDescription: prefill.jobDescription || current.jobDescription,
      }));
      setFromTracker({ role: prefill.targetRole, hasAdvert: prefill.jobDescription.trim().length >= 200 });
    } catch {
      // Storage can be blocked; the form simply starts empty.
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown > 0]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (!leavingForEditor.current) { event.preventDefault(); event.returnValue = ""; } };
    if (result) window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [result]);

  function update(name: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    if (isLoading || cooldown > 0) return;
    const submitted = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, (value || "").trim()])) as Fields;
    const body = JSON.stringify(submitted);
    if (new TextEncoder().encode(body).byteLength > 42000) {
      setError("These details exceed the total submission limit. Shorten the advert or CV; your text has been kept.");
      return;
    }
    if (submitted.fullName.length < 2 || submitted.targetRole.length < 2 || submitted.jobDescription.length < 200 || submitted.cvText.length < 400) {
      const invalid = submitted.fullName.length < 2 ? "fullName" : submitted.targetRole.length < 2 ? "targetRole" : submitted.jobDescription.length < 200 ? "jobDescription" : "cvText";
      (form.elements.namedItem(invalid) as HTMLElement | null)?.focus();
      setError("Enter your name and target role, at least 200 characters of advert and 400 characters of CV evidence, excluding surrounding spaces.");
      return;
    }
    setCopied("");
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 36_000);
    trackFunnelEvent("tool_started", {
      tool: "job_application_pack",
      lifecycle: "started",
      placement: analyticsPlacements.jobApplicationPackGenerate,
    });

    try {
      const response = await fetch("/api/tools/job-application-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });
      const data = (await response.json()) as JobApplicationPackResult & {
        error?: string;
      };
      if (response.status === 429) {
        const seconds = Number(response.headers.get("Retry-After"));
        setCooldown(Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60);
      }
      if (!response.ok) {
        throw new Error(data.error || "The application pack could not be generated.");
      }
      setResult(data);
      setOriginal(data);
      setResultInput(submitted);
      trackFunnelEvent("tool_completed", {
        tool: "job_application_pack",
        lifecycle: "completed",
        result: "success",
        placement: analyticsPlacements.jobApplicationPackGenerate,
      });
      window.setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }),
        0,
      );
    } catch (requestError) {
      trackFunnelEvent("tool_completed", {
        tool: "job_application_pack",
        lifecycle: "completed",
        result: "error",
        placement: analyticsPlacements.jobApplicationPackGenerate,
      });
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The request took too long. Please try again."
          : requestError instanceof Error
            ? requestError.message
            : "The application pack could not be generated.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  function discardCurrent() {
    if ((hasFields || result) && !window.confirm("Replace this form and draft? Copy any wording you want to keep first.")) return false;
    const pending = readCvToolHandoff();
    if (pending?.source === "job-application-pack") removeCvToolHandoff(pending);
    setOriginal(null);
    setResultInput(null);
    return true;
  }

  function loadExample() {
    if (!discardCurrent()) return;
    setFields(example);
    setResult(null);
    setError("");
    setCopied("");
    setManualCopy("");
  }

  function clearForm() {
    if (!discardCurrent()) return;
    setFields(emptyFields);
    setResult(null);
    setError("");
    setCopied("");
    setManualCopy("");
  }

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setManualCopy("");
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2_000);
    } catch {
      setManualCopy(value);
      setError("Copy was blocked. Select the text in the manual-copy box and copy it manually.");
    }
  }

  function continueToEditor(pass = false) {
    if (!result || !resultInput || isLoading) return;
    const destination = careerToolEditorRoute + (pass ? "&plan=pass" : "");
    const placement = pass ? analyticsPlacements.jobApplicationPackPass : analyticsPlacements.jobApplicationPackHandoff;
    try { writeCvToolHandoff({
      source: "job-application-pack",
      sourceText: resultInput.cvText.trim(),
      patch: {
        coverLetter: buildCoverLetterPatch(resultInput, result.coverLetter.paragraphs).coverLetter,
        fullName: resultInput.fullName.trim(),
        targetRole: resultInput.targetRole.trim(),
        profile: result.profile,
        applicationPack: { bullets: result.bullets, coverLetter: result.coverLetter.letter, interviewPrompts: result.interviewQuestions.map((item) => item.question + " — " + item.answerPrompt), thankYouEmail: result.thankYouEmail, originalCvText: resultInput.cvText, evidenceReview: result.requirements.map((item) => item.requirement + " — " + item.status + ". " + (item.cvEvidence || "No source evidence found.") + " " + item.action) },
        targeting: {
          role: resultInput.targetRole.trim(),
          jobDescription: resultInput.jobDescription.trim(),
          priorities: result.requirements.slice(0, 3).map((item) => ({
            category: "vacancy-relevance" as const,
            title: item.requirement,
            action: item.action,
          })),
        },
      },
    }); } catch (handoffError) { setError(handoffError instanceof Error && /too large|too long|not a valid/.test(handoffError.message) ? handoffError.message + " Your edited wording has been kept." : "Browser storage is unavailable. Copy your pack before opening the editor."); return; }
    try { rememberCtaHandoff(placement, destination); } catch { /* Attribution must not block a saved transfer. */ }
    trackFunnelEvent("marketing_cta_clicked", { destination, placement });
    leavingForEditor.current = true;
    window.location.assign(destination);
  }

  function editLetter(index: number, value: string) {
    if (!result || !resultInput) return;
    const paragraphs = result.coverLetter.paragraphs.map((paragraph, i) => i === index ? value : paragraph);
    setResult({ ...result, coverLetter: { paragraphs, letter: ["Dear Sir or Madam,", ...paragraphs, "Yours faithfully,\n" + resultInput.fullName].join("\n\n"), wordCount: paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length } });
  }

  function resetSection(section: "profile" | "bullets" | "coverLetter" | "thankYouEmail") {
    if (result && original) setResult({ ...result, [section]: original[section] });
  }

  const stale = resultInput && Object.keys(fields).some((key) => (fields[key as keyof Fields] || "").trim() !== resultInput[key as keyof Fields]);
  const hasFields = Object.values(fields).some(Boolean);

  return (
    <div>
      {fromTracker ? (
        <p role="status" className="mb-5 rounded-md border border-success/30 bg-greensoft p-4 text-sm leading-6 text-navy">
          <strong>Added from your job tracker: {fromTracker.role}.</strong>{" "}
          {fromTracker.hasAdvert
            ? "Now paste your CV so the pack can match your evidence to this advert."
            : "Paste the job advert and your CV to tailor your application."}
        </p>
      ) : null}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-3">
          <TextField label="Your name" name="fullName" value={fields.fullName} onChange={update} required maxLength={100} placeholder="e.g. Amira Khan" />
          <TextField label="Target role" name="targetRole" value={fields.targetRole} onChange={update} required maxLength={140} placeholder="e.g. Customer Service Team Leader" />
          <TextField label="Employer (optional)" name="company" value={fields.company} onChange={update} maxLength={140} placeholder="e.g. Northstar Retail" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TextArea label="Job advert" hint="Paste the duties and requirements, not just the job title." name="jobDescription" value={fields.jobDescription} onChange={update} minLength={200} maxLength={12000} placeholder="Paste the job advert here..." />
          <TextArea label="Your CV or evidence" hint="Use real experience, skills, qualifications and outcomes you can stand behind." name="cvText" value={fields.cvText} onChange={update} minLength={400} maxLength={24000} placeholder="Paste your CV text or detailed evidence here..." />
        </div>
        <TextArea label="Why do you want this role? (optional)" hint="A short, genuine reason helps the drafts sound like you. Leave blank for a neutral, evidence-led opening." name="motivation" value={fields.motivation} onChange={update} minLength={0} maxLength={1000} placeholder="e.g. I want to lead a larger service team..." wrapperClassName="mt-6" compact required={false} />

        {error ? (
          <div role="alert" className="mt-5 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 lg:flex-row lg:items-end lg:justify-between">
          <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>Your entries are sent through WorkCV to OpenAI to generate the pack. Remove contact details and sensitive information the review does not need. If you carry selected wording into the editor, saved draft content follows the account policy. Read the <Link href="/privacy" className="font-semibold underline">privacy policy</Link>.</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadExample} disabled={isLoading} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60">Try example</button>
            {hasFields ? <button type="button" onClick={clearForm} disabled={isLoading} aria-label="Clear all fields" title="Clear all fields" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper disabled:opacity-60"><RotateCcw className="h-4 w-4" /></button> : null}
            <button type="submit" disabled={isLoading || cooldown > 0} data-analytics-placement={analyticsPlacements.jobApplicationPackGenerate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Building pack</> : <><Sparkles className="h-4 w-4" />Build my pack</>}
            </button>
          </div>
        </div>
      </form>

      {cooldown > 0 ? <p role="status" className="mt-4 text-sm">Free generation limit reached. Try again in {cooldown} seconds. You can still edit and copy your existing draft.</p> : null}
      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12">
          {manualCopy ? <label className="mb-4 block text-sm font-bold">Manual-copy text<textarea aria-label="Manual-copy text" readOnly value={manualCopy} onFocus={(event) => event.target.select()} className="mt-2 min-h-48 w-full rounded border border-line p-4 font-normal" /></label> : null}
          {original && JSON.stringify(result) !== JSON.stringify(original) ? <p className="mb-3 text-sm font-semibold">You edited this draft. Your changes have not been checked by the generator.</p> : null}
          {!resultInput?.company.trim() ? <p className="mb-3 text-sm">Employer not specified: replace generic employer wording before sending.</p> : null}
          <p role="status" className="mb-3 text-sm">Draft ready. Review the evidence, then edit or copy the wording free.</p>
          {stale ? <p className="mb-4 rounded-md bg-ambersoft p-4 text-sm">Your inputs have changed. This draft and its editor handoff still use the earlier CV and advert. Generate again to update it; a failed request will keep this draft.</p> : null}
          <div className="mb-4"><ResultHeading title="Review your draft" copyLabel="all" copyValue={["CV PROFILE", result.profile, "CV BULLETS", ...result.bullets.map((text) => "• " + text), "COVER LETTER", result.coverLetter.letter, "EVIDENCE REVIEW", ...result.requirements.map((item) => item.requirement + ": " + item.status + ". " + (item.cvEvidence || "No evidence supplied") + " " + item.action), "INTERVIEW PREPARATION", ...result.interviewQuestions.map((item) => item.question + " " + item.answerPrompt), "POST-INTERVIEW EMAIL", result.thankYouEmail].join("\n\n")} copied={copied} onCopy={copyText} /></div>
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="border-b border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-success">Draft pack ready</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-navy">Your application plan for {result.targetRole}</h2>
                  <p className="mt-2 text-sm text-muted">{result.company} · Check every draft against your real experience before using it.</p>
                </div>

              </div>

            </div>

            <div className="grid gap-8 p-3 sm:p-6 md:p-8">
              <section>
                <ResultHeading title="Requirements to review" copyLabel="requirements" copyValue={result.requirements.map((item) => `${item.requirement} — ${item.status}. ${item.action}`).join("\n")} copied={copied} onCopy={copyText} />
                <div className="mt-4 grid gap-3">
                  {result.requirements.map((item) => <article key={item.requirement} className="rounded-md border border-line bg-paper p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold text-navy">{item.requirement}</h4><StatusPill status={item.status} /></div>{item.cvEvidence ? <p className="mt-2 text-sm leading-6 text-ink"><strong>Evidence found:</strong> “{item.cvEvidence}”</p> : null}<p className="mt-2 text-sm leading-6 text-muted">{item.action}</p></article>)}
                </div>
              </section>

              <section className="border-t border-line pt-8">
                <ResultHeading title="Profile suggestion" copyLabel="profile" copyValue={result.profile} copied={copied} onCopy={copyText} />
                <DraftField label="Edit profile" value={result.profile} maxLength={650} onChange={(profile) => setResult({ ...result, profile })} /><ResetDraft onClick={() => resetSection("profile")} />
              </section>

              <section className="border-t border-line pt-8">
                <ResultHeading title="Five CV bullet suggestions" copyLabel="bullets" copyValue={result.bullets.map((bullet) => `• ${bullet}`).join("\n")} copied={copied} onCopy={copyText} />
                <ol className="mt-4 grid gap-3">
                  {result.bullets.map((bullet, index) => <li key={index} className="flex flex-wrap gap-4 rounded-md border border-line bg-paper p-4 text-sm leading-7 text-ink"><span className="font-bold text-gold-dark">{index + 1}</span><DraftField label={`Edit CV bullet ${index + 1}`} value={bullet} maxLength={320} onChange={(value) => setResult({ ...result, bullets: result.bullets.map((item, i) => i === index ? value : item) })} /><button type="button" className="min-h-10 font-semibold underline" onClick={() => copyText(`bullet-${index}`, bullet)}>{copied === `bullet-${index}` ? "Copied" : `Copy bullet ${index + 1}`}</button></li>)}
                </ol><ResetDraft onClick={() => resetSection("bullets")} />
              </section>

              <section className="border-t border-line pt-8">
                <ResultHeading title="Cover-letter draft" copyLabel="cover-letter" copyValue={result.coverLetter.letter} copied={copied} onCopy={copyText} />
                <p className="mt-3 text-sm">Dear Sir or Madam,</p>
                {result.coverLetter.paragraphs.map((paragraph, index) => <DraftField key={index} label={`Edit letter paragraph ${index + 1}`} value={paragraph} maxLength={1200} onChange={(value) => editLetter(index, value)} />)}
                <p className="mt-3 whitespace-pre-line text-sm">Yours faithfully,{"\n"}{resultInput?.fullName}</p>
                <ResetDraft onClick={() => resetSection("coverLetter")} />
                <p className="mt-2 text-xs font-bold text-muted">{result.coverLetter.wordCount} body words · edit every claim before sending</p>
              </section>

              <section className="border-t border-line pt-8"><h3 className="font-display text-2xl font-semibold text-navy">Keyword review of your original CV</h3><p className="my-3 text-sm leading-7">This text comparison does not update as you edit the draft. Only use missing terms when your experience supports them.</p>                <div className="rounded-md border border-line bg-white px-4 py-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Original CV term coverage</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-navy">{result.keywords.score}%</p>
                  <p className="text-xs font-bold text-muted">Text overlap, not an employer ATS score</p>
                </div>              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <CoverageStat label="Found in CV" value={result.keywords.found.length} tone="success" />
                <CoverageStat label="Review missing terms" value={result.keywords.missing.length} tone="warning" />
                <CoverageStat label="Important terms" value={result.keywords.totalKeywords} tone="neutral" />
              </div><p className="mt-4 text-sm leading-7">Review these missing terms: {result.keywords.missing.map((item) => item.term).join(", ") || "None identified."}</p></section>
              <details className="border-t border-line pt-8"><summary className="cursor-pointer font-bold text-navy">Optional interview preparation</summary>
                <ResultHeading title="Interview questions to practise" copyLabel="interview-questions" copyValue={result.interviewQuestions.map((item, index) => `${index + 1}. ${item.question}\nFocus: ${item.focus}\nPrompt: ${item.answerPrompt}`).join("\n\n")} copied={copied} onCopy={copyText} />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {result.interviewQuestions.map((item, index) => <article key={item.question} className="rounded-md border border-line bg-paper p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-gold-dark">Question {index + 1}</p><h4 className="mt-2 font-bold leading-6 text-navy">{item.question}</h4><p className="mt-2 text-sm leading-6 text-muted"><strong className="text-navy">Focus:</strong> {item.focus}</p><p className="mt-2 text-sm leading-6 text-muted"><strong className="text-navy">Plan:</strong> {item.answerPrompt}</p></article>)}
                </div>
              </details>

              <details className="border-t border-line pt-8"><summary className="cursor-pointer font-bold text-navy">Optional post-interview email</summary>
                <ResultHeading title="Post-interview thank-you email" copyLabel="thank-you" copyValue={result.thankYouEmail} copied={copied} onCopy={copyText} />
                <DraftField label="Edit thank-you email" value={result.thankYouEmail} maxLength={1200} onChange={(thankYouEmail) => setResult({ ...result, thankYouEmail })} /><ResetDraft onClick={() => resetSection("thankYouEmail")} />
              </details>
            </div>

            <div className="border-t border-line bg-paper p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div><p className="font-display text-2xl font-semibold text-navy">Put the useful parts into your CV.</p><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Carry your original CV and complete pack into the editor. Review the import, then use the Experience tab to edit and apply truthful bullets to the correct role. The cover letter, evidence review and interview notes are saved separately from the CV PDF.</p></div>
                <button type="button" disabled={isLoading} onClick={() => continueToEditor()} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Use these details in my CV <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </section>

          <PassOfferView placement={analyticsPlacements.jobApplicationPackPass}>
            <div className="mt-5 rounded-lg border border-line bg-navy p-6 text-white md:p-8">
              <h3 className="font-display text-3xl font-semibold">Keep separate versions for different vacancies.</h3>
              <p className="mt-3 text-sm leading-7">Copy this text free. One saved CV and matching letter costs {site.price} once for PDF and editable Word, including edits and redownloads of that same pair. Job Search Pass costs {site.passPrice} once and covers existing documents and new documents created during {site.passDays} days. Covered documents stay editable and downloadable afterwards; new documents after expiry need a purchase. No renewal.</p>
              <p className="mt-3 text-sm leading-7">Choose Pass when you want several separately saved versions. Reusing one paid CV for multiple applications does not require Pass. This draft is not a complete rewritten CV; sign in by email code to save it and review your imported experience.</p>
              <button type="button" disabled={isLoading} onClick={() => continueToEditor(true)} className="mt-5 min-h-12 rounded-md bg-white px-5 font-bold text-navy">Use this draft with Job Search Pass</button>
            </div>
          </PassOfferView>
        </div>
      ) : null}
    </div>
  );
}

function TextField({ label, name, value, onChange, required = false, maxLength, placeholder }: { label: string; name: keyof Fields; value: string; onChange: (name: keyof Fields, value: string) => void; required?: boolean; maxLength: number; placeholder: string }) {
  return <label className="block"><span className="text-sm font-bold text-navy">{label}</span><input name={name} type="text" value={value} onChange={(event) => onChange(name, event.target.value)} required={required} minLength={required ? 2 : undefined} maxLength={maxLength} placeholder={placeholder} className={inputClass} /></label>;
}

function TextArea({ label, hint, name, value, onChange, minLength, maxLength, placeholder, wrapperClassName = "", compact = false, required = true }: { label: string; hint: string; name: keyof Fields; value: string; onChange: (name: keyof Fields, value: string) => void; minLength: number; maxLength: number; placeholder: string; wrapperClassName?: string; compact?: boolean; required?: boolean }) {
  return <label className={`block ${wrapperClassName}`}><span className="flex items-end justify-between gap-3"><span className="text-sm font-bold text-navy">{label}</span><span className="text-xs font-bold text-muted">{value.length}/{maxLength.toLocaleString()}</span></span><span className="mt-1 block text-xs leading-5 text-muted">{hint}</span><textarea name={name} value={value} onChange={(event) => onChange(name, event.target.value)} required={required} minLength={required || value.length > 0 ? minLength : undefined} maxLength={maxLength} placeholder={placeholder} className={`${inputClass} resize-y py-3 leading-7 ${compact ? "min-h-[110px]" : "min-h-[190px]"}`} /></label>;
}

function CoverageStat({ label, value, tone }: { label: string; value: number; tone: "success" | "warning" | "neutral" }) {
  const colour = tone === "success" ? "text-success" : tone === "warning" ? "text-gold-dark" : "text-navy";
  return <div className="rounded-md border border-line bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className={`mt-1 font-display text-2xl font-semibold ${colour}`}>{value}</p></div>;
}

function StatusPill({ status }: { status: "supported" | "partly-supported" | "not-evidenced" }) {
  const label = status === "supported" ? "Supported" : status === "partly-supported" ? "Partly supported" : "Not evidenced";
  const className = status === "supported" ? "bg-[#e4f3e8] text-[#28633a]" : status === "partly-supported" ? "bg-[#fff1d5] text-[#805700]" : "bg-[#f3e9e9] text-[#8d3030]";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>{label}</span>;
}

function ResultHeading({ title, copyLabel, copyValue, copied, onCopy }: { title: string; copyLabel: string; copyValue: string; copied: string; onCopy: (label: string, value: string) => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><button type="button" onClick={() => onCopy(copyLabel, copyValue)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-3 text-xs font-bold text-navy hover:bg-paper">{copied === copyLabel ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}{copied === copyLabel ? "Copied" : copyLabel === "all" ? "Copy all" : "Copy"}</button></div>;
}

function DraftField({ label, value, maxLength, onChange }: { label: string; value: string; maxLength: number; onChange: (value: string) => void }) {
  return <label className="mt-4 block w-full text-sm font-semibold text-navy">{label}<textarea aria-label={label} className="mt-2 min-h-28 w-full resize-y rounded-md border border-line bg-paper p-4 text-base font-normal leading-7" value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} /></label>;
}
function ResetDraft({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="mt-2 min-h-10 text-sm font-semibold underline">Reset this section to generated wording</button>;
}
