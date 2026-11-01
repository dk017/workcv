importScripts("employers.js");

// Answers sponsor lookups from the content script and popup. Each employer
// is cached for a day, so browsing the same board sends each name at most once.

var employers = globalThis.WorkCVSponsorEmployers;
var dayMs = 24 * 60 * 60 * 1000;
var prefix = "sponsor:";

async function fromCache(names) {
  var keys = names.map(function (name) { return prefix + employers.cacheKey(name); });
  var stored = await chrome.storage.local.get(keys);
  var found = {};
  var missing = [];
  var registerDate = null;
  names.forEach(function (name, index) {
    var entry = stored[keys[index]];
    if (entry && Date.now() - entry.savedAt < dayMs) {
      found[name] = entry.result;
      registerDate = registerDate || entry.registerDate;
    } else {
      missing.push(name);
    }
  });
  return { found: found, missing: missing, registerDate: registerDate };
}

async function fetchBatch(names) {
  var response = await fetch(employers.batchUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ names: names }),
    credentials: "omit"
  });
  var data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Sponsor check unavailable");
  return data;
}

async function lookup(names) {
  names = Array.from(new Set(names.map(employers.cleanName).filter(function (name) { return name.length >= 2; }))).slice(0, 40);
  var cached = await fromCache(names);
  var results = cached.found;
  var registerDate = cached.registerDate;
  if (cached.missing.length) {
    var data = await fetchBatch(cached.missing);
    registerDate = data.registerDate || registerDate;
    var byKey = {};
    data.results.forEach(function (item) { byKey[employers.cacheKey(item.query)] = { status: item.status, total: item.total, matches: item.matches }; });
    var toStore = {};
    cached.missing.forEach(function (name) {
      var result = byKey[employers.cacheKey(name)];
      if (!result) return;
      results[name] = result;
      toStore[prefix + employers.cacheKey(name)] = { result: result, registerDate: registerDate, savedAt: Date.now() };
    });
    await chrome.storage.local.set(toStore);
  }
  return { ok: true, registerDate: registerDate, results: results };
}

async function pruneCache() {
  var all = await chrome.storage.local.get(null);
  var stale = Object.keys(all).filter(function (key) { return key.indexOf(prefix) === 0 && !(Date.now() - all[key].savedAt < dayMs); });
  if (stale.length) await chrome.storage.local.remove(stale);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!message || message.type !== "WORKCV_SPONSOR_LOOKUP" || !Array.isArray(message.names)) return false;
  lookup(message.names)
    .then(sendResponse)
    .catch(function (error) { sendResponse({ ok: false, error: error.message }); });
  return true;
});

chrome.runtime.onStartup.addListener(pruneCache);
chrome.runtime.onInstalled.addListener(pruneCache);
