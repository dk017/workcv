import assert from "node:assert/strict";
import test from "node:test";

import {
  WORKCV_PASS,
  WORKCV_PASS_PRODUCT_ID,
  WORKCV_PRODUCT_ID,
  isWorkcvPlan,
  planForProductId,
  productIdForPlan,
} from "../lib/commerce.ts";
import { duplicateTitle, prepareDuplicateCv } from "../lib/cv-duplicate.ts";
import { sampleCv } from "../lib/editor-data.ts";
import {
  isDocumentUnlocked,
  passExpiry,
  passStatusFrom,
  refundRevokesAccess,
  unlockedDocumentSql,
} from "../lib/pass-rules.ts";

const day = 86_400_000;
const paidAt = new Date("2026-10-01T12:00:00Z");

test("the pass lasts 90 days from payment", () => {
  assert.equal(WORKCV_PASS.days, 90);
  assert.equal(passExpiry(paidAt).getTime() - paidAt.getTime(), 90 * day);
});

test("CVs created before the pass ends are unlocked, including older ones", () => {
  const unlocked = (createdAt: Date) =>
    isDocumentUnlocked({ documentCreatedAt: createdAt, hasDirectOrder: false, passPaidAts: [paidAt] });
  assert.equal(unlocked(new Date(paidAt.getTime() - 30 * day)), true, "CV made before buying");
  assert.equal(unlocked(new Date(paidAt.getTime() + 89 * day)), true, "CV made on day 89");
  assert.equal(unlocked(new Date(paidAt.getTime() + 90 * day)), false, "CV made after the pass ends");
});

test("a CV's own order unlocks it with or without a pass", () => {
  assert.equal(isDocumentUnlocked({ documentCreatedAt: new Date(), hasDirectOrder: true, passPaidAts: [] }), true);
  assert.equal(isDocumentUnlocked({ documentCreatedAt: new Date(), hasDirectOrder: false, passPaidAts: [] }), false);
});

test("pass status reports days left and expiry, never negative", () => {
  const active = passStatusFrom([paidAt], new Date(paidAt.getTime() + 10 * day));
  assert.deepEqual(active, { active: true, expiresAt: passExpiry(paidAt).toISOString(), daysLeft: 80 });
  const ended = passStatusFrom([paidAt], new Date(paidAt.getTime() + 91 * day));
  assert.equal(ended.active, false);
  assert.equal(ended.daysLeft, 0);
  assert.equal(passStatusFrom([]).active, false);
  const renewed = passStatusFrom([paidAt, new Date(paidAt.getTime() + 60 * day)], new Date(paidAt.getTime() + 100 * day));
  assert.equal(renewed.active, true, "a second pass extends access from its own payment date");
});

test("only a full refund revokes access", () => {
  assert.equal(refundRevokesAccess(2499, 2499), true);
  assert.equal(refundRevokesAccess(1000, 2499), false);
  assert.equal(refundRevokesAccess(null, 2499), false);
});

test("unlock SQL excludes refunded orders and uses the pass window", () => {
  const sql = unlockedDocumentSql("$2", "$3");
  assert.equal((sql.match(/refunded_at IS NULL/g) || []).length, 2);
  assert.match(sql, /p\.product_id = \$2/);
  assert.match(sql, /make_interval\(days => \$3::int\)/);
});

test("plans map to the right Dodo products and back", () => {
  assert.equal(productIdForPlan("cv"), WORKCV_PRODUCT_ID);
  assert.equal(productIdForPlan("pass"), WORKCV_PASS_PRODUCT_ID);
  assert.equal(planForProductId(WORKCV_PASS_PRODUCT_ID), "pass");
  assert.equal(planForProductId(WORKCV_PRODUCT_ID), "cv");
  assert.equal(planForProductId("pdt_unknown"), null);
  assert.equal(isWorkcvPlan("pass"), true);
  assert.equal(isWorkcvPlan("gold"), false);
  assert.notEqual(WORKCV_PASS_PRODUCT_ID, WORKCV_PRODUCT_ID);
});

test("duplicating a CV keeps experience but drops job-specific details", () => {
  const source = {
    ...sampleCv,
    targeting: { role: "Admin", jobDescription: "An old advert", priorities: [] },
    coverLetter: {
      jobTitle: "Customer Service Assistant",
      employer: "Birch Office Services",
      reference: "CS-14",
      recipientName: "Ms Shah",
      greeting: "hiring-manager" as const,
      employerAddress: "14 Park Row",
      includeDate: true,
      paragraphs: ["Opening", "Evidence"],
    },
  };
  const copy = prepareDuplicateCv(source);
  assert.equal(copy.fullName, sampleCv.fullName);
  assert.deepEqual(copy.experience, sampleCv.experience);
  assert.equal(copy.targeting, undefined);
  assert.equal(copy.coverLetter?.employer, "");
  assert.equal(copy.coverLetter?.recipientName, "");
  assert.equal(copy.coverLetter?.reference, "");
  assert.deepEqual(copy.coverLetter?.paragraphs, ["Opening", "Evidence"]);
  copy.experience[0].role = "Changed";
  assert.notEqual(sampleCv.experience[0].role, "Changed", "the source is not mutated");
});

test("duplicate titles do not pile up (copy) suffixes", () => {
  assert.equal(duplicateTitle("Emily Thompson"), "Emily Thompson (copy)");
  assert.equal(duplicateTitle("Emily Thompson (copy)"), "Emily Thompson (copy)");
  assert.equal(duplicateTitle("  "), "My CV (copy)");
});

test("duplicating turns the previous employer's name into a prompt", () => {
  const copy = prepareDuplicateCv({
    ...sampleCv,
    coverLetter: {
      jobTitle: "Advisor",
      employer: "Birch & Co. (UK)",
      reference: "",
      recipientName: "",
      greeting: "hiring-manager",
      employerAddress: "",
      includeDate: true,
      paragraphs: ["I want to join Birch & Co. (UK) because birch & co. (uk) values service.", "No employer here."],
    },
  });
  assert.deepEqual(copy.coverLetter?.paragraphs, [
    "I want to join [employer] because [employer] values service.",
    "No employer here.",
  ]);
});
