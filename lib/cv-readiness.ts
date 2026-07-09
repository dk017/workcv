import type { CvData } from "./editor-data.ts";

export type ReadinessSection =
  | "profile"
  | "experience"
  | "education"
  | "skills";

export type ReadinessIssue = {
  section: ReadinessSection;
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
      section: "profile",
      message: "Add your name and at least one valid contact method.",
    });
  }
  if (!hasUsefulProfile(cv.profile)) {
    issues.push({
      section: "profile",
      message: "Write a useful profile of at least 8 words.",
    });
  }

  const experienceReady = completeExperience(cv);
  const educationReady = completeEducation(cv);
  if (!experienceReady && !educationReady) {
    issues.push({
      section: experienceReady ? "education" : "experience",
      message: "Complete at least one experience or education entry.",
    });
  }

  const skills = cv.skills
    .split(/\r?\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  if (skills.length < 3) {
    issues.push({
      section: "skills",
      message: "Add at least three relevant skills.",
    });
  }

  const invalidExperience = cv.experience.some((item) => {
    if (!hasAnyValue(item)) return false;
    return !item.role.trim() || !item.company.trim() || !item.start.trim();
  });
  if (invalidExperience) {
    issues.push({
      section: "experience",
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
      section: "education",
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

  return {
    ready: issues.length === 0,
    score: Math.round((rules.filter(Boolean).length / rules.length) * 100),
    issues,
    nextSection: issues[0]?.section || null,
  };
}
