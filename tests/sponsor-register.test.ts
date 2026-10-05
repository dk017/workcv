import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

import { coreName, parseSponsorRegister, registerDateFromUrl, searchSponsors, splitCsvLine } from "../lib/sponsor-register.ts";

// Mirrors the real file: BOM, untidy spaces, quoted towns with commas, one
// organisation on several routes, trading names and a B rating.
const csv = [
  "﻿Organisation Name,Town/City,County,Type & Rating,Route",
  "Deloitte LLP,London,,Worker (A rating),Skilled Worker",
  "Deloitte LLP,London,,Worker (A rating),Global Business Mobility: Senior or Specialist Worker",
  " Asian African Foods Ltd , London  ,,Worker (A rating),Skilled Worker",
  'Mrs Prashanthy Shathyakaran T/A Manor News ,"Bexhill, ",East Sussex ,Worker (A rating),Skilled Worker',
  "Tesco Stores Limited,Welwyn Garden City,Herts,Worker (A rating),Skilled Worker",
  "Tesco Personal Finance plc,Edinburgh,,Worker (A rating),Skilled Worker",
  "Acme Services Ltd,Leeds,,Worker (B rating),Skilled Worker",
  "Google (UK) Limited,London,,Worker (A (Premium)),Skilled Worker",
  "The University of Manchester,Manchester,,Worker (A rating),Skilled Worker",
  "Anglo Beef Processors,Ballymena,,Worker (A rating),Skilled Worker",
  "Anglo Beef Processors,Bridgwater,Somerset,Worker (A rating),Skilled Worker",
  "",
].join("\r\n");

const loaded = () => parseSponsorRegister(csv, "2026-10-02");

test("splits quoted CSV fields", () => {
  assert.deepEqual(splitCsvLine('A Ltd,"Bexhill, ",East Sussex,Worker (A rating),Skilled Worker'), ["A Ltd", "Bexhill, ", "East Sussex", "Worker (A rating)", "Skilled Worker"]);
  assert.deepEqual(splitCsvLine('"Say ""Hi"" Ltd",Leeds'), ['Say "Hi" Ltd', "Leeds"]);
});

test("groups rows by organisation and tidies names, towns and ratings", async () => {
  const register = await loaded();
  assert.equal(register.rowCount, 11);
  assert.equal(register.names.length, 9);
  const deloitte = searchSponsors(register, "Deloitte").matches[0];
  assert.deepEqual(deloitte.routes.map((route) => route.route), ["Skilled Worker", "Global Business Mobility: Senior or Specialist Worker"]);
  assert.equal(searchSponsors(register, "Asian African Foods").matches[0].name, "Asian African Foods Ltd");
  assert.deepEqual(searchSponsors(register, "Manor News").matches[0].locations, ["Bexhill, East Sussex"]);
  assert.deepEqual(searchSponsors(register, "Anglo Beef Processors").matches[0].locations, ["Ballymena", "Bridgwater, Somerset"]);
  assert.equal(searchSponsors(register, "Acme Services").matches[0].routes[0].rating, "B rating");
  assert.equal(searchSponsors(register, "Google").matches[0].routes[0].rating, "A (Premium)");
});

test("refuses a file whose columns have changed", async () => {
  await assert.rejects(parseSponsorRegister("Name,Town\nA,B"), /Unexpected sponsor register columns/);
});

test("legal suffixes are ignored for an exact match, distinguishing words are not", async () => {
  const register = await loaded();
  assert.equal(coreName("Deloitte LLP"), "deloitte");
  assert.equal(coreName("Google (UK) Limited"), "google");
  assert.equal(searchSponsors(register, "deloitte llp").status, "listed");
  assert.equal(searchSponsors(register, "Google").status, "listed");
  assert.equal(searchSponsors(register, "University of Manchester").status, "listed");
  // "Acme" is not "Acme Services Ltd", so it is only a possible match.
  assert.equal(searchSponsors(register, "Acme").status, "possible");
});

test("trading names after T/A match", async () => {
  const result = searchSponsors(await loaded(), "Manor News");
  assert.equal(result.status, "listed");
  assert.equal(result.matches[0].match, "exact");
});

test("brand names find legal names as possible matches, exact matches first", async () => {
  const tesco = searchSponsors(await loaded(), "Tesco");
  assert.equal(tesco.status, "possible");
  assert.deepEqual(tesco.matches.map((match) => match.name), ["Tesco Stores Limited", "Tesco Personal Finance plc"]);
  assert.ok(tesco.matches.every((match) => match.match === "close"));
});

test("unknown or too-short names are not found", async () => {
  const register = await loaded();
  assert.equal(searchSponsors(register, "Nonexistent Widgets").status, "not_found");
  assert.equal(searchSponsors(register, "a").status, "not_found");
  assert.equal(searchSponsors(register, "  ").total, 0);
});

test("reads the register date from the GOV.UK file name", () => {
  assert.equal(registerDateFromUrl("https://assets.publishing.service.gov.uk/media/x/SP_-_Worker_and_Temporary_Worker_Web_Register_-_2026-10-02.csv"), "2026-10-02");
  assert.equal(registerDateFromUrl("https://example.com/file.csv"), null);
});

test("the extension sends only the employer name to the sponsor check", () => {
  const context: Record<string, unknown> = { TextEncoder, btoa, encodeURIComponent };
  context.globalThis = context;
  vm.runInNewContext(readFileSync(new URL("../chrome-extension/workcv-job-keyword-highlighter/job-link.js", import.meta.url), "utf8"), context);
  const link = context.WorkCVJobLink as { sponsorCheckUrl: (name: string) => string; sponsorPageUrl: (name: string) => string };
  const api = new URL(link.sponsorCheckUrl("Crème & Co Ltd"));
  assert.equal(api.origin + api.pathname, "https://workcv.co.uk/api/tools/sponsor-check");
  assert.deepEqual(Array.from(api.searchParams.keys()), ["q"]);
  assert.equal(api.searchParams.get("q"), "Crème & Co Ltd");
  assert.equal(new URL(link.sponsorPageUrl("Deloitte")).searchParams.get("utm_campaign"), "sponsor_check");
});

test("sponsor checker is registered and privacy notes say what is sent", () => {
  const read = (path: string) => readFileSync(path, "utf8");
  assert.match(read("app/sitemap.ts"), /path: "\/tools\/uk-visa-sponsor-checker"/);
  assert.match(read("components/tools-hub.tsx"), /\/tools\/uk-visa-sponsor-checker/);
  assert.match(read("components/tool-breadcrumbs.tsx"), /"uk-visa-sponsor-checker"/);
  assert.match(read("app/right-to-work-cv-uk/page.tsx"), /\/tools\/uk-visa-sponsor-checker/);
  assert.match(read("components/job-application-tracker.tsx"), /sends only the employer name/);
  assert.match(read("app/chrome/job-keyword-highlighter/privacy/page.tsx"), /sends only that name to WorkCV/);
  // Information, not advice: every sponsorship surface points to regulated advisers.
  for (const path of ["app/tools/uk-visa-sponsor-checker/page.tsx", "app/right-to-work-cv-uk/page.tsx"]) {
    assert.match(read(path), /not immigration advice/);
    assert.match(read(path), /find-an-immigration-adviser/);
  }
});
