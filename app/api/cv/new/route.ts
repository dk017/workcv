import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { createCvDocument, duplicateCvDocument, parseTemplate } from "@/lib/cv-documents";
import { parseRoleTemplate } from "@/lib/role-cv-templates";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (typeof body.copyFrom === "string") {
    if (!/^[a-zA-Z0-9_-]{12,80}$/.test(body.copyFrom)) {
      return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
    }
    const copy = await duplicateCvDocument(user.id, body.copyFrom);
    if (!copy) return NextResponse.json({ error: "CV not found" }, { status: 404 });
    return NextResponse.json({ document: copy });
  }
  const template = parseTemplate(typeof body.template === "string" ? body.template : null);
  const roleTemplate = parseRoleTemplate(
    typeof body.roleTemplate === "string" ? body.roleTemplate : null
  );
  const document = await createCvDocument(user.id, template, roleTemplate);
  return NextResponse.json({ document });
}
