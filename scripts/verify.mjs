import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
fs.mkdirSync(".local/qa", { recursive: true });
const report = { pages: [], errors: [], checks: [], accessibility: [] };
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  extraHTTPHeaders: { Origin: base },
});
const safe = async (c) =>
  c.addInitScript(() => {
    Element.prototype.requestPointerLock = () => {};
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  });
await safe(context);
const page = await context.newPage();
page.on("pageerror", (e) => report.errors.push(e.message));
const check = (condition, name) => {
  report.checks.push({ name, passed: !!condition });
  if (!condition) console.log("FAIL", name);
};
const visit = async (url, p = page) => {
  const r = await p.goto(base + url, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  return r;
};
try {
  const routes = [
    "/",
    "/work",
    "/services",
    "/studio",
    "/book",
    "/privacy",
    "/terms",
    "/work/nova-refrigeration-appliance",
    "/work/equipo-group",
    "/work/velox-energy",
    "/work/nexus-oil",
    "/work/luxora-nova",
    "/work/iensol",
    "/services/digital-marketing",
    "/services/websites-web-apps",
    "/services/seo",
    "/services/social-media",
    "/services/paid-media",
    "/services/brand-content",
  ];
  for (const route of routes) {
    const r = await visit(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    const h1 = await page.locator("h1").count();
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
      );
    report.pages.push({
      route,
      status: r.status(),
      overflow,
      h1,
      broken,
      title: await page.title(),
    });
    check(
      r.status() === 200 && !overflow && h1 === 1 && broken.length === 0,
      "Page " + route,
    );
    check(
      (
        await page.locator('meta[name="robots"]').getAttribute("content")
      )?.includes("noindex"),
      "Preview noindex " + route,
    );
  }
  await visit("/work/nova-refrigeration-appliance");
  check(
    (await page.locator(".case-detail-card").count()) === 5,
    "Nova includes five detailed case-study sections",
  );
  check(
    (await page.locator(".case-gallery figure").count()) === 5,
    "Nova includes five live website screens in a compact gallery",
  );
  check(
    (await visit("/missing-page")).status() === 404,
    "Custom 404 returns HTTP 404",
  );
  await visit("/");
  await page.screenshot({ path: ".local/qa/home-opening.png" });
  for (const selector of [
    ".intro",
    ".discovery",
    ".services-section",
    ".work-section",
    ".method",
    ".closing",
  ]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: ".local/qa/" + selector.slice(1) + ".png" });
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.waitForFunction(() => document.querySelector('video[data-sc-scrub]')?.readyState >= 2);
  const firstTime = await page.locator('video').evaluate(v => v.currentTime);
  await page.evaluate(() => scrollTo({ top: 850, behavior: "instant" }));
  await page.waitForTimeout(1500);
  const middleTime = await page.locator('video').evaluate(v => v.currentTime);
  check(middleTime > firstTime + 1, "Supplied entrance video advances with scroll");
  await page.evaluate(() => scrollTo({ top: 250, behavior: "instant" }));
  await page.waitForTimeout(1500);
  const reverseTime = await page.locator('video').evaluate(v => v.currentTime);
  check(reverseTime < middleTime - .5, "Entrance video reverses with scroll");
  const discovery = await page.locator('.discovery').evaluate(e => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), discovery);
  await page.waitForTimeout(700);
  const beforeReveal = await page.locator('.search-destination').evaluate(e => getComputedStyle(e).clipPath);
  await page.evaluate(y => scrollTo({ top: y + 750, behavior: 'instant' }), discovery);
  await page.waitForTimeout(700);
  const afterReveal = await page.locator('.search-destination').evaluate(e => getComputedStyle(e).clipPath);
  check(beforeReveal !== afterReveal, 'Search preview reveals its landing destination');
  const campaigns = await page.locator('.campaigns').evaluate(e => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => scrollTo({ top: y + 700, behavior: 'instant' }), campaigns);
  await page.waitForTimeout(700);
  check(await page.locator('.campaign-rail').evaluate(e => e.scrollWidth > innerWidth * 1.5 && Math.abs(new DOMMatrix(getComputedStyle(e).transform).m41) > 200), 'Campaign rail travels through actual overflow');
  for (const route of ["/", "/work", "/services/websites-web-apps", "/book"]) {
    await visit(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    report.accessibility.push({
      route,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  await visit("/work");
  await page.getByRole("button", { name: "SEO", exact: true }).click();
  check(
    (await page.locator(".gallery-item").count()) === 2,
    "Work filter returns matching projects",
  );
  await page.getByRole("button", { name: "All", exact: true }).click();
  check(
    (await page.locator(".gallery-item").count()) === 7,
    "All work restored",
  );
  await visit("/book?service=SEO");
  check(
    (await page.locator("select[name=service]").inputValue()) === "SEO",
    "Service selection carries into inquiry",
  );
  await page.getByLabel("Your name").fill("Website QA");
  await page.getByLabel("Work email").fill("qa@paertner.test");
  await page
    .getByLabel("A little about")
    .fill("Automated local verification of the project inquiry workflow.");
  await page.locator("input[name=consent]").check();
  await page.getByRole("button", { name: "Request a conversation" }).click();
  await page.locator(".form-status").waitFor();
  if (await page.locator(".form-status.error").count())
    throw new Error(await page.locator(".form-status.error").innerText());
  check(
    (await page.locator(".form-status.success").innerText()).includes(
      "saved for review",
    ),
    "Inquiry confirms actual persistence",
  );
  const anon = await browser.newContext();
  await safe(anon);
  for (const route of ["/api/inquiries", "/api/users"]) {
    const r = await anon.request.get(base + route);
    check([401, 403].includes(r.status()), "Private endpoint " + route);
  }
  const invalid = await anon.request.post(base + "/api/inquiry", {
    form: { name: "x", email: "bad", message: "short" },
  });
  check(
    invalid.status() === 303 ||
      invalid.status() === 400 ||
      invalid.url().includes("error=1"),
    "Invalid inquiry rejected",
  );
  const blocked = await anon.request.post(base + "/api/inquiry", {
    headers: { Origin: "https://evil.example", Accept: "application/json" },
    form: {
      name: "Test",
      email: "test@example.com",
      message: "This is a valid long enough message.",
      consent: "yes",
    },
  });
  check(blocked.status() === 403, "Cross-origin inquiry rejected");
  const env = Object.fromEntries(
    fs
      .readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("="))
      .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
  );
  const login = await context.request.post(base + "/api/users/login", {
    data: {
      email: env.INITIAL_ADMIN_EMAIL,
      password: env.INITIAL_ADMIN_PASSWORD,
    },
  });
  check(login.ok(), "Admin authentication");
  await visit("/admin");
  await page.screenshot({ path: ".local/qa/admin.png" });
  check(
    (await page.locator("body").innerText()).includes("Projects"),
    "Admin collections render",
  );
  const saved = await context.request.get(
    base + "/api/inquiries?where[email][equals]=qa@paertner.test",
  );
  const inquiries = await saved.json();
  check(inquiries.docs?.length > 0, "Inquiry visible to admin");
  for (const d of inquiries.docs || [])
    await context.request.delete(base + "/api/inquiries/" + d.id);
  const seed = {
    title: "QA Draft",
    slug: "qa-verification-draft",
    descriptor: "Local test only.",
    sector: "Testing",
    services: [{ label: "Testing" }],
    challenge: "A test of draft access.",
    idea: "An isolated temporary draft.",
    execution: "Created only for automated verification.",
    result: "Will be removed after verification.",
    _status: "draft",
    concept: true,
  };
  const draft = await context.request.post(base + "/api/projects", {
    data: seed,
  });
  const draftResult = await draft.json();
  check(draft.ok(), "Admin can create draft");
  if (draftResult.doc) {
    const id = draftResult.doc.id;
    const publicDraft = await anon.request.get(base + "/api/projects/" + id);
    check(!publicDraft.ok(), "Draft hidden from public API");
    const publish = await context.request.patch(base + "/api/projects/" + id, {
      data: { _status: "published" },
    });
    check(publish.ok(), "Admin can publish project");
    check(
      (
        await anon.request.get(base + "/work/qa-verification-draft")
      ).status() === 200,
      "Published project has public page",
    );
    await context.request.delete(base + "/api/projects/" + id);
  }
  const current = await (
    await context.request.get(base + "/api/globals/site")
  ).json();
  const old = current.heroTitle;
  await context.request.post(base + "/api/globals/site", {
    data: { heroTitle: "A verified connection." },
  });
  const updated = await anon.request.get(base + "/");
  check(
    (await updated.text()).includes("verified connection"),
    "Admin content edit appears publicly",
  );
  await context.request.post(base + "/api/globals/site", {
    data: { heroTitle: old },
  });
  const upload = await context.request.post(base + "/api/media", {
    multipart: {
      _payload: JSON.stringify({ alt: "QA image for upload verification" }),
      file: {
        name: "qa-image.webp",
        mimeType: "image/webp",
        buffer: fs.readFileSync("public/images/digital-search.webp"),
      },
    },
  });
  const uploaded = await upload.json();
  check(upload.ok(), "Media upload");
  if (uploaded.doc)
    await context.request.delete(base + "/api/media/" + uploaded.doc.id);
  await anon.close();
  for (const width of [390, 360, 768]) {
    const mobile = await browser.newContext({
      viewport: { width, height: width === 360 ? 640 : 844 },
      isMobile: width < 700,
      hasTouch: true,
    });
    await safe(mobile);
    const p = await mobile.newPage();
    p.on("pageerror", (e) => report.errors.push(e.message));
    for (const route of [
      "/",
      "/work",
      "/services",
      "/services/websites-web-apps",
      "/studio",
      "/book",
      "/work/aeral",
    ]) {
      await visit(route, p);
      const overflow = await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      check(!overflow, "No overflow " + width + " " + route);
      if (route === "/" || route === "/book")
        await p.screenshot({
          path:
            ".local/qa/mobile-" +
            width +
            (route === "/" ? "-home" : "-book") +
            ".png",
          fullPage: route !== "/",
        });
    }
    if (width < 700) {
      await visit("/", p);
      await p.getByRole("button", { name: "Open navigation" }).click();
      check(
        await p.locator("dialog").isVisible(),
        "Mobile menu opens " + width,
      );
      await p.keyboard.press("Escape");
      check(
        !(await p.locator("dialog").isVisible()),
        "Escape closes menu " + width,
      );
      check(
        await p
          .getByRole("button", { name: "Open navigation" })
          .evaluate((e) => e === document.activeElement),
        "Focus returns to menu trigger " + width,
      );
    }
    await mobile.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await safe(reduced);
  const rp = await reduced.newPage();
  await visit("/", rp);
  check(
    await rp.locator(".entrance").evaluate(e => e.getBoundingClientRect().height <= innerHeight + 1 && e.dataset.scAct === "flow"),
    "Reduced motion removes pinned scroll",
  );
  check(await rp.locator("video").evaluate(v => !v.getAttribute("src")), "Reduced motion does not fetch the film");
  await rp.locator(".discovery").scrollIntoViewIfNeeded();
  await rp.screenshot({ path: ".local/qa/reduced.png" });
  await reduced.close();
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await safe(nojs);
  const np = await nojs.newPage();
  await visit("/book", np);
  await np.getByLabel("Your name").fill("No JS Test");
  await np.getByLabel("Work email").fill("nojs@paertner.test");
  await np
    .getByLabel("A little about")
    .fill("Testing a progressive enhancement inquiry without JavaScript.");
  await np.locator("input[name=consent]").focus();
  await np.keyboard.press("Space");
  await np.getByRole("button", { name: "Request a conversation" }).focus();
  await np.keyboard.press("Enter");
  await np.waitForURL("**/book?sent=1");
  check(
    np.url().endsWith("?sent=1"),
    "No-JavaScript POST succeeds without personal data in URL",
  );
  await nojs.close();
  const nr = await (
    await context.request.get(
      base + "/api/inquiries?where[email][equals]=nojs@paertner.test",
    )
  ).json();
  for (const d of nr.docs || [])
    await context.request.delete(base + "/api/inquiries/" + d.id);
  check(report.errors.length === 0, "No browser runtime errors");
} catch (e) {
  report.errors.push(e.stack);
  console.log("ERROR", e.message);
} finally {
  fs.writeFileSync(
    ".local/qa/report-final.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
const failed = report.checks.filter((c) => !c.passed);
console.log(
  JSON.stringify(
    {
      pages: report.pages.length,
      checks: report.checks.length,
      failed,
      errors: report.errors,
      a11y: report.accessibility.map((r) => ({
        route: r.route,
        violations: r.violations.map((v) => v.id),
      })),
    },
    null,
    2,
  ),
);
if (
  failed.length ||
  report.errors.length ||
  report.accessibility.some((a) => a.violations.length)
)
  process.exitCode = 1;
