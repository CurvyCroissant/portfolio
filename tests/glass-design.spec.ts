import { test, expect } from '@playwright/test';

const settled = async (page: import('@playwright/test').Page) => expect(page.locator('html')).not.toHaveAttribute('data-navigating');

test('home copy matches the requested introduction and education, including GPA precision', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('.hero > p')).toHaveText('Computer Science Undergraduate @ BINUS University | Application Developer Intern @ PT Bank Central Asia Tbk.');
  await expect(page.locator('#education .list-content').first()).toHaveText('4th-year Computer Science undergraduate with a cumulative GPA of 3.90. Within the Global Class program, where all the materials and lectures are provided entirely in English, as well as a compulsory international study exchange for one semester.');
  for (const [locale, gpa, required] of [['id', '3,90', 'wajib'], ['ja', '3.90', '必修']]) {
    await page.goto(`${locale}/`);
    await expect(page.locator('#education .list-content').first()).toContainText(gpa);
    await expect(page.locator('#education .list-content').first()).toContainText(required);
  }
});

for (const theme of ['light', 'dark']) {
  test(`glass controls, popup restoration and keyboard focus have no outlines in ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto('');
    await expect(page.locator('#theme-toggle')).toBeVisible();
    const style = await page.locator('#theme-toggle').evaluate(el => {
      const css = getComputedStyle(el);
      return { backdrop: css.backdropFilter, rim: css.boxShadow, radius: css.borderRadius };
    });
    expect(style.backdrop).toContain('blur');
    expect(style.rim).not.toBe('none');
    expect(parseFloat(style.radius)).toBeGreaterThan(40);
    await page.locator('.portrait-link').click();
    await expect(page.locator('#lightbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.portrait-link')).toBeFocused();
    await expect(page.locator('.portrait-link')).toHaveCSS('outline-style', 'none');
    for (const selector of ['#theme-toggle', '.project-card', '#copy-email']) {
      await page.locator(selector).first().focus();
      await expect(page.locator(selector).first()).toHaveCSS('outline-style', 'none');
      await expect(page.locator(selector).first()).toHaveCSS('text-decoration-line', 'underline');
    }
  });
}

test('hover scale interpolates and touch-style presses release cleanly', async ({ page }) => {
  await page.goto('');
  await page.locator('#theme-toggle').hover();
  const scales = await page.locator('#theme-toggle').evaluate(el => new Promise<number[]>(resolve => {
    const values: number[] = [];
    const sample = () => {
      values.push(parseFloat(getComputedStyle(el).scale) || 1);
      if (values.length < 10) requestAnimationFrame(sample); else resolve(values);
    };
    requestAnimationFrame(sample);
  }));
  expect(scales.some(scale => scale > 1 && scale < 1.025)).toBe(true);
  const button = page.locator('#theme-toggle');
  await button.dispatchEvent('pointerdown', { pointerType: 'touch', button: 0 });
  await expect(button).toHaveAttribute('data-glass-pressed');
  await button.dispatchEvent('pointercancel', { pointerType: 'touch' });
  await expect(button).not.toHaveAttribute('data-glass-pressed');
});

test('menu closing stays animated and inert, and reopening reverses it', async ({ page }) => {
  await page.goto('');
  const toggle = page.locator('#lang-toggle');
  await toggle.hover();
  await expect(page.locator('.lang-menu')).toBeVisible();
  await page.mouse.move(10, 250);
  await expect(page.locator('#lang-dropdown')).toHaveAttribute('data-menu-state', 'closing');
  expect(await page.locator('.lang-menu').evaluate(el => (el as HTMLElement).inert)).toBe(true);
  await toggle.hover();
  await expect(page.locator('#lang-dropdown')).toHaveAttribute('data-menu-state', 'open');
  expect(await page.locator('.lang-menu').evaluate(el => (el as HTMLElement).inert)).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lang-dropdown')).not.toHaveAttribute('open');
});

test('increased contrast uses solid materials with no backdrop dependency', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-contrast', value: 'more' }] });
  await page.goto('');
  await expect(page.locator('#theme-toggle')).toHaveCSS('backdrop-filter', 'none');
  const color = await page.locator('#theme-toggle').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(color).not.toContain('rgba');
});

for (const native of [true, false]) {
  test(`page motion preserves fixed controls and history with native transitions ${native}`, async ({ page }) => {
    if (!native) await page.addInitScript(() => { Object.defineProperty(document, 'startViewTransition', { value: undefined }); });
    await page.goto('');
    await page.locator('.project-card').first().click();
    await settled(page);
    await expect(page.locator('.project-title')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('transform', 'none');
    await page.goBack();
    await settled(page);
    await expect(page.locator('.hero')).toBeVisible();
    expect(await page.locator('body').evaluate(el => el.getAnimations().length)).toBe(0);
  });
}
