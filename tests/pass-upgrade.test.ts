import assert from "node:assert/strict";
import test from "node:test";

import { WORKCV_PASS, WORKCV_PRICE } from "../lib/commerce.ts";
import {
  PASS_UPGRADE_WINDOW_DAYS,
  formatPence,
  passUpgradeMode,
  upgradeDiscountBody,
  upgradeDiscountCode,
  upgradeOfferFrom,
} from "../lib/pass-upgrade.ts";

const now = new Date("2026-10-01T12:00:00Z");
const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);

test("a recent single-CV buyer pays the Pass price minus what they paid", () => {
  const offer = upgradeOfferFrom({ singleOrders: [{ amountMinor: WORKCV_PRICE.amountMinor, paidAt: daysAgo(3) }], passActive: false, now });
  assert.deepEqual(offer, {
    eligible: true,
    creditMinor: 799,
    priceMinor: WORKCV_PASS.amountMinor - 799,
    endsAt: new Date(daysAgo(3).getTime() + PASS_UPGRADE_WINDOW_DAYS * 86_400_000).toISOString(),
  });
  assert.equal(formatPence(offer.eligible ? offer.priceMinor : 0), "£17.00");
});

test("the offer ends after the window, and never applies with an active Pass", () => {
  assert.equal(upgradeOfferFrom({ singleOrders: [{ amountMinor: 799, paidAt: daysAgo(PASS_UPGRADE_WINDOW_DAYS) }], passActive: false, now }).eligible, false);
  assert.equal(upgradeOfferFrom({ singleOrders: [{ amountMinor: 799, paidAt: daysAgo(PASS_UPGRADE_WINDOW_DAYS - 0.01) }], passActive: false, now }).eligible, true);
  assert.equal(upgradeOfferFrom({ singleOrders: [{ amountMinor: 799, paidAt: daysAgo(1) }], passActive: true, now }).eligible, false);
  assert.equal(upgradeOfferFrom({ singleOrders: [], passActive: false, now }).eligible, false);
});

test("credit is what was actually paid, capped at the single-CV price", () => {
  const lower = upgradeOfferFrom({ singleOrders: [{ amountMinor: 500, paidAt: daysAgo(1) }], passActive: false, now });
  assert.equal(lower.eligible && lower.priceMinor, WORKCV_PASS.amountMinor - 500);
  const higher = upgradeOfferFrom({ singleOrders: [{ amountMinor: 5000, paidAt: daysAgo(1) }], passActive: false, now });
  assert.equal(higher.eligible && higher.creditMinor, WORKCV_PRICE.amountMinor);
  const free = upgradeOfferFrom({ singleOrders: [{ amountMinor: 0, paidAt: daysAgo(1) }, { amountMinor: null, paidAt: daysAgo(1) }], passActive: false, now });
  assert.equal(free.eligible, false);
});

test("the newest qualifying order sets the deadline", () => {
  const offer = upgradeOfferFrom({
    singleOrders: [{ amountMinor: 799, paidAt: daysAgo(10) }, { amountMinor: 799, paidAt: daysAgo(2) }],
    passActive: false,
    now,
  });
  assert.equal(offer.eligible && offer.endsAt, new Date(daysAgo(2).getTime() + PASS_UPGRADE_WINDOW_DAYS * 86_400_000).toISOString());
});

test("rollout mode defaults to test users only", () => {
  assert.equal(passUpgradeMode(undefined), "test");
  assert.equal(passUpgradeMode("nonsense"), "test");
  assert.equal(passUpgradeMode("on"), "on");
  assert.equal(passUpgradeMode("off"), "off");
});

test("discount codes are single-use flat credits on the Pass only", () => {
  const code = upgradeDiscountCode();
  assert.match(code, /^UPG[A-Z2-9]{12}$/);
  assert.ok(code.length <= 16);
  const body = upgradeDiscountBody({ creditMinor: 799, passProductId: "pdt_pass", code, now });
  assert.equal(body.type, "flat");
  assert.deepEqual(body.restricted_to, ["pdt_pass"]);
  assert.equal(body.usage_limit, 1);
  assert.deepEqual(body.currency_options, [{ currency: "GBP", is_default: true, max_amount_possible: 799 }]);
  assert.equal(body.expires_at, "2026-10-01T14:00:00.000Z");
});
