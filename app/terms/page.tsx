import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using WorkCV and buying a one-time CV PDF download.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms explain how the WorkCV editor and one-time PDF download purchase work."
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
                You can build and preview your CV free. The standard PDF download
                costs {site.price}. There is no subscription and no automatic
                renewal for this product.
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
              After payment succeeds, WorkCV unlocks PDF download access for the
              browser draft used at checkout. Keep your receipt email and contact
              us if payment succeeds but the editor does not unlock.
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
