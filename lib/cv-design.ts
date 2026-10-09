// Design settings a user can set on the Finish step. Every field is optional: a CV without
// settings looks exactly as it always has. The PDF and the Word file read the same settings.

export const cvFonts = {
  // Today's look: DM Sans with the name in Fraunces. Word uses Arial, as it always has.
  workcv: { label: "WorkCV", body: "var(--font-dm-sans), Arial, sans-serif", name: "var(--font-fraunces), Georgia, serif", word: "Arial" },
  // The PDF uses a free font with the same measurements as the Word font, so line breaks match.
  calibri: { label: "Calibri", body: "var(--font-carlito), Calibri, sans-serif", name: "var(--font-carlito), Calibri, sans-serif", word: "Calibri" },
  cambria: { label: "Cambria", body: "var(--font-caladea), Cambria, serif", name: "var(--font-caladea), Cambria, serif", word: "Cambria" },
  arial: { label: "Arial", body: "var(--font-arimo), Arial, sans-serif", name: "var(--font-arimo), Arial, sans-serif", word: "Arial" },
  georgia: { label: "Georgia", body: "var(--font-gelasio), Georgia, serif", name: "var(--font-gelasio), Georgia, serif", word: "Georgia" },
  garamond: { label: "Garamond", body: "var(--font-eb-garamond), Garamond, serif", name: "var(--font-eb-garamond), Garamond, serif", word: "Garamond" },
} as const;
export type CvFont = keyof typeof cvFonts;
export const cvFontIds = Object.keys(cvFonts) as CvFont[];

// Text size as a percentage of each template's own sizes.
export const cvSizeRange = { min: 85, max: 115, step: 5, default: 100 } as const;

export const cvLeading = { compact: 0.92, normal: 1, relaxed: 1.1 } as const;
export const cvSpacing = { tight: 0.7, normal: 1, relaxed: 1.3 } as const;
export const cvMargins = { narrow: 0.75, normal: 1, wide: 1.25 } as const;
export type CvLeading = keyof typeof cvLeading;
export type CvSpacing = keyof typeof cvSpacing;
export type CvMargins = keyof typeof cvMargins;

export const cvPapers = {
  a4: { label: "A4", widthMm: 210, heightMm: 297 },
  letter: { label: "US Letter", widthMm: 215.9, heightMm: 279.4 },
} as const;
export type CvPaper = keyof typeof cvPapers;

export const cvAccents = {
  navy: { label: "Navy", hex: "#0F2942" },
  forest: { label: "Forest green", hex: "#1F5C3B" },
  burgundy: { label: "Burgundy", hex: "#7A2632" },
  charcoal: { label: "Charcoal", hex: "#2F3437" },
} as const;
export type CvAccent = keyof typeof cvAccents;

export type CvDesign = {
  font?: CvFont;
  size?: number;
  leading?: CvLeading;
  spacing?: CvSpacing;
  margins?: CvMargins;
  paper?: CvPaper;
  accent?: CvAccent;
};

export type ResolvedCvDesign = Required<CvDesign>;

export const defaultCvDesign: ResolvedCvDesign = {
  font: "workcv",
  size: cvSizeRange.default,
  leading: "normal",
  spacing: "normal",
  margins: "normal",
  paper: "a4",
  accent: "navy",
};

export function clampCvSize(size: number) {
  const stepped = Math.round(size / cvSizeRange.step) * cvSizeRange.step;
  return Math.min(cvSizeRange.max, Math.max(cvSizeRange.min, stepped));
}

export function resolveCvDesign(design?: CvDesign | null): ResolvedCvDesign {
  return {
    font: design?.font && design.font in cvFonts ? design.font : defaultCvDesign.font,
    size: typeof design?.size === "number" ? clampCvSize(design.size) : defaultCvDesign.size,
    leading: design?.leading && design.leading in cvLeading ? design.leading : defaultCvDesign.leading,
    spacing: design?.spacing && design.spacing in cvSpacing ? design.spacing : defaultCvDesign.spacing,
    margins: design?.margins && design.margins in cvMargins ? design.margins : defaultCvDesign.margins,
    paper: design?.paper && design.paper in cvPapers ? design.paper : defaultCvDesign.paper,
    accent: design?.accent && design.accent in cvAccents ? design.accent : defaultCvDesign.accent,
  };
}

export function isDefaultCvDesign(design?: CvDesign | null) {
  const resolved = resolveCvDesign(design);
  return (Object.keys(defaultCvDesign) as Array<keyof ResolvedCvDesign>).every((key) => resolved[key] === defaultCvDesign[key]);
}

