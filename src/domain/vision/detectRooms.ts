import type { Vec2 } from '@/domain/planner/types'
import { bounds, polygonArea } from '@/domain/planner/geometry'

/**
 * Automatic room detection from a floor-plan raster image.
 *
 * Pipeline (classical CV, no dependencies — runs anywhere, fully testable):
 *  1. Grayscale + Otsu threshold  → wall mask (dark lines on light paper)
 *  2. Light dilation              → solidify thin/anti-aliased wall lines
 *  3. Heavy dilation              → close door openings so rooms separate
 *  4. Flood fill on the closed mask → room seeds (border-touching = outside)
 *  5. Multi-source BFS growth on the light mask → rooms reclaim their true
 *     extent up to the walls; doorways split halfway between neighbors
 *  6. Moore-neighbor contour tracing + Douglas-Peucker + axis snapping
 *     → clean polygons in image pixel coordinates
 */

export interface RasterImage {
  width: number
  height: number
  /** RGBA, 4 bytes per pixel (canvas ImageData layout) */
  data: Uint8ClampedArray
}

export interface DetectOptions {
  /** Dilation radius (px) used to close door openings. Default ≈3.5% of the larger dimension. */
  doorCloseRadius?: number
  /** Minimum seed area as a fraction of the image. Default 0.5%. */
  minAreaRatio?: number
  /** Maximum number of rooms returned (largest first). */
  maxRooms?: number
  /** Douglas-Peucker tolerance in px. */
  simplifyEpsilon?: number
}

const OUTSIDE = 1
const UNLABELED = 0

export function detectRooms(image: RasterImage, options: DetectOptions = {}): Vec2[][] {
  const { width: w, height: h, data } = image
  const n = w * h
  if (n === 0) return []

  // 1. Grayscale + Otsu threshold
  const lum = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    const o = i * 4
    // Transparent pixels count as paper, not wall
    lum[i] = data[o + 3]! < 128 ? 255 : (299 * data[o]! + 587 * data[o + 1]! + 114 * data[o + 2]!) / 1000
  }
  const threshold = otsu(lum)
  // Otsu convention: the dark class is [0..threshold] inclusive
  const wall = new Uint8Array(n)
  let wallCount = 0
  for (let i = 0; i < n; i++) {
    if (lum[i]! <= threshold) {
      wall[i] = 1
      wallCount++
    }
  }
  // Dark-background plans: the sparse class is the lines — invert if needed
  if (wallCount > n / 2) {
    for (let i = 0; i < n; i++) wall[i] = wall[i] ? 0 : 1
  }

  // Morphological opening: real walls are drawn as thick strokes on
  // architectural plans, while hatching, furniture symbols, door swings,
  // text and dimension lines are thin. Eroding then re-dilating keeps only
  // the thick structures — the walls.
  const opened = dilate(erode(wall, w, h, 1), w, h, 1)

  const wallLight = dilate(opened, w, h, 1)

  if (options.doorCloseRadius !== undefined) {
    return segment(wallLight, w, h, options.doorCloseRadius, options)
  }
  // Door widths vary a lot between plans: try two closing radii and keep
  // whichever separates more rooms.
  const base = Math.min(24, Math.max(4, Math.round(Math.max(w, h) * 0.03)))
  const candidates = [segment(wallLight, w, h, base, options), segment(wallLight, w, h, Math.round(base * 1.7), options)]
  return candidates.sort((a, b) => b.length - a.length)[0]!
}

