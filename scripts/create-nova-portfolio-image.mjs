import sharp from "sharp";

const homepageSource = "public/images/project-nova-homepage-live.png";
const servicesSource = "public/images/project-nova-services-live.png";

await sharp(homepageSource)
  .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.8 })
  .png({ compressionLevel: 7, adaptiveFiltering: true })
  .toFile("public/images/project-nova-homepage-detail-v4.png");

await sharp(servicesSource)
  .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.8 })
  .png({ compressionLevel: 7, adaptiveFiltering: true })
  .toFile("public/images/project-nova-services-detail-v4.png");

const laptopCapture = await sharp(homepageSource)
  .resize(572, 344, { fit: "cover", position: "left top" })
  .sharpen({ sigma: 0.5, m1: 0.6, m2: 1.6 })
  .png()
  .toBuffer();

const tabletCapture = await sharp(servicesSource)
  .resize(430, 251, { fit: "cover", position: "north" })
  .sharpen({ sigma: 0.5, m1: 0.6, m2: 1.6 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const laptopMask = Buffer.from(`
  <svg width="572" height="344" xmlns="http://www.w3.org/2000/svg">
    <rect width="572" height="344" rx="3" fill="white"/>
  </svg>
`);

const laptopScreen = await sharp(laptopCapture)
  .joinChannel(await sharp(laptopMask).extractChannel(3).toBuffer())
  .png()
  .toBuffer();

const tabletPixels = Buffer.alloc(430 * 251 * 4);
for (let y = 0; y < 251; y += 1) {
  const progress = y / 250;
  const left = Math.round(16 * (1 - progress));
  const right = Math.round(418 + 12 * progress);
  const rowWidth = right - left;
  for (let x = left; x < right; x += 1) {
    const sourceX = Math.min(429, Math.round(((x - left) / rowWidth) * 429));
    const sourceOffset = (y * 430 + sourceX) * 4;
    const targetOffset = (y * 430 + x) * 4;
    tabletCapture.data.copy(tabletPixels, targetOffset, sourceOffset, sourceOffset + 4);
  }
}

const tabletScreen = await sharp(tabletPixels, {
  raw: { width: 430, height: 251, channels: 4 },
})
  .png()
  .toBuffer();

const glass = Buffer.from(`
  <svg width="1536" height="1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="reflection" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".055"/>
        <stop offset=".38" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="1" stop-color="#86b9db" stop-opacity=".025"/>
      </linearGradient>
    </defs>
    <rect x="286" y="303" width="572" height="344" rx="3" fill="url(#reflection)"/>
    <polygon points="976,440 1378,440 1390,691 960,691" fill="url(#reflection)"/>
  </svg>
`);

const composed = await sharp("public/images/project-nova-device-base-v2.png")
  .composite([
    { input: laptopScreen, left: 286, top: 303 },
    { input: tabletScreen, left: 960, top: 440 },
    { input: glass, left: 0, top: 0 },
  ])
  .png()
  .toBuffer();

await sharp(composed)
  .extract({ left: 0, top: 80, width: 1536, height: 864 })
  .resize(1920, 1080, { fit: "fill" })
  .sharpen({ sigma: 0.35, m1: 0.45, m2: 1.25 })
  .png({ compressionLevel: 7, adaptiveFiltering: true })
  .toFile("public/images/project-nova-studio-v10.png");

console.log("Created 1920x1080 Nova-only presentation with a photoreal open notebook and tablet.");
