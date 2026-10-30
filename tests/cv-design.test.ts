import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";

import { renderCoverLetterDocx } from "../lib/cover-letter-docx.ts";
import {
  clampCvSize,
  cvDesignStyle,
  cvDesignVariables,
  defaultCvDesign,
  fitCandidates,
  isDefaultCvDesign,
  minimalCvDesign,
  pageContentHeightPx,
  pageWidthPx,
  resolveCvDesign,
  wordDesign,
} from "../lib/cv-design.ts";
import { renderCvDocx } from "../lib/cv-docx.ts";
import { cvDataSchema, parseCvData } from "../lib/cv-schema.ts";
import { createBlankCv, sampleCv } from "../lib/editor-data.ts";

test("a CV without design settings gets the template's own look", () => {
  assert.deepEqual(resolveCvDesign(undefined), defaultCvDesign);
  assert.deepEqual(cvDesignStyle(undefined), {});
  assert.deepEqual(cvDesignStyle({ font: "workcv", size: 100, paper: "a4" }), {}, "explicit defaults add no CSS");
  assert.equal(isDefaultCvDesign({ accent: "navy" }), true);
});

test("design settings become CSS custom properties", () => {
  const style = cvDesignStyle({ font: "calibri", size: 110, leading: "relaxed", spacing: "tight", margins: "wide", paper: "letter", accent: "forest" });
  assert.match(style["--cv-font"], /--font-carlito/);
  assert.equal(style["--cv-scale"], "1.1");
  assert.equal(style["--cv-leading"], "1.1");
  assert.equal(style["--cv-gap"], "0.7");
  assert.equal(style["--cv-margin"], "1.25");
  assert.equal(style["--cv-page-width"], "215.9mm");
  assert.equal(style["--cv-accent"], "#1F5C3B");
});

test("sizes are clamped to readable steps", () => {
  assert.equal(clampCvSize(40), 85);
  assert.equal(clampCvSize(200), 115);
  assert.equal(clampCvSize(102), 100);
  assert.equal(resolveCvDesign({ size: 300 }).size, 115);
});

test("saved CVs accept valid design settings and reject unknown ones", () => {
  const cv = { ...createBlankCv(), design: { font: "georgia", size: 95, paper: "letter" } };
  assert.equal(cvDataSchema.safeParse(cv).success, true);
  assert.equal(cvDataSchema.safeParse({ ...cv, design: { font: "comic-sans" } }).success, false);
  assert.equal(cvDataSchema.safeParse({ ...cv, design: { size: 60 } }).success, false);
  assert.equal(cvDataSchema.safeParse({ ...cv, design: { font: "arial", colour: "red" } }).success, false, "unknown keys are refused");
  assert.equal(parseCvData(cv).design?.font, "georgia");
});

test("page sizes match A4 and US Letter", () => {
  assert.equal(pageWidthPx(undefined), 794);
  assert.equal(pageWidthPx({ paper: "letter" }), 816);
  assert.ok(Math.abs(pageContentHeightPx(undefined) - 1062) < 1, "A4 less the 8mm print margins top and bottom");
});

test("fit to page only ever makes the CV smaller, and stops at the readable minimum", () => {
  const steps = fitCandidates(undefined);
  assert.ok(steps.length > 3);
  for (let i = 1; i < steps.length; i++) assert.ok(steps[i].size <= steps[i - 1].size);
  const last = steps.at(-1)!;
  assert.equal(last.size, 85);
  assert.equal(last.spacing, "tight");
  assert.equal(last.leading, "compact");
  assert.equal(last.margins, "narrow");
});

test("the default Word design is exactly the long-standing Word layout", () => {
  const word = wordDesign(undefined);
  assert.equal(word.font, "Arial");
  assert.equal(word.size(21), 21);
  assert.equal(word.margin(850), 850);
  assert.equal(word.line, undefined);
  assert.equal(word.accent, null);
  assert.deepEqual(word.page, { width: 11906, height: 16838 });
});

test("Word files follow the CV's font, size, page, margins and colour", async () => {
  const cv = { ...sampleCv, design: { font: "cambria" as const, size: 90, paper: "letter" as const, margins: "narrow" as const, accent: "burgundy" as const } };
  for (const buffer of [await renderCvDocx(cv), await renderCoverLetterDocx({ ...cv, coverLetter: { jobTitle: "Adviser", employer: "Northstar", reference: "", recipientName: "", greeting: "hiring-manager", employerAddress: "", includeDate: false, paragraphs: ["One.", "Two.", "Three."] } })]) {
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")!.async("string");
    const stylesXml = await zip.file("word/styles.xml")!.async("string");
    assert.match(stylesXml, /w:ascii="Cambria"/);
    assert.match(documentXml, /<w:pgSz w:w="12240" w:h="15840"/);
    assert.match(documentXml, /w:color w:val="7A2632"/);
  }
});

test("saved designs keep only the settings that differ from the default", () => {
  assert.equal(minimalCvDesign(undefined), undefined);
  assert.equal(minimalCvDesign(defaultCvDesign), undefined);
  assert.deepEqual(minimalCvDesign({ ...defaultCvDesign, font: "calibri", size: 90 }), { font: "calibri", size: 90 });
});

test("the fit tool can clear every variable a design sets", () => {
  const everything = cvDesignStyle({ font: "garamond", size: 85, leading: "relaxed", spacing: "tight", margins: "wide", paper: "letter", accent: "burgundy" });
  assert.deepEqual(Object.keys(everything).sort(), [...cvDesignVariables].sort());
});
