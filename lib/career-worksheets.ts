import { z } from "zod";
import type { CvToolPatch } from "./cv-tool-handoff.ts";

export const MAX_WORKSHEET_BYTES = 100 * 1024;
const text = (max: number) => z.string().trim().max(max);
const date = z.string().regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM; do not guess a month.").refine(v => Number(v.slice(0,4)) >= 1900 && Number(v.slice(0,4)) <= 2100, "Check the year.");
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
export const timelineEvidenceSchema = z.object({ id, action: text(500).min(5,"Describe what you did."), context: text(200), result: text(300), reminder: text(200), selection: z.enum(["use","notes","unsure"]) });
export const timelineRoleSchema = z.object({ id, employer: text(160).min(1,"Enter the employer."), location: text(160), title: text(160).min(1,"Enter the actual job title."), qualifier: text(100), start: date, end: z.string(), current: z.boolean(), evidence: z.array(timelineEvidenceSchema).min(1).max(8) }).superRefine((r,ctx) => {
 if (!r.current && !date.safeParse(r.end).success) ctx.addIssue({code:"custom",path:["end"],message:"Enter the end as YYYY or YYYY-MM, or select current role."});
 if (!r.current && date.safeParse(r.end).success && earliest(r.start) > latest(r.end)) ctx.addIssue({code:"custom",path:["end"],message:"End date cannot precede start date."});
 if ((r.title + (r.qualifier ? " ("+r.qualifier+")" : "")).length > 160) ctx.addIssue({code:"custom",path:["qualifier"],message:"Title and clarification together must fit 160 characters."});
 r.evidence.forEach((e,i)=>{if([e.action,e.context,e.result].filter(Boolean).join(" — ").length>1000) ctx.addIssue({code:"custom",path:["evidence",i],message:"Keep the combined action, context and result under 1,000 characters."});});
});
export const timelineSchema = z.object({ version:z.literal(1), targetRole:text(140), roles:z.array(timelineRoleSchema).min(1).max(20) });
export type TimelineDraft = z.infer<typeof timelineSchema>;
export type TimelineRole = z.infer<typeof timelineRoleSchema>;
export const selectionSchema = z.object({
 version:z.literal(1), targetRole:text(140).min(2,"Enter your target role."),
 requirements:z.array(z.object({id,text:text(240).min(5,"Describe each vacancy requirement.")})).min(1).max(8),
 evidence:z.array(z.object({id,originalText:text(600).min(5,"Describe your actual evidence."),role:text(160),employer:text(160),dateContext:text(160),requirementIds:z.array(id).max(8),selection:z.enum(["lead","brief","notes","unsure"]),briefText:text(300)})).min(1).max(20),
 motivation:text(500),
}).superRefine((d,ctx)=>{
 const ids=new Set(d.requirements.map(r=>r.id));
 d.evidence.forEach((e,i)=>{
  if(e.requirementIds.some(x=>!ids.has(x))) ctx.addIssue({code:"custom",path:["evidence",i,"requirementIds"],message:"Review a link to a removed requirement."});
  if(e.selection==="brief" && e.briefText.length<5) ctx.addIssue({code:"custom",path:["evidence",i,"briefText"],message:"Write the brief wording yourself (at least 5 characters)."});
 });
});
export type SelectionDraft = z.infer<typeof selectionSchema>;
function earliest(v:string) { return v.length===4 ? v+"-01" : v; }
function latest(v:string) { return v.length===4 ? v+"-12" : v; }
export function assertWorksheetSize(value:unknown) {
 if(new TextEncoder().encode(JSON.stringify(value)).byteLength>MAX_WORKSHEET_BYTES) throw new Error("These notes are too large. Copy them and shorten the worksheet before continuing.");
}
function assertIds(ids:string[]) { if(new Set(ids).size!==ids.length) throw new Error("Some worksheet entries have duplicate IDs. Remove the duplicate entry."); }
export function timelineNotes(d:TimelineDraft) {
 return [d.targetRole,...d.roles.map(r=>[r.title,r.employer,r.location,r.start+" – "+(r.current?"Present":r.end),...r.evidence.map(e=>[e.selection.toUpperCase(),e.action,e.context,e.result,e.reminder&&"Reminder: "+e.reminder].filter(Boolean).join(" — "))].filter(Boolean).join("\n"))].join("\n\n");
}
export function buildTimeline(raw:TimelineDraft):{text:string;patch:CvToolPatch;warnings:string[]} {
 assertWorksheetSize(raw);
 const d=timelineSchema.parse(raw);
 assertIds(d.roles.flatMap(r=>[r.id,...r.evidence.map(e=>e.id)]));
 const roles=[...d.roles].sort((a,b)=>Number(b.current)-Number(a.current) || earliest(b.start).localeCompare(earliest(a.start)));
 const warnings:string[]=[];
 for(let i=0;i<roles.length;i++) for(let j=i+1;j<roles.length;j++) {
  const a=roles[i],b=roles[j];
  if(earliest(a.start)<= (b.current?"9999-12":latest(b.end)) && earliest(b.start)<= (a.current?"9999-12":latest(a.end))) warnings.push(a.title+" and "+b.title+": dates may overlap. Check them; concurrent work is allowed.");
 }
 const experience=roles.map(r=>({id:r.id,role:r.title+(r.qualifier?" ("+r.qualifier+")":""),company:r.employer,location:r.location,start:r.start,end:r.current?"Present":r.end,bullets:r.evidence.filter(e=>e.selection==="use").map(e=>[e.action,e.context,e.result].filter(Boolean).join(" — ")).join("\n")}));
 if(roles.some(r=>r.evidence.some(e=>e.selection==="unsure"))) warnings.push("Evidence marked unsure is kept in your notes, outside the CV outline.");
 if(experience.every(r=>!r.bullets)) warnings.push("No evidence selected for the CV. Choose Use for statements you want to include.");
 return {text:experience.map(r=>[r.role+" — "+r.company,r.location,r.start+" – "+r.end,r.bullets].filter(Boolean).join("\n")).join("\n\n"),patch:{experience,targetRole:d.targetRole,layoutPreset:"experienced"},warnings};
}
export function selectionNotes(d:SelectionDraft) {
 return ["Target: "+d.targetRole,"Vacancy requirements",...d.requirements.map(r=>r.text),"Original evidence",...d.evidence.map(e=>[e.originalText,e.role,e.employer,e.dateContext,"Selection: "+e.selection,e.selection==="brief"&&"My brief wording: "+e.briefText,"Linked requirements: "+d.requirements.filter(r=>e.requirementIds.includes(r.id)).map(r=>r.text).join("; ")].filter(Boolean).join("\n")),d.motivation&&"Reason: "+d.motivation].filter(Boolean).join("\n\n");
}
export function buildSelection(raw:SelectionDraft):{text:string;patch:CvToolPatch;unmatched:string[]} {
 assertWorksheetSize(raw);
 const d=selectionSchema.parse(raw);
 assertIds([...d.requirements.map(r=>r.id),...d.evidence.map(e=>e.id)]);
 const selected=d.evidence.filter(e=>e.selection==="lead" || e.selection==="brief").sort((a,b)=>Number(b.selection==="lead")-Number(a.selection==="lead"));
 if(!selected.length) throw new Error("Choose at least one piece of evidence to lead with or include briefly.");
 const bullets=selected.map(e=>e.selection==="brief"?e.briefText:e.originalText);
 const unmatched=d.requirements.filter(r=>!selected.some(e=>e.requirementIds.includes(r.id))).map(r=>r.text);
 const evidenceReview=d.requirements.map(r=>r.text+" — "+(unmatched.includes(r.text)?"No selected evidence linked.":"You linked evidence; review whether it supports this requirement."));
 const lines=selected.map((e,i)=>[e.role&&"Actual role: "+e.role,e.employer&&"Employer: "+e.employer,e.dateContext,bullets[i]].filter(Boolean).join("\n"));
 const matrix=d.requirements.map(r=>[r.text,...selected.filter(e=>e.requirementIds.includes(r.id)).map(e=>"My linked evidence: "+(e.selection==="brief"?e.briefText:e.originalText)),unmatched.includes(r.text)?"No selected evidence linked.": "Review whether this evidence supports the requirement."].join("\n"));
 const textOutput=["Evidence for "+d.targetRole,...lines,d.motivation&&"My reason (review before use): "+d.motivation,"Requirement-to-evidence map",...matrix].filter(Boolean).join("\n\n");
 const originalCvText=selectionNotes(d);
 if(originalCvText.length>24000) throw new Error("The complete notes exceed the editor's 24,000-character limit. Download them and shorten the notes before continuing.");
 return {text:textOutput,unmatched,patch:{targetRole:d.targetRole,applicationPack:{bullets,coverLetter:"",interviewPrompts:[],thankYouEmail:"",originalCvText,evidenceReview}}};
}
