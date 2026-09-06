import { notFound } from "next/navigation";
import { CvEditor } from "@/components/cv-editor";
import { CvDocument } from "@/components/editor/cv-document";
import { retailAdminDocument } from "@/lib/content-cv-document";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default function ContentProof({ searchParams }: { searchParams: { mode?: string } }) {
  if (process.env.CV_VISUAL_TESTS !== "1") notFound();
  return <><script id="content-proof-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(retailAdminDocument) }} />{searchParams.mode === "pdf" ? <main className="pdf-render-shell" data-pdf-ready="true"><CvDocument cv={retailAdminDocument} compactPreview /></main> : <CvEditor />}</>;
}
