import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { projects } from '../src/data/projects';
import { locales, messages } from '../src/data/messages';
import { site } from '../src/data/site';
import fs from 'node:fs';
import path from 'node:path';

declare global { interface Window { __copies: string[]; __rafFrames: number } }
const widths = [320, 375, 390, 414, 768, 820, 1024, 1280, 1440];
const prefix = (locale: string) => locale === 'en' ? '' : `${locale}/`;
const routes = ['', ...projects.map(project => `projects/${project.slug}/`)];

for (const locale of locales) {
  for (const route of routes) {
    test(`responsive ${locale}/${route || 'home'} at nine widths`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(prefix(locale) + route);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('#theme-toggle')).toBeVisible();
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.origin}${site.base}/${prefix(locale)}${route}`);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(4);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(async () => {
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          document.getAnimations().forEach(animation => { try { animation.finish(); } catch {} });
        });
        const result = await page.evaluate(() => {
          const back = document.querySelector('.back-link')?.getBoundingClientRect();
          const controls = document.querySelector('.floating-controls')!.getBoundingClientRect();
          const galleries = [...document.querySelectorAll<HTMLElement>('.cert-grid')].map(gallery => {
            gallery.scrollLeft = 0;
            const bounds = gallery.getBoundingClientRect();
            const clippedStart = gallery.firstElementChild!.getBoundingClientRect().left < bounds.left - 1;
            gallery.scrollLeft = gallery.scrollWidth;
            const clippedEnd = gallery.lastElementChild!.getBoundingClientRect().right > bounds.right + 1;
            gallery.scrollLeft = 0;
            return { clippedStart, clippedEnd };
          });
          return {
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            headerOverlap: !!back && back.right > controls.left && back.bottom > controls.top,
            galleries,
            smallControls: [...document.querySelectorAll<HTMLElement>('.control:not([hidden]), .icon-button:not([hidden])')].filter(element => element.getClientRects().length && !element.closest('dialog:not([open])')).some(element => element.getBoundingClientRect().height < 43.5),
          };
        });
        expect(result, `Layout at ${width}px`).toEqual({ overflow: false, headerOverlap: false, galleries: result.galleries.map(() => ({ clippedStart: false, clippedEnd: false })), smallControls: false });
      }
      expect(errors).toEqual([]);
    });
  }

  test(`language links preserve the project and work with native disclosure: ${locale}`, async ({ page }) => {
    await page.goto(`${prefix(locale)}projects/posture-alert/`);
    await expect(page.locator('.lang-option').first()).not.toBeVisible();
    await page.locator('#lang-toggle').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.lang-option').first()).toBeVisible();
    const destination = locale === 'ja' ? 'id' : 'ja';
    await page.locator(`.lang-option[hreflang="${destination}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/portfolio/${destination}/projects/posture-alert/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', destination);
    await expect(page.locator('h1')).toHaveText(messages['proj-pa-title'][destination]);
    await page.locator('.back-link').click();
    await expect(page).toHaveURL(new RegExp(`/portfolio/${destination}/$`));
  });

  test(`lightbox fits rotated certificates and supports gestures without visible controls: ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(prefix(locale));
    const trigger = page.locator('.proof-link').first();
    await trigger.click();
    await expect(page.locator('#lightbox-image')).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      const image = document.querySelector('#lightbox-image')!.getBoundingClientRect();
      const stage = document.querySelector('#lightbox-stage')!.getBoundingClientRect();
      return image.left >= stage.left - 1 && image.right <= stage.right + 1 && image.top >= stage.top - 1 && image.bottom <= stage.bottom + 1;
    })).toBe(true);
    await expect(page.locator('#lightbox button, #lightbox a, #lightbox output')).toHaveCount(0);
    await page.keyboard.press('+');
    await expect.poll(() => page.locator('#lightbox-media').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1.25);
    await page.keyboard.press('0');
    await expect.poll(() => page.locator('#lightbox-media').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1);
    await page.setViewportSize({ width: 820, height: 360 });
    await expect.poll(() => page.evaluate(() => {
      const image = document.querySelector('#lightbox-image')!.getBoundingClientRect();
      const stage = document.querySelector('#lightbox-stage')!.getBoundingClientRect();
      return image.width <= stage.width + 1 && image.height <= stage.height + 1;
    })).toBe(true);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test(`content and language navigation work without JavaScript: ${locale}`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4321/portfolio/${prefix(locale)}`);
    await expect(page.locator('main section')).toHaveCount(6);
    for (const section of await page.locator('main section').all()) await expect(section).toBeVisible();
    await page.locator('#lang-toggle').click();
    await page.locator('.lang-option[hreflang="ja"]').click();
    await expect(page.locator('h1')).toHaveText(messages['my-name'].ja);
    await context.close();
  });

  for (const theme of ['light', 'dark']) {
    for (const route of ['', 'projects/posture-alert/']) {
      test(`accessible ${theme} ${locale}/${route || 'home'}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
        await page.goto(prefix(locale) + route);
        await expect(page.locator('#theme-toggle')).toBeVisible();
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(scan.violations).toEqual([]);
      });
    }
  }
}

test('blocked storage does not interrupt theme or content', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    for (const kind of ['localStorage', 'sessionStorage']) Object.defineProperty(window, kind, { get() { throw new Error('Storage is unavailable'); } });
  });
  await page.goto('ja/');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('failed application script leaves translated content and native language links usable', async ({ page }) => {
  await page.route('**/*.js', route => route.abort());
  await page.goto('ja/');
  await expect(page.locator('h1')).toHaveText(messages['my-name'].ja);
  await expect(page.locator('#projects')).toBeVisible();
  await page.locator('#lang-toggle').click();
  await page.locator('.lang-option[hreflang="id"]').click();
  await expect(page.locator('#education h2')).toHaveText('Pendidikan');
});

test('English is the default regardless of browser locale', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'ja-JP' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/portfolio/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('repeated copy always uses the address and announces success', async ({ page }) => {
  await page.addInitScript(() => {
    window.__copies = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText(value: string) { window.__copies.push(value); return Promise.resolve(); } } });
  });
  await page.goto('id/');
  await page.locator('#copy-email').click();
  await page.locator('#copy-email').click();
  expect(await page.evaluate(() => window.__copies)).toEqual([site.email, site.email]);
  await expect(page.locator('#copy-status')).toHaveText(messages.copied.id);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('#copy-email')).toHaveText(site.email);
});

test('copy failure announces failure', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText() { return Promise.reject(new Error('Denied')); } } });
    document.execCommand = () => false;
  });
  await page.goto('ja/');
  await page.locator('#copy-email').click();
  await expect(page.locator('#copy-status')).toHaveText(messages['copy-error'].ja);
});

test('initial homepage images are small and do not request originals or external fonts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const images: Promise<number>[] = [], external: string[] = [], scripts: string[] = [];
  page.on('response', response => { if (response.request().resourceType() === 'image') images.push(response.body().then(body => body.length)); });
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4321/')) external.push(request.url()); if (request.resourceType() === 'script') scripts.push(request.url()); });
  await page.goto('');
  await page.waitForLoadState('networkidle');
  expect((await Promise.all(images)).reduce((a, b) => a + b, 0)).toBeLessThan(200_000);
  expect(external).toEqual([]);
  expect(scripts.some(url => url.includes('skills-physics'))).toBe(false);
  await expect(page.locator('.media-portrait img:not(.media-preview)')).toHaveAttribute('loading', 'eager');
  await expect(page.locator('.media-portrait img:not(.media-preview)')).toHaveAttribute('srcset', /\.webp/);
});

test('skills sleep without animation frames, survive resizing, and honor reduced motion changes', async ({ page }) => {
  await page.addInitScript(() => {
    window.__rafFrames = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = callback => { window.__rafFrames++; return original.call(window, callback); };
  });
  await page.goto('');
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.__rafFrames);
    await page.waitForTimeout(200);
    return (await page.evaluate(() => window.__rafFrames)) - before;
  }).toBe(0);
  const pill = await page.locator('.skill-pill').first().boundingBox();
  await page.mouse.move(pill!.x + pill!.width / 2, pill!.y + pill!.height / 2);
  await page.mouse.down();
  await page.mouse.move(pill!.x + pill!.width / 2 + 110, pill!.y + pill!.height / 2 + 30, { steps: 10 });
  await page.mouse.up();
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.__rafFrames);
    await page.waitForTimeout(200);
    return (await page.evaluate(() => window.__rafFrames)) - before;
  }, { timeout: 10_000 }).toBe(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect.poll(() => page.locator('#skills-container').evaluate(container => {
    const bounds = container.getBoundingClientRect();
    return [...container.children].filter(pill => { const box = pill.getBoundingClientRect(); return box.left < bounds.left - 1 || box.right > bounds.right + 1 || box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1; }).length;
  })).toBe(0);
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#skills-container')).not.toHaveClass(/physics-active/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
});

test('reduced motion never downloads the physics enhancement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const scripts: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()); });
  await page.goto('');
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  expect(scripts.some(url => url.includes('skills-physics'))).toBe(false);
  await expect(page.locator('#skills-container')).not.toHaveClass(/physics-active/);
});

test('all generated internal links, images, scripts, and language alternatives resolve', () => {
  const root = path.resolve('dist');
  const files = fs.readdirSync(root, { recursive: true }) as string[];
  const missing: string[] = [];
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;', '&');
      const url = value.startsWith(site.origin) ? new URL(value).pathname : value;
      if (!url.startsWith(`${site.base}/`)) continue;
      const target = path.join(root, decodeURIComponent(url.slice(site.base.length)).split(/[?#]/)[0]);
      if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) missing.push(`${file}: ${url}`);
    }
  }
  expect(missing).toEqual([]);
  expect(files.filter(file => file.endsWith('.html'))).toHaveLength(22);
});

test('image loading failures dismiss with Escape and restore focus without extra controls', async ({ page }) => {
  await page.goto('ja/');
  const trigger = page.locator('.proof-link').first();
  const href = await trigger.getAttribute('href');
  await page.route(`**${href}`, route => route.abort());
  await trigger.click();
  await expect(page.locator('#lightbox-status')).toHaveText(messages['image-error'].ja);
  await expect(page.locator('#lightbox button, #lightbox a')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
