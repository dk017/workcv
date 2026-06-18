import type { CvData, TemplateId } from "@/lib/editor-data";

export type RoleTemplateId =
  | "general"
  | "nurse"
  | "teacher"
  | "warehouse"
  | "graduate"
  | "care-worker";

const nurseCv: CvData = {
  template: "classic",
  fullName: "Amelia Roberts",
  targetRole: "Registered Nurse",
  email: "amelia.roberts@email.co.uk",
  phone: "07123 456 789",
  location: "Birmingham, UK",
  linkedin: "linkedin.com/in/ameliaroberts",
  profile:
    "NMC-registered adult nurse with experience supporting medical and surgical patients in busy ward settings. Confident with patient assessment, medicines administration, accurate documentation, escalation, discharge planning and multidisciplinary teamwork. Known for calm communication with patients and families, safe prioritisation and a practical focus on dignity, consent and person-centred care.",
  skills:
    "NMC registration and revalidation\nPatient assessment and care planning\nMedicines administration\nNEWS2 observations and escalation\nSafeguarding and infection prevention\nElectronic patient records\nDischarge planning\nMultidisciplinary teamwork",
  experience: [
    {
      id: "nurse-exp-1",
      role: "Staff Nurse",
      company: "Birmingham City NHS Trust",
      location: "Birmingham",
      start: "Sep 2023",
      end: "Present",
      bullets:
        "Assess patients on a 28-bed acute medical ward, plan care, monitor observations and escalate deterioration using local policy and NEWS2 guidance.\nAdminister oral, IV and subcutaneous medicines safely, complete checks accurately and document care in electronic patient records.\nCoordinate with doctors, pharmacists, physiotherapists, occupational therapists and discharge coordinators to support safe patient flow.\nCommunicate clearly with patients, relatives and carers, including sensitive conversations around care needs, risk and discharge arrangements.",
    },
    {
      id: "nurse-exp-2",
      role: "Student Nurse Placement",
      company: "University Hospitals Coventry and Warwickshire NHS Trust",
      location: "Coventry",
      start: "Jan 2023",
      end: "Aug 2023",
      bullets:
        "Completed supervised placements across elderly care, surgical recovery and community nursing, building evidence against NMC practice standards.\nSupported wound care, catheter care, mobility checks, nutrition and hydration monitoring, and person-centred care planning.\nPrepared concise handover notes and contributed to ward rounds under supervision, improving confidence with clinical prioritisation.",
    },
  ],
  education: [
    {
      id: "nurse-edu-1",
      qualification: "BSc Adult Nursing",
      institution: "Birmingham City University",
      location: "Birmingham",
      start: "2020",
      end: "2023",
      details:
        "Included acute care, community nursing, medicines management, safeguarding, evidence-based practice and supervised clinical placements.",
    },
    {
      id: "nurse-edu-2",
      qualification: "CPD: Immediate Life Support, Manual Handling, Infection Prevention",
      institution: "NHS eLearning and Trust Training",
      location: "UK",
      start: "2024",
      end: "2026",
      details:
        "Keep this section current with mandatory training, specialist courses and revalidation evidence relevant to the target role.",
    },
  ],
};

