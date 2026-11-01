(function (scope) {
  "use strict";

  // Where each job board shows the employer's name. Each rule returns the
  // elements holding a name; the badge goes straight after that element.
  // Boards change their markup often, so every board also falls back to the
  // JobPosting data most of them publish for Google Jobs.

  var linkedInOldUi = [
    ".job-card-container__primary-description",
    ".artdeco-entity-lockup__subtitle > span",
    ".job-details-jobs-unified-top-card__company-name a",
    ".base-search-card__subtitle a",
    ".topcard__org-name-link"
  ].join(",");

  var ignoredLines = /\b(ago|connections?|alumni|applicants?|promoted|viewed|easy apply|reposted)\b/i;

  // LinkedIn's current job cards have generated class names, so the employer
  // is read by position: the first plain paragraph in the card is the
  // company, the title paragraph above it contains links.
  function linkedInCards(doc) {
    var found = [];
    doc.querySelectorAll('[componentkey^="job-card-component-ref-"]').forEach(function (card) {
      if (card.parentElement && card.parentElement.closest('[componentkey^="job-card-component-ref-"]')) return;
      var paragraphs = card.querySelectorAll("p");
      for (var index = 0; index < paragraphs.length; index += 1) {
        var paragraph = paragraphs[index];
        var text = (paragraph.textContent || "").trim();
        if (!text || paragraph.querySelector(":scope > :not(workcv-sponsor-badge)")) continue;
        if (!ignoredLines.test(text)) found.push(paragraph);
        break;
      }
    });
    return found.concat(Array.prototype.slice.call(doc.querySelectorAll(linkedInOldUi)));
  }

  var rules = [
    { hosts: /(^|\.)linkedin\.com$/, find: linkedInCards },
    { hosts: /(^|\.)indeed\.(com|co\.uk)$/, selector: '[data-testid="company-name"], [data-testid="inlineHeader-companyName"], [data-company-name="true"]' },
    { hosts: /(^|\.)reed\.co\.uk$/, selector: "a.gtmJobListingPostedBy, [data-qa='job-posted-by'] a" },
    { hosts: /(^|\.)totaljobs\.com$/, selector: '[data-at="job-item-company-name"], [data-at="metadata-company-name"]' },
    { hosts: /(^|\.)cv-library\.co\.uk$/, selector: ".job__company-link, .job__details-value--company" },
    { hosts: /(^|\.)glassdoor\.co\.uk$/, selector: '[data-test="employer-name"], [class*="EmployerProfile_compactEmployerName"]' }
  ];

  function ruleFor(hostname) {
    return rules.find(function (rule) { return rule.hosts.test(hostname); }) || null;
  }

  function postings(node, found) {
    if (!node || typeof node !== "object") return found;
    if (Array.isArray(node)) {
      node.forEach(function (item) { postings(item, found); });
      return found;
    }
    var type = node["@type"];
    if (type === "JobPosting" || (Array.isArray(type) && type.indexOf("JobPosting") !== -1)) found.push(node);
    if (node["@graph"]) postings(node["@graph"], found);
    return found;
  }

  /** The hiring organisation named in the page's JobPosting data, if any. */
  function structuredEmployer(doc) {
    var found = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
      try { postings(JSON.parse(script.textContent || ""), found); } catch (error) { /* Ignore invalid JSON-LD. */ }
    });
    for (var index = 0; index < found.length; index += 1) {
      var organisation = found[index].hiringOrganization;
      var name = typeof organisation === "string" ? organisation : organisation && organisation.name;
      if (name && String(name).trim().length >= 2) return String(name).trim();
    }
    return "";
  }

  /** [{ element, name }] for every employer name visible on the page. */
  function findEmployers(doc, hostname) {
    var rule = ruleFor(hostname);
    var elements = [];
    if (rule) elements = rule.find ? rule.find(doc) : Array.prototype.slice.call(doc.querySelectorAll(rule.selector));
    var seen = new Set();
    var found = [];
    elements.forEach(function (element) {
      if (seen.has(element)) return;
      seen.add(element);
      var name = scope.WorkCVSponsorEmployers.cleanName(element.textContent);
      if (name.length >= 2) found.push({ element: element, name: name });
    });
    if (!found.length) {
      var heading = doc.querySelector("h1");
      var employer = structuredEmployer(doc);
      if (heading && employer) found.push({ element: heading, name: scope.WorkCVSponsorEmployers.cleanName(employer), heading: true });
    }
    return found;
  }

  scope.WorkCVSponsorSites = { findEmployers: findEmployers, structuredEmployer: structuredEmployer, ruleFor: ruleFor };
})(globalThis);
