import { test, expect } from '@playwright/test';
import sharp from 'sharp';

async function pixelDifference(a: Buffer, b: Buffer) {
  const first = await sharp(a).removeAlpha().raw().toBuffer();
  const second = await sharp(b).removeAlpha().raw().toBuffer();
  let sum = 0, changed = 0;
  for (let i = 0; i < first.length; i += 3) {
    const delta = Math.abs(first[i] - second[i]) + Math.abs(first[i + 1] - second[i + 1]) + Math.abs(first[i + 2] - second[i + 2]);
    sum += delta; if (delta > 12) changed++;
  }
  return { mean: sum / first.length, fraction: changed / (first.length / 3) };
}
const finishArrival = async (page: import('@playwright/test').Page) => page.evaluate(() => document.getAnimations().filter(a => a.id === 'portfolio-arrival').forEach(a => a.finish()));

for (const theme of ['light', 'dark']) {
  for (const motion of ['no-preference', 'reduce'] as const) {
    test(`cursor light changes actual background pixels in ${theme}, system motion ${motion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await page.addInitScript(value => localStorage.setItem('theme', value), theme);
      await page.goto('');
      await expect(page.locator('#motion-toggle')).toHaveCount(0);
      await finishArrival(page);
      await page.mouse.move(1255, 12); await page.waitForTimeout(750);
      const clip = { x: 16, y: 160, width: 224, height: 480 };
      const before = await page.screenshot({ clip });
      await page.mouse.move(120, 400); await page.waitForTimeout(750);
      const after = await page.screenshot({ clip });
      const difference = await pixelDifference(before, after);
      expect(difference.mean).toBeGreaterThan(theme === 'dark' ? 4 : 8);
      expect(difference.fraction).toBeGreaterThan(theme === 'dark' ? .25 : .35);
      const layer = await page.locator('.cursor-light').evaluate(element => ({ opacity: getComputedStyle(element).opacity, parent: getComputedStyle(element.parentElement!).zIndex }));
      expect(layer.opacity).toBe('1'); expect(Number(layer.parent)).toBeGreaterThanOrEqual(0);
    });
  }
  test(`material reflection visibly follows the pointer across a ${theme} card`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto(''); await finishArrival(page);
    const card = page.locator('#education .list-item').first();
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => card.evaluate(el => el.getAnimations().filter(a => a.id === 'portfolio-reveal').length)).toBe(0);
    const rect = (await card.boundingBox())!;
    const clip = { x: Math.round(rect.x + 16), y: Math.round(rect.y + 10), width: Math.floor(rect.width - 32), height: 16 };
    await page.mouse.move(rect.x + 28, rect.y + 16); await page.waitForTimeout(750);
    const left = await page.screenshot({ clip });
    await page.mouse.move(rect.x + rect.width - 28, rect.y + 16); await page.waitForTimeout(750);
    const right = await page.screenshot({ clip });
    const first = await sharp(left).removeAlpha().raw().toBuffer();
    const second = await sharp(right).removeAlpha().raw().toBuffer();
    let leftDelta = 0, rightDelta = 0, count = 0;
    for (let y = 0; y < clip.height; y++) for (let x = 0; x < clip.width / 4; x++) {
      const l = (y * clip.width + x) * 3, r = (y * clip.width + clip.width - 1 - x) * 3;
      leftDelta += first[l] - second[l]; rightDelta += second[r] - first[r]; count++;
    }
    expect(leftDelta / count).toBeGreaterThan(2); expect(rightDelta / count).toBeGreaterThan(2);
  });

  test(`pointer illumination preserves text contrast in ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto(''); await finishArrival(page);
    const luminance = (rgb: number[]) => rgb.map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
    for (const selector of ['.hero > p', '#education .list-content']) {
      const text = page.locator(selector).first();
      await text.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.getAnimations().filter(a => a.id === 'portfolio-reveal').forEach(a => a.finish()));
      const rect = (await text.boundingBox())!;
      const x = Math.round(rect.x + rect.width / 2), y = Math.round(rect.y + rect.height / 2);
      await page.mouse.move(x, y); await page.waitForTimeout(800);
      const foreground = await text.evaluate(element => {
        const color = getComputedStyle(element).color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        // Hide glyph paint without changing geometry to sample the real lit
        // background, including translucent fills and the moving reflection.
        const el = element as HTMLElement;
        el.style.setProperty('transition', 'none'); el.style.setProperty('color', 'transparent', 'important');
        return color;
      });
      const pixel = [...await sharp(await page.screenshot({ clip: { x, y, width: 1, height: 1 } })).removeAlpha().raw().toBuffer()];
      const a = luminance(foreground), b = luminance(pixel);
      expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05), selector).toBeGreaterThanOrEqual(4.5);
    }
  });
}

