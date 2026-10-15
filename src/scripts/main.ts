import type { ClientCopy } from '../lib/i18n';
import { setupLightbox } from './lightbox';
import { readStorage, removeStorage, updateScrollLock, writeStorage } from './preferences';

function setupTheme(copy: ClientCopy) {
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
  button.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    writeStorage('localStorage', 'theme', dark ? 'dark' : 'light');
    apply(dark);
  });
  system.addEventListener('change', () => {
    const saved = readStorage('localStorage', 'theme');
    if (saved !== 'light' && saved !== 'dark') apply(system.matches);
  });
  button.hidden = false;
}

function setupLanguages() {
  const details = document.querySelector<HTMLDetailsElement>('#lang-dropdown');
  if (!details) return;
  document.addEventListener('click', event => { if (!details.contains(event.target as Node)) details.open = false; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      details.querySelector<HTMLElement>('summary')?.focus();
    }
  });
}

function setupTerminal(copy: ClientCopy) {
  const dialog = document.querySelector<HTMLDialogElement>('#terminal-dialog');
  const input = document.querySelector<HTMLInputElement>('#term-input');
  const form = document.querySelector<HTMLFormElement>('#terminal-form');
  const history = document.querySelector('#term-history');
  const trigger = document.querySelector<HTMLButtonElement>('#term-trigger');
  const status = document.querySelector('#terminal-status');
  if (!dialog || !input || !form || !history || !trigger || typeof dialog.showModal !== 'function') return;
  let opener: HTMLElement | null = null;
  const open = () => {
    if (document.querySelector('dialog[open]')) return;
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    dialog.showModal();
    updateScrollLock();
    input.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', open);
  trigger.hidden = false;
  document.querySelector('#terminal-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    input.value = '';
    updateScrollLock();
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
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
  form.addEventListener('submit', event => {
    event.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    input.value = '';
    const command = raw.toLowerCase();
    if (command === 'exit') { dialog.close(); return; }
    if (command === 'clear') {
      history.replaceChildren();
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

function setupCopy(copy: ClientCopy) {
  const button = document.querySelector<HTMLButtonElement>('#copy-email');
  const status = document.querySelector('#copy-status');
  const email = button?.dataset.email;
  if (!button || !status || !email) return;
  let busy = false;
  let timer: ReturnType<typeof setTimeout>;
  button.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    let success = false;
    try {
      if (navigator.clipboard && isSecureContext) { await navigator.clipboard.writeText(email); success = true; }
    } catch { /* Try the selection-based fallback below. */ }
    if (!success) success = await fallbackCopy(email);
    clearTimeout(timer);
    status.textContent = copy[success ? 'copied' : 'copy-error'];
    timer = setTimeout(() => { status.textContent = ''; }, 3000);
    busy = false;
  });
  button.hidden = false;
}

function setupScrollRestoration() {
  const key = `portfolio-scroll:${document.documentElement.lang}`;
  if (document.querySelector('[data-page="home"]')) {
    const saved = readStorage('sessionStorage', key);
    if (saved !== null) {
      const top = Number(saved);
      if (Number.isFinite(top) && top >= 0) requestAnimationFrame(() => scrollTo({ top, behavior: 'auto' }));
      removeStorage('sessionStorage', key);
    }
  }
  document.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', () => writeStorage('sessionStorage', key, String(scrollY))));
}

function setupReveals() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches) continue;
      const animation = entry.target.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }
  }, { threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  reduced.addEventListener('change', () => { if (reduced.matches) animations.forEach(animation => animation.cancel()); });
}

function setupSkills() {
  const container = document.querySelector<HTMLElement>('#skills-container');
  if (!container) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose: (() => void) | undefined;
  let loading = false;
  const start = async () => {
    if (reduced.matches || dispose || loading) return;
    loading = true;
    try {
      const { setupPhysics } = await import('./skills-physics');
      if (!reduced.matches) {
        const cleanup = await setupPhysics(container);
        if (reduced.matches) cleanup(); else dispose = cleanup;
      }
    } catch { /* The static list remains fully usable if the enhancement fails. */ }
    finally { loading = false; }
  };
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) void start(); }, { rootMargin: '200px' });
  observer.observe(container);
  reduced.addEventListener('change', () => {
    if (reduced.matches) { dispose?.(); dispose = undefined; }
    else { const bounds = container.getBoundingClientRect(); if (bounds.top < innerHeight + 200 && bounds.bottom > -200) void start(); }
  });
}

function initialize() {
  const payload = document.querySelector('#site-copy')?.textContent;
  if (!payload) return;
  const copy: ClientCopy = JSON.parse(payload);
  setupTheme(copy);
  setupLanguages();
  setupTerminal(copy);
  setupCopy(copy);
  setupLightbox(copy);
  setupScrollRestoration();
  setupReveals();
  setupSkills();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
