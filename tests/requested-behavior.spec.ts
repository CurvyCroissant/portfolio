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
  expect(after).toEqual({ ...before, identity: true, wrappers: 0 });
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

test('theme colors stagger outwards to inwards and remove delays afterward', async ({ page }) => {
  await page.goto('');
  await page.locator('#theme-toggle').click();
  const delays = await page.evaluate(() => ['body', '.skills-container', '.skill-pill'].map(selector => parseFloat(document.querySelector<HTMLElement>(selector)!.style.getPropertyValue('--theme-delay'))));
  expect(delays[0]).toBeLessThan(delays[1]);
  expect(delays[1]).toBeLessThan(delays[2]);
  await expect.poll(() => page.locator('[style*="--theme-delay"]').count()).toBe(0);
});

test('opening an image commits clicked state while the dialog is open', async ({ page }) => {
  await page.goto('');
  const link = page.locator('.proof-link').first();
  await link.click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await expect(link).toHaveAttribute('data-clicked', '');
  await expect(link).toHaveAttribute('data-viewed', 'true');
  await expect(link).toHaveCSS('color', 'rgb(102, 84, 125)');
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

test('language wipes hold section heights until the incoming text settles', async ({ page }) => {
  await page.goto('');
  await page.locator('#education').scrollIntoViewIfNeeded();
  await page.locator('#lang-toggle').click();
  await page.locator('[hreflang="ja"].lang-option').click();
  await expect(page.locator('html')).toHaveAttribute('data-navigating');
  const samples = await page.evaluate(() => new Promise<number[]>(resolve => {
    const values: number[] = [];
    const sample = () => {
      if (!document.documentElement.hasAttribute('data-navigating')) { resolve(values); return; }
      values.push(document.querySelector('#education')!.getBoundingClientRect().height);
      requestAnimationFrame(sample);
    };
    sample();
  }));
  expect(samples.length).toBeGreaterThan(1);
  expect(Math.max(...samples) - Math.min(...samples)).toBeLessThan(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});

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
