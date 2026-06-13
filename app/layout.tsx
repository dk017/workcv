import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { Header } from "@/components/header";
import { Footer } from "@/components/marketing";
import { site } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "WorkCV - UK CV builder without a subscription",
    template: "%s | WorkCV",
  },
  description:
    "Build a UK CV free, then pay GBP 4.99 when you download the final PDF. No subscription and no automatic renewal.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "WorkCV - UK CV builder without a subscription",
    description:
      "Build a UK CV free, then pay GBP 4.99 when you download the final PDF.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
