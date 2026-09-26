import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from "docx";

import {
  cvSectionLabels,
  lines,
  orderedCvSections,
  type CvData,
  type EducationItem,
  type ExperienceItem,
} from "./editor-data.ts";

// A4 in twentieths of a point, with 1.5cm margins. The Word file is always a
// single-column layout: sidebars and grids break ATS parsing and are awkward to
// edit in Word, so every template exports to the same clean structure.
export const PAGE = { width: 11906, height: 16838, margin: 850 };
export const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;
export const NAVY = "12324A";
export const INK = "20262C";
export const MUTED = "5B6670";
export const FONT = "Arial";

// Characters that are invalid in XML 1.0 make Word refuse to open the file.
export function clean(value: string | undefined) {
  return (value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "").trim();
}

function sectionHeading(text: string) {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 2 } },
    keepNext: true,
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: NAVY, size: 22, characterSpacing: 20 })],
  });
}

function bodyParagraph(text: string, after = 80) {
  return new Paragraph({ spacing: { after }, children: [new TextRun({ text })] });
}

function bulletParagraph(text: string) {
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text })] });
}

function entryParagraphs(input: {
  title: string;
  subtitle: string;
  dates: string;
  bullets: string[];
  details: string[];
  first: boolean;
}) {
  const heading = new Paragraph({
    spacing: { before: input.first ? 0 : 200, after: 20 },
    keepNext: true,
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    children: [
      new TextRun({ text: input.title, bold: true, color: NAVY }),
      ...(input.dates ? [new TextRun({ text: `\t${input.dates}`, color: MUTED })] : []),
    ],
  });
  const paragraphs = [heading];
  if (input.subtitle) {
    paragraphs.push(new Paragraph({
      spacing: { after: 60 },
      keepNext: input.bullets.length > 0 || input.details.length > 0,
      children: [new TextRun({ text: input.subtitle, bold: true })],
    }));
  }
  paragraphs.push(...input.bullets.map(bulletParagraph));
  paragraphs.push(...input.details.map((line) => bodyParagraph(line, 40)));
  return paragraphs;
}

function joinParts(...parts: string[]) {
  return parts.map(clean).filter(Boolean);
}

function hasExperience(item: ExperienceItem) {
  return joinParts(item.role, item.company, item.location, item.start, item.end, item.bullets).length > 0;
}

function hasEducation(item: EducationItem) {
  return joinParts(item.qualification, item.institution, item.location, item.start, item.end, item.details).length > 0;
}

function experienceSection(cv: CvData) {
  const items = cv.experience.filter(hasExperience);
  if (!items.length) return [];
  return [
    sectionHeading(cvSectionLabels.experience),
    ...items.flatMap((item, index) => entryParagraphs({
      title: clean(item.role) || clean(item.company),
      subtitle: joinParts(item.role ? item.company : "", item.location).join(" | "),
      dates: joinParts(item.start, item.end).join(" - "),
      bullets: lines(clean(item.bullets)),
      details: [],
      first: index === 0,
    })),
  ];
}

function educationSection(cv: CvData) {
  const items = cv.education.filter(hasEducation);
  if (!items.length) return [];
  return [
    sectionHeading(cvSectionLabels.education),
    ...items.flatMap((item, index) => entryParagraphs({
      title: clean(item.qualification) || clean(item.institution),
      subtitle: joinParts(item.qualification ? item.institution : "", item.location).join(" | "),
      dates: joinParts(item.start, item.end).join(" - "),
      bullets: [],
      details: lines(clean(item.details)),
      first: index === 0,
    })),
  ];
}

export function buildCvDocxDocument(cv: CvData) {
  const fullName = clean(cv.fullName);
  const contact = joinParts(cv.email, cv.phone, cv.location, cv.linkedin);
  const children: Paragraph[] = [];

  if (fullName) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: fullName, bold: true, size: 40, color: NAVY })],
    }));
  }
  if (clean(cv.targetRole)) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: clean(cv.targetRole), bold: true, size: 24 })],
    }));
  }
  if (contact.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: contact.join(" | "), color: MUTED })],
    }));
  }

  for (const section of orderedCvSections(cv)) {
    if (section === "experience") {
      children.push(...experienceSection(cv));
    } else if (section === "education") {
      children.push(...educationSection(cv));
    } else if (section === "profile") {
      const profile = lines(clean(cv.profile));
      if (profile.length) children.push(sectionHeading(cvSectionLabels.profile), ...profile.map((line) => bodyParagraph(line)));
    } else if (section === "skills") {
      const skills = lines(clean(cv.skills));
      if (skills.length) children.push(sectionHeading(cvSectionLabels.skills), ...skills.map(bulletParagraph));
    } else {
      const extra = lines(clean(cv.additionalSections?.[section]));
      if (extra.length) children.push(sectionHeading(cvSectionLabels[section]), ...extra.map((line) => bodyParagraph(line, 40)));
    }
  }

  return new Document({
    creator: "WorkCV",
    title: fullName ? `${fullName} CV` : "CV",
    styles: {
      default: {
        document: { run: { font: FONT, size: 21, color: INK } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE.width, height: PAGE.height },
            margin: { top: PAGE.margin, right: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin },
          },
        },
        children,
      },
    ],
  });
}

export async function renderCvDocx(cv: CvData) {
  return Packer.toBuffer(buildCvDocxDocument(cv));
}

export function cvDownloadFilename(fullName: string, extension: "pdf" | "docx", kind: "cv" | "cover-letter" = "cv") {
  const base = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "workcv"}-${kind}.${extension}`;
}
