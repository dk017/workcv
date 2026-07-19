"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Briefcase,
  Check,
  Download,
  GraduationCap,
  LayoutTemplate,
  Plus,
  Sparkles,
  Undo2,
  Upload,
  User,
  X,
} from "lucide-react";

import {
  readCvFitHandoff,
  removeCvSourceFromHandoff,
} from "@/lib/cv-fit-handoff";
import {
  CvData,
  CvTargeting,
  EducationItem,
  ExperienceItem,
  TemplateId,
  createBlankCv,
  emptyEducation,
  emptyExperience,
  lines,
  templates,
} from "@/lib/editor-data";
import { site } from "@/lib/site";
import {
  pollPaymentStatus,
  type PaymentState,
  type PaymentStatusResult,
} from "@/lib/payment-polling";
import { calculateCvReadiness } from "@/lib/cv-readiness";
import { analyseAtsKeywords } from "@/lib/ats-keyword-checker";
import {
  trackEditorEvent,
  type EditorEventName,
} from "@/lib/editor-events";
import { useAccessibleDialog } from "@/components/editor/use-accessible-dialog";
import { createCvSaveManager } from "@/components/editor/create-cv-save-manager";
import { MemoCvDocument } from "@/components/editor/cv-document";
import {
  EducationForm,
  ExperienceForm,
  ProfileForm,
  SkillsForm,
  TemplateForm,
} from "@/components/editor/editor-forms";
import {
  DebouncedSaveManager,
  type SaveSnapshot,
} from "@/lib/save-manager";

export { CvDocument } from "@/components/editor/cv-document";

const storageKey = "workcv-editor-draft";
const draftIdKey = "workcv-draft-id";
type TabId = "profile" | "experience" | "education" | "skills" | "template";
type AiReview = {
  kind: "profile" | "bullets" | "skills";
  title: string;
  targetId?: string;
  original: string;
  options: Array<{ label: string; value: string }>;
  questions?: string[];
};

const tabs: Array<{ id: TabId; label: string; icon: typeof User }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "template", label: "Template", icon: LayoutTemplate },
];

