import { CATALOG } from '@/domain/catalog/devices'
import type { CatalogItem, RoomType, Tier } from '@/domain/catalog/types'
import type { Answers } from '@/domain/wizard/types'
import { is } from '@/domain/wizard/answers'

const TIER_ORDER: Record<Tier, number> = { essential: 0, comfort: 1, premium: 2 }

/**
 * Catalog items that make sense in a room of this type, essentials first.
 * When wizard answers are provided, the list adapts to the user's profile:
 * tenants lose in-wall gear, local-first users see wifi-only devices last.
 */
export function suggestForRoom(roomType: RoomType, answers?: Answers): CatalogItem[] {
  let items = CATALOG.filter((item) => item.roomTypes.includes(roomType))

  const tenant =
    answers !== undefined &&
    (is(answers, 'ownership', 'tenant') || is(answers, 'wiring', 'no-wiring'))
  if (tenant) {
    // Nothing that lives inside a wall: no neutral-wire modules, no wired-only gear
    items = items.filter(
      (item) => !item.requiresNeutral && !(item.power === 'wired' && !item.perHouse),
    )
  }

  const localOnly = answers !== undefined && is(answers, 'privacy', 'local-only')

  return items.sort((a, b) => {
    // Cloud-leaning wifi-only devices sink to the bottom for local-first users
    if (localOnly) {
      const aWifiOnly = a.protocols.every((p) => p === 'wifi') ? 1 : 0
      const bWifiOnly = b.protocols.every((p) => p === 'wifi') ? 1 : 0
      if (aWifiOnly !== bWifiOnly) return aWifiOnly - bWifiOnly
    }
    return TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.priceEur - b.priceEur
  })
}

/** True when the profile actually changed anything (drives the UI hint) */
export function profileAffectsSuggestions(answers: Answers): boolean {
  return (
    is(answers, 'ownership', 'tenant') ||
    is(answers, 'wiring', 'no-wiring') ||
    is(answers, 'privacy', 'local-only')
  )
}
