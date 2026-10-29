import { locales, messages, type Locale, type MessageKey } from '../data/messages';
import { site } from '../data/site';

export { locales };
export type { Locale, MessageKey };
export const languageNames: Record<Locale, string> = { en: 'English', id: 'Bahasa Indonesia', ja: '日本語' };

export function t(locale: Locale, key: MessageKey, values: Record<string, string | number> = {}): string {
  const variables: Record<string, string | number> = { ...site.facts, ...values };
  return messages[key][locale].replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = variables[name];
    if (value === undefined) throw new Error(`Missing ${name} in translation ${key}`);
    return typeof value === 'number' ? new Intl.NumberFormat(locale, name === 'gpa' ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {}).format(value) : value;
  });
}

export function routePath(locale: Locale, page = ''): string {
  return [site.base, locale === 'en' ? '' : locale, page.replace(/^\/+|\/+$/g, '')].filter(Boolean).join('/') + '/';
}

export function absoluteUrl(path: string): string { return new URL(path, site.origin).href; }

export function dateLabel(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}-01T12:00:00Z`));
}

export function dateRange(entry: { start: string; end?: string }, locale: Locale): string {
  return `${dateLabel(entry.start, locale)} – ${entry.end ? dateLabel(entry.end, locale) : t(locale, 'present')}`;
}

export function clientCopy(locale: Locale) {
  const keys = ['nav-theme-light', 'nav-theme-dark', 'theme-to-light', 'theme-to-dark', 'image-loading', 'image-error', 'copied', 'copy-error'] as const;
  const ui = Object.fromEntries(keys.map(key => [key, t(locale, key)])) as Record<(typeof keys)[number], string>;
  return ui;
}

export type ClientCopy = ReturnType<typeof clientCopy>;
