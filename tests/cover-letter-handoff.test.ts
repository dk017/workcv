import assert from "node:assert/strict";
import test, { after, afterEach } from "node:test";
import mammoth from "mammoth";
import { buildCoverLetterPatch, coverLetterEditorRoute } from "../lib/cover-letter-handoff.ts";
import { cvToolHandoffKey, readCvToolHandoff, removeCvToolHandoff, writeCvToolHandoff } from "../lib/cv-tool-handoff.ts";
import { createBlankCv } from "../lib/editor-data.ts";
import { parseCvData } from "../lib/cv-schema.ts";
import { coverLetterPlainText } from "../lib/cover-letter-document.ts";
import { renderCoverLetterDocx } from "../lib/cover-letter-docx.ts";
import { buildLoginHref, safeInternalRedirect } from "../lib/safe-redirect.ts";
import { DebouncedSaveManager } from "../lib/save-manager.ts";

const source = { fullName: "Amira Khan", targetRole: "Service Lead", company: "Northstar Retail", hiringManager: "Ms Patel", jobDescription: "Lead advisers and resolve complaints." };
const paragraphs = [
  "I am applying for the Service Lead role at Northstar Retail.",
  "I coached four new starters and used Salesforce to follow up complaints.",
  "I reduced overdue complaints by 18% through a new triage process.",
  "Thank you for considering my application. I would welcome a conversation.",
];
const values = new Map<string, string>();
let blocked = false;
const storage = {
  getItem(key: string) { if (blocked) throw new Error("Storage blocked"); return values.get(key) ?? null; },
  setItem(key: string, value: string) { if (blocked) throw new Error("Storage blocked"); values.set(key, value); },
  removeItem(key: string) { if (blocked) throw new Error("Storage blocked"); values.delete(key); },
};
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage } });
afterEach(() => { blocked = false; values.clear(); });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
const makeCv = () => parseCvData({ ...createBlankCv(), ...buildCoverLetterPatch(source, paragraphs) });

test("letter survives login routing and remains editable with the same signature and job context", () => {
  writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch(source, paragraphs) });
  const login = new URL(buildLoginHref(coverLetterEditorRoute), "https://workcv.invalid");
  const next = safeInternalRedirect(login.searchParams.get("next"));
  assert.equal(next, coverLetterEditorRoute);
  assert.equal(new URL(next, login.origin).searchParams.get("new"), "1");
  assert.equal(new URL(next, login.origin).searchParams.get("from"), "career-tool");
  assert.equal(login.search.includes("Amira"), false);
  const cv = parseCvData({ ...createBlankCv(), ...readCvToolHandoff()!.patch });
  assert.equal(cv.targeting?.jobDescription, source.jobDescription);
  assert.equal(cv.coverLetter?.employer, source.company);
  assert.deepEqual(cv.coverLetter?.paragraphs, paragraphs);
  assert.equal(coverLetterPlainText(cv), ["Dear Ms Patel,", "", ...paragraphs.flatMap(p => [p, ""]), "Yours sincerely,", source.fullName].join("\n"));
  assert.equal(cv.profile, "");
});

test("unnamed recipients retain the original UK greeting and sign-off", () => {
  const cv = parseCvData({ ...createBlankCv(), ...buildCoverLetterPatch({ ...source, hiringManager: "" }, paragraphs) });
  assert.match(coverLetterPlainText(cv), /^Dear Sir or Madam,/);
  assert.match(coverLetterPlainText(cv), /Yours faithfully,\nAmira Khan$/);
});

test("later changes cannot mutate the captured result", () => {
  const fields = { ...source };
  const body = [...paragraphs];
  const patch = buildCoverLetterPatch(fields, body);
  fields.company = "Different employer";
  body[0] = "Different opening";
  assert.equal(patch.coverLetter?.employer, source.company);
  assert.equal(patch.coverLetter?.paragraphs[0], paragraphs[0]);
});

test("letter survives save serialisation and Word export", async () => {
  const cv = parseCvData(JSON.parse(JSON.stringify(makeCv())));
  const output = await mammoth.extractRawText({ buffer: Buffer.from(await renderCoverLetterDocx(cv)) });
  for (const paragraph of paragraphs) assert.ok(output.value.includes(paragraph));
  assert.ok(output.value.includes("Dear Ms Patel,"));
  assert.ok(output.value.includes("Amira Khan"));
});

test("blocked storage fails before navigation and does not crash the reader", () => {
  blocked = true;
  assert.throws(() => writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch(source, paragraphs) }), /Storage blocked/);
  assert.equal(readCvToolHandoff(), null);
  assert.doesNotThrow(() => removeCvToolHandoff());
});

test("invalid letter is rejected before leaving the tool", () => {
  assert.throws(() => writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch(source, ["x".repeat(2501)]) }), /not a valid CV/);
  assert.equal(storage.getItem(cvToolHandoffKey), null);
});

test("an older save cannot consume a newer handoff", () => {
  writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch(source, paragraphs) });
  const old = readCvToolHandoff()!;
  writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch({ ...source, company: "Another company" }, paragraphs) });
  removeCvToolHandoff(old);
  assert.equal(readCvToolHandoff()?.patch?.coverLetter?.employer, "Another company");
});

test("source is recoverable after failed saving and the saved letter survives retry", async () => {
  writeCvToolHandoff({ source: "cover-letter-generator", patch: buildCoverLetterPatch(source, paragraphs) });
  const handoff = readCvToolHandoff()!;
  let fail = true;
  let saved = "";
  const manager = new DebouncedSaveManager(createBlankCv(), "initial", async value => {
    if (fail) throw new Error("Offline");
    saved = JSON.stringify(value);
    return { updatedAt: "saved" };
  });
  try {
    manager.setValue(makeCv());
    assert.equal(await manager.flush(), false);
    assert.deepEqual(readCvToolHandoff()?.patch?.coverLetter?.paragraphs, paragraphs);
    fail = false;
    assert.equal(await manager.retry(), true);
    assert.deepEqual(parseCvData(JSON.parse(saved)).coverLetter?.paragraphs, paragraphs);
    removeCvToolHandoff(handoff);
    assert.equal(readCvToolHandoff(), null);
  } finally { manager.dispose(); }
});
