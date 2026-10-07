// Renders the homepage CV examples (first page of each role CV in its WorkCV template) to
// public/samples/home. Start the app with CV_VISUAL_TESTS=1 first, then run:
//   HOME_EXAMPLES_BASE_URL=http://localhost:3005 node scripts/generate-home-examples.mjs
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = process.env.HOME_EXAMPLES_BASE_URL || "http://127.0.0.1:3100";
// Keep in step with lib/home-examples.ts.
const examples = [
  ["customer-service", "classic"],
  ["nurse", "modern"],
  ["care-worker", "compact"],
  ["teacher", "classic"],
  ["engineer", "modern"],
  ["graduate", "classic"],
  ["retail", "compact"],
  ["warehouse", "modern"],
];

await mkdir("public/samples/home", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const [role, template] of examples) {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 0.8 });
    await page.route("**/api/**", (route) => route.fulfill({ status: 200, json: {} }));
    await page.goto(`${base}/cv-pdf-parity?roleTemplate=${role}&template=${template}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-pdf-ready="true"]');
    await page.evaluate(() => document.fonts.ready);
    const box = await page.locator(".print-document").boundingBox();
    if (!box) throw new Error(`${role}: CV did not render`);
    await page.screenshot({ path: `public/samples/home/${role}-${template}.png`, clip: { x: box.x, y: box.y, width: 794, height: 1123 } });
    console.log(`${role}-${template}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
