import { test, expect } from '@playwright/test';

for (const [kind, route, selector] of [
  ['portrait', '', '.media-portrait'],
  ['certificate', '', '.cert-card .media-frame'],
  ['screenshot', 'projects/posture-alert/', '.cert-card .media-frame'],
  ['chart', 'projects/crop-yield-predictor/', '.cert-card .media-frame'],
]) {
  test(`${kind} uses a blurred preview until decoded, without layout shift`, async ({ page }) => {
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*.webp', async route => { await pending; await route.continue(); });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const frame = page.locator(selector).first();
    await frame.scrollIntoViewIfNeeded();
    await expect(frame).toHaveAttribute('data-media-state', 'loading');
    const preview = frame.locator('.media-preview');
    await expect(preview).toBeVisible();
    expect(await preview.evaluate(element => getComputedStyle(element).filter)).toBe('blur(12px)');
    const before = await frame.boundingBox();
    const placeholder = await preview.boundingBox();
    expect(placeholder!.width).toBeCloseTo(before!.width * 1.08, 0);
    expect(placeholder!.height).toBeCloseTo(before!.height * 1.08, 0);
    release();
    await expect(frame).toHaveAttribute('data-media-state', 'ready');
    await expect(frame).toHaveAttribute('aria-busy', 'false');
    const after = await frame.boundingBox();
    expect(after!.width).toBeCloseTo(before!.width, 0);
    expect(after!.height).toBeCloseTo(before!.height, 0);
    await expect(preview).not.toBeVisible();
  });
}

test('a failed thumbnail replaces its preview and keeps the original media link usable', async ({ page }) => {
  await page.route('**/*.webp', route => route.abort());
  await page.goto('');
  const frame = page.locator('.media-portrait');
  await expect(frame).toHaveAttribute('data-media-state', 'error');
  await expect(frame.locator('.media-error')).toBeVisible();
  await page.locator('.portrait-link').click();
  await expect(page.locator('#lightbox-media')).toHaveAttribute('data-media-state', 'ready');
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toBeVisible();
});

test('the lightbox opens and closes over 400ms and has no visible controls', async ({ page }) => {
  await page.goto('');
  await page.locator('.portrait-link').click();
  const media = page.locator('#lightbox-media');
  expect(await media.evaluate(element => element.getAnimations().map(animation => animation.effect?.getTiming().duration))).toContain(400);
  await expect(media).toHaveAttribute('data-media-state', 'ready');
  await expect(page.locator('#lightbox button, #lightbox a, #lightbox output')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).toHaveAttribute('data-closing', '');
  expect(await media.evaluate(element => element.getAnimations().some(animation => animation.effect?.getTiming().duration === 400))).toBe(true);
  await expect(page.locator('#lightbox')).not.toBeVisible();
  await expect(page.locator('.portrait-link')).toBeFocused();
});

