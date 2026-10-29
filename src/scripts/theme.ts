import type { ClientCopy } from '../lib/i18n';
import type { PageScope } from './lifecycle';
import { motionDuration, motionEase } from './motion';
import { writeStorage } from './preferences';

const tokens = ['bg', 'ambient-a', 'ambient-b', 'ambient-c', 'page-light',
  'surface', 'surface-solid', 'glass', 'glass-solid', 'glass-panel', 'hover', 'accent-soft',
  'border', 'glint', 'sheen', 'shadow-tone', 'shadow-deep', 'rim-bottom',
  'text', 'secondary', 'visited', 'accent', 'heading', 'heading-edge', 'text-hover', 'text-shadow'] as const;

/** All palette tokens share one clock, including an interrupted switch's current paint. */
export function setupTheme(copy: ClientCopy, scope: PageScope) {
  const root = document.documentElement;
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle');
  const label = document.querySelector('#theme-label');
  if (!button || !label) return;
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b0b0b' : '#ececec');
    labels(dark);
    if (!animate) { clean(); return; }
    const after = colors();
    root.dataset.themeChanging = '';
    animation = root.animate([before, after], { duration: motionDuration('color'), fill: 'both', easing: motionEase() });
    animation.id = 'portfolio-theme';
    void animation.finished.then(() => {
      if (ticket !== revision) return;
      animation?.cancel(); animation = undefined; clean();
    }, () => {});
  };
  scope.add(() => { revision++; animation?.cancel(); clean(); });
  apply(root.dataset.theme === 'dark');
  scope.on(document, 'portfolio:language' as keyof DocumentEventMap, () => labels(root.dataset.theme === 'dark'));
  scope.on(button, 'click', () => {
    const dark = root.dataset.theme !== 'dark';
    writeStorage('localStorage', 'theme', dark ? 'dark' : 'light');
    apply(dark, true);
  });
  button.hidden = false;
}
