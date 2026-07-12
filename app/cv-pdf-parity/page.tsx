import { notFound } from "next/navigation";
import { CvDocument } from "@/components/editor/cv-document";
import { sampleCv, type TemplateId } from "@/lib/editor-data";

export const dynamic = "force-dynamic";

export default function PdfParityPage({ searchParams }: { searchParams: { template?: string } }) {
  if (process.env.CV_VISUAL_TESTS !== "1") notFound();
  const template: TemplateId = searchParams.template === "modern" || searchParams.template === "compact" ? searchParams.template : "classic";
  return <main className="pdf-render-shell" data-pdf-ready="true"><CvDocument cv={{ ...sampleCv, template }} compactPreview /></main>;
}
