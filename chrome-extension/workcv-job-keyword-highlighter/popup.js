var elements = {
  tailor: document.getElementById("tailorButton"),
  sponsor: document.getElementById("sponsorButton"),
  sponsorPanel: document.getElementById("sponsorPanel"),
  scan: document.getElementById("scanButton"),
  clear: document.getElementById("clearButton"),
  status: document.getElementById("statusMessage"),
  title: document.getElementById("pageTitle"),
  url: document.getElementById("pageUrl"),
  panel: document.getElementById("resultsPanel"),
  highlights: document.getElementById("highlightCount"),
  words: document.getElementById("wordCount"),
  groups: document.getElementById("resultGroups")
};

async function activeTab() {
  var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function supported(url) {
  return Boolean(url && /^https?:\/\//i.test(url));
}

function status(message, tone) {
  elements.status.textContent = message;
  elements.status.className = "status" + (tone ? " " + tone : "");
}

function busy(value) {
  elements.tailor.disabled = value;
  elements.sponsor.disabled = value;
  elements.scan.disabled = value;
  elements.clear.disabled = value;
}

async function inject(tabId) {
  await chrome.scripting.insertCSS({ target: { tabId: tabId }, files: ["highlighter.css"] });
  await chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["shared.js", "content.js"] });
}

function render(result) {
  elements.panel.hidden = false;
  elements.highlights.textContent = String(result.highlightCount);
  elements.words.textContent = String(result.wordCount);
  elements.groups.replaceChildren();

  ["hard", "qualification", "soft", "action"].forEach(function (category) {
    var items = result.grouped[category] || [];
    var section = document.createElement("section");
    section.className = "group";
    var heading = document.createElement("div");
    heading.className = "group-heading";
    var title = document.createElement("h2");
    title.textContent = WorkCVKeywordData.categoryLabels[category];
    var count = document.createElement("span");
    count.className = "count";
    count.textContent = String(items.length);
    heading.append(title, count);
    var list = document.createElement("ul");
    list.className = "keywords";
    if (!items.length) {
      var empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "No strong signals found";
      list.appendChild(empty);
    } else {
      items.slice(0, 18).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item.label + (item.count > 1 ? " ×" + item.count : "");
        list.appendChild(li);
      });
    }
    section.append(heading, list);
    elements.groups.appendChild(section);
  });
}

async function scan() {
  var tab = await activeTab();
  if (!tab || !supported(tab.url)) {
    status("Open a regular job page first.", "error");
    return;
  }
  busy(true);
  status("Scanning visible page text…");
  try {
    await inject(tab.id);
    var result = await chrome.tabs.sendMessage(tab.id, { type: "WORKCV_SCAN_PAGE" });
    if (!result || !result.ok) throw new Error(result && result.error ? result.error : "No result returned");
    render(result);
    status("Highlighted " + result.highlightCount + " matches on the page.", "success");
  } catch (error) {
    status("Unable to scan this page: " + error.message, "error");
  } finally {
    busy(false);
  }
}

async function captureJob(tab) {
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["job-capture.js"] });
  var results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function () { return globalThis.WorkCVCaptureJob(document, window); }
  });
  return results && results[0] && results[0].result;
}

// Reads the job from the page and opens it on WorkCV in a new tab.
async function tailor() {
  var tab = await activeTab();
  if (!tab || !supported(tab.url)) {
    status("Open a job advert first.", "error");
    return;
  }
  busy(true);
  status("Reading the job advert…");
  try {
    var job = await captureJob(tab);
    if (!job || (!job.role && (!job.advertText || job.advertText.length < 80))) {
      throw new Error("no job advert was found");
    }
    await chrome.tabs.create({ url: WorkCVJobLink.buildTailorUrl(job), index: tab.index + 1 });
    window.close();
  } catch (error) {
    status("Unable to read this job: " + error.message + ". Select the advert text on the page and try again.", "error");
    busy(false);
  }
}

var sponsorCopy = {
  listed: "An employer with this name holds a sponsor licence.",
  possible: "No exact match. Close names on the register:",
  not_found: "No employer with this name is on the register. Try its legal name."
};

function renderSponsor(check, employer) {
  var panel = elements.sponsorPanel;
  panel.replaceChildren();
  panel.className = "sponsor " + check.status;
  var title = document.createElement("strong");
  title.textContent = sponsorCopy[check.status] || "Sponsor check complete.";
  panel.appendChild(title);
  if (check.matches && check.matches.length) {
    var list = document.createElement("ul");
    check.matches.slice(0, 3).forEach(function (match) {
      var item = document.createElement("li");
      var routes = match.routes.map(function (route) { return route.route + " (" + (route.rating || route.licence) + ")"; }).join(", ");
      item.textContent = match.name + (match.locations[0] ? ", " + match.locations[0] : "") + ": " + routes;
      list.appendChild(item);
    });
    panel.appendChild(list);
  }
  var note = document.createElement("small");
  note.textContent = "A licence means the employer can sponsor workers, not that this job can be sponsored. Register dated " + (check.registerDate || "recently") + ". ";
  var more = document.createElement("a");
  more.href = WorkCVJobLink.sponsorPageUrl(employer);
  more.target = "_blank";
  more.rel = "noreferrer";
  more.textContent = "See all results";
  note.appendChild(more);
  panel.appendChild(note);
  panel.hidden = false;
}

// Reads the employer from the page and searches the Home Office sponsor register.
async function checkSponsor() {
  var tab = await activeTab();
  if (!tab || !supported(tab.url)) {
    status("Open a job advert first.", "error");
    return;
  }
  busy(true);
  status("Finding the employer…");
  try {
    var job = await captureJob(tab);
    var employer = job && job.employer ? job.employer.trim() : "";
    if (employer.length < 2) {
      elements.sponsorPanel.hidden = true;
      status("Could not find the employer's name on this page. Search it on WorkCV instead.", "error");
      return;
    }
    status("Checking " + employer + " on the sponsor register…");
    var response = await fetch(WorkCVJobLink.sponsorCheckUrl(employer));
    var check = await response.json();
    if (!response.ok || check.error) throw new Error(check.error || "the check is unavailable");
    renderSponsor(check, employer);
    status("Checked " + employer + ".", "success");
  } catch (error) {
    status("Unable to check the sponsor register: " + error.message, "error");
  } finally {
    busy(false);
  }
}

async function clear() {
  var tab = await activeTab();
  if (!tab || !supported(tab.url)) return;
  busy(true);
  try {
    await inject(tab.id);
    await chrome.tabs.sendMessage(tab.id, { type: "WORKCV_CLEAR_HIGHLIGHTS" });
    elements.panel.hidden = true;
    status("Highlights removed.", "success");
  } catch (error) {
    status("Unable to remove highlights: " + error.message, "error");
  } finally {
    busy(false);
  }
}

elements.tailor.addEventListener("click", tailor);
elements.sponsor.addEventListener("click", checkSponsor);
elements.scan.addEventListener("click", scan);
elements.clear.addEventListener("click", clear);

activeTab().then(function (tab) {
  elements.title.textContent = tab && tab.title ? tab.title : "No active tab";
  elements.url.textContent = tab && tab.url ? tab.url : "";
  if (!tab || !supported(tab.url)) {
    status("Open a regular job page to use this extension.", "error");
    elements.tailor.disabled = true;
    elements.sponsor.disabled = true;
    elements.scan.disabled = true;
    elements.clear.disabled = true;
  }
});
