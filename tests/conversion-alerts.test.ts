import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dbSource = readFileSync("lib/db.ts", "utf8");
const alertSource = readFileSync("lib/conversion-alerts.ts", "utf8");
const emailSource = readFileSync("lib/email.ts", "utf8");
const eventRouteSource = readFileSync(
  "app/api/events/editor/route.ts",
  "utf8",
);
const checkoutRouteSource = readFileSync(
  "app/api/checkout/dodo/route.ts",
  "utf8",
);
const cvRouteSource = readFileSync("app/api/cv/current/route.ts", "utf8");
const pdfRouteSource = readFileSync("app/api/cv/pdf/route.ts", "utf8");
const webhookRouteSource = readFileSync(
  "app/api/webhooks/dodo/route.ts",
  "utf8",
);

test("conversion alerts are persisted, deduplicated and rate limited", () => {
  assert.match(dbSource, /CREATE TABLE IF NOT EXISTS workcv_conversion_alerts/);
  assert.match(alertSource, /occurrence_count >= \$2/);
  assert.match(alertSource, /last_alert_sent_at < NOW\(\) - \(\$3 \* INTERVAL '1 minute'\)/);
  assert.match(alertSource, /last_alert_attempt_at < NOW\(\) - INTERVAL '5 minutes'/);
  assert.match(alertSource, /claimInMemory/);
});

test("alert emails go to the support inbox without sensitive conversion data", () => {
  assert.match(
    emailSource,
    /process\.env\.CONVERSION_ALERT_EMAIL \|\| "contact@workcv\.co\.uk"/,
  );
  assert.match(emailSource, /No CV content, card data, authentication codes, or secrets/);
  assert.doesNotMatch(alertSource, /JSON\.stringify\(error\)|error\.stack/);
});

test("fatal conversion stages report alerts", () => {
  assert.match(cvRouteSource, /category: "cv_save_server_failure"/);
  assert.match(checkoutRouteSource, /category: "checkout_creation_failure"/);
  assert.match(pdfRouteSource, /category: "pdf_generation_failure"/);
  assert.match(
    webhookRouteSource,
    /category: "payment_webhook_processing_failure"/,
  );
  assert.match(
    webhookRouteSource,
    /category: "payment_webhook_metadata_failure"/,
  );
});

test("repeated browser failures alert only after a threshold", () => {
  assert.match(eventRouteSource, /eventName === "save_failed"/);
  assert.match(eventRouteSource, /category: "repeated_cv_save_failure"/);
  assert.match(eventRouteSource, /threshold: 3/);
  assert.match(eventRouteSource, /eventName === "pdf_generation_failed"/);
  assert.match(eventRouteSource, /threshold: 2/);
});
