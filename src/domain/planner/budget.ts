import { getCatalogItem } from '@/domain/catalog/devices'
import type { CatalogItem } from '@/domain/catalog/types'
import type { Project } from './types'

export interface ShoppingRow {
  item: CatalogItem
  qty: number
  total: number
  /** Room names where this device is planned */
  rooms: string[]
}

export function shoppingList(project: Project): ShoppingRow[] {
  const rows = new Map<string, ShoppingRow>()
  for (const floor of project.floors) {
    for (const room of floor.rooms) {
      for (const planned of room.devices) {
        if (planned.qty <= 0) continue
        const item = getCatalogItem(planned.catalogId)
        if (!item) continue
        const row = rows.get(item.id) ?? { item, qty: 0, total: 0, rooms: [] }
        row.qty += planned.qty
        row.total = row.qty * item.priceEur
        if (!row.rooms.includes(room.name)) row.rooms.push(room.name)
        rows.set(item.id, row)
      }
    }
  }
  return [...rows.values()].sort((a, b) => b.total - a.total)
}

export function budgetTotal(project: Project): number {
  return shoppingList(project).reduce((sum, row) => sum + row.total, 0)
}

export function deviceCount(project: Project): number {
  return project.floors
    .flatMap((f) => f.rooms)
    .flatMap((r) => r.devices)
    .reduce((sum, d) => sum + Math.max(0, d.qty), 0)
}

export function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}
