import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { usePlannerStore } from '@/stores/planner'
import { suggestForRoom } from '@/domain/planner/suggest'
import { areaSquareMeters } from '@/domain/planner/geometry'
import { formatEur } from '@/domain/planner/budget'
import type { RoomType, Tier } from '@/domain/catalog/types'
import type { Dict, Locale } from '@/i18n'

const ROOM_TYPES: RoomType[] = [
  'living', 'kitchen', 'dining', 'bedroom', 'bathroom', 'toilet', 'office',
  'hallway', 'entrance', 'garage', 'laundry', 'technical', 'outdoor', 'other',
]
const TIERS: Tier[] = ['essential', 'comfort', 'premium']

export function RoomSheet({ dict, locale }: { dict: Dict; locale: Locale }) {
  const { project, selectedRoomId, selectRoom, updateRoom, deleteRoom, setDeviceQty } =
    usePlannerStore()

  const room = project.floors.flatMap((f) => f.rooms).find((r) => r.id === selectedRoomId)
  if (!room) return null

  const suggestions = suggestForRoom(room.type)
  const qtyOf = (catalogId: string) =>
    room.devices.find((d) => d.catalogId === catalogId)?.qty ?? 0
  const area = areaSquareMeters(room.polygon, project.unitsPerMeter)

  return (
    <Sheet open onOpenChange={(open) => !open && selectRoom(null)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{room.name || dict.roomTypes[room.type]}</SheetTitle>
          <SheetDescription>{dict.planner.area(area.toFixed(1))}</SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-name">{dict.planner.roomName}</Label>
            <Input
              id="room-name"
              value={room.name}
              placeholder={dict.roomTypes[room.type]}
              onChange={(e) => updateRoom(room.id, { name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-type">{dict.planner.roomType}</Label>
            <Select
              value={room.type}
              onValueChange={(value) => updateRoom(room.id, { type: value as RoomType })}
            >
              <SelectTrigger id="room-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {dict.roomTypes[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {dict.planner.suggested}
          </h3>
          {TIERS.map((tier) => {
            const items = suggestions.filter((item) => item.tier === tier)
            if (items.length === 0) return null
            return (
              <div key={tier} className="flex flex-col gap-2">
                <Badge
                  variant={tier === 'essential' ? 'default' : tier === 'comfort' ? 'secondary' : 'outline'}
                >
                  {dict.tiers[tier]}
                </Badge>
                {items.map((item) => {
                  const qty = qtyOf(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${
                        qty > 0 ? 'border-primary/50 bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm">
                          {dict.catalog[item.id as keyof Dict['catalog']] ?? item.id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatEur(item.priceEur, locale)} ·{' '}
                          {item.protocols.slice(0, 3).join(' / ')}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          disabled={qty === 0}
                          onClick={() => setDeviceQty(room.id, item.id, qty - 1)}
                          aria-label="−"
                        >
                          <MinusIcon />
                        </Button>
                        <span className="w-5 text-center text-sm tabular-nums">{qty}</span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => setDeviceQty(room.id, item.id, qty + 1)}
                          aria-label="+"
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <Separator />

        <Button
          variant="destructive"
          className="self-start"
          onClick={() => {
            deleteRoom(room.id)
            toast.success(dict.planner.roomDeleted)
          }}
        >
          <Trash2Icon /> {dict.planner.deleteRoom}
        </Button>
      </SheetContent>
    </Sheet>
  )
}
