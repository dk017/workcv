import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {chromium} from "playwright-core";
const base="http://127.0.0.1:3117",out="tmp/job-pass-review";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
const checks=[],errors=[];
try{
 const page=await browser.newPage({viewport:{width:1365,height:1000}});
 page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
 await page.route("**/api/**",r=>r.fulfill({status:200,contentType:"application/json",body:"{}"}));
 for(const path of ["/livecareer-alternative","/myperfectcv-alternative-uk","/cv-after-long-service-uk","/overqualified-cv-example-uk"]){
  const response=await page.goto(base+path,{waitUntil:"networkidle",timeout:90000});assert.equal(response.status(),200,path);
  assert.equal(await page.locator("h1").count(),1,path);assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://workcv.co.uk"+path);
  assert.ok(await page.locator('meta[name="description"]').getAttribute("content"));assert.ok((await page.locator("body").innerText()).includes("£24.99"));
  await page.screenshot({path:out+path.replaceAll("/","-")+"-desktop.png"});await page.setViewportSize({width:320,height:850});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"Mobile overflow: "+path);
  await page.screenshot({path:out+path.replaceAll("/","-")+"-mobile.png"});await page.setViewportSize({width:1365,height:1000});checks.push(path+": canonical, plan, desktop/mobile");
 }
 await page.goto(base+"/livecareer-alternative",{waitUntil:"networkidle"});await page.getByLabel("30 days",{exact:true}).check();assert.ok((await page.locator("body").innerText()).includes("£21.80"));assert.ok((await page.locator("body").innerText()).includes("costs less over 30 days"));
 const href=await page.getByRole("link",{name:"Start with Job Search Pass",exact:true}).first().getAttribute("href");assert.match(new URLSearchParams(href.split("?")[1]).get("next"),/plan=pass/);checks.push("Cost honesty and selected plan");
 await page.goto(base+"/cv-after-long-service-uk",{waitUntil:"networkidle"});
 await page.getByRole("button",{name:"Try a fictional timeline"}).click();await page.getByRole("button",{name:"Build my outline",exact:true}).click();assert.match(await page.getByLabel("Your reviewable outline").inputValue(),/2009 – 2026/);
 await page.getByRole("textbox",{name:/^Target role \(optional\)/}).fill("New target");assert.equal(await page.getByRole("button",{name:"Review this outline in the editor",exact:true}).isDisabled(),true);await page.getByRole("button",{name:"Build my outline",exact:true}).click();
 await page.screenshot({path:out+"/timeline-result.png"});
 await page.route("**/editor?**",r=>r.fulfill({status:200,contentType:"text/html",body:"<h1>Editor handoff test</h1>"}));
 await page.getByRole("button",{name:"Continue with Job Search Pass selected"}).click();await page.waitForURL(/plan=pass/);
 const handoff=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("workcv-cv-tool-handoff-v1")));assert.equal(handoff.patch.targetRole,"New target");assert.equal(handoff.patch.experience[0].role,"Customer Service Assistant");checks.push("Timeline precision, stale guard, Pass handoff");
 await page.goto(base+"/overqualified-cv-example-uk",{waitUntil:"networkidle"});await page.getByRole("button",{name:"Try a fictional selection"}).click();await page.getByRole("button",{name:"Build my selection",exact:true}).click();assert.match(await page.getByLabel("Your reviewable outline").inputValue(),/Office Manager/);
 await page.getByRole("button",{name:"Keep a local copy for another version"}).click();assert.equal(await page.getByRole("button",{name:/Load 1:/}).count(),1);await page.screenshot({path:out+"/selection-result.png"});
 await page.getByRole("button",{name:"Review this outline in the editor",exact:true}).click();await page.waitForURL(/editor/);const selected=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("workcv-cv-tool-handoff-v1")));assert.equal(selected.patch.experience,undefined);assert.ok(selected.patch.applicationPack.originalCvText.includes("Office Manager"));checks.push("Evidence review and notes handoff");
 assert.deepEqual(errors,[]);writeFileSync(out+"/checks.json",JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