function segment(
  wallLight: Uint8Array,
  w: number,
  h: number,
  doorClose: number,
  options: DetectOptions,
): Vec2[][] {
  const n = w * h
  const minArea = Math.max(16, Math.round((options.minAreaRatio ?? 0.005) * n))
  const maxRooms = options.maxRooms ?? 40
  const epsilon = options.simplifyEpsilon ?? 3

  const wallHeavy = dilate(wallLight, w, h, doorClose)

  // 4. Label free space on the heavy mask; border-connected space is outside
  const labels = new Int32Array(n) // 0 = unlabeled, 1 = outside, >=2 = room seeds
  const queue = new Int32Array(n)
  floodFrom(borderPixels(w, h), wallHeavy, labels, OUTSIDE, w, h, queue)

  const seedAreas: number[] = []
  let nextLabel = 2
  for (let i = 0; i < n; i++) {
    if (labels[i] === UNLABELED && !wallHeavy[i]) {
      const area = floodFrom([i], wallHeavy, labels, nextLabel, w, h, queue)
      seedAreas[nextLabel] = area
      nextLabel++
    }
  }

  // Keep the biggest seeds only
  const kept = new Set(
    Object.keys(seedAreas)
      .map(Number)
      .filter((label) => seedAreas[label]! >= minArea)
      .sort((a, b) => seedAreas[b]! - seedAreas[a]!)
      .slice(0, maxRooms),
  )
  if (kept.size === 0) return []

  // 5. Multi-source BFS growth on the light mask (outside competes too,
  //    so rooms cannot leak out through exterior doors)
  let head = 0
  let tail = 0
  for (let i = 0; i < n; i++) {
    if (labels[i] === OUTSIDE || (labels[i]! >= 2 && kept.has(labels[i]!))) {
      queue[tail++] = i
    } else if (labels[i] !== OUTSIDE) {
      labels[i] = UNLABELED
    }
  }
  while (head < tail) {
    const i = queue[head++]!
    const label = labels[i]!
    const x = i % w
    if (x > 0 && labels[i - 1] === UNLABELED && !wallLight[i - 1]) { labels[i - 1] = label; queue[tail++] = i - 1 }
    if (x < w - 1 && labels[i + 1] === UNLABELED && !wallLight[i + 1]) { labels[i + 1] = label; queue[tail++] = i + 1 }
    if (i >= w && labels[i - w] === UNLABELED && !wallLight[i - w]) { labels[i - w] = label; queue[tail++] = i - w }
    if (i < n - w && labels[i + w] === UNLABELED && !wallLight[i + w]) { labels[i + w] = label; queue[tail++] = i + w }
  }

  // 6. Contours → clean polygons
  const polygons: { area: number; polygon: Vec2[] }[] = []
  for (const label of kept) {
    const contour = traceContour(labels, label, w, h)
    if (contour.length < 3) continue
    let polygon = simplify(contour, epsilon)
    polygon = collapseStairs(polygon, Math.max(8, Math.round(Math.max(w, h) * 0.02)))
    polygon = snapAxes(polygon, 4)
    polygon = removeCollinear(polygon)
    polygon = rectFit(polygon)
    if (polygon.length >= 3) polygons.push({ area: seedAreas[label]!, polygon })
  }
  // Reject slivers: technical shafts, closets, gaps in the wall poché.
  // A real room is at least ~2 grid cells wide in both directions.
  const minSide = Math.max(8, Math.round(Math.max(w, h) * 0.012))
  const shaped = polygons.filter(({ polygon }) => {
    const box = bounds([polygon])
    const bw = box.max[0] - box.min[0]
    const bh = box.max[1] - box.min[1]
    return Math.min(bw, bh) >= minSide && Math.max(bw, bh) / Math.max(1, Math.min(bw, bh)) <= 14
  })

  // Keep only rooms attached to the main body of the plan — architect
  // sheets carry title blocks, legends and location maps that would
  // otherwise come through as phantom rooms.
  const clustered = dominantCluster(shaped, Math.max(w, h) * 0.03)

  const result = clustered.sort((a, b) => b.area - a.area).map((p) => p.polygon)
  alignSharedWalls(result, Math.max(4, doorClose / 2))
  return result.map((polygon) => removeCollinear(polygon))
}

/** Keep the connected cluster of rooms containing the largest room */
function dominantCluster<T extends { area: number; polygon: Vec2[] }>(
  rooms: T[],
  margin: number,
): T[] {
  if (rooms.length <= 1) return rooms
  const boxes = rooms.map((room) => bounds([room.polygon]))
  const near = (a: number, b: number) =>
    boxes[a]!.min[0] - margin <= boxes[b]!.max[0] &&
    boxes[b]!.min[0] - margin <= boxes[a]!.max[0] &&
    boxes[a]!.min[1] - margin <= boxes[b]!.max[1] &&
    boxes[b]!.min[1] - margin <= boxes[a]!.max[1]

  let seed = 0
  for (let i = 1; i < rooms.length; i++) {
    if (rooms[i]!.area > rooms[seed]!.area) seed = i
  }
  const included = new Set([seed])
  const queue = [seed]
  while (queue.length) {
    const current = queue.pop()!
    for (let i = 0; i < rooms.length; i++) {
      if (!included.has(i) && near(current, i)) {
        included.add(i)
        queue.push(i)
      }
    }
  }
  return rooms.filter((_, i) => included.has(i))
}

