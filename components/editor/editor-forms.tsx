"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  CvData,
  EducationItem,
  ExperienceItem,
  TemplateId,
  templates,
} from "@/lib/editor-data";
import { assessExistingBullet } from "@/lib/cv-bullet-rules";

type UpdateField = <K extends keyof CvData>(key: K, value: CvData[K]) => void;

export function StepHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div>
      <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-muted">{eyebrow}</p>
      <h1 className="mt-1.5 font-display text-[1.625rem] font-extrabold leading-tight text-navy sm:text-[1.75rem]">{title}</h1>
      {intro && <p className="mt-1.5 leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function ContactStep({ cv, updateField }: { cv: CvData; updateField: UpdateField }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label="Your full name" value={cv.fullName} onChange={(value) => updateField("fullName", value)} placeholder="e.g. Emily Thompson" autoComplete="name" />
      <TextField label="The job title you’re aiming for" value={cv.targetRole} onChange={(value) => updateField("targetRole", value)} placeholder="e.g. Customer Service Assistant" />
      <TextField label="Email" type="email" value={cv.email} onChange={(value) => updateField("email", value)} placeholder="e.g. emily.thompson@email.co.uk" autoComplete="email" />
      <TextField label="Phone" type="tel" value={cv.phone} onChange={(value) => updateField("phone", value)} placeholder="e.g. 07123 456 789" autoComplete="tel" />
      <TextField label="Town or city" value={cv.location} onChange={(value) => updateField("location", value)} placeholder="e.g. Leeds, UK" />
      <TextField label="LinkedIn or portfolio (optional)" value={cv.linkedin} onChange={(value) => updateField("linkedin", value)} placeholder="e.g. linkedin.com/in/emilythompson" />
    </div>
  );
}

const isCurrent = (end: string) => /present|current|now/i.test(end);

