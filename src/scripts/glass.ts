import type { PageScope } from './lifecycle';

/** Page-wide ambient light and nested material reflections, scheduled only on input. */
export function setupGlass(scope: PageScope) {
  const actions = '.control, .repo-link, .proof-link, .social-link, .project-card, .cert-card';
  const materials = `${actions}, .lang-menu, .lang-option, .list-item, .skills-container, .skill-pill, .content-block, .project-meta, .main-footer`;
  // Offscreen actions need no compositor layer. Navigation and the main skills
  // material stay eager; content actions acquire blur just before entering view.
  const deferred = document.querySelectorAll<HTMLElement>('.proof-link, .repo-link, .social-link');
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.toggleAttribute('data-glass-visible', entry.isIntersecting));
  }, { rootMargin: '100px' });
  deferred.forEach(element => visibility.observe(element));
  let lit = new Set<HTMLElement>();
  let pressed: HTMLElement | null = null;
  let frame: number | undefined;
  let releaseTimer: ReturnType<typeof setTimeout>;
  let pointer: { x: number; y: number; target: Element } | undefined;
  const reset = (element: HTMLElement) => {
    element.style.removeProperty('--glass-x'); element.style.removeProperty('--glass-y');
    element.removeAttribute('data-glass-lit');
  };
  const clearLight = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined; pointer = undefined;
    lit.forEach(reset); lit.clear();
    document.body.removeAttribute('data-cursor-active');
    document.body.style.removeProperty('--page-x'); document.body.style.removeProperty('--page-y');
  };
  const release = () => {
    clearTimeout(releaseTimer);
    pressed?.removeAttribute('data-glass-pressed'); pressed = null;
  };
  scope.on(document, 'pointermove', event => {
    if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
    pointer = { x: event.clientX, y: event.clientY, target: event.target };
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      if (!pointer || !pointer.target.isConnected) return;
      const { x, y, target } = pointer;
      const next = new Set<HTMLElement>();
      for (let node: Element | null = target; node && node !== document.body; node = node.parentElement) {
        if (node instanceof HTMLElement && node.matches(materials)) next.add(node);
      }
      // Read all geometry before changing light positions.
      const bounds = [...next].map(element => ({ element, rect: element.getBoundingClientRect() }));
      lit.forEach(element => { if (!next.has(element)) reset(element); });
      for (const { element, rect } of bounds) {
        element.style.setProperty('--glass-x', `${Math.max(0, Math.min(100, (x - rect.left) / (rect.width || 1) * 100))}%`);
        element.style.setProperty('--glass-y', `${Math.max(0, Math.min(100, (y - rect.top) / (rect.height || 1) * 100))}%`);
        element.setAttribute('data-glass-lit', '');
      }
      lit = next;
      document.body.style.setProperty('--page-x', `${x / innerWidth * 100}%`);
      document.body.style.setProperty('--page-y', `${y / innerHeight * 100}%`);
      document.body.setAttribute('data-cursor-active', '');
    });
  }, { passive: true });
  scope.on(document, 'pointerout', event => { if (event.relatedTarget === null) clearLight(); });
  scope.on(document, 'pointerdown', event => {
    if (event.button !== 0 || !(event.target instanceof Element)) return;
    release(); pressed = event.target.closest<HTMLElement>(actions);
    pressed?.setAttribute('data-glass-pressed', '');
  }, { passive: true });
  scope.on(document, 'pointerup', () => { releaseTimer = setTimeout(release, 120); }, { passive: true });
  scope.on(document, 'pointercancel', () => { release(); clearLight(); }, { passive: true });
  scope.on(document, 'portfolio:before-navigation' as keyof DocumentEventMap, () => { release(); clearLight(); });
  scope.on(window, 'blur', () => { release(); clearLight(); });

  scope.add(() => {
    visibility.disconnect();
    deferred.forEach(element => element.removeAttribute('data-glass-visible'));
    release(); clearLight();
  });
}
