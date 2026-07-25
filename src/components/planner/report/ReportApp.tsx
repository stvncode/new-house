import { ArrowLeftIcon, PrinterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlannerStore } from '@/stores/planner'
import { devicePoints } from '@/domain/planner/placement'
import { areaSquareMeters, bounds, centroid } from '@/domain/planner/geometry'
import { budgetTotal, deviceCount, formatEur, shoppingList } from '@/domain/planner/budget'
import { getCatalogItem } from '@/domain/catalog/devices'
import type { Floor, Room } from '@/domain/planner/types'
import { getDict, localizePath, type Dict, type Locale } from '@/i18n'

function MiniPlan({ floor, dict }: { floor: Floor; dict: Dict }) {
  if (floor.rooms.length === 0) return null
  const box = bounds(floor.rooms.map((r) => r.polygon))
  const pad = 20
  const viewBox = `${box.min[0] - pad} ${box.min[1] - pad} ${box.max[0] - box.min[0] + pad * 2} ${
    box.max[1] - box.min[1] + pad * 2
  }`
  return (
    <svg viewBox={viewBox} className="h-auto w-full max-w-lg rounded border border-neutral-300">
      {floor.rooms.map((room) => {
        const [cx, cy] = centroid(room.polygon)
        return (
          <g key={room.id}>
            <polygon
              points={room.polygon.map((p) => p.join(',')).join(' ')}
              fill="#f5f4f0"
              stroke="#333"
              strokeWidth={2}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fill="#333"
            >
              {room.name || dict.roomTypes[room.type]}
            </text>
            {devicePoints(room).map((marker) => (
              <circle
                key={`${marker.catalogId}-${marker.index}`}
                cx={marker.point[0]}
                cy={marker.point[1]}
                r={4}
                fill="#b45309"
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

function RoomSection({
  room,
  dict,
  locale,
  unitsPerMeter,
}: {
  room: Room
  dict: Dict
  locale: Locale
  unitsPerMeter: number
}) {
  const label = room.name || dict.roomTypes[room.type]
  const area = areaSquareMeters(room.polygon, unitsPerMeter)
  return (
    <div className="break-inside-avoid">
      <h4 className="mt-4 font-semibold">
        {label}{' '}
        <span className="text-sm font-normal text-neutral-500">
          — {dict.roomTypes[room.type]} · {dict.planner.area(area.toFixed(1))}
        </span>
      </h4>
      {room.devices.length === 0 ? (
        <p className="text-sm text-neutral-400">{dict.report.noDevices}</p>
      ) : (
        <table className="mt-1 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-1 pr-2">{dict.report.device}</th>
              <th className="py-1 pr-2">{dict.report.qty}</th>
              <th className="py-1 pr-2">{dict.report.protocols}</th>
              <th className="py-1 pr-2 text-right">{dict.report.unit}</th>
              <th className="py-1 text-right">{dict.report.total}</th>
            </tr>
          </thead>
          <tbody>
            {room.devices.map((device) => {
              const item = getCatalogItem(device.catalogId)
              if (!item) return null
              return (
                <tr key={device.catalogId} className="border-b border-neutral-200">
                  <td className="py-1 pr-2">
                    {dict.catalog[device.catalogId as keyof Dict['catalog']] ?? device.catalogId}
                    {item.requiresNeutral && (
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-800">
                        {dict.report.neutralBadge}
                      </span>
                    )}
                  </td>
                  <td className="py-1 pr-2 tabular-nums">{device.qty}</td>
                  <td className="py-1 pr-2 text-neutral-500">{item.protocols.join(' / ')}</td>
                  <td className="py-1 pr-2 text-right tabular-nums">
                    {formatEur(item.priceEur, locale)}
                  </td>
                  <td className="py-1 text-right tabular-nums">
                    {formatEur(item.priceEur * device.qty, locale)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function ReportApp({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  const project = usePlannerStore((s) => s.project)

  const floors = [...project.floors].sort((a, b) => a.level - b.level)
  const allRooms = floors.flatMap((f) => f.rooms)
  const rows = shoppingList(project)

  const neutralRooms = [
    ...new Set(
      allRooms
        .filter((room) =>
          room.devices.some((d) => getCatalogItem(d.catalogId)?.requiresNeutral),
        )
        .map((room) => room.name || dict.roomTypes[room.type]),
    ),
  ]
  const poeCount = rows
    .filter((r) => r.item.protocols.includes('poe') || r.item.protocols.includes('ethernet'))
    .reduce((sum, r) => sum + r.qty, 0)

  const totalArea = allRooms.reduce(
    (sum, room) => sum + areaSquareMeters(room.polygon, project.unitsPerMeter),
    0,
  )

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <a href={localizePath('/planner', locale)}>
            <ArrowLeftIcon /> {dict.report.back}
          </a>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <PrinterIcon /> {dict.report.print}
        </Button>
      </div>

      {/* The document itself: styled as paper, prints as-is */}
      <article className="rounded-xl bg-white p-8 text-neutral-900 shadow-2xl print:rounded-none print:p-0 print:shadow-none">
        {allRooms.length === 0 ? (
          <p className="text-neutral-500">{dict.report.empty}</p>
        ) : (
          <>
            <header className="border-b-2 border-neutral-900 pb-4">
              <h1 className="font-display text-3xl font-bold">{dict.report.title}</h1>
              <p className="mt-1 text-neutral-600">{dict.report.subtitle}</p>
              <p className="mt-2 text-sm text-neutral-500">
                {dict.report.generated(new Date().toLocaleDateString(locale))} ·{' '}
                {dict.report.summary(floors.length, allRooms.length, deviceCount(project))} ·{' '}
                {dict.report.area} {dict.planner.area(totalArea.toFixed(0))}
              </p>
            </header>

            {floors.map((floor) => (
              <section key={floor.id} className="mt-6 break-inside-avoid-page">
                <h2 className="border-b border-neutral-300 pb-1 font-display text-xl font-semibold">
                  {floor.name || dict.planner.floorN(floor.level)}
                </h2>
                <div className="mt-3">
                  <MiniPlan floor={floor} dict={dict} />
                </div>
                {floor.rooms.map((room) => (
                  <RoomSection
                    key={room.id}
                    room={room}
                    dict={dict}
                    locale={locale}
                    unitsPerMeter={project.unitsPerMeter}
                  />
                ))}
              </section>
            ))}

            <section className="mt-8 break-inside-avoid">
              <h2 className="border-b border-neutral-300 pb-1 font-display text-xl font-semibold">
                {dict.report.wiringTitle}
              </h2>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm">
                {neutralRooms.length > 0 && (
                  <li>{dict.report.wiringNeutral(neutralRooms.join(', '))}</li>
                )}
                {poeCount > 0 && <li>{dict.report.wiringPoE(poeCount)}</li>}
                {dict.report.wiringStatic.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>

            <footer className="mt-8 flex items-baseline justify-between border-t-2 border-neutral-900 pt-3">
              <span className="font-semibold">{dict.report.grandTotal}</span>
              <span className="font-display text-2xl font-bold tabular-nums">
                {formatEur(budgetTotal(project), locale)}
              </span>
            </footer>
          </>
        )}
      </article>
    </div>
  )
}
