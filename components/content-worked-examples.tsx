import Link from "next/link";
import { ButtonLink } from "@/components/marketing";
import { WorkedSection, CvTextExample, GuideTable, GuideSource } from "@/components/cv-guide";
import { careEntryCv, retailAdminCv, returnerCv } from "@/lib/content-cv-examples";
import { checkerExampleInput, checkerExampleClassification } from "@/lib/content-checker-example";
import { scoreCvFit } from "@/lib/cv-fit-assessment";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";

function EditorTerms() { return <p className="text-sm text-muted">Email-code login required. Build and preview free; pay {site.price} once for this saved CV&apos;s PDF. No subscription. Copy only details that are true for you.</p>; }

export function CareEntryExample() {
  return <WorkedSection title="A complete care-worker CV with no care experience">
    <p>Your first care application can show how you listen, record information and follow instructions without claiming duties you have never performed. Jamie&apos;s example uses shop experience. It does not establish competence in professional care.</p>
    <CvTextExample title="Jamie Ellis: first care application" text={careEntryCv} />
    <GuideTable caption="Three supported transferable skills" headings={["Actual activity", "Relevant quality", "Why this bullet is useful"]} rows={[
      ["Explained refund options and checked understanding", "Patient communication", "Shows listening and explaining a process, without claiming communication with care-service users."],
      ["Recorded unresolved enquiries in the shift log", "Clear written records", "Shows a colleague could pick up the next step. It does not imply experience writing care records."],
      ["Referred procedure exceptions to the supervisor", "Following instructions and recognising limits", "Demonstrates asking for help instead of making an unsupported decision."],
    ]} />
    <p>Only list training you have completed and credentials you can verify. Willingness to take induction is different from having a care qualification. Do not add a DBS status, safeguarding course, medication duty or clinical skill just because the vacancy mentions it. Check whether the role provides entry-level training.</p>
    <p>See <Link href="/cv-no-experience-uk" className="underline">no-experience CV guidance</Link>, <Link href="/cv-personal-statement-uk" className="underline">profile examples</Link> and the <Link href="/tools/ats-score-checker" className="underline">vacancy match checker</Link> for the next edit.</p>
    <GuideSource href="https://nationalcareers.service.gov.uk/job-profiles/care-worker">National Careers Service: care-worker entry routes and skills</GuideSource>
    <EditorTerms /><ButtonLink href="/editor?template=classic&new=1" trackingLabel={analyticsPlacements.careEntryEditor}>Start my first care CV</ButtonLink>
  </WorkedSection>;
}

export function CareerChangeExample() {
  return <WorkedSection title="Retail to office administration: a complete worked example">
    <p><strong>Fictional vacancy brief:</strong> Birch Office Services needs an administrator to coordinate schedules, keep spreadsheet records accurate, respond to customer emails and provide written handovers. Alex&apos;s retail experience supplies evidence for each task.</p>
    <p><strong>Profile before:</strong> Hardworking retail supervisor looking for a new challenge and an opportunity to develop.</p>
    <p><strong>Profile after:</strong> Retail supervisor moving into office administration, with experience coordinating rotas, maintaining Excel stock records and responding to customer enquiries.</p>
    <GuideTable caption="Four rewrites grounded in the candidate's source notes" headings={["Rough note", "CV bullet", "Office requirement"]} rows={[
      ["Did the rota for our 12 staff; checked holiday with manager", "Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.", "Scheduling"],
      ["Entered deliveries in Excel and checked notes", "Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.", "Accurate spreadsheet records"],
      ["Answered order emails and logged the next step", "Replied to customer order enquiries by email, recording the agreed next step in the order log.", "Customer email communication"],
      ["Left the next shift a list of open orders and owners", "Wrote end-of-shift handovers identifying outstanding orders and the colleague responsible for follow-up.", "Written handovers"],
    ]} />
    <CvTextExample title="Alex Morgan: retail-to-admin CV" text={retailAdminCv} />
    <p>The profile names the intended role; the employment section keeps the real retail titles. Excel data entry and filtering do not establish advanced formulas or experience in an accounting package. If a vacancy requires a tool you have not used, clarify its importance or pursue suitable training rather than adding an unsupported skill.</p>
    <p>Use the <Link href="/tools/ats-score-checker" className="underline">CV match checker</Link> for a specific vacancy, the <Link href="/shorten-cv-to-two-pages" className="underline">shortening walkthrough</Link> to remove repetition, or a <Link href="/tools/blank-cv-template-uk" className="underline">blank Word template</Link> for an editable file.</p>
    <GuideSource href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections">National Careers Service: tailoring evidence to the role</GuideSource>
    <EditorTerms /><ButtonLink href="/editor?template=classic&new=1" trackingLabel={analyticsPlacements.careerChangeExampleEditor}>Build my career-change CV</ButtonLink>
  </WorkedSection>;
}

