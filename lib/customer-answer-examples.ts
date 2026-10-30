export const firstCvExample = `JORDAN REED
Leeds | jordan.reed@example.com
Target role: Retail assistant

PROFILE
School leaver seeking a first retail role, with experience welcoming visitors at
school events, organising a group project and sorting donations as a volunteer.
Comfortable following instructions, checking details and asking for help when needed.

RELEVANT SKILLS
Customer communication: welcomed visitors and explained where activities were held.
Organisation: maintained a shared task list for a school group project.
Teamwork: agreed responsibilities with classmates and helped prepare a presentation.
Accuracy: sorted donated items using the community group's category guidance.

EDUCATION
Northside School, Leeds | September 2021–June 2026
GCSEs: English Language 5, Mathematics 5, Combined Science 5–5,
Business 6, Geography 5 and Art 5.

PROJECTS AND RESPONSIBILITIES
School enterprise project | January–March 2026
Maintained the group's task list and checked progress before class presentations.
Compared supplier information and explained the group's choice in the final presentation.

School open-evening helper | October 2025
Welcomed visitors, gave directions and referred questions to the relevant teacher.
Helped arrange display materials and returned them after the event.

VOLUNTEERING
Cedar Community Group donation helper | April–June 2026
Sorted donated items into agreed categories and asked the coordinator about unclear items.
Kept the sorting area organised and passed completed boxes to other volunteers.

AVAILABILITY
Available for part-time work; can discuss shifts required by the role.`;

export const noMetricsExamples = [
  {
    original: "Answered emails.",
    knownFacts: "Customer order enquiries; shared inbox; next step recorded in order log.",
    improved: "Replied to customer order enquiries from the shared inbox and recorded the agreed next step in the order log.",
  },
  {
    original: "Helped with deliveries.",
    knownFacts: "Compared delivered items to delivery notes; discrepancies passed to supervisor.",
    improved: "Checked delivered items against delivery notes and flagged discrepancies to the supervisor before stock was put away.",
  },
  {
    original: "Did admin for a community group.",
    knownFacts: "Maintained booking list; sent reminders; unresolved queries passed to organiser.",
    improved: "Updated the community group's booking list, sent agreed reminders and referred unresolved booking queries to the organiser.",
  },
] as const;

export const anonymisedCvExample = `[NAME]
[EMAIL] | [PHONE] | [TOWN OR REGION]
Retail supervisor, [EMPLOYER A] | September 2022–present
Updated the Excel delivery tracker and checked discrepancies against delivery notes.`;
