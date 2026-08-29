const baseUrl = (process.env.WORKCV_VERIFY_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const loginPath = "/login?next=%2Feditor%3Ftemplate%3Dcompact%26new%3D1";
const login = await fetch(`${baseUrl}${loginPath}`);
const loginHtml = await login.text();
assert(login.ok, `Login response failed: ${login.status}`);
const loginRobotsHeader = login.headers.get("x-robots-tag") || "";
assert(/noindex/i.test(loginRobotsHeader), "Login X-Robots-Tag lacks noindex");
assert(/(?:^|,\s*)follow(?:,|$)/i.test(loginRobotsHeader), "Login X-Robots-Tag lacks follow");
assert(!/nofollow/i.test(loginRobotsHeader), "Login X-Robots-Tag incorrectly contains nofollow");
assert(/<meta[^>]+name="robots"[^>]+noindex/i.test(loginHtml), "Login HTML lacks a noindex meta tag");
assert(/<link[^>]+rel="canonical"[^>]+href="[^"]*\/login"/i.test(loginHtml), "Login canonical is not /login");
assert(!/<link[^>]+rel="canonical"[^>]+href="https:\/\/workcv\.co\.uk\/"/i.test(loginHtml), "Login still canonicalises to the homepage");

const home = await fetch(`${baseUrl}/`);
const homeHtml = await home.text();
assert(home.ok, `Homepage response failed: ${home.status}`);
assert(!/noindex/i.test(home.headers.get("x-robots-tag") || ""), "Homepage has a noindex header");
assert(!/<meta[^>]+name="robots"[^>]+noindex/i.test(homeHtml), "Homepage has a noindex meta tag");

const pricing = await fetch(`${baseUrl}/pricing`);
const pricingHtml = await pricing.text();
assert(pricing.ok, `Pricing response failed: ${pricing.status}`);
assert(!/noindex/i.test(pricing.headers.get("x-robots-tag") || ""), "Pricing has a noindex header");
assert(
  /<link[^>]+rel="canonical"[^>]+href="[^"]*\/pricing"/i.test(pricingHtml),
  "Pricing canonical is not /pricing",
);

const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapXml = await sitemap.text();
assert(sitemap.ok, `Sitemap response failed: ${sitemap.status}`);
for (const privatePath of ["/login", "/editor", "/my-cvs", "/cv-pdf/"]) {
  assert(!sitemapXml.includes(privatePath), `Sitemap contains private path: ${privatePath}`);
}

const robots = await fetch(`${baseUrl}/robots.txt`);
const robotsText = await robots.text();
assert(robots.ok, `Robots response failed: ${robots.status}`);
assert(!/disallow:\s*\/login/i.test(robotsText), "robots.txt blocks /login from seeing noindex");

const editor = await fetch(`${baseUrl}/editor?template=compact&new=1`, { redirect: "manual" });
assert([301, 302, 303, 307, 308].includes(editor.status), `Editor did not redirect: ${editor.status}`);
assert(/noindex/i.test(editor.headers.get("x-robots-tag") || ""), "Editor redirect lacks noindex");
assert(/nofollow/i.test(editor.headers.get("x-robots-tag") || ""), "Editor redirect lacks nofollow");
assert(/noarchive/i.test(editor.headers.get("x-robots-tag") || ""), "Editor redirect lacks noarchive");
const location = editor.headers.get("location") || "";
assert(location.includes("/login?next=%2Feditor%3Ftemplate%3Dcompact%26new%3D1"), `Editor return path is malformed: ${location}`);

const anonymousEditorEvent = await fetch(`${baseUrl}/api/events/editor`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    eventName: "landing_view",
    eventId: "event_1234567890123456",
    visitorId: "visitor_12345678901234",
    sessionId: "session_12345678901234",
    path: "/",
    deviceClass: "desktop",
  }),
});
assert(anonymousEditorEvent.status === 401, `Editor event route accepted an anonymous funnel event: ${anonymousEditorEvent.status}`);

const wrongContentType = await fetch(`${baseUrl}/api/events/funnel`, {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: "not-json",
});
assert(wrongContentType.status === 415, `Event route accepted text/plain: ${wrongContentType.status}`);
assert(wrongContentType.headers.get("cache-control") === "no-store", "Event error response is cacheable");

const malformedJson = await fetch(`${baseUrl}/api/events/funnel`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{",
});
assert(malformedJson.status === 400, `Event route accepted malformed JSON: ${malformedJson.status}`);

if (process.env.WORKCV_EXPECT_FUNNEL_DISABLED === "true") {
  const validDisabledEvent = await fetch(`${baseUrl}/api/events/funnel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName: "landing_view",
      eventId: "event_route_check_123456789",
      visitorId: "visitor_route_check_1234567",
      sessionId: "session_route_check_1234567",
      path: "/pricing",
      deviceClass: "desktop",
    }),
  });
  assert(validDisabledEvent.status === 204, `Disabled funnel route did not return 204: ${validDisabledEvent.status}`);
  assert(validDisabledEvent.headers.get("x-workcv-funnel") === "disabled", "Disabled funnel route lacks its state header");
  assert(validDisabledEvent.headers.get("cache-control") === "no-store", "Funnel response is cacheable");
}

console.log(`Indexing verification passed for ${baseUrl}`);
