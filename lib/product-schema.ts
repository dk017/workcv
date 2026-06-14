import { site } from "@/lib/site";

type WorkCvProductSchemaInput = {
  description: string;
  url: string;
};

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
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "GBP",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url,
      description: "One-time CV PDF download price. No monthly subscription.",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "GBP",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GB",
        },
        deliveryTime: immediateDigitalDelivery,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "GB",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnLink: `${site.url}/refund-policy`,
      },
    },
  };
}
