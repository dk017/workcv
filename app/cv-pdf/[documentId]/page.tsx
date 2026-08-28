import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CvDocument } from "@/components/editor/cv-document";
import { getCvDocument } from "@/lib/cv-documents";
import { verifyPdfRenderToken } from "@/lib/pdf-render-token";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "CV preview",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PdfRenderPage({
  params,
  searchParams,
}: {
  params: { documentId: string };
  searchParams: { token?: string };
}) {
  const claims = verifyPdfRenderToken(searchParams.token);
  if (!claims || claims.documentId !== params.documentId) notFound();
  const document = await getCvDocument(claims.userId, claims.documentId);
  if (!document) notFound();

  return (
    <main className="pdf-render-shell" data-pdf-ready="true">
      <CvDocument cv={document.data} compactPreview />
    </main>
  );
}
