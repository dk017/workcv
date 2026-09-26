import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using WorkCV and buying one-time CV and cover letter downloads.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | WorkCV",
    description: "Terms for using WorkCV and buying one-time CV and cover letter downloads.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms explain how the WorkCV editor and the one-time CV and cover letter download purchase work."
      sections={[
        {
          title: "Using WorkCV",
          body: (
            <p>
              WorkCV helps you draft and format a CV for UK job applications. You
              are responsible for checking that your CV is accurate, truthful, and
              appropriate for the roles you apply for.
            </p>
          ),
        },
        {
          title: "Pricing and payment",
          body: (
            <>
              <p>
                You can build and preview your CV and cover letter free. Downloading
                them costs {site.price} once per saved CV. There is no subscription
                and no automatic renewal for this product.
              </p>
              <p>
                Checkout is provided by Dodo Payments. Your payment may be subject
                to Dodo Payments' own checkout and payment processing terms.
              </p>
            </>
          ),
        },
        {
          title: "Digital download access",
          body: (
            <p>
              After payment succeeds, WorkCV unlocks downloads for the saved CV
              document used at checkout: the CV as a PDF and an editable Word
              (.docx) file, and the one cover letter saved with that CV as a PDF
              and Word file. You can edit that CV and its letter and download them
              again without paying again. A separate saved CV needs its own
              payment. Keep your receipt email and contact us if payment succeeds
              but the editor does not unlock.
            </p>
          ),
        },
        {
          title: "No job guarantee",
          body: (
            <p>
              WorkCV provides CV formatting and writing tools. We do not guarantee
              interviews, job offers, recruiter responses, or application outcomes.
            </p>
          ),
        },
        {
          title: "Acceptable use",
          body: (
            <p>
              Do not misuse the service, attempt to bypass payment, attack the
              site, upload unlawful content, or use WorkCV in a way that infringes
              another person's rights.
            </p>
          ),
        },
        {
          title: "Contact",
          body: <p>For support, billing questions, or legal notices, email contact@workcv.co.uk.</p>,
        },
      ]}
    />
  );
}
