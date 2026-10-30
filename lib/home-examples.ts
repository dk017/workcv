// CV examples shown on the homepage. Images are rendered from lib/role-cv-templates.ts by
// scripts/generate-home-examples.mjs; regenerate them when a template or role CV changes.
export const homeExampleFilters = [
  "Customer service",
  "Healthcare and care",
  "Education",
  "Engineering",
  "Graduate",
  "Retail",
  "Logistics",
] as const;

export type HomeExampleFilter = (typeof homeExampleFilters)[number];

export type HomeExample = {
  role: string;
  sector: string;
  filter: HomeExampleFilter;
  template: "Classic" | "Modern" | "Compact";
  image: string;
  href: string;
};

export const homeExamples: HomeExample[] = [
  { role: "Customer Service Adviser", sector: "Customer service", filter: "Customer service", template: "Classic", image: "/samples/home/customer-service-classic.png", href: "/cv-template-customer-service-uk" },
  { role: "Registered Nurse", sector: "Healthcare", filter: "Healthcare and care", template: "Modern", image: "/samples/home/nurse-modern.png", href: "/cv-template-nurse-uk" },
  { role: "Care Worker", sector: "Care", filter: "Healthcare and care", template: "Compact", image: "/samples/home/care-worker-compact.png", href: "/cv-template-care-worker-uk" },
  { role: "Secondary English Teacher", sector: "Education", filter: "Education", template: "Classic", image: "/samples/home/teacher-classic.png", href: "/cv-template-teacher-uk" },
  { role: "Mechanical Engineer", sector: "Engineering", filter: "Engineering", template: "Modern", image: "/samples/home/engineer-modern.png", href: "/cv-template-engineer-uk" },
  { role: "Graduate Business Analyst", sector: "Graduate", filter: "Graduate", template: "Classic", image: "/samples/home/graduate-classic.png", href: "/cv-template-graduate-uk" },
  { role: "Retail Sales Assistant", sector: "Retail", filter: "Retail", template: "Compact", image: "/samples/home/retail-compact.png", href: "/cv-template-retail-uk" },
  { role: "Warehouse Operative", sector: "Logistics", filter: "Logistics", template: "Modern", image: "/samples/home/warehouse-modern.png", href: "/cv-template-warehouse-uk" },
];
