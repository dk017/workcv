import { site } from "@/lib/site";

type WorkCvProductSchemaInput = {
  description: string;
  url: string;
};

function absoluteSiteUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : new URL(url, `${site.url}/`).toString();
}

const immediateDigitalDelivery = {
  "@type": "ShippingDeliveryTime",
  handlingTime: {
    "@type": "QuantitativeValue",
    minValue: 0,
    maxValue: 0,
    unitCode: "DAY",
  },
  transitTime: {
    "@type": "QuantitativeValue",
    minValue: 0,
    maxValue: 0,
    unitCode: "DAY",
  },
};

export function buildWorkCvProductSchema({ description, url }: WorkCvProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "WorkCV",
    image: [`${site.url}/opengraph-image`],
    description,
    brand: {
      "@type": "Brand",
      name: "WorkCV",
    },
    offers: [cvOffer(url), passOffer(url)],
  };
}

function offerBase(url: string) {
  return {
    "@type": "Offer",
    priceCurrency: site.priceCurrency,
    itemCondition: "https://schema.org/NewCondition",
    availability: "https://schema.org/InStock",
    url: absoluteSiteUrl(url),
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "GBP" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "GB" },
      deliveryTime: immediateDigitalDelivery,
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "GB",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: `${site.url}/refund-policy`,
    },
  };
}

function passOffer(url: string) {
  return {
    ...offerBase(url),
    name: "Job Search Pass",
    price: site.passPrice.replace("£", ""),
    description: `One-time price for unlimited CVs and matching cover letters for ${site.passDays} days, each downloadable as PDF and editable Word (DOCX). Never renews.`,
  };
}

function cvOffer(url: string) {
  return {
    ...offerBase(url),
    name: "One CV and cover letter",
    price: site.priceAmount.toFixed(2),
    description: "One-time price for a CV and matching cover letter, each downloadable as PDF and editable Word (DOCX). No monthly subscription.",
  };
}
