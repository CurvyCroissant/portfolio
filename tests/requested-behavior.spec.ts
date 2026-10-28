import { test, expect } from '@playwright/test';

const settled = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('html')).not.toHaveAttribute('data-navigating');
};

test('language wipes preserve media, physics, and horizontal carousel positions', async ({ page }) => {
  await page.goto('');
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
  await page.evaluate(() => {
    Object.assign(window, { __portrait: document.querySelector('.media-portrait'), __skills: document.querySelector('#skills-container') });
    document.querySelector<HTMLElement>('.cert-grid')!.scrollLeft = 130;
  });
  const before = await page.evaluate(() => ({ y: scrollY, x: document.querySelector('.cert-grid')!.scrollLeft, pills: [...document.querySelectorAll('.skill-pill')].map(el => el.textContent) }));
  await page.locator('#lang-toggle').click();
  await page.locator('[hreflang="ja"].lang-option').click();
  await settled(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  const after = await page.evaluate(() => {
    const saved = window as unknown as { __portrait: Element; __skills: Element };
    return { identity: saved.__portrait === document.querySelector('.media-portrait') && saved.__skills === document.querySelector('#skills-container'), y: scrollY, x: document.querySelector('.cert-grid')!.scrollLeft, pills: [...document.querySelectorAll('.skill-pill')].map(el => el.textContent), wrappers: document.querySelectorAll('.translation-text').length };
  });
  const maximum = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
  expect(after).toEqual({ ...before, y: Math.min(before.y, maximum), identity: true, wrappers: 0 });
  expect(await page.locator('body').evaluate(el => el.style.minHeight)).toBe('');
});

test('hover disclosure stays open on first click and closes when focus leaves', async ({ page }) => {
  await page.goto('');
  const toggle = page.locator('#lang-toggle');
  await toggle.hover();
  await expect(page.locator('#lang-dropdown')).toHaveAttribute('open');
  await toggle.click();
  await expect(page.locator('.lang-menu')).toBeVisible();
  await page.locator('#theme-toggle').focus();
  await expect(page.locator('#lang-dropdown')).not.toHaveAttribute('open');
});

test('footer contacts have equal height at responsive widths and enlarged text', async ({ page }) => {
  await page.goto('ja/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => { document.querySelector<HTMLElement>('.social-links')!.style.fontSize = '24px'; });
    const heights = await page.locator('.social-links > *').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height));
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  }
});

test('carousel vertical wheel gestures scroll the document', async ({ page }) => {
  await page.goto('');
  const carousel = page.locator('.cert-grid').first();
  await carousel.scrollIntoViewIfNeeded();
  await carousel.hover();
  const y = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 150);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y);
  expect(await carousel.evaluate(el => el.scrollTop)).toBe(0);
});

test('theme colors use three sequential background, surface and text phases', async ({ page }) => {
  await page.goto('');
  const read = () => page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    surface: getComputedStyle(document.querySelector('.list-item')!).backgroundColor,
    text: getComputedStyle(document.querySelector('.hero > p')!).color,
  }));
  const old = await read();
  await page.locator('#theme-toggle').click();
  await page.evaluate(() => {
    const animation = document.documentElement.getAnimations().find(a => a.id === 'portfolio-theme')!;
    animation.pause();
    Object.assign(window, { __themeAnimation: animation });
  });
  const seek = async (fraction: number) => {
    await page.evaluate(async value => {
      const animation = (window as unknown as { __themeAnimation: Animation }).__themeAnimation;
      animation.currentTime = Number(animation.effect!.getTiming().duration) * value;
      await new Promise(requestAnimationFrame);
    }, fraction);
    return read();
  };
  const background = await seek(1 / 6);
  expect(background.background).not.toBe(old.background);
  expect(background.surface).toBe(old.surface); expect(background.text).toBe(old.text);
  const surface = await seek(1 / 2);
  expect(surface.surface).not.toBe(old.surface); expect(surface.text).toBe(old.text);
  const text = await seek(5 / 6);
  expect(text.text).not.toBe(old.text);
  expect(text.background).toBe(surface.background);
  await page.evaluate(() => (window as unknown as { __themeAnimation: Animation }).__themeAnimation.finish());
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-changing');
  expect(await page.locator('[style*="--theme-delay"]').count()).toBe(0);
});

test('opening an image commits clicked state while the dialog is open', async ({ page }) => {
  await page.goto('');
  const link = page.locator('.proof-link').first();
  await link.click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await expect(link).toHaveAttribute('data-clicked', '');
  await expect(link).toHaveAttribute('data-viewed', 'true');
  await expect(link).toHaveCSS('color', 'rgb(91, 91, 91)');
});

