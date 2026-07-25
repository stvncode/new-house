import { useCallback, useEffect, useRef } from 'react'
import type { Vec2 } from '@/domain/planner/types'
import { centroid, snapToGrid } from '@/domain/planner/geometry'
import { usePlannerStore } from '@/stores/planner'
import type { Dict } from '@/i18n'

import { VIEW_W, VIEW_H, GRID } from './view'

const CLOSE_RADIUS = 14

export function TraceEditor({
  dict,
  showBackground = true,
}: {
  dict: Dict
  showBackground?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
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
  } = usePlannerStore()

  const floor = project.floors.find((f) => f.id === activeFloorId)
  const background = backgrounds[activeFloorId]

  const toPlanCoords = useCallback((e: React.MouseEvent): Vec2 | null => {
    const svg = svgRef.current
    if (!svg) return null
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    return [snapToGrid(point.x, GRID), snapToGrid(point.y, GRID)]
  }, [])

  const handleClick = (e: React.MouseEvent) => {
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
  }, [mode, cancelDraft, commitDraft, removeLastDraftPoint])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={`h-auto w-full rounded-lg border border-border bg-black/20 ${
        mode === 'draw' ? 'cursor-crosshair' : ''
      }`}
      onClick={handleClick}
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
            className="cursor-pointer"
            onClick={(e) => {
              if (mode === 'draw') return
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
            {lit && (
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
