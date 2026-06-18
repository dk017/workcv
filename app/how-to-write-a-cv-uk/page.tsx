import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  FileCheck2,
  Target,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Write a CV UK - 10-Step Guide and Editable Example",
  description:
    "Learn how to write a UK CV in 10 practical steps. Includes section examples, ATS guidance, an evidence worksheet and a complete editable CV template.",
};

const editorHref = "/editor?template=classic&roleTemplate=general&new=1";
const exampleCv = getRoleCvTemplate("general");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long should a UK CV be?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Around two A4 pages is a useful UK default, but relevance matters more than forcing an exact length. An early-career CV may be one page, while some senior, medical or academic CVs may need longer.",
      },
    },
    {
      "@type": "Question",
      name: "What should I include in a UK CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Include contact details, a focused introduction, relevant work history, education, skills and any useful qualifications, projects or volunteering. Change the order according to your strongest evidence and the job criteria.",
      },
    },
    {
      "@type": "Question",
      name: "Should a UK CV include a photo or date of birth?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Usually no. National Careers Service guidance says not to include age, date of birth, marital status or nationality, and Prospects says a photograph is generally unnecessary unless the role specifically requires one, such as acting or modelling.",
      },
    },
    {
      "@type": "Question",
      name: "Should I send my CV as a PDF or Word document?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Follow the job advert or application instructions. PDF preserves layout, but some employers or applicant tracking systems request DOCX. Check the required file type before sending.",
      },
    },
  ],
};

const guideSteps = [
  {
    number: "01",
    title: "Read the advert before writing",
    body:
      "Highlight the job title, essential criteria, tools, qualifications, behaviours and repeated phrases. Your CV is a response to those requirements, not a complete autobiography.",
    action:
      "Create two columns: what they need and where you have proved it. Missing evidence shows what to research, explain or leave out.",
  },
  {
    number: "02",
    title: "Choose the structure that fits your evidence",
    body:
      "Use reverse chronological order when recent work is your strongest proof. Put education or projects higher for early-career applications. Use a hybrid skills-led structure for a genuine career change, but keep dates and employers clear.",
    action:
      "Order sections by relevance, not habit. The most convincing evidence should appear in the first half of page one.",
  },
  {
    number: "03",
    title: "Build a clean UK header",
    body:
      "Use your name as the document title, followed by town or city, phone, professional email and a relevant LinkedIn or portfolio link. A full street address is rarely needed for an online application.",
    action:
      "Leave out age, date of birth, marital status and nationality. Do not add a photo unless the role genuinely requires one.",
  },
  {
    number: "04",
    title: "Write a focused profile",
    body:
      "In three to five lines, name your professional direction, strongest relevant evidence and the value you bring. Avoid opening with generic claims such as hardworking, passionate or looking for a challenge.",
    action:
      "Use the formula: target role or identity + evidence + role-relevant value. Rewrite it for each type of job.",
  },
  {
    number: "05",
    title: "Turn duties into evidence",
    body:
      "For each recent role, include title, employer, location, dates and concise bullets. Show the task, context and result where possible. Numbers help only when they are real and meaningful.",
    action:
      "Start bullets with accurate verbs such as handled, coordinated, reduced, checked, supported, analysed or delivered.",
  },
  {
    number: "06",
    title: "Add education and qualifications selectively",
    body:
      "List recent or relevant qualifications first. Include institution and dates, plus modules, projects, grades or training only when they support the application or the employer asks for them.",
    action:
      "Experienced applicants can shorten older school detail. Early-career applicants can use projects and coursework as evidence.",
  },
  {
    number: "07",
    title: "Name skills you can defend",
    body:
      "Use concrete tools, systems, methods, licences, languages and role-specific abilities from the advert. Soft skills become stronger when the experience section proves them.",
    action:
      "Write Microsoft Excel, Salesforce or manual handling rather than computer skills, CRM or physically fit when you can be more precise.",
  },
  {
    number: "08",
    title: "Handle gaps and limited experience honestly",
    body:
      "Employment gaps are common. You can label a period briefly and focus on relevant caring, learning, volunteering, projects or readiness to return. Never disguise dates or turn unpaid experience into a paid job.",
    action:
      "First-job applicants can use placements, volunteering, projects, societies, caring responsibilities and part-time work to prove transferable skills.",
  },
  {
    number: "09",
    title: "Make it readable for recruiters and systems",
    body:
      "Use clear headings, consistent dates, readable font sizes and standard text. Match relevant advert wording naturally, spell out qualifications and avoid relying on images, logos or graphics to carry important information.",
    action:
      "Check the requested file type. PDF preserves the layout, but use DOCX when the employer or application system asks for it.",
  },
  {
    number: "10",
    title: "Edit, verify and name the file",
    body:
      "Remove information that does not strengthen the application. Check every date, qualification, number and claim. Read the CV aloud, inspect it at normal zoom and ask someone else to proofread it.",
    action:
      "Use a professional filename such as Firstname-Lastname-CV.pdf and open the final file once before uploading it.",
  },
];

