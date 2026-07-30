import { chromium } from "playwright-core";

const executablePath =
  process.env.CHROMIUM_PATH ||
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/chromium");

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.setContent(
    '<main data-pdf-ready="true"><h1>WorkCV PDF runtime smoke test</h1></main>',
  );
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  if (pdf.byteLength < 1_000) {
    throw new Error(`PDF runtime smoke test produced only ${pdf.byteLength} bytes`);
  }
  console.log(`PDF_RUNTIME_SMOKE_OK bytes=${pdf.byteLength}`);
} finally {
  await browser.close();
}
