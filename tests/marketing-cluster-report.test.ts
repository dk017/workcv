import assert from "node:assert/strict";
import test from "node:test";

import {
  addMarketingCluster,
  marketingClusterForPath,
} from "../scripts/growth-report-core.mjs";

test("growth reports group acquisition and conversion rows by marketing cluster", () => {
  assert.equal(marketingClusterForPath("/tools/job-application-pack-uk"), "applications");
  assert.equal(marketingClusterForPath("/career-tools?utm_source=google"), "core-commercial");
  assert.equal(marketingClusterForPath("/unknown-topic"), "other");
  assert.deepEqual(
    addMarketingCluster([{ landing_path: "/top-job-boards-uk", signups: 2 }])[0],
    { landing_path: "/top-job-boards-uk", signups: 2, marketing_cluster: "job-search" },
  );
});
