import type { CvData } from "./editor-data.ts";

export type ReadinessSection =
  | "profile"
  | "experience"
  | "education"
  | "skills";

export type ReadinessIssue = {
  id: string;
  section: ReadinessSection;
  severity: "fix" | "improve";
  message: string;
};

function hasUsefulProfile(profile: string) {
  return profile.trim().length >= 40 && profile.trim().split(/\s+/).length >= 8;
}

function hasContact(cv: CvData) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email.trim()) ||
    cv.phone.replace(/\D/g, "").length >= 7 ||
    /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(cv.linkedin.trim())
  );
}

function hasAnyValue(item: object) {
  return Object.entries(item).some(
    ([key, value]) => key !== "id" && typeof value === "string" && value.trim(),
  );
}

function completeExperience(cv: CvData) {
  return cv.experience.some(
    (item) =>
      item.role.trim() &&
      item.company.trim() &&
      item.start.trim() &&
      item.bullets.trim(),
  );
}

function completeEducation(cv: CvData) {
  return cv.education.some(
    (item) =>
      item.qualification.trim() &&
      item.institution.trim() &&
      (item.start.trim() || item.end.trim()),
  );
}

export function calculateCvReadiness(cv: CvData) {
  const issues: ReadinessIssue[] = [];
  const profileReady = Boolean(cv.fullName.trim()) && hasContact(cv);
  if (!profileReady) {
    issues.push({
      id: "contact",
      section: "profile",
      severity: "fix",
      message: "Add your name and at least one valid contact method.",
    });
  }
  if (!hasUsefulProfile(cv.profile)) {
    issues.push({
      id: "profile",
      section: "profile",
      severity: "fix",
      message: "Write a useful profile of at least 8 words.",
    });
  }

  const experienceReady = completeExperience(cv);
  const educationReady = completeEducation(cv);
  if (!experienceReady && !educationReady) {
    issues.push({
      id: "history",
      section: experienceReady ? "education" : "experience",
      severity: "fix",
      message: "Complete at least one experience or education entry.",
    });
  }

  const skills = cv.skills
    .split(/\r?\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  if (skills.length < 3) {
    issues.push({
      id: "skills",
      section: "skills",
      severity: "fix",
      message: "Add at least three relevant skills.",
    });
  }

  const invalidExperience = cv.experience.some((item) => {
    if (!hasAnyValue(item)) return false;
    return !item.role.trim() || !item.company.trim() || !item.start.trim();
  });
  if (invalidExperience) {
    issues.push({
      id: "experience-fields",
      section: "experience",
      severity: "fix",
      message: "Finish or remove incomplete experience entries.",
    });
  }

  const invalidEducation = cv.education.some((item) => {
    if (!hasAnyValue(item)) return false;
    return (
      !item.qualification.trim() ||
      !item.institution.trim() ||
      (!item.start.trim() && !item.end.trim())
    );
  });
  if (invalidEducation) {
    issues.push({
      id: "education-fields",
      section: "education",
      severity: "fix",
      message: "Finish or remove incomplete education entries.",
    });
  }

  const rules = [
    profileReady,
    hasUsefulProfile(cv.profile),
    experienceReady || educationReady,
    skills.length >= 3,
    !invalidExperience && !invalidEducation,
  ];

  const profileWords = cv.profile.trim().split(/\s+/).filter(Boolean).length;
  if (profileWords > 100) issues.push({ id: "profile-length", section: "profile", severity: "improve", message: `Shorten the profile from ${profileWords} words to 100 or fewer.` });
  if (!cv.targetRole.trim()) issues.push({ id: "target-role", section: "profile", severity: "improve", message: "Add a specific target role so the CV has a clear direction." });
  cv.experience.forEach((item, index) => {
    const bullets = item.bullets.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (item.role.trim() && bullets.length < 2) issues.push({ id: `bullets-${item.id}`, section: "experience", severity: "improve", message: `Add at least two evidence-led bullets to role ${index + 1}.` });
    if (bullets.length && !bullets.some((bullet) => /\d|£|%/.test(bullet))) issues.push({ id: `evidence-${item.id}`, section: "experience", severity: "improve", message: `Add a number, scale or measurable outcome to role ${index + 1} where truthful.` });
  });
  const fixes = issues.filter((issue) => issue.severity === "fix");
  return {
    ready: fixes.length === 0,
    score: Math.round((rules.filter(Boolean).length / rules.length) * 100),
    issues,
    fixCount: fixes.length,
    improvementCount: issues.length - fixes.length,
    nextSection: issues[0]?.section || null,
  };
}
