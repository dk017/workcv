import { pageContentHeightPx, type CvDesign } from "@/lib/cv-design";

// Blocks the PDF never splits across pages (see break-inside in globals.css).
const unbreakable = ".cv-header, .cv-entry, .cv-skills-list li, .letter-paragraph";

/**
 * Predicts how many pages the PDF of a rendered CV or letter will have. The preview uses the
 * same measurements as the PDF, so this replays the PDF's pagination: content flows down pages
 * of the printable height, and a block that would straddle a page break moves to the next page.
 * Side-by-side columns (Modern's sidebar, Compact's skills column) paginate independently.
 */
export function predictPdfPages(document: HTMLElement, design?: CvDesign) {
  const pageHeight = pageContentHeightPx(design);
  const previousMinHeight = document.style.minHeight;
  // On screen the sheet has a one-page minimum height; the PDF does not.
  document.style.minHeight = "0px";
  try {
    const box = document.getBoundingClientRect();
    // Previews are shrunk with CSS zoom; measure in the document's own unzoomed pixels.
    const scale = document.offsetWidth ? box.width / document.offsetWidth : 1;
    const pushedByColumn = new Map<Element, number>();
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(unbreakable)).filter(
      (block) => !block.parentElement?.closest(unbreakable),
    );
    for (const block of blocks) {
      const rect = block.getBoundingClientRect();
      const blockHeight = rect.height / scale;
      if (blockHeight === 0 || blockHeight > pageHeight) continue;
      const column = block.closest("aside, main, .cv-compact-body > *") ?? document;
      const pushed = pushedByColumn.get(column) ?? 0;
      const start = (rect.top - box.top) / scale + pushed;
      const pageEnd = (Math.floor(start / pageHeight) + 1) * pageHeight;
      if (start + blockHeight > pageEnd + 0.5) pushedByColumn.set(column, pushed + pageEnd - start);
    }
    const pushed = Math.max(0, ...Array.from(pushedByColumn.values()));
    return Math.max(1, Math.ceil((box.height / scale + pushed - 0.5) / pageHeight));
  } finally {
    document.style.minHeight = previousMinHeight;
  }
}
