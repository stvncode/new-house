import type { RoomType } from '@/domain/catalog/types'

export type Vec2 = [number, number]

export interface PlannedDevice {
  catalogId: string
  qty: number
  /** Optional per-instance placement in plan units; missing entries auto-layout */
  positions?: Vec2[]
}

export interface Room {
  id: string
  name: string
  type: RoomType
  /** Closed polygon in plan units (no repeated last point) */
  polygon: Vec2[]
  devices: PlannedDevice[]
}

export interface Floor {
  id: string
  /** 0 = ground floor, 1 = first floor, -1 = basement */
  level: number
  name: string
  rooms: Room[]
}

export interface Project {
  id: string
  name: string
  /** Plan units per meter — used to convert polygon areas to m² */
  unitsPerMeter: number
  floors: Floor[]
}

export function emptyProject(): Project {
  return {
    id: 'my-house',
    name: 'My house',
    unitsPerMeter: 40,
    floors: [{ id: 'floor-0', level: 0, name: '', rooms: [] }],
  }
}
