import { pageContentHeightPx, type CvDesign } from "@/lib/cv-design";

// Blocks the PDF never splits across pages (see break-inside in globals.css).
const unbreakable = ".cv-header, .cv-entry, .cv-skills-list li, .letter-paragraph";

export type PdfPagination = {
  /** How many pages the PDF will have. */
  pages: number;
  /** Where each page after the first starts, in the document's own (unzoomed) pixels from its top. */
  breaks: number[];
};

/**
 * Replays the PDF's pagination for a rendered CV or letter. The preview uses the same
 * measurements as the PDF, so content flows down pages of the printable height, and a block
 * that would straddle a page break moves to the next page. Side-by-side columns (Modern's
 * sidebar, Compact's skills column) paginate independently; the breaks shown are those of the
 * column that runs longest, which decides the page count.
 */
export function paginatePdf(document: HTMLElement, design?: CvDesign): PdfPagination {
  const pageHeight = pageContentHeightPx(design);
  const previousMinHeight = document.style.minHeight;
  // On screen the sheet has a one-page minimum height; the PDF does not.
  document.style.minHeight = "0px";
  try {
    const box = document.getBoundingClientRect();
    // Previews are shrunk with CSS zoom; measure in the document's own unzoomed pixels.
    const scale = document.offsetWidth ? box.width / document.offsetWidth : 1;
    const height = box.height / scale;
    const columns = new Map<Element, { pushed: number; breaks: Map<number, number> }>();
    const columnOf = (element: Element) => {
      // Only columns inside this document count; the page around it may have its own <main>.
      const found = element === document ? null : element.closest("aside, main, .cv-compact-body > *");
      const column = found && found !== document && document.contains(found) ? found : document;
      if (!columns.has(column)) columns.set(column, { pushed: 0, breaks: new Map() });
      return columns.get(column)!;
    };
    columnOf(document);
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(unbreakable)).filter(
      (block) => !block.parentElement?.closest(unbreakable),
    );
    for (const block of blocks) {
      const rect = block.getBoundingClientRect();
      const blockHeight = rect.height / scale;
      if (blockHeight === 0 || blockHeight > pageHeight) continue;
      const column = columnOf(block);
      const top = (rect.top - box.top) / scale;
      const start = top + column.pushed;
      const page = Math.floor(start / pageHeight);
      // Page boundaries this column has already passed break inside flowing text.
      for (let k = 1; k <= page; k++) if (!column.breaks.has(k)) column.breaks.set(k, k * pageHeight - column.pushed);
      const pageEnd = (page + 1) * pageHeight;
      if (start + blockHeight > pageEnd + 0.5) {
        // The block moves to the next page, which therefore starts at its top. A section's
        // heading is never left alone at the bottom of a page (break-after: avoid), so when the
        // section's first entry moves, its heading moves with it.
        let pageTop = top;
        const section = block.closest("section");
        const heading = section && document.contains(section) ? section.querySelector<HTMLElement>(":scope > h3") : null;
        if (heading && section!.querySelector(unbreakable) === block) {
          const headingTop = (heading.getBoundingClientRect().top - box.top) / scale;
          if (headingTop + column.pushed >= page * pageHeight) pageTop = headingTop;
        }
        column.breaks.set(page + 1, pageTop);
        column.pushed += pageEnd - (pageTop + column.pushed);
      }
    }
    let longest = columns.get(document)!;
    for (const column of Array.from(columns.values())) if (column.pushed > longest.pushed) longest = column;
    const pages = Math.max(1, Math.ceil((height + longest.pushed - 0.5) / pageHeight));
    for (let k = 1; k < pages; k++) if (!longest.breaks.has(k)) longest.breaks.set(k, k * pageHeight - longest.pushed);
    const breaks = Array.from({ length: pages - 1 }, (_, i) => longest.breaks.get(i + 1)!);
    return { pages, breaks };
  } finally {
    document.style.minHeight = previousMinHeight;
  }
}

/** How many pages the PDF of a rendered CV or letter will have. */
export function predictPdfPages(document: HTMLElement, design?: CvDesign) {
  return paginatePdf(document, design).pages;
}
