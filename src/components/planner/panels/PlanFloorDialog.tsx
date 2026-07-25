import { useState } from 'react'
import { Building2Icon, CheckIcon, ImageIcon, PlusIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Floor } from '@/domain/planner/types'
import type { Dict } from '@/i18n'

export type PlanTarget = string | 'new-floor'

export function PlanFloorDialog({
  dataUrl,
  floors,
  activeFloorId,
  backgrounds,
  dict,
  onConfirm,
  onCancel,
}: {
  /** The freshly uploaded plan image awaiting a floor assignment */
  dataUrl: string
  floors: Floor[]
  activeFloorId: string
  backgrounds: Record<string, string>
  dict: Dict
  onConfirm: (target: PlanTarget) => void
  onCancel: () => void
}) {
  const [target, setTarget] = useState<PlanTarget>(activeFloorId)
  const sortedFloors = [...floors].sort((a, b) => a.level - b.level)

  const optionClass = (selected: boolean) =>
    `flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
      selected
        ? 'border-primary bg-primary/10'
        : 'border-border bg-secondary/40 hover:bg-accent'
    }`

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.planner.planDialogTitle}</DialogTitle>
          <DialogDescription>{dict.planner.planDialogBody}</DialogDescription>
        </DialogHeader>

        <img
          src={dataUrl}
          alt=""
          className="max-h-40 w-full rounded-lg border border-border object-contain bg-white/5"
        />

        <div className="flex flex-col gap-2">
          {sortedFloors.map((floor) => {
            const selected = target === floor.id
            const hasContent = floor.rooms.length > 0 || backgrounds[floor.id]
            return (
              <button
                key={floor.id}
                className={optionClass(selected)}
                onClick={() => setTarget(floor.id)}
              >
                <Building2Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">
                    {floor.name || dict.planner.floorN(floor.level)}
                  </span>
                  {hasContent && (
                    <span className="flex items-center gap-1 text-xs text-amber-300/90">
                      <ImageIcon className="size-3" />
                      {dict.planner.planDialogReplaceWarning}
                    </span>
                  )}
                </span>
                {selected && <CheckIcon className="size-4 shrink-0 text-primary" />}
              </button>
            )
          })}
          <button
            className={optionClass(target === 'new-floor')}
            onClick={() => setTarget('new-floor')}
          >
            <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 font-medium">{dict.planner.planDialogNewFloor}</span>
            {target === 'new-floor' && <CheckIcon className="size-4 shrink-0 text-primary" />}
          </button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            {dict.common.cancel}
          </Button>
          <Button onClick={() => onConfirm(target)}>{dict.common.confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
