import { describe, expect, it } from 'vitest'
import { profileAffectsSuggestions, suggestForRoom } from './suggest'
import { devicePoints } from './placement'
import type { Room } from './types'

describe('profile-aware suggestions', () => {
  it('suggests in-wall modules to owners but not tenants', () => {
    const forOwner = suggestForRoom('living', { ownership: 'owner' })
    expect(forOwner.some((item) => item.id === 'dimmer-module')).toBe(true)

    const forTenant = suggestForRoom('living', { ownership: 'tenant' })
    expect(forTenant.some((item) => item.id === 'dimmer-module')).toBe(false)
    expect(forTenant.some((item) => item.requiresNeutral)).toBe(false)
    // Smart bulbs remain — they leave with the tenant
    expect(forTenant.some((item) => item.id === 'smart-bulb')).toBe(true)
  })

  it('sinks wifi-only devices for local-first users', () => {
    const suggestions = suggestForRoom('living', { privacy: 'local-only' })
    const wifiOnlyIndexes = suggestions
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => item.protocols.every((p) => p === 'wifi'))
      .map(({ i }) => i)
    const meshIndexes = suggestions
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => item.protocols.some((p) => p !== 'wifi'))
      .map(({ i }) => i)
    if (wifiOnlyIndexes.length > 0 && meshIndexes.length > 0) {
      expect(Math.min(...wifiOnlyIndexes)).toBeGreaterThan(Math.max(...meshIndexes))
    }
  })

  it('adapts climate suggestions to the heating type', () => {
    const floorHeating = suggestForRoom('bedroom', { heating: 'floor' })
    expect(floorHeating.some((item) => item.id === 'radiator-valve')).toBe(false)
    expect(floorHeating.some((item) => item.id === 'pilot-wire-module')).toBe(false)

    const electric = suggestForRoom('bedroom', { heating: 'electric' })
    expect(electric.some((item) => item.id === 'pilot-wire-module')).toBe(true)
    expect(electric.some((item) => item.id === 'radiator-valve')).toBe(false)

    // Without a heating answer, radiator valves stay but the niche pilot-wire hides
    const unknown = suggestForRoom('bedroom', {})
    expect(unknown.some((item) => item.id === 'radiator-valve')).toBe(true)
    expect(unknown.some((item) => item.id === 'pilot-wire-module')).toBe(false)
  })

  it('reports when the profile changes anything', () => {
    expect(profileAffectsSuggestions({})).toBe(false)
    expect(profileAffectsSuggestions({ skill: 'beginner' })).toBe(false)
    expect(profileAffectsSuggestions({ ownership: 'tenant' })).toBe(true)
    expect(profileAffectsSuggestions({ privacy: 'local-only' })).toBe(true)
  })
})

describe('device placement', () => {
  const room: Room = {
    id: 'r1',
    name: 'Test',
    type: 'living',
    polygon: [
      [0, 0],
      [200, 0],
      [200, 100],
      [0, 100],
    ],
    devices: [
      { catalogId: 'smart-bulb', qty: 2 },
      { catalogId: 'motion-sensor', qty: 1, positions: [[42, 24]] },
    ],
  }

  it('lays out one point per device instance, honoring user placements', () => {
    const points = devicePoints(room)
    expect(points.length).toBe(3)
    const placed = points.find((p) => p.catalogId === 'motion-sensor')!
    expect(placed.placed).toBe(true)
    expect(placed.point).toEqual([42, 24])
    // Auto points are deterministic and distinct
    const auto = points.filter((p) => !p.placed)
    expect(auto.length).toBe(2)
    expect(auto[0]!.point).not.toEqual(auto[1]!.point)
    expect(devicePoints(room)).toEqual(points)
  })

  it('returns nothing for empty rooms', () => {
    expect(devicePoints({ ...room, devices: [] })).toEqual([])
  })
})
