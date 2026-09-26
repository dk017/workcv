"use client";

import { useState } from "react";
import { Copy, Download, FileText, Plus, Trash2 } from "lucide-react";

import {
  COVER_LETTER_TARGET_WORDS,
  coverLetterBody,
  coverLetterChecks,
  coverLetterFor,
  coverLetterGreeting,
  coverLetterParagraphGuides,
  coverLetterPlainText,
  coverLetterSignOff,
  countLetterWords,
  hasCoverLetterContent,
  splitLetterText,
} from "@/lib/cover-letter-document";
import { COVER_LETTER_MAX_PARAGRAPHS, type CoverLetter, type CvData } from "@/lib/editor-data";
import { site } from "@/lib/site";

const field = "mt-2 w-full rounded-md border border-line-strong bg-white px-3 py-2.5 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";
const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50";

export type CoverLetterEvent = "cover_letter_copied" | "cover_letter_pack_imported";

export function CoverLetterForm({
  cv,
  onChange,
  onEvent,
  downloadUnlocked,
  downloading,
  onDownload,
}: {
  cv: CvData;
  onChange: (value: CvData) => void;
  onEvent: (eventName: CoverLetterEvent) => void;
  downloadUnlocked: boolean;
  downloading: "pdf" | "docx" | null;
  onDownload: (format: "pdf" | "docx") => void;
}) {
  const letter = coverLetterFor(cv);
  const [status, setStatus] = useState("");
  const update = (patch: Partial<CoverLetter>) => onChange({ ...cv, coverLetter: { ...letter, ...patch } });
  const updateParagraph = (index: number, value: string) =>
    update({ paragraphs: letter.paragraphs.map((paragraph, i) => (i === index ? value : paragraph)) });

  const words = countLetterWords(coverLetterBody(letter).join(" "));
  const checks = coverLetterChecks(cv);
  const packLetter = cv.applicationPack?.coverLetter?.trim() || "";
  const canImportPack = Boolean(packLetter) && !hasCoverLetterContent(cv);
  const hasContent = hasCoverLetterContent(cv);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetterPlainText(cv));
      setStatus("Letter text copied. Paste it into the application form or email.");
      onEvent("cover_letter_copied");
    } catch {
      setStatus("Copying was blocked by your browser. Select the preview text and copy it manually.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy">Cover letter</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Your letter uses the name, contact details and design from your CV. Writing and previewing are free. The
          PDF and Word files are included in the same {site.price} download as your CV.
        </p>
      </div>

      {canImportPack && (
        <div className="rounded-md border border-gold bg-gold-tint p-4 text-sm leading-6 text-navy">
          <p className="font-bold">You already drafted a letter in your application pack.</p>
          <button
            type="button"
            className={`${secondaryButton} mt-3`}
            onClick={() => {
              const paragraphs = splitLetterText(packLetter, cv.fullName);
              if (!paragraphs.length) return;
              update({ paragraphs });
              onEvent("cover_letter_pack_imported");
              setStatus("Application-pack letter added. Check every paragraph before sending.");
            }}
          >
            Use my application-pack letter
          </button>
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-[0.12em] text-muted">The job</legend>
        <label className="block text-sm font-bold text-navy">
          Job title
          <input className={field} maxLength={160} value={letter.jobTitle} placeholder="e.g. Customer Service Assistant" onChange={(event) => update({ jobTitle: event.target.value })} />
        </label>
        <label className="block text-sm font-bold text-navy">
          Employer
          <input className={field} maxLength={160} value={letter.employer} placeholder="e.g. Birch Office Services" onChange={(event) => update({ employer: event.target.value })} />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-[0.12em] text-muted">Who it is for</legend>
        <label className="block text-sm font-bold text-navy">
          Hiring manager’s name (optional)
          <input className={field} maxLength={120} value={letter.recipientName} placeholder="e.g. Ms Shah" onChange={(event) => update({ recipientName: event.target.value })} />
          <span className="mt-1 block text-xs font-normal leading-5 text-muted">Write it as you would greet them. The advert or the employer’s website often names the contact.</span>
        </label>
        {!letter.recipientName.trim() && (
          <div className="grid min-h-12 grid-cols-2 rounded-md border border-line-strong bg-white p-1" role="group" aria-label="Greeting when you do not know the name">
            {([["hiring-manager", "Dear Hiring Manager"], ["sir-madam", "Dear Sir or Madam"]] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={letter.greeting === value} onClick={() => update({ greeting: value })} className={`rounded px-2 text-sm font-bold ${letter.greeting === value ? "bg-navy text-white" : "text-muted hover:bg-paper"}`}>
                {label}
              </button>
            ))}
          </div>
        )}
        <p className="text-xs leading-5 text-muted">
          Your letter opens with “{coverLetterGreeting(letter).replace(/,$/, "")}” and ends with “{coverLetterSignOff(letter).replace(/,$/, "")}”. UK letters use
          “sincerely” when you name the reader and “faithfully” when you do not.
        </p>
      </fieldset>

      <details className="rounded-md border border-line bg-white px-4">
        <summary className="cursor-pointer py-3 text-sm font-bold text-navy">More details: reference, address, date</summary>
        <div className="space-y-4 pb-4">
          <label className="block text-sm font-bold text-navy">
            Job reference (optional)
            <input className={field} maxLength={80} value={letter.reference} placeholder="e.g. CS-2026-14" onChange={(event) => update({ reference: event.target.value })} />
          </label>
          <label className="block text-sm font-bold text-navy">
            Employer address (optional)
            <textarea className={field} rows={3} maxLength={600} value={letter.employerAddress} placeholder={"Only needed for posted or formal letters"} onChange={(event) => update({ employerAddress: event.target.value.split("\n").slice(0, 6).join("\n") })} />
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-navy">
            <input type="checkbox" className="h-4 w-4 accent-navy" checked={letter.includeDate} onChange={(event) => update({ includeDate: event.target.checked })} />
            Show today’s date on the letter
          </label>
        </div>
      </details>

      <fieldset className="space-y-5">
        <legend className="text-sm font-bold uppercase tracking-[0.12em] text-muted">Your letter</legend>
        {letter.paragraphs.map((paragraph, index) => {
          const guide = coverLetterParagraphGuides[index];
          return (
            <div key={index}>
              <div className="flex items-start justify-between gap-3">
                <label htmlFor={`cover-letter-paragraph-${index}`} className="text-sm font-bold text-navy">
                  {index + 1}. {guide?.label || "Additional paragraph"}
                </label>
                {index >= coverLetterParagraphGuides.length && (
                  <button type="button" aria-label={`Remove paragraph ${index + 1}`} onClick={() => update({ paragraphs: letter.paragraphs.filter((_, i) => i !== index) })} className="rounded p-1 text-muted hover:text-navy">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {guide && <p className="mt-1 text-xs leading-5 text-muted">{guide.purpose}</p>}
              <textarea
                id={`cover-letter-paragraph-${index}`}
                className={field}
                rows={index === 0 || index === 3 ? 3 : 5}
                maxLength={2500}
                value={paragraph}
                placeholder={guide ? `Example: ${guide.example}` : "Only add this if it helps your application."}
                onChange={(event) => updateParagraph(index, event.target.value)}
              />
            </div>
          );
        })}
        {letter.paragraphs.length < COVER_LETTER_MAX_PARAGRAPHS && (
          <button type="button" className={secondaryButton} onClick={() => update({ paragraphs: [...letter.paragraphs, ""] })}>
            <Plus className="h-4 w-4" /> Add a paragraph
          </button>
        )}
      </fieldset>

      <div className="rounded-md border border-line bg-paper p-4" aria-live="polite">
        <p className="text-sm font-bold text-navy">
          {words} words
          <span className="font-normal text-muted"> · aim for {COVER_LETTER_TARGET_WORDS.min}–{COVER_LETTER_TARGET_WORDS.max} to fit one page</span>
        </p>
        {hasContent && checks.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {checks.map((check) => (
              <li key={check.message} className={check.severity === "fix" ? "font-bold text-navy" : "text-muted"}>
                {check.severity === "fix" ? "Fix: " : "Tip: "}{check.message}
              </li>
            ))}
          </ul>
        )}
        {hasContent && checks.length === 0 && <p className="mt-2 text-sm text-success">Looks complete. Read it once more in the preview before sending.</p>}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" className={secondaryButton} disabled={!hasContent} onClick={() => void copy()}>
          <Copy className="h-4 w-4" /> Copy letter text
        </button>
        {downloadUnlocked ? (
          <>
            <button type="button" className={secondaryButton} disabled={!hasContent || downloading !== null} onClick={() => onDownload("pdf")}>
              <Download className="h-4 w-4" /> {downloading === "pdf" ? "Preparing PDF…" : "Download letter PDF"}
            </button>
            <button type="button" className={secondaryButton} disabled={!hasContent || downloading !== null} onClick={() => onDownload("docx")}>
              <FileText className="h-4 w-4" /> {downloading === "docx" ? "Preparing Word…" : "Download letter Word"}
            </button>
          </>
        ) : (
          <p className="text-sm leading-6 text-muted sm:self-center">PDF and Word letter files unlock with your CV download.</p>
        )}
      </div>
      <p className="text-xs leading-5 text-muted">
        Copy is free and gives you plain text for application forms and email bodies. Rewrite the letter for each job.
        Changes save with this CV, and you can download it again after editing at no extra cost.
      </p>
      <p role="status" className="text-sm leading-6 text-navy">{status}</p>
    </section>
  );
}
