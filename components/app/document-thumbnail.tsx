"use client";

import { MemoCvDocument } from "@/components/editor/cv-document";
import { CoverLetterDocument } from "@/components/editor/cover-letter-document";
import { cvPapers, pageWidthPx, resolveCvDesign } from "@/lib/cv-design";
import type { CvData } from "@/lib/editor-data";

/** The real first page of a CV or cover letter, shrunk to `width` pixels. Decorative: the card
 * around it carries the name and actions. */
export function DocumentThumbnail({ cv, kind = "cv", width }: { cv: CvData; kind?: "cv" | "letter"; width: number }) {
  const pageWidth = pageWidthPx(cv.design);
  const paper = cvPapers[resolveCvDesign(cv.design).paper];
  const scale = width / pageWidth;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none overflow-hidden rounded-[3px] bg-white shadow-[0_2px_10px_rgba(15,41,66,0.12)] ring-1 ring-line"
      style={{ width, height: Math.round(width * (paper.heightMm / paper.widthMm)) }}
    >
      <div style={{ width: pageWidth, zoom: scale }}>
        {kind === "letter" ? <CoverLetterDocument cv={cv} /> : <MemoCvDocument cv={cv} compactPreview />}
      </div>
    </div>
  );
}
