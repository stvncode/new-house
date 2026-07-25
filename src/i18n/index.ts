import { en, type Dict } from './en'
import { fr } from './fr'

export const LOCALES = ['en', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

const dictionaries: Record<Locale, Dict> = { en, fr }

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function getDict(locale: Locale): Dict {
  return dictionaries[locale]
}

/** Extract the locale from an Astro URL pathname (`/fr/planner` → `fr`) */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0]
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}

/** Prefix a site-relative path with a locale (`/planner`, `fr` → `/fr/planner`) */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '/' : clean}`
}

/** Same path in the other locale, for the language switcher */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  if (isLocale(segments[0])) segments.shift()
  return `/${[target, ...segments].join('/')}${segments.length ? '' : '/'}`
}

export type { Dict }
