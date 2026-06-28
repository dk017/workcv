export type SalarySourceKind = "ons-ashe" | "graduate-benchmarks";

export type SalaryRole = {
  slug: string;
  title: string;
  aliases: string[];
  category: string;
  occupation: string;
  socCode?: string;
  low: number;
  median: number;
  high: number;
  sourceKind: SalarySourceKind;
  labels?: [string, string, string];
};

export const onsSalarySource = {
  name: "ONS Annual Survey of Hours and Earnings (ASHE), 2025 provisional",
  url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/occupation4digitsoc2010ashetable14",
  releaseDate: "23 October 2025",
  referenceDate: "April 2025",
  table: "Table 14.7a: Annual pay - Gross, Full-Time",
};

export const graduateSalarySources = [
  {
    label: "HESA Graduate Outcomes broader-market average",
    value: 28500,
    url: "https://sheffield.ac.uk/careers/employers/support/setting-appropriate-graduate-salary",
  },
  {
    label: "ISE 2024/25 median graduate starting salary",
    value: 33000,
    url: "https://ise.org.uk/_userfiles/pages/files/reports/student_recruitment_survey_2025.pdf",
  },
  {
    label: "High Fliers 2026 top-employer median",
    value: 35000,
    url: "https://www.highfliers.co.uk/publication-the-graduate-market-report",
  },
];

function onsRole(
  slug: string,
  title: string,
  socCode: string,
  occupation: string,
  salaries: [number, number, number],
  category: string,
  aliases: string[],
): SalaryRole {
  return {
    slug,
    title,
    aliases,
    category,
    occupation,
    socCode,
    low: salaries[0],
    median: salaries[1],
    high: salaries[2],
    sourceKind: "ons-ashe",
  };
}

