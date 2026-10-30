import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { customerQuestions } from "../lib/customer-questions.ts";
import { customerContentReview } from "../lib/customer-content-review.ts";
import { analyticsPlacements } from "../lib/analytics-placements.ts";
import { scoreCvFit } from "../lib/cv-fit-assessment.ts";
import { checkerExampleInput, checkerExampleClassification } from "../lib/content-checker-example.ts";
import { cvToolHandoffKey } from "../lib/cv-tool-handoff.ts";

const base = process.env.CONTENT_BASE_URL || "http://127.0.0.1:3100";
const publicOrigin = "https://workcv.co.uk";
const output = "tmp/customer-questions-qa";
const owners = [...new Set(Object.values(customerQuestions).map(q => q.ownerPath))];
const paths = [...owners, "/tools/blank-cv-template-uk", "/tools/first-job-cv-wizard-uk", "/privacy"];
const screenshotRoutes = new Set(["/cv-builder-no-subscription-uk", "/pricing", "/tools/ats-score-checker", "/cv-no-experience-uk", "/top-job-boards-uk", "/contact"]);
const trackedPaths = {
  "/pricing": [analyticsPlacements.customerQ02FreeDownload, analyticsPlacements.customerQ02Money],
  "/cv-builder-no-subscription-uk": [analyticsPlacements.customerQ03Support],
  "/tools/cv-template-word-uk": [analyticsPlacements.customerQ04FreeDownload],
  "/chatgpt-cv-to-pdf-uk": [analyticsPlacements.customerQ08Money],
  "/cv-no-experience-uk": [analyticsPlacements.customerQ18Wizard],
  "/top-job-boards-uk": [analyticsPlacements.customerQ22Pack],
  "/contact": [analyticsPlacements.customerQ24MyCvs],
};
const trackedDestinations = {
  [analyticsPlacements.customerQ02FreeDownload]: "/api/tools/blank-cv-template",
  [analyticsPlacements.customerQ02Money]: "/cv-builder-no-subscription-uk",
  [analyticsPlacements.customerQ03Support]: "/contact#paid-but-cannot-download",
  [analyticsPlacements.customerQ04FreeDownload]: "/api/tools/blank-cv-template",
  [analyticsPlacements.customerQ08Money]: "/cv-builder-no-subscription-uk",
  [analyticsPlacements.customerQ18Wizard]: "/tools/first-job-cv-wizard-uk",
  [analyticsPlacements.customerQ22Pack]: "/tools/job-application-pack-uk",
  [analyticsPlacements.customerQ24MyCvs]: "/my-cvs",
};
const errors = [];
const rows = [];
const funnelEvents = [];
const interactionChecks = [];
const attributionSeed = {
  first: { landingPath: "/cv-word-or-pdf-uk", capturedAt: new Date(Date.now() - 600_000).toISOString(), utmSource: "google", utmMedium: "organic", utmCampaign: "qa_first_touch", referrerHost: "www.google.com" },
  last: { landingPath: "/pricing", capturedAt: new Date(Date.now() - 300_000).toISOString(), utmSource: "perplexity", utmMedium: "referral", utmCampaign: "qa_last_touch", referrerHost: "www.perplexity.ai" },
};

async function assertAttribution(page, event) {
  const stored = await page.evaluate(() => ({ first: JSON.parse(localStorage.getItem("workcv_first_touch") || "null"), last: JSON.parse(localStorage.getItem("workcv_last_touch") || "null") }));
  assert.deepEqual(stored, attributionSeed, "internal visit/click must preserve both acquisition touches");
  if (event) {
    assert.deepEqual({ source: event.source, medium: event.medium, campaign: event.campaign, referrerHost: event.referrerHost }, {
      source: attributionSeed.last.utmSource, medium: attributionSeed.last.utmMedium, campaign: attributionSeed.last.utmCampaign, referrerHost: attributionSeed.last.referrerHost,
    }, "click event must retain the original last-touch source, medium, campaign and referrer");
  }
}