test('Back during the incoming language wipe restores matching text and URL in place', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => {
    Object.assign(window, { __body: document.body });
    const observer = new MutationObserver(() => {
      if (document.documentElement.lang !== 'ja') return;
      observer.disconnect();
      history.back();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
  await page.locator('#lang-toggle').click();
  await page.locator('[hreflang="ja"].lang-option').click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await settled(page);
  await expect(page.locator('#hero-title')).toHaveText('Aaron Nathanael');
  await expect(page.locator('.translation-text')).toHaveCount(0);
  expect(await page.evaluate(() => document.body === (window as unknown as { __body: Element }).__body)).toBe(true);
});

test('theme labels keep the active appearance and translated sizing hints during language changes', async ({ page }) => {
  await page.goto('');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#lang-toggle').click();
  await page.locator('[hreflang="id"].lang-option').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await settled(page);
  await expect(page.locator('#theme-label')).toHaveText('Terang');
  await expect(page.locator('#theme-label')).toHaveAttribute('data-measure', 'Terang');
  await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', 'Beralih ke tampilan terang');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('#theme-label')).toHaveText('Gelap');
});

test('keyboard dropdown selection and Escape return focus to the toggle', async ({ page }) => {
  await page.goto('');
  const toggle = page.locator('#lang-toggle');
  await toggle.focus();
  await expect(page.locator('.lang-menu')).toBeVisible();
  await toggle.press('ArrowDown');
  await expect(page.locator('.lang-option').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('#lang-dropdown')).not.toHaveAttribute('open');
  await toggle.press('ArrowUp');
  await expect(page.locator('.lang-option').last()).toBeFocused();
  await page.keyboard.press('Enter');
  await settled(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(toggle).toBeFocused();
  await expect(page.locator('.lang-menu')).not.toBeVisible();
});

test('critical images are eager, gallery images are lazy, and removed features stay absent', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('.media-portrait > img:not(.media-preview)')).toHaveAttribute('loading', 'eager');
  await expect(page.locator('.media-portrait > img:not(.media-preview)')).toHaveAttribute('fetchpriority', 'high');
  expect(await page.locator('.cert-grid .media-frame img').evaluateAll(images => images.every(image => image.getAttribute('loading') === 'lazy'))).toBe(true);
  await expect(page.locator('[id*="terminal"], [id*="term-"], [class*="skeleton"], #navigation-loader')).toHaveCount(0);
  await page.keyboard.press('/');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

for (const width of [390, 1280]) {
test(`language heights and positions share one incoming clock at ${width}px without a final jump`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('');
  await page.locator('#education').scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    document.getAnimations().forEach(a => { try { a.finish(); } catch {} });
    document.querySelectorAll('[data-reveal-pending]').forEach(element => element.removeAttribute('data-reveal-pending'));
    await new Promise(requestAnimationFrame);
    document.getAnimations().forEach(a => { try { a.finish(); } catch {} });
    const observer = new MutationObserver(() => {
      if (document.documentElement.lang !== 'ja') return;
      observer.disconnect();
      const animations = document.getAnimations().filter(a => a.id.startsWith('portfolio-language-'));
      animations.forEach(a => { a.pause(); a.currentTime = 0; });
      Object.assign(window, { __languageAnimations: animations });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
  const geometry = () => page.evaluate(() => {
    const items = document.querySelectorAll('#education .list-item');
    const glyph = document.querySelector('.project-card h3 svg')!.getBoundingClientRect();
    return [document.querySelector('#education')!.getBoundingClientRect().height, items[0].getBoundingClientRect().height, items[1].getBoundingClientRect().top + scrollY, glyph.left, glyph.top + scrollY];
  });
  const old = await geometry();
  await page.locator('#lang-toggle').click();
  await page.locator('[hreflang="ja"].lang-option').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __languageAnimations?: Animation[] }).__languageAnimations?.length ?? 0)).toBeGreaterThan(2);
  const start = await geometry();
  for (let i = 0; i < old.length; i++) expect(Math.abs(start[i] - old[i]), JSON.stringify({ old, start, index: i })).toBeLessThan(2);
  const seek = async (fraction: number) => {
    await page.evaluate(async value => {
      (window as unknown as { __languageAnimations: Animation[] }).__languageAnimations.forEach(a => { a.currentTime = Number(a.effect!.getTiming().duration) * value; });
      await new Promise(requestAnimationFrame);
    }, fraction);
    return geometry();
  };
  const middle = await seek(.5), end = await seek(.999);
  expect(Math.abs(end[0] - start[0])).toBeGreaterThan(10);
  for (let i = 0; i < start.length; i++) expect(Math.abs(middle[i] - (start[i] + end[i]) / 2)).toBeLessThan(3);
  await page.evaluate(() => (window as unknown as { __languageAnimations: Animation[] }).__languageAnimations.forEach(a => a.finish()));
  await settled(page);
  const final = await geometry();
  for (let i = 0; i < final.length; i++) expect(Math.abs(final[i] - end[i])).toBeLessThan(2);
  await expect(page.locator('[data-layout-held]')).toHaveCount(0);
});
}

test('reduced motion switches pages without spatial animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('');
  await page.locator('.project-card').first().click();
  await settled(page);
  expect(await page.locator('body').evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(page.locator('.project-title')).toBeVisible();
});

test.describe('mobile dropdown', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('tap opens the menu and a language tap updates in place', async ({ page }) => {
    await page.goto('');
    await page.locator('#lang-toggle').tap();
    await expect(page.locator('.lang-menu')).toBeVisible();
    await page.locator('[hreflang="id"].lang-option').tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await settled(page);
    await expect(page.locator('.lang-menu')).not.toBeVisible();
  });
});
