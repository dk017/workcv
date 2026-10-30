"use client";

import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

import {
  cvAccents,
  cvFonts,
  cvFontIds,
  cvPapers,
  cvSizeRange,
  isDefaultCvDesign,
  resolveCvDesign,
  type CvAccent,
  type CvDesign,
  type CvLeading,
  type CvMargins,
  type CvPaper,
  type CvSpacing,
} from "@/lib/cv-design";
import { templates, type TemplateId } from "@/lib/editor-data";

// Body text size of each template at 100%, to show sizes in points.
const bodyPt: Record<TemplateId, number> = { classic: 9.2, modern: 8.7, compact: 9.2 };

const control = "flex h-9 items-center gap-1.5 rounded-lg px-2 text-[0.8125rem] font-bold text-navy hover:bg-paper";
const select = "h-9 cursor-pointer rounded-lg bg-transparent pr-1 text-[0.8125rem] font-bold text-navy outline-none focus-visible:ring-2 focus-visible:ring-gold-tint";
const divider = <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-line sm:block" />;

/** The Finish page's design controls: actions on the first row, formatting on the second. */
export function DesignToolbar({
  template,
  design,
  pages,
  fitMessage,
  documentSwitch,
  download,
  onDesign,
  onTemplate,
  onFit,
  onReset,
}: {
  template: TemplateId;
  design?: CvDesign;
  pages: number;
  fitMessage: string | null;
  documentSwitch: React.ReactNode;
  download: React.ReactNode;
  onDesign: (change: Partial<CvDesign>) => void;
  onTemplate: (template: TemplateId) => void;
  onFit: (target: number) => void;
  onReset: () => void;
}) {
  const current = resolveCvDesign(design);
  const fitTarget = pages - 1;
  const sizeLabel = `${(Math.round(bodyPt[template] * current.size) / 100).toFixed(1)} pt`;
  return (
    <div role="toolbar" aria-label="CV design" className="editor-chrome rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-2 p-2.5">
        {documentSwitch}
        <div role="radiogroup" aria-label="Template" className="flex rounded-[10px] bg-sand p-[3px]">
          {templates.map((item) => {
            const active = item.id === template;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onTemplate(item.id)}
                className={`min-h-8 rounded-lg px-3 text-[0.8125rem] ${active ? "bg-white font-bold text-navy shadow-[0_1px_3px_rgba(15,41,66,0.15)]" : "font-semibold text-muted hover:text-navy"}`}
              >
                {item.id === "classic" ? "Classic" : item.name}
              </button>
            );
          })}
        </div>
        {fitTarget >= 1 && (
          <button type="button" onClick={() => onFit(fitTarget)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-gold-tint px-3 text-[0.8125rem] font-bold text-navy hover:bg-gold/40">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            Fit to {fitTarget} {fitTarget === 1 ? "page" : "pages"}
          </button>
        )}
        <div role="radiogroup" aria-label="Accent colour" className="flex h-9 items-center gap-1 px-1">
          {(Object.keys(cvAccents) as CvAccent[]).map((accent) => {
            const active = current.accent === accent;
            return (
              <button
                key={accent}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={cvAccents[accent].label}
                title={cvAccents[accent].label}
                onClick={() => onDesign({ accent })}
                className={`grid h-7 w-7 place-items-center rounded-full ${active ? "ring-2 ring-navy ring-offset-1" : ""}`}
              >
                <span className="h-5 w-5 rounded-full" style={{ background: cvAccents[accent].hex }} />
              </button>
            );
          })}
        </div>
        <span className="flex-1" />
        {!isDefaultCvDesign(design) && (
          <button type="button" onClick={onReset} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[0.8125rem] font-bold text-muted hover:text-navy">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />Reset
          </button>
        )}
        {download}
      </div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-line px-2 py-1.5">
        <label className={control}>
          <span aria-hidden="true" className="font-semibold text-muted">Font</span>
          <select aria-label="Font" value={current.font} onChange={(event) => onDesign({ font: event.target.value as CvDesign["font"] })} className={select}>
            {cvFontIds.map((font) => <option key={font} value={font}>{cvFonts[font].label}</option>)}
          </select>
        </label>
        {divider}
        <div role="group" aria-label="Text size" className="flex h-9 items-center">
          <button type="button" aria-label="Smaller text" disabled={current.size <= cvSizeRange.min} onClick={() => onDesign({ size: current.size - cvSizeRange.step })} className="grid h-9 w-8 place-items-center rounded-lg text-navy hover:bg-paper disabled:opacity-30">
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-[3.75rem] text-center text-[0.8125rem] font-bold text-navy" aria-live="polite">{sizeLabel}</span>
          <button type="button" aria-label="Larger text" disabled={current.size >= cvSizeRange.max} onClick={() => onDesign({ size: current.size + cvSizeRange.step })} className="grid h-9 w-8 place-items-center rounded-lg text-navy hover:bg-paper disabled:opacity-30">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {divider}
        <label className={control}>
          <span aria-hidden="true" className="font-semibold text-muted">Lines</span>
          <select aria-label="Line spacing" value={current.leading} onChange={(event) => onDesign({ leading: event.target.value as CvLeading })} className={select}>
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
        <label className={control}>
          <span aria-hidden="true" className="font-semibold text-muted">Sections</span>
          <select aria-label="Section spacing" value={current.spacing} onChange={(event) => onDesign({ spacing: event.target.value as CvSpacing })} className={select}>
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
        <label className={control}>
          <span aria-hidden="true" className="font-semibold text-muted">Margins</span>
          <select aria-label="Margins" value={current.margins} onChange={(event) => onDesign({ margins: event.target.value as CvMargins })} className={select}>
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>
        </label>
        {divider}
        <label className={control}>
          <select aria-label="Paper" value={current.paper} onChange={(event) => onDesign({ paper: event.target.value as CvPaper })} className={select}>
            {(Object.keys(cvPapers) as CvPaper[]).map((paper) => <option key={paper} value={paper}>{cvPapers[paper].label}</option>)}
          </select>
        </label>
      </div>
      {fitMessage && <p role="status" className="border-t border-line px-3.5 py-2.5 text-sm font-bold text-navy">{fitMessage}</p>}
    </div>
  );
}
