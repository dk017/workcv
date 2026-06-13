"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";

export default function LoginForm({ initialNext }: { initialNext: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setDevCode(null);

    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; devCode?: string }
        | null;

      if (!response.ok) {
        setError(data?.error || "Could not send the login code.");
        return;
      }

      if (data?.devCode) setDevCode(data.devCode);
      setStep("code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error || "Invalid or expired code.");
        return;
      }

      router.replace(initialNext);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Save your CV
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight text-navy md:text-6xl">
            Log in before the editor.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            WorkCV uses a one-time email code so your CV can be saved, reopened,
            and linked to your PDF payment. No password to remember.
          </p>
          <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
            {["Save your CV details", "Return and keep editing", "Secure email-code login", "No monthly subscription"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-success" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
          <Link href="/" className="font-display text-2xl font-semibold text-navy">
            WorkCV
          </Link>
          <div className="mt-5 flex items-start gap-3 rounded-md border border-line bg-surface p-4">
            <Mail className="mt-0.5 h-5 w-5 text-gold" />
            <p className="text-sm leading-6 text-muted">
              Enter your email and we will send a 6-digit login code. The code
              expires after 15 minutes.
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={requestCode} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-navy">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="min-h-12 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:opacity-60"
              >
                {loading ? "Sending code..." : "Send login code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-muted">
                Code sent to <strong className="text-navy">{email}</strong>.
              </p>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-navy">
                  6-digit code
                </span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  required
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  className="min-h-12 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-gold-tint"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:opacity-60"
              >
                {loading ? "Checking code..." : "Verify and open editor"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:bg-paper"
              >
                Use a different email
              </button>
              {devCode && (
                <p className="rounded-md border border-gold bg-gold-tint px-3 py-2 text-sm font-bold text-navy">
                  Dev code: {devCode}
                </p>
              )}
            </form>
          )}

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-redsoft px-4 py-3 text-sm font-bold leading-6 text-navy">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