const evidenceMap = [
  ["Handle customer complaints", "Resolved returns and delivery issues within policy", "Customer Service Assistant, bullet 2"],
  ["Accurate CRM records", "Updated contact details, status and agreed actions", "Customer Service Assistant, bullet 3"],
  ["Support colleagues", "Helped two new starters learn core procedures", "Customer Service Assistant, bullet 4"],
];

const rewrites = [
  {
    weak: "Responsible for answering customer questions.",
    strong:
      "Handled 40 to 60 in-person, phone and email enquiries per shift, explaining products, deliveries and returns clearly.",
  },
  {
    weak: "Good team player who trained staff.",
    strong:
      "Supported two new starters with till procedures, returns and customer-service routines during their first month.",
  },
  {
    weak: "Used the CRM and had good attention to detail.",
    strong:
      "Updated customer and order records in the CRM, checking contact details, delivery status and agreed actions before closing each case.",
  },
];

const situationLinks = [
  ["No experience", "Lead with education, projects, volunteering and transferable evidence.", "/cv-no-experience-uk"],
  ["Career change", "Translate relevant evidence without hiding your previous career.", "/career-change-cv-uk"],
  ["Returning to work", "Show current readiness and explain the break briefly.", "/return-to-work-cv-uk"],
  ["Employment gap", "Use honest dates and a concise, relevant explanation.", "/cv-employment-gap-uk"],
];

const roleLinks = [
  ["Nurse CV", "/cv-template-nurse-uk"],
  ["Teacher CV", "/cv-template-teacher-uk"],
  ["Warehouse CV", "/cv-template-warehouse-uk"],
  ["Care worker CV", "/cv-template-care-worker-uk"],
  ["Graduate CV", "/cv-template-graduate-uk"],
];

const finalChecks = [
  "The target role is obvious in the first screenful",
  "Every important advert criterion has honest supporting evidence",
  "Recent roles use specific bullets instead of copied job descriptions",
  "Dates, employers, qualifications and numbers are accurate",
  "Contact details are current and the email address is professional",
  "Formatting, headings, punctuation and date styles are consistent",
  "No photo, date of birth, marital status or nationality is included by default",
  "The saved file type and filename match the application instructions",
];

