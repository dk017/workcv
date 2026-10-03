"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Briefcase,
  Download,
  ExternalLink,
  Pencil,
  Plus,
  Printer,
  Trash2,
  Upload,
  Wand2,
  X,
} from "lucide-react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import { PassOfferView } from "@/components/pass-offer-view";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { jobTailorEditorPath, jobTailorHandoffKey, minAdvertLength, parseTailorJob, serializeJobTailorHandoff } from "@/lib/job-tailor";
import {
  buildJobPackPrefill,
  cleanJob,
  csvToJobs,
  isSafeHttpUrl,
  jobPackPrefillKey,
  jobSources,
  jobStatuses,
  jobUrgency,
  jobsToCsv,
  maxTrackedJobs,
  mergeImportedJobs,
  parseTrackerState,
  passOfferThreshold,
  serializeTrackerState,
  sortJobs,
  statusLabel,
  summarizeJobs,
  todayIso,
  trackedJobSchema,
  trackerStorageKey,
  type JobStatus,
  type TrackedJob,
} from "@/lib/job-tracker";
import { buildLoginHref } from "@/lib/safe-redirect";
import { site } from "@/lib/site";

const tool = "job_application_tracker";
const passHref = buildLoginHref("/editor?plan=pass");
const packHref = "/tools/job-application-pack-uk?from=job-tracker";
const boardStatuses: JobStatus[] = ["saved", "applied", "interview", "offer"];
const closedStatuses: JobStatus[] = ["unsuccessful", "withdrawn"];

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-md border border-line-strong bg-white px-3 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";
const labelClass = "block text-sm font-bold text-navy";
const smallButton =
  "inline-flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:border-navy disabled:opacity-50";

type Draft = Omit<TrackedJob, "id" | "createdAt" | "updatedAt"> & { id?: string };
const emptyDraft: Draft = { role: "", employer: "", status: "applied" };

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function exampleJobs(today: string): TrackedJob[] {
  const shift = (days: number) => {
    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const now = Date.now();
  return [
    { id: newId(), isExample: true, role: "Customer Service Adviser", employer: "Northline Energy", location: "Leeds", source: "Indeed", status: "interview", appliedDate: shift(-9), nextAction: "Prepare STAR examples for interview", nextActionDate: shift(2), createdAt: now, updatedAt: now },
    { id: newId(), isExample: true, role: "Team Leader, Contact Centre", employer: "Harbour Insurance", location: "Bradford", source: "Reed", status: "applied", appliedDate: shift(-6), nextAction: "Email the recruiter for an update", nextActionDate: shift(-1), createdAt: now, updatedAt: now },
    { id: newId(), isExample: true, role: "Complaints Handler", employer: "Westmere Utilities (example)", location: "Hybrid", source: "Company website", status: "saved", closingDate: shift(2), nextAction: "Tailor CV and apply", createdAt: now, updatedAt: now },
  ];
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);
}

