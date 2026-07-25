import type { Question } from './types'
import { has, is } from './answers'

/**
 * The wizard's question graph. Text lives in the i18n dictionaries under
 * `wizard.questions.<questionId>` — this file only defines structure.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'stage',
    options: [
      { id: 'new-build', icon: 'hard-hat' },
      { id: 'renovation', icon: 'hammer' },
      { id: 'existing', icon: 'house' },
    ],
  },
  {
    id: 'size',
    options: [
      { id: 's', icon: 'square' },
      { id: 'm', icon: 'square' },
      { id: 'l', icon: 'square' },
      { id: 'xl', icon: 'square' },
    ],
  },
  {
    id: 'floors',
    options: [
      { id: 'one', icon: 'minus' },
      { id: 'two', icon: 'equal' },
      { id: 'three-plus', icon: 'menu' },
    ],
  },
  {
    id: 'ownership',
    options: [
      { id: 'owner', icon: 'key-round' },
      { id: 'tenant', icon: 'file-text' },
    ],
    // A new build implies ownership
    visibleIf: (a) => !is(a, 'stage', 'new-build'),
  },
  {
    id: 'skill',
    options: [
      { id: 'beginner', icon: 'sprout' },
      { id: 'comfortable', icon: 'wrench' },
      { id: 'tinkerer', icon: 'terminal' },
    ],
  },
  {
    id: 'budget',
    options: [
      { id: 'starter', icon: 'coins' },
      { id: 'mid', icon: 'wallet' },
      { id: 'high', icon: 'banknote' },
      { id: 'pro', icon: 'gem' },
    ],
  },
  {
    id: 'priorities',
    multi: true,
    options: [
      { id: 'lighting', icon: 'lightbulb' },
      { id: 'climate', icon: 'thermometer' },
      { id: 'security', icon: 'shield' },
      { id: 'blinds', icon: 'blinds' },
      { id: 'energy', icon: 'zap' },
      { id: 'media', icon: 'speaker' },
      { id: 'presence', icon: 'radar' },
    ],
  },
  {
    id: 'heating',
    options: [
      { id: 'radiators', icon: 'heater' },
      { id: 'electric', icon: 'zap' },
      { id: 'floor', icon: 'layers' },
      { id: 'heat-pump', icon: 'wind' },
    ],
    // Only worth asking when climate control is a stated priority
    visibleIf: (a) => has(a, 'priorities', 'climate'),
  },
  {
    id: 'privacy',
    options: [
      { id: 'local-only', icon: 'lock' },
      { id: 'mixed', icon: 'blend' },
      { id: 'cloud-ok', icon: 'cloud' },
    ],
  },
  {
    id: 'wiring',
    options: [
      { id: 'max-wired', icon: 'cable' },
      { id: 'some-wiring', icon: 'plug' },
      { id: 'no-wiring', icon: 'wifi' },
    ],
    visibleIf: (a) => !is(a, 'ownership', 'tenant'),
  },
  {
    id: 'maintenance',
    options: [
      { id: 'set-forget', icon: 'moon' },
      { id: 'tinker', icon: 'flask-conical' },
    ],
  },
]

export function visibleQuestions(answers: Parameters<NonNullable<Question['visibleIf']>>[0]) {
  return QUESTIONS.filter((q) => q.visibleIf?.(answers) ?? true)
}
