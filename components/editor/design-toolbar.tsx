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

const selectClass = "min-h-10 rounded-lg border border-line-strong bg-white px-2.5 text-sm font-bold text-navy";
const labelClass = "flex items-center gap-2 text-[0.8125rem] font-bold text-muted";

export function DesignToolbar({
  template,
  design,
  pages,
  fitMessage,
  onDesign,
  onTemplate,
  onFit,
  onReset,
}: {
  template: TemplateId;
  design?: CvDesign;
  pages: number;
  fitMessage: string | null;
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
      <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-3.5 py-3">
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
                className={`min-h-9 rounded-lg px-3.5 text-sm ${active ? "bg-white font-bold text-navy shadow-[0_1px_3px_rgba(15,41,66,0.15)]" : "font-semibold text-muted hover:text-navy"}`}
              >
                {item.id === "classic" ? "Classic" : item.name}
              </button>
            );
          })}
        </div>
        <label className={labelClass}>
          Font
          <select value={current.font} onChange={(event) => onDesign({ font: event.target.value as CvDesign["font"] })} className={selectClass}>
            {cvFontIds.map((font) => <option key={font} value={font}>{cvFonts[font].label}</option>)}
          </select>
        </label>
        <div role="group" aria-label="Text size" className="flex h-10 items-center rounded-lg border border-line-strong">
          <button type="button" aria-label="Smaller text" disabled={current.size <= cvSizeRange.min} onClick={() => onDesign({ size: current.size - cvSizeRange.step })} className="grid h-full w-10 place-items-center text-navy disabled:opacity-30">
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-[4.25rem] text-center text-sm font-bold text-navy" aria-live="polite">{sizeLabel}</span>
          <button type="button" aria-label="Larger text" disabled={current.size >= cvSizeRange.max} onClick={() => onDesign({ size: current.size + cvSizeRange.step })} className="grid h-full w-10 place-items-center text-navy disabled:opacity-30">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {fitTarget >= 1 && (
          <button type="button" onClick={() => onFit(fitTarget)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-tint px-3.5 text-sm font-bold text-navy hover:bg-gold/40">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            Fit to {fitTarget} {fitTarget === 1 ? "page" : "pages"}
          </button>
        )}
        <span className="flex-1" />
        {!isDefaultCvDesign(design) && (
          <button type="button" onClick={onReset} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold text-muted hover:text-navy">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 px-3.5 py-2.5">
        <label className={labelClass}>
          Line spacing
          <select value={current.leading} onChange={(event) => onDesign({ leading: event.target.value as CvLeading })} className={selectClass}>
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
        <label className={labelClass}>
          Section spacing
          <select value={current.spacing} onChange={(event) => onDesign({ spacing: event.target.value as CvSpacing })} className={selectClass}>
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
        <label className={labelClass}>
          Margins
          <select value={current.margins} onChange={(event) => onDesign({ margins: event.target.value as CvMargins })} className={selectClass}>
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>
        </label>
        <label className={labelClass}>
          Paper
          <select value={current.paper} onChange={(event) => onDesign({ paper: event.target.value as CvPaper })} className={selectClass}>
            {(Object.keys(cvPapers) as CvPaper[]).map((paper) => <option key={paper} value={paper}>{cvPapers[paper].label}</option>)}
          </select>
        </label>
        <div role="radiogroup" aria-label="Accent colour" className={labelClass}>
          Colour
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
                className={`grid h-8 w-8 place-items-center rounded-full ${active ? "ring-2 ring-navy ring-offset-2" : ""}`}
              >
                <span className="h-6 w-6 rounded-full" style={{ background: cvAccents[accent].hex }} />
              </button>
            );
          })}
        </div>
      </div>
      {fitMessage && <p role="status" className="border-t border-line px-3.5 py-2.5 text-sm font-bold text-navy">{fitMessage}</p>}
    </div>
  );
}