export const salaryRoles: SalaryRole[] = [
  onsRole(
    "software-engineer",
    "Software engineer",
    "2134",
    "Programmers and software development professionals",
    [42289, 56914, 75794],
    "Technology",
    ["software developer", "programmer", "developer", "full stack developer", "frontend developer", "backend developer"],
  ),
  onsRole(
    "data-analyst",
    "Data analyst",
    "3544",
    "Data analysts",
    [30835, 38572, 47045],
    "Technology",
    ["reporting analyst", "business intelligence analyst", "bi analyst"],
  ),
  onsRole(
    "business-analyst",
    "Business analyst",
    "2431",
    "Management consultants and business analysts",
    [40202, 53295, 70977],
    "Business",
    ["management consultant", "business consultant", "consultant"],
  ),
  onsRole(
    "it-business-analyst",
    "IT business analyst",
    "2133",
    "IT business analysts, architects and systems designers",
    [45860, 60288, 81932],
    "Technology",
    ["systems analyst", "solutions architect", "it architect", "technical business analyst"],
  ),
  onsRole(
    "cyber-security-analyst",
    "Cyber security analyst",
    "2135",
    "Cyber security professionals",
    [42761, 54647, 71808],
    "Technology",
    ["cybersecurity analyst", "information security analyst", "soc analyst", "security analyst"],
  ),
  onsRole(
    "graphic-designer",
    "Graphic designer",
    "2142",
    "Graphic and multimedia designers",
    [26854, 32510, 40000],
    "Creative",
    ["multimedia designer", "visual designer"],
  ),
  onsRole(
    "accountant",
    "Accountant",
    "2421",
    "Chartered and certified accountants",
    [38696, 50062, 68056],
    "Finance",
    ["chartered accountant", "certified accountant", "financial accountant"],
  ),
  onsRole(
    "project-manager",
    "Project manager",
    "2440",
    "Business and financial project management professionals",
    [46399, 59834, 77568],
    "Business",
    ["programme manager", "program manager", "business project manager", "financial project manager"],
  ),
  onsRole(
    "construction-project-manager",
    "Construction project manager",
    "2455",
    "Construction project managers and related professionals",
    [37847, 47665, 57511],
    "Construction",
    ["site project manager", "building project manager"],
  ),
  onsRole(
    "marketing-manager",
    "Marketing manager",
    "2432",
    "Marketing and commercial managers",
    [39645, 53703, 69510],
    "Marketing and sales",
    ["commercial manager", "brand manager"],
  ),
  onsRole(
    "marketing-executive",
    "Marketing executive",
    "3554",
    "Marketing associate professionals",
    [27373, 33412, 41521],
    "Marketing and sales",
    ["marketing assistant", "digital marketing executive", "marketing coordinator"],
  ),
  onsRole(
    "sales-executive",
    "Sales executive",
    "3552",
    "Business sales executives",
    [30244, 37924, 52105],
    "Marketing and sales",
    ["business sales executive", "b2b sales executive", "sales representative"],
  ),
  onsRole(
    "business-development-manager",
    "Business development manager",
    "3556",
    "Sales accounts and business development managers",
    [43049, 57625, 79598],
    "Marketing and sales",
    ["account manager", "sales account manager", "business development executive"],
  ),
  onsRole(
    "hr-manager",
    "HR manager",
    "1136",
    "Human resource managers and directors",
    [43676, 57529, 78677],
    "Human resources",
    ["human resources manager", "people manager", "hr director"],
  ),
  onsRole(
    "hr-officer",
    "HR officer",
    "3571",
    "Human resources and industrial relations officers",
    [29116, 35194, 43735],
    "Human resources",
    ["human resources officer", "hr advisor", "employee relations officer"],
  ),
  onsRole(
    "buyer-procurement-officer",
    "Buyer / procurement officer",
    "3551",
    "Buyers and procurement officers",
    [30065, 37306, 46937],
    "Business",
    ["buyer", "procurement officer", "purchasing officer"],
  ),
  onsRole(
    "administrative-assistant",
    "Administrative assistant",
    "4159",
    "Other administrative occupations n.e.c.",
    [24636, 28294, 34741],
    "Administration",
    ["admin assistant", "administrator", "office administrator"],
  ),
  onsRole(
    "receptionist",
    "Receptionist",
    "4216",
    "Receptionists",
    [22124, 24678, 28730],
    "Administration",
    ["front desk receptionist", "front of house receptionist"],
  ),
  onsRole(
    "personal-assistant",
    "Personal assistant",
    "4215",
    "Personal assistants and other secretaries",
    [28565, 34954, 43903],
    "Administration",
    ["pa", "executive assistant", "secretary"],
  ),
  onsRole(
    "bookkeeper-payroll-clerk",
    "Bookkeeper / payroll clerk",
    "4122",
    "Book-keepers, payroll managers and wages clerks",
    [26802, 31560, 40123],
    "Finance",
    ["bookkeeper", "payroll clerk", "payroll administrator", "wages clerk"],
  ),
  onsRole(
    "customer-service-advisor",
    "Customer service advisor",
    "7219",
    "Customer service occupations n.e.c.",
    [24583, 27848, 33076],
    "Customer service",
    ["customer service representative", "customer service assistant", "customer support advisor", "call centre advisor", "customer service agent"],
  ),
  onsRole(
    "customer-service-manager",
    "Customer service manager",
    "4143",
    "Customer service managers",
    [30098, 37535, 51485],
    "Customer service",
    ["customer support manager", "contact centre manager"],
  ),
  onsRole(
    "retail-assistant",
    "Retail assistant",
    "7111",
    "Sales and retail assistants",
    [21970, 25056, 29846],
    "Retail",
    ["sales assistant", "shop assistant", "retail sales assistant"],
  ),
  onsRole(
    "retail-manager",
    "Retail manager",
    "1150",
    "Managers and directors in retail and wholesale",
    [30000, 38447, 52498],
    "Retail",
    ["store manager", "shop manager", "branch manager"],
  ),
  onsRole(
    "warehouse-operative",
    "Warehouse operative",
    "9252",
    "Warehouse operatives",
    [24447, 27832, 33151],
    "Logistics",
    ["warehouse worker", "picker packer", "warehouse assistant"],
  ),
  onsRole(
    "warehouse-manager",
    "Warehouse manager",
    "1242",
    "Managers in storage and warehousing",
    [30022, 37470, 45338],
    "Logistics",
    ["storage manager", "warehouse supervisor"],
  ),
  onsRole(
    "hgv-driver",
    "HGV driver",
    "8211",
    "Large goods vehicle drivers",
    [33749, 39905, 46679],
    "Transport",
    ["lgv driver", "lorry driver", "truck driver", "class 1 driver", "class 2 driver"],
  ),
  onsRole(
    "delivery-driver",
    "Delivery driver",
    "8214",
    "Delivery drivers and couriers",
    [24583, 27854, 33472],
    "Transport",
    ["courier", "van driver", "multi drop driver", "driver"],
  ),
  onsRole(
    "bus-driver",
    "Bus driver",
    "8212",
    "Bus and coach drivers",
    [30889, 36340, 43855],
    "Transport",
    ["coach driver", "pcv driver"],
  ),
  onsRole(
    "forklift-driver",
    "Forklift driver",
    "8222",
    "Fork-lift truck drivers",
    [26597, 31279, 38883],
    "Logistics",
    ["flt driver", "fork lift driver", "forklift operator"],
  ),
  onsRole(
    "train-driver",
    "Train driver",
    "8231",
    "Train and tram drivers",
    [68924, 76327, 83129],
    "Transport",
    ["tram driver", "rail driver"],
  ),
  onsRole(
    "registered-nurse",
    "Registered nurse",
    "2237",
    "Other nursing professionals",
    [36192, 42300, 49866],
    "Healthcare",
    ["nurse", "staff nurse", "adult nurse", "rn"],
  ),
  onsRole(
    "nurse-practitioner",
    "Nurse practitioner",
    "2234",
    "Nurse practitioners",
    [38107, 46069, 53210],
    "Healthcare",
    ["advanced nurse practitioner", "anp"],
  ),
  onsRole(
    "mental-health-nurse",
    "Mental health nurse",
    "2235",
    "Mental health nurses",
    [37229, 42692, 48074],
    "Healthcare",
    ["rmn", "psychiatric nurse"],
  ),
  onsRole(
    "midwife",
    "Midwife",
    "2231",
    "Midwifery nurses",
    [42084, 46990, 53564],
    "Healthcare",
    ["registered midwife", "midwifery nurse"],
  ),
  onsRole(
    "healthcare-assistant",
    "Healthcare assistant",
    "6131",
    "Nursing auxiliaries and assistants",
    [25189, 29084, 33294],
    "Healthcare",
    ["health care assistant", "nursing assistant", "nursing auxiliary", "hca"],
  ),
  onsRole(
    "care-worker",
    "Care worker",
    "6135",
    "Care workers and home carers",
    [22798, 27468, 32493],
    "Social care",
    ["care assistant", "home carer", "support worker", "domiciliary carer"],
  ),
  onsRole(
    "senior-care-worker",
    "Senior care worker",
    "6136",
    "Senior care workers",
    [25272, 29381, 33740],
    "Social care",
    ["senior carer", "senior care assistant"],
  ),
  onsRole(
    "social-worker",
    "Social worker",
    "2461",
    "Social workers",
    [39517, 44550, 49959],
    "Social care",
    ["childrens social worker", "adult social worker"],
  ),
  onsRole(
    "physiotherapist",
    "Physiotherapist",
    "2221",
    "Physiotherapists",
    [35953, 43532, 50694],
    "Healthcare",
    ["physical therapist", "physio"],
  ),
  onsRole(
    "pharmacist",
    "Pharmacist",
    "2251",
    "Pharmacists",
    [44891, 53772, 62344],
    "Healthcare",
    ["community pharmacist", "hospital pharmacist"],
  ),
  onsRole(
    "paramedic",
    "Paramedic",
    "2255",
    "Paramedics",
    [45499, 53818, 60860],
    "Healthcare",
    ["ambulance paramedic"],
  ),
  onsRole(
    "primary-school-teacher",
    "Primary school teacher",
    "2314",
    "Primary education teaching professionals",
    [37847, 45939, 51676],
    "Education",
    ["primary teacher", "ks1 teacher", "ks2 teacher", "teacher"],
  ),
  onsRole(
    "secondary-school-teacher",
    "Secondary school teacher",
    "2313",
    "Secondary education teaching professionals",
    [39059, 47632, 54047],
    "Education",
    ["secondary teacher", "high school teacher", "subject teacher"],
  ),
  onsRole(
    "teaching-assistant",
    "Teaching assistant",
    "6112",
    "Teaching assistants",
    [18789, 21239, 24152],
    "Education",
    ["classroom assistant", "learning support assistant", "lsa", "ta"],
  ),
  onsRole(
    "university-lecturer",
    "University lecturer",
    "2311",
    "Higher education teaching professionals",
    [42062, 52835, 66191],
    "Education",
    ["lecturer", "higher education teacher", "university teacher"],
  ),
  onsRole(
    "nursery-practitioner",
    "Nursery practitioner",
    "3232",
    "Early education and childcare practitioners",
    [20610, 23717, 26521],
    "Education",
    ["nursery nurse", "early years practitioner", "childcare practitioner"],
  ),
  onsRole(
    "chef",
    "Chef",
    "5434",
    "Chefs",
    [25894, 30010, 36126],
    "Hospitality",
    ["head chef", "sous chef", "commis chef"],
  ),
  onsRole(
    "cook",
    "Cook",
    "5435",
    "Cooks",
    [20334, 24228, 27831],
    "Hospitality",
    ["kitchen cook", "school cook"],
  ),
  onsRole(
    "waiter-waitress",
    "Waiter / waitress",
    "9264",
    "Waiters and waitresses",
    [18363, 22936, 27395],
    "Hospitality",
    ["waiter", "waitress", "server", "waiting staff"],
  ),
  onsRole(
    "cleaner",
    "Cleaner",
    "9223",
    "Cleaners and domestics",
    [20942, 24130, 27960],
    "Facilities",
    ["domestic cleaner", "housekeeper", "cleaning operative"],
  ),
  onsRole(
    "security-guard",
    "Security guard",
    "9231",
    "Security guards and related occupations",
    [27982, 33832, 39194],
    "Security",
    ["security officer", "door supervisor", "security operative"],
  ),
  onsRole(
    "electrician",
    "Electrician",
    "5241",
    "Electricians and electrical fitters",
    [32287, 39647, 49138],
    "Skilled trades",
    ["electrical fitter", "installation electrician"],
  ),
  onsRole(
    "plumber",
    "Plumber",
    "5315",
    "Plumbers & heating and ventilating installers and repairers",
    [31656, 37881, 45451],
    "Skilled trades",
    ["heating engineer", "heating installer", "ventilation installer"],
  ),
  onsRole(
    "carpenter-joiner",
    "Carpenter / joiner",
    "5316",
    "Carpenters and joiners",
    [28900, 34014, 40477],
    "Skilled trades",
    ["carpenter", "joiner"],
  ),
  onsRole(
    "vehicle-mechanic",
    "Vehicle mechanic",
    "5231",
    "Vehicle technicians, mechanics and electricians",
    [30000, 37458, 44594],
    "Skilled trades",
    ["car mechanic", "vehicle technician", "auto electrician", "motor mechanic"],
  ),
  onsRole(
    "construction-operative",
    "Construction operative",
    "8159",
    "Construction operatives n.e.c.",
    [26836, 32446, 37754],
    "Construction",
    ["construction worker", "site operative", "building operative"],
  ),
  onsRole(
    "architect",
    "Architect",
    "2451",
    "Architects",
    [37342, 47143, 55262],
    "Construction",
    ["registered architect"],
  ),
  onsRole(
    "solicitor-lawyer",
    "Solicitor / lawyer",
    "2412",
    "Solicitors and lawyers",
    [42015, 56977, 77509],
    "Legal",
    ["solicitor", "lawyer", "legal counsel"],
  ),
  {
    slug: "graduate-scheme",
    title: "Graduate scheme",
    aliases: ["graduate", "graduate trainee", "graduate job", "entry level graduate"],
    category: "Early careers",
    occupation: "Cross-sector graduate starting-pay benchmarks",
    low: 28500,
    median: 33000,
    high: 35000,
    sourceKind: "graduate-benchmarks",
    labels: ["Broader outcome average", "ISE median start", "Top-employer median"],
  },
];

function normaliseSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchScore(role: SalaryRole, query: string) {
  const title = normaliseSearch(role.title);
  const aliases = role.aliases.map(normaliseSearch);
  const candidates = [title, ...aliases];

  if (candidates.includes(query)) return 0;
  if (title.startsWith(query)) return 1;
  if (aliases.some((alias) => alias.startsWith(query))) return 2;
  if (title.includes(query)) return 3;
  if (aliases.some((alias) => alias.includes(query))) return 4;

  const queryWords = query.split(" ").filter(Boolean);
  if (
    queryWords.length > 0 &&
    candidates.some((candidate) =>
      queryWords.every((word) => candidate.includes(word)),
    )
  ) {
    return 5;
  }

  return Number.POSITIVE_INFINITY;
}

export function searchSalaryRoles(query: string, limit = 8) {
  const normalisedQuery = normaliseSearch(query);
  if (!normalisedQuery) return salaryRoles.slice(0, limit);

  return salaryRoles
    .map((role) => ({ role, score: searchScore(role, normalisedQuery) }))
    .filter((match) => Number.isFinite(match.score))
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.role.title.localeCompare(b.role.title, "en-GB"),
    )
    .slice(0, limit)
    .map((match) => match.role);
}

export function getSalaryRole(slug: string) {
  return salaryRoles.find((role) => role.slug === slug);
}

