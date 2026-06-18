import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { createCvDocument, parseTemplate } from "@/lib/cv-documents";
import { parseRoleTemplate } from "@/lib/role-cv-templates";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const template = parseTemplate(typeof body.template === "string" ? body.template : null);
  const roleTemplate = parseRoleTemplate(
    typeof body.roleTemplate === "string" ? body.roleTemplate : null
  );
  const document = await createCvDocument(user.id, template, roleTemplate);
  return NextResponse.json({ document });
}