test('the blurred lightbox preview remains dismissible while loading and late responses do not reopen it', async ({ page }) => {
  await page.goto('');
  const trigger = page.locator('.proof-link').first();
  const href = await trigger.getAttribute('href');
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route(`**${href}`, async route => { await pending; await route.continue(); });
  await trigger.click();
  await expect(page.locator('#lightbox-media')).toHaveAttribute('data-media-state', 'loading');
  await expect(page.locator('#lightbox-loader')).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(page.locator('#lightbox')).not.toBeVisible();
  release();
  await expect(page.locator('#lightbox')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('wheel zoom, drag, double-click reset, and background dismissal work without a toolbar', async ({ page }) => {
  await page.goto('');
  await page.locator('.portrait-link').click();
  await expect(page.locator('#lightbox-media')).toHaveAttribute('data-media-state', 'ready');
  await page.keyboard.press('+');
  await expect.poll(() => page.locator('#lightbox-media').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1.25);
  await page.locator('#lightbox-image').dblclick();
  await expect.poll(() => page.locator('#lightbox-media').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1);
  await page.mouse.move(640, 350);
  await page.mouse.wheel(0, -100);
  await expect.poll(() => page.locator('#lightbox-media').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1.15);
  await page.mouse.click(4, 4);
  await expect(page.locator('#lightbox')).not.toBeVisible();
});

test('refresh and return from a project restore the scroll position before any visible top frame', async ({ page }) => {
  await page.addInitScript(() => {
    const positions: number[] = [];
    Object.assign(window, { __visiblePositions: positions });
    const sample = () => {
      const home = document.querySelector<HTMLElement>('[data-page="home"]');
      if (home && getComputedStyle(home).visibility === 'visible' && !document.documentElement.hasAttribute('data-navigating')) positions.push(scrollY);
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto('');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const top = await page.evaluate(() => scrollY);
  await page.reload();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(top, 0);
  expect(await page.evaluate(() => (window as unknown as { __visiblePositions: number[] }).__visiblePositions.every(y => Math.abs(y - scrollY) < 3))).toBe(true);
  await page.locator('.project-card').first().click();
  await page.locator('.back-link').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  expect(await page.evaluate(() => (window as unknown as { __visiblePositions: number[] }).__visiblePositions.every(y => y > 1000))).toBe(true);
});

test('skills keep their readable pills during the deferred enhancement and stay usable if it fails', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/skills-physics*.js', async route => { await pending; await route.abort(); });
  await page.goto('');
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveAttribute('aria-busy', 'true');
  expect(await page.locator('.skill-pill').first().evaluate(element => getComputedStyle(element).filter)).toBe('none');
  release();
  await expect(page.locator('#skills-container')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('#skills-container')).not.toHaveClass(/physics-active/);
  await expect(page.locator('#skills-container')).toContainText('Python');
});

for (const width of [375, 1280]) {
  test(`fast pill dragging preserves solid collisions and walls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('');
    const container = page.locator('#skills-container');
    await container.scrollIntoViewIfNeeded();
    await expect(container).toHaveClass(/physics-active/);
    const box = (await container.boundingBox())!;
    const pill = (await page.locator('.skill-pill').first().boundingBox())!;
    // Observe rendered capsule geometry throughout the drag, including between pointer events.
    const samples = page.evaluate(() => new Promise<{ overlap: number; escaped: number }>(resolve => {
      let overlap = 0, escaped = 0, frames = 0;
      const sample = () => {
        const outer = document.querySelector('#skills-container')!.getBoundingClientRect();
        const boxes = [...document.querySelectorAll('.skill-pill')].map(element => element.getBoundingClientRect());
        for (let i = 0; i < boxes.length; i++) {
          const a = boxes[i];
          escaped = Math.max(escaped, outer.left - a.left, a.right - outer.right, outer.top - a.top, a.bottom - outer.bottom);
          for (const b of boxes.slice(i + 1)) {
            const dx = Math.max(0, Math.abs(a.x + a.width / 2 - b.x - b.width / 2) - (a.width - a.height + b.width - b.height) / 2);
            const dy = Math.abs(a.y + a.height / 2 - b.y - b.height / 2);
            overlap = Math.max(overlap, (a.height + b.height) / 2 - Math.hypot(dx, dy));
          }
        }
        if (++frames < 150) requestAnimationFrame(sample); else resolve({ overlap, escaped });
      };
      requestAnimationFrame(sample);
    }));
    await page.mouse.move(pill.x + pill.width / 2, pill.y + pill.height / 2);
    await page.mouse.down();
    for (const [x, y] of [[.95, .5], [.05, .5], [.5, .05], [.5, .95], [1.5, .5], [-.5, .5], [.8, .2], [.2, .8]]) {
      await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
      await page.waitForTimeout(150);
    }
    await page.mouse.up();
    const result = await samples;
    expect(result.overlap).toBeLessThan(3);
    expect(result.escaped).toBeLessThan(2);
  });
}

test('reduced motion disables dialog animation while preserving image viewing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*.webp', async route => { await pending; await route.continue(); });
  await page.goto('', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.media-portrait .media-preview')).toBeVisible();
  release();
  await page.locator('.portrait-link').click();
  await expect(page.locator('#lightbox-media')).toHaveAttribute('data-media-state', 'ready');
  expect(await page.locator('#lightbox-media').evaluate(element => element.getAnimations().length)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toBeVisible();
});

test.describe('touch interactions', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('pinch zoom and reset work in the chrome-free viewer', async ({ page, context }) => {
    await page.goto('');
    await page.locator('.portrait-link').tap();
    const media = page.locator('#lightbox-media');
    await expect(media).toHaveAttribute('data-media-state', 'ready');
    await expect.poll(() => media.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1);
    const client = await context.newCDPSession(page);
    const box = (await media.boundingBox())!;
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const fingers = (distance: number) => [{ x: x - distance, y, id: 1 }, { x: x + distance, y, id: 2 }];
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers(35) });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: fingers(70) });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => media.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeGreaterThan(1.5);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers(70) });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: fingers(25) });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => media.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1);
    await page.touchscreen.tap(4, 4);
    await expect(page.locator('#lightbox')).not.toBeVisible();
  });

  test('touch dragging moves pills without scrolling the page', async ({ page, context }) => {
    await page.goto('');
    const container = page.locator('#skills-container');
    await container.scrollIntoViewIfNeeded();
    await expect(container).toHaveClass(/physics-active/);
    const pill = page.locator('.skill-pill').first();
    const before = (await pill.boundingBox())!;
    const top = await page.evaluate(() => scrollY);
    const client = await context.newCDPSession(page);
    const point = { x: before.x + before.width / 2, y: before.y + before.height / 2, id: 1 };
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    await expect(pill).toHaveAttribute('data-dragging', '');
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...point, x: point.x + 70, y: point.y + 55 }] });
    await expect.poll(async () => {
      const box = (await pill.boundingBox())!;
      return Math.hypot(box.x - before.x, box.y - before.y);
    }).toBeGreaterThan(25);
    expect(await page.evaluate(() => scrollY)).toBe(top);
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(pill).not.toHaveAttribute('data-dragging', '');
  });
});

for (const theme of ['light', 'dark']) {
  test(`header controls keep their positions while the application loads in ${theme} mode`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*.js', async route => { await pending; await route.continue(); });
    await page.goto('', { waitUntil: 'commit' });
    const language = page.locator('#lang-toggle');
    await expect(language).toBeVisible();
    const before = (await language.boundingBox())!;
    release();
    await expect(page.locator('#theme-toggle')).toBeVisible();
    const after = (await language.boundingBox())!;
    expect(after.x).toBeCloseTo(before.x, 0);
    expect(after.y).toBeCloseTo(before.y, 0);
  });
}
