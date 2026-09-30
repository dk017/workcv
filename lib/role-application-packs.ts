import type { RoleTemplateId } from "./role-cv-templates.ts";
export type RoleApplicationPack = {
  id: string; title: string; path: string; roleTemplate: RoleTemplateId;
  targetRole: string; employer: string; paragraphs: string[];
  why: string[]; prompts: [string, string]; checklist: string[]; sourceUrl: string;
};
export const roleApplicationPacks: Record<string, RoleApplicationPack> = {
  "customer-service": {
    id: "customer-service", title: "Customer service", path: "/cv-template-customer-service-uk", roleTemplate: "customer-service",
    targetRole: "Customer Service Adviser", employer: "Northbank Customer Services",
    paragraphs: [
      "I am applying for the Customer Service Adviser role at Northbank Customer Services. My experience handling account enquiries and complaints at Yorkshire Energy Support would help me explain options clearly and give customers a reliable next step.",
      "In my current role I handle telephone, email and live-chat enquiries. I check account details before discussing them, record agreed actions in Salesforce and resolve complaints at first contact where possible. When a case needs specialist support, I explain the escalation and leave clear notes for the next colleague.",
      "I have also helped update live-chat response templates and coached two new starters on tone, CRM notes and escalation routes. These tasks have taught me to combine a calm manner with accurate records, particularly when a customer is frustrated or needs extra support.",
      "I would welcome the opportunity to discuss how this experience could support your team. Thank you for considering my application."
    ],
    why: ["Uses the same employment and systems as Emily's CV above.", "Explains how she handles a customer problem instead of only listing soft skills.", "Keeps coaching and escalation claims tied to the example's stated responsibilities."],
    prompts: ["Describe a real customer enquiry or complaint: what did you check, do and explain?", "Give another real example of accurate records, teamwork or helping a colleague."],
    checklist: ["Match the role title and employer to the advert.", "Name only channels and systems you have actually used.", "Describe a complaint you can explain in an interview.", "Check that CV dates and letter claims agree.", "Use numbers only when you can substantiate them.", "Follow the employer's requested PDF or Word format."],
    sourceUrl: "https://nationalcareers.service.gov.uk/job-profiles/customer-service-assistant"
  }
};
export function getRoleApplicationPack(id: string) {
  const pack = roleApplicationPacks[id];
  if (!pack) throw new Error("Unknown application pack");
  return pack;
}
roleApplicationPacks["care-worker"] = {
  "id": "care-worker",
  "title": "Care worker",
  "path": "/cv-template-care-worker-uk",
  "roleTemplate": "care-worker",
  "targetRole": "Care Assistant",
  "employer": "Oakfield Residential Care",
  "paragraphs": [
    "I am applying for the Care Assistant role at Oakfield Residential Care. My work in residential and home-care settings has taught me to support everyday routines while respecting each person's preferences, privacy and independence.",
    "At Meadow View Residential Home I support residents with personal care, mobility, meals and activities in line with their individual care plans. I record care delivered and changes in wellbeing, and share clear information with senior colleagues at handover.",
    "In my previous home-care role I completed scheduled visits, maintained visit records and reported changes through the agreed escalation process. Across both settings I have learned to follow training and care plans, recognise the limits of my responsibilities and seek support promptly when concerns arise.",
    "Thank you for considering my application. I would welcome the opportunity to discuss how my experience and approach could contribute to your team."
  ],
  "why": [
    "Sophie Bennett is the applicant in both this letter and the CV above.",
    "Examples refer to the same residential and home-care roles.",
    "The letter describes following training and escalation procedures without claiming clinical authority."
  ],
  "prompts": [
    "Describe support you actually provided and how you respected the person's choices. If it was unpaid family care or volunteering, say so; leave out private health details.",
    "Give a real example of following instructions, keeping records, communicating or asking for help within your responsibilities."
  ],
  "checklist": [
    "Distinguish paid care work, volunteering and unpaid family care.",
    "List only training completed or clearly marked in progress.",
    "Keep client names and private health details out of your examples.",
    "Describe your own duties without claiming clinical responsibilities you did not hold.",
    "Check the employer's shift and travel requirements against your actual availability.",
    "Make sure dates, training and responsibilities agree across the CV and letter."
  ],
  "sourceUrl": "https://nationalcareers.service.gov.uk/job-profiles/care-worker"
};
roleApplicationPacks["warehouse"] = {
  "id": "warehouse",
  "title": "Warehouse",
  "path": "/cv-template-warehouse-uk",
  "roleTemplate": "warehouse",
  "targetRole": "Warehouse Operative",
  "employer": "Eastgate Distribution",
  "paragraphs": [
    "I am applying for the Warehouse Operative role at Eastgate Distribution. My experience in picking, packing, goods-in and dispatch would help me contribute to accurate orders and an organised working area.",
    "At Midlands Fulfilment Centre I use handheld scanners to check product codes, quantities and labels before dispatch. I also support goods-in by checking deliveries against paperwork and reporting damaged or missing items so that stock can be handled correctly.",
    "In my previous picker and packer role I prepared online orders, packed fragile goods and supported cycle counts. I have also helped new starters understand pick routes and housekeeping expectations. I follow site instructions for manual handling, PPE and pedestrian routes, and work across early and late shifts.",
    "Thank you for considering my application. I would welcome the opportunity to explain how my warehouse experience could support your operation."
  ],
  "why": [
    "The letter uses Callum Patel's two existing warehouse roles.",
    "Scanner, order-checking and goods-in examples are supported by the CV.",
    "It does not turn forklift awareness into a claim of qualification or authorisation."
  ],
  "prompts": [
    "Describe a real example of checking items, quantities, labels or instructions. Experience from another setting is welcome if labelled accurately.",
    "Describe teamwork, reliability or following a safe procedure. State only equipment and shifts you have actually used or can work."
  ],
  "checklist": [
    "Match the role to picking, packing, goods-in or dispatch as appropriate.",
    "Distinguish equipment awareness from training and authorised use.",
    "Check that shift availability and travel arrangements are realistic.",
    "Give an accurate example of checking an order or spotting a discrepancy.",
    "Keep dates, responsibilities and training consistent in both documents.",
    "Use the employer's requested file format and filename."
  ],
  "sourceUrl": "https://nationalcareers.service.gov.uk/job-profiles/warehouse-worker"
};

