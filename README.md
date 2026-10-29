# Aaron Nathanael — Portfolio

A static, frontend-only portfolio built with Astro, TypeScript, and CSS. The Liquid Glass design uses floating, luminous controls over monochrome ambient fields and quieter content materials, with system typography and coordinated light/dark appearances.

## Languages and navigation

Every page is rendered in full at build time. English is the default; browser language does not trigger a redirect.

| Language | Home |
| --- | --- |
| English | `/portfolio/` |
| Bahasa Indonesia | `/portfolio/id/` |
| 日本語 | `/portfolio/ja/` |

Language links preserve the current project. Each page includes localized titles, descriptions, accessible labels, canonical URLs, and alternate language links. URLs retain the selected language during navigation and can be bookmarked or shared directly. Reading content and changing languages work without JavaScript.

## Performance and interactions

- Astro generates static HTML with no UI framework runtime or backend.
- Local images are processed at build time into responsive WebP thumbnails. The portrait loads eagerly with high priority; gallery thumbnails load lazily. Full-resolution originals are requested when opened, and remain available through normal image links without JavaScript.
- JavaScript is bundled, minified, and given hashed filenames. Fonts and scripts require no third-party CDN requests.
- Light is the global default; only an explicit light/dark choice is saved, independent of OS theme. Storage failures do not prevent the site from working. The browser theme color follows the selected appearance.
- The image viewer shows only the media over a dimmed, blurred backdrop. It supports wheel/pinch zoom, drag-to-pan, double-click zoom/reset, and keyboard `+`, `-`, and `0`. Certificates with stored rotation are fitted to the full viewport. Opening and closing animate to/from the source over 700 ms; page transitions use 900 ms, reveals 1000 ms, material colors 800 ms, and hover/press release 620 ms. Scripted motion reads the same CSS tokens, including production CSS time-unit normalization.
- Scroll positions are saved per page and per history entry, including a content anchor for layout changes. Back, Forward, refresh, Home, and revisiting a page restore the saved location before content becomes visible. Storage failure falls back to memory for same-tab navigation.
- Each mounted page owns its listeners, observers, animations, and physics. Navigation disposes them before mounting the next page.
- Skills shuffle on each page initialization. Dragging prevents native text selection, including on WebKit. Dark mode uses diffuse ambient elevation shadows without outline rings.
- The entire footer email row copies the address to the clipboard and announces localized feedback. It has a mail icon and no separate copy icon or mailto action. Repository links reuse the footer’s GitHub icon.
- Skills remain a readable static list first. Matter.js loads only near that section. Dragging wakes neighbouring pills; small physics steps and a bounded spring prevent cursor jumps from tunnelling through them. The animation loop stops when pills sleep, leave the viewport, or the page is hidden. The layout rebuilds on width changes. Pills capture touch drags; the surrounding space retains vertical page scrolling.
- One global full-motion glass setup runs across devices and OS preferences. There are no motion/visual-settings controls, and obsolete saved motion choices have no effect. Theme and language controls remain. Menus slide down from their toggle inside a clipping track and retract without fading or scaling. Scroll reveals unfold the glass in perspective with a short reflection sweep; reflection layers are removed after completion or interruption.
- Native View Transitions blend the old and incoming viewports while preserving fixed navigation. Older browsers use a content-only spatial fallback. Both paths cancel safely and preserve history and scroll restoration.
- A dedicated page environment paints ambient light and cursor illumination above the page background. Translucent materials have optical edges and moving reflections painted directly into their backgrounds. Content blur activates during interaction; action blur activates near visibility, while navigation and the main skills material keep their glass eager. Offscreen action blur layers are released. Input schedules one frame at a time and stops at rest. Touch press feedback releases smoothly. Language menus materialize from their trigger, stay within the viewport and reverse their current animation when interrupted; closed/closing panels stay inert. Selection/focus outlines are absent; keyboard focus uses material, elevation and movement without underlines or rings.
- Browsers without backdrop filtering receive solid, legible material fallbacks. OS contrast/transparency preferences do not change the global design. Pointer lighting schedules work only on input and stays idle at rest.

