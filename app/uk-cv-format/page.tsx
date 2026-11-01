import Link from "next/link";
import { CvTextExample, Guide, GuideSection, GuideSource, GuideTable, guideMetadata } from "@/components/cv-guide";
import { analyticsPlacements } from "@/lib/analytics-placements";
const path = "/uk-cv-format";
const reviewed = "2026-11-01";
export const metadata = guideMetadata(path, "UK CV Format 2026: Sections, Order and Rules | WorkCV", "The standard UK CV format: up to two A4 pages, newest job first, no photo or date of birth. Section order, date style, layout, file type and a full example.");

const example = `ALEX MORGAN
Leeds · 07700 900123 · alex.morgan@example.com · linkedin.com/in/alexmorgan-example

PROFILE
Customer operations coordinator with four years in high-volume retail and logistics support. Resolves delivery and billing queries across phone, email and chat, and trains new starters on the case-management system. Looking for a team-leader role in a customer service centre.

EXPERIENCE
Customer Operations Coordinator — Northway Logistics, Leeds
March 2023 – Present
• Handle 40–60 customer cases a day across phone, email and live chat, keeping the team's 48-hour response target.
• Rewrote eight standard replies for missed deliveries, cutting repeat contacts on those cases.
• Train and shadow new starters during their first two weeks; six trained so far.

Customer Service Adviser — Brightside Home Store, Wakefield
June 2021 – February 2023
• Took payments, refunds and exchanges at a till handling up to £3,000 a day.
• Resolved complaints in store and escalated faulty-product claims to the supplier.

EDUCATION
Level 3 Diploma in Business — Leeds City College, 2021
GCSEs: 8 at grades 9–4, including English and Maths

SKILLS
Zendesk · Microsoft Excel (filters, pivot tables) · Complaint handling · Coaching new starters

INTERESTS
Volunteer coach for an under-12s football team (FA Introduction to Coaching Football)`;

