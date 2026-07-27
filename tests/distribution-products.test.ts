import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("Chrome extension keeps a narrow local-only permission set", () => {
  const manifest = JSON.parse(
    read("chrome-extension/workcv-job-keyword-highlighter/manifest.json"),
  );

  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions, ["activeTab", "scripting"]);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.background, undefined);

  const popup = read(
    "chrome-extension/workcv-job-keyword-highlighter/popup.html",
  );
  assert.match(popup, /utm_source=chrome_extension/);
  assert.match(popup, /tools\/ats-score-checker/);
});

test("WordPress plugin leaves public attribution opt-in", () => {
  const settings = read(
    "wordpress-plugin/workcv-uk-career-tools/includes/class-workcv-settings.php",
  );
  const readme = read("wordpress-plugin/workcv-uk-career-tools/readme.txt");

  assert.match(settings, /'cta'\s*=>\s*'0'/);
  assert.match(settings, /'footer'\s*=>\s*'0'/);
  assert.match(readme, /no public backlink is added automatically/i);
  assert.match(readme, /\[workcv_take_home_pay\]/);
  assert.match(readme, /\[workcv_living_wage\]/);
  assert.match(readme, /\[workcv_redundancy_pay\]/);
});

test("hosted calculator routes are frameable and noindex", () => {
  const config = read("next.config.js");
  assert.match(config, /source:\s*"\/embed\/:path\*"/);
  assert.match(config, /frame-ancestors https: http:/);

  for (const route of [
    "app/embed/take-home-pay-calculator/page.tsx",
    "app/embed/living-wage-checker/page.tsx",
    "app/embed/redundancy-pay-calculator/page.tsx",
  ]) {
    const source = read(route);
    assert.match(
      source,
      /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/,
    );
    assert.match(
      source,
      /resolveEmbedOption\(searchParams\.footer,\s*"off"\)/,
    );
  }
});
