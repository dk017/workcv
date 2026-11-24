"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download } from "lucide-react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { formatUkDate, todayIsoDate, type NoticeUnit } from "@/lib/notice-period-calculator";
import { buildResignation } from "@/lib/resignation-letter";

const tool = "resignation_letter";
const inputClass =
  "mt-1.5 min-h-11 w-full rounded-md border border-line-strong bg-white px-3 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";
const labelClass = "block text-sm font-bold text-navy";
const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:border-navy disabled:opacity-50";

export function ResignationLetterGenerator() {
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [noticeStated, setNoticeStated] = useState(true);
  const [amount, setAmount] = useState("4");
  const [unit, setUnit] = useState<NoticeUnit>("weeks");
  const [preferredLastDay, setPreferredLastDay] = useState("");
  const [reason, setReason] = useState("");
  const [thanks, setThanks] = useState(true);
  const [askHolidayPay, setAskHolidayPay] = useState(true);
  const [offerHandover, setOfferHandover] = useState(true);
  const [view, setView] = useState<"letter" | "email">("letter");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const started = useRef(false);

  // Today's date is set in the browser so the server render does not fix it.
  useEffect(() => setLetterDate(todayIsoDate()), []);

  function begin() {
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("tool_started", { tool });
  }
  function completed(result: "success" | "error", placement: string) {
    trackFunnelEvent("tool_completed", { tool, result, placement });
  }
  const change = <T,>(set: (value: T) => void) => (value: T) => { begin(); setStatus(""); set(value); };

  const amountNumber = Number(amount);
  const contractualPeriod = noticeStated && Number.isInteger(amountNumber) && amountNumber > 0 ? { amount: amountNumber, unit } : null;
  const result =
    letterDate && startDate
      ? buildResignation({ name, managerName, jobTitle, employer, letterDate, employmentStartDate: startDate, contractualPeriod, preferredLastDay, reason, thanks, askHolidayPay, offerHandover })
      : null;
  const ready = result?.ok ? result : null;
  const text = ready ? (view === "letter" ? ready.letter : `Subject: ${ready.emailSubject}\n\n${ready.emailBody}`) : "";

  async function copy() {
    if (!ready) return;
    try {
      await navigator.clipboard.writeText(view === "letter" ? ready.letter : ready.emailBody);
      setStatus(view === "letter" ? "Letter copied." : "Email copied. Paste the subject line separately.");
      completed("success", `${view}_copy`);
    } catch {
      setStatus("Copy was blocked. Select the text and copy it manually.");
      completed("error", `${view}_copy`);
    }
  }

  async function download() {
    if (!ready) return;
    setBusy(true);
    setStatus("");
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const document = new Document({ sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
        children: ready.letter.split("\n").map((line) => new Paragraph({ spacing: { after: line ? 80 : 120 }, children: [new TextRun({ text: line, font: "Arial", size: 22 })] })),
      }] });
      const url = URL.createObjectURL(await Packer.toBlob(document));
      const link = window.document.createElement("a");
      link.href = url;
      link.download = "resignation-letter.docx";
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus("Word file prepared. Check it, then sign and date it if you are printing it.");
      completed("success", "letter_word");
    } catch {
      setStatus("The Word file could not be prepared. Copy the letter instead.");
      completed("error", "letter_word");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Your name
            <input className={inputClass} value={name} maxLength={80} autoComplete="name" onChange={(e) => change(setName)(e.target.value)} />
          </label>
          <label className={labelClass}>Manager&apos;s name
            <input className={inputClass} value={managerName} maxLength={80} placeholder="e.g. Priya Shah" onChange={(e) => change(setManagerName)(e.target.value)} />
          </label>
          <label className={labelClass}>Your job title
            <input className={inputClass} value={jobTitle} maxLength={100} onChange={(e) => change(setJobTitle)(e.target.value)} />
          </label>
          <label className={labelClass}>Employer
            <input className={inputClass} value={employer} maxLength={100} onChange={(e) => change(setEmployer)(e.target.value)} />
          </label>
          <label className={labelClass}>Date you hand it in
            <input type="date" className={inputClass} value={letterDate} onChange={(e) => change(setLetterDate)(e.target.value)} />
          </label>
          <label className={labelClass}>Date you started this job *
            <input type="date" className={inputClass} value={startDate} required onChange={(e) => change(setStartDate)(e.target.value)} />
          </label>
        </div>

        <fieldset className="rounded-lg border border-line bg-paper p-4">
          <legend className="px-1 text-sm font-bold text-navy">Notice period in your contract</legend>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={!noticeStated} onChange={(e) => change(setNoticeStated)(!e.target.checked)} className="h-4 w-4 accent-navy" />
            My contract does not say, or I can&apos;t check it
          </label>
          {noticeStated ? (
            <div className="mt-3 grid grid-cols-[110px_1fr] gap-3">
              <label className="sr-only" htmlFor="resignation-notice-amount">Notice length</label>
              <input id="resignation-notice-amount" type="number" min={1} max={52} inputMode="numeric" className={inputClass} value={amount} onChange={(e) => change(setAmount)(e.target.value)} />
              <label className="sr-only" htmlFor="resignation-notice-unit">Notice unit</label>
              <select id="resignation-notice-unit" className={inputClass} value={unit} onChange={(e) => change(setUnit)(e.target.value as NoticeUnit)}>
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
              </select>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-muted">The letter uses the legal minimum of 1 week (after a month in the job) and asks your employer to confirm.</p>
          )}
        </fieldset>

        <label className={labelClass}>Preferred last day <span className="font-normal text-muted">(optional, if later than your notice)</span>
          <input type="date" className={inputClass} value={preferredLastDay} onChange={(e) => change(setPreferredLastDay)(e.target.value)} />
        </label>
        <label className={labelClass}>Reason for leaving <span className="font-normal text-muted">(optional, one sentence)</span>
          <input className={inputClass} value={reason} maxLength={240} placeholder="e.g. I have accepted a role closer to home." onChange={(e) => change(setReason)(e.target.value)} />
        </label>
        <fieldset className="space-y-2 text-sm text-ink">
          <legend className="text-sm font-bold text-navy">Include</legend>
          {([
            [offerHandover, setOfferHandover, "An offer to hand over your work"],
            [askHolidayPay, setAskHolidayPay, "A request to confirm holiday and final pay"],
            [thanks, setThanks, "A thank-you line"],
          ] as const).map(([checked, set, label]) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" checked={checked} onChange={(e) => change(set)(e.target.checked)} className="h-4 w-4 accent-navy" />
              {label}
            </label>
          ))}
        </fieldset>
      </form>

      <div>
        {ready ? (
          <p className="rounded-lg border-2 border-navy bg-white p-4 text-navy" aria-live="polite">
            <span className="block text-sm font-bold uppercase tracking-[0.12em] text-success">Your last day</span>
            <span className="mt-1 block font-display text-3xl font-semibold">{formatUkDate(ready.lastDay)}</span>
            <span className="mt-1 block text-sm text-muted">
              {ready.noticeSource === "none" ? "Under a month in the job: no minimum notice." : `Notice: ${ready.noticeLabel}${ready.noticeSource === "statutory" ? (contractualPeriod ? " (legal minimum, longer than your contract)" : " (legal minimum)") : ""}, starting the day after you hand it in.`}
            </span>
          </p>
        ) : result && !result.ok ? (
          <p className="rounded-lg border border-[#e0b4b4] bg-redsoft p-4 text-sm font-bold text-[#9b1c1c]" role="alert">{result.error}</p>
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong bg-paper p-4 text-sm text-muted">Add the date you started this job to work out your last day and write the letter.</p>
        )}

        <div className="mt-4 grid grid-cols-2 rounded-md border border-line-strong bg-white p-1" role="group" aria-label="Letter or email">
          {(["letter", "email"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={view === item} onClick={() => { setView(item); setStatus(""); }} className={`min-h-10 rounded px-3 text-sm font-bold ${view === item ? "bg-navy text-white" : "text-muted hover:bg-paper"}`}>
              {item === "letter" ? "Letter" : "Email"}
            </button>
          ))}
        </div>
        <pre className="mt-3 min-h-[360px] whitespace-pre-wrap rounded-md border border-line-strong bg-white p-4 font-sans text-[15px] leading-7 text-ink" aria-label={view === "letter" ? "Your resignation letter" : "Your resignation email"}>
          {text || "Your letter appears here."}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" disabled={!ready} onClick={copy} className={secondaryButton}>
            <Copy className="h-4 w-4" aria-hidden="true" /> {view === "letter" ? "Copy letter" : "Copy email"}
          </button>
          <button type="button" disabled={!ready || busy} onClick={download} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover disabled:opacity-50">
            <Download className="h-4 w-4" aria-hidden="true" /> {busy ? "Preparing Word file…" : "Download letter as Word"}
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-sm leading-6 text-navy">{status}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Nothing you type is sent to WorkCV. Changing jobs?{" "}
          <TrackedLink href="/editor?template=classic&new=1" placement={analyticsPlacements.resignationEditor} className="font-bold text-navy underline underline-offset-4">
            Update your CV for the next role
          </TrackedLink>
          .
        </p>
      </div>
    </div>
  );
}
