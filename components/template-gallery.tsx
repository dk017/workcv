"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Check,
  FileText,
  GraduationCap,
  HeartHandshake,
  Laptop,
  LayoutTemplate,
  Stethoscope,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { NoSubscriptionCtaStrip } from "@/components/marketing";
import { sampleCv, TemplateId, templates } from "@/lib/editor-data";
import { site } from "@/lib/site";

const templateDetails: Record<
  TemplateId,
  {
    bestFor: string;
    structure: string;
    guidance: string[];
  }
> = {
  classic: {
    bestFor: "Most UK job applications, retail, operations, admin, service roles.",
    structure: "A traditional one-column CV with a centered header and clear section order.",
    guidance: [
      "Use when you want the safest recruiter-friendly option.",
      "Best for reverse-chronological work history.",
      "Strong default when you are unsure which layout to choose.",
    ],
  },
  modern: {
    bestFor: "Professional roles where a polished sidebar layout still needs to stay readable.",
    structure: "A two-column layout with contact and skills separated from the main story.",
    guidance: [
      "Use when skills and contact details should be easy to scan.",
      "Good for experienced applicants with clear work history.",
      "Avoid overfilling the sidebar with long text.",
    ],
  },
  compact: {
    bestFor: "Students, school leavers, first jobs, and short early-career CVs.",
    structure: "A tighter two-column CV that keeps essentials visible on one page.",
    guidance: [
      "Use when education, skills, and early experience need equal weight.",
      "Good for limited experience without looking empty.",
      "Keep bullets short so the layout stays clean.",
    ],
  },
};

export function TemplateGallery() {
  return (
    <div className="bg-paper">
      <section className="quiet-grid border-b border-line bg-paper py-20 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              UK CV templates
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Choose a CV template built for UK applications.
            </h1>
          </div>
          <div>
            <p className="text-xl leading-8 text-muted">
              Compare clean, recruiter-friendly layouts before you start. Each
              template uses the same UK-ready content structure and can be
              changed later inside the editor.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-navy">
              {["No photo-first layout", "No date of birth field", `${site.priceGbp} PDF download`].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2"
                  >
                    <Check className="h-4 w-4 text-success" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Gallery
              </p>
              <h2 className="font-display text-4xl font-semibold text-navy">
                Pick the structure that fits your situation.
              </h2>
            </div>
            <Link
              href="/editor"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-navy-hover"
            >
              Start with default
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {templates.map((template) => {
              const details = templateDetails[template.id];
              return (
                <article
                  key={template.id}
                  className="rounded-xl border border-line bg-paper p-4 shadow-sm"
                >
                  <div className="template-page-preview mb-5 overflow-hidden rounded-lg border border-line bg-white p-4">
                    <div
                      className="gallery-preview-document pointer-events-none mx-auto"
                      style={{
                        width: 794,
                      }}
                    >
                      <CvDocument cv={{ ...sampleCv, template: template.id }} compactPreview />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl font-semibold text-navy">
                        {template.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {template.description}
                      </p>
                    </div>
                    <LayoutTemplate className="mt-1 h-6 w-6 shrink-0 text-gold" />
                  </div>

                  <div className="mt-5 rounded-lg border border-line bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                      Best for
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-navy">
                      {details.bestFor}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-muted">{details.structure}</p>
                  </div>

                  <ul className="mt-5 space-y-3 text-sm leading-6 text-ink">
                    {details.guidance.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/editor?template=${template.id}`}
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-navy-hover"
                  >
                    Use this template
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Choosing a format
            </p>
            <h2 className="font-display text-4xl font-semibold text-navy">
              The template should make your strongest evidence easy to scan.
            </h2>
            <Link
              href="/professional-cv-template-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy"
            >
              Read the professional CV template guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "Standard structure",
                "UK guidance commonly expects contact details, an introduction, education, work history, and references or reference guidance.",
              ],
              [
                "Chronological clarity",
                "Reverse chronological layouts are a strong default because recruiters can quickly understand your recent experience.",
              ],
              [
                "Skills-based support",
                "Skills-led or hybrid layouts can help when you have limited experience, are changing direction, or need to foreground transferable skills.",
              ],
              [
                "Practical restraint",
                "WorkCV avoids photo-first and personal-detail-heavy layouts, keeping the page focused on application evidence.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-line bg-white p-5">
                <FileText className="h-6 w-6 text-gold" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Role templates
            </p>
            <h2 className="font-display text-4xl font-semibold text-navy">
              Start with wording shaped around the job.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Role-specific templates give you a stronger first draft than a
              blank layout because the sections, bullets and skills already
              match what employers scan for.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                href: "/cv-template-nurse-uk",
                title: "Nurse CV template UK",
                body:
                  "NMC-focused sections, clinical bullet examples, CPD guidance and an editable registered nurse CV draft.",
                cta: "Open nurse template",
                icon: Stethoscope,
              },
              {
                href: "/cv-template-teacher-uk",
                title: "Teacher CV template UK",
                body:
                  "QTS, classroom impact, safeguarding, behaviour and assessment examples in an editable teacher CV draft.",
                cta: "Open teacher template",
                icon: GraduationCap,
              },
              {
                href: "/cv-template-warehouse-uk",
                title: "Warehouse CV template UK",
                body:
                  "Picking, packing, goods-in, scanner use, manual handling and shift reliability in an editable warehouse CV draft.",
                cta: "Open warehouse template",
                icon: Boxes,
              },
              {
                href: "/cv-template-graduate-uk",
                title: "Graduate CV template UK",
                body:
                  "Degree, projects, internships, part-time work and transferable skills shaped into an editable graduate CV draft.",
                cta: "Open graduate template",
                icon: Laptop,
              },
              {
                href: "/cv-template-care-worker-uk",
                title: "Care worker CV template UK",
                body:
                  "Person-centred care, safeguarding, records, home-care and residential-care evidence in an editable care worker CV draft.",
                cta: "Open care worker template",
                icon: HeartHandshake,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-navy"
                >
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-3xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <NoSubscriptionCtaStrip />
    </div>
  );
}
