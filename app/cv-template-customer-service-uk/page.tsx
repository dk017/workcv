import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  Headphones,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Service CV Template UK - Editable Example",
  description:
    "Use an editable customer service CV template for UK jobs. Build a clear adviser, assistant or support CV with complaint, CRM and communication examples.",
  alternates: {
    canonical: "/cv-template-customer-service-uk",
  },
  openGraph: {
    title: "Customer Service CV Template UK - WorkCV",
    description:
      "Start with an editable UK customer service CV example and tailor it to the job advert before downloading.",
    url: "/cv-template-customer-service-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=customer-service&new=1";
const customerServiceCv = getRoleCvTemplate("customer-service");

const faqItems = [
  {
    question: "What should a customer service CV include in the UK?",
    answer:
      "Include contact details, a focused profile, customer-facing skills, recent-first work history, relevant training, education and references guidance. Show enquiry handling, complaint resolution, accurate records, product or service knowledge and communication under pressure.",
  },
  {
    question: "How do I make a customer service CV stand out?",
    answer:
      "Use specific evidence. Mention the channels you handled, the systems you used, the type of enquiries or complaints you resolved and how you helped customers get a clear next step.",
  },
  {
    question: "Should I include numbers on a customer service CV?",
    answer:
      "Use numbers only when they are accurate and useful, such as calls handled, tickets closed, response-time targets or customer feedback. Do not invent metrics you cannot explain in an interview.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const recruiterChecks = [
  {
    title: "Channels handled",
    body:
      "Say whether your experience is face-to-face, telephone, email, live chat, social, helpdesk or a mix of channels.",
    icon: Headphones,
  },
  {
    title: "Problem resolution",
    body:
      "Show how you handled complaints, refunds, delays, escalations, vulnerable customers or difficult conversations.",
    icon: MessageSquareText,
  },
  {
    title: "Record accuracy",
    body:
      "Mention CRM notes, order checks, case updates, data protection and handovers so the recruiter can trust your detail.",
    icon: ShieldCheck,
  },
  {
    title: "Service fit",
    body:
      "Match the advert: retail, contact centre, hospitality, utilities, finance, SaaS support and public services need different proof.",
    icon: SearchCheck,
  },
];

const structure = [
  [
    "Header",
    "Name, town or region, phone, professional email and LinkedIn only if useful. A full postal address is usually unnecessary.",
  ],
  [
    "Profile",
    "Three to five lines covering your customer-service setting, channels handled, strongest evidence and target role.",
  ],
  [
    "Key skills",
    "Use advert language you can evidence: complaint handling, CRM, call handling, refunds, data accuracy, product knowledge, written replies or de-escalation.",
  ],
  [
    "Experience",
    "List the most recent role first. Show enquiry types, channels, systems, responsibilities and examples of resolving customer problems.",
  ],
  [
    "Education and training",
    "Include GCSEs, business/customer-service qualifications, product training, data-protection training, call-centre systems or sector training where relevant.",
  ],
];

const bulletExamples = [
  {
    setting: "Retail customer service",
    bullets: [
      "Handled in-person, telephone and email enquiries about products, deliveries, returns and refunds while keeping case notes clear.",
      "Resolved routine complaints within store policy and escalated complex issues with enough context for managers to act quickly.",
    ],
  },
  {
    setting: "Contact centre",
    bullets: [
      "Managed inbound customer calls, confirmed account details securely and explained next steps in plain language.",
      "Updated CRM records after each conversation so colleagues could continue the case without asking customers to repeat information.",
    ],
  },
  {
    setting: "Online support",
    bullets: [
      "Responded to email and live-chat queries, checked order status and gave customers realistic timelines for resolution.",
      "Tagged recurring issues for the support team, helping identify common delivery, account and billing questions.",
    ],
  },
  {
    setting: "Early-career applicant",
    bullets: [
      "Used part-time retail, hospitality or volunteering experience to show calm communication, reliability and accurate information handling.",
      "Balanced busy shifts with study deadlines, maintaining attendance and supporting colleagues during peak periods.",
    ],
  },
];

const weakStrong = [
  [
    "Profile",
    "Friendly and hard-working person with excellent customer service skills.",
    "Customer service assistant with retail and telephone experience, confident handling order queries, returns, complaints and accurate CRM updates.",
  ],
  [
    "Complaint handling",
    "Dealt with complaints.",
    "Resolved routine complaints within policy, explained options clearly and escalated complex cases with concise notes.",
  ],
  [
    "Systems",
    "Used computers.",
    "Updated customer records in CRM, checked delivery status and recorded agreed actions before closing enquiries.",
  ],
  [
    "Communication",
    "Good communicator.",
    "Explained products, refund rules and next steps calmly across face-to-face, phone and email conversations.",
  ],
];

const mistakes = [
  "Only saying you are friendly without showing the type of customers or enquiries handled.",
  "Listing every duty from the job description without evidence from your own work.",
  "Forgetting systems, CRM, ticketing tools, order platforms or payment processes.",
  "Leaving out complaint handling, escalation, data accuracy or confidentiality.",
  "Using inflated numbers that you cannot explain accurately.",
  "Sending the same CV to contact-centre, retail and admin-heavy support roles without tailoring.",
];

const sourceNotes = [
  [
    "National Careers Service — CV sections",
    "Official guidance says a CV is your first chance to promote yourself, should be clear and easy to read, and should be tailored to the job advert.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Prospects — customer service manager profile",
    "Prospects describes customer service work around meeting customer expectations, resolving issues efficiently, accurate records and improving the customer experience.",
    "https://www.prospects.ac.uk/job-profiles/customer-service-manager",
  ],
  [
    "GOV.UK — recruitment discrimination",
    "Government guidance explains that recruitment decisions must not discriminate, which supports avoiding unnecessary personal details on a general UK CV.",
    "https://www.gov.uk/employer-preventing-discrimination/recruitment",
  ],
];

const relatedLinks = [
  ["Professional CV builder", "/cv-builder-no-subscription-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["Editable UK CV templates", "/templates"],
  ["Professional CV template", "/professional-cv-template-uk"],
  ["Resume template UK", "/resume-template-uk"],
];

export default function CustomerServiceCvTemplateUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Customer service CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a customer service CV around trust, clarity and follow-through.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable UK customer service CV example for adviser,
              assistant, contact-centre and support roles. Replace the sample
              wording with your own customer evidence, then preview every page
              before paying for the PDF.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use customer service CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">
                See example
              </ButtonLink>
            </div>
          </div>

          <div id="example" className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  Editable draft
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                  Customer Service Adviser CV
                </h2>
              </div>
              <Link
                href={editorHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
              >
                Edit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div
                className="gallery-preview-document pointer-events-none mx-auto"
                style={{ width: 794 }}
              >
                <CvDocument cv={customerServiceCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong customer service CV answers four questions fast.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Customer service recruiters are not only looking for friendliness.
            They need proof that you can handle real enquiries, keep records
            accurate and protect the customer relationship when something goes
            wrong.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recruiterChecks.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Put customer evidence near the top, not generic people skills.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The first half page should make the target role obvious and prove
              the kind of service environment you understand.
            </p>
            <div className="mt-8">
              <ButtonLink href={editorHref}>Start with this structure</ButtonLink>
            </div>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {structure.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[170px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Bullet examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Make the service setting clear.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Adapt these examples around the channel, customer problem, system
            and outcome that are accurate for your own work.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {bulletExamples.map((example) => (
              <article key={example.setting} className="rounded-xl border border-line bg-white p-6">
                <ClipboardCheck className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {example.setting}
                </h3>
                <ul className="mt-5 space-y-3">
                  {example.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-7 text-ink">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Before and after</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Replace soft claims with useful service evidence.
          </h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[150px_1fr_1fr] gap-5 bg-navy px-6 py-4 text-sm font-bold text-white md:grid">
              <span>Section</span>
              <span>Too vague</span>
              <span>Stronger direction</span>
            </div>
            {weakStrong.map(([section, weak, strong]) => (
              <div
                key={section}
                className="grid gap-4 border-t border-line px-6 py-5 first:border-t-0 md:grid-cols-[150px_1fr_1fr] md:gap-5"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{section}</h3>
                <p className="text-sm leading-7 text-muted">{weak}</p>
                <p className="text-sm leading-7 text-ink">{strong}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Tailoring checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Tune the same CV differently for each customer role.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A retail adviser, contact-centre agent and technical support
              assistant may all need customer service, but the best evidence is
              different. Mirror the advert’s channels, systems and customer
              problems where you can do so truthfully.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Before you apply, check the advert for:
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Contact channel: phone, email, chat, in person or ticketing",
                  "Systems: CRM, helpdesk, order management, tills or Microsoft 365",
                  "Customer scenarios: refunds, complaints, bookings, billing or delivery issues",
                  "Targets: response times, quality checks, satisfaction scores or sales support",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <FileText className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              What to avoid
            </h2>
            <ul className="mt-5 space-y-4">
              {mistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-sm leading-6 text-ink">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {mistake}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Built from current UK CV and customer-service guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 23 June 2026. This page uses National Careers
              Service CV guidance, Prospects customer-service role guidance and
              GOV.UK recruitment-discrimination guidance.
            </p>
          </div>

          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a
                key={`${title}-${href}`}
                href={href}
                rel="noreferrer"
                target="_blank"
                className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open source
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Related guidance</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {relatedLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-line bg-white p-5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:border-navy"
              >
                {label}
                <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Start with a customer service CV that sounds specific, not generic."
        body={`Use the editable customer service template, tailor it to the advert, then pay ${site.price} only when you download the final PDF.`}
        primaryHref={editorHref}
        primary="Use customer service CV template"
        secondaryHref="/cv-builder-no-subscription-uk"
        secondary="Open the CV builder"
      />
    </>
  );
}
