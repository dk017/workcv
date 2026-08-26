import { notFound } from "next/navigation";
import { CvDocument } from "@/components/editor/cv-document";
import { sampleCv, type TemplateId } from "@/lib/editor-data";
import { getRoleCvTemplate, parseRoleTemplate } from "@/lib/role-cv-templates";

export const dynamic = "force-dynamic";

export default function PdfParityPage({ searchParams }: { searchParams: { template?: string; roleTemplate?: string } }) {
  if (process.env.CV_VISUAL_TESTS !== "1") notFound();
  const template: TemplateId = searchParams.template === "modern" || searchParams.template === "compact" ? searchParams.template : "classic";
  const roleTemplate = parseRoleTemplate(searchParams.roleTemplate || null);
  const cv = roleTemplate ? getRoleCvTemplate(roleTemplate, template) : { ...sampleCv, template };
  return <main className="pdf-render-shell" data-pdf-ready="true"><CvDocument cv={cv} compactPreview /></main>;
}
