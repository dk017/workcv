import { chromium, type Browser } from "playwright-core";

let browserPromise: Promise<Browser> | null = null;

function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium
      .launch({
        executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      })
      .catch((error) => {
        browserPromise = null;
        throw error;
      });
  }
  return browserPromise;
}

export async function renderPdf(url: string) {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForSelector('[data-pdf-ready="true"]', { timeout: 10_000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await page.close();
  }
}
