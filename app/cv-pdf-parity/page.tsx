import { notFound } from "next/navigation";
import { CvDocument } from "@/components/editor/cv-document";
import { CvEditor } from "@/components/cv-editor";
import { sampleCv, type TemplateId, isCvLayoutPreset } from "@/lib/editor-data";
import { getRoleCvTemplate, parseRoleTemplate } from "@/lib/role-cv-templates";

export const dynamic = "force-dynamic";

export default function PdfParityPage({ searchParams }: { searchParams: { template?: string; roleTemplate?: string; layoutPreset?: string; sample?: string } }) {
  if (process.env.CV_VISUAL_TESTS !== "1") notFound();
  if (searchParams.sample === "editor") return <CvEditor />;
  const template: TemplateId = searchParams.template === "modern" || searchParams.template === "compact" ? searchParams.template : "classic";
  const roleTemplate = parseRoleTemplate(searchParams.roleTemplate || null);
  const cv = roleTemplate ? getRoleCvTemplate(roleTemplate, template) : { ...sampleCv, template };
  if (isCvLayoutPreset(searchParams.layoutPreset)) cv.layoutPreset = searchParams.layoutPreset;
  if (searchParams.sample === "layout") cv.additionalSections = {
    projects: "Community book exchange | Leeds | 2024\nOrganised donated books by age group and prepared clear signs for visitors.",
    certifications: "Emergency First Aid at Work | Fictional training example | 2024",
    volunteering: "Community welcome desk | 2023\nExplained session times and helped visitors find the correct room.",
    languages: "English — fluent\nFrench — conversational",
  };
  return <main className="pdf-render-shell" data-pdf-ready="true"><CvDocument cv={cv} compactPreview /></main>;
}
