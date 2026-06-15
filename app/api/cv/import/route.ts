import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { parseTemplate } from "@/lib/cv-documents";
import { CvImportError, extractCvText, parseCvTextWithAi } from "@/lib/cv-import";

export const runtime = "nodejs";

const maxUploadBytes = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const template = parseTemplate(String(formData.get("template") || "")) || "classic";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a PDF or DOCX CV to import." }, { status: 400 });
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractCvText(buffer, file.name, file.type);
    const result = await parseCvTextWithAi(extractedText, template);

    return NextResponse.json(result);
  } catch (error) {
    console.error("workcv_import_cv_error", error);

    if (error instanceof CvImportError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "We could not import that CV. Please try another PDF or DOCX file." },
      { status: 500 }
    );
  }
}
