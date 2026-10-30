import { notFound } from "next/navigation";
import { CvDocument } from "@/components/editor/cv-document";
import { CvEditor } from "@/components/cv-editor";
import { CoverLetterDocument } from "@/components/editor/cover-letter-document";
import { PdfPageSize } from "@/components/editor/pdf-page-size";
import { cvDesignSchema } from "@/lib/cv-schema";
import { sampleCv, type TemplateId, isCvLayoutPreset } from "@/lib/editor-data";
import { getRoleCvTemplate, parseRoleTemplate } from "@/lib/role-cv-templates";

export const dynamic = "force-dynamic";

export default function PdfParityPage({ searchParams }: { searchParams: { template?: string; roleTemplate?: string; layoutPreset?: string; sample?: string; design?: string; letter?: string; extraRoles?: string; extraBullets?: string } }) {
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
  // Page-count tests lengthen the CV to land near page boundaries.
  const extraRoles = Math.min(12, Number(searchParams.extraRoles) || 0);
  const extraBullets = Math.min(12, Number(searchParams.extraBullets) || 0);
  if (extraRoles || extraBullets) {
    const base = cv.experience[0];
    const bullets = [...base.bullets.split("\n"), ...Array.from({ length: extraBullets }, (_, i) => `Additional responsibility ${i + 1}: handled escalations, reported weekly figures and coached new starters on the process.`)].join("\n");
    cv.experience = [{ ...base, bullets }, ...cv.experience.slice(1), ...Array.from({ length: extraRoles }, (_, i) => ({ ...base, id: `extra-${i}`, role: `${base.role} ${i + 2}`, bullets }))];
  }
  // Visual tests can pass design settings as JSON, validated like a saved CV.
  if (searchParams.design) {
    const parsed = cvDesignSchema.safeParse(JSON.parse(searchParams.design));
    if (parsed.success) cv.design = parsed.data;
  }
  if (searchParams.letter === "1") {
    cv.coverLetter = { jobTitle: "Customer Service Manager", employer: "Northstar Services", reference: "", recipientName: "Sarah Clarke", greeting: "hiring-manager", employerAddress: "", includeDate: false, paragraphs: ["I am applying for the Customer Service Manager role at Northstar Services. I have led contact centre teams for seven years and want to bring that experience to your service.", "In my current role I cut the complaint backlog from 140 to 35 in three months by coaching advisers to resolve issues at the first contact.", "I would welcome the chance to discuss how I could help your team. I am available for an interview at short notice."] };
    return <main className="pdf-render-shell" data-pdf-ready="true"><PdfPageSize design={cv.design} /><CoverLetterDocument cv={cv} /></main>;
  }
  return <main className="pdf-render-shell" data-pdf-ready="true"><PdfPageSize design={cv.design} /><CvDocument cv={cv} compactPreview /></main>;
}
