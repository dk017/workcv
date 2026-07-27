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
