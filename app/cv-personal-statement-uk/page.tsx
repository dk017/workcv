import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Lightbulb,
  PencilLine,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { SampleCvProof } from "@/components/sample-cv-proof";
import { site } from "@/lib/site";
import { analyticsPlacements } from "@/lib/analytics-placements";

const pagePath = "/cv-personal-statement-uk";
const reviewDate = "25 August 2026";
const reviewDateIso = "2026-08-25";
const publishedDateIso = "2026-06-13";
const advertUrl = "https://www.jobs.nhs.uk/candidate/jobadvert/C9301-26-0052";

export const metadata: Metadata = {
  title: "CV Personal Statement UK: 12 Examples + Job-Advert Walkthrough",
  description:
    "Write a stronger UK CV personal statement with 12 evidence-led examples, a real NHS job-advert walkthrough, and a one-time-price CV builder.",
  alternates: { canonical: pagePath },
  openGraph: {
    title: "CV Personal Statement UK: 12 Examples + Job-Advert Walkthrough",
    description:
      "See how to turn a real UK job advert and your evidence into a focused CV personal statement.",
    url: pagePath,
  },
};

const faqItems = [
  {
    question: "What is a CV personal statement in the UK?",
    answer:
      "A CV personal statement, also called a CV profile or introduction, is a short opening section near the top of your CV. It summarises the role you want, relevant evidence and the value you can bring so the recruiter knows what to look for in the rest of the CV.",
  },
  {
    question: "How long should a UK CV personal statement be?",
    answer:
      "Keep it short. Three to five lines or a compact paragraph is usually enough for a UK CV. It should be easy to scan and should not repeat your whole work history.",
  },
  {
    question: "Should I write my CV personal statement in first person?",
    answer:
      "Either first person without repeated 'I' or neutral third-person wording can work. The important point is clarity: avoid vague claims and match the statement to the job advert using evidence you can support.",
  },
  {
    question: "Should a CV personal statement include numbers?",
    answer:
      "Use a number when it is genuine, relevant and explainable, such as team size, project scale, customer volume or a measurable process change. Do not add a percentage or target simply to make a statement sound stronger.",
  },
  {
    question: "Is a CV profile the same as a Civil Service personal statement?",
    answer:
      "No. A CV profile is a short introduction. A Civil Service application personal statement is usually a longer response written against the vacancy's Success Profiles criteria, word limit and instructions.",
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

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CV Personal Statement UK: 12 Examples + Job-Advert Walkthrough",
  description: metadata.description,
  datePublished: publishedDateIso,
  dateModified: reviewDateIso,
  author: {
    "@type": "Organization",
    name: "WorkCV Editorial Team",
    url: site.url,
  },
  reviewedBy: {
    "@type": "Organization",
    name: "WorkCV Editorial Team",
    url: site.url,
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
  },
  mainEntityOfPage: `${site.url}${pagePath}`,
};

const formulaSteps = [
  {
    title: "Target",
    body:
      "Name the role, level or setting you want. A statement that could fit every job rarely helps a recruiter decide where you fit.",
    icon: Target,
  },
  {
    title: "Evidence",
    body:
      "Add one or two proof points: experience, scale, systems, qualifications, responsibilities, projects or genuine outcomes.",
    icon: ClipboardList,
  },
  {
    title: "Fit",
    body:
      "Close with the value that evidence supports in the target role: accuracy, care, service, leadership, reliability, delivery or technical judgement.",
    icon: Search,
  },
  {
    title: "Truth test",
    body:
      "Every concrete claim should be supported elsewhere in the CV and be something you can explain at interview.",
    icon: ShieldCheck,
  },
];

const jobAdvertCriteria = [
  "Office or customer-service experience",
  "Microsoft Office proficiency",
  "Prioritising conflicting demands and deadlines",
  "Confidentiality",
  "Teamwork",
  "Accurate documents or reports",
];

const candidateFacts = [
  "Three years as an administrator in a community charity",
  "Managed a shared inbox and appointment diary",
  "Handled confidential client records",
  "Used Word, Excel and Outlook",
  "Created a weekly spreadsheet combining overdue actions for a five-person team",
  "Handled telephone enquiries and competing deadlines",
  "No NHS or RiO experience",
];

const evidenceMappings = [
  ["Office experience", "Three years as a charity administrator"],
  ["Microsoft Office", "Used Word, Excel and Outlook"],
  ["Confidentiality", "Handled confidential client records"],
  ["Prioritisation", "Managed inbox, diary, telephone enquiries and deadlines"],
  ["Accurate reports and teamwork", "Built an overdue-actions tracker for a five-person team"],
];

const walkthroughStatement =
  "Administrative professional with three years' experience managing a shared inbox, appointment diary and confidential client records for a community charity. Proficient in Word, Excel and Outlook, including creating a weekly overdue-actions tracker for a five-person team. Used to balancing telephone enquiries with competing deadlines and now seeking an NHS administrative assistant role where accuracy, confidentiality and dependable teamwork are essential.";

const walkthroughAnnotations = [
  "Administrative professional establishes relevant experience without falsely claiming NHS experience.",
  "The inbox, diary, records and Microsoft tools match observable criteria from the advert.",
  "The five-person tracker adds credible scale and teamwork evidence.",
  "The closing line reflects the advert without keyword stuffing.",
  "RiO and NHS experience were not added because the fictional candidate does not have them.",
];

type Example = {
  title: string;
  context: string;
  statement: string;
  annotations: string[];
  relatedHref?: string;
};

const examples: Example[] = [
  {
    title: "NHS administrative assistant",
    context: "Healthcare administration",
    statement:
      "Administrative assistant with three years' experience managing appointments, confidential records and high-volume telephone enquiries in a community service. Proficient in Microsoft 365 and accurate data entry, with a track record of prioritising competing requests and supporting colleagues to meet daily deadlines. Now seeking an NHS administration role where calm communication and careful handling of patient information are essential.",
    annotations: [
      "Names the setting.",
      "Proves relevant systems and responsibilities.",
      "Connects evidence to confidentiality and patient contact.",
    ],
  },
  {
    title: "Care worker",
    context: "Residential care",
    statement:
      "Care worker with two years' experience supporting up to eight residents per shift with personal care, mobility, meals and accurate daily notes. Trained in safeguarding and moving and handling, with a consistent focus on dignity, choice and prompt escalation of wellbeing concerns. Seeking a residential care role where dependable teamwork and person-centred support matter.",
    annotations: [
      "Gives honest scale.",
      "Names trained responsibilities.",
      "Does not imply clinical or medication authority.",
    ],
    relatedHref: "/cv-template-care-worker-uk",
  },
  {
    title: "Graduate data analyst",
    context: "Early-career analytics",
    statement:
      "Mathematics graduate with practical experience cleaning, analysing and presenting datasets through university and volunteer projects using Excel, SQL and Power BI. Built a dashboard from 12,000 anonymised records that reduced a charity team's monthly reporting process from several spreadsheets to one repeatable view. Seeking a junior data analyst role focused on clear reporting and evidence-led decisions.",
    annotations: [
      "Specifies tools.",
      "Gives project scale and a process outcome.",
      "Clearly states target level.",
    ],
    relatedHref: "/cv-template-graduate-uk",
  },
  {
    title: "Retail supervisor",
    context: "Store leadership",
    statement:
      "Retail supervisor with four years' experience leading shifts of up to ten colleagues in a high-footfall store. Trusted with rota changes, cashing up, stock investigations and customer escalations, while helping the team maintain service during peak weekend periods. Seeking a store supervisor role that values visible leadership, commercial awareness and reliable follow-through.",
    annotations: [
      "Gives team scale.",
      "Replaces 'leadership skills' with responsibilities.",
      "Avoids an invented sales percentage.",
    ],
  },
  {
    title: "Mechanical engineer",
    context: "Manufacturing engineering",
    statement:
      "Mechanical engineer with five years' experience supporting design changes, root-cause investigations and planned maintenance in a regulated manufacturing environment. Confident using SolidWorks, drawing control and cross-functional problem solving, with recent work reducing repeat equipment stoppages through an updated inspection routine. Seeking a maintenance or design role where safety, reliability and practical engineering judgement are central.",
    annotations: [
      "Names discipline, tools and setting.",
      "Describes an outcome without inventing a percentage.",
      "Identifies role fit.",
    ],
    relatedHref: "/cv-template-engineer-uk",
  },
  {
    title: "Career changer: retail to administration",
    context: "Transferable experience",
    statement:
      "Organised retail supervisor moving into office administration after five years coordinating rotas, reconciling daily records and resolving high-volume customer queries. Uses Excel trackers, written handovers and calm prioritisation to keep work accurate during busy shifts. Ready to transfer those skills into an administrative assistant role with clear deadlines and customer contact.",
    annotations: [
      "Names the change directly.",
      "Translates rather than hides retail evidence.",
      "States the target role.",
    ],
    relatedHref: "/career-change-cv-uk",
  },
  {
    title: "Customer service adviser",
    context: "Contact-centre and online support",
    statement:
      "Customer service adviser with three years' experience handling phone, email and live-chat enquiries for an online retailer. Regularly resolves delivery, refund and account issues at first contact while keeping notes accurate for follow-up teams. Seeking a customer support role where clear explanations, ownership and calm complaint handling are valued.",
    annotations: [
      "Names channels and query types.",
      "Shows how work is completed.",
      "Uses no unverifiable superlative.",
    ],
    relatedHref: "/cv-template-customer-service-uk",
  },
  {
    title: "Warehouse operative",
    context: "Warehouse and logistics",
    statement:
      "Warehouse operative with experience in handheld scanning, picking, packing, stock checks and safe manual handling across rotating shifts. Accustomed to working to daily targets while checking item codes and reporting discrepancies before dispatch. Seeking a permanent warehouse role that values reliable attendance, accuracy and safe teamwork.",
    annotations: [
      "Names relevant tasks and tools.",
      "Connects accuracy to dispatch.",
      "States an availability goal without claiming a perfect record.",
    ],
    relatedHref: "/cv-template-warehouse-uk",
  },
  {
    title: "Returning to work",
    context: "Planned career break",
    statement:
      "Customer service professional returning to paid work after a planned career break, bringing earlier experience in appointment booking, complaint handling and accurate record updates. Recently refreshed Microsoft 365 skills through structured online training and is now seeking a part-time customer support role. Offers calm communication, current digital confidence and reliable organisation.",
    annotations: [
      "Addresses the break briefly.",
      "Includes a current action.",
      "Avoids apology or unnecessary personal detail.",
    ],
    relatedHref: "/return-to-work-cv-uk",
  },
  {
    title: "School leaver / no experience",
    context: "First CV",
    statement:
      "Reliable school leaver seeking an entry-level retail role, with customer-facing experience from weekly charity-shop volunteering and strong attendance throughout the final school year. Comfortable organising donated stock, greeting customers and working with volunteers of different ages. Ready to learn store processes and contribute to a supportive team.",
    annotations: [
      "Uses volunteering as evidence.",
      "Names real tasks.",
      "Does not pretend the candidate has paid experience.",
    ],
    relatedHref: "/cv-no-experience-uk",
  },
  {
    title: "Redundancy / experienced professional",
    context: "Recent site closure",
    statement:
      "Operations coordinator with seven years' experience scheduling field teams, maintaining service records and producing weekly performance reports for senior managers. Recently made redundant following a site closure and now seeking a similar coordination role. Brings strong Excel reporting, stakeholder communication and a practical record of keeping work moving through changing priorities.",
    annotations: [
      "Explains redundancy neutrally.",
      "Leads with transferable value.",
      "Avoids implying redundancy was performance-related.",
    ],
    relatedHref: "/situations/made-redundant",
  },
  {
    title: "Project or operations manager",
    context: "Delivery and change",
    statement:
      "Project manager with eight years' experience coordinating cross-functional technology and operations work from scope through delivery. Led a six-person implementation team that brought a new case-management process into service across four locations, with clear risk logs, training and stakeholder reporting. Seeking a delivery role where structured planning and practical change management improve day-to-day operations.",
    annotations: [
      "Gives team and rollout scale.",
      "Names delivery mechanisms.",
      "Links the example to operational value.",
    ],
  },
];

const beforeAfter = [
  [
    "Too vague",
    "I am a hard-working person looking for a new challenge.",
    "Customer-focused retail assistant with two years of till, stock and complaint-handling experience, now seeking a full-time customer service role.",
  ],
  [
    "Too long",
    "I have worked in many different jobs over the years and have developed lots of useful skills that I believe would make me suitable for a wide range of roles.",
    "Adaptable team member with experience across hospitality and retail, bringing strong customer service, cash handling and shift coordination skills.",
  ],
  [
    "Too self-focused",
    "I want a role where I can learn, grow and develop my confidence.",
    "Entry-level office assistant with strong written communication, Excel basics and volunteering experience, ready to support accurate records and daily admin tasks.",
  ],
];

const checklist = [
  "Mentions the role or sector you are applying for",
  "Uses evidence instead of soft claims",
  "Includes keywords from the job advert naturally",
  "Fits in three to five lines on the page",
  "Does not repeat every job in your work history",
  "Sounds like a real person, not generic AI copy",
  "Every number and outcome can be explained and supported",
  "The strongest evidence also appears elsewhere in the CV",
  "No protected or unnecessary personal information is included",
];

const relatedLinks = [
  ["Career change CV UK", "/career-change-cv-uk"],
  ["Return to work CV UK", "/return-to-work-cv-uk"],
  ["CV employment gap UK", "/cv-employment-gap-uk"],
  ["CV with no experience UK", "/cv-no-experience-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function CvPersonalStatementUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <section className="quiet-grid bg-paper py-20 md:py-28">
          <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                CV personal statement UK
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                Write the first paragraph recruiters actually need.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
                A UK CV personal statement should not be a life story. It should
                quickly show the role you want, the evidence you bring and why
                the rest of the CV is worth reading. This guide includes 12
                examples and a real advert-to-statement walkthrough.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/editor" trackingLabel={analyticsPlacements.personalStatementHeroEditor}>Build my CV statement</ButtonLink>
                <ButtonLink href="#advert-walkthrough" variant="secondary" trackingLabel={analyticsPlacements.personalStatementWalkthrough}>
                  See the walkthrough
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
              <Sparkles className="h-7 w-7 text-gold" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                The simple rule
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
                Specific beats impressive.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted">
                Recruiters do not need adjectives like passionate, dynamic or
                motivated unless the CV proves them. Use job-relevant facts,
                tools, settings, scale and genuine outcomes instead.
              </p>
              <p className="mt-4 text-sm font-bold leading-6 text-navy">
                12 examples · 1 real advert walkthrough · no invented claims
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface py-24">
          <div className="container-page">
            <SectionLabel>Formula</SectionLabel>
            <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
              Use a four-part statement: target, evidence, fit, truth test.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              National Careers Service guidance says a CV should include a short
              introduction. Prospects describes a CV personal profile as a
              concise statement near the top that highlights relevant attributes,
              achievements, skills and career aims. Keep it brief and tailor it
              to the opportunity.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {formulaSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-xl border border-line bg-white p-6">
                    <Icon className="h-7 w-7 text-gold" />
                    <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="advert-walkthrough" className="scroll-mt-24 bg-paper py-24">
          <div className="container-page">
            <SectionLabel>Advert walkthrough</SectionLabel>
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                  See the exact changes from advert to statement.
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted">
                  This is a real, dated NHS Jobs advert used as a teaching
                  example. The candidate is fictional so the method is clear and
                  no applicant&apos;s personal information is reused.
                </p>
                <a
                  href={advertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                >
                  Open NHS Jobs advert C9301-26-0052
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-3 text-xs leading-6 text-muted">
                  Advert shown as published 13 January 2026. Check the source
                  before applying; this page uses the advert as an archived
                  teaching example.
                </p>
              </div>

              <div className="grid gap-5">
                <div className="rounded-xl border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                      1
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      Read the advert
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    The person specification asks for evidence across these six
                    areas:
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {jobAdvertCriteria.map((criterion) => (
                      <li key={criterion} className="flex gap-2 text-sm font-bold text-navy">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                      2
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      Inventory the candidate&apos;s facts
                    </h3>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold-tint px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-navy">
                    <ShieldCheck className="h-4 w-4" /> Fictional candidate
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {candidateFacts.map((fact) => (
                      <li key={fact} className="flex gap-2 text-sm leading-6 text-ink">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                      3
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      Map evidence to criteria
                    </h3>
                  </div>
                  <div className="mt-5 divide-y divide-line rounded-lg border border-line">
                    {evidenceMappings.map(([criterion, evidence]) => (
                      <div key={criterion} className="grid gap-2 p-4 sm:grid-cols-[0.85fr_1.15fr]">
                        <p className="text-sm font-bold text-navy">{criterion}</p>
                        <p className="text-sm leading-6 text-muted">{evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-sm font-bold text-navy">
                      4
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      Write and audit the result
                    </h3>
                  </div>
                  <p className="mt-5 text-base leading-8 text-ink">{walkthroughStatement}</p>
                  <div className="mt-6 grid gap-3">
                    {walkthroughAnnotations.map((annotation) => (
                      <div key={annotation} className="flex gap-3 rounded-md bg-greensoft p-3 text-sm leading-6 text-navy">
                        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        {annotation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3 rounded-xl border border-gold bg-gold-tint p-5 text-sm leading-7 text-navy">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
              <p>
                Never fill a gap by inventing a system, qualification or result.
                If a criterion is desirable rather than essential, show adjacent
                experience and willingness to learn.
              </p>
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-24 bg-surface py-24">
          <div className="container-page">
            <SectionLabel>12 examples</SectionLabel>
            <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
              UK CV personal statement examples with evidence built in.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Do not copy these word-for-word. Use them to see the level of
              specificity and length that works, then rewrite them around the
              job advert and your real evidence.
            </p>
            <p className="mt-5 flex items-start gap-3 rounded-lg border border-line bg-white p-4 text-sm leading-7 text-muted">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              These are fictional examples for structure and editing practice.
              Replace every fact, number, tool and outcome with evidence you can
              support.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {examples.map((example) => (
                <article key={example.title} className="flex flex-col rounded-xl border border-line bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <FileText className="h-7 w-7 shrink-0 text-gold" />
                    <span className="rounded-full bg-gold-tint px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-navy">
                      {example.context}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {example.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ink">{example.statement}</p>
                  <div className="mt-5 border-t border-line pt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-navy">
                      Why it works
                    </p>
                    <ul className="mt-3 grid gap-2">
                      {example.annotations.map((annotation) => (
                        <li key={annotation} className="flex gap-2 text-xs leading-5 text-muted">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {annotation}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {example.relatedHref && (
                    <Link
                      href={example.relatedHref}
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy"
                    >
                      See the matching CV guide
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-24">
          <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionLabel>Before and after</SectionLabel>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Replace vague claims with proof.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Most weak CV statements are not badly written. They are too
                broad. The fix is to add a target role and concrete evidence.
              </p>
            </div>

            <div className="divide-y divide-line rounded-xl border border-line bg-white">
              {beforeAfter.map(([label, weak, strong]) => (
                <div key={label} className="grid gap-4 p-5">
                  <h3 className="font-display text-xl font-semibold text-navy">{label}</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-line bg-paper p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Weak version</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{weak}</p>
                    </div>
                    <div className="rounded-lg border border-greensoft bg-greensoft p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-navy">Evidence-led version</p>
                      <p className="mt-2 text-sm font-bold leading-7 text-navy">{strong}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-24">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <SectionLabel>Checklist</SectionLabel>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Check your personal statement before downloading.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                The statement should earn its space at the top of the CV. If it
                does not add focus, shorten it or replace it with a stronger
                skills summary.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-xl border border-line bg-white p-6">
              <PencilLine className="h-7 w-7 text-gold" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
                AI writing note
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                AI can help you edit and tighten the wording, but the statement
                still needs your real experience. Generic AI copy is easy to spot
                because it sounds polished while saying very little.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="rounded-xl border border-gold bg-gold-tint p-6">
              <SectionLabel>Applying to the Civil Service?</SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-navy">
                A CV profile is not the same as an application statement.
              </h2>
              <p className="mt-5 text-sm leading-7 text-navy">
                Civil Service recruitment may ask for a longer statement against
                Success Profiles behaviours, strengths, experience, ability or
                technical criteria. Follow the word limit and instructions in
                that vacancy. Use this page only for the short profile at the top
                of a CV.
              </p>
              <a
                href="https://www.gov.uk/government/publications/success-profiles/success-profiles"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              >
                Read GOV.UK Success Profiles guidance
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <Lightbulb className="h-7 w-7 text-gold" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
                One useful editing question
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                If a recruiter asked, “How do you know?”, could you point to a
                real project, responsibility, qualification, system or outcome in
                the rest of your CV? If not, make the claim smaller or remove it.
              </p>
            </div>
          </div>
        </section>

        <SampleCvProof variant="compact" trackingContext={analyticsPlacements.personalStatementSample} />

        <section className="bg-surface py-24">
          <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionLabel>Research checked</SectionLabel>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Based on current UK CV and application guidance.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Sources and the example advert were checked on {reviewDate}.
                Examples on this page are fictional, and the guidance does not
                guarantee an interview or application outcome.
              </p>
              <p className="mt-5 text-sm font-bold text-navy">
                Written and reviewed by the WorkCV Editorial Team · {reviewDate}
              </p>
            </div>

            <div className="grid gap-4">
              <ResearchLink
                title="National Careers Service CV sections"
                body="CV introductions, tailoring to the job advert, clear writing and the sections a UK CV should include."
                href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              />
              <ResearchLink
                title="Prospects CV personal statement guidance"
                body="The purpose, length and tailoring of a CV personal profile."
                href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/writing-a-personal-statement-for-your-cv/"
              />
              <ResearchLink
                title="NHS Jobs advert C9301-26-0052"
                body="Dated administrative-assistant criteria used for the walkthrough; check the original advert before applying."
                href={advertUrl}
              />
              <ResearchLink
                title="GOV.UK Success Profiles"
                body="Official distinction between Civil Service application criteria and a short CV profile."
                href="https://www.gov.uk/government/publications/success-profiles/success-profiles"
              />
            </div>
          </div>
        </section>

        <section className="bg-paper py-20">
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

        <FaqSection faqs={faqItems} title="CV personal statement questions." />
        <FinalCta
          heading="Write the opening, then build the full CV around it."
          body={`Start with a guided UK CV structure and pay ${site.price} only when the final PDF is ready.`}
          secondaryHref="/pricing"
          secondary="See pricing"
          trackingContext={analyticsPlacements.personalStatementFinal}
        />
      </article>
    </>
  );
}

function ResearchLink({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy"
    >
      <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
        Open source
        <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </a>
  );
}
