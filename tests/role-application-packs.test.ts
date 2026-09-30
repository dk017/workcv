import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getRoleCvTemplate, parseRoleTemplate } from "../lib/role-cv-templates.ts";
import { roleApplicationPacks } from "../lib/role-application-packs.ts";
import { buildRolePackDraft, type RolePackFields } from "../lib/role-pack-draft.ts";
import { createBlankCv } from "../lib/editor-data.ts";
import { parseCvData } from "../lib/cv-schema.ts";
import { coverLetterPlainText } from "../lib/cover-letter-document.ts";
import { buildLoginHref, safeInternalRedirect } from "../lib/safe-redirect.ts";
import { coverLetterEditorRoute } from "../lib/cover-letter-handoff.ts";
const ids = process.env.ROLE_PACK_AUDIT ? [process.env.ROLE_PACK_AUDIT] : Object.keys(roleApplicationPacks);
const fields: RolePackFields = { fullName:"Test Applicant",targetRole:"Assistant",company:"My employer",profile:"My own relevant experience.",motivation:"I want to use my existing skills.",evidence:"I organised a community event and checked the attendance list.",moreEvidence:"I helped a volunteer team explain instructions to visitors." };
for(const id of ids) {
 const p=roleApplicationPacks[id];
 test(id+": complete matching letter, guidance and downloadable checklist",()=>{
  assert.equal(parseRoleTemplate(p.roleTemplate),p.roleTemplate);
  const example=parseCvData(getRoleCvTemplate(p.roleTemplate));
  assert.ok(example.fullName); assert.ok(example.experience.some(x=>x.company));
  assert.ok(p); assert.equal(p.paragraphs.length,4);assert.ok(p.paragraphs.every(x=>x.length>65));assert.ok(p.paragraphs[0].includes(p.employer));assert.equal(p.prompts.length,2);assert.ok(p.checklist.length>=5);
  const resource=readFileSync(`public/downloads/${id}-application-checklist.txt`,"utf8");
  for(const x of p.checklist) assert.ok(resource.includes(x));
  assert.ok(resource.includes("https://workcv.co.uk"+p.path));
  assert.match(p.sourceUrl,/^https:\/\/nationalcareers.service.gov.uk\//);
 });
 test(id+": indexable route exposes the pack and has a sitemap entry",()=>{
  const page=readFileSync(`app${p.path}/page.tsx`,"utf8");assert.ok(page.includes(p.path));assert.ok(page.includes("RoleApplicationPack")||(id==="student"&&page.includes("EarlyCareerCvPage")));
  assert.ok(readFileSync("app/sitemap.ts","utf8").includes(p.path));
 });
 test(id+": user facts survive without importing fictional work or education",()=>{
  const cv=parseCvData(JSON.parse(JSON.stringify({...createBlankCv(),...buildRolePackDraft({...fields,targetRole:p.targetRole},id==="student")})));
  assert.equal(cv.fullName,fields.fullName);assert.equal(cv.profile,fields.profile);assert.ok(cv.experience.every(x=>!x.role&&!x.company&&!x.bullets));assert.ok(cv.education.every(x=>!x.qualification&&!x.institution));
  const letter=coverLetterPlainText(cv);assert.ok(letter.includes(fields.evidence));assert.ok(letter.includes(fields.moreEvidence));assert.ok(letter.includes(fields.company));assert.ok(!letter.includes(p.employer));assert.equal(cv.layoutPreset,id==="student"?"education-first":undefined);
  const login=new URL(buildLoginHref(coverLetterEditorRoute),"https://workcv.invalid");assert.equal(safeInternalRedirect(login.searchParams.get("next")),coverLetterEditorRoute);assert.ok(!coverLetterEditorRoute.includes("roleTemplate="));
 });
}
test("empty and oversized fields cannot silently transfer unusable content",()=>{
 assert.throws(()=>buildRolePackDraft({...fields,evidence:" "}));assert.throws(()=>buildRolePackDraft({...fields,evidence:"x".repeat(1801)}));
});

test("maximum-length personal details form a valid saved CV and letter",()=>{
 const limits={fullName:100,targetRole:140,company:140,profile:1000,motivation:500,evidence:1800,moreEvidence:1800};
 const maximum=Object.fromEntries(Object.entries(limits).map(([k,n])=>[k,"x".repeat(n)])) as RolePackFields;
 const cv=parseCvData({...createBlankCv(),...buildRolePackDraft(maximum)});
 assert.equal(cv.coverLetter?.paragraphs[1].length,1800);
});
