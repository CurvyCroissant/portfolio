import type { ClientCopy } from '../lib/i18n';
import { setupLightbox } from './lightbox';
import { readStorage, updateScrollLock, writeStorage } from './preferences';
import { PageScope } from './lifecycle';
import { setupNavigation } from './navigation';
import { motionDuration, motionEase, reducedMotion } from './motion';

function setupTheme(copy: ClientCopy, scope: PageScope) {
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle');
  const label = document.querySelector('#theme-label');
  if (!button || !label) return;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const apply = (dark: boolean) => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a0a0a' : '#fafafa');
    label.textContent = copy[dark ? 'nav-theme-light' : 'nav-theme-dark'];
    button.setAttribute('aria-label', copy[dark ? 'theme-to-light' : 'theme-to-dark']);
  };
  apply(document.documentElement.dataset.theme === 'dark');
  scope.on(button, 'click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    writeStorage('localStorage', 'theme', dark ? 'dark' : 'light');
    apply(dark);
  });
  scope.on(system, 'change', () => {
    const saved = readStorage('localStorage', 'theme');
    if (saved !== 'light' && saved !== 'dark') apply(system.matches);
  });
  button.hidden = false;
}

function setupLanguages(scope: PageScope) {
  const details = document.querySelector<HTMLDetailsElement>('#lang-dropdown');
  if (!details) return;
  scope.on(document, 'click', event => { if (!details.contains(event.target as Node)) details.open = false; });
  scope.on(document, 'keydown', event => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      details.querySelector<HTMLElement>('summary')?.focus();
    }
  });
}

function setupTerminal(copy: ClientCopy, scope: PageScope) {
  const dialog = document.querySelector<HTMLDialogElement>('#terminal-dialog');
  const input = document.querySelector<HTMLInputElement>('#term-input');
  const form = document.querySelector<HTMLFormElement>('#terminal-form');
  const history = document.querySelector('#term-history');
  const trigger = document.querySelector<HTMLButtonElement>('#term-trigger');
  const status = document.querySelector('#terminal-status');
  if (!dialog || !input || !form || !history || !trigger || typeof dialog.showModal !== 'function') return;
  let opener: HTMLElement | null = null;
  let animation: Animation | undefined, closing = false;
  scope.add(() => { animation?.cancel(); if (dialog.open) dialog.close(); updateScrollLock(); });
  const open = () => {
    if (document.querySelector('dialog[open]')) return;
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    dialog.showModal();
    updateScrollLock();
    input.focus({ preventScroll: true });
    if (motionDuration('dialog')) animation = dialog.animate([{ opacity: 0, transform: 'translateY(20px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: motionDuration('dialog'), easing: motionEase() });
  };
  const close = async () => {
    if (closing || !dialog.open) return;
    closing = true;
    const transform = getComputedStyle(dialog).transform;
    const opacity = getComputedStyle(dialog).opacity;
    animation?.cancel();
    dialog.dataset.closing = '';
    if (motionDuration('dialog')) {
      animation = dialog.animate([{ opacity, transform }, { opacity: 0, transform: 'translateY(20px) scale(.96)' }], { duration: motionDuration('dialog'), easing: motionEase(), fill: 'forwards' });
      await animation.finished.catch(() => {});
    }
    if (dialog.open) dialog.close();
  };
  scope.on(trigger, 'click', open);
  trigger.hidden = false;
  scope.on(document.querySelector('#terminal-close'), 'click', () => { void close(); });
  scope.on(dialog, 'cancel', event => { event.preventDefault(); void close(); });
  scope.on(dialog, 'click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) void close();
  });
  scope.on(dialog, 'close', () => {
    animation?.cancel(); animation = undefined;
    closing = false;
    delete dialog.dataset.closing;
    input.value = '';
    updateScrollLock();
    opener?.focus({ preventScroll: true });
  });
  scope.on(reducedMotion, 'change', () => { if (reducedMotion.matches) animation?.finish(); });
  scope.on(document.querySelector('.terminal-body'), 'click', event => {
    if (!(event.target as HTMLElement).closest('a, button') && !getSelection()?.toString()) input.focus({ preventScroll: true });
  });
  scope.on(document, 'keydown', event => {
    const target = event.target as HTMLElement;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !target.isContentEditable && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      event.preventDefault(); open();
    }
  });
  const print = (text: string, command = false) => {
    const line = document.createElement('p');
    line.className = 'term-line';
    line.textContent = command ? `C:\\Aaron-Nathanael>${text}` : text;
    history.append(line);
    // Bound retained history without interpreting any command as HTML.
    while (history.childElementCount > 200) history.firstElementChild?.remove();
  };
  scope.on(form, 'submit', event => {
    event.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    input.value = '';
    const command = raw.toLowerCase();
    if (command === 'exit') { void close(); return; }
    if (command === 'clear') {
      history.replaceChildren();
      const intro = document.querySelector<HTMLElement>('#term-intro');
      if (intro) intro.hidden = true;
      if (status) status.textContent = copy['terminal-cleared'];
      return;
    }
    print(raw, true);
    const output = Object.hasOwn(copy.terminal, command) ? copy.terminal[command as keyof typeof copy.terminal] : copy.unknownCommand.replace('{command}', () => raw);
    print(output);
    if (status) status.textContent = copy['terminal-updated'];
    input.scrollIntoView({ block: 'nearest' });
  });
}

async function fallbackCopy(value: string): Promise<boolean> {
  const previous = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i)) : [];
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;top:0;left:-9999px;font-size:16px';
  document.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, value.length);
  let success = false;
  try { success = document.execCommand('copy'); } catch { /* Report failure instead of false success. */ }
  textarea.remove();
  if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
  if (selection) { selection.removeAllRanges(); ranges.forEach(range => selection.addRange(range)); }
  return success;
}

