import { site } from "../site.ts";
import type { AlternativeOption, Faq } from "./types.ts";
import { comparisonCheckedIso, comparisonPublishedIso } from "./workcv.ts";

const publisher = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
};

export function articleSchema({
  path,
  headline,
  description,
  about,
}: {
  path: string;
  headline: string;
  description: string;
  about: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${site.url}${path}`,
    mainEntityOfPage: `${site.url}${path}`,
    datePublished: comparisonPublishedIso,
    dateModified: comparisonCheckedIso,
    inLanguage: "en-GB",
    author: publisher,
    publisher,
    about: about.map((name) => ({ "@type": "Thing", name })),
    image: `${site.url}/opengraph-image`,
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function itemListSchema(name: string, options: AlternativeOption[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: options.length,
    itemListElement: options.map((option, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: option.name,
      url: option.external ? option.href : `${site.url}${option.href}`,
      description: `${option.bestFor}. ${option.price}.`,
    })),
  };
}
