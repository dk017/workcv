import type { Metadata } from "next";
import { Arimo, Caladea, Carlito, DM_Sans, EB_Garamond, Fraunces, Gelasio } from "next/font/google";

import { Header } from "@/components/header";
import { Footer } from "@/components/marketing";
import { AttributionCapture } from "@/components/attribution-capture";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { SiteFrame } from "@/components/site-frame";
import { site, founder } from "@/lib/site";
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

// CV fonts chosen on the Finish step. Each has the same measurements as the Word font it
// stands in for (Calibri, Cambria, Arial, Georgia; Garamond is a close match). Not preloaded:
// a font downloads only when a CV uses it.
const carlito = Carlito({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-carlito" });
const caladea = Caladea({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-caladea" });
const arimo = Arimo({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-arimo" });
const gelasio = Gelasio({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-gelasio" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-eb-garamond" });
const cvFontVariables = [carlito, caladea, arimo, gelasio, ebGaramond].map((font) => font.variable).join(" ");

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
      description: site.description,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/opengraph-image`,
      },
      founder: { "@type": "Person", name: founder.name },
      email: site.email,
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
    <html lang="en-GB" className={`${dmSans.variable} ${fraunces.variable} ${cvFontVariables}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
        />
        <BreadcrumbSchema />
      </head>
      <body className="font-sans antialiased">
        <AttributionCapture />
        <SiteFrame header={<Header />} footer={<Footer />}>{children}</SiteFrame>
      </body>
    </html>
  );
}
