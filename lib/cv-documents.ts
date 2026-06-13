import crypto from "crypto";

import { ensureAuthTables, getPool } from "@/lib/db";
import { CvData, sampleCv, templates, type TemplateId } from "@/lib/editor-data";

export type CvDocument = {
  id: string;
  data: CvData;
  updatedAt: string;
};

function isValidTemplate(value: unknown): value is TemplateId {
  return typeof value === "string" && templates.some((template) => template.id === value);
}

function normaliseCvData(input: unknown, fallbackTemplate?: TemplateId): CvData {
  const source = typeof input === "object" && input ? (input as Partial<CvData>) : {};
  const template = isValidTemplate(source.template)
    ? source.template
    : fallbackTemplate || sampleCv.template;

  return {
    ...sampleCv,
    ...source,
    template,
    experience: Array.isArray(source.experience) ? source.experience : sampleCv.experience,
    education: Array.isArray(source.education) ? source.education : sampleCv.education,
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
    const data = normaliseCvData(row.data, template);
    if (template && data.template !== row.data.template) {
      return updateCvDocument(userId, row.id, { ...data, template });
    }
    return { id: row.id, data, updatedAt: row.updated_at.toISOString() };
  }

  return createCvDocument(userId, template);
}

export async function createCvDocument(userId: string, template?: TemplateId) {
  await ensureAuthTables();

  const id = crypto.randomUUID();
  const data = normaliseCvData({ ...sampleCv, template: template || sampleCv.template });
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
