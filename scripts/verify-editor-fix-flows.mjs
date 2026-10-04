// End-to-end check of the editor "fix" flows: readiness actions, weak-bullet
// rewrite and advert keyword triage. Drives the real editor in Chrome with all
// APIs mocked (no database, login, payment or AI calls).
//
// Run against a dev server started with CV_VISUAL_TESTS=1, e.g.
//   PRODUCT_BASE_URL=http://127.0.0.1:3100 node --experimental-strip-types scripts/verify-editor-fix-flows.mjs
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import { parseCvData } from "../lib/cv-schema.ts";
import { createBlankCv } from "../lib/editor-data.ts";

const base = process.env.PRODUCT_BASE_URL || "http://127.0.0.1:3100";
const outDir = "tmp/editor-fix-flows";
mkdirSync(outDir, { recursive: true });

const advert =
  "Customer Service Advisor, Leeds. Essential: experience using Salesforce and Microsoft Excel to manage customer records. " +
  "You will resolve complaints, answer calls and keep accurate records for our customers. A full UK driving licence is desirable. " +
  "Salesforce experience is essential and Excel skills are needed daily. Experience with Zendesk is a plus.";

function fixtureCv({ withRoles = true } = {}) {
  const cv = createBlankCv();
  cv.fullName = "Alex Morgan";
  cv.email = "alex@example.test";
  cv.targetRole = "Customer Service Advisor";
  cv.profile = "Friendly worker";
  cv.skills = "Customer service\nTeamwork\nCash handling";
  if (withRoles) {
    cv.experience = [
      { ...cv.experience[0], id: "role-a", role: "Customer Service Assistant", company: "Corner Shop", start: "2022", end: "Present",
        bullets: "Helped with customer queries and stock in the shop\nReduced till queue times by 20% by opening a second checkout at peak hours" },
      { ...cv.experience[0], id: "role-b", role: "Retail Assistant", company: "North Street Books", start: "2020", end: "2022", bullets: "Served customers" },
    ];
  } else {
    cv.experience = [{ ...cv.experience[0], id: "role-a" }];
  }
  cv.education[0] = { ...cv.education[0], qualification: "GCSEs", institution: "Leeds High", start: "2015", end: "2020" };
  return cv;
}

const checks = [];
const pass = (name) => { checks.push(name); console.log(`  ok  ${name}`); };

