import Link from "next/link";
import { Guide, GuideSection, GuideTable, GuideSource, CvTextExample, guideMetadata } from "@/components/cv-guide";
import { retailAdminCv } from "@/lib/content-cv-examples";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";

const path = "/chatgpt-cv-to-pdf-uk";
const title = "How to turn a ChatGPT CV into a properly formatted UK PDF";
export const metadata = guideMetadata(path, "Turn a ChatGPT CV into a UK PDF | WorkCV", "Move your checked CV draft into editable fields, preview the layout and download a UK PDF. See the supported steps, a fictional example and the cost.");

export default function ChatGptCvGuide() {
  return <Guide path={path} title={title} placement={analyticsPlacements.chatgptGuideEditor} action={["Format my CV", "/editor?template=classic&new=1"]}
    intro={`Check the facts in your ChatGPT draft, then copy each section into a CV editor or save the text in a Word document for import. WorkCV accepts PDF and DOCX imports; its import dialog does not accept pasted text. Sign in with an email code, review the fields and preview the PDF. The finished download costs ${site.price} once for one saved CV, with no subscription.`}
    links={[["CV builder without a subscription", "/cv-builder-no-subscription-uk"], ["Free blank Word template", "/tools/blank-cv-template-uk"], ["Choose Word or PDF", "/cv-word-or-pdf-uk"], ["Match your CV to a vacancy", "/tools/ats-score-checker"]]}>
    <GuideSection title="Start with a draft you can stand behind">
      <p>Read every sentence before putting the draft into a template. An impressive-looking paragraph is only useful if you can explain the work behind it. Check employer names, dates, qualification titles, tools and any numbers. Remove a claim if the draft introduced it without evidence from you.</p>
      <p>Keep a copy of your checked text before formatting. Separate the profile, each job, education and skills with clear headings. Delete chat introductions, suggested alternatives, Markdown fences and instructions such as “insert achievement here”. Keep one final version of each section so you do not accidentally import competing drafts.</p>
      <p>Check the employer's instructions about AI assistance as well as the file format. Use the draft as material to review and adapt, and make sure the final application represents your own experience.</p>
      <GuideSource href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv">Prospects: CV preparation and responsible AI use</GuideSource>
    </GuideSection>
    <GuideSection title="Choose the route that matches what you have">
      <GuideTable caption="Supported ways to move your draft into WorkCV" headings={["Your starting point", "What to do", "What to check"]} rows={[
        ["Text in a ChatGPT conversation", "Copy the profile, jobs, education and skills into the corresponding editor fields.", "The profile box is for your summary, not the entire CV."],
        ["A saved DOCX or text-based PDF", "Choose Import CV and select the file. The current limit is 10MB.", "Review the import summary, then the editable fields; automated extraction can miss or misplace information."],
        ["A photograph or scan", "Use your original editable document or enter the text manually.", "Do not assume an image of a CV can be extracted accurately."],
        ["You want to format it yourself", "Download the free blank Word template and replace its prompts.", "This is a separate document, not a Word export from the WorkCV editor."],
      ]} />
      <p>WorkCV does not connect to your ChatGPT account. Uploading a file moves its content into editable fields; it does not preserve the original document's design. The selected WorkCV template controls the new layout.</p>
    </GuideSection>
    <GuideSection title="Build the PDF in six steps">
      <ol className="list-decimal space-y-4 pl-6">
        <li><strong>Sign in and start a CV.</strong> Use your email code to enter the editor. Start a new saved CV if this is a separate application document.</li>
        <li><strong>Enter or import your content.</strong> For plain text, work through Profile, Experience, Education and Skills. For a file, open More, choose Import CV, select PDF or DOCX and review the summary before applying it. Read any replacement warning if the current CV is already populated.</li>
        <li><strong>Check each field.</strong> Keep your actual job title in Experience and your intended next job in Target role. Check the employer, start/end dates and the bullet points for every job.</li>
        <li><strong>Choose a template.</strong> Open Template and compare the current layouts. Keep the content consistent while deciding which presentation suits it.</li>
        <li><strong>Preview every page.</strong> Check line wraps, contact details, headings and page breaks. Shorten repeated text before making the document harder to read.</li>
        <li><strong>Download when ready.</strong> Review the checkout details and pay {site.price} once to unlock this saved CV's PDF. Open the downloaded file separately before sending it.</li>
      </ol>
      <p>Importing may replace fields in a populated CV and the interface warns that checkout may be required again. Do not use an already purchased draft as a scratchpad for an unrelated imported CV. Review the on-screen status and <Link className="underline" href="/pricing">current pricing</Link> before proceeding.</p>
      <div className="grid gap-6">
        <figure><a href="/product-proof/chatgpt-cv-import.png"><img src="/product-proof/chatgpt-cv-import.png" alt="Current WorkCV import dialog offering PDF or DOCX files up to 10MB" width={900} height={650} className="h-auto w-full rounded-lg border border-line" /></a><figcaption className="mt-2 text-sm text-muted">1. Import accepts a saved file. If you only have text, enter it in the section fields. Open the image for a larger view.</figcaption></figure>
        <figure><a href="/product-proof/chatgpt-cv-editor.png"><img src="/product-proof/chatgpt-cv-editor.png" alt="WorkCV editor populated with the fictional Alex Morgan CV alongside its preview" width={1440} height={1000} className="h-auto w-full rounded-lg border border-line" /></a><figcaption className="mt-2 text-sm text-muted">2. Check the fields and layout using the fictional draft below. Screenshots show the local interface with demonstration data.</figcaption></figure>
      </div>
    </GuideSection>
    <GuideSection title="A complete draft and the formatted result">
      <p>This example was written for this guide; it is not a customer CV or a claim about ChatGPT output. Alex's retail responsibilities support the move into office administration. Formatting does not add qualifications or upgrade the retail job title.</p>
      <CvTextExample title="Alex Morgan: checked draft" text={retailAdminCv} />
      <figure><a href="/samples/chatgpt-cv-alex-morgan.pdf"><img src="/product-proof/chatgpt-cv-pdf.png" alt="First page of Alex Morgan's fictional CV rendered with WorkCV's Classic layout" width={794} height={1123} className="mx-auto h-auto w-full max-w-xl border border-line shadow-sm" /></a><figcaption className="mt-3 text-sm text-muted">3. The same fictional experience in a finished layout. <a href="/samples/chatgpt-cv-alex-morgan.pdf" className="font-bold text-navy underline">Open the free sample PDF</a> to inspect every page. This demonstration is free; your own editor export is paid.</figcaption></figure>
    </GuideSection>
    <GuideSection title="Final checks before you send it">
      <ul className="list-disc space-y-2 pl-6"><li>Every achievement, qualification and number is true for you.</li><li>Dates form an honest timeline; current roles and completed roles use appropriate tense.</li><li>UK spelling is consistent and no chat instructions or placeholder contacts remain.</li><li>The final file contains selectable text and the correct number of pages.</li><li>The employer accepts PDF. If DOCX is requested, use an editable Word document instead.</li></ul>
      <p><strong>Can I edit after importing?</strong> Yes: the file becomes editable fields. Check them rather than assuming the extraction is final. <strong>Do I need an account?</strong> Yes for the saved editor CV. <strong>Is there a free option?</strong> The <Link href="/tools/blank-cv-template-uk" className="underline">blank Word template</Link> is free without login; fill and format it yourself.</p>
    </GuideSection>
  </Guide>;
}
