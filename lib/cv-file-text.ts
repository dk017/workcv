"use client";

import { looksMultiColumn, type TextItemBox } from "@/lib/cv-readability-check";
import { validateDocxArchive } from "@/lib/document-readability";

// Read a CV file in the browser. The file never leaves the device.
export type CvFileText = {
  kind: "pdf" | "docx";
  text: string;
  pages: number;
  emptyPages: number[];
  multiColumnPages: number[];
};

export const cvFileLimits = { maxBytes: 5 * 1024 * 1024, maxPdfPages: 10, maxChars: 30_000 };

export async function readCvFile(file: File): Promise<CvFileText> {
  if (file.size > cvFileLimits.maxBytes || !/\.(pdf|docx)$/i.test(file.name)) {
    throw new Error("Choose a PDF or Word (.docx) file up to 5 MB. Older .doc files are not supported.");
  }
  const buffer = await file.arrayBuffer();

  if (/\.docx$/i.test(file.name)) {
    validateDocxArchive(buffer);
    const mammoth = await import("mammoth/mammoth.browser");
    const docx = await mammoth.extractRawText({ arrayBuffer: buffer });
    const text = docx.value.trim();
    return { kind: "docx", text, pages: 1, emptyPages: text.length < 20 ? [1] : [], multiColumnPages: [] };
  }

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker.mjs?v=" + pdfjs.version;
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), useSystemFonts: true });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > cvFileLimits.maxPdfPages) throw new Error("Check a CV with no more than 10 pages.");
    const texts: string[] = [];
    const emptyPages: number[] = [];
    const multiColumnPages: number[] = [];
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number);
      const content = await page.getTextContent();
      const boxes: TextItemBox[] = [];
      let text = "";
      for (const item of content.items) {
        if (!("str" in item)) continue;
        text += item.str + (item.hasEOL ? "\n" : " ");
        boxes.push({ x: item.transform[4], y: item.transform[5], width: item.width, text: item.str });
      }
      if (text.trim().length < 20) emptyPages.push(number);
      if (looksMultiColumn(boxes, page.getViewport({ scale: 1 }).width)) multiColumnPages.push(number);
      texts.push(text.trim());
      page.cleanup();
    }
    return { kind: "pdf", text: texts.join("\n\n"), pages: pdf.numPages, emptyPages, multiColumnPages };
  } catch (error) {
    if (error instanceof Error && /password/i.test(error.message)) {
      throw new Error("Remove password protection from the PDF, then try again.");
    }
    throw error;
  } finally {
    await task.destroy();
  }
}
