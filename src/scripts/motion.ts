/** CSS owns the shared motion timings; scripted interactions use the same values. */
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
export function motionDuration(name: 'dialog' | 'reveal' | 'zoom' | 'menu' | 'page' | 'text' | 'color'): number {
  if (reducedMotion.matches) return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--motion-${name}`).trim();
  // Production CSS may normalize 400ms to .4s.
  return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : 1000);
}
export function motionEase(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() || 'ease-out';
}
