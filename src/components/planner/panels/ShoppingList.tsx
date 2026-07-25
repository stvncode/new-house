import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDownIcon, CableIcon } from 'lucide-react'
import { FileChartLineIcon } from '@/components/icons/file-chart-line'
import { ZapIcon } from '@/components/icons/zap'
import { Button } from '@/components/ui/button'
import { toShoppingCsv } from '@/domain/export/homeAssistant'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlannerStore } from '@/stores/planner'
import { shoppingList, formatEur, type ShoppingRow } from '@/domain/planner/budget'
import type { Dict, Locale } from '@/i18n'

export function ShoppingList({ dict, locale }: { dict: Dict; locale: Locale }) {
  const project = usePlannerStore((s) => s.project)
  const rows = useMemo(() => shoppingList(project), [project])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'total', desc: true }])

  const columnHelper = createColumnHelper<ShoppingRow>()
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => dict.catalog[row.item.id as keyof Dict['catalog']] ?? row.item.id, {
        id: 'device',
        header: dict.planner.listHeaders.device,
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.item.category, {
        id: 'category',
        header: dict.planner.listHeaders.category,
        cell: (info) => (
          <Badge variant="secondary">{dict.deviceCategories[info.getValue()]}</Badge>
        ),
      }),
      columnHelper.accessor((row) => row.rooms.join(', '), {
        id: 'rooms',
        header: dict.planner.listHeaders.rooms,
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor((row) => row.qty, {
        id: 'qty',
        header: dict.planner.listHeaders.qty,
        cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.item.priceEur, {
        id: 'unit',
        header: dict.planner.listHeaders.unit,
        cell: (info) => (
          <span className="tabular-nums">{formatEur(info.getValue(), locale)}</span>
        ),
      }),
      columnHelper.accessor((row) => row.total, {
        id: 'total',
        header: dict.planner.listHeaders.total,
        cell: (info) => (
          <span className="font-medium tabular-nums text-primary">
            {formatEur(info.getValue(), locale)}
          </span>
        ),
      }),
    ],
    [dict, locale],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {dict.planner.emptyList}
      </div>
    )
  }

  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0)

  // Wiring notes: rooms needing a neutral, devices best served wired
  const neutralRooms = [
    ...new Set(
      project.floors.flatMap((f) =>
        f.rooms
          .filter((r) =>
            r.devices.some((d) => {
              const row = rows.find((x) => x.item.id === d.catalogId)
              return row?.item.requiresNeutral
            }),
          )
          .map((r) => r.name || dict.roomTypes[r.type]),
      ),
    ),
  ]
  const poeCount = rows
    .filter((r) => r.item.protocols.includes('poe') || r.item.protocols.includes('ethernet'))
    .reduce((sum, r) => sum + r.qty, 0)

  const onExportCsv = () => {
    const csv = toShoppingCsv(rows, dict.planner.listHeaders, {
      deviceName: (id) => dict.catalog[id as keyof Dict['catalog']] ?? id,
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'foyer-shopping-list.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onExportCsv}>
          <FileChartLineIcon /> {dict.planner.exportCsv}
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <button
                    className="inline-flex cursor-pointer items-center gap-1 uppercase tracking-wider hover:text-foreground"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <ArrowUpDownIcon className="size-3 opacity-50" />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right font-medium">
              {dict.planner.totalBudget}
            </TableCell>
            <TableCell className="font-display text-base font-semibold tabular-nums text-primary">
              {formatEur(grandTotal, locale)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {(neutralRooms.length > 0 || poeCount > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CableIcon className="size-4 text-primary" />
              {dict.planner.wiringNotes}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            {neutralRooms.length > 0 && (
              <p className="flex items-start gap-2">
                <ZapIcon className="mt-0.5 size-3.5 shrink-0 text-primary [&_svg]:size-3.5" />
                {dict.planner.wiringNeutral(neutralRooms.join(', '))}
              </p>
            )}
            {poeCount > 0 && (
              <p className="flex items-start gap-2">
                <CableIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {dict.planner.wiringPoE(poeCount)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
