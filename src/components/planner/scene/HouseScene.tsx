import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Edges, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Project, Room, Vec2 } from '@/domain/planner/types'
import { bounds, centroid, polygonArea } from '@/domain/planner/geometry'

/** Radial warm gradient used for the light pools around lit rooms */
let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 156, 74, 0.55)')
  gradient.addColorStop(0.45, 'rgba(255, 140, 60, 0.22)')
  gradient.addColorStop(1, 'rgba(255, 130, 50, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  return glowTexture
}

/** Maquette-style proportions: short walls so you can see into every room */
/** Speckled lawn texture — reads as grass without any geometry cost */
let grassTexture: THREE.CanvasTexture | null = null
function getGrassTexture(): THREE.CanvasTexture {
  if (grassTexture) return grassTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#3a5431'
  ctx.fillRect(0, 0, size, size)
  const tones = ['#446139', '#30462a', '#4c6c41', '#385230', '#405c37']
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = tones[(Math.random() * tones.length) | 0]!
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.fillRect(x, y, 1 + Math.random() * 1.5, 1 + Math.random() * 3)
  }
  grassTexture = new THREE.CanvasTexture(canvas)
  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  return grassTexture
}

/** Soft warm halo for the sun */
let sunHaloTexture: THREE.CanvasTexture | null = null
function getSunHaloTexture(): THREE.CanvasTexture {
  if (sunHaloTexture) return sunHaloTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 226, 160, 0.9)')
  gradient.addColorStop(0.3, 'rgba(255, 200, 120, 0.35)')
  gradient.addColorStop(1, 'rgba(255, 180, 90, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  sunHaloTexture = new THREE.CanvasTexture(canvas)
  return sunHaloTexture
}

const WALL_H = 1.4
const WALL_T = 0.12
const PLATE = 0.1
const LEVEL_H = WALL_H + PLATE + 0.08

const COLOR_BODY = '#232834'
const COLOR_EDGE = '#454b5c'
const COLOR_GLOW = '#ff9c4a'
const COLOR_FLOOR = '#5c4a35'
const COLOR_SELECTED = '#f2b263'

interface SceneTransform {
  cx: number
  cy: number
  scale: number
  radius: number
}

function computeTransform(project: Project): SceneTransform {
  const polygons = project.floors.flatMap((f) => f.rooms.map((r) => r.polygon))
  const { min, max } = bounds(polygons)
  const cx = (min[0] + max[0]) / 2
  const cy = (min[1] + max[1]) / 2
  const scale = 1 / project.unitsPerMeter
  const radius = Math.max(
    ((max[0] - min[0]) / 2) * scale,
    ((max[1] - min[1]) / 2) * scale,
    3,
  )
  return { cx, cy, scale, radius }
}

function toShape(polygon: Vec2[], t: SceneTransform): THREE.Shape {
  const shape = new THREE.Shape()
  polygon.forEach(([x, y], i) => {
    const sx = (x - t.cx) * t.scale
    // Negated so that after rotateX(-90°) world +Z matches plan +Y (south)
    const sy = -((y - t.cy) * t.scale)
    if (i === 0) shape.moveTo(sx, sy)
    else shape.lineTo(sx, sy)
  })
  shape.closePath()
  return shape
}

/**
 * A room as a dollhouse cell: warm glowing floor plate + thin walls along
 * the polygon edges. Open-top so the house reads as a lit model of a home.
 */
