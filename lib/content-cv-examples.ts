// Fictional examples written for the September 2026 content guides.
export const retailAdminCv = `Alex Morgan
Leeds | alex.morgan@example.com | 07700 900123
Target role: Office administrator

PROFILE
Retail supervisor moving into office administration, with experience coordinating rotas, maintaining Excel stock records and responding to customer enquiries. Brings careful record keeping and practical experience handing over unresolved queries to colleagues.

KEY SKILLS
Weekly rota coordination; Excel data entry and filtering; customer email replies; delivery records; written handovers.

EXPERIENCE
Retail supervisor | North Lane Homewares, Leeds | September 2022 - Present
• Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.
• Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.
• Replied to customer order enquiries by email, recording the agreed next step in the order log.
• Wrote end-of-shift handovers identifying outstanding orders and the colleague responsible for follow-up.

Retail assistant | North Lane Homewares, Leeds | July 2019 - August 2022
• Checked click-and-collect orders against collection details and referred discrepancies to the supervisor.
• Processed payments and refunds using the store procedure.

EDUCATION
Level 3 Business qualification | North Lane College | September 2017 - June 2019
GCSEs including English and mathematics | North Lane School | June 2017

ADDITIONAL INFORMATION
Excel: data entry, sorting and filtering.`;

export const careEntryCv = `Jamie Ellis
Sheffield | jamie.ellis@example.com | 07700 900124
Target role: Entry-level care assistant

PROFILE
Customer service assistant applying for a first care role. Experienced in listening carefully, explaining next steps and following written procedures in a busy shop. Willing to complete the employer's required induction and training before taking on care duties.

KEY SKILLS
Patient communication; reliable shift attendance; accurate written notes; following procedures; asking for help when a task is outside experience.

EXPERIENCE
Customer service assistant | Elm Street Stores, Sheffield | July 2023 - Present
• Listened to customers' questions and explained refund options in plain language, checking that the next step was understood.
• Recorded unresolved order enquiries in the shift log so the next colleague could follow them up.
• Followed the store's written return procedure and referred exceptions to the supervisor rather than guessing.

EDUCATION
Level 2 Business qualification | Elm Street College | September 2021 - June 2023
GCSE English and mathematics | Elm Street School | June 2021

TRAINING AND AVAILABILITY
Seeking an entry-level role offering induction and supervised learning. No professional care qualification, completed safeguarding course, medication competence or DBS status is claimed in this example.`;

export const returnerCv = `Sam Taylor
Nottingham | sam.taylor@example.com | 07700 900125
Target role: Part-time office administrator

PROFILE
Office administrator returning to paid work after a childcare break. Previously maintained booking records, answered customer enquiries and prepared weekly appointment lists. Recent community volunteering includes recording bookings and sending event reminders.

KEY SKILLS
Booking administration; clear email communication; record checking; appointment lists; spreadsheet data entry.

RECENT ACTIVITY
Volunteer booking helper | Cedar Community Group | March 2026 - Present
• Maintained the event booking spreadsheet and sent reminders using the organiser's approved email wording.

CAREER BREAK
Career break for childcare | January 2022 - Present
Now seeking part-time office administration work.

PREVIOUS EMPLOYMENT
Office administrator | Cedar Repairs, Nottingham | August 2017 - December 2021
• Checked customer contact details before entering appointments in the booking system.
• Prepared weekly appointment lists for the team and highlighted changes received after the initial schedule.
• Responded to routine email enquiries and passed technical questions to the relevant colleague.

EDUCATION
Level 3 Business Administration qualification | Cedar College | September 2015 - June 2017
GCSEs including English and mathematics | Cedar School | June 2015`;

export const overseasBefore = `Priya Shah
Pune, India | priya.shah@example.com | +91 [personal phone number]
Date of birth: [personal date] | Nationality: [nationality] | Photograph

OBJECTIVE
Seeking a challenging position in a reputed organisation where I can utilise my abilities and grow professionally.

EMPLOYMENT
Operations Executive | Lakeview Supplies, Pune | July 2021 - Present
Responsible for vendor follow-ups and MIS.
Handled customer requests and did the needful.

EDUCATION
Bachelor of Commerce | Lakeview College, India | July 2018 - June 2021

SKILLS
Excel; purchase order tracking; customer email replies.

REFERENCES
[Referee names and personal contact details]`;

