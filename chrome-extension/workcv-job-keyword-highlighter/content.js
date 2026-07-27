(function () {
  "use strict";

  if (globalThis.__workcvKeywordHighlighterInstalled) return;
  globalThis.__workcvKeywordHighlighterInstalled = true;

  var markerClass = "workcv-keyword-highlight";
  var data = globalThis.WorkCVKeywordData;
  var excludedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "SVG"]);

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  var termsPattern = data.definitions
    .map(function (item) { return escapeRegExp(item.term); })
    .join("|");
  var matcher = new RegExp("\\b(" + termsPattern + ")\\b", "gi");

  function normalise(value) {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function visibleTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (excludedTags.has(parent.tagName) || parent.closest("." + markerClass)) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable || parent.closest("[contenteditable='true']")) return NodeFilter.FILTER_REJECT;

        var style = window.getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    var node;
    while ((node = walker.nextNode()) && nodes.length < 12000) nodes.push(node);
    return nodes;
  }

  function definitionFor(match) {
    var target = normalise(match);
    return data.definitions.find(function (item) {
      return normalise(item.term) === target;
    });
  }

  function clearHighlights() {
    document.querySelectorAll("." + markerClass).forEach(function (marker) {
      marker.replaceWith(document.createTextNode(marker.textContent || ""));
    });
    document.body.normalize();
  }

  function scanPage() {
    clearHighlights();
    var nodes = visibleTextNodes();
    var pageText = nodes.map(function (node) { return node.nodeValue; }).join(" ");
    var wordCount = (pageText.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || []).length;
    var findings = new Map();
    var highlightCount = 0;

    nodes.forEach(function (node) {
      var text = node.nodeValue || "";
      matcher.lastIndex = 0;
      var matches = Array.from(text.matchAll(matcher));
      if (!matches.length) return;

      var fragment = document.createDocumentFragment();
      var cursor = 0;
      matches.forEach(function (match) {
        var definition = definitionFor(match[0]);
        if (!definition || match.index === undefined) return;

        fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        var marker = document.createElement("mark");
        marker.className = markerClass + " workcv-keyword-" + definition.category;
        marker.textContent = match[0];
        marker.title = data.categoryLabels[definition.category];
        fragment.appendChild(marker);
        cursor = match.index + match[0].length;
        highlightCount += 1;

        var key = definition.category + ":" + definition.label;
        var existing = findings.get(key);
        findings.set(key, {
          label: definition.label,
          category: definition.category,
          count: existing ? existing.count + 1 : 1
        });
      });
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    });

    var grouped = { hard: [], soft: [], qualification: [], action: [] };
    findings.forEach(function (item) { grouped[item.category].push(item); });
    Object.keys(grouped).forEach(function (category) {
      grouped[category].sort(function (a, b) {
        return b.count - a.count || a.label.localeCompare(b.label);
      });
    });

    return {
      ok: true,
      highlightCount: highlightCount,
      wordCount: wordCount,
      grouped: grouped
    };
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.type === "WORKCV_SCAN_PAGE") {
      try {
        sendResponse(scanPage());
      } catch (error) {
        sendResponse({ ok: false, error: error.message });
      }
    }
    if (message && message.type === "WORKCV_CLEAR_HIGHLIGHTS") {
      clearHighlights();
      sendResponse({ ok: true });
    }
  });
})();
