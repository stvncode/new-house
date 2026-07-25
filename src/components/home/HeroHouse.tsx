import { HouseScene } from '@/components/planner/scene/HouseScene'
import { DEMO_PROJECT } from '@/domain/planner/demo'
import { budgetTotal, deviceCount, formatEur } from '@/domain/planner/budget'
import { usePlannerStore } from '@/stores/planner'
import { getDict, type Locale } from '@/i18n'
import { CircuitBoard } from 'lucide-react'
import { HandCoinsIcon } from '@/components/icons/hand-coins'

export default function HeroHouse({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  // Show the visitor their own house once they have one; the demo otherwise
  const stored = usePlannerStore((s) => s.project)
  const project = stored.floors.some((f) => f.rooms.length > 0) ? stored : DEMO_PROJECT
  const devices = deviceCount(project)
  const budget = formatEur(budgetTotal(project), locale)
  const rooms = project.floors.reduce((n, f) => n + f.rooms.length, 0)

  return (
    <div className="relative h-[420px] w-full sm:h-[520px]">
      <HouseScene project={project} className="!absolute inset-0" />

      {/* Floating stat cards, like a live dashboard */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2 sm:left-6 sm:top-6">
        <div className="animate-rise rounded-lg border border-border/70 bg-card/80 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <CircuitBoard className="size-3 text-primary" />
            {dict.home.statDevices}
          </div>
          <div className="font-display text-lg font-semibold">{devices}</div>
        </div>
        <div
          className="animate-rise rounded-lg border border-border/70 bg-card/80 px-3 py-2 backdrop-blur"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <HandCoinsIcon className="size-3 text-primary [&_svg]:size-3" />
            {dict.home.statBudget}
          </div>
          <div className="font-display text-lg font-semibold">{budget}</div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        {rooms} {dict.home.statRooms} · {dict.home.heroHint}
      </div>
    </div>
  )
}
