import type { Answers, Recommendation, RecommendationCategory } from './types'
import { RULES } from './rules'

export const CATEGORY_ORDER: RecommendationCategory[] = [
  'ecosystem',
  'protocol',
  'wiring',
  'network',
  'devices',
  'strategy',
]

/** Rules that are mutually exclusive: only the first matching one survives */
const EXCLUSIVE_GROUPS: string[][] = [
  ['eco-ha-green', 'eco-ha-standard'],
  ['wire-tenant-friendly', 'wire-neutral-everywhere'],
]

export function evaluate(answers: Answers): Recommendation[] {
  const matched = RULES.filter((rule) => rule.when(answers))

  const excluded = new Set<string>()
  for (const group of EXCLUSIVE_GROUPS) {
    const winner = group.find((id) => matched.some((r) => r.id === id))
    for (const id of group) {
      if (id !== winner) excluded.add(id)
    }
  }

  return matched
    .filter((rule) => !excluded.has(rule.id))
    .map(({ id, category, priority, guides }) => ({
      ruleId: id,
      category,
      priority,
      guides,
    }))
    .sort((a, b) => {
      const cat = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
      return cat !== 0 ? cat : b.priority - a.priority
    })
}

export function groupByCategory(
  recommendations: Recommendation[],
): Map<RecommendationCategory, Recommendation[]> {
  const groups = new Map<RecommendationCategory, Recommendation[]>()
  for (const rec of recommendations) {
    const list = groups.get(rec.category) ?? []
    list.push(rec)
    groups.set(rec.category, list)
  }
  return groups
}
