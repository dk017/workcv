export type TemplateId = "classic" | "modern" | "compact";

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string;
};

export type EducationItem = {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  details: string;
};

export type CvData = {
  template: TemplateId;
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  profile: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
};

export const templates: Array<{
  id: TemplateId;
  name: string;
  description: string;
}> = [
  {
    id: "classic",
    name: "Classic UK",
    description: "Traditional structure with strong scanability.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Cleaner header treatment with subtle accent colour.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tighter spacing for early-career one-page CVs.",
  },
];

export const emptyExperience = (): ExperienceItem => ({
  id: crypto.randomUUID(),
  role: "",
  company: "",
  location: "",
  start: "",
  end: "",
  bullets: "",
});

export const emptyEducation = (): EducationItem => ({
  id: crypto.randomUUID(),
  qualification: "",
  institution: "",
  location: "",
  start: "",
  end: "",
  details: "",
});

export const sampleCv: CvData = {
  template: "classic",
  fullName: "Emily Thompson",
  targetRole: "Customer Service Assistant",
  email: "emily.thompson@email.co.uk",
  phone: "07123 456 789",
  location: "Leeds, UK",
  linkedin: "linkedin.com/in/emilythompson",
  profile:
    "Reliable and friendly customer service candidate with experience supporting busy teams, handling customer queries, and keeping daily work organised. Looking for a role where clear communication, attention to detail, and a calm approach are valued.",
  skills:
    "Customer service\nCash handling\nMicrosoft Office\nComplaint handling\nTeam communication\nTime management",
  experience: [
    {
      id: "exp-1",
      role: "Retail Assistant",
      company: "North Street Books",
      location: "Leeds",
      start: "Jun 2024",
      end: "Present",
      bullets:
        "Serve customers, process purchases, and answer product questions in a busy independent shop.\nKeep shelves organised and support weekly stock checks.\nHandle returns and customer issues calmly while following store policy.",
    },
    {
      id: "exp-2",
      role: "Volunteer Event Helper",
      company: "Local Community Centre",
      location: "Leeds",
      start: "Sep 2023",
      end: "May 2024",
      bullets:
        "Welcomed visitors, gave directions, and helped set up community events.\nWorked with other volunteers to keep sessions running on time.",
    },
  ],
  education: [
    {
      id: "edu-1",
      qualification: "A Levels: Business, English Language, Psychology",
      institution: "Leeds Sixth Form College",
      location: "Leeds",
      start: "2022",
      end: "2024",
      details: "Coursework included customer research, written communication, and team presentations.",
    },
  ],
};

export function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
