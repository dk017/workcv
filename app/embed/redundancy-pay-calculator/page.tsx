import type { Metadata } from "next";

import {
  resolveEmbedOption,
  resolveEmbedTheme,
  ToolEmbedShell,
} from "@/components/embed/tool-embed-shell";
import { RedundancyPayCalculator } from "@/components/redundancy-pay-calculator";

export const metadata: Metadata = {
  title: "UK Redundancy Pay Calculator Embed",
  description: "Hosted embed of the WorkCV UK redundancy pay calculator.",
  robots: { index: false, follow: false },
};

export default function RedundancyPayEmbedPage({
  searchParams,
}: {
  searchParams: { theme?: string; cta?: string; footer?: string };
}) {
  return (
    <ToolEmbedShell
      title="UK redundancy pay calculator"
      description="Estimate statutory redundancy pay using current regional weekly caps, age bands and the 20-year service limit."
      toolHref="/tools/redundancy-pay-calculator"
      showCta={resolveEmbedOption(searchParams.cta, "off")}
      showFooter={resolveEmbedOption(searchParams.footer, "off")}
      theme={resolveEmbedTheme(searchParams.theme)}
    >
      <RedundancyPayCalculator />
    </ToolEmbedShell>
  );
}
