"use client";

import Link from "next/link";
import { AlertTriangle, Briefcase, Copy, Download, FileText, GraduationCap, LayoutTemplate, Mail, MoreHorizontal, Plus, Sparkles, Undo2, Upload, User, X } from "lucide-react";
import { emptyEducation, emptyExperience, lines } from "@/lib/editor-data";
import { site } from "@/lib/site";
import { formatPence } from "@/lib/pass-upgrade";
import { addSkillLine, addSkippedKeyword } from "@/lib/keyword-triage";
import { vacancyTargeting } from "@/lib/job-tailor";
import { KeywordTriagePanel } from "@/components/editor/keyword-triage";
import { trackEditorEvent } from "@/lib/editor-events";
import { MemoCvDocument } from "@/components/editor/cv-document";
import { CvStructureForm, ApplicationPackReview } from "@/components/editor/cv-structure-form";
import { CoverLetterForm } from "@/components/editor/cover-letter-form";
import { PurposeSurvey } from "@/components/editor/purpose-survey";
import { CoverLetterDocument } from "@/components/editor/cover-letter-document";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { EducationForm, ExperienceForm, ProfileForm, SkillsForm, TemplateForm } from "@/components/editor/editor-forms";
import { AiReviewModal, CheckoutSheet, ImportCvModal, TemplatePickerModal, formatUkDate } from "@/components/editor/editor-modals";
import { useCvEditor, type TabId } from "@/components/editor/use-cv-editor";

export { CvDocument } from "@/components/editor/cv-document";

const tabs: Array<{ id: TabId; label: string; icon: typeof User }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "template", label: "Template", icon: LayoutTemplate },
  { id: "cover-letter", label: "Cover letter", icon: Mail },
];

