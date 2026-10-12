"use client";

import Link from "next/link";
import { AlertTriangle, Check, ChevronDown, Download, FileText, Mail, Plus, Sparkles, Upload, X } from "lucide-react";

import { type StepId, stepForIssue } from "@/components/editor/steps";
import type { ReadinessIssue } from "@/lib/cv-readiness";
import type { CvEditorState } from "@/components/editor/use-cv-editor";
import { formatUkDate } from "@/components/editor/editor-modals";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { trackEditorEvent } from "@/lib/editor-events";
import { displayKeyword } from "@/lib/keyword-triage";
import { formatPence } from "@/lib/pass-upgrade";
import { site } from "@/lib/site";

const railHeading = "text-xs font-bold uppercase tracking-[0.08em] text-muted";
export const sideCard = "rounded-2xl border border-line bg-white";

export function ReadinessRing({ score, size = 56 }: { score: number; size?: number }) {
  const stroke = size >= 40 ? 6 : 3;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E2DB" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2D7D52"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(Math.max(score, 2) / 100) * circumference} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {size >= 40 && (
        <text x="50%" y="50%" dy="0.35em" textAnchor="middle" fontSize={score === 100 ? 13 : 15} fontWeight={800} fill="#0F2942">
          {score}%
        </text>
      )}
    </svg>
  );
}

export function readinessLabel(score: number, ready: boolean) {
  if (ready) return "Ready to send";
  if (score >= 80) return "Nearly ready";
  if (score >= 40) return "Getting there";
  return "Just started";
}

export function ReadinessCard({ editor, onGoTo }: { editor: CvEditorState; onGoTo: (step: StepId, roleId?: string) => void }) {
  const { readiness, aiLoading, runReadinessAction } = editor;
  const top = readiness.issues.slice(0, 1);
  return (
    <section aria-label="CV readiness" aria-live="polite" className={sideCard}>
      <div className="flex items-center gap-3.5 p-4">
        <ReadinessRing score={readiness.score} />
        <div>
          <p className="font-extrabold text-navy">{readinessLabel(readiness.score, readiness.ready)}</p>
          <p className="text-sm text-muted">
            {readiness.issues.length === 0
              ? "Nothing left to fix"
              : `${readiness.issues.length} ${readiness.issues.length === 1 ? "thing" : "things"} to ${readiness.fixCount ? "fix or improve" : "improve"}`}
          </p>
        </div>
      </div>
      {top.length > 0 && (
        <ul className="flex flex-col border-t border-line p-2">
          {top.map((issue) => (
            <li key={issue.id}>
              <button
                type="button"
                disabled={Boolean(aiLoading)}
                onClick={() => {
                  onGoTo(stepForIssue(issue), issue.targetId);
                  if (issue.action) runReadinessAction(issue);
                }}
                className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm leading-snug text-ink hover:bg-paper disabled:cursor-wait"
              >
                <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${issue.severity === "fix" ? "bg-red-700" : "bg-gold"}`} />
                <span className="min-w-0">
                  {issue.message}
                  {issue.action && (
                    <span className="ml-1 inline-flex items-center gap-1 font-bold text-navy">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {issue.action === "improve-profile" ? "Suggest" : issue.action === "improve-bullets" ? "Suggest" : "Suggest skills"}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function EntryList({
  heading,
  items,
  selectedId,
  onSelect,
  onAdd,
  addLabel,
}: {
  heading: string;
  items: Array<{ id: string; title: string; detail: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <section className={`flex flex-col gap-1 p-2 ${sideCard}`}>
      <h2 className={`${railHeading} px-2 pb-1 pt-2`}>{heading}</h2>
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-left ${active ? "border-navy bg-paper" : "border-transparent hover:bg-paper"}`}
          >
            <span className={`font-bold ${active ? "text-navy" : "text-ink"}`}>{item.title}</span>
            {item.detail && <span className="text-[0.8125rem] text-muted">{item.detail}</span>}
          </button>
        );
      })}
      <button type="button" onClick={onAdd} className="flex min-h-11 items-center gap-2 px-3 font-bold text-navy hover:underline">
        <Plus className="h-4 w-4" aria-hidden="true" />{addLabel}
      </button>
    </section>
  );
}

