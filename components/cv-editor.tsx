"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, Download, Eye, FileText, LayoutTemplate, Mail, Menu, Plus, SlidersHorizontal, Sparkles, Undo2, Upload, X } from "lucide-react";

import { AppMenuDrawer, AppRail } from "@/components/app/app-rail";
import { MemoCvDocument } from "@/components/editor/cv-document";
import { CoverLetterDocument } from "@/components/editor/cover-letter-document";
import { CoverLetterForm } from "@/components/editor/cover-letter-form";
import { ApplicationPackReview, CvStructureForm } from "@/components/editor/cv-structure-form";
import { ContactStep, EducationStep, ProfileStep, RoleStep, SkillsStep, StepHeading } from "@/components/editor/editor-forms";
import { DesignToolbar } from "@/components/editor/design-toolbar";
import { AiReviewModal, CheckoutSheet, ImportCvModal, TemplatePickerModal } from "@/components/editor/editor-modals";
import { AdvertWords, EditorNotices, EntryList, FinishStep, ImportCard, ReadinessCard, TailorCard, readinessLabel } from "@/components/editor/editor-panels";
import { KeywordTriagePanel } from "@/components/editor/keyword-triage";
import { PurposeSurvey } from "@/components/editor/purpose-survey";
import { nextStep, parseStep, previousStep, stepComplete, stepForCvSection, stepIndex, stepLabel, steps, type StepId } from "@/components/editor/steps";
import { useCvEditor } from "@/components/editor/use-cv-editor";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { cvPapers, resolveCvDesign } from "@/lib/cv-design";
import { cvDisplayTitle } from "@/lib/cv-label";
import { emptyEducation, emptyExperience, lines } from "@/lib/editor-data";
import { trackEditorEvent } from "@/lib/editor-events";
import { vacancyTargeting } from "@/lib/job-tailor";
import { addSkillLine, addSkippedKeyword } from "@/lib/keyword-triage";

export { CvDocument } from "@/components/editor/cv-document";

const menuItem = "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60";
const closeMenuDetails = (event: React.MouseEvent<HTMLElement>) => event.currentTarget.closest("details")?.removeAttribute("open");

