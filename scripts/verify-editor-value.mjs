import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { sampleCv } from "../lib/editor-data.ts";
import { parseCvData } from "../lib/cv-schema.ts";
const base = process.env.PRODUCT_BASE_URL || "http://127.0.0.1:3100";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
let saved = { ...structuredClone(sampleCv), applicationPack: { bullets: ["Explained book choices to visitors using their interests."], coverLetter: "A reviewed cover-letter draft.", interviewPrompts: ["Describe a customer conversation."], thankYouEmail: "Thank you for your time.", originalCvText: "The original source CV is retained.", evidenceReview: ["Customer service — supported."] } };
let version = new Date().toISOString();
let saves = 0;
const doc = () => ({ document: { id: "11111111-1111-4111-8111-111111111111", data: saved, updatedAt: version } });
await page.route("**/api/**", async route => {
  const url = new URL(route.request().url());
  if (url.pathname === "/api/cv/current") {
    if (route.request().method() === "PUT") { saved = parseCvData(route.request().postDataJSON().data); version = new Date().toISOString(); saves++; }
    return route.fulfill({ status: 200, json: doc() });
  }
  if (url.pathname === "/api/auth/me") return route.fulfill({ status: 200, json: { user: { id: "local-fixture", email: "fixture@example.invalid" } } });
  if (url.pathname.includes("preview")) return route.fulfill({ status: 400, json: { error: "Preview generation is tested separately with the PDF fixtures." } });
  return route.fulfill({ status: 200, json: {} });
});
try {
  await page.goto(base + "/cv-pdf-parity?sample=editor", { waitUntil: "networkidle", timeout: 60000 });
  await page.getByRole("button", { name: "Template", exact: true }).click();
  await page.getByLabel("Single-column preset").selectOption("education-first");
  await page.getByLabel("Projects (optional)", { exact: true }).fill("Library catalogue project | 2025\nOrganised donated titles with the coordinator.");
  await page.getByRole("button", { name: "Move Projects up", exact: true }).click();
  const titles = await page.locator(".print-document .cv-section > h3").allTextContents();
  assert.ok(titles.indexOf("Projects") < titles.indexOf("Education"));
  await page.getByRole("button", { name: "Experience", exact: true }).click();
  await page.getByLabel("Role for a reviewed bullet").selectOption("exp-1");
  await page.getByRole("button", { name: "I confirm this is true — add to role" }).click();
  await page.getByText("Reviewed bullet added. Existing bullets kept.", { exact: true }).waitFor();
  await page.getByRole("button", { name: "I confirm this is true — add to role" }).click();
  await page.getByText("Already present, or the role was removed.", { exact: true }).waitFor();
  await page.waitForTimeout(1500);
  assert.ok(saves > 0);
  assert.equal(saved.experience[0].bullets.split("Explained book choices").length, 2);
  assert.ok(saved.experience[0].bullets.includes(sampleCv.experience[0].bullets));
  assert.equal(saved.skills, sampleCv.skills);
  assert.equal(saved.applicationPack.originalCvText, "The original source CV is retained.");
  assert.ok(saved.additionalSections.projects.includes("Library catalogue"));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Template", exact: true }).click();
  assert.equal(await page.getByLabel("Single-column preset").inputValue(), "education-first");
  assert.ok((await page.getByLabel("Projects (optional)", { exact: true }).inputValue()).includes("Library catalogue"));
  await page.screenshot({ path: "tmp/product-value-qa/editor-structure.png", fullPage: true });
  console.log("EDITOR_VALUE_OK: optional sections and order; preset; explicit bullet application without duplicates; original skills/source preserved; validated save and reload. APIs mocked, no payment or AI request.");
} catch (error) {
  console.log("EDITOR_DIAGNOSTIC", await page.locator("label").allTextContents());
  await page.screenshot({ path: "tmp/product-value-qa/editor-failure.png", fullPage: true });
  throw error;
} finally { await browser.close(); }
