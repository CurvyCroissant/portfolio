import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`all UI paint tokens are monochrome and skills use glass in ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto('');
    const colors = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return ['bg', 'text', 'secondary', 'visited', 'surface', 'glass', 'glass-panel', 'hover', 'accent', 'accent-soft', 'ambient-a', 'ambient-b', 'ambient-c'].map(key => ({ key, color: style.getPropertyValue(`--${key}`) }));
    });
    for (const {key, color} of colors) {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      expect(channels[0], `${key}: ${color}`).toBe(channels[1]);
      expect(channels[1], `${key}: ${color}`).toBe(channels[2]);
    }
    const skills = await page.locator('#skills-container').evaluate(el => ({ background: getComputedStyle(el).backgroundColor, backdrop: getComputedStyle(el).backdropFilter }));
    expect(skills.backdrop).toContain('blur');
    expect(Number(skills.background.match(/[\d.]+/g)!.at(-1))).toBeLessThan(.5);
    await expect(page.locator('.hero .control, .hero-actions')).toHaveCount(0);
  });
}

test('cursor light reaches the page background, content cards and nested skills materials', async ({ page }) => {
  await page.goto('');
  await page.mouse.move(40, 300);
  await expect(page.locator('body')).toHaveAttribute('data-cursor-active');
  await page.locator('#education .list-content').first().hover();
  await expect(page.locator('#education .list-item').first()).toHaveAttribute('data-glass-lit');
  await page.locator('.project-card p').first().hover();
  await expect(page.locator('.project-card').first()).toHaveAttribute('data-glass-lit');
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
  await page.locator('.skill-pill').first().hover();
  await expect(page.locator('#skills-container')).toHaveAttribute('data-glass-lit');
  await expect(page.locator('.skill-pill').first()).toHaveAttribute('data-glass-lit');
  const positions = await page.locator('body').evaluate(el => [el.style.getPropertyValue('--page-x'), el.style.getPropertyValue('--page-y')]);
  expect(positions.every(value => value.endsWith('%'))).toBe(true);
});

test('contact groups stay centered and equally tall at phone, landscape, tablet and desktop widths', async ({ page }) => {
  await page.goto('');
  await page.addStyleTag({ content: '.social-link { font-size: 22px; }' });
  for (const [width, height] of [[320, 740], [740, 320], [820, 900], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    const values = await page.locator('.social-link').evaluateAll(links => links.map(link => {
      const box = link.getBoundingClientRect();
      const children = [...link.children].map(child => child.getBoundingClientRect());
      return { align: getComputedStyle(link).textAlign, height: box.height, offset: (Math.min(...children.map(b => b.left)) + Math.max(...children.map(b => b.right))) / 2 - (box.left + box.right) / 2 };
    }));
    expect(Math.max(...values.map(v => v.height)) - Math.min(...values.map(v => v.height))).toBeLessThan(1);
    for (const value of values) { expect(value.align).toBe('center'); expect(Math.abs(value.offset)).toBeLessThan(1); }
  }
});

test('root scrolling stays inside both boundaries and the crescent fills its icon viewbox', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'none');
  await expect(page.locator('body')).toHaveCSS('overscroll-behavior-y', 'none');
  await page.mouse.move(30, 200);
  await page.mouse.wheel(0, -2000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.mouse.wheel(0, 2000);
  await expect.poll(() => page.evaluate(() => scrollY - (document.documentElement.scrollHeight - innerHeight))).toBe(0);
  const bounds = await page.locator('.theme-moon svg path').evaluate(el => { const b = (el as SVGGraphicsElement).getBBox(); return { width: b.width, height: b.height }; });
  expect(bounds.width).toBeGreaterThan(17); expect(bounds.height).toBeGreaterThan(17);
});

test('return labels are concise and popup selection never underlines the opener', async ({ page }) => {
  for (const [locale, label] of [['', 'Back'], ['id/', 'Kembali'], ['ja/', '戻る']]) {
    await page.goto(`${locale}projects/posture-alert/`);
    await expect(page.locator('.back-full')).toHaveText(label);
    await expect(page.locator('.back-short')).toHaveText(label);
  }
  await page.goto('');
  const card = page.locator('.cert-card').first();
  await card.click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();
  await expect(card).toHaveCSS('text-decoration-line', 'none');
  await expect(card).toHaveCSS('outline-style', 'none');
});

test('a reversed theme switch starts from its current paint and leaves no stale state', async ({ page }) => {
  await page.goto('');
  await page.locator('#theme-toggle').click();
  const current = await page.evaluate(() => {
    const a = document.documentElement.getAnimations().find(animation => animation.id === 'portfolio-theme')!;
    a.pause(); a.currentTime = 200;
    return getComputedStyle(document.documentElement).getPropertyValue('--bg');
  });
  await page.locator('#theme-toggle').click();
  const start = await page.evaluate(() => {
    const a = document.documentElement.getAnimations().find(animation => animation.id === 'portfolio-theme')!;
    a.pause(); a.currentTime = 0;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--bg');
    a.finish();
    return color;
  });
  expect(start).toBe(current);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-changing');
});
