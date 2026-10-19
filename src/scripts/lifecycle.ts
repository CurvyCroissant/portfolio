type Events<T> = T extends MediaQueryList ? MediaQueryListEventMap : T extends Window ? WindowEventMap : T extends Document ? DocumentEventMap : HTMLElementEventMap;

/** Every enhancement belongs to its page and releases its work before navigation. */
export class PageScope {
  private controller = new AbortController();
  private disposers: (() => void)[] = [];
  get signal() { return this.controller.signal; }
  on<T extends EventTarget, K extends keyof Events<T> & string>(target: T | null | undefined, type: K, listener: (event: Events<T>[K]) => void, options: AddEventListenerOptions = {}) {
    target?.addEventListener(type, listener as EventListener, { ...options, signal: this.signal });
  }
  add(dispose: () => void) { this.disposers.push(dispose); }
  dispose = () => {
    this.controller.abort();
    this.disposers.reverse().forEach(dispose => dispose());
    this.disposers = [];
  };
}
