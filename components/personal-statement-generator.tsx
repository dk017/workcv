"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { site } from "@/lib/site";

type GeneratedResult = {
  statement: string;
  wordCount: number;
  sentenceCount: number;
};

const example = {
  background:
    "Customer service adviser with three years of experience handling telephone, email and live-chat enquiries in retail.",
  targetRole: "Senior Customer Service Adviser",
  highlights:
    "Resolves 40–50 enquiries each day, trained four new starters, Salesforce CRM, complaint resolution and accurate case notes.",
};

export function PersonalStatementGenerator() {
  const [background, setBackground] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [highlights, setHighlights] = useState("");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setCopyError("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch("/api/tools/personal-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, targetRole, highlights }),
        signal: controller.signal,
      });
      const data = (await response.json()) as GeneratedResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The statement could not be generated.");
      }

      setResult(data);
      window.setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        0,
      );
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The request took too long. Please try again."
          : requestError instanceof Error
            ? requestError.message
            : "The statement could not be generated.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  function loadExample() {
    setBackground(example.background);
    setTargetRole(example.targetRole);
    setHighlights(example.highlights);
    setResult(null);
    setError("");
    setCopied(false);
    setCopyError("");
  }

  function clear() {
    setBackground("");
    setTargetRole("");
    setHighlights("");
    setResult(null);
    setError("");
    setCopied(false);
    setCopyError("");
  }

  async function copyStatement() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.statement);
      setCopyError("");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setCopied(false);
      setCopyError("Copy was blocked by your browser. Select the text and copy it manually.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-bold text-navy">
                Current role or background
              </span>
              <span className="text-xs font-bold text-muted">
                {background.length}/800
              </span>
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Include your level, sector and relevant experience.
            </span>
            <textarea
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              placeholder="e.g. Customer service adviser with three years of retail support experience..."
              minLength={10}
              maxLength={800}
              required
              className="mt-3 min-h-[150px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </label>

          <label className="block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-bold text-navy">
                Skills and achievements
              </span>
              <span className="text-xs font-bold text-muted">
                {highlights.length}/800
              </span>
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Add 2–3 specific strengths, tools or measured results.
            </span>
            <textarea
              value={highlights}
              onChange={(event) => setHighlights(event.target.value)}
              placeholder="e.g. Salesforce CRM, trained four starters, resolves 40–50 enquiries daily..."
              minLength={10}
              maxLength={800}
              required
              className="mt-3 min-h-[150px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="flex items-end justify-between gap-3">
            <span className="text-sm font-bold text-navy">Target role</span>
            <span className="text-xs font-bold text-muted">
              {targetRole.length}/120
            </span>
          </span>
          <span className="mt-1 block text-xs leading-5 text-muted">
            Use the title shown in the job advert.
          </span>
          <input
            type="text"
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="e.g. Senior Customer Service Adviser"
            minLength={2}
            maxLength={120}
            required
            className="mt-3 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
          />
        </label>

        {error ? (
          <div
            role="alert"
            className="mt-5 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 lg:flex-row lg:items-end lg:justify-between">
          <p className="flex max-w-2xl gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Your entries are sent to OpenAI to generate the statement. WorkCV
            does not save them. OpenAI does not train on API data by default and
            may retain API inputs and outputs for up to 30 days for abuse
            monitoring.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadExample}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
            >
              Try an example
            </button>
            {background || targetRole || highlights ? (
              <button
                type="button"
                onClick={clear}
                disabled={isLoading}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
                title="Clear all fields"
                aria-label="Clear all fields"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Writing statement
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate statement
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div className="border-b border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    Draft ready
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
                    Your UK CV personal statement
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={copyStatement}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                aria-label="Generated personal statement"
                readOnly
                value={result.statement}
                className="mt-6 min-h-[180px] w-full resize-y rounded-md border border-line bg-white p-5 text-base leading-8 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 md:p-6"
              />
              {copyError ? (
                <p className="mt-3 text-sm font-bold text-[#8d3030]" role="status">
                  {copyError}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-muted">
                <span>{result.wordCount} words</span>
                <span>{result.sentenceCount} sentences</span>
                <span>UK English</span>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Check before using it
                </h3>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-ink">
                  {[
                    "Every claim is accurate and supported elsewhere in your CV.",
                    "The wording sounds natural when you read it aloud.",
                    "The role title and strongest evidence match this vacancy.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
                  Why this format works
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  It identifies your relevant background, proves fit with
                  supplied evidence and points directly at the target role. The
                  implied first-person voice keeps the paragraph concise without
                  switching awkwardly between “I” and third person.
                </p>
              </div>
            </div>

            <div className="border-t border-line bg-paper p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-navy">
                    Ready to build the rest of your CV?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Build and preview free, then unlock your selected CV PDF once
                    for {site.price}. No subscription.
                  </p>
                </div>
                <Link
                  href="/editor?new=1"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover"
                >
                  Build my CV for {site.price}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
