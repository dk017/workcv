import type { CvData } from "./editor-data";
import { retailAdminCv } from "./content-cv-examples";

// One source text drives both the guide and the real CvDocument rendering.
const section = (heading: string) => retailAdminCv.split(`\n${heading}\n`)[1].split(/\n\n[A-Z ]+\n/)[0];
export const retailAdminDocument: CvData = {
  template: "classic", fullName: "Alex Morgan", targetRole: "Office administrator",
  email: "alex.morgan@example.com", phone: "07700 900123", location: "Leeds", linkedin: "",
  profile: section("PROFILE"),
  skills: `${section("KEY SKILLS").split("; ").join("\n")}\n${section("ADDITIONAL INFORMATION")}`,
  experience: section("EXPERIENCE").split("\n\n").map((block, i) => {
    const [header, ...bullets] = block.split("\n");
    const [role, employer, dates] = header.split(" | ");
    const [company, location] = employer.split(", ");
    const [start, end] = dates.split(" - ");
    return { id: `content-experience-${i}`, role, company, location, start, end, bullets: bullets.map(b => b.replace(/^• /, "")).join("\n") };
  }),
  education: section("EDUCATION").split("\n").map((line, i) => {
    const [qualification, institution, dates] = line.split(" | ");
    const datesParts = dates.split(" - ");
    return { id: `content-education-${i}`, qualification, institution, location: "", start: datesParts.length > 1 ? datesParts[0] : "", end: datesParts.at(-1)!, details: "" };
  }),
};
