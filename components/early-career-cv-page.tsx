import Link from "next/link";
import { ArrowRight, Check, FileText, GraduationCap, SearchCheck } from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import {
  getRoleCvTemplate,
  type RoleTemplateId,
} from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export type EarlyCareerPageConfig = {
  slug: string;
  roleTemplate: Extract<RoleTemplateId, "student" | "school-leaver">;
  kicker: string;
  heading: string;
  intro: string;
  exampleTitle: string;
  scanTitle: string;
  scanIntro: string;
  recruiterChecks: Array<[string, string]>;
  structure: Array<[string, string]>;
  bulletExamples: Array<{ title: string; bullets: string[] }>;
  mistakes: string[];
  sourceNotes: Array<[string, string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  relatedLinks: Array<[string, string]>;
  finalHeading: string;
  finalBody: string;
  primaryLabel: string;
};

export function EarlyCareerCvPage({ config }: { config: EarlyCareerPageConfig }) {
  const editorHref = `/editor?template=classic&roleTemplate=${config.roleTemplate}&new=1`;
  const cv = getRoleCvTemplate(config.roleTemplate);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const productSchema = buildWorkCvProductSchema({
    description: config.intro,
    url: `${site.url}${config.slug}`,
  });

  return (
    <>
      {[faqSchema, productSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              {config.kicker}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              {config.heading}
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">{config.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>{config.primaryLabel}</ButtonLink>
              <ButtonLink href="#example" variant="secondary">
                See the example
              </ButtonLink>
            </div>
          </div>

          <div
            id="example"
            className="min-w-0 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-soft"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  Editable draft
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                  {config.exampleTitle}
                </h2>
              </div>
              <Link
                href={editorHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
              >
                Edit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div
                className="gallery-preview-document pointer-events-none mx-auto"
                style={{ width: 794 }}
              >
                <CvDocument cv={cv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Recruiter scan</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            {config.scanTitle}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{config.scanIntro}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {config.recruiterChecks.map(([title, body]) => (
              <article key={title} className="rounded-xl border border-line bg-white p-6">
                <SearchCheck className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Put the strongest available evidence first.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Early-career CVs do not need filler. Change the order to match the
              vacancy, keep dates clear and make every section earn its space.
            </p>
          </div>
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {config.structure.map(([title, body]) => (
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
          <SectionLabel>Evidence examples</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Turn real responsibilities into useful CV bullets.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {config.bulletExamples.map((example) => (
              <article key={example.title} className="rounded-xl border border-line bg-white p-6">
                <GraduationCap className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {example.title}
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
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Current UK early-career guidance, linked directly.
            </h2>
            <div className="mt-8 grid gap-4">
              {config.sourceNotes.map(([title, body, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-line bg-white p-5 transition hover:border-navy"
                >
                  <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                </a>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <FileText className="h-7 w-7 text-gold" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
              What to avoid
            </h3>
            <ul className="mt-5 space-y-4">
              {config.mistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-sm leading-6 text-ink">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {mistake}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Related guidance</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.relatedLinks.map(([label, href]) => (
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

      <FaqSection faqs={config.faqs} title={`${config.kicker} questions.`} />
      <FinalCta
        heading={config.finalHeading}
        body={config.finalBody}
        primaryHref={editorHref}
        primary={config.primaryLabel}
        secondaryHref="/how-to-write-a-cv-uk"
        secondary="Read the CV writing guide"
      />
    </>
  );
}
