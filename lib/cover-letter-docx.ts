import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import {
  coverLetterBody,
  coverLetterFor,
  coverLetterGreeting,
  coverLetterSignOff,
  coverLetterSubject,
  formatUkLetterDate,
  recipientBlock,
} from "./cover-letter-document.ts";
import { FONT, INK, MUTED, NAVY, PAGE, clean } from "./cv-docx.ts";
import type { CvData } from "./editor-data.ts";

function line(text: string, options: { bold?: boolean; color?: string; after?: number } = {}) {
  return new Paragraph({
    spacing: { after: options.after ?? 0 },
    children: [new TextRun({ text, bold: options.bold, color: options.color })],
  });
}

export function buildCoverLetterDocxDocument(cv: CvData, date = new Date()) {
  const letter = coverLetterFor(cv);
  const fullName = clean(cv.fullName);
  const contact = [cv.email, cv.phone, cv.location, cv.linkedin].map(clean).filter(Boolean);
  const children: Paragraph[] = [];

  // Same header as the Word CV so the two files read as a set.
  if (fullName) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: fullName, bold: true, size: 40, color: NAVY })],
    }));
  }
  if (contact.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 8 } },
      children: [new TextRun({ text: contact.join(" | "), color: MUTED })],
    }));
  }

  if (letter.includeDate) children.push(line(formatUkLetterDate(date), { after: 240 }));

  const recipient = recipientBlock(letter).map(clean).filter(Boolean);
  recipient.forEach((text, index) => children.push(line(text, { after: index === recipient.length - 1 ? 240 : 0 })));

  const subject = clean(coverLetterSubject(letter));
  if (subject) children.push(line(subject, { bold: true, color: NAVY, after: 240 }));

  children.push(line(coverLetterGreeting(letter), { after: 200 }));
  coverLetterBody(letter).map(clean).filter(Boolean).forEach((paragraph) => {
    children.push(new Paragraph({ spacing: { after: 200, line: 300 }, children: [new TextRun({ text: paragraph })] }));
  });
  children.push(line(coverLetterSignOff(letter), { after: fullName ? 480 : 0 }));
  if (fullName) children.push(line(fullName, { bold: true }));

  return new Document({
    creator: "WorkCV",
    title: fullName ? `${fullName} cover letter` : "Cover letter",
    styles: {
      default: {
        document: { run: { font: FONT, size: 22, color: INK } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE.width, height: PAGE.height },
            margin: { top: 1000, right: 1134, bottom: 1000, left: 1134 },
          },
        },
        children,
      },
    ],
  });
}

export async function renderCoverLetterDocx(cv: CvData, date = new Date()) {
  return Packer.toBuffer(buildCoverLetterDocxDocument(cv, date));
}