function RoomMesh({
  room,
  level,
  transform,
  selected,
  label,
  ghosted,
  onSelect,
}: {
  room: Room
  level: number
  transform: SceneTransform
  selected: boolean
  label?: string
  /** Floors above the active one render as faint glass so you can see inside */
  ghosted?: boolean
  onSelect?: (roomId: string) => void
}) {
  const lit = room.devices.length > 0

  const plateGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(toShape(room.polygon, transform), {
      depth: PLATE,
      bevelEnabled: false,
    })
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [room.polygon, transform])

  const walls = useMemo(() => {
    const t = transform
    return room.polygon.map((a, i) => {
      const b = room.polygon[(i + 1) % room.polygon.length]!
      const ax = (a[0] - t.cx) * t.scale
      const az = (a[1] - t.cy) * t.scale
      const bx = (b[0] - t.cx) * t.scale
      const bz = (b[1] - t.cy) * t.scale
      return {
        length: Math.hypot(bx - ax, bz - az),
        midX: (ax + bx) / 2,
        midZ: (az + bz) / 2,
        rotationY: Math.atan2(-(bz - az), bx - ax),
      }
    })
  }, [room.polygon, transform])

  const [cx, cy] = centroid(room.polygon)
  const lx = (cx - transform.cx) * transform.scale
  const lz = (cy - transform.cy) * transform.scale
  const baseY = level * LEVEL_H

  const clickHandlers =
    onSelect && !ghosted
      ? {
          onClick: (e: { stopPropagation: () => void }) => {
            e.stopPropagation()
            onSelect(room.id)
          },
          onPointerOver: () => (document.body.style.cursor = 'pointer'),
          onPointerOut: () => (document.body.style.cursor = ''),
        }
      : {}

  // Floors above the active one are barely-there outlines (~10% visibility)
  const wallOpacity = ghosted ? 0.07 : 1
  const plateOpacity = ghosted ? 0.09 : 1

  return (
    <group position={[0, baseY, 0]}>
      {/* Glowing floor plate — every room reads as inhabited */}
      <mesh geometry={plateGeometry} receiveShadow={!ghosted} {...clickHandlers}>
        <meshStandardMaterial
          color={COLOR_FLOOR}
          roughness={0.9}
          emissive={selected ? COLOR_SELECTED : COLOR_GLOW}
          emissiveIntensity={ghosted ? 0 : selected ? 0.5 : lit ? 0.34 : 0.16}
          transparent={ghosted}
          opacity={plateOpacity}
          depthWrite={!ghosted}
        />
      </mesh>

      {/* Walls along each polygon edge */}
      {walls.map((wall, i) => (
        <mesh
          key={i}
          position={[wall.midX, PLATE + WALL_H / 2, wall.midZ]}
          rotation={[0, wall.rotationY, 0]}
          castShadow={!ghosted}
          receiveShadow={!ghosted}
          {...clickHandlers}
        >
          <boxGeometry args={[wall.length + WALL_T, WALL_H, WALL_T]} />
          <meshStandardMaterial
            color={COLOR_BODY}
            roughness={0.9}
            metalness={0.05}
            emissive={selected ? COLOR_SELECTED : '#000000'}
            emissiveIntensity={selected ? 0.22 : 0}
            transparent={ghosted}
            opacity={wallOpacity}
            depthWrite={!ghosted}
          />
          {!ghosted && <Edges color={selected ? COLOR_SELECTED : COLOR_EDGE} threshold={30} />}
        </mesh>
      ))}

      {/* Warm interior light, brighter when the room has devices planned */}
      {!ghosted && (
        <pointLight
          position={[lx, PLATE + WALL_H * 0.75, lz]}
          color={COLOR_GLOW}
          intensity={lit ? 1.8 : 0.6}
          distance={Math.max(3, Math.sqrt(polygonArea(room.polygon)) * transform.scale * 1.7)}
          decay={2}
        />
      )}

      {/* Pool of window light on the ground around lit ground-floor rooms */}
      {lit && level === 0 && !ghosted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.005, lz]}>
          <circleGeometry
            args={[Math.sqrt(polygonArea(room.polygon)) * transform.scale * 1.35, 32]}
          />
          <meshBasicMaterial
            map={getGlowTexture()}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {selected && label && (
        <Html position={[lx, WALL_H + 0.7, lz]} center zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-border bg-card/90 px-2 py-1 text-xs text-foreground shadow-glow backdrop-blur">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

/** Thin slab under each floor's footprint — visually ties the rooms together */
function Foundation({
  rooms,
  level,
  transform,
  ghosted,
}: {
  rooms: Room[]
  level: number
  transform: SceneTransform
  ghosted?: boolean
}) {
  if (rooms.length === 0) return null
  const { min, max } = bounds(rooms.map((r) => r.polygon))
  const margin = 0.25
  const sx = (max[0] - min[0]) * transform.scale + margin * 2
  const sz = (max[1] - min[1]) * transform.scale + margin * 2
  const cx = ((min[0] + max[0]) / 2 - transform.cx) * transform.scale
  const cz = ((min[1] + max[1]) / 2 - transform.cy) * transform.scale
  return (
    <mesh position={[cx, level * LEVEL_H - 0.04, cz]} receiveShadow={!ghosted}>
      <boxGeometry args={[sx, 0.12, sz]} />
      <meshStandardMaterial
        color="#1d212b"
        roughness={0.95}
        metalness={0.02}
        transparent={ghosted}
        opacity={ghosted ? 0.07 : 1}
        depthWrite={!ghosted}
      />
    </mesh>
  )
}

function Rig({ radius, autoRotate }: { radius: number; autoRotate: boolean }) {
  const d = radius * 3.1 + 6
  return (
    <OrbitControls
      makeDefault
      target={[0, WALL_H * 0.6, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      enablePan={false}
      minDistance={d * 0.4}
      maxDistance={d * 2}
      maxPolarAngle={Math.PI / 2 - 0.08}
    />
  )
}

/** A small garden plot under the house — a diorama base, not an endless field */
function Lawn({ radius }: { radius: number }) {
  const texture = useMemo(() => {
    const t = getGrassTexture().clone()
    // Roughly one texture tile per 2m of lawn
    t.repeat.set(radius / 2, radius / 2)
    t.needsUpdate = true
    return t
  }, [radius])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial map={texture} roughness={1} />
      </mesh>
      {/* Thin platform edge so the plot reads as a maquette base */}
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[radius, radius, 0.12, 64]} />
        <meshStandardMaterial color="#161a24" roughness={0.9} />
      </mesh>
    </group>
  )
}

/**
 * A small sun fixed in world space, low over the scene's visual horizon on
 * the same side as the warm key light — it moves naturally as you orbit
 * and sets behind the house from the default view.
 */
function Sun({ d }: { d: number }) {
  const position = useMemo(() => {
    return new THREE.Vector3(-1, -0.16, -1).normalize().multiplyScalar(d * 2.4)
  }, [d])
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[d * 0.05, 24, 24]} />
        <meshBasicMaterial color="#ffe8b8" fog={false} />
      </mesh>
      <sprite scale={[d * 0.32, d * 0.32, 1]}>
        <spriteMaterial
          map={getSunHaloTexture()}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </sprite>
    </group>
  )
}