async function session(browser, { cv, viewport = { width: 1440, height: 1000 }, handoff = null, importedCv = null }) {
  const page = await browser.newPage({ viewport });
  if (handoff) {
    await page.addInitScript((value) => {
      if (!window.sessionStorage.getItem("workcv-cv-fit-handoff-v1")) {
        window.sessionStorage.setItem("workcv-cv-fit-handoff-v1", JSON.stringify({ ...value, createdAt: Date.now() }));
      }
    }, handoff);
  }
  const state = { saved: parseCvData(cv), version: new Date().toISOString(), saves: 0, requests: [], events: [], rewriteMode: "ok" };
  let rewriteCalls = 0;
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const body = request.postData() ? request.postDataJSON() : null;
    if (url.pathname === "/api/cv/current") {
      if (request.method() === "PUT") {
        state.saved = parseCvData(body.data); // strict schema, like the real server
        state.version = new Date().toISOString();
        state.saves += 1;
      }
      return route.fulfill({ status: 200, json: { document: { id: "11111111-1111-4111-8111-111111111111", data: state.saved, updatedAt: state.version } } });
    }
    if (url.pathname === "/api/auth/me") return route.fulfill({ status: 200, json: { user: { id: "fixture", email: "fixture@example.invalid" } } });
    if (url.pathname === "/api/cv/import-text" && importedCv) return route.fulfill({ status: 200, json: { cv: importedCv } });
    if (url.pathname === "/api/events/editor") { state.events.push(body); return route.fulfill({ status: 200, json: {} }); }
    if (url.pathname.startsWith("/api/tools/")) state.requests.push({ path: url.pathname, body });
    if (url.pathname === "/api/tools/cv-summary") {
      return route.fulfill({ status: 200, json: { variants: [
        { label: "Concise", summary: "Customer service assistant with retail experience resolving queries and keeping tills moving at busy times." },
        { label: "Detailed", summary: "Retail and customer service assistant who resolves queries, manages stock and reduced till queues at peak hours." },
      ], followUpQuestions: [] } });
    }
    if (url.pathname === "/api/tools/cv-bullet-rewrite") {
      if (state.rewriteMode === "422") return route.fulfill({ status: 422, json: { error: "We could not produce a reliable rewrite. Add more detail about what you did, then try again." } });
      if (state.rewriteMode === "429") return route.fulfill({ status: 429, json: { error: "You have reached the free rewrite limit. Try again shortly." } });
      rewriteCalls += 1;
      const tag = ["first", "second", "third", "fourth", "fifth"][(rewriteCalls - 1) % 5];
      const subject = body.keyword || "customer queries";
      return route.fulfill({ status: 200, json: { options: [
        `Logged ${subject} details for every customer case on the ${tag} pass`,
        `Maintained accurate ${subject} records for customer cases on the ${tag} pass`,
        `Used ${subject} to track and close customer cases on the ${tag} pass`,
      ], followUpQuestion: "How many cases did you handle each day?" } });
    }
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto(`${base}/cv-pdf-parity?sample=editor${handoff ? "&from=cv-fit-assessment" : ""}`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("button", { name: "Profile", exact: true }).waitFor({ timeout: 60_000 });
  const waitForSave = async (predicate, message) => {
    for (let i = 0; i < 40; i += 1) {
      if (predicate(state.saved)) return;
      await page.waitForTimeout(250);
    }
    assert.fail(`Saved CV never matched: ${message}`);
  };
  const roleCard = (title) => page.locator("div.rounded-lg").filter({ has: page.getByRole("heading", { name: title, exact: true }) }).first();
  const errorBanner = () => page.locator("section.bg-redsoft p").first();
  const dismissError = async () => { const button = page.getByRole("button", { name: "Dismiss message" }); if (await button.count()) await button.first().click(); };
  const panel = () => page.locator("div.mt-5").filter({ has: page.getByText("Keyword targeting", { exact: true }) }).first();
  const currentKeyword = async () => (await panel().locator("p strong").first().textContent())?.trim();
  const openTailor = async (text) => {
    // Open the More menu directly: a click straight after a reload can land before hydration.
    await page.locator("details", { has: page.locator("summary", { hasText: "More" }) }).first().evaluate((element) => { element.open = true; });
    await page.getByRole("button", { name: "Tailor to job", exact: true }).click();
    await page.getByPlaceholder("Paste the vacancy here...").waitFor();
    await page.getByPlaceholder("Paste the vacancy here...").fill(text);
    await page.getByRole("button", { name: "Analyse vacancy", exact: true }).click();
  };
  return { page, state, waitForSave, roleCard, errorBanner, dismissError, panel, currentKeyword, openTailor };
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
let active;
try {
  // ---------------------------------------------------------------- item 1
  console.log("Readiness actions");
  active = await session(browser, { cv: fixtureCv() });
  {
    const { page, state, waitForSave, errorBanner, dismissError } = active;
    const openIssues = () => page.locator("details", { has: page.getByText(/^Show all \d+ things to/) }).evaluate((element) => { element.open = true; });
    await openIssues();
    const rows = page.locator("details li");
    assert.ok((await rows.count()) >= 2);
    pass("issue list expands with one row per issue");

    await rows.filter({ hasText: "Write a useful profile" }).getByRole("button", { name: "Suggest profile" }).click();
    await page.getByRole("dialog").waitFor();
    assert.equal(state.requests.at(-1).path, "/api/tools/cv-summary");
    await page.getByRole("dialog").getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => cv.profile.startsWith("Customer service assistant with retail"), "profile suggestion applied");
    pass("Suggest profile opens the modal and applies the chosen version");

    await openIssues();
    const role2Row = page.locator("details li").filter({ hasText: "role 2" }).first();
    await role2Row.getByRole("button", { name: "Suggest bullets" }).click();
    await errorBanner().waitFor();
    assert.match(await errorBanner().textContent(), /at least 50 characters/);
    assert.equal(await page.getByRole("button", { name: "Experience", exact: true }).getAttribute("class").then((c) => c.includes("bg-navy")), true);
    pass("Suggest bullets on a thin role switches to Experience and explains the guard");
    await dismissError();
  }

  // ---------------------------------------------------------------- item 2
  console.log("Weak-bullet rewrite");
  {
    const { page, state, waitForSave, roleCard, errorBanner, dismissError } = active;
    await page.getByRole("button", { name: "Experience", exact: true }).click();
    const roleA = roleCard("Role 1");
    await roleA.getByText("Weak bullet:").first().waitFor();
    assert.equal(await roleA.getByText("Weak bullet:").count(), 1, "only the weak bullet is flagged, not the 20% one");
    assert.match(await roleA.getByText("Weak bullet:").first().locator("..").textContent(), /Opens with a weak phrase/);
    pass("flags the weak bullet and leaves the strong bullet alone");

    await roleA.getByRole("button", { name: "Rewrite with AI" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const first = state.requests.at(-1);
    assert.equal(first.path, "/api/tools/cv-bullet-rewrite");
    assert.equal(first.body.bullet, "Helped with customer queries and stock in the shop");
    assert.equal(first.body.jobTitle, "Customer Service Assistant");
    assert.deepEqual(first.body.avoid, []);
    assert.equal(await dialog.locator('input[type="radio"]').count(), 3);
    pass("rewrite sends only that bullet and shows three single-choice options");

    await dialog.getByRole("button", { name: "Try again" }).click();
    await dialog.getByText("second pass").first().waitFor();
    assert.equal(state.requests.at(-1).body.avoid.length, 3);
    assert.equal(await dialog.locator('input[type="radio"]:checked').count(), 0, "selection resets after Try again");
    pass("Try again sends the previous options to avoid and resets the selection");

    await dialog.locator("label").filter({ hasText: "Maintained accurate" }).click();
    await dialog.getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => cv.experience[0].bullets.split("\n")[0].startsWith("Maintained accurate customer queries"), "rewrite applied");
    const saved = state.saved;
    assert.equal(saved.experience[0].bullets.split("\n")[1], "Reduced till queue times by 20% by opening a second checkout at peak hours");
    assert.equal(saved.experience[1].bullets, "Served customers");
    pass("applying replaces only that bullet; other bullets and roles untouched");

    await roleCard("Role 2").getByText("Weak bullet:").waitFor();
    await page.getByRole("dialog").waitFor({ state: "detached" });
    const before = JSON.stringify(state.saved);
    await roleCard("Role 2").getByRole("button", { name: "Rewrite with AI" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Keep current text" }).click();
    await page.waitForTimeout(800);
    assert.equal(JSON.stringify(state.saved), before);
    pass("Keep current text changes nothing");

    state.rewriteMode = "422";
    await roleCard("Role 2").getByRole("button", { name: "Rewrite with AI" }).click();
    await errorBanner().waitFor();
    assert.match(await errorBanner().textContent(), /could not produce a reliable rewrite/);
    assert.equal(await page.getByRole("dialog").count(), 0);
    await dismissError();
    state.rewriteMode = "429";
    await roleCard("Role 2").getByRole("button", { name: "Rewrite with AI" }).click();
    await errorBanner().waitFor();
    assert.match(await errorBanner().textContent(), /rewrite limit/);
    await dismissError();
    state.rewriteMode = "ok";
    pass("422 and 429 responses show a clear message and no modal");
  }

  // ---------------------------------------------------------------- item 3
  console.log("Keyword triage");
  {
    const { page, state, waitForSave, roleCard, panel, currentKeyword, openTailor } = active;
    await openTailor("Too short an advert");
    assert.equal(await panel().count(), 0);
    assert.match(await page.locator("section.bg-redsoft p").first().textContent(), /at least 80 characters/);
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("button", { name: "Dismiss message" }).click();
    pass("an advert under 80 characters is refused and shows no keyword card");

    await openTailor(advert);
    await panel().waitFor();
    const counts = async () => (await panel().getByText(/advert keywords are on your CV/).textContent()).match(/(\d+) of (\d+)/).slice(1).map(Number);
    const [found0, total] = await counts();
    assert.ok(total >= 4, `expected several keywords, got ${total}`);
    assert.equal(await page.getByText(/^Fix \d$/).count(), 0, "keyword priorities are not duplicated above the card");
    pass(`card shows ${found0} of ${total} keywords with no duplicate Fix row`);

    const skipped = await currentKeyword();
    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    assert.notEqual(await currentKeyword(), skipped);
    assert.match(await panel().getByText("Skipped as not relevant").textContent(), new RegExp(skipped));
    await waitForSave((cv) => cv.targeting?.skippedKeywords?.some((term) => term.toLowerCase() === skipped.toLowerCase()), "skip saved");
    pass(`Skip moves on and saves "${skipped}" through the strict schema`);

    await panel().getByRole("button", { name: "Ask again" }).click();
    assert.equal(await currentKeyword(), skipped);
    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    pass("Ask again brings skipped keywords back");

    // Add to skills, in sentence case, without duplicates.
    let added;
    for (let i = 0; i < 6 && !added; i += 1) {
      if (await panel().getByRole("button", { name: "Yes, add to skills" }).count()) {
        added = await currentKeyword();
        await panel().getByRole("button", { name: "Yes, add to skills" }).click();
      } else {
        break;
      }
    }
    assert.ok(added, "a skill keyword was offered");
    await waitForSave((cv) => cv.skills.split("\n").includes(added), "skill added");
    assert.match(added, /^[A-Z]/, "sentence case");
    assert.equal((await counts())[0], found0 + 1);
    pass(`Yes, add to skills saves "${added}" and the found count goes up`);

    // Write a bullet for the next keyword, into the second role.
    const keyword = await currentKeyword();
    await panel().getByRole("button", { name: "Yes, write a bullet" }).click();
    const draft = panel().getByRole("button", { name: "Draft bullet" });
    await panel().getByPlaceholder(/^e\.g\. Logged/).fill("Too sh");
    assert.equal(await draft.isDisabled(), true);
    await panel().getByPlaceholder(/^e\.g\. Logged/).fill(`logged customer cases in ${keyword} every shift`);
    await panel().getByLabel("Add it to").selectOption("role-b");
    assert.equal(await draft.isDisabled(), false);
    pass("Draft bullet stays disabled until the note has real content");

    await draft.click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const request = state.requests.at(-1).body;
    assert.equal(request.keyword, keyword);
    assert.equal(request.jobTitle, "Retail Assistant");
    assert.equal(request.bullet, `logged customer cases in ${keyword} every shift`);
    assert.match(await dialog.getByRole("heading").textContent(), new RegExp(`Add ${keyword} to Retail Assistant`));
    await dialog.getByText("Your note", { exact: true }).waitFor();
    await dialog.getByRole("button", { name: "Try again" }).click();
    await page.waitForTimeout(500);
    assert.equal(state.requests.at(-1).body.keyword, keyword, "Try again keeps the keyword");
    assert.equal(state.requests.at(-1).body.bullet, request.bullet, "Try again keeps the note");
    pass("drafting sends the note, keyword and chosen role; Try again keeps them");

    await dialog.locator("label").first().click();
    await dialog.getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => cv.experience[1].bullets.split("\n").length === 2, "keyword bullet appended");
    assert.equal(state.saved.experience[1].bullets.split("\n")[0], "Served customers");
    assert.ok(state.saved.experience[1].bullets.includes(keyword));
    assert.equal(state.saved.experience[0].bullets.split("\n").length, 2, "other role untouched");
    await roleCard("Role 2").waitFor().catch(() => {});
    assert.notEqual(await currentKeyword(), keyword);
    pass(`applied bullet is appended to the chosen role and "${keyword}" counts as found`);

    // Answer everything that is left.
    for (let i = 0; i < 12 && (await panel().getByRole("button", { name: "Skip, not relevant" }).count()); i += 1) {
      await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    }
    await panel().getByText("You have answered every advert requirement and keyword.").waitFor();
    pass("the card says when every keyword has been answered");

    await page.reload({ waitUntil: "networkidle" });
    await panel().getByText("You have answered every advert requirement and keyword.").waitFor();
    pass("answers survive a reload");

    await openTailor("We are hiring a friendly person to join our small team. You will be kind, punctual and reliable, and enjoy helping people each day.");
    await panel().getByText("No skill or qualification keywords were found in this advert.").waitFor();
    pass("an advert with no recognised keywords says so");

    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "Edit CV", exact: true }).click().catch(() => {});
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.equal(overflow, 0);
    pass("no horizontal scroll at 375px");
    await page.screenshot({ path: `${outDir}/mobile.png`, fullPage: false });
    await page.close();
  }


  // ---------------------------------------------------------------- phase 1
  console.log("Checker hand-off (Phase 1)");
  {
    const imported = fixtureCv();
    imported.targeting = undefined;
    imported.targetRole = "";
    imported.profile = "Hard working and passionate person looking for a new challenge.";
    imported.skills = "Customer service\nTeamwork\nCash handling\nTime keeping\nMicrosoft Word";
    imported.experience[0].bullets = "Responsible for helping customers\nDealt with customer complaints";
    imported.experience[1].bullets = "Picked and packed orders";
    imported.experience[1].start = "March 2019";
    imported.experience[1].end = "12/2020";
    const handoff = {
      version: 1,
      source: "cv-fit-assessment",
      cvText: "Sam Patel\nsam.patel@example.test\nProfile\nHard working and passionate person looking for a new challenge.\n".repeat(8),
      jobDescription: advert,
      targetRole: "Customer Service Advisor",
      priorities: [
        { category: "evidence", title: "Show CRM experience", action: "Add any exact CRM systems used, if applicable." },
        { category: "evidence", title: "Evidence Excel use", action: "Include a factual example of using Excel if that experience exists." },
        { category: "evidence", title: "Strengthen written communication evidence", action: "Replace the general claim with an example." },
      ],
      requirements: [
        { requirement: "Previous customer service experience, including complaint handling", status: "supported", explanation: "Complaint handling is evidenced." },
        { requirement: "Experience using a CRM system such as Salesforce or Zendesk", status: "not-evidenced", explanation: "No CRM system is mentioned anywhere in the CV." },
        { requirement: "Good Microsoft Excel skills", status: "not-evidenced", explanation: "The skills section lists Microsoft Word, but not Excel." },
        { requirement: "Answer customer calls and emails, log cases and follow up with customers", status: "not-evidenced", explanation: "No calls, emails or case logging are mentioned." },
        { requirement: "Excellent written communication", status: "partly-supported", explanation: "The CV claims communication skills but not written communication." },
      ],
      vaguePhrases: [
        { phrase: "Hard working and passionate person looking for a new challenge.", reason: "Generic; does not show relevant evidence." },
        { phrase: "Responsible for helping customers", reason: "Vague about what was actually done." },
      ],
    };
    active = await session(browser, { cv: createBlankCv(), handoff, importedCv: imported });
    const { page, state, waitForSave, panel, errorBanner, dismissError } = active;
    await panel().waitFor({ timeout: 60_000 });
    const questionText = async () => (await panel().locator("p", { hasText: /^The advert asks for/ }).first().textContent())?.replace(/\s+/g, " ").trim() ?? "";

    await waitForSave((cv) => Boolean(cv.targeting?.requirements?.length), "hand-off saved");
    assert.equal(state.saved.targetRole, "", "the vacancy title is not written as the user's headline");
    assert.equal(state.saved.targeting.role, "Customer Service Advisor");
    assert.equal(state.saved.targeting.requirements.length, 4);
    assert.equal(state.saved.targeting.evidencedRequirements.length, 1);
    assert.ok(!(await page.locator(".print-document").first().innerText()).includes("Customer Service Advisor"), "the preview does not show the vacancy title under the name");
    pass("hand-off keeps the vacancy title out of the headline and saves the requirements");

    assert.equal(await page.getByText(/^Fix \d$/).count(), 0, "static Fix 1/2/3 cards are gone");
    await page.locator("summary", { hasText: /top 3 fixes/ }).waitFor();
    pass("the three priorities are collapsed, not shown as static cards");

    await page.locator("details", { has: page.getByText(/^Show all \d+ things to/) }).evaluate((element) => { element.open = true; });
    assert.match(await page.locator("details li", { hasText: "This advert is for" }).first().innerText(), /Customer Service Advisor/);
    pass("the readiness list asks for a headline and names the advert's title");

    assert.match(await questionText(), /The advert asks for Experience using a CRM system such as Salesforce or Zendesk/);
    assert.match(await panel().innerText(), /not evidenced/i);
    assert.match(await panel().innerText(), /What the checker found: No CRM system is mentioned anywhere in the CV\./);
    pass("the first question is the checker's unmet CRM requirement, with the checker's reason");

    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    await waitForSave((cv) => cv.targeting.skippedKeywords?.includes("Experience using a CRM system such as Salesforce or Zendesk"), "requirement skip saved");
    assert.match(await questionText(), /Good Microsoft Excel skills/);
    pass("skipping a requirement saves it and moves to the next one");

    await panel().getByRole("button", { name: "Yes, write a bullet" }).click();
    await panel().getByPlaceholder(/^e\.g\. Logged/).fill("kept the weekly stock counts in excel spreadsheets");
    await panel().getByLabel("Add it to").selectOption("role-b");
    await panel().getByRole("button", { name: "Draft bullet" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const request = state.requests.at(-1).body;
    assert.equal(request.requirement, "Good Microsoft Excel skills");
    assert.equal(request.keyword, "");
    assert.equal(request.jobTitle, "Retail Assistant");
    assert.equal(request.targetRole, "Customer Service Advisor", "the AI is aimed at the vacancy role when there is no headline");
    await dialog.locator("label").first().click();
    await dialog.getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => cv.targeting.answeredRequirements?.includes("Good Microsoft Excel skills"), "requirement answered");
    assert.equal(state.saved.experience[1].bullets.split("\n").length, 2);
    assert.equal(state.saved.targetRole, "", "answering does not set a headline");
    pass("a drafted bullet answers the requirement: appended to the chosen role, marked answered, sent with the requirement");

    assert.match(await questionText(), /Answer customer calls and emails/);
    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    assert.match(await questionText(), /Excellent written communication/);
    assert.match(await panel().innerText(), /partly evidenced/i);
    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    pass("requirements come in order: not evidenced first, partly evidenced last");

    const keywordQuestion = await questionText();
    assert.match(keywordQuestion, /The advert asks for Driving licence/);
    for (const covered of ["CRM", "Salesforce", "Excel", "Complaint handling"]) {
      assert.ok(!keywordQuestion.includes(`asks for ${covered}`), `${covered} is covered by a requirement and must not be a separate question`);
    }
    pass("keywords covered by a requirement are not asked again; Driving licence still is");

    await panel().getByRole("button", { name: "Skip, not relevant" }).click();
    await panel().getByText("You have answered every advert requirement and keyword.").waitFor();
    assert.match(await panel().getByText(/Skipped as not relevant/).innerText(), /Experience using a CRM system/);
    pass("everything answered: the card says so and lists what was skipped");

    // Vague phrases.
    assert.equal(await panel().locator("li", { hasText: "Rewrite with AI" }).count(), 2);
    await panel().locator("li", { hasText: "Hard working and passionate" }).getByRole("button", { name: "Rewrite with AI" }).click();
    await page.getByRole("dialog").waitFor();
    assert.equal(state.requests.at(-1).path, "/api/tools/cv-summary");
    assert.equal(state.requests.at(-1).body.targetRole, "Customer Service Advisor");
    await page.getByRole("dialog").getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => cv.profile.startsWith("Customer service assistant with retail"), "profile rewritten");
    await panel().locator("li", { hasText: "Hard working and passionate" }).waitFor({ state: "detached" });
    assert.equal(await panel().locator("li", { hasText: "Rewrite with AI" }).count(), 1);
    pass("a vague profile phrase opens the profile rewrite and drops off the list once fixed");

    await panel().locator("li", { hasText: "Responsible for helping customers" }).getByRole("button", { name: "Rewrite with AI" }).click();
    await page.getByRole("dialog").waitFor();
    assert.equal(state.requests.at(-1).path, "/api/tools/cv-bullet-rewrite");
    assert.equal(state.requests.at(-1).body.bullet, "Responsible for helping customers");
    await page.getByRole("dialog").locator("label").first().click();
    await page.getByRole("dialog").getByRole("button", { name: "Apply selected" }).click();
    await waitForSave((cv) => !cv.experience[0].bullets.includes("Responsible for helping customers"), "bullet rewritten");
    await panel().locator("li", { hasText: "Rewrite with AI" }).waitFor({ state: "detached" });
    pass("a vague bullet opens that bullet's rewrite and drops off the list once fixed");

    await page.reload({ waitUntil: "networkidle" });
    await panel().getByText("You have answered every advert requirement and keyword.").waitFor({ timeout: 60_000 });
    assert.equal(state.saved.targeting.vaguePhrases.length, 2, "the saved phrases stay; only those still in the CV are listed");
    assert.equal(await panel().locator("li", { hasText: "Rewrite with AI" }).count(), 0);
    pass("answers and fixes survive a reload");
    await page.close();
  }

  console.log("Checker hand-off without requirements (older hand-off)");
  {
    const imported = fixtureCv();
    imported.targeting = undefined;
    imported.targetRole = "";
    const legacy = { version: 1, source: "cv-fit-assessment", cvText: "Sam Patel ".repeat(60), jobDescription: advert, targetRole: "Customer Service Advisor", priorities: [{ category: "evidence", title: "Show CRM experience", action: "Add any exact CRM systems used, if applicable." }] };
    active = await session(browser, { cv: createBlankCv(), handoff: legacy, importedCv: imported });
    const { page, panel } = active;
    await panel().waitFor({ timeout: 60_000 });
    await page.getByText("Fix 1", { exact: true }).waitFor();
    assert.equal(await page.locator("summary", { hasText: /top \d fixes/ }).count(), 0);
    pass("an older hand-off without requirements still shows the three priorities and the keyword card");
    await page.close();
  }

  console.log("No roles yet");
  active = await session(browser, { cv: fixtureCv({ withRoles: false }) });
  {
    const { page, panel, openTailor } = active;
    await openTailor(advert);
    await panel().waitFor();
    await panel().getByRole("button", { name: "Yes, write a bullet" }).click();
    await panel().getByText("Add a role with a job title in Experience first").waitFor();
    pass("writing a bullet with no roles asks for a role first");
    await page.close();
  }

  console.log(`\nEDITOR_FIX_FLOWS_OK: ${checks.length} checks passed. APIs mocked; no database, payment or AI calls.`);
} catch (error) {
  if (active?.page && !active.page.isClosed()) await active.page.screenshot({ path: `${outDir}/failure.png`, fullPage: true }).catch(() => {});
  console.log(`\nFAILED after ${checks.length} passing checks. Screenshot: ${outDir}/failure.png`);
  throw error;
} finally {
  await browser.close();
}
