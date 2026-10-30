import type { TemplateId } from "./editor-data.ts";
import type { RoleTemplateId } from "./role-cv-templates.ts";

// The sample CVs in the app's Samples library. Each is a fictional person's CV from
// lib/role-cv-templates.ts; "Use this sample" opens it as a new CV to make your own.
export const sampleSectors = ["Customer service", "Healthcare and care", "Education", "Engineering", "First jobs and graduates", "Retail", "Logistics and driving"] as const;
export type SampleSector = (typeof sampleSectors)[number];

export type AppSample = { id: RoleTemplateId; sector: SampleSector; template: TemplateId; note: string };

export const appSamples: AppSample[] = [
  { id: "customer-service", sector: "Customer service", template: "classic", note: "Telephone, email and complaint handling" },
  { id: "nurse", sector: "Healthcare and care", template: "modern", note: "NMC-registered ward nurse" },
  { id: "care-worker", sector: "Healthcare and care", template: "compact", note: "Home care and residential care" },
  { id: "teacher", sector: "Education", template: "classic", note: "Secondary teacher with QTS" },
  { id: "engineer", sector: "Engineering", template: "modern", note: "Manufacturing and design engineering" },
  { id: "graduate", sector: "First jobs and graduates", template: "classic", note: "Education first, with a placement and projects" },
  { id: "student", sector: "First jobs and graduates", template: "compact", note: "Volunteering and society roles alongside study" },
  { id: "school-leaver", sector: "First jobs and graduates", template: "classic", note: "Apprenticeship application with no paid experience" },
  { id: "retail", sector: "Retail", template: "compact", note: "Tills and stock" },
  { id: "warehouse", sector: "Logistics and driving", template: "modern", note: "Picking, packing and forklift work" },
  { id: "driver", sector: "Logistics and driving", template: "classic", note: "Multi-drop delivery driving" },
];

export function sampleEditorHref(id: RoleTemplateId, template: TemplateId) {
  return `/editor?new=1&roleTemplate=${encodeURIComponent(id)}&template=${template}`;
}
