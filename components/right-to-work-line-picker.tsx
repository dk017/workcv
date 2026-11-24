"use client";

import { useRef, useState } from "react";
import { Check, Copy, Lock } from "lucide-react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { rightToWorkSituations } from "@/lib/right-to-work-lines";

const tool = "right_to_work_line";

export function RightToWorkLinePicker() {
  const [id, setId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const started = useRef(false);
  const situation = rightToWorkSituations.find((item) => item.id === id);

  function choose(next: string) {
    setId(next);
    setStatus("");
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("tool_started", { tool });
  }

  async function copy() {
    if (!situation) return;
    try {
      await navigator.clipboard.writeText(situation.line);
      setStatus("Copied. Paste it under your contact details.");
      trackFunnelEvent("tool_completed", { tool, result: "success", placement: situation.id });
    } catch {
      setStatus("Copy was blocked. Select the line and copy it manually.");
      trackFunnelEvent("tool_completed", { tool, result: "error", placement: situation.id });
    }
  }

  return (
    <div className="rounded-xl border-2 border-navy bg-white p-5 shadow-soft md:p-6">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Find your CV line</p>
      <fieldset className="mt-4">
        <legend className="font-display text-2xl font-semibold text-navy">Which describes you now?</legend>
        <div className="mt-4 grid gap-2">
          {rightToWorkSituations.map((item) => (
            <label
              key={item.id}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm font-bold ${id === item.id ? "border-navy bg-paper text-navy" : "border-line-strong text-ink hover:border-navy"}`}
            >
              <input type="radio" name="right-to-work-situation" value={item.id} checked={id === item.id} onChange={() => choose(item.id)} className="h-4 w-4 accent-navy" />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      {situation ? (
        <div className="mt-5" aria-live="polite">
          <p className="text-sm font-bold text-navy">How it looks at the top of your CV</p>
          <div className="mt-2 rounded-md border border-line bg-paper p-4 font-serif text-sm leading-6 text-ink">
            <p className="text-base font-bold">Alex Morgan</p>
            <p className="text-muted">Manchester · 07700 900123 · alex.morgan@example.com</p>
            <p className="mt-1 font-bold text-navy">{situation.line}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{situation.note}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={copy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:border-navy">
              {status.startsWith("Copied") ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              Copy this line
            </button>
            {situation.needsSponsor ? (
              <TrackedLink href="/tools/uk-visa-sponsor-checker" placement={analyticsPlacements.rightToWorkPickerSponsor} className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
                Check an employer can sponsor
              </TrackedLink>
            ) : (
              <TrackedLink href="/editor?template=classic&new=1" placement={analyticsPlacements.rightToWorkPickerEditor} className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
                Build my UK CV free
              </TrackedLink>
            )}
          </div>
          {status ? <p className="mt-2 text-sm text-muted" role="status">{status}</p> : null}
        </div>
      ) : null}

      <p className="mt-5 flex gap-2 border-t border-line pt-4 text-sm leading-6 text-muted">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        Never put a share code, passport or BRP number on a CV. A share code is for the employer&apos;s check, not a file that gets forwarded.
      </p>
    </div>
  );
}
