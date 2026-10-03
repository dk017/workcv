"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

import type { ExperienceItem } from "@/lib/editor-data";
import { canAddToSkills, displayKeyword, type KeywordTriage } from "@/lib/keyword-triage";

type Handlers = {
  onAddSkill: (term: string) => void;
  onSkip: (term: string) => void;
  onDraftBullet: (term: string, roleId: string, note: string) => void;
  onResetSkipped: () => void;
};

export function KeywordTriagePanel({
  triage,
  experience,
  busy,
  ...handlers
}: { triage: KeywordTriage; experience: ExperienceItem[]; busy: boolean } & Handlers) {
  const current = triage.queue[0];
  return (
    <div className="mt-5 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-bold text-navy">Keyword targeting</p>
        <p className="text-xs text-muted">
          {triage.found.length} of {triage.total} advert keywords are on your CV
        </p>
      </div>

      {current ? (
        <KeywordQuestion key={current.term} keyword={current} remaining={triage.queue.length - 1} experience={experience} busy={busy} {...handlers} />
      ) : (
        <p className="mt-3 text-sm text-ink">
          {triage.total ? "You have answered every advert keyword." : "No skill or qualification keywords were found in this advert."}
        </p>
      )}

      {triage.found.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Advert keywords already on your CV">
          {triage.found.slice(0, 14).map((keyword) => (
            <li key={keyword.term} className="inline-flex items-center gap-1 rounded bg-greensoft px-2 py-1 text-xs font-bold text-navy">
              <Check className="h-3 w-3" aria-hidden="true" />
              {displayKeyword(keyword.term)}
            </li>
          ))}
        </ul>
      )}

      {triage.skipped.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Skipped as not relevant: {triage.skipped.map((keyword) => displayKeyword(keyword.term)).join(", ")}.{" "}
          <button type="button" onClick={handlers.onResetSkipped} className="font-bold text-navy underline">
            Ask again
          </button>
        </p>
      )}
    </div>
  );
}

function KeywordQuestion({
  keyword,
  remaining,
  experience,
  busy,
  onAddSkill,
  onSkip,
  onDraftBullet,
}: {
  keyword: KeywordTriage["queue"][number];
  remaining: number;
  experience: ExperienceItem[];
  busy: boolean;
} & Omit<Handlers, "onResetSkipped">) {
  const roles = experience.filter((item) => item.role.trim());
  const term = displayKeyword(keyword.term);
  const [writing, setWriting] = useState(false);
  const [note, setNote] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const noteReady = note.trim().length >= 8 && roles.some((role) => role.id === roleId);
  const button = "inline-flex min-h-10 items-center gap-1.5 rounded-md border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mt-3">
      <p className="text-sm leading-6 text-ink">
        The advert asks for <strong className="text-navy">{term}</strong>{" "}
        <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold uppercase ${keyword.importance === "Essential" ? "bg-red-100 text-red-800" : "bg-gold-tint text-navy"}`}>
          {keyword.importance}
        </span>
        . Is it part of your real experience?
      </p>

      {!writing ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {canAddToSkills(keyword) && (
            <button type="button" onClick={() => onAddSkill(keyword.term)} className={`${button} border-navy bg-navy text-white`}>
              Yes, add to skills
            </button>
          )}
          <button type="button" onClick={() => setWriting(true)} className={`${button} border-line-strong bg-white text-navy`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Yes, write a bullet
          </button>
          <button type="button" onClick={() => onSkip(keyword.term)} className={`${button} border-transparent bg-transparent text-muted hover:text-navy`}>
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
            <span className="text-xs font-bold text-navy">In one line, how did you use {term}? Only real facts.</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={400}
              autoFocus
              placeholder={`e.g. Used ${term} every shift to …`}
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
            <button type="button" disabled={!noteReady || busy} onClick={() => onDraftBullet(term, roleId, note)} className={`${button} border-navy bg-navy text-white`}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {busy ? "Drafting…" : "Draft bullet"}
            </button>
            <button type="button" onClick={() => setWriting(false)} className={`${button} border-line-strong bg-white text-navy`}>
              Back
            </button>
          </div>
        </div>
      )}

      {remaining > 0 && <p className="mt-3 text-xs text-muted">{remaining} more advert keyword{remaining === 1 ? "" : "s"} to check after this one.</p>}
    </div>
  );
}