function setupCopy(copy: ClientCopy, scope: PageScope) {
  const button = document.querySelector<HTMLButtonElement>('#copy-email');
  const status = document.querySelector('#copy-status');
  const email = button?.dataset.email;
  if (!button || !status || !email) return;
  let busy = false;
  let timer: ReturnType<typeof setTimeout>;
  scope.add(() => clearTimeout(timer));
  scope.on(button, 'click', async () => {
    if (busy) return;
    busy = true;
    let success = false;
    try {
      if (navigator.clipboard && isSecureContext) { await navigator.clipboard.writeText(email); success = true; }
    } catch { /* Try the selection-based fallback below. */ }
    if (!success) success = await fallbackCopy(email);
    if (scope.signal.aborted) return;
    clearTimeout(timer);
    status.textContent = copy[success ? 'copied' : 'copy-error'];
    timer = setTimeout(() => { status.textContent = ''; }, 3000);
    busy = false;
  });
  button.hidden = false;
}

function setupReveals(scope: PageScope) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      entry.target.removeAttribute('data-reveal-pending');
      if (reduced.matches) continue;
      const animation = entry.target.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: motionDuration('reveal'), easing: motionEase() });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }
  }, { threshold: 0.05 });
  scope.add(() => { observer.disconnect(); animations.forEach(animation => animation.cancel()); });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    const bounds = element.getBoundingClientRect();
    // Already-visible content stays visible during startup and scroll restoration.
    if (reduced.matches || (bounds.top < innerHeight && bounds.bottom > 0)) return;
    element.dataset.revealPending = '';
    observer.observe(element);
  });
  scope.on(reduced, 'change', () => {
    if (!reduced.matches) return;
    animations.forEach(animation => animation.cancel());
    document.querySelectorAll('[data-reveal-pending]').forEach(element => element.removeAttribute('data-reveal-pending'));
  });
}

function setupSkills(scope: PageScope) {
  const container = document.querySelector<HTMLElement>('#skills-container');
  if (!container) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose: (() => void) | undefined;
  let loading = false;
  const start = async () => {
    if (scope.signal.aborted || reduced.matches || dispose || loading) return;
    loading = true;
    container.setAttribute('aria-busy', 'true');
    try {
      const { setupPhysics } = await import('./skills-physics');
      if (!scope.signal.aborted && !reduced.matches) {
        const cleanup = await setupPhysics(container);
        if (scope.signal.aborted || reduced.matches) cleanup(); else dispose = cleanup;
      }
    } catch { /* The static list remains fully usable if the enhancement fails. */ }
    finally { loading = false; container.setAttribute('aria-busy', 'false'); }
  };
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) void start(); }, { rootMargin: '200px' });
  observer.observe(container);
  scope.add(() => { observer.disconnect(); dispose?.(); });
  scope.on(reduced, 'change', () => {
    if (reduced.matches) { dispose?.(); dispose = undefined; }
    else { const bounds = container.getBoundingClientRect(); if (bounds.top < innerHeight + 200 && bounds.bottom > -200) void start(); }
  });
}

function initialize(): () => void {
  const scope = new PageScope();
  window.portfolioScroll.enhance();
  window.portfolioScroll.restoreInitial();
  const payload = document.querySelector('#site-copy')?.textContent;
  if (!payload) return scope.dispose;
  const copy: ClientCopy = JSON.parse(payload);
  setupTheme(copy, scope);
  setupLanguages(scope);
  setupTerminal(copy, scope);
  setupCopy(copy, scope);
  setupLightbox(copy, scope);
  setupReveals(scope);
  setupSkills(scope);
  requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'));
  return scope.dispose;
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setupNavigation(initialize), { once: true });
else setupNavigation(initialize);
