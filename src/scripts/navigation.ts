export interface ScrollPosition { y: number; anchor?: string; offset?: number }
export interface PageState { portfolioEntry?: string; [key: string]: unknown }
interface ScrollMemory {
  capture(): ScrollPosition;
  createState(): PageState;
  remember(url: string, state: PageState | null, position: ScrollPosition): void;
  target(url: string, state?: PageState | null): ScrollPosition;
  restore(position: ScrollPosition): void;
  save(): void;
  enhance(): void;
  restoreInitial(): void;
}
declare global { interface Window { portfolioScroll: ScrollMemory } }

/** Fetches only static HTML. Images load independently through their shared skeleton. */
export function setupNavigation(mount: () => (() => void)) {
  const memory = window.portfolioScroll;
  const root = document.documentElement;
  let dispose = mount();
  let currentURL = new URL(location.href);
  let currentState: PageState = history.state;
  let active: AbortController | undefined;
  let sequence = 0;
  const assetSignature = (page: Document) => [...page.querySelectorAll<HTMLLinkElement | HTMLScriptElement>('link[rel="stylesheet"], script[type="module"][src]')].map(element => element.getAttribute(element.tagName === 'LINK' ? 'href' : 'src')).sort().join('|');
  // The executed script may be removed with the old body; retain its version.
  const loadedAssets = assetSignature(document);
  const metaSelector = 'meta[name="description"], meta[name="robots"], meta[property], meta[name^="twitter:"], link[rel="canonical"], link[rel="alternate"]';
  const localeFor = (url: URL) => url.pathname.split('/')[2] === 'id' ? 'id' : url.pathname.split('/')[2] === 'ja' ? 'ja' : 'en';
  const saveCurrent = () => memory.remember(currentURL.href, currentState, memory.capture());
  const showLoading = (url: URL) => {
    const loader = document.querySelector<HTMLElement>('#navigation-loader');
    if (!loader) return;
    const locale = localeFor(url);
    root.dataset.navigating = url.pathname.includes('/projects/') ? 'project' : 'home';
    loader.hidden = false;
    loader.classList.remove('navigation-failed');
    loader.setAttribute('aria-busy', 'true');
    loader.querySelector<HTMLElement>('#navigation-error')!.hidden = true;
    loader.querySelector('#navigation-status')!.textContent = loader.dataset[`loading${locale[0].toUpperCase()}${locale.slice(1)}`] ?? '';
    document.querySelector('main')?.setAttribute('inert', '');
    document.querySelector('footer')?.setAttribute('inert', '');
  };
  const clearLoading = () => {
    delete root.dataset.navigating;
    const loader = document.querySelector<HTMLElement>('#navigation-loader');
    if (loader) { loader.hidden = true; loader.setAttribute('aria-busy', 'false'); }
    document.querySelector('main')?.removeAttribute('inert');
    document.querySelector('footer')?.removeAttribute('inert');
  };
  const navigate = async (url: URL, traverse = false, carriedPosition?: ScrollPosition) => {
    active?.abort();
    const controller = new AbortController();
    active = controller;
    const serial = ++sequence;
    if (!root.hasAttribute('data-navigating')) saveCurrent();
    const position = carriedPosition ?? memory.target(url.href, traverse ? history.state : null);
    if (!traverse) {
      const state = memory.createState();
      memory.remember(url.href, state, position);
      try { history.pushState(state, '', url); }
      catch { location.assign(url.href); return; }
    }
    showLoading(url);
    try {
      const response = await fetch(url.href, { signal: controller.signal, headers: { Accept: 'text/html' } });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Page request failed');
      const incoming = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (controller.signal.aborted || serial !== sequence) return;
      if (!incoming.querySelector('main') || !incoming.querySelector('#site-copy')) throw new Error('Invalid page');
      // A new deployment may have changed the shared application/CSS bundle.
      if (assetSignature(incoming) !== loadedAssets) { location.replace(url.href); return; }
      incoming.body.querySelectorAll('script:not([type="application/json"])').forEach(script => script.remove());
      dispose();
      document.title = incoming.title;
      document.head.querySelectorAll(metaSelector).forEach(element => element.remove());
      incoming.head.querySelectorAll(metaSelector).forEach(element => document.head.append(document.importNode(element, true)));
      root.lang = incoming.documentElement.lang;
      root.toggleAttribute('data-home', incoming.documentElement.hasAttribute('data-home'));
      document.body.replaceWith(document.importNode(incoming.body, true));
      currentURL = url;
      currentState = history.state;
      memory.enhance();
      // Hidden content can be measured and positioned before its first visible frame.
      memory.restore(position);
      dispose = mount();
      memory.restore(position);
      clearLoading();
      if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
      const heading = document.querySelector<HTMLElement>('main h1');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      memory.save();
    } catch {
      if (controller.signal.aborted || serial !== sequence) return;
      const loader = document.querySelector<HTMLElement>('#navigation-loader');
      if (!loader) { location.replace(url.href); return; }
      const locale = localeFor(url);
      const suffix = locale[0].toUpperCase() + locale.slice(1);
      loader.classList.add('navigation-failed');
      loader.setAttribute('aria-busy', 'false');
      loader.querySelector<HTMLElement>('#navigation-error')!.hidden = false;
      loader.querySelector('#navigation-error-text')!.textContent = loader.dataset[`error${suffix}`] ?? '';
      loader.querySelector('#navigation-status')!.textContent = loader.dataset[`error${suffix}`] ?? '';
      const retry = loader.querySelector<HTMLButtonElement>('#navigation-retry')!;
      const back = loader.querySelector<HTMLButtonElement>('#navigation-back')!;
      retry.textContent = loader.dataset[`retry${suffix}`] ?? '';
      back.textContent = loader.dataset[`back${suffix}`] ?? '';
      retry.onclick = () => { void navigate(url, true, position); };
      back.onclick = () => history.back();
      retry.focus({ preventScroll: true });
    }
  };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.hasAttribute('download') || anchor.hasAttribute('data-lightbox') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/portfolio/') || /\.[a-z0-9]+$/i.test(url.pathname)) return;
    if (url.pathname === currentURL.pathname && url.search === currentURL.search && url.hash) return;
    if (document.querySelector('dialog[open]')) return;
    event.preventDefault();
    if (url.href === currentURL.href && !root.hasAttribute('data-navigating')) return;
    const carried = anchor.classList.contains('lang-option') ? memory.capture() : undefined;
    void navigate(url, false, carried);
  });
  window.addEventListener('popstate', () => {
    const url = new URL(location.href);
    if (!root.hasAttribute('data-navigating')) saveCurrent();
    active?.abort();
    if (url.pathname === currentURL.pathname && url.search === currentURL.search) {
      currentState = history.state;
      currentURL = url;
      clearLoading();
      memory.restore(memory.target(url.href, history.state));
      return;
    }
    void navigate(url, true);
  });
  window.addEventListener('pagehide', () => { if (!root.hasAttribute('data-navigating')) saveCurrent(); });
}
