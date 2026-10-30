"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

import type { ExperienceItem } from "@/lib/editor-data";
import { canAddToSkills, displayKeyword } from "@/lib/keyword-triage";
import type { MatchProgress, VacancyTriage, VaguePhraseItem } from "@/lib/vacancy-fit";

type Requirement = VacancyTriage["requirements"]["queue"][number];
type Keyword = VacancyTriage["queue"][number];

type Handlers = {
  onAddSkill: (term: string) => void;
  onSkipKeyword: (term: string) => void;
  onSkipRequirement: (requirement: string) => void;
  /** `requirement` is set when the note answers an advert requirement, `keyword` when it answers a keyword. */
  onDraftBullet: (draft: { roleId: string; note: string; keyword?: string; requirement?: string }) => void;
  onRewritePhrase: (item: VaguePhraseItem) => void;
  onResetSkipped: () => void;
};

const button = "inline-flex min-h-10 items-center gap-1.5 rounded-md border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50";

export function KeywordTriagePanel({
  triage,
  phrases,
  progress,
  experience,
  busy,
  ...handlers
}: { triage: VacancyTriage; phrases: VaguePhraseItem[]; progress: MatchProgress; experience: ExperienceItem[]; busy: boolean } & Handlers) {
  const requirement = triage.requirements.queue[0];
  const keyword = requirement ? undefined : triage.queue[0];
  const remaining = triage.requirements.queue.length + triage.queue.length - 1;
  const skipped = [...triage.requirements.skipped.map((item) => item.requirement), ...triage.skipped.map((item) => displayKeyword(item.term))];

  return (
    <div className="mt-5 rounded-lg border border-line bg-white p-4">
      <p className="text-sm font-bold text-navy">Keyword targeting</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Progress against this advert">
        <Stat label="Advert keywords on your CV" value={`${progress.keywords.found} of ${progress.keywords.total}`} />
        {progress.requirements && <Stat label="Requirements answered" value={`${progress.requirements.handled} of ${progress.requirements.total}`} />}
        <Stat label="Bullets showing a result" value={`${progress.bulletsWithResults.count} of ${progress.bulletsWithResults.total}`} />
        <Stat label="Bullets flagged as weak" value={String(progress.flaggedBullets)} />
      </dl>

      {requirement ? (
        <Question
          key={`requirement-${requirement.requirement}`}
          label={requirement.requirement}
          lead="The advert asks for"
          badge={requirement.status === "partly-supported" ? "Partly evidenced" : "Not evidenced"}
          badgeTone={requirement.status === "partly-supported" ? "amber" : "red"}
          finding={requirement.explanation}
          roles={experience}
          busy={busy}
          remaining={remaining}
          onDraft={(roleId, note) => handlers.onDraftBullet({ roleId, note, requirement: requirement.requirement })}
          onSkip={() => handlers.onSkipRequirement(requirement.requirement)}
        />
      ) : keyword ? (
        <Question
          key={`keyword-${keyword.term}`}
          label={displayKeyword(keyword.term)}
          lead="The advert asks for"
          badge={keyword.importance}
          badgeTone={keyword.importance === "Essential" ? "red" : "amber"}
          roles={experience}
          busy={busy}
          remaining={remaining}
          canAddSkill={canAddToSkills(keyword)}
          onAddSkill={() => handlers.onAddSkill(keyword.term)}
          onDraft={(roleId, note) => handlers.onDraftBullet({ roleId, note, keyword: displayKeyword(keyword.term) })}
          onSkip={() => handlers.onSkipKeyword(keyword.term)}
        />
      ) : (
        <p className="mt-3 text-sm text-ink">
          {triage.total || triage.requirements.answered.length || triage.requirements.skipped.length
            ? "You have answered every advert requirement and keyword."
            : "No skill or qualification keywords were found in this advert."}
        </p>
      )}

      {phrases.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-sm font-bold text-navy">Phrases the checker called vague</p>
          <ul className="mt-2 grid gap-2">
            {phrases.map((item) => (
              <li key={item.phrase} className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-line bg-paper px-3 py-2">
                <span className="min-w-0 text-sm text-ink">
                  <strong className="text-navy">&ldquo;{item.phrase}&rdquo;</strong>
                  <span className="mt-0.5 block text-xs leading-5 text-muted">
                    {item.reason} ({item.where.kind === "profile" ? "in your profile" : `in ${item.where.roleTitle}`})
                  </span>
                </span>
                <button type="button" disabled={busy} onClick={() => handlers.onRewritePhrase(item)} className={`${button} min-h-9 shrink-0 border-line-strong bg-white px-2 text-xs text-navy`}>
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Rewrite with AI
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {triage.found.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Advert keywords already on your CV">
          {triage.found.slice(0, 14).map((item) => (
            <li key={item.term} className="inline-flex items-center gap-1 rounded bg-greensoft px-2 py-1 text-xs font-bold text-navy">
              <Check className="h-3 w-3" aria-hidden="true" />
              {displayKeyword(item.term)}
            </li>
          ))}
        </ul>
      )}

      {skipped.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Skipped as not relevant: {skipped.join(", ")}.{" "}
          <button type="button" onClick={handlers.onResetSkipped} className="font-bold text-navy underline">
            Ask again
          </button>
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-2">
      <dd className="font-display text-lg font-semibold leading-6 text-navy">{value}</dd>
      <dt className="text-[11px] leading-4 text-muted">{label}</dt>
    </div>
  );
}

function Question({
  label,
  lead,
  badge,
  badgeTone,
  finding,
  roles: allRoles,
  busy,
  remaining,
  canAddSkill = false,
  onAddSkill,
  onDraft,
  onSkip,
}: {
  label: string;
  lead: string;
  badge: string;
  badgeTone: "red" | "amber";
  finding?: string;
  roles: ExperienceItem[];
  busy: boolean;
  remaining: number;
  canAddSkill?: boolean;
  onAddSkill?: () => void;
  onDraft: (roleId: string, note: string) => void;
  onSkip: () => void;
}) {
  const roles = allRoles.filter((item) => item.role.trim());
  const [writing, setWriting] = useState(false);
  const [note, setNote] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const noteReady = note.trim().length >= 8 && roles.some((role) => role.id === roleId);

  return (
    <div className="mt-3">
      <p className="text-sm leading-6 text-ink">
        {lead} <strong className="text-navy">{label}</strong>{" "}
        <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold uppercase ${badgeTone === "red" ? "bg-red-100 text-red-800" : "bg-gold-tint text-navy"}`}>{badge}</span>
        . Is it part of your real experience?
      </p>
      {finding && <p className="mt-1 text-xs leading-5 text-muted">What the checker found: {finding}</p>}

      {!writing ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {canAddSkill && onAddSkill && (
            <button type="button" onClick={onAddSkill} className={`${button} border-navy bg-navy text-white`}>
              Yes, add to skills
            </button>
          )}
          <button type="button" onClick={() => setWriting(true)} className={`${button} border-line-strong bg-white text-navy`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Yes, write a bullet
          </button>
          <button type="button" onClick={onSkip} className={`${button} border-transparent bg-transparent text-muted hover:text-navy`}>
            Skip, not relevant
          </button>
        </div>
      ) : roles.length === 0 ? (
        <div className="mt-3 text-sm text-muted">
          Add a role with a job title in Experience first, then come back to write this bullet.{" "}
          <button type="button" onClick={() => setWriting(false)} className="font-bold text-navy underline">Back</button>
        </div>
      ) : (
        <div className="mt-3 grid gap-3">
          <label className="block">
            <span className="text-xs font-bold text-navy">In one line, how have you done this? Only real facts.</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={400}
              autoFocus
              placeholder="e.g. Logged customer cases in …"
              className="mt-1 min-h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint"
            />
          </label>
          {roles.length > 1 && (
            <label className="block">
              <span className="text-xs font-bold text-navy">Add it to</span>
              <select value={roleId} onChange={(event) => setRoleId(event.target.value)} className="mt-1 min-h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink">
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}{role.company ? ` · ${role.company}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!noteReady || busy} onClick={() => onDraft(roleId, note)} className={`${button} border-navy bg-navy text-white`}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {busy ? "Drafting…" : "Draft bullet"}
            </button>
            <button type="button" onClick={() => setWriting(false)} className={`${button} border-line-strong bg-white text-navy`}>
              Back
            </button>
          </div>
        </div>
      )}

      {remaining > 0 && <p className="mt-3 text-xs text-muted">{remaining} more to check after this one.</p>}
    </div>
  );
}