export function CvEditor() {
  const editor = useCvEditor();
  const {
    cv,
    setCv,
    step,
    setStep,
    saveSnapshot,
    saveLabel,
    saveManagerRef,
    pdfUnlocked,
    draftId,
    loaded,
    passStatus,
    readiness,
    aiLoading,
    aiReview,
    setAiReview,
    tailoringOpen,
    setTailoringOpen,
    jobDescriptionDraft,
    setJobDescriptionDraft,
    setAiError,
    creatingNew,
    previewRef,
    previewPageCount,
    previewOpen,
    setPreviewOpen,
    fitMessage,
    changeDesign,
    resetDesign,
    fitToPages,
    mobileView,
    setMobileView,
    keywordTriage,
    vaguePhrases,
    progress,
    fitTargeting,
    prioritiesAreActions,
    visiblePriorities,
    selectedTemplate,
    templatePickerOpen,
    setTemplatePickerOpen,
    importOpen,
    setImportOpen,
    reviewOpen,
    setReviewOpen,
    checkoutError,
    checkoutLoading,
    checkoutPlan,
    setCheckoutPlan,
    upgradeOffer,
    purposeSurveyOpen,
    setPurposeSurveyOpen,
    undoLabel,
    undoRef,
    pdfDownloading,
    docxDownloading,
    letterDownloading,
    updateField,
    updateExperience,
    updateEducation,
    removeExperienceWithUndo,
    removeEducationWithUndo,
    moveEntry,
    improveProfile,
    improveBullets,
    rewriteBullet,
    suggestSkills,
    setSkippedKeywords,
    markRequirementAnswered,
    rewriteVaguePhrase,
    cvEvidenceText,
    resetDraft,
    startDownload,
    downloadDocx,
    downloadCoverLetter,
    continueFromReview,
    applyImportedCv,
  } = editor;

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(null);
  const [designOpen, setDesignOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // On Finish the page can show the CV or its cover letter.
  const [finishDocument, setFinishDocument] = useState<"cv" | "letter">("cv");

  const role = cv.experience.find((item) => item.id === selectedRoleId) ?? cv.experience[0];
  const roleIndex = role ? cv.experience.indexOf(role) : 0;
  const education = cv.education.find((item) => item.id === selectedEducationId) ?? cv.education[0];
  const educationIndex = education ? cv.education.indexOf(education) : 0;
  const next = nextStep(step);
  const previous = previousStep(step);
  // Finish puts the page in the middle with the design toolbar above it.
  const finishing = step === "finish";
  // The page is only on screen at Finish, or when the user opens Preview.
  const pageDocument = finishing ? finishDocument : step === "letter" ? "letter" : "cv";
  const pageClickable = finishing || previewOpen;

  // The step lives in the URL so refresh and the browser Back button keep your place.
  useEffect(() => {
    const fromUrl = () => parseStep(new URLSearchParams(window.location.search).get("step"));
    const initial = fromUrl();
    if (initial) setStep(initial);
    const onPopState = () => setStep(fromUrl() ?? "contact");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setStep]);

  // Only after loading: until then the address may hold the step this page was opened at.
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") === step) return;
    params.set("step", step);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
  }, [loaded, step]);

  // Keep the current step in view in the scrolling step bar on narrow screens.
  useEffect(() => {
    const current = document.querySelector<HTMLElement>('nav[aria-label="CV steps"] [aria-current="step"]');
    const bar = current?.closest("nav");
    if (!current || !bar || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: current.offsetLeft - (bar.clientWidth - current.offsetWidth) / 2 });
  }, [step, loaded]);

  const goToStep = (target: StepId, entryId?: string) => {
    if (target === "letter" && step !== "letter") trackEditorEvent("cover_letter_opened", draftId);
    if (entryId && target === "experience") setSelectedRoleId(entryId);
    if (entryId && target === "education") setSelectedEducationId(entryId);
    if (target !== step) {
      const params = new URLSearchParams(window.location.search);
      params.set("step", target);
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
    setStep(target);
    setPreviewOpen(false);
    setMobileView("edit");
    window.scrollTo({ top: 0 });
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closePreview = useCallback(() => setPreviewOpen(false), [setPreviewOpen]);
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closePreview(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen, closePreview]);

  const leaveEditor = (event: React.MouseEvent<HTMLElement>, href: string) => {
    if (!saveManagerRef.current?.hasUnsavedChanges()) return;
    event.preventDefault();
    void saveManagerRef.current.flush().then((saved) => {
      if (saved) window.location.href = href;
    });
  };

  const addRole = () => {
    const item = emptyExperience();
    setCv((current) => ({ ...current, experience: [...current.experience, item] }));
    setSelectedRoleId(item.id);
  };
  const addEducation = () => {
    const item = emptyEducation();
    setCv((current) => ({ ...current, education: [...current.education, item] }));
    setSelectedEducationId(item.id);
  };

  const analyseVacancy = () => {
    if (jobDescriptionDraft.trim().length < 80) {
      setAiError("Paste at least 80 characters from the vacancy.");
      return;
    }
    const analysis = vacancyTargeting(cv.targetRole, jobDescriptionDraft, cvEvidenceText());
    setCv((current) => ({ ...current, targeting: { ...analysis.targeting, role: current.targetRole } }));
    setTailoringOpen(false);
    setAiError(null);
    trackEditorEvent("job_tailoring_saved", draftId, { score: analysis.score, missing: analysis.missing });
  };

  const openAdvert = () => {
    setJobDescriptionDraft(cv.targeting?.jobDescription || "");
    setTailoringOpen(true);
    setMobileView("edit");
    window.scrollTo({ top: 0 });
  };

  // On Finish, clicking part of the page opens the step that edits it.
  const openSectionFromPage = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pageClickable) return;
    const clicked = event.target as HTMLElement;
    if (clicked.closest(".letter-document")) {
      goToStep("letter");
      return;
    }
    const part = clicked.closest<HTMLElement>(".cv-header, .cv-section, [data-cv-section], .cv-template-modern .cv-name");
    if (!part) return;
    const section = part.dataset.cvSection
      ?? (part.matches(".cv-header, .cv-name") ? "header" : Array.from(part.classList).find((name) => name.startsWith("cv-section-"))?.slice("cv-section-".length) ?? "");
    const target = stepForCvSection(section);
    const entry = clicked.closest(".cv-entry");
    const index = entry ? Array.from(part.querySelectorAll(".cv-entry")).indexOf(entry) : -1;
    const entryId = target === "experience" ? cv.experience[index]?.id : target === "education" ? cv.education[index]?.id : undefined;
    goToStep(target, entryId);
  };

  const cvTitle = cvDisplayTitle(cv);
  const saveTone = saveSnapshot.status === "error" ? "text-[#8d3030] font-bold" : "text-muted";

  const advertPanel = (
    <section aria-labelledby="advert-heading" className="space-y-3 rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div>
        <h2 id="advert-heading" className="font-extrabold text-navy">{cv.targeting ? "Change the job advert" : "Applying for a specific job?"}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">Paste the duties and essential criteria. Suggestions only use claims already supported by your CV.</p>
      </div>
      <label className="sr-only" htmlFor="job-advert">Job advert</label>
      <textarea
        id="job-advert"
        value={jobDescriptionDraft}
        onChange={(event) => setJobDescriptionDraft(event.target.value)}
        maxLength={5000}
        rows={5}
        placeholder="Paste the vacancy here..."
        className="w-full rounded-lg border border-line-strong bg-white px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint"
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={analyseVacancy} className="inline-flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">Analyse vacancy</button>
        {(tailoringOpen || cv.targeting) && (
          <button type="button" onClick={() => setTailoringOpen(false)} className="inline-flex min-h-11 items-center rounded-lg border border-line-strong bg-white px-4 text-sm font-bold text-navy">Cancel</button>
        )}
      </div>
    </section>
  );

  const stepContent = () => {
    switch (step) {
      case "contact":
        return (
          <div className="space-y-6">
            <StepHeading eyebrow="Contact" title="How should employers reach you?" intro="UK CVs don’t need a photo, date of birth or full address. Your town is enough." />
            <ContactStep cv={cv} updateField={updateField} />
            {!cv.targeting && !tailoringOpen && advertPanel}
            {cv.targeting && !tailoringOpen && <TailorCard editor={editor} onOpenAdvert={openAdvert} />}
          </div>
        );
      case "experience":
        return (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden" role="group" aria-label="Your roles">
              {cv.experience.map((item, index) => (
                <button key={item.id} type="button" aria-pressed={item.id === role?.id} onClick={() => setSelectedRoleId(item.id)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${item.id === role?.id ? "bg-navy text-white" : "border border-line-strong text-navy"}`}>
                  {item.role.trim() || `Role ${index + 1}`}
                </button>
              ))}
              <button type="button" onClick={addRole} aria-label="Add a role" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-line-strong text-navy"><Plus className="h-4 w-4" /></button>
            </div>
            {role && (
              <RoleStep
                item={role}
                index={roleIndex}
                total={cv.experience.length}
                updateExperience={updateExperience}
                removeExperience={(id) => {
                  setSelectedRoleId(cv.experience[Math.max(0, roleIndex - 1)]?.id ?? null);
                  removeExperienceWithUndo(id);
                }}
                moveExperience={(index, direction) => moveEntry("experience", index, direction)}
                onImproveBullets={(id) => void improveBullets(id)}
                onRewriteBullet={(id, index) => void rewriteBullet(id, index)}
                assistanceBusy={Boolean(aiLoading)}
              />
            )}
            {keywordTriage && progress && (
              <section aria-labelledby="advert-keywords" className="rounded-2xl border border-green-200 bg-greensoft p-4 sm:p-5">
                <h2 id="advert-keywords" className="text-xs font-bold uppercase tracking-[0.08em] text-green-800">From the {fitTargeting?.role || cv.targeting?.role || "job"} advert</h2>
                <KeywordTriagePanel
                  triage={keywordTriage}
                  phrases={vaguePhrases}
                  progress={progress}
                  experience={cv.experience}
                  busy={Boolean(aiLoading)}
                  onAddSkill={(term) => { updateField("skills", addSkillLine(cv.skills, term)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skills" }); }}
                  onSkipKeyword={(term) => { setSkippedKeywords((current) => addSkippedKeyword(current, term)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skip" }); }}
                  onSkipRequirement={(requirement) => { setSkippedKeywords((current) => addSkippedKeyword(current, requirement)); trackEditorEvent("keyword_triage_answered", draftId, { answer: "skip_requirement" }); }}
                  onResetSkipped={() => setSkippedKeywords(() => [])}
                  onRewritePhrase={rewriteVaguePhrase}
                  onDraftBullet={({ roleId, note, keyword, requirement }) => {
                    const target = cv.experience.find((item) => item.id === roleId);
                    trackEditorEvent("keyword_triage_answered", draftId, { answer: requirement ? "requirement_bullet" : "bullet" });
                    void rewriteBullet(roleId, target ? target.bullets.split("\n").length : 0, [], { text: note, keyword, requirement });
                  }}
                />
              </section>
            )}
            {fitTargeting && fitTargeting.priorities.length > 0 && (
              <details className="rounded-2xl border border-line p-4 text-sm" open={!prioritiesAreActions}>
                <summary className="cursor-pointer font-bold text-navy">The CV checker’s top fixes for {fitTargeting.role}</summary>
                <ol className="mt-3 grid gap-3 sm:grid-cols-3">
                  {(prioritiesAreActions ? fitTargeting.priorities : visiblePriorities).map((priority) => (
                    <li key={`${priority.category}-${priority.title}`}>
                      <p className="font-bold text-navy">{priority.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{priority.action}</p>
                    </li>
                  ))}
                </ol>
              </details>
            )}
            <ApplicationPackReview cv={cv} onChange={setCv} />
          </div>
        );
      case "education":
        return (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden" role="group" aria-label="Your qualifications">
              {cv.education.map((item, index) => (
                <button key={item.id} type="button" aria-pressed={item.id === education?.id} onClick={() => setSelectedEducationId(item.id)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${item.id === education?.id ? "bg-navy text-white" : "border border-line-strong text-navy"}`}>
                  {item.qualification.trim() || `Qualification ${index + 1}`}
                </button>
              ))}
              <button type="button" onClick={addEducation} aria-label="Add a qualification" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-line-strong text-navy"><Plus className="h-4 w-4" /></button>
            </div>
            {education && (
              <EducationStep
                item={education}
                index={educationIndex}
                total={cv.education.length}
                updateEducation={updateEducation}
                removeEducation={(id) => {
                  setSelectedEducationId(cv.education[Math.max(0, educationIndex - 1)]?.id ?? null);
                  removeEducationWithUndo(id);
                }}
                moveEducation={(index, direction) => moveEntry("education", index, direction)}
              />
            )}
          </div>
        );
      case "skills":
        return (
          <div className="space-y-6">
            <StepHeading eyebrow="Skills" title="What are you good at?" intro="Add the skills you’d be happy to talk about in an interview." />
            <SkillsStep cv={cv} updateField={updateField} onSuggestSkills={suggestSkills} assistanceBusy={Boolean(aiLoading)} />
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <StepHeading eyebrow="Profile" title="Sum yourself up in two or three lines" intro="Now that your experience is in, say who you are, what you’re good at and the role you want." />
            <ProfileStep cv={cv} updateField={updateField} onImproveProfile={() => void improveProfile()} assistanceBusy={Boolean(aiLoading)} />
          </div>
        );
      case "more":
        return (
          <div className="space-y-6">
            <StepHeading eyebrow="More sections · optional" title="Anything else worth showing?" intro="Add only what’s real and relevant. Sections you leave empty don’t appear on your CV." />
            <CvStructureForm cv={cv} onChange={setCv} onPreview={() => setPreviewOpen(true)} />
          </div>
        );
      case "letter":
        return (
          <CoverLetterForm
            cv={cv}
            onChange={setCv}
            onEvent={(eventName) => trackEditorEvent(eventName, draftId)}
            downloadUnlocked={pdfUnlocked}
            downloading={letterDownloading}
            onDownload={(format) => void downloadCoverLetter(format)}
          />
        );
      case "finish":
        return (
          <div className="space-y-6">
            <StepHeading
              eyebrow="Finish and download"
              title={readiness.ready ? "Your CV and letter are ready" : "Nearly there"}
              intro="Check each page, change the design on the page if you like, then download both as PDF and Word."
            />
            <FinishStep editor={editor} onGoTo={goToStep} />
            <button type="button" onClick={() => { setMobileView("preview"); setDesignOpen(true); window.scrollTo({ top: 0 }); }} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-white font-bold text-navy lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Change fonts, spacing and colour
            </button>
            {cv.targeting && <TailorCard editor={editor} onOpenAdvert={openAdvert} />}
          </div>
        );
    }
  };

  const railContent = () => {
    switch (step) {
      case "contact":
        return <ImportCard onImport={() => setImportOpen(true)} />;
      case "experience":
        return (
          <>
            <EntryList
              heading="Your roles"
              items={cv.experience.map((item, index) => ({
                id: item.id,
                title: item.role.trim() || `Role ${index + 1}`,
                detail: [item.company.trim(), [item.start, item.end].filter((value) => value.trim()).join(" – ")].filter(Boolean).join(" · "),
              }))}
              selectedId={role?.id ?? null}
              onSelect={setSelectedRoleId}
              onAdd={addRole}
              addLabel="Add a role"
            />
            <TailorCard editor={editor} onOpenAdvert={openAdvert} />
          </>
        );
      case "education":
        return (
          <EntryList
            heading="Your qualifications"
            items={cv.education.map((item, index) => ({
              id: item.id,
              title: item.qualification.trim() || `Qualification ${index + 1}`,
              detail: [item.institution.trim(), [item.start, item.end].filter((value) => value.trim()).join(" – ")].filter(Boolean).join(" · "),
            }))}
            selectedId={education?.id ?? null}
            onSelect={setSelectedEducationId}
            onAdd={addEducation}
            addLabel="Add a qualification"
          />
        );
      case "skills":
      case "profile":
        return keywordTriage ? <AdvertWords editor={editor} /> : <TailorCard editor={editor} onOpenAdvert={openAdvert} />;
      default:
        return null;
    }
  };

  const cvMenuItems = (close: (event: React.MouseEvent<HTMLElement>) => void) => (
    <>
      <Link href="/my-cvs" onClick={(event) => leaveEditor(event, "/my-cvs")} className={menuItem}><FileText className="h-4 w-4" />All my CVs</Link>
      <button type="button" onClick={(event) => { close(event); trackEditorEvent("template_chooser_opened", draftId); setTemplatePickerOpen(true); }} className={menuItem}>
        <LayoutTemplate className="h-4 w-4" />
        Template: {selectedTemplate?.name ?? "Choose"}
      </button>
      <button type="button" onClick={(event) => { close(event); openAdvert(); }} className={menuItem}><Sparkles className="h-4 w-4" />Tailor to job</button>
      <button type="button" onClick={(event) => { close(event); setImportOpen(true); }} className={menuItem}><Upload className="h-4 w-4" />Import CV</button>
      <button type="button" onClick={(event) => { close(event); void resetDraft(); }} disabled={creatingNew} className={menuItem}><Plus className="h-4 w-4" />{creatingNew ? "Creating..." : "New CV"}</button>
      <button type="button" onClick={(event) => { close(event); if (draftId) void resetDraft(draftId); }} disabled={creatingNew || !draftId} className={menuItem}><Copy className="h-4 w-4" />Duplicate for another job</button>
    </>
  );

  const paperLabel = cvPapers[resolveCvDesign(cv.design).paper].label;
  const pageArea = (
    <>
      {finishing && loaded && (
        <div className="editor-chrome px-4 pt-4 sm:px-6">
          <button type="button" aria-expanded={designOpen} onClick={() => setDesignOpen((open) => !open)} className="mb-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-white font-bold text-navy lg:hidden">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />{designOpen ? "Hide design settings" : "Design"}
          </button>
          <div className={`${designOpen ? "block" : "hidden"} lg:block`}>
            <DesignToolbar
              template={cv.template}
              design={cv.design}
              pages={previewPageCount}
              fitMessage={fitMessage}
              onDesign={changeDesign}
              onTemplate={(template) => {
                updateField("template", template);
                trackEditorEvent("template_selected", draftId, { template });
              }}
              onFit={fitToPages}
              onReset={resetDesign}
            />
          </div>
        </div>
      )}
      <div className="editor-chrome flex flex-wrap items-center justify-between gap-3 px-4 pb-2 pt-4 text-[0.8125rem] font-bold sm:px-6">
        <span className="text-muted">
          {paperLabel} · {pageDocument === "letter" ? "Cover letter" : `${selectedTemplate?.name ?? "Classic"} · ${previewPageCount} ${previewPageCount === 1 ? "page" : "pages"}`}
        </span>
        {finishing && (
          <div role="group" aria-label="Show on the page" className="flex rounded-lg bg-sand p-[3px]">
            {(["cv", "letter"] as const).map((kind) => (
              <button key={kind} type="button" aria-pressed={finishDocument === kind} onClick={() => setFinishDocument(kind)} className={`min-h-8 rounded-md px-3 text-[0.8125rem] ${finishDocument === kind ? "bg-white font-bold text-navy shadow-[0_1px_3px_rgba(15,41,66,0.15)]" : "font-semibold text-muted hover:text-navy"}`}>
                {kind === "cv" ? "CV" : "Cover letter"}
              </button>
            ))}
          </div>
        )}
        {pageClickable && <span className="hidden text-muted xl:inline">Click any part of the page to edit it</span>}
      </div>
      {pageDocument === "cv" && previewPageCount > 2 && (
        <div className="editor-chrome mx-4 mb-3 flex flex-col gap-3 rounded-xl border border-gold bg-gold-tint p-4 sm:mx-6 sm:flex-row sm:items-center sm:justify-between" role="status">
          <div>
            <p className="text-sm font-bold text-navy">Your CV is about {previewPageCount} pages.</p>
            <p className="mt-1 text-xs leading-5 text-muted">Most UK applicants should aim for two pages. Remove older detail or use the Compact template before downloading.</p>
          </div>
          {cv.template !== "compact" && (
            <button type="button" onClick={() => updateField("template", "compact")} className="min-h-10 shrink-0 rounded-lg bg-navy px-4 text-sm font-bold text-white">Use Compact</button>
          )}
        </div>
      )}
      <div className="cv-preview-viewport px-4 pb-28 sm:px-6 lg:pb-8">
        <div ref={previewRef} onClick={openSectionFromPage} className={`cv-preview-scale relative ${pageClickable ? "cv-click-to-edit" : ""}`}>
          {pageDocument === "letter" ? <CoverLetterDocument cv={cv} /> : <MemoCvDocument cv={cv} />}
        </div>
      </div>
    </>
  );

  return (
    <div className="print-page min-h-screen bg-paper lg:pl-[76px]">
      <AppRail onNavigate={leaveEditor} />
      <AppMenuDrawer open={menuOpen} onClose={closeMenu} onLinkClick={leaveEditor} />

      <header className="editor-chrome sticky top-0 z-30 border-b border-line bg-white">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-[60px] sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/my-cvs" onClick={(event) => leaveEditor(event, "/my-cvs")} aria-label="Back to My CVs" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy lg:hidden">
              <svg aria-hidden="true" viewBox="0 0 64 64" className="h-5 w-5">
                <path d="M12 16h9l6 28h-8L12 16Zm17 0h7l-5 28h-8l6-28Zm9 0h8l-3 28h-8l3-28Zm10 0h8l-7 28h-8l7-28Z" fill="#fff" />
                <rect x="12" y="50" width="40" height="4" rx="2" fill="#D4A843" />
              </svg>
            </Link>
            <details className="editor-menu relative min-w-0">
              <summary className="flex min-h-10 min-w-0 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 font-extrabold text-navy hover:bg-paper [&::-webkit-details-marker]:hidden">
                <span className="truncate">{cvTitle}</span>
                <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">CV options</span>
              </summary>
              <div className="absolute left-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-soft">
                {cvMenuItems(closeMenuDetails)}
              </div>
            </details>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className={`flex items-center gap-1.5 text-sm ${saveTone}`} aria-live="polite">
              {saveSnapshot.status === "saved" && <Check className="h-4 w-4 text-success" aria-hidden="true" />}
              <span className={saveSnapshot.status === "error" ? "" : "hidden sm:inline"}>{saveLabel}</span>
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
                  className="underline"
                >
                  {saveSnapshot.errorKind === "conflict" ? "Reload latest" : "Retry"}
                </button>
              )}
            </span>
            {passStatus?.active && (
              <span className="hidden min-h-9 items-center rounded-lg border border-gold bg-gold-tint px-3 text-xs font-bold text-navy xl:inline-flex" title="Every CV you create before your Job Search Pass ends is unlocked.">
                Job Search Pass · {passStatus.daysLeft} {passStatus.daysLeft === 1 ? "day" : "days"} left
              </span>
            )}
            {!finishing && (
              <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line-strong bg-white px-2.5 text-sm font-bold text-navy hover:bg-paper sm:px-3.5">
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Preview</span>
              </button>
            )}
            {pdfUnlocked && (
              <details className="relative hidden sm:block">
                <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover [&::-webkit-details-marker]:hidden">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {pdfDownloading || docxDownloading || letterDownloading ? "Preparing…" : "Download"}
                </summary>
                <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-soft">
                  <button type="button" disabled={pdfDownloading} onClick={(event) => { closeMenuDetails(event); startDownload(); }} className={menuItem}><Download className="h-4 w-4" />CV as PDF</button>
                  <button type="button" disabled={docxDownloading} onClick={(event) => { closeMenuDetails(event); void downloadDocx(); }} className={menuItem}><FileText className="h-4 w-4" />CV as Word</button>
                  {hasCoverLetterContent(cv) ? (
                    <>
                      <button type="button" disabled={letterDownloading !== null} onClick={(event) => { closeMenuDetails(event); void downloadCoverLetter("pdf"); }} className={menuItem}><Download className="h-4 w-4" />Cover letter as PDF</button>
                      <button type="button" disabled={letterDownloading !== null} onClick={(event) => { closeMenuDetails(event); void downloadCoverLetter("docx"); }} className={menuItem}><FileText className="h-4 w-4" />Cover letter as Word</button>
                    </>
                  ) : (
                    <button type="button" onClick={(event) => { closeMenuDetails(event); goToStep("letter"); }} className={menuItem}><Mail className="h-4 w-4" />Write your cover letter</button>
                  )}
                </div>
              </details>
            )}
            <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong text-navy lg:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <div className="editor-chrome px-4 pt-4 sm:px-6 lg:pt-5">
        {/* relative: the hidden "(complete)" labels are absolutely positioned and must stay inside the scrolling bar. */}
        <nav aria-label="CV steps" className="relative mx-auto flex w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-line bg-white p-1">
          {steps.map((item, index) => {
            const current = item.id === step;
            const done = !current && stepComplete(cv, item.id, pdfUnlocked);
            return (
              <span key={item.id} className="flex shrink-0 items-center">
                {item.id === "letter" && <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-line-strong" />}
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => goToStep(item.id)}
                  className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm ${current ? "bg-sand font-extrabold text-navy" : done ? "font-bold text-navy hover:bg-paper" : "font-medium text-muted hover:bg-paper hover:text-navy"}`}
                >
                  {done ? (
                    <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-success"><Check className="h-3 w-3 text-white" aria-hidden="true" /></span>
                  ) : (
                    <span className={`grid h-[18px] w-[18px] place-items-center rounded-full text-[10px] ${current ? "bg-navy text-white" : "border-[1.5px] border-line-strong"}`} aria-hidden="true">{index + 1}</span>
                  )}
                  {item.label}
                  {done && <span className="sr-only">(complete)</span>}
                </button>
              </span>
            );
          })}
        </nav>
        {!finishing && loaded && (
          <div className="mx-auto mt-3 flex max-w-[760px] items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm lg:hidden" aria-label="CV readiness">
            <span className="font-extrabold text-navy">{readiness.score}%</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand" aria-hidden="true"><span className="block h-full rounded-full bg-success" style={{ width: `${Math.max(readiness.score, 2)}%` }} /></span>
            <span className="text-muted">{readiness.issues.length === 0 ? "Ready" : `${readiness.issues.length} to improve`}</span>
          </div>
        )}
      </div>

      {finishing ? (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
          <section aria-label="Preview" className={`print-area min-w-0 ${mobileView === "edit" ? "hidden lg:block" : "block"}`}>
            {pageArea}
          </section>
          <div className={`editor-form min-w-0 px-4 pb-28 pt-6 sm:px-6 lg:pb-10 ${mobileView === "preview" ? "hidden lg:block" : "block"}`}>
            <div className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
              <EditorNotices editor={editor} />
              {tailoringOpen && advertPanel}
              {loaded && stepContent()}
              {previous && (
                <button type="button" onClick={() => goToStep(previous)} className="editor-chrome hidden min-h-11 w-fit items-center gap-2 font-bold text-navy hover:underline lg:inline-flex">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />{stepLabel(previous)}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1120px] gap-6 px-4 pb-28 pt-5 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:pb-12">
          <aside className="editor-form hidden lg:block">
            <div className="sticky top-[80px] flex flex-col gap-4">
              {loaded && <ReadinessCard editor={editor} onGoTo={goToStep} />}
              {railContent()}
            </div>
          </aside>
          <div className="editor-form flex min-w-0 flex-col gap-5">
            <EditorNotices editor={editor} />
            {tailoringOpen && advertPanel}
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
              {loaded ? (
                <fieldset className="min-w-0">
                  <legend className="sr-only">{stepLabel(step)}, step {stepIndex(step) + 1} of {steps.length}</legend>
                  {stepContent()}
                </fieldset>
              ) : (
                <p className="flex items-center gap-3 py-10 font-bold text-navy" role="status">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/20 border-t-navy" aria-hidden="true" />
                  Opening your CV…
                </p>
              )}
              <div className="editor-chrome mt-8 hidden items-center justify-between border-t border-line pt-5 lg:flex">
                {previous ? (
                  <button type="button" onClick={() => goToStep(previous)} className="inline-flex min-h-11 items-center gap-2 font-bold text-navy hover:underline">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />{stepLabel(previous)}
                  </button>
                ) : <span />}
                {next && (
                  <button type="button" onClick={() => goToStep(next)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 font-bold text-white hover:bg-navy-hover">
                    Next: {stepLabel(next)}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewOpen && !finishing && (
        <div role="dialog" aria-modal="true" aria-label={step === "letter" ? "Preview of your cover letter" : "Preview of your CV"} className="fixed inset-0 z-50 flex flex-col bg-sand">
          <div className="editor-chrome flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
            <p className="font-extrabold text-navy">Preview</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => goToStep("finish")} className="hidden min-h-10 items-center rounded-lg border border-line-strong px-3.5 text-sm font-bold text-navy hover:bg-paper sm:inline-flex">Change the design</button>
              <button type="button" onClick={closePreview} autoFocus className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-navy px-3.5 text-sm font-bold text-white">
                <X className="h-4 w-4" aria-hidden="true" />Back to editing
              </button>
            </div>
          </div>
          <div className="print-area min-h-0 flex-1 overflow-y-auto">{pageArea}</div>
        </div>
      )}

      <div className="editor-chrome fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white px-4 pb-5 pt-3 lg:hidden">
        {finishing ? (
          <div className="flex flex-1 rounded-lg border border-line-strong p-1" role="group" aria-label="Finish view">
            <button type="button" aria-pressed={mobileView === "edit"} onClick={() => { setMobileView("edit"); trackEditorEvent("mobile_view_changed", draftId, { view: "edit" }); }} className={`min-h-10 flex-1 rounded-md px-3 text-sm font-bold ${mobileView === "edit" ? "bg-navy text-white" : "text-muted"}`}>Download</button>
            <button type="button" aria-pressed={mobileView === "preview"} onClick={() => { setMobileView("preview"); trackEditorEvent("mobile_view_changed", draftId, { view: "preview" }); }} className={`min-h-10 flex-1 rounded-md px-3 text-sm font-bold ${mobileView === "preview" ? "bg-navy text-white" : "text-muted"}`}>Page and design</button>
          </div>
        ) : (
          <>
            {previous && (
              <button type="button" onClick={() => goToStep(previous)} aria-label={`Back: ${stepLabel(previous)}`} className="grid min-h-12 w-12 place-items-center rounded-lg border border-line-strong text-navy">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            {next ? (
              <button type="button" onClick={() => goToStep(next)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-3 text-sm font-bold text-white">
                Next: {stepLabel(next)}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <span className="flex flex-1 items-center justify-center text-sm font-bold text-navy">{readinessLabel(readiness.score, readiness.ready)}</span>
            )}
          </>
        )}
      </div>

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
      {templatePickerOpen && (
        <TemplatePickerModal
          cv={cv}
          onClose={() => setTemplatePickerOpen(false)}
          onSelect={(templateId) => {
            updateField("template", templateId);
            trackEditorEvent("template_selected", draftId, { template: templateId });
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
          issues={readiness.issues.filter((issue) => issue.severity === "fix").map((issue) => issue.message)}
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
          onConsentAccepted={() => trackEditorEvent("checkout_consent_accepted", draftId)}
        />
      )}
      {aiReview && (
        <AiReviewModal
          key={`${aiReview.kind}-${aiReview.options[0]?.value ?? ""}`}
          review={aiReview}
          retrying={Boolean(aiLoading)}
          onRetry={aiReview.kind === "bullet" && aiReview.targetId && aiReview.bulletIndex !== undefined ? () => void rewriteBullet(aiReview.targetId!, aiReview.bulletIndex!, aiReview.options.map((option) => option.value), aiReview.keyword || aiReview.requirement ? { text: aiReview.original, keyword: aiReview.keyword, requirement: aiReview.requirement } : undefined) : undefined}
          onClose={() => {
            trackEditorEvent("ai_suggestion_rejected", draftId, { section: aiReview.kind });
            setAiReview(null);
          }}
          onApply={(values) => {
            if (aiReview.kind === "profile") updateField("profile", values[0] || aiReview.original);
            if (aiReview.kind === "bullets" && aiReview.targetId) updateExperience(aiReview.targetId, "bullets", values.join("\n"));
            if (aiReview.kind === "bullet" && aiReview.targetId && aiReview.bulletIndex !== undefined && values[0]) {
              const item = cv.experience.find((entry) => entry.id === aiReview.targetId);
              if (item && (aiReview.keyword || aiReview.requirement)) {
                updateExperience(item.id, "bullets", [...item.bullets.split("\n").filter((line) => line.trim()), values[0]].join("\n"));
                if (aiReview.requirement) markRequirementAnswered(aiReview.requirement);
              } else if (item) {
                const nextBullets = item.bullets.split("\n");
                nextBullets[aiReview.bulletIndex] = values[0];
                updateExperience(item.id, "bullets", nextBullets.join("\n"));
              }
            }
            if (aiReview.kind === "skills") updateField("skills", Array.from(new Set([...lines(cv.skills), ...values])).join("\n"));
            trackEditorEvent("ai_suggestion_applied", draftId, { section: aiReview.kind, count: values.length });
            setAiReview(null);
          }}
        />
      )}
      {undoLabel && (
        <div className="editor-chrome fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-navy px-4 py-3 text-sm font-bold text-white shadow-soft lg:bottom-6" role="status">
          {undoLabel}
          <button type="button" onClick={() => undoRef.current?.()} className="inline-flex items-center gap-1 underline">
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

