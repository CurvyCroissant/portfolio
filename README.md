# Aaron Nathanael — Portfolio

A static, frontend-only portfolio built with Astro, TypeScript, and CSS. The design uses system fonts, a monochrome palette, rounded surfaces, and light/dark appearance.

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
- The language picker uses native `<details>`. The terminal and image viewer use native modal `<dialog>` elements, with explicit close buttons, labeled controls, background focus isolation, and focus restoration.
- The image viewer supports wheel zoom, pinch zoom, drag-to-pan, rotation, and keyboard `+`, `-`, and `0`. Rotated images are fitted and bounded against the visible stage.
- Open the terminal with its button or `/`. Commands: `help`, `about`, `education`, `experience`, `achievements`, `skills`, `projects`, `contact`, `clear`, and `exit`. Input is always handled as plain text.
- Email is a normal `mailto:` link, with a separate copy button and localized status feedback.
- Skills remain a readable static list first. Matter.js loads only near that section, when reduced motion is off. Dragging wakes the simulation; its animation loop stops when the pills sleep, leave the viewport, or the page is hidden. The layout rebuilds on width changes. Touch gestures retain vertical page scrolling.
- Reduced motion disables decorative reveals, transitions, and physics. Content is never hidden while waiting for animation code.

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
| `src/scripts/` | Appearance, copying, terminal, image viewer, and lazy physics |
| `src/styles/global.css` | Shared colors, typography, spacing, breakpoints, and motion preferences |
| `public/favicon.svg`, `public/social-preview.svg` | Editable brand artwork; PNG versions are generated during `prebuild` |

`src/pages/[...path].astro` generates the home and six project pages in all three languages from the same templates. Changing a shared project or timeline record updates its page and terminal summary together. `astro.config.mjs` uses the origin and base path from `src/data/site.ts`.

## Validation and deployment

Browser checks cover every page and language at 320, 375, 390, 414, 768, 820, 1024, 1280, and 1440 pixels. They also cover gallery reachability, header overlap, no-JavaScript and failed-script behavior, blocked storage, dialog focus, rotated images, repeated copying, reduced motion, idle physics, image loading, and light/dark WCAG accessibility checks.

Pull requests run checks, a production build, and Chromium tests. Pushing to `main` runs the same checks before deploying the static output to GitHub Pages. A failed check prevents deployment. The build includes a sitemap, social preview metadata, favicon, Apple touch icon, and a custom 404 page.

The automated suite uses Chromium. Real iOS Safari testing remains useful for virtual keyboard, touch, and browser chrome behavior. Core Web Vitals should be measured on the deployed site; the code does not claim a guaranteed CLS or performance score.

## License

© 2026 Aaron Nathanael. All rights reserved.
