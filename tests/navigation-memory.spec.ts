import { test, expect } from '@playwright/test';
import { messages, locales } from '../src/data/messages';
import { site, skills } from '../src/data/site';
import { projects } from '../src/data/projects';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { __departures: [] });
    document.addEventListener('click', event => {
      if ((event.target as Element).closest('.project-card')) (window as unknown as { __departures: number[] }).__departures.push(scrollY);
    }, true);
  });
});
const departure = (page: import('@playwright/test').Page) => page.evaluate(() => (window as unknown as { __departures: number[] }).__departures.at(-1)!);

const loaded = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('#navigation-loader')).not.toBeVisible();
  await expect(page.locator('#theme-toggle')).toBeVisible();
};

test('navigation changes the URL and shows a destination skeleton before HTML or images arrive', async ({ page }) => {
  await page.goto('');
  let releaseHTML!: () => void, releaseImages!: () => void;
  const html = new Promise<void>(resolve => { releaseHTML = resolve; });
  const images = new Promise<void>(resolve => { releaseImages = resolve; });
  await page.route('**/projects/posture-alert/', async route => { await html; await route.continue(); });
  await page.route('**/*.webp', async route => { await images; await route.continue(); });
  await page.locator('.project-card').first().click();
  await expect(page).toHaveURL(/projects\/posture-alert\/$/);
  await expect(page.locator('#navigation-loader')).toBeVisible();
  await expect(page.locator('.navigation-project')).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  releaseHTML();
  await loaded(page);
  await expect(page.locator('h1')).toHaveText(messages['proj-pa-title'].en);
  const frame = page.locator('.cert-card .media-frame').first();
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute('data-media-state', 'loading');
  await expect(frame.locator('.skeleton-image')).toBeVisible();
  releaseImages();
  await expect(frame).toHaveAttribute('data-media-state', 'ready');
});

test('Back, Forward, and refresh remember both home and project scroll positions', async ({ page }) => {
  await page.goto('');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.locator('.project-card').first().click();
  const homeY = await departure(page);
  await loaded(page);
  await page.locator('.cert-grid').scrollIntoViewIfNeeded();
  const projectY = await page.evaluate(() => scrollY);
  await page.goBack();
  await loaded(page);
  await expect(page.locator('[data-page="home"]')).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(homeY, 0);
  await page.goForward();
  await loaded(page);
  await expect(page.locator('.project-title')).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(projectY, 0);
  await page.reload();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(projectY, 0);
});

test('Home and repeated project links restore the most recent position on each page', async ({ page }) => {
  await page.goto('');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.locator('.project-card').first().click();
  const homeY = await departure(page);
  await loaded(page);
  await page.locator('.cert-grid').scrollIntoViewIfNeeded();
  const projectY = await page.evaluate(() => scrollY);
  await page.locator('.back-link').click();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(homeY, 0);
  await page.locator('.project-card').first().click();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(projectY, 0);
});

test('two history entries for the same page retain their own distinct positions', async ({ page }) => {
  await page.goto('');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.locator('.project-card').first().click();
  const first = await departure(page);
  await loaded(page);
  await page.locator('.back-link').click();
  await loaded(page);
  await page.locator('#skills').scrollIntoViewIfNeeded();
  const second = await page.evaluate(() => scrollY);
  expect(Math.abs(second - first)).toBeGreaterThan(100);
  await page.goBack();
  await loaded(page);
  await page.goBack();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(first, 0);
  await page.goForward();
  await loaded(page);
  await page.goForward();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(second, 0);
});

