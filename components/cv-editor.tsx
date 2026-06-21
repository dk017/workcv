"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Check,
  Download,
  GraduationCap,
  LayoutTemplate,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";

import {
  CvData,
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

const storageKey = "workcv-editor-draft";
const draftIdKey = "workcv-draft-id";
const saveDelayMs = 650;

type TabId = "profile" | "experience" | "education" | "skills" | "template";

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
  const [saveState, setSaveState] = useState("Loading saved CV...");
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [previewPageCount, setPreviewPageCount] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get("template");
      const roleTemplateParam = params.get("roleTemplate");
      const shouldCreateNew = params.get("new") === "1" && roleTemplateParam;
      const query = templateParam ? `?template=${encodeURIComponent(templateParam)}` : "";

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
          document?: { id: string; data: CvData };
        };
        if (!data.document) throw new Error("Missing CV document");

        if (!cancelled) {
          setDraftId(data.document.id);
          window.localStorage.setItem(draftIdKey, data.document.id);
          window.localStorage.removeItem(storageKey);
          setCv(data.document.data);
          if (shouldCreateNew) {
            params.delete("new");
            const nextUrl = `${window.location.pathname}${
              params.toString() ? `?${params.toString()}` : ""
            }`;
            window.history.replaceState(null, "", nextUrl);
          }
          setSaveState("Saved to your account");
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setSaveState("Could not load your saved CV");
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
    const preview = previewRef.current;
    if (!preview) return;

    let frame = 0;
    const updatePageCount = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const document = preview.querySelector<HTMLElement>(".print-document");
        if (!document) return;
        setPreviewPageCount(Math.max(1, Math.ceil(document.scrollHeight / 1123)));
      });
    };

    const observer = new ResizeObserver(updatePageCount);
    const document = preview.querySelector<HTMLElement>(".print-document");
    if (document) observer.observe(document);
    updatePageCount();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [cv]);

  useEffect(() => {
    if (!draftId) return;

    let cancelled = false;
    const checkPaidStatus = async () => {
      try {
        const response = await fetch(
          `/api/payments/status?draftId=${encodeURIComponent(draftId)}`
        );
        if (!response.ok) return;
        const data = (await response.json()) as { paid?: boolean };
        if (!cancelled && data.paid) {
          setPdfUnlocked(true);

          const params = new URLSearchParams(window.location.search);
          if (params.get("payment") === "success") {
            params.delete("payment");
            params.delete("draftId");
            const nextUrl = `${window.location.pathname}${
              params.toString() ? `?${params.toString()}` : ""
            }`;
            window.history.replaceState(null, "", nextUrl);
            window.setTimeout(() => window.print(), 250);
          }
        }
      } catch {
        if (!cancelled) {
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
    if (!loaded || !draftId) return;

    let cancelled = false;
    const id = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/cv/current", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: draftId, data: cv }),
        });
        if (!response.ok) throw new Error("Save failed");
        if (!cancelled) setSaveState("Saved to your account");
      } catch {
        if (!cancelled) setSaveState("Save failed - retrying on next edit");
      }
    }, saveDelayMs);

    setSaveState("Saving to your account...");
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [cv, draftId, loaded]);

  const completion = useMemo(() => {
    const checks = [
      cv.fullName,
      cv.email,
      cv.phone,
      cv.location,
      cv.profile,
      cv.skills,
      cv.experience.some((item) => item.role && item.company),
      cv.education.some((item) => item.qualification && item.institution),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [cv]);

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

  const resetDraft = async () => {
    setSaveState("Creating a new saved CV...");
    setCheckoutError(null);

    try {
      const response = await fetch("/api/cv/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: cv.template }),
      });
      const data = (await response.json()) as {
        document?: { id: string; data: CvData };
        error?: string;
      };
      if (!response.ok || !data.document) {
        throw new Error(data.error || "Could not create a new CV");
      }

      window.localStorage.removeItem(storageKey);
      window.localStorage.setItem(draftIdKey, data.document.id);
      setDraftId(data.document.id);
      setPdfUnlocked(false);
      setCv(data.document.data);
      setActiveTab("profile");
      setSaveState("Saved to your account");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Could not create a new CV");
    }
  };

  const startDownload = () => {
    if (!pdfUnlocked) {
      setCheckoutOpen(true);
      return;
    }

    window.print();
  };

  const startCheckout = async (email: string) => {
    if (!draftId || !loaded) {
      setCheckoutError("Your draft is still initialising. Please try again.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, email }),
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
    setPdfUnlocked(false);
    setActiveTab("profile");
    setImportOpen(false);
    setSaveState("Saving imported CV...");
  };

  const selectedTemplate = templates.find((template) => template.id === cv.template);

  return (
    <div className="print-page bg-paper">
      <section className="editor-chrome border-b border-line bg-surface">
        <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] flex-col gap-5 py-7 sm:w-[min(1540px,calc(100%-48px))] lg:flex-row lg:items-center lg:justify-between">
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
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setTemplatePickerOpen(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              <LayoutTemplate className="h-4 w-4" />
              <span className="hidden sm:inline">Template:</span>
              {selectedTemplate?.name ?? "Template"}
            </button>
            <div className="rounded-md border border-line bg-paper px-4 py-2 text-sm font-bold text-navy">
              {completion}% complete
            </div>
            <div className="rounded-md border border-line bg-paper px-4 py-2 text-sm text-muted">
              {saveState}
            </div>
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              <Upload className="h-4 w-4" />
              Import CV
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
            >
              <RotateCcw className="h-4 w-4" />
              Reset sample
            </button>
            <button
              type="button"
              onClick={startDownload}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
            >
              <Download className="h-4 w-4" />
              Download CV
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1540px,calc(100%-32px))] gap-6 py-6 sm:w-[min(1540px,calc(100%-48px))] lg:grid-cols-[minmax(480px,0.92fr)_minmax(0,1.08fr)] xl:grid-cols-[minmax(560px,0.95fr)_minmax(0,1.15fr)]">
        <div className="editor-form min-w-0">
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
                <ProfileForm cv={cv} updateField={updateField} />
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
                    setCv((current) => ({
                      ...current,
                      experience: current.experience.filter((item) => item.id !== id),
                    }))
                  }
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
                    setCv((current) => ({
                      ...current,
                      education: current.education.filter((item) => item.id !== id),
                    }))
                  }
                />
              )}
              {activeTab === "skills" && (
                <SkillsForm cv={cv} updateField={updateField} />
              )}
              {activeTab === "template" && (
                <TemplateForm cv={cv} updateField={updateField} />
              )}
            </div>
          </div>
        </div>

        <div className="print-area min-w-0">
          <div className="editor-preview-heading mb-4 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">
                Live preview
              </h2>
              <p className="text-sm text-muted">
                UK format: no photo, no date of birth, no nationality field.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-bold text-navy">
                {previewPageCount} {previewPageCount === 1 ? "page" : "pages"}
              </div>
              <div className="hidden items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-success sm:flex">
                <Save className="h-4 w-4" />
                Local draft
              </div>
            </div>
          </div>
          <div className="cv-preview-viewport rounded-xl border border-line bg-[#eef6f3] p-3 sm:p-5">
            <div ref={previewRef} className="cv-preview-scale relative">
              <CvDocument cv={cv} />
              <div className="cv-page-guides pointer-events-none absolute inset-x-0 top-0" aria-hidden="true">
                {Array.from({ length: previewPageCount }, (_, index) => (
                  <div
                    key={index}
                    className="cv-page-guide absolute inset-x-0"
                    style={{ top: index * 1123, height: 1123 }}
                  >
                    <span>Page {index + 1}</span>
                  </div>
                ))}
              </div>
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
            setTemplatePickerOpen(false);
          }}
        />
      )}
      {importOpen && (
        <ImportCvModal
          template={cv.template}
          onClose={() => setImportOpen(false)}
          onApply={applyImportedCv}
        />
      )}
      {checkoutOpen && (
        <DownloadModal
          defaultEmail={cv.email}
          error={checkoutError}
          loading={checkoutLoading}
          onClose={() => setCheckoutOpen(false)}
          onCheckout={startCheckout}
        />
      )}
    </div>
  );
}

