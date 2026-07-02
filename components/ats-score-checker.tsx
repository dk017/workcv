"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileSearch,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  analyseAtsKeywords,
  type AtsAnalysis,
  type AtsKeyword,
} from "@/lib/ats-keyword-checker";
import type { CvFitAssessment } from "@/lib/cv-fit-assessment";
import { writeCvFitHandoff } from "@/lib/cv-fit-handoff";
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
  cv: `JORDAN TAYLOR
jordan.taylor@example.co.uk | 07123 456 789 | Leeds

CUSTOMER SERVICE ASSISTANT

Profile
Customer service professional with three years of experience supporting retail and online customers by phone and email. Experienced in complaint resolution, customer records and working across busy service teams.

Key skills
Customer service, communication, problem solving, Salesforce CRM, Microsoft Excel

Experience
Customer Service Assistant, North Retail, 2023–Present
- Manage 40 to 50 customer queries per day by phone and email.
- Resolved delivery and payment complaints and achieved team response targets.
- Updated Salesforce records and used Excel to monitor weekly open cases.
- Coordinated with delivery teams to resolve complex cases.

Education and training
Five GCSEs including English and Maths. Annual data protection and complaint handling training.`,
};

const categoryStyles: Record<AtsKeyword["category"], string> = {
  "Job title": "border-[#b7c9d8] bg-[#edf4f8] text-navy",
  "Skill or tool": "border-[#b9d8ca] bg-[#eef8f2] text-[#215f42]",
  Qualification: "border-[#ead39c] bg-[#fff8e8] text-[#76530b]",
  "Action verb": "border-[#d7c5df] bg-[#f7f0fa] text-[#62416f]",
};

