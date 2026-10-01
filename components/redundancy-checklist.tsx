"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

export type ChecklistItem = { id: string; text: string; href?: string; linkLabel?: string; external?: boolean };
export type ChecklistPhase = { id: string; when: string; title: string; items: ChecklistItem[] };

const storageKey = "workcv-redundancy-checklist-v1";

// Ticks are saved only in this browser so visitors can come back to the list.
export function RedundancyChecklist({ phases }: { phases: ChecklistPhase[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setDone(saved.filter((id): id is string => typeof id === "string"));
    } catch {
      // Storage can be blocked; ticks then last for this visit only.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(done));
    } catch {
      // Ignore: the checklist still works without saving.
    }
  }, [done, loaded]);

  const toggle = (id: string) => setDone((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const count = done.filter((id) => phases.some((phase) => phase.items.some((item) => item.id === id))).length;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-6 flex items-center gap-4 rounded-lg border border-line bg-white/95 px-4 py-3 backdrop-blur">
        <p className="shrink-0 text-sm font-bold text-navy" aria-live="polite">
          {count} of {total} done
        </p>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
        </div>
        {count ? (
          <button type="button" onClick={() => setDone([])} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-muted hover:text-navy">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
        ) : null}
      </div>
      <ol className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <li key={phase.id} id={phase.id} className="scroll-mt-28">
            <div className="flex items-baseline gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">{phaseIndex + 1}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-success">{phase.when}</p>
                <h3 className="font-display text-2xl font-semibold text-navy">{phase.title}</h3>
              </div>
            </div>
            <ul className="mt-4 space-y-2 sm:pl-12">
              {phase.items.map((item) => {
                const checked = done.includes(item.id);
                return (
                  <li key={item.id} className={`rounded-lg border p-4 ${checked ? "border-success/40 bg-greensoft" : "border-line bg-white"}`}>
                    <label className="flex cursor-pointer gap-3">
                      <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} className="sr-only" />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-success bg-success text-white" : "border-line-strong bg-white"}`}
                      >
                        {checked ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className={`text-sm leading-6 ${checked ? "text-muted line-through decoration-muted/40" : "text-ink"}`}>{item.text}</span>
                    </label>
                    {item.href && item.linkLabel ? (
                      item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="ml-8 mt-2 inline-block text-sm font-bold text-navy underline underline-offset-4">
                          {item.linkLabel}
                        </a>
                      ) : (
                        <Link href={item.href} className="ml-8 mt-2 inline-block text-sm font-bold text-navy underline underline-offset-4">
                          {item.linkLabel}
                        </Link>
                      )
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
