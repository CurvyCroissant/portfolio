import { motionDuration } from './motion';

/** Translate existing nodes so media, scroll containers and enhancements retain identity. */
export async function translatePage(incoming: Document, signal: AbortSignal, commit: () => void) {
  const collect = (doc: Document) => {
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (node.textContent?.trim() && !node.parentElement?.closest('script, style, .skill-pill, [role="status"], #lightbox')) nodes.push(node);
    }
    return nodes;
  };
  const old = collect(document), next = collect(incoming);
  if (old.length !== next.length) throw new Error('Translation structure mismatch');
  const targets = old.flatMap((node, i) => {
    if (node.textContent === next[i].textContent) return [];
    const span = document.createElement('span');
    span.className = 'translation-text';
    node.replaceWith(span); span.append(node);
    return [{ span, node, text: next[i].textContent, width: span.getBoundingClientRect().width }];
  });
  const containers = [...document.querySelectorAll<HTMLElement>('main > section, .list-item, .cert-card, .project-card, .main-footer, .control, .project-content-grid, .content-block, .project-meta, .cert-info, .social-links')];
  const held = containers.map(el => ({ el, height: el.style.height, overflow: el.style.overflow, bounds: el.getBoundingClientRect() }));
  const animations: Animation[] = [];
  const duration = motionDuration('text') / 2;
  const run = async (enter: boolean) => {
    for (const target of targets) {
      const rect = target.span.getBoundingClientRect();
      const singleLine = rect.height <= parseFloat(getComputedStyle(target.span).lineHeight) + 1;
      if (rect.bottom < 0 || rect.top > innerHeight || !rect.width) continue;
      animations.push(target.span.animate([
        { clipPath: enter ? 'inset(0 100% 0 0)' : 'inset(0)', translate: enter ? '-8px 0' : '0 0', ...(enter && singleLine ? { width: `${target.width}px`, whiteSpace: 'nowrap' } : {}) },
        { clipPath: enter ? 'inset(0)' : 'inset(0 100% 0 0)', translate: enter ? '0 0' : '-8px 0', ...(enter && singleLine ? { width: `${rect.width}px`, whiteSpace: 'nowrap' } : {}) },
      ], { duration, easing: 'linear', fill: 'both' }));
    }
    await Promise.all(animations.map(a => a.finished.catch(() => {})));
  };
  const cancel = () => animations.forEach(a => a.cancel());
  signal.addEventListener('abort', cancel, { once: true });
  const originalY = scrollY;
  const originalMinHeight = document.body.style.minHeight;
  const originalAnchor = document.documentElement.style.overflowAnchor;
  let committed = false;
  try {
    document.documentElement.style.overflowAnchor = 'none';
    // A shorter translation must not let the browser clamp the current position.
    document.body.style.minHeight = `${originalY + innerHeight}px`;
    held.forEach(({el,bounds}) => { el.style.height = `${bounds.height}px`; el.style.overflow = 'clip'; });
    await run(false);
    if (signal.aborted) return;
    const y = scrollY;
    targets.forEach(({node,text}) => { node.textContent = text; });
    commit();
    committed = true;
    animations.splice(0).forEach(a => a.cancel());
    // Install incoming masks synchronously before the next painted frame.
    await run(true);
    scrollTo({ top: y, behavior: 'instant' });
  } finally {
    cancel(); signal.removeEventListener('abort', cancel);
    held.forEach(({el,height,overflow}) => { el.style.height = height; el.style.overflow = overflow; });
    targets.forEach(({span,node}) => span.replaceWith(node));
    document.documentElement.style.overflowAnchor = originalAnchor;
    if (signal.aborted && !committed) document.body.style.minHeight = originalMinHeight;
    if (!signal.aborted) scrollTo({ top: originalY, behavior: 'instant' });
  }
}
