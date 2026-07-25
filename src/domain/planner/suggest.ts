import { CATALOG } from '@/domain/catalog/devices'
import type { CatalogItem, RoomType, Tier } from '@/domain/catalog/types'

const TIER_ORDER: Record<Tier, number> = { essential: 0, comfort: 1, premium: 2 }

/** Catalog items that make sense in a room of this type, essentials first */
export function suggestForRoom(roomType: RoomType): CatalogItem[] {
  return CATALOG.filter((item) => item.roomTypes.includes(roomType)).sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.priceEur - b.priceEur,
  )
}
