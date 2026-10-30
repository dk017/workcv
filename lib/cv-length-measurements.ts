// Measured, not estimated: realistic CV content was rendered through
// WorkCV's production PDF path (headless Chrome, A4, print styles) and the
// words were counted from the PDF text with PDF.js. Each role had four
// bullet points of 13–16 words plus a title line; the profile, education
// and skills sections were the same fictional sample in every run.
export const cvLengthMeasurement = {
  measuredOn: "29 September 2026",
  method:
    "Fictional CVs with one to fourteen roles (four bullet points each) printed to A4 PDF in each WorkCV design at its standard print size, then counted with PDF.js.",
  designs: [
    { name: "Classic", onePageMax: 292, twoPageMax: 838, thirdPageFrom: 903 },
    { name: "Modern", onePageMax: 363, twoPageMax: 771, thirdPageFrom: 839 },
    { name: "Compact", onePageMax: 292, twoPageMax: 699, thirdPageFrom: 770 },
  ],
} as const;
