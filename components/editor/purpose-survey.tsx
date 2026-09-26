"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { applicationVolumeOptions, cvPurposeOptions } from "@/lib/editor-events";

const choice = "min-h-10 rounded-md border border-line-strong bg-white px-3 text-sm font-bold text-navy hover:border-navy hover:bg-paper";

// Optional two-tap question shown once per saved CV after a successful download.
export function PurposeSurvey({
  onPurpose,
  onVolume,
  onClose,
}: {
  onPurpose: (purpose: string) => void;
  onVolume: (volume: string) => void;
  onClose: (answered: boolean) => void;
}) {
  const [step, setStep] = useState<"purpose" | "volume" | "done">("purpose");

  return (
    <section className="editor-chrome border-b border-line bg-greensoft" aria-labelledby="purpose-survey-title">
      <div className="mx-auto flex w-[min(1540px,calc(100%-32px))] items-start justify-between gap-4 py-4 sm:w-[min(1540px,calc(100%-48px))]">
        <div className="min-w-0">
          {step === "purpose" && (
            <>
              <p id="purpose-survey-title" className="text-sm font-bold text-navy">Quick optional question: what is this CV for?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cvPurposeOptions.map(([value, label]) => (
                  <button key={value} type="button" className={choice} onClick={() => { onPurpose(value); setStep("volume"); }}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === "volume" && (
            <>
              <p id="purpose-survey-title" className="text-sm font-bold text-navy">And roughly how many jobs will you apply for with it?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {applicationVolumeOptions.map(([value, label]) => (
                  <button key={value} type="button" className={choice} onClick={() => { onVolume(value); setStep("done"); }}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === "done" && (
            <p id="purpose-survey-title" className="text-sm font-bold text-navy" role="status">Thank you. Good luck with your applications.</p>
          )}
          {step !== "done" && (
            <p className="mt-2 text-xs leading-5 text-muted">Your answer helps us improve WorkCV. It is never added to your CV or shared.</p>
          )}
        </div>
        <button type="button" onClick={() => onClose(step !== "purpose")} aria-label="Close question" className="rounded p-1 text-muted hover:bg-white hover:text-navy">
          <X className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