const sourceNotes = [
  [
    "National Careers Service",
    "Official guidance covers clear formatting, tailoring, contact details, introductions, education, reverse-ordered work history, gaps and references.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Prospects CV guidance",
    "The May 2025 guide covers length, sections, formatting, ATS use, evidence, gaps, file types and responsible use of AI.",
    "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  ],
  [
    "Scottish Government",
    "Current candidate guidance recommends around two pages, tailoring against criteria, recent-first roles, specific achievements and enough context for assessors.",
    "https://www.gov.scot/publications/success-profiles-candidate-guide/pages/your-cv/",
  ],
];

export default function HowToWriteACvUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              How to write a CV UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Write a UK CV by matching evidence to the job.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Follow a practical 10-step process from job advert to final file.
              Use the editable example to turn real work, education, projects
              and skills into a CV recruiters can assess quickly.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use the complete CV example</ButtonLink>
              <ButtonLink href="#steps" variant="secondary">Start the guide</ButtonLink>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Editable example</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">Customer Service CV</h2>
              </div>
              <Link href={editorHref} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
                Edit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                <CvDocument cv={exampleCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-8">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            [Target, "Start with criteria", "The advert decides what deserves space."],
            [ClipboardCheck, "Prove each claim", "Examples beat unsupported adjectives."],
            [FileCheck2, "Follow file instructions", "Use the format the employer requests."],
          ].map(([Icon, title, body]) => {
            const StepIcon = Icon as typeof Target;
            return (
              <div key={title as string} className="flex gap-4">
                <StepIcon className="h-6 w-6 shrink-0 text-gold" />
                <div>
                  <h2 className="font-bold text-navy">{title as string}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{body as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="steps" className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>10-step guide</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Build the content in the order that produces better decisions.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Do not begin by polishing a profile for a job you have not analysed.
            Gather the criteria and evidence first, then write and format the CV.
          </p>

          <div className="mt-12 divide-y divide-line border-y border-line">
            {guideSteps.map((step) => (
              <article key={step.number} className="grid gap-5 py-8 md:grid-cols-[80px_0.8fr_1.2fr] md:gap-8">
                <div className="font-display text-3xl font-semibold text-gold">{step.number}</div>
                <h3 className="font-display text-2xl font-semibold text-navy">{step.title}</h3>
                <div>
                  <p className="text-sm leading-7 text-muted">{step.body}</p>
                  <p className="mt-4 border-l-2 border-gold pl-4 text-sm font-bold leading-7 text-navy">{step.action}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Evidence map</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Map every important requirement to proof.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              This simple worksheet prevents a common mistake: listing skills
              in one section without showing where you used them. Build the map
              before editing the CV.
            </p>
            <div className="mt-8"><ButtonLink href={editorHref}>Open the worked example</ButtonLink></div>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[0.9fr_1.3fr_1fr] gap-3 bg-navy p-4 text-xs font-bold uppercase text-white md:grid">
              <span>Advert need</span><span>Your evidence</span><span>Where it goes</span>
            </div>
            {evidenceMap.map(([need, evidence, location]) => (
              <div key={need} className="grid grid-cols-1 gap-2 border-t border-line p-4 text-sm md:grid-cols-[0.9fr_1.3fr_1fr] md:gap-3">
                <strong className="text-navy"><span className="mr-2 text-xs uppercase text-muted md:hidden">Advert need:</span>{need}</strong>
                <span className="leading-6 text-muted"><span className="mr-2 text-xs font-bold uppercase text-navy md:hidden">Evidence:</span>{evidence}</span>
                <span className="leading-6 text-muted"><span className="mr-2 text-xs font-bold uppercase text-navy md:hidden">Location:</span>{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Experience bullets</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Replace job-description language with usable evidence.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {rewrites.map((rewrite) => (
              <article key={rewrite.weak} className="rounded-xl border border-line bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Before</p>
                <p className="mt-3 text-sm leading-7 text-muted">{rewrite.weak}</p>
                <div className="my-5 h-px bg-line" />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy">After</p>
                <p className="mt-3 text-sm font-bold leading-7 text-navy">{rewrite.strong}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Your situation</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Change the order, not the truth.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A strong CV does not hide a career change, gap or lack of paid
              experience. It changes the section order and selects the most
              relevant honest evidence.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {situationLinks.map(([title, body, href]) => (
                <Link key={href} href={href} className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy">
                  <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-navy transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <Bot className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">Use AI as an editor, not a witness.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              AI can organise notes, compare your draft with an advert and
              tighten wording. It cannot know what you genuinely did. Review
              employer instructions, remove invented detail and make sure you
              can explain every sentence at interview.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Final review</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Run this check before every application.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Tailoring does not mean rewriting every sentence. It means making
              the employer's important criteria easy to find and support.
            </p>
          </div>
          <div className="grid gap-3">
            {finalChecks.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-line bg-white p-4 text-sm font-bold leading-6 text-navy">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Role examples</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
              See how the same method changes by job.
            </h2>
            <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-bold text-navy">
              View all templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {roleLinks.map(([label, href]) => (
              <Link key={href} href={href} className="group rounded-xl border border-line bg-white p-5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:border-navy">
                {label}<ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Built from current UK careers guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 18 June 2026. Where guidance differs, this page uses
              the safer practical rule: tailor to the criteria, keep the content
              clear and relevant, and follow the employer's application instructions.
            </p>
          </div>
          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a key={href} href={href} rel="noreferrer" target="_blank" className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">Open source <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Turn the guide into your own finished CV."
        body={`Open the complete example, replace it with your real evidence, then pay ${site.price} only when the final PDF is ready.`}
        primaryHref={editorHref}
        primary="Edit the complete CV example"
        secondaryHref="/cv-personal-statement-uk"
        secondary="Write the profile"
      />
    </>
  );
}
