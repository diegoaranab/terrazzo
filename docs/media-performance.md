# Storefront media refresh

Measured from clean `main` at `7745b2f31af83b5f5476f21d57b535be585e665e` on 2026-10-27. Asset figures are exact filesystem bytes; Angular figures are the production builder's displayed decimal kB and transfer estimates, not measured network transfer.

| Metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Hero MP4 | 31,024,465 B (29.59 MiB) | 11,101,855 B (10.59 MiB) | 64.22% |
| 33 menu images | 16,182,740 B (15.43 MiB) | 2,700,498 B (2.58 MiB) | 83.31% |
| Largest menu image | 682,466 B | 133,990 B | 80.37% |
| Dedicated event media | 1,408,574 B | 0 B | 100% |
| Event-referenced media | 1,408,574 B | 1,366,592 B (shared gallery files) | 2.98% |
| Gallery media | 3,595,964 B | 3,595,964 B | 0% |
| Relevant unique media total | 52,211,743 B | 17,398,317 B | 66.68% |
| Angular initial bundle, raw | 613.56 kB | 553.37 kB | 9.81% |
| Angular estimated transfer | 123.84 kB | 108.34 kB | 12.52% |

The unique total includes hero + referenced menu + event + gallery files, counting shared paths once. It is not the initial page load or compressed Pages artifact size. All six obsolete event posters were unreferenced before deletion; five experience cards reuse existing, unmodified gallery photography. The full gallery remains intact. The largest old menu image was `mango-habanero.png`; the largest new one is `alitas-lemon-pepper.webp`.

## Encoding and quality

Menu: Sharp 0.35.5, autorotate, width 1000 with `withoutEnlargement`, WebP quality 82, default metadata stripping. No generated imagery, recropping or product-data changes.

Hero inspection with FFprobe:

| Property | Original | Optimized |
| --- | --- | --- |
| Codec | H.264 High, level 5.0 | H.264 High, level 3.1 |
| Dimensions / aspect | 1280×720 / 16:9 | 896×504 / 16:9 |
| Video duration | 123.924007 s | 123.924007 s |
| Frames / frame rate | 3714 / 29.97 fps | 3714 / 29.97 fps |
| Audio | HE-AAC stereo, 48 kHz, 47,959 bit/s | None |
| Video bitrate | 1,948,608 bit/s | 713,878 bit/s |
| Container bitrate | 2,001,078 bit/s | 716,687 bit/s |
| Container duration | 124.031 s | 123.924 s |
| Pixel format | yuv420p | yuv420p |

The 0.107-second container difference is the removed audio tail; every original video frame and its timeline is preserved. No crop, upscale, speed change or scene removal. The output fully decodes with no FFmpeg errors; its top-level atoms are `ftyp`, `moov`, `free`, `mdat` (fast-start).

Reproduction with FFmpeg 7 static tooling (temporary tooling, no new project dependency):

```bash
ffmpeg -i original-hero.mp4 -map 0:v:0 -an -vf scale=896:504 \
  -c:v libx264 -preset slow -crf 33 -pix_fmt yuv420p \
  -profile:v high -level:v 3.1 -movflags +faststart -map_metadata -1 \
  -threads 4 optimized-hero.mp4
```

The preferred 8 MiB target was not reached. A 720p CRF 28 candidate remained 30,793,360 B; 960×540 CRF 30 was 16,510,209 B; 768×432 CRF 32 was 9,594,712 B and visibly softer. The selected 896×504 version balances background detail and a 64% saving; tighter compression was not forced to meet the target. Review on the owner's recording device before the final demo. Angular explicitly binds the runtime `muted` property as well as retaining the HTML attribute, so policy-compliant autoplay does not depend on static attribute handling. Hero preload is now `metadata`; autoplay can still cause the browser to fetch the video. Poster/fallback remain eager. Menu/events use native lazy loading and async decoding; gallery retains both hints and existing ratio containers.

## Guardrails and tooling

`npm run validate:assets` enforces a non-empty hero of at most **12 MiB**, menu paths under `assets/menu/*.webp`, existing non-empty menu files, **300 KiB per menu image**, and **5 MiB total unique menu payload**. The hero ceiling allows modest headroom over the selected 10.59 MiB encode. Content validation owns product/schema checks and also rejects legacy menu PNG references. Both validation and Pages build workflows enforce budgets. Nine fixture tests cover valid/shared assets, legacy/traversal paths, missing/empty files, per-file limits and aggregate limits.

The original manifest requested Sharp ^0.34.3 (lockfile resolved 0.34.5). Sharp stable 0.35.5 was verified through npm's `latest` tag and [upstream releases](https://github.com/lovell/sharp/releases/tag/v0.35.5); `next` was a release candidate and was not used. The lockfile was updated and installed with `npm ci`. Both `npm audit --omit=dev` and `npm audit` report **0 vulnerabilities** (0 info, low, moderate, high or critical). Validation runtime: Node 24.22.1, npm 10.9.7, Angular CLI 22.2.4 / Angular 22.2.3.

Bootstrap now imports only offcanvas JavaScript. The non-blocking 500 kB Angular warning remains (553.37 kB); no budget was relaxed. Visual redesign/media regeneration is PR #24; Admin, backend, payments, POS and AI remain later roadmap phases.

## Functional validation

Passed: `npm ci`, `validate:content`, `validate:assets`, optimizer `--help`, `test:ci` (11 Angular/Vitest tests + 9 Node asset fixtures), production build, both npm audits, and `git diff --check`. The final bundle includes the explicit muted property binding.

Chromium desktop (1440×1000) and touch/mobile emulation (390×844) passed against both the Angular development server and a static production build served under `/terrazzo/`:

- Hero poster available, H.264 decoded at 896×504, autoplay advancing without interaction, runtime muted, loop/playsinline/metadata preload retained; hero copy readable and ticker animated.
- All five categories, 33 products and all menu images loaded; native lazy/async hints verified.
- Cart add/increment/decrement, totals, reload persistence, drawer and hidden FAB behavior.
- Mobile menu/events/gallery carousel navigation; gallery lightbox opens decoded images.
- Mobile-to-desktop resize removes menu/events Flickity wrappers and preserves the gallery instance.
- Contact/address/hours/phone unchanged; map iframe renders at its existing dimensions.
- WhatsApp checkout URL intercepted and aborted: correct phone, order code, quantities, itemized total. No message sent.
- No application exceptions or failed content assets. Desktop's automatic `/favicon.ico` request returns 404; mobile console was clean.

All 33 image outputs were decoded and checked against original dimensions: no enlargement, width at most 1000px, aspect ratios preserved. Representative burger, wings and cocktail images and desktop/mobile hero rendering were visually reviewed. Full hero decode and MP4 atom checks passed. Product fields other than `img` compare identically with starting `main`; gallery JSON, gallery files, contact template, phone/order logic and stylesheet remain unchanged.

These checks use Chromium mobile emulation, not physical iOS/Android devices. Recheck on the actual recording device, especially Safari/low-power autoplay, and resolve the [owner verification items](content-verification.md) before final recording/production launch.
