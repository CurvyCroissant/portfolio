import type { ClientCopy } from '../lib/i18n';
import { PageScope } from './lifecycle';
import { setupNavigation } from './navigation';
import { motionDuration, motionEase } from './motion';
import { setupGlass } from './glass';
import { setupTheme } from './theme';

function setupLanguages(scope: PageScope) {
  const details = document.querySelector<HTMLDetailsElement>('#lang-dropdown');
  const toggle = details?.querySelector<HTMLElement>('summary');
  const panel = details?.querySelector<HTMLElement>('.lang-menu');
  if (!details || !toggle || !panel) return;
  let hovered = false, restoringFocus = false;
  let animation: Animation | undefined;
  let revision = 0;
  panel.inert = !details.open;
  const present = (opening: boolean, restoreFocus = false) => {
    if (restoreFocus) {
      restoringFocus = true; toggle.focus({ preventScroll: true }); restoringFocus = false;
    }
    if (opening && details.open && details.dataset.menuState === 'open') return;
    if (!opening && (!details.open || details.dataset.menuState === 'closing')) return;
    const ticket = ++revision;
    const visible = details.open;
    const style = visible ? getComputedStyle(panel) : null;
    const from = { opacity: visible ? style!.opacity : '0', transform: visible ? style!.transform : 'translateY(-10px) scale(.92)' };
    animation?.cancel();
    details.dataset.menuState = opening ? 'open' : 'closing';
    details.open = true;
    panel.inert = !opening;
    const finish = () => {
      if (ticket !== revision) return;
      animation?.cancel(); animation = undefined;
      if (!opening) { details.open = false; delete details.dataset.menuState; }
    };
    const duration = motionDuration('menu');
    if (!duration) { finish(); return; }
    animation = panel.animate([from, { opacity: opening ? 1 : 0, transform: opening ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(.94)' }], { duration, easing: motionEase(), fill: 'both' });
    void animation.finished.then(finish, () => {});
  };
  const close = (restoreFocus = false) => { hovered = false; present(false, restoreFocus); };
  scope.on(details, 'toggle', () => { panel.inert = !details.open || details.dataset.menuState === 'closing'; });
  scope.on(details, 'focusin', event => { if (!restoringFocus && event.target === toggle && toggle.matches(':focus-visible')) present(true); });
  scope.on(details, 'focusout', event => { if (event.relatedTarget instanceof Node && !details.contains(event.relatedTarget)) close(); });
  scope.on(details, 'pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; present(true); } });
  scope.on(details, 'pointerleave', event => { if (event.pointerType === 'mouse') close(panel.contains(document.activeElement)); });
  scope.on(details, 'pointerdown', event => { if (event.pointerType === 'touch') hovered = false; });
  scope.on(toggle, 'click', event => {
    event.preventDefault();
    if (hovered && event.detail > 0) present(true);
    else if (details.open && details.dataset.menuState !== 'closing') close();
    else present(true);
  });
  scope.on(details, 'keydown', event => {
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && event.target === toggle) {
      event.preventDefault(); present(true);
      const options = panel.querySelectorAll<HTMLElement>('a[href]');
      (event.key === 'ArrowDown' ? options[0] : options[options.length - 1])?.focus();
    }
  });
  scope.on(details, 'click', event => { if ((event.target as Element).closest('a')) close(true); });
  scope.on(document, 'click', event => { if (!details.contains(event.target as Node)) close(); });
  scope.on(document, 'portfolio:before-navigation' as keyof DocumentEventMap, () => close());
  scope.on(window, 'blur', () => close());
  scope.on(document, 'visibilitychange', () => { if (document.hidden) close(); });
  scope.on(document, 'keydown', event => { if (event.key === 'Escape' && details.open) { event.preventDefault(); close(true); } });
  scope.on(matchMedia('(prefers-reduced-motion: reduce)'), 'change', event => { if (event.matches) animation?.finish(); });
  scope.add(() => { revision++; animation?.cancel(); details.open = false; delete details.dataset.menuState; });
}

function setupDeferredLightbox(copy: ClientCopy, scope: PageScope) {
  let ready = false;
  let loading: Promise<void> | undefined;
  const load = () => loading ??= import('./lightbox').then(({setupLightbox}) => {
    if (!scope.signal.aborted) { setupLightbox(copy, scope); ready = true; }
  }).catch(() => { loading = undefined; });
  scope.on(document, 'pointerover', event => { if ((event.target as Element).closest('[data-lightbox]')) void load(); });
  scope.on(document, 'focusin', event => { if ((event.target as Element).closest('[data-lightbox]')) void load(); });
  scope.on(document, 'click', event => {
    const trigger = (event.target as Element).closest<HTMLAnchorElement>('[data-lightbox]');
    if (!trigger || ready || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void load().then(() => { if (!scope.signal.aborted) { if (ready) trigger.click(); else location.assign(trigger.href); } });
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
      if (!entry.target.hasAttribute('data-reveal-pending')) continue;
      entry.target.removeAttribute('data-reveal-pending');
      if (reduced.matches || document.documentElement.hasAttribute('data-language-layout')) continue;
      const animation = entry.target.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: motionDuration('reveal'), easing: motionEase() });
      animation.id = 'portfolio-reveal';
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
  scope.on(document, 'portfolio:language' as keyof DocumentEventMap, event => Object.assign(copy, (event as CustomEvent).detail));
  setupTheme(copy, scope);
  setupLanguages(scope);
  setupGlass(scope);
  setupCopy(copy, scope);
  setupDeferredLightbox(copy, scope);
  setupReveals(scope);
  setupSkills(scope);
  requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'));
  return scope.dispose;
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setupNavigation(initialize), { once: true });
else setupNavigation(initialize);
