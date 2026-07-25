import { useCallback, useEffect, useRef, useState } from 'react'
import type { Vec2 } from '@/domain/planner/types'
import { centroid, snapToGrid } from '@/domain/planner/geometry'
import { devicePoints } from '@/domain/planner/placement'
import { usePlannerStore } from '@/stores/planner'
import type { Dict } from '@/i18n'
import { VIEW_W, VIEW_H, GRID } from './view'

const CLOSE_RADIUS = 14

type Drag =
  | { kind: 'vertex'; roomId: string; index: number }
  | { kind: 'device'; roomId: string; catalogId: string; index: number }

export function TraceEditor({
  dict,
  showBackground = true,
  onCalibrate,
}: {
  dict: Dict
  showBackground?: boolean
  /** Called with the two clicked points once a calibration segment is complete */
  onCalibrate?: (points: [Vec2, Vec2]) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const [calibratePoints, setCalibratePoints] = useState<Vec2[]>([])
  const {
    project,
    activeFloorId,
    selectedRoomId,
    mode,
    draft,
    backgrounds,
    addDraftPoint,
    removeLastDraftPoint,
    cancelDraft,
    commitDraft,
    selectRoom,
    setMode,
    beginHistory,
    updateRoomPolygon,
    setDevicePosition,
  } = usePlannerStore()

  const floor = project.floors.find((f) => f.id === activeFloorId)
  const background = backgrounds[activeFloorId]
  const selectedRoom = floor?.rooms.find((r) => r.id === selectedRoomId)

  const toPlanCoords = useCallback(
    (e: { clientX: number; clientY: number }, snap = GRID): Vec2 | null => {
      const svg = svgRef.current
      if (!svg) return null
      const ctm = svg.getScreenCTM()
      if (!ctm) return null
      const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
      return [snapToGrid(point.x, snap), snapToGrid(point.y, snap)]
    },
    [],
  )

  useEffect(() => {
    setCalibratePoints([])
  }, [mode, activeFloorId])

  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'calibrate') {
      const point = toPlanCoords(e, 1)
      if (!point) return
      const points = [...calibratePoints, point]
      if (points.length === 2) {
        setCalibratePoints([])
        onCalibrate?.(points as [Vec2, Vec2])
      } else {
        setCalibratePoints(points)
      }
      return
    }
    if (mode !== 'draw') return
    const point = toPlanCoords(e)
    if (!point) return
    // Clicking near the first vertex closes the polygon
    if (draft.length >= 3) {
      const [fx, fy] = draft[0]!
      if (Math.hypot(point[0] - fx, point[1] - fy) <= CLOSE_RADIUS) {
        commitDraft()
        return
      }
    }
    // Clicking the last placed vertex removes it
    if (draft.length > 0) {
      const [lx, ly] = draft[draft.length - 1]!
      if (Math.hypot(point[0] - lx, point[1] - ly) <= CLOSE_RADIUS) {
        removeLastDraftPoint()
        return
      }
    }
    addDraftPoint(point)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.kind === 'vertex') {
      const point = toPlanCoords(e, GRID / 2)
      const room = floor?.rooms.find((r) => r.id === drag.roomId)
      if (!point || !room) return
      const polygon = room.polygon.map((p, i) => (i === drag.index ? point : p))
      updateRoomPolygon(drag.roomId, polygon)
    } else {
      const point = toPlanCoords(e, GRID / 2)
      if (!point) return
      setDevicePosition(drag.roomId, drag.catalogId, drag.index, point)
    }
  }

  useEffect(() => {
    const end = () => (dragRef.current = null)
    window.addEventListener('pointerup', end)
    return () => window.removeEventListener('pointerup', end)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === 'calibrate' && e.key === 'Escape') {
        setCalibratePoints([])
        setMode('select')
        return
      }
      if (mode !== 'draw') return
      if (e.key === 'Escape') cancelDraft()
      if (e.key === 'Enter') commitDraft()
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        removeLastDraftPoint()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, cancelDraft, commitDraft, removeLastDraftPoint, setMode])

  const deleteVertex = (index: number) => {
    if (!selectedRoom || selectedRoom.polygon.length <= 3) return
    updateRoomPolygon(
      selectedRoom.id,
      selectedRoom.polygon.filter((_, i) => i !== index),
      true,
    )
  }

  const insertVertex = (index: number, point: Vec2) => {
    if (!selectedRoom) return
    beginHistory()
    const polygon = [...selectedRoom.polygon]
    polygon.splice(index + 1, 0, point)
    updateRoomPolygon(selectedRoom.id, polygon)
    dragRef.current = { kind: 'vertex', roomId: selectedRoom.id, index: index + 1 }
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={`h-auto w-full touch-none rounded-lg border border-border bg-black/20 ${
        mode === 'draw' || mode === 'calibrate' ? 'cursor-crosshair' : ''
      }`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      role="application"
      aria-label={dict.planner.tabs.plan}
    >
      <defs>
        <pattern id="grid" width={GRID * 4} height={GRID * 4} patternUnits="userSpaceOnUse">
          <path
            d={`M ${GRID * 4} 0 L 0 0 0 ${GRID * 4}`}
            fill="none"
            stroke="oklch(0.28 0.016 265)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {background && showBackground && (
        <image
          href={background}
          x={0}
          y={0}
          width={VIEW_W}
          height={VIEW_H}
          preserveAspectRatio="xMidYMid meet"
          opacity={0.45}
        />
      )}
      <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" pointerEvents="none" />

      {floor?.rooms.map((room) => {
        const selected = room.id === selectedRoomId
        const lit = room.devices.length > 0
        const [cx, cy] = centroid(room.polygon)
        const label = room.name || dict.roomTypes[room.type]
        return (
          <g
            key={room.id}
            className={mode === 'select' ? 'cursor-pointer' : ''}
            onClick={(e) => {
              if (mode !== 'select') return
              e.stopPropagation()
              selectRoom(room.id)
            }}
          >
            <polygon
              points={room.polygon.map((p) => p.join(',')).join(' ')}
              fill={
                selected
                  ? 'oklch(0.82 0.13 75 / 22%)'
                  : lit
                    ? 'oklch(0.82 0.13 75 / 10%)'
                    : 'oklch(0.5 0.02 265 / 10%)'
              }
              stroke={selected ? 'oklch(0.82 0.13 75)' : 'oklch(0.55 0.03 265)'}
              strokeWidth={selected ? 2.5 : 1.5}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none fill-foreground text-[13px] font-medium"
            >
              {label}
            </text>
            {lit && !selected && (
              <circle cx={cx} cy={cy + 18} r={3} fill="oklch(0.82 0.13 75)">
                <animate
                  attributeName="opacity"
                  values="1;0.35;1"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}

      {/* Vertex + edge handles for the selected room */}
      {mode === 'select' && selectedRoom && (
        <g>
          {selectedRoom.polygon.map(([x, y], i) => {
            const [nx, ny] = selectedRoom.polygon[(i + 1) % selectedRoom.polygon.length]!
            return (
              <g key={i}>
                {/* Edge midpoint: click to add a corner */}
                <circle
                  cx={(x + nx) / 2}
                  cy={(y + ny) / 2}
                  r={4.5}
                  fill="oklch(0.55 0.03 265)"
                  stroke="oklch(0.18 0.016 265)"
                  strokeWidth={1.5}
                  className="cursor-copy"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    insertVertex(i, [
                      snapToGrid((x + nx) / 2, GRID / 2),
                      snapToGrid((y + ny) / 2, GRID / 2),
                    ])
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {/* Corner: drag to move, double-click to delete */}
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="oklch(0.82 0.13 75)"
                  stroke="oklch(0.18 0.016 265)"
                  strokeWidth={2}
                  className="cursor-move"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    beginHistory()
                    dragRef.current = { kind: 'vertex', roomId: selectedRoom.id, index: i }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    deleteVertex(i)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </g>
            )
          })}

          {/* Device markers: drag to place devices inside the room */}
          {devicePoints(selectedRoom).map((marker) => (
            <g
              key={`${marker.catalogId}-${marker.index}`}
              className="cursor-move"
              onPointerDown={(e) => {
                e.stopPropagation()
                beginHistory()
                dragRef.current = {
                  kind: 'device',
                  roomId: selectedRoom.id,
                  catalogId: marker.catalogId,
                  index: marker.index,
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <title>
                {dict.catalog[marker.catalogId as keyof Dict['catalog']] ?? marker.catalogId}
              </title>
              <circle
                cx={marker.point[0]}
                cy={marker.point[1]}
                r={6.5}
                fill="oklch(0.24 0.018 265)"
                stroke="oklch(0.82 0.13 75)"
                strokeWidth={2}
                opacity={marker.placed ? 1 : 0.65}
              />
              <circle
                cx={marker.point[0]}
                cy={marker.point[1]}
                r={2.2}
                fill="oklch(0.82 0.13 75)"
              />
            </g>
          ))}
        </g>
      )}

      {/* Calibration segment in progress */}
      {mode === 'calibrate' && calibratePoints.length > 0 && (
        <g pointerEvents="none">
          {calibratePoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5} fill="oklch(0.82 0.13 75)" />
          ))}
        </g>
      )}

      {/* In-progress polygon */}
      {draft.length > 0 && (
        <g pointerEvents="none">
          <polyline
            points={draft.map((p) => p.join(',')).join(' ')}
            fill="oklch(0.82 0.13 75 / 8%)"
            stroke="oklch(0.82 0.13 75)"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          {draft.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 0 ? 6 : 4}
              fill={i === 0 ? 'oklch(0.82 0.13 75)' : 'oklch(0.93 0.012 85)'}
            />
          ))}
        </g>
      )}
    </svg>
  )
}