const teacherCv: CvData = {
  template: "classic",
  fullName: "Daniel Hughes",
  targetRole: "Secondary English Teacher",
  email: "daniel.hughes@email.co.uk",
  phone: "07123 456 789",
  location: "Manchester, UK",
  linkedin: "linkedin.com/in/danielhughes",
  profile:
    "Qualified secondary English teacher with experience planning and delivering Key Stage 3 and GCSE lessons in mixed-attainment classrooms. Confident with curriculum sequencing, assessment for learning, behaviour routines, adaptive teaching, safeguarding responsibilities and parent communication. Focused on clear explanations, purposeful feedback and helping pupils build confidence in reading, writing and spoken language.",
  skills:
    "QTS and Teachers' Standards evidence\nKS3 and GCSE lesson planning\nAssessment for learning\nBehaviour routines and classroom management\nAdaptive teaching and SEND support\nSafeguarding and pastoral awareness\nParent and carer communication\nGoogle Classroom and Microsoft Teams",
  experience: [
    {
      id: "teacher-exp-1",
      role: "English Teacher",
      company: "North Manchester Academy",
      location: "Manchester",
      start: "Sep 2023",
      end: "Present",
      bullets:
        "Plan and teach KS3 and GCSE English lessons for mixed-attainment classes, using clear learning objectives, modelled examples and checks for understanding.\nUse assessment data, book scrutiny and pupil responses to adapt lessons, target misconceptions and prepare focused revision activities.\nApply consistent behaviour routines, positive relationships and school policy to maintain a safe, purposeful classroom environment.\nWork with SENCO, form tutors and pastoral staff to support pupils with additional needs, attendance concerns and wellbeing risks.",
    },
    {
      id: "teacher-exp-2",
      role: "Trainee Teacher Placement",
      company: "Salford Teacher Training Partnership",
      location: "Salford",
      start: "Sep 2022",
      end: "Jul 2023",
      bullets:
        "Completed two school placements, building evidence against the Teachers' Standards and receiving mentor feedback on planning, delivery and assessment.\nDesigned scaffolded reading and writing tasks for Year 8 and Year 10 pupils, including vocabulary support and model paragraphs.\nContributed to department meetings, moderation activities, parent updates and extracurricular reading sessions.",
    },
  ],
  education: [
    {
      id: "teacher-edu-1",
      qualification: "PGCE Secondary English with QTS",
      institution: "University of Manchester",
      location: "Manchester",
      start: "2022",
      end: "2023",
      details:
        "Included curriculum design, behaviour management, assessment, safeguarding, adaptive teaching and supervised school placements.",
    },
    {
      id: "teacher-edu-2",
      qualification: "BA English Literature",
      institution: "University of Leeds",
      location: "Leeds",
      start: "2019",
      end: "2022",
      details:
        "Relevant study included Shakespeare, modern literature, language analysis, critical writing and seminar presentation.",
    },
  ],
};

const warehouseCv: CvData = {
  template: "classic",
  fullName: "Callum Patel",
  targetRole: "Warehouse Operative",
  email: "callum.patel@email.co.uk",
  phone: "07123 456 789",
  location: "Coventry, UK",
  linkedin: "linkedin.com/in/callumpatel",
  profile:
    "Reliable warehouse operative with experience in goods-in, picking, packing, stock checks and dispatch in fast-paced distribution environments. Confident using handheld scanners, following safe manual handling procedures, keeping work areas tidy and meeting shift targets without losing accuracy. Available for early, late and weekend shifts.",
  skills:
    "Picking and packing\nGoods-in and dispatch\nHandheld scanners and WMS basics\nStock rotation and inventory checks\nSafe manual handling\nPalletising and wrapping\nPPT and forklift awareness\nShift reliability and teamwork",
  experience: [
    {
      id: "warehouse-exp-1",
      role: "Warehouse Operative",
      company: "Midlands Fulfilment Centre",
      location: "Coventry",
      start: "Mar 2024",
      end: "Present",
      bullets:
        "Pick, pack and label customer orders using handheld scanners, checking product codes, quantities and packaging requirements before dispatch.\nSupport goods-in by unloading deliveries, checking paperwork, identifying damaged or missing items and moving stock to the correct locations.\nKeep aisles, packing benches and pallet areas clear while following site rules for PPE, manual handling and pedestrian routes.\nWork flexibly across early and late shifts during peak periods, supporting team leaders with stock counts, returns and priority orders.",
    },
    {
      id: "warehouse-exp-2",
      role: "Picker and Packer",
      company: "Northgate Retail Logistics",
      location: "Birmingham",
      start: "Oct 2022",
      end: "Feb 2024",
      bullets:
        "Prepared online orders for dispatch, maintained accurate labels and packed fragile items carefully to reduce returns and damage.\nUsed stock locations and basic WMS screens to find items quickly, report shortages and support cycle counts.\nHelped new starters understand pick routes, housekeeping standards and safe lifting expectations.",
    },
  ],
  education: [
    {
      id: "warehouse-edu-1",
      qualification: "GCSEs including English and Maths",
      institution: "Coventry Community School",
      location: "Coventry",
      start: "2018",
      end: "2020",
      details:
        "Include English, maths, IT, warehousing courses or supply chain apprenticeships where relevant.",
    },
    {
      id: "warehouse-edu-2",
      qualification: "Training: Manual Handling, Fire Safety, Workplace Induction",
      institution: "Employer Training",
      location: "UK",
      start: "2023",
      end: "2026",
      details:
        "Add current forklift, PPT, first aid, food safety, COSHH or health and safety certificates if you hold them.",
    },
  ],
};

