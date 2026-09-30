/**
 * useI18n — returns the right dictionary for the current language.
 * No heavy library. Just a typed lookup.
 */
import { en } from '@/data/i18n/en'
import { am } from '@/data/i18n/am'
import type { Lang } from '@/App'

export function useI18n(lang: Lang) {
  return lang === 'am' ? am : en
}

export type T = typeof en
