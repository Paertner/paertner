# Images and SEO

## Everyday uploads

Upload JPEG, PNG, WebP or AVIF in Admin → Website → Media. Payload automatically produces a WebP original (quality 82, at most 2400 × 2400, no enlargement) and 320, 960 and 1920 px WebP variants where the source is large enough. Set meaningful alt text. Choose media in a project's or service's Imagery tab. Clear the image relationship to remove it from that page. Deleting a media record removes its generated files too.

Website content → Website imagery controls the homepage poster/transition, studio image and default sharing image. Pages → Book controls the booking image. Brand logos stay SVG to remain crisp.

## Local batch tools

`npm run images:optimize -- <input-directory> <output-directory>` converts raster files in one directory with Sharp, respects orientation and preserves original files. It refuses to overwrite existing output. Admin uploads run their own automatic equivalent; no manual command is needed.

`npm run images:import` imports current website raster assets and assigns only empty image relationships. It uses the configured INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD and the local server; credentials are never printed. Existing media filenames are reused. This is a one-time provisioning command, not a startup job: running it later may reassign images intentionally cleared by an editor. A content snapshot is saved in .local before each import.

## SEO and articles

Pages contains metadata for Home, Work, Services, Studio, Book, Privacy, Terms and Blog. Projects, Services and Blog posts each have a Search preview tab. Set an optional SEO title, meta description, sharing image, canonical URL and no-index setting. Empty values inherit meaningful content defaults. The global Website content → SEO & legal indexing switch still controls launch readiness; individual pages cannot override a disabled global switch.

Blog posts supports drafts, authors, publication dates, cover images and article text with paragraphs, ## section headings, - checklist items and [text](/internal-path) links. Publishing makes an article available at /blog/<slug> and in /blog. Drafts are excluded from public queries and the sitemap. This date field is editorial metadata, not scheduled publishing. Posts marked no-index or with a canonical override are excluded from the sitemap. No sample articles are published automatically.

## Deployment

SQLite and PostgreSQL migrations for the new fields and Blog posts collection are included in src/migrations. Apply the appropriate migration with the normal deployment procedure before running the updated app against an existing production database. The SQLite migration chain was tested locally; the PostgreSQL migration was generated offline and has not been executed against a PostgreSQL server.

## Article conversion paths

The six launch articles include contextual service and related-article links. Contact links include a service query and #contact-form to open the relevant inquiry form. The article template adds reading time, section navigation, related posts and a closing CTA. New articles without a service-specific contact link use the general contact form.
