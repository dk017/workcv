import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";

import { Header } from "@/components/header";
import { Footer } from "@/components/marketing";
import { AttributionCapture } from "@/components/attribution-capture";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
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

const brandSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/opengraph-image`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: {
        "@id": `${site.url}/#organization`,
      },
      inLanguage: site.locale,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${dmSans.variable} ${fraunces.variable}`}>
      <head>
        <Script
          defer
          data-site="hq2xtnu4"
          data-domain="workcv.co.uk"
          src="https://piqo.app/piqo.js"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
        />
        <BreadcrumbSchema />
      </head>
      <body className="font-sans antialiased">
        <AttributionCapture />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