function ImportCvModal({
  template,
  onClose,
  onApply,
}: {
  template: TemplateId;
  onClose: () => void;
  onApply: (cv: CvData) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [importedCv, setImportedCv] = useState<CvData | null>(null);

  const handleFile = async (file: File) => {
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
    <div className="download-modal fixed inset-0 z-50 flex items-center justify-center bg-navy/45 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-line bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Import CV
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
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
            onClick={() => importedCv && onApply(importedCv)}
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
  return (
    <div className="download-modal fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
      <button
        type="button"
        aria-label="Close template selector"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Templates
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-navy sm:text-3xl">
              Switch template without losing your content.
            </h2>
          </div>
          <button
            type="button"
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
                      <CvDocument cv={{ ...cv, template: template.id }} compactPreview />
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

function DownloadModal({
  defaultEmail,
  error,
  loading,
  onClose,
  onCheckout,
}: {
  defaultEmail: string;
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onCheckout: (email: string) => void;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [digitalAccessAccepted, setDigitalAccessAccepted] = useState(false);
  const canSubmit =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && digitalAccessAccepted;

  return (
    <div className="download-modal fixed inset-0 z-50 flex items-center justify-center bg-navy/45 p-4">
      <div className="w-full max-w-lg rounded-xl border border-line bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Final PDF
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
              Unlock your CV download.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-3 py-1 text-sm font-bold text-muted hover:text-navy"
          >
            Close
          </button>
        </div>

        <div className="rounded-xl border-2 border-navy bg-paper p-5">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-semibold text-navy">
              {site.price}
            </span>
            <span className="pb-2 text-sm font-bold uppercase tracking-[0.12em] text-muted">
              once
            </span>
          </div>
          <p className="mt-3 leading-7 text-muted">
            Pay once through secure Dodo checkout. After payment, WorkCV returns
            you to the editor, opens the PDF download dialog, and emails your
            purchase confirmation.
          </p>
          <ul className="mt-5 space-y-3 text-sm font-bold text-navy">
            {[
              "PDF access for this saved CV",
              "Purchase confirmation by email",
              "No subscription",
              "No automatic renewal",
              "Payment unlocks this saved CV",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="h-5 w-5 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-navy">
            Email for receipt and purchase confirmation
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
          />
        </label>

        <label className="mt-4 flex gap-3 rounded-md border border-line bg-surface p-4 text-sm leading-6 text-muted">
          <input
            type="checkbox"
            checked={digitalAccessAccepted}
            onChange={(event) => setDigitalAccessAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-navy"
          />
          <span>
            I want immediate digital access after payment and understand that
            once PDF access starts my cancellation rights may be affected. This
            does not affect statutory rights for faulty or misdescribed digital
            content. See the{" "}
            <a className="font-bold text-navy underline" href="/refund-policy">
              refund policy
            </a>
            .
          </span>
        </label>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-redsoft px-4 py-3 text-sm font-bold leading-6 text-navy">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onCheckout(email)}
            disabled={!canSubmit || loading}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Download className="h-4 w-4" />
            {loading ? "Opening checkout..." : "Pay and unlock PDF"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:bg-paper"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({
  cv,
  updateField,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
}) {
  return (
    <FormSection
      title="Profile and contact"
      description="Use UK-friendly contact details. Keep the profile direct and role-focused."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={cv.fullName}
          onChange={(value) => updateField("fullName", value)}
          placeholder="e.g. Emily Thompson"
        />
        <TextField
          label="Target role"
          value={cv.targetRole}
          onChange={(value) => updateField("targetRole", value)}
          placeholder="e.g. Customer Service Assistant"
        />
        <TextField
          label="Email"
          value={cv.email}
          onChange={(value) => updateField("email", value)}
          placeholder="e.g. emily.thompson@email.co.uk"
        />
        <TextField
          label="Phone"
          value={cv.phone}
          onChange={(value) => updateField("phone", value)}
          placeholder="e.g. 07123 456 789"
        />
        <TextField
          label="Location"
          value={cv.location}
          onChange={(value) => updateField("location", value)}
          placeholder="e.g. Leeds, UK"
        />
        <TextField
          label="LinkedIn or portfolio"
          value={cv.linkedin}
          onChange={(value) => updateField("linkedin", value)}
          placeholder="e.g. linkedin.com/in/emilythompson"
        />
      </div>
      <TextArea
        label="Personal profile"
        rows={6}
        value={cv.profile}
        onChange={(value) => updateField("profile", value)}
        placeholder="Summarise your experience, strengths and the role you are targeting in 3–4 concise sentences."
      />
    </FormSection>
  );
}

function ExperienceForm({
  cv,
  updateExperience,
  addExperience,
  removeExperience,
}: {
  cv: CvData;
  updateExperience: (id: string, key: keyof ExperienceItem, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
}) {
  return (
    <FormSection
      title="Experience"
      description="List most recent experience first. Use bullets that show what you did and how you worked."
      action={
        <SmallButton onClick={addExperience}>
          <Plus className="h-4 w-4" />
          Add role
        </SmallButton>
      }
    >
      <div className="space-y-5">
        {cv.experience.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-line bg-paper p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-bold text-navy">Role {index + 1}</h3>
              {cv.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(item.id)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-navy"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Role"
                value={item.role}
                onChange={(value) => updateExperience(item.id, "role", value)}
                placeholder="e.g. Retail Assistant"
              />
              <TextField
                label="Company"
                value={item.company}
                onChange={(value) => updateExperience(item.id, "company", value)}
                placeholder="e.g. North Street Books"
              />
              <TextField
                label="Location"
                value={item.location}
                onChange={(value) => updateExperience(item.id, "location", value)}
                placeholder="e.g. Leeds"
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Start"
                  value={item.start}
                  onChange={(value) => updateExperience(item.id, "start", value)}
                  placeholder="e.g. Jun 2024"
                />
                <TextField
                  label="End"
                  value={item.end}
                  onChange={(value) => updateExperience(item.id, "end", value)}
                  placeholder="e.g. Present"
                />
              </div>
            </div>
            <TextArea
              label="Bullet points"
              rows={5}
              value={item.bullets}
              onChange={(value) => updateExperience(item.id, "bullets", value)}
              placeholder="Add one achievement or responsibility per line. Start with a strong action verb."
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}

function EducationForm({
  cv,
  updateEducation,
  addEducation,
  removeEducation,
}: {
  cv: CvData;
  updateEducation: (id: string, key: keyof EducationItem, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
}) {
  return (
    <FormSection
      title="Education"
      description="For students and school leavers, education can come before work history in the final template."
      action={
        <SmallButton onClick={addEducation}>
          <Plus className="h-4 w-4" />
          Add education
        </SmallButton>
      }
    >
      <div className="space-y-5">
        {cv.education.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-line bg-paper p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-bold text-navy">Education {index + 1}</h3>
              {cv.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(item.id)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-navy"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Qualification"
                value={item.qualification}
                onChange={(value) => updateEducation(item.id, "qualification", value)}
                placeholder="e.g. BA Business Management"
              />
              <TextField
                label="Institution"
                value={item.institution}
                onChange={(value) => updateEducation(item.id, "institution", value)}
                placeholder="e.g. University of Leeds"
              />
              <TextField
                label="Location"
                value={item.location}
                onChange={(value) => updateEducation(item.id, "location", value)}
                placeholder="e.g. Leeds"
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Start"
                  value={item.start}
                  onChange={(value) => updateEducation(item.id, "start", value)}
                  placeholder="e.g. 2021"
                />
                <TextField
                  label="End"
                  value={item.end}
                  onChange={(value) => updateEducation(item.id, "end", value)}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <TextArea
              label="Details"
              rows={4}
              value={item.details}
              onChange={(value) => updateEducation(item.id, "details", value)}
              placeholder="Add relevant modules, projects, grades or achievements."
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}

function SkillsForm({
  cv,
  updateField,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
}) {
  return (
    <FormSection
      title="Skills"
      description="Add one skill per line. Keep them concrete and relevant to the role."
    >
      <TextArea
        label="Skills"
        rows={10}
        value={cv.skills}
        onChange={(value) => updateField("skills", value)}
        placeholder={"Customer service\nMicrosoft Excel\nTeam communication"}
      />
    </FormSection>
  );
}

function TemplateForm({
  cv,
  updateField,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
}) {
  return (
    <FormSection
      title="Template"
      description="Switch template style without losing your CV content."
    >
      <div className="grid gap-3">
        {templates.map((template) => {
          const active = cv.template === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => updateField("template", template.id)}
              className={`rounded-lg border p-4 text-left transition ${
                active
                  ? "border-navy bg-greensoft"
                  : "border-line bg-paper hover:border-line-strong"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{template.description}</p>
                </div>
                {active && <Check className="h-5 w-5 text-success" />}
              </div>
            </button>
          );
        })}
      </div>
    </FormSection>
  );
}

function FormSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-navy">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-navy">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-md border border-line bg-white px-3 py-3 text-sm leading-6 text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
      />
    </label>
  );
}

function SmallButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-navy px-3 text-sm font-bold text-white hover:bg-navy-hover"
    >
      {children}
    </button>
  );
}

export function CvDocument({
  cv,
  compactPreview = false,
}: {
  cv: CvData;
  compactPreview?: boolean;
}) {
  const baseClass = `print-document mx-auto min-h-[1123px] w-full max-w-[794px] bg-white shadow-soft ring-1 ring-line ${
    compactPreview ? "shadow-none" : ""
  }`;

  if (cv.template === "modern") {
    return <ModernCvDocument cv={cv} baseClass={baseClass} />;
  }

  if (cv.template === "compact") {
    return <CompactCvDocument cv={cv} baseClass={baseClass} />;
  }

  return <ClassicCvDocument cv={cv} baseClass={baseClass} />;
}

function CvSection({
  title,
  children,
  compact,
  template,
}: {
  title: string;
  children: React.ReactNode;
  compact: boolean;
  template: TemplateId;
}) {
  const headingClass =
    template === "modern"
      ? "mb-4 border-l-4 border-gold bg-[#fbf6e8] px-3 py-2 text-sm font-bold uppercase tracking-[0.16em] text-navy"
      : template === "compact"
        ? "mb-2 border-b border-line pb-1 text-xs font-bold uppercase tracking-[0.14em] text-navy"
        : "mb-3 border-b border-line pb-2 text-sm font-bold uppercase tracking-[0.16em] text-navy";

  return (
    <section className={compact ? "mt-6" : "mt-8"}>
      <h3 className={headingClass}>{title}</h3>
      {children}
    </section>
  );
}

function ClassicCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-classic border-t-[10px] border-navy px-12 py-12`}
      data-template="classic"
    >
      <header className="cv-header border-b-2 border-navy pb-7 text-center">
        <h2 className="cv-name font-display text-5xl font-semibold leading-tight text-navy">
          {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
        </h2>
        <p className="mt-3 text-lg font-bold text-ink">
          {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
        </p>
        <ContactLine cv={cv} align="center" />
      </header>
      <CvBody cv={cv} template="classic" />
    </article>
  );
}

function ModernCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-modern grid grid-cols-[230px_minmax(0,1fr)] overflow-hidden border-l-[10px] border-gold`}
      data-template="modern"
    >
      <aside className="cv-sidebar bg-navy px-7 py-10 text-white">
        <h2 className="cv-name font-display text-4xl font-semibold leading-tight">
          {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
        </h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-gold-tint">
          {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
        </p>
        <div className="mt-8 space-y-5 text-sm leading-6 text-white/85">
          <SidebarBlock title="Contact">
            {[cv.email, cv.phone, cv.location, cv.linkedin].some(Boolean) ? (
              [cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((item) => (
                <p key={item} className="break-words">{item}</p>
              ))
            ) : (
              <PreviewPlaceholder>Add email, phone and location</PreviewPlaceholder>
            )}
          </SidebarBlock>
          <SidebarBlock title="Skills">
            {lines(cv.skills).length > 0 ? (
              <ul className="space-y-2">
                {lines(cv.skills).map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : (
              <PreviewPlaceholder>Add role-relevant skills</PreviewPlaceholder>
            )}
          </SidebarBlock>
        </div>
      </aside>
      <main className="min-w-0 px-10 py-10">
        <CvSection title="Profile" compact={false} template="modern">
          <p className="leading-7 text-ink">
            {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
          </p>
        </CvSection>
        <ExperienceContent cv={cv} template="modern" />
        <EducationContent cv={cv} template="modern" />
      </main>
    </article>
  );
}

function CompactCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-compact border-t-[6px] border-line-strong px-10 py-9 text-[13px]`}
      data-template="compact"
    >
      <header className="cv-header grid gap-4 border-b-2 border-navy pb-4 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 className="cv-name font-display text-4xl font-semibold leading-tight text-navy">
            {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
          </h2>
          <p className="mt-1 text-base font-bold text-ink">
            {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
          </p>
        </div>
        <ContactLine cv={cv} align="right" compact />
      </header>
      <div className="grid gap-8 pt-2 md:grid-cols-[minmax(0,1fr)_220px]">
        <main className="min-w-0">
          <CvSection title="Profile" compact template="compact">
            <p className="leading-6 text-ink">
              {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
            </p>
          </CvSection>
          <ExperienceContent cv={cv} template="compact" />
          <EducationContent cv={cv} template="compact" />
        </main>
        <aside>
          <CvSection title="Skills" compact template="compact">
            <SkillsList cv={cv} compact />
          </CvSection>
        </aside>
      </div>
    </article>
  );
}

function CvBody({ cv, template }: { cv: CvData; template: TemplateId }) {
  return (
    <>
      <CvSection title="Profile" compact={false} template={template}>
        <p className="leading-7 text-ink">
          {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
        </p>
      </CvSection>
      <ExperienceContent cv={cv} template={template} />
      <EducationContent cv={cv} template={template} />
      <CvSection title="Skills" compact={false} template={template}>
        <SkillsList cv={cv} />
      </CvSection>
    </>
  );
}

function ExperienceContent({ cv, template }: { cv: CvData; template: TemplateId }) {
  const compact = template === "compact";
  return (
    <CvSection title="Experience" compact={compact} template={template}>
      <div className={compact ? "space-y-4" : "space-y-6"}>
        {cv.experience.map((item) => (
          <Entry
            key={item.id}
            title={item.role || <PreviewPlaceholder>Role title</PreviewPlaceholder>}
            subtitle={
              [item.company, item.location].filter(Boolean).join(" | ") || (
                <PreviewPlaceholder>Company and location</PreviewPlaceholder>
              )
            }
            dates={
              [item.start, item.end].filter(Boolean).join(" - ") || (
                <PreviewPlaceholder>Start – End</PreviewPlaceholder>
              )
            }
            bullets={lines(item.bullets)}
            emptyBulletsLabel="Add achievements and responsibilities."
            compact={compact}
          />
        ))}
      </div>
    </CvSection>
  );
}

function EducationContent({ cv, template }: { cv: CvData; template: TemplateId }) {
  const compact = template === "compact";
  return (
    <CvSection title="Education" compact={compact} template={template}>
      <div className={compact ? "space-y-4" : "space-y-5"}>
        {cv.education.map((item) => (
          <Entry
            key={item.id}
            title={item.qualification || <PreviewPlaceholder>Qualification</PreviewPlaceholder>}
            subtitle={
              [item.institution, item.location].filter(Boolean).join(" | ") || (
                <PreviewPlaceholder>Institution and location</PreviewPlaceholder>
              )
            }
            dates={
              [item.start, item.end].filter(Boolean).join(" - ") || (
                <PreviewPlaceholder>Start – End</PreviewPlaceholder>
              )
            }
            bullets={item.details ? [item.details] : []}
            emptyBulletsLabel="Add relevant study details or achievements."
            compact={compact}
          />
        ))}
      </div>
    </CvSection>
  );
}

function SkillsList({ cv, compact = false }: { cv: CvData; compact?: boolean }) {
  const skillItems = lines(cv.skills);
  return (
    <ul className={`cv-skills-list ${compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}`}>
      {skillItems.length > 0 ? (
        skillItems.map((skill) => (
          <li key={skill} className="flex gap-2 text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {skill}
          </li>
        ))
      ) : (
        <li><PreviewPlaceholder>Add your skills in the editor.</PreviewPlaceholder></li>
      )}
    </ul>
  );
}

function ContactLine({
  cv,
  align,
  compact = false,
}: {
  cv: CvData;
  align: "center" | "right";
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted ${
        align === "center" ? "justify-center" : "justify-start sm:justify-end sm:text-right"
      } ${compact ? "max-w-[260px] text-xs leading-5" : ""}`}
    >
      {[cv.email, cv.phone, cv.location, cv.linkedin].some(Boolean) ? (
        [cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((item) => (
          <span key={item} className="min-w-0 overflow-wrap-anywhere">{item}</span>
        ))
      ) : (
        <PreviewPlaceholder>Add email, phone and location</PreviewPlaceholder>
      )}
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 border-b border-white/25 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-tint">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Entry({
  title,
  subtitle,
  dates,
  bullets,
  emptyBulletsLabel,
  compact = false,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  dates: React.ReactNode;
  bullets: string[];
  emptyBulletsLabel: string;
  compact?: boolean;
}) {
  return (
    <div className="cv-entry min-w-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="font-bold text-navy">{title}</h4>
          <p className="text-sm font-bold text-ink">{subtitle}</p>
        </div>
        <p className="cv-entry-dates shrink-0 whitespace-nowrap text-sm text-muted">{dates}</p>
      </div>
      {bullets.length > 0 && (
        <ul className={compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2"}>
          {bullets.map((bullet) => (
            <li key={bullet} className={`flex gap-2 text-ink ${compact ? "leading-6" : "leading-7"}`}>
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {bullets.length === 0 && (
        <p className={compact ? "mt-2" : "mt-3"}>
          <PreviewPlaceholder>{emptyBulletsLabel}</PreviewPlaceholder>
        </p>
      )}
    </div>
  );
}

function PreviewPlaceholder({ children }: { children: React.ReactNode }) {
  return <span className="cv-placeholder italic opacity-50">{children}</span>;
}
