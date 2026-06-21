import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import {
  getCvDocument,
  getOrCreateCurrentCv,
  parseTemplate,
  updateCvDocument,
} from "@/lib/cv-documents";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const documentId = request.nextUrl.searchParams.get("documentId");
  if (documentId) {
    const document = await getCvDocument(user.id, documentId);
    if (!document) return NextResponse.json({ error: "CV not found" }, { status: 404 });
    return NextResponse.json({ document });
  }

  const template = parseTemplate(request.nextUrl.searchParams.get("template"));
  const document = await getOrCreateCurrentCv(user.id, template);
  return NextResponse.json({ document });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const documentId = typeof body.documentId === "string" ? body.documentId : "";
  if (!documentId) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }

  const document = await updateCvDocument(user.id, documentId, body.data);
  if (!document) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  return NextResponse.json({ document });
}
