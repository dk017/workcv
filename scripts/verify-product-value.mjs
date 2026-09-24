import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const base = process.env.PRODUCT_BASE_URL || "http://127.0.0.1:3100";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const context = await browser.newContext();
const errors = [];
const posts = [];
context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
await context.route("**/api/events/**", route => route.fulfill({ status: 200, body: "{}" }));
await context.route("**/api/**", route => {
  if (route.request().method() === "POST") { if (!route.request().url().includes("/api/events/")) posts.push(route.request().url()); return route.fulfill({ status: 200, body: "{}" }); }
  return route.continue();
});
await mkdir("tmp/product-value-qa", { recursive: true });
try {
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  for (const route of ["/tools/cv-format-checker-uk", "/tools/supporting-statement-planner-uk", "/cv-layout-tests-uk", "/templates"]) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      assert.equal(response.status(), 200, route);
      await page.locator("h1").waitFor();
      assert.equal(await page.locator("h1").count(), 1);
      const sizes = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      assert.ok(sizes[0] <= sizes[1] + 1, route + ": horizontal overflow " + sizes);
      await page.screenshot({ path: "tmp/product-value-qa/" + route.replaceAll("/", "_") + "-" + width + ".png", fullPage: true });
    }
  }
  await page.goto(base + "/tools/cv-format-checker-uk", { waitUntil: "domcontentloaded" });
  await page.locator('input[type=file]:enabled').setInputFiles("public/samples/layouts/education-first.pdf");
  await page.locator('[role="status"], [role="alert"]').filter({ hasText: /extracted words|worker|Invalid|Cannot|Failed|Error|error|module/i }).first().waitFor();
  assert.equal(await page.getByRole("alert").filter({ hasText: /\S/ }).count(), 0, await page.getByRole("alert").allTextContents().then(items => items.join("\n")));
  await page.getByRole("status").filter({ hasText: "extracted words" }).waitFor();
  assert.ok((await page.locator("textarea").first().inputValue()).includes("Emily Thompson"));
  assert.ok(await page.locator('img[alt^="Local preview"]').count());
  await page.screenshot({ path: "tmp/product-value-qa/file-result.png", fullPage: true });
  const docx = await context.request.get(base + "/api/tools/blank-cv-template");
  assert.equal(docx.status(), 200);
  await page.locator('input[type=file]').setInputFiles({ name: "sample.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buffer: await docx.body() });
  await page.getByText("DOCX text is shown as one document", { exact: false }).waitFor();
  await page.locator('input[type=file]').setInputFiles({ name: "bad.pdf", mimeType: "application/pdf", buffer: Buffer.from("not a PDF") });
  await page.getByRole("alert").filter({ hasText: /\S/ }).first().waitFor();
  await page.goto(base + "/tools/supporting-statement-planner-uk", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Load the fictional example" }).click();
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Statement draft"]')?.value.includes("coordinator"));
  await page.getByLabel("Your advert's word limit").fill("50");
  await page.getByRole("status").filter({ hasText: "over your limit" }).waitFor();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download free text draft" }).click();
  assert.equal((await download).suggestedFilename(), "supporting-statement-draft.txt");
  assert.equal(posts.length, 0, "Private file/worksheet content must not be posted");
  assert.deepEqual(errors, []);
  console.log("PRODUCT_VALUE_OK: 8 responsive page checks; local PDF + DOCX extraction; malformed file; statement example, limit and free download; zero content POSTs or browser errors.");
} finally { await browser.close(); }