The material hierarchy follows [Apple’s Materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials) and [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/), implemented with web-native CSS and progressive enhancement.

## Development

Use Node.js 22.12 or later. CI uses Node.js 24.

```sh
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro's development server |
| `npm run check` | Check Astro and TypeScript |
| `npm run build` | Generate brand PNGs and build the static site into `dist/` |
| `npm run preview` | Serve the production build at `http://127.0.0.1:4321/portfolio/` |
| `npm run test:ui` | Run Chromium regressions and Chromium/WebKit material and motion checks |

Install the browser engines once before running browser tests:

```sh
npx playwright install chromium webkit
npm run build
npm run test:ui
```

## Editing content

| Location | Edit here |
| --- | --- |
| `src/data/site.ts` | Contact links, shared facts, education, experience, achievements, and skills |
| `src/data/projects.ts` | Project slugs, technologies, repositories, and gallery images |
| `src/data/messages.ts` | English, Indonesian, and Japanese copy; all keys require all three languages |
| `src/assets/img/` | Original photos, certificates, and screenshots |
| `src/components/` | Shared home, project, timeline, gallery, footer, and icon components |
| `src/layouts/Layout.astro` | Metadata, language controls, and dialogs |
| `src/styles/global.css` | Shared colors, typography, spacing, breakpoints, and motion tokens |
| `public/favicon.svg`, `public/social-preview.svg` | Editable brand artwork; PNG versions are generated during `prebuild` |


## Validation and deployment

Browser checks cover every page and language at 320, 375, 390, 414, 768, 820, 1024, 1280, and 1440 pixels. They also cover gallery reachability, header overlap, no-JavaScript and failed-script behavior, blocked storage, dialog focus, rotated images, repeated copying, OS-independent rendering, idle physics, image loading, and light/dark WCAG accessibility checks. Navigation regressions cover per-entry scroll memory, pending requests, Back/Forward, retries, and repeated visits without retained handlers. Translation checks validate every message key and interpolation variable.

Pull requests run checks, a production build, and browser tests. Pushing to `main` runs the same checks before deploying the static output to GitHub Pages. A failed check prevents deployment. The build includes a sitemap, social preview metadata, favicon, Apple touch icon, and a custom 404 page.

The complete regression suite uses Chromium. Focused material and motion checks also run in WebKit: actual background pixels, moving surface reflections and text contrast under illumination in both themes, equivalent behavior under opposing OS preferences, intermediate theme/language/menu/viewer frames and narrow touch layouts. Chromium also verifies actual backdrop blur against a striped background. Linux WPE does not paint that blur in our test environment, including a minimal independent scene, so that single pixel check is skipped in WebKit; physical Safari verification remains necessary for blur, virtual keyboard, touch and browser chrome behavior. Core Web Vitals should be measured on the deployed site; the code does not claim a guaranteed CLS or performance score.

## License

© 2026 Aaron Nathanael. All rights reserved.

## Interaction and performance

- Hoverable native language dropdown with tap, keyboard and Escape support.
- In-place English/Indonesian/Japanese text wipes retain DOM nodes and gallery state; vertical positions, heights and label widths resize together, and shorter pages clamp to their natural bottom. Technical Skills remain English.
- Monochrome light/dark palettes transition together on one 800 ms clock, including background, surfaces, headings and all text/icons. Dark mode uses near-black glass with silver highlights; light mode retains white glass with graphite typography. Interactive labels brighten and gain optical depth on hover/focus without shifting layout. Image-only popup actions omit navigation arrows.
- Spatial page transitions; horizontal-only gallery overflow preserves vertical page gestures.
- Tiny blurred image previews, eager hero image, lazy lower-page images, on-intent viewer module and near-viewport physics.
- Contact icon/text groups are centered in equal-height rows across responsive layouts. Root overscroll is disabled while native document scrolling remains available.
- See AGENTS.md for the maintained project requirements.