export interface HouseSceneProps {
  project: Project
  selectedRoomId?: string | null
  onSelectRoom?: (roomId: string) => void
  autoRotate?: boolean
  /** Label to display above the selected room */
  selectedLabel?: string
  /** Floors above this level render ghosted so the active floor stays visible */
  activeLevel?: number
  className?: string
}

export function HouseScene({
  project,
  selectedRoomId,
  onSelectRoom,
  autoRotate = false,
  selectedLabel,
  activeLevel,
  className,
}: HouseSceneProps) {
  const transform = useMemo(() => computeTransform(project), [project])
  const d = transform.radius * 3.1 + 6

  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [d * 0.72, d * 0.6, d * 0.72], fov: 32 }}
      onPointerMissed={onSelectRoom ? () => onSelectRoom('') : undefined}
    >
      <fog attach="fog" args={['#131521', d * 1.2, d * 4.5]} />
      {/* Golden-hour fill: dusk sky above, grass bounce below */}
      <hemisphereLight args={['#8fa3d8', '#33422a', 1.1]} />
      {/* Warm sun key, from the sun's side of the sky */}
      <directionalLight
        position={[-13, 11, -13]}
        intensity={2.2}
        color="#ffdfae"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-(transform.radius * 1.8 + 3)}
        shadow-camera-right={transform.radius * 1.8 + 3}
        shadow-camera-top={transform.radius * 1.8 + 3}
        shadow-camera-bottom={-(transform.radius * 1.8 + 3)}
        shadow-camera-near={1}
        shadow-camera-far={d * 3}
        shadow-bias={-0.0004}
      />
      {/* Cool fill from the camera side so front facades stay legible */}
      <directionalLight position={[12, 10, 12]} intensity={0.9} color="#9fb4e8" />
      <Sun d={d} />
      {project.floors.map((floor) => (
        <group key={floor.id}>
          <Foundation
            rooms={floor.rooms}
            level={floor.level}
            transform={transform}
            ghosted={activeLevel !== undefined && floor.level > activeLevel}
          />
          {floor.rooms.map((room) => (
            <RoomMesh
              key={room.id}
              room={room}
              level={floor.level}
              transform={transform}
              selected={room.id === selectedRoomId}
              label={room.id === selectedRoomId ? selectedLabel : undefined}
              ghosted={activeLevel !== undefined && floor.level > activeLevel}
              onSelect={onSelectRoom}
            />
          ))}
        </group>
      ))}
      {/* Small garden plot under the house */}
      <Lawn radius={transform.radius * 1.5 + 2} />
      {/* Dark ground plane beneath everything */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <circleGeometry args={[Math.max(transform.radius * 4, 26), 48]} />
        <meshStandardMaterial color="#0c0e14" roughness={1} />
      </mesh>
      <Rig radius={transform.radius} autoRotate={autoRotate} />
    </Canvas>
  )
}
