import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createCanvas } from "@napi-rs/canvas";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(scriptDirectory, "..");
const iconDirectory = path.join(
  workspace,
  "chrome-extension",
  "workcv-job-keyword-highlighter",
  "icons",
);

fs.mkdirSync(iconDirectory, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d");
  const scale = size / 128;

  context.fillStyle = "#0f2942";
  context.beginPath();
  context.roundRect(0, 0, size, size, 18 * scale);
  context.fill();

  context.fillStyle = "#d4a843";
  context.fillRect(20 * scale, 23 * scale, 88 * scale, 14 * scale);
  context.fillRect(20 * scale, 54 * scale, 68 * scale, 12 * scale);
  context.fillRect(20 * scale, 82 * scale, 48 * scale, 12 * scale);

  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(1.5, 8 * scale);
  context.lineCap = "round";
  context.beginPath();
  context.arc(86 * scale, 82 * scale, 19 * scale, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.moveTo(100 * scale, 97 * scale);
  context.lineTo(112 * scale, 111 * scale);
  context.stroke();

  fs.writeFileSync(path.join(iconDirectory, `icon-${size}.png`), canvas.toBuffer("image/png"));
}

// UK Visa Sponsor Checker: a gold shield with a white tick.
const sponsorIconDirectory = path.join(workspace, "chrome-extension", "workcv-uk-visa-sponsor-checker", "icons");

fs.mkdirSync(sponsorIconDirectory, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d");
  const scale = size / 128;

  context.fillStyle = "#0f2942";
  context.beginPath();
  context.roundRect(0, 0, size, size, 18 * scale);
  context.fill();

  context.fillStyle = "#d4a843";
  context.beginPath();
  context.moveTo(64 * scale, 14 * scale);
  context.lineTo(104 * scale, 28 * scale);
  context.lineTo(104 * scale, 62 * scale);
  context.bezierCurveTo(104 * scale, 88 * scale, 86 * scale, 104 * scale, 64 * scale, 116 * scale);
  context.bezierCurveTo(42 * scale, 104 * scale, 24 * scale, 88 * scale, 24 * scale, 62 * scale);
  context.lineTo(24 * scale, 28 * scale);
  context.closePath();
  context.fill();

  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(2, 12 * scale);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(45 * scale, 64 * scale);
  context.lineTo(59 * scale, 78 * scale);
  context.lineTo(84 * scale, 50 * scale);
  context.stroke();

  fs.writeFileSync(path.join(sponsorIconDirectory, `icon-${size}.png`), canvas.toBuffer("image/png"));
}