test('the production glass actually blurs content beneath it', async ({ page, browserName }) => {
  // Linux WPE does not paint backdrop blur in this test environment, even in a
  // minimal independent scene. Keep the real blur assertion in Chromium; the
  // WebKit cases above still verify actual page light and material reflections.
  test.skip(browserName === 'webkit', 'Backdrop blur pixels require an accelerated WebKit compositor; verify on physical Safari.');
  await page.goto(''); await finishArrival(page);
  const button = page.locator('#theme-toggle');
  const box = (await button.boundingBox())!;
  await page.evaluate(rect => {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `position:fixed;z-index:2;pointer-events:none;left:${rect.x - 50}px;top:${rect.y - 50}px;width:${rect.width + 100}px;height:${rect.height + 100}px;background:repeating-linear-gradient(90deg,#111 0 2px,#eee 2px 4px)`;
    document.body.append(backdrop);
  }, box);
  const clip = { x: Math.round(box.x + box.width / 3), y: Math.round(box.y + 8), width: Math.floor(box.width / 3), height: 5 };
  const blurred = await page.screenshot({ clip });
  await button.evaluate(element => { const el = element as HTMLElement; el.style.setProperty('-webkit-backdrop-filter', 'none'); el.style.backdropFilter = 'none'; });
  const clear = await page.screenshot({ clip });
  const deviation = async (buffer: Buffer) => {
    const raw = await sharp(buffer).removeAlpha().raw().toBuffer();
    const values = [...raw].filter((_, index) => index % 3 === 0);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
  };
  const smooth = await deviation(blurred), stripes = await deviation(clear);
  expect(stripes).toBeGreaterThan(15); expect(smooth).toBeLessThan(stripes * .55);
});

test('arrival and image-viewer motion have intermediate geometry, and skills retain physics', async ({ page }) => {
  await page.goto('');
  const arrival = await page.locator('.hero > h1').evaluate(element => {
    const a = element.getAnimations().find(animation => animation.id === 'portfolio-arrival')!;
    a.pause(); a.currentTime = 0;
    const before = element.getBoundingClientRect().top;
    a.currentTime = Number(a.effect!.getTiming().duration) / 2;
    const middle = element.getBoundingClientRect().top;
    a.currentTime = Number(a.effect!.getTiming().duration);
    const end = element.getBoundingClientRect().top;
    a.finish(); return { before, middle, end };
  });
  expect(arrival.before - arrival.end).toBeGreaterThan(10);
  expect(arrival.middle).toBeGreaterThan(arrival.end);
  expect(arrival.middle).toBeLessThan(arrival.before);
  await finishArrival(page);
  await page.locator('.portrait-link').click();
  const viewer = await page.locator('.lightbox-media').evaluate(element => {
    const a = element.getAnimations().find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(frame => 'transform' in frame))!;
    a.pause(); a.currentTime = 0; const before = element.getBoundingClientRect().width;
    a.currentTime = Number(a.effect!.getTiming().duration) / 2; const middle = element.getBoundingClientRect().width;
    a.currentTime = Number(a.effect!.getTiming().duration); const end = element.getBoundingClientRect().width;
    a.finish(); return { before, middle, end };
  });
  expect(viewer.middle).toBeGreaterThan(viewer.before);
  expect(viewer.middle).toBeLessThan(viewer.end);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toBeVisible();
  const skills = page.locator('#skills-container');
  await skills.scrollIntoViewIfNeeded();
  await expect(skills).toHaveClass(/physics-active/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(skills).toHaveClass(/physics-active/);
});

