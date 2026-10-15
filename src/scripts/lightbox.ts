import type { ClientCopy } from '../lib/i18n';
import { updateScrollLock } from './preferences';

export function setupLightbox(copy: ClientCopy) {
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
  const stage = document.querySelector<HTMLElement>('#lightbox-stage');
  const image = document.querySelector<HTMLImageElement>('#lightbox-image');
  const title = document.querySelector('#lightbox-title');
  const status = document.querySelector<HTMLElement>('#lightbox-status');
  const original = document.querySelector<HTMLAnchorElement>('#original-image');
  const output = document.querySelector('#zoom-level');
  const plus = document.querySelector<HTMLButtonElement>('#zoom-in');
  const minus = document.querySelector<HTMLButtonElement>('#zoom-out');
  if (!dialog || !stage || !image || !title || !status || !original || !output || !plus || !minus || typeof dialog.showModal !== 'function') return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener: HTMLAnchorElement | null = null;
  let rotation = 0, zoom = 1, panX = 0, panY = 0, fit = 1;
  let bounds = stage.getBoundingClientRect();
  let frame: number | undefined;
  let animation: Animation | undefined;
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = { distance: 1, zoom: 1, x: 0, y: 0, panX: 0, panY: 0 };
  let moved = false;
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const rotated = () => Math.abs(rotation % 180) === 90;
  const transform = (x = panX, y = panY, scale = zoom) => `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
  const stopAnimation = () => { animation?.cancel(); animation = undefined; };
  const render = () => {
    frame = undefined;
    const width = (rotated() ? image.naturalHeight : image.naturalWidth) * fit * zoom;
    const height = (rotated() ? image.naturalWidth : image.naturalHeight) * fit * zoom;
    const maxX = Math.max(0, (width - bounds.width) / 2);
    const maxY = Math.max(0, (height - bounds.height) / 2);
    panX = clamp(panX, -maxX, maxX); panY = clamp(panY, -maxY, maxY);
    image.style.transform = transform();
    image.style.cursor = zoom > 1 ? (pointers.size ? 'grabbing' : 'grab') : 'zoom-in';
    output.textContent = `${Math.round(zoom * 100)}%`;
    minus.disabled = zoom <= 1;
    plus.disabled = zoom >= 4;
  };
  const requestRender = () => { if (frame === undefined) frame = requestAnimationFrame(render); };
  const fitImage = () => {
    if (!dialog.open || !image.naturalWidth || !image.naturalHeight) return;
    bounds = stage.getBoundingClientRect();
    const width = rotated() ? image.naturalHeight : image.naturalWidth;
    const height = rotated() ? image.naturalWidth : image.naturalHeight;
    fit = Math.min(bounds.width / width, bounds.height / height, 1);
    image.style.width = `${image.naturalWidth * fit}px`;
    image.style.height = `${image.naturalHeight * fit}px`;
    render();
  };
  const point = (x: number, y: number) => ({ x: x - bounds.left - bounds.width / 2, y: y - bounds.top - bounds.height / 2 });
  const setZoom = (value: number, x = 0, y = 0) => {
    if (image.hidden) return;
    stopAnimation();
    const next = clamp(value, 1, 4), ratio = next / zoom;
    panX = x - (x - panX) * ratio; panY = y - (y - panY) * ratio;
    zoom = next;
    requestRender();
  };
  plus.addEventListener('click', () => setZoom(zoom + .25));
  minus.addEventListener('click', () => setZoom(zoom - .25));
  document.querySelector('#zoom-reset')?.addEventListener('click', () => { panX = panY = 0; setZoom(1); });
  document.querySelector('#rotate-image')?.addEventListener('click', () => {
    if (image.hidden) return;
    stopAnimation(); rotation = (rotation + 90) % 360; zoom = 1; panX = panY = 0; fitImage();
  });
  document.querySelector('#lightbox-close')?.addEventListener('click', () => dialog.close());

  document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]').forEach(trigger => trigger.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    opener = trigger;
    const thumbnail = trigger.querySelector('img') ?? trigger;
    const origin = thumbnail.getBoundingClientRect();
    rotation = Number(trigger.dataset.rotation) || 0; zoom = 1; panX = panY = 0;
    title.textContent = trigger.dataset.title ?? trigger.textContent?.trim() ?? '';
    image.alt = title.textContent;
    original.href = trigger.href;
    status.textContent = copy['image-loading']; status.hidden = false; image.hidden = true;
    dialog.showModal(); updateScrollLock();
    image.onload = () => {
      if (!dialog.open) return;
      image.hidden = false; status.hidden = true; fitImage();
      if (!reduced.matches) {
        const centerX = origin.left + origin.width / 2 - bounds.left - bounds.width / 2;
        const centerY = origin.top + origin.height / 2 - bounds.top - bounds.height / 2;
        const displayedWidth = (rotated() ? image.naturalHeight : image.naturalWidth) * fit;
        animation = image.animate([{ transform: transform(centerX, centerY, origin.width / displayedWidth), opacity: .5 }, { transform: transform(), opacity: 1 }], { duration: 180, easing: 'ease-out' });
      }
    };
    image.onerror = () => { status.textContent = copy['image-error']; status.hidden = false; image.hidden = true; };
    image.src = trigger.href;
  }));
  dialog.addEventListener('close', () => {
    stopAnimation();
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    pointers.clear();
    image.onload = null; image.onerror = null;
    image.removeAttribute('src'); image.hidden = true;
    updateScrollLock();
    opener?.focus({ preventScroll: true });
  });
  stage.addEventListener('wheel', event => {
    if (!dialog.open) return;
    event.preventDefault();
    const cursor = point(event.clientX, event.clientY);
    setZoom(zoom * Math.exp(-clamp(event.deltaY, -100, 100) * .004), cursor.x, cursor.y);
  }, { passive: false });
  stage.addEventListener('dblclick', event => {
    const cursor = point(event.clientX, event.clientY);
    setZoom(zoom > 1 ? 1 : 2, cursor.x, cursor.y);
  });
  stage.addEventListener('pointerdown', event => {
    if (image.hidden || event.button > 0) return;
    stopAnimation();
    if (!pointers.size) moved = false;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const center = point((a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom, x: center.x, y: center.y, panX, panY };
    }
  });
  stage.addEventListener('pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    if (Math.hypot(event.clientX - previous.x, event.clientY - previous.y) > 2) moved = true;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const center = point((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoom = clamp(pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance, 1, 4);
      const ratio = zoom / pinch.zoom;
      panX = center.x - (pinch.x - pinch.panX) * ratio; panY = center.y - (pinch.y - pinch.panY) * ratio;
    } else if (zoom > 1) { panX += event.clientX - previous.x; panY += event.clientY - previous.y; }
    requestRender();
  });
  const release = (event: PointerEvent) => { pointers.delete(event.pointerId); if (!pointers.size) requestRender(); };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('click', event => { if (event.target === stage && !moved && zoom === 1) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + .25); }
    if (event.key === '-') { event.preventDefault(); setZoom(zoom - .25); }
    if (event.key === '0') { event.preventDefault(); panX = panY = 0; setZoom(1); }
  });
  new ResizeObserver(fitImage).observe(stage);
  reduced.addEventListener('change', () => { if (reduced.matches) stopAnimation(); });
}
