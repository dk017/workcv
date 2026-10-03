"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Wand2 } from "lucide-react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import {
  decodeJobFromHash,
  jobTailorEditorPath,
  jobTailorHandoffKey,
  maxAdvertLength,
  minAdvertLength,
  parseTailorJob,
  serializeJobTailorHandoff,
} from "@/lib/job-tailor";
import { site } from "@/lib/site";

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-md border border-line-strong bg-white px-3 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";
const labelClass = "block text-sm font-bold text-navy";

// Landing page for "Tailor my CV for this job": the Chrome extension sends the
// job in the URL fragment; anyone else can paste an advert. Nothing is copied
// until the visitor confirms, so a link alone cannot change their CVs.
export function JobTailorLanding() {
  const [role, setRole] = useState("");
  const [employer, setEmployer] = useState("");
  const [advertText, setAdvertText] = useState("");
  const [fromExtension, setFromExtension] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    // Drop the advert from the address bar and history straight away.
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    const job = decodeJobFromHash(hash);
    if (!job) {
      setError("The job details from the extension could not be read. Paste the advert below instead.");
      return;
    }
    setRole(job.role);
    setEmployer(job.employer);
    setAdvertText(job.advertText);
    setFromExtension(true);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const job = parseTailorJob({ role, employer, advertText, source: fromExtension ? "chrome-extension" : "tailor-page" });
    if (!job || !job.role) {
      setError("Add the job title so your copied CV can be named after it.");
      return;
    }
    try {
      window.sessionStorage.setItem(jobTailorHandoffKey, serializeJobTailorHandoff(job));
    } catch {
      setError("Your browser is blocking storage for this site, so the job cannot be passed to the editor. Open the editor and use Tailor to job instead.");
      return;
    }
    setSubmitting(true);
    trackFunnelEvent("marketing_cta_clicked", { placement: fromExtension ? "tailor_page_extension" : "tailor_page_paste" });
    window.location.href = jobTailorEditorPath;
  };

  const advertLength = advertText.trim().length;

  return (
    <section className="bg-paper py-10 md:py-14">
      <div className="container-page">
        <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Tailor your CV</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy md:text-5xl">
          {fromExtension && role ? `Tailor your CV for ${role}` : "Tailor your CV for this job"}
        </h1>
        <p className="mt-3 text-muted">
          WorkCV makes a separate copy of your saved CV for this vacancy and shows which advert keywords it already covers. Your original CV stays
          as it is. Editing is free; you pay only to download, from {site.price} once.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6" noValidate>
          {fromExtension ? (
            <p className="rounded-md border border-line bg-greensoft px-3 py-2 text-sm text-navy" role="status">
              Job details captured from the page you were viewing. Check them before you continue.
            </p>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Job title
              <input value={role} onChange={(event) => setRole(event.target.value)} maxLength={160} required className={inputClass} placeholder="e.g. Warehouse Operative" />
            </label>
            <label className={labelClass}>
              Employer <span className="font-normal text-muted">(optional)</span>
              <input value={employer} onChange={(event) => setEmployer(event.target.value)} maxLength={160} className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Job advert <span className="font-normal text-muted">(duties and essential criteria)</span>
            <textarea
              value={advertText}
              onChange={(event) => setAdvertText(event.target.value)}
              maxLength={maxAdvertLength}
              rows={10}
              className={`${inputClass} py-3 leading-6`}
              placeholder="Paste the job advert here..."
            />
            <span className="mt-1 block text-xs font-normal text-muted">
              {advertLength >= minAdvertLength
                ? `${advertLength.toLocaleString("en-GB")} characters. Only add keywords you can back up with real experience.`
                : "Optional, but the keyword check needs the advert text."}
            </span>
          </label>
          {error ? <p className="text-sm font-bold text-[#8d3030]" role="alert">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Opening the editor..." : "Tailor my CV for this job"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-xs leading-5 text-muted">You will sign in with a one-time email code if you have not already.</p>
          </div>
        </form>
        </div>
      </div>
    </section>
  );
}