function assertHandoff(handoff, source, expectedPatch, startedAt, sourceText) {
  assert.ok(handoff && typeof handoff.createdAt === "number" && handoff.createdAt >= startedAt && handoff.createdAt <= Date.now(), "handoff must have a fresh timestamp");
  const patch = structuredClone(handoff.patch);
  const ids = new Set();
  for (const key of ["experience", "education"]) {
    if (!Array.isArray(patch?.[key])) continue;
    patch[key] = patch[key].map(({ id, ...entry }) => {
      assert.match(id, new RegExp(`^${key}-\\d+-\\d+$`), `${key} entry needs a generated ID`);
      assert.ok(!ids.has(id), "entry IDs must be unique");
      ids.add(id);
      return entry;
    });
  }
  assert.deepEqual({ ...handoff, createdAt: "checked", patch }, {
    version: 1, createdAt: "checked", source, patch: expectedPatch, ...(sourceText ? { sourceText } : {}),
  }, `${source}: full handoff must match the reviewed fields, with no missing or extra drafts`);
}

async function waitForTrackedEvent(placement, previousCount) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const matches = funnelEvents.filter(event => event?.metadata?.placement === placement);
    if (matches.length > previousCount) return matches.at(-1);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`tracked click ${placement} did not send an event; build browser QA with NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED=true`);
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const allowed = new URL(base).origin;
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: { cookies: [], origins: [{ origin: allowed, localStorage: [
  { name: "workcv_first_touch", value: JSON.stringify(attributionSeed.first) },
  { name: "workcv_last_touch", value: JSON.stringify(attributionSeed.last) },
] }] } });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: allowed });
await context.route("**/*", route => new URL(route.request().url()).origin === allowed ? route.continue() : route.abort());
await context.route("**/api/events/**", route => route.fulfill({ json: { ok: true } }));
await context.route("**/api/events/funnel", async route => {
  try {
    funnelEvents.push(JSON.parse(route.request().postData() || "{}"));
  } catch {
    errors.push("funnel event contained invalid JSON");
  }
  await route.fulfill({ json: { ok: true } });
});
await context.route("**/editor?**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>QA editor destination</title><p>QA editor destination</p>" }));
for (const endpoint of ["cv-fit-assessment", "job-application-pack", "cv-bullet-points"]) {
  await context.route(`**/api/tools/${endpoint}`, route => route.fulfill({ status: 503, json: { error: "Browser QA does not invoke paid providers." } }));
}

