"use client";

import { readCheckoutPlanIntent } from "@/lib/checkout-plan-intent";
import { useEffect, useMemo, useRef, useState } from "react";
import { readCvFitHandoff, removeCvSourceFromHandoff } from "@/lib/cv-fit-handoff";
import { readCvToolHandoff, removeCvToolHandoff, type CvToolHandoff } from "@/lib/cv-tool-handoff";
import { CvData, CvTargeting, EducationItem, ExperienceItem, createBlankCv, isCvLayoutPreset, lines, templates } from "@/lib/editor-data";
import { pollPaymentStatus, type PaymentState, type PaymentStatusResult } from "@/lib/payment-polling";
import { calculateCvReadiness, type ReadinessIssue } from "@/lib/cv-readiness";
import { analyseAtsKeywords } from "@/lib/ats-keyword-checker";
import { addSkippedKeyword } from "@/lib/keyword-triage";
import { buildVacancyTriage, effectiveTargetRole, matchProgress, targetingFromFitHandoff, vaguePhraseItems, type VaguePhraseItem } from "@/lib/vacancy-fit";
import { cvHasContent, jobTailorHandoffKey, minAdvertLength, parseJobTailorHandoff, tailorCvForJob, type TailorJob } from "@/lib/job-tailor";
import { setEditorEventsEnabled, trackEditorEvent, type EditorEventName } from "@/lib/editor-events";
import { getRoleCvTemplate, parseRoleTemplate } from "@/lib/role-cv-templates";
import { buildLoginHref } from "@/lib/safe-redirect";
import { createCvSaveManager } from "@/components/editor/create-cv-save-manager";
import { readCheckoutAttribution, trackFunnelEvent } from "@/components/attribution-capture";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { DebouncedSaveManager, type SaveSnapshot } from "@/lib/save-manager";
import type { AiReview } from "@/components/editor/editor-modals";
import { stepForIssue, type StepId } from "@/components/editor/steps";
import { cvDesignStyle, cvDesignVariables, fitCandidates, minimalCvDesign, pageWidthPx, resolveCvDesign, type CvDesign } from "@/lib/cv-design";
import { paginatePdf } from "@/lib/cv-page-count";
import { aiLimits, fitAdvert, fitLines } from "@/lib/ai-request-fit";

const storageKey = "workcv-editor-draft";
const draftIdKey = "workcv-draft-id";
// A CV built before signing in lives here until it is saved to an account.
export const guestDraftKey = "workcv-guest-cv";
export type AccountReason = "download" | "import" | "save";

function readGuestDraft(): CvData | null {
  try {
    const stored = window.localStorage.getItem(guestDraftKey);
    return stored ? (JSON.parse(stored) as { cv: CvData }).cv ?? null : null;
  } catch {
    return null;
  }
}

