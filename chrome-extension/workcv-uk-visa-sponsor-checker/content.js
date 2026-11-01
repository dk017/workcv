(function () {
  "use strict";

  // Puts a sponsor-licence badge next to each employer name on supported job
  // boards. Only the names are sent (via the background worker) to WorkCV,
  // which searches the Home Office register of licensed sponsors.

  if (globalThis.WorkCVSponsorBadges) return;
  globalThis.WorkCVSponsorBadges = true;

  var employers = globalThis.WorkCVSponsorEmployers;
  var sites = globalThis.WorkCVSponsorSites;
  var tag = "workcv-sponsor-badge";
  var results = new Map();
  var pending = new Set();
  var registerDate = null;
  var enabled = true;
  var timer = 0;

  var labels = {
    checking: "Checking sponsor…",
    listed: "✓ Licensed sponsor",
    possible: "? Similar name listed",
    not_found: "Not found on register",
    agency: "Agency advert",
    error: "Sponsor check unavailable"
  };

  var badgeStyle = [
    ":host { all: initial; display: inline-block; vertical-align: middle; margin: 0 0 0 6px; }",
    "button { all: initial; box-sizing: border-box; display: inline-flex; align-items: center; min-height: 20px; border: 1px solid; border-radius: 999px; padding: 1px 8px; font: 600 11px/1.4 Arial, Helvetica, sans-serif; white-space: nowrap; cursor: pointer; }",
    "button:focus-visible { outline: 2px solid #0f2942; outline-offset: 2px; }",
    ".listed { border-color: #246b48; background: #effaf3; color: #1d5a3b; }",
    ".possible { border-color: #b9891f; background: #fdf6e3; color: #75540d; }",
    ".not_found, .agency, .error { border-color: #b8c2cc; background: #f4f6f8; color: #47596b; }",
    ".checking { border-color: #d5dce2; background: #fff; color: #7b8794; }"
  ].join("\n");

  var popoverStyle = [
    ":host { all: initial; }",
    ".card { position: fixed; z-index: 2147483647; box-sizing: border-box; width: min(340px, calc(100vw - 16px)); border: 1px solid #c9d1d8; border-radius: 9px; background: #fff; padding: 14px; color: #1a1a1a; font: 13px/1.5 Arial, Helvetica, sans-serif; box-shadow: 0 10px 30px rgba(15, 41, 66, .2); }",
    "h2 { margin: 0 24px 6px 0; color: #0f2942; font: 700 14px/1.35 Arial, Helvetica, sans-serif; }",
    "p { margin: 6px 0 0; color: #334e68; }",
    "ul { margin: 8px 0 0; padding-left: 16px; }",
    "li { margin-top: 5px; color: #334e68; }",
    "li strong { color: #0f2942; }",
    "small { display: block; margin-top: 10px; color: #63788c; font-size: 11px; line-height: 1.45; }",
    "a { display: block; margin-top: 8px; color: #0f2942; font-weight: 700; }",
    ".close { all: initial; position: absolute; top: 8px; right: 10px; color: #63788c; font: 700 18px/1 Arial, sans-serif; cursor: pointer; }",
    "@media (prefers-color-scheme: dark) { .card { border-color: #3b4c5c; background: #13202c; color: #e6edf3; } h2, li strong, a { color: #f2d48a; } p, li { color: #c9d4de; } small, .close { color: #9fb0c0; } }"
  ].join("\n");

  function statusFor(name) {
    if (employers.isLikelyAgency(name)) return "agency";
    var result = results.get(employers.cacheKey(name));
    return result ? result.status : "checking";
  }

  function paint(host) {
    var name = host.dataset.name;
    var status = statusFor(name);
    var button = host.shadowRoot.querySelector("button");
    button.className = status;
    button.textContent = labels[status] || labels.error;
    button.setAttribute("aria-label", labels[status] + ": " + name + ". Show details");
  }

  function block(element) {
    var display = getComputedStyle(element).display;
    return display === "block" || display === "flex" || display === "grid" || display === "list-item";
  }

  function existingBadge(element) {
    var next = element.nextElementSibling;
    if (next && next.localName === tag) return next;
    var last = element.lastElementChild;
    return last && last.localName === tag ? last : null;
  }

  function badge(item) {
    var current = existingBadge(item.element);
    if (current && current.dataset.name === item.name) return current;
    if (current) current.remove();
    var host = document.createElement(tag);
    host.dataset.name = item.name;
    var root = host.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent = badgeStyle;
    var button = document.createElement("button");
    button.type = "button";
    root.append(style, button);
    // Job cards are links or click targets; the badge must not open the job.
    ["click", "mousedown", "mouseup", "pointerdown", "pointerup"].forEach(function (type) {
      host.addEventListener(type, function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (type === "click") openPopover(host);
      });
    });
    if (item.heading || block(item.element)) item.element.appendChild(host);
    else item.element.after(host);
    paint(host);
    return host;
  }

  function settle(names, response) {
    if (response && response.ok) {
      registerDate = response.registerDate || registerDate;
      Object.keys(response.results).forEach(function (name) { results.set(employers.cacheKey(name), response.results[name]); });
    }
    // A failed check is shown as unavailable for this page view, not retried on every page change.
    names.forEach(function (name) {
      var key = employers.cacheKey(name);
      pending.delete(key);
      if (!results.has(key)) results.set(key, { status: "error", matches: [], total: 0 });
    });
    document.querySelectorAll(tag).forEach(paint);
  }

  function lookup(names) {
    names.forEach(function (name) { pending.add(employers.cacheKey(name)); });
    chrome.runtime.sendMessage({ type: "WORKCV_SPONSOR_LOOKUP", names: names })
      .then(function (response) { settle(names, response); })
      .catch(function () { settle(names, null); });
  }

  function scan() {
    timer = 0;
    if (!enabled) return;
    var wanted = new Map();
    sites.findEmployers(document, location.hostname).forEach(function (item) {
      badge(item);
      var key = employers.cacheKey(item.name);
      if (!employers.isLikelyAgency(item.name) && !results.has(key) && !pending.has(key)) wanted.set(key, item.name);
    });
    var names = Array.from(wanted.values());
    for (var start = 0; start < names.length; start += 40) lookup(names.slice(start, start + 40));
  }

  function schedule() {
    if (!timer) timer = setTimeout(scan, 400);
  }

  // Popover with the register details for one badge.
  var popoverHost = null;

  function closePopover() {
    if (popoverHost) popoverHost.remove();
    popoverHost = null;
  }

  function element(name, text) {
    var node = document.createElement(name);
    if (text) node.textContent = text;
    return node;
  }

  function link(href, text) {
    var anchor = element("a", text);
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    return anchor;
  }

  function describe(card, name, status, result) {
    var heading = {
      listed: name + " holds a sponsor licence",
      possible: "No exact match for " + name,
      not_found: name + " is not on the register under this name",
      agency: name + " looks like a recruitment agency",
      checking: "Checking " + name + "…",
      error: "The sponsor check is unavailable"
    }[status];
    card.appendChild(element("h2", heading));
    if (status === "possible") card.appendChild(element("p", "Job boards often show a brand name, while the register uses legal names. Similar names on the register:"));
    if (status === "not_found") card.appendChild(element("p", "Job boards often show a brand name rather than the legal name, so search any other name the employer uses."));
    if (status === "agency") card.appendChild(element("p", "An agency's own licence does not cover the jobs it advertises for clients. Ask which employer is hiring, then check that name."));
    if (status === "error") card.appendChild(element("p", "Please try again in a few minutes, or search the register on WorkCV."));
    var matches = result && result.matches ? result.matches : [];
    if (matches.length && (status === "listed" || status === "possible")) {
      var list = element("ul");
      matches.slice(0, 3).forEach(function (match) {
        var item = element("li");
        item.appendChild(element("strong", match.name));
        var routes = match.routes.map(function (route) { return route.route + (route.rating ? " (" + route.rating + ")" : ""); }).join(", ");
        var where = match.locations && match.locations[0] ? match.locations[0] : "";
        item.appendChild(document.createTextNode([where, routes].filter(Boolean).map(function (part) { return " · " + part; }).join("")));
        list.appendChild(item);
      });
      card.appendChild(list);
      if (result.total > matches.length) card.appendChild(element("p", (result.total - matches.length) + " more on the register."));
    }
  }

  function openPopover(host) {
    var name = host.dataset.name;
    closePopover();
    popoverHost = document.createElement("workcv-sponsor-popover");
    var root = popoverHost.attachShadow({ mode: "open" });
    var style = element("style");
    style.textContent = popoverStyle;
    var card = element("div");
    card.className = "card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "Sponsor licence: " + name);
    var close = element("button", "×");
    close.className = "close";
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", closePopover);
    card.appendChild(close);
    var status = statusFor(name);
    describe(card, name, status, results.get(employers.cacheKey(name)));
    var agencyNote = status === "agency" ? "" : "If a recruitment agency posted this advert, the name may be the agency's: ask which employer is hiring. ";
    card.appendChild(element("small", "A licence means the employer can sponsor workers, not that this job qualifies. " + agencyNote + (registerDate ? "Home Office register dated " + registerDate + ". " : "") + "Information, not immigration advice."));
    card.appendChild(link(employers.checkerUrl(name), "Search the register on WorkCV"));
    card.appendChild(link(employers.guideUrl(), "How to show your right to work on a UK CV"));
    root.append(style, card);
    ["click", "mousedown", "pointerdown"].forEach(function (type) {
      popoverHost.addEventListener(type, function (event) { event.stopPropagation(); });
    });
    document.documentElement.appendChild(popoverHost);

    var box = host.getBoundingClientRect();
    var width = card.offsetWidth;
    var height = card.offsetHeight;
    var left = Math.max(8, Math.min(box.left, innerWidth - width - 8));
    var top = box.bottom + 6 + height > innerHeight ? Math.max(8, box.top - height - 6) : box.bottom + 6;
    card.style.left = left + "px";
    card.style.top = top + "px";
    close.focus();
  }

  document.addEventListener("click", closePopover);
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closePopover(); });
  addEventListener("scroll", closePopover, { passive: true, capture: true });

  function removeAll() {
    closePopover();
    document.querySelectorAll(tag).forEach(function (host) { host.remove(); });
  }

  chrome.storage.sync.get({ enabled: true }).then(function (settings) {
    enabled = settings.enabled !== false;
    if (enabled) scan();
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "sync" || !changes.enabled) return;
    enabled = changes.enabled.newValue !== false;
    if (enabled) scan();
    else removeAll();
  });

  new MutationObserver(function (mutations) {
    var ours = mutations.every(function (mutation) {
      return Array.prototype.every.call(mutation.addedNodes, function (node) { return node.localName === tag || node.localName === "workcv-sponsor-popover"; }) &&
        Array.prototype.every.call(mutation.removedNodes, function (node) { return node.localName === tag || node.localName === "workcv-sponsor-popover"; });
    });
    if (!ours && enabled) schedule();
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
