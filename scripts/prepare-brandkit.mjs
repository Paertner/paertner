// Usage: node scripts/prepare-brandkit.mjs <extracted Paertner 2 directory>
// Extract the supplied artwork, preserving its paths and gradient mark.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) throw new Error("Provide the extracted Paertner 2 directory.");
const output = "public/identity";
await fs.mkdir(output, { recursive: true });
const read = (name) => fs.readFile(path.join(source, name), "utf8");
const wordmarkSource = await read("LinkedIn pp- 7.svg");
const markSource = await read("LinkedIn pp- 6.svg");
const embedded = markSource.match(/xlink:href="data:image\/png;base64,([^"]+)"/)[1];
const markImage = await sharp(Buffer.from(embedded, "base64")).resize(768).png({ palette: true, colours: 128 }).toBuffer();
const optimize = (svg) => svg.replace(/data:image\/png;base64,[^"]+/g, `data:image/png;base64,${markImage.toString("base64")}`);
function isolate(svg, box, width, height) {
  return optimize(svg)
    .replace(/width="400" height="400" viewBox="0 0 400 400"/, `width="${width}" height="${height}" viewBox="${box}"`)
    .replace(/<rect width="400" height="400" fill="(?:white|#141414)"\/>/g, "")
    .replace(/ clip-path="url\(#[^)]+\)"/, "");
}
const light = isolate(wordmarkSource, "60 166 315 69", 315, 69);
const dark = light.replace('fill="white"', 'fill="#141414"');
const mark = isolate(markSource, "103 151 193.66 98.2028", 194, 98);
for (const [name, svg] of [["wordmark-light.svg", light], ["wordmark.svg", dark], ["mark.svg", mark]]) {
  await fs.writeFile(`${output}/${name}`, svg);
}
const markPng = await sharp(Buffer.from(mark)).resize(96).png({ palette: true, colours: 128 }).toBuffer();
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="104" fill="#141414"/><image x="48" y="151" width="416" height="211" href="data:image/png;base64,${markPng.toString("base64")}"/></svg>`;
await fs.writeFile(`${output}/favicon.svg`, icon);
await sharp(Buffer.from(icon)).resize(180).png().toFile(`${output}/apple-touch-icon.png`);
const wordmarkPng = await sharp(Buffer.from(light)).resize(980).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#141414" } })
  .composite([{ input: wordmarkPng, left: 110, top: 208 }])
  .png().toFile(`${output}/social.png`);
console.log(`Prepared official brand assets in ${output}`);
