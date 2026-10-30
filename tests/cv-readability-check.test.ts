import assert from "node:assert/strict";
import test from "node:test";

import { cvReadabilityReport, looksMultiColumn, type TextItemBox } from "../lib/cv-readability-check.ts";

const goodCv = `JORDAN TAYLOR
jordan.taylor@example.co.uk | 07123 456 789 | Leeds

Profile
Customer service adviser with three years of experience supporting customers by phone and email in busy UK teams. ${"Calm, accurate and focused on resolving problems first time. ".repeat(14)}

Experience
Customer Service Adviser, North Retail, Jan 2023 – Present
- Handled 40 to 50 customer queries a day by phone and email.
- Resolved delivery and payment complaints within agreed targets.
- Updated Salesforce records and tracked weekly open cases in Excel.
Retail Assistant, City Books, Jun 2021 – Dec 2022
- Served customers, processed payments and handled returns.
- Trained two new starters on the till and stock checks.

Education
Five GCSEs including English and Maths, Leeds Academy, 2016 – 2021

Skills
Customer service, complaint handling, Salesforce, Microsoft Excel, communication ${"and teamwork in fast-paced environments ".repeat(16)}`;

test("a clean UK CV passes every check", () => {
  const report = cvReadabilityReport({ text: goodCv });
  assert.deepEqual(report.checks.filter((check) => check.status !== "pass").map((check) => check.id), []);
  assert.equal(report.score, 100);
});

test("image-only or near-empty text fails readable text", () => {
  const report = cvReadabilityReport({ text: "Jordan Taylor\nCV" });
  assert.equal(report.checks.find((check) => check.id === "text")?.status, "fail");
  assert.ok(report.score < 50);
});

test("missing contact details, headings and bullets are flagged", () => {
  const text = `${"I have worked in many customer service roles and enjoy helping people. ".repeat(30)} 2019 2021`;
  const ids = Object.fromEntries(cvReadabilityReport({ text }).checks.map((check) => [check.id, check.status]));
  assert.equal(ids.contact, "fail");
  assert.equal(ids.headings, "fail");
  assert.equal(ids.bullets, "warn");
});

test("UK personal details and mixed date formats are warned", () => {
  const text = `${goodCv}\nDate of birth: 01/02/1990\nNationality: British\nEarlier role 03/2019 – 05/2020`;
  const checks = Object.fromEntries(cvReadabilityReport({ text }).checks.map((check) => [check.id, check]));
  assert.equal(checks.personal.status, "warn");
  assert.match(checks.personal.detail, /date of birth, nationality/);
  assert.equal(checks.dates.status, "warn");
});

test("very long CVs are flagged for length", () => {
  const report = cvReadabilityReport({ text: `${goodCv}\n${"Extra duty detail repeated here. ".repeat(250)}` });
  assert.equal(report.checks.find((check) => check.id === "length")?.status, "warn");
});

test("two-column PDF layouts are detected from text positions", () => {
  const twoColumn: TextItemBox[] = [];
  const singleColumn: TextItemBox[] = [];
  for (let row = 0; row < 30; row += 1) {
    twoColumn.push({ x: 40, y: 800 - row * 14, width: 150, text: "Skills item" });
    twoColumn.push({ x: 260, y: 800 - row * 14, width: 280, text: "Experience detail" });
    singleColumn.push({ x: 40, y: 800 - row * 14, width: 500, text: "A full-width line of text" });
  }
  assert.equal(looksMultiColumn(twoColumn, 595), true);
  assert.equal(looksMultiColumn(singleColumn, 595), false);

  // A single-column CV with right-aligned dates is not a two-column layout.
  const datedRows: TextItemBox[] = [];
  for (let row = 0; row < 30; row += 1) {
    datedRows.push({ x: 40, y: 800 - row * 14, width: 260, text: "Customer Service Adviser, North Retail" });
    datedRows.push({ x: 470, y: 800 - row * 14, width: 85, text: "Jan 2023 – Present" });
  }
  assert.equal(looksMultiColumn(datedRows, 595), false);

  // Real two-column CVs rarely line up: the sidebar and main column use different spacing.
  const misaligned: TextItemBox[] = [];
  for (let row = 0; row < 20; row += 1) misaligned.push({ x: 36, y: 780 - row * 17, width: 150, text: "Sidebar skill line" });
  for (let row = 0; row < 40; row += 1) misaligned.push({ x: 228 + (row % 3), y: 790 - row * 12.5, width: 320, text: "Main column experience text" });
  assert.equal(looksMultiColumn(misaligned, 595), true);

  // Indented bullets in a single column are not a second column.
  const bulleted: TextItemBox[] = [];
  for (let row = 0; row < 40; row += 1) bulleted.push({ x: row % 2 ? 58 : 40, y: 800 - row * 13, width: 480, text: "Bullet or paragraph text" });
  assert.equal(looksMultiColumn(bulleted, 595), false);
  const report = cvReadabilityReport({ text: goodCv, multiColumnPages: [1] });
  assert.equal(report.checks.find((check) => check.id === "layout")?.status, "warn");
});

test("letter-spaced headings are recognised but flagged", () => {
  const spaced = goodCv
    .replace("\nProfile\n", "\nP R O F I L E\n")
    .replace("\nExperience\n", "\nE X P E R I E N C E\n")
    .replace("\nEducation\n", "\nE D U C AT I O N \n")
    .replace("\nSkills\n", "\nS K I L LS \n");
  const headings = cvReadabilityReport({ text: spaced }).checks.find((check) => check.id === "headings");
  assert.equal(headings?.status, "warn");
  assert.match(headings?.detail ?? "", /headings were found/);
  assert.match(headings?.detail ?? "", /P R O F I L E/);
});

test("bullets are only judged for pasted text, not uploaded files", () => {
  const noBullets = goodCv.replace(/^- /gm, "");
  assert.equal(cvReadabilityReport({ text: noBullets, source: "paste" }).checks.find((check) => check.id === "bullets")?.status, "warn");
  assert.equal(cvReadabilityReport({ text: noBullets, source: "file" }).checks.find((check) => check.id === "bullets"), undefined);
});