const graduateCv: CvData = {
  template: "classic",
  fullName: "Maya Williams",
  targetRole: "Graduate Business Analyst",
  email: "maya.williams@email.co.uk",
  phone: "07123 456 789",
  location: "Nottingham, UK",
  linkedin: "linkedin.com/in/mayawilliams",
  profile:
    "Recent business and management graduate with placement, project and part-time work experience across customer research, data analysis and process improvement. Confident using Excel, PowerPoint and basic SQL to turn information into clear recommendations. Looking for a graduate analyst role where problem solving, communication and commercial awareness matter.",
  skills:
    "Excel analysis and reporting\nPowerPoint presentations\nCustomer research\nProcess mapping\nSQL basics\nStakeholder communication\nTeam projects\nCommercial awareness",
  experience: [
    {
      id: "graduate-exp-1",
      role: "Business Operations Intern",
      company: "East Midlands Software Ltd",
      location: "Nottingham",
      start: "Jun 2025",
      end: "Sep 2025",
      bullets:
        "Analysed support ticket trends in Excel and presented findings that helped the operations team identify three recurring process issues.\nMapped a customer onboarding workflow, interviewed five team members and suggested clearer handover points between sales and support.\nPrepared weekly slides for the operations manager, summarising workload, response times and customer feedback themes.",
    },
    {
      id: "graduate-exp-2",
      role: "Part-time Customer Assistant",
      company: "Co-op Food",
      location: "Nottingham",
      start: "Oct 2022",
      end: "May 2025",
      bullets:
        "Balanced 12 to 16 hours per week alongside university deadlines, maintaining reliable attendance and flexible weekend availability.\nHandled customer queries, stock checks and till work accurately during busy periods.\nSupported new starters by explaining store routines, product locations and customer service expectations.",
    },
    {
      id: "graduate-exp-3",
      role: "Final-year Consultancy Project",
      company: "University of Nottingham",
      location: "Nottingham",
      start: "Jan 2026",
      end: "May 2026",
      bullets:
        "Worked in a four-person team to research market entry options for a local social enterprise.\nCreated competitor and customer segments, summarised survey results and delivered recommendations to an academic panel.",
    },
  ],
  education: [
    {
      id: "graduate-edu-1",
      qualification: "BA Business and Management, 2:1 expected",
      institution: "University of Nottingham",
      location: "Nottingham",
      start: "2023",
      end: "2026",
      details:
        "Relevant modules: Business Analytics, Operations Management, Marketing Strategy, Financial Decision Making. Dissertation: customer retention in subscription services.",
    },
    {
      id: "graduate-edu-2",
      qualification: "A Levels: Business, Maths, English Literature",
      institution: "Nottingham Sixth Form College",
      location: "Nottingham",
      start: "2021",
      end: "2023",
      details:
        "Use this space for strong pre-university results only if they support the target role or the employer asks for UCAS points.",
    },
  ],
};

const careWorkerCv: CvData = {
  template: "classic",
  fullName: "Sophie Bennett",
  targetRole: "Care Worker",
  email: "sophie.bennett@email.co.uk",
  phone: "07123 456 789",
  location: "Leeds, UK",
  linkedin: "",
  profile:
    "Reliable care worker with experience supporting older adults in residential and community settings. Confident providing person-centred personal care, mobility support, meals and hydration, companionship, accurate care notes and clear handovers. Trained in safeguarding, moving and handling, infection prevention and medication support within agreed care plans, with a consistent focus on dignity, choice and independence.",
  skills:
    "Person-centred care\nPersonal care with dignity\nSafeguarding and escalation\nMoving and handling\nMedication support within training\nCare notes and handovers\nNutrition and hydration support\nDementia-aware communication",
  experience: [
    {
      id: "care-worker-exp-1",
      role: "Care Assistant",
      company: "Meadow View Residential Home",
      location: "Leeds",
      start: "Feb 2024",
      end: "Present",
      bullets:
        "Support up to eight residents during day shifts with washing, dressing, continence care, mobility, meals and meaningful activity while respecting individual choices and routines.\nRecord care delivered, food and fluid intake, mobility changes and wellbeing concerns accurately, then provide clear handovers to senior colleagues.\nFollow moving and handling plans and use mobility equipment safely after training, reporting changes in ability or risk promptly.\nProvide medication support only within training, authorisation and the resident's care plan, escalating omissions, refusals or concerns to senior staff.",
    },
    {
      id: "care-worker-exp-2",
      role: "Home Care Worker",
      company: "West Yorkshire Home Support",
      location: "Leeds",
      start: "May 2022",
      end: "Jan 2024",
      bullets:
        "Completed scheduled home visits independently, supporting personal care, meal preparation, hydration, light household tasks and safe movement.\nBuilt respectful relationships with clients and families while maintaining confidentiality, professional boundaries and client choice.\nNoticed and reported changes in mood, appetite, skin condition and mobility through the agreed escalation process.\nMaintained reliable visit records and communicated delays or urgent concerns promptly to the coordinator.",
    },
  ],
  education: [
    {
      id: "care-worker-edu-1",
      qualification: "Level 2 Diploma in Care",
      institution: "Leeds City College",
      location: "Leeds",
      start: "2023",
      end: "2024",
      details:
        "Covered person-centred practice, duty of care, safeguarding, communication, equality and inclusion, health and safety, and supporting individuals with daily living.",
    },
    {
      id: "care-worker-edu-2",
      qualification: "Care Training and Refresher Courses",
      institution: "Employer Training",
      location: "Leeds",
      start: "2024",
      end: "2026",
      details:
        "Care Certificate standards, moving and handling, safeguarding adults, infection prevention, medication awareness, basic life support and dementia awareness. Replace with training you have actually completed and include dates where useful.",
    },
  ],
};