roleApplicationPacks["retail"] = {
  "id": "retail",
  "title": "Retail",
  "path": "/cv-template-retail-uk",
  "roleTemplate": "retail",
  "targetRole": "Retail Sales Assistant",
  "employer": "Willow Home Store",
  "paragraphs": [
    "I am applying for the Retail Sales Assistant role at Willow Home Store. My experience helping shoppers, processing payments and keeping stock organised at Birch Home and Gifts would help me support customers throughout their visit.",
    "In my current role I help customers compare products and check availability before suggesting alternatives. At the till I check prices, process cash and card payments and refer returns outside store policy to my supervisor. This has taught me to be helpful while following the agreed process.",
    "I also replenish shelves, help with seasonal displays and keep aisles clear during deliveries. At handover I share unresolved stock queries and unfinished tasks with colleagues. My earlier volunteer shop role gave me practice welcoming visitors and organising donated items. I am available for evening and weekend work.",
    "Thank you for considering my application. I would welcome the opportunity to discuss how my retail experience and practical approach could support your store team."
  ],
  "why": [
    "Maya Lewis is the applicant in both the CV and the letter.",
    "Product advice, transactions and handovers refer to the same paid retail role.",
    "Volunteer work is labelled clearly; no sales targets or management responsibilities are invented."
  ],
  "prompts": [
    "Describe a real example of helping someone choose, find or understand something. Name the setting and what you did.",
    "Describe accurate transactions, organising items or working with others. Label school, voluntary and paid experience correctly."
  ],
  "checklist": [
    "Use the exact shop role and employer from the advert.",
    "Name only tills, payment systems and product areas you have used.",
    "Give a specific customer-help example you can explain.",
    "Separate volunteering from paid employment.",
    "State realistic evening, weekend and holiday availability.",
    "Check dates and responsibilities agree in the CV and letter."
  ],
  "sourceUrl": "https://nationalcareers.service.gov.uk/job-profiles/sales-assistant"
};

roleApplicationPacks["student"] = {
  "id": "student",
  "title": "Student and first-job",
  "path": "/student-cv-template",
  "roleTemplate": "student",
  "targetRole": "Part-time Retail Assistant",
  "employer": "Maple Books",
  "paragraphs": [
    "I am applying for the Part-time Retail Assistant role at Maple Books. I am studying Business Management at Nottingham Trent University and would like to bring my customer-facing volunteering and organisational experience to a paid shop role.",
    "During my weekly volunteer shift at Nottingham Community Bookshop I welcome customers, answer routine queries and organise donated books. I label stock accurately and support cash and card transactions under supervision. This has helped me practise clear communication and learn when to ask a supervisor for help.",
    "As an events representative for the University Business Society, I coordinate room bookings, attendee messages and sign-in lists. I work with the committee to share tasks and respond to last-minute changes. These responsibilities have helped me organise deadlines alongside my studies. I am available for evening and weekend shifts during term time.",
    "Thank you for considering my application. I would welcome the opportunity to explain how my volunteering and university responsibilities could help me contribute to your team."
  ],
  "why": [
    "Sophie Clarke is the applicant in both documents, with the same current degree.",
    "Bookshop work is described as volunteering and till support remains supervised.",
    "Society responsibilities provide teamwork evidence without inventing previous paid employment."
  ],
  "prompts": [
    "Describe a real project, volunteering shift, club activity or other responsibility. Say what you did and label the setting accurately.",
    "Give a second example of organising work, helping people or meeting a deadline. Include availability only if you can reliably offer it."
  ],
  "checklist": [
    "Put current education and its expected completion date in the CV.",
    "Use projects, volunteering or societies when you have no paid work.",
    "Label unpaid responsibilities and supervised tasks accurately.",
    "Do not invent predicted grades, qualifications or job titles.",
    "Check work availability against study and travel commitments.",
    "Use the same facts in the CV and letter, following the advert instructions."
  ],
  "sourceUrl": "https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
};
