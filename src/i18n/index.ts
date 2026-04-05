import { zh } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';

const messages: Record<Locale, Record<string, string>> = { zh, en };

let currentLocale: Locale = detectLocale();
const listeners: Array<() => void> = [];

function detectLocale(): Locale {
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  listeners.forEach((fn) => fn());
}

export function onLocaleChange(fn: () => void): void {
  listeners.push(fn);
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = messages[currentLocale][key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
