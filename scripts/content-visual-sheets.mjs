import { readdir, writeFile } from "node:fs/promises";
import { createCanvas, loadImage } from "@napi-rs/canvas";
const directory = "tmp/content-guides-qa";
const files = (await readdir(directory)).filter(f => /-(390|768|1440)\.png$/.test(f));
for (const file of files) {
  const img = await loadImage(`${directory}/${file}`);
  const mobile = file.endsWith("-390.png");
  const cropHeight = mobile ? 1400 : 1100;
  const scaledWidth = mobile ? 390 : file.endsWith("-768.png") ? 520 : 720;
  const panels = mobile ? 3 : 2;
  const scaledHeight = Math.round(cropHeight * scaledWidth / img.width);
  const canvas = createCanvas(scaledWidth * panels, scaledHeight + 32);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12324a"; ctx.font = "16px Arial"; ctx.fillText(file, 8, 22);
  for (let i = 0; i < panels; i++) {
    const y = i * cropHeight;
    ctx.drawImage(img, 0, y, img.width, Math.min(cropHeight, img.height - y), i * scaledWidth, 32, scaledWidth, scaledHeight);
  }
  await writeFile(`${directory}/sheet-${file}`, canvas.toBuffer("image/png"));
}
for (const file of (await readdir(directory)).filter(f => /-390-worked\.png$/.test(f))) {
  const img = await loadImage(`${directory}/${file}`);
  const panels = Math.ceil(img.height / 1300);
  const canvas = createCanvas(img.width * panels, 1332);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12324a"; ctx.font = "16px Arial"; ctx.fillText(file, 8, 22);
  for (let i = 0; i < panels; i++) {
    const height = Math.min(1300, img.height - i * 1300);
    ctx.drawImage(img, 0, i * 1300, img.width, height, i * img.width, 32, img.width, height);
  }
  await writeFile(`${directory}/sheet-${file}`, canvas.toBuffer("image/png"));
}
console.log("Visual review sheets ready");