test('global setup ignores OS preferences and obsolete motion choices while theme selection persists', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark', contrast: 'more' });
  await page.addInitScript(() => localStorage.setItem('portfolio-motion', 'reduced'));
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#motion-toggle, #motion-label')).toHaveCount(0);
  await expect(page.locator('#theme-toggle')).toHaveCSS('backdrop-filter', 'blur(26px) saturate(1.55)');
  const initial = await page.locator('#theme-toggle').evaluate(element => ({ background: getComputedStyle(element).backgroundColor, transition: getComputedStyle(element).transitionDuration }));
  expect(initial.transition).not.toBe('0s');
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light', contrast: 'no-preference' });
  const changed = await page.locator('#theme-toggle').evaluate(element => ({ background: getComputedStyle(element).backgroundColor, transition: getComputedStyle(element).transitionDuration }));
  expect(changed).toEqual(initial);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-changing');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('menu slides down from the toggle and retracts without fading, scaling or a reversal jump', async ({ page }) => {
  await page.goto(''); await finishArrival(page);
  await page.locator('#lang-toggle').hover();
  const frames = await page.locator('.lang-menu').evaluate(element => {
    const a = element.getAnimations().find(animation => animation.id === 'portfolio-menu')!;
    a.pause();
    const read = (fraction: number) => {
      a.currentTime = Number(a.effect!.getTiming().duration) * fraction;
      const css = getComputedStyle(element), box = element.getBoundingClientRect();
      return { top: box.top, width: box.width, opacity: css.opacity, scale: new DOMMatrix(css.transform).a };
    };
    const before = read(0), middle = read(.35), end = read(1);
    a.currentTime = Number(a.effect!.getTiming().duration) * .35;
    return { before, middle, end };
  });
  expect(frames.before.top).toBeLessThan(frames.middle.top);
  expect(frames.middle.top).toBeLessThan(frames.end.top);
  expect(frames.before.width).toBe(frames.end.width);
  for (const frame of Object.values(frames)) { expect(frame.opacity).toBe('1'); expect(frame.scale).toBe(1); }
  const panel = page.locator('.lang-menu');
  const beforeClose = await panel.evaluate(element => getComputedStyle(element).transform);
  await page.keyboard.press('Escape');
  const reverse = await panel.evaluate(element => {
    const a = element.getAnimations().find(animation => animation.id === 'portfolio-menu')!;
    a.pause(); a.currentTime = 0;
    const value = getComputedStyle(element).transform;
    a.finish(); return value;
  });
  expect(reverse).toBe(beforeClose);
  await expect(page.locator('#lang-dropdown')).not.toHaveAttribute('open');
});

test('missing timing tokens retain a smooth menu animation instead of becoming zero', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => document.documentElement.style.setProperty('--motion-menu', ' '));
  await page.locator('#lang-toggle').hover();
  expect(await page.locator('.lang-menu').evaluate(element => element.getAnimations().some(a => Number(a.effect?.getTiming().duration) >= 500))).toBe(true);
});