/**
 * Most rooms are rectangles that came out slightly wobbly. If a polygon
 * fills ≥85% of its own bounding box, replace it with the box.
 * L-shaped rooms fall well below that ratio and are left untouched.
 */
function rectFit(polygon: Vec2[]): Vec2[] {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [x, y] of polygon) {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  const boxArea = (maxX - minX) * (maxY - minY)
  if (boxArea <= 0) return polygon
  if (polygonArea(polygon) / boxArea < 0.85) return polygon
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ]
}

/**
 * Rooms sharing a wall should sit on exactly the same line. Cluster all
 * vertex coordinates across every polygon (per axis) within a tolerance
 * and snap each cluster to its mean — straightens the whole plan.
 */
function alignSharedWalls(polygons: Vec2[][], tolerance: number): void {
  for (const axis of [0, 1] as const) {
    const values: number[] = []
    for (const polygon of polygons) for (const point of polygon) values.push(point[axis])
    values.sort((a, b) => a - b)

    // Greedy clustering of sorted values; span is capped so near-continuous
    // coordinate runs cannot chain into one giant cluster
    const snapped = new Map<number, number>()
    let start = 0
    for (let i = 1; i <= values.length; i++) {
      if (
        i === values.length ||
        values[i]! - values[i - 1]! > tolerance ||
        values[i]! - values[start]! > tolerance * 2
      ) {
        const cluster = values.slice(start, i)
        const mean = Math.round(cluster.reduce((s, v) => s + v, 0) / cluster.length)
        for (const v of cluster) snapped.set(v, mean)
        start = i
      }
    }
    for (const polygon of polygons) {
      for (const point of polygon) point[axis] = snapped.get(point[axis]) ?? point[axis]
    }
  }
}

function otsu(lum: Uint8Array): number {
  const hist = new Array<number>(256).fill(0)
  for (let i = 0; i < lum.length; i++) hist[lum[i]!]!++
  const total = lum.length
  let sum = 0
  for (let i = 0; i < 256; i++) sum += i * hist[i]!
  let sumB = 0
  let wB = 0
  let best = 127
  let maxVar = -1
  for (let t = 0; t < 256; t++) {
    wB += hist[t]!
    if (wB === 0) continue
    const wF = total - wB
    if (wF === 0) break
    sumB += t * hist[t]!
    const mB = sumB / wB
    const mF = (sum - sumB) / wF
    const variance = wB * wF * (mB - mF) * (mB - mF)
    if (variance > maxVar) {
      maxVar = variance
      best = t
    }
  }
  return best
}

/** Chebyshev (box) dilation via two separable passes */
function dilate(mask: Uint8Array, w: number, h: number, r: number): Uint8Array {
  if (r <= 0) return mask.slice()
  const tmp = new Uint8Array(mask.length)
  const out = new Uint8Array(mask.length)
  for (let y = 0; y < h; y++) {
    const row = y * w
    let count = 0
    for (let x = -r; x < w; x++) {
      const enter = x + r
      if (enter < w && mask[row + enter]) count++
      const leave = x - r - 1
      if (leave >= 0 && mask[row + leave]) count--
      if (x >= 0) tmp[row + x] = count > 0 ? 1 : 0
    }
  }
  for (let x = 0; x < w; x++) {
    let count = 0
    for (let y = -r; y < h; y++) {
      const enter = y + r
      if (enter < h && tmp[enter * w + x]) count++
      const leave = y - r - 1
      if (leave >= 0 && tmp[leave * w + x]) count--
      if (y >= 0) out[y * w + x] = count > 0 ? 1 : 0
    }
  }
  return out
}

