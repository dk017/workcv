var employers = globalThis.WorkCVSponsorEmployers;

var elements = {
  toggle: document.getElementById("enabledToggle"),
  form: document.getElementById("searchForm"),
  input: document.getElementById("employerInput"),
  page: document.getElementById("pageButton"),
  status: document.getElementById("statusMessage"),
  result: document.getElementById("resultPanel"),
  guide: document.getElementById("guideLink")
};

var headings = {
  listed: "An employer with this name holds a sponsor licence.",
  possible: "No exact match. Similar names on the register:",
  not_found: "No employer with this name is on the register. Try its legal name.",
  agency: "This looks like a recruitment agency. Its own licence does not cover its clients' jobs: ask which employer is hiring and check that name."
};

function status(message, tone) {
  elements.status.textContent = message;
  elements.status.className = "status" + (tone ? " " + tone : "");
}

function busy(value) {
  elements.page.disabled = value;
  elements.form.querySelector("button").disabled = value;
}

function render(name, result, registerDate) {
  var panel = elements.result;
  panel.replaceChildren();
  panel.className = "result " + result.status;
  var title = document.createElement("strong");
  title.textContent = headings[result.status] || "Check complete.";
  panel.appendChild(title);
  if (result.matches && result.matches.length) {
    var list = document.createElement("ul");
    result.matches.slice(0, 3).forEach(function (match) {
      var item = document.createElement("li");
      var routes = match.routes.map(function (route) { return route.route + (route.rating ? " (" + route.rating + ")" : ""); }).join(", ");
      item.textContent = match.name + (match.locations[0] ? ", " + match.locations[0] : "") + ": " + routes;
      list.appendChild(item);
    });
    panel.appendChild(list);
  }
  var note = document.createElement("small");
  note.textContent = (registerDate ? "Register dated " + registerDate + ". " : "");
  var more = document.createElement("a");
  more.href = employers.checkerUrl(name);
  more.target = "_blank";
  more.rel = "noreferrer";
  more.textContent = "See all results on WorkCV";
  note.appendChild(more);
  panel.appendChild(note);
  panel.hidden = false;
}

async function check(name) {
  name = employers.cleanName(name);
  if (name.length < 2) {
    status("Enter at least two characters of the employer's name.", "error");
    return;
  }
  elements.input.value = name;
  if (employers.isLikelyAgency(name)) {
    render(name, { status: "agency", matches: [] }, null);
    status("");
    return;
  }
  busy(true);
  status("Checking " + name + "…");
  try {
    var response = await chrome.runtime.sendMessage({ type: "WORKCV_SPONSOR_LOOKUP", names: [name] });
    var result = response && response.ok ? response.results[name] : null;
    if (!result) throw new Error(response && response.error ? response.error : "no answer");
    render(name, result, response.registerDate);
    status("");
  } catch (error) {
    elements.result.hidden = true;
    status("Unable to check the register: " + error.message, "error");
  } finally {
    busy(false);
  }
}

// Reads the employer from the job advert in the current tab (JobPosting data,
// or text the user selected) after the user clicks.
async function checkPage() {
  var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  var tab = tabs[0];
  if (!tab || !/^https?:\/\//i.test(tab.url || "")) {
    status("Open a job advert first.", "error");
    return;
  }
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["employers.js", "sites.js"] });
    var found = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: function () {
        var selected = String(getSelection() || "").trim();
        return selected.length >= 2 && selected.length <= 160 ? selected : globalThis.WorkCVSponsorSites.structuredEmployer(document);
      }
    });
    var name = found && found[0] ? found[0].result : "";
    if (!name) {
      status("No employer found on this page. Select the employer's name on the page, or type it above.", "error");
      return;
    }
    await check(name);
  } catch (error) {
    status("Unable to read this page: " + error.message, "error");
  }
}

elements.guide.href = employers.guideUrl();
elements.form.addEventListener("submit", function (event) {
  event.preventDefault();
  check(elements.input.value);
});
elements.page.addEventListener("click", checkPage);
elements.toggle.addEventListener("change", function () {
  chrome.storage.sync.set({ enabled: elements.toggle.checked });
});
chrome.storage.sync.get({ enabled: true }).then(function (settings) {
  elements.toggle.checked = settings.enabled !== false;
});
