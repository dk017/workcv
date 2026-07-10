import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, ListChecks, ShieldCheck, Sparkles } from "lucide-react";

import { CvBulletPointGenerator } from "@/components/cv-bullet-point-generator";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cv-bullet-point-generator";

export const metadata: Metadata = {
  title: "Free CV Bullet Point Generator UK - No Signup",
  description:
    "Generate five concise UK CV bullet points from your real responsibilities and achievements. Tailor them to a job advert, free with no signup.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free UK CV Bullet Point Generator",
    description:
      "Turn rough experience notes into five concise, evidence-led and editable UK CV bullet points.",
    url: path,
  },
};

const faqs = [
  {
    question: "Is this CV bullet point generator free?",
    answer:
      "Yes. You can generate a limited number of five-bullet drafts without creating an account, entering payment details or starting a subscription.",
  },
  {
    question: "What makes a strong CV bullet point?",
    answer:
      "A strong bullet starts with a specific action, gives enough context to understand the work and shows an outcome where you have evidence. It should be concise, relevant and easy to verify at interview.",
  },
  {
    question: "How many bullet points should I use for each job?",
    answer:
      "There is no universal number. Use enough to show your most relevant responsibilities and achievements without repeating yourself. Recent, relevant roles normally deserve more detail than older positions.",
  },
  {
    question: "Does the generator invent achievements or numbers?",
    answer:
      "It is instructed to use only the information you supply, and WorkCV rejects numeric claims that do not appear in your notes or job advert. AI can still make mistakes, so check every bullet before using it.",
  },
  {
    question: "Can I tailor the bullet points to a job description?",
    answer:
      "Yes. Add the target role and job description. The generator will prioritise matching evidence you actually supplied, but it will not treat an advertised requirement as experience you possess.",
  },
  {
    question: "What happens to the information I enter?",
    answer:
      "WorkCV sends the form fields to the OpenAI API to create the draft and does not save them. Do not include confidential employer, customer or personal information.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WorkCV UK CV Bullet Point Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `${site.url}${path}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    featureList: [
      "Five editable CV bullet points",
      "Optional job-description tailoring",
      "Numeric claim checks",
      "No account required",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];

export default function CvBulletPointGeneratorPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free UK CV writing tool</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Free CV bullet point generator.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Describe a job, project or placement in rough notes. Get five concise, editable bullet points built from your real actions and outcomes, with optional tailoring to a vacancy.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-gold" />Five editable drafts</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-success" />Evidence checked</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />No signup</span>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <CvBulletPointGenerator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>What this does differently</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Your evidence comes before the wording.</h2>
            <p className="mt-6 text-base leading-8 text-muted">A job title alone can only produce generic duties. WorkCV asks what you actually did, checks generated numbers against your source notes and gives you questions for evidence that is still missing.</p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              ["Start with action", "Each draft opens with a distinct action verb instead of “responsible for” or another weak introduction."],
              ["Add useful context", "The bullet explains the task, scale, method or audience using only details you supplied."],
              ["Show an honest result", "Measured outcomes are used when available. The generator does not manufacture percentages or performance claims."],
            ].map(([title, body], index) => (
              <article key={title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">{index + 1}</span>
                <div><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>UK CV guidance</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Concise enough to scan. Specific enough to discuss.</h2>
            <p className="mt-6 text-base leading-8 text-muted">The National Careers Service recommends clear bullet points, tailoring a CV to the vacancy and using STAR to show the action taken and result. Prospects similarly advises concise, achievement-based bullets and responsible use of AI.</p>
            <p className="mt-4 text-sm font-bold text-navy">Research reviewed 10 July 2026.</p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: how to write a CV</a>
            <a href="https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: the STAR method</a>
            <a href="https://www.prospects.ac.uk/ai-cvs-and-applications-your-questions-answered/" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">Prospects: AI, CVs and applications</a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold text-navy">Continue improving your application.</h2>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-navy">
            <Link href="/tools/ats-score-checker" className="rounded-md border border-line-strong bg-white px-4 py-3 hover:border-navy">Check vacancy relevance</Link>
            <Link href="/tools/cover-letter-generator-uk" className="rounded-md border border-line-strong bg-white px-4 py-3 hover:border-navy">Generate a cover letter</Link>
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-white px-4 py-3 hover:border-navy">See all free tools <Sparkles className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="CV bullet point questions." />
    </>
  );
}