/** Chebyshev (box) erosion — dual of dilate */
function erode(mask: Uint8Array, w: number, h: number, r: number): Uint8Array {
  if (r <= 0) return mask.slice()
  const inverted = new Uint8Array(mask.length)
  for (let i = 0; i < mask.length; i++) inverted[i] = mask[i] ? 0 : 1
  const dilated = dilate(inverted, w, h, r)
  const out = new Uint8Array(mask.length)
  for (let i = 0; i < mask.length; i++) out[i] = dilated[i] ? 0 : 1
  return out
}

function borderPixels(w: number, h: number): number[] {
  const px: number[] = []
  for (let x = 0; x < w; x++) px.push(x, (h - 1) * w + x)
  for (let y = 1; y < h - 1; y++) px.push(y * w, y * w + w - 1)
  return px
}

/** 4-connected flood fill; returns filled area */
function floodFrom(
  seeds: number[],
  blocked: Uint8Array,
  labels: Int32Array,
  label: number,
  w: number,
  h: number,
  queue: Int32Array,
): number {
  let head = 0
  let tail = 0
  const n = w * h
  for (const seed of seeds) {
    if (labels[seed] === UNLABELED && !blocked[seed]) {
      labels[seed] = label
      queue[tail++] = seed
    }
  }
  let area = 0
  while (head < tail) {
    const i = queue[head++]!
    area++
    const x = i % w
    if (x > 0 && labels[i - 1] === UNLABELED && !blocked[i - 1]) { labels[i - 1] = label; queue[tail++] = i - 1 }
    if (x < w - 1 && labels[i + 1] === UNLABELED && !blocked[i + 1]) { labels[i + 1] = label; queue[tail++] = i + 1 }
    if (i >= w && labels[i - w] === UNLABELED && !blocked[i - w]) { labels[i - w] = label; queue[tail++] = i - w }
    if (i < n - w && labels[i + w] === UNLABELED && !blocked[i + w]) { labels[i + w] = label; queue[tail++] = i + w }
  }
  return area
}

/** Neighbor offsets, clockwise in screen coordinates (y down), starting East */
const DIRS: ReadonlyArray<Vec2> = [
  [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
]

/** Moore-neighbor boundary tracing with Jacob's stopping criterion */
function traceContour(labels: Int32Array, label: number, w: number, h: number): Vec2[] {
  const at = (x: number, y: number) =>
    x >= 0 && x < w && y >= 0 && y < h && labels[y * w + x] === label

  // Topmost-leftmost pixel of the region
  let sx = -1
  let sy = -1
  outer: for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (labels[y * w + x] === label) {
        sx = x
        sy = y
        break outer
      }
    }
  }
  if (sx < 0) return []

  const contour: Vec2[] = [[sx, sy]]
  // Backtrack starts at the pixel west of the start (guaranteed non-region)
  let px = sx
  let py = sy
  let backIdx = 4 // index of West in DIRS
  const startBackIdx = backIdx
  const maxSteps = 4 * (w + h) + 4 * contourBound(labels, label)

  for (let step = 0; step < maxSteps; step++) {
    let found = false
    // Scan clockwise starting just after the backtrack direction
    for (let k = 1; k <= 8; k++) {
      const idx = (backIdx + k) % 8
      const nx = px + DIRS[idx]![0]
      const ny = py + DIRS[idx]![1]
      if (at(nx, ny)) {
        // New backtrack = direction pointing at the previously scanned (empty) neighbor
        const prevIdx = (backIdx + k - 1) % 8
        const bx = px + DIRS[prevIdx]![0]
        const by = py + DIRS[prevIdx]![1]
        px = nx
        py = ny
        backIdx = dirIndex(bx - px, by - py)
        found = true
        break
      }
    }
    if (!found) return contour // isolated pixel
    if (px === sx && py === sy && backIdx === startBackIdx) return contour
    contour.push([px, py])
  }
  return contour
}

function dirIndex(dx: number, dy: number): number {
  for (let i = 0; i < 8; i++) {
    if (DIRS[i]![0] === dx && DIRS[i]![1] === dy) return i
  }
  return 4
}

function contourBound(labels: Int32Array, label: number): number {
  let count = 0
  for (let i = 0; i < labels.length; i++) if (labels[i] === label) count++
  return count
}

