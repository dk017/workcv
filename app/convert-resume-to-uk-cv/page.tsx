import Link from "next/link";
import { Guide, GuideSection, GuideSource, GuideTable, CvTextExample, guideMetadata } from "@/components/cv-guide";
import { overseasBefore, overseasAfter } from "@/lib/content-cv-examples";
import { analyticsPlacements } from "@/lib/analytics-placements";

const path = "/convert-resume-to-uk-cv";
export const metadata = guideMetadata(path, "Convert an Overseas Resume to a UK CV | WorkCV", "Adapt your resume for UK applications with an annotated example. Keep qualifications accurate, clarify overseas experience and choose an appropriate file format.");
export default function OverseasCvGuide() {
  return <Guide path={path} title="How to convert an overseas resume into a UK CV" placement={analyticsPlacements.overseasGuideEditor} action={["Start a UK CV", "/editor?template=classic&new=1"]}
    intro="Keep the facts of your experience and adapt how you explain them for the particular UK vacancy. Use clear section headings, make unfamiliar job terminology understandable and retain the original names of qualifications. Remove unnecessary personal details and follow the employer's file instructions. You do not need to invent UK experience or relabel an overseas qualification to make your CV useful."
    links={[["CV versus resume in the UK", "/cv-vs-resume-uk"], ["Free blank Word template", "/tools/blank-cv-template-uk"], ["Word or PDF?", "/cv-word-or-pdf-uk"], ["Right-to-work CV guidance", "/right-to-work-cv-uk"]]}>
    <GuideSection title="Change the presentation while keeping your experience">
      <p>For most ordinary UK job applications, the requested document is called a CV. Renaming the file is the easy part; the useful work is selecting evidence for the role. See the <Link href="/cv-vs-resume-uk" className="underline">CV and resume terminology guide</Link> if you are unsure which document the employer means. Academic applications can require a different, more detailed format.</p>
      <p>Resumes vary between people, industries and countries. The example below illustrates one applicant's editing decisions; it is not a description of how everyone in India or any other country writes a resume. Read the actual vacancy before deciding what to change.</p>
      <GuideTable caption="Review each section before sending a UK CV" headings={["Section", "Practical change"]} rows={[
        ["Contact details", "Use your actual name, reachable email and phone number with the appropriate country code. Keep public examples separate from your real contact details."],
        ["Location", "State your real location. If relevant, explain a confirmed relocation plan accurately; do not invent a UK address."],
        ["Personal information", "Leave out age, date of birth, marital status and nationality. Keep the focus on suitability for the role."],
        ["Profile", "Replace a broad career objective with your background, relevant evidence and target role."],
        ["Employment", "Retain actual job titles and employers. Add a short plain-language explanation where terminology is unfamiliar."],
        ["Dates", "Use consistent, unambiguous dates such as July 2021. Keep the chronology intact."],
        ["Spelling", "Use consistent UK spelling while preserving official organisation, software and qualification names."],
        ["Education", "Include the original qualification, awarding institution, country and dates. Do not convert grades yourself."],
        ["References", "Avoid publishing referees' personal details. Supply them through the employer's requested process when appropriate."],
        ["File format", "Check the application instructions for DOCX, PDF, file size and any naming requirements."],
      ]} />
      <GuideSource href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections">National Careers Service: contact details, sections and personal information</GuideSource>
    </GuideSection>
    <GuideSection title="Before and after: an operations application">
      <p>Priya's fictional source notes establish that she follows up purchase orders with suppliers, prepares weekly Excel status reports and records replies to delivery queries. These facts explain the vague bullets in the starting draft. The rewrite draws on those notes; it does not infer responsibilities from a title alone.</p>
      <CvTextExample title="Starting resume" text={overseasBefore} />
      <CvTextExample title="UK application version" text={overseasAfter} />
      <p>The placeholders in these teaching examples protect contact details. Replace them before using the structure for your own application. Priya remains based in Pune in both versions: a UK application does not justify claiming she already lives in Britain.</p>
      <GuideTable caption="What changed and why" headings={["Original wording", "Revised evidence", "Reason"]} rows={[
        ["Responsible for vendor follow-ups and MIS.", "Followed up outstanding purchase orders with suppliers and updated the weekly Excel status report.", "Explains the actual task and report rather than relying on an abbreviation."],
        ["Handled customer requests and did the needful.", "Replied to delivery queries, confirmed the next step with the supplier and recorded the response.", "Shows the communication and recording process without adding invented results."],
        ["Seeking a challenging position…", "Operations executive with purchase-order and reporting experience, seeking operations administration.", "Names relevant experience and the intended role rather than a generic ambition."],
      ]} />
    </GuideSection>
    <GuideSection title="Keep qualifications accurate">
      <p>Write the qualification as it was awarded. If the title needs explanation, add a plain-language translation alongside the original; do not silently replace it with a UK award. Keep an original grade if relevant and explain its scale only when you can verify it. A percentage does not become a UK degree classification because an online example suggests it.</p>
      <p>If an employer needs a formal comparison, check whether UK ENIC's Statement of Comparability is appropriate. It provides context for international qualifications but does not compare grades or certify English proficiency. It is a chargeable service, so check its scope and the employer's request before ordering.</p>
      <GuideSource href="https://www.enic.org.uk/individuals/statement-of-comparability">UK ENIC: what a Statement of Comparability includes and excludes</GuideSource>
    </GuideSection>
    <GuideSection title="Tailor the evidence to the vacancy">
      <p>Imagine the role asks for supplier follow-up, spreadsheet records and customer communication. Priya can point to a specific bullet for each requirement. If it also requires a named software package she has never used, adding that name to Skills would misrepresent her experience. She should establish whether it is essential and describe only the related tools she actually knows.</p>
      <p>Keep specialist terminology that the vacancy uses when it accurately describes your work. Explain local abbreviations on first use. For a translated job title, retain the official title and add a short explanation in brackets rather than upgrading the position.</p>
      <p>A CV statement is not proof of right to work. Use the employer's application process for eligibility questions and consult the <Link href="/right-to-work-cv-uk" className="underline">right-to-work guide</Link> for the distinction between CV wording and the separate check.</p>
    </GuideSection>
    <GuideSection title="Questions when moving into the UK job market">
      <p><strong>Should I include a photograph?</strong> For a standard UK CV, use the space for experience and qualifications. Specialist applications that explicitly request photographs or portfolios should be handled according to their instructions.</p>
      <p><strong>Do I need a UK address?</strong> Do not use an address you do not have. Give accurate contact/location information and answer any location or relocation questions in the application.</p>
      <p><strong>Should I include nationality?</strong> Leave it off the CV; it is not evidence of your skills. Answer separately requested eligibility questions accurately.</p>
      <p><strong>Should I send Word or PDF?</strong> Follow the vacancy instructions. Keep an editable master and inspect the actual submitted file. The <Link className="underline" href="/cv-word-or-pdf-uk">format decision guide</Link> helps when the instructions are less specific.</p>
      <GuideSource href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv">Prospects: UK CV presentation and submission guidance</GuideSource>
    </GuideSection>
  </Guide>;
}
