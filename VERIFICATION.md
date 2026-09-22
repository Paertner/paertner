# Verification and handoff

## 2026-09-22: Solution Development and Safari submenu taps

- Renamed public Web development labels to Solution Development, including portfolio filtering and legacy CMS project discipline labels at read time.
- Reproduced the submenu failure in iPhone WebKit: tapping a service link moves focus from SUMMARY to DIALOG, and the shared blur handler hid the link before its click. Mobile details now use native tap behavior; desktop blur closing is limited to keyboard focus changes and hover behavior to mouse pointers.
- `scripts/verify-navigation.mjs` passed all eight submenu destinations, opening/closing, and the renamed portfolio filter in iPhone WebKit and Android Chromium. Desktop hover navigation and keyboard Enter/Escape also passed. These are browser-emulation checks, not physical iPhone certification.
- Production build and TypeScript passed. Use `PLAYWRIGHT_BROWSERS_PATH` for locally installed browsers and `TEST_BASE_URL` to run the same read-only navigation checks against another origin.

## 2026-09-18: Paertner 2 identity and readable small text

- Applied the supplied gradient mark and wordmark, graphite/white/lime palette, browser and Apple icons, sharing fallback, CMS branding, and green particle effects. Public derivatives are in `public/identity/`; private source artwork remains under `.local/`.
- Small public-site text has a 14px minimum; previous 14–15px declarations and form controls are 16px. Narrow-header spacing was adjusted to keep the call button on one line at 320px.
- `npm run typecheck`, `npm run build`, and `git diff --check` pass. The build required permission to spawn Next.js workers outside the sandbox.
- 32 browser page/viewport checks passed: 20 routes at 1440px, plus Home, Services, Work and Book at 390px, 768px and 320px. No broken images, horizontal document overflow, text below 14px, or browser runtime errors were found.
- WCAG A/AA scans on Home, Book, Services and Studio reported zero violations. The mobile menu, reduced-motion mark and animated green mark were also checked. Screenshots and reports are in `.local/brandkit-qa/`.
- These checks cover the local preview; this update has not been deployed.

## Earlier verification history

The local production preview runs at http://localhost:3000. The current revision replaces the earlier entrance film with the specific CloudFront video requested by the user and gives every public page a dark background. Artwork and lime calls to action retain their intentional local colors.

## Current revision verified

- Production build, including TypeScript, passes.
- 33 targeted browser checks pass across all 19 public content routes. Every route returns 200, has one H1, loads its images, has the intended dark body background and has no horizontal overflow.
- WCAG A/AA scans on Home, Work, Studio, Book a call and SEO report zero violations. No page errors were recorded.
- The requested video is fetched, decodes at 1764px desktop width, is muted, advances when scrolling forward and reverses when scrolling backward.
- Home, Work and Book a call were checked at 390px and 768px widths. Reduced-motion phone emulation displays the new poster and makes no movie request.
- Scrollcraft captured and visually reviewed 28 desktop, 28 phone and 23 reduced-motion frames. All three runs report no dead scroll. Video keeps advancing throughout its visible interval. Measured copy cues clear 4.5:1 contrast in the sampled frames.
- Full-page sequence review confirms dark surfaces through discovery, campaigns, services, work, method, closing and footer. Navigation and footer use the light wordmark; form controls, secondary text, search artwork and hover states have corresponding dark-theme contrast treatments.

The new source is 10.04 seconds at 24fps, 1764x1176. Audio is stripped from the public assets. Desktop video is 5.52 MB; the 960x640 phone video is 2.16 MB; the matching poster is 51 KB. Versioned asset names prevent reuse of the previous cached movie. Original source and previous entrance assets are preserved privately in .local/video-source.

## Scope and previous verification

This revision changes video assets and public presentation, without changing the CMS schema or inquiry logic. The preceding revision passed 91 application checks and nine additional keyboard/no-JavaScript checks, including admin authentication, draft/publication protections, content editing, uploads and inquiry persistence. Those reports remain historical evidence for the unchanged functionality; the current presentation checks are recorded separately.

The preceding film revision's Lighthouse scores do not describe this replacement film. No new Lighthouse score is claimed. Physical iPhone/Android playback remains untested; responsive checks use headless Chrome emulation.

The chosen atmospheric film changes the entrance's imagery under the user's explicit instruction. It supplies the visual atmosphere; semantic HTML and the following scenes communicate Paertner's services. This replacement is a refinement of the existing sequence, not a new page grammar or a claimed design approval.

## Before public launch

Confirm real project content, contact details and legal policies; configure hosting, canonical domain, PostgreSQL and persistent media; then review indexing. The preview remains noindex. Inquiries are stored for review; email delivery and confirmed appointments are not simulated. SQLite migrations were previously verified on an isolated database; live PostgreSQL execution remains untested.

Private admin details, Brandkit, public brand derivatives, WEBSITE_PLAN.md, environment files and creative working files remain ignored. Supply the required website logos securely during deployment as described in README.md.

Current reports and screenshots: .local/dark-replacement/report.json and the scroll-desktop, scroll-mobile and scroll-reduced subdirectories. Previous reports remain in .local/qa and .local/creative-history.
