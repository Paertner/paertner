# Paertner

A complete Next.js website with Payload CMS. Public pages include Home, Work and case studies, Services and service details, Studio, Book a call, Privacy, Terms, and custom error states.

## Local development

Requires Node 24 and npm.

1. Run `npm ci`.
2. Place the private `Brandkit` directory beside this README, then run `npm run setup`.
3. Run `npm run dev` and open http://localhost:3000.
4. Local admin sign-in details are in `.local/ADMIN.md`. They are generated, ignored, and never committed.

The setup command extracts only the four required website logos from the private originals. `Brandkit/`, `public/brand/`, the website plan, creative working files, environment files, uploads, and databases are ignored. Supply the four website logo SVGs securely during deployment; they are intentionally not distributed in this repository.

## Editing

The September portfolio expansion is catalogued in `src/lib/portfolio-projects.json`, with source-page references and project credits. Content version 4 imports these projects once without replacing existing project edits. Optimized covers and gallery images are shipped in `public/images/portfolio`; the website uses these when a project has no CMS-uploaded images. CMS uploads take precedence. Keep this directory with the application when deploying. Source PDFs are not distributed. Figma originals could not be accessed through the connector; the UI/UX images in this release are extracted from the supplied Paertner PDF.

Open `/admin`. Manage projects (including drafts and versions), services, image uploads, website content, navigation, contact information, legal copy, redirects, and inquiries. Uploads require alternative text. Draft projects are excluded from public pages and public API reads. There is one administrator. Public account creation is disabled.

Concept work is visibly identified. No fabricated testimonials or performance claims are used. The website is `noindex` by default. Review real content and enable indexing in Website content when ready.

The inquiry form saves requests to the private Inquiries collection. It does not send email or claim an appointment is confirmed. Add a real HTTPS booking URL in Website content to expose a scheduling link. An email delivery integration can be added when a provider is selected.

## Production

Use a persistent Node host with HTTPS, a unique PAYLOAD_SECRET of at least 32 characters, and NEXT_PUBLIC_SERVER_URL set to the canonical domain. PostgreSQL is selected when DATABASE_URI is set; otherwise SQLite is used for local preview. Configure persistent media with the S3 variables in .env.example. Local disk uploads are unsuitable for ephemeral hosting. Back up database and media separately.

Initialize a production administrator with INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD. Remove bootstrap credentials after the first successful start. Initial SQLite and PostgreSQL migrations are included in src/migrations. SQLite migrations are verified against an isolated database; PostgreSQL execution requires a configured server. For later schema changes, generate and commit the database migration for the chosen adapter with `npx payload migrate:create`, then run `npx payload migrate` during release. Do not rely on development schema push in production. Database migrations should be tested against a backed-up staging database.

The inquiry endpoint validates origin, input, and request size and limits repeated submissions per email address. Configure infrastructure request limits for an internet-facing deployment.

Launch requires final legal review, confirmed contact details, real project content, domain/hosting configuration, and review of indexing. Production infrastructure and the push-to-main deployment workflow are documented in [DEPLOYMENT.md](DEPLOYMENT.md).

## Verification

- `npm run typecheck`
- `npm run build`
- `npm start`
- With the local server running, `npm test` checks pages, mobile overflow, accessibility, menus, forms, drafts, admin access, and content persistence.

Motion uses the unchanged Scrollcraft runtime for the supplied entrance video, semantic copy cues, a search-to-destination reveal, the campaign rail, and flow entrances. Native page navigation avoids accumulating runtime instances. Reduced motion skips the video fetch and pin distance. Phones use a smaller film, a separate composition, and stacked campaign content. Source footage is kept privately in .local/video-source; optimized public files live in public/video.
