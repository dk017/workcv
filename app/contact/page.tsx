import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { ButtonLink } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact WorkCV for support, billing, payment, and CV download help.",
};

export default function ContactPage() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Contact WorkCV
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-navy md:text-6xl">
            Need help with your CV download?
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            For payment, download, refund, or saved-editor support, email
            us and include the receipt email you used at checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-xl border border-line bg-white p-6">
            <Mail className="h-8 w-8 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              contact@workcv.co.uk
            </h2>
            <p className="mt-4 leading-7 text-muted">
              We aim to reply within two working days. For payment issues, include
              your receipt email, payment time, and what happened after checkout.
            </p>
            <div className="mt-6">
              <a
                href="mailto:contact@workcv.co.uk"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-bold text-white"
              >
                Email support
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Useful pages
            </h2>
            <div className="mt-5 grid gap-3 text-sm font-bold text-navy">
              <Link href="/refund-policy">Refund policy</Link>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms of use</Link>
              <Link href="/pricing">Pricing</Link>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ButtonLink href="/editor">Return to editor</ButtonLink>
        </div>
      </div>
    </section>
  );
}