test('returning to the top saves zero and does not resurrect an older position', async ({ page }) => {
  await page.goto('');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.reload();
  await page.evaluate(() => scrollTo(0, 0));
  await page.reload();
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('Back cancels a pending page load and a late response cannot replace the restored page', async ({ page }) => {
  await page.goto('');
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/projects/posture-alert/', async route => { await pending; await route.continue().catch(() => {}); });
  await page.locator('.project-card').first().click();
  await expect(page.locator('#navigation-loader')).toBeVisible();
  await page.goBack();
  await loaded(page);
  release();
  await expect(page.locator('[data-page="home"]')).toBeVisible();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a failed navigation offers retry and recovers without losing its URL', async ({ page }) => {
  await page.goto('');
  let failed = false;
  await page.route('**/projects/posture-alert/', route => {
    if (!failed) { failed = true; return route.abort(); }
    return route.continue();
  });
  await page.locator('.project-card').first().click();
  await expect(page).toHaveURL(/posture-alert\/$/);
  await expect(page.locator('#navigation-error')).toBeVisible();
  await page.locator('#navigation-retry').click();
  await loaded(page);
  await expect(page.locator('h1')).toHaveText(messages['proj-pa-title'].en);
});

test('modified links retain their default browser action without starting a skeleton', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => {
    document.addEventListener('click', event => {
      if (!event.ctrlKey) return;
      Object.assign(window, { __modifiedLinkCancelled: event.defaultPrevented });
      event.preventDefault(); // Observe the router's decision without opening a real tab.
    });
  });
  await page.locator('.project-card').first().dispatchEvent('click', { ctrlKey: true, button: 0 });
  expect(await page.evaluate(() => (window as unknown as { __modifiedLinkCancelled: boolean }).__modifiedLinkCancelled)).toBe(false);
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('#navigation-loader')).not.toBeVisible();
});

test('pills shuffle on refresh while retaining exactly the featured skills', async ({ page }) => {
  await page.goto('');
  const order = () => page.locator('.skill-pill').allTextContents();
  const first = await order();
  await page.reload();
  const second = await order();
  expect([...first].sort()).toEqual(skills.filter(skill => skill.featured).map(skill => skill.label).sort());
  expect([...second].sort()).toEqual([...first].sort());
  expect(second).not.toEqual(first);
});

test('dragging a skill across other page text never selects text', async ({ page }) => {
  await page.goto('');
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
  const pill = (await page.locator('.skill-pill').first().boundingBox())!;
  await page.mouse.move(pill.x + pill.width / 2, pill.y + pill.height / 2);
  await page.mouse.down();
  await page.mouse.move(50, 70, { steps: 20 });
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('');
  await page.mouse.up();
  expect(await page.locator('.skill-pill').first().evaluate(element => getComputedStyle(element).getPropertyValue('-webkit-user-select'))).toBe('none');
});

test('the email row copies on click, has no mailto link, and contains only its mail icon', async ({ page }) => {
  await page.addInitScript(() => {
    window.__copies = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText(value: string) { window.__copies.push(value); return Promise.resolve(); } } });
  });
  await page.goto('');
  const email = page.locator('#copy-email');
  await expect(email).toHaveText(site.email);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(email.locator('svg')).toHaveCount(1);
  await email.locator('span').click();
  expect(await page.evaluate(() => window.__copies)).toEqual([site.email]);
  await expect(page.locator('#copy-status')).toHaveText(messages.copied.en);
});

for (const locale of locales) {
  test(`repository links use the shared GitHub icon and language strings: ${locale}`, async ({ page }) => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    await page.goto(prefix);
    const path = await page.locator(`a[href="${site.github}"] svg path`).getAttribute('d');
    for (const project of projects.filter(project => project.repository)) {
      await page.goto(`${prefix}projects/${project.slug}/`);
      await expect(page.locator('.repo-link svg path')).toHaveAttribute('d', path!);
      await expect(page.locator('.repo-link')).toContainText(messages['view-repo'][locale]);
    }
  });
}

test('every translated string preserves all English placeholders and names stay consistent', () => {
  for (const [key, value] of Object.entries(messages)) {
    const variables = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
    for (const locale of locales) {
      expect(value[locale].trim(), `${key}/${locale}`).not.toBe('');
      expect(variables(value[locale]), `${key}/${locale}`).toEqual(variables(value.en));
    }
  }
});

