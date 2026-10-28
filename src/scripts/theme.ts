import type { ClientCopy } from '../lib/i18n';
import type { PageScope } from './lifecycle';
import { motionDuration, motionEase, reducedMotion } from './motion';
import { readStorage, writeStorage } from './preferences';

const groups = [
  ['bg', 'ambient-a', 'ambient-b', 'ambient-c', 'page-light'],
  ['surface', 'surface-solid', 'glass', 'glass-solid', 'glass-panel', 'hover', 'accent-soft', 'border', 'glint', 'sheen', 'shadow-tone', 'shadow-deep', 'rim-bottom'],
  ['text', 'secondary', 'visited', 'accent'],
] as const;
const tokens = groups.flat();

/** One palette clock: background first, surfaces second, all glyph colors last. */
export function setupTheme(copy: ClientCopy, scope: PageScope) {
  const root = document.documentElement;
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle');
  const label = document.querySelector('#theme-label');
  if (!button || !label) return;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let animation: Animation | undefined;
  let revision = 0;
  const clean = () => {
    delete root.dataset.themeChanging;
  };
  const colors = () => {
    const style = getComputedStyle(root);
    return Object.fromEntries(tokens.map(token => [`--${token}`, style.getPropertyValue(`--${token}`).trim()]));
  };
  const labels = (dark: boolean) => {
    const text = copy[dark ? 'nav-theme-light' : 'nav-theme-dark'];
    if (label.textContent !== text) {
      const node = label.querySelector('.translation-text')?.firstChild ?? label.firstChild;
      if (node?.nodeType === Node.TEXT_NODE) node.textContent = text;
      else label.textContent = text;
    }
    label.setAttribute('data-measure', copy['nav-theme-light']);
    button.setAttribute('aria-label', copy[dark ? 'theme-to-light' : 'theme-to-dark']);
  };
  const apply = (dark: boolean, animate = false) => {
    const before = colors();
    revision++;
    const ticket = revision;
    animation?.cancel(); animation = undefined;
    root.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#292929' : '#ececec');
    labels(dark);
    const phase = motionDuration('theme-phase');
    if (!animate || !phase) { clean(); return; }
    const after = colors();
    root.dataset.themeChanging = '';
    const frames: Keyframe[] = [0, 1, 2, 3].map(step => ({
      offset: step / 3, easing: motionEase(),
      ...Object.fromEntries(groups.flatMap((group, index) => group.map(token => [`--${token}`, (index < step ? after : before)[`--${token}`]]))),
    }));
    animation = root.animate(frames, { duration: phase * 3, fill: 'both', easing: 'linear' });
    animation.id = 'portfolio-theme';
    void animation.finished.then(() => {
      if (ticket !== revision) return;
      animation?.cancel(); animation = undefined; clean();
    }, () => {});
  };
  // Surface nodes may also own direct text; its foreground paint still follows
  // the shared text tokens in phase three rather than inheriting a depth delay.
  document.body.dataset.themeGroup = 'background';
  document.body.querySelectorAll('*').forEach(element => {
    element.setAttribute('data-theme-group', element.matches('h1,h2,h3,h4,p,dt,dd,time,svg,svg *,span:not(.media-frame)') ? 'text' : 'components');
  });
  scope.add(() => { revision++; animation?.cancel(); clean(); });
  scope.on(reducedMotion, 'change', () => { if (reducedMotion.matches) animation?.finish(); });
  apply(root.dataset.theme === 'dark');
  scope.on(document, 'portfolio:language' as keyof DocumentEventMap, () => labels(root.dataset.theme === 'dark'));
  scope.on(button, 'click', () => {
    const dark = root.dataset.theme !== 'dark';
    writeStorage('localStorage', 'theme', dark ? 'dark' : 'light');
    apply(dark, true);
  });
  scope.on(system, 'change', () => {
    const saved = readStorage('localStorage', 'theme');
    if (saved !== 'light' && saved !== 'dark') apply(system.matches, true);
  });
  button.hidden = false;
}
