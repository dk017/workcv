"use client";

import { useState } from "react";
import { Check, Download, Sparkles, Upload, X } from "lucide-react";
import { CvData, TemplateId, lines, templates } from "@/lib/editor-data";
import { site } from "@/lib/site";
import { formatPence } from "@/lib/pass-upgrade";
import { useAccessibleDialog } from "@/components/editor/use-accessible-dialog";
import { MemoCvDocument } from "@/components/editor/cv-document";

export type AiReview = {
  kind: "profile" | "bullets" | "bullet" | "skills";
  title: string;
  targetId?: string;
  bulletIndex?: number;
  /** Set when drafting a new bullet for an advert keyword; the result is appended. */
  keyword?: string;
  /** Set when the bullet answers an advert requirement from the checker; applying it marks that answered. */
  requirement?: string;
  original: string;
  options: Array<{ label: string; value: string }>;
  questions?: string[];
};

export function AiReviewModal({ review, onClose, onApply, onRetry, retrying = false }: { review: AiReview; onClose: () => void; onApply: (values: string[]) => void; onRetry?: () => void; retrying?: boolean }) {
  const singleChoice = review.kind === "profile" || review.kind === "bullet";
  const [selected, setSelected] = useState<number[]>(review.kind === "profile" ? [0] : []);
  const dialogRef = useAccessibleDialog(onClose);
  const toggle = (index: number) => setSelected((current) => singleChoice ? [index] : current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/50 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="ai-review-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-success">Fact-safe suggestion</p><h2 id="ai-review-title" className="mt-1 font-display text-3xl font-semibold text-navy">{review.title}</h2><p className="mt-2 text-sm leading-6 text-muted">Compare before applying. WorkCV will never apply AI text without your confirmation.</p></div><button type="button" onClick={onClose} aria-label="Close suggestions" className="rounded border border-line p-2 text-muted hover:text-navy"><X className="h-5 w-5" /></button></div>
        {review.original && <div className="mt-5 rounded-md border border-line bg-paper p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{review.keyword || review.requirement ? "Your note" : "Current text"}</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{review.original}</p></div>}
        <fieldset className="mt-5 space-y-3"><legend className="text-sm font-bold text-navy">{singleChoice ? "Choose one version" : "Select only accurate suggestions"}</legend>{review.options.map((option, index) => <label key={`${option.label}-${index}`} className={`flex cursor-pointer gap-3 rounded-md border p-4 ${selected.includes(index) ? "border-navy bg-greensoft" : "border-line bg-white"}`}><input type={singleChoice ? "radio" : "checkbox"} name="ai-option" checked={selected.includes(index)} onChange={() => toggle(index)} className="mt-1 h-4 w-4 accent-navy" /><span><strong className="text-sm text-navy">{option.label}</strong><span className="mt-1 block text-sm leading-6 text-ink">{option.value}</span></span></label>)}</fieldset>
        {review.questions?.length ? <div className="mt-5 rounded-md border border-gold bg-gold-tint p-4"><p className="text-sm font-bold text-navy">Evidence that would strengthen this section</p><ul className="mt-2 space-y-1 text-sm leading-6 text-muted">{review.questions.map((question) => <li key={question}>{question}</li>)}</ul></div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={onClose} className="min-h-11 rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy">Keep current text</button>{onRetry && <button type="button" disabled={retrying} onClick={onRetry} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy disabled:cursor-wait disabled:opacity-60"><Sparkles className="h-4 w-4" aria-hidden="true" />{retrying ? "Trying again…" : "Try again"}</button>}<button type="button" disabled={!selected.length} onClick={() => onApply(selected.map((index) => review.options[index].value))} className="min-h-11 rounded-md bg-navy px-5 text-sm font-bold text-white disabled:opacity-50">Apply selected</button></div>
      </div>
    </div>
  );
}

export function formatUkDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/London" });
}

export function CheckoutSheet({
  issues,
  checkoutError,
  checkoutLoading,
  onClose,
  onContinue,
  onConsentAccepted,
  plan,
  passAvailable,
  cvAvailable = true,
  upgrade = null,
  onPlanChange,
}: {
  issues: string[];
  checkoutError: string | null;
  checkoutLoading: boolean;
  onClose: () => void;
  onContinue: () => void;
  onConsentAccepted: () => void;
  plan: "cv" | "pass";
  passAvailable: boolean;
  cvAvailable?: boolean;
  upgrade?: { creditMinor: number; priceMinor: number; endsAt: string } | null;
  onPlanChange: (plan: "cv" | "pass") => void;
}) {
  const selectedPlan = !cvAvailable ? "pass" : passAvailable ? plan : "cv";
  const passPriceLabel = upgrade ? formatPence(upgrade.priceMinor) : site.passPrice;
  const selectedPrice = selectedPlan === "pass" ? passPriceLabel : site.price;
  const [digitalAccessAccepted, setDigitalAccessAccepted] = useState(false);
  const dialogRef = useAccessibleDialog(onClose, !checkoutLoading);
  return (
    <div className="download-modal fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-navy/50 p-0 sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-sheet-title"
        className="w-full max-w-lg overflow-y-auto rounded-t-lg border border-line bg-white p-5 shadow-soft sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-success">One-time purchase</p>
          <h2
              id="checkout-sheet-title"
              className="mt-1 font-display text-3xl font-semibold text-navy"
          >
              {selectedPlan === "pass" ? "Get the Job Search Pass" : "Download your CV"}
          </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close checkout" disabled={checkoutLoading} className="rounded border border-line p-2 text-muted hover:text-navy disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">Choose what to buy</legend>
          {!cvAvailable && (
            <p className="rounded-lg border border-line bg-greensoft p-3 text-xs leading-5 text-navy">
              This CV is already unlocked and stays that way. The pass covers the new CVs you create for other jobs.
            </p>
          )}
          {cvAvailable && (
          <label className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${selectedPlan === "cv" ? "border-navy bg-paper" : "border-line bg-white"}`}>
            <input type="radio" name="workcv-plan" className="mt-1 h-4 w-4 accent-navy" checked={selectedPlan === "cv"} onChange={() => onPlanChange("cv")} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3"><span className="font-bold text-navy">This CV</span><span className="font-display text-2xl font-semibold text-navy">{site.price}</span></span>
              <span className="mt-1 block text-xs leading-5 text-muted">This CV and its matching cover letter as PDF and Word. Edit and download again at no extra cost.</span>
            </span>
          </label>
          )}
          {passAvailable && (
            <label className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${selectedPlan === "pass" ? "border-navy bg-paper" : "border-line bg-white"}`}>
              <input type="radio" name="workcv-plan" className="mt-1 h-4 w-4 accent-navy" checked={selectedPlan === "pass"} onChange={() => onPlanChange("pass")} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3"><span className="font-bold text-navy">Job Search Pass <span className="ml-1 rounded bg-gold-tint px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-navy">3+ applications</span></span><span className="text-right">{upgrade ? <span className="mr-1.5 text-sm text-muted line-through">{site.passPrice}</span> : null}<span className="font-display text-2xl font-semibold text-navy">{passPriceLabel}</span></span></span>
                {upgrade ? <span className="mt-1 block text-xs font-bold leading-5 text-success">Upgrade price: your {formatPence(upgrade.creditMinor)} CV purchase counts until {formatUkDate(upgrade.endsAt)}.</span> : null}
                <span className="mt-1 block text-xs leading-5 text-muted">Unlimited CVs and matching cover letters for {site.passDays} days. Duplicate your CV for each job. Every CV you make stays yours to edit and download.</span>
              </span>
            </label>
          )}
          <p className="text-xs font-bold text-navy">One-time payment. No subscription or renewal. <span className="font-normal text-muted">{site.priceTaxInclusive ? "Final total, including applicable tax." : "Applicable tax is calculated and shown by Dodo before payment."}</span></p>
        </fieldset>

        {issues.length > 0 && (
          <div className="mt-4 rounded-md border border-gold bg-gold-tint px-3 py-2 text-xs leading-5 text-navy" role="note">
            <strong>Missing detail:</strong> {issues[0]}
            {issues.length > 1 ? ` Plus ${issues.length - 1} more.` : ""}
            <button type="button" onClick={onClose} className="ml-1 font-bold underline underline-offset-2">Edit CV</button>
          </div>
        )}

        <label className="mt-4 flex gap-3 text-xs leading-5 text-muted">
          <input
            type="checkbox"
            checked={digitalAccessAccepted}
            onChange={(event) => {
              setDigitalAccessAccepted(event.target.checked);
              if (event.target.checked) onConsentAccepted();
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-navy"
          />
          <span>I want immediate digital access after payment and understand that once access starts my cancellation rights may be affected. Statutory rights still apply. <a className="font-bold text-navy underline" href="/refund-policy">Refund policy</a>.</span>
        </label>

        {checkoutError && <p className="mt-4 rounded-md border border-red-200 bg-redsoft px-4 py-3 text-sm font-bold leading-6 text-navy">{checkoutError}</p>}

        <div className="mt-5 flex flex-col gap-3">
          <button type="button" onClick={onContinue} disabled={checkoutLoading || !digitalAccessAccepted} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"><Download className="h-4 w-4" />{checkoutLoading ? "Opening secure checkout..." : `Continue to checkout · ${selectedPrice}`}</button>
          <a href="/samples/workcv-customer-service-cv-example.pdf" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center text-sm font-bold text-navy underline underline-offset-4">Inspect a fictional sample PDF first</a>
          <button type="button" onClick={onClose} disabled={checkoutLoading} className="inline-flex min-h-10 items-center justify-center text-sm font-bold text-muted hover:text-navy disabled:opacity-50">Keep editing</button>
        </div>
      </div>
    </div>
  );
}

export function ImportCvModal({
  template,
  hasPopulatedCv,
  onClose,
  onApply,
  onEvent,
}: {
  template: TemplateId;
  hasPopulatedCv: boolean;
  onClose: () => void;
  onApply: (cv: CvData) => void;
  onEvent: (event: "import_started" | "import_failed") => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [importedCv, setImportedCv] = useState<CvData | null>(null);
  const dialogRef = useAccessibleDialog(onClose, !isUploading);

  const handleFile = async (file: File) => {
    onEvent("import_started");
    const lowerName = file.name.toLowerCase();
    const isAllowed =
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".docx");

    setError(null);
    setImportedCv(null);
    setFileName(file.name);

    if (!isAllowed) {
      setError("Upload a PDF or DOCX CV.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("template", template);

      const response = await fetch("/api/cv/import", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { cv?: CvData; error?: string };

      if (!response.ok || !data.cv) {
        throw new Error(data.error || "We could not import that CV.");
      }

      setImportedCv(data.cv);
    } catch (importError) {
      onEvent("import_failed");
      setError(
        importError instanceof Error
          ? importError.message
          : "We could not import that CV."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const importedSummary = importedCv
    ? [
        importedCv.fullName || "Name not found",
        importedCv.targetRole || "Target role not found",
        `${importedCv.experience.filter((item) => item.role || item.company).length} roles`,
        `${lines(importedCv.skills).length} skills`,
      ]
    : [];

  return (
    <div className="download-modal fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-navy/45 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-cv-title"
        data-testid="import-cv-modal"
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-xl border border-line bg-white p-6 shadow-soft"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Import CV
            </p>
            <h2
              id="import-cv-title"
              className="mt-2 font-display text-3xl font-semibold text-navy"
            >
              Turn an existing CV into editable fields.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Upload a PDF or DOCX. WorkCV reads the text, fills the editor, and
              keeps your selected template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-md border border-line px-3 py-1 text-sm font-bold text-muted hover:text-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>

        <label
          onDrop={onDrop}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-navy bg-greensoft"
              : "border-line-strong bg-paper hover:bg-greensoft"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={isUploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
            className="sr-only"
          />
          <Upload className="h-10 w-10 text-navy" />
          <span className="mt-4 text-lg font-bold text-navy">
            {isUploading ? "Reading your CV..." : "Drop your CV here or choose a file"}
          </span>
          <span className="mt-2 text-sm text-muted">PDF or DOCX, up to 10MB</span>
          {fileName && <span className="mt-3 text-sm font-bold text-navy">{fileName}</span>}
        </label>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-redsoft px-4 py-3 text-sm font-bold leading-6 text-navy">
            {error}
          </p>
        )}

        {importedCv && (
          <div className="mt-5 rounded-xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Import preview
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Review the filled fields after applying. Your PDF download will
                  stay locked until checkout is completed again.
                </p>
              </div>
              <Check className="mt-1 h-6 w-6 shrink-0 text-success" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {importedSummary.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-navy"
                >
                  {item}
                </div>
              ))}
            </div>
            {importedCv.profile && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
                {importedCv.profile}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              if (!importedCv) return;
              if (
                hasPopulatedCv &&
                !window.confirm(
                  "Replace the populated CV currently in the editor with this import?",
                )
              ) {
                return;
              }
              onApply(importedCv);
            }}
            disabled={!importedCv || isUploading}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Upload className="h-4 w-4" />
            Replace current draft with import
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep current draft
          </button>
        </div>
      </div>
    </div>
  );
}

export function TemplatePickerModal({
  cv,
  onClose,
  onSelect,
}: {
  cv: CvData;
  onClose: () => void;
  onSelect: (templateId: TemplateId) => void;
}) {
  const dialogRef = useAccessibleDialog(onClose);
  return (
    <div className="download-modal fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
      <button
        type="button"
        aria-label="Close template selector"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-picker-title"
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line bg-white shadow-soft"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Templates
            </p>
            <h2 id="template-picker-title" className="mt-1 font-display text-2xl font-semibold leading-tight text-navy sm:text-3xl">
              Switch template without losing your content.
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close template selector"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-navy hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {templates.map((template) => {
              const active = cv.template === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelect(template.id)}
                  className={`rounded-xl border-2 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
                    active
                      ? "border-navy bg-greensoft"
                      : "border-line bg-paper hover:border-line-strong"
                  }`}
                >
                  <div className="template-preview-frame mb-4 h-[340px] overflow-hidden rounded-lg border border-line bg-white p-4 sm:h-[460px] lg:h-[500px]">
                    <div
                      className="pointer-events-none origin-top-left mx-auto"
                      style={{
                        width: 794,
                        transform: "scale(var(--preview-scale))",
                      } as React.CSSProperties}
                    >
                      <MemoCvDocument cv={{ ...cv, template: template.id, layoutPreset: "standard" }} compactPreview />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-navy">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-muted">
                        {template.description}
                      </p>
                    </div>
                    {active && <Check className="mt-1 h-5 w-5 shrink-0 text-success" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
