import { cvPapers, resolveCvDesign, type CvDesign } from "@/lib/cv-design";

// Page size for the PDF render pages. A4 is the stylesheet default, so it needs nothing here.
export function PdfPageSize({ design }: { design?: CvDesign }) {
  const paper = resolveCvDesign(design).paper;
  if (paper === "a4") return null;
  const width = `${cvPapers[paper].widthMm}mm`;
  return (
    <style>{`@page { size: ${width} ${cvPapers[paper].heightMm}mm; } @media print { html, body, main, .print-page, .print-area, .cv-preview-viewport, .cv-preview-scale { width: ${width} !important; } } .pdf-render-shell { width: ${width}; }`}</style>
  );
}
