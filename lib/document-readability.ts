export type ExtractedPage = { number: number; text: string };
export function documentReadability(pages: ExtractedPage[]) {
  const text = pages.map((page) => page.text).join("\n\n");
  const warnings: string[] = [];
  const emptyPages = pages.filter((page) => page.text.trim().length < 20).map((page) => page.number);
  if (emptyPages.length) warnings.push("Little or no selectable text on page(s) " + emptyPages.join(", ") + ". This may be an image, a blank page or unsupported text. Re-export from the original document; OCR is not included.");
  if (/\uFFFD/.test(text)) warnings.push("Some characters could not be decoded. Check names, dates and qualifications against the original.");
  if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) warnings.push("No email address was found in extracted text. Confirm contact details are selectable.");
  if (!/experience|employment|education|qualification|projects/i.test(text)) warnings.push("Common section headings were not found. Check whether your headings appear in the extracted text.");
  return { text, warnings, emptyPages, wordCount: text.trim() ? text.trim().split(/\s+/).length : 0 };
}

// Inspect ZIP directory declarations before DOCX decompression. Reject encrypted,
// oversized and ZIP64 archives rather than expanding unbounded user input.
export function validateDocxArchive(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let end = -1;
  for (let i = view.byteLength - 22; i >= Math.max(0, view.byteLength - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error("This is not a readable DOCX archive.");
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  if (count > 1000 || offset === 0xffffffff) throw new Error("This DOCX is too complex. Export a simpler copy.");
  let total = 0;
  for (let i = 0; i < count; i++) {
    if (offset + 46 > view.byteLength || view.getUint32(offset, true) !== 0x02014b50) throw new Error("The DOCX archive is damaged.");
    if (view.getUint16(offset + 8, true) & 1) throw new Error("Password-protected DOCX files are not supported.");
    total += view.getUint32(offset + 24, true);
    if (total > 20 * 1024 * 1024) throw new Error("Expanded DOCX content exceeds the 20 MB safety limit.");
    offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
  }
}
