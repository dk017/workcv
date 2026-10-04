import type { CvData } from "./editor-data.ts";

export type ReadinessSection =
  | "profile"
  | "experience"
  | "education"
  | "skills";

export type ReadinessAction = "improve-profile" | "suggest-skills" | "improve-bullets";

export type ReadinessIssue = {
  id: string;
  section: ReadinessSection;
  severity: "fix" | "improve";
  message: string;
  /** AI-assisted fix the editor can run for this issue; absent means "go to the section". */
  action?: ReadinessAction;
  /** Experience entry the action applies to. */
  targetId?: string;
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
      action: "improve-profile",
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
      action: "suggest-skills",
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
  if (profileWords > 100) issues.push({ id: "profile-length", section: "profile", severity: "improve", message: `Shorten the profile from ${profileWords} words to 100 or fewer.`, action: "improve-profile" });
  if (!cv.targetRole.trim()) issues.push({ id: "target-role", section: "profile", severity: "improve", message: "Add a specific target role so the CV has a clear direction." });
  cv.experience.forEach((item, index) => {
    const bullets = item.bullets.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (item.role.trim() && bullets.length < 2) issues.push({ id: `bullets-${item.id}`, section: "experience", severity: "improve", message: `Add at least two evidence-led bullets to role ${index + 1}.`, action: "improve-bullets", targetId: item.id });
    if (bullets.length && !bullets.some((bullet) => /\d|£|%/.test(bullet))) issues.push({ id: `evidence-${item.id}`, section: "experience", severity: "improve", message: `Add a number, scale or measurable outcome to role ${index + 1} where truthful.`, action: "improve-bullets", targetId: item.id });
  });
  const dateValues = [
    ...cv.experience.flatMap((item) => [item.start, item.end]),
    ...cv.education.flatMap((item) => [item.start, item.end]),
  ].map((value) => value.trim());
  const wordDates = dateValues.filter((value) => /^[a-z]{3,9}\.?\s+(19|20)\d{2}$/i.test(value));
  const numericDates = dateValues.filter((value) => /^(0?[1-9]|1[0-2])\/(19|20)\d{2}$/.test(value));
  if (wordDates.length > 0 && numericDates.length > 0) {
    issues.push({
      id: "dates-format",
      section: "experience",
      severity: "improve",
      message: `Dates use mixed formats (for example ${wordDates[0]} and ${numericDates[0]}). Pick one format throughout.`,
    });
  }
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
