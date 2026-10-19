export function readStorage(kind: 'localStorage' | 'sessionStorage', key: string): string | null {
  try { return window[kind].getItem(key); } catch { return null; }
}
export function writeStorage(kind: 'localStorage' | 'sessionStorage', key: string, value: string): void {
  try { window[kind].setItem(key, value); } catch { /* Preferences are optional. */ }
}
export function removeStorage(kind: 'localStorage' | 'sessionStorage', key: string): void {
  try { window[kind].removeItem(key); } catch { /* Navigation still works without storage. */ }
}
export function updateScrollLock(): void {
  const root = document.documentElement;
  const open = !!document.querySelector('dialog[open]');
  if (open && !root.classList.contains('dialog-open')) root.style.setProperty('--scrollbar-width', `${innerWidth - root.clientWidth}px`);
  root.classList.toggle('dialog-open', open);
  if (!open) root.style.removeProperty('--scrollbar-width');
}
