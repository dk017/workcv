import { NextRequest, NextResponse } from "next/server";
import { isDeepStrictEqual } from "node:util";

import { getCurrentUserFromRequest } from "@/lib/auth";
import {
  CvUpdateConflictError,
  getCvDocument,
  getOrCreateCurrentCv,
  parseTemplate,
  updateCvDocument,
} from "@/lib/cv-documents";
import {
  CvValidationError,
  formatCvValidationError,
  parseCvData,
} from "@/lib/cv-schema";

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

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const documentId = typeof body.documentId === "string" ? body.documentId : "";
  const expectedUpdatedAt =
    typeof body.expectedUpdatedAt === "string" ? body.expectedUpdatedAt : "";
  if (!documentId) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }
  if (!expectedUpdatedAt || Number.isNaN(Date.parse(expectedUpdatedAt))) {
    return NextResponse.json({ error: "Missing or invalid CV revision" }, { status: 400 });
  }

  try {
    const document = await updateCvDocument(
      user.id,
      documentId,
      body.data,
      expectedUpdatedAt,
    );
    if (!document) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    if (error instanceof CvUpdateConflictError) {
      const currentDocument = await getCvDocument(user.id, documentId);
      if (currentDocument) {
        const submittedData = parseCvData(body.data);
        if (isDeepStrictEqual(currentDocument.data, submittedData)) {
          return NextResponse.json({ document: currentDocument });
        }
      }
      return NextResponse.json(
        {
          error:
            "A newer version of this CV is already saved, usually from another open editor tab. Reload to use the latest version.",
          code: "CV_CONFLICT",
        },
        { status: 409 },
      );
    }
    if (error instanceof CvValidationError) {
      return NextResponse.json(
        { error: formatCvValidationError(error), code: "INVALID_CV_DATA" },
        { status: 400 },
      );
    }
    throw error;
  }
}
