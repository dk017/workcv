import { SampleCvProof } from "@/components/sample-cv-proof";
import type { Metadata } from "next";
import Link from "next/link";
import { CustomerAnswer, CustomerQuestionNav } from "@/components/customer-answer";
import { TrackedLink } from "@/components/tracked-link";
import { customerQuestionHref } from "@/lib/customer-questions";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";
import { ButtonLink, FaqSection } from "@/components/marketing";
import { PassOfferView } from "@/components/pass-offer-view";
import { passStartHref } from "@/components/pass-offer";
import { buildLoginHref } from "@/lib/safe-redirect";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { commercialRoutes, site } from "@/lib/site";
import { analyticsPlacements } from "@/lib/analytics-placements";

const title = `WorkCV Pricing: ${site.priceGbp} CV or ${site.passPrice} Job Search Pass`;
const description = `Compare one saved CV and letter for ${site.priceGbp} with the ${site.passPrice}, ${site.passDays}-day Job Search Pass. PDF and Word included. No automatic renewal.`;
export const metadata: Metadata = { title, description, alternates: { canonical: "/pricing" }, openGraph: { title, description, url: "/pricing" } };
const faqs = [
  { question: "How much does WorkCV cost?", answer: `One saved CV and matching letter costs ${site.priceGbp} once. The ${site.passPrice} Job Search Pass covers existing CVs and unlimited new CVs created during its ${site.passDays}-day window. Both include PDF and Word. Build and preview free first.` },
  { question: "Does either plan renew automatically?", answer: "No. Both are one-time payments, with no automatic renewal and nothing to cancel." },
  { question: "Can I edit one paid CV for another application?", answer: "Yes. You can edit and redownload the same saved CV and its letter without paying again. The Pass helps when you want to keep separate saved versions." },
  { question: "What happens when the Pass expires?", answer: "CVs covered by your Pass remain editable and downloadable afterwards. A new CV created after the window ends needs a new purchase. See the terms for refund and access rules." },
];
export default function PricingPage() {
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWorkCvProductSchema({description, url: `${site.url}/pricing`})) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.question,acceptedAnswer:{"@type":"Answer",text:f.answer}}))}) }} />
  <section className="quiet-grid bg-paper py-12 md:py-20"><div className="container-page">
   <p className="text-sm font-bold uppercase tracking-wide text-navy">CV builder pricing UK</p>
   <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight text-navy md:text-6xl">Choose one saved CV or a pass for your job search.</h1>
   <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">Build and preview free. Both options include your CV and matching cover letter as PDF and editable Word. One payment, no automatic renewal.</p>
   <nav aria-label="Compare plans" className="mt-5 flex flex-wrap gap-4 font-bold underline"><a href="#single-cv">{site.price} one saved CV</a><a href="#job-search-pass">{site.passPrice} Job Search Pass</a></nav>
   <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
    <article id="single-cv" className="scroll-mt-24 rounded-xl border-2 border-navy bg-white p-6 md:p-8">
     <h2 className="font-display text-3xl font-semibold text-navy">One saved CV</h2>
     <p className="mt-4 font-display text-5xl font-semibold text-navy">{site.priceGbp} <span className="font-sans text-base">once</span></p>
     <p className="mt-4 leading-7">For keeping and editing the same CV and matching letter.</p>
     <ul className="my-5 list-disc space-y-2 pl-5 leading-7"><li>PDF and Word for this saved pair</li><li>Edit and redownload it without paying again</li><li>You can revise this same CV for another application</li></ul>
     <ButtonLink href={buildLoginHref("/editor?plan=cv")} trackingLabel={analyticsPlacements.pricingCardEditor}>Start with one CV</ButtonLink>
     <p className="mt-4 text-sm leading-6 text-muted">A separate saved CV needs its own payment, unless covered by a Pass.</p>
    </article>
    <article id="job-search-pass" className="scroll-mt-24 rounded-xl border-2 border-gold bg-white p-6 md:p-8">
     <PassOfferView placement={analyticsPlacements.pricingPassEditor}><h2 className="font-display text-3xl font-semibold text-navy">Job Search Pass</h2><p className="mt-4 font-display text-5xl font-semibold text-navy">{site.passPrice} <span className="font-sans text-base">once</span></p><p className="mt-4 leading-7">Keep a separate version for each vacancy.</p></PassOfferView>
     <ul className="my-5 list-disc space-y-2 pl-5 leading-7"><li>Unlimited new CVs and matching letters for {site.passDays} days</li><li>Existing CVs are covered too</li><li>PDF and Word for covered documents</li><li>Covered CVs stay editable and downloadable after expiry</li></ul>
     <ButtonLink href={passStartHref} trackingLabel={analyticsPlacements.pricingPassEditor}>Start with the Job Search Pass</ButtonLink>
     <p className="mt-4 text-sm leading-6 text-muted">Your choice carries through sign-in. Preview first; pay at download. New CVs created after expiry need a new purchase. The Pass never renews.</p>
    </article>
   </div>
   <p className="mt-6 max-w-4xl text-sm leading-7 text-muted">Four separately purchased saved CVs cost £31.96; the Pass costs £6.97 less. Four job applications do not require four purchases: you can edit the same paid CV for another application. Choose the Pass when keeping separate saved versions helps you.</p>
  </div></section>
  <section className="border-y border-line bg-surface py-12"><div className="container-page max-w-5xl"><h2 className="font-display text-3xl font-semibold text-navy">How separate versions help</h2><ol className="mt-5 grid gap-4 sm:grid-cols-2">{[
    ["Start with your real experience", "Build a CV, then choose Duplicate for another job in the editor."],
    ["Choose the evidence that fits", "Adjust the profile and bullets yourself. Duplication copies your draft; it does not rewrite it for the job."],
    ["Match the letter", "Check the employer, role and examples before downloading both documents."],
    ["Keep track", "Record which version you sent and when you plan to follow up."]
   ].map(([heading,body],i)=><li key={heading} className="rounded-lg border border-line bg-white p-5"><strong>{i+1}. {heading}</strong><p className="mt-2 leading-7">{body}</p></li>)}</ol><div className="mt-6 flex flex-wrap gap-5 font-bold underline"><Link href="/tailor-cv-to-job-description-uk">See one applicant tailor a CV and letter for two vacancies</Link><Link href="/tools/job-application-tracker-uk">Use the free application tracker</Link></div></div></section>
      <CustomerQuestionNav ids={["Q02", "Q05", "Q06"]} />
      <section className="bg-surface py-16"><div className="container-page max-w-5xl space-y-14">
        <CustomerAnswer questionId="Q02">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-6"><h3 className="font-display text-2xl font-semibold text-navy">Free editable Word template</h3><dl className="mt-4 space-y-2 text-sm"><div><dt className="font-bold">Cost and account</dt><dd>£0; no WorkCV account</dd></div><div><dt className="font-bold">File and formatting</dt><dd>Editable DOCX; you enter and format your own details in a compatible editor</dd></div><div><dt className="font-bold">Later downloads</dt><dd>The blank file remains free; exporting your finished CV depends on your editor</dd></div></dl><TrackedLink download href="/api/tools/blank-cv-template" placement={analyticsPlacements.customerQ02FreeDownload} className="mt-5 inline-block font-bold text-navy underline">Download the free DOCX</TrackedLink></div>
            <div className="rounded-lg border border-line bg-white p-6"><h3 className="font-display text-2xl font-semibold text-navy">Guided WorkCV builder</h3><dl className="mt-4 space-y-2 text-sm"><div><dt className="font-bold">Cost and account</dt><dd>Email-code account; build and preview free; {site.price} for one saved CV and its cover letter, as PDF and Word</dd></div><div><dt className="font-bold">File and formatting</dt><dd>Guided layout and preview; paid PDF plus an editable single-column Word (DOCX) file</dd></div><div><dt className="font-bold">Later downloads</dt><dd>Edit and download that same paid CV and its letter again without another payment</dd></div></dl><TrackedLink href={commercialRoutes.moneyPage} placement={analyticsPlacements.customerQ02Money} className="mt-5 inline-block font-bold text-navy underline">See how the builder works</TrackedLink></div>
          </div>
        </CustomerAnswer>
        <CustomerAnswer questionId="Q05">
          <ol className="list-decimal space-y-2 pl-6"><li>Sign in to the account used for the original payment and open <Link className="font-semibold underline" href="/my-cvs">My CVs</Link>.</li><li>Reopen the paid saved document and make your changes.</li><li>Download its PDF or Word file again. If payment is still being confirmed or you see another payment request, <Link className="font-semibold underline" href={customerQuestionHref("Q24")}>follow the support checks</Link> before paying again.</li></ol>
        </CustomerAnswer>
        <CustomerAnswer questionId="Q06">
          <ul className="list-disc space-y-2 pl-6"><li>Revise paid document A: covered.</li><li>Download document A again: covered.</li><li>Create separate saved document B: a separate payment is required unless covered by your Job Search Pass.</li></ul>
          <p>Read the <Link className="font-semibold underline" href="/terms">terms</Link> for the purchase scope. Use <Link className="font-semibold underline" href="/my-cvs">My CVs</Link> to reopen the document you already paid for.</p>
        </CustomerAnswer>
        <p className="text-sm text-muted">Reviewed <time dateTime={customerContentReview["/pricing"]}>{displayReviewDate(customerContentReview["/pricing"])}</time>.</p>
      </div></section>

  <section id="compare" className="bg-paper py-12"><div className="container-page max-w-5xl"><h2 className="font-display text-3xl font-semibold text-navy">Compare the payment terms, not just the trial price</h2><p className="mt-5 leading-8 text-muted">Check the download formats, renewal interval and total for the time you need. Some builders have subscriptions; others offer one-time purchases. WorkCV's two options above never renew.</p><p className="mt-4 leading-7 text-muted">One named example: MyPerfectCV's official pricing page showed £2.95 for 14 days, then £16.95 every four weeks, when checked on 2 October 2026. Its annual option was £59.40 upfront with yearly renewal. Verify the current terms before paying. <a href="https://www.myperfectcv.co.uk/pricing" className="font-bold underline">MyPerfectCV pricing source</a>.</p></div></section>
  <section className="bg-white py-10"><div className="container-page max-w-5xl"><h2 className="font-display text-3xl font-semibold text-navy">Choose a starting point</h2><div className="mt-5 flex flex-wrap gap-5 font-bold underline"><Link href="/tools/blank-cv-template-uk">Free blank Word CV template</Link><Link href="/tools/cv-template-word-uk">How to edit a CV in Word</Link><Link href="/cv-personal-statement-uk">CV personal statement examples</Link></div></div></section>
  <SampleCvProof trackingContext={analyticsPlacements.pricingSample} />
  <FaqSection faqs={faqs} title="Questions about the two plans" />
 </>;
}
