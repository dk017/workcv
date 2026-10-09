"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Copy, Download, FileSearch, Mail, MoreHorizontal, PenLine, Plus, Search, ShieldCheck, Trash2, Upload, Wand2 } from "lucide-react";

import { DocumentThumbnail } from "@/components/app/document-thumbnail";
import type { CvData } from "@/lib/editor-data";

export type DashboardCv = {
  id: string;
  title: string;
  templateName: string;
  paid: boolean;
  tailored: boolean;
  hasLetter: boolean;
  letterTitle: string;
  score: number;
  nextIssue: string | null;
  nextStep: string;
  edited: string;
  editedAt: string;
  data: CvData;
};

const editorHref = (id: string, step?: string) => `/editor?draftId=${encodeURIComponent(id)}${step ? `&step=${step}` : ""}`;
const badge = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold";

function Badges({ cv }: { cv: DashboardCv }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {cv.tailored && <span className={`${badge} bg-greensoft text-green-800`}>Tailored to a job</span>}
      {cv.paid ? <span className={`${badge} bg-gold-tint text-navy`}>Unlocked</span> : <span className={`${badge} bg-sand text-muted`}>Draft · {cv.score}% ready</span>}
    </span>
  );
}

function ContinueCard({ cv }: { cv: DashboardCv }) {
  return (
    <section aria-labelledby="continue-heading" className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:p-6">
      <Link href={editorHref(cv.id)} className="hidden shrink-0 sm:block" tabIndex={-1} aria-hidden="true">
        <DocumentThumbnail cv={cv.data} width={150} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-success">Continue where you left off</p>
        <h2 id="continue-heading" className="text-2xl font-extrabold leading-tight text-navy">{cv.title}</h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Badges cv={cv} />
          <span className="text-sm text-muted">Edited {cv.edited}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand" role="progressbar" aria-label="CV readiness" aria-valuenow={cv.score} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-success" style={{ width: `${Math.max(cv.score, 2)}%` }} />
          </div>
          <span className="text-sm font-bold text-navy">{cv.score}% ready</span>
        </div>
        <p className="text-[0.9375rem] leading-relaxed text-ink">
          {cv.nextIssue ? <><span className="font-bold">Next:</span> {cv.nextIssue}</> : cv.paid ? "Nothing left to fix. Download it again whenever you need to." : "Nothing left to fix. It’s ready to download."}
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          <Link href={editorHref(cv.id, cv.nextIssue ? cv.nextStep : undefined)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 font-bold text-white hover:bg-navy-hover">
            {cv.nextIssue ? "Continue editing" : "Open CV"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href={editorHref(cv.id, "finish")} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong bg-white px-4 font-bold text-navy hover:bg-paper">
            <Download className="h-4 w-4" aria-hidden="true" />{cv.paid ? "Download" : "Finish and download"}
          </Link>
        </div>
      </div>
    </section>
  );
}

const quickActions = [
  { href: "/tailor", title: "Tailor a CV to a job", detail: "Paste an advert and get a separate copy for it", icon: Wand2 },
  { href: "/tools/ats-score-checker", title: "Check a CV against an advert", detail: "See which of the advert’s keywords it covers", icon: FileSearch },
  { href: "/tools/uk-visa-sponsor-checker", title: "Check a sponsor licence", detail: "Search the Home Office register of sponsors", icon: ShieldCheck },
] as const;

function QuickActions() {
  return (
    <section aria-labelledby="quick-actions" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 id="quick-actions" className="text-[0.9375rem] font-bold text-navy">Quick actions</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {quickActions.map(({ href, title, detail, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex items-start gap-3 rounded-xl bg-paper px-3.5 py-3 hover:bg-sand">
              <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-navy" aria-hidden="true" />
              <span>
                <span className="block font-bold text-navy">{title}</span>
                <span className="block text-[0.8125rem] text-muted">{detail}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CardMenu({ cv, kind, onDuplicate, onDelete, busy }: { cv: DashboardCv; kind: "cv" | "letter"; onDuplicate: () => void; onDelete: () => void; busy: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  const item = "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:opacity-60";
  return (
    <details ref={ref} className="relative">
      <summary aria-label={`Actions for ${cv.title}`} className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg text-navy hover:bg-paper [&::-webkit-details-marker]:hidden">
        <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-line bg-white p-1 shadow-soft">
        <Link href={editorHref(cv.id, kind === "letter" ? "letter" : undefined)} className={item}><PenLine className="h-4 w-4" aria-hidden="true" />{kind === "letter" ? "Edit letter" : "Edit CV"}</Link>
        {kind === "cv" && <Link href={editorHref(cv.id, "letter")} className={item}><Mail className="h-4 w-4" aria-hidden="true" />{cv.hasLetter ? "Edit cover letter" : "Write cover letter"}</Link>}
        <Link href={editorHref(cv.id, "finish")} className={item}><Download className="h-4 w-4" aria-hidden="true" />{cv.paid ? "Download" : "Finish and download"}</Link>
        <button type="button" disabled={busy} onClick={() => { close(); onDuplicate(); }} className={item}><Copy className="h-4 w-4" aria-hidden="true" />Duplicate for another job</button>
        <button type="button" disabled={busy} onClick={() => { close(); onDelete(); }} className={`${item} text-[#8d3030]`}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete CV</button>
      </div>
    </details>
  );
}

function DocumentCard({ cv, kind, onDuplicate, onDelete, busy }: { cv: DashboardCv; kind: "cv" | "letter"; onDuplicate: () => void; onDelete: () => void; busy: boolean }) {
  const href = editorHref(cv.id, kind === "letter" ? "letter" : undefined);
  const title = kind === "letter" ? cv.letterTitle : cv.title;
  return (
    <article data-document-card className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white hover:border-line-strong">
      <div className="flex justify-center bg-sand px-4 pt-5">
        <DocumentThumbnail cv={cv.data} kind={kind} width={168} />
      </div>
      <div className="flex items-start gap-2 border-t border-line p-4">
        <div className="min-w-0 flex-1">
          <h3 data-card-title className="font-bold leading-snug text-navy">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline">{title}</Link>
          </h3>
          <p className="mt-1 text-[0.8125rem] text-muted">{kind === "letter" ? `For ${cv.title}` : `${cv.templateName} · edited ${cv.edited}`}</p>
          {kind === "cv" && <div className="mt-2"><Badges cv={cv} /></div>}
        </div>
        <div className="relative z-10"><CardMenu cv={cv} kind={kind} onDuplicate={onDuplicate} onDelete={onDelete} busy={busy} /></div>
      </div>
    </article>
  );
}

function DeleteDialog({ cv, deleting, error, onCancel, onConfirm }: { cv: DashboardCv; deleting: boolean; error: string | null; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onCancelRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <h2 id="delete-title" className="text-xl font-extrabold text-navy">Delete this CV?</h2>
        <p className="mt-2 font-bold text-ink">{cv.title}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          The CV and its cover letter are deleted for good. This can’t be undone.
          {cv.paid && " You paid to unlock this CV, so you won’t be able to download it again."}
        </p>
        {error && <p role="alert" className="mt-3 text-sm font-bold text-[#8d3030]">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-4 font-bold text-navy hover:bg-paper">Keep it</button>
          <button type="button" onClick={onConfirm} disabled={deleting} className="inline-flex min-h-11 items-center rounded-lg bg-[#8d3030] px-4 font-bold text-white disabled:opacity-60">{deleting ? "Deleting…" : "Delete CV"}</button>
        </div>
      </div>
    </div>
  );
}

function FirstCv() {
  const options = [
    { href: "/editor?new=1", title: "Start from scratch", detail: "We guide you through each section, one step at a time.", icon: PenLine },
    { href: "/editor?new=1&import=1", title: "Upload your current CV", detail: "Bring in a Word (.docx) or PDF CV and check it section by section.", icon: Upload },
    { href: "/cv-examples-uk", title: "Start from an example", detail: "Pick a UK example for your kind of job and make it yours.", icon: FileSearch },
  ] as const;
  return (
    <section aria-labelledby="first-cv" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 id="first-cv" className="text-2xl font-extrabold text-navy">Let’s make your first CV</h2>
      <p className="mt-2 text-muted">Your CVs and cover letters are saved here as you write them.</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {options.map(({ href, title, detail, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex h-full flex-col gap-2 rounded-xl border border-line p-5 hover:border-navy">
              <Icon className="h-6 w-6 text-navy" aria-hidden="true" />
              <span className="font-bold text-navy">{title}</span>
              <span className="text-sm leading-relaxed text-muted">{detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Dashboard({ heading, today, documents }: { heading: string; today: string; documents: DashboardCv[] }) {
  const router = useRouter();
  const view = useSearchParams().get("view") === "letters" ? "letters" : "cvs";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"edited" | "name">("edited");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DashboardCv | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const letters = documents.filter((cv) => cv.hasLetter);
  const source = view === "letters" ? letters : documents;
  const needle = query.trim().toLowerCase();
  const shown = source
    .filter((cv) => !needle || `${cv.title} ${cv.letterTitle} ${cv.data.fullName}`.toLowerCase().includes(needle))
    .sort((a, b) => (sort === "name" ? a.title.localeCompare(b.title, "en-GB") : b.editedAt.localeCompare(a.editedAt)));

  const setView = (next: "cvs" | "letters") => router.replace(next === "letters" ? "/my-cvs?view=letters" : "/my-cvs", { scroll: false });

  const duplicate = async (cv: DashboardCv) => {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/cv/new", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ copyFrom: cv.id }) });
      const data = (await response.json().catch(() => null)) as { document?: { id: string } } | null;
      if (!response.ok || !data?.document) throw new Error();
      window.location.href = editorHref(data.document.id);
    } catch {
      setNotice("That CV couldn’t be copied. Check your connection and try again.");
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/cv/current?documentId=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      if (!response.ok && response.status !== 404) throw new Error();
      setNotice(`Deleted “${deleting.title}”.`);
      setDeleting(null);
      router.refresh();
    } catch {
      setDeleteError("It couldn’t be deleted. Check your connection and try again.");
    } finally {
      setDeleteBusy(false);
    }
  };

  const tab = (id: "cvs" | "letters", label: string) => (
    <button type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)} className={`min-h-10 rounded-lg px-4 text-sm ${view === id ? "bg-white font-bold text-navy shadow-[0_1px_3px_rgba(15,41,66,0.15)]" : "font-semibold text-muted hover:text-navy"}`}>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted">{today}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{heading}</h1>
      </div>

      {documents.length === 0 ? (
        <FirstCv />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <ContinueCard cv={documents[0]} />
          <QuickActions />
        </div>
      )}

      {notice && <p role="status" className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-navy">{notice}</p>}

      {documents.length > 0 && (
        <section aria-labelledby="documents-heading" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="documents-heading" className="mr-2 text-2xl font-extrabold text-navy">My documents</h2>
            <div role="tablist" aria-label="Document type" className="flex rounded-[10px] bg-sand p-[3px]">
              {tab("cvs", `CVs (${documents.length})`)}
              {tab("letters", `Cover letters (${letters.length})`)}
            </div>
            <span className="flex-1" />
            <label className="relative flex min-w-0 flex-1 sm:max-w-[260px]">
              <span className="sr-only">Search your documents</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by job or name" className="min-h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint" />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-muted">
              Sort
              <select value={sort} onChange={(event) => setSort(event.target.value as "edited" | "name")} className="min-h-10 rounded-lg border border-line-strong bg-white px-2.5 text-sm font-bold text-navy">
                <option value="edited">Last edited</option>
                <option value="name">Job title (A–Z)</option>
              </select>
            </label>
          </div>

          <div role="tabpanel" aria-label={view === "letters" ? "Cover letters" : "CVs"} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {view === "cvs" && !needle && (
              <Link href="/editor?new=1" className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong p-6 text-center hover:border-navy hover:bg-white">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-tint text-navy"><Plus className="h-6 w-6" aria-hidden="true" /></span>
                <span className="font-bold text-navy">Create a new CV</span>
                <span className="text-sm text-muted">Start blank, or upload a CV you already have</span>
              </Link>
            )}
            {shown.map((cv) => (
              <DocumentCard key={cv.id} cv={cv} kind={view === "letters" ? "letter" : "cv"} busy={busy} onDuplicate={() => void duplicate(cv)} onDelete={() => { setDeleteError(null); setDeleting(cv); }} />
            ))}
          </div>
          {shown.length === 0 && (
            <p className="rounded-xl border border-dashed border-line-strong bg-white px-5 py-6 text-center text-muted">
              {needle ? `Nothing matches “${query.trim()}”.` : "You haven’t written a cover letter yet. Open a CV and go to its Cover letter step: every CV comes with a matching letter."}
            </p>
          )}
        </section>
      )}

      {deleting && <DeleteDialog cv={deleting} deleting={deleteBusy} error={deleteError} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} />}
    </div>
  );
}
