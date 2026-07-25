import type { Answers } from '@/domain/wizard/types'
import { has, is } from '@/domain/wizard/answers'
import type { CatalogItem, RoomType, Tier } from '@/domain/catalog/types'
import { CATALOG } from '@/domain/catalog/devices'
import type { Project, Room } from './types'
import { suggestForRoom } from './suggest'

/** How deep into the tiers the budget reaches */
function allowedTiers(answers: Answers): Set<Tier> {
  if (is(answers, 'budget', 'pro')) return new Set(['essential', 'comfort', 'premium'])
  if (is(answers, 'budget', 'high')) return new Set(['essential', 'comfort'])
  return new Set(['essential'])
}

/** Whether this catalog item matches what the user said they care about */
function matchesPriorities(item: CatalogItem, answers: Answers): boolean {
  switch (item.category) {
    case 'lighting':
      return has(answers, 'priorities', 'lighting')
    case 'climate':
      return has(answers, 'priorities', 'climate')
    case 'blinds':
      return has(answers, 'priorities', 'blinds')
    case 'energy':
      return has(answers, 'priorities', 'energy')
    case 'media':
      return has(answers, 'priorities', 'media')
    case 'security':
      // Smoke and leak detection is the non-negotiable safety baseline
      if (item.id === 'smoke-detector' || item.id === 'leak-sensor') return true
      return has(answers, 'priorities', 'security')
    case 'sensors':
      if (item.id === 'door-window-sensor') return has(answers, 'priorities', 'security')
      if (item.id === 'temp-humidity-sensor' || item.id === 'air-quality-sensor') {
        return has(answers, 'priorities', 'climate')
      }
      // Motion / presence sensors drive both lighting and presence automations
      return has(answers, 'priorities', 'presence') || has(answers, 'priorities', 'lighting')
    case 'network':
    case 'hub':
      // Infrastructure is handled separately, not per room
      return false
  }
}

const HUB_ROOM_PREFERENCE: RoomType[] = ['technical', 'office', 'living', 'hallway']

/**
 * Fill every room with the devices the wizard recommendations imply —
 * profile-filtered, budget-capped, priority-matched. Existing device
 * entries are never touched; running it twice adds nothing new.
 * Returns the new project and how many device entries were added.
 */
export function autoplan(project: Project, answers: Answers): { project: Project; added: number } {
  const tiers = allowedTiers(answers)
  let added = 0

  const floors = project.floors.map((floor) => ({
    ...floor,
    rooms: floor.rooms.map((room): Room => {
      const existing = new Set(room.devices.map((d) => d.catalogId))
      let picks = suggestForRoom(room.type, answers).filter(
        (item) => tiers.has(item.tier) && matchesPriorities(item, answers) && !item.perHouse && !existing.has(item.id),
      )
      // mmWave presence supersedes basic motion in the same room
      if (picks.some((item) => item.id === 'presence-sensor-mmwave')) {
        picks = picks.filter((item) => item.id !== 'motion-sensor')
      }
      added += picks.length
      if (picks.length === 0) return room
      return {
        ...room,
        devices: [...room.devices, ...picks.map((item) => ({ catalogId: item.id, qty: 1 }))],
      }
    }),
  }))

  let result: Project = { ...project, floors }

  // One hub for the house, in the most sensible room available
  const hub = CATALOG.find((item) => item.id === 'hub-home-assistant')
  const hasHub = result.floors.some((f) =>
    f.rooms.some((r) => r.devices.some((d) => d.catalogId === 'hub-home-assistant')),
  )
  if (hub && !hasHub) {
    const allRooms = result.floors.flatMap((f) => f.rooms)
    const target =
      HUB_ROOM_PREFERENCE.map((type) => allRooms.find((r) => r.type === type)).find(Boolean) ??
      allRooms[0]
    if (target) {
      result = {
        ...result,
        floors: result.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.map((room) =>
            room.id === target.id
              ? { ...room, devices: [...room.devices, { catalogId: 'hub-home-assistant', qty: 1 }] }
              : room,
          ),
        })),
      }
      added++
    }
  }

  return { project: result, added }
}
