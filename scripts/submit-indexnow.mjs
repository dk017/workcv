import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const siteUrl = (process.env.INDEXNOW_SITE_URL || "https://workcv.co.uk").replace(
  /\/$/,
  "",
);
const keyFileName = "1dda8b6b20af491cb1fdb736c823bc44.txt";
const keyFilePath = path.join(process.cwd(), "public", keyFileName);
const key = (await readFile(keyFilePath, "utf8")).trim();
const keyLocation = `${siteUrl}/${keyFileName}`;
const siteHost = new URL(siteUrl).host;
const suppliedUrls = process.argv.slice(2);

async function readSitemapUrls() {
  const response = await fetch(`${siteUrl}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`Could not read sitemap.xml (${response.status}).`);
  }

  const sitemap = await response.text();
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

const urlList =
  suppliedUrls.length > 0
    ? suppliedUrls.map((value) => new URL(value, `${siteUrl}/`).href)
    : await readSitemapUrls();

if (urlList.length === 0) {
  throw new Error("No URLs were found to submit.");
}

for (const url of urlList) {
  if (new URL(url).host !== siteHost) {
    throw new Error(`URL does not belong to ${siteHost}: ${url}`);
  }
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: siteHost,
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(
    `IndexNow rejected the submission (${response.status}): ${body || response.statusText}`,
  );
}

console.log(
  `IndexNow accepted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} for ${siteHost}.`,
);
