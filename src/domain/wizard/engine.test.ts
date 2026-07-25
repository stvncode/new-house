import { describe, expect, it } from 'vitest'
import { evaluate } from './engine'
import type { Answers } from './types'

const ids = (a: Answers) => evaluate(a).map((r) => r.ruleId)

describe('wizard engine', () => {
  it('recommends the full wired treatment for a premium new build', () => {
    const answers: Answers = {
      stage: 'new-build',
      size: 'xl',
      floors: 'two',
      skill: 'comfortable',
      budget: 'pro',
      priorities: ['lighting', 'blinds', 'security'],
      privacy: 'local-only',
      wiring: 'max-wired',
      maintenance: 'set-forget',
    }
    const result = ids(answers)
    expect(result).toContain('proto-knx-consider')
    expect(result).toContain('wire-ethernet-everywhere')
    expect(result).toContain('wire-shutters')
    expect(result).toContain('net-wired-aps')
    expect(result).toContain('net-poe')
    expect(result).toContain('eco-local-first')
  })

  it('keeps tenants away from in-wall wiring advice', () => {
    const answers: Answers = {
      stage: 'existing',
      size: 's',
      floors: 'one',
      ownership: 'tenant',
      skill: 'beginner',
      budget: 'starter',
      priorities: ['lighting'],
      privacy: 'mixed',
      maintenance: 'set-forget',
    }
    const result = ids(answers)
    expect(result).toContain('wire-tenant-friendly')
    expect(result).not.toContain('wire-neutral-everywhere')
    expect(result).not.toContain('wire-ethernet-everywhere')
    expect(result).not.toContain('proto-knx-consider')
  })

  it('picks exactly one ecosystem entry point based on skill', () => {
    const beginner = ids({ skill: 'beginner' })
    expect(beginner).toContain('eco-ha-green')
    expect(beginner).not.toContain('eco-ha-standard')

    const tinkerer = ids({ skill: 'tinkerer' })
    expect(tinkerer).toContain('eco-ha-standard')
    expect(tinkerer).not.toContain('eco-ha-green')
  })

  it('flags scale concerns for large or tall houses', () => {
    expect(ids({ size: 'l' })).toContain('net-wired-aps')
    expect(ids({ floors: 'three-plus' })).toContain('net-mesh-density')
    expect(ids({ size: 's', floors: 'one' })).not.toContain('net-wired-aps')
  })

  it('sorts recommendations by category order then priority', () => {
    const result = evaluate({ stage: 'new-build', budget: 'pro', maintenance: 'set-forget' })
    const categories = result.map((r) => r.category)
    const order = ['ecosystem', 'protocol', 'wiring', 'network', 'devices', 'strategy']
    const indices = categories.map((c) => order.indexOf(c))
    expect(indices).toEqual([...indices].sort((a, b) => a - b))
  })
})