test('dark mode has diffuse elevation shadows with no border or outline ring', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('');
  await page.locator('#skills-container').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
  const style = await page.locator('.skill-pill').first().evaluate(element => {
    const css = getComputedStyle(element);
    return { shadow: css.boxShadow, outline: css.outlineStyle, border: css.borderTopWidth };
  });
  await expect.poll(() => page.locator('.skill-pill').first().evaluate(element => getComputedStyle(element).boxShadow)).toContain('255, 255, 255');
  expect(style.shadow).not.toBe('none');
  expect(style.outline).toBe('none');
  expect(style.border).toBe('0px');
});

test('repeated page visits do not duplicate handlers or leave physics frames running', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__rafFrames = 0;
    const original = requestAnimationFrame;
    window.requestAnimationFrame = callback => { window.__rafFrames++; return original(callback); };
  });
  await page.goto('');
  for (let i = 0; i < 4; i++) {
    await page.locator('#skills-container').scrollIntoViewIfNeeded();
    await expect(page.locator('#skills-container')).toHaveClass(/physics-active/);
    await page.locator('.project-card').first().click();
    await loaded(page);
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', i % 2 ? 'light' : 'dark');
    await page.keyboard.press('/');
    await expect(page.locator('#term-input')).toBeFocused();
    await page.locator('#term-input').fill('help');
    await page.keyboard.press('Enter');
    await expect(page.locator('#term-history .term-line')).toHaveCount(2);
    await page.keyboard.press('Escape');
    await expect(page.locator('#terminal-dialog')).not.toBeVisible();
    await page.locator('.back-link').click();
    await loaded(page);
  }
  await page.locator('.project-card').first().click();
  await loaded(page);
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.__rafFrames);
    await page.waitForTimeout(250);
    return await page.evaluate(() => window.__rafFrames) - before;
  }).toBe(0);
  expect(errors).toEqual([]);
});

test('internal page and language visits keep one document and one application instance', async ({ page }) => {
  await page.addInitScript(() => { Object.assign(window, { __navigationSentinel: Math.random() }); });
  await page.goto('');
  const initial = await page.evaluate(() => (window as unknown as { __navigationSentinel: number }).__navigationSentinel);
  await page.locator('.project-card').first().click();
  await loaded(page);
  await page.locator('.back-link').click();
  await loaded(page);
  await page.locator('.project-card').nth(1).click();
  await loaded(page);
  await page.locator('#lang-toggle').click();
  await page.locator('.lang-option[hreflang="ja"]').click();
  await loaded(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  expect(await page.evaluate(() => (window as unknown as { __navigationSentinel: number }).__navigationSentinel)).toBe(initial);
});

test('a newer asset version safely uses native navigation instead of mixing deployments', async ({ page }) => {
  let nativeRequest = false;
  await page.goto('');
  await page.route('**/projects/posture-alert/', async route => {
    if (route.request().resourceType() === 'fetch') {
      const response = await route.fetch();
      const body = (await response.text()).replace(/(href="[^"]+\.css)"/, '$1?new-deployment"');
      await route.fulfill({ response, body });
    } else { nativeRequest = true; await route.continue(); }
  });
  await page.locator('.project-card').first().click();
  await expect(page.locator('.project-title')).toHaveText(messages['proj-pa-title'].en);
  await loaded(page);
  expect(nativeRequest).toBe(true);
});

test('refresh waits for page styles before measuring a saved scroll anchor', async ({ page }) => {
  await page.goto('projects/posture-alert/');
  await page.locator('.cert-grid').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  let release!: () => void;
  const styles = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*.css', async route => { await styles; await route.continue(); });
  await page.reload({ waitUntil: 'commit' });
  release();
  await page.waitForLoadState('load');
  await loaded(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
});