const generalCv: CvData = {
  template: "classic",
  fullName: "Emily Thompson",
  targetRole: "Customer Service Adviser",
  email: "emily.thompson@email.co.uk",
  phone: "07123 456 789",
  location: "Leeds, UK",
  linkedin: "linkedin.com/in/emilythompson",
  profile:
    "Customer service professional with three years of experience handling retail and telephone enquiries, resolving complaints and keeping customer records accurate. Confident using Microsoft 365 and CRM systems in busy teams. Known for calm communication, reliable follow-through and explaining next steps clearly.",
  skills:
    "Customer enquiry handling\nComplaint resolution\nCRM record updates\nMicrosoft 365\nCash and payment processing\nWritten communication\nTeam coordination\nData accuracy",
  experience: [
    {
      id: "general-exp-1",
      role: "Customer Service Assistant",
      company: "North Street Homeware",
      location: "Leeds",
      start: "Mar 2023",
      end: "Present",
      bullets:
        "Handle 40 to 60 in-person, telephone and email enquiries per shift, explaining products, deliveries, returns and next steps clearly.\nResolve routine complaints within store policy and escalate complex cases with accurate notes, helping colleagues avoid repeated customer explanations.\nUpdate customer and order records in the CRM, checking contact details, delivery status and agreed actions before closing each case.\nSupported two new starters with till procedures, returns and customer-service routines during their first month.",
    },
    {
      id: "general-exp-2",
      role: "Retail Assistant",
      company: "Leeds Books and Gifts",
      location: "Leeds",
      start: "Jun 2021",
      end: "Feb 2023",
      bullets:
        "Processed card and cash payments accurately, balanced the till and followed refund procedures during busy weekend shifts.\nAnswered product questions, checked stock availability and arranged customer orders with clear collection updates.\nCompleted weekly shelf checks and reported pricing or stock discrepancies to the supervisor.",
    },
    {
      id: "general-exp-3",
      role: "Volunteer Events Assistant",
      company: "Leeds Community Hub",
      location: "Leeds",
      start: "Sep 2020",
      end: "May 2021",
      bullets:
        "Welcomed visitors, managed sign-in information and helped the team keep community sessions running to schedule.\nResponded to questions and directed visitors to the correct service while protecting personal information.",
    },
  ],
  education: [
    {
      id: "general-edu-1",
      qualification: "Level 3 Diploma in Business",
      institution: "Leeds City College",
      location: "Leeds",
      start: "2019",
      end: "2021",
      details:
        "Relevant study included customer communication, business administration, digital tools and a team project based on improving a local service.",
    },
    {
      id: "general-edu-2",
      qualification: "GCSEs including English and Maths",
      institution: "West Leeds Academy",
      location: "Leeds",
      start: "2014",
      end: "2019",
      details:
        "Add grades only when they strengthen the application or the employer asks for specific results.",
    },
  ],
};

export function parseRoleTemplate(value: string | null): RoleTemplateId | undefined {
  return value === "general" ||
    value === "nurse" ||
    value === "teacher" ||
    value === "warehouse" ||
    value === "graduate" ||
    value === "care-worker"
    ? value
    : undefined;
}

export function getRoleCvTemplate(role: RoleTemplateId, template?: TemplateId): CvData {
  const source =
    role === "general"
      ? generalCv
      : role === "teacher"
      ? teacherCv
      : role === "warehouse"
        ? warehouseCv
        : role === "graduate"
          ? graduateCv
          : role === "care-worker"
            ? careWorkerCv
            : nurseCv;
  return {
    ...source,
    template: template || source.template,
    experience: source.experience.map((item) => ({ ...item })),
    education: source.education.map((item) => ({ ...item })),
  };
}
