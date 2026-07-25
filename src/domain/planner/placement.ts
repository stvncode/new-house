import type { Room, Vec2 } from './types'
import { bounds, centroid } from './geometry'

export interface DevicePoint {
  catalogId: string
  /** Instance index within the device entry (0..qty-1) */
  index: number
  point: Vec2
  /** True when the user placed it; false for the automatic layout */
  placed: boolean
}

/**
 * Where each planned device instance sits in the room. User-placed positions
 * win; the rest spread deterministically on a ring around the centroid so
 * markers never stack.
 */
export function devicePoints(room: Room): DevicePoint[] {
  const total = room.devices.reduce((sum, d) => sum + Math.max(0, d.qty), 0)
  if (total === 0) return []

  const [cx, cy] = centroid(room.polygon)
  const box = bounds([room.polygon])
  const radius = Math.max(
    12,
    Math.min(box.max[0] - box.min[0], box.max[1] - box.min[1]) * 0.28,
  )

  const points: DevicePoint[] = []
  let slot = 0
  for (const device of room.devices) {
    for (let index = 0; index < device.qty; index++) {
      const placed = device.positions?.[index]
      if (placed) {
        points.push({ catalogId: device.catalogId, index, point: placed, placed: true })
      } else {
        const angle = (slot / total) * Math.PI * 2 - Math.PI / 2
        points.push({
          catalogId: device.catalogId,
          index,
          point: [
            Math.round(cx + Math.cos(angle) * radius),
            Math.round(cy + Math.sin(angle) * radius),
          ],
          placed: false,
        })
      }
      slot++
    }
  }
  return points
}
