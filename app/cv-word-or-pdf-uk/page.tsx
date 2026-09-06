import Link from "next/link";
import { Guide, GuideSection, GuideSource, GuideTable, guideMetadata } from "@/components/cv-guide";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";
const path = "/cv-word-or-pdf-uk";
export const metadata = guideMetadata(path, "CV in Word or PDF? UK Application Guide | WorkCV", "Choose a CV file format using the employer's instructions. Compare DOCX and PDF, check selectable text and find the right WorkCV template or export.");
export default function CvFormatGuide() {
  return <Guide path={path} title="Should you send your CV as Word or PDF?" placement={analyticsPlacements.formatGuideWord} action={["Get the free Word template", "/tools/blank-cv-template-uk"]}
    intro="Use the format the employer requests. If the advert asks for DOCX, send DOCX; if it asks for PDF, send PDF. When both are accepted, consider whether the recipient needs to edit the file or simply read a stable layout. Keep an editable master, check the upload limit and open the exact file you will submit. Neither format guarantees compatibility with every recruitment system."
    links={[["Free blank Word CV", "/tools/blank-cv-template-uk"], ["Format a ChatGPT draft", "/chatgpt-cv-to-pdf-uk"], ["CV match checker", "/tools/ats-score-checker"], ["WorkCV PDF pricing", "/pricing"]]}>
    <GuideSection title="Use this decision table">
      <GuideTable caption="Choose a format for this application" headings={["Application instructions", "Your next step"]} rows={[
        ["Send a Word document or .docx", "Submit DOCX. Do not substitute a PDF because it looks better in your preview."],
        ["Send a PDF", "Export a text-based PDF from your document and check it opens correctly."],
        ["An upload field lists accepted extensions", "Choose one of the listed formats and stay within the size limit. Check that the upload completes."],
        ["Email a CV, with no format specified", "A text-based PDF can preserve the presentation for reading. If editability matters or the recipient has a preference, ask or follow their guidance."],
        ["A recruiter requests an editable copy", "Provide the requested Word document and inspect it first. Keep your own original copy."],
        ["An application form asks you to enter employment details", "Complete the required fields; attaching a CV may not replace them."],
      ]} />
      <p>Look at the advert, attachments and the actual application portal. Instructions can differ between roles at the same organisation. If they conflict, contact the recruiter before the deadline rather than assuming one generic recommendation applies.</p>
      <GuideSource href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv">Prospects: follow the requested file extension</GuideSource>
    </GuideSection>
    <GuideSection title="What Word and PDF are useful for">
      <p>A DOCX is an editable document. It is useful when you are revising your wording or the recipient specifically needs to work with the file. Layout can change when it opens with different fonts or software, so inspect the copy you intend to send.</p>
      <p>A PDF is useful for sharing a fixed page layout. It is still possible to produce a poor PDF: text may be too small, a section may fall onto a nearly empty page, or the file may contain only a picture of the CV. Exporting does not replace checking.</p>
      <p>For both formats, use clear headings and ordinary text for the essential information. Avoid putting your only phone number or qualification title inside an image. A recruiting system may extract text differently from the way a person sees the page.</p>
    </GuideSection>
    <GuideSection title="Check whether a PDF contains usable text">
      <ol className="list-decimal space-y-3 pl-6"><li>Open the PDF you will actually submit, not just the editor preview.</li><li>Try selecting your name and an experience bullet.</li><li>Copy a section into a plain text editor and inspect the order and characters.</li><li>Check every page for clipped lines, missing symbols and headings separated from their content.</li></ol>
      <p>If you can only select a whole image, look for the original document and export from it. A scanned document may have a recognised text layer, but recognition can make mistakes. Review the extracted text rather than assuming it is correct.</p>
      <p>This is a useful manual check, not a simulation of an employer's ATS. It cannot certify that all software will parse the file identically. Likewise, the WorkCV <Link className="underline" href="/tools/ats-score-checker">CV match checker</Link> reviews supplied text against a vacancy; it cannot inspect file layout from pasted text.</p>
    </GuideSection>
    <GuideSection title="Which WorkCV option gives you the file you need?">
      <GuideTable caption="WorkCV document options" headings={["Option", "What you receive", "Account and cost"]} rows={[
        ["Blank Word template", "An editable .docx with instructions to replace. Fill and format it yourself.", "Free direct download; no account required."],
        ["Online CV editor", "A PDF of your saved CV, using the selected WorkCV layout.", `Email-code login. Build and preview free; ${site.price} once for one saved CV's PDF.`],
      ]} />
      <p>The Word template is not an export of a CV already built in the editor. If you need DOCX, use the <Link className="underline" href="/tools/blank-cv-template-uk">blank Word template</Link> and enter your content there. If PDF is suitable, <Link className="underline" href="/editor?template=classic&new=1">build and preview in WorkCV</Link> before deciding to pay.</p>
    </GuideSection>
    <GuideSection title="Send the final version, not your working file">
      <p>Use a clear filename such as <code>Alex-Morgan-CV.pdf</code> or <code>Alex-Morgan-CV.docx</code>. Remove internal labels such as “draft”, “old” or “final-final” once the file is ready. Do not change an extension by renaming it: use the document application's actual save or export option.</p>
      <p>Keep the file under the stated size limit. Check that comments, tracked changes, template instructions and unused example text are absent. Open the attachment from the draft email or inspect the uploaded file where the portal allows it; this catches accidentally selecting an older version.</p>
      <p><strong>Should I send both?</strong> Usually provide the requested file rather than attaching competing versions without explanation. If both are requested, make sure their content agrees.</p>
      <p><strong>Can an ATS read PDFs?</strong> Support depends on the system and its configuration. Follow the listed formats and use a text-based document; do not rely on a universal “ATS-safe” label.</p>
      <p><strong>Can I export my WorkCV CV to Word?</strong> The current editor download is PDF. The free DOCX is a separate blank template.</p>
    </GuideSection>
  </Guide>;
}
