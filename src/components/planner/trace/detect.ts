import { detectRooms } from '@/domain/vision/detectRooms'
import type { Vec2 } from '@/domain/planner/types'
import { VIEW_W, VIEW_H } from './view'

/**
 * Detection resolution: high enough that thick walls and thin decoration
 * lines (hatching, furniture, text) are measurably different widths.
 */
const MAX_DETECT_DIMENSION = 800
/** Output vertices snap to half the editor grid for clean-looking rooms */
const SNAP = 5

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load plan image'))
    img.src = src
  })
}

/**
 * Detect rooms in an uploaded plan image and return polygons in the
 * 2D editor's viewbox coordinates — matching exactly how the <image>
 * background is rendered (preserveAspectRatio="xMidYMid meet").
 */
export async function detectRoomsFromImage(dataUrl: string): Promise<Vec2[][]> {
  const img = await loadImage(dataUrl)
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih) return []

  const downscale = Math.min(1, MAX_DETECT_DIMENSION / Math.max(iw, ih))
  const pw = Math.max(1, Math.round(iw * downscale))
  const ph = Math.max(1, Math.round(ih * downscale))

  const canvas = document.createElement('canvas')
  canvas.width = pw
  canvas.height = ph
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  // White backing so transparent PNGs read as paper
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, pw, ph)
  ctx.drawImage(img, 0, 0, pw, ph)
  const pixels = ctx.getImageData(0, 0, pw, ph)

  const polygons = detectRooms({ width: pw, height: ph, data: pixels.data })

  // Same fit transform the SVG applies to the background image
  const drawScale = Math.min(VIEW_W / iw, VIEW_H / ih)
  const offsetX = (VIEW_W - iw * drawScale) / 2
  const offsetY = (VIEW_H - ih * drawScale) / 2
  const k = drawScale / downscale

  return polygons.map((polygon) =>
    polygon.map(([x, y]): Vec2 => [
      Math.round((x * k + offsetX) / SNAP) * SNAP,
      Math.round((y * k + offsetY) / SNAP) * SNAP,
    ]),
  )
}
