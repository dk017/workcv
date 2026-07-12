import type { TemplateId } from "@/lib/editor-data";

type NameTypography = {
  previewPx: number;
  printPt: number;
  emergencyBreak: boolean;
};

function estimatedWordWidthEm(word: string) {
  const genericWidth = Array.from(word).reduce((width, character) => {
    if (/[MW@%&]/.test(character)) return width + 0.95;
    if (/[A-Z]/.test(character)) return width + 0.7;
    if (/[ilI1'.,-]/.test(character)) return width + 0.32;
    return width + 0.54;
  }, 0);

  // Fraunces display glyphs are wider than common sans-serif metrics.
  return genericWidth * 1.18;
}

function fitFont(max: number, min: number, availableWidth: number, wordWidthEm: number) {
  if (wordWidthEm <= 0) return max;
  return Math.round(Math.max(min, Math.min(max, availableWidth / wordWidthEm)) * 10) / 10;
}

export function getCvNameTypography(name: string, template: TemplateId): NameTypography {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const longestWordWidth = Math.max(0, ...words.map(estimatedWordWidthEm));

  if (template === "modern") {
    return {
      previewPx: fitFont(28, 21, 174, longestWordWidth),
      printPt: fitFont(18, 14, 136, longestWordWidth),
      emergencyBreak: longestWordWidth * 21 > 174,
    };
  }

  if (template === "compact") {
    return {
      previewPx: fitFont(27, 22, 245, longestWordWidth),
      printPt: fitFont(20, 16, 184, longestWordWidth),
      emergencyBreak: longestWordWidth * 22 > 245,
    };
  }

  return {
    previewPx: fitFont(38, 30, 680, longestWordWidth),
    printPt: fitFont(28, 22, 510, longestWordWidth),
    emergencyBreak: longestWordWidth * 30 > 680,
  };
}
