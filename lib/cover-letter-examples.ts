// Original, fictional UK cover letter examples. Names, employers and details
// are invented for illustration; readers should use the reasoning, not the
// claims. Each greeting follows the UK sign-off rule checked in tests.

export type CoverLetterExample = {
  slug: string;
  role: string;
  searchLabel: string;
  context: string;
  greeting: string;
  paragraphs: string[];
  signOff: "Yours sincerely," | "Yours faithfully,";
  name: string;
  whyItWorks: string[];
};

export const coverLetterExamples: CoverLetterExample[] = [
  {
    slug: "customer-service",
    role: "Customer service advisor",
    searchLabel: "customer service cover letter example",
    context: "Priya has two years in a busy supermarket and is applying for a contact centre role at an energy supplier.",
    greeting: "Dear Mr Adeyemi,",
    paragraphs: [
      "I am applying for the Customer Service Advisor role at Brightwell Energy, advertised on Indeed. Your focus on resolving queries on the first call is how I already try to work, and I would like to do it in a role where customer service is the whole job.",
      "At Harrow Road Supermarket I handle refunds, complaints and delivery questions at the customer service desk, often with a queue waiting. I listen first, check the facts on the till system and explain clearly what will happen next. Most queries I resolve myself; when I cannot, I pass them on with a note so the customer does not have to repeat themselves.",
      "I am also comfortable learning new systems quickly. When the store introduced a new returns process, I was asked to show colleagues on my shift how it worked. I would bring the same patience and accuracy to your phone and email queues.",
      "Thank you for considering my application. I would welcome the chance to discuss the role and I am available for interview at short notice.",
    ],
    signOff: "Yours sincerely,",
    name: "Priya Shah",
    whyItWorks: [
      "Names the role, where it was advertised and a specific reason that matches the employer's aim.",
      "Uses one concrete situation (the customer service desk) instead of listing adjectives.",
      "Shows how retail skills transfer to a phone-based role without overclaiming.",
    ],
  },
  {
    slug: "retail",
    role: "Retail sales assistant",
    searchLabel: "retail cover letter example",
    context: "Tom is 18, has a weekend café job and is applying for a sales assistant role at a sports shop.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I would like to apply for the part-time Sales Assistant role at Peak Sports in Nottingham. I play for a local football club and spend a lot of time helping teammates choose kit, so I would enjoy doing the same for your customers.",
      "For the past year I have worked Saturdays at Maple Café, where I take orders, handle cash and card payments and keep the counter stocked during the lunchtime rush. I have learned to stay friendly when it is busy and to double-check orders before they go out.",
      "I am reliable and punctual: I have not missed a shift since I started, and I often cover for colleagues at short notice. I can work weekends and school holidays, and more hours from June once my exams finish.",
      "Thank you for reading my application. I would be glad to come in for an interview or a trial shift.",
    ],
    signOff: "Yours faithfully,",
    name: "Tom Barker",
    whyItWorks: [
      "Links a genuine personal interest to the shop's products.",
      "Shows customer and cash-handling experience from a first job.",
      "States availability clearly, which matters for part-time retail roles.",
    ],
  },
  {
    slug: "teacher",
    role: "Primary school teacher",
    searchLabel: "teacher cover letter example",
    context: "Hannah is an early career teacher applying for a Year 4 post at another primary school.",
    greeting: "Dear Mrs Clarke,",
    paragraphs: [
      "I am writing to apply for the Year 4 Class Teacher post at St Mary's Primary School, starting in September. Your school's emphasis on reading for pleasure is something I have worked hard on in my own classroom, and I would welcome the chance to build on it with your team.",
      "In my current Year 3 class I introduced a weekly book club, where pupils choose and recommend books to each other. It has helped several reluctant readers take books home by choice. I plan lessons that build on what pupils already know and use short, regular checks to adjust my teaching.",
      "I have also supported pupils with SEND by working closely with our SENCO and teaching assistants on individual plans. I communicate regularly with parents, and I lead the lunchtime chess club.",
      "I would be delighted to visit the school or teach a sample lesson. Thank you for considering my application.",
    ],
    signOff: "Yours sincerely,",
    name: "Hannah Lewis",
    whyItWorks: [
      "Connects to something specific about the school rather than general praise.",
      "Gives a classroom example with a believable outcome.",
      "Covers inclusion and parent communication, which teaching adverts usually ask for.",
    ],
  },
  {
    slug: "care-worker",
    role: "Care worker",
    searchLabel: "care worker cover letter example",
    context: "Grace cared for a family member for three years and is applying for her first paid care role.",
    greeting: "Dear Sir or Madam,",
    paragraphs: [
      "I am applying for the Care Assistant position at Oakfield Home Care. For the last three years I have been the main carer for my grandmother, and I would now like to use that experience to support people in their own homes as my job.",
      "Caring for my grandmother taught me how to help with personal care, meals and medication reminders while protecting her dignity and independence. I kept a daily record for the family and her GP, and I learned to notice small changes in her health and report them quickly.",
      "I understand that care work needs patience, reliability and good communication with families and colleagues. I hold a full UK driving licence and have my own car, and I am happy to complete the Care Certificate and any training you provide.",
      "Thank you for considering my application. I would welcome the opportunity to discuss how I could support your clients.",
    ],
    signOff: "Yours faithfully,",
    name: "Grace Okafor",
    whyItWorks: [
      "Turns unpaid caring into relevant evidence without pretending it was a job.",
      "Mentions dignity, record keeping and spotting changes, all core to care roles.",
      "States practical details employers screen for, such as a driving licence.",
    ],
  },
  {
    slug: "internship",
    role: "Marketing internship",
    searchLabel: "internship cover letter example",
    context: "Daniel is a second-year business student applying for a summer marketing internship.",
    greeting: "Dear Ms Rahman,",
    paragraphs: [
      "I am applying for the Summer Marketing Internship at Fernhill Foods. I am studying Business Management at the University of Leeds and I would like to see how a growing food brand plans and measures its campaigns.",
      "As social media officer for my university's cooking society, I plan our Instagram posts and track which ones bring people to events. Short recipe videos worked far better than posters, so we changed our approach and our event attendance improved over the term.",
      "My degree has given me a grounding in market research and consumer behaviour, and I am comfortable with Excel and Canva. I am keen to learn how a marketing team works day to day and would bring enthusiasm and a willingness to take on any task.",
      "Thank you for your time. I would be very happy to discuss my application further.",
    ],
    signOff: "Yours sincerely,",
    name: "Daniel Kim",
    whyItWorks: [
      "Explains why this company and this internship, not just 'any experience'.",
      "Uses a society role as real evidence of marketing thinking.",
      "Is honest about wanting to learn, which suits an internship.",
    ],
  },
  {
    slug: "graduate-engineer",
    role: "Graduate engineer",
    searchLabel: "engineering cover letter example",
    context: "Aisha is finishing a mechanical engineering degree and applying for a graduate scheme.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I am applying for the Graduate Mechanical Engineer programme at Northgate Rail Systems. I expect to graduate with a 2:1 in Mechanical Engineering from the University of Sheffield this summer, and your work on rolling stock maintenance matches the direction I want my career to take.",
      "My final-year project redesigned a bracket for a train door mechanism to reduce weight while meeting load requirements. I used SolidWorks for the design and finite element analysis to test it, then presented the results to an industry panel.",
      "During a ten-week placement with a manufacturing company, I supported the maintenance team with root cause analysis on repeated equipment faults. I learned to write clear reports and to work safely on site alongside experienced engineers.",
      "Thank you for considering my application. I would welcome the opportunity to discuss the programme.",
    ],
    signOff: "Yours faithfully,",
    name: "Aisha Begum",
    whyItWorks: [
      "Leads with the expected degree and a clear link to the employer's sector.",
      "Describes a technical project in plain terms with named tools.",
      "Shows workplace readiness through a placement, including safety.",
    ],
  },
  {
    slug: "paralegal",
    role: "Paralegal (law)",
    searchLabel: "law cover letter example",
    context: "Oliver has a law degree and a year as a legal administrator, applying for a paralegal role.",
    greeting: "Dear Ms Patel,",
    paragraphs: [
      "I am applying for the Paralegal position in the property team at Hartley & Co Solicitors. After a year supporting conveyancing as a legal administrator, I am keen to take on more responsibility for files within a specialist team.",
      "In my current role I prepare file-opening documents, order searches and track key dates for four fee earners. I keep a careful checklist for each file so that nothing is missed before exchange, and I update clients by phone and email in plain English.",
      "I graduated with an LLB from the University of Bristol, where I enjoyed land law and contract. I am organised, discreet with confidential information and comfortable using case management software.",
      "Thank you for considering my application. I would welcome the chance to discuss how I could support your property team.",
    ],
    signOff: "Yours sincerely,",
    name: "Oliver Grant",
    whyItWorks: [
      "Targets a specific team and explains the step up in responsibility.",
      "Uses accurate conveyancing tasks without overstating qualifications.",
      "Highlights confidentiality and accuracy, both essential in legal roles.",
    ],
  },
  {
    slug: "accounts-assistant",
    role: "Accounts assistant (finance)",
    searchLabel: "finance cover letter example",
    context: "Marta works in a busy office and is studying AAT, applying for her first finance role.",
    greeting: "Dear Mr Evans,",
    paragraphs: [
      "I am applying for the Accounts Assistant role at Riverside Logistics. I am currently studying for my AAT Level 3 qualification and I would like to move from general office work into a finance team where I can use it every day.",
      "In my current office role I process supplier invoices, match them to purchase orders and chase missing paperwork before month end. I use Sage and Excel daily, including lookups and pivot tables to reconcile spend reports for my manager.",
      "I am careful with detail and like to understand why numbers do not match rather than just correcting them. I work well to deadlines and I am comfortable asking questions when something is unclear.",
      "Thank you for your time. I would be pleased to discuss my application at interview.",
    ],
    signOff: "Yours sincerely,",
    name: "Marta Nowak",
    whyItWorks: [
      "Explains the career move and shows the study commitment behind it.",
      "Names finance tasks and software the advert is likely to list.",
      "Shows attention to detail through behaviour, not just a claim.",
    ],
  },
  {
    slug: "apprenticeship",
    role: "Apprenticeship",
    searchLabel: "apprenticeship cover letter example",
    context: "Josh is leaving college and applying for an electrical apprenticeship.",
    greeting: "Dear Sir or Madam,",
    paragraphs: [
      "I am applying for the Electrical Installation Apprenticeship at Summit Electrical Services. I am finishing a Level 2 Diploma in Electrical Installation at Leeds City College and I want to complete my training on real jobs with an experienced team.",
      "At college I have wired lighting and power circuits in the workshop and learned to follow safe isolation procedures. I enjoy finding faults and working out why a circuit is not behaving as expected.",
      "Outside college I help my uncle, a plasterer, on weekend jobs, so I am used to early starts, working tidily on site and being polite to customers in their homes. I am reliable and keen to learn.",
      "Thank you for considering my application. I would be happy to attend an interview or a practical assessment.",
    ],
    signOff: "Yours faithfully,",
    name: "Josh Patel",
    whyItWorks: [
      "Shows a clear path from college course to apprenticeship.",
      "Mentions safety and fault-finding, which trades employers value.",
      "Uses weekend work to prove reliability and site behaviour.",
    ],
  },
  {
    slug: "part-time-student",
    role: "Student part-time job",
    searchLabel: "student cover letter example",
    context: "Chloe is a university student applying for a part-time library assistant job on campus.",
    greeting: "Dear Library Team,",
    paragraphs: [
      "I would like to apply for the part-time Library Assistant role at the University of Exeter Library. As a second-year History student I use the library almost every day, and I would enjoy helping other students find what they need.",
      "I volunteer at a local charity shop on Saturdays, where I sort donations, serve customers and help keep the shop organised. It has taught me to be friendly and patient with people of all ages, and to follow procedures carefully.",
      "I can work up to 12 hours a week around my timetable, including evenings and weekends, and I am confident using library catalogues and online databases for my own research.",
      "Thank you for considering my application. I look forward to hearing from you.",
    ],
    signOff: "Yours faithfully,",
    name: "Chloe Martin",
    whyItWorks: [
      "Addresses a team when no individual is named, then signs off faithfully.",
      "Uses volunteering as relevant customer-facing evidence.",
      "States hours and availability, which part-time employers need first.",
    ],
  },
];

export function exampleWordCount(example: CoverLetterExample) {
  return example.paragraphs.join(" ").trim().split(/\s+/).length;
}
