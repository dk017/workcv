var elements = {
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

elements.scan.addEventListener("click", scan);
elements.clear.addEventListener("click", clear);

activeTab().then(function (tab) {
  elements.title.textContent = tab && tab.title ? tab.title : "No active tab";
  elements.url.textContent = tab && tab.url ? tab.url : "";
  if (!tab || !supported(tab.url)) {
    status("Open a regular job page to use this extension.", "error");
    elements.scan.disabled = true;
    elements.clear.disabled = true;
  }
});
