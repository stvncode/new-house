import { describe, expect, it } from 'vitest'
import { detectRooms, type RasterImage } from './detectRooms'
import { polygonArea, pointInPolygon } from '@/domain/planner/geometry'
import type { Vec2 } from '@/domain/planner/types'

/** Build a white RGBA image and paint black wall rectangles onto it */
function makePlan(width: number, height: number, walls: [number, number, number, number][]): RasterImage {
  const data = new Uint8ClampedArray(width * height * 4).fill(255)
  for (const [x0, y0, x1, y1] of walls) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const o = (y * width + x) * 4
        data[o] = 0
        data[o + 1] = 0
        data[o + 2] = 0
      }
    }
  }
  return { width, height, data }
}

/** Hollow rectangle: four wall strips of the given thickness */
function box(x0: number, y0: number, x1: number, y1: number, t: number): [number, number, number, number][] {
  return [
    [x0, y0, x1, y0 + t],
    [x0, y1 - t, x1, y1],
    [x0, y0, x0 + t, y1],
    [x1 - t, y0, x1, y1],
  ]
}

describe('detectRooms', () => {
  it('finds a single enclosed room and ignores the outside', () => {
    const image = makePlan(200, 150, box(20, 20, 180, 130, 6))
    const rooms = detectRooms(image, { doorCloseRadius: 6 })
    expect(rooms.length).toBe(1)
    const area = polygonArea(rooms[0]!)
    // Interior is ~148 x 98 ≈ 14,500 px²; allow generous CV tolerance
    expect(area).toBeGreaterThan(11_000)
    expect(area).toBeLessThan(16_000)
    // Polygon must sit inside the outer walls and contain the room center
    expect(pointInPolygon([100, 75], rooms[0]!)).toBe(true)
  })

  it('splits two rooms connected by a door opening', () => {
    const walls = box(10, 10, 290, 190, 6)
    // Vertical dividing wall with a 20px door gap in the middle
    walls.push([145, 10, 151, 80], [145, 100, 151, 190])
    const image = makePlan(300, 200, walls)
    const rooms = detectRooms(image, { doorCloseRadius: 12 })
    expect(rooms.length).toBe(2)
    const centers: Vec2[] = [
      [80, 100], // left room center
      [220, 100], // right room center
    ]
    for (const center of centers) {
      expect(rooms.some((polygon) => pointInPolygon(center, polygon))).toBe(true)
    }
    // No polygon should contain both centers (they are separate rooms)
    for (const polygon of rooms) {
      const contains = centers.filter((c) => pointInPolygon(c, polygon)).length
      expect(contains).toBeLessThanOrEqual(1)
    }
  })

  it('ignores thin decoration lines like tile hatching and furniture', () => {
    const walls = box(20, 20, 180, 130, 6)
    // 1px hatch grid inside the room (like a tiled loggia) — must not split it
    for (let x = 32; x < 174; x += 12) walls.push([x, 26, x + 1, 124])
    for (let y = 32; y < 124; y += 12) walls.push([26, y, 174, y + 1])
    const image = makePlan(200, 150, walls)
    const rooms = detectRooms(image, { doorCloseRadius: 6 })
    expect(rooms.length).toBe(1)
    expect(pointInPolygon([100, 75], rooms[0]!)).toBe(true)
    expect(polygonArea(rooms[0]!)).toBeGreaterThan(11_000)
  })

  it('drops enclosed boxes detached from the main plan (title blocks, legends)', () => {
    const walls = [
      ...box(150, 20, 380, 180, 6), // the actual apartment
      ...box(10, 20, 80, 90, 5), // detached title-block box far to the left
    ]
    const image = makePlan(400, 200, walls)
    const rooms = detectRooms(image, { doorCloseRadius: 6 })
    expect(rooms.length).toBe(1)
    expect(pointInPolygon([265, 100], rooms[0]!)).toBe(true)
  })

  it('rejects sliver regions like shafts and wall gaps', () => {
    const image = makePlan(300, 150, box(20, 20, 240, 40, 5))
    expect(detectRooms(image, { doorCloseRadius: 4 })).toEqual([])
  })

  it('returns nothing for a blank image', () => {
    const image = makePlan(120, 120, [])
    expect(detectRooms(image)).toEqual([])
  })

  it('filters out regions smaller than the minimum area', () => {
    const walls = [
      ...box(10, 10, 110, 110, 5), // decent room
      ...box(112, 10, 126, 24, 2), // tiny 10x10 closet, below threshold
    ]
    const image = makePlan(200, 150, walls)
    const rooms = detectRooms(image, { doorCloseRadius: 4, minAreaRatio: 0.01 })
    expect(rooms.length).toBe(1)
    expect(pointInPolygon([60, 60], rooms[0]!)).toBe(true)
  })

  it('handles dark-background plans (light wall lines) by inverting', () => {
    // Dark paper with light wall lines — the inverse of a printed plan
    const width = 200
    const height = 150
    const data = new Uint8ClampedArray(width * height * 4)
    for (let i = 0; i < width * height; i++) {
      const o = i * 4
      data[o] = 15
      data[o + 1] = 15
      data[o + 2] = 20
      data[o + 3] = 255
    }
    for (const [x0, y0, x1, y1] of box(20, 20, 180, 130, 6)) {
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const o = (y * width + x) * 4
          data[o] = 235
          data[o + 1] = 235
          data[o + 2] = 235
        }
      }
    }
    const rooms = detectRooms({ width, height, data }, { doorCloseRadius: 6 })
    expect(rooms.length).toBe(1)
    expect(pointInPolygon([100, 75], rooms[0]!)).toBe(true)
  })
})
