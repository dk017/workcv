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
import { INK, MUTED, NAVY, clean } from "./cv-docx.ts";
import type { CvData } from "./editor-data.ts";
import { wordDesign } from "./cv-design.ts";

function line(text: string, options: { bold?: boolean; color?: string; after?: number } = {}) {
  return new Paragraph({
    spacing: { after: options.after ?? 0 },
    children: [new TextRun({ text, bold: options.bold, color: options.color })],
  });
}

export function buildCoverLetterDocxDocument(cv: CvData, date = new Date()) {
  const w = wordDesign(cv.design);
  const accent = w.accent ?? NAVY;
  const letter = coverLetterFor(cv);
  const fullName = clean(cv.fullName);
  const contact = [cv.email, cv.phone, cv.location, cv.linkedin].map(clean).filter(Boolean);
  const children: Paragraph[] = [];

  // Same header as the Word CV so the two files read as a set.
  if (fullName) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: fullName, bold: true, size: w.size(40), color: accent })],
    }));
  }
  if (contact.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 8 } },
      children: [new TextRun({ text: contact.join(" | "), color: MUTED })],
    }));
  }

  if (letter.includeDate) children.push(line(formatUkLetterDate(date), { after: 240 }));

  const recipient = recipientBlock(letter).map(clean).filter(Boolean);
  recipient.forEach((text, index) => children.push(line(text, { after: index === recipient.length - 1 ? 240 : 0 })));

  const subject = clean(coverLetterSubject(letter));
  if (subject) children.push(line(subject, { bold: true, color: accent, after: 240 }));

  children.push(line(coverLetterGreeting(letter), { after: 200 }));
  coverLetterBody(letter).map(clean).filter(Boolean).forEach((paragraph) => {
    children.push(new Paragraph({ spacing: { after: 200, line: w.line ? Math.round(300 * (w.line / 240)) : 300 }, children: [new TextRun({ text: paragraph })] }));
  });
  children.push(line(coverLetterSignOff(letter), { after: fullName ? 480 : 0 }));
  if (fullName) children.push(line(fullName, { bold: true }));

  return new Document({
    creator: "WorkCV",
    title: fullName ? `${fullName} cover letter` : "Cover letter",
    styles: {
      default: {
        document: { run: { font: w.font, size: w.size(22), color: INK } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: w.page,
            margin: { top: w.margin(1000), right: w.margin(1134), bottom: w.margin(1000), left: w.margin(1134) },
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
