import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/build-app-image.yml", "utf8").replace(/\r\n/g, "\n");

/** The body of a step (everything after its name, id/if/continue-on-error lines removed) up to the next step. */
function stepBody(name: string) {
  const start = workflow.indexOf(`      - name: ${name}\n`);
  assert.notEqual(start, -1, `missing step ${name}`);
  const rest = workflow.slice(start + `      - name: ${name}\n`.length);
  const end = rest.search(/\n {6}(- name:|# )/);
  return (end === -1 ? rest : rest.slice(0, end))
    .split("\n")
    .filter((line) => !/^ {8}(id|if|continue-on-error):/.test(line))
    .join("\n")
    .trim();
}

test("each deploy SSH step has an identical retry", () => {
  for (const name of ["Copy compose file", "Pull and restart app"]) {
    assert.equal(stepBody(`${name} (retry)`), stepBody(name), `${name} retry has drifted from the first attempt`);
  }
});

test("only the first attempts may fail without failing the deploy", () => {
  assert.equal((workflow.match(/continue-on-error: true/g) || []).length, 2);
  assert.match(workflow, /- name: Copy compose file \(retry\)\n {8}if: \$\{\{ steps\.copy_compose\.outcome == 'failure' \}\}/);
  assert.match(workflow, /- name: Pull and restart app \(retry\)\n {8}if: \$\{\{ steps\.restart_app\.outcome == 'failure' \}\}/);
});

test("image cleanup stays scoped to WorkCV images", () => {
  assert.doesNotMatch(workflow, /docker (system|image) prune/);
});

test("server maintenance never prints banned addresses and needs explicit confirmation", () => {
  const maintenance = readFileSync(".github/workflows/diagnose-app.yml", "utf8");
  assert.match(maintenance, /inputs\.mode == 'harden_ssh' && inputs\.confirm == 'HARDEN'/);
  assert.match(maintenance, /fail2ban-client status sshd \| grep -E 'Currently failed\|Total failed\|Currently banned\|Total banned'/);
  assert.match(maintenance, /sshd -t/);
});
