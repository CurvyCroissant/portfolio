// Runs in the head, before first paint. The navigation layer reuses this state.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let theme;
  try { theme = localStorage.getItem('theme'); } catch {}
  const dark = theme === 'dark' || (theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#292929' : '#ececec');

  const cache = new Map();
  const storage = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const read = key => cache.get(key) || storage(key);
  const write = (key, value) => { cache.set(key, value); try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const keyFor = url => new URL(url, location.href).pathname;
  const valid = value => value && Number.isFinite(value.y) && value.y >= 0;
  const layoutTop = element => { let y = 0; for (let node = element; node; node = node.offsetParent) y += node.offsetTop; return y; };
  const capture = () => {
    let anchor;
    for (const element of document.querySelectorAll('main section[id], main h1[id], main h2[id]')) {
      if (layoutTop(element) <= scrollY + 88) anchor = element;
    }
    return { y: scrollY, ...(anchor ? { anchor: anchor.id, offset: scrollY - layoutTop(anchor) } : {}) };
  };
  const createState = () => ({ portfolioEntry: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}` });
  const remember = (url, state, position) => {
    if (!valid(position)) return;
    write(`portfolio-page:${keyFor(url)}`, position);
    if (state?.portfolioEntry) write(`portfolio-entry:${state.portfolioEntry}`, position);
  };
  const target = (url, state) => {
    const entry = state?.portfolioEntry && read(`portfolio-entry:${state.portfolioEntry}`);
    const page = read(`portfolio-page:${keyFor(url)}`);
    return valid(entry) ? entry : valid(page) ? page : { y: 0 };
  };
  const restore = position => {
    const anchor = position.anchor && document.getElementById(position.anchor);
    const top = anchor && Number.isFinite(position.offset) ? layoutTop(anchor) + position.offset : position.y;
    scrollTo({ top: Math.max(0, top || 0), behavior: 'instant' });
  };
  const save = () => {
    if (root.hasAttribute('data-navigating') || root.classList.contains('restoring-scroll')) return;
    remember(location.href, history.state, capture());
  };
  const settleMedia = (image, failed = false) => {
    if (!(image instanceof HTMLImageElement)) return;
    const frame = image.closest('.media-frame');
    if (!frame || image.classList.contains('media-preview')) return;
    const finish = error => {
      if (!image.isConnected) return;
      frame.dataset.mediaState = error ? 'error' : 'ready';
      frame.setAttribute('aria-busy', 'false');
    };
    if (failed) finish(true);
    else image.decode().then(() => finish(false), () => finish(true));
  };
  const enhance = () => {
    const container = document.querySelector('#skills-container');
    if (container && !container.hasAttribute('data-shuffled')) {
      const pills = [...container.children];
      for (let i = pills.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pills[i], pills[j]] = [pills[j], pills[i]];
      }
      container.replaceChildren(...pills);
      container.dataset.shuffled = '';
    }
    document.querySelectorAll('.media-frame img:not(.media-preview)').forEach(image => {
      if (image.complete) settleMedia(image, !image.naturalWidth);
    });
  };
  let initial = target(location.href, history.state);
  try {
    history.scrollRestoration = 'manual';
    if (!history.state?.portfolioEntry) history.replaceState({ ...history.state, ...createState() }, '');
  } catch {}
  // Migrate a position saved by the earlier homepage-only implementation.
  if (!read(`portfolio-page:${keyFor(location.href)}`)) {
    const old = storage(`portfolio-position:${location.pathname}`);
    if (Number.isFinite(old) && old > 0) initial = { y: old };
    try { sessionStorage.removeItem(`portfolio-position:${location.pathname}`); } catch {}
  }
  let initialRestored = false;
  if (initial.y > 0 && !location.hash) root.classList.add('restoring-scroll');
  const restoreInitial = () => {
    if (initialRestored) return;
    initialRestored = true;
    enhance();
    if (!location.hash) restore(initial);
    root.classList.remove('restoring-scroll');
  };
  window.portfolioScroll = { capture, createState, remember, target, restore, save, enhance, restoreInitial };
  document.addEventListener('load', event => settleMedia(event.target), true);
  document.addEventListener('error', event => settleMedia(event.target, true), true);
  document.addEventListener('DOMContentLoaded', restoreInitial, { once: true });
  let lastSave = 0, saveTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(saveTimer);
    if (performance.now() - lastSave > 100) { save(); lastSave = performance.now(); }
    else saveTimer = setTimeout(save, 100);
  }, { passive: true });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      delete root.dataset.navigating;
      root.classList.remove('restoring-scroll');
      restore(target(location.href, history.state));
    } else restoreInitial();
  });
})();
