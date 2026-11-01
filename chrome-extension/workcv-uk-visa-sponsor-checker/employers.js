(function (scope) {
  "use strict";

  // Employer names as job boards show them, and the links the badges open.
  // Shared by the content script and popup; tests load it with node:vm.

  var origin = "https://workcv.co.uk";
  var tracking = "utm_source=chrome_extension&utm_medium=referral&utm_campaign=sponsor_extension";

  // Recruitment agencies post most adverts on some boards without naming the
  // employer, so their own licence says nothing about the job.
  var agencyWords = /\b(recruit\w*|resourcing|staffing|personnel|headhunt\w*|talent (?:acquisition|solutions|partners)|employment (?:agency|services)|search (?:and|&) selection)\b/i;
  // Whole names only, so "Hays Travel" stays an employer.
  var agencyNames = /^(hays|michael page(?: \w+)?|page executive|robert half|robert walters|harvey nash|adecco|randstad|manpower(?:group)?|pertemps|office angels|brook street|blue arrow|gi group|morgan mckinley|search consultancy|hunter selection)(?: (?:uk|ltd|limited|plc|group))*$/i;

  /** First line of the element's text, tidied: what the job board shows as the employer. */
  function cleanName(value) {
    var line = String(value || "").split(/\n/).map(function (part) { return part.trim(); }).filter(Boolean)[0] || "";
    return line.replace(/\s+/g, " ").replace(/\s*[·•|]\s*$/, "").trim().slice(0, 160);
  }

  function isLikelyAgency(name) {
    var tidy = cleanName(name);
    return agencyWords.test(tidy) || agencyNames.test(tidy);
  }

  /** Cache key: case, accents, punctuation and spacing do not change the answer. */
  function cacheKey(name) {
    return cleanName(name).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function batchUrl() {
    return origin + "/api/tools/sponsor-check/batch";
  }

  function checkerUrl(name) {
    return origin + "/tools/uk-visa-sponsor-checker?q=" + encodeURIComponent(cleanName(name)) + "&" + tracking;
  }

  function guideUrl() {
    return origin + "/right-to-work-cv-uk?" + tracking;
  }

  scope.WorkCVSponsorEmployers = {
    cleanName: cleanName,
    isLikelyAgency: isLikelyAgency,
    cacheKey: cacheKey,
    batchUrl: batchUrl,
    checkerUrl: checkerUrl,
    guideUrl: guideUrl
  };
})(globalThis);