export const overseasAfter = `Priya Shah
Pune, India | priya.shah@example.com | +91 [personal phone number]
Target role: Operations administrator

PROFILE
Operations executive with experience tracking purchase orders, preparing weekly Excel status reports and replying to customer delivery queries. Seeking an operations administration role using supplier coordination and accurate record keeping.

EXPERIENCE
Operations Executive | Lakeview Supplies, Pune, India | July 2021 - Present
• Followed up outstanding purchase orders with suppliers and updated the weekly Excel status report for the operations team.
• Replied to customer delivery queries, confirmed the next step with the supplier and recorded the response in the order tracker.

EDUCATION
Bachelor of Commerce | Lakeview College, India | July 2018 - June 2021

SKILLS
Excel status reporting; purchase order tracking; supplier follow-up; customer email communication.`;

export const shorteningEdits = [
  ["Profile", "I am a hardworking, enthusiastic and highly motivated retail supervisor. I am looking for a new challenge where I can use the many different skills that I have gained during my career in retail to date.", "Retail supervisor moving into office administration, with experience coordinating rotas, maintaining Excel stock records and responding to customer enquiries.", "Replace general self-description with the target role and supported evidence."],
  ["Rota bullet", "One of my responsibilities was being responsible for the weekly rota for the team, which had 12 people in it. I would make a note of holiday that had been approved and speak to the manager about getting cover arranged.", "Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.", "Keep the scale, action and approval process; remove repeated responsibility wording."],
  ["Stock bullet", "On a regular basis I used the Excel spreadsheet that we had for deliveries. I entered the information and looked for things that did not match the delivery notes, then passed these to someone senior to look into.", "Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.", "Retain the named tool and checking process without claiming unmeasured improvements."],
  ["Email bullet", "I dealt with customers who sent emails about their orders. I replied by email and wrote down in the order log what had been agreed would happen next so that we had a record of the conversation.", "Replied to customer order enquiries by email, recording the agreed next step in the order log.", "Combine the communication and recording actions into one sentence."],
  ["Older role", "I was responsible for serving customers, taking payments, processing refunds, checking collection information, looking at orders, speaking with the supervisor when an order did not match and generally helping the team with a range of day-to-day shop activities.", "Checked click-and-collect details and referred discrepancies to the supervisor. Processed payments and refunds using the store procedure.", "Keep useful accuracy and procedure evidence; remove the vague closing list."],
  ["Skills", "Good communication skills. Good written communication skills. Email communication skills. Ability to communicate well with customers. Good organisational skills. Ability to organise my work. Skills in organising rotas. Good computer skills. Skills using Excel spreadsheets.", "Rota coordination; Excel data entry and filtering; customer email replies; delivery records; written handovers.", "Group overlapping claims into specific capabilities already supported by the CV."],
] as const;

export const shorterCv = retailAdminCv;
export const longerCv = `Alex Morgan
Leeds | alex.morgan@example.com | 07700 900123
Target role: Office administrator

PROFILE
${shorteningEdits[0][1]}

KEY SKILLS
${shorteningEdits[5][1]}

EXPERIENCE
Retail supervisor | North Lane Homewares, Leeds | September 2022 - Present
• ${shorteningEdits[1][1]}
• ${shorteningEdits[2][1]}
• ${shorteningEdits[3][1]}
• At the end of my shift I wrote a handover for the colleagues who would be taking over. In this handover I listed the orders that were still outstanding and wrote down which colleague was responsible for following up on each one of them.

Retail assistant | North Lane Homewares, Leeds | July 2019 - August 2022
• ${shorteningEdits[4][1]}

EDUCATION
Level 3 Business qualification | North Lane College | September 2017 - June 2019
GCSEs including English and mathematics | North Lane School | June 2017

ADDITIONAL INFORMATION
I can use Excel to enter information and to sort and filter the information in a spreadsheet. I am not claiming experience of advanced formulas or any specialist office software.

REFERENCES
References are available on request. Please contact me if you would like to request details of my references.`;

export function exampleWordCount(text: string) { return text.trim().split(/\s+/).filter(word => /[a-z0-9]/i.test(word)).length; }
