import type { ClientCopy } from '../lib/i18n';
import { updateScrollLock } from './preferences';
import type { PageScope } from './lifecycle';
import { motionDuration, motionEase, reducedMotion } from './motion';

export function setupLightbox(copy: ClientCopy, scope: PageScope) {
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
  const stage = document.querySelector<HTMLElement>('#lightbox-stage');
  const media = document.querySelector<HTMLElement>('#lightbox-media');
  const image = document.querySelector<HTMLImageElement>('#lightbox-image');
  const title = document.querySelector('#lightbox-title');
  const status = document.querySelector<HTMLElement>('#lightbox-status');
  const loader = document.querySelector<HTMLElement>('#lightbox-loader');
  if (!dialog || !stage || !media || !image || !title || !status || !loader || typeof dialog.showModal !== 'function') return;

  let opener: HTMLAnchorElement | null = null;
  let rotation = 0, zoom = 1, panX = 0, panY = 0, fit = 1;
  let naturalWidth = 1, naturalHeight = 1, width = 1, height = 1;
  let bounds = stage.getBoundingClientRect();
  let frame: number | undefined, animation: Animation | undefined;
  let closing = false, request = 0, moved = false;
  const pointers = new Map<number, { x: number; y: number; startX: number; startY: number }>();
  let pinch = { distance: 1, zoom: 1, x: 0, y: 0, panX: 0, panY: 0 };
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const rotated = () => Math.abs(rotation % 180) === 90;
  const transform = (x = panX, y = panY, scaleX = zoom, scaleY = scaleX) => `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`;
  const stopAnimation = () => { animation?.cancel(); animation = undefined; };
  const render = () => {
    frame = undefined;
    panX = clamp(panX, -Math.max(0, (width * zoom - bounds.width) / 2), Math.max(0, (width * zoom - bounds.width) / 2));
    panY = clamp(panY, -Math.max(0, (height * zoom - bounds.height) / 2), Math.max(0, (height * zoom - bounds.height) / 2));
    media.style.transform = transform();
    media.style.cursor = zoom > 1 ? (pointers.size ? 'grabbing' : 'grab') : 'grab';
  };
  const requestRender = () => { if (frame === undefined) frame = requestAnimationFrame(render); };
  const fitImage = () => {
    if (!dialog.open || closing) return;
    bounds = stage.getBoundingClientRect();
    const w = rotated() ? naturalHeight : naturalWidth;
    const h = rotated() ? naturalWidth : naturalHeight;
    fit = Math.min(bounds.width * .9 / w, bounds.height * .9 / h, 1);
    width = w * fit; height = h * fit;
    media.style.width = `${width}px`;
    media.style.height = `${height}px`;
    image.style.width = `${naturalWidth * fit}px`;
    image.style.height = `${naturalHeight * fit}px`;
    image.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    render();
  };
  const originTransform = () => {
    const thumbnail = opener?.querySelector('.media-frame') ?? opener;
    const origin = thumbnail?.getBoundingClientRect();
    if (!origin) return transform(0, 0, .94);
    return transform(origin.left + origin.width / 2 - bounds.left - bounds.width / 2, origin.top + origin.height / 2 - bounds.top - bounds.height / 2, origin.width / width, origin.height / height);
  };
  const close = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    request++;
    const currentTransform = getComputedStyle(media).transform;
    stopAnimation();
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    media.style.transition = 'none';
    dialog.dataset.closing = '';
    const duration = motionDuration('dialog');
    if (duration) {
      animation = media.animate([{ transform: currentTransform, opacity: 1, borderRadius: getComputedStyle(media).borderRadius }, { transform: originTransform(), opacity: 0, borderRadius: opener?.dataset.mediaKind === 'portrait' ? '50%' : '12px' }], { duration, easing: motionEase(), fill: 'forwards' });
      await animation.finished.catch(() => {});
    }
    if (dialog.open) dialog.close();
  };
  scope.on(dialog, 'cancel', event => { event.preventDefault(); void close(); });
  scope.on(dialog, 'close', () => {
    stopAnimation();
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    pointers.clear();
    image.onload = null; image.onerror = null;
    image.removeAttribute('src'); image.hidden = true;
    delete dialog.dataset.closing;
    dialog.classList.remove('media-failed');
    closing = false;
    request++;
    updateScrollLock();
    opener?.focus({ preventScroll: true });
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]').forEach(trigger => scope.on(trigger, 'click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    opener = trigger;
    trigger.dataset.clicked = '';
    const preview = trigger.querySelector<HTMLImageElement>('img.media-preview, img');
    const previewURL = trigger.dataset.preview || preview?.currentSrc || preview?.src;
    loader.style.backgroundImage = previewURL ? `url("${previewURL}")` : '';
    // Commit action state before the modal makes the rest of the document inert.
    trigger.setAttribute('data-viewed', 'true');
    const currentRequest = ++request;
    closing = false; moved = false;
    rotation = Number(trigger.dataset.rotation) || 0; zoom = 1; panX = panY = 0;
    naturalWidth = Number(trigger.dataset.mediaWidth) || 640;
    naturalHeight = Number(trigger.dataset.mediaHeight) || 440;
    title.textContent = trigger.dataset.title ?? trigger.textContent?.trim() ?? '';
    image.alt = title.textContent;
    image.hidden = true;
    media.dataset.mediaState = 'loading'; media.setAttribute('aria-busy', 'true');
    media.style.transition = 'none';
    media.style.borderRadius = '12px';
    status.textContent = copy['image-loading'];
    dialog.showModal(); updateScrollLock();
    fitImage();
    const duration = motionDuration('dialog');
    if (duration) animation = media.animate([{ transform: originTransform(), opacity: .5, borderRadius: trigger.dataset.mediaKind === 'portrait' ? '50%' : '12px' }, { transform: transform(), opacity: 1, borderRadius: '12px' }], { duration, easing: motionEase() });
    const fail = () => {
      if (request !== currentRequest || !dialog.open || closing) return;
      status.textContent = copy['image-error'];
      media.dataset.mediaState = 'error'; media.setAttribute('aria-busy', 'false');
      dialog.classList.add('media-failed');
      image.hidden = true;
    };
    image.onload = async () => {
      try { await image.decode(); } catch { fail(); return; }
      if (request !== currentRequest || !dialog.open || closing) return;
      naturalWidth = image.naturalWidth; naturalHeight = image.naturalHeight;
      fitImage();
      image.hidden = false;
      media.dataset.mediaState = 'ready'; media.setAttribute('aria-busy', 'false');
      status.textContent = '';
    };
    image.onerror = fail;
    image.src = trigger.href;
  }));

  const point = (x: number, y: number) => ({ x: x - bounds.left - bounds.width / 2, y: y - bounds.top - bounds.height / 2 });
  const setZoom = (value: number, x = 0, y = 0, smooth = true) => {
    if (image.hidden || closing) return;
    stopAnimation();
    media.style.transition = smooth ? `transform ${motionDuration('zoom')}ms ease-out` : 'none';
    const next = clamp(value, 1, 4), ratio = next / zoom;
    panX = x - (x - panX) * ratio; panY = y - (y - panY) * ratio;
    zoom = next;
    requestRender();
  };
  scope.on(stage, 'wheel', event => {
    if (!dialog.open || closing) return;
    event.preventDefault();
    const cursor = point(event.clientX, event.clientY);
    setZoom(zoom + (event.deltaY < 0 ? .15 : -.15), cursor.x, cursor.y);
  }, { passive: false });
  scope.on(stage, 'dblclick', event => {
    const box = media.getBoundingClientRect();
    if (image.hidden || event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) return;
    const cursor = point(event.clientX, event.clientY);
    setZoom(zoom > 1 ? 1 : 2, cursor.x, cursor.y);
  });
  scope.on(stage, 'pointerdown', event => {
    if (closing || event.button > 0) return;
    if (!pointers.size) moved = false;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY });
    stage.setPointerCapture(event.pointerId);
    if (zoom > 1) { stopAnimation(); media.style.transition = 'none'; }
    if (pointers.size === 2) {
      moved = true;
      stopAnimation(); media.style.transition = 'none';
      const [a, b] = [...pointers.values()];
      const center = point((a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom, x: center.x, y: center.y, panX, panY };
    }
  });
  scope.on(stage, 'pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous || closing) return;
    if (Math.hypot(event.clientX - previous.startX, event.clientY - previous.startY) > 4) moved = true;
    pointers.set(event.pointerId, { ...previous, x: event.clientX, y: event.clientY });
    if (pointers.size === 2 && !image.hidden) {
      const [a, b] = [...pointers.values()];
      const center = point((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoom = clamp(pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance, 1, 4);
      const ratio = zoom / pinch.zoom;
      panX = center.x - (pinch.x - pinch.panX) * ratio; panY = center.y - (pinch.y - pinch.panY) * ratio;
    } else if (zoom > 1) { panX += event.clientX - previous.x; panY += event.clientY - previous.y; }
    if (moved && zoom > 1) requestRender();
  });
  const release = (event: PointerEvent) => { pointers.delete(event.pointerId); if (!pointers.size && zoom > 1) requestRender(); };
  scope.on(stage, 'pointerup', release);
  scope.on(stage, 'pointercancel', release);
  scope.on(stage, 'lostpointercapture', release);
  // Pointer capture retargets clicks to the stage; use coordinates to distinguish the image.
  scope.on(stage, 'click', event => {
    const box = media.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (!moved && (outside || image.hidden)) void close();
  });
  scope.on(document, 'keydown', event => {
    if (!dialog.open || closing || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + .25); }
    if (event.key === '-') { event.preventDefault(); setZoom(zoom - .25); }
    if (event.key === '0') { event.preventDefault(); panX = panY = 0; setZoom(1); }
  });
  const resize = new ResizeObserver(fitImage);
  resize.observe(stage);
  scope.add(() => {
    request++; closing = true;
    stopAnimation(); resize.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    image.onload = image.onerror = null; image.removeAttribute('src');
    if (dialog.open) dialog.close();
    updateScrollLock();
  });
  scope.on(reducedMotion, 'change', () => { if (reducedMotion.matches) animation?.finish(); });
}