export function JobApplicationTracker() {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [today, setToday] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);
  const realJobCount = jobs.filter(job => !job.isExample).length;
  const completedRef = useRef(false);

  useEffect(() => {
    setToday(todayIso());
    try {
      const { jobs: stored, dropped } = parseTrackerState(window.localStorage.getItem(trackerStorageKey));
      setJobs(stored);
      const realStored = stored.filter(job => !job.isExample).length;
      if (realStored > 0 && !startedRef.current) {
        startedRef.current = true;
        trackFunnelEvent("tool_started", { tool, placement: "tracker_returning_use" });
      }
      if (realStored >= passOfferThreshold) completedRef.current = true;
      if (dropped) setNotice(`${dropped} saved entr${dropped === 1 ? "y" : "ies"} could not be read and ${dropped === 1 ? "was" : "were"} skipped.`);
    } catch {
      setStorageOk(false);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !storageOk) return;
    try {
      window.localStorage.setItem(trackerStorageKey, serializeTrackerState(jobs));
    } catch {
      setStorageOk(false);
    }
  }, [jobs, loaded, storageOk]);

  // Measure use without sending any job details: first job added, then 3+ jobs tracked.
  useEffect(() => {
    if (!loaded) return;
    if (realJobCount > 0 && !startedRef.current) {
      startedRef.current = true;
      trackFunnelEvent("tool_started", { tool, placement: analyticsPlacements.trackerJobAdded });
    }
    if (realJobCount >= passOfferThreshold && !completedRef.current) {
      completedRef.current = true;
      trackFunnelEvent("tool_completed", { tool, result: "success", placement: analyticsPlacements.trackerThreeJobs });
    }
  }, [realJobCount, loaded]);

  const sorted = useMemo(() => (today ? sortJobs(jobs, today) : jobs), [jobs, today]);
  const summary = useMemo(() => summarizeJobs(jobs, today || todayIso()), [jobs, today]);
  const closed = sorted.filter((job) => closedStatuses.includes(job.status));
  const listJobs = filter === "all" ? sorted : sorted.filter((job) => job.status === filter);

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const now = Date.now();
    const existing = draft.id ? jobs.find((job) => job.id === draft.id) : undefined;
    if (!existing && jobs.length >= maxTrackedJobs) {
      setFormError(`The tracker holds up to ${maxTrackedJobs} jobs. Export and delete old ones to add more.`);
      return;
    }
    const parsed = trackedJobSchema.safeParse({
      ...draft,
      isExample: existing?.isExample,
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      // Empty date inputs come back as "".
      appliedDate: draft.appliedDate || undefined,
      closingDate: draft.closingDate || undefined,
      nextActionDate: draft.nextActionDate || undefined,
    });
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path[0];
      setFormError(field === "role" || field === "employer" ? "Add the job title and employer." : "Check the highlighted details and try again.");
      return;
    }
    const job = cleanJob(parsed.data);
    setJobs((current) => (existing ? current.map((item) => (item.id === job.id ? job : item)) : [job, ...current]));
    setDraft(null);
    setFormError("");
  }

  function setStatus(id: string, status: JobStatus) {
    setJobs((current) =>
      current.map((job) =>
        job.id === id
          ? cleanJob({ ...job, status, appliedDate: job.appliedDate ?? (status !== "saved" ? todayIso() : undefined), updatedAt: Date.now() })
          : job,
      ),
    );
  }

  function removeJob(id: string) {
    const job = jobs.find((item) => item.id === id);
    if (job && window.confirm(`Delete "${job.role}" at ${job.employer}?`)) {
      setJobs((current) => current.filter((item) => item.id !== id));
      setDraft(null);
    }
  }

  function deleteAll() {
    if (window.confirm("Delete every job in this tracker? Export a copy first if you might need it.")) {
      setJobs([]);
      setNotice("All jobs deleted from this browser.");
    }
  }

  function exportCsv() {
    if (realJobCount > 0) trackFunnelEvent("tool_completed", { tool, result: "success", placement: "tracker_csv_export" });
    const blob = new Blob([jobsToCsv(sorted)], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `job-applications-${todayIso()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importCsv(file: File) {
    if (file.size > 2_000_000) {
      setNotice("That file is too large to import. Use a CSV under 2 MB.");
      return;
    }
    const result = csvToJobs(await file.text(), newId);
    if (result.error) {
      setNotice(result.error);
      return;
    }
    const { added, duplicates, overLimit } = mergeImportedJobs(jobs, result.jobs);
    setJobs((current) => [...added, ...current]);
    const notes = [
      duplicates ? `${duplicates} already in your tracker` : "",
      result.skipped ? `${result.skipped} missing a job title or employer` : "",
      overLimit ? `${overLimit} over the ${maxTrackedJobs}-job limit` : "",
    ].filter(Boolean);
    setNotice(`Imported ${added.length} job${added.length === 1 ? "" : "s"}.${notes.length ? ` Skipped: ${notes.join(", ")}.` : ""}`);
  }

  function printLog() {
    const rows = [...jobs]
      .sort((a, b) => (b.appliedDate ?? "").localeCompare(a.appliedDate ?? ""))
      .map((job) => `<tr><td>${escapeHtml(formatDate(job.appliedDate) || "Not applied")}</td><td>${escapeHtml(job.employer)}</td><td>${escapeHtml(job.role)}</td><td>${escapeHtml(job.source ?? "")}</td><td>${escapeHtml(statusLabel(job.status))}</td></tr>`)
      .join("");
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) {
      setNotice("Allow pop-ups for this site to print your log, or export to CSV instead.");
      return;
    }
    popup.document.write(`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Job search log</title><style>body{font-family:Arial,sans-serif;margin:32px;color:#1a1a1a}h1{font-size:20px}p{font-size:12px;color:#555}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f3f3f3}</style></head><body><h1>Job search log</h1><p>Printed ${escapeHtml(new Date().toLocaleDateString("en-GB"))} · ${jobs.length} job${jobs.length === 1 ? "" : "s"}</p><table><thead><tr><th>Date applied</th><th>Employer</th><th>Job title</th><th>Where found</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  // The editor copies the visitor's saved CV for this job (sign-in first if needed).
  function rememberForTailoring(job: TrackedJob) {
    const tailorJob = parseTailorJob({ role: job.role, employer: job.employer, advertText: job.advertText ?? "", source: "job-tracker" });
    if (!tailorJob) return;
    try {
      window.sessionStorage.setItem(jobTailorHandoffKey, serializeJobTailorHandoff(tailorJob));
    } catch {
      // The editor explains that the job details did not arrive.
    }
  }

  function rememberForPack(job: TrackedJob) {
    try {
      window.sessionStorage.setItem(jobPackPrefillKey, JSON.stringify(buildJobPackPrefill(job)));
    } catch {
      // The pack still opens; the visitor can paste the details.
    }
  }

  const card = (job: TrackedJob) => {
    const urgency = today ? jobUrgency(job, today) : null;
    return (
      <article key={job.id} className="rounded-lg border border-line bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="break-words font-bold leading-6 text-navy">{job.role}</h4>
            <p className="break-words text-sm text-muted">
              {job.employer}
              {job.location ? ` · ${job.location}` : ""}
            </p>
          </div>
          {isSafeHttpUrl(job.url) ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer nofollow" className="shrink-0 text-navy" aria-label={`Open the advert for ${job.role}`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
        {urgency ? (
          <p className={`mt-3 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-bold ${urgency.kind === "closing" ? "bg-gold-tint text-navy" : "bg-redsoft text-[#9b1c1c]"}`}>
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {urgency.label}
          </p>
        ) : null}
        {job.nextAction ? (
          <p className="mt-2 text-sm leading-6 text-ink">
            <span className="font-bold">Next:</span> {job.nextAction}
            {job.nextActionDate ? ` (${formatDate(job.nextActionDate)})` : ""}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-muted">
          {job.appliedDate ? `Applied ${formatDate(job.appliedDate)}` : job.closingDate ? `Closes ${formatDate(job.closingDate)}` : "Not applied yet"}
          {job.source ? ` · ${job.source}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`status-${job.id}`}>Status for {job.role}</label>
          <select
            id={`status-${job.id}`}
            value={job.status}
            onChange={(event) => setStatus(job.id, event.target.value as JobStatus)}
            className="min-h-9 rounded-md border border-line-strong bg-white px-2 text-sm font-bold text-navy"
          >
            {jobStatuses.map((status) => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
          <button type="button" onClick={() => { setDraft({ ...job }); setFormError(""); }} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-sm font-bold text-navy hover:bg-paper">
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
          </button>
        </div>
        {(job.status === "saved" || job.status === "applied" || job.status === "interview") && job.isExample ? (
          <TrackedLink
            href={packHref}
            placement="tracker_demo_tailor"
            onClick={() => rememberForPack(job)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-navy underline underline-offset-4"
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" /> Try the example application
          </TrackedLink>
        ) : job.status === "saved" || job.status === "applied" || job.status === "interview" ? (
          <div className="mt-3 flex flex-col items-start gap-1">
            <TrackedLink
              href={jobTailorEditorPath}
              placement={analyticsPlacements.trackerTailorJob}
              onClick={() => rememberForTailoring(job)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy underline underline-offset-4"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" /> Tailor my CV for this job
            </TrackedLink>
            <span className="text-xs leading-5 text-muted">
              {job.advertText && job.advertText.trim().length >= minAdvertLength ? "Copies your saved CV and checks it against this advert." : "Copies your saved CV. Add the advert text to check keywords."}{" "}
              <TrackedLink href={packHref} placement={analyticsPlacements.trackerApplicationPack} onClick={() => rememberForPack(job)} className="underline underline-offset-2">
                Or get a free application pack
              </TrackedLink>
            </span>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div>
      {!storageOk ? (
        <p className="mb-4 rounded-md border border-gold bg-gold-tint/50 p-3 text-sm text-navy" role="status">
          Your browser is blocking storage, so jobs will be lost when you close this page. Export to CSV to keep a copy.
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 flex items-start justify-between gap-3 rounded-md border border-line bg-paper p-3 text-sm text-navy" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Applied this week", summary.appliedThisWeek],
          ["Active applications", summary.active],
          ["Interviews", summary.interviews],
          ["Follow-ups due", summary.followUpsDue],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line bg-paper p-4">
            <p className="font-display text-3xl font-semibold text-navy">{loaded ? value : "–"}</p>
            <p className="mt-1 text-sm font-bold text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { setDraft({ ...emptyDraft, appliedDate: todayIso() }); setFormError(""); }}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add a job
        </button>
        <button type="button" onClick={exportCsv} disabled={!jobs.length} className={smallButton}>
          <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={smallButton}>
          <Upload className="h-4 w-4" aria-hidden="true" /> Import CSV
        </button>
        <button type="button" onClick={printLog} disabled={!jobs.length} className={smallButton}>
          <Printer className="h-4 w-4" aria-hidden="true" /> Print log
        </button>
        {jobs.length ? (
          <button type="button" onClick={deleteAll} className="inline-flex min-h-10 items-center gap-2 px-2 text-sm font-bold text-muted hover:text-navy">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete all
          </button>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importCsv(file);
            event.target.value = "";
          }}
        />
      </div>
      {jobs.some(job => job.isExample) ? <p className="mt-3 text-sm font-bold text-muted">These are fictional practice jobs. Use “Add a job” to track your own application.</p> : null}
      <p className="mt-3 text-sm text-muted">
        Saved only in this browser. Nothing is sent to WorkCV.{jobs.length >= 5 ? " Export a CSV now and then so you have a backup." : ""}
      </p>

      {realJobCount >= passOfferThreshold ? (
        <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gold bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <PassOfferView placement={analyticsPlacements.trackerPassOffer}><p className="font-display text-xl font-semibold text-navy">Keeping separate versions for your {realJobCount} tracked jobs?</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Keep separate saved CVs and letters with the Job Search Pass: new CVs for {site.passDays} days, {site.passPrice} once, never renews. Or keep editing one saved pair for {site.price} once.
            </p></PassOfferView>
          </div>
          <TrackedLink href={passHref} placement={analyticsPlacements.trackerPassOffer} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
            Start with the Job Search Pass
          </TrackedLink>
        </div>
      ) : null}

      {loaded && !jobs.length ? (
        <div className="mt-6 rounded-lg border border-dashed border-line-strong bg-paper p-8 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
          <p className="mt-3 font-display text-2xl font-semibold text-navy">No jobs tracked yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Add each job you apply for, or load three example jobs to see how follow-ups and closing dates appear.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => { setDraft({ ...emptyDraft, appliedDate: todayIso() }); setFormError(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white">
              <Plus className="h-4 w-4" aria-hidden="true" /> Add your first job
            </button>
            <button type="button" onClick={() => setJobs(exampleJobs(todayIso()))} className={smallButton}>
              Load an example
            </button>
          </div>
        </div>
      ) : null}

      {jobs.length ? (
        <>
          {/* Desktop board */}
          <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-4">
            {boardStatuses.map((status) => {
              const column = sorted.filter((job) => job.status === status);
              return (
                <section key={status} aria-label={`${statusLabel(status)} jobs`} className="rounded-lg bg-paper p-3">
                  <h3 className="flex items-center justify-between px-1 pb-3 text-sm font-bold uppercase tracking-[0.12em] text-navy">
                    {statusLabel(status)}
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-muted">{column.length}</span>
                  </h3>
                  <div className="space-y-3">{column.map(card)}</div>
                </section>
              );
            })}
          </div>
          {closed.length ? (
            <details className="mt-4 hidden rounded-lg border border-line p-4 lg:block">
              <summary className="cursor-pointer text-sm font-bold text-navy">Closed applications ({closed.length})</summary>
              <div className="mt-3 grid gap-3 lg:grid-cols-4">{closed.map(card)}</div>
            </details>
          ) : null}

          {/* Mobile list */}
          <div className="mt-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by status">
              {(["all", ...jobStatuses.map((status) => status.id)] as const).map((id) => {
                const count = id === "all" ? jobs.length : jobs.filter((job) => job.status === id).length;
                if (id !== "all" && !count) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold ${filter === id ? "border-navy bg-navy text-white" : "border-line-strong bg-white text-navy"}`}
                  >
                    {id === "all" ? "All" : statusLabel(id)} ({count})
                  </button>
                );
              })}
            </div>
            <div className="mt-3 space-y-3">{listJobs.map(card)}</div>
          </div>
        </>
      ) : null}

      {draft ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="job-form-title">
          <form onSubmit={saveDraft} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white p-5 shadow-soft sm:rounded-xl md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h3 id="job-form-title" className="font-display text-2xl font-semibold text-navy">{draft.id ? "Edit job" : "Add a job"}</h3>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close"><X className="h-5 w-5 text-navy" /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Job title *
                <input className={inputClass} value={draft.role} maxLength={120} required autoFocus onChange={(event) => setDraft({ ...draft, role: event.target.value })} />
              </label>
              <label className={labelClass}>Employer *
                <input className={inputClass} value={draft.employer} maxLength={120} required onChange={(event) => setDraft({ ...draft, employer: event.target.value })} />
              </label>
              <label className={labelClass}>Status
                <select className={inputClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as JobStatus })}>
                  {jobStatuses.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
                </select>
              </label>
              <label className={labelClass}>Where you found it
                <select className={inputClass} value={draft.source ?? ""} onChange={(event) => setDraft({ ...draft, source: event.target.value || undefined })}>
                  <option value="">Choose…</option>
                  {jobSources.map((source) => <option key={source} value={source}>{source}</option>)}
                </select>
              </label>
              <label className={labelClass}>Date applied
                <input type="date" className={inputClass} value={draft.appliedDate ?? ""} onChange={(event) => setDraft({ ...draft, appliedDate: event.target.value })} />
              </label>
              <label className={labelClass}>Closing date
                <input type="date" className={inputClass} value={draft.closingDate ?? ""} onChange={(event) => setDraft({ ...draft, closingDate: event.target.value })} />
              </label>
              <label className={labelClass}>Next action
                <input className={inputClass} value={draft.nextAction ?? ""} maxLength={160} placeholder="e.g. Chase the recruiter" onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })} />
              </label>
              <label className={labelClass}>Next action date
                <input type="date" className={inputClass} value={draft.nextActionDate ?? ""} onChange={(event) => setDraft({ ...draft, nextActionDate: event.target.value })} />
              </label>
              <label className={labelClass}>Location
                <input className={inputClass} value={draft.location ?? ""} maxLength={120} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </label>
              <label className={labelClass}>Salary
                <input className={inputClass} value={draft.salary ?? ""} maxLength={80} placeholder="e.g. £26,000" onChange={(event) => setDraft({ ...draft, salary: event.target.value })} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>Job advert link
                <input type="url" className={inputClass} value={draft.url ?? ""} maxLength={2000} placeholder="https://" onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
              </label>
              <label className={labelClass}>Contact
                <input className={inputClass} value={draft.contact ?? ""} maxLength={120} placeholder="Recruiter or hiring manager" onChange={(event) => setDraft({ ...draft, contact: event.target.value })} />
              </label>
              <label className={labelClass}>Notes
                <input className={inputClass} value={draft.notes ?? ""} maxLength={2000} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>Job advert text <span className="font-normal text-muted">(optional, used to tailor your CV)</span>
                <textarea className={`${inputClass} min-h-28 py-2`} value={draft.advertText ?? ""} maxLength={12_000} onChange={(event) => setDraft({ ...draft, advertText: event.target.value })} />
              </label>
            </div>
            {formError ? <p className="mt-4 text-sm font-bold text-[#9b1c1c]" role="alert">{formError}</p> : null}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button type="submit" className="inline-flex min-h-11 items-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover">Save job</button>
                <button type="button" onClick={() => setDraft(null)} className={smallButton}>Cancel</button>
              </div>
              {draft.id ? (
                <button type="button" onClick={() => removeJob(draft.id as string)} className="inline-flex items-center gap-1 text-sm font-bold text-[#9b1c1c]">
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete job
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
