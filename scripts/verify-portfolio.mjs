import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const catalog = JSON.parse(await fs.readFile('src/lib/portfolio-projects.json', 'utf8'));
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultNavigationTimeout(120000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await fs.mkdir('.local/qa', { recursive: true });
try {
  for (const entry of catalog) {
    const response = await page.goto(base + '/work/' + entry.project.slug, { waitUntil: 'networkidle', timeout: 120000 });
    assert.equal(response.status(), 200, entry.project.slug);
    assert.equal(await page.locator('h1').textContent(), entry.project.title);
    assert.equal(await page.locator('.case-gallery figure').count(), entry.gallery.length);
    assert.equal(await page.locator('.case-art img').evaluate(img => img.complete && img.naturalWidth > 0), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.match(await page.locator('.case-facts').innerText(), new RegExp(entry.projectKind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    console.log('PASS', entry.project.slug);
  }
  await page.goto(base + '/work', { waitUntil: 'networkidle' });
  const total = await page.locator('.gallery-item').count();
  for (const [filter, slug] of [['UI/UX design', 'digitaledu'], ['Brand & graphic design', 'd8-youth-dialogue'], ['Social & campaigns', 'atena'], ['SEO & analysis', 'abb-analysis'], ['Web development', 'mishn']]) {
    await page.getByRole('button', { name: filter, exact: true }).click();
    assert.ok(await page.locator('.gallery-item').count() > 0);
    assert.ok(await page.locator('.gallery-item').count() < total);
    assert.ok(await page.locator(`.gallery-item a[href="/work/${slug}"]`).count() > 0);
    console.log('PASS filter', filter);
  }
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.locator('.gallery-item').count(), total);
  await page.screenshot({ path: '.local/qa/portfolio-desktop.png', fullPage: true });
  const axe = await new AxeBuilder({ page }).include('#main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map(v => ({ id: v.id, impact: v.impact })), []);
  await page.goto(base + '/work/d8-youth-dialogue', { waitUntil: 'networkidle' });
  await page.locator('.case-gallery-image').first().click();
  assert.equal(await page.locator('.screen-viewer').evaluate(dialog => dialog.open), true);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.screen-viewer-bar').innerText(), /2 \/ 8/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.screen-viewer').evaluate(dialog => dialog.open), false);
  for (const route of ['/work', '/work/d8-youth-dialogue', '/work/digitaledu', '/work/abb-analysis']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, route);
    await page.screenshot({ path: '.local/qa/portfolio-mobile-' + route.split('/').pop() + '.png', fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${catalog.length} project pages; five filters; gallery keyboard controls; accessibility; mobile layouts. Total published: ${total}.`);
} finally { await browser.close(); }
