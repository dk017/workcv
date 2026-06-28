"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Text,
} from "lucide-react";

import {
  analyseCvLength,
  countCvWords,
  CvLengthAnalysis,
} from "@/lib/cv-length-checker";
import { site } from "@/lib/site";

const exampleCv = `EMILY THOMPSON
Customer Service Advisor | Leeds

PROFILE
Customer service professional with three years of retail and online support experience. Confident handling high-volume enquiries, resolving complaints and updating CRM records. Seeking a customer service advisor role where clear communication and reliable follow-up improve the customer experience.

KEY SKILLS
- Customer service and complaint resolution
- Salesforce CRM and Microsoft Excel
- Telephone, email and live-chat support
- Order tracking and payment queries
- Team support and accurate record keeping

EXPERIENCE
Customer Service Assistant | North Retail Ltd | 2023–Present
- Resolve 40 to 50 customer enquiries each day by telephone and email while meeting response targets.
- Investigate delayed deliveries and payment issues, explain next steps and record every action in Salesforce.
- Created a clearer handover note that reduced repeated follow-up questions from colleagues.
- Support new starters with systems, escalation routes and complaint-handling procedures.
- Monitor open cases and contact customers before promised deadlines, helping the team maintain its service-level target.
- Share recurring delivery and product issues with warehouse colleagues so they can address the underlying cause.

Retail Assistant | City Stores | 2021–2023
- Helped customers choose products, processed payments and resolved returns in line with store policy.
- Reconciled the till accurately and supported weekly stock counts.
- Explained product features clearly and suggested suitable alternatives when an item was unavailable.
- Worked across checkout, collection and customer-service areas during busy seasonal periods.
- Received positive feedback from a supervisor for staying calm and helpful during difficult returns.

EDUCATION AND TRAINING
Level 3 Diploma in Business Administration | Leeds College | 2021
Five GCSEs including English and Maths
Annual data protection and complaint-handling training

VOLUNTEERING
Community Shop Volunteer | Leeds Community Partnership | 2020–2021
- Welcomed visitors, sorted donated stock and answered questions about local support services.
- Helped organise a weekend collection that brought in more than 200 essential household items.

ADDITIONAL INFORMATION
Available for flexible shifts including evenings and weekends. References available on request.`;

const verdictStyles: Record<
  CvLengthAnalysis["verdict"],
  { colour: string; soft: string; label: string }
> = {
  "Too short": {
    colour: "#B54242",
    soft: "#FFF5F5",
    label: "Needs more evidence",
  },
  "Good length": {
    colour: "#2D7D52",
    soft: "#F0FDF4",
    label: "Within the general range",
  },
  "Too long": {
    colour: "#A16000",
    soft: "#FFF8E8",
    label: "Needs tighter editing",
  },
};

export function CvLengthChecker() {
  const [cvText, setCvText] = useState("");
  const [analysis, setAnalysis] = useState<CvLengthAnalysis | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const liveWordCount = useMemo(() => countCvWords(cvText), [cvText]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (liveWordCount < 20) {
      setAnalysis(null);
      setError(
        "Paste at least 20 words from your CV so the checker can return a useful length result.",
      );
      return;
    }

    setAnalysis(analyseCvLength(cvText));
    window.setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }

  function loadExample() {
    setCvText(exampleCv);
    setAnalysis(null);
    setError("");
  }

  function clear() {
    setCvText("");
    setAnalysis(null);
    setError("");
  }

  const style = analysis ? verdictStyles[analysis.verdict] : null;
  const markerPosition = analysis
    ? Math.min(100, Math.max(0, (analysis.wordCount / 1000) * 100))
    : 0;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="block">
          <span className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <span>
              <span className="block text-sm font-bold text-navy">Paste your CV text</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                Copy all visible sections from the version you plan to submit.
              </span>
            </span>
            <span className="text-xs font-bold text-muted">{liveWordCount} words</span>
          </span>
          <textarea
            value={cvText}
            onChange={(event) => setCvText(event.target.value)}
            placeholder="Paste your complete CV text here..."
            className="mt-3 min-h-[360px] w-full resize-y rounded-md border border-line-strong bg-white p-4 text-[16px] leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15"
            maxLength={40000}
            aria-describedby="length-privacy-note"
          />
        </label>

        {error ? (
          <div
            role="alert"
            className="mt-4 flex gap-3 rounded-md border border-[#efc3c3] bg-redsoft p-4 text-sm font-bold leading-6 text-[#8d3030]"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p
            id="length-privacy-note"
            className="flex max-w-xl gap-2 text-xs leading-5 text-muted"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            This check runs in your browser. Your CV text is not uploaded or saved.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadExample}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              Try an example
            </button>
            {cvText ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong bg-white text-navy hover:bg-paper"
                title="Clear CV text"
                aria-label="Clear CV text"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
            >
              Check my CV length
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {analysis && style ? (
        <div ref={resultsRef} className="scroll-mt-24 pt-12" aria-live="polite">
          <section className="overflow-hidden rounded-lg border border-line-strong bg-white shadow-soft">
            <div
              className="grid gap-7 border-b border-line p-6 md:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center"
              style={{ backgroundColor: style.soft }}
            >
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-[0.14em]"
                  style={{ color: style.colour }}
                >
                  {style.label}
                </p>
                <h2 className="mt-3 font-display text-5xl font-semibold text-navy">
                  {analysis.verdict}
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
                {[
                  {
                    label: "Words",
                    value: analysis.wordCount.toLocaleString("en-GB"),
                    icon: Text,
                  },
                  {
                    label: "Est. A4 pages",
                    value: analysis.estimatedPages.toFixed(1),
                    icon: FileText,
                  },
                  {
                    label: "Paragraphs",
                    value: analysis.paragraphs,
                    icon: ListChecks,
                  },
                  {
                    label: "Bullets",
                    value: analysis.bulletPoints,
                    icon: Check,
                  },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="min-w-0 bg-white p-4">
                      <Icon className="h-4 w-4 text-gold" />
                      <p className="mt-4 font-display text-3xl font-semibold text-navy">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                        {metric.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-navy">General UK CV guide</h3>
                <p className="text-xs font-bold text-muted">300–800 words</p>
              </div>
              <div className="relative mt-5 h-4 rounded-full bg-[#ece9e2]">
                <div className="absolute bottom-0 left-[30%] top-0 w-[50%] bg-[#b9dbc8]" />
                <span
                  className="absolute top-1/2 h-7 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                  style={{ left: `${markerPosition}%`, backgroundColor: style.colour }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-bold text-muted">
                <span>0</span>
                <span>300</span>
                <span>800</span>
                <span>1,000+</span>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
                    First priority
                  </p>
                  <p className="mt-3 text-base font-bold leading-7 text-ink">
                    {analysis.primaryTip}
                  </p>
                  <p className="mt-4 text-xs leading-6 text-muted">
                    The page estimate divides the text by 400. Actual pages vary with
                    font size, margins, spacing, headings and bullet layout.
                  </p>
                </div>
                <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    What to do next
                  </h3>
                  <ol className="mt-5 grid gap-4">
                    {analysis.actions.map((action, index) => (
                      <li key={action} className="grid grid-cols-[32px_1fr] gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-paper text-xs font-bold text-navy">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-sm leading-7 text-ink">{action}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="border-t border-line bg-[#edf4f8] p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-navy">
                    Put the right content into a clean UK CV.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Build and preview first, then unlock the selected CV PDF once for{" "}
                    {site.price}.
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
