import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answers, QuestionId } from '@/domain/wizard/types'

interface WizardStore {
  answers: Answers
  /** Index into the *visible* question list; equal to length = results view */
  step: number
  setSingle: (id: QuestionId, option: string) => void
  toggleMulti: (id: QuestionId, option: string) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      answers: {},
      step: 0,
      setSingle: (id, option) =>
        set((s) => ({ answers: { ...s.answers, [id]: option } })),
      toggleMulti: (id, option) =>
        set((s) => {
          const current = s.answers[id]
          const list = Array.isArray(current) ? current : []
          const next = list.includes(option)
            ? list.filter((o) => o !== option)
            : [...list, option]
          return { answers: { ...s.answers, [id]: next } }
        }),
      setStep: (step) => set({ step }),
      reset: () => set({ answers: {}, step: 0 }),
    }),
    { name: 'foyer-wizard' },
  ),
)
