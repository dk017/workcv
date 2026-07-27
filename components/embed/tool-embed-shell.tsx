import Link from "next/link";
import type { ReactNode } from "react";

import { EmbedResizer } from "@/components/embed/embed-resizer";

type EmbedTheme = "light" | "paper";

export function resolveEmbedOption(
  value: string | string[] | undefined,
  fallback: "on" | "off",
) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return fallback === "on";
  return ["on", "1", "true", "yes"].includes(raw.toLowerCase());
}

export function resolveEmbedTheme(
  value: string | string[] | undefined,
): EmbedTheme {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "paper" ? "paper" : "light";
}

export function ToolEmbedShell({
  title,
  description,
  toolHref,
  showCta,
  showFooter,
  theme,
  children,
}: {
  title: string;
  description: string;
  toolHref: string;
  showCta: boolean;
  showFooter: boolean;
  theme: EmbedTheme;
  children: ReactNode;
}) {
  return (
    <div
      className={`workcv-embed-root px-3 py-4 text-ink sm:px-5 ${
        theme === "paper" ? "bg-paper" : "bg-white"
      }`}
    >
      <EmbedResizer />
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 rounded-lg border border-line-strong bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Free UK tool
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {description}
              </p>
            </div>
            {showCta ? (
              <a
                href={`${toolHref}?utm_source=wordpress&utm_medium=referral&utm_campaign=uk_career_tools`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
              >
                Open full tool
              </a>
            ) : null}
          </div>
        </header>

        <section className="rounded-lg border border-line-strong bg-white p-4 shadow-sm sm:p-6">
          {children}
        </section>

        {showFooter ? (
          <footer className="mt-4 flex flex-col gap-2 px-1 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Powered by{" "}
              <Link
                href="/?utm_source=wordpress&utm_medium=referral&utm_campaign=uk_career_tools"
                target="_blank"
                className="font-bold text-navy underline"
              >
                WorkCV
              </Link>
            </p>
            <Link
              href="/wordpress/uk-career-tools-plugin"
              target="_blank"
              className="font-bold text-navy underline"
            >
              Plugin help
            </Link>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
