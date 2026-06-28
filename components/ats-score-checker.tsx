"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileSearch,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import {
  analyseAtsKeywords,
  AtsAnalysis,
  AtsKeyword,
} from "@/lib/ats-keyword-checker";
import { site } from "@/lib/site";

const examples = {
  job: `Customer Service Advisor

We are looking for an experienced Customer Service Advisor to support customers by phone and email.

Essential requirements:
- Proven customer service and complaint resolution experience
- Experience using a CRM and Microsoft Excel
- Strong communication and problem solving skills
- Ability to manage a busy workload and achieve key performance indicators (KPIs)

You will resolve customer queries, update Salesforce records, monitor open cases and work with internal teams.`,
  cv: `CUSTOMER SERVICE ASSISTANT

Three years of experience supporting retail and online customers by phone and email. Resolved delivery and payment complaints, updated customer records in Salesforce CRM and used Excel to monitor weekly cases.

Key skills
Customer service, communication, problem solving, Salesforce, cash handling

Experience
Managed 40 to 50 customer queries per day and achieved team response targets. Supported new colleagues and reported recurring issues to the team leader. Coordinated with delivery teams to resolve complex cases and created clear follow-up notes for customers.

Education and training
Five GCSEs including English and Maths. Completed annual data protection, complaint handling and communication training.`,
};

const categoryStyles: Record<AtsKeyword["category"], string> = {
  "Job title": "border-[#b7c9d8] bg-[#edf4f8] text-navy",
  "Skill or tool": "border-[#b9d8ca] bg-[#eef8f2] text-[#215f42]",
  Qualification: "border-[#ead39c] bg-[#fff8e8] text-[#76530b]",
  "Action verb": "border-[#d7c5df] bg-[#f7f0fa] text-[#62416f]",
};

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function KeywordList({
  title,
  description,
  keywords,
  found,
}: {
  title: string;
  description: string;
  keywords: AtsKeyword[];
  found: boolean;
}) {
  const Icon = found ? Check : AlertTriangle;

  return (
    <section className="border-t border-line pt-7 first:border-0 first:pt-0">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            found ? "bg-greensoft text-success" : "bg-[#fff5e7] text-[#9a6200]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>

      {keywords.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={`${keyword.category}-${keyword.term}`}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold ${categoryStyles[keyword.category]}`}
            >
              {keyword.term}
              <span className="text-[10px] font-bold uppercase text-current/65">
                {keyword.importance}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-md border border-line bg-paper p-4 text-sm text-muted">
          {found
            ? "No extracted keywords were found in the CV."
            : "No missing keywords were detected in the terms this check extracted."}
        </p>
      )}
    </section>
  );
}

export function AtsScoreChecker() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const jobWords = useMemo(() => countWords(jobDescription), [jobDescription]);
  const cvWords = useMemo(() => countWords(cvText), [cvText]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (jobWords < 40) {
      setAnalysis(null);
      setError("Paste at least 40 words from the job advert so there is enough detail to compare.");
      return;
    }
    if (cvWords < 80) {
      setAnalysis(null);
      setError("Paste at least 80 words from your CV so the result reflects more than one short section.");
      return;
    }

    const result = analyseAtsKeywords(jobDescription, cvText);
    if (result.totalKeywords < 3) {
      setAnalysis(null);
      setError(
        "Only a few useful requirements could be extracted. Include the responsibilities and person specification from the full advert.",
      );
      return;
    }

    setAnalysis(result);
    window.setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }

  function loadExample() {
    setJobDescription(examples.job);
    setCvText(examples.cv);
    setAnalysis(null);
    setError("");
  }

  function reset() {
    setJobDescription("");
    setCvText("");
    setAnalysis(null);
    setError("");
  }

  const resultColour =
    analysis?.score && analysis.score >= 70
      ? "#2D7D52"
      : analysis?.score && analysis.score >= 45
        ? "#B7791F"
        : "#B54242";

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="flex items-end justify-between gap-4">
              <span>
                <span className="block text-sm font-bold text-navy">1. Job description</span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Include responsibilities and essential criteria.
                </span>
              </span>
              <span className="shrink-0 text-xs font-bold text-muted">{jobWords} words</span>
            </span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the full job advert here..."
              className="mt-3 min-h-[300px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
              maxLength={20000}
              aria-describedby="privacy-note"
            />
          </label>

          <label className="block">
            <span className="flex items-end justify-between gap-4">
              <span>
                <span className="block text-sm font-bold text-navy">2. Your CV text</span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Copy the text from the version you plan to submit.
                </span>
              </span>
              <span className="shrink-0 text-xs font-bold text-muted">{cvWords} words</span>
            </span>
            <textarea
              value={cvText}
              onChange={(event) => setCvText(event.target.value)}
              placeholder="Paste your CV text here..."
              className="mt-3 min-h-[300px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
              maxLength={30000}
              aria-describedby="privacy-note"
            />
          </label>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p id="privacy-note" className="flex max-w-xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Private by design: this comparison runs in your browser. The text is not uploaded or saved.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadExample}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              Try an example
            </button>
            {(jobDescription || cvText) && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper"
                title="Clear both fields"
                aria-label="Clear both fields"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
            >
              Check keyword match
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {analysis ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <div className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="grid gap-8 border-b border-line bg-paper p-6 md:p-8 lg:grid-cols-[260px_1fr] lg:items-center">
              <div className="flex justify-center">
                <div
                  className="relative grid h-48 w-48 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(${resultColour} ${analysis.score * 3.6}deg, #e5e2db 0deg)`,
                  }}
                >
                  <div className="grid h-40 w-40 place-items-center rounded-full bg-white text-center">
                    <div>
                      <p className="font-display text-6xl font-semibold leading-none text-navy">
                        {analysis.score}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                        keyword match
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color: resultColour }}>
                  {analysis.verdict}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
                  {analysis.score >= 70
                    ? "Your CV covers most of the terms this advert emphasises."
                    : analysis.score >= 45
                      ? "Your CV matches part of the advert, with clear gaps to review."
                      : "The advert and CV currently use substantially different language."}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                  Found {analysis.found.length} of {analysis.totalKeywords} extracted terms
                  {analysis.essentialTotal > 0
                    ? `, including ${analysis.essentialFound} of ${analysis.essentialTotal} terms found near essential or required wording`
                    : ""}
                  . Review the missing list against your real experience before changing anything.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-muted">
                  <span>Green: 70–100</span>
                  <span>Amber: 45–69</span>
                  <span>Red: 0–44</span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <KeywordList
                title="Keywords found"
                description="These advertised terms also appear in your CV, including recognised word variations."
                keywords={analysis.found}
                found
              />
              <KeywordList
                title="Keywords to review"
                description="Missing does not mean you should add it. Add a term only when your experience supports it."
                keywords={analysis.missing}
                found={false}
              />
            </div>

            <div className="border-t border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-navy">
                    <ClipboardCheck className="h-5 w-5 text-success" />
                    Best next action
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-ink">
                    Check the highest-priority missing terms first. Where they are true,
                    show the term in a specific achievement or responsibility. Then put
                    the finished content into a clean, text-based CV and follow the
                    employer&apos;s requested file format.
                  </p>
                </div>
                <Link
                  href="/editor?template=classic&new=1"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"
                >
                  Build my CV for {site.price}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-md border border-line bg-white p-5 text-sm leading-6 text-muted">
            <FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p>
              <strong className="text-navy">What this score means:</strong> a
              transparent estimate of exact keyword coverage between these two text
              inputs. It does not test your PDF layout, verify claims, assess years of
              experience or reproduce any employer&apos;s ATS configuration.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