try {
  for (const path of paths) {
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(`${path}: ${error.message}`));
    try {
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      const serverHtml = await response.text();
      if (await page.locator("h1").count() !== 1) throw new Error("expected one H1");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      if (canonical !== `${publicOrigin}${path}`) throw new Error(`canonical ${canonical}`);
      if (path === "/tools/cv-template-word-uk" && await page.title() !== "Edit a UK CV With or Without Microsoft Word | WorkCV") throw new Error(`Word guide title is ${await page.title()}`);

      const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(raw => JSON.parse(raw));
      for (const schema of schemas) {
        if (schema["@type"] === "Article" && schema.dateModified !== customerContentReview[path]) {
          throw new Error(`Article review date ${schema.dateModified} differs from ${customerContentReview[path]}`);
        }
        if (schema["@type"] === "FAQPage") {
          const faqs = await page.locator("#faq details").evaluateAll(nodes => nodes.map(node => ({ question: node.querySelector("summary")?.textContent?.replace(/\+\s*$/, "").trim(), answer: node.querySelector("p")?.textContent?.trim() })));
          for (const item of schema.mainEntity || []) {
            const visible = faqs.find(faq => faq.question === item.name);
            if (!visible || visible.answer !== item.acceptedAnswer?.text) throw new Error(`FAQ schema differs from visible answer: ${item.name}`);
          }
        }
      }

      const questions = Object.values(customerQuestions).filter(q => q.ownerPath === path);
      for (const question of questions) {
        const section = page.locator(`[data-customer-question="${question.id}"]`);
        if (await section.count() !== 1) throw new Error(`${question.id} must appear exactly once`);
        if (await section.getAttribute("id") !== question.anchor) throw new Error(`${question.id} anchor mismatch`);
        if ((await section.locator("h2").innerText()).trim() !== question.question) throw new Error(`${question.id} heading mismatch`);
        if ((await section.locator("p").first().innerText()).trim() !== question.answer) throw new Error(`${question.id} answer mismatch`);
        if (!serverHtml.includes(`data-customer-question="${question.id}"`)) throw new Error(`${question.id} absent from server HTML`);
      }
      const foundIds = await page.locator("[data-customer-question]").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-customer-question")));
      if (foundIds.length !== questions.length) throw new Error(`unexpected primary question marker count ${foundIds.length}`);
      for (const placement of trackedPaths[path] || []) {
        const link = page.locator(`[data-analytics-placement="${placement}"]`);
        if (await link.count() !== 1) throw new Error(`tracked link ${placement} missing or duplicated`);
        const href = await link.getAttribute("href");
        if (href !== trackedDestinations[placement]) throw new Error(`tracked link ${placement} points to ${href}`);
        await assertAttribution(page);
        const previousCount = funnelEvents.filter(event => event?.metadata?.placement === placement).length;
        await link.evaluate(element => {
          element.addEventListener("click", event => event.preventDefault(), { once: true });
        });
        await link.click();
        const event = await waitForTrackedEvent(placement, previousCount);
        await page.waitForTimeout(100);
        const eventCount = funnelEvents.filter(item => item?.metadata?.placement === placement).length;
        if (eventCount !== previousCount + 1) throw new Error(`tracked link ${placement} sent ${eventCount - previousCount} events`);
        if (event.eventName !== "marketing_cta_clicked" || event.path !== path || event.metadata?.destination !== href) throw new Error(`tracked link ${placement} sent the wrong event payload`);
        if (Object.keys(event.metadata || {}).sort().join(",") !== "destination,placement") throw new Error(`tracked link ${placement} sent unexpected metadata`);
        await assertAttribution(page, event);
        interactionChecks.push({ check: "tracked-click-and-attribution", placement, destination: href, passed: true });
      }
      if (path === "/contact") {
        const recovery = page.locator("#paid-but-cannot-download");
        if (!await recovery.locator('a[href="/my-cvs"]').count()) throw new Error("paid recovery must link to My CVs");
        if (await recovery.locator('a[href*="new=1"]').count()) throw new Error("paid recovery must not start a new CV");
      }

      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => document.fonts.ready);
        if (path === "/tools/cv-bullet-point-generator" && width === 390) {
          const privacyLink = page.locator('p a[href="/privacy"]').first();
          const box = await privacyLink.boundingBox();
          if (!box || box.width < 70 || box.height > 24) errors.push(`${path}@390: privacy link wraps into a narrow column`);
        }
        const state = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, badImages: [...document.images].filter(image => image.src.startsWith(location.origin) && image.complete && image.naturalWidth === 0).map(image => image.src) }));
        if (state.scroll > width + 1 || state.badImages.length) errors.push(`${path}@${width}: ${JSON.stringify(state)}`);
        rows.push({ path, width, questionIds: questions.map(q => q.id), ...state });
        if (screenshotRoutes.has(path) && width !== 768) {
          await page.screenshot({ path: `${output}/${path.slice(1).replaceAll("/", "-")}-${width}.png`, fullPage: true });
          if (width === 390 && questions.length) {
            await page.locator(`[data-customer-question="${questions[0].id}"] h2`).scrollIntoViewIfNeeded();
            await page.screenshot({ path: `${output}/${path.slice(1).replaceAll("/", "-")}-answer-390.png` });
          }
        }
      }
    } catch (error) {
      errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await page.close();
    }
  }

  // Use the real interactive client with a deterministic fixture; never call the paid provider.
  await context.route("**/api/tools/cv-fit-assessment", route => route.fulfill({ status: 200, json: scoreCvFit(checkerExampleInput, checkerExampleClassification) }));
  const checker = await context.newPage();
  try {
    await checker.goto(`${base}/tools/ats-score-checker`, { waitUntil: "networkidle", timeout: 120_000 });
    await checker.getByRole("button", { name: "Try an example" }).click();
    await checker.getByRole("button", { name: "Assess my CV fit" }).click();
    await checker.locator('[aria-live="polite"]').getByText("WorkCV assessment", { exact: false }).waitFor({ timeout: 15_000 });
    if (!await checker.locator('[aria-live="polite"] a[href="/tools/ats-score-checker#what-the-score-means"]').count()) throw new Error("result score lacks the employer-score explanation");
    if (!await checker.locator('[aria-live="polite"]').getByText("Sage", { exact: false }).count()) throw new Error("worked result lost the missing Sage requirement");
    await checker.locator('[aria-live="polite"]').first().screenshot({ path: `${output}/ats-illustrative-result.png` });
  } catch (error) {
    errors.push(`interactive checker: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await checker.close();
  }

  const jobPackFixture = {
    targetRole: "Customer Service Team Leader",
    company: "Northstar Retail",
    profile: "Customer service supervisor with experience leading front-line teams, coaching colleagues, using Salesforce and organising daily priorities.",
    bullets: [
      "Led eight customer service advisers and organised daily priorities.",
      "Coached four new starters through service processes and induction tasks.",
      "Used Salesforce daily to record cases and follow up customer issues.",
      "Reduced overdue complaints by 18% through a supplied triage process.",
      "Reviewed weekly service reports and supported difficult conversations.",
    ],
    requirements: [
      { requirement: "Team leadership", status: "supported", cvEvidence: "Led eight advisers", action: "Keep the team size beside the leadership evidence." },
      { requirement: "Salesforce", status: "supported", cvEvidence: "used Salesforce daily", action: "Keep the software in the context of recording and following up cases." },
      { requirement: "Continuous improvement", status: "partly-supported", cvEvidence: "new triage process", action: "Explain your own contribution without extending the supplied claim." },
    ],
    coverLetter: { letter: "Dear Sir or Madam,\n\nI am applying for the Customer Service Team Leader role at Northstar Retail. My supplied experience includes leading advisers, coaching starters and using Salesforce.\n\nYours faithfully,\nAmira Khan", paragraphs: ["I am applying for the Customer Service Team Leader role at Northstar Retail."], wordCount: 32 },
    interviewQuestions: Array.from({ length: 8 }, (_, index) => ({ question: `How would you approach customer service example ${index + 1}?`, focus: "Use only supplied leadership and service evidence.", answerPrompt: "Describe the context, your action and the result you can support." })),
    thankYouEmail: "Thank you for discussing the Customer Service Team Leader role at Northstar Retail. I appreciated learning more about the team and remain interested in the opportunity.",
    keywords: { score: 75, verdict: "Strong coverage", found: [{ term: "salesforce", category: "Skill or tool", found: true, importance: "Essential", weight: 3 }], missing: [{ term: "continuous improvement", category: "Skill or tool", found: false, importance: "Relevant", weight: 1 }], totalKeywords: 2, essentialFound: 1, essentialTotal: 1 },
  };
  await context.route("**/api/tools/job-application-pack", route => route.fulfill({ status: 200, json: jobPackFixture }));
  const pack = await context.newPage();
  try {
    await pack.goto(`${base}/tools/job-application-pack-uk`, { waitUntil: "networkidle", timeout: 120_000 });
    const privacy = pack.locator("form p").filter({ hasText: "sent through WorkCV to OpenAI" });
    if (await privacy.count() !== 1 || await privacy.locator('a[href="/privacy"]').count() !== 1) throw new Error("application pack privacy disclosure is missing or inconsistent");
    await pack.getByRole("button", { name: "Try example" }).click();
    const packAdvert = await pack.getByRole("textbox", { name: /^Job advert/ }).inputValue();
    const packSource = await pack.getByRole("textbox", { name: /^Your CV/ }).inputValue();
    await pack.getByRole("button", { name: "Build my pack" }).click();
    await pack.getByText("Draft pack ready", { exact: true }).waitFor({ timeout: 15_000 });
    if (!await pack.getByText("Carry your original CV and complete pack", { exact: false }).count()) throw new Error("application pack handoff explanation is missing");
    const startedAt = Date.now();
    await pack.getByRole("button", { name: "Use these details in my CV" }).click();
    await pack.waitForURL(/\/editor\?template=classic&new=1&from=career-tool$/, { timeout: 15_000 });
    const handoff = JSON.parse(await pack.evaluate(key => sessionStorage.getItem(key), cvToolHandoffKey) || "null");
    const expectedPatch = {
      fullName: "Amira Khan", targetRole: "Customer Service Team Leader", profile: jobPackFixture.profile,
      applicationPack: { bullets: jobPackFixture.bullets, coverLetter: jobPackFixture.coverLetter.letter, interviewPrompts: jobPackFixture.interviewQuestions.map(item => item.question + " — " + item.answerPrompt), thankYouEmail: jobPackFixture.thankYouEmail, originalCvText: packSource, evidenceReview: jobPackFixture.requirements.map(item => item.requirement + " — " + item.status + ". " + (item.cvEvidence || "No source evidence found.") + " " + item.action) },
      targeting: { role: "Customer Service Team Leader", jobDescription: packAdvert, priorities: [
        { category: "vacancy-relevance", title: "Team leadership", action: "Keep the team size beside the leadership evidence." },
        { category: "vacancy-relevance", title: "Salesforce", action: "Keep the software in the context of recording and following up cases." },
        { category: "vacancy-relevance", title: "Continuous improvement", action: "Explain your own contribution without extending the supplied claim." },
      ] },
    };
    assertHandoff(handoff, "job-application-pack", expectedPatch, startedAt, packSource);
    interactionChecks.push({ check: "application-pack-complete-handoff", passed: true });
  } catch (error) {
    errors.push(`application pack journey: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await pack.close();
  }

  const firstJob = await context.newPage();
  try {
    await firstJob.goto(`${base}/tools/first-job-cv-wizard-uk`, { waitUntil: "networkidle", timeout: 120_000 });
    await firstJob.getByRole("button", { name: "Try example" }).click();
    await firstJob.getByRole("button", { name: "Build my first-job draft" }).click();
    await firstJob.getByText("Editable first-job draft", { exact: true }).waitFor();
    const profile = firstJob.getByRole("textbox", { name: "Profile", exact: true });
    const skills = firstJob.getByRole("textbox", { name: "Key skills", exact: true });
    assert.match(await profile.inputValue(), /Retail Assistant.*A Levels in Business and English, Northside Sixth Form/);
    assert.match(await skills.inputValue(), /Customer service, teamwork, reliable organisation/);
    // Check that the handoff uses the visitor's final edits, rather than the initial generated text.
    const editedProfile = "Seeking a Retail Assistant role with school project and community food bank experience. Available for part-time weekend work.";
    const editedSkills = "Welcoming visitors\nSorting donations\nPresenting project results";
    await profile.fill(editedProfile);
    await skills.fill(editedSkills);
    await firstJob.getByRole("button", { name: "Copy draft" }).click();
    const clipboard = await firstJob.evaluate(() => navigator.clipboard.readText());
    // Windows clipboard APIs expose CRLF even when the browser wrote LF.
    assert.equal(clipboard.replaceAll("\r\n", "\n"), `${editedProfile}\n\nKEY SKILLS\n${editedSkills}`, "copy must include the complete edited draft");
    const startedAt = Date.now();
    await firstJob.getByRole("button", { name: "Open editable CV" }).click();
    await firstJob.waitForURL(/\/editor\?from=career-tool&new=1$/, { timeout: 15_000 });
    const handoff = JSON.parse(await firstJob.evaluate(key => sessionStorage.getItem(key), cvToolHandoffKey) || "null");
    assertHandoff(handoff, "first-job-wizard", {
      fullName: "Sam Taylor", targetRole: "Retail Assistant", profile: editedProfile, skills: editedSkills,
      experience: [{ role: "Project experience", company: "", location: "", start: "", end: "", bullets: "Organised a student enterprise project and presented the results to a class panel.\nWelcomed visitors at a community food bank and sorted weekly donations." }],
      education: [{ qualification: "A Levels in Business and English, Northside Sixth Form", institution: "", location: "", start: "", end: "", details: "" }],
    }, startedAt);
    interactionChecks.push({ check: "first-job-edited-copy-and-complete-handoff", passed: true });
  } catch (error) {
    errors.push(`first-job journey: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await firstJob.close();
  }

  const download = await context.request.get(`${base}/api/tools/blank-cv-template`);
  if (!download.ok() || !download.headers()["content-type"]?.includes("wordprocessingml")) errors.push("free DOCX response missing or wrong content type");
  else {
    const body = await download.body();
    if (body.length < 5_000 || body.subarray(0, 2).toString("ascii") !== "PK") errors.push("free DOCX is empty or not a ZIP document");
  }
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify({ base, rows, interactionChecks, errors }, null, 2));
}

if (errors.length) throw new Error(errors.join("\n"));
console.log(`CUSTOMER_QUESTIONS_OK ${paths.length} pages, ${Object.keys(customerQuestions).length} answers, 3 widths each; 8 tracked links, ATS, application-pack and first-job journeys, free DOCX checked`);
