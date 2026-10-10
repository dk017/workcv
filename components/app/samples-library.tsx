"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Eye, X } from "lucide-react";

import { DocumentThumbnail } from "@/components/app/document-thumbnail";
import { MemoCvDocument } from "@/components/editor/cv-document";
import { appSamples, sampleEditorHref, sampleSectors, type AppSample, type SampleSector } from "@/lib/app-samples";
import { templates, type TemplateId } from "@/lib/editor-data";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";

const templateName = (id: TemplateId) => (id === "classic" ? "Classic" : templates.find((item) => item.id === id)?.name ?? id);

function SamplePreview({ sample, onClose }: { sample: AppSample; onClose: () => void }) {
  const [template, setTemplate] = useState<TemplateId>(sample.template);
  const cv = useMemo(() => getRoleCvTemplate(sample.id, template), [sample.id, template]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div role="dialog" aria-modal="true" aria-label={`Sample CV: ${cv.targetRole}`} className="fixed inset-0 z-50 flex flex-col bg-sand">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-extrabold text-navy">{cv.targetRole}</p>
          <p className="text-sm text-muted">{sample.sector} · fictional sample</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Template" className="flex rounded-lg bg-sand p-[3px]">
            {templates.map((item) => (
              <button key={item.id} type="button" aria-pressed={template === item.id} onClick={() => setTemplate(item.id)} className={`min-h-9 rounded-md px-3 text-sm ${template === item.id ? "bg-white font-bold text-navy shadow-[0_1px_3px_rgba(15,41,66,0.15)]" : "font-semibold text-muted hover:text-navy"}`}>
                {templateName(item.id)}
              </button>
            ))}
          </div>
          <Link href={sampleEditorHref(sample.id, template)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
            Use this sample<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button ref={closeRef} type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong text-navy hover:bg-paper">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="cv-preview-viewport px-4 py-6 sm:px-6">
          <div className="cv-preview-scale relative">
            <MemoCvDocument cv={cv} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SamplesLibrary() {
  const [sector, setSector] = useState<SampleSector | "all">("all");
  const [open, setOpen] = useState<AppSample | null>(null);
  const shown = sector === "all" ? appSamples : appSamples.filter((sample) => sample.sector === sector);
  const chip = (id: SampleSector | "all", label: string) => (
    <button key={id} type="button" aria-pressed={sector === id} onClick={() => setSector(id)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${sector === id ? "bg-navy text-white" : "border border-line-strong bg-white text-navy hover:border-navy"}`}>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Samples</h1>
        <p className="mt-2 max-w-2xl text-muted">UK CVs written for common jobs, with fictional people and employers. Start from one, then replace every detail with your own.</p>
      </div>
      <div role="group" aria-label="Filter by sector" className="flex flex-wrap gap-2">
        {chip("all", "All")}
        {sampleSectors.map((item) => chip(item, item))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {shown.map((sample) => {
          const cv = getRoleCvTemplate(sample.id, sample.template);
          return (
            <article key={sample.id} data-sample-card className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
              <button type="button" onClick={() => setOpen(sample)} className="flex justify-center bg-sand px-4 pt-5 hover:bg-[#ebe8e0]" aria-label={`Preview the ${cv.targetRole} sample`}>
                <DocumentThumbnail cv={cv} width={168} />
              </button>
              <div className="flex flex-1 flex-col gap-1 border-t border-line p-4">
                <h2 data-sample-title className="font-bold leading-snug text-navy">{cv.targetRole}</h2>
                <p className="text-[0.8125rem] text-muted">{sample.sector} · {templateName(sample.template)}</p>
                <p className="text-sm text-ink">{sample.note}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-3">
                  <Link href={sampleEditorHref(sample.id, sample.template)} className="inline-flex min-h-10 items-center rounded-lg bg-navy px-3.5 text-sm font-bold text-white hover:bg-navy-hover">Use this sample</Link>
                  <button type="button" onClick={() => setOpen(sample)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-sm font-bold text-navy hover:bg-paper">
                    <Eye className="h-4 w-4" aria-hidden="true" />Preview
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {open && <SamplePreview sample={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
