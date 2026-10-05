import Link from "next/link";
import { competitorPlans, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";
import { ButtonLink, FaqSection, RelatedLinksSection } from "@/components/marketing";
import { ComparisonTable, OfficialSourcesSection } from "@/components/comparison-table";
import { SearchPlanChoice } from "@/components/search-plan-choice";
import { SearchCostComparison } from "@/components/search-cost-comparison";

export function SearchAlternativePage({ brandKey }: { brandKey: "liveCareer" | "myPerfectCv" }) {
 const p = competitorPlans[brandKey], live = brandKey === "liveCareer";
 const placement = live ? "livecareer" : "myperfectcv";
 const title = live ? "LiveCareer alternative for a UK job search without renewal" : "MyPerfectCV alternative with one-time CV plans";
 const intro = live ? `LiveCareer offers guided CV and cover-letter tools through trial or annual access. WorkCV offers one saved CV and letter for ${site.price}, or separate application versions with the ${site.passPrice} Job Search Pass. Both WorkCV plans are one-time payments.` : `MyPerfectCV lets you build free, with PDF and Word downloads in its paid plans. WorkCV offers a one-time choice: ${site.price} for one saved CV and letter, or ${site.passPrice} for a 90-day Job Search Pass without renewal.`;
 const faqs = [
 {question: `Is ${p.brand} free?`, answer: `${p.freePlan} Its trial costs ${formatMinor(p.trial.entryMinor,"GBP")} for 14 days, then ${formatMinor(p.trial.renewalMinor,"GBP")} every four weeks unless cancelled. Check current provider terms before paying.`},
 {question:`Can I edit my ${site.price} WorkCV CV again?`,answer:`Yes. The ${site.price} purchase unlocks one saved CV and its matching letter as PDF and editable Word. You can edit and download that same saved pair again. A separate saved CV needs a separate purchase unless covered by Pass.`},
 {question:"When does Job Search Pass make sense?",answer:`Pass is useful when you want to retain several separate CVs and letters rather than overwrite one saved pair. It costs ${site.passPrice} once for ${site.passDays} days. Four single purchases cost £${(4*site.priceAmount).toFixed(2)}; three cost £${(3*site.priceAmount).toFixed(2)}. Four applications do not automatically require four purchases.`},
 {question:"What remains after 90 days?",answer:"Covered CVs and letters remain editable and downloadable. New CVs created after expiry need a new purchase or eligible Pass. Pass does not renew automatically."},
 {question:`Does WorkCV cancel my ${p.brand} subscription?`,answer:`No. Export your documents and manage any cancellation directly with ${p.brand}. Buying WorkCV does not change another provider's billing.`},
 {question:"Can I transfer an existing CV?",answer:"You can bring supported CV content into the WorkCV editor and review it. Check the imported dates, titles and formatting. This is not automatic account migration, and your old provider's templates are not transferred."},
 {question:"Why pay for WorkCV exports?",answer:"Public tool text and previews are free within their limits. A purchase unlocks personalised PDF and Word files under the selected plan. Email-code login is required to save, and AI generation has separate fair-use limits."},
 {question:"What if I need expert review or more templates?",answer:`WorkCV has three UK layouts and no human expert review service. ${p.brand} may suit you if you prefer its templates, already have work saved there or need its other included services. Check the selected plan's current features.`},
 {question:"Who publishes this comparison?",answer:"WorkCV publishes this comparison and sells the WorkCV plans described here. It is not the other provider's official advice. Prices and billing details are linked to provider sources."}];
 const rows = [
 ["Initial paid access",`${formatMinor(p.trial.entryMinor,"GBP")} for 14 days`,`${site.price} one saved pair; ${site.passPrice} Pass for ${site.passDays} days`],
 ["Renewal",`${formatMinor(p.trial.renewalMinor,"GBP")} every 28 days after the trial unless cancelled`,"No automatic renewal on either plan"],
 ["Annual alternative",live ? "Annual access offered; verify the billing total with LiveCareer because its card and FAQ conflict." : `${formatMinor(p.annual.totalMinor,"GBP")} upfront, renews yearly`,"No annual subscription"],
 ["Free experience","Build free; free download is TXT","Public text tools and editor preview; account to save"],
 ["Paid downloads","PDF and Word in premium access","CV and matching letter as PDF and editable Word"],
 ["Separate versions","Unlimited CVs and letters within the selected paid access","Pass covers existing CVs and new CVs created before expiry"],
 ["Templates and review","Broader template catalogue; check plan-specific services","Three UK layouts; no human expert review"],
 ["After access ends","Check the provider's current account terms","Covered documents remain editable and downloadable"],
 ["Cancellation","Manage renewal directly with the provider","Nothing renews; see WorkCV terms for purchase/refund details"]];
 return <>
  <section className="quiet-grid bg-paper py-12 md:py-16"><div className="container-page space-y-7">
   <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl">{title}</h1><p className="max-w-3xl text-lg leading-8">{intro}</p>
   <div className="flex flex-wrap gap-3"><ButtonLink href="/editor?template=classic&new=1" trackingLabel={placement+"_neutral_hero"}>Build and preview free</ButtonLink><ButtonLink href="#compare" variant="secondary">Compare plans</ButtonLink></div>
   <SearchPlanChoice placement={placement+"_hero"}/>
  </div></section>
  <div className="container-page space-y-12 py-12">
   <section id="compare" className="space-y-5"><h2 className="font-display text-3xl font-semibold">{p.brand} and WorkCV compared</h2>
   <p className="max-w-3xl leading-7">WorkCV publishes this comparison and sells the WorkCV plans described here. UK pricing checked {p.checked}. Offers and features can change.</p>
   <ComparisonTable caption={p.brand+" versus WorkCV: billing and access"} headers={["Area",p.brand,"WorkCV"]} rows={rows}/></section>
   <SearchCostComparison brandKey={brandKey}/>
   <section className="grid gap-6 md:grid-cols-2"><article className="rounded-xl border border-line p-6"><h2 className="font-display text-2xl font-semibold">When {p.brand} may suit you</h2><p className="mt-4 leading-7">{live ? "You prefer LiveCareer's guided content and wider template choices, or already have documents saved there. Its short trial can cost less for a brief task if you manage renewal; annual access is another route worth checking directly." : "You want MyPerfectCV's template catalogue and the other services included in its premium plan, or prefer to keep using your existing account. The trial may suit a short project; annual access has a different upfront cost."}</p></article>
   <article className="rounded-xl border border-line p-6"><h2 className="font-display text-2xl font-semibold">When WorkCV may suit you</h2><p className="mt-4 leading-7">You want UK CVs and matching letters, a complete preview before paying, and no automatic renewal. Keep one paid saved pair or choose Pass to retain separate applications. A Pass does not promise unlimited AI generation or interviews.</p></article></section>
   <section className="space-y-5"><h2 className="font-display text-3xl font-semibold">One accurate starting CV, separate applications</h2><ol className="list-decimal space-y-3 pl-6"><li>Create and review your starting CV and letter.</li><li>Duplicate for another vacancy. Adjust the profile, evidence and letter using your actual experience.</li><li>Reopen the version you sent, rather than overwrite it for the next job.</li></ol><p>See <Link href="/tailor-cv-to-job-description-uk" className="font-bold underline">one CV adapted to two vacancies</Link>, then <Link href="/tools/job-application-pack-uk" className="font-bold underline">draft your CV wording and letter from an advert</Link>.</p></section>
   <section className="space-y-5"><h2 className="font-display text-3xl font-semibold">Moving from {p.brand}</h2><ol className="list-decimal space-y-3 pl-6"><li>Export documents using the options available in your existing account and keep local copies.</li><li>Bring your CV content into WorkCV and check titles, dates, wording and layout.</li><li>If you want to stop the old renewal, cancel with the provider and keep its confirmation. WorkCV does not do this for you.</li></ol><Link className="font-bold underline" href={live?"/cancel-livecareer-uk":"/cancel-myperfectcv-uk"}>Read the sourced cancellation guide</Link></section>
   <SearchPlanChoice placement={placement+"_final"}/>
   <p className="text-sm">Read <Link className="underline" href="/terms">WorkCV purchase terms</Link> and <Link className="underline" href="/pricing">plan details</Link> before checkout.</p>
  </div>
  <OfficialSourcesSection brand={p.brand} sources={[["Official pricing",p.pricingSource],["Official terms",p.operatorSource]]}/>
  <FaqSection title={`Questions about ${p.brand} alternatives`} faqs={faqs}/>
  <RelatedLinksSection title="Compare your next step" links={[["MyPerfectCV vs LiveCareer","/myperfectcv-vs-livecareer-uk"],["CV builder without a subscription","/cv-builder-no-subscription-uk"],["Track your applications","/tools/job-application-tracker-uk"]]}/>
 </>;
}
