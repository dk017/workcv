import type { Metadata } from "next";

import { SalaryCalculator } from "@/components/salary-calculator";
import {
  resolveEmbedOption,
  resolveEmbedTheme,
  ToolEmbedShell,
} from "@/components/embed/tool-embed-shell";

export const metadata: Metadata = {
  title: "UK Take-Home Pay Calculator Embed",
  description: "Hosted embed of the WorkCV UK take-home pay calculator.",
  robots: { index: false, follow: false },
};

export default function TakeHomePayEmbedPage({
  searchParams,
}: {
  searchParams: { theme?: string; cta?: string; footer?: string };
}) {
  return (
    <ToolEmbedShell
      title="UK take-home pay calculator"
      description="Estimate pay after Income Tax, National Insurance, student loans and salary-sacrifice pension using 2026/27 rates."
      toolHref="/tools/take-home-pay-calculator-uk"
      showCta={resolveEmbedOption(searchParams.cta, "off")}
      showFooter={resolveEmbedOption(searchParams.footer, "off")}
      theme={resolveEmbedTheme(searchParams.theme)}
    >
      <SalaryCalculator />
    </ToolEmbedShell>
  );
}