export function RoleStep({
  item,
  index,
  total,
  updateExperience,
  removeExperience,
  moveExperience,
  onImproveBullets,
  onRewriteBullet,
  assistanceBusy = false,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  updateExperience: (id: string, key: keyof ExperienceItem, value: string) => void;
  removeExperience: (id: string) => void;
  moveExperience: (index: number, direction: -1 | 1) => void;
  onImproveBullets: (id: string) => void;
  onRewriteBullet: (id: string, index: number) => void;
  assistanceBusy?: boolean;
}) {
  const current = isCurrent(item.end);
  const set = (key: keyof ExperienceItem) => (value: string) => updateExperience(item.id, key, value);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <StepHeading
          eyebrow={`Experience · Role ${index + 1} of ${total}`}
          title={[item.role.trim(), item.company.trim()].filter(Boolean).join(" at ") || "Add a role"}
        />
        <div className="flex items-center gap-1">
          <IconButton label="Move role up" disabled={index === 0} onClick={() => moveExperience(index, -1)}>
            <ArrowUp className="h-4 w-4" />
          </IconButton>
          <IconButton label="Move role down" disabled={index === total - 1} onClick={() => moveExperience(index, 1)}>
            <ArrowDown className="h-4 w-4" />
          </IconButton>
          {total > 1 && (
            <IconButton label="Remove this role" onClick={() => removeExperience(item.id)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="What was your job title?" value={item.role} onChange={set("role")} placeholder="e.g. Retail Assistant" />
        <TextField label="Where did you work?" value={item.company} onChange={set("company")} placeholder="e.g. North Street Books" />
        <TextField label="When did you start?" value={item.start} onChange={set("start")} placeholder="e.g. Jun 2024" />
        <TextField label="When did you finish?" value={current ? "Present" : item.end} onChange={set("end")} placeholder="e.g. Mar 2026" disabled={current} />
        <TextField label="Where was it?" value={item.location} onChange={set("location")} placeholder="e.g. Leeds" />
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 self-end font-medium text-ink">
          <input
            type="checkbox"
            checked={current}
            onChange={(event) => updateExperience(item.id, "end", event.target.checked ? "Present" : "")}
            className="h-5 w-5 accent-navy"
          />
          I still work here
        </label>
      </div>
      <BulletEditor
        label="What did you do there?"
        hint="Start with a verb. Add a number or result where you can."
        value={item.bullets}
        onChange={set("bullets")}
        onRewrite={(bulletIndex) => onRewriteBullet(item.id, bulletIndex)}
        rewriteBusy={assistanceBusy}
        action={
          <button type="button" onClick={() => onImproveBullets(item.id)} disabled={assistanceBusy} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-gold-tint px-3 text-sm font-bold text-navy hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-50">
            <Sparkles className="h-4 w-4" aria-hidden="true" />Improve these bullets
          </button>
        }
      />
    </div>
  );
}

export function EducationStep({
  item,
  index,
  total,
  updateEducation,
  removeEducation,
  moveEducation,
}: {
  item: EducationItem;
  index: number;
  total: number;
  updateEducation: (id: string, key: keyof EducationItem, value: string) => void;
  removeEducation: (id: string) => void;
  moveEducation: (index: number, direction: -1 | 1) => void;
}) {
  const set = (key: keyof EducationItem) => (value: string) => updateEducation(item.id, key, value);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <StepHeading
          eyebrow={`Education · ${index + 1} of ${total}`}
          title={item.qualification.trim() || "Add a qualification"}
          intro={index === 0 ? "Degrees, A levels, apprenticeships, NVQs, GCSEs or professional qualifications. Most recent first." : undefined}
        />
        <div className="flex items-center gap-1">
          <IconButton label="Move education up" disabled={index === 0} onClick={() => moveEducation(index, -1)}>
            <ArrowUp className="h-4 w-4" />
          </IconButton>
          <IconButton label="Move education down" disabled={index === total - 1} onClick={() => moveEducation(index, 1)}>
            <ArrowDown className="h-4 w-4" />
          </IconButton>
          {total > 1 && (
            <IconButton label="Remove this qualification" onClick={() => removeEducation(item.id)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="What did you study?" value={item.qualification} onChange={set("qualification")} placeholder="e.g. BA Business Management" />
        <TextField label="Where did you study?" value={item.institution} onChange={set("institution")} placeholder="e.g. University of Leeds" />
        <TextField label="Start" value={item.start} onChange={set("start")} placeholder="e.g. 2021" />
        <TextField label="End" value={item.end} onChange={set("end")} placeholder="e.g. 2024" />
        <TextField label="Where was it?" value={item.location} onChange={set("location")} placeholder="e.g. Leeds" />
      </div>
      <TextArea label="Anything worth adding? (optional)" rows={4} value={item.details} onChange={set("details")} placeholder="Relevant modules, projects, grades or achievements." />
    </div>
  );
}

export function SkillsStep({
  cv,
  updateField,
  onSuggestSkills,
  assistanceBusy = false,
}: {
  cv: CvData;
  updateField: UpdateField;
  onSuggestSkills: () => void;
  assistanceBusy?: boolean;
}) {
  return (
    <div className="space-y-4">
      <TextArea
        label="Your skills, one per line"
        hint="Concrete and relevant: tools, systems, licences and the things employers ask for."
        rows={9}
        value={cv.skills}
        onChange={(value) => updateField("skills", value)}
        placeholder={"Customer service\nMicrosoft Excel\nTeam communication"}
      />
      <button type="button" onClick={onSuggestSkills} disabled={assistanceBusy} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-gold-tint px-3 text-sm font-bold text-navy hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-50">
        <Sparkles className="h-4 w-4" aria-hidden="true" />Suggest skills from the advert
      </button>
    </div>
  );
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function ProfileStep({
  cv,
  updateField,
  onImproveProfile,
  assistanceBusy = false,
}: {
  cv: CvData;
  updateField: UpdateField;
  onImproveProfile: () => void;
  assistanceBusy?: boolean;
}) {
  const words = countWords(cv.profile);
  return (
    <div className="space-y-3">
      <TextArea
        label="Your profile"
        labelAside={`${words} ${words === 1 ? "word" : "words"} · aim for 40–80`}
        rows={6}
        value={cv.profile}
        onChange={(value) => updateField("profile", value)}
        placeholder="Who you are, what you’re good at and the role you want, in three or four sentences."
      />
      <button type="button" onClick={onImproveProfile} disabled={assistanceBusy} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-gold-tint px-3 text-sm font-bold text-navy hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-50">
        <Sparkles className="h-4 w-4" aria-hidden="true" />Improve profile
      </button>
    </div>
  );
}

export function TemplateChoice({ value, onChange }: { value: TemplateId; onChange: (template: TemplateId) => void }) {
  return (
    <div role="radiogroup" aria-label="Template" className="grid grid-cols-3 gap-3">
      {templates.map((template) => {
        const active = value === template.id;
        return (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(template.id)}
            className={`flex flex-col gap-2 rounded-xl p-2.5 text-left transition ${active ? "border-2 border-navy" : "border border-line hover:border-line-strong"}`}
          >
            <TemplateThumb id={template.id} />
            <span className="flex items-center justify-between gap-2 text-sm font-bold text-navy">
              {template.name}
              {active && <Check className="h-4 w-4 text-success" aria-hidden="true" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TemplateThumb({ id }: { id: TemplateId }) {
  const bar = "h-[3px] rounded-sm bg-line-strong";
  if (id === "modern") {
    return (
      <span aria-hidden="true" className="flex h-[72px] gap-1.5 rounded bg-sand p-2.5">
        <span className="w-5 rounded-sm bg-navy" />
        <span className="flex flex-1 flex-col gap-1"><span className="h-1.5 w-10 rounded-sm bg-navy" /><span className={bar} /><span className={bar} /></span>
      </span>
    );
  }
  if (id === "compact") {
    return (
      <span aria-hidden="true" className="flex h-[72px] gap-1.5 rounded bg-sand p-2.5">
        <span className="flex flex-1 flex-col gap-1"><span className="h-1.5 w-11 rounded-sm bg-navy" /><span className={bar} /><span className={bar} /><span className={bar} /></span>
        <span className="flex w-6 flex-col gap-1"><span className="h-[3px] rounded-sm bg-gold" /><span className={bar} /></span>
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="flex h-[72px] flex-col items-center gap-1 rounded bg-sand px-3.5 py-2.5">
      <span className="h-[3px] w-full bg-navy" /><span className="h-1.5 w-11 rounded-sm bg-navy" /><span className={`${bar} w-full`} /><span className={`${bar} w-full`} />
    </span>
  );
}

function BulletEditor({
  label,
  hint,
  value,
  onChange,
  onRewrite,
  rewriteBusy = false,
  action,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onRewrite?: (index: number) => void;
  rewriteBusy?: boolean;
  action?: React.ReactNode;
}) {
  const bullets = value === "" ? [""] : value.split("\n");
  const commit = (next: string[]) => onChange(next.join("\n"));
  const insert = (index: number) => {
    const next = [...bullets];
    next.splice(index, 0, "");
    commit(next);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= bullets.length) return;
    const next = [...bullets];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  return (
    <fieldset>
      <legend className="text-[0.9375rem] font-bold text-navy">{label}</legend>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-2.5 space-y-2.5">
        {bullets.map((bullet, index) => {
          const reasons = assessExistingBullet(bullet);
          const weak = reasons.length > 0;
          return (
          <div key={index}>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className={`flex min-h-11 min-w-0 items-center gap-2 rounded-lg border bg-white pl-3.5 pr-1.5 focus-within:border-navy focus-within:ring-2 focus-within:ring-gold-tint ${weak ? "border-gold" : "border-line-strong"}`}>
              <input
                value={bullet}
                aria-label={`Bullet point ${index + 1}`}
                onChange={(event) => {
                  const next = [...bullets];
                  next[index] = event.target.value;
                  commit(next);
                }}
                placeholder="Achievement or responsibility"
                className="min-h-10 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-ink outline-none"
              />
              {weak && onRewrite && (
                <button
                  type="button"
                  disabled={rewriteBusy}
                  onClick={() => onRewrite(index)}
                  className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md bg-gold-tint px-2.5 text-[0.8125rem] font-bold text-navy hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Strengthen
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1">
              <IconButton label="Insert bullet below" onClick={() => insert(index + 1)}>
                <Plus className="h-4 w-4" />
              </IconButton>
              <IconButton label="Move bullet up" disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp className="h-4 w-4" />
              </IconButton>
              <IconButton label="Move bullet down" disabled={index === bullets.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Remove bullet"
                disabled={bullets.length === 1 && bullet === ""}
                onClick={() => {
                  const next = bullets.filter((_, bulletIndex) => bulletIndex !== index);
                  commit(next.length > 0 ? next : [""]);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
          {weak && <p className="mt-1 text-[0.8125rem] text-muted">{reasons.join(" · ")}</p>}
          </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => insert(bullets.length)} className="inline-flex min-h-10 items-center gap-1.5 font-bold text-navy hover:underline">
          <Plus className="h-4 w-4" aria-hidden="true" />Add a bullet
        </button>
        {action}
      </div>
    </fieldset>
  );
}

function IconButton({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 min-w-11 items-center justify-center gap-0.5 rounded-lg border border-line bg-white px-1 text-muted hover:text-navy disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:min-w-9"
    >
      {children}
    </button>
  );
}

const fieldClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-gold-tint disabled:bg-paper disabled:text-muted";

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.9375rem] font-bold text-navy">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`min-h-11 ${fieldClass}`}
      />
    </label>
  );
}

function TextArea({
  label,
  labelAside,
  hint,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  labelAside?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.9375rem] font-bold text-navy">{label}</span>
        {labelAside && <span className="text-[0.8125rem] text-muted">{labelAside}</span>}
      </span>
      {hint && <span className="-mt-1 mb-2 block text-sm text-muted">{hint}</span>}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`resize-y py-3 leading-relaxed ${fieldClass}`}
      />
    </label>
  );
}
