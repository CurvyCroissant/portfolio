import { locales, messages, type Locale, type MessageKey } from '../data/messages';
import { achievements, education, experience, site, skills } from '../data/site';
import { projects } from '../data/projects';

export { locales };
export type { Locale, MessageKey };
export const languageNames: Record<Locale, string> = { en: 'English', id: 'Bahasa Indonesia', ja: '日本語' };

export function t(locale: Locale, key: MessageKey, values: Record<string, string | number> = {}): string {
  const variables: Record<string, string | number> = { ...site.facts, ...values };
  return messages[key][locale].replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = variables[name];
    if (value === undefined) throw new Error(`Missing ${name} in translation ${key}`);
    return typeof value === 'number' ? new Intl.NumberFormat(locale).format(value) : value;
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
  const keys = ['nav-theme-light', 'nav-theme-dark', 'theme-to-light', 'theme-to-dark', 'image-loading', 'image-error', 'copied', 'copy-error', 'terminal-updated', 'terminal-cleared'] as const;
  const ui = Object.fromEntries(keys.map(key => [key, t(locale, key)])) as Record<(typeof keys)[number], string>;
  const terminal = {
    help: [
      ...(['about', 'education', 'experience', 'achievements', 'skills', 'projects', 'contact'] as const).map((command, index) => `${command.padEnd(14)} ${[t(locale, 'my-name'), t(locale, 'sec-edu'), t(locale, 'sec-exp'), t(locale, 'sec-ach'), t(locale, 'sec-skills'), t(locale, 'sec-proj'), t(locale, 'contact-title')][index]}`),
      `clear          ${t(locale, 'terminal-cleared')}`,
      `exit           ${t(locale, 'close')}`,
    ].join('\n'),
    about: `${t(locale, 'my-name')}\n${t(locale, 'hero-desc')}\n${t(locale, 'gpa-label')}: ${new Intl.NumberFormat(locale).format(site.facts.gpa)}`,
    education: education.map(entry => `${dateRange(entry, locale)}: ${entry.subtitleKey ? t(locale, entry.subtitleKey) : entry.subtitle ?? ''} @ ${entry.titleKey ? t(locale, entry.titleKey) : entry.title}`).join('\n'),
    experience: experience.map(entry => `${dateRange(entry, locale)}: ${entry.titleKey ? t(locale, entry.titleKey) : entry.title} @ ${entry.subtitle}`).join('\n'),
    achievements: achievements.map(entry => `${t(locale, entry.titleKey)} — ${entry.descriptionKey ? t(locale, entry.descriptionKey) : entry.description}`).join('\n'),
    skills: [...new Set(skills.map(skill => skill.category))].map(category => `${t(locale, category)}: ${skills.filter(skill => skill.category === category).map(skill => skill.translation ? t(locale, skill.translation) : skill.label).join(', ')}`).join('\n'),
    projects: projects.map((project, index) => `${index + 1}. ${t(locale, project.titleKey)} (${project.technologies.join(', ')})`).join('\n'),
    contact: `${t(locale, 'email-label')}: ${site.email}\nGitHub: ${site.github}\nLinkedIn: ${site.linkedin}`,
  };
  return { ...ui, terminal, unknownCommand: messages['command-unknown'][locale] };
}

export type ClientCopy = ReturnType<typeof clientCopy>;