export function TailorCard({ editor, onOpenAdvert }: { editor: CvEditorState; onOpenAdvert: () => void }) {
  const { cv, progress } = editor;
  if (!cv.targeting) {
    return (
      <section className={`flex flex-col gap-2 p-4 ${sideCard}`}>
        <h2 className={railHeading}>Applying for a specific job?</h2>
        <p className="text-sm leading-relaxed text-muted">Paste the advert and WorkCV points out what the employer asks for as you write.</p>
        <button type="button" onClick={onOpenAdvert} className="mt-1 inline-flex min-h-10 w-fit items-center gap-1.5 rounded-lg border border-navy px-3 text-sm font-bold text-navy hover:bg-paper">
          Add the job advert
        </button>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-1.5 rounded-2xl border border-green-200 bg-greensoft p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-green-800">Tailored to</p>
      <p className="font-extrabold text-navy">{cv.targeting.role || cv.targetRole || "This job"}</p>
      {progress && (
        <p className="text-sm text-ink">
          {progress.keywords.found} of {progress.keywords.total} advert keywords on your CV
        </p>
      )}
      <button type="button" onClick={onOpenAdvert} className="mt-1 w-fit text-sm font-bold text-navy underline underline-offset-4">
        Change the advert
      </button>
    </section>
  );
}

export function AdvertWords({ editor }: { editor: CvEditorState }) {
  const { keywordTriage } = editor;
  if (!keywordTriage) return null;
  const onCv = keywordTriage.found.slice(0, 8);
  const missing = keywordTriage.queue.slice(0, 6);
  if (!onCv.length && !missing.length) return null;
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-green-200 bg-greensoft p-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-green-800">Words from the advert</h2>
      <p className="text-sm leading-relaxed text-muted">Use the ones that are true for you. Ticked words are already on your CV.</p>
      <ul className="flex flex-wrap gap-1.5">
        {onCv.map((keyword) => (
          <li key={keyword.term} className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-green-200 bg-white px-2.5 text-[0.8125rem] font-bold text-green-800">
            <Check className="h-3 w-3" aria-hidden="true" />{displayKeyword(keyword.term)}
          </li>
        ))}
        {missing.map((keyword) => (
          <li key={keyword.term} className="inline-flex min-h-[30px] items-center rounded-full border border-line-strong bg-white px-2.5 text-[0.8125rem] font-bold text-navy">
            {displayKeyword(keyword.term)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ImportCard({ onImport }: { onImport: () => void }) {
  return (
    <section className="flex flex-col gap-3">
      <div className={`flex flex-col gap-2.5 p-4 ${sideCard}`}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-tint text-navy"><Upload className="h-4 w-4" aria-hidden="true" /></span>
        <p className="font-extrabold text-navy">Already have a CV?</p>
        <p className="text-sm leading-relaxed text-muted">Import a PDF or Word file and WorkCV fills in every step for you to check.</p>
        <button type="button" onClick={onImport} className="min-h-11 rounded-lg border border-navy text-sm font-bold text-navy hover:bg-paper">Import my CV</button>
      </div>
    </section>
  );
}

function Notice({ tone = "info", children, onDismiss, actions }: { tone?: "info" | "success" | "warning" | "error"; children: React.ReactNode; onDismiss?: () => void; actions?: React.ReactNode }) {
  const tones = {
    info: "border-sky-200 bg-[#edf4f8]",
    success: "border-green-200 bg-greensoft",
    warning: "border-gold bg-gold-tint",
    error: "border-red-200 bg-redsoft",
  };
  return (
    <div className={`flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${tones[tone]}`} aria-live="polite">
      <div className="min-w-0 leading-relaxed text-navy">{children}</div>
      {(actions || onDismiss) && (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {onDismiss && (
            <button type="button" onClick={onDismiss} aria-label="Dismiss this message" className="grid h-9 w-9 place-items-center rounded-lg text-navy hover:bg-white/70">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const noticeButton = "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold";

// Messages that used to stack above the editor now sit at the top of the form column.
export function EditorNotices({ editor }: { editor: CvEditorState }) {
  const {
    cv,
    paymentState,
    upgradeOffer,
    passStatus,
    draftId,
    checkoutLoading,
    checkoutPlan,
    checkoutError,
    pdfUnlocked,
    reviewOpen,
    recoveryCv,
    otherTabUpdated,
    aiError,
    aiLoading,
    jobTailor,
    jobTailorError,
    showJobTailorPassOffer,
    fitImportState,
    fitImportError,
    toolHandoffState,
    toolHandoffError,
    setCv,
    setRecoveryCv,
    setAiError,
    setPaymentState,
    setForceNewCheckout,
    setCheckoutPlan,
    setReviewOpen,
    setJobTailor,
    setJobTailorError,
    setCheckoutError,
    startCheckout,
    checkPaymentAgain,
  } = editor;
  const notices: React.ReactNode[] = [];

  if (paymentState) {
    const tone = paymentState === "paid" ? "success" : paymentState === "failed" || paymentState === "cancelled" ? "error" : "warning";
    notices.push(
      <Notice
        key="payment"
        tone={tone}
        actions={
          <>
            {paymentState === "paid" && upgradeOffer?.eligible && !passStatus?.active && (
              <button type="button" onClick={() => { trackEditorEvent("upgrade_offer_clicked", draftId, { placement: "payment_confirmed" }); setCheckoutPlan("pass"); setReviewOpen(true); }} className={`${noticeButton} bg-navy text-white`}>
                Upgrade for {formatPence(upgradeOffer.priceMinor)}
              </button>
            )}
            {paymentState === "pending" && (
              <button type="button" onClick={() => void checkPaymentAgain()} className={`${noticeButton} border border-line-strong bg-white text-navy`}>Check again</button>
            )}
            {(paymentState === "failed" || paymentState === "cancelled") && (
              <button
                type="button"
                disabled={checkoutLoading}
                onClick={() => { setPaymentState(null); setForceNewCheckout(true); trackEditorEvent("checkout_opened", draftId, { retry: true, plan: checkoutPlan }); void startCheckout(cv.email, checkoutPlan); }}
                className={`${noticeButton} bg-navy text-white disabled:cursor-wait disabled:opacity-60`}
              >
                {checkoutLoading ? "Opening checkout..." : "Return to checkout"}
              </button>
            )}
          </>
        }
      >
        <p className="font-bold">
          {paymentState === "paid"
            ? "Payment confirmed — your CV and cover letter downloads are ready."
            : paymentState === "cancelled"
              ? "Checkout was cancelled. Your CV is still saved."
              : paymentState === "failed"
                ? "Payment was not completed. No PDF access was charged."
                : "Confirming your payment…"}
        </p>
        {(paymentState === "checking" || paymentState === "pending") && <p className="text-muted">This can take a few seconds after checkout. Do not start another payment.</p>}
        {paymentState === "paid" && upgradeOffer?.eligible && !passStatus?.active && (
          <p>
            Applying for more jobs? Upgrade to the Job Search Pass for <strong>{formatPence(upgradeOffer.priceMinor)}</strong>: your {formatPence(upgradeOffer.creditMinor)} counts. Unlimited CVs and cover letters for {site.passDays} days, until {formatUkDate(upgradeOffer.endsAt)}.
          </p>
        )}
      </Notice>,
    );
  }

  if (pdfUnlocked && checkoutError && !reviewOpen) {
    notices.push(<Notice key="download-error" tone="error" onDismiss={() => setCheckoutError(null)}><p className="font-bold">{checkoutError}</p></Notice>);
  }

  if (recoveryCv || otherTabUpdated) {
    notices.push(
      <Notice
        key="recovery"
        tone="info"
        actions={
          <>
            {recoveryCv && <button type="button" onClick={() => { setCv(recoveryCv); setRecoveryCv(null); }} className={`${noticeButton} bg-navy text-white`}>Restore edits</button>}
            <button type="button" onClick={() => { if (otherTabUpdated) window.location.reload(); else setRecoveryCv(null); }} className={`${noticeButton} border border-line-strong bg-white text-navy`}>
              {otherTabUpdated ? "Reload latest" : "Keep account version"}
            </button>
          </>
        }
      >
        <p className="font-bold">{recoveryCv ? "We recovered newer edits from this browser." : "This CV is open and changing in another tab."}</p>
        <p className="text-muted">{recoveryCv ? "Restore them, or keep the version loaded from your account." : "Reload the latest version before continuing here to avoid competing edits."}</p>
      </Notice>,
    );
  }

  if (aiLoading) {
    notices.push(
      <Notice key="ai-loading" tone="warning">
        <p className="flex items-center gap-3 font-bold">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/20 border-t-navy" aria-hidden="true" />
          Preparing fact-checked {aiLoading === "profile" ? "profile versions" : aiLoading === "bullet" ? "bullet rewrites" : "bullet suggestions"}...
        </p>
      </Notice>,
    );
  }
  if (aiError) notices.push(<Notice key="ai-error" tone="error" onDismiss={() => setAiError(null)}><p className="font-bold">{aiError}</p></Notice>);

  if (jobTailorError) {
    notices.push(<Notice key="job-tailor-error" tone="error" onDismiss={() => setJobTailorError(null)}><p className="flex items-start gap-2 font-bold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{jobTailorError}</p></Notice>);
  } else if (jobTailor) {
    notices.push(
      <Notice
        key="job-tailor"
        tone="info"
        onDismiss={() => { setJobTailor(null); setJobTailorError(null); }}
        actions={showJobTailorPassOffer ? (
          <button type="button" onClick={() => { trackEditorEvent("pass_offer_clicked", draftId, { placement: "job_tailor" }); setCheckoutPlan("pass"); setReviewOpen(true); }} className={`${noticeButton} bg-navy text-white`}>
            Compare download options
          </button>
        ) : undefined}
      >
        <p className="font-bold">
          {jobTailor.mode === "copied" ? "A separate CV for " : "Your CV is set up for "}
          {[jobTailor.role, jobTailor.employer].filter(Boolean).join(" at ") || "this job"}.
        </p>
        <p className="text-muted">
          {jobTailor.mode === "copied" ? <>Your original CV is unchanged; both are in <Link href="/my-cvs" className="font-bold text-navy underline underline-offset-4">My CVs</Link>. </> : null}
          {jobTailor.hasAdvert ? "Work through the advert keywords in the Experience step, adding only what you have really done." : "Paste the job advert to see which keywords it asks for."}
        </p>
        {jobTailor.mode === "copied" && passStatus?.active ? <p className="font-bold text-success">Included in your Job Search Pass · {passStatus.daysLeft} {passStatus.daysLeft === 1 ? "day" : "days"} left.</p> : null}
        {showJobTailorPassOffer ? (
          <p className="text-ink">
            Applying for more than one job? The <strong>Job Search Pass</strong> covers every CV and letter you make for {site.passDays} days: <strong>{upgradeOffer?.eligible ? formatPence(upgradeOffer.priceMinor) : site.passPrice} once</strong>, never renews. Or download just this CV for {site.price}.
          </p>
        ) : null}
      </Notice>,
    );
  }

  if (fitImportState === "importing") notices.push(<Notice key="fit-importing" tone="info"><p className="flex items-center gap-3 font-bold"><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/25 border-t-navy" aria-hidden="true" />Turning your assessed CV into editable fields...</p></Notice>);
  if (toolHandoffState === "importing") notices.push(<Notice key="tool-importing" tone="info"><p className="flex items-center gap-3 font-bold"><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/25 border-t-navy" aria-hidden="true" />Adding and saving your tool result...</p></Notice>);
  if (fitImportError) notices.push(<Notice key="fit-error" tone="error"><p className="flex items-start gap-2 font-bold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{fitImportError}</p></Notice>);
  if (toolHandoffError) notices.push(<Notice key="tool-error" tone="error"><p className="flex items-start gap-2 font-bold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{toolHandoffError}</p></Notice>);
  if (toolHandoffState === "complete" && !toolHandoffError) {
    notices.push(<Notice key="tool-complete" tone="success"><p className="font-bold">Your tool result is saved. {cv.coverLetter ? "Your letter is ready in the Cover letter step. Review it and finish your CV before downloading." : "Review the imported details before using your CV."}</p></Notice>);
  }

  if (!notices.length) return null;
  return <div className="flex flex-col gap-3">{notices}</div>;
}

const menuItem = "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60";
const closeMenu = (event: React.MouseEvent<HTMLElement>) => event.currentTarget.closest("details")?.removeAttribute("open");

/** The Finish page's download control: a menu of the four files once the CV is unlocked,
 * otherwise one button that opens checkout. */
export function DownloadMenu({ editor, onWriteLetter }: { editor: CvEditorState; onWriteLetter: () => void }) {
  const { cv, pdfUnlocked, paymentState, checkoutLoading, pdfDownloading, docxDownloading, letterDownloading, startDownload, downloadDocx, downloadCoverLetter } = editor;
  const confirming = paymentState === "checking" || paymentState === "pending";
  if (!pdfUnlocked) {
    return (
      <button type="button" onClick={startDownload} disabled={checkoutLoading || confirming} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60">
        <Download className="h-4 w-4" aria-hidden="true" />
        {confirming ? "Confirming payment…" : `Download · ${site.price}`}
      </button>
    );
  }
  const busy = pdfDownloading || docxDownloading || letterDownloading !== null;
  return (
    <details className="relative">
      <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover [&::-webkit-details-marker]:hidden">
        <Download className="h-4 w-4" aria-hidden="true" />
        {busy ? "Preparing…" : "Download"}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-soft">
        <button type="button" disabled={pdfDownloading} onClick={(event) => { closeMenu(event); startDownload(); }} className={menuItem}><Download className="h-4 w-4" aria-hidden="true" />CV as PDF</button>
        <button type="button" disabled={docxDownloading} onClick={(event) => { closeMenu(event); void downloadDocx(); }} className={menuItem}><FileText className="h-4 w-4" aria-hidden="true" />CV as Word</button>
        {hasCoverLetterContent(cv) ? (
          <>
            <button type="button" disabled={letterDownloading !== null} onClick={(event) => { closeMenu(event); void downloadCoverLetter("pdf"); }} className={menuItem}><Download className="h-4 w-4" aria-hidden="true" />Cover letter as PDF</button>
            <button type="button" disabled={letterDownloading !== null} onClick={(event) => { closeMenu(event); void downloadCoverLetter("docx"); }} className={menuItem}><FileText className="h-4 w-4" aria-hidden="true" />Cover letter as Word</button>
          </>
        ) : (
          <button type="button" onClick={(event) => { closeMenu(event); onWriteLetter(); }} className={menuItem}><Mail className="h-4 w-4" aria-hidden="true" />Write your cover letter</button>
        )}
      </div>
    </details>
  );
}

/** The Finish page's side panel when nothing is being edited: readiness and what to fix next. */
export function FinishPanel({ editor, onFix }: { editor: CvEditorState; onFix: (issue: ReadinessIssue) => void }) {
  const { readiness, pdfUnlocked, passStatus, draftId, setCheckoutPlan, setReviewOpen } = editor;
  const shown = readiness.issues.slice(0, 4);
  return (
    <>
      <section aria-label="CV readiness" className={`${sideCard} p-4`}>
        <div className="flex items-center gap-3.5">
          <ReadinessRing score={readiness.score} />
          <div>
            <p className="font-extrabold text-navy">{readinessLabel(readiness.score, readiness.ready)}</p>
            <p className="text-sm text-muted">
              {readiness.issues.length === 0
                ? "Nothing left to fix"
                : `${readiness.issues.length} ${readiness.issues.length === 1 ? "thing" : "things"} to ${readiness.fixCount ? "fix or improve" : "improve"}`}
            </p>
          </div>
        </div>
        {shown.length > 0 ? (
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {shown.map((issue) => (
              <li key={issue.id} className="flex items-start justify-between gap-3 py-2.5">
                <span className="min-w-0 text-sm leading-snug text-ink">
                  <span className={`mr-1.5 rounded px-1.5 py-0.5 text-[11px] font-bold uppercase ${issue.severity === "fix" ? "bg-red-100 text-red-800" : "bg-gold-tint text-navy"}`}>{issue.severity === "fix" ? "Fix" : "Improve"}</span>
                  {issue.message}
                </span>
                <button type="button" onClick={() => onFix(issue)} className="inline-flex min-h-8 shrink-0 items-center rounded-lg border border-line-strong bg-white px-2.5 text-xs font-bold text-navy hover:bg-paper">
                  Fix
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 border-t border-line pt-3 text-sm text-muted">Check each page, then download. Click any part of the page to change it.</p>
        )}
        {readiness.issues.length > shown.length && <p className="pt-1 text-xs text-muted">And {readiness.issues.length - shown.length} more after these.</p>}
      </section>
      {!pdfUnlocked && !passStatus?.active && (
        <section className={`${sideCard} p-4`}>
          <p className="text-sm font-bold text-navy">Applying for lots of jobs?</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">The Job Search Pass unlocks every CV and cover letter you make for {site.passDays} days, for {site.passPrice} once. Nothing renews.</p>
          <button
            type="button"
            onClick={() => { trackEditorEvent("pass_offer_clicked", draftId, { placement: "finish_step" }); setCheckoutPlan("pass"); setReviewOpen(true); }}
            className="mt-2 text-sm font-bold text-navy underline underline-offset-4"
          >
            Get the Job Search Pass · {site.passPrice}
          </button>
        </section>
      )}
    </>
  );
}
