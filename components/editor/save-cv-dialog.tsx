"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { readFirstTouchAttribution, trackFunnelEvent } from "@/components/attribution-capture";
import type { AccountReason } from "@/components/editor/use-cv-editor";

const copy: Record<AccountReason, { title: string; intro: string; finish: string }> = {
  download: {
    title: "Save your CV to download it",
    intro: "Your CV is saved on this device. Add your email to keep it safe, open it anywhere, and download it.",
    finish: "Save and continue to download",
  },
  import: {
    title: "Add your email to upload your CV",
    intro: "Reading an uploaded CV happens in your account. Add your email, then choose your file. Anything you've typed here is kept.",
    finish: "Save and upload my CV",
  },
  save: {
    title: "Save your CV to your account",
    intro: "Your CV is saved on this device. Add your email to keep it safe and open it on any device.",
    finish: "Save my CV",
  },
};

const input = "min-h-12 w-full rounded-lg border border-line-strong bg-white px-3.5 text-[1rem] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold-tint";

/** Email and one-time code, inside the editor, so a guest's CV is saved without leaving the page. */
export function SaveCvDialog({ reason, defaultEmail, onClose, onSignedIn }: {
  reason: AccountReason;
  defaultEmail: string;
  onClose: () => void;
  /** Called once the code is accepted; resolves with an error message if saving the CV failed. */
  onSignedIn: () => Promise<string | null>;
}) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const text = copy[reason];

  useEffect(() => {
    fieldRef.current?.focus();
  }, [step]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setDevCode(null);
    trackFunnelEvent("login_started", { destination: "/editor", placement: `guest_save_${reason}` });
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nextPath: "/editor", attribution: readFirstTouchAttribution() }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; devCode?: string } | null;
      if (!response.ok) {
        setError(data?.error || "We couldn't send the code. Check the email address and try again.");
        return;
      }
      if (data?.devCode) setDevCode(data.devCode);
      setCode("");
      setStep("code");
    } catch {
      setError("We couldn't send the code. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, nextPath: "/editor" }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error || "That code didn't work. Check it, or ask for a new one.");
        return;
      }
      const saveError = await onSignedIn();
      if (saveError) setError(saveError);
    } catch {
      setError("We couldn't check the code. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="editor-chrome fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-labelledby="save-cv-title">
      <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-soft sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Step {step === "email" ? 1 : 2} of 2</p>
        {step === "email" ? (
          <form onSubmit={requestCode}>
            <h2 id="save-cv-title" className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy">{text.title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{text.intro}</p>
            <label className="mt-5 block text-sm font-bold text-navy">
              Email address
              <input ref={fieldRef} type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={`mt-1.5 ${input}`} />
            </label>
            {error && <p role="alert" className="mt-3 text-sm font-bold text-[#8d3030]">{error}</p>}
            <button type="submit" disabled={busy} className="mt-4 min-h-12 w-full rounded-lg bg-navy font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60">
              {busy ? "Sending…" : "Email me a code"}
            </button>
            <p className="mt-3 text-sm text-muted">No password. We email you a 6-digit code to sign in.</p>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <h2 id="save-cv-title" className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy">Enter the code we sent</h2>
            <p className="mt-2 leading-relaxed text-muted">Sent to <strong className="text-ink">{email}</strong>. It expires in 15 minutes.</p>
            {devCode && <p className="mt-2 rounded-lg bg-gold-tint px-3 py-2 text-sm font-bold text-navy">Dev code: {devCode}</p>}
            <label className="mt-5 block text-sm font-bold text-navy">
              6-digit code
              <input ref={fieldRef} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="123456" className={`mt-1.5 tracking-[0.3em] ${input}`} />
            </label>
            {error && <p role="alert" className="mt-3 text-sm font-bold text-[#8d3030]">{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6} className="mt-4 min-h-12 w-full rounded-lg bg-navy font-bold text-white hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? "Saving…" : text.finish}
            </button>
            <p className="mt-3 text-sm text-muted">Already have an account? This CV is added to it, next to your other CVs.</p>
            <button type="button" onClick={() => { setStep("email"); setError(null); }} className="mt-3 w-full text-center text-sm font-bold text-navy underline-offset-4 hover:underline">Use a different email</button>
          </form>
        )}
        <button type="button" onClick={onClose} className="mt-2 w-full text-center text-sm font-bold text-navy underline-offset-4 hover:underline">Keep editing for now</button>
      </div>
    </div>
  );
}
