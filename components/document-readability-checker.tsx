"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { documentReadability, validateDocxArchive, ExtractedPage } from "@/lib/document-readability";
import { writeCvToolHandoff } from "@/lib/cv-tool-handoff";
import { trackFunnelEvent } from "@/components/attribution-capture";
import { site } from "@/lib/site";
import { analyticsPlacements } from "@/lib/analytics-placements";

export function DocumentReadabilityChecker() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [result, setResult] = useState<ReturnType<typeof documentReadability> | null>(null);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const run = useRef(0);
  async function inspect(file?: File) {
    const id = ++run.current;
    setResult(null); setPages([]); setPreviews([]); setError(""); setNotice("");
    if (!file) return;
    if (file.size > 5 * 1024 * 1024 || !/\.(pdf|docx)$/i.test(file.name)) { setError("Choose a PDF or DOCX up to 5 MB. Legacy .doc files are not supported."); return; }
    setBusy(true); trackFunnelEvent("tool_started", { tool: "document-readability" });
    try {
      const buffer = await file.arrayBuffer();
      let extracted: ExtractedPage[] = [];
      const images: string[] = [];
      if (/\.pdf$/i.test(file.name)) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker.mjs?v=" + pdfjs.version;
        const task = pdfjs.getDocument({ data: new Uint8Array(buffer), useSystemFonts: true });
        try {
          const pdf = await task.promise;
          if (pdf.numPages > 10) throw new Error("Check a CV with no more than 10 pages.");
          for (let n = 1; n <= pdf.numPages; n++) {
            if (id !== run.current) return;
            const page = await pdf.getPage(n);
            const content = await page.getTextContent();
            extracted.push({ number: n, text: content.items.map((item) => "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "").join("") });
            const viewport = page.getViewport({ scale: Math.min(1, 700 / page.getViewport({ scale: 1 }).width) });
            const canvas = document.createElement("canvas"); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            if (canvas.height > 4000) throw new Error("This PDF page is too tall to preview safely.");
            const context = canvas.getContext("2d");
            if (context) { await page.render({ canvas, canvasContext: context, viewport }).promise; images.push(canvas.toDataURL("image/png")); }
            page.cleanup();
          }
        } finally { await task.destroy(); }
      } else {
        validateDocxArchive(buffer);
        const mammoth = await import("mammoth/mammoth.browser");
        const docx = await mammoth.extractRawText({ arrayBuffer: buffer });
        extracted = [{ number: 1, text: docx.value }];
        setNotice("DOCX text is shown as one document, not one physical page. Open the original in Word or LibreOffice to compare its layout.");
      }
      const report = documentReadability(extracted);
      if (report.text.length > 50000) throw new Error("Extracted content exceeds 50,000 characters. Check a shorter document.");
      if (id !== run.current) return;
      setPages(extracted); setPreviews(images); setResult(report);
      trackFunnelEvent("tool_completed", { tool: "document-readability", result: "success" });
    } catch (cause) {
      if (id === run.current) setError(cause instanceof Error && /password/i.test(cause.message) ? "Remove password protection before checking this file." : cause instanceof Error ? cause.message : "Unable to read this file. Try exporting a fresh PDF or DOCX.");
    } finally { if (id === run.current) setBusy(false); }
  }
  return <section className="mb-8 space-y-5 rounded-lg border border-line bg-white p-5">
    <h2 className="text-2xl font-bold text-navy">Check the actual PDF or Word file</h2>
    <p className="text-sm leading-7 text-muted">Free, no login. File inspection runs in this browser; the file and extracted text are not uploaded. PDF: up to 10 pages. PDF/DOCX: up to 5 MB. This is a text-extraction check, not an employer ATS simulation or an interview score.</p>
    <label className="block font-bold">Choose your CV file<input className="mt-3 block w-full text-sm" type="file" accept=".pdf,.docx" disabled={!ready || busy} onChange={(e) => void inspect(e.target.files?.[0])} /></label>
    {busy && <p role="status">Reading the file locally…</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {result && <div className="space-y-5">
      <p role="status" className="font-bold">{result.wordCount} extracted words. {result.warnings.length} checks need attention.</p>
      {notice && <p className="text-sm">{notice}</p>}
      <ul className="list-disc space-y-2 pl-5 text-sm">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
      <p className="text-sm leading-7">Compare names, dates, qualifications and bullet order below against your original. A clean extraction does not prove nothing is missing. Columns may be read in a different order; only you can confirm the intended sequence. No OCR is performed.</p>
      {pages.map((page, i) => <div key={page.number} className="grid min-w-0 gap-4 lg:grid-cols-2">
        {previews[i] && <img src={previews[i]} alt={`Local preview of PDF page ${page.number}`} className="w-full border border-line" />}
        <label className="block min-w-0 text-sm font-bold">{previews.length ? `Page ${page.number}: extracted reading order` : "Extracted document text"}<textarea className="mt-2 min-h-80 w-full rounded border border-line p-3 font-mono text-xs" readOnly value={page.text} /></label>
      </div>)}
      <button type="button" className="min-h-11 rounded border border-line px-4 font-bold" onClick={async () => { try { await navigator.clipboard.writeText(result.text); setNotice("Extracted text copied."); } catch { setNotice("Copy is unavailable. Select the extracted text above and copy it."); } }}>Copy extracted text</button>
      <p className="text-sm leading-7">Need a cleaner layout? Continuing sends this text to the authenticated editor import service for structured drafting. Check the imported fields before saving or paying. PDF download costs {site.price} once for that saved CV; no subscription. <Link href="/privacy" className="underline">Privacy details</Link>.</p>
      <button type="button" disabled={!result.text.trim() || result.text.length > 30000} className="min-h-11 rounded bg-navy px-4 font-bold text-white disabled:opacity-50" onClick={() => { try { writeCvToolHandoff({ source: "document-readability", sourceText: result.text }); trackFunnelEvent("marketing_cta_clicked", { placement: analyticsPlacements.fileCheckerEditor, destination: "/editor?template=classic&new=1&from=career-tool" }); window.location.assign("/editor?template=classic&new=1&from=career-tool"); } catch { setError("Browser storage is unavailable. Copy your text before opening the editor."); } }}>Continue with this text in a clean CV</button>
      {result.text.length > 30000 && <p className="text-sm">The editor accepts up to 30,000 characters. Shorten your document first; no text has been silently discarded.</p>}
      <button type="button" className="ml-3 min-h-11 underline" onClick={() => { ++run.current; setResult(null); setPages([]); setPreviews([]); setNotice(""); }}>Clear result</button>
    </div>}
  </section>;
}
