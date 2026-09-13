import type { Metadata } from "next";

import { AdviceCard, BulletList, CopyTemplate, EditorialGuideShell, GuideSection } from "@/components/editorial-guide-shell";

const path = "/thank-you-email-after-interview-uk";
export const metadata: Metadata = { title: "Thank-You Email After Interview UK: 5 Examples", description: "Copy and adapt five UK interview thank-you and follow-up email examples, with subject lines, timing and wording for panels, second interviews and missing updates.", alternates: { canonical: path }, openGraph: { title: "Thank-You Email After an Interview: UK Examples", description: "Five concise templates for the situations job seekers actually face.", url: path } };

const faqs = [
  { question: "Should I send a thank-you email after an interview in the UK?", answer: "It is optional, but a short and specific message can acknowledge the interviewer’s time, confirm interest and provide something they requested. Follow the employer’s instructions and do not treat it as a guaranteed advantage." },
  { question: "When should I send it?", answer: "For a thank-you, the same day or within 24 hours is a practical window. A status-check email is different: respect the decision date given at interview and wait until that date has passed." },
  { question: "Who should I email after a panel interview?", answer: "Email the named contact or organiser if you do not have every panel member’s details. Ask them to pass on your thanks. If you email each person, make each message genuinely relevant and avoid flooding the team with identical notes." },
  { question: "Can a follow-up fix a bad interview answer?", answer: "It can correct a material factual error or send a requested document, but it should not become a second interview by email. Make a concise correction and leave the decision process with the employer." },
];

const TemplateText = ({ children }: { children: React.ReactNode }) => <CopyTemplate title="Copy, replace the brackets, then read it aloud">{children}</CopyTemplate>;

