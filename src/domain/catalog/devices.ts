import type { CatalogItem, RoomType } from './types'

const LIVING_SPACES: RoomType[] = ['living', 'kitchen', 'dining', 'bedroom', 'office']
const ALL_ROOMS: RoomType[] = [
  'living', 'kitchen', 'dining', 'bedroom', 'bathroom', 'toilet',
  'office', 'hallway', 'entrance', 'garage', 'laundry', 'technical',
]

export const CATALOG: CatalogItem[] = [
  // Hub
  {
    id: 'hub-home-assistant',
    category: 'hub',
    tier: 'essential',
    priceEur: 109,
    protocols: ['zigbee', 'thread', 'ethernet'],
    power: 'mains',
    roomTypes: ['technical', 'office', 'living'],
    perHouse: true,
  },

  // Lighting
  {
    id: 'switch-module',
    category: 'lighting',
    tier: 'essential',
    priceEur: 45,
    protocols: ['zigbee', 'zwave', 'wifi'],
    power: 'wired',
    roomTypes: ALL_ROOMS,
    requiresNeutral: true,
  },
  {
    id: 'dimmer-module',
    category: 'lighting',
    tier: 'comfort',
    priceEur: 55,
    protocols: ['zigbee', 'zwave'],
    power: 'wired',
    roomTypes: LIVING_SPACES,
    requiresNeutral: true,
  },
  {
    id: 'smart-bulb',
    category: 'lighting',
    tier: 'comfort',
    priceEur: 25,
    protocols: ['zigbee', 'thread', 'wifi'],
    power: 'mains',
    roomTypes: [...LIVING_SPACES, 'hallway', 'entrance'],
  },
  {
    id: 'wireless-button',
    category: 'lighting',
    tier: 'comfort',
    priceEur: 20,
    protocols: ['zigbee', 'thread'],
    power: 'battery',
    roomTypes: [...LIVING_SPACES, 'hallway', 'entrance', 'bathroom'],
  },

  // Sensors
  {
    id: 'motion-sensor',
    category: 'sensors',
    tier: 'essential',
    priceEur: 30,
    protocols: ['zigbee', 'zwave', 'thread'],
    power: 'battery',
    roomTypes: ['hallway', 'entrance', 'bathroom', 'toilet', 'garage', 'laundry', 'technical'],
  },
  {
    id: 'presence-sensor-mmwave',
    category: 'sensors',
    tier: 'premium',
    priceEur: 50,
    protocols: ['zigbee', 'wifi'],
    power: 'mains',
    roomTypes: LIVING_SPACES,
  },
  {
    id: 'door-window-sensor',
    category: 'sensors',
    tier: 'essential',
    priceEur: 20,
    protocols: ['zigbee', 'zwave', 'thread'],
    power: 'battery',
    roomTypes: ['entrance', 'living', 'kitchen', 'bedroom', 'garage', 'office'],
  },
  {
    id: 'temp-humidity-sensor',
    category: 'sensors',
    tier: 'essential',
    priceEur: 20,
    protocols: ['zigbee', 'thread'],
    power: 'battery',
    roomTypes: ALL_ROOMS,
  },
  {
    id: 'air-quality-sensor',
    category: 'sensors',
    tier: 'premium',
    priceEur: 80,
    protocols: ['zigbee', 'wifi'],
    power: 'mains',
    roomTypes: ['living', 'bedroom', 'office', 'kitchen'],
  },

  // Climate
  {
    id: 'smart-thermostat',
    category: 'climate',
    tier: 'essential',
    priceEur: 150,
    protocols: ['zigbee', 'zwave', 'wifi'],
    power: 'wired',
    roomTypes: ['living', 'hallway'],
    perHouse: true,
  },
  {
    id: 'radiator-valve',
    category: 'climate',
    tier: 'comfort',
    priceEur: 60,
    protocols: ['zigbee', 'zwave', 'thread'],
    power: 'battery',
    roomTypes: ['living', 'dining', 'bedroom', 'office', 'bathroom'],
  },
  {
    id: 'pilot-wire-module',
    category: 'climate',
    tier: 'essential',
    priceEur: 45,
    protocols: ['zigbee', 'wifi'],
    power: 'wired',
    roomTypes: ['living', 'dining', 'bedroom', 'office', 'bathroom'],
    requiresNeutral: true,
  },

  // Security & safety
  {
    id: 'smoke-detector',
    category: 'security',
    tier: 'essential',
    priceEur: 45,
    protocols: ['zigbee', 'zwave'],
    power: 'battery',
    roomTypes: ['hallway', 'living', 'kitchen', 'bedroom', 'technical', 'garage'],
  },
  {
    id: 'leak-sensor',
    category: 'security',
    tier: 'essential',
    priceEur: 25,
    protocols: ['zigbee', 'zwave'],
    power: 'battery',
    roomTypes: ['bathroom', 'kitchen', 'laundry', 'toilet', 'technical'],
  },
  {
    id: 'smart-lock',
    category: 'security',
    tier: 'premium',
    priceEur: 250,
    protocols: ['zigbee', 'zwave', 'thread'],
    power: 'battery',
    roomTypes: ['entrance'],
  },
  {
    id: 'video-doorbell',
    category: 'security',
    tier: 'comfort',
    priceEur: 150,
    protocols: ['wifi', 'poe'],
    power: 'wired',
    roomTypes: ['entrance'],
    perHouse: true,
  },
  {
    id: 'camera-outdoor',
    category: 'security',
    tier: 'comfort',
    priceEur: 120,
    protocols: ['poe', 'wifi'],
    power: 'wired',
    roomTypes: ['outdoor', 'entrance', 'garage'],
  },
  {
    id: 'siren',
    category: 'security',
    tier: 'comfort',
    priceEur: 40,
    protocols: ['zigbee', 'zwave'],
    power: 'mains',
    roomTypes: ['hallway', 'technical'],
    perHouse: true,
  },

  // Blinds & shutters
  {
    id: 'shutter-module',
    category: 'blinds',
    tier: 'comfort',
    priceEur: 60,
    protocols: ['zigbee', 'zwave'],
    power: 'wired',
    roomTypes: [...LIVING_SPACES, 'bathroom'],
    requiresNeutral: true,
  },
  {
    id: 'curtain-motor',
    category: 'blinds',
    tier: 'premium',
    priceEur: 120,
    protocols: ['zigbee', 'thread'],
    power: 'battery',
    roomTypes: ['living', 'bedroom', 'office'],
  },

  // Energy
  {
    id: 'smart-plug',
    category: 'energy',
    tier: 'essential',
    priceEur: 25,
    protocols: ['zigbee', 'thread', 'wifi'],
    power: 'mains',
    roomTypes: ALL_ROOMS,
  },
  {
    id: 'energy-meter',
    category: 'energy',
    tier: 'comfort',
    priceEur: 80,
    protocols: ['zigbee', 'wifi'],
    power: 'wired',
    roomTypes: ['technical', 'garage'],
    perHouse: true,
  },

  // Network
  {
    id: 'wifi-ap',
    category: 'network',
    tier: 'essential',
    priceEur: 120,
    protocols: ['ethernet', 'poe'],
    power: 'wired',
    roomTypes: ['hallway', 'living', 'office', 'technical'],
  },
  {
    id: 'poe-switch',
    category: 'network',
    tier: 'comfort',
    priceEur: 150,
    protocols: ['ethernet'],
    power: 'mains',
    roomTypes: ['technical', 'garage', 'office'],
    perHouse: true,
  },

  // Media
  {
    id: 'voice-satellite',
    category: 'media',
    tier: 'comfort',
    priceEur: 60,
    protocols: ['wifi', 'ethernet'],
    power: 'mains',
    roomTypes: [...LIVING_SPACES, 'hallway'],
  },
  {
    id: 'wall-tablet',
    category: 'media',
    tier: 'premium',
    priceEur: 160,
    protocols: ['wifi', 'poe'],
    power: 'wired',
    roomTypes: ['entrance', 'hallway', 'kitchen', 'living'],
  },
]

export const CATALOG_BY_ID: ReadonlyMap<string, CatalogItem> = new Map(
  CATALOG.map((item) => [item.id, item]),
)

export function getCatalogItem(id: string): CatalogItem | undefined {
  return CATALOG_BY_ID.get(id)
}