export default function UkCvFormatGuide() {
  return <Guide path={path} title="UK CV format: what a British CV looks like in 2026" reviewed={reviewed} published={reviewed} placement={analyticsPlacements.ukCvFormatEditor} action={["Start a UK-format CV", "/editor?template=classic&new=1"]}
    intro="A standard UK CV is no more than two sides of A4. It opens with your name and contact details, then a short profile, work experience with the newest job first, education and skills. Leave out a photo, date of birth, marital status and nationality. Write in British English, give dates as month and year, and send the file type the employer asks for."
    links={[["How to write a CV, step by step", "/how-to-write-a-cv-uk"], ["How long should a CV be?", "/how-long-should-a-cv-be-uk"], ["Right to work on a CV", "/right-to-work-cv-uk"], ["Word or PDF?", "/cv-word-or-pdf-uk"], ["Convert a resume to a UK CV", "/convert-resume-to-uk-cv"], ["Free blank Word CV", "/tools/blank-cv-template-uk"]]}>
    <GuideSection title="The UK CV format at a glance" id="at-a-glance">
      <GuideTable caption="UK CV conventions and the reason behind each" headings={["Element", "UK convention", "Why, or when it changes"]} rows={[
        ["Length", "Up to two sides of A4", "One page suits a first job. Three pages can suit senior or highly technical work; academic CVs run longer."],
        ["Order", "Reverse chronological: latest job first", "Put education first while it is your strongest evidence, such as at school, college or straight after graduating."],
        ["Document heading", "Your name, not \"Curriculum Vitae\"", "The reader already knows it is a CV. Your name is what they need to find the file again."],
        ["Contact details", "Phone, email, town or city", "LinkedIn or a portfolio if it supports the application. A full postal address is optional and best left off any CV you post publicly."],
        ["Photo", "None", "Expected only for acting and modelling, where the advert usually says so."],
        ["Date of birth, age, marital status", "Leave out", "Employers are advised not to ask for these during selection. A legal minimum age, such as for selling alcohol, is the exception."],
        ["Nationality and visa status", "Leave out, or one line on right to work", "Employers check right to work before you start. A line can help if your name or work history might prompt the question."],
        ["References", "Not listed", "Employers usually ask for referees once you are close to an offer. \"References available on request\" is optional; cut it if space is tight."],
        ["Spelling", "British English", "Organisation, programme, licence (noun), CV rather than resume."],
        ["Dates", "Month and year: March 2023 – Present", "Avoid numeric dates such as 03/04/2023, which UK and US readers interpret differently."],
        ["Font and margins", "A plain font at 10–12 pt; margins around 2.5 cm", "Arial, Calibri or similar. Headings slightly larger and bold."],
        ["File", "Whatever the advert or portal asks for", "If no format is stated, a text-based PDF keeps the layout; send Word when the recipient needs to edit."],
      ]} />
      <GuideSource href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv">Prospects on length, photos, fonts and margins</GuideSource>
      <GuideSource href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections">National Careers Service on CV sections and personal details</GuideSource>
    </GuideSection>

    <GuideSection title="Section order: lead with your strongest evidence" id="section-order">
      <p>Reverse-chronological is the default because it answers the recruiter's first question: what are you doing now, and how does it relate to this job? But the order of whole sections is yours to choose. The National Careers Service puts education straight after the introduction for people early in their career, and work history first for everyone else.</p>
      <GuideTable caption="Which section order fits your situation" headings={["Your situation", "Order to use", "What to watch"]} rows={[
        ["Two or more years of relevant work", "Profile, experience, education, skills", "Keep only the qualifications the role asks for. GCSE grades can shrink to one line."],
        ["Student, school leaver or recent graduate", "Profile, education, experience, skills", "Part-time jobs, volunteering and projects count as experience. Show what you did, not just where."],
        ["Changing career", "Profile, relevant skills or projects, experience, education", "Name the target role in the profile and connect old work to it. Keep job titles and dates intact."],
        ["Returning after a gap", "Profile, experience, education, skills", "Give the gap one honest line in its place in the timeline rather than hiding it."],
      ]} />
      <p>A purely skills-based (functional) CV, with no dated job list, is rarely the right answer in the UK. Readers expect to see where and when you worked, and removing the timeline tends to raise the question you were trying to avoid. If your history is complicated, the <Link className="underline" href="/career-change-cv-uk">career change</Link> and <Link className="underline" href="/cv-employment-gap-uk">employment gap</Link> guides show hybrid layouts that keep the dates.</p>
    </GuideSection>

    <GuideSection title="What goes in each section of a UK CV" id="sections">
      <h3 className="font-display text-2xl font-semibold text-navy">Name and contact details</h3>
      <p>Put your name in large type at the top, followed by one line with your phone number, a sensible email address, and the town or city you live in. That location helps a recruiter judge the commute without needing your house number. Add a LinkedIn or portfolio link only if it shows something the CV does not.</p>
      <h3 className="font-display text-2xl font-semibold text-navy">Profile (personal statement)</h3>
      <p>Three or four lines saying who you are professionally, the evidence that matters most for this role and what you are looking for. Write it last, once you know which achievements made the cut. The <Link className="underline" href="/cv-personal-statement-uk">personal statement guide</Link> has worked examples by situation.</p>
      <h3 className="font-display text-2xl font-semibold text-navy">Work experience</h3>
      <p>For each role: job title, employer and town on one line; start and end month on the next; then three to five bullet points. Lead each bullet with what you did and finish with what changed because of it, using a number where you honestly have one. Older or unrelated jobs can drop to a single line, or to an &quot;Earlier career&quot; list with titles and employers only.</p>
      <h3 className="font-display text-2xl font-semibold text-navy">Education and qualifications</h3>
      <p>Most recent first: qualification, institution, year. UK readers recognise GCSEs, A levels, BTECs, T Levels, NVQs and degree classifications such as 2:1, so name them precisely. If you studied abroad, give the qualification&apos;s real name and, if the comparison matters for the job, a UK equivalent from a <a className="underline" href="https://www.enic.org.uk/" rel="noopener noreferrer" target="_blank">UK ENIC</a> (formerly UK NARIC) statement. Don&apos;t invent an equivalence yourself.</p>
      <h3 className="font-display text-2xl font-semibold text-navy">Skills</h3>
      <p>A short list of skills the advert names and you can demonstrate: software, licences, languages with a level, certifications. Generic traits like &quot;hard-working&quot; belong in your bullets as evidence, not in a list.</p>
      <h3 className="font-display text-2xl font-semibold text-navy">Optional sections</h3>
      <p>Volunteering, certifications, languages, publications and interests earn their space when they add evidence. An interest is worth including when it shows responsibility or a relevant skill, such as running a club, coaching or organising events. With a short work history, these sections often carry your best examples.</p>
    </GuideSection>

    <GuideSection title="What to leave off a UK CV" id="leave-off">
      <p>UK employers are advised to keep selection decisions away from personal characteristics, so details that are routine on CVs in some countries work against you here. GOV.UK tells employers they can ask for a date of birth on an application only when the job has a minimum age, and that they must not ask whether a candidate is married or in a civil partnership. Putting those details on your CV hands the reader information they are trying not to see.</p>
      <ul className="list-disc space-y-3 pl-6">
        <li><strong>Photo, date of birth and age.</strong> If you want to avoid age being inferred, you can also drop the years from qualifications earned long ago and list only the last 10–15 years of jobs in detail.</li>
        <li><strong>Marital status, children, religion, health.</strong> None are relevant to selection. Health questions are restricted before a job offer, except in limited cases.</li>
        <li><strong>National Insurance number, passport number or share code.</strong> These are collected during pre-employment checks, not at the sift. A CV gets forwarded and stored; identity numbers should not travel with it.</li>
        <li><strong>Referees&apos; names and contact details.</strong> Ask your referees first and give their details when an employer requests them.</li>
        <li><strong>Salary history.</strong> Answer salary questions in the application form or conversation if asked.</li>
      </ul>
      <GuideSource href="https://www.gov.uk/employer-preventing-discrimination/recruitment">GOV.UK: what employers can ask during recruitment</GuideSource>
      <GuideSource href="https://www.acas.org.uk/recruitment/follow-discrimination-law">Acas: following discrimination law in recruitment (updated 30 June 2026)</GuideSource>
    </GuideSection>

    <GuideSection title="Right to work: one line, only when it helps" id="right-to-work">
      <p>Employers must check your right to work before you start, either from your documents or with a share code if you are not a British or Irish citizen. That check happens after an offer, so a UK CV has no standard right-to-work field. A single line under your contact details, such as &quot;Full right to work in the UK (settled status)&quot;, is still useful if an overseas education or work history might make a recruiter wonder whether you need sponsorship.</p>
      <p>If you will need a Skilled Worker visa, don&apos;t hide it, but don&apos;t lead with it either. Check the employer holds a sponsor licence with the <Link className="underline" href="/tools/uk-visa-sponsor-checker">visa sponsor checker</Link> and raise it when you apply or are invited to interview. The <Link className="underline" href="/right-to-work-cv-uk">right-to-work wording guide</Link> has lines for each status.</p>
      <GuideSource href="https://www.gov.uk/prove-right-to-work">GOV.UK: prove your right to work to an employer</GuideSource>
    </GuideSection>

    <GuideSection title="Layout: why one column reads more predictably" id="layout">
      <p>A recruiter reads the page you see. Software that imports your CV reads the text layer underneath, and it may not follow your columns in the order you intended. WorkCV tested this with its own templates: the same fictional CV was rendered in six layouts and the text was extracted with PDF.js on 24 September 2026.</p>
      <p>In the four single-column layouts, the extracted sections came out in the order they appear on the page. In the two sidebar designs, the skills column moved: one layout&apos;s text began with Skills before the Profile, and the other placed Skills after every other section. Nothing was lost, but the sequence changed.</p>
      <p>That is one parser on six sample files, not a test of any employer&apos;s system, and many applicant tracking systems handle columns well. The practical takeaway is narrower: if the application goes through an upload portal, a single column removes one thing that can go wrong. For the same reason, WorkCV&apos;s Word export always uses a single column, whichever design you chose for the PDF. You can download the sample PDFs and inspect the extracted text yourself on the <Link className="underline" href="/cv-layout-tests-uk">layout tests page</Link>.</p>
      <p>Whatever the layout, keep essential details as live text. Contact details inside a header image, skill bars or icons in place of words can disappear when the text is extracted.</p>
    </GuideSection>

    <GuideSection title="Formatting details that trip people up" id="formatting">
      <p><strong>Dates.</strong> Use the month name and year for every role and keep the style identical throughout: &quot;June 2021 – February 2023&quot;. Numeric dates are ambiguous between UK and US readers, and seasons such as &quot;Summer 2022&quot; read as vague.</p>
      <p><strong>Spelling.</strong> Set your editor&apos;s language to English (UK) before the final check, then read for the pairs a spellchecker accepts either way because both are real words: licence and license, practice and practise, programme and program (software).</p>
      <p><strong>Fonts.</strong> Prospects suggests body text between 10 and 12 points; the National Careers Service says 11 or above. Check the exported file at actual size: a CV squeezed to fit two pages at 9 pt is harder to read than one that runs a few lines onto a clean second page. If you are over, the <Link className="underline" href="/shorten-cv-to-two-pages">shortening guide</Link> shows what to cut first.</p>
      <p><strong>File type and name.</strong> Follow the advert, portal or recruiter. If none is stated, a text-based PDF is a sensible default; the <Link className="underline" href="/cv-word-or-pdf-uk">Word or PDF guide</Link> covers the exceptions. Name the file after yourself, for example <code>Alex-Morgan-CV.pdf</code>.</p>
    </GuideSection>

    <GuideSection title="UK CV format example" id="example">
      <p>This fictional CV follows every convention above. With a four-year history it is short; a longer career keeps the same structure over two pages.</p>
      <CvTextExample title="Customer operations coordinator" text={example} />
      <p>Notice what is missing: no photo, address line, date of birth, referees or &quot;Curriculum Vitae&quot; heading. The space goes on evidence instead. For finished examples by job, see the <Link className="underline" href="/cv-examples-uk">UK CV examples</Link>.</p>
    </GuideSection>

    <GuideSection title="Converting a US resume or overseas CV" id="convert">
      <GuideTable caption="Common changes when adapting a resume for UK applications" headings={["On the original", "On a UK CV"]} rows={[
        ["One page, regardless of experience", "Up to two pages if your evidence needs it"],
        ["Photo, date of birth, nationality, marital status", "Removed"],
        ["\"Resume\", \"objective\"", "\"CV\", \"profile\" or \"personal statement\""],
        ["MM/DD/YYYY or numeric dates", "Month and year"],
        ["US spelling", "British spelling"],
        ["GPA, local grade scales", "The qualification's real name, plus a UK ENIC comparison if relevant"],
        ["Dollar or rupee figures, imperial units", "Keep the original currency or convert with care; use metric units"],
      ]} />
      <p>The <Link className="underline" href="/convert-resume-to-uk-cv">resume conversion guide</Link> walks through a full before-and-after.</p>
    </GuideSection>

    <GuideSection title="Common questions" id="questions">
      <p><strong>Is a UK CV one or two pages?</strong> Two sides of A4 is the usual maximum. One page is fine, and often better, for a first job or a short history. The <Link className="underline" href="/how-long-should-a-cv-be-uk">CV length guide</Link> covers the exceptions.</p>
      <p><strong>Do I need my full address?</strong> No. Your town or city is enough for most applications. Prospects suggests a full address for CVs you send directly, but never on a CV you post publicly.</p>
      <p><strong>Should I still write &quot;References available on request&quot;?</strong> It is optional. The National Careers Service suggests the line; Prospects says it can go if you need the space. Employers will ask either way.</p>
      <p><strong>Is a CV the same as a resume?</strong> In the UK, &quot;CV&quot; is the normal word for the document you send with most job applications. See <Link className="underline" href="/cv-vs-resume-uk">CV vs resume</Link> for how the two differ elsewhere.</p>
      <p><strong>Does a UK-format template make a CV ATS-proof?</strong> No template can promise that. A clear structure, standard headings and live text help, but what decides a sift is whether your evidence matches the vacancy. The <Link className="underline" href="/tools/ats-score-checker">CV match checker</Link> compares your text with a job advert, requirement by requirement.</p>
    </GuideSection>
  </Guide>;
}
