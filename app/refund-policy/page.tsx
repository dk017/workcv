import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "WorkCV refund policy for one-time UK CV PDF download purchases.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="This policy explains when we can refund a one-time WorkCV PDF download purchase."
      sections={[
        {
          title: "Summary",
          body: (
            <p>
              WorkCV sells immediate digital access to a CV PDF download for{" "}
              {site.price}. There is no subscription to cancel.
            </p>
          ),
        },
        {
          title: "Before download access starts",
          body: (
            <p>
              If you pay but PDF access does not unlock, contact us at
              contact@workcv.co.uk with your receipt email. We will either help
              unlock access or refund the payment.
            </p>
          ),
        },
        {
          title: "After immediate digital access starts",
          body: (
            <p>
              At checkout, you are asked to confirm that you want immediate access
              to the digital PDF download and understand that cancellation rights
              may be affected once access starts. This does not affect your
              statutory rights if the digital content is faulty, not as described,
              or not supplied.
            </p>
          ),
        },
        {
          title: "Duplicate or mistaken payments",
          body: (
            <p>
              If you are charged twice for the same draft or believe a payment was
              taken by mistake, email contact@workcv.co.uk. Include the receipt
              email, approximate payment time, and any Dodo payment reference.
            </p>
          ),
        },
        {
          title: "Response time",
          body: (
            <p>
              We aim to review refund and payment support requests within two
              working days.
            </p>
          ),
        },
      ]}
    />
  );
}
