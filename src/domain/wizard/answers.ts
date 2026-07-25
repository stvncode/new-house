import type { Answers, QuestionId } from './types'

export function single(a: Answers, id: QuestionId): string | undefined {
  const v = a[id]
  return typeof v === 'string' ? v : undefined
}

export function multi(a: Answers, id: QuestionId): string[] {
  const v = a[id]
  return Array.isArray(v) ? v : []
}

export function is(a: Answers, id: QuestionId, ...options: string[]): boolean {
  const v = single(a, id)
  return v !== undefined && options.includes(v)
}

export function has(a: Answers, id: QuestionId, option: string): boolean {
  return multi(a, id).includes(option)
}

/** True when the house is large enough that scale becomes its own problem */
export function isLargeHouse(a: Answers): boolean {
  return is(a, 'size', 'l', 'xl') || is(a, 'floors', 'three-plus')
}

/** True when walls are open (or can be opened): wiring is on the table */
export function canWire(a: Answers): boolean {
  return is(a, 'stage', 'new-build', 'renovation') && !is(a, 'ownership', 'tenant')
}
