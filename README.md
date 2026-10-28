# Aaron Nathanael — Portfolio

A static, frontend-only portfolio built with Astro, TypeScript, and CSS. The Liquid Glass design uses floating, luminous controls over pastel ambient fields and quieter content materials, with system typography and coordinated light/dark appearances.

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
- Appearance follows the system until a manual light/dark choice is saved. Storage failures do not prevent the site from working. The browser theme color follows the selected appearance.
- The image viewer shows only the media over a dimmed, blurred backdrop. It supports wheel/pinch zoom, drag-to-pan, double-click zoom/reset, and keyboard `+`, `-`, and `0`. Certificates with stored rotation are fitted to the full viewport. Opening and closing animate to/from the source over 700 ms; page transitions use 900 ms, reveals 1000 ms, material colors 800 ms, and hover/press release 620 ms. Scripted motion reads the same CSS tokens, including production CSS time-unit normalization.
- Scroll positions are saved per page and per history entry, including a content anchor for layout changes. Back, Forward, refresh, Home, and revisiting a page restore the saved location before content becomes visible. Storage failure falls back to memory for same-tab navigation.
- Each mounted page owns its listeners, observers, animations, and physics. Navigation disposes them before mounting the next page.
- Skills shuffle on each page initialization. Dragging prevents native text selection, including on WebKit. Dark mode uses diffuse ambient elevation shadows without outline rings.
- The entire footer email row copies the address to the clipboard and announces localized feedback. It has a mail icon and no separate copy icon or mailto action. Repository links reuse the footer’s GitHub icon.
- Skills remain a readable static list first. Matter.js loads only near that section, when reduced motion is off. Dragging wakes neighbouring pills; small physics steps and a bounded spring prevent cursor jumps from tunnelling through them. The animation loop stops when pills sleep, leave the viewport, or the page is hidden. The layout rebuilds on width changes. Pills capture touch drags; the surrounding space retains vertical page scrolling.
- Reduced motion disables decorative reveals, transitions, and physics. Content is never hidden while waiting for animation code.
- Native View Transitions blend the old and incoming viewports while preserving fixed navigation. Older browsers use a content-only spatial fallback. Both paths cancel safely, respect reduced motion and preserve history and scroll restoration.
- Hover light follows the pointer, and touch press feedback releases smoothly. Language menus materialize from their trigger and reverse their current animation when interrupted; closed/closing panels stay inert. Selection/focus outlines are absent; keyboard focus uses material, elevation and underlined labels.
- Reduced transparency/increased contrast preferences and browsers without backdrop filtering receive solid, legible material fallbacks. Pointer lighting schedules work only on input and stays idle at rest.

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
| `npm run test:ui` | Run Chromium layout, interaction, loading, and accessibility regressions |

Install Chromium once before running browser tests:

```sh
npx playwright install chromium
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
| `src/styles/global.css` | Shared colors, typography, spacing, breakpoints, and motion preferences |
| `public/favicon.svg`, `public/social-preview.svg` | Editable brand artwork; PNG versions are generated during `prebuild` |


## Validation and deployment

Browser checks cover every page and language at 320, 375, 390, 414, 768, 820, 1024, 1280, and 1440 pixels. They also cover gallery reachability, header overlap, no-JavaScript and failed-script behavior, blocked storage, dialog focus, rotated images, repeated copying, reduced motion, idle physics, image loading, and light/dark WCAG accessibility checks. Navigation regressions cover per-entry scroll memory, pending requests, Back/Forward, retries, and repeated visits without retained handlers. Translation checks validate every message key and interpolation variable.

Pull requests run checks, a production build, and Chromium tests. Pushing to `main` runs the same checks before deploying the static output to GitHub Pages. A failed check prevents deployment. The build includes a sitemap, social preview metadata, favicon, Apple touch icon, and a custom 404 page.

The automated suite uses Chromium. Real iOS Safari testing remains useful for virtual keyboard, touch, and browser chrome behavior. Core Web Vitals should be measured on the deployed site; the code does not claim a guaranteed CLS or performance score.

## License

© 2026 Aaron Nathanael. All rights reserved.

## Interaction and performance

- Hoverable native language dropdown with tap, keyboard and Escape support.
- In-place English/Indonesian/Japanese text wipes retain DOM nodes, exact scroll and gallery state. Technical Skills remain English.
- Pastel light/slate dark palettes transition from outer surfaces toward inner content.
- Spatial page transitions; horizontal-only gallery overflow preserves vertical page gestures.
- Tiny blurred image previews, eager hero image, lazy lower-page images, on-intent viewer module and near-viewport physics.
- Contact rows share equal vertical dimensions across responsive layouts.
- See AGENTS.md for the maintained project requirements.
