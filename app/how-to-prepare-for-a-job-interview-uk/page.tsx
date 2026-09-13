import type { Metadata } from "next";

import { AdviceCard, BulletList, EditorialGuideShell, GuideSection } from "@/components/editorial-guide-shell";

const path = "/how-to-prepare-for-a-job-interview-uk";
export const metadata: Metadata = { title: "How to Prepare for a Job Interview UK: Checklist", description: "A practical UK interview preparation plan for the week before, day before and interview day, with an evidence matrix, STAR prompts and questions to ask.", alternates: { canonical: path }, openGraph: { title: "How to Prepare for a Job Interview in the UK", description: "A timed checklist, evidence worksheet and practical interview-day plan.", url: path } };

const faqs = [
  { question: "How long should I spend preparing for an interview?", answer: "There is no fixed number, but cover four jobs: understand the role, research the employer, prepare several relevant examples and confirm the practical arrangements. Start when invited; if time is short, prioritise the essential criteria and two strong examples." },
  { question: "What should I take to a job interview?", answer: "Follow the invitation. Keep your submitted CV, the advert, contact and travel details, a notebook and any requested portfolio or identification available. For video interviews, keep those documents open without covering the call window." },
  { question: "How many STAR examples should I prepare?", answer: "Four to six flexible examples are usually more useful than one script per question. Choose examples that cover teamwork, a difficult problem, priorities, communication, improvement and a setback or lesson." },
  { question: "Can I ask for reasonable adjustments?", answer: "Yes. Contact the named recruiter or employer as early as you can, explain the adjustment that would help you participate and ask what can be arranged. You do not need to wait until interview day." },
];

