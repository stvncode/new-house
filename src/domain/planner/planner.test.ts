import { describe, expect, it } from 'vitest'
import { areaSquareMeters, centroid, pointInPolygon, polygonArea, snapToGrid } from './geometry'
import { budgetTotal, deviceCount, shoppingList } from './budget'
import { DEMO_PROJECT } from './demo'
import type { Vec2 } from './types'

const square: Vec2[] = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
]

describe('geometry', () => {
  it('computes polygon area with the shoelace formula', () => {
    expect(polygonArea(square)).toBe(10_000)
    // L-shape: 200x100 with a 100x50 bite removed
    const lShape: Vec2[] = [
      [0, 0],
      [200, 0],
      [200, 50],
      [100, 50],
      [100, 100],
      [0, 100],
    ]
    expect(polygonArea(lShape)).toBe(15_000)
  })

  it('converts plan units to square meters', () => {
    // 100x100 units at 40 units/m = 2.5m x 2.5m = 6.25 m²
    expect(areaSquareMeters(square, 40)).toBeCloseTo(6.25)
  })

  it('finds the centroid of a square', () => {
    const [cx, cy] = centroid(square)
    expect(cx).toBeCloseTo(50)
    expect(cy).toBeCloseTo(50)
  })

  it('tests point-in-polygon', () => {
    expect(pointInPolygon([50, 50], square)).toBe(true)
    expect(pointInPolygon([150, 50], square)).toBe(false)
  })

  it('snaps to grid', () => {
    expect(snapToGrid(47, 10)).toBe(50)
    expect(snapToGrid(43, 10)).toBe(40)
  })
})

describe('budget', () => {
  it('aggregates the same device across rooms', () => {
    const rows = shoppingList(DEMO_PROJECT)
    const motion = rows.find((r) => r.item.id === 'motion-sensor')
    expect(motion).toBeDefined()
    expect(motion!.qty).toBe(3)
    expect(motion!.rooms.length).toBe(3)
    expect(motion!.total).toBe(3 * motion!.item.priceEur)
  })

  it('computes totals consistently', () => {
    const rows = shoppingList(DEMO_PROJECT)
    const sum = rows.reduce((acc, r) => acc + r.total, 0)
    expect(budgetTotal(DEMO_PROJECT)).toBe(sum)
    expect(deviceCount(DEMO_PROJECT)).toBeGreaterThan(0)
  })
})
