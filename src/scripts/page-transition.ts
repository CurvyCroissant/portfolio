import { motionDuration, motionEase, reducedMotion } from './motion';

/** Keep the old viewport visible until the new page can slide into place. */
export async function transitionPage(update: () => void, signal: AbortSignal, direction: number) {
  if (signal.aborted) return;
  if (reducedMotion.matches) { update(); return; }
  const root = document.documentElement;
  root.style.setProperty('--page-enter', `${direction * 32}px`);
  root.style.setProperty('--page-exit', `${-direction * 22}px`);
  let cancel = () => {};
  const stop = () => cancel();
  signal.addEventListener('abort', stop, { once: true });
  const motionChange = () => { if (reducedMotion.matches) stop(); };
  reducedMotion.addEventListener('change', motionChange);
  try {
    if (typeof document.startViewTransition === 'function') {
      const transition = document.startViewTransition(() => { if (!signal.aborted) update(); });
      cancel = () => transition.skipTransition();
      // ready rejects on a skipped transition; a skipped visual never cancels content.
      void transition.ready.catch(() => {});
      await transition.finished;
    } else {
      // Older browsers retain the same calm motion without transforming the body
      // (which would move the containing block of fixed glass controls).
      let animations: Animation[] = [];
      cancel = () => animations.forEach(animation => animation.cancel());
      const animate = async (entering: boolean) => {
        animations = [...document.querySelectorAll('main, .main-footer')].map(element => element.animate([
          { opacity: entering ? 0 : 1, transform: entering ? `translateX(${direction * 24}px)` : 'none' },
          { opacity: entering ? 1 : 0, transform: entering ? 'none' : `translateX(${-direction * 16}px)` },
        ], { duration: motionDuration('page') * (entering ? .8 : .35), easing: motionEase(), fill: 'both' }));
        await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
      };
      await animate(false);
      cancel();
      if (signal.aborted) return;
      update();
      await animate(true);
      cancel();
    }
  } finally {
    cancel();
    signal.removeEventListener('abort', stop);
    reducedMotion.removeEventListener('change', motionChange);
    root.style.removeProperty('--page-enter'); root.style.removeProperty('--page-exit');
  }
}
