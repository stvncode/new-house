import type { Vec2 } from './types'

/** Signed area via the shoelace formula (plan units²) */
export function polygonArea(polygon: Vec2[]): number {
  if (polygon.length < 3) return 0
  let sum = 0
  for (let i = 0; i < polygon.length; i++) {
    const [x1, y1] = polygon[i]!
    const [x2, y2] = polygon[(i + 1) % polygon.length]!
    sum += x1 * y2 - x2 * y1
  }
  return Math.abs(sum) / 2
}

export function areaSquareMeters(polygon: Vec2[], unitsPerMeter: number): number {
  return polygonArea(polygon) / (unitsPerMeter * unitsPerMeter)
}

export function centroid(polygon: Vec2[]): Vec2 {
  if (polygon.length === 0) return [0, 0]
  const area = (() => {
    let sum = 0
    for (let i = 0; i < polygon.length; i++) {
      const [x1, y1] = polygon[i]!
      const [x2, y2] = polygon[(i + 1) % polygon.length]!
      sum += x1 * y2 - x2 * y1
    }
    return sum / 2
  })()
  // Degenerate polygon: fall back to vertex average
  if (Math.abs(area) < 1e-9) {
    const [sx, sy] = polygon.reduce<Vec2>(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0])
    return [sx / polygon.length, sy / polygon.length]
  }
  let cx = 0
  let cy = 0
  for (let i = 0; i < polygon.length; i++) {
    const [x1, y1] = polygon[i]!
    const [x2, y2] = polygon[(i + 1) % polygon.length]!
    const cross = x1 * y2 - x2 * y1
    cx += (x1 + x2) * cross
    cy += (y1 + y2) * cross
  }
  return [cx / (6 * area), cy / (6 * area)]
}

export function pointInPolygon([px, py]: Vec2, polygon: Vec2[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!
    const [xj, yj] = polygon[j]!
    const intersects =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

export function bounds(polygons: Vec2[][]): { min: Vec2; max: Vec2 } {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const polygon of polygons) {
    for (const [x, y] of polygon) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  if (minX === Infinity) return { min: [0, 0], max: [0, 0] }
  return { min: [minX, minY], max: [maxX, maxY] }
}

export function snapToGrid(value: number, grid: number): number {
  return Math.round(value / grid) * grid
}
