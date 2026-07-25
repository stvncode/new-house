export type DeviceCategory =
  | 'hub'
  | 'lighting'
  | 'climate'
  | 'sensors'
  | 'security'
  | 'blinds'
  | 'energy'
  | 'network'
  | 'media'

export type Tier = 'essential' | 'comfort' | 'premium'

export type Protocol = 'zigbee' | 'zwave' | 'thread' | 'wifi' | 'ethernet' | 'knx' | 'poe'

export type Power = 'battery' | 'mains' | 'wired'

export type RoomType =
  | 'living'
  | 'kitchen'
  | 'dining'
  | 'bedroom'
  | 'bathroom'
  | 'toilet'
  | 'office'
  | 'hallway'
  | 'entrance'
  | 'garage'
  | 'laundry'
  | 'technical'
  | 'outdoor'
  | 'other'

export interface CatalogItem {
  id: string
  category: DeviceCategory
  tier: Tier
  /** Typical mid-range street price, EUR */
  priceEur: number
  protocols: Protocol[]
  power: Power
  /** Room types where this device makes sense; empty = whole-house / one-off */
  roomTypes: RoomType[]
  /** Needs a neutral wire in the switch box (relevant for retrofits) */
  requiresNeutral?: boolean
  /** One per house rather than per room */
  perHouse?: boolean
}
