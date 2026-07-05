# Terrazzo

Static MVP website for Terrazzo Urban Food & Drinks in Tehuacan, Puebla, served directly from GitHub Pages.

## Development

Install the project tooling:

```bash
npm install
```

This project does not use a frontend build step. Site files are served directly from the repository, and optimized assets under `assets/` are committed because GitHub Pages serves them directly.

## Image Optimization

Use the image optimization pipeline when adding future raw photos or artwork. This PR only adds tooling and documentation; it does not change the current site behavior, UI, cart, carousel behavior, gallery behavior, or content.

Place raw images in one of these gitignored folders:

- `_incoming/events`
- `_incoming/gallery`
- `_incoming/menu`
- `_incoming/hero`

Preview the work first:

```bash
npm run optimize:images -- --dry-run
```

Generate optimized WebP files:

```bash
npm run optimize:images
```

Use `--force` only when intentionally replacing existing optimized files:

```bash
npm run optimize:images -- --force
```

Recommended output widths:

- events: 1200px wide
- gallery: 1600px wide
- menu: 1000px wide
- hero/poster: 1920px wide

The `_incoming/` folder is gitignored because raw images are usually heavy and are not needed by GitHub Pages. The optimized WebP files generated under `assets/` should be committed so the static site can serve them directly.
