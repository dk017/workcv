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
  templates,
} from "@/lib/editor-data";

export function ProfileForm({
  cv,
  updateField,
  onImproveProfile,
  assistanceBusy = false,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
  onImproveProfile: () => void;
  assistanceBusy?: boolean;
}) {
  return (
    <FormSection
      title="Profile and contact"
      description="Use UK-friendly contact details. Keep the profile direct and role-focused."
      action={<SmallButton onClick={onImproveProfile} disabled={assistanceBusy}><Sparkles className="h-4 w-4" />Improve profile</SmallButton>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={cv.fullName}
          onChange={(value) => updateField("fullName", value)}
          placeholder="e.g. Emily Thompson"
        />
        <TextField
          label="Target role"
          value={cv.targetRole}
          onChange={(value) => updateField("targetRole", value)}
          placeholder="e.g. Customer Service Assistant"
        />
        <TextField
          label="Email"
          value={cv.email}
          onChange={(value) => updateField("email", value)}
          placeholder="e.g. emily.thompson@email.co.uk"
        />
        <TextField
          label="Phone"
          value={cv.phone}
          onChange={(value) => updateField("phone", value)}
          placeholder="e.g. 07123 456 789"
        />
        <TextField
          label="Location"
          value={cv.location}
          onChange={(value) => updateField("location", value)}
          placeholder="e.g. Leeds, UK"
        />
        <TextField
          label="LinkedIn or portfolio"
          value={cv.linkedin}
          onChange={(value) => updateField("linkedin", value)}
          placeholder="e.g. linkedin.com/in/emilythompson"
        />
      </div>
      <TextArea
        label="Personal profile"
        rows={6}
        value={cv.profile}
        onChange={(value) => updateField("profile", value)}
        placeholder="Summarise your experience, strengths and the role you are targeting in 3–4 concise sentences."
      />
    </FormSection>
  );
}

export function ExperienceForm({
  cv,
  updateExperience,
  addExperience,
  removeExperience,
  moveExperience,
  onImproveBullets,
  assistanceBusy = false,
}: {
  cv: CvData;
  updateExperience: (id: string, key: keyof ExperienceItem, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  moveExperience: (index: number, direction: -1 | 1) => void;
  onImproveBullets: (id: string) => void;
  assistanceBusy?: boolean;
}) {
  return (
    <FormSection
      title="Experience"
      description="List most recent experience first. Use bullets that show what you did and how you worked."
      action={
        <SmallButton onClick={addExperience}>
          <Plus className="h-4 w-4" />
          Add role
        </SmallButton>
      }
    >
      <div className="space-y-5">
        {cv.experience.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-line bg-paper p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-navy">Role {index + 1}</h3>
              <div className="flex flex-wrap items-center gap-1 sm:justify-end">
                <button type="button" onClick={() => onImproveBullets(item.id)} disabled={assistanceBusy} className="mr-1 inline-flex min-h-11 items-center gap-1 rounded border border-line bg-white px-2 text-xs font-bold text-navy hover:border-navy disabled:cursor-not-allowed disabled:opacity-50 sm:mr-2 sm:min-h-8">
                  <Sparkles className="h-3.5 w-3.5" />Improve
                </button>
                <IconButton
                  label="Move role up"
                  disabled={index === 0}
                  onClick={() => moveExperience(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Move role down"
                  disabled={index === cv.experience.length - 1}
                  onClick={() => moveExperience(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                {cv.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(item.id)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-navy"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Role"
                value={item.role}
                onChange={(value) => updateExperience(item.id, "role", value)}
                placeholder="e.g. Retail Assistant"
              />
              <TextField
                label="Company"
                value={item.company}
                onChange={(value) => updateExperience(item.id, "company", value)}
                placeholder="e.g. North Street Books"
              />
              <TextField
                label="Location"
                value={item.location}
                onChange={(value) => updateExperience(item.id, "location", value)}
                placeholder="e.g. Leeds"
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Start"
                  value={item.start}
                  onChange={(value) => updateExperience(item.id, "start", value)}
                  placeholder="e.g. Jun 2024"
                />
                <TextField
                  label="End"
                  value={item.end}
                  onChange={(value) => updateExperience(item.id, "end", value)}
                  placeholder="e.g. Present"
                />
              </div>
            </div>
            <BulletEditor
              value={item.bullets}
              onChange={(value) => updateExperience(item.id, "bullets", value)}
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}

export function EducationForm({
  cv,
  updateEducation,
  addEducation,
  removeEducation,
  moveEducation,
}: {
  cv: CvData;
  updateEducation: (id: string, key: keyof EducationItem, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  moveEducation: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <FormSection
      title="Education"
      description="For students and school leavers, education can come before work history in the final template."
      action={
        <SmallButton onClick={addEducation}>
          <Plus className="h-4 w-4" />
          Add education
        </SmallButton>
      }
    >
      <div className="space-y-5">
        {cv.education.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-line bg-paper p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-navy">Education {index + 1}</h3>
              <div className="flex flex-wrap items-center gap-1 sm:justify-end">
                <IconButton
                  label="Move education up"
                  disabled={index === 0}
                  onClick={() => moveEducation(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Move education down"
                  disabled={index === cv.education.length - 1}
                  onClick={() => moveEducation(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                {cv.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(item.id)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-navy"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Qualification"
                value={item.qualification}
                onChange={(value) => updateEducation(item.id, "qualification", value)}
                placeholder="e.g. BA Business Management"
              />
              <TextField
                label="Institution"
                value={item.institution}
                onChange={(value) => updateEducation(item.id, "institution", value)}
                placeholder="e.g. University of Leeds"
              />
              <TextField
                label="Location"
                value={item.location}
                onChange={(value) => updateEducation(item.id, "location", value)}
                placeholder="e.g. Leeds"
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Start"
                  value={item.start}
                  onChange={(value) => updateEducation(item.id, "start", value)}
                  placeholder="e.g. 2021"
                />
                <TextField
                  label="End"
                  value={item.end}
                  onChange={(value) => updateEducation(item.id, "end", value)}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <TextArea
              label="Details"
              rows={4}
              value={item.details}
              onChange={(value) => updateEducation(item.id, "details", value)}
              placeholder="Add relevant modules, projects, grades or achievements."
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}

export function SkillsForm({
  cv,
  updateField,
  onSuggestSkills,
  assistanceBusy = false,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
  onSuggestSkills: () => void;
  assistanceBusy?: boolean;
}) {
  return (
    <FormSection
      title="Skills"
      description="Add one skill per line. Keep them concrete and relevant to the role."
      action={<SmallButton onClick={onSuggestSkills} disabled={assistanceBusy}><Sparkles className="h-4 w-4" />Suggest skills</SmallButton>}
    >
      <TextArea
        label="Skills"
        rows={10}
        value={cv.skills}
        onChange={(value) => updateField("skills", value)}
        placeholder={"Customer service\nMicrosoft Excel\nTeam communication"}
      />
    </FormSection>
  );
}

export function TemplateForm({
  cv,
  updateField,
}: {
  cv: CvData;
  updateField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
}) {
  return (
    <FormSection
      title="Template"
      description="Switch template style without losing your CV content."
    >
      <div className="grid gap-3">
        {templates.map((template) => {
          const active = cv.template === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => updateField("template", template.id)}
              className={`rounded-lg border p-4 text-left transition ${
                active
                  ? "border-navy bg-greensoft"
                  : "border-line bg-paper hover:border-line-strong"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{template.description}</p>
                </div>
                {active && <Check className="h-5 w-5 text-success" />}
              </div>
            </button>
          );
        })}
      </div>
    </FormSection>
  );
}

function FormSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function BulletEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
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
      <legend className="mb-2 text-sm font-bold text-navy">Bullet points</legend>
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <input
              value={bullet}
              onChange={(event) => {
                const next = [...bullets];
                next[index] = event.target.value;
                commit(next);
              }}
              placeholder="Achievement or responsibility"
              className="min-h-10 min-w-0 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint"
            />
            <div className="flex flex-wrap items-center justify-end gap-1">
              <IconButton label="Insert bullet above" onClick={() => insert(index)}>
                <Plus className="h-3.5 w-3.5" />
                <ArrowUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Insert bullet below" onClick={() => insert(index + 1)}>
                <Plus className="h-3.5 w-3.5" />
                <ArrowDown className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Move bullet up"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Move bullet down"
                disabled={index === bullets.length - 1}
                onClick={() => move(index, 1)}
              >
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
        ))}
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
      className="inline-flex h-11 min-w-11 items-center justify-center gap-0.5 rounded border border-line bg-white px-1 text-muted hover:text-navy disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:min-w-8"
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-navy">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-navy">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-md border border-line bg-white px-3 py-3 text-sm leading-6 text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
      />
    </label>
  );
}

function SmallButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-navy px-3 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