export function ReturnerExample() {
  return <WorkedSection title="A complete CV after a childcare break">
    <p>Sam&apos;s fictional timeline separates previous employment, a childcare break and recent volunteering. The volunteer activity overlaps the break from paid employment; it is not presented as a paid office job or a completed qualification.</p>
    <CvTextExample title="Sam Taylor: return-to-work CV" text={returnerCv} />
    <GuideTable caption="Choose one brief gap description that fits your circumstances" headings={["Option", "Wording"]} rows={[
      ["Childcare wording", "Career break for childcare, January 2022–Present. Now seeking part-time office administration work."],
      ["Less personal wording", "Career break for family responsibilities, January 2022–Present. Now seeking part-time office administration work."],
    ]} />
    <p>These are alternative descriptions of the same example, not two separate periods. You do not need to provide children&apos;s names or sensitive family details. Change the dates and availability to your actual circumstances.</p>
    <GuideTable caption="Why the employment bullets remain useful" headings={["Evidence", "What it demonstrates"]} rows={[
      ["Checked contact details before entering appointments", "Accuracy in a specific task, rather than merely claiming attention to detail."],
      ["Prepared appointment lists and highlighted schedule changes", "Planning and communicating changes with a clear work context."],
      ["Answered routine emails and passed technical questions on", "Useful communication and awareness of the limits of the role."],
    ]} />
    <p>If you have completed a refresher course, name it and give the actual completion date. If you have not, retain strong previous evidence and describe any genuine recent practice accurately. Do not copy Sam&apos;s volunteering unless you have done comparable work yourself.</p>
    <p>See <Link href="/cv-employment-gap-uk" className="underline">general employment-gap guidance</Link>, <Link href="/shorten-cv-to-two-pages" className="underline">how to shorten older experience</Link> and the <Link href="/tools/ats-score-checker" className="underline">job-match checker</Link>.</p>
    <GuideSource href="https://nationalcareers.service.gov.uk/careers-advice/explain-gaps-in-work-history">National Careers Service: explaining gaps in employment</GuideSource>
    <EditorTerms /><ButtonLink href="/editor?template=classic&new=1" trackingLabel={analyticsPlacements.returnerExampleEditor}>Build my return-to-work CV</ButtonLink>
  </WorkedSection>;
}

export function CheckerWorkedExample() {
  const result = scoreCvFit(checkerExampleInput, checkerExampleClassification);
  return <WorkedSection title="Worked check: a retail CV against an office vacancy">
    <p>This reproducible teaching example uses a fictional CV and vacancy. WorkCV supplied the illustrative evidence classifications below, then ran them through the same scoring function used by the checker. It is not a recorded live AI assessment. A live assessment may select or classify evidence differently.</p>
    <details className="rounded-lg border border-line bg-white p-5"><summary className="cursor-pointer font-bold text-navy">Read the complete example CV and vacancy</summary><div className="mt-5 space-y-5"><CvTextExample title="Alex Morgan: supplied CV" text={checkerExampleInput.cvText} /><p className="whitespace-pre-wrap">{checkerExampleInput.jobDescription}</p></div></details>
    <p><strong>Illustrative calculated result: {result.score}/100 ({result.band}).</strong> This is WorkCV&apos;s assessment scale, not an employer pass mark or prediction of an interview.</p>
    <GuideTable caption="The five calculated dimensions" headings={["Dimension", "Points"]} rows={result.dimensions.map(d => [d.label, `${d.score} / ${d.maximum}`])} />
    <GuideTable caption="Evidence behind the classifications" headings={["Vacancy requirement", "Finding", "Evidence or limitation"]} rows={result.requirements.map(r => [r.requirement, r.status.replaceAll("-", " "), r.cvEvidence || r.explanation])} />
    <ol className="list-decimal space-y-3 pl-6">{result.priorities.map(p => <li key={p.title}><strong>{p.title}.</strong> {p.action}</li>)}</ol>
    <p>A missing qualification or essential software skill cannot be fixed by repeating a keyword. Add a claim only when you can support it. The checker compares supplied text; it cannot inspect columns, images, file parsing or page breaks. Review the <Link className="underline" href="/cv-word-or-pdf-uk">final file format</Link> separately and use the <Link className="underline" href="/shorten-cv-to-two-pages">shortening guide</Link> if the evidence is buried in repetition.</p>
    <p>The <Link className="underline" href="/career-change-cv-uk">career-change walkthrough</Link> explains how Alex&apos;s bullets were written. Use the checker above for your own vacancy, then review its suggested next steps before carrying a draft into the saved editor.</p>
  </WorkedSection>;
}