export function CvEditor() {
  const [cv, setCv] = useState<CvData>(() => createBlankCv());
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [saveSnapshot, setSaveSnapshot] = useState<SaveSnapshot>({
    status: "saving",
    error: null,
    errorKind: null,
    version: 0,
  });
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [forceNewCheckout, setForceNewCheckout] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [undoLabel, setUndoLabel] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [recoveryCv, setRecoveryCv] = useState<CvData | null>(null);
  const [otherTabUpdated, setOtherTabUpdated] = useState(false);
  const [aiLoading, setAiLoading] = useState<AiReview["kind"] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<AiReview | null>(null);
  const [tailoringOpen, setTailoringOpen] = useState(false);
  const [jobDescriptionDraft, setJobDescriptionDraft] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [previewPageCount, setPreviewPageCount] = useState(1);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [pendingTargeting, setPendingTargeting] = useState<CvTargeting | null>(null);
  const [fitImportState, setFitImportState] = useState<
    "idle" | "importing" | "complete" | "error"
  >("idle");
  const [fitImportError, setFitImportError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const handoffStartedRef = useRef(false);
  const saveManagerRef = useRef<DebouncedSaveManager<CvData> | null>(null);
  const lastManagedCvRef = useRef<CvData | null>(null);
  const undoRef = useRef<(() => void) | null>(null);
  const previousSaveStatusRef = useRef<SaveSnapshot["status"]>("saving");
  const trackedMilestonesRef = useRef(new Set<number>());
  const trackedSectionsRef = useRef(new Set<string>());
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

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
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
          window.location.href = `/login?next=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          )}`;
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
          setCv(data.document.data);
          saveManagerRef.current?.dispose();
          const manager = createCvSaveManager(data.document, setSaveSnapshot);
          saveManagerRef.current = manager;
          if (shouldCreateNew) {
            params.delete("new");
            params.delete("roleTemplate");
            params.set("draftId", data.document.id);
            const nextUrl = `${window.location.pathname}${
              params.toString() ? `?${params.toString()}` : ""
            }`;
            window.history.replaceState(null, "", nextUrl);
          }
          setLoaded(true);
          trackEditorEvent("editor_viewed", data.document.id);
        }
      } catch {
        if (!cancelled) {
          setSaveSnapshot({
            status: "error",
            error: "Could not load your saved CV.",
            errorKind: "general",
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

    const targeting: CvTargeting = {
      role: handoff.targetRole,
      jobDescription: handoff.jobDescription,
      priorities: handoff.priorities,
    };
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

        setCv({
          ...data.cv,
          targetRole: handoff.targetRole || data.cv.targetRole,
          targeting,
        });
        setActiveTab("profile");
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
    const preview = previewRef.current;
    if (!preview) return;

    let frame = 0;
    const updatePreview = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const document = preview.querySelector<HTMLElement>(".print-document");
        if (!document) return;
        const viewport = preview.parentElement;
        if (viewport) {
          const styles = window.getComputedStyle(viewport);
          const availableWidth =
            viewport.clientWidth -
            Number.parseFloat(styles.paddingLeft) -
            Number.parseFloat(styles.paddingRight);
          preview.style.zoom = String(Math.min(1, availableWidth / 794));
        }
        setPreviewPageCount(Math.max(1, Math.ceil(document.scrollHeight / 1123)));
      });
    };

    const observer = new ResizeObserver(updatePreview);
    const document = preview.querySelector<HTMLElement>(".print-document");
    if (document) observer.observe(document);
    if (preview.parentElement) observer.observe(preview.parentElement);
    updatePreview();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [cv]);

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
          setPdfUnlocked(true);
          setPaymentState("paid");
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
  }, [cv, loaded]);

  useEffect(() => {
    const previous = previousSaveStatusRef.current;
    if (saveSnapshot.status === "error" && previous !== "error") {
      trackEditorEvent("save_failed", draftId);
    }
    if (saveSnapshot.status === "saving" && previous === "error") {
      trackEditorEvent("save_retried", draftId);
    }
    previousSaveStatusRef.current = saveSnapshot.status;
  }, [draftId, saveSnapshot.status]);

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
    setCv((current) => ({ ...current, [key]: value }));
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
      const background = [...cv.experience.map((item) => `${item.role} at ${item.company}`), ...cv.education.map((item) => `${item.qualification} at ${item.institution}`)].filter((value) => value.replace(/\s+at\s*$/, "").trim()).join(". ");
      const evidence = [cv.skills, ...cv.experience.map((item) => item.bullets), ...cv.education.map((item) => item.details)].filter(Boolean).join("\n");
      if (!cv.targetRole.trim() || background.length < 40 || evidence.length < 40) throw new Error("Add a target role and more evidence in experience, education or skills first.");
      const response = await fetch("/api/tools/cv-summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ background, targetRole: cv.targetRole, evidence, jobDescription: cv.targeting?.jobDescription || "", careerStage: cv.experience.some((item) => item.role.trim()) ? "experienced" : "early" }) });
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
      const rawExperience = [item.bullets, item.company && `Employer: ${item.company}`, item.location && `Location: ${item.location}`].filter(Boolean).join("\n");
      if (!item.role.trim() || rawExperience.length < 50) throw new Error("Add the role and at least 50 characters of truthful experience notes first.");
      const response = await fetch("/api/tools/cv-bullet-points", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobTitle: item.role, employmentStatus: /present|current/i.test(item.end) ? "current" : "previous", rawExperience, targetRole: cv.targetRole, jobDescription: cv.targeting?.jobDescription || "" }) });
      const data = await response.json() as { bullets?: string[]; followUpQuestions?: string[]; error?: string };
      if (!response.ok || !data.bullets) throw new Error(data.error || "Bullet suggestions are unavailable.");
      setAiReview({ kind: "bullets", targetId: id, title: `Review suggestions for ${item.role}`, original: item.bullets, options: data.bullets.map((value, index) => ({ label: `Suggestion ${index + 1}`, value })), questions: data.followUpQuestions });
      trackEditorEvent("ai_suggestion_generated", draftId, { section: "experience" });
    } catch (error) { setAiError(error instanceof Error ? error.message : "Bullet suggestions are unavailable."); }
    finally { setAiLoading(null); }
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

  const resetDraft = async () => {
    if (creatingNew) return;
    const manager = saveManagerRef.current;
    if (
      manager?.hasUnsavedChanges() &&
      !window.confirm(
        "This CV has unsaved changes. Save them before creating a new CV?",
      )
    ) {
      return;
    }
    if (manager?.hasUnsavedChanges() && !(await manager.flush())) return;
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
        body: JSON.stringify({ template: cv.template }),
      });
      const data = (await response.json()) as {
        document?: { id: string; data: CvData; updatedAt: string };
        error?: string;
      };
      if (!response.ok || !data.document) {
        throw new Error(data.error || "Could not create a new CV");
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
      setActiveTab("profile");
      trackEditorEvent("cv_created", data.document.id);
      const params = new URLSearchParams(window.location.search);
      params.delete("new");
      params.delete("roleTemplate");
      params.delete("payment");
      params.set("draftId", data.document.id);
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    } catch (error) {
      setSaveSnapshot((current) => ({
        ...current,
        status: "error",
        error: error instanceof Error ? error.message : "Could not create a new CV",
        errorKind: "general",
      }));
    } finally {
      setCreatingNew(false);
    }
  };

  const startDownload = () => {
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
      if (saved === false) throw new Error("Save your latest changes before downloading.");
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
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cv.fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "workcv"}-cv.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setReviewOpen(false);
      trackEditorEvent("pdf_downloaded", draftId);
    } catch (error) {
      trackEditorEvent("pdf_generation_failed", draftId);
      setCheckoutError(error instanceof Error ? error.message : "PDF generation failed");
    } finally {
      setPdfDownloading(false);
    }
  };

  const continueFromReview = () => {
    trackEditorEvent("checkout_opened", draftId);
    void startCheckout(cv.email);
  };

  const startCheckout = async (email: string) => {
    if (!draftId || !loaded) {
      setCheckoutError("Your draft is still initialising. Please try again.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    trackEditorEvent("payment_started", draftId);

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
          email,
          consentAccepted: true,
          forceNew: forceNewCheckout,
        }),
      });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Checkout unavailable");
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

  const applyImportedCv = (importedCv: CvData) => {
    setCv(importedCv);
    setActiveTab("profile");
    setImportOpen(false);
    trackEditorEvent("import_succeeded", draftId);
  };

  const saveLabel =
    saveSnapshot.status === "saved"
      ? "Saved"
      : saveSnapshot.status === "saving"
        ? "Saving…"
        : saveSnapshot.status === "unsaved"
          ? "Unsaved changes"
          : saveSnapshot.error || "Save failed";

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
  }, [cv, draftId, readiness.score]);

  useEffect(() => {
    if (!paymentState) return;
    const eventByState: Partial<Record<PaymentState, EditorEventName>> = {
      pending: "payment_pending",
      paid: "payment_confirmed",
      failed: "payment_failed",
      cancelled: "payment_cancelled",
    };
    const event = eventByState[paymentState];
    if (event) trackEditorEvent(event, draftId);
  }, [draftId, paymentState]);

  return (
    <div className="print-page bg-paper">
      <section className="editor-chrome border-b border-line bg-surface">
        <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-5 py-5 sm:w-[min(1540px,calc(100%-48px))] sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              CV editor
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-navy md:text-5xl">
              Build your UK CV.
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Fill the guided sections, choose a clean template, and use the live
              preview to keep your CV focused.
            </p>
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
            <button
              type="button"
              onClick={() => {
                trackEditorEvent("template_chooser_opened", draftId);
                setTemplatePickerOpen(true);
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper sm:min-h-10 sm:w-auto sm:px-4"
            >
              <LayoutTemplate className="h-4 w-4" />
              <span className="hidden sm:inline">Template:</span>
              {selectedTemplate?.name ?? "Template"}
            </button>
            <button
              type="button"
              onClick={() => { setJobDescriptionDraft(cv.targeting?.jobDescription || ""); setTailoringOpen((open) => !open); }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper sm:min-h-10 sm:w-auto sm:px-4"
            >
              <Sparkles className="h-4 w-4" />Tailor to job
            </button>
            <div
              className={`rounded-md border px-4 py-2 text-sm ${
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
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper sm:min-h-10 sm:w-auto sm:px-4"
            >
              <Upload className="h-4 w-4" />
              Import CV
            </button>
            <button
              type="button"
              onClick={resetDraft}
              disabled={creatingNew}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60 sm:min-h-10 sm:w-auto sm:px-4"
            >
              <Plus className="h-4 w-4" />
              {creatingNew ? "Creating..." : "New CV"}
            </button>
            <button
              type="button"
              onClick={startDownload}
              disabled={checkoutLoading || paymentState === "checking" || paymentState === "pending"}
              className="col-span-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60 sm:min-h-10 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {paymentState === "checking" || paymentState === "pending"
                ? "Confirming payment…"
                : "Download PDF"}
            </button>
          </div>
        </div>
      </section>

      {tailoringOpen && (
        <section className="editor-chrome border-b border-line bg-[#edf4f8]">
          <div className="mx-auto grid w-[min(1540px,calc(100%-32px))] gap-4 py-5 sm:w-[min(1540px,calc(100%-48px))] lg:grid-cols-[1fr_auto] lg:items-end">
            <label className="block"><span className="text-sm font-bold text-navy">Job description</span><span className="mt-1 block text-xs leading-5 text-muted">Paste the duties and essential criteria. Suggestions only use claims already supported by your CV.</span><textarea value={jobDescriptionDraft} onChange={(event) => setJobDescriptionDraft(event.target.value)} maxLength={5000} rows={5} className="mt-2 w-full rounded-md border border-line bg-white px-3 py-3 text-sm leading-6 text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint" placeholder="Paste the vacancy here..." /></label>
            <div className="flex gap-2"><button type="button" onClick={() => setTailoringOpen(false)} className="min-h-11 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy">Cancel</button><button type="button" onClick={() => {
              if (jobDescriptionDraft.trim().length < 80) { setAiError("Paste at least 80 characters from the vacancy."); return; }
              const analysis = analyseAtsKeywords(jobDescriptionDraft, cvEvidenceText());
              const missing = analysis.missing.slice(0, 3);
              setCv((current) => ({ ...current, targeting: { role: current.targetRole, jobDescription: jobDescriptionDraft.trim(), priorities: missing.map((item) => ({ category: item.category === "Skill or tool" ? "vacancy-relevance" : "evidence", title: item.term, action: `Add this only where your real experience supports it (${item.importance.toLowerCase()} requirement).` })) } }));
              setTailoringOpen(false); setAiError(null); trackEditorEvent("job_tailoring_saved", draftId, { score: analysis.score, missing: analysis.missing.length });
            }} className="min-h-11 rounded-md bg-navy px-4 text-sm font-bold text-white">Analyse vacancy</button></div>
          </div>
        </section>
      )}

      {aiError && (
        <section className="editor-chrome border-b border-red-200 bg-redsoft" aria-live="polite"><div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center justify-between gap-4 py-3 sm:w-[min(1540px,calc(100%-48px))]"><p className="text-sm font-bold text-navy">{aiError}</p><button type="button" onClick={() => setAiError(null)} aria-label="Dismiss message" className="text-navy"><X className="h-5 w-5" /></button></div></section>
      )}
      {aiLoading && (
        <section className="editor-chrome border-b border-line bg-gold-tint" aria-live="polite"><div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-center gap-3 py-3 sm:w-[min(1540px,calc(100%-48px))]"><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/20 border-t-navy" /><p className="text-sm font-bold text-navy">Preparing fact-checked {aiLoading === "profile" ? "profile versions" : "bullet suggestions"}...</p></div></section>
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
                  ? "Payment confirmed — your PDF is ready."
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
            </div>
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
                  trackEditorEvent("checkout_opened", draftId, { retry: true });
                  void startCheckout(cv.email);
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

      {(fitTargeting || fitImportState === "importing" || fitImportError) && (
        <section className="editor-chrome border-b border-line bg-[#edf4f8]">
          <div className="mx-auto w-[min(1540px,calc(100%-32px))] py-5 sm:w-[min(1540px,calc(100%-48px))]">
            {fitImportState === "importing" ? (
              <div className="flex items-center gap-3 text-sm font-bold text-navy">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/25 border-t-navy" />
                Turning your assessed CV into editable fields...
              </div>
            ) : fitImportError ? (
              <div className="flex items-start gap-3 text-sm font-bold leading-6 text-[#8d3030]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                {fitImportError}
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
                <div className="grid gap-4 md:grid-cols-3">
                  {fitTargeting.priorities.map((priority, index) => (
                    <div key={`${priority.category}-${priority.title}`}>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-success">
                        Fix {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-bold text-navy">{priority.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{priority.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      <div className="editor-chrome mx-auto mt-4 flex w-[min(1540px,calc(100%-32px))] rounded-md border border-line bg-white p-1 sm:w-[min(1540px,calc(100%-48px))] lg:hidden" role="group" aria-label="Editor view"><button type="button" onClick={() => { setMobileView("edit"); trackEditorEvent("mobile_view_changed", draftId, { view: "edit" }); }} className={`min-h-10 flex-1 rounded px-3 text-sm font-bold ${mobileView === "edit" ? "bg-navy text-white" : "text-muted"}`}>Edit CV</button><button type="button" onClick={() => { setMobileView("preview"); trackEditorEvent("mobile_view_changed", draftId, { view: "preview" }); }} className={`min-h-10 flex-1 rounded px-3 text-sm font-bold ${mobileView === "preview" ? "bg-navy text-white" : "text-muted"}`}>Preview</button></div>
      <section className="mx-auto grid w-[min(1540px,calc(100%-32px))] gap-6 py-6 sm:w-[min(1540px,calc(100%-48px))] lg:grid-cols-[minmax(480px,0.92fr)_minmax(0,1.08fr)] xl:grid-cols-[minmax(560px,0.95fr)_minmax(0,1.15fr)]">
        <div className={`editor-form min-w-0 ${mobileView === "preview" ? "hidden lg:block" : "block"}`}>
          <div className="sticky top-20 space-y-5">
            <div className="overflow-x-auto rounded-xl border border-line bg-white p-2">
              <div className="flex min-w-max gap-2 xl:grid xl:min-w-0 xl:grid-cols-5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
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
                <TemplateForm cv={cv} updateField={updateField} />
              )}
            </div>
          </div>
        </div>

        <div className={`print-area min-w-0 ${mobileView === "edit" ? "hidden lg:block" : "block"}`}>
          {previewPageCount > 2 && (
            <div className="editor-chrome mb-4 flex flex-col gap-3 rounded-md border border-gold bg-gold-tint p-4 sm:flex-row sm:items-center sm:justify-between" role="status"><div><p className="text-sm font-bold text-navy">Your CV is about {previewPageCount} pages.</p><p className="mt-1 text-xs leading-5 text-muted">Most UK applicants should aim for two pages. Remove older detail or use the Compact template before downloading.</p></div>{cv.template !== "compact" && <button type="button" onClick={() => updateField("template", "compact")} className="min-h-10 shrink-0 rounded-md bg-navy px-4 text-sm font-bold text-white">Use Compact</button>}</div>
          )}
          <div className="cv-preview-viewport rounded-md border border-line bg-[#eef6f3] p-2">
            <div ref={previewRef} className="cv-preview-scale relative">
              <MemoCvDocument cv={cv} />
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
          onConsentAccepted={() =>
            trackEditorEvent("checkout_consent_accepted", draftId)
          }
        />
      )}
      {aiReview && (
        <AiReviewModal review={aiReview} onClose={() => {
          trackEditorEvent("ai_suggestion_rejected", draftId, { section: aiReview.kind });
          setAiReview(null);
        }} onApply={(values) => {
          if (aiReview.kind === "profile") updateField("profile", values[0] || aiReview.original);
          if (aiReview.kind === "bullets" && aiReview.targetId) updateExperience(aiReview.targetId, "bullets", values.join("\n"));
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

function AiReviewModal({ review, onClose, onApply }: { review: AiReview; onClose: () => void; onApply: (values: string[]) => void }) {
  const [selected, setSelected] = useState<number[]>(review.kind === "profile" ? [0] : []);
  const dialogRef = useAccessibleDialog(onClose);
  const toggle = (index: number) => setSelected((current) => review.kind === "profile" ? [index] : current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/50 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="ai-review-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-success">Fact-safe suggestion</p><h2 id="ai-review-title" className="mt-1 font-display text-3xl font-semibold text-navy">{review.title}</h2><p className="mt-2 text-sm leading-6 text-muted">Compare before applying. WorkCV will never apply AI text without your confirmation.</p></div><button type="button" onClick={onClose} aria-label="Close suggestions" className="rounded border border-line p-2 text-muted hover:text-navy"><X className="h-5 w-5" /></button></div>
        {review.original && <div className="mt-5 rounded-md border border-line bg-paper p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Current text</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{review.original}</p></div>}
        <fieldset className="mt-5 space-y-3"><legend className="text-sm font-bold text-navy">{review.kind === "profile" ? "Choose one version" : "Select only accurate suggestions"}</legend>{review.options.map((option, index) => <label key={`${option.label}-${index}`} className={`flex cursor-pointer gap-3 rounded-md border p-4 ${selected.includes(index) ? "border-navy bg-greensoft" : "border-line bg-white"}`}><input type={review.kind === "profile" ? "radio" : "checkbox"} name="ai-option" checked={selected.includes(index)} onChange={() => toggle(index)} className="mt-1 h-4 w-4 accent-navy" /><span><strong className="text-sm text-navy">{option.label}</strong><span className="mt-1 block text-sm leading-6 text-ink">{option.value}</span></span></label>)}</fieldset>
        {review.questions?.length ? <div className="mt-5 rounded-md border border-gold bg-gold-tint p-4"><p className="text-sm font-bold text-navy">Evidence that would strengthen this section</p><ul className="mt-2 space-y-1 text-sm leading-6 text-muted">{review.questions.map((question) => <li key={question}>{question}</li>)}</ul></div> : null}
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="min-h-11 rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy">Keep current text</button><button type="button" disabled={!selected.length} onClick={() => onApply(selected.map((index) => review.options[index].value))} className="min-h-11 rounded-md bg-navy px-5 text-sm font-bold text-white disabled:opacity-50">Apply selected</button></div>
      </div>
    </div>
  );
}

function CheckoutSheet({
  issues,
  checkoutError,
  checkoutLoading,
  onClose,
  onContinue,
  onConsentAccepted,
}: {
  issues: string[];
  checkoutError: string | null;
  checkoutLoading: boolean;
  onClose: () => void;
  onContinue: () => void;
  onConsentAccepted: () => void;
}) {
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
              Download your CV
          </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close checkout" disabled={checkoutLoading} className="rounded border border-line p-2 text-muted hover:text-navy disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-y border-line py-4">
          <div><p className="font-display text-4xl font-semibold text-navy">{site.price}</p><p className="mt-1 text-sm font-bold text-navy">No subscription or renewal</p></div>
          <p className="max-w-44 text-right text-xs leading-5 text-muted">{site.priceTaxInclusive ? "Final total, including applicable tax." : "Applicable tax is calculated and shown by Dodo before payment."}</p>
        </div>

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
          <button type="button" onClick={onContinue} disabled={checkoutLoading || !digitalAccessAccepted} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"><Download className="h-4 w-4" />{checkoutLoading ? "Opening secure checkout..." : `Continue to checkout · ${site.price}`}</button>
          <button type="button" onClick={onClose} disabled={checkoutLoading} className="inline-flex min-h-10 items-center justify-center text-sm font-bold text-muted hover:text-navy disabled:opacity-50">Keep editing</button>
        </div>
      </div>
    </div>
  );
}

function ImportCvModal({
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

function TemplatePickerModal({
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
                      <MemoCvDocument cv={{ ...cv, template: template.id }} compactPreview />
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
