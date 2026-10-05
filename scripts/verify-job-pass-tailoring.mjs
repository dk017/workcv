import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
const base = "http://127.0.0.1:3117", out = "tmp/job-pass-review";
mkdirSync(out, { recursive: true });
const draft = {
 targetRole: "Customer Service Team Leader", company: "Northstar Retail",
 profile: "Customer service supervisor with experience leading advisers and coaching new starters.",
 bullets: ["Led eight advisers through daily customer service priorities and supported difficult conversations", "Coached four starters on established customer service processes during busy periods", "Used Salesforce daily to record cases and follow up customer issues", "Reduced overdue complaints by 18% through a clearer triage process", "Reviewed weekly service reports and organised priorities for customer complaint handling"],
 requirements: ["Team leadership", "Salesforce", "Service reports"].map(requirement => ({ requirement, status: "supported", cvEvidence: "Led eight advisers", action: "Review and use this evidence under the role where it happened." })),
 coverLetter: { paragraphs: ["I am applying for the Customer Service Team Leader role at Northstar Retail.", "I have led eight advisers and coached four new starters.", "I used Salesforce daily and introduced a clearer triage process.", "I would welcome the opportunity to discuss my customer service experience."], letter: "Dear Sir or Madam,\n\nOriginal letter\n\nYours faithfully,\nAmira Khan", wordCount: 50 },
 interviewQuestions: Array.from({length:8}, (_, i) => ({ question: `How would you handle scenario ${i + 1}?`, focus: "Real customer service evidence", answerPrompt: "Explain the context, your actions and a truthful outcome." })),
 thankYouEmail: "Thank you for discussing the Customer Service Team Leader role at Northstar Retail. I would welcome any further questions.",
 keywords: { score: 50, verdict: "Partial coverage", found: [{term:"Salesforce"}], missing: [{term:"Scheduling"}], totalKeywords: 2, essentialFound: 1, essentialTotal: 2 },
};
const browser = await chromium.launch({executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
const checks = [], errors = [];
try {
 const context = await browser.newContext({permissions:["clipboard-read", "clipboard-write"], viewport:{width:1365,height:1000}});
 const page = await context.newPage();
 page.on("pageerror", e => errors.push(e.message)); page.on("dialog", d => d.accept());
 let mode = "success", requests = 0;
 await page.route("**/api/**", async route => {
  if (route.request().url().includes("/api/tools/job-application-pack")) {
   requests++;
   return route.fulfill({status:mode==="success"?200:mode==="rate"?429:422, headers:mode==="rate"?{"Retry-After":"2"}:{}, contentType:"application/json", body:JSON.stringify(mode==="success"?draft:{error:"Please add more evidence. Your previous result is retained."})});
  }
  if(route.request().url().includes("/api/tools/cover-letter")) return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({letter:draft.coverLetter.letter,paragraphs:draft.coverLetter.paragraphs,wordCount:50})});
  return route.fulfill({status:200,contentType:"application/json",body:"{}"});
 });
 await page.route("**/editor?**", route => route.fulfill({status:200,contentType:"text/html",body:"<h1>Editor handoff fixture</h1>"}));
 await page.goto(base+"/tools/job-application-pack-uk",{waitUntil:"networkidle",timeout:90000});
 assert.equal(await page.locator("h1").count(),1);
 assert.match(await page.locator("h1").innerText(),/Tailor your CV and cover letter/);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://workcv.co.uk/tools/job-application-pack-uk");
 assert.ok((await page.locator("body").innerText()).includes("Sam Taylor"));
 await page.getByRole("button",{name:"Try example",exact:true}).click();
 await page.getByRole("button",{name:"Build my pack",exact:true}).click();
 await page.getByLabel("Edit profile",{exact:true}).waitFor().catch(async e=>{console.log(JSON.stringify({requests,errors,text:(await page.locator("body").innerText()).slice(0,9000)},null,2));throw e;});
 assert.equal(await page.locator("details[open]").count(),0);
 assert.match(await page.locator("body").innerText(),/Scheduling/);
 await page.getByLabel("Edit profile",{exact:true}).fill("Reviewed profile with truthful service leadership and coaching experience.");
 await page.getByLabel("Edit CV bullet 1",{exact:true}).fill("Reviewed bullet: led eight advisers and supported their daily service priorities");
 await page.getByLabel("Edit letter paragraph 1",{exact:true}).fill("Reviewed opening for the Customer Service Team Leader role at Northstar Retail.");
 await page.getByRole("button",{name:"Copy all",exact:true}).click();
 const copied=await page.evaluate(()=>navigator.clipboard.readText());assert.match(copied,/Reviewed profile/);assert.match(copied,/Reviewed opening/);
 await page.getByRole("button",{name:"Reset this section to generated wording",exact:true}).first().click();
 assert.equal(await page.getByLabel("Edit profile",{exact:true}).inputValue(),draft.profile);
 await page.getByLabel("Target role",{exact:true}).fill("Different target");
 assert.match(await page.locator("body").innerText(),/inputs have changed/);
 mode="error";await page.getByRole("button",{name:"Build my pack",exact:true}).click();
 await page.locator("[role=alert]").filter({hasText:/evidence|storage|details|large|Copy/}).first().waitFor();assert.match(await page.getByLabel("Edit letter paragraph 1",{exact:true}).inputValue(),/Reviewed opening/);
 mode="rate";await page.getByRole("button",{name:"Build my pack",exact:true}).click();
 await page.getByText(/Try again in 2 seconds/).waitFor();
 assert.equal(await page.getByRole("button",{name:"Build my pack",exact:true}).isDisabled(),true);
 await page.getByRole("button",{name:"Build my pack",exact:true}).waitFor({state:"visible"});
 await page.waitForFunction(()=>!Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("Build my pack"))?.disabled);
 const originalCv = await page.locator('textarea[name="cvText"]').inputValue();
 const requestCount = requests;
 await page.locator('textarea[name="cvText"]').fill("界".repeat(15000));
 await page.getByRole("button",{name:"Build my pack",exact:true}).click();
 assert.match(await page.locator("[role=alert]").filter({hasText:/submission limit/}).innerText(),/total submission limit/);
 assert.equal(requests,requestCount);assert.equal((await page.locator('textarea[name="cvText"]').inputValue()).length,15000);
 await page.locator('textarea[name="cvText"]').fill(originalCv);
 await page.evaluate(()=>{window.originalWrite= navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async()=>{throw new Error("blocked");};});
 await page.getByRole("button",{name:"Copy all",exact:true}).click();
 assert.match(await page.getByLabel("Manual-copy text",{exact:true}).inputValue(),/Reviewed opening/);
 await page.evaluate(()=>{navigator.clipboard.writeText=window.originalWrite;});
 await page.getByRole("button",{name:"Copy all",exact:true}).click();
 checks.push("SEO metadata and static example; editable copy/reset; stale snapshot; failed regeneration; retry cooldown; Unicode byte cap; manual-copy fallback");
 await page.setViewportSize({width:320,height:850});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.getByLabel("Edit profile",{exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:out+"/tailoring-mobile.png"});
 await page.setViewportSize({width:1365,height:1000});
 // A storage write failure must not navigate or discard the reviewed draft.
 await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==="workcv-cv-tool-handoff-v1")throw new Error("blocked");return window.originalSetItem.call(this,key,value);};});
 await page.getByRole("button",{name:"Use this draft with Job Search Pass",exact:true}).click();
 assert.match(await page.locator("[role=alert]").filter({hasText:/evidence|storage|details|large|Copy/}).first().innerText(),/storage is unavailable/);assert.match(page.url(),/job-application-pack-uk/);
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalSetItem;});
 await page.getByRole("button",{name:"Use this draft with Job Search Pass",exact:true}).click();await page.waitForURL(/plan=pass/);
 const handoff=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("workcv-cv-tool-handoff-v1")));
 assert.equal(handoff.patch.targetRole,"Customer Service Team Leader");assert.match(handoff.patch.coverLetter.paragraphs[0],/Reviewed opening/);assert.match(handoff.patch.applicationPack.bullets[0],/Reviewed bullet/);assert.match(handoff.sourceText,/Led eight advisers/);
 checks.push("320px layout; blocked storage recovery; Pass preserves reviewed wording and original source snapshot");
 await page.goto(base+"/tools/cover-letter-generator-uk",{waitUntil:"networkidle",timeout:90000});
 await page.getByRole("button",{name:"Try example",exact:true}).click();
 await page.getByRole("button",{name:/Generate.*letter|Write.*letter|Draft.*letter/i}).click();
 await page.getByRole("button",{name:"Keep this letter with Job Search Pass",exact:true}).waitFor();
 await page.getByRole("button",{name:"Keep this letter with Job Search Pass",exact:true}).click();await page.waitForURL(/plan=pass/);
 const letter=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("workcv-cv-tool-handoff-v1")));
 assert.deepEqual(letter.patch.coverLetter.paragraphs,draft.coverLetter.paragraphs);checks.push("Letter generator Pass handoff retains generated paragraphs");
 assert.deepEqual(errors,[]);writeFileSync(out+"/tailoring-checks.json",JSON.stringify({checks,errors,requests},null,2));console.log(JSON.stringify({checks,errors,requests},null,2));
} finally { await browser.close(); }
