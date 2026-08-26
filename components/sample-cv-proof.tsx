import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText, ShieldCheck } from "lucide-react";

import { site } from "@/lib/site";

const samplePdfHref = "/samples/workcv-customer-service-cv-example.pdf";
const sampleImageSrc = "/product-proof/workcv-customer-service-sample.png";

export function SampleCvProof({ variant = "full" }: { variant?: "full" | "compact" }) {
  const compact = variant === "compact";

  return (
    <section
      className={`${compact ? "bg-paper py-20" : "bg-surface py-24"}`}
      aria-labelledby="sample-cv-proof-heading"
    >
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-xl border border-line bg-white p-3 shadow-soft">
          <Image
            src={sampleImageSrc}
            alt="Fictional WorkCV customer service CV sample showing a clean UK CV layout"
            width={1280}
            height={900}
            unoptimized
            className="h-auto w-full rounded-lg border border-line"
          />
          <p className="px-2 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Fictional sample · customer service CV · Compact UK template
          </p>
        </div>

        <div>
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-navy">
            <FileText className="h-5 w-5 text-gold" />
            Product proof
          </div>
          <h2
            id="sample-cv-proof-heading"
            className="mt-4 font-display text-4xl font-semibold leading-tight text-navy md:text-5xl"
          >
            See the document before you pay.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            Build and preview your CV first. When this saved CV is ready, pay
            {" "}{site.price} once to unlock the PDF download. There is no monthly
            subscription or automatic renewal in the standard flow.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="flex gap-3 rounded-lg border border-line bg-white p-4 text-sm font-bold text-navy">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              Preview the pages before checkout
            </div>
            <div className="flex gap-3 rounded-lg border border-line bg-white p-4 text-sm font-bold text-navy">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              Pay once per saved CV PDF
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={samplePdfHref}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-5 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:border-navy"
            >
              Download fictional sample PDF
              <Download className="h-4 w-4" />
            </Link>
            <Link
              href="/editor"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
            >
              Build my CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">
            The sample uses fictional details for layout practice. Replace every
            detail before applying.
          </p>
        </div>
      </div>
    </section>
  );
}
