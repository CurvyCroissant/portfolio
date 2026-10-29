import { motionDuration } from './motion';

/** Translate stable nodes, then resize the entire incoming layout on one clock. */
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
  const duration = motionDuration('text') / 2;
  const originalY = scrollY;
  if (!duration) {
    old.forEach((node, index) => { node.textContent = next[index].textContent; });
    commit();
    scrollTo({ top: Math.min(originalY, document.documentElement.scrollHeight - innerHeight), behavior: 'instant' });
    return;
  }
  const selector = 'main, main section, main article, main h1, main h2, main h3, main p, main dl, main dt, main dd, main div, .main-footer, .footer-content, .social-links, .email-item, .email-row, .control, .social-link, .proof-link, .repo-link, .project-card, .cert-card';
  const measure = (element: HTMLElement) => {
    const css = getComputedStyle(element);
    // Layout coordinates exclude hover, reveal and physics transforms.
    const origin = (node: HTMLElement | null) => {
      let x = 0, y = 0;
      for (let current = node; current; current = current.offsetParent as HTMLElement | null) { x += current.offsetLeft; y += current.offsetTop; }
      return { x, y };
    };
    const self = origin(element), parent = origin(element.parentElement);
    return { height: parseFloat(css.height), x: self.x - parent.x, y: self.y - parent.y };
  };
  const boxes = [...document.querySelectorAll<HTMLElement>(selector)].filter(element => element.getClientRects().length && element.offsetHeight > 0).map(element => {
    const reveal = element.getAnimations().find(animation => animation.id === 'portfolio-reveal');
    const pose = reveal ? getComputedStyle(element).transform : undefined;
    const opacity = reveal ? getComputedStyle(element).opacity : undefined;
    reveal?.cancel();
    element.removeAttribute('data-reveal-active');
    return { element, before: measure(element), after: { height: 0, x: 0, y: 0 },
      height: element.style.height, overflow: element.style.overflow, transform: element.style.transform, opacity: element.style.opacity, pose, revealOpacity: opacity };
  });
  const originalMinHeight = document.body.style.minHeight;
  const originalAnchor = document.documentElement.style.overflowAnchor;
  const beforeBodyHeight = document.body.getBoundingClientRect().height;
  const glyphPosition = (element: SVGSVGElement) => {
    const rect = element.getBoundingClientRect(), parent = element.parentElement!.getBoundingClientRect();
    return { x: rect.left - parent.left, y: rect.top - parent.top };
  };
  const glyphs = [...document.querySelectorAll<SVGSVGElement>('main svg, .main-footer svg')].map(element => ({ element, before: glyphPosition(element) }));
  const targets = old.flatMap((node, index) => {
    if (node.textContent === next[index].textContent) return [];
    const span = document.createElement('span');
    span.className = 'translation-text';
    // Headings with trailing glyphs must retain native inline line wrapping.
    const mixed = !!node.parentElement?.querySelector(':scope > svg') && getComputedStyle(node.parentElement).display !== 'inline-flex';
    if (mixed) span.style.display = 'inline';
    node.replaceWith(span); span.append(node);
    const css = getComputedStyle(span);
    return [{ span, paint: mixed ? span.parentElement! : span, mixed, node, text: next[index].textContent, width: parseFloat(css.width), singleLine: span.offsetHeight <= parseFloat(css.lineHeight) + 1 }];
  });
  const animations: Animation[] = [];
  const cancel = () => animations.forEach(animation => animation.cancel());
  const animate = (element: Element, frames: Keyframe[], id: string) => {
    const animation = element.animate(frames, { duration, easing: 'linear', fill: 'both' });
    animation.id = id; animation.pause(); animation.currentTime = 0;
    animations.push(animation);
    return animation;
  };
  const playTogether = async () => {
    const start = document.timeline.currentTime;
    for (const animation of animations) { animation.play(); if (start !== null) animation.startTime = start; }
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  };
  const restoreBoxes = () => boxes.forEach(({element, height, overflow, transform, opacity}) => {
    element.style.height = height; element.style.overflow = overflow;
    element.style.transform = transform; element.style.opacity = opacity;
    element.removeAttribute('data-layout-held');
  });
  const holdBoxes = () => boxes.forEach(({element, before, pose, revealOpacity}) => {
    element.setAttribute('data-layout-held', '');
    element.style.height = `${before.height}px`; element.style.overflow = 'clip';
    if (pose) element.style.transform = pose;
    if (revealOpacity) element.style.opacity = revealOpacity;
  });
  signal.addEventListener('abort', cancel, { once: true });
  document.documentElement.dataset.languageLayout = '';
  document.documentElement.style.overflowAnchor = 'none';
  try {
    holdBoxes();
    document.body.style.minHeight = `${beforeBodyHeight}px`;
    for (const {span, paint} of targets) {
      const rect = span.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight || !rect.width) continue;
      animate(paint, [{ clipPath: 'inset(0)' }, { clipPath: 'inset(0 100% 0 0)' }], 'portfolio-language-out');
    }
    await playTogether();
    if (signal.aborted) return;
    targets.forEach(({node, text}) => { node.textContent = text; });
    commit();
    cancel(); animations.length = 0;
    restoreBoxes(); document.body.style.minHeight = originalMinHeight;
    // Measure the actual final DOM, without wrappers affecting line wrapping or baselines.
    targets.forEach(({span, node}) => span.replaceWith(node));
    for (const box of boxes) box.after = measure(box.element);
    const afterBodyHeight = document.body.getBoundingClientRect().height;
    targets.forEach(({span, node}) => { node.replaceWith(span); span.append(node); });
    const widths = targets.map(target => {
      const css = getComputedStyle(target.span);
      return { width: parseFloat(css.width), singleLine: target.span.offsetHeight <= parseFloat(css.lineHeight) + 1 };
    });
    holdBoxes(); document.body.style.minHeight = `${beforeBodyHeight}px`;
    for (const [index, target] of targets.entries()) {
      const rect = target.span.getBoundingClientRect();
      const visible = rect.bottom >= 0 && rect.top <= innerHeight && rect.width > 0;
      const sizeLabel = Number.isFinite(target.width) && Number.isFinite(widths[index].width) && target.width > 0 && widths[index].width > 0 && !target.mixed && target.singleLine && widths[index].singleLine && !!target.span.closest('.control, .proof-link, .repo-link, h1, h2, h3, dt, dd, .list-date');
      // Offscreen labels still resize so their ancestors share the same layout clock.
      if (!visible && !sizeLabel) continue;
      const before: Keyframe = {}, after: Keyframe = {};
      if (visible) { before.clipPath = 'inset(0 100% 0 0)'; after.clipPath = 'inset(0)'; }
      if (sizeLabel) { before.width = `${target.width}px`; after.width = `${widths[index].width}px`; before.whiteSpace = after.whiteSpace = 'nowrap'; }
      animate(target.paint, [before, after], 'portfolio-language-in');
    }
    // Old heights and label widths are now installed. Correct only local reflows;
    // ancestor movement is already provided by the animated layout heights.
    const local = boxes.map(box => ({ box, current: measure(box.element), translate: getComputedStyle(box.element).translate }));
    const glyphLocal = glyphs.map(glyph => ({ glyph, current: glyphPosition(glyph.element) }));
    for (const {box, current, translate} of local) {
      if (box.pose) animate(box.element, [{ transform: box.pose, opacity: box.revealOpacity }, { transform: 'none', opacity: 1 }], 'portfolio-language-reveal');
      if (Math.abs(box.before.height - box.after.height) > .1) animate(box.element, [{ height: `${box.before.height}px` }, { height: `${box.after.height}px` }], 'portfolio-language-height');
      const dx = box.before.x - current.x, dy = box.before.y - current.y;
      if (Math.abs(dx) > .5 || Math.abs(dy) > .5) {
        const [x = 0, y = 0] = translate === 'none' ? [0, 0] : translate.split(' ').map(value => parseFloat(value) || 0);
        animate(box.element, [{ translate: `${x + dx}px ${y + dy}px` }, { translate: `${x}px ${y}px` }], 'portfolio-language-position');
      }
    }
    for (const {glyph, current} of glyphLocal) {
      const dx = glyph.before.x - current.x, dy = glyph.before.y - current.y;
      if (Math.abs(dx) > .5 || Math.abs(dy) > .5) animate(glyph.element, [{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], 'portfolio-language-glyph');
    }
    animate(document.body, [{ minHeight: `${beforeBodyHeight}px` }, { minHeight: `${afterBodyHeight}px` }], 'portfolio-language-range');
    await playTogether();
  } finally {
    cancel(); signal.removeEventListener('abort', cancel);
    restoreBoxes();
    targets.forEach(({span, node}) => { if (span.isConnected) span.replaceWith(node); });
    document.body.style.minHeight = originalMinHeight;
    document.documentElement.style.overflowAnchor = originalAnchor;
    delete document.documentElement.dataset.languageLayout;
    if (!signal.aborted) scrollTo({ top: Math.min(originalY, Math.max(0, document.documentElement.scrollHeight - innerHeight)), behavior: 'instant' });
  }
}
