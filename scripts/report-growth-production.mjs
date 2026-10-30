// Run from the WorkCV checkout. Credentials and decrypted results never enter CI.
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decryptSnapshot, readEncryptedChunks, renderDashboard } from "./production-growth-dashboard.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const privateDir = path.join(root, ".private-reports");
const repo = "dk017/workcv";
const workflow = "diagnose-app.yml";
const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !arg.startsWith("--resume=") && !arg.startsWith("--ref="))) throw new Error("Usage: npm run report:growth:production -- [--ref=branch] [--resume=request-uuid]");
  if (git(["check-ignore", ".private-reports/check"]) !== ".private-reports/check") throw new Error("Private reports directory must be gitignored");
  const credentialText = execFileSync("git", ["credential", "fill"], {
    cwd: root, encoding: "utf8", input: "protocol=https\nhost=github.com\n\n", stdio: ["pipe", "pipe", "pipe"],
  });
  const credentials = Object.fromEntries(credentialText.split(/\r?\n/).filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]));
  if (!credentials.password) throw new Error("Sign in to GitHub through Git Credential Manager first");
  const api = async (endpoint, options = {}) => {
    const response = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`, {
      ...options, headers: { Authorization: `Bearer ${credentials.password}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub ${options.method || "GET"} failed (${response.status}); check repository Actions access`);
    return response;
  };
  await mkdir(privateDir, { recursive: true, mode: 0o700 });
  const resumed = args.find(arg => arg.startsWith("--resume="))?.slice(9);
  const id = resumed || randomUUID();
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Invalid report request UUID");
  const requestDir = path.join(privateDir, id);
  let state;
  if (resumed) {
    state = JSON.parse(await readFile(path.join(requestDir, "request.json"), "utf8"));
  } else {
    const ref = args.find(arg => arg.startsWith("--ref="))?.slice(6) || git(["branch", "--show-current"]);
    if (!ref) throw new Error("A pushed branch is required; supply --ref=branch");
    const commit = git(["rev-parse", "HEAD"]);
    const remote = await (await api(`commits/${encodeURIComponent(ref)}`)).json();
    if (remote.sha !== commit) throw new Error("Push the reviewed report code first; local HEAD and selected remote branch must match");
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 3072, publicKeyEncoding: { type: "spki", format: "pem" }, privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    await mkdir(requestDir, { mode: 0o700 });
    await writeFile(path.join(requestDir, "recipient-private.pem"), privateKey, { mode: 0o600, flag: "wx" });
    state = { id, ref, commit, requested_at: new Date().toISOString() };
    await writeFile(path.join(requestDir, "request.json"), JSON.stringify(state, null, 2), { mode: 0o600 });
    await api(`actions/workflows/${workflow}/dispatches`, { method: "POST", body: JSON.stringify({
      ref, inputs: { mode: "growth_report", report_id: id, report_public_key: Buffer.from(publicKey).toString("base64") },
    }) });
    console.log("Read-only production report requested. Only encrypted results will enter GitHub logs.");
  }
  console.log(`Request ${id}. Resume if interrupted: npm run report:growth:production -- --resume=${id}`);
  const deadline = Date.now() + 7 * 60 * 1000;
  let run;
  while (Date.now() < deadline) {
    const runs = await (await api(`actions/workflows/${workflow}/runs?event=workflow_dispatch&per_page=50`)).json();
    run = runs.workflow_runs.find(candidate => candidate.display_title === `Private growth report ${id}`);
    if (run) {
      if (run.head_sha !== state.commit) throw new Error("Remote branch moved before report execution; discard this run and request a new report");
      if (run.status === "completed") break;
    }
    await pause(5000);
  }
  if (!run || run.status !== "completed") throw new Error("Report still pending. Use the resume command above later");
  state.run_id = run.id;
  state.run_url = run.html_url;
  await writeFile(path.join(requestDir, "request.json"), JSON.stringify(state, null, 2), { mode: 0o600 });
  if (run.conclusion !== "success") throw new Error(`Read-only report failed; inspect ${run.html_url}. No plaintext report was transferred`);
  const jobs = await (await api(`actions/runs/${run.id}/jobs`)).json();
  const job = jobs.jobs.find(item => item.name === "Read encrypted production growth snapshot");
  if (!job) throw new Error("Expected growth-report job is missing");
  const log = await (await api(`actions/jobs/${job.id}/logs`)).text();
  const encoded = readEncryptedChunks(log);
  const report = decryptSnapshot(encoded, await readFile(path.join(requestDir, "recipient-private.pem"), "utf8"), id);
  report.provenance = { ...state, reporter_commit: run.head_sha };
  const json = JSON.stringify(report, null, 2);
  const html = renderDashboard(report);
  // Saved snapshots are immutable; latest files are convenient local pointers only.
  await writeFile(path.join(requestDir, "report.json"), json, { mode: 0o600 });
  await writeFile(path.join(requestDir, "report.html"), html, { mode: 0o600 });
  await writeFile(path.join(privateDir, "latest.json"), json, { mode: 0o600 });
  await writeFile(path.join(privateDir, "latest.html"), html, { mode: 0o600 });
  console.log(`Private dashboard: ${path.join(privateDir, "latest.html")}`);
  console.log(`Private data: ${path.join(privateDir, "latest.json")}`);
}

main().catch(error => {
  // Child-process errors can include captured credentials. Never print those objects.
  console.error(error.stdout || error.stderr ? "Local Git authentication failed; check Git Credential Manager" : error.message);
  process.exitCode = 1;
});