export function CvEditor() {
  const {
    cv,
    setCv,
    activeTab,
    setActiveTab,
    saveSnapshot,
    pdfUnlocked,
    draftId,
    checkoutError,
    setCheckoutError,
    checkoutLoading,
    pdfDownloading,
    docxDownloading,
    letterDownloading,
    purposeSurveyOpen,
    setPurposeSurveyOpen,
    paymentState,
    setPaymentState,
    passStatus,
    upgradeOffer,
    checkoutPlan,
    setCheckoutPlan,
    setForceNewCheckout,
    templatePickerOpen,
    setTemplatePickerOpen,
    importOpen,
    setImportOpen,
    reviewOpen,
    setReviewOpen,
    undoLabel,
    loaded,
    recoveryCv,
    setRecoveryCv,
    otherTabUpdated,
    aiLoading,
    aiError,
    setAiError,
    aiReview,
    setAiReview,
    tailoringOpen,
    setTailoringOpen,
    jobDescriptionDraft,
    setJobDescriptionDraft,
    creatingNew,
    previewPageCount,
    mobileView,
    setMobileView,
    fitImportState,
    fitImportError,
    toolHandoffState,
    toolHandoffError,
    jobTailor,
    setJobTailor,
    jobTailorError,
    setJobTailorError,
    previewRef,
    saveManagerRef,
    undoRef,
    showJobTailorPassOffer,
    readiness,
    updateField,
    updateExperience,
    cvEvidenceText,
    improveProfile,
    improveBullets,
    rewriteBullet,
    keywordTriage,
    vaguePhrases,
    progress,
    openRequirements,
    setSkippedKeywords,
    markRequirementAnswered,
    rewriteVaguePhrase,
    suggestSkills,
    runReadinessAction,
    updateEducation,
    removeExperienceWithUndo,
    removeEducationWithUndo,
    moveEntry,
    resetDraft,
    startDownload,
    downloadDocx,
    downloadCoverLetter,
    continueFromReview,
    startCheckout,
    applyImportedCv,
    saveLabel,
    checkPaymentAgain,
    selectedTemplate,
    fitTargeting,
    prioritiesAreActions,
    visiblePriorities,
  } = useCvEditor();

  return (
    <div className="print-page bg-paper">
      <section className="editor-chrome border-b border-line bg-surface">
        <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-4 py-4 sm:w-[min(1540px,calc(100%-48px))] lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              CV editor
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-navy">
              Build your UK CV.
            </h1>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/my-cvs"
              onClick={(event) => {
                if (!saveManagerRef.current?.hasUnsavedChanges()) return;
                event.preventDefault();
                void saveManagerRef.current.flush().then((saved) => {
                  if (saved) window.location.href = "/my-cvs";
                });
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper sm:min-h-10 sm:w-auto sm:px-4"
            >
              My CVs
            </Link>
            <div
              className={`order-2 col-span-2 rounded-md border px-4 py-2 text-sm sm:order-none ${
                saveSnapshot.status === "error"
                  ? "border-red-200 bg-redsoft font-bold text-[#8d3030]"
                  : "border-line bg-paper text-muted"
              } flex min-h-11 w-full items-center justify-center text-center sm:min-h-0 sm:w-auto`}
              aria-live="polite"
            >
              {saveLabel}
              {saveSnapshot.status === "error" && (
                <button
                  type="button"
                  onClick={() => {
                    if (saveSnapshot.errorKind === "conflict") {
                      window.location.reload();
                      return;
                    }
                    void saveManagerRef.current?.retry();
                  }}
                  className="ml-2 underline"
                >
                  {saveSnapshot.errorKind === "conflict" ? "Reload latest" : "Retry"}
                </button>
                )}
            </div>
            <details className="relative order-1 sm:order-none">
              <summary className="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper sm:min-h-10 sm:w-auto sm:px-4 [&::-webkit-details-marker]:hidden">
                <MoreHorizontal className="h-4 w-4" />
                More
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-md border border-line bg-white p-1 shadow-soft">
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    trackEditorEvent("template_chooser_opened", draftId);
                    setTemplatePickerOpen(true);
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Template: {selectedTemplate?.name ?? "Choose"}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    setJobDescriptionDraft(cv.targeting?.jobDescription || "");
                    setTailoringOpen(true);
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper"
                >
                  <Sparkles className="h-4 w-4" />
                  Tailor to job
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    setImportOpen(true);
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper"
                >
                  <Upload className="h-4 w-4" />
                  Import CV
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    resetDraft();
                  }}
                  disabled={creatingNew}
                  className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {creatingNew ? "Creating..." : "New CV"}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    if (draftId) void resetDraft(draftId);
                  }}
                  disabled={creatingNew || !draftId}
                  className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate for another job
                </button>
              </div>
            </details>
            {passStatus?.active && (
              <span className="order-2 col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-gold bg-gold-tint px-3 text-xs font-bold text-navy sm:order-none sm:col-span-1" title="Every CV you create before your Job Search Pass ends is unlocked.">
                Job Search Pass · {passStatus.daysLeft} {passStatus.daysLeft === 1 ? "day" : "days"} left
              </span>
            )}
            {pdfUnlocked ? (
              <details className="relative order-3 col-span-2 sm:order-none">
                <summary className="inline-flex min-h-12 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover sm:min-h-10 sm:w-auto [&::-webkit-details-marker]:hidden">
                  <Download className="h-4 w-4" />
                  {pdfDownloading || docxDownloading || letterDownloading ? "Preparing…" : "Download"}
                </summary>
                <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-md border border-line bg-white p-1 shadow-soft">
                  <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">CV</p>
                  <button type="button" disabled={pdfDownloading} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); startDownload(); }} className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60">
                    <Download className="h-4 w-4" /> CV as PDF
                  </button>
                  <button type="button" disabled={docxDownloading} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); void downloadDocx(); }} className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60">
                    <FileText className="h-4 w-4" /> CV as Word
                  </button>
                  <p className="border-t border-line px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">Cover letter</p>
                  {hasCoverLetterContent(cv) ? (
                    <>
                      <button type="button" disabled={letterDownloading !== null} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); void downloadCoverLetter("pdf"); }} className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60">
                        <Download className="h-4 w-4" /> Cover letter as PDF
                      </button>
                      <button type="button" disabled={letterDownloading !== null} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); void downloadCoverLetter("docx"); }} className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60">
                        <FileText className="h-4 w-4" /> Cover letter as Word
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); setActiveTab("cover-letter"); setMobileView("edit"); }} className="flex min-h-11 w-full items-center gap-3 rounded px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60">
                      <Mail className="h-4 w-4" /> Write your cover letter
                    </button>
                  )}
                </div>
              </details>
            ) : (
              <button
                type="button"
                onClick={startDownload}
                disabled={checkoutLoading || paymentState === "checking" || paymentState === "pending"}
                className="order-3 col-span-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60 sm:order-none sm:min-h-10 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                {paymentState === "checking" || paymentState === "pending"
                  ? "Confirming payment…"
                  : `Download · ${site.price} once`}
              </button>
            )}
          </div>
        </div>
      </section>

      {purposeSurveyOpen && (
        <PurposeSurvey
          onPurpose={(purpose) => trackEditorEvent("cv_purpose_selected", draftId, { purpose })}
          onVolume={(volume) => trackEditorEvent("cv_application_volume_selected", draftId, { volume })}
          onMissingFeature={(feature) => trackEditorEvent("cv_missing_feature_selected", draftId, { feature })}
          passOfferAvailable={!passStatus?.active}
          onPassOfferShown={() => trackEditorEvent("pass_offer_shown", draftId, { placement: "post_download" })}
          onPassOffer={() => {
            trackEditorEvent("pass_offer_clicked", draftId, { placement: "post_download" });
            setCheckoutPlan("pass");
            setReviewOpen(true);
          }}
          onClose={(answered) => {
            if (!answered) trackEditorEvent("cv_purpose_dismissed", draftId);
            setPurposeSurveyOpen(false);
          }}
        />
      )}

      {pdfUnlocked && checkoutError && !reviewOpen && (
        <div className="editor-chrome border-b border-red-200 bg-redsoft" role="alert">
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center justify-between gap-4 py-3 text-sm font-bold text-navy sm:w-[min(1540px,calc(100%-48px))]">
            <p>{checkoutError}</p>
            <button type="button" onClick={() => setCheckoutError(null)} aria-label="Dismiss download error" className="rounded p-1 hover:bg-white"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {loaded && readiness.score === 0 && (
        <section className="editor-chrome border-b border-line bg-gold-tint">
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-4 py-4 sm:w-[min(1540px,calc(100%-48px))] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-bold text-navy">Choose the quickest way to begin</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Import an existing CV, or start with the clean UK structure below.
                You can preview every page before paying.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => setImportOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white">
                <Upload className="h-4 w-4" /> Import existing CV
              </button>
              <button type="button" onClick={() => setActiveTab("profile")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy">
                Start with a clean CV
              </button>
            </div>
          </div>
        </section>
      )}

      {loaded && readiness.score > 0 && (
        <section className={`editor-chrome border-b border-line ${readiness.ready && !(openRequirements > 0 && !pdfUnlocked) ? "bg-greensoft" : "bg-surface"}`} aria-live="polite">
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center justify-between gap-4 py-3 sm:w-[min(1540px,calc(100%-48px))]">
            <div>
              <p className="text-sm font-bold text-navy">
                {readiness.ready
                  ? pdfUnlocked
                    ? "Your CV is unlocked."
                    : openRequirements > 0
                      ? `Your CV is complete, but ${openRequirements} advert requirement${openRequirements === 1 ? " still isn't" : "s still aren't"} evidenced.`
                      : "Your CV is ready to preview."
                  : `CV readiness: ${readiness.score}%`}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {readiness.ready
                  ? pdfUnlocked
                    ? "Use Download for your CV and cover letter as PDF or Word. Edits are included at no extra cost."
                    : openRequirements > 0
                      ? "Answer them in the vacancy panel below, or skip the ones that do not apply. You can preview and unlock at any time."
                      : `Review the pages, then unlock this CV and its cover letter as PDF and Word for ${site.price} once.`
                  : readiness.issues[0]?.message || "Continue adding your real experience."}
              </p>
            </div>
            {!readiness.ready && readiness.nextSection && (
              <button type="button" onClick={() => setActiveTab(readiness.nextSection!)} className="min-h-10 shrink-0 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy">
                Continue
              </button>
            )}
          </div>
          {readiness.issues.length > 1 && (
            <details className="mx-auto w-[min(1540px,calc(100%-32px))] pb-3 sm:w-[min(1540px,calc(100%-48px))]">
              <summary className="cursor-pointer text-xs font-bold text-navy">
                Show all {readiness.issues.length} things to {readiness.fixCount ? "fix or improve" : "improve"}
              </summary>
              <ul className="mt-2 grid gap-2">
                {readiness.issues.map((issue) => (
                  <li key={issue.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-white px-3 py-2">
                    <span className="flex min-w-0 items-start gap-2 text-sm text-ink">
                      <span className={`mt-0.5 shrink-0 rounded px-1.5 text-[11px] font-bold uppercase ${issue.severity === "fix" ? "bg-red-100 text-red-800" : "bg-gold-tint text-navy"}`}>{issue.severity === "fix" ? "Fix" : "Improve"}</span>
                      {issue.message}
                    </span>
                    <button type="button" disabled={Boolean(aiLoading)} onClick={() => runReadinessAction(issue)} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-line-strong bg-white px-3 text-xs font-bold text-navy disabled:cursor-wait disabled:opacity-60">
                      {issue.action && <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                      {issue.action === "improve-profile" ? "Suggest profile" : issue.action === "improve-bullets" ? "Suggest bullets" : issue.action === "suggest-skills" ? "Suggest skills" : "Go to section"}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}

      {tailoringOpen && (
        <section className="editor-chrome border-b border-line bg-[#edf4f8]">
          <div className="mx-auto grid w-[min(1540px,calc(100%-32px))] gap-4 py-5 sm:w-[min(1540px,calc(100%-48px))] lg:grid-cols-[1fr_auto] lg:items-end">
            <label className="block"><span className="text-sm font-bold text-navy">Job description</span><span className="mt-1 block text-xs leading-5 text-muted">Paste the duties and essential criteria. Suggestions only use claims already supported by your CV.</span><textarea value={jobDescriptionDraft} onChange={(event) => setJobDescriptionDraft(event.target.value)} maxLength={5000} rows={5} className="mt-2 w-full rounded-md border border-line bg-white px-3 py-3 text-sm leading-6 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint" placeholder="Paste the vacancy here..." /></label>
            <div className="flex gap-2"><button type="button" onClick={() => setTailoringOpen(false)} className="min-h-11 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy">Cancel</button><button type="button" onClick={() => {
              if (jobDescriptionDraft.trim().length < 80) { setAiError("Paste at least 80 characters from the vacancy."); return; }
              const analysis = vacancyTargeting(cv.targetRole, jobDescriptionDraft, cvEvidenceText());
              setCv((current) => ({ ...current, targeting: { ...analysis.targeting, role: current.targetRole } }));
              setTailoringOpen(false); setAiError(null); trackEditorEvent("job_tailoring_saved", draftId, { score: analysis.score, missing: analysis.missing });
            }} className="min-h-11 rounded-md bg-navy px-4 text-sm font-bold text-white">Analyse vacancy</button></div>
          </div>
        </section>
      )}

      {aiError && (
        <section className="editor-chrome border-b border-red-200 bg-redsoft" aria-live="polite"><div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center justify-between gap-4 py-3 sm:w-[min(1540px,calc(100%-48px))]"><p className="text-sm font-bold text-navy">{aiError}</p><button type="button" onClick={() => setAiError(null)} aria-label="Dismiss message" className="text-navy"><X className="h-5 w-5" /></button></div></section>
      )}
      {aiLoading && (
        <section className="editor-chrome border-b border-line bg-gold-tint" aria-live="polite"><div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center gap-3 py-3 sm:w-[min(1540px,calc(100%-48px))]"><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/20 border-t-navy" /><p className="text-sm font-bold text-navy">Preparing fact-checked {aiLoading === "profile" ? "profile versions" : aiLoading === "bullet" ? "bullet rewrites" : "bullet suggestions"}...</p></div></section>
      )}

      {(recoveryCv || otherTabUpdated) && (
        <section className="editor-chrome border-b border-line bg-[#edf4f8]" aria-live="polite">
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-3 py-4 sm:w-[min(1540px,calc(100%-48px))] sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-bold text-navy">{recoveryCv ? "We recovered newer edits from this browser." : "This CV is open and changing in another tab."}</p><p className="mt-1 text-sm text-muted">{recoveryCv ? "Restore them, or keep the version loaded from your account." : "Reload the latest version before continuing here to avoid competing edits."}</p></div>
            <div className="flex gap-2">
              {recoveryCv && <button type="button" onClick={() => { setCv(recoveryCv); setRecoveryCv(null); }} className="min-h-10 rounded-md bg-navy px-4 text-sm font-bold text-white">Restore edits</button>}
              <button type="button" onClick={() => { if (otherTabUpdated) window.location.reload(); else setRecoveryCv(null); }} className="min-h-10 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy">{otherTabUpdated ? "Reload latest" : "Keep account version"}</button>
            </div>
          </div>
        </section>
      )}

      {paymentState && (
        <section
          className={`editor-chrome border-b border-line ${
            paymentState === "paid"
              ? "bg-greensoft"
              : paymentState === "failed" || paymentState === "cancelled"
                ? "bg-redsoft"
                : "bg-gold-tint"
          }`}
          aria-live="polite"
        >
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-3 py-4 sm:w-[min(1540px,calc(100%-48px))] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-navy">
                {paymentState === "paid"
                  ? "Payment confirmed — your CV and cover letter downloads are ready."
                  : paymentState === "cancelled"
                    ? "Checkout was cancelled. Your CV is still saved."
                    : paymentState === "failed"
                      ? "Payment was not completed. No PDF access was charged."
                      : "Confirming your payment…"}
              </p>
              {(paymentState === "checking" || paymentState === "pending") && (
                <p className="mt-1 text-sm text-muted">
                  This can take a few seconds after checkout. Do not start another payment.
                </p>
              )}
              {paymentState === "paid" && upgradeOffer?.eligible && !passStatus?.active && (
                <p className="mt-1 text-sm leading-6 text-navy">
                  Applying for more jobs? Upgrade to the Job Search Pass for{" "}
                  <strong>{formatPence(upgradeOffer.priceMinor)}</strong>: your{" "}
                  {formatPence(upgradeOffer.creditMinor)} counts. Unlimited CVs and cover letters for {site.passDays} days,
                  until {formatUkDate(upgradeOffer.endsAt)}.
                </p>
              )}
            </div>
            {paymentState === "paid" && upgradeOffer?.eligible && !passStatus?.active && (
              <button
                type="button"
                onClick={() => {
                  trackEditorEvent("upgrade_offer_clicked", draftId, { placement: "payment_confirmed" });
                  setCheckoutPlan("pass");
                  setReviewOpen(true);
                }}
                className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white"
              >
                Upgrade for {formatPence(upgradeOffer.priceMinor)}
              </button>
            )}
            {paymentState === "pending" && (
              <button
                type="button"
                onClick={() => void checkPaymentAgain()}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy"
              >
                Check again
              </button>
            )}
            {(paymentState === "failed" || paymentState === "cancelled") && (
              <button
                type="button"
                onClick={() => {
                  setPaymentState(null);
                  setForceNewCheckout(true);
                  trackEditorEvent("checkout_opened", draftId, { retry: true, plan: checkoutPlan });
                  void startCheckout(cv.email, checkoutPlan);
                }}
                disabled={checkoutLoading}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {checkoutLoading ? "Opening checkout..." : "Return to checkout"}
              </button>
            )}
          </div>
        </section>
      )}

      {(jobTailor || jobTailorError) && (
        <section className="editor-chrome border-b border-line bg-white" aria-live="polite">
          <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-start justify-between gap-4 py-4 sm:w-[min(1540px,calc(100%-48px))]">
            {jobTailorError ? (
              <p className="flex items-start gap-3 text-sm font-bold leading-6 text-[#8d3030]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {jobTailorError}
              </p>
            ) : jobTailor ? (
              <div className="grid flex-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="text-sm leading-6">
                  <p className="font-bold text-navy">
                    {jobTailor.mode === "copied" ? "A separate CV for " : "Your CV is set up for "}
                    {[jobTailor.role, jobTailor.employer].filter(Boolean).join(" at ") || "this job"}.
                  </p>
                  <p className="text-muted">
                    {jobTailor.mode === "copied" ? (
                      <>Your original CV is unchanged; both are in <Link href="/my-cvs" className="font-bold text-navy underline underline-offset-4">My CVs</Link>. </>
                    ) : null}
                    {jobTailor.hasAdvert
                      ? "Work through the advert keywords below, adding only what you have really done."
                      : "Paste the job advert below to see which keywords it asks for."}
                  </p>
                  {jobTailor.mode === "copied" && passStatus?.active ? (
                    <p className="mt-1 font-bold text-success">Included in your Job Search Pass · {passStatus.daysLeft} {passStatus.daysLeft === 1 ? "day" : "days"} left.</p>
                  ) : null}
                  {showJobTailorPassOffer ? (
                    <p className="mt-1 text-ink">
                      Applying for more than one job? The <strong>Job Search Pass</strong> covers every CV and letter you make for {site.passDays} days:{" "}
                      <strong>{upgradeOffer?.eligible ? formatPence(upgradeOffer.priceMinor) : site.passPrice} once</strong>, never renews. Or download just this CV for {site.price}.
                    </p>
                  ) : null}
                </div>
                {showJobTailorPassOffer ? (
                  <button
                    type="button"
                    onClick={() => {
                      trackEditorEvent("pass_offer_clicked", draftId, { placement: "job_tailor" });
                      setCheckoutPlan("pass");
                      setReviewOpen(true);
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
                  >
                    Compare download options
                  </button>
                ) : null}
              </div>
            ) : null}
            <button type="button" onClick={() => { setJobTailor(null); setJobTailorError(null); }} aria-label="Dismiss this message" className="shrink-0 rounded p-1 text-muted hover:bg-paper hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {(fitTargeting || fitImportState === "importing" || fitImportError || toolHandoffState !== "idle" || toolHandoffError) && (
        <section className="editor-chrome border-b border-line bg-[#edf4f8]">
          <div className="mx-auto w-[min(1540px,calc(100%-32px))] py-5 sm:w-[min(1540px,calc(100%-48px))]">
            {fitImportState === "importing" ? (
              <div className="flex items-center gap-3 text-sm font-bold text-navy">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/25 border-t-navy" />
                Turning your assessed CV into editable fields...
              </div>
            ) : toolHandoffState === "importing" ? (
              <div className="flex items-center gap-3 text-sm font-bold text-navy">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/25 border-t-navy" />
                Adding and saving your tool result...
              </div>
            ) : fitImportError ? (
              <div className="flex items-start gap-3 text-sm font-bold leading-6 text-[#8d3030]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                {fitImportError}
              </div>
            ) : toolHandoffError ? (
              <div className="flex items-start gap-3 text-sm font-bold leading-6 text-[#8d3030]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                {toolHandoffError}
              </div>
            ) : fitTargeting ? (
              <div className="grid gap-5 xl:grid-cols-[240px_1fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                    Target vacancy
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-navy">
                    {fitTargeting.role}
                  </p>
                </div>
                {!prioritiesAreActions && visiblePriorities.length > 0 && <div className="grid gap-4 md:grid-cols-3">
                  {visiblePriorities.map((priority, index) => (
                    <div key={`${priority.category}-${priority.title}`}>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-success">
                        Fix {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-bold text-navy">{priority.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{priority.action}</p>
                    </div>
                  ))}
                </div>}
                {prioritiesAreActions && fitTargeting.priorities.length > 0 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-xs font-bold text-navy">The checker&apos;s top {fitTargeting.priorities.length} fixes (answered below)</summary>
                    <ol className="mt-2 grid gap-2 md:grid-cols-3">
                      {fitTargeting.priorities.map((priority) => (
                        <li key={`${priority.category}-${priority.title}`}>
                          <p className="text-sm font-bold text-navy">{priority.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted">{priority.action}</p>
                        </li>
                      ))}
                    </ol>
                  </details>
                )}
              </div>
            ) : null}
            {keywordTriage && !fitImportError && !toolHandoffError && fitImportState !== "importing" && toolHandoffState !== "importing" && (
              <KeywordTriagePanel
                triage={keywordTriage}
                phrases={vaguePhrases}
                progress={progress!}
                experience={cv.experience}
                busy={Boolean(aiLoading)}
                onAddSkill={(term) => { updateField("skills", addSkillLine(cv.skills, term)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skills" }); }}
                onSkipKeyword={(term) => { setSkippedKeywords((current) => addSkippedKeyword(current, term)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skip" }); }}
                onSkipRequirement={(requirement) => { setSkippedKeywords((current) => addSkippedKeyword(current, requirement)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skip_requirement" }); }}
                onResetSkipped={() => setSkippedKeywords(() => [])}
                onRewritePhrase={rewriteVaguePhrase}
                onDraftBullet={({ roleId, note, keyword, requirement }) => {
                  const role = cv.experience.find((item) => item.id === roleId);
                  trackEditorEvent("keyword_triage_answered", draftId, { answer: requirement ? "requirement_bullet" : "bullet" });
                  void rewriteBullet(roleId, role ? role.bullets.split("\n").length : 0, [], { text: note, keyword, requirement });
                }}
              />
            )}
            {toolHandoffState === "complete" && !toolHandoffError ? <p role="status" className="mt-3 text-sm font-bold text-navy">Your tool result is saved. {cv.coverLetter ? "Your letter is ready in the Cover letter tab. Review it and finish your CV before downloading." : "Review the imported details before using your CV."}</p> : null}
          </div>
        </section>
      )}

      <div className="editor-chrome mx-auto mt-4 flex w-[min(1540px,calc(100%-32px))] rounded-md border border-line bg-white p-1 sm:w-[min(1540px,calc(100%-48px))] lg:hidden" role="group" aria-label="Editor view"><button type="button" onClick={() => { setMobileView("edit"); trackEditorEvent("mobile_view_changed", draftId, { view: "edit" }); }} className={`min-h-10 flex-1 rounded px-3 text-sm font-bold ${mobileView === "edit" ? "bg-navy text-white" : "text-muted"}`}>Edit CV</button><button type="button" onClick={() => { setMobileView("preview"); trackEditorEvent("mobile_view_changed", draftId, { view: "preview" }); }} className={`min-h-10 flex-1 rounded px-3 text-sm font-bold ${mobileView === "preview" ? "bg-navy text-white" : "text-muted"}`}>Preview</button></div>
      <section className="mx-auto grid w-[min(1540px,calc(100%-32px))] gap-6 py-6 sm:w-[min(1540px,calc(100%-48px))] lg:grid-cols-[minmax(480px,0.92fr)_minmax(0,1.08fr)] xl:grid-cols-[minmax(560px,0.95fr)_minmax(0,1.15fr)]">
        <div className={`editor-form min-w-0 ${mobileView === "preview" ? "hidden lg:block" : "block"}`}>
          <div className="sticky top-20 space-y-5">
            <div className="rounded-xl border border-line bg-white p-2">
              <div className="grid grid-cols-3 gap-2 2xl:grid-cols-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        if (tab.id === "cover-letter" && activeTab !== "cover-letter") trackEditorEvent("cover_letter_opened", draftId);
                        setActiveTab(tab.id);
                      }}
                      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold ${
                        active
                          ? "bg-navy text-white"
                          : "text-muted hover:bg-paper hover:text-navy"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-5 shadow-sm xl:p-6">
              {activeTab === "profile" && (
                <ProfileForm cv={cv} updateField={updateField} onImproveProfile={() => void improveProfile()} assistanceBusy={Boolean(aiLoading)} />
              )}
              {activeTab === "experience" && (
                <ExperienceForm
                  cv={cv}
                  updateExperience={updateExperience}
                  addExperience={() =>
                    setCv((current) => ({
                      ...current,
                      experience: [...current.experience, emptyExperience()],
                    }))
                  }
                  removeExperience={(id) =>
                    removeExperienceWithUndo(id)
                  }
                  moveExperience={(index, direction) =>
                    moveEntry("experience", index, direction)
                  }
                  onImproveBullets={(id) => void improveBullets(id)}
                  onRewriteBullet={(id, index) => void rewriteBullet(id, index)}
                  assistanceBusy={Boolean(aiLoading)}
                />
              )}
              {activeTab === "education" && (
                <EducationForm
                  cv={cv}
                  updateEducation={updateEducation}
                  addEducation={() =>
                    setCv((current) => ({
                      ...current,
                      education: [...current.education, emptyEducation()],
                    }))
                  }
                  removeEducation={(id) =>
                    removeEducationWithUndo(id)
                  }
                  moveEducation={(index, direction) =>
                    moveEntry("education", index, direction)
                  }
                />
              )}
              {activeTab === "skills" && (
                <SkillsForm cv={cv} updateField={updateField} onSuggestSkills={suggestSkills} assistanceBusy={Boolean(aiLoading)} />
              )}
              {activeTab === "template" && (
                <><TemplateForm cv={cv} updateField={updateField} /><CvStructureForm cv={cv} onChange={setCv} /></>
              )}
              {activeTab === "experience" && <ApplicationPackReview cv={cv} onChange={setCv} />}
              {activeTab === "cover-letter" && (
                <CoverLetterForm
                  cv={cv}
                  onChange={setCv}
                  onEvent={(eventName) => trackEditorEvent(eventName, draftId)}
                  downloadUnlocked={pdfUnlocked}
                  downloading={letterDownloading}
                  onDownload={(format) => void downloadCoverLetter(format)}
                />
              )}
            </div>
          </div>
        </div>

        <div className={`print-area min-w-0 ${mobileView === "edit" ? "hidden lg:block" : "block"}`}>
          {activeTab !== "cover-letter" && previewPageCount > 2 && (
            <div className="editor-chrome mb-4 flex flex-col gap-3 rounded-md border border-gold bg-gold-tint p-4 sm:flex-row sm:items-center sm:justify-between" role="status"><div><p className="text-sm font-bold text-navy">Your CV is about {previewPageCount} pages.</p><p className="mt-1 text-xs leading-5 text-muted">Most UK applicants should aim for two pages. Remove older detail or use the Compact template before downloading.</p></div>{cv.template !== "compact" && <button type="button" onClick={() => updateField("template", "compact")} className="min-h-10 shrink-0 rounded-md bg-navy px-4 text-sm font-bold text-white">Use Compact</button>}</div>
          )}
          <div className="cv-preview-viewport rounded-md border border-line bg-[#eef6f3] p-2">
            <div ref={previewRef} className="cv-preview-scale relative">
              {activeTab === "cover-letter" ? <CoverLetterDocument cv={cv} /> : <MemoCvDocument cv={cv} />}
            </div>
          </div>
        </div>
      </section>
      {templatePickerOpen && (
        <TemplatePickerModal
          cv={cv}
          onClose={() => setTemplatePickerOpen(false)}
          onSelect={(templateId) => {
            updateField("template", templateId);
            trackEditorEvent("template_selected", draftId, {
              template: templateId,
            });
            setTemplatePickerOpen(false);
          }}
        />
      )}
      {importOpen && (
        <ImportCvModal
          template={cv.template}
          hasPopulatedCv={readiness.score > 0}
          onClose={() => setImportOpen(false)}
          onApply={applyImportedCv}
          onEvent={(event) => trackEditorEvent(event, draftId)}
        />
      )}
      {reviewOpen && (
        <CheckoutSheet
          issues={readiness.issues
            .filter((issue) => issue.severity === "fix")
            .map((issue) => issue.message)}
          checkoutError={checkoutError}
          checkoutLoading={checkoutLoading}
          onClose={() => setReviewOpen(false)}
          onContinue={continueFromReview}
          plan={checkoutPlan}
          passAvailable={!passStatus?.active}
          cvAvailable={!pdfUnlocked}
          upgrade={upgradeOffer?.eligible ? upgradeOffer : null}
          onPlanChange={(plan) => {
            setCheckoutPlan(plan);
            try { window.sessionStorage.setItem("workcv-plan-intent", plan); } catch { /* Optional persistence. */ }
            trackEditorEvent("checkout_plan_selected", draftId, { plan });
          }}
          onConsentAccepted={() =>
            trackEditorEvent("checkout_consent_accepted", draftId)
          }
        />
      )}
      {aiReview && (
        <AiReviewModal key={`${aiReview.kind}-${aiReview.options[0]?.value ?? ""}`} review={aiReview} retrying={Boolean(aiLoading)} onRetry={aiReview.kind === "bullet" && aiReview.targetId && aiReview.bulletIndex !== undefined ? () => void rewriteBullet(aiReview.targetId!, aiReview.bulletIndex!, aiReview.options.map((option) => option.value), aiReview.keyword || aiReview.requirement ? { text: aiReview.original, keyword: aiReview.keyword, requirement: aiReview.requirement } : undefined) : undefined} onClose={() => {
          trackEditorEvent("ai_suggestion_rejected", draftId, { section: aiReview.kind });
          setAiReview(null);
        }} onApply={(values) => {
          if (aiReview.kind === "profile") updateField("profile", values[0] || aiReview.original);
          if (aiReview.kind === "bullets" && aiReview.targetId) updateExperience(aiReview.targetId, "bullets", values.join("\n"));
          if (aiReview.kind === "bullet" && aiReview.targetId && aiReview.bulletIndex !== undefined && values[0]) {
            const item = cv.experience.find((entry) => entry.id === aiReview.targetId);
            if (item && (aiReview.keyword || aiReview.requirement)) {
              updateExperience(item.id, "bullets", [...item.bullets.split("\n").filter((line) => line.trim()), values[0]].join("\n"));
              if (aiReview.requirement) markRequirementAnswered(aiReview.requirement);
            }
            else if (item) { const next = item.bullets.split("\n"); next[aiReview.bulletIndex] = values[0]; updateExperience(item.id, "bullets", next.join("\n")); }
          }
          if (aiReview.kind === "skills") updateField("skills", Array.from(new Set([...lines(cv.skills), ...values])).join("\n"));
          trackEditorEvent("ai_suggestion_applied", draftId, { section: aiReview.kind, count: values.length }); setAiReview(null);
        }} />
      )}
      {undoLabel && (
        <div
          className="editor-chrome fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-md bg-navy px-4 py-3 text-sm font-bold text-white shadow-soft"
          role="status"
        >
          {undoLabel}
          <button
            type="button"
            onClick={() => undoRef.current?.()}
            className="inline-flex items-center gap-1 underline"
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
