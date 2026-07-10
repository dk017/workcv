import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { coverLetterTemplateText } from "@/lib/cover-letter-template";

export const runtime = "nodejs";

export async function GET() {
  const lines = coverLetterTemplateText(false).split("\n");
  const document = new Document({
    sections: [{
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children: lines.map((line, index) => new Paragraph({
        heading: index === 0 ? HeadingLevel.TITLE : undefined,
        spacing: line ? { after: 160 } : { after: 80 },
        children: [new TextRun({ text: line, color: line.startsWith("[") ? "667085" : "172B4D", size: index === 0 ? 30 : 22, bold: line.startsWith("Re:") })],
      })),
    }],
  });
  const buffer = await Packer.toBuffer(document);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="workcv-cover-letter-template-uk.docx"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
