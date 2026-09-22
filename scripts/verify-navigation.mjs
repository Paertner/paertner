// PLAYWRIGHT_BROWSERS_PATH can point at a local Playwright browser installation.
// TEST_BASE_URL defaults to the local preview. This test only follows public links.
import assert from "node:assert/strict";
import { chromium, webkit, devices } from "playwright-core";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const engines = [
  ["iPhone WebKit", webkit, devices["iPhone 13"]],
  ["Android Chromium", chromium, devices["Pixel 7"]],
];
for (const [name, engine, device] of engines) {
  const browser = await engine.launch(engine === chromium && process.platform === "win32" ? { executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" } : {});
  try {
    const context = await browser.newContext({ ...device, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(base + "/services", { waitUntil: "networkidle", timeout: 120000 });
    await page.getByRole("button", { name: "Open navigation" }).tap();
    const summary = page.locator(".mobile-services summary");
    await summary.tap();
    assert.equal(await page.locator(".mobile-services").evaluate(e => e.open), true);
    const links = await page.locator(".mobile-services-links a").evaluateAll(nodes => nodes.map(n => n.getAttribute("href")));
    assert.ok(links.length > 1, "Service submenu has links");
    await summary.tap();
    assert.equal(await page.locator(".mobile-services").evaluate(e => e.open), false);
    for (const href of links) {
      if (!await page.locator(".menu-dialog").evaluate(e => e.open)) await page.getByRole("button", { name: "Open navigation" }).tap();
      await summary.tap();
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle", timeout: 120000 }),
        page.locator(`.mobile-services-links a[href="${href}"]`).tap(),
      ]);
      assert.equal(page.url(), base + href);
      // Also catches a cancelled click on the current page's All services link.
      await page.waitForFunction(() => !document.querySelector(".menu-dialog")?.open);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      console.log(`${name}: ${href}`);
    }
    await page.goto(base + "/work", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Solutions Development", exact: true }).tap();
    assert.ok(await page.locator(".gallery-item").count() > 0);
    assert.doesNotMatch(await page.locator("main").innerText(), /web development/i);
    console.log(`${name}: open/close, all ${links.length} submenu links, and renamed portfolio filter passed`);
  } finally { await browser.close(); }
}

const browser = await chromium.launch(process.platform === "win32" ? { executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await page.goto(base + "/services", { waitUntil: "networkidle", timeout: 120000 });
  const summary = page.locator(".services-dropdown summary");
  await summary.hover();
  assert.equal(await page.locator(".services-dropdown").evaluate(e => e.open), true);
  await page.locator('.services-dropdown-panel a[href="/services/seo"]').click();
  await page.waitForURL(base + "/services/seo", { waitUntil: "networkidle" });
  await page.mouse.move(0, 500);
  await summary.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".services-dropdown").evaluate(e => e.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".services-dropdown").evaluate(e => e.open), false);
  console.log("Desktop: hover navigation and keyboard Enter/Escape passed");
} finally { await browser.close(); }
