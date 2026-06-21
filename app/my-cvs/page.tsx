import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { listCvDocuments } from "@/lib/cv-documents";
import { templates } from "@/lib/editor-data";

export const metadata: Metadata = {
  title: "My CVs",
  description: "Open your saved WorkCV documents or create a new UK CV.",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(value));
}

export default async function MyCvsPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/my-cvs")}`);

  const documents = await listCvDocuments(user.id);

  return (
    <section className="bg-paper py-12 md:py-16">
      <div className="container-page">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Your account</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-navy md:text-5xl">My CVs</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Open a saved CV to continue editing, or start a separate document for another role.
            </p>
          </div>
          <Link
            href="/editor?new=1"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"
          >
            Create new CV
          </Link>
        </div>

        {documents.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((document) => {
              const templateName =
                templates.find((template) => template.id === document.template)?.name || "Classic";
              return (
                <article key={document.id} className="rounded-xl border border-line bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-2xl font-semibold text-navy">
                        {document.title}
                      </h2>
                      <p className="mt-1 truncate text-sm font-bold text-ink">{document.targetRole}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        document.paid ? "bg-[#e8f5ee] text-success" : "bg-paper text-muted"
                      }`}
                    >
                      {document.paid ? "PDF unlocked" : "Draft"}
                    </span>
                  </div>
                  <dl className="mt-5 space-y-2 text-sm text-muted">
                    <div className="flex justify-between gap-4">
                      <dt>Template</dt>
                      <dd className="font-bold text-navy">{templateName}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Last updated</dt>
                      <dd className="text-right font-bold text-navy">{formatUpdatedAt(document.updatedAt)}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/editor?draftId=${encodeURIComponent(document.id)}`}
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
                  >
                    Open CV
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-line-strong bg-white p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-navy">No saved CVs yet</h2>
            <p className="mt-2 text-muted">Create your first CV and it will appear here automatically.</p>
          </div>
        )}
      </div>
    </section>
  );
}
