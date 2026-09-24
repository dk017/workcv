import type { Metadata } from "next";
import Link from "next/link";
import { CareerToolPage } from "@/components/career-tool-page";
const path = "/tools/cv-format-checker-uk";
export const metadata: Metadata = {
  title: "Free CV Format Checker UK — PDF and DOCX Reading Order",
  description: "Inspect a PDF or DOCX privately in your browser. Compare extracted reading order, check headings and see what still needs a human review.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK CV File and Format Checker", description: "Inspect extracted CV text and PDF pages without uploading your file.", url: path },
};
export default function CvFormatCheckerPage() {
  return <CareerToolPage path={path} tool="format" eyebrow="Free CV format checker UK"
    title="See what can be read from your CV file."
    intro="Choose a PDF or DOCX to inspect its extracted text privately in your browser, or paste text for a quick structure check. Compare the result with your original before you apply."
    description="File inspection uses PDF.js for PDFs and Mammoth for DOCX. It shows extracted text, basic warnings and PDF page previews. Pasted-text checks review headings, dates and evidence signals. Neither method simulates the employer's ATS or guarantees that every piece of content was recovered."
    howItHelps="Find missing text and confusing reading order before sending your CV."
    links={[["Compare tested sample layouts", "/cv-layout-tests-uk"], ["Review vacancy evidence", "/tools/job-application-pack-uk"], ["Choose a clean template", "/templates"]]}
    afterToolContent={<section className="bg-white py-14"><div className="container-page max-w-4xl space-y-6">
      <p className="text-sm text-muted">Reviewed 24 September 2026 · WorkCV editorial team</p>
      <h2 className="text-3xl font-bold">A practical check you can repeat</h2>
      <p className="leading-8">Download a <Link className="underline" href="/cv-layout-tests-uk">fictional sample PDF and its full extraction record</Link>, choose it above, and compare its name, contact details, jobs, dates and optional sections. Then check your own CV. Do not treat the sample's page count or extraction as a promise about another document.</p>
      <h3 className="text-2xl font-bold">What each result means</h3>
      <ul className="list-disc space-y-3 pl-5 leading-8"><li><strong>Little or no selectable text:</strong> the page may be scanned, blank or use unsupported encoding. Re-export from the original editable document; this tool does not perform OCR.</li><li><strong>Wrong sequence:</strong> compare the extracted paragraphs with the PDF preview. If dates, skills or sentences interrupt each other, try a single-column layout and check again.</li><li><strong>Missing contact details or headings:</strong> verify they appear as real text, not just an image. A warning is a prompt to inspect, not proof of rejection.</li><li><strong>No warnings:</strong> still compare every important fact. Keyword matching, suitability and the employer's file instructions are separate checks.</li></ul>
      <h3 className="text-2xl font-bold">Method and privacy</h3>
      <p className="leading-8">PDF text is displayed in the extraction library's item order, page by page. DOCX extraction shows document text, not Word's visual pagination. We do not infer a percentage chance of passing screening. See <a className="underline" href="https://mozilla.github.io/pdf.js/examples/">PDF.js documentation</a> and <a className="underline" href="https://github.com/mwilliamson/mammoth.js">Mammoth's conversion limitations</a>.</p>
      <p className="leading-8">Inspection happens locally and does not upload your file. If you choose to continue in the editor, the extracted text goes through the authenticated import service; you must review the imported fields. <Link className="underline" href="/privacy">Read the privacy policy</Link>. Close the page or clear the result when finished on a shared device.</p>
    </div></section>}
    faqs={[
      { question: "Does this check the employer's ATS?", answer: "No. It shows one extraction library's reading order and common text warnings. Employer systems differ. No score or hiring result is promised." },
      { question: "Can I check a PDF or Word CV without uploading it?", answer: "Yes. Choose a PDF or DOCX up to 5 MB. Inspection runs in your browser. PDFs are limited to 10 pages; DOCX text does not preserve visual page layout. Password-protected, legacy DOC and scanned image text are not supported." },
      { question: "What should I do if text is missing?", answer: "Compare with the original, re-export from its editable source and test again. For a scan, obtain selectable text or use a separate OCR tool, then proofread all names, dates and qualifications." },
    ]} />;
}
