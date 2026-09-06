import { retailAdminCv } from "./content-cv-examples.ts";

// Editorial classifications for a reproducible demonstration, not a saved live AI response.
// Feed these through the production scorer; never present them as independent hiring evidence.
export const checkerExampleInput = {
  cvText: retailAdminCv,
  jobDescription: `Office administrator at Birch Office Services (fictional vacancy).
Maintain accurate spreadsheet records using Microsoft Excel, reply to customer emails and coordinate weekly schedules. We need clear written handovers and careful checking of order information. Experience using Sage accounting software is essential for this illustrative vacancy.`,
};
export const checkerExampleClassification = {
  targetRole: "Office administrator", communicatedRole: "Retail supervisor moving into office administration",
  seniority: "mid-level", roleClarity: "clear", evidenceQuality: "mixed",
  requirements: [
    { requirement: "Maintain accurate spreadsheet records using Microsoft Excel", status: "supported", cvEvidence: "Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.", explanation: "The delivery-tracker bullet gives a specific example of checking spreadsheet records." },
    { requirement: "Reply to customer emails", status: "supported", cvEvidence: "Replied to customer order enquiries by email, recording the agreed next step in the order log.", explanation: "Email replies and the associated record are evidenced in the current role." },
    { requirement: "Coordinate weekly schedules", status: "supported", cvEvidence: "Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.", explanation: "The rota provides a directly relevant scheduling example." },
    { requirement: "Experience using Sage accounting software", status: "not-evidenced", cvEvidence: null, explanation: "The CV supplies no evidence of using Sage. Excel experience is not evidence of Sage competence." },
  ],
  vaguePhrases: [],
  priorities: [
    { category: "vacancy-relevance", title: "Check the essential software requirement", action: "This CV does not evidence Sage. Clarify the employer's requirement; do not insert the software name as a claimed skill." },
    { category: "evidence", title: "Explain the effect of accurate records", action: "If you can verify it, add what your checking helped the team do. Keep the current process evidence if no reliable outcome is available." },
    { category: "role-clarity", title: "Keep the career-change direction explicit", action: "Retain Office administrator as the target role and Retail supervisor as the actual job title. Make the transfer clear without changing your history." },
  ],
} as const;