export default function InterviewPrepPage() {
  return <EditorialGuideShell path={path} eyebrow="Interview preparation UK" title="How to prepare for a job interview: a useful timeline, not vague advice." intro="Preparation should leave you with something concrete: a map of what the employer needs, a bank of evidence you can explain, questions you genuinely want answered and a calm plan for the day." answer="Read the person specification and the CV you submitted side by side. For each major requirement, choose one real example, note your action and result, and identify any gap you need to answer honestly. Then research the employer, practise aloud and confirm the format, journey or video setup." reviewed="13 September 2026" faqs={faqs} ctaHeading="Make your submitted CV and interview evidence tell the same story." ctaBody="Turn the vacancy requirements into a focused UK CV, preview every page and pay once only if you download the final PDF. Keep that exact version beside you while preparing." trackingContext="interview_prep_editorial" relatedLinks={[["Common interview questions", "/common-job-interview-questions-uk"], ["Thank-you email examples", "/thank-you-email-after-interview-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["No-subscription CV builder", "/cv-builder-no-subscription-uk"]]}>
    <GuideSection label="Your preparation timeline" title="What to do at each point before the interview.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <AdviceCard title="When invited"><BulletList items={["Confirm date, time, format and expected duration.", "Ask who you will meet and whether there is a task, test or presentation.", "Request any reasonable adjustment early.", "Save the advert and submitted application."]} /></AdviceCard>
        <AdviceCard title="3–7 days before"><BulletList items={["Map the essential criteria to your evidence.", "Research the employer, team, service and current priorities.", "Prepare four to six flexible examples.", "Draft four questions and practise aloud."]} /></AdviceCard>
        <AdviceCard title="The day before"><BulletList items={["Check the route, access, parking or video link.", "Choose suitable clothes and gather requested documents.", "Test camera, microphone, updates and connection.", "Stop rewriting answers late at night."]} /></AdviceCard>
        <AdviceCard title="60 minutes before"><BulletList items={["Re-read your evidence headings, not full scripts.", "Silence notifications and close unrelated tabs.", "Join or arrive with a sensible margin.", "Slow your breathing and listen for the exact question."]} /></AdviceCard>
      </div>
    </GuideSection>

    <GuideSection label="The evidence matrix" title="Turn the job advert into six answerable rows." tone="paper" intro="This is the highest-value preparation exercise. It prevents generic answers and exposes gaps while there is still time to think.">
      <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-navy text-white"><tr><th className="p-4">What the role needs</th><th className="p-4">My real example</th><th className="p-4">My action</th><th className="p-4">Result / learning</th><th className="p-4">Possible question</th></tr></thead><tbody>
        <tr className="border-t border-line align-top"><td className="p-4">Handling competing priorities</td><td className="p-4">Month-end workload plus urgent client correction</td><td className="p-4">Assessed deadlines, agreed order with stakeholders, documented handover</td><td className="p-4">Both deadlines met; added a pre-check for future work</td><td className="p-4">Tell us about a time priorities changed quickly.</td></tr>
        <tr className="border-t border-line align-top"><td className="p-4 text-muted">[Requirement 2]</td><td className="p-4 text-muted">[Specific situation]</td><td className="p-4 text-muted">[What you personally did]</td><td className="p-4 text-muted">[What changed or you learned]</td><td className="p-4 text-muted">[Question wording]</td></tr>
        <tr className="border-t border-line align-top"><td className="p-4 text-muted">[Requirement 3]</td><td className="p-4 text-muted">[Specific situation]</td><td className="p-4 text-muted">[What you personally did]</td><td className="p-4 text-muted">[What changed or you learned]</td><td className="p-4 text-muted">[Question wording]</td></tr>
      </tbody></table></div>
    </GuideSection>

    <GuideSection label="Research with a purpose" title="Know enough to explain why this role makes sense."><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <AdviceCard title="The organisation"><p>Read the employer’s own About, products or services, locations and recent news. Note what affects the role; do not recite facts with no connection to your motivation.</p></AdviceCard>
      <AdviceCard title="The role and team"><p>Separate daily duties, outcomes, stakeholders and likely problems. Look at similar employee profiles only to understand context, never to copy their claims.</p></AdviceCard>
      <AdviceCard title="Your fit"><p>Finish this sentence with evidence: “This role needs ___; in my work or study I have ___; I now want to use that experience to ___.”</p></AdviceCard>
    </div></GuideSection>

    <GuideSection label="Build an answer bank" title="Prepare six stories that can bend without breaking." tone="paper">
      <div className="grid gap-5 md:grid-cols-2"><AdviceCard title="Useful evidence themes"><BulletList items={["A difficult problem you investigated and resolved.", "A time you organised work under pressure.", "A customer, colleague or stakeholder you communicated with carefully.", "A disagreement, feedback or mistake you handled constructively.", "An improvement you suggested or delivered.", "A result you are proud of and can explain without exaggeration."]} /></AdviceCard><AdviceCard title="STAR without sounding scripted"><p><strong className="text-navy">Situation:</strong> one or two sentences of context.</p><p><strong className="text-navy">Task:</strong> your responsibility or the problem to solve.</p><p><strong className="text-navy">Action:</strong> the decisions and steps you personally took—usually the longest part.</p><p><strong className="text-navy">Result:</strong> what changed, how you know and what you learned. A truthful qualitative result is better than an invented percentage.</p></AdviceCard></div>
    </GuideSection>

    <GuideSection label="Prepare for the format" title="The same evidence, different practical demands."><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AdviceCard title="Video"><p>Test the exact platform, camera angle, audio and lighting. Keep notes to headings only so you maintain eye contact and answer naturally.</p></AdviceCard>
      <AdviceCard title="Telephone"><p>Choose a quiet place, charge the phone and keep the advert nearby. Your voice carries the whole answer, so pause and signpost clearly.</p></AdviceCard>
      <AdviceCard title="Panel"><p>Note each person’s role. Begin with the questioner, then include the panel naturally. Do not assume one person is the only decision-maker.</p></AdviceCard>
      <AdviceCard title="Task or presentation"><p>Confirm the brief, timing, equipment and submission method. Practise to time and prepare for questions about your choices.</p></AdviceCard>
    </div></GuideSection>

    <GuideSection label="Questions to ask" title="Use the closing minutes to judge the job as well." tone="paper" intro="Prepare four or five because some may be answered during the discussion.">
      <BulletList items={["What would a strong first three months look like in this role?", "What are the most important problems the person joining will help solve?", "How will performance and priorities be discussed?", "How does this role work with the wider team or other departments?", "What support, training or handover is planned?", "Is there anything in my experience you would like me to clarify before we finish?", "What are the next steps and expected timescale?"]} />
    </GuideSection>

    <GuideSection label="After the interview" title="Capture useful information while it is still fresh."><div className="grid gap-5 md:grid-cols-3"><AdviceCard title="Write notes"><p>Record questions asked, examples used, names, dates and anything you promised to send. Do not rely on memory several days later.</p></AdviceCard><AdviceCard title="Review fairly"><p>Separate what you would improve from anxious guesswork about the outcome. Add one better example or clearer explanation to your answer bank.</p></AdviceCard><AdviceCard title="Follow the timeline"><p>Send a concise thank-you when appropriate. If the employer gave an update date, wait until it passes before a polite status check.</p></AdviceCard></div>
      <p className="mt-8 text-sm leading-7 text-muted">Sources used to shape this checklist: <a className="font-bold text-navy underline" href="https://nationalcareers.service.gov.uk/careers-advice/interview-advice">National Careers Service interview advice</a> and <a className="font-bold text-navy underline" href="https://www.prospects.ac.uk/careers-advice/interview-tips/how-to-prepare-for-an-interview/">Prospects interview preparation guidance</a>.</p>
    </GuideSection>
  </EditorialGuideShell>;
}
