// Read-only check run inside the production app container by the "Diagnose app"
// workflow (mode: server_resources). Reports whether the container has the
// memory, writable temp space and network access the sponsor checker needs.
// It changes nothing and prints no secrets.
import { accessSync, constants } from "node:fs";
import os from "node:os";
import v8 from "node:v8";

const mb = (bytes) => Math.round(bytes / 1_048_576);
const available = typeof process.availableMemory === "function" ? process.availableMemory() : os.freemem();
const constrained = typeof process.constrainedMemory === "function" ? process.constrainedMemory() : 0;

let tmpWritable = false;
try {
  accessSync(os.tmpdir(), constants.W_OK);
  tmpWritable = true;
} catch {
  tmpWritable = false;
}

let govuk = "unchecked";
try {
  const response = await fetch("https://www.gov.uk/api/content/government/publications/register-of-licensed-sponsors-workers", {
    signal: AbortSignal.timeout(15_000),
  });
  govuk = `HTTP ${response.status}`;
} catch (error) {
  govuk = `unreachable: ${error instanceof Error ? error.message : String(error)}`;
}

console.log(
  JSON.stringify(
    {
      node: process.version,
      nodeHeapLimitMb: mb(v8.getHeapStatistics().heap_size_limit),
      availableToAppMb: mb(available),
      containerMemoryLimitMb: constrained ? mb(constrained) : null,
      hostTotalMb: mb(os.totalmem()),
      tmpdir: os.tmpdir(),
      tmpWritable,
      govuk,
      sponsorRegisterMinFreeMb: Number(process.env.SPONSOR_REGISTER_MIN_FREE_MB) || 600,
    },
    null,
    2,
  ),
);
