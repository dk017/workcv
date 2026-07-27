import type { Metadata } from "next";

import {
  resolveEmbedOption,
  resolveEmbedTheme,
  ToolEmbedShell,
} from "@/components/embed/tool-embed-shell";
import { LivingWageChecker2026 } from "@/components/living-wage-checker-2026";

export const metadata: Metadata = {
  title: "UK Living Wage Checker Embed",
  description: "Hosted embed of the WorkCV UK living wage checker.",
  robots: { index: false, follow: false },
};

export default function LivingWageEmbedPage({
  searchParams,
}: {
  searchParams: { theme?: string; cta?: string; footer?: string };
}) {
  return (
    <ToolEmbedShell
      title="UK Living Wage checker"
      description="Compare entered pay with the statutory minimum and voluntary Living Wage benchmarks for 2026."
      toolHref="/tools/uk-living-wage-checker"
      showCta={resolveEmbedOption(searchParams.cta, "off")}
      showFooter={resolveEmbedOption(searchParams.footer, "off")}
      theme={resolveEmbedTheme(searchParams.theme)}
    >
      <LivingWageChecker2026 />
    </ToolEmbedShell>
  );
}
