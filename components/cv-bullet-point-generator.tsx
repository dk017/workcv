"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clipboard,
  Copy,
  HelpCircle,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Fields = {
  jobTitle: string;
  rawExperience: string;
  targetRole: string;
  jobDescription: string;
};

type GeneratedResult = {
  bullets: string[];
  followUpQuestions: string[];
  averageWords: number;
  outcomeCount: number;
};

const emptyFields: Fields = {
  jobTitle: "",
  rawExperience: "",
  targetRole: "",
  jobDescription: "",
};

const example: Fields = {
  jobTitle: "Customer Service Team Leader",
  rawExperience:
    "Led eight advisers and coached four new starters. Used Salesforce every day. Introduced a triage process that reduced overdue complaints by 18%. Reviewed service quality data and resolved complex escalated complaints.",
  targetRole: "Customer Experience Manager",
  jobDescription:
    "Lead and coach a customer service team, resolve escalated complaints, review performance data and improve the customer experience.",
};

const fieldClass =
  "mt-2 min-h-12 w-full rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15";

export function CvBulletPointGenerator() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [employmentStatus, setEmploymentStatus] = useState<"current" | "previous">(
    "previous",
  );
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function update(name: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(null);
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch("/api/tools/cv-bullet-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, employmentStatus }),
        signal: controller.signal,
      });
      const data = (await response.json()) as GeneratedResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The bullet points could not be generated.");
      }
      setResult(data);
      window.setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The request took too long. Please try again."
          : requestError instanceof Error
            ? requestError.message
            : "The bullet points could not be generated.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  function editBullet(index: number, value: string) {
    setResult((current) =>
      current
        ? {
            ...current,
            bullets: current.bullets.map((bullet, bulletIndex) =>
              bulletIndex === index ? value : bullet,
            ),
          }
        : current,
    );
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2_000);
    } catch {
      setError("Copy was blocked. Select the text and copy it manually.");
    }
  }

  function clearAll() {
    setFields(emptyFields);
    setEmploymentStatus("previous");
    setResult(null);
    setError("");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-[1fr_0.8fr]">
          <label className="text-sm font-bold text-navy">
            Job or experience title
            <input
              className={fieldClass}
              value={fields.jobTitle}
              onChange={(event) => update("jobTitle", event.target.value)}
              required
              maxLength={120}
              placeholder="e.g. Customer Service Team Leader"
            />
          </label>
          <fieldset>
            <legend className="text-sm font-bold text-navy">When did you do this role?</legend>
            <div className="mt-2 grid min-h-12 grid-cols-2 rounded-md border border-line-strong bg-white p-1">
              {(["previous", "current"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={employmentStatus === value}
                  onClick={() => setEmploymentStatus(value)}
                  className={`rounded px-3 text-sm font-bold transition ${
                    employmentStatus === value
                      ? "bg-navy text-white"
                      : "text-muted hover:bg-paper hover:text-navy"
                  }`}
                >
                  {value === "previous" ? "Previous role" : "Current role"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <label className="mt-6 block text-sm font-bold text-navy">
          What did you do and what changed?
          <span className="mt-1 block font-normal leading-6 text-muted">
            Add responsibilities, projects, tools, scale and real outcomes. Rough notes are fine.
          </span>
          <textarea
            className={`${fieldClass} min-h-40 py-3`}
            value={fields.rawExperience}
            onChange={(event) => update("rawExperience", event.target.value)}
            required
            minLength={50}
            maxLength={3000}
            placeholder="e.g. Led eight advisers, coached four starters, introduced a complaint triage process..."
          />
        </label>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <label className="text-sm font-bold text-navy">
            Target role <span className="font-normal text-muted">(optional)</span>
            <input
              className={fieldClass}
              value={fields.targetRole}
              onChange={(event) => update("targetRole", event.target.value)}
              maxLength={120}
              placeholder="e.g. Customer Experience Manager"
            />
          </label>
          <label className="text-sm font-bold text-navy lg:row-span-2">
            Job description <span className="font-normal text-muted">(optional)</span>
            <span className="mt-1 block font-normal leading-6 text-muted">
              Used only to prioritise relevant evidence, never to invent experience.
            </span>
            <textarea
              className={`${fieldClass} min-h-32 py-3`}
              value={fields.jobDescription}
              onChange={(event) => update("jobDescription", event.target.value)}
              maxLength={5000}
              placeholder="Paste the main duties and requirements..."
            />
          </label>
        </div>

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
            Your entries are sent to OpenAI for this generation and are not saved by WorkCV. Verify every bullet before using it.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setFields(example);
                setResult(null);
                setError("");
              }}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60"
            >
              Try example
            </button>
            {Object.values(fields).some(Boolean) ? (
              <button
                type="button"
                onClick={clearAll}
                disabled={isLoading}
                aria-label="Clear all fields"
                title="Clear all fields"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-hover disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Writing bullets
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate five bullets
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {result ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="border-y border-line-strong bg-white py-7 md:px-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Five editable drafts</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-navy">Your CV bullet points</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Average {result.averageWords} words · {result.outcomeCount} of 5 include a supplied outcome signal
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText(result.bullets.map((bullet) => `• ${bullet}`).join("\n"), "all")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
              >
                {copied === "all" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                {copied === "all" ? "Copied" : "Copy all"}
              </button>
            </div>

            <ol className="mt-7 divide-y divide-line border-y border-line">
              {result.bullets.map((bullet, index) => (
                <li key={index} className="grid gap-3 py-5 sm:grid-cols-[32px_1fr_44px] sm:items-start">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-paper text-xs font-bold text-navy">
                    {index + 1}
                  </span>
                  <textarea
                    aria-label={`CV bullet point ${index + 1}`}
                    value={bullet}
                    onChange={(event) => editBullet(index, event.target.value)}
                    className="min-h-20 w-full resize-y rounded-md border border-line bg-white p-3 text-[16px] leading-7 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(bullet, String(index))}
                    aria-label={`Copy bullet point ${index + 1}`}
                    title={`Copy bullet point ${index + 1}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-navy hover:bg-paper"
                  >
                    {copied === String(index) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-5 border-l-4 border-gold bg-paper p-5 md:grid-cols-[28px_1fr]">
              <HelpCircle className="h-6 w-6 text-navy" />
              <div>
                <h3 className="font-display text-xl font-semibold text-navy">Questions that could strengthen these bullets</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {result.followUpQuestions.map((question) => (
                    <li key={question}>• {question}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-5 border-l-4 border-success bg-[#edf7f1] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-navy">Build the rest of your CV</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Add these edited bullets to a clean UK CV and preview every page.</p>
            </div>
            <Link href="/editor" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">
              Open CV builder <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
