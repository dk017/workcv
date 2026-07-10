import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export const runtime = "nodejs";

function placeholder(text: string) {
  return new TextRun({ text, color: "66717D", italics: true });
}

function sectionHeading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, color: "12324A", size: 24 })],
  });
}

function bullet(text: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [placeholder(text)],
  });
}

export async function GET() {
  const document = new Document({
    creator: "WorkCV",
    title: "Blank UK CV Template",
    description: "A simple single-column UK CV template for Microsoft Word.",
    styles: {
      default: {
        document: { run: { font: "Arial", size: 22, color: "20262C" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, right: 900, bottom: 900, left: 900 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "YOUR NAME", bold: true, size: 38, color: "12324A" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [placeholder("Town or city | 07xxx xxxxxx | you@example.com | linkedin.com/in/yourname")],
          }),
          sectionHeading("PERSONAL PROFILE"),
          new Paragraph({ children: [placeholder("Write 3 to 4 concise lines that identify your relevant background, strongest evidence and target role.")] }),
          sectionHeading("KEY SKILLS"),
          bullet("Relevant skill or tool, with context"),
          bullet("Relevant skill or tool, with context"),
          bullet("Relevant skill or tool, with context"),
          sectionHeading("WORK EXPERIENCE"),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "JOB TITLE | EMPLOYER", bold: true }), placeholder(" | Month Year - Present")] }),
          bullet("Start with a strong action and explain what you did, how you did it and why it mattered."),
          bullet("Add a truthful result or scale where available, such as volume, time, quality, money or percentage change."),
          bullet("Prioritise evidence that matches the role you are applying for."),
          new Paragraph({ spacing: { before: 140, after: 60 }, children: [new TextRun({ text: "PREVIOUS JOB TITLE | EMPLOYER", bold: true }), placeholder(" | Month Year - Month Year")] }),
          bullet("Keep older experience concise and relevant."),
          bullet("Use consistent tense and punctuation."),
          sectionHeading("EDUCATION AND QUALIFICATIONS"),
          new Paragraph({ spacing: { after: 70 }, children: [new TextRun({ text: "QUALIFICATION | INSTITUTION", bold: true }), placeholder(" | Year")] }),
          new Paragraph({ children: [placeholder("Add grade or classification only where useful and accurate.")] }),
          sectionHeading("ADDITIONAL INFORMATION"),
          bullet("Relevant certification, language, licence, professional membership or volunteering."),
          sectionHeading("REFERENCES"),
          new Paragraph({ children: [new TextRun({ text: "References available on request." })] }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(document);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="workcv-blank-cv-template-uk.docx"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