test('language layout and simultaneous theme motion retain intermediate rendered states', async ({ page }) => {
  await page.goto(''); await finishArrival(page);
  await page.locator('#theme-toggle').click();
  const theme = await page.evaluate(() => {
    const a = document.documentElement.getAnimations().find(animation => animation.id === 'portfolio-theme')!;
    a.pause(); a.currentTime = 0; const before = getComputedStyle(document.body).backgroundColor;
    a.currentTime = 200; const middle = getComputedStyle(document.body).backgroundColor;
    a.finish(); return { before, middle };
  });
  expect(theme.middle).not.toBe(theme.before);
  await page.locator('#education').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    document.getAnimations().forEach(a => { try { a.finish(); } catch {} });
    const observer = new MutationObserver(() => {
      if (document.documentElement.lang !== 'ja') return;
      observer.disconnect();
      const animations = document.getAnimations().filter(a => a.id.startsWith('portfolio-language-'));
      animations.forEach(a => { a.pause(); a.currentTime = 0; });
      const section = document.querySelector('#education')!;
      const before = section.getBoundingClientRect().height;
      animations.forEach(a => { a.currentTime = Number(a.effect!.getTiming().duration) / 2; });
      const middle = section.getBoundingClientRect().height;
      animations.forEach(a => { a.currentTime = Number(a.effect!.getTiming().duration) * .999; });
      const end = section.getBoundingClientRect().height;
      Object.assign(window, { __layoutFrames: { before, middle, end } });
      animations.forEach(a => a.finish());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
  await page.locator('#lang-toggle').click(); await page.locator('.lang-option[hreflang="ja"]').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-navigating');
  const layout = await page.evaluate(() => (window as unknown as { __layoutFrames: { before: number; middle: number; end: number } }).__layoutFrames);
  expect(Math.abs(layout.before - layout.end)).toBeGreaterThan(10);
  expect(Math.abs(layout.middle - (layout.before + layout.end) / 2)).toBeLessThan(2);
});

test('scroll reveals unfold in perspective and sweep a reflection, then release all temporary paint', async ({ page }) => {
  await page.goto(''); await finishArrival(page);
  const card = page.locator('#education .list-item').first();
  await page.evaluate(() => {
    const target = document.querySelector('#education .list-item')!;
    const observer = new MutationObserver(() => {
      const animation = target.getAnimations().find(a => a.id === 'portfolio-reveal');
      if (!animation) return;
      observer.disconnect(); animation.pause(); animation.currentTime = 0;
    });
    observer.observe(target, { attributes: true, attributeFilter: ['data-reveal-active'] });
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await expect(card).toHaveAttribute('data-reveal-active');
  const frames = await card.evaluate(element => {
    const a = element.getAnimations().find(animation => animation.id === 'portfolio-reveal')!;
    const read = (fraction: number) => {
      a.currentTime = Number(a.effect!.getTiming().duration) * fraction;
      const css = getComputedStyle(element), matrix = new DOMMatrix(css.transform);
      return { width: element.getBoundingClientRect().width, opacity: Number(css.opacity), tilt: matrix.m23 };
    };
    const before = read(0), middle = read(.4), end = read(1);
    const sheen = getComputedStyle(element, '::after');
    const reflection = { content: sheen.content, animation: sheen.animationName, background: sheen.backgroundImage };
    a.finish(); return { before, middle, end, reflection };
  });
  expect(Math.abs(frames.before.tilt)).toBeGreaterThan(.1);
  expect(frames.middle.width).toBeGreaterThan(frames.before.width);
  expect(frames.middle.opacity).toBeGreaterThan(frames.before.opacity);
  expect(frames.end.tilt).toBe(0); expect(frames.end.opacity).toBe(1);
  expect(frames.reflection.animation).toBe('glass-unfold-reflection');
  expect(frames.reflection.background).toContain('linear-gradient');
  await expect(card).not.toHaveAttribute('data-reveal-active');
  await expect(card).toHaveCSS('transform', 'none');
  await expect(card).toHaveCSS('filter', 'none');
});

test('image popup actions omit arrows while page links retain navigation and text has hover depth', async ({ page }) => {
  await page.goto(''); await finishArrival(page);
  await expect(page.locator('[data-lightbox] h3 svg, .proof-link svg')).toHaveCount(0);
  expect(await page.locator('.project-card h3 svg').count()).toBeGreaterThan(0);
  const card = page.locator('.project-card').first();
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.evaluate(element => element.getAnimations().filter(a => a.id === 'portfolio-reveal').length)).toBe(0);
  await page.mouse.move(2, 200);
  await page.waitForTimeout(850);
  const before = await card.locator('h3').evaluate(element => ({ color: getComputedStyle(element).color, shadow: getComputedStyle(element).textShadow, width: (element as HTMLElement).offsetWidth }));
  await card.hover();
  await expect(card.locator('h3')).toHaveCSS('color', 'rgb(23, 23, 23)');
  const after = await card.locator('h3').evaluate(element => ({ color: getComputedStyle(element).color, shadow: getComputedStyle(element).textShadow, width: (element as HTMLElement).offsetWidth }));
  expect(after.color).not.toBe(before.color); expect(after.shadow).not.toBe(before.shadow);
  expect(after.shadow).not.toBe('none'); expect(after.width).toBe(before.width);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-changing');
  const palette = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    return { bg: css.getPropertyValue('--bg'), surface: css.getPropertyValue('--surface'), secondary: css.getPropertyValue('--secondary') };
  });
  expect(palette.bg).toBe('rgb(11, 11, 11)');
  expect(palette.surface).toContain('24, 24, 24'); expect(palette.secondary).toBe('rgb(189, 189, 189)');
  await card.hover();
  await expect(card.locator('h3')).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test.describe('touch glass controls', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 740 } });
  test('preferences fit, the menu stays on screen and taps preserve translated project state', async ({ page }) => {
    await page.goto('id/projects/posture-alert/');
    await page.locator('#lang-toggle').tap();
    const rect = (await page.locator('.lang-menu').boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(15); expect(rect.x + rect.width).toBeLessThanOrEqual(305);
    const overlap = await page.evaluate(() => document.querySelector('.back-link')!.getBoundingClientRect().right > document.querySelector('.floating-controls')!.getBoundingClientRect().left);
    expect(overlap).toBe(false);
    await page.locator('.lang-option[hreflang="ja"]').tap();
    await expect(page.locator('html')).not.toHaveAttribute('data-navigating');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('.back-link')).toHaveAttribute('href', '/portfolio/ja/');
  });
});