/** Douglas-Peucker simplification of a closed polygon */
function simplify(points: Vec2[], epsilon: number): Vec2[] {
  if (points.length <= 4) return points.slice()
  const closed = [...points, points[0]!]
  const keep = new Uint8Array(closed.length)
  keep[0] = 1
  keep[closed.length - 1] = 1
  const stack: Array<[number, number]> = [[0, closed.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()!
    let maxDist = 0
    let maxIdx = -1
    for (let i = a + 1; i < b; i++) {
      const d = pointSegmentDistance(closed[i]!, closed[a]!, closed[b]!)
      if (d > maxDist) {
        maxDist = d
        maxIdx = i
      }
    }
    if (maxDist > epsilon && maxIdx > 0) {
      keep[maxIdx] = 1
      stack.push([a, maxIdx], [maxIdx, b])
    }
  }
  const result: Vec2[] = []
  for (let i = 0; i < closed.length - 1; i++) {
    if (keep[i]) result.push(closed[i]!)
  }
  return result
}

function pointSegmentDistance([px, py]: Vec2, [ax, ay]: Vec2, [bx, by]: Vec2): number {
  const dx = bx - ax
  const dy = by - ay
  const lengthSq = dx * dx + dy * dy
  if (lengthSq === 0) return Math.hypot(px - ax, py - ay)
  let t = ((px - ax) * dx + (py - ay) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/**
 * Collapse staircase artifacts: where two regions grow toward each other
 * (doorways, open-plan boundaries) the BFS seam survives simplification as
 * a chain of tiny alternating segments. Any vertex whose two adjacent
 * segments are BOTH short is noise — remove it and let the boundary run
 * straight (a later pass snaps it to an axis when it is nearly aligned).
 */
function collapseStairs(polygon: Vec2[], minLength: number): Vec2[] {
  let current = polygon
  for (let pass = 0; pass < 8; pass++) {
    if (current.length <= 4) return current
    const kept: Vec2[] = []
    let changed = false
    for (let i = 0; i < current.length; i++) {
      const prev = current[(i - 1 + current.length) % current.length]!
      const point = current[i]!
      const next = current[(i + 1) % current.length]!
      const inLength = Math.hypot(point[0] - prev[0], point[1] - prev[1])
      const outLength = Math.hypot(next[0] - point[0], next[1] - point[1])
      if (inLength < minLength && outLength < minLength) {
        changed = true
        continue
      }
      kept.push(point)
    }
    if (kept.length < 3) return current
    if (!changed) return kept
    current = kept
  }
  return current
}

/**
 * Snap nearly-axis-aligned segments to be exactly horizontal/vertical.
 * Tolerance scales with segment length (up to ~12°), so the jagged
 * diagonal seams left by BFS growth at doorways get straightened while
 * genuinely slanted walls are preserved.
 */
function snapAxes(polygon: Vec2[], base = 4): Vec2[] {
  const result = polygon.map((p) => [...p] as Vec2)
  for (let i = 0; i < result.length; i++) {
    const a = result[i]!
    const b = result[(i + 1) % result.length]!
    const dx = Math.abs(a[0] - b[0])
    const dy = Math.abs(a[1] - b[1])
    const tolerance = (length: number) => Math.max(base, Math.min(14, length * 0.22))
    if (dy <= tolerance(dx) && dx > dy) b[1] = a[1]
    else if (dx <= tolerance(dy) && dy > dx) b[0] = a[0]
  }
  return result
}

function removeCollinear(polygon: Vec2[], tolerance = 0.5): Vec2[] {
  if (polygon.length <= 3) return polygon
  const result: Vec2[] = []
  for (let i = 0; i < polygon.length; i++) {
    const prev = polygon[(i - 1 + polygon.length) % polygon.length]!
    const curr = polygon[i]!
    const next = polygon[(i + 1) % polygon.length]!
    const cross =
      (curr[0] - prev[0]) * (next[1] - prev[1]) - (curr[1] - prev[1]) * (next[0] - prev[0])
    const lenA = Math.hypot(curr[0] - prev[0], curr[1] - prev[1])
    const lenB = Math.hypot(next[1] - curr[1], next[0] - curr[0])
    if (lenA === 0 || lenB === 0) continue
    if (Math.abs(cross) / Math.max(lenA, lenB) > tolerance) result.push(curr)
  }
  return result.length >= 3 ? result : polygon
}
