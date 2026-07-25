export type QuestionId =
  | 'stage'
  | 'size'
  | 'floors'
  | 'ownership'
  | 'skill'
  | 'budget'
  | 'priorities'
  | 'heating'
  | 'privacy'
  | 'wiring'
  | 'maintenance'

export interface QuestionOption {
  id: string
  /** lucide icon name hint for the UI (kebab-case) */
  icon?: string
}

export interface Question {
  id: QuestionId
  multi?: boolean
  options: QuestionOption[]
  /** Question is only shown when this predicate holds */
  visibleIf?: (answers: Answers) => boolean
}

/** Single-choice answers are the option id; multi-choice are arrays of option ids */
export type Answers = Partial<Record<QuestionId, string | string[]>>

export type RecommendationCategory =
  | 'ecosystem'
  | 'protocol'
  | 'wiring'
  | 'network'
  | 'devices'
  | 'strategy'

export interface Rule {
  id: string
  category: RecommendationCategory
  /** Higher = shown first within its category */
  priority: number
  when: (a: Answers) => boolean
  /** Slugs of related knowledge-base guides */
  guides: string[]
}

export interface Recommendation {
  ruleId: string
  category: RecommendationCategory
  priority: number
  guides: string[]
}
