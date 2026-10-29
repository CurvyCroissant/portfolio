/** One site-wide motion vocabulary, independent of OS or stored motion preferences. */
const fallback = { dialog: 700, reveal: 1000, zoom: 340, menu: 640, page: 900, text: 1000, color: 800 };

/** CSS owns the shared timings. Missing/unsupported values never silently erase motion. */
export function motionDuration(name: keyof typeof fallback): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--motion-${name}`).trim();
  const match = value.match(/^(\d*\.?\d+)(ms|s)?$/);
  return match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : fallback[name];
}
export function motionEase(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() || 'ease-out';
}