// All editor state and actions. The editor screen renders from what this returns.
// As a guest (not signed in) the CV is kept in this browser until the visitor saves it.
export function useCvEditor({ guest = false }: { guest?: boolean } = {}) {
  const [cv, setCv] = useState<CvData>(() => createBlankCv());
  const [step, setStep] = useState<StepId>("contact");
  const [saveSnapshot, setSaveSnapshot] = useState<SaveSnapshot>({
    status: "saving",
    error: null,
    errorKind: null,
    errorDetail: null,
    version: 0,
  });
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [docxDownloading, setDocxDownloading] = useState(false);
  const [letterDownloading, setLetterDownloading] = useState<"pdf" | "docx" | null>(null);
  const [purposeSurveyOpen, setPurposeSurveyOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [passStatus, setPassStatus] = useState<PaymentStatusResult["pass"] | null>(null);
  const [upgradeOffer, setUpgradeOffer] = useState<PaymentStatusResult["upgrade"] | null>(null);
  const upgradeShownRef = useRef(false);
  const [checkoutPlan, setCheckoutPlan] = useState<"cv" | "pass">("cv");
  const [forceNewCheckout, setForceNewCheckout] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [undoLabel, setUndoLabel] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [recoveryCv, setRecoveryCv] = useState<CvData | null>(null);
  // A guest asked for something that needs an account; the save dialog explains why.
  const [accountPrompt, setAccountPrompt] = useState<AccountReason | null>(null);
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [guestKeptExisting, setGuestKeptExisting] = useState(false);
  // The guest start reads (and then tidies) the address once; a second run would see a bare URL.
  const guestStartedRef = useRef(false);
  const [otherTabUpdated, setOtherTabUpdated] = useState(false);
  const [aiLoading, setAiLoading] = useState<AiReview["kind"] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<AiReview | null>(null);
  const [tailoringOpen, setTailoringOpen] = useState(false);
  const [jobDescriptionDraft, setJobDescriptionDraft] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [previewPageCount, setPreviewPageCount] = useState(1);
  // Where pages 2, 3… start in the preview, for the page-break lines.
  const [previewPageBreaks, setPreviewPageBreaks] = useState<number[]>([]);
  // The page is shown on Finish, or on any step when the user opens Preview.
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fitMessage, setFitMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [pendingTargeting, setPendingTargeting] = useState<CvTargeting | null>(null);
  const [fitImportState, setFitImportState] = useState<
    "idle" | "importing" | "complete" | "error"
  >("idle");
  const [fitImportError, setFitImportError] = useState<string | null>(null);
  const [toolHandoffState, setToolHandoffState] = useState<"idle" | "importing" | "complete">("idle");
  const [toolHandoffError, setToolHandoffError] = useState<string | null>(null);
  const [jobTailor, setJobTailor] = useState<{ mode: "copied" | "attached"; role: string; employer: string; hasAdvert: boolean } | null>(null);
  const [jobTailorError, setJobTailorError] = useState<string | null>(null);
  const jobTailorStartedRef = useRef(false);
  const jobTailorOfferTrackedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const handoffStartedRef = useRef(false);
  const toolHandoffStartedRef = useRef(false);
  const pendingToolSaveRef = useRef<{ handoff: CvToolHandoff; cv: CvData; draftId: string; version: number | null } | null>(null);
  const saveManagerRef = useRef<DebouncedSaveManager<CvData> | null>(null);
  const lastManagedCvRef = useRef<CvData | null>(null);
  const undoRef = useRef<(() => void) | null>(null);
  const previousSaveStatusRef = useRef<SaveSnapshot["status"]>("saving");
  // Every edit to an invalid field fails its save again; report each field once.
  const trackedInvalidFieldRef = useRef<string | null>(null);
  const trackedMilestonesRef = useRef(new Set<number>());
  const trackedSectionsRef = useRef(new Set<string>());
  const previewReadyDocumentRef = useRef<string | null>(null);
  const modalOpen = templatePickerOpen || importOpen || reviewOpen || Boolean(aiReview);

  useEffect(() => {
    if (!modalOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [modalOpen]);

  // Visitors who chose the Job Search Pass on a marketing page arrive with plan=pass.
  useEffect(() => {
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Blocked browser storage. */ }
    setCheckoutPlan(readCheckoutPlanIntent(window.location.search, storage));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadGuestDraft = () => {
      if (guestStartedRef.current) return;
      guestStartedRef.current = true;
      setEditorEventsEnabled(false);
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get("template");
      const template = templates.some((item) => item.id === templateParam) ? (templateParam as CvData["template"]) : undefined;
      const roleTemplate = parseRoleTemplate(params.get("roleTemplate"));
      const stored = readGuestDraft();
      let initial: CvData;
      if (stored && cvHasContent(stored)) {
        // Never replace work the visitor hasn't saved; say so if they asked for something else.
        initial = stored;
        if (roleTemplate || params.get("new") === "1") setGuestKeptExisting(true);
      } else {
        initial = roleTemplate ? getRoleCvTemplate(roleTemplate, template) : createBlankCv(template);
        const preset = params.get("layoutPreset");
        if (isCvLayoutPreset(preset)) initial = { ...initial, layoutPreset: preset };
      }
      setCv(initial);
      setSaveSnapshot({ status: "saved", error: null, errorKind: null, errorDetail: null, version: 0 });
      if (params.get("import") === "1") setAccountPrompt("import");
      for (const key of ["new", "roleTemplate", "template", "layoutPreset", "import"]) params.delete(key);
      window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      setLoaded(true);
      trackFunnelEvent("guest_editor_started", { placement: stored && cvHasContent(stored) ? "resumed" : roleTemplate ? "sample" : template ? "template" : "blank" });
    };

    const loadDocument = async () => {
      if (guest) {
        loadGuestDraft();
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get("template");
      const roleTemplateParam = params.get("roleTemplate");
      const requestedDraftId = params.get("draftId");
      const shouldCreateNew = params.get("new") === "1";
      const queryParams = new URLSearchParams();
      if (requestedDraftId) queryParams.set("documentId", requestedDraftId);
      else if (templateParam) queryParams.set("template", templateParam);
      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

      try {
        const response = shouldCreateNew
          ? await fetch("/api/cv/new", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                template: templateParam,
                roleTemplate: roleTemplateParam,
              }),
            })
          : await fetch(`/api/cv/current${query}`);
        if (response.status === 401) {
          window.location.href = buildLoginHref(
            `${window.location.pathname}${window.location.search}`
          );
          return;
        }
        if (!response.ok) throw new Error("Failed to load saved CV");

        const data = (await response.json()) as {
          document?: { id: string; data: CvData; updatedAt: string };
        };
        if (!data.document) throw new Error("Missing CV document");

        if (!cancelled) {
          setDraftId(data.document.id);
          window.localStorage.setItem(draftIdKey, data.document.id);
          const localKey = `${storageKey}:${data.document.id}`;
          const stored = window.localStorage.getItem(localKey);
          if (stored) {
            try {
              const recovery = JSON.parse(stored) as { cv: CvData; savedAt: number };
              if (recovery.cv && recovery.savedAt > Date.parse(data.document.updatedAt) && JSON.stringify(recovery.cv) !== JSON.stringify(data.document.data)) setRecoveryCv(recovery.cv);
            } catch { window.localStorage.removeItem(localKey); }
          }
          lastManagedCvRef.current = data.document.data;
          const preset = params.get("layoutPreset");
          setCv(shouldCreateNew && isCvLayoutPreset(preset) ? { ...data.document.data, layoutPreset: preset } : data.document.data);
          saveManagerRef.current?.dispose();
          const manager = createCvSaveManager(data.document, setSaveSnapshot);
          saveManagerRef.current = manager;
          if (shouldCreateNew) {
            params.delete("new");
            params.delete("roleTemplate");
            params.delete("layoutPreset");
            // "Upload an existing CV" on My CVs opens the import dialog on the new CV.
            if (params.get("import") === "1") setImportOpen(true);
            params.delete("import");
            params.set("draftId", data.document.id);
            const nextUrl = `${window.location.pathname}${
              params.toString() ? `?${params.toString()}` : ""
            }`;
            window.history.replaceState(null, "", nextUrl);
          }
          setLoaded(true);
          trackEditorEvent("editor_viewed", data.document.id, { plan: params.get("plan") === "pass" ? "pass" : params.get("plan") === "cv" ? "cv" : "unspecified" });
        }
      } catch {
        if (!cancelled) {
          setSaveSnapshot({
            status: "error",
            error: "Could not load your saved CV.",
            errorKind: "general",
            errorDetail: null,
            version: 0,
          });
          setLoaded(true);
        }
      }
    };

    loadDocument();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !draftId) return;
    const key = `${storageKey}:${draftId}`;
    window.localStorage.setItem(key, JSON.stringify({ cv, savedAt: Date.now() }));
  }, [cv, draftId, loaded]);

  useEffect(() => {
    if (!guest || !loaded) return;
    try {
      window.localStorage.setItem(guestDraftKey, JSON.stringify({ cv, savedAt: Date.now() }));
    } catch {
      // Storage full or blocked: the CV stays on screen; saving to an account still works.
    }
  }, [cv, guest, loaded]);

  // After a guest saves, the editor reopens the saved CV and carries on with what they asked for.
  useEffect(() => {
    if (!loaded || !draftId) return;
    const params = new URLSearchParams(window.location.search);
    const then = params.get("then");
    if (!then) return;
    params.delete("then");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    setSavedToAccount(true);
    if (then === "download") setReviewOpen(true);
    if (then === "import") setImportOpen(true);
  }, [loaded, draftId]);

  useEffect(() => {
    if (!draftId) return;
    const key = `${storageKey}:${draftId}`;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || !event.newValue) return;
      try {
        const incoming = JSON.parse(event.newValue) as { cv: CvData };
        if (JSON.stringify(incoming.cv) !== JSON.stringify(cv)) setOtherTabUpdated(true);
      } catch { /* Ignore malformed browser storage. */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [cv, draftId]);

  useEffect(() => {
    if (!loaded || !draftId || handoffStartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "cv-fit-assessment") return;

    handoffStartedRef.current = true;
    const handoff = readCvFitHandoff();
    if (!handoff) {
      setFitImportState("error");
      setFitImportError(
        "The assessment handoff expired. Your saved CV is still available to edit.",
      );
      return;
    }

    const targeting: CvTargeting = targetingFromFitHandoff(handoff);
    setPendingTargeting(targeting);

    if (!handoff.cvText) {
      setFitImportState("complete");
      return;
    }

    const importAssessmentCv = async () => {
      setFitImportState("importing");
      setFitImportError(null);
      try {
        const response = await fetch("/api/cv/import-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: handoff.cvText, template: cv.template }),
        });
        const data = (await response.json().catch(() => null)) as
          | { cv?: CvData; error?: string }
          | null;
        if (!response.ok || !data?.cv) {
          throw new Error(data?.error || "The assessed CV could not be imported.");
        }

        // The advert's job title stays in targeting.role. It is not written under the
        // user's name: they may not hold that job, and the readiness list asks them to choose.
        setCv({
          ...data.cv,
          targeting,
        });
        setStep("contact");
        removeCvSourceFromHandoff();
        setFitImportState("complete");
        params.delete("from");
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${params.toString()}`,
        );
      } catch (error) {
        setFitImportState("error");
        setFitImportError(
          error instanceof Error
            ? error.message
            : "The assessed CV could not be imported.",
        );
      }
    };

    void importAssessmentCv();
  }, [cv.template, draftId, loaded]);

  useEffect(() => {
    if (!loaded || !draftId || toolHandoffStartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "career-tool") return;

    toolHandoffStartedRef.current = true;
    const handoff = readCvToolHandoff();
    if (!handoff) {
      setToolHandoffError("Your tool result is unavailable or has expired. Return to the tool and continue again in the same tab within 30 minutes, or paste your copied text. Your saved CV has not been changed.");
      params.delete("from");
      window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }

    const finish = (imported?: CvData) => {
      const nextCv = { ...cv, ...(imported || {}), ...(handoff.patch || {}) };
      pendingToolSaveRef.current = { handoff, cv: nextCv, draftId, version: null };
      setCv(nextCv);
      setStep(handoff.source === "cover-letter-generator" ? "letter" : "contact");
      setMobileView("edit");
      setToolHandoffState("importing");
      // Keep the source and navigation marker until the account save succeeds.
    };

    if ((cv.fullName.trim() || cv.experience.some((item) => item.role.trim())) &&
        !window.confirm("Import this tool result into the current CV? Existing fields may change. Cancel to keep this CV unchanged and return to the tool to start a new CV.")) {
      setToolHandoffError("Import cancelled. Your current CV is unchanged. The result remains in this tab temporarily.");
      return;
    }

    if (!handoff.sourceText) {
      finish();
      return;
    }

    setToolHandoffState("importing");
    setToolHandoffError(null);
    void (async () => {
      try {
        const response = await fetch("/api/cv/import-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: handoff.sourceText, template: cv.template }),
        });
        const data = (await response.json().catch(() => null)) as { cv?: CvData; error?: string } | null;
        if (!response.ok || !data?.cv) throw new Error(data?.error || "The tool result could not be imported.");
        finish(data.cv);
      } catch (error) {
        setToolHandoffState("idle");
        setToolHandoffError((error instanceof Error ? error.message : "The tool result could not be imported.") + " Your source is still in this tab for 30 minutes. Reload to retry, or go back and copy your result.");
      }
    })();
  }, [cv.template, draftId, loaded]);

  // A job sent from the tracker or the Chrome extension: make a separate copy of
  // the saved CV for that vacancy, or fill in a CV that has no details yet.
  useEffect(() => {
    if (!loaded || !draftId || jobTailorStartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "job-tailor") return;

    jobTailorStartedRef.current = true;
    params.delete("from");
    window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    let job: TailorJob | null = null;
    try { job = parseJobTailorHandoff(window.sessionStorage.getItem(jobTailorHandoffKey)); } catch { /* Blocked browser storage. */ }
    if (!job) {
      setJobTailorError("The job details expired or could not be read. Open the job again and choose Tailor my CV for this job. Your saved CV has not been changed.");
      return;
    }

    const tailoringJob = job;
    const hasAdvert = tailoringJob.advertText.length >= minAdvertLength;
    const mode = cvHasContent(cv) ? "copied" : "attached";
    trackEditorEvent("job_tailor_started", draftId, { source: tailoringJob.source, mode, advert: hasAdvert });
    const finish = () => {
      try { window.sessionStorage.removeItem(jobTailorHandoffKey); } catch { /* Blocked browser storage. */ }
      setJobTailor({ mode, role: tailoringJob.role, employer: tailoringJob.employer, hasAdvert });
      if (!hasAdvert) {
        setJobDescriptionDraft("");
        setTailoringOpen(true);
      }
    };
    if (mode === "attached") {
      setCv((current) => tailorCvForJob(current, tailoringJob));
      finish();
      return;
    }
    void resetDraft(draftId, tailoringJob).then((created) => {
      if (created) finish();
      else setJobTailorError("We could not copy your CV for this job. Your saved CV has not been changed. Reload the page to try again.");
    });
  }, [cv, draftId, loaded]);

  const showJobTailorPassOffer = jobTailor?.mode === "copied" && Boolean(passStatus && !passStatus.active) && !pdfUnlocked;
  useEffect(() => {
    if (!showJobTailorPassOffer || jobTailorOfferTrackedRef.current) return;
    jobTailorOfferTrackedRef.current = true;
    trackEditorEvent("pass_offer_shown", draftId, { placement: "job_tailor" });
  }, [showJobTailorPassOffer, draftId]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    let frame = 0;
    const updatePreview = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const document = preview.querySelector<HTMLElement>(".print-document, .letter-document");
        if (!document) return;
        const viewport = preview.parentElement;
        if (viewport) {
          const styles = window.getComputedStyle(viewport);
          const availableWidth =
            viewport.clientWidth -
            Number.parseFloat(styles.paddingLeft) -
            Number.parseFloat(styles.paddingRight);
          const pageWidth = pageWidthPx(cv.design);
          preview.style.width = `${pageWidth}px`;
          preview.style.zoom = String(Math.min(1, availableWidth / pageWidth));
        }
        if (document.classList.contains("print-document")) {
          const pagination = paginatePdf(document, cv.design);
          setPreviewPageCount(pagination.pages);
          setPreviewPageBreaks((current) => (current.length === pagination.breaks.length && current.every((y, i) => Math.abs(y - pagination.breaks[i]) < 1) ? current : pagination.breaks));
        }
      });
    };

    const observer = new ResizeObserver(updatePreview);
    const document = preview.querySelector<HTMLElement>(".print-document, .letter-document");
    if (document) observer.observe(document);
    if (preview.parentElement) observer.observe(preview.parentElement);
    updatePreview();
    // A newly chosen font loads after the first layout; count pages again once it has.
    void window.document.fonts?.ready.then(updatePreview);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [cv, step, previewOpen]);

  useEffect(() => {
    if (!draftId) return;

    let cancelled = false;
    const readStatus = async (): Promise<PaymentStatusResult> => {
      const response = await fetch(
        `/api/payments/status?draftId=${encodeURIComponent(draftId)}`,
        { cache: "no-store" },
      );
      const data = (await response.json().catch(() => null)) as
        | PaymentStatusResult
        | null;
      if (!response.ok || !data) throw new Error("Payment status unavailable");
      if (data.pass) setPassStatus(data.pass);
      if (data.upgrade) setUpgradeOffer(data.upgrade);
      return data;
    };
    const checkPaidStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const returnState = params.get("payment");
      if (returnState === "cancelled" || returnState === "failed") {
        setPaymentState(returnState);
        params.delete("payment");
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${params.toString()}`,
        );
        return;
      }

      try {
        if (returnState === "success") {
          setPaymentState("checking");
          const resolved = await pollPaymentStatus(readStatus, {
            onPending: () => {
              if (!cancelled) setPaymentState("pending");
            },
          });
          if (cancelled) return;
          setPaymentState(resolved);
          if (resolved === "paid") {
            setPdfUnlocked(true);
            params.delete("payment");
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}?${params.toString()}`,
            );
          }
          return;
        }

        const data = await readStatus();
        if (!cancelled && data.paid) {
          // Reopening an unlocked CV: unlock quietly. "Payment confirmed" is
          // only shown when returning from checkout.
          setPdfUnlocked(true);
        }
      } catch {
        if (!cancelled) {
          setPaymentState("pending");
          setCheckoutError("We could not confirm payment status. Please try again.");
        }
      }
    };

    checkPaidStatus();
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  useEffect(() => {
    if (!loaded || !saveManagerRef.current) return;
    if (lastManagedCvRef.current === cv) {
      lastManagedCvRef.current = null;
      return;
    }
    saveManagerRef.current.setValue(cv);
    const pendingToolSave = pendingToolSaveRef.current;
    if (pendingToolSave?.cv === cv && pendingToolSave.version === null) {
      pendingToolSave.version = saveManagerRef.current.snapshot().version;
      void saveManagerRef.current.flush();
    }
  }, [cv, loaded]);

  useEffect(() => {
    const pending = pendingToolSaveRef.current;
    if (!pending || pending.draftId !== draftId || pending.version === null) return;
    if (saveSnapshot.status === "error") {
      setToolHandoffState("idle");
      setToolHandoffError("Your result is in the editor, but could not be saved to your account. Use the save recovery controls above. The original transfer remains available in this tab until it expires.");
      return;
    }
    if (saveSnapshot.status !== "saved" || saveSnapshot.version < pending.version || saveManagerRef.current?.hasUnsavedChanges()) return;
    removeCvToolHandoff(pending.handoff);
    pendingToolSaveRef.current = null;
    const params = new URLSearchParams(window.location.search);
    params.delete("from");
    window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    setToolHandoffError(null);
    setToolHandoffState("complete");
  }, [draftId, saveSnapshot]);

  useEffect(() => {
    const previous = previousSaveStatusRef.current;
    if (saveSnapshot.status === "saved") trackedInvalidFieldRef.current = null;
    const repeatedInvalidField =
      saveSnapshot.errorKind === "invalid" &&
      saveSnapshot.errorDetail === trackedInvalidFieldRef.current;
    if (saveSnapshot.status === "error" && previous !== "error" && !repeatedInvalidField) {
      if (saveSnapshot.errorKind === "invalid") trackedInvalidFieldRef.current = saveSnapshot.errorDetail;
      trackEditorEvent("save_failed", draftId, {
        error_kind: saveSnapshot.errorKind || "unknown",
        ...(saveSnapshot.errorDetail ? { detail: saveSnapshot.errorDetail } : {}),
      });
    }
    if (saveSnapshot.status === "saving" && previous === "error") {
      trackEditorEvent("save_retried", draftId);
    }
    previousSaveStatusRef.current = saveSnapshot.status;
  }, [draftId, saveSnapshot.status, saveSnapshot.errorKind, saveSnapshot.errorDetail]);

  useEffect(() => {
    const flushOnExit = () => {
      void saveManagerRef.current?.flush({ keepalive: true });
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushOnExit();
    };
    window.addEventListener("pagehide", flushOnExit);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flushOnExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      saveManagerRef.current?.dispose();
    };
  }, []);

  const readiness = useMemo(() => calculateCvReadiness(cv), [cv]);

  const updateField = <K extends keyof CvData>(key: K, value: CvData[K]) => {
    setCv((current) => ({ ...current, [key]: value, ...(key === "template" ? { layoutPreset: "standard" as const } : {}) }));
  };

  const changeDesign = (change: Partial<CvDesign>) => {
    setFitMessage(null);
    setCv((current) => ({ ...current, design: minimalCvDesign({ ...resolveCvDesign(current.design), ...change }) }));
    for (const [setting, value] of Object.entries(change)) trackEditorEvent("design_changed", draftId, { setting, value: String(value) });
  };

  const resetDesign = () => {
    setFitMessage(null);
    setCv((current) => ({ ...current, design: undefined }));
    trackEditorEvent("design_changed", draftId, { setting: "reset", value: "default" });
  };

  // Tries smaller settings on the live preview, least noticeable first, and keeps the first that fits.
  const fitToPages = (target: number) => {
    const document = previewRef.current?.querySelector<HTMLElement>(".print-document");
    if (!document) return;
    const originalStyle = document.getAttribute("style");
    const candidates = fitCandidates(cv.design);
    let fitted: CvDesign | undefined;
    let tried = 0;
    try {
      for (const candidate of candidates) {
        tried += 1;
        for (const name of cvDesignVariables) document.style.removeProperty(name);
        for (const [name, value] of Object.entries(cvDesignStyle(candidate))) document.style.setProperty(name, value);
        if (paginatePdf(document, candidate).pages <= target) {
          fitted = candidate;
          break;
        }
      }
    } finally {
      if (originalStyle === null) document.removeAttribute("style");
      else document.setAttribute("style", originalStyle);
    }
    const pages = `${target} ${target === 1 ? "page" : "pages"}`;
    if (fitted) {
      setCv((current) => ({ ...current, design: minimalCvDesign(fitted) }));
      setFitMessage(`Fitted to ${pages}. Check the text is still easy to read, or press Reset to undo.`);
    } else {
      setFitMessage(`Your CV won’t fit on ${pages} even at the smallest settings. Shorten older roles, or try the Compact template.`);
    }
    trackEditorEvent("design_fit_used", draftId, { target, result: fitted ? "fitted" : "too_long", tried });
  };

  const updateExperience = (
    id: string,
    key: keyof ExperienceItem,
    value: string
  ) => {
    setCv((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const cvEvidenceText = () => [
    cv.profile,
    cv.skills,
    ...cv.experience.flatMap((item) => [item.role, item.company, item.bullets]),
    ...cv.education.flatMap((item) => [item.qualification, item.institution, item.details]),
  ].filter(Boolean).join("\n");

  const improveProfile = async () => {
    if (aiLoading) return;
    setAiLoading("profile"); setAiError(null);
    try {
      // Long CVs are trimmed to what the tool accepts, keeping skills and the most recent roles first.
      const background = fitLines([...cv.experience.map((item) => `${item.role} at ${item.company}`), ...cv.education.map((item) => `${item.qualification} at ${item.institution}`)].filter((value) => value.replace(/\s+at\s*$/, "").trim()).join("\n"), aiLimits.summaryBackground - 40).split("\n").join(". ");
      const evidence = fitLines([cv.skills, ...cv.experience.map((item) => item.bullets), ...cv.education.map((item) => item.details)].filter(Boolean).join("\n"), aiLimits.summaryEvidence);
      if (!effectiveTargetRole(cv)) throw new Error("Add a target role first so the profile has a clear direction.");
      if (background.length < 40 || evidence.length < 40) throw new Error("Add more evidence first: complete a role or education entry and a few bullets or skills.");
      const response = await fetch("/api/tools/cv-summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ background, targetRole: effectiveTargetRole(cv), evidence, jobDescription: fitAdvert(cv.targeting?.jobDescription || ""), careerStage: cv.experience.some((item) => item.role.trim()) ? "experienced" : "early" }) });
      const data = await response.json() as { variants?: Array<{ label: string; summary: string }>; followUpQuestions?: string[]; error?: string };
      if (!response.ok || !data.variants) throw new Error(data.error || "Profile suggestions are unavailable.");
      setAiReview({ kind: "profile", title: "Choose an improved profile", original: cv.profile, options: data.variants.map((item) => ({ label: item.label, value: item.summary })), questions: data.followUpQuestions });
      trackEditorEvent("ai_suggestion_generated", draftId, { section: "profile" });
    } catch (error) { setAiError(error instanceof Error ? error.message : "Profile suggestions are unavailable."); }
    finally { setAiLoading(null); }
  };

  const improveBullets = async (id: string) => {
    if (aiLoading) return;
    const item = cv.experience.find((entry) => entry.id === id); if (!item) return;
    setAiLoading("bullets"); setAiError(null);
    try {
      const context = [item.company && `Employer: ${item.company}`, item.location && `Location: ${item.location}`].filter(Boolean).join("\n");
      const rawExperience = [fitLines(item.bullets, aiLimits.bulletNotes - context.length - 1), context].filter(Boolean).join("\n");
      if (!item.role.trim() || rawExperience.length < 50) throw new Error("Add the role and at least 50 characters of truthful experience notes first.");
      const response = await fetch("/api/tools/cv-bullet-points", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobTitle: item.role, employmentStatus: /present|current/i.test(item.end) ? "current" : "previous", rawExperience, targetRole: effectiveTargetRole(cv), jobDescription: fitAdvert(cv.targeting?.jobDescription || "") }) });
      const data = await response.json() as { bullets?: string[]; followUpQuestions?: string[]; error?: string };
      if (!response.ok || !data.bullets) throw new Error(data.error || "Bullet suggestions are unavailable.");
      setAiReview({ kind: "bullets", targetId: id, title: `Review suggestions for ${item.role}`, original: item.bullets, options: data.bullets.map((value, index) => ({ label: `Suggestion ${index + 1}`, value })), questions: data.followUpQuestions });
      trackEditorEvent("ai_suggestion_generated", draftId, { section: "experience" });
    } catch (error) { setAiError(error instanceof Error ? error.message : "Bullet suggestions are unavailable."); }
    finally { setAiLoading(null); }
  };

  // Rewrites an existing bullet, or with `draft` writes a new bullet from the user's own
  // note about an advert keyword or requirement (applied by appending to the role).
  const rewriteBullet = async (id: string, index: number, avoid: string[] = [], draft?: { text: string; keyword?: string; requirement?: string }) => {
    if (aiLoading) return;
    const item = cv.experience.find((entry) => entry.id === id); if (!item) return;
    const bullet = draft ? draft.text.trim() : item.bullets.split("\n")[index]?.trim() || "";
    setAiLoading("bullet"); setAiError(null);
    try {
      if (!item.role.trim()) throw new Error("Add the job title for this role first.");
      const response = await fetch("/api/tools/cv-bullet-rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobTitle: item.role, bullet, targetRole: effectiveTargetRole(cv), jobDescription: fitAdvert(cv.targeting?.jobDescription || ""), avoid, keyword: draft?.keyword || "", requirement: draft?.requirement || "" }) });
      const data = await response.json() as { options?: string[]; followUpQuestion?: string; error?: string };
      if (!response.ok || !data.options) throw new Error(data.error || "Bullet rewrites are unavailable.");
      setAiReview({ kind: "bullet", targetId: id, bulletIndex: index, keyword: draft?.keyword, requirement: draft?.requirement, title: draft ? `Add ${draft.keyword || "evidence"} to ${item.role}` : `Rewrite this ${item.role} bullet`, original: bullet, options: data.options.map((value, optionIndex) => ({ label: `Option ${optionIndex + 1}`, value })), questions: data.followUpQuestion ? [data.followUpQuestion] : undefined });
      trackEditorEvent("ai_suggestion_generated", draftId, { section: draft?.requirement ? "requirement_bullet" : draft ? "keyword_bullet" : "bullet", retry: avoid.length > 0 });
    } catch (error) { setAiError(error instanceof Error ? error.message : "Bullet rewrites are unavailable."); }
    finally { setAiLoading(null); }
  };

  const keywordTriage = useMemo(() => {
    const jobDescription = cv.targeting?.jobDescription || "";
    if (jobDescription.length < 80) return null;
    const evidence = [cv.profile, cv.skills, ...cv.experience.flatMap((item) => [item.role, item.company, item.bullets]), ...cv.education.flatMap((item) => [item.qualification, item.institution, item.details])].filter(Boolean).join("\n");
    return cv.targeting ? buildVacancyTriage(analyseAtsKeywords(jobDescription, evidence), cv.targeting, evidence) : null;
  }, [cv]);

  const vaguePhrases = useMemo(() => vaguePhraseItems(cv), [cv]);
  const progress = useMemo(() => (keywordTriage ? matchProgress(cv, keywordTriage) : null), [cv, keywordTriage]);
  const openRequirements = keywordTriage?.requirements.queue.length ?? 0;

  const setSkippedKeywords = (update: (current: string[]) => string[]) =>
    setCv((current) => current.targeting ? { ...current, targeting: { ...current.targeting, skippedKeywords: update(current.targeting.skippedKeywords || []) } } : current);

  const markRequirementAnswered = (requirement: string) =>
    setCv((current) => current.targeting ? { ...current, targeting: { ...current.targeting, answeredRequirements: addSkippedKeyword(current.targeting.answeredRequirements, requirement) } } : current);

  const rewriteVaguePhrase = (item: VaguePhraseItem) => {
    setMobileView("edit");
    trackEditorEvent("keyword_triage_answered", draftId, { answer: "vague_phrase" });
    if (item.where.kind === "profile") { setStep("profile"); void improveProfile(); }
    else { setStep("experience"); void rewriteBullet(item.where.roleId, item.where.index); }
  };

  const suggestSkills = () => {
    if (aiLoading) return;
    setAiError(null);
    const jobDescription = cv.targeting?.jobDescription || "";
    if (jobDescription.length < 80) { setAiError("Add a job description with Tailor to job before requesting skills."); setTailoringOpen(true); return; }
    const analysis = analyseAtsKeywords(jobDescription, cvEvidenceText());
    const options = analysis.missing.filter((item) => item.category === "Skill or tool" || item.category === "Qualification").slice(0, 10).map((item) => ({ label: item.importance, value: item.term }));
    if (!options.length) { setAiError("No additional supported skill terms were found in this vacancy."); return; }
    setAiReview({ kind: "skills", title: "Confirm skills you genuinely possess", original: cv.skills, options });
    trackEditorEvent("skill_suggestions_opened", draftId, { count: options.length });
  };

  const runReadinessAction = (issue: ReadinessIssue) => {
    setMobileView("edit");
    setStep(stepForIssue(issue));
    if (issue.action === "improve-profile") void improveProfile();
    else if (issue.action === "improve-bullets" && issue.targetId) void improveBullets(issue.targetId);
    else if (issue.action === "suggest-skills") suggestSkills();
  };

  const updateEducation = (
    id: string,
    key: keyof EducationItem,
    value: string
  ) => {
    setCv((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const removeExperienceWithUndo = (id: string) => {
    setCv((current) => {
      const index = current.experience.findIndex((item) => item.id === id);
      const removed = current.experience[index];
      if (!removed) return current;
      undoRef.current = () => {
        setCv((latest) => ({
          ...latest,
          experience: [
            ...latest.experience.slice(0, index),
            removed,
            ...latest.experience.slice(index),
          ],
        }));
        setUndoLabel(null);
      };
      setUndoLabel("Role removed.");
      return {
        ...current,
        experience: current.experience.filter((item) => item.id !== id),
      };
    });
  };

  const removeEducationWithUndo = (id: string) => {
    setCv((current) => {
      const index = current.education.findIndex((item) => item.id === id);
      const removed = current.education[index];
      if (!removed) return current;
      undoRef.current = () => {
        setCv((latest) => ({
          ...latest,
          education: [
            ...latest.education.slice(0, index),
            removed,
            ...latest.education.slice(index),
          ],
        }));
        setUndoLabel(null);
      };
      setUndoLabel("Education entry removed.");
      return {
        ...current,
        education: current.education.filter((item) => item.id !== id),
      };
    });
  };

  const moveEntry = (
    kind: "experience" | "education",
    index: number,
    direction: -1 | 1,
  ) => {
    setCv((current) => {
      const items = [...current[kind]];
      const target = index + direction;
      if (target < 0 || target >= items.length) return current;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...current, [kind]: items };
    });
  };

  // With a job, the copy is created already tailored to that vacancy. Resolves true once the new CV is open.
  const resetDraft = async (copyFrom?: string, job?: TailorJob): Promise<boolean> => {
    if (creatingNew) return false;
    const manager = saveManagerRef.current;
    if (
      manager?.hasUnsavedChanges() &&
      !window.confirm(
        "This CV has unsaved changes. Save them before creating a new CV?",
      )
    ) {
      return false;
    }
    if (manager?.hasUnsavedChanges() && !(await manager.flush())) return false;
    if (!job) setJobTailor(null);
    setCreatingNew(true);
    setSaveSnapshot((current) => ({
      ...current,
      status: "saving",
      error: null,
      errorKind: null,
    }));
    setCheckoutError(null);

    try {
      const response = await fetch("/api/cv/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copyFrom ? { copyFrom, ...(job ? { job } : {}) } : { template: cv.template }),
      });
      const data = (await response.json()) as {
        document?: { id: string; data: CvData; updatedAt: string };
        error?: string;
      };
      if (!response.ok || !data.document) {
        throw new Error(data.error || "Could not create a new CV");
      }
      if (copyFrom) {
        trackEditorEvent("cv_duplicated", data.document.id, { pass_active: Boolean(passStatus?.active), ...(job ? { source: "job_tailor" } : {}) });
        if (!job) {
          setJobDescriptionDraft("");
          setTailoringOpen(true);
        }
      }

      window.localStorage.removeItem(storageKey);
      window.localStorage.setItem(draftIdKey, data.document.id);
      setDraftId(data.document.id);
      setPdfUnlocked(false);
      lastManagedCvRef.current = data.document.data;
      setCv(data.document.data);
      saveManagerRef.current?.dispose();
      const managerForNewDocument = createCvSaveManager(
        data.document,
        setSaveSnapshot,
      );
      saveManagerRef.current = managerForNewDocument;
      setStep("contact");
      const params = new URLSearchParams(window.location.search);
      params.delete("new");
      params.delete("roleTemplate");
      params.delete("payment");
      params.set("draftId", data.document.id);
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
      return true;
    } catch (error) {
      setSaveSnapshot((current) => ({
        ...current,
        status: "error",
        error: error instanceof Error ? error.message : "Could not create a new CV",
        errorKind: "general",
        errorDetail: null,
      }));
      return false;
    } finally {
      setCreatingNew(false);
    }
  };

  const startDownload = () => {
    if (guest) {
      setAccountPrompt("download");
      return;
    }
    trackEditorEvent("pdf_clicked", draftId, {
      ready: readiness.ready,
      access: pdfUnlocked ? "unlocked" : "checkout",
    });
    if (paymentState === "checking" || paymentState === "pending") return;
    if (pdfUnlocked) {
      void downloadPdf();
      return;
    }
    trackEditorEvent("checkout_sheet_opened", draftId, {
      missing_essential_details: readiness.fixCount,
    });
    setReviewOpen(true);
  };

  const downloadPdf = async () => {
    if (!draftId || pdfDownloading) return;
    setPdfDownloading(true);
    setCheckoutError(null);
    try {
      const saved = await saveManagerRef.current?.flush();
      if (saved === false) throw new Error(saveManagerRef.current?.snapshot().error || "Save your latest changes before downloading.");
      let response = await fetch(`/api/cv/pdf?draftId=${encodeURIComponent(draftId)}`);
      if (response.status === 503) {
        trackEditorEvent("pdf_generation_retried", draftId);
        await new Promise((resolve) => window.setTimeout(resolve, 900));
        response = await fetch(`/api/cv/pdf?draftId=${encodeURIComponent(draftId)}`);
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "PDF generation failed");
      }
      saveDownload(await response.blob(), "pdf");
      setReviewOpen(false);
    } catch (error) {
      trackEditorEvent("pdf_generation_failed", draftId);
      setCheckoutError(error instanceof Error ? error.message : "PDF generation failed");
    } finally {
      setPdfDownloading(false);
    }
  };

  const downloadDocx = async () => {
    if (!draftId || !pdfUnlocked || docxDownloading) return;
    trackEditorEvent("docx_clicked", draftId);
    setDocxDownloading(true);
    setCheckoutError(null);
    try {
      const saved = await saveManagerRef.current?.flush();
      if (saved === false) throw new Error(saveManagerRef.current?.snapshot().error || "Save your latest changes before downloading.");
      const response = await fetch(`/api/cv/docx?draftId=${encodeURIComponent(draftId)}`);
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Word download failed");
      }
      saveDownload(await response.blob(), "docx");
    } catch (error) {
      trackEditorEvent("docx_generation_failed", draftId);
      setCheckoutError(error instanceof Error ? error.message : "Word download failed");
    } finally {
      setDocxDownloading(false);
    }
  };

  const downloadCoverLetter = async (format: "pdf" | "docx") => {
    if (!draftId || !pdfUnlocked || letterDownloading) return;
    if (!hasCoverLetterContent(cv)) {
      setStep("letter");
      return;
    }
    trackEditorEvent("cover_letter_download_clicked", draftId, { format });
    setLetterDownloading(format);
    setCheckoutError(null);
    try {
      const saved = await saveManagerRef.current?.flush();
      if (saved === false) throw new Error(saveManagerRef.current?.snapshot().error || "Save your latest changes before downloading.");
      const url = `/api/cv/cover-letter?draftId=${encodeURIComponent(draftId)}&format=${format}`;
      let response = await fetch(url);
      if (response.status === 503 && format === "pdf") {
        await new Promise((resolve) => window.setTimeout(resolve, 900));
        response = await fetch(url);
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Cover letter download failed");
      }
      saveDownload(await response.blob(), format, "cover-letter");
    } catch (error) {
      trackEditorEvent("cover_letter_generation_failed", draftId, { format });
      setCheckoutError(error instanceof Error ? error.message : "Cover letter download failed");
    } finally {
      setLetterDownloading(null);
    }
  };

  const saveDownload = (blob: Blob, extension: "pdf" | "docx", kind: "cv" | "cover-letter" = "cv") => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cv.fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "workcv"}-${kind}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    askPurposeOnce();
  };

  // Ask the optional purpose question once per saved CV, after its first
  // successful download. Storage failures simply skip the question.
  const askPurposeOnce = () => {
    if (!draftId) return;
    try {
      const key = `workcv-purpose-asked:${draftId}`;
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, "1");
      setPurposeSurveyOpen(true);
    } catch {
      // Private browsing or blocked storage: do not ask.
    }
  };

  const continueFromReview = () => {
    trackEditorEvent("checkout_opened", draftId, { plan: checkoutPlan });
    void startCheckout(cv.email, checkoutPlan);
  };

  const startCheckout = async (email: string, plan: "cv" | "pass" = "cv") => {
    if (!draftId || !loaded) {
      setCheckoutError("Your draft is still initialising. Please try again.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    trackEditorEvent("payment_started", draftId, { plan });
    // Remember the plan so "Return to checkout" after a cancelled payment reopens the same one.
    try {
      window.sessionStorage.setItem("workcv-plan-intent", plan);
    } catch {
      // Storage can be blocked; the retry then falls back to the plan picker default.
    }

    try {
      const saved = await saveManagerRef.current?.flush();
      if (saved === false) {
        throw new Error(
          saveManagerRef.current?.snapshot().error ||
            "Save your latest changes before checkout.",
        );
      }
      const response = await fetch("/api/checkout/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId,
          plan,
          email,
          consentAccepted: true,
          forceNew: forceNewCheckout,
          expectedUpgrade: plan === "pass" && upgradeOffer?.eligible === true,
          attribution: readCheckoutAttribution(),
        }),
      });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string; upgradeEnded?: boolean };
      if (data.upgradeEnded) setUpgradeOffer({ eligible: false });

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(
          response.status >= 500 || !data.error
            ? "Secure checkout is temporarily unavailable. Your CV is saved; please try again in a moment."
            : data.error,
        );
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutLoading(false);
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout is unavailable. Please try again."
      );
    }
  };

  // Importing reads the file with paid AI processing, so it is tied to an account.
  const openImport = () => {
    if (guest) setAccountPrompt("import");
    else setImportOpen(true);
  };

  /** Saves the guest's CV to the account they just signed in to, then reopens it as a saved CV
   * and continues with what they asked for. Resolves with an error message if it failed. */
  const saveGuestToAccount = async (reason: AccountReason): Promise<string | null> => {
    try {
      const response = await fetch("/api/cv/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestDraft: cv }),
      });
      const data = (await response.json().catch(() => null)) as { document?: { id: string }; error?: string } | null;
      if (!response.ok || !data?.document) return data?.error || "Your CV couldn't be saved. Check your connection and try again.";
      trackFunnelEvent("guest_cv_saved", { placement: reason });
      try { window.localStorage.removeItem(guestDraftKey); } catch { /* Blocked storage. */ }
      const params = new URLSearchParams({ draftId: data.document.id, step });
      const plan = new URLSearchParams(window.location.search).get("plan");
      if (plan === "pass" || plan === "cv") params.set("plan", plan);
      params.set("then", reason);
      window.location.href = `/editor?${params.toString()}`;
      return null;
    } catch {
      return "Your CV couldn't be saved. Check your connection and try again.";
    }
  };

  const applyImportedCv = (importedCv: CvData) => {
    setCv(importedCv);
    setStep("contact");
    setImportOpen(false);
    trackEditorEvent("import_succeeded", draftId);
  };

  const saveLabel = guest
    ? "Saved on this device"
    : saveSnapshot.status === "saved"
      ? "Saved"
      : saveSnapshot.status === "saving"
        ? "Saving…"
        : saveSnapshot.status === "unsaved"
          ? "Unsaved changes"
          : saveSnapshot.error || "Save failed";

  useEffect(() => {
    if (paymentState !== "paid" || !upgradeOffer?.eligible || passStatus?.active || upgradeShownRef.current) return;
    upgradeShownRef.current = true;
    trackEditorEvent("upgrade_offer_shown", draftId, { placement: "payment_confirmed" });
  }, [paymentState, upgradeOffer, passStatus, draftId]);

  const checkPaymentAgain = async () => {
    if (!draftId) return;
    setPaymentState("checking");
    setCheckoutError(null);
    try {
      const response = await fetch(
        `/api/payments/status?draftId=${encodeURIComponent(draftId)}`,
        { cache: "no-store" },
      );
      const data = (await response.json().catch(() => null)) as
        | PaymentStatusResult
        | null;
      if (!response.ok || !data) throw new Error();
      if (data.pass) setPassStatus(data.pass);
      if (data.upgrade) setUpgradeOffer(data.upgrade);
      if (data.paid) {
        setPdfUnlocked(true);
        setPaymentState("paid");
        const params = new URLSearchParams(window.location.search);
        params.delete("payment");
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${params.toString()}`,
        );
      } else {
        setPaymentState(data.status || "pending");
      }
    } catch {
      setPaymentState("pending");
      setCheckoutError("Payment status is temporarily unavailable.");
    }
  };

  const selectedTemplate = templates.find((template) => template.id === cv.template);
  const fitTargeting = cv.targeting || pendingTargeting;
  // Keyword priorities from "Analyse vacancy" are answered in the keyword card, so only list the rest here.
  const triagedTerms = new Set(keywordTriage ? [...keywordTriage.found, ...keywordTriage.queue, ...keywordTriage.skipped, ...keywordTriage.covered].map((keyword) => keyword.term.toLocaleLowerCase("en-GB")) : []);
  const prioritiesAreActions = Boolean(fitTargeting?.requirements?.length || fitTargeting?.evidencedRequirements?.length);
  const visiblePriorities = fitTargeting ? fitTargeting.priorities.filter((priority) => !triagedTerms.has(priority.title.trim().toLocaleLowerCase("en-GB"))) : [];

  useEffect(() => {
    [20, 40, 60, 80, 100].forEach((milestone) => {
      if (
        readiness.score >= milestone &&
        !trackedMilestonesRef.current.has(milestone)
      ) {
        trackedMilestonesRef.current.add(milestone);
        trackEditorEvent("progress_milestone", draftId, { milestone });
      }
    });
    const completedSections = [
      cv.fullName && cv.profile ? "profile" : null,
      cv.experience.some(
        (item) => item.role && item.company && item.start && item.bullets,
      )
        ? "experience"
        : null,
      cv.education.some(
        (item) =>
          item.qualification &&
          item.institution &&
          (item.start || item.end),
      )
        ? "education"
        : null,
      lines(cv.skills).length >= 3 ? "skills" : null,
    ].filter((section): section is string => Boolean(section));
    completedSections.forEach((section) => {
      if (!trackedSectionsRef.current.has(section)) {
        trackedSectionsRef.current.add(section);
        trackEditorEvent("section_completed", draftId, { section });
      }
    });
    if (
      draftId &&
      readiness.ready &&
      previewReadyDocumentRef.current !== draftId
    ) {
      previewReadyDocumentRef.current = draftId;
      trackEditorEvent("preview_ready", draftId, {
        score: readiness.score,
        completion_band: "useful_preview_ready",
      });
    }
  }, [cv, draftId, readiness.score]);

  useEffect(() => {
    if (!paymentState) return;
    const eventByState: Partial<Record<PaymentState, EditorEventName>> = {
      pending: "payment_pending",
      failed: "payment_failed",
      cancelled: "payment_cancelled",
    };
    const event = eventByState[paymentState];
    if (event) {
      const plan = new URLSearchParams(window.location.search).get("plan");
      trackEditorEvent(event, draftId, { plan: plan === "pass" || plan === "cv" ? plan : "unspecified" });
    }
  }, [draftId, paymentState]);

  return {
    guest,
    accountPrompt,
    setAccountPrompt,
    savedToAccount,
    setSavedToAccount,
    guestKeptExisting,
    setGuestKeptExisting,
    openImport,
    saveGuestToAccount,
    cv,
    setCv,
    step,
    setStep,
    saveSnapshot,
    setSaveSnapshot,
    pdfUnlocked,
    setPdfUnlocked,
    draftId,
    setDraftId,
    checkoutError,
    setCheckoutError,
    checkoutLoading,
    setCheckoutLoading,
    pdfDownloading,
    setPdfDownloading,
    docxDownloading,
    setDocxDownloading,
    letterDownloading,
    setLetterDownloading,
    purposeSurveyOpen,
    setPurposeSurveyOpen,
    paymentState,
    setPaymentState,
    passStatus,
    setPassStatus,
    upgradeOffer,
    setUpgradeOffer,
    upgradeShownRef,
    checkoutPlan,
    setCheckoutPlan,
    forceNewCheckout,
    setForceNewCheckout,
    templatePickerOpen,
    setTemplatePickerOpen,
    importOpen,
    setImportOpen,
    reviewOpen,
    setReviewOpen,
    undoLabel,
    setUndoLabel,
    loaded,
    setLoaded,
    recoveryCv,
    setRecoveryCv,
    otherTabUpdated,
    setOtherTabUpdated,
    aiLoading,
    setAiLoading,
    aiError,
    setAiError,
    aiReview,
    setAiReview,
    tailoringOpen,
    setTailoringOpen,
    jobDescriptionDraft,
    setJobDescriptionDraft,
    creatingNew,
    setCreatingNew,
    previewPageCount,
    setPreviewPageCount,
    previewPageBreaks,
    previewOpen,
    setPreviewOpen,
    fitMessage,
    changeDesign,
    resetDesign,
    fitToPages,
    mobileView,
    setMobileView,
    pendingTargeting,
    setPendingTargeting,
    fitImportState,
    setFitImportState,
    fitImportError,
    setFitImportError,
    toolHandoffState,
    setToolHandoffState,
    toolHandoffError,
    setToolHandoffError,
    jobTailor,
    setJobTailor,
    jobTailorError,
    setJobTailorError,
    jobTailorStartedRef,
    jobTailorOfferTrackedRef,
    previewRef,
    handoffStartedRef,
    toolHandoffStartedRef,
    pendingToolSaveRef,
    saveManagerRef,
    lastManagedCvRef,
    undoRef,
    previousSaveStatusRef,
    trackedMilestonesRef,
    trackedSectionsRef,
    previewReadyDocumentRef,
    modalOpen,
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
    downloadPdf,
    downloadDocx,
    downloadCoverLetter,
    saveDownload,
    askPurposeOnce,
    continueFromReview,
    startCheckout,
    applyImportedCv,
    saveLabel,
    checkPaymentAgain,
    selectedTemplate,
    fitTargeting,
    triagedTerms,
    prioritiesAreActions,
    visiblePriorities,
  };
}

export type CvEditorState = ReturnType<typeof useCvEditor>;
