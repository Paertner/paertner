import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: npm run images:optimize -- <input-directory> <output-directory>");
const source = path.resolve(input), destination = path.resolve(output);
if (source === destination) throw new Error("Use a separate output directory to preserve originals.");
await fs.mkdir(destination, { recursive: true });
for (const file of await fs.readdir(source, { withFileTypes: true })) {
  if (!file.isFile() || !/\.(png|jpe?g|webp|avif)$/i.test(file.name)) continue;
  const target = path.join(destination, path.parse(file.name).name + ".webp");
  try { await fs.access(target); throw new Error("Output already exists: " + target); } catch (e) { if (e.code !== "ENOENT") throw e; }
  await sharp(path.join(source, file.name)).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(target);
  console.log(path.basename(target));
}