const requirementStyles = {
  supported: {
    label: "Evidenced",
    className: "bg-greensoft text-success",
  },
  "partly-supported": {
    label: "Partly evidenced",
    className: "bg-[#fff5e7] text-[#8a5a00]",
  },
  "not-evidenced": {
    label: "Not evidenced",
    className: "bg-redsoft text-[#963c3c]",
  },
} as const;

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
  const [assessment, setAssessment] = useState<CvFitAssessment | null>(null);
  const [fallback, setFallback] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const jobWords = useMemo(() => countWords(jobDescription), [jobDescription]);
  const cvWords = useMemo(() => countWords(cvText), [cvText]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAssessment(null);
    setFallback(null);

    if (jobWords < 40) {
      setError("Paste at least 40 words from the job advert so there is enough detail to compare.");
      return;
    }
    if (cvWords < 80) {
      setError("Paste at least 80 words from your CV so the assessment can review more than one section.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/cv-fit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, cvText }),
      });
      const data = (await response.json().catch(() => null)) as
        | CvFitAssessment
        | { error?: string }
        | null;
      if (!response.ok || !data || !("score" in data)) {
        throw new Error(
          data && "error" in data && data.error
            ? data.error
            : "The full assessment is temporarily unavailable.",
        );
      }
      setAssessment(data);
    } catch (requestError) {
      const keywordResult = analyseAtsKeywords(jobDescription, cvText);
      setFallback(keywordResult);
      setError(
        `${requestError instanceof Error ? requestError.message : "The full assessment is temporarily unavailable."} A local keyword comparison is shown instead.`,
      );
    } finally {
      setLoading(false);
      window.setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    }
  }

  function loadExample() {
    setJobDescription(examples.job);
    setCvText(examples.cv);
    setAssessment(null);
    setFallback(null);
    setError("");
  }

  function reset() {
    setJobDescription("");
    setCvText("");
    setAssessment(null);
    setFallback(null);
    setError("");
  }

  function prepareEditorHandoff() {
    if (!assessment) return;
    writeCvFitHandoff({
      version: 1,
      createdAt: Date.now(),
      cvText,
      jobDescription,
      targetRole: assessment.targetRole,
      priorities: assessment.priorities,
      source: "cv-fit-assessment",
    });
  }

  const resultColour =
    assessment && assessment.score >= 75
      ? "#2D7D52"
      : assessment && assessment.score >= 50
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
              maxLength={20_000}
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
              maxLength={30_000}
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
          <p id="privacy-note" className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Your text is sent securely to OpenAI to generate this assessment. WorkCV
            does not save it or include its contents in analytics. OpenAI API data is
            not used to train models by default.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadExample}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60"
            >
              Try an example
            </button>
            {(jobDescription || cvText) && (
              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper disabled:opacity-60"
                title="Clear both fields"
                aria-label="Clear both fields"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assessing your CV...
                </>
              ) : (
                <>
                  Assess my CV fit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {assessment ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <div className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="grid gap-8 border-b border-line bg-paper p-6 md:p-8 lg:grid-cols-[240px_1fr] lg:items-center">
              <div className="flex justify-center">
                <div
                  className="relative grid h-44 w-44 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(${resultColour} ${assessment.score * 3.6}deg, #e5e2db 0deg)`,
                  }}
                >
                  <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center">
                    <div>
                      <p className="font-display text-6xl font-semibold leading-none text-navy">
                        {assessment.score}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                        out of 100
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color: resultColour }}>
                  {assessment.band} fit communication
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
                  {assessment.summary}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                  The vacancy appears to target <strong className="text-navy">{assessment.targetRole}</strong>.
                  Your CV currently communicates <strong className="text-navy">{assessment.communicatedRole}</strong>{" "}
                  at <strong className="text-navy">{assessment.seniority}</strong> level.
                </p>
              </div>
            </div>

            <section className="border-b border-line p-6 md:p-8">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Where the score comes from
              </h3>
              <div className="mt-6 grid gap-x-10 gap-y-5 lg:grid-cols-2">
                {assessment.dimensions.map((dimension) => (
                  <div key={dimension.id}>
                    <div className="flex items-baseline justify-between gap-4 text-sm font-bold text-navy">
                      <span>{dimension.label}</span>
                      <span>{dimension.score}/{dimension.maximum}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-navy"
                        style={{ width: `${(dimension.score / dimension.maximum) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">{dimension.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-line p-6 md:p-8">
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-6 w-6 shrink-0 text-gold" />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    Vacancy requirements
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    “Not evidenced” means the supplied CV does not make it clear. It
                    does not mean you lack the skill.
                  </p>
                </div>
              </div>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {assessment.requirements.map((requirement) => {
                  const status = requirementStyles[requirement.status];
                  return (
                    <article
                      key={`${requirement.requirement}-${requirement.status}`}
                      className="grid gap-3 py-5 md:grid-cols-[1fr_170px]"
                    >
                      <div>
                        <h4 className="font-bold text-navy">{requirement.requirement}</h4>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {requirement.explanation}
                        </p>
                        {requirement.cvEvidence ? (
                          <p className="mt-2 border-l-2 border-gold pl-3 text-sm italic leading-6 text-ink">
                            “{requirement.cvEvidence}”
                          </p>
                        ) : null}
                      </div>
                      <div className="md:text-right">
                        <span className={`inline-flex rounded-md px-3 py-2 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="border-b border-line bg-[#f7faf8] p-6 md:p-8">
              <p className="flex items-center gap-2 text-sm font-bold text-navy">
                <ClipboardCheck className="h-5 w-5 text-success" />
                Your three highest-impact fixes
              </p>
              <div className="mt-5 grid gap-6 lg:grid-cols-3">
                {assessment.priorities.map((priority, index) => (
                  <article key={`${priority.category}-${priority.title}`}>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-success">
                      Priority {index + 1}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-navy">
                      {priority.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{priority.action}</p>
                  </article>
                ))}
              </div>
            </section>

            {assessment.vaguePhrases.length > 0 ? (
              <section className="border-b border-line p-6 md:p-8">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Phrases that need stronger evidence
                </h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {assessment.vaguePhrases.map((item) => (
                    <div key={item.phrase} className="border-l-2 border-[#c88c32] pl-4">
                      <p className="font-bold text-navy">“{item.phrase}”</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <KeywordList
                title="Keywords found"
                description="Advertised terms that also appear in your CV, including recognised word variations."
                keywords={assessment.keywords.found}
                found
              />
              <KeywordList
                title="Keywords to review"
                description="Add a term only when your real experience supports it, preferably inside evidence."
                keywords={assessment.keywords.missing}
                found={false}
              />
            </section>

            <div className="border-t border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-navy">
                    Fix these issues in an editable UK CV.
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    Your CV, target vacancy and three priorities will carry into a new
                    saved draft after email-code login. The one-off PDF price is {site.price}.
                  </p>
                </div>
                <Link
                  href="/editor?template=classic&new=1&from=cv-fit-assessment"
                  onClick={prepareEditorHandoff}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"
                >
                  Fix these issues in my CV
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-md border border-line bg-white p-5 text-sm leading-6 text-muted">
            <FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p>
              <strong className="text-navy">What this assessment means:</strong>{" "}
              a fixed-weight estimate of how clearly this CV communicates fit for this
              vacancy. It does not reproduce an employer&apos;s ATS, verify claims,
              inspect the original file layout or predict an interview.
            </p>
          </div>
        </div>
      ) : fallback ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <div className="rounded-lg border border-line-strong bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Local keyword comparison
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-navy">
              {fallback.score}% keyword coverage
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Found {fallback.found.length} of {fallback.totalKeywords} extracted terms.
              This fallback does not include evidence, role-clarity or requirement analysis.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <KeywordList
                title="Keywords found"
                description="Advertised terms also present in the CV."
                keywords={fallback.found}
                found
              />
              <KeywordList
                title="Keywords to review"
                description="Only add terms that truthfully describe your experience."
                keywords={fallback.missing}
                found={false}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
