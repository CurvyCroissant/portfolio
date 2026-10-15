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
  document.documentElement.classList.toggle('dialog-open', !!document.querySelector('dialog[open]'));
}