/** Only the settings that differ from the default, or undefined when nothing does, so saved
 * CVs carry no design data until the user changes something. */
export function minimalCvDesign(design?: CvDesign | null): CvDesign | undefined {
  const resolved = resolveCvDesign(design);
  const changed = (Object.keys(defaultCvDesign) as Array<keyof ResolvedCvDesign>).filter((key) => resolved[key] !== defaultCvDesign[key]);
  if (changed.length === 0) return undefined;
  return Object.fromEntries(changed.map((key) => [key, resolved[key]])) as CvDesign;
}

// Every custom property cvDesignStyle can set.
export const cvDesignVariables = ["--cv-font", "--cv-name-font", "--cv-scale", "--cv-leading", "--cv-gap", "--cv-margin", "--cv-page-width", "--cv-accent"] as const;

/** CSS custom properties for a CV or letter document. Empty for the default design, so
 * existing CVs render from the stylesheet's own fallbacks, byte for byte as before. */
export function cvDesignStyle(design?: CvDesign | null): Record<string, string> {
  if (!design || isDefaultCvDesign(design)) return {};
  const resolved = resolveCvDesign(design);
  const style: Record<string, string> = {};
  if (resolved.font !== "workcv") {
    style["--cv-font"] = cvFonts[resolved.font].body;
    style["--cv-name-font"] = cvFonts[resolved.font].name;
  }
  if (resolved.size !== 100) style["--cv-scale"] = String(resolved.size / 100);
  if (resolved.leading !== "normal") style["--cv-leading"] = String(cvLeading[resolved.leading]);
  if (resolved.spacing !== "normal") style["--cv-gap"] = String(cvSpacing[resolved.spacing]);
  if (resolved.margins !== "normal") style["--cv-margin"] = String(cvMargins[resolved.margins]);
  if (resolved.paper !== "a4") style["--cv-page-width"] = `${cvPapers[resolved.paper].widthMm}mm`;
  if (resolved.accent !== "navy") style["--cv-accent"] = cvAccents[resolved.accent].hex;
  return style;
}

const MM_TO_PX = 96 / 25.4;
// The PDF prints with 8mm top and bottom page margins (see @page in globals.css).
export const pdfPageMarginMm = 8;

export function pageWidthPx(design?: CvDesign | null) {
  return Math.round(cvPapers[resolveCvDesign(design).paper].widthMm * MM_TO_PX);
}

/** Height of one printed page's content area in CSS pixels. */
export function pageContentHeightPx(design?: CvDesign | null) {
  return (cvPapers[resolveCvDesign(design).paper].heightMm - pdfPageMarginMm * 2) * MM_TO_PX;
}

/** The order "Fit to N pages" tries, from least to most noticeable. Each entry is a full design. */
export function fitCandidates(design?: CvDesign | null): ResolvedCvDesign[] {
  const start = resolveCvDesign(design);
  const candidates: ResolvedCvDesign[] = [];
  let current = { ...start };
  const push = (change: Partial<ResolvedCvDesign>) => {
    current = { ...current, ...change };
    candidates.push(current);
  };
  for (let size = start.size - cvSizeRange.step; size >= 90; size -= cvSizeRange.step) push({ size });
  if (current.spacing !== "tight") push({ spacing: "tight" });
  if (current.leading !== "compact") push({ leading: "compact" });
  if (current.margins !== "narrow") push({ margins: "narrow" });
  for (let size = current.size - cvSizeRange.step; size >= cvSizeRange.min; size -= cvSizeRange.step) push({ size });
  return candidates;
}

const wordPapers = { a4: { width: 11906, height: 16838 }, letter: { width: 12240, height: 15840 } } as const;

/** The same settings in Word units (half-points and twentieths of a point). The default design
 * gives exactly the values the Word files have always used. */
export function wordDesign(design?: CvDesign | null) {
  const resolved = resolveCvDesign(design);
  const scale = resolved.size / 100;
  const gap = cvSpacing[resolved.spacing];
  const margin = cvMargins[resolved.margins];
  return {
    font: cvFonts[resolved.font].word,
    size: (halfPoints: number) => Math.round(halfPoints * scale),
    gap: (twips: number) => Math.round(twips * gap),
    margin: (twips: number) => Math.round(twips * margin),
    // Single spacing (240) unless the user changed line spacing; undefined keeps Word's default.
    line: resolved.leading === "normal" ? undefined : Math.round(240 * cvLeading[resolved.leading]),
    page: wordPapers[resolved.paper],
    accent: resolved.accent === "navy" ? null : cvAccents[resolved.accent].hex.slice(1),
  };
}
export type WordDesign = ReturnType<typeof wordDesign>;
