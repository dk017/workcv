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
    default: `WorkCV - One UK CV. ${site.priceGbp}. Nothing to cancel.`,
    template: "%s | WorkCV",
  },
  description:
    `Create your UK CV, preview it, then pay ${site.priceGbp} when you download the final PDF. No subscription and no automatic renewal.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: `WorkCV - One UK CV. ${site.priceGbp}. Nothing to cancel.`,
    description:
      `Create your UK CV, preview it, then pay ${site.priceGbp} when you download the final PDF.`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `WorkCV - One UK CV. ${site.priceGbp}. Nothing to cancel.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `WorkCV - One UK CV. ${site.priceGbp}. Nothing to cancel.`,
    description:
      `Create your UK CV, preview it, then pay ${site.priceGbp} when you download the final PDF.`,
    images: ["/opengraph-image"],
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
