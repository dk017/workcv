import Link from "next/link";
import { Guide, GuideSection, GuideTable, CvTextExample, GuideSource, guideMetadata } from "@/components/cv-guide";
import { longerCv, shorterCv, shorteningEdits, exampleWordCount } from "@/lib/content-cv-examples";
import { analyticsPlacements } from "@/lib/analytics-placements";
const path = "/shorten-cv-to-two-pages";
export const metadata = guideMetadata(path, "Shorten a CV to Two Pages: Worked Example | WorkCV", "Cut repetition and preserve relevant evidence with six before-and-after CV edits, complete fictional drafts and measured word counts.");
export default function ShortenCvGuide() {
  return <Guide path={path} title="How to shorten a three-page CV to two pages" placement={analyticsPlacements.shortenGuideCheck} action={["Check my CV word count", "/tools/cv-word-count-checker"]}
    intro="Start by identifying the evidence the vacancy needs, then remove repetition, compress older experience and shorten general self-description. Keep honest dates and relevant qualifications. Two pages is a common target for a standard CV, not a rule for every application. Make content edits before changing the layout, and check the rendered file: a word count alone cannot tell you how many pages it uses."
    links={[["CV readability checker", "/tools/cv-readability-checker"], ["Check against the vacancy", "/tools/ats-score-checker"], ["Turn your draft into a PDF", "/chatgpt-cv-to-pdf-uk"], ["Career-change example", "/career-change-cv-uk"]]}>
    <GuideSection title="Protect the evidence before cutting">
      <p>Save a working copy so you can compare versions. List the vacancy's essential requirements and identify where your CV demonstrates each one. A sentence that proves a required skill deserves more space than a long list of routine duties unrelated to the job.</p>
      <p>Keep employer names, actual job titles and dates legible. Compression should not conceal a career break or create a misleading timeline. A relevant qualification may need its full name even when an abbreviation would save a line.</p>
      <p>Two pages is a useful aim for many standard applications. An early-career CV may need only one; academic or specialist applications may require more. An employer's detailed work-history instructions take precedence over an arbitrary page target.</p>
      <GuideSource href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv">Prospects: CV length and formatting</GuideSource>
    </GuideSection>
    <GuideSection title="Six edits you can apply to your own draft">
      <p>Alex is a fictional retail supervisor applying for office administration. The source facts include weekly rotas, Excel records, customer email replies and shift handovers. The edits retain those facts without inventing time savings or sales results.</p>
      <div className="space-y-6">{shorteningEdits.map(([label, before, after, why]) => <section key={label} className="rounded-lg border border-line bg-white p-5 md:p-7"><h3 className="font-display text-2xl font-semibold text-navy">{label}</h3><p className="mt-4"><strong>Before:</strong> {before}</p><p className="mt-4"><strong>After:</strong> {after}</p><p className="mt-4 text-sm text-muted">{why}</p></section>)}</div>
    </GuideSection>
    <GuideSection title="Compare the complete drafts">
      <p>The full teaching drafts below contain <strong>{exampleWordCount(longerCv)} words before</strong> and <strong>{exampleWordCount(shorterCv)} words after</strong>. The count includes headings and contact information; standalone bullet symbols and separators are excluded. These are text-editing examples, not a claim that these particular drafts occupy three and two pages. Your font, spacing and actual content determine the rendered page count.</p>
      <details className="rounded-lg border border-line p-5"><summary className="cursor-pointer font-bold text-navy">Read the complete original draft ({exampleWordCount(longerCv)} words)</summary><div className="mt-5"><CvTextExample title="Alex Morgan: original draft" text={longerCv} /></div></details>
      <CvTextExample title="Alex Morgan: edited draft" text={shorterCv} />
      <p>The edited profile includes a short statement about handovers to establish the target role; it does not introduce new experience. Education and the two employment periods remain. The references sentence is removed to prioritise relevant content.</p>
    </GuideSection>
    <GuideSection title="Find the remaining space without hiding information">
      <GuideTable caption="What to keep, shorten or remove" headings={["Keep", "Shorten or remove"]} rows={[
        ["Evidence of essential requirements", "Repeated lists of the same skill in the profile, skills and every job"],
        ["Recent relevant responsibilities and achievements", "Detailed descriptions of old unrelated duties"],
        ["Clear dates and job titles", "Long introductory phrases such as 'I was responsible for being in charge of'"],
        ["Readable headings and body text", "Decorative elements and excessive empty paragraphs"],
        ["Relevant qualifications and professional credentials", "Unused template prompts and generic interests with no connection to the role"],
      ]} />
      <p>Preview again after every group of edits. Check whether a heading has been stranded at the bottom of a page, whether the final line wraps unnecessarily and whether a job is split awkwardly. Fix the wording or section spacing before shrinking the font.</p>
      <p>Use readable body text and consistent margins. If the document still needs more room, reassess relevance rather than squeezing every line. The <Link className="underline" href="/tools/cv-word-count-checker">word-count checker</Link> can measure the text, while the final PDF or Word preview reveals the actual layout.</p>
    </GuideSection>
    <GuideSection title="Questions about cutting a CV">
      <p><strong>Can I remove older jobs?</strong> You can give older unrelated work less detail, but do not present an incomplete history as complete when the employer explicitly asks for every role. A brief dated entry may be sufficient.</p>
      <p><strong>Can I make the font smaller?</strong> Keep readability first. If someone needs to zoom substantially just to read normal body text, the layout needs attention. National Careers Service recommends a clear font at size 11 or larger.</p>
      <p><strong>What if the shorter version loses important evidence?</strong> Restore the evidence and remove something less relevant. Use the vacancy as the priority list, not a fixed word budget.</p>
      <GuideSource href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections">National Careers Service: readable CV text and relevant content</GuideSource>
    </GuideSection>
  </Guide>;
}
