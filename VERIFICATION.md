# Verification and handoff

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
