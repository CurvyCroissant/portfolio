import type { PageScope } from './lifecycle';
import { reducedMotion } from './motion';

/** Event-driven lighting and touch feedback. No animation loop runs at rest. */
export function setupGlass(scope: PageScope) {
  const selector = '.control, .repo-link, .proof-link, .social-link, .project-card, .cert-card';
  let lit: HTMLElement | null = null;
  let pressed: HTMLElement | null = null;
  let frame: number | undefined;
  let releaseTimer: ReturnType<typeof setTimeout>;
  let point = { x: 0, y: 0 };
  const clearLight = () => {
    lit?.style.removeProperty('--glass-x'); lit?.style.removeProperty('--glass-y'); lit = null;
  };
  const release = () => {
    clearTimeout(releaseTimer);
    pressed?.removeAttribute('data-glass-pressed'); pressed = null;
  };
  scope.on(document, 'pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    const target = (event.target as Element).closest<HTMLElement>(selector);
    if (target !== lit) { clearLight(); lit = target; }
    point = { x: event.clientX, y: event.clientY };
    if (!lit || frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      if (!lit) return;
      const bounds = lit.getBoundingClientRect();
      lit.style.setProperty('--glass-x', `${Math.max(0, Math.min(100, (point.x - bounds.left) / bounds.width * 100))}%`);
      lit.style.setProperty('--glass-y', `${Math.max(0, Math.min(100, (point.y - bounds.top) / bounds.height * 100))}%`);
    });
  }, { passive: true });
  scope.on(document, 'pointerout', event => { if (lit && !(event.relatedTarget instanceof Node && lit.contains(event.relatedTarget))) clearLight(); });
  scope.on(document, 'pointerdown', event => {
    if (event.button !== 0) return;
    release();
    pressed = (event.target as Element).closest<HTMLElement>(selector);
    pressed?.setAttribute('data-glass-pressed', '');
  }, { passive: true });
  scope.on(document, 'pointerup', () => { releaseTimer = setTimeout(release, 120); }, { passive: true });
  scope.on(document, 'pointercancel', release, { passive: true });
  scope.on(document, 'portfolio:before-navigation' as keyof DocumentEventMap, () => { release(); clearLight(); });
  scope.on(window, 'blur', () => { release(); clearLight(); });
  scope.add(() => { if (frame !== undefined) cancelAnimationFrame(frame); release(); clearLight(); });
}
