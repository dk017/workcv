(function (scope) {
  "use strict";

  // Builds the WorkCV link that opens a captured job. The job travels in the URL
  // fragment (#job=...), which browsers never send to the server.
  // Must match decodeJobFromHash in lib/job-tailor.ts.

  var origin = "https://workcv.co.uk";
  var tracking = "utm_source=chrome_extension&utm_medium=referral&utm_campaign=tailor_cv";

  function base64Url(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = "";
    bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function buildTailorUrl(job) {
    var payload = JSON.stringify({
      v: 1,
      role: String(job.role || "").slice(0, 160),
      employer: String(job.employer || "").slice(0, 160),
      advertText: String(job.advertText || "").slice(0, 12000)
    });
    return origin + "/tailor?" + tracking + "#job=" + base64Url(payload);
  }

  // Sponsor register search. Only the employer name is sent.
  function sponsorCheckUrl(employer) {
    return origin + "/api/tools/sponsor-check?q=" + encodeURIComponent(String(employer || "").slice(0, 160));
  }

  function sponsorPageUrl(employer) {
    return origin + "/tools/uk-visa-sponsor-checker?q=" + encodeURIComponent(String(employer || "").slice(0, 160)) + "&" + tracking.replace("tailor_cv", "sponsor_check");
  }

  scope.WorkCVJobLink = { buildTailorUrl: buildTailorUrl, sponsorCheckUrl: sponsorCheckUrl, sponsorPageUrl: sponsorPageUrl };
})(globalThis);
