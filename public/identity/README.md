# Paertner 2 web identity

Web derivatives of the supplied `Paertner 2.zip`. The wordmark path and gradient mark come from `LinkedIn pp- 7.svg` and `LinkedIn pp- 6.svg`; their profile backgrounds and empty margins are removed. Letter shapes are not recreated with a font. Embedded PNG metadata is stripped and the image is resized for web use.

- `wordmark-light.svg`: white lettering with the supplied green mark, for dark surfaces.
- `wordmark.svg`: graphite lettering with the supplied green mark, for light surfaces.
- `mark.svg`: transparent gradient mark.
- `favicon.svg`, `apple-touch-icon.png`: mark on a graphite tile.
- `social.png`: 1200 × 630 sharing fallback; CMS image overrides are preserved.

Palette sampled from the supplied SVG artwork: graphite `#141414`, white `#FFFFFF`, lime `#BCF70E`, highlight `#C7FE3D`, shade `#6E9108`, deep green `#1E2607`. The archive contains no font files or type specification, so the site's existing Manrope family is retained.

Regenerate with `node scripts/prepare-brandkit.mjs <extracted-directory>`. Source artwork stays outside the public directory.
