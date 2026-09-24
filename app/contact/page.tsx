import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { ButtonLink } from "@/components/marketing";
import { CustomerAnswer } from "@/components/customer-answer";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact WorkCV for support, billing, payment, and CV download help.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact WorkCV",
    description: "Contact WorkCV for support, billing, payment, and CV download help.",
    url: "/contact",
  },
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

        <div className="mt-10 max-w-3xl rounded-xl border border-line bg-white p-6 md:p-8">
          <CustomerAnswer questionId="Q24">
            <ol className="list-decimal space-y-3 pl-6"><li>Sign in with the email account used for the original CV and open <TrackedLink href="/my-cvs" placement={analyticsPlacements.customerQ24MyCvs} className="font-semibold underline">My CVs</TrackedLink>.</li><li>Reopen the original saved CV, rather than starting a new document.</li><li>If the editor says <strong>Confirming payment…</strong>, select <strong>Check again</strong> and allow status to update.</li><li>Try the PDF download again and inspect your browser’s downloads list.</li><li>If it still fails, email support with your receipt email, payment time and timezone, order reference if available, browser/device and the visible error. A redacted screenshot can help.</li></ol>
            <p>Do not send your card number, password, email login code or full CV. We aim to reply within two working days. The <Link className="font-semibold underline" href="/refund-policy">refund policy</Link> is also available.</p>
          </CustomerAnswer>
          <p className="mt-5 text-sm text-muted">Reviewed <time dateTime={customerContentReview["/contact"]}>{displayReviewDate(customerContentReview["/contact"])}</time>.</p>
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
          <ButtonLink href="/my-cvs">Open my saved CVs</ButtonLink>
        </div>
      </div>
    </section>
  );
}
