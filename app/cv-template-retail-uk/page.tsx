import { FirstJobExample } from "@/components/first-job-example";
import type { Metadata } from "next";
import Link from "next/link";
import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta } from "@/components/marketing";
import { RoleApplicationPack } from "@/components/role-application-pack";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title: "Retail CV Examples UK: First Job, Experienced & Cover Letter",
  description: "Read complete UK retail CV and cover letter examples with and without experience. Get a free checklist and prepare a shop assistant application from your own facts.",
  alternates: { canonical: "/cv-template-retail-uk" },
};
export default function RetailCvPage() {
  return <>
    <section className="quiet-grid bg-paper py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div><p className="text-sm font-bold uppercase tracking-wide text-navy">Retail CV template UK</p>
          <h1 className="mt-5 font-display text-5xl font-semibold text-navy md:text-6xl">A retail CV and letter built around how you help customers.</h1>
          <p className="mt-6 text-xl leading-8 text-muted">Use this sales assistant example to connect customer service, till accuracy and stock work to the vacancy. Read the matching letter, then build your own application with facts you can explain at interview.</p>
          <nav aria-label="Choose a retail example" className="mt-6 flex flex-wrap gap-4 font-bold underline"><a href="#application-pack">Experienced example and own application</a><a href="#no-experience-example">First retail job: CV and letter</a></nav><div className="mt-8"><ButtonLink href="#application-pack" trackingLabel="role_pack_retail_hero">Build my CV and letter</ButtonLink></div>
          <p className="mt-4 text-sm leading-6 text-muted">Preview free. {site.price} once for one saved CV and matching letter, each in PDF and Word.</p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-soft"><h2 className="mb-4 text-lg font-bold text-navy">Fictional retail CV example: Maya Lewis</h2><div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3"><div className="gallery-preview-document pointer-events-none mx-auto" style={{width:794}}><CvDocument cv={getRoleCvTemplate("retail")} compactPreview /></div></div></div>
      </div>
    </section>
    <RoleApplicationPack id="retail" />
    <FirstJobExample id="retail" />
    <section className="bg-paper py-16"><div className="container-page max-w-5xl"><h2 className="font-display text-3xl font-semibold text-navy">What to include in a retail CV</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{[
      ["Customer help", "Explain how you checked a need, found a product or resolved a question. Use actual product knowledge and avoid unsupported claims about sales results."],
      ["Accurate shop routines", "Describe checking prices, handling transactions, replenishing stock or handing tasks over. List only systems and responsibilities you have used."],
      ["Availability and reliability", "Give realistic hours that fit the vacancy. Support teamwork with a specific shift, event or voluntary responsibility rather than a list of adjectives."]
    ].map(([title,body])=><article key={title} className="rounded-xl border border-line bg-white p-5"><h3 className="text-lg font-bold text-navy">{title}</h3><p className="mt-3 leading-7 text-muted">{body}</p></article>)}</div><h3 className="mt-10 text-xl font-bold text-navy">Applying for your first shop job?</h3><p className="mt-3 leading-7 text-muted">Use a school project, club, event or volunteering example that shows helpfulness, organisation or accuracy. Label the setting honestly. The <Link href="/student-cv-template" className="font-bold text-navy underline">student and first-job application pack</Link> puts education first.</p><p className="mt-5 leading-7 text-muted">Instead of “good customer service”, a specific example could be “Checked the stock list for a customer, explained the available alternatives and asked a colleague to confirm delivery times.” Use this structure only with your own experience.</p></div></section>
    <FinalCta heading="Prepare your retail application." body={`Build and preview free. Pay ${site.price} once for one saved CV and matching cover letter in PDF and Word. Edits and redownloads of the same pair are included.`} primaryHref="#application-pack" primary="Build my CV and letter" trackingContext="role_pack_retail_final" secondaryHref="/cv-examples-uk" secondary="More CV examples" />
  </>;
}
