import { translatePage } from './text-transition';
import { transitionPage } from './page-transition';
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

/** Fetches only static HTML. Critical content stays available while HTML is fetched. */
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
  const saveCurrent = () => memory.remember(currentURL.href, currentState, memory.capture());
  const clearLoading = () => { delete root.dataset.navigating; document.querySelector('main')?.removeAttribute('aria-busy'); };
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
    root.dataset.navigating = '';
    document.querySelector('main')?.setAttribute('aria-busy', 'true');
    document.dispatchEvent(new Event('portfolio:before-navigation'));
    try {
      const response = await fetch(url.href, { signal: controller.signal, headers: { Accept: 'text/html' } });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Page request failed');
      const incoming = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (controller.signal.aborted || serial !== sequence) return;
      if (!incoming.querySelector('main') || !incoming.querySelector('#site-copy')) throw new Error('Invalid page');
      // A new deployment may have changed the shared application/CSS bundle.
      if (assetSignature(incoming) !== loadedAssets) { location.replace(url.href); return; }
      incoming.body.querySelectorAll('script:not([type="application/json"])').forEach(script => script.remove());
      const languageOnly = document.querySelector('main')?.dataset.page === incoming.querySelector<HTMLElement>('main')?.dataset.page && currentURL.pathname.replace(/\/(id|ja)(?=\/)/, '') === url.pathname.replace(/\/(id|ja)(?=\/)/, '');
      const updateHead = () => {
      document.title = incoming.title;
      document.head.querySelectorAll(metaSelector).forEach(element => element.remove());
      incoming.head.querySelectorAll(metaSelector).forEach(element => document.head.append(document.importNode(element, true)));
      root.lang = incoming.documentElement.lang;
      root.toggleAttribute('data-home', incoming.documentElement.hasAttribute('data-home'));
      };
      if (languageOnly) {
        // Static HTML describes the default theme. Translate the live theme's
        // label instead, without replacing its animated text node at commit.
        const payload = incoming.querySelector('#site-copy')!.textContent!;
        const copy = JSON.parse(payload);
        const dark = root.dataset.theme === 'dark';
        const themeLabel = incoming.querySelector('#theme-label');
        if (themeLabel) themeLabel.textContent = copy[dark ? 'nav-theme-light' : 'nav-theme-dark'];
        incoming.querySelector('#theme-toggle')?.setAttribute('aria-label', copy[dark ? 'theme-to-light' : 'theme-to-dark']);
        await translatePage(incoming, controller.signal, () => {
          updateHead();
          const selector = 'a, [aria-label], [data-title], [data-measure], img';
          const old = [...document.querySelectorAll(selector)], next = [...incoming.querySelectorAll(selector)];
          old.forEach((el, i) => {
            const fresh = next[i]; if (!fresh || fresh.tagName !== el.tagName) return;
            for (const attr of ['href', 'lang', 'hreflang', 'aria-label', 'aria-current', 'alt', 'data-title', 'data-measure']) {
              if (fresh.hasAttribute(attr)) el.setAttribute(attr, fresh.getAttribute(attr)!); else el.removeAttribute(attr);
            }
          });
          document.querySelector('#site-copy')!.textContent = payload;
          document.dispatchEvent(new CustomEvent('portfolio:language', { detail: copy }));
          // History must track the DOM as soon as translated text is committed,
          // including when Back interrupts the incoming animation.
          currentURL = url; currentState = history.state;
        });
        if (controller.signal.aborted) return;
        clearLoading(); memory.save(); return;
      }
      const direction = url.pathname.length < currentURL.pathname.length ? -1 : 1;
      await transitionPage(() => {
        dispose(); updateHead();
        document.body.replaceWith(document.importNode(incoming.body, true));
        currentURL = url;
        currentState = history.state;
        memory.enhance();
        // Hidden content can be measured and positioned before its first visible frame.
        memory.restore(position);
        dispose = mount();
        memory.restore(position);
        if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
        const heading = document.querySelector<HTMLElement>('main h1');
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      }, controller.signal, direction);
      if (controller.signal.aborted || serial !== sequence) return;
      clearLoading();
      memory.save();
    } catch {
      if (controller.signal.aborted || serial !== sequence) return;
      clearLoading();
      location.assign(url.href);
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
