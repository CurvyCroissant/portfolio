# Aaron Nathanael — Portfolio

A minimalist, high-performance personal portfolio built with Astro. Designed with a focus on clean typography, strict structural alignment, and zero visual clutter.

## Overview

This static site showcases my professional experience, academic background, and technical projects. It is engineered for maximum speed and efficiency, relying on vanilla web technologies and component-based routing.

## Key Features

* **Zero-FOUC Theming:** Light and Dark modes toggle instantly. An inline head-script reads the OS-level `prefers-color-scheme` to prevent the Flash of Unstyled Content (FOUC) before the DOM paints, falling back safely to Light Mode. User preferences are saved locally via `localStorage`.
* **Native i18n:** Built-in support for English, Bahasa Indonesia, and Japanese. The site auto-detects browser language on the first load and swaps text dynamically. It uses cached DOM queries and anti-FOUT CSS styling to ensure smooth, blink-free text translations.
* **Interactive 2D Physics:** The "Technical Skills" section acts as a zero-gravity environment powered by `matter.js`. To preserve mobile battery life and CPU, the physics engine puts stationary elements to sleep, pauses when off-screen, and completely disables itself if the device has `prefers-reduced-motion` enabled.
* **Hidden Terminal:** A fully interactive terminal emulator hidden in the UI (accessible via the toggle or by pressing `/`). It mimics a classic command prompt, accepting queries like `help`, `projects`, and `contact` to fetch localized data.
* **Hardware-Accelerated Lightbox:** Custom modal pop-ups for high-res images and certificates. Built with FLIP animations to expand seamlessly from the thumbnail's exact coordinates using lag-free `translate3d` transforms.
* **Layout Stability:** Enforces strict CSS aspect ratios to reserve space for lazy-loaded images, completely eliminating Cumulative Layout Shift (CLS) as the user scrolls.
* **Scroll Restoration:** Session storage tracking guarantees precise vertical scroll positioning when navigating back from project detail pages.

## Development Commands

All commands are executed from the root directory:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the local development server at `localhost:4321` |
| `npm run build` | Compiles the production site into the `./dist/` directory |
| `npm run preview` | Previews the local production build |

## Technical Stack

* **Framework:** Astro
* **Styling:** Pure CSS (CSS Variables, Flexbox, CSS Grid)
* **Interactivity:** Vanilla JavaScript
* **Physics Engine:** Matter.js (fetched via CDN, loaded strictly deferred)
* **Typography:** Inter & Montserrat (Google Fonts)

## License

(c) 2026 Aaron Nathanael. All rights reserved.