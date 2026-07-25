import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyProject, type Project, type Room, type Vec2 } from '@/domain/planner/types'
import { DEMO_PROJECT } from '@/domain/planner/demo'
import type { RoomType } from '@/domain/catalog/types'
import { clearBackgrounds, deleteBackground, saveBackground } from '@/lib/imageStore'

export type EditorMode = 'select' | 'draw' | 'calibrate'

const HISTORY_LIMIT = 50

interface PlannerStore {
  project: Project
  activeFloorId: string
  selectedRoomId: string | null
  mode: EditorMode
  /** In-progress polygon while drawing */
  draft: Vec2[]
  /** Plan images to trace over, keyed by floor id — persisted in IndexedDB */
  backgrounds: Record<string, string>
  /** Undo/redo snapshots of the project — session only */
  past: Project[]
  future: Project[]

  setMode: (mode: EditorMode) => void
  setActiveFloor: (floorId: string) => void
  addFloor: () => void
  /** Remove a floor and its rooms; remaining floors are renumbered from 0 */
  deleteFloor: (floorId: string) => void
  selectRoom: (roomId: string | null) => void

  undo: () => void
  redo: () => void
  /** Snapshot the current project before a burst of live updates (e.g. a drag) */
  beginHistory: () => void

  /** Set the plan-units-per-meter scale (from calibration) */
  setUnitsPerMeter: (unitsPerMeter: number) => void

  addDraftPoint: (point: Vec2) => void
  /** Remove the last placed corner of the in-progress polygon */
  removeLastDraftPoint: () => void
  cancelDraft: () => void
  /** Close the draft polygon into a real room; returns the new room id */
  commitDraft: () => string | null

  /** Replace the active floor's rooms with auto-detected polygons (pass [] to clear) */
  replaceDetectedRooms: (polygons: Vec2[][]) => void
  updateRoom: (roomId: string, patch: Partial<Pick<Room, 'name' | 'type'>>) => void
  /** Replace a room's polygon; record=false during drags (call beginHistory first) */
  updateRoomPolygon: (roomId: string, polygon: Vec2[], record?: boolean) => void
  deleteRoom: (roomId: string) => void
  setDeviceQty: (roomId: string, catalogId: string, qty: number) => void
  /** Move one placed instance of a device; live (call beginHistory at drag start) */
  setDevicePosition: (roomId: string, catalogId: string, index: number, point: Vec2) => void

  setBackground: (floorId: string, dataUrl: string) => void
  removeBackground: (floorId: string) => void
  /** Load persisted plan images (IndexedDB) into the store on startup */
  hydrateBackgrounds: (backgrounds: Record<string, string>) => void

  loadDemo: () => void
  clearAll: () => void
  importProject: (project: Project) => void
}

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
}

function mapRooms(project: Project, roomId: string, fn: (room: Room) => Room): Project {
  return {
    ...project,
    floors: project.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => (room.id === roomId ? fn(room) : room)),
    })),
  }
}

/** Push the pre-change project onto the undo stack and clear the redo stack */
function record(s: Pick<PlannerStore, 'project' | 'past'>) {
  return {
    past: [...s.past.slice(-(HISTORY_LIMIT - 1)), s.project],
    future: [] as Project[],
  }
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      project: emptyProject(),
      activeFloorId: 'floor-0',
      selectedRoomId: null,
      mode: 'select',
      draft: [],
      backgrounds: {},
      past: [],
      future: [],

      setMode: (mode) => set({ mode, draft: [] }),
      setActiveFloor: (floorId) =>
        set({ activeFloorId: floorId, selectedRoomId: null, draft: [] }),
      addFloor: () =>
        set((s) => {
          const maxLevel = Math.max(...s.project.floors.map((f) => f.level))
          const floor = { id: `floor-${uid()}`, level: maxLevel + 1, name: '', rooms: [] }
          return {
            ...record(s),
            project: { ...s.project, floors: [...s.project.floors, floor] },
            activeFloorId: floor.id,
          }
        }),
      deleteFloor: (floorId) => {
        void deleteBackground(floorId)
        set((s) => {
          let floors = s.project.floors.filter((floor) => floor.id !== floorId)
          if (floors.length === 0) {
            floors = [{ id: `floor-${uid()}`, level: 0, name: '', rooms: [] }]
          }
          // Renumber so the lowest remaining floor becomes the ground floor
          floors = [...floors]
            .sort((a, b) => a.level - b.level)
            .map((floor, index) => ({ ...floor, level: index }))
          const { [floorId]: _removed, ...backgrounds } = s.backgrounds
          return {
            ...record(s),
            project: { ...s.project, floors },
            activeFloorId: floors.some((f) => f.id === s.activeFloorId)
              ? s.activeFloorId
              : floors[0]!.id,
            selectedRoomId: null,
            draft: [],
            backgrounds,
          }
        })
      },
      selectRoom: (roomId) => set({ selectedRoomId: roomId }),

      undo: () =>
        set((s) => {
          const previous = s.past[s.past.length - 1]
          if (!previous) return {}
          return {
            past: s.past.slice(0, -1),
            future: [s.project, ...s.future].slice(0, HISTORY_LIMIT),
            project: previous,
            selectedRoomId: null,
            draft: [],
          }
        }),
      redo: () =>
        set((s) => {
          const next = s.future[0]
          if (!next) return {}
          return {
            past: [...s.past.slice(-(HISTORY_LIMIT - 1)), s.project],
            future: s.future.slice(1),
            project: next,
            selectedRoomId: null,
            draft: [],
          }
        }),
      beginHistory: () => set((s) => record(s)),

      setUnitsPerMeter: (unitsPerMeter) =>
        set((s) => ({
          ...record(s),
          project: { ...s.project, unitsPerMeter },
        })),

      addDraftPoint: (point) => set((s) => ({ draft: [...s.draft, point] })),
      removeLastDraftPoint: () => set((s) => ({ draft: s.draft.slice(0, -1) })),
      cancelDraft: () => set({ draft: [] }),
      commitDraft: () => {
        const { draft } = get()
        if (draft.length < 3) return null
        const room: Room = {
          id: `room-${uid()}`,
          name: '',
          type: 'other',
          polygon: draft,
          devices: [],
        }
        set((s) => ({
          ...record(s),
          project: {
            ...s.project,
            floors: s.project.floors.map((floor) =>
              floor.id === s.activeFloorId
                ? { ...floor, rooms: [...floor.rooms, room] }
                : floor,
            ),
          },
          draft: [],
          mode: 'select' as EditorMode,
          selectedRoomId: room.id,
        }))
        return room.id
      },

      replaceDetectedRooms: (polygons) =>
        set((s) => ({
          ...record(s),
          project: {
            ...s.project,
            floors: s.project.floors.map((floor) =>
              floor.id === s.activeFloorId
                ? {
                    ...floor,
                    rooms: polygons
                      .filter((polygon) => polygon.length >= 3)
                      .map((polygon) => ({
                        id: `room-${uid()}`,
                        name: '',
                        type: 'other' as RoomType,
                        polygon,
                        devices: [],
                      })),
                  }
                : floor,
            ),
          },
          mode: 'select' as EditorMode,
          selectedRoomId: null,
        })),
      updateRoom: (roomId, patch) =>
        set((s) => ({
          ...record(s),
          project: mapRooms(s.project, roomId, (r) => ({ ...r, ...patch })),
        })),
      updateRoomPolygon: (roomId, polygon, recordChange = false) =>
        set((s) => ({
          ...(recordChange ? record(s) : {}),
          project: mapRooms(s.project, roomId, (r) => ({ ...r, polygon })),
        })),
      deleteRoom: (roomId) =>
        set((s) => ({
          ...record(s),
          project: {
            ...s.project,
            floors: s.project.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.filter((room) => room.id !== roomId),
            })),
          },
          selectedRoomId: s.selectedRoomId === roomId ? null : s.selectedRoomId,
        })),
      setDeviceQty: (roomId, catalogId, qty) =>
        set((s) => ({
          ...record(s),
          project: mapRooms(s.project, roomId, (room) => {
            const existing = room.devices.find((d) => d.catalogId === catalogId)
            const devices = room.devices.filter((d) => d.catalogId !== catalogId)
            if (qty > 0) {
              devices.push({
                catalogId,
                qty,
                positions: existing?.positions?.slice(0, qty),
              })
            }
            return { ...room, devices }
          }),
        })),
      setDevicePosition: (roomId, catalogId, index, point) =>
        set((s) => ({
          project: mapRooms(s.project, roomId, (room) => ({
            ...room,
            devices: room.devices.map((device) => {
              if (device.catalogId !== catalogId) return device
              const positions = [...(device.positions ?? [])]
              positions[index] = point
              return { ...device, positions }
            }),
          })),
        })),

      setBackground: (floorId, dataUrl) => {
        void saveBackground(floorId, dataUrl)
        set((s) => ({ backgrounds: { ...s.backgrounds, [floorId]: dataUrl } }))
      },
      removeBackground: (floorId) => {
        void deleteBackground(floorId)
        set((s) => {
          const { [floorId]: _removed, ...rest } = s.backgrounds
          return { backgrounds: rest }
        })
      },
      hydrateBackgrounds: (backgrounds) =>
        set((s) => ({ backgrounds: { ...backgrounds, ...s.backgrounds } })),

      loadDemo: () =>
        set((s) => ({
          ...record(s),
          project: structuredClone(DEMO_PROJECT),
          activeFloorId: DEMO_PROJECT.floors[0]!.id,
          selectedRoomId: null,
          draft: [],
        })),
      clearAll: () => {
        void clearBackgrounds()
        set((s) => ({
          ...record(s),
          project: emptyProject(),
          activeFloorId: 'floor-0',
          selectedRoomId: null,
          draft: [],
          backgrounds: {},
        }))
      },
      importProject: (project) =>
        set((s) => ({
          ...record(s),
          project,
          activeFloorId: project.floors[0]?.id ?? 'floor-0',
          selectedRoomId: null,
          draft: [],
        })),
    }),
    {
      name: 'foyer-planner',
      partialize: (s) => ({
        project: s.project,
        activeFloorId: s.activeFloorId,
      }),
    },
  ),
)

/** Type guard for imported JSON files */
export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Project
  return (
    typeof p.id === 'string' &&
    typeof p.unitsPerMeter === 'number' &&
    Array.isArray(p.floors) &&
    p.floors.every(
      (f) =>
        typeof f.id === 'string' &&
        typeof f.level === 'number' &&
        Array.isArray(f.rooms) &&
        f.rooms.every((r) => Array.isArray(r.polygon) && Array.isArray(r.devices)),
    )
  )
}

export type { RoomType }
