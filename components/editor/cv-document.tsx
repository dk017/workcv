"use client";

import { memo } from "react";

import {
  CvData,
  EducationItem,
  ExperienceItem,
  TemplateId,
  lines,
} from "@/lib/editor-data";

export function CvDocument({
  cv,
  compactPreview = false,
}: {
  cv: CvData;
  compactPreview?: boolean;
}) {
  const baseClass = `print-document mx-auto min-h-[1123px] w-full max-w-[794px] bg-white shadow-soft ring-1 ring-line ${
    compactPreview ? "shadow-none" : ""
  }`;

  if (cv.template === "modern") {
    return <ModernCvDocument cv={cv} baseClass={baseClass} />;
  }

  if (cv.template === "compact") {
    return <CompactCvDocument cv={cv} baseClass={baseClass} />;
  }

  return <ClassicCvDocument cv={cv} baseClass={baseClass} />;
}

export const MemoCvDocument = memo(CvDocument);

function CvSection({
  title,
  children,
  compact,
  template,
}: {
  title: string;
  children: React.ReactNode;
  compact: boolean;
  template: TemplateId;
}) {
  const headingClass =
    template === "modern"
      ? "mb-4 border-l-4 border-gold bg-[#fbf6e8] px-3 py-2 text-sm font-bold uppercase tracking-[0.16em] text-navy"
      : template === "compact"
        ? "mb-2 border-b border-line pb-1 text-xs font-bold uppercase tracking-[0.14em] text-navy"
        : "mb-3 border-b border-line pb-2 text-sm font-bold uppercase tracking-[0.16em] text-navy";

  return (
    <section
      className={`${compact ? "mt-6" : "mt-8"} cv-section cv-section-${title
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      <h3 className={headingClass}>{title}</h3>
      {children}
    </section>
  );
}

function ClassicCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-classic border-t-[10px] border-navy px-12 py-12`}
      data-template="classic"
    >
      <header className="cv-header border-b-2 border-navy pb-7 text-center">
        <h2 className="cv-name font-display text-5xl font-semibold leading-tight text-navy">
          {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
        </h2>
        <p className="mt-3 text-lg font-bold text-ink">
          {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
        </p>
        <ContactLine cv={cv} align="center" />
      </header>
      <CvBody cv={cv} template="classic" />
    </article>
  );
}

function ModernCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-modern grid grid-cols-[230px_minmax(0,1fr)] overflow-hidden border-l-[10px] border-gold`}
      data-template="modern"
    >
      <aside className="cv-sidebar bg-navy px-7 py-10 text-white">
        <h2 className="cv-name font-display text-4xl font-semibold leading-tight">
          {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
        </h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-gold-tint">
          {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
        </p>
        <div className="mt-8 space-y-5 text-sm leading-6 text-white/85">
          <SidebarBlock title="Contact">
            {[cv.email, cv.phone, cv.location, cv.linkedin].some(Boolean) ? (
              [cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((item) => (
                <p key={item} className="break-words">
                  {item}
                </p>
              ))
            ) : (
              <PreviewPlaceholder>Add email, phone and location</PreviewPlaceholder>
            )}
          </SidebarBlock>
          <SidebarBlock title="Skills">
            {lines(cv.skills).length > 0 ? (
              <ul className="space-y-2">
                {lines(cv.skills).map((skill, index) => (
                  <li key={`${index}-${skill}`}>{skill}</li>
                ))}
              </ul>
            ) : (
              <PreviewPlaceholder>Add role-relevant skills</PreviewPlaceholder>
            )}
          </SidebarBlock>
        </div>
      </aside>
      <main className="min-w-0 px-10 py-10">
        <CvSection title="Profile" compact={false} template="modern">
          <p className="leading-7 text-ink">
            {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
          </p>
        </CvSection>
        <ExperienceContent cv={cv} template="modern" />
        <EducationContent cv={cv} template="modern" />
      </main>
    </article>
  );
}

function CompactCvDocument({ cv, baseClass }: { cv: CvData; baseClass: string }) {
  return (
    <article
      className={`${baseClass} cv-template-compact border-t-[6px] border-line-strong px-10 py-9 text-[13px]`}
      data-template="compact"
    >
      <header className="cv-header grid grid-cols-[1fr_auto] gap-4 border-b-2 border-navy pb-4">
        <div>
          <h2 className="cv-name font-display text-4xl font-semibold leading-tight text-navy">
            {cv.fullName || <PreviewPlaceholder>Your name</PreviewPlaceholder>}
          </h2>
          <p className="mt-1 text-base font-bold text-ink">
            {cv.targetRole || <PreviewPlaceholder>Target role</PreviewPlaceholder>}
          </p>
        </div>
        <ContactLine cv={cv} align="right" compact />
      </header>
      <div className="cv-compact-body grid grid-cols-[minmax(0,1fr)_220px] gap-8 pt-2">
        <main className="min-w-0">
          <CvSection title="Profile" compact template="compact">
            <p className="leading-6 text-ink">
              {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
            </p>
          </CvSection>
          <ExperienceContent cv={cv} template="compact" />
          <EducationContent cv={cv} template="compact" />
        </main>
        <aside>
          <CvSection title="Skills" compact template="compact">
            <SkillsList cv={cv} compact />
          </CvSection>
        </aside>
      </div>
    </article>
  );
}

function CvBody({
  cv,
  template,
}: {
  cv: CvData;
  template: TemplateId;
}) {
  return (
    <>
      <CvSection title="Profile" compact={false} template={template}>
        <p className="leading-7 text-ink">
          {cv.profile || <PreviewPlaceholder>Add a concise professional profile.</PreviewPlaceholder>}
        </p>
      </CvSection>
      <ExperienceContent cv={cv} template={template} />
      <EducationContent cv={cv} template={template} />
      <CvSection title="Skills" compact={false} template={template}>
        <SkillsList cv={cv} />
      </CvSection>
    </>
  );
}

function ExperienceContent({
  cv,
  template,
  items = cv.experience,
  title = "Experience",
}: {
  cv: CvData;
  template: TemplateId;
  items?: ExperienceItem[];
  title?: string;
}) {
  const compact = template === "compact";
  return (
    <CvSection title={title} compact={compact} template={template}>
      <div className={compact ? "space-y-4" : "space-y-6"}>
        {items.map((item) => (
          <Entry
            key={item.id}
            title={item.role || <PreviewPlaceholder>Role title</PreviewPlaceholder>}
            subtitle={
              [item.company, item.location].filter(Boolean).join(" | ") || (
                <PreviewPlaceholder>Company and location</PreviewPlaceholder>
              )
            }
            dates={
              [item.start, item.end].filter(Boolean).join(" - ") || (
                <PreviewPlaceholder>Start – End</PreviewPlaceholder>
              )
            }
            bullets={lines(item.bullets)}
            emptyBulletsLabel="Add achievements and responsibilities."
            compact={compact}
          />
        ))}
      </div>
    </CvSection>
  );
}

function EducationContent({ cv, template }: { cv: CvData; template: TemplateId }) {
  const compact = template === "compact";
  return (
    <CvSection title="Education" compact={compact} template={template}>
      <div className={compact ? "space-y-4" : "space-y-5"}>
        {cv.education.map((item: EducationItem) => (
          <Entry
            key={item.id}
            title={item.qualification || <PreviewPlaceholder>Qualification</PreviewPlaceholder>}
            subtitle={
              [item.institution, item.location].filter(Boolean).join(" | ") || (
                <PreviewPlaceholder>Institution and location</PreviewPlaceholder>
              )
            }
            dates={
              [item.start, item.end].filter(Boolean).join(" - ") || (
                <PreviewPlaceholder>Start – End</PreviewPlaceholder>
              )
            }
            bullets={item.details ? [item.details] : []}
            emptyBulletsLabel="Add relevant study details or achievements."
            compact={compact}
          />
        ))}
      </div>
    </CvSection>
  );
}

function SkillsList({ cv, compact = false }: { cv: CvData; compact?: boolean }) {
  const skillItems = lines(cv.skills);
  return (
    <ul className={`cv-skills-list ${compact ? "space-y-2" : "grid grid-cols-2 gap-2"}`}>
      {skillItems.length > 0 ? (
        skillItems.map((skill, index) => (
          <li key={`${index}-${skill}`} className="flex gap-2 text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span className="min-w-0">{skill}</span>
          </li>
        ))
      ) : (
        <li>
          <PreviewPlaceholder>Add your skills in the editor.</PreviewPlaceholder>
        </li>
      )}
    </ul>
  );
}

function ContactLine({
  cv,
  align,
  compact = false,
}: {
  cv: CvData;
  align: "center" | "right";
  compact?: boolean;
}) {
  return (
    <div
      className={`cv-contact-line mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted ${
        align === "center" ? "justify-center" : "justify-end text-right"
      } ${compact ? "max-w-[260px] text-xs leading-5" : ""}`}
    >
      {[cv.email, cv.phone, cv.location, cv.linkedin].some(Boolean) ? (
        [cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((item) => (
          <span key={item} className="min-w-0 overflow-wrap-anywhere">
            {item}
          </span>
        ))
      ) : (
        <PreviewPlaceholder>Add email, phone and location</PreviewPlaceholder>
      )}
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 border-b border-white/25 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-tint">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Entry({
  title,
  subtitle,
  dates,
  bullets,
  emptyBulletsLabel,
  compact = false,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  dates: React.ReactNode;
  bullets: string[];
  emptyBulletsLabel: string;
  compact?: boolean;
}) {
  return (
    <div className="cv-entry min-w-0">
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <h4 className="font-bold text-navy">{title}</h4>
          <p className="text-sm font-bold text-ink">{subtitle}</p>
        </div>
        <p className="cv-entry-dates shrink-0 whitespace-nowrap text-sm text-muted">{dates}</p>
      </div>
      {bullets.length > 0 && (
        <ul className={compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2"}>
          {bullets.map((bullet, index) => (
            <li key={`${index}-${bullet}`} className={`flex gap-2 text-ink ${compact ? "leading-6" : "leading-7"}`}>
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
              <span className="min-w-0">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {bullets.length === 0 && (
        <p className={compact ? "mt-2" : "mt-3"}>
          <PreviewPlaceholder>{emptyBulletsLabel}</PreviewPlaceholder>
        </p>
      )}
    </div>
  );
}

function PreviewPlaceholder({ children }: { children: React.ReactNode }) {
  return <span className="cv-placeholder italic opacity-50">{children}</span>;
}
