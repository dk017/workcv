import assert from "node:assert/strict";
import test from "node:test";

// The production CLI is plain ESM so it can run directly with Node.
import {
  calculateStepConversions,
  normalizeMetricRows,
  normalizeSourceRows,
} from "../scripts/growth-report-core.mjs";

test("growth report calculates fixture conversions and normalises database counts", () => {
  const metrics = normalizeMetricRows([
    { metric: "qualified_sessions", value: "100" },
    { metric: "marketing_cta_clickers", value: "25" },
    { metric: "login_starters", value: "20" },
    { metric: "signups", value: "10" },
    { metric: "activated_users", value: "7" },
    { metric: "preview_ready_users", value: "5" },
    { metric: "pdf_clickers", value: "4" },
    { metric: "checkout_openers", value: "3" },
    { metric: "payment_starters", value: "2" },
    { metric: "positive_production_orders", value: "1" },
    { metric: "successful_pdf_downloaders", value: "1" },
  ]);
  const conversions = calculateStepConversions(metrics);

  assert.equal(conversions[0].conversion, "25.0%");
  assert.equal(conversions[2].conversion, "50.0%");
  assert.equal(conversions[8].conversion, "50.0%");
  assert.equal(conversions[9].conversion, "100.0%");
  assert.equal(metrics[0].value, 100);

  assert.deepEqual(
    normalizeSourceRows([
      {
        source: "chatgpt",
        landing_path: "/",
        signups: "2",
        activated: "2",
        pdf_clickers: "1",
        checkout_openers: "1",
        buyers: "1",
      },
    ])[0],
    {
      source: "chatgpt",
      landing_path: "/",
      signups: 2,
      activated: 2,
      pdf_clickers: 1,
      checkout_openers: 1,
      buyers: 1,
    },
  );
});
