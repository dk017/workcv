import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WorkCV handles personal data when you build and download a UK CV.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data WorkCV handles, why we use it, and how to contact us about your data."
      sections={[
        {
          title: "Who this applies to",
          body: (
            <>
              <p>
                This policy applies when you use WorkCV at workcv.co.uk, create CV
                content in the editor, contact us, or complete a payment for a PDF
                download.
              </p>
              <p>
                WorkCV is intended for UK job seekers. You should not add special
                category data to your CV unless you actively want it included in
                your final document.
              </p>
            </>
          ),
        },
        {
          title: "Personal data we handle",
          body: (
            <>
              <p>
                The CV editor may contain the information you type into your CV,
                such as your name, email address, phone number, location,
                education, work history, skills, and profile text.
              </p>
              <p>
                For payments, we collect the draft reference and receipt email
                needed to start checkout. Payment card details are handled by Dodo
                Payments and its payment partners, not by WorkCV.
              </p>
            </>
          ),
        },
        {
          title: "Why we use personal data",
          body: (
            <>
              <p>
                We use your data to provide the CV builder, generate your PDF,
                process payment status, respond to support requests, prevent abuse,
                and keep basic operational records.
              </p>
              <p>
                Our usual lawful bases are contract, legitimate interests, legal
                obligation, and consent where a specific consent is requested.
              </p>
            </>
          ),
        },
        {
          title: "Storage and retention",
          body: (
            <>
              <p>
                CV draft content is saved to your WorkCV account after email-code
                login. Payment records are kept for accounting, fraud prevention,
                support, and dispute handling.
              </p>
              <p>
                We keep personal data only for as long as needed for the purpose it
                was collected, including legal, tax, accounting, and dispute
                requirements.
              </p>
            </>
          ),
        },
        {
          title: "Your rights",
          body: (
            <p>
              Under UK data protection law, you may have rights to access, rectify,
              erase, restrict, object to processing, and request data portability.
              You can contact us at contact@workcv.co.uk.
            </p>
          ),
        },
        {
          title: "Complaints",
          body: (
            <p>
              Please contact us first so we can try to resolve the issue. You also
              have the right to complain to the UK Information Commissioner's
              Office if you are unhappy with how your personal data is handled.
            </p>
          ),
        },
      ]}
    />
  );
}
