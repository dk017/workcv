import crypto from "crypto";

import { ensureAuthTables, ensurePaymentTables, getPool } from "@/lib/db";
import {
  createBlankCv,
  CvData,
  sampleCv,
  templates,
  type TemplateId,
} from "@/lib/editor-data";
import { getRoleCvTemplate, type RoleTemplateId } from "@/lib/role-cv-templates";

export type CvDocument = {
  id: string;
  data: CvData;
  updatedAt: string;
};

export type CvDocumentSummary = {
  id: string;
  title: string;
  targetRole: string;
  template: TemplateId;
  updatedAt: string;
  paid: boolean;
};

function isValidTemplate(value: unknown): value is TemplateId {
  return typeof value === "string" && templates.some((template) => template.id === value);
}

function isLegacySampleCv(input: unknown): boolean {
  if (!input || typeof input !== "object") return false;
  const source = input as Partial<CvData>;
  const primitiveKeys: Array<keyof Omit<CvData, "template" | "experience" | "education">> = [
    "fullName",
    "targetRole",
    "email",
    "phone",
    "location",
    "linkedin",
    "profile",
    "skills",
  ];
  const experienceKeys: Array<keyof CvData["experience"][number]> = [
    "id",
    "role",
    "company",
    "location",
    "start",
    "end",
    "bullets",
  ];
  const educationKeys: Array<keyof CvData["education"][number]> = [
    "id",
    "qualification",
    "institution",
    "location",
    "start",
    "end",
    "details",
  ];

  return (
    primitiveKeys.every((key) => source[key] === sampleCv[key]) &&
    Array.isArray(source.experience) &&
    source.experience.length === sampleCv.experience.length &&
    source.experience.every((item, index) =>
      experienceKeys.every((key) => item[key] === sampleCv.experience[index][key])
    ) &&
    Array.isArray(source.education) &&
    source.education.length === sampleCv.education.length &&
    source.education.every((item, index) =>
      educationKeys.every((key) => item[key] === sampleCv.education[index][key])
    )
  );
}

function normaliseCvData(input: unknown, fallbackTemplate?: TemplateId): CvData {
  const source = typeof input === "object" && input ? (input as Partial<CvData>) : {};
  const blankCv = createBlankCv(fallbackTemplate);
  const template = isValidTemplate(source.template)
    ? source.template
    : fallbackTemplate || blankCv.template;

  return {
    ...blankCv,
    ...source,
    template,
    experience: Array.isArray(source.experience) ? source.experience : blankCv.experience,
    education: Array.isArray(source.education) ? source.education : blankCv.education,
  };
}

export function parseTemplate(value: string | null): TemplateId | undefined {
  return isValidTemplate(value) ? value : undefined;
}

export async function getOrCreateCurrentCv(userId: string, template?: TemplateId) {
  await ensureAuthTables();

  const existing = await getPool().query<{
    id: string;
    data: CvData;
    updated_at: Date;
  }>(
    `
      SELECT id, data, updated_at
      FROM workcv_cv_documents
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `,
    [userId]
  );

  if (existing.rows[0]) {
    const row = existing.rows[0];
    if (isLegacySampleCv(row.data)) {
      const blankCv = createBlankCv(template || row.data.template);
      return updateCvDocument(userId, row.id, blankCv);
    }
    const data = normaliseCvData(row.data, template);
    if (template && data.template !== row.data.template) {
      return updateCvDocument(userId, row.id, { ...data, template });
    }
    return { id: row.id, data, updatedAt: row.updated_at.toISOString() };
  }

  return createCvDocument(userId, template);
}

export async function getCvDocument(userId: string, documentId: string) {
  await ensureAuthTables();
  const result = await getPool().query<{ id: string; data: CvData; updated_at: Date }>(
    `
      SELECT id, data, updated_at
      FROM workcv_cv_documents
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `,
    [documentId, userId]
  );

  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, data: normaliseCvData(row.data), updatedAt: row.updated_at.toISOString() };
}

export async function listCvDocuments(userId: string): Promise<CvDocumentSummary[]> {
  await Promise.all([ensureAuthTables(), ensurePaymentTables()]);
  const result = await getPool().query<{
    id: string;
    title: string;
    data: CvData;
    template_id: string;
    updated_at: Date;
    paid: boolean;
  }>(
    `
      SELECT
        d.id,
        d.title,
        d.data,
        d.template_id,
        d.updated_at,
        EXISTS (
          SELECT 1 FROM workcv_orders o WHERE o.draft_id = d.id
        ) AS paid
      FROM workcv_cv_documents d
      WHERE d.user_id = $1
      ORDER BY d.updated_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => {
    const data = normaliseCvData(row.data, parseTemplate(row.template_id));
    return {
      id: row.id,
      title: row.title || data.fullName?.trim() || "Untitled CV",
      targetRole: data.targetRole?.trim() || "No target role added",
      template: data.template,
      updatedAt: row.updated_at.toISOString(),
      paid: row.paid,
    };
  });
}

export async function createCvDocument(
  userId: string,
  template?: TemplateId,
  roleTemplate?: RoleTemplateId
) {
  await ensureAuthTables();

  const id = crypto.randomUUID();
  const seed = roleTemplate
    ? getRoleCvTemplate(roleTemplate, template)
    : createBlankCv(template);
  const data = normaliseCvData(seed);
  const result = await getPool().query<{ id: string; data: CvData; updated_at: Date }>(
    `
      INSERT INTO workcv_cv_documents (id, user_id, title, data, template_id)
      VALUES ($1, $2, $3, $4::jsonb, $5)
      RETURNING id, data, updated_at
    `,
    [id, userId, data.fullName || "My CV", JSON.stringify(data), data.template]
  );

  const row = result.rows[0];
  return { id: row.id, data: normaliseCvData(row.data), updatedAt: row.updated_at.toISOString() };
}

export async function updateCvDocument(userId: string, documentId: string, dataInput: unknown) {
  await ensureAuthTables();

  const data = normaliseCvData(dataInput);
  const result = await getPool().query<{ id: string; data: CvData; updated_at: Date }>(
    `
      UPDATE workcv_cv_documents
      SET data = $3::jsonb,
          template_id = $4,
          title = $5,
          updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING id, data, updated_at
    `,
    [
      documentId,
      userId,
      JSON.stringify(data),
      data.template,
      data.fullName?.trim() || "My CV",
    ]
  );

  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, data: normaliseCvData(row.data), updatedAt: row.updated_at.toISOString() };
}

export async function userOwnsCvDocument(userId: string, documentId: string) {
  await ensureAuthTables();
  const result = await getPool().query<{ id: string }>(
    "SELECT id FROM workcv_cv_documents WHERE id = $1 AND user_id = $2 LIMIT 1",
    [documentId, userId]
  );
  return Boolean(result.rows[0]);
}