export default function ThankYouEmailPage() {
  return <EditorialGuideShell path={path} eyebrow="Post-interview email guide" title="Thank-you email after an interview: five examples for real situations." intro="You should not have to assemble a message from abstract tips. Choose the situation below, replace every bracket, remove anything you cannot support and keep the final email short." answer="Send a thank-you on the same day or within 24 hours when it feels appropriate. Use the exact role title, one real point from the conversation and a calm confirmation of interest. Do not chase a decision in the thank-you; wait until the employer’s stated timeline passes." reviewed="13 September 2026" faqs={faqs} ctaHeading="Keep the follow-up consistent with the application they reviewed." ctaBody="Build and preview the UK CV behind your next application. Pay once only if you choose to download the final PDF—there is no monthly subscription or automatic renewal." trackingContext="thank_you_editorial" relatedLinks={[["Interview preparation checklist", "/how-to-prepare-for-a-job-interview-uk"], ["21 common interview questions", "/common-job-interview-questions-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["No-subscription CV builder", "/cv-builder-no-subscription-uk"]]}>
    <GuideSection label="Before you send" title="The five-part email that is difficult to get wrong."><div className="grid gap-5 md:grid-cols-5"><AdviceCard title="1. Subject"><p>Name the role and purpose.</p></AdviceCard><AdviceCard title="2. Greeting"><p>Use the interviewer’s preferred name and spelling.</p></AdviceCard><AdviceCard title="3. Thanks"><p>Acknowledge their time without excessive praise.</p></AdviceCard><AdviceCard title="4. Specificity"><p>Mention one genuine discussion point and why it matters.</p></AdviceCard><AdviceCard title="5. Close"><p>Confirm interest, offer requested information and stop.</p></AdviceCard></div>
      <div className="mt-8 rounded-lg border border-line bg-white p-6"><h3 className="font-display text-2xl font-semibold text-navy">Subject lines you can use</h3><div className="mt-4"><BulletList items={["Thank you — [exact role title] interview", "Thank you for discussing the [role title] role", "[Role title] interview — thank you", "Thank you to the [team name] interview panel", "Requested information — [role title] interview"]} /></div></div>
    </GuideSection>

    <GuideSection label="Example 1" title="A short thank-you after a first interview." tone="paper"><TemplateText>{`Subject: Thank you — [exact role title] interview

Dear [name],

Thank you for speaking with me today about the [exact role title] position at [employer]. I appreciated learning more about [specific responsibility, project or challenge discussed].

The conversation strengthened my interest in the role, particularly the opportunity to [relevant contribution]. Please let me know if you need any further information from me.

Kind regards,
[Your full name]
[Telephone number, if useful]`}</TemplateText></GuideSection>

    <GuideSection label="Example 2" title="After a panel interview."><TemplateText>{`Subject: Thank you to the [role title] interview panel

Dear [named contact],

Thank you to you, [other names if known], and the panel for the conversation about the [role title] position today. The discussion about [specific team priority or challenge] was especially useful and helped me understand how the role contributes to [relevant outcome].

I remain very interested in the opportunity. Please pass on my thanks to the rest of the panel, and let me know if I can provide anything else.

Kind regards,
[Your full name]`}</TemplateText></GuideSection>

    <GuideSection label="Example 3" title="After a second or final interview." tone="paper"><TemplateText>{`Subject: Thank you — [role title] final interview

Dear [name],

Thank you for the opportunity to continue the conversation about the [role title] role. Meeting [person or team] and discussing [specific topic] gave me a clearer picture of [the immediate priority / how the team works].

I am still enthusiastic about the role and believe my experience in [one evidenced area] would help me contribute to [priority discussed]. I appreciate the time everyone has invested in the process.

Kind regards,
[Your full name]`}</TemplateText></GuideSection>

    <GuideSection label="Example 4" title="Sending a requested document or correcting an important fact."><TemplateText>{`Subject: Requested information — [role title] interview

Dear [name],

Thank you again for today’s interview for the [role title] role. As discussed, I have attached [exact document requested].

[If needed: I also want to correct one detail from my answer about [topic]. The accurate [date / title / figure] is [fact]. I apologise for the confusion.]

Please let me know if the attachment does not open or if you need anything further.

Kind regards,
[Your full name]`}</TemplateText><p className="mt-5 text-sm leading-7 text-muted">Delete the correction paragraph if no correction is needed. Do not attach sensitive documents unless the legitimate employer requested them through an appropriate channel.</p></GuideSection>

    <GuideSection label="Example 5" title="Checking in after the promised decision date." tone="paper"><TemplateText>{`Subject: [Role title] interview — update

Dear [name],

I hope you are well. I am checking in about the [role title] role following our interview on [date]. You mentioned that an update was expected by [date or timeframe], so I wanted to ask whether the timetable has changed.

I remain interested in the position and would be grateful for any update you can share. Please let me know if you need further information from me.

Kind regards,
[Your full name]`}</TemplateText><p className="mt-5 text-sm leading-7 text-muted">This is a status check, not the thank-you email. If no timeline was given, waiting roughly five working days is a reasonable starting point; use judgement for urgent or high-volume processes.</p></GuideSection>

    <GuideSection label="Editing checklist" title="Personalise it without turning it into another application."><div className="grid gap-5 md:grid-cols-2"><AdviceCard title="Keep"><BulletList items={["The exact role title and correct employer spelling.", "One detail that was genuinely discussed.", "A simple, evidence-based reason for continued interest.", "Any promised document or necessary factual correction.", "A professional close with no pressure for a reply."]} /></AdviceCard><AdviceCard title="Remove"><BulletList items={["Generic praise that could go to any employer.", "A summary of your entire CV or every interview answer.", "New achievements you cannot explain or did not mention.", "Claims that the interview went brilliantly or that you are the best candidate.", "Repeated requests for updates before the stated date."]} /></AdviceCard></div>
      <p className="mt-8 text-sm leading-7 text-muted">Timing and structure were checked against current <a className="font-bold text-navy underline" href="https://uk.indeed.com/career-advice/interviewing/thank-you-email-after-interview">Indeed UK thank-you email guidance</a> and <a className="font-bold text-navy underline" href="https://uk.indeed.com/career-advice/interviewing/follow-up-email-examples-after-interview">Indeed UK follow-up examples</a>.</p>
    </GuideSection>
  </EditorialGuideShell>;
}
