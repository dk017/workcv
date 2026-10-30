(function (scope) {
  "use strict";

  // Reads the job on the current page after the user clicks "Tailor my CV".
  // Prefers the JobPosting data most UK job boards publish for Google Jobs,
  // then text the user selected, then the largest block of page text.

  var maxAdvertLength = 12000;

  function clean(value, max) {
    return String(value || "").replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
  }

  function htmlToText(html) {
    var withBreaks = String(html || "")
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\s*li[^>]*>/gi, "\n• ")
      .replace(/<\/\s*(p|div|li|ul|ol|h[1-6]|tr)\s*>/gi, "\n");
    var doc = new DOMParser().parseFromString(withBreaks, "text/html");
    return doc.body ? doc.body.textContent || "" : "";
  }

  // Some boards escape the description HTML (&lt;p&gt;), so decode twice when tags survive.
  function descriptionText(html) {
    var text = htmlToText(html);
    return /<\/?[a-z][^>]*>/i.test(text) ? htmlToText(text) : text;
  }

  function jobPostings(node, found) {
    if (!node || typeof node !== "object") return found;
    if (Array.isArray(node)) {
      node.forEach(function (item) { jobPostings(item, found); });
      return found;
    }
    var type = node["@type"];
    if (type === "JobPosting" || (Array.isArray(type) && type.indexOf("JobPosting") !== -1)) found.push(node);
    if (node["@graph"]) jobPostings(node["@graph"], found);
    return found;
  }

  function fromStructuredData(doc) {
    var postings = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
      try { jobPostings(JSON.parse(script.textContent || ""), postings); } catch (error) { /* Ignore invalid JSON-LD. */ }
    });
    var posting = postings.find(function (item) { return item.title && item.description; });
    if (!posting) return null;
    var organisation = posting.hiringOrganization;
    return {
      role: clean(htmlToText(posting.title), 160),
      employer: clean(typeof organisation === "string" ? organisation : organisation && organisation.name, 160),
      advertText: clean(descriptionText(posting.description), maxAdvertLength)
    };
  }

  function largestTextBlock(doc) {
    var candidates = Array.prototype.slice.call(doc.querySelectorAll(
      "[class*='description' i], [id*='description' i], [class*='job-details' i], [id*='job-details' i], article, main"
    ));
    var best = "";
    candidates.forEach(function (element) {
      var text = clean(element.innerText || element.textContent, maxAdvertLength * 2);
      if (text.length > best.length && text.length <= maxAdvertLength * 2) best = text;
    });
    return best || clean(doc.body ? doc.body.innerText || doc.body.textContent : "", maxAdvertLength);
  }

  function pageTitle(doc) {
    var heading = doc.querySelector("h1");
    var text = heading ? heading.innerText || heading.textContent : doc.title;
    return clean(text, 160);
  }

  function captureJob(doc, win) {
    doc = doc || document;
    win = win || window;
    var structured = fromStructuredData(doc);
    var selection = win.getSelection ? clean(String(win.getSelection() || ""), maxAdvertLength) : "";
    // A deliberate selection wins over anything detected automatically.
    if (selection.length >= 200) {
      return {
        role: structured ? structured.role : pageTitle(doc),
        employer: structured ? structured.employer : "",
        advertText: selection,
        method: "selection"
      };
    }
    if (structured && structured.advertText.length >= 80) {
      structured.method = "structured";
      return structured;
    }
    return {
      role: structured && structured.role ? structured.role : pageTitle(doc),
      employer: structured ? structured.employer : "",
      advertText: clean(largestTextBlock(doc), maxAdvertLength),
      method: "page"
    };
  }

  scope.WorkCVCaptureJob = captureJob;
})(globalThis);
