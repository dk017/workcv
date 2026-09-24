import { site } from "./site.ts";

export type CustomerQuestionId =
  | "Q01" | "Q02" | "Q03" | "Q04" | "Q05" | "Q06"
  | "Q07" | "Q08" | "Q09" | "Q10" | "Q11" | "Q12"
  | "Q13" | "Q14" | "Q15" | "Q16" | "Q17" | "Q18"
  | "Q19" | "Q20" | "Q21" | "Q22" | "Q23" | "Q24";

export type CustomerQuestion = {
  id: CustomerQuestionId;
  ownerPath: string;
  anchor: string;
  question: string;
  answer: string;
};

export const customerQuestions: Record<CustomerQuestionId, CustomerQuestion> = {
  Q01: {
    id: "Q01", ownerPath: "/cv-builder-no-subscription-uk", anchor: "pay-once-cv-builder",
    question: "Which UK CV builder lets me pay once for a PDF without a subscription?",
    answer: `WorkCV lets you build and preview a UK CV free, then pay ${site.price} once to download the PDF for that saved CV. There is no monthly subscription or automatic renewal. An account is required to save your CV. If you need a completely free file instead, use the separate editable Word template.`,
  },
  Q02: {
    id: "Q02", ownerPath: "/pricing", anchor: "free-vs-paid-cv",
    question: "Can I create and download a CV completely free, or is only the editor free?",
    answer: `WorkCV's blank Word template is free to download without an account or payment. You fill and format that document yourself. The online builder is separate: building and previewing are free after sign-in, while downloading the finished PDF costs ${site.price} once for that saved CV. Choose the option that matches the file and help you need.`,
  },
  Q03: {
    id: "Q03", ownerPath: "/cv-builder-no-subscription-uk", anchor: "cv-on-phone-or-ipad",
    question: "How can I make and download a CV on my phone or iPad without a laptop?",
    answer: `Open WorkCV in your browser, sign in with your email code, and enter your CV details or import a supported PDF or DOCX. On the narrow layout, switch between Edit CV and Preview to check the pages. PDF download costs ${site.price} for that saved CV. Your browser and device control where the downloaded file is saved.`,
  },
  Q04: {
    id: "Q04", ownerPath: "/tools/cv-template-word-uk", anchor: "edit-cv-without-word",
    question: "How can I update my CV if I do not have Microsoft Word?",
    answer: "You can edit a DOCX in a compatible editor such as Google Docs without using the desktop version of Microsoft Word. Keep an unchanged copy first, then check headings, bullets and page breaks after editing. WorkCV's blank DOCX is a free starting point. Its separate guided builder is another option if you want a PDF rather than an editable Word download.",
  },
  Q05: {
    id: "Q05", ownerPath: "/pricing", anchor: "edit-and-redownload",
    question: "Can I edit and download the same CV again after paying?",
    answer: "Yes. You can edit and redownload the same saved CV without paying again. Sign in to the same WorkCV account, open My CVs, and reopen the document you paid for. Make your changes and download its PDF again. The payment belongs to that saved CV, not every new document you create.",
  },
  Q06: {
    id: "Q06", ownerPath: "/pricing", anchor: "one-payment-one-saved-cv",
    question: "Does one payment cover one saved CV or every CV I create?",
    answer: "One payment unlocks PDF downloads for one saved CV. You can keep editing and downloading that same document without another payment. A separate new saved CV has its own payment requirement. For example, changing the wording in your existing paid CV is different from creating a second saved CV for another application.",
  },
  Q07: {
    id: "Q07", ownerPath: "/cv-builder-no-subscription-uk", anchor: "account-and-payment",
    question: "Do I need an account or credit card before I start?",
    answer: "You need an email-code sign-in to use and save a CV in the WorkCV editor. You do not need to enter payment details just to build and preview it. Checkout comes when you choose the paid PDF download. If you only want the free blank Word template, you can download that separate file without a WorkCV account.",
  },
  Q08: {
    id: "Q08", ownerPath: "/chatgpt-cv-to-pdf-uk", anchor: "turn-draft-into-pdf",
    question: "How do I turn my ChatGPT CV draft into a properly formatted UK PDF?",
    answer: `First check the draft's facts. Then copy each section into its matching WorkCV editor field, or save a DOCX and import that file; PDF import is also supported. The import dialog does not accept pasted text. Review the imported details and final preview before downloading. Building and previewing are free after sign-in; the saved CV's PDF costs ${site.price}.`,
  },
  Q09: {
    id: "Q09", ownerPath: "/chatgpt-cv-to-pdf-uk", anchor: "ai-without-invented-facts",
    question: "Can I use AI to improve my CV without making it sound generic or inventing achievements?",
    answer: "Use AI to organise and clarify facts you can verify, not to supply missing experience. Give it your real responsibilities and the vacancy, then check every suggested claim against your records. Remove inflated language and unsupported numbers or skills. Keep wording you can explain at interview, and follow any employer instructions about AI-assisted applications.",
  },
  Q10: {
    id: "Q10", ownerPath: "/tools/job-application-pack-uk", anchor: "tailor-cv-to-one-job",
    question: "How do I tailor my CV to each job without rewriting it from scratch?",
    answer: "Keep a factual master CV, then compare one vacancy with your existing evidence. Change the target role, profile, order of relevant skills and a few supporting bullets where the facts justify it. Keep job titles, dates and qualifications accurate. The application pack can suggest edits, but you should review them rather than copying every suggestion automatically.",
  },
  Q11: {
    id: "Q11", ownerPath: "/tools/ats-score-checker", anchor: "what-the-score-means",
    question: "Is an online ATS score the score an employer actually sees?",
    answer: "No. WorkCV's score is its own assessment of how clearly your supplied CV matches one vacancy. It does not reproduce an employer's applicant-tracking system or predict an interview. Parsing a file, assessing its contents and making a hiring decision are different steps. Use the explanations and evidence gaps, not the percentage as an employer pass mark.",
  },
  Q12: {
    id: "Q12", ownerPath: "/tools/ats-score-checker", anchor: "improve-a-low-score",
    question: "My ATS score is low. What should I actually change first?",
    answer: "Start with the explanations, not a target percentage. Check whether the vacancy's essential requirements are evidenced, make relevant experience easier to find, and replace vague claims with specific facts. If you genuinely lack a requirement, do not add it as a keyword. Decide whether to apply, clarify the requirement, or choose a better-fitting vacancy.",
  },
  Q13: {
    id: "Q13", ownerPath: "/tools/job-application-pack-uk", anchor: "job-advert-keywords",
    question: "Which words from the job advert should I include in my CV?",
    answer: "Use the employer's terminology when it accurately describes something you have done or can demonstrate. Connect each important term to a qualification, task or example instead of repeating a keyword list. If the advert asks for software you have not used, do not add it as a skill. Make the genuine match clearer without inventing one.",
  },
  Q14: {
    id: "Q14", ownerPath: "/canva-cv-alternative-uk", anchor: "columns-and-parsing",
    question: "Can a Canva or two-column CV cause problems when an employer reads the file?",
    answer: "Some complex layouts can make text extraction or reading order less reliable, but that does not mean every Canva or two-column CV fails. Follow the employer's instructions and check the exported file. Can you select and copy its text in a sensible order, and are your name, contact details, headings and dates still clear?",
  },
  Q15: {
    id: "Q15", ownerPath: "/cv-word-or-pdf-uk", anchor: "choose-word-or-pdf",
    question: "Should I send my CV as Word or PDF when applying in the UK?",
    answer: "Send the format the employer asks for. If both are accepted and no preference is given, a text-based PDF can preserve the layout; keep an editable master as well. Use DOCX when it is requested. Check the final file rather than assuming its extension guarantees readability. WorkCV's paid builder exports PDF; its separate free template is DOCX.",
  },
  Q16: {
    id: "Q16", ownerPath: "/shorten-cv-to-two-pages", anchor: "one-page-or-two",
    question: "Should my UK CV be one page or two, and what should I cut?",
    answer: "Use enough space to show relevant evidence without repeating yourself. A first CV may fit on one page; a more experienced applicant may need two. Specialist or academic applications can have different requirements. Cut repeated duties, generic claims and irrelevant detail before shrinking the text. Keep dates, role context and evidence the employer needs.",
  },
  Q17: {
    id: "Q17", ownerPath: "/cv-personal-statement-uk", anchor: "do-i-need-a-profile",
    question: "Do I need a personal statement at the top of my CV?",
    answer: "A short profile is useful when it quickly explains your relevant experience, target role or career change. It is not a place for generic claims that repeat the rest of the CV. If it adds no useful context, shorten it or leave it out unless the application asks for one. A supporting statement requested separately is a different task.",
  },
  Q18: {
    id: "Q18", ownerPath: "/cv-no-experience-uk", anchor: "first-cv-without-paid-work",
    question: "What can I put on my first CV when I have no paid work experience?",
    answer: "Use genuine evidence from education, projects, volunteering, clubs and responsibilities. Explain what you did and which skills it demonstrates, even if it was unpaid. Label those activities honestly rather than turning them into job titles. Include relevant qualifications and availability, and tailor the examples to the role. You do not need to invent a work history.",
  },
  Q19: {
    id: "Q19", ownerPath: "/return-to-work-cv-uk", anchor: "returning-after-childcare",
    question: "How do I write a CV when returning to work after looking after children?",
    answer: "Keep the timeline honest and focus on evidence relevant to the job you want now. A brief “Career break — childcare” entry can explain the period without sharing private family details. Include any genuine recent learning or volunteering separately from paid employment. Do not turn caring responsibilities into an invented professional role or hide the dates of earlier work.",
  },
  Q20: {
    id: "Q20", ownerPath: "/tools/cv-bullet-point-generator", anchor: "achievements-without-numbers",
    question: "How do I write achievement bullets when I was never given targets or sales numbers?",
    answer: "A useful bullet does not need a percentage. Describe the task, the context and what your work helped accomplish, using facts you can support. Scope, frequency, complexity and the people you helped can make it specific. If no reliable number or outcome is known, leave it out rather than guessing or turning an ordinary duty into an exaggerated achievement.",
  },
  Q21: {
    id: "Q21", ownerPath: "/tools/ats-score-checker", anchor: "remove-personal-details",
    question: "What personal details should I remove before asking AI to review my CV?",
    answer: "For a wording or job-fit review, replace your name, email, phone number and full address with placeholders. Remove identification numbers, referee contact details and private medical or family information. Keep the relevant job history and evidence needed for the review. WorkCV's AI checker sends the submitted text to its processing service; read the privacy explanation before using real personal data.",
  },
  Q22: {
    id: "Q22", ownerPath: "/top-job-boards-uk", anchor: "entry-level-and-graduate-sites",
    question: "Which UK job sites should I use for entry-level or graduate roles?",
    answer: "Choose a small set that fits your target role instead of checking every board. For graduate roles, start with a graduate-focused service such as Prospects; for STEM roles, consider Gradcracker. Add one broad board and check the careers pages of employers you want to join. Compare actual requirements and application routes, not just the “entry-level” label.",
  },
  Q23: {
    id: "Q23", ownerPath: "/top-job-boards-uk", anchor: "board-or-employer-website",
    question: "Is it better to apply through Indeed or LinkedIn, or on the employer's website?",
    answer: "Follow the vacancy's application instructions. A job board can help you discover a role, while the employer's careers page can help confirm that it is genuine and still open. If both routes lead to the same vacancy, choose the instructed route and avoid duplicate applications unless requested. There is no universal rule that one route gives you a better chance.",
  },
  Q24: {
    id: "Q24", ownerPath: "/contact", anchor: "paid-but-cannot-download",
    question: "I paid for my CV but cannot download it. What should I do?",
    answer: "Sign in to the same WorkCV account and reopen the saved CV you paid for from My CVs. If the editor is still confirming payment, use Check again before trying another payment. Check your browser's downloads too. If it still fails, contact WorkCV with your receipt email, payment time and a description of the problem. Do not pay again just to troubleshoot.",
  },
};

export function customerQuestionHref(id: CustomerQuestionId): string {
  const { ownerPath, anchor } = customerQuestions[id];
  return `${ownerPath}#${anchor}`;
}
