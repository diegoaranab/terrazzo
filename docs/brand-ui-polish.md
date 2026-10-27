# Storefront brand and UX polish

Reviewed on 2026-10-27 from clean main `02bbbf61b671f514bffdeff2582e4b25f12d7945` on branch `phase-5c-brand-ui-polish`.

## Presentation

Charcoal and warm neutral surfaces now support the existing venue video and photography. Yellow marks primary actions, aqua marks navigation/links, and magenta is limited to experience metadata. Bebas Neue/Poppins remain; Space Mono is reserved for small labels. Removed the unused Anton font request. No invented logo, artwork, generated photography or new binary assets.

A typographic header provides native links to the menu, experiences, gallery and location. Mobile uses two compact rows without a JavaScript menu. The hero preserves the video, poster, autoplay/muted/loop/playsinline/metadata preload, original slogans and CTA destinations. Its neutral overlay protects text across the video.

Menu filters scroll horizontally on small screens, expose pressed state and retain all five categories. Cards use clearer names, descriptions, prices and 44px Add controls. Descriptions are no longer clamped. Experiences use the existing real photographs, quieter text links and two columns on tablets. Gallery framing and controls retain Flickity grouping, lazy loading, alt text and GLightbox. Contact uses a dark module with a titled map. Footer links and all existing social destinations remain.

Cart changes are presentation only: neutral surfaces, readable secondary text, larger controls, a full-width checkout and a Spanish close label. State, quantities, totals, persistence and checkout clearing/URL generation are unchanged.

## Media and performance

Filesystem bytes; bundle figures are the production builder's displayed decimal kB and transfer estimates. These are not initial network download measurements.

| Metric | Main | Polished branch |
| --- | ---: | ---: |
| Angular initial raw bundle | 553.37 kB | 560.41 kB |
| Angular estimated transfer | 108.34 kB | 109.63 kB |
| Hero | 11,101,855 B | 11,101,855 B |
| 33 menu WebPs | 2,700,498 B | 2,700,498 B |
| Largest menu WebP | 133,990 B | 133,990 B |
| Active unique hero/menu/events/gallery media | 17,398,317 B | 17,398,317 B |
| All copied assets, excluding source CSS | 20,170,085 B | 17,410,535 B |
| All source assets, including CSS and JSON | 20,179,497 B | 17,422,718 B |

The raw bundle increases 7.04 kB (1.27%); transfer increases 1.29 kB (1.19%). This is the added header/template and presentation CSS; no dependencies or budgets changed. The existing 500 kB warning remains, below the unchanged 1 MB error ceiling. Final uncompressed browser output totals 17,971,585 B, including copied assets, HTML, JS and CSS.

Removed `assets/comida1.jpg`–`comida5.jpg` and `assets/venue1.jpg`–`venue9.jpg`: **14 files / 2,759,550 B (2.63 MiB)** removed from the deployment artifact. Before deletion, repository source searches found no references; all active JSON paths were verified present. Active hero, menu and gallery media hashes match main exactly. Historical mentions in documentation are not runtime references. The cleanup does not claim a reduction in media already requested by the live page.

The [menu image refresh plan](menu-image-refresh-plan.md) lists all 33 IDs, names, current WebPs, categories and future actions. All start at `needs-visual-review`; no generic gallery photo is asserted to depict an exact product.

## Validation

Runtime: Node 24.22.1, npm 10.9.7, Angular CLI 22.2.4 / Angular 22.2.3. The host default is Node 22; validation used the existing temporary Node 24 installation. `npx ng version` also confirms npm 10.9.7 when subprocess access is permitted.

Passed:

- `npm ci` with the unchanged lockfile.
- `npm run validate:content` and `npm run validate:assets`.
- `npm run optimize:images -- --help` (no image generation/conversion).
- `npm run test:ci`: 11 Angular tests and 9 asset-validation tests.
- `npm run build` with unchanged budgets and the warning described above.
- `npm audit --omit=dev` and `npm audit`: zero vulnerabilities.
- `git diff --check`.

The sandbox initially prevented Chromium from launching and a Node test worker from completing. Browser QA and the complete passing suite were run with elevated execution; no application change was needed for those environment restrictions. The development server did not consistently observe filesystem changes, so final browser QA used the freshly built production output served under `/terrazzo/`.

## Browser and visual review

Chromium desktop (1440×1000) and touch/mobile emulation (390×844), plus explicit responsive checks at 320, 375, 390, 768, 1024, 1440 and 1920px:

- Before/after desktop/mobile screenshots reviewed, plus full-page screenshots at each target width. Real gallery photographs decoded before review. Final tablet experience cards reviewed after widening to two columns.
- Entire page scrolled; no horizontal document overflow. Navigation anchors remain below the sticky header after smooth scrolling settles. Hero CTAs wrap cleanly; filters stay on one scrollable row; cart fits narrow screens.
- Hero plays decoded H.264 at 896×504, muted, autoplay/loop/playsinline, metadata preload, original poster and copy. Evergreen ticker remains animated by default.
- All five filters and all 33 menu images checked, with WebP, lazy and async hints preserved.
- Add multiple products; increment/decrement; manual quantity; correct total; remove; persist after reload; drawer/FAB visibility; checkout URL intercepted and aborted. Correct phone, order code, itemized quantities and transfer/confirmation wording; no WhatsApp message sent.
- Menu/experience mobile Flickity, gallery controls and decoded GLightbox images work. Mobile→desktop→mobile resizing preserves gallery and rebuilds menu/events correctly.
- Contact text and URLs compare to main. Google Maps iframe renders actual map controls/tiles at its original 250px height; external loading may finish after the first full-page screenshot.
- No application exceptions, failed local assets or console errors in production desktop/mobile flows. The empty data favicon prevents the cosmetic root favicon request without inventing a logo.

## Accessibility and limits

Visible aqua focus outlines, skip link, main/navigation landmarks, one page h1 and section h2s, product-specific Add labels, pressed filter states, Spanish cart close label, and a map title. Keyboard Tab/Enter reaches and activates filters; Escape dismisses the drawer. Main actions, navigation, cart controls and footer social links have at least 44px target height. Existing Flickity dot behavior remains; no custom carousel keyboard system was introduced.

Text uses light neutrals on dark surfaces; CTA text uses near-black on yellow. Removed the conflicting Bootstrap dark-text classes from contact and explicitly set readable cart secondary text. With reduced motion, ticker content becomes a static wrapping list, duplicate copies are hidden, decorative animations/transitions stop and smooth scrolling is disabled. The required autoplay hero behavior is retained.

Limitations: Chromium emulation is not physical Safari/iOS/Android QA. Recheck autoplay on the owner's actual device and under low-power/data-saving settings. Current stylized menu imagery remains temporary. Third-party Google Fonts/Maps still depend on their services. This is a focused accessibility pass, not a formal assistive-technology audit. Owner confirmation of address/hours/promotions/reservation wording remains in [content verification](content-verification.md). No Admin, backend, payments, POS or AI work is included.
