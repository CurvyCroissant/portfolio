import { readStorage, writeStorage } from './preferences';

/** The system remains the default; an explicit site choice controls CSS and JS together. */
class MotionPreference extends EventTarget {
  private readonly system = matchMedia('(prefers-reduced-motion: reduce)');
  private preference = readStorage('localStorage', 'portfolio-motion');
  private systemReduced = this.system.matches;
  constructor() {
    super(); this.sync();
    this.system.addEventListener('change', event => {
      this.systemReduced = event.matches;
      this.sync(); this.dispatchEvent(new Event('change'));
    });
  }
  get matches() { return this.preference === 'full' ? false : this.preference === 'reduced' ? true : this.systemReduced; }
  setPreference(value: 'full' | 'reduced') {
    this.preference = value; writeStorage('localStorage', 'portfolio-motion', value);
    this.sync(); this.dispatchEvent(new Event('change'));
  }
  private sync() {
    const root = document.documentElement;
    root.dataset.motion = this.matches ? 'reduced' : 'full';
    // Only an explicit choice may override the native media query. Otherwise
    // CSS must respond even when an idle browser defers its JS change event.
    if (this.preference === 'full' || this.preference === 'reduced') root.dataset.motionOverride = this.preference;
    else delete root.dataset.motionOverride;
  }
}
export const reducedMotion = new MotionPreference();
const fallback = { dialog: 700, reveal: 1000, zoom: 340, menu: 640, page: 900, text: 1000, color: 800, 'theme-phase': 450 };

/** CSS owns the shared timings. Missing/unsupported values never silently erase motion. */
export function motionDuration(name: 'dialog' | 'reveal' | 'zoom' | 'menu' | 'page' | 'text' | 'color' | 'theme-phase'): number {
  if (reducedMotion.matches) return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--motion-${name}`).trim();
  const match = value.match(/^(\d*\.?\d+)(ms|s)?$/);
  return match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : fallback[name];
}
export function motionEase(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() || 'ease-out';
}
