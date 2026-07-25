import { useEffect, useRef, useState } from 'react'
import {
  Building2Icon,
  DownloadIcon,
  EraserIcon,
  EyeIcon,
  EyeOffIcon,
  HouseIcon,
  ImageIcon,
  ListIcon,
  MousePointer2Icon,
  PenLineIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RulerIcon,
  SparklesIcon,
  Trash2Icon,
  Undo2Icon,
  UploadIcon,
  WandSparklesIcon,
  XIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TraceEditor } from './trace/TraceEditor'
import { detectRoomsFromImage } from './trace/detect'
import { compressPlanImage } from './trace/compress'
import { PlanFloorDialog, type PlanTarget } from './panels/PlanFloorDialog'
import { loadBackgrounds } from '@/lib/imageStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Vec2 } from '@/domain/planner/types'
import { HouseScene } from './scene/HouseScene'
import { RoomSheet } from './panels/RoomSheet'
import { ShoppingList } from './panels/ShoppingList'
import { usePlannerStore, isProject } from '@/stores/planner'
import { areaSquareMeters } from '@/domain/planner/geometry'
import { budgetTotal, deviceCount, formatEur } from '@/domain/planner/budget'
import { getDict, type Locale } from '@/i18n'

export default function PlannerApp({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  const store = usePlannerStore()
  const {
    project,
    activeFloorId,
    selectedRoomId,
    mode,
    backgrounds,
    setMode,
    setActiveFloor,
    addFloor,
    deleteFloor,
    selectRoom,
    setBackground,
    removeBackground,
    replaceDetectedRooms,
    loadDemo,
    clearAll,
    importProject,
    undo,
    redo,
    past,
    future,
    setUnitsPerMeter,
  } = store

  // Returning users with a house already traced land on the 3D view
  const [tab, setTab] = useState(() =>
    usePlannerStore.getState().project.floors.some((f) => f.rooms.length > 0)
      ? 'house'
      : 'plan',
  )
  const [detecting, setDetecting] = useState(false)
  const [showBackground, setShowBackground] = useState(true)
  /** Uploaded plan waiting for the user to pick its floor */
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)
  /** Two clicked calibration points waiting for the real distance */
  const [calibratePending, setCalibratePending] = useState<[Vec2, Vec2] | null>(null)
  const [calibrateMeters, setCalibrateMeters] = useState('')
  const importRef = useRef<HTMLInputElement>(null)
  const bgRef = useRef<HTMLInputElement>(null)

  // Plan images persist in IndexedDB (too big for localStorage) — restore them
  useEffect(() => {
    void loadBackgrounds().then((backgrounds) => {
      if (Object.keys(backgrounds).length > 0) {
        usePlannerStore.getState().hydrateBackgrounds(backgrounds)
      }
    })
  }, [])

  // Undo/redo keyboard shortcuts: ⌘Z / ⇧⌘Z (Ctrl+Z / Ctrl+Y on Windows)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      const key = e.key.toLowerCase()
      if (key === 'z' && e.shiftKey) {
        e.preventDefault()
        usePlannerStore.getState().redo()
      } else if (key === 'z') {
        e.preventDefault()
        usePlannerStore.getState().undo()
      } else if (key === 'y') {
        e.preventDefault()
        usePlannerStore.getState().redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onCalibrateConfirm = () => {
    const points = calibratePending
    const meters = Number.parseFloat(calibrateMeters.replace(',', '.'))
    setCalibratePending(null)
    setCalibrateMeters('')
    if (!points) return
    if (!Number.isFinite(meters) || meters <= 0) {
      toast.error(dict.planner.calibrateInvalid)
      return
    }
    const pixels = Math.hypot(points[1][0] - points[0][0], points[1][1] - points[0][1])
    if (pixels < 2) {
      toast.error(dict.planner.calibrateInvalid)
      return
    }
    setUnitsPerMeter(pixels / meters)
    setMode('select')
    toast.success(dict.planner.calibrateDone)
  }

  const activeFloor = project.floors.find((f) => f.id === activeFloorId)
  const sortedFloors = [...project.floors].sort((a, b) => a.level - b.level)
  const selectedRoom = project.floors
    .flatMap((f) => f.rooms)
    .find((r) => r.id === selectedRoomId)
  const budget = budgetTotal(project)
  const devices = deviceCount(project)

  const onExport = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'foyer-project.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(dict.planner.exported)
  }

  const onImportFile = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!isProject(parsed)) throw new Error('shape')
      importProject(parsed)
    } catch {
      toast.error(dict.planner.importError)
    }
  }

  /** Destructive actions confirm via a toast action instead of window.confirm */
  const confirmToast = (message: string, done: string, action: () => void) => {
    toast.warning(message, {
      action: {
        label: dict.common.confirm,
        onClick: () => {
          action()
          toast.success(done)
        },
      },
      cancel: { label: dict.common.cancel, onClick: () => {} },
      duration: 8000,
    })
  }

  const runDetection = async (dataUrl: string) => {
    if (detecting) return
    setDetecting(true)
    const toastId = toast.loading(dict.planner.detecting)
    try {
      const polygons = await detectRoomsFromImage(dataUrl)
      if (polygons.length === 0) {
        toast.error(dict.planner.detectNone, { id: toastId })
      } else {
        // Re-running detection replaces earlier results instead of stacking them
        replaceDetectedRooms(polygons)
        toast.success(dict.planner.detected(polygons.length), { id: toastId, duration: 8000 })
      }
    } catch {
      toast.error(dict.planner.detectNone, { id: toastId })
    } finally {
      setDetecting(false)
    }
  }

  const onBackgroundFile = async (file: File) => {
    try {
      // Ask which floor this plan belongs to before doing anything
      setPendingPlan(await compressPlanImage(file))
    } catch {
      toast.error(dict.planner.detectNone)
    }
  }

  const onPlanTargetConfirm = (target: PlanTarget) => {
    const dataUrl = pendingPlan
    setPendingPlan(null)
    if (!dataUrl) return
    let floorId: string
    if (target === 'new-floor') {
      addFloor()
      floorId = usePlannerStore.getState().activeFloorId
    } else {
      floorId = target
      setActiveFloor(floorId)
    }
    // A new plan replaces the floor's previous plan and rooms entirely
    setBackground(floorId, dataUrl)
    replaceDetectedRooms([])
    setShowBackground(true)
    void runDetection(dataUrl)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header row: stats + project actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
            {devices} <span className="text-muted-foreground">{dict.planner.totalDevices}</span>
          </Badge>
          <Badge className="gap-1.5 px-3 py-1 text-sm">
            {formatEur(budget, locale)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={loadDemo}>
            <SparklesIcon /> {dict.planner.loadExample}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              confirmToast(dict.planner.clearConfirm, dict.planner.projectCleared, clearAll)
            }
          >
            <EraserIcon /> {dict.planner.clearAll}
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport}>
            <DownloadIcon /> {dict.planner.exportJson}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => importRef.current?.click()}>
            <UploadIcon /> {dict.planner.importJson}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <PrinterIcon /> {dict.planner.print}
          </Button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void onImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="plan">
              <PenLineIcon /> {dict.planner.tabs.plan}
            </TabsTrigger>
            <TabsTrigger value="house">
              <HouseIcon /> {dict.planner.tabs.house}
            </TabsTrigger>
            <TabsTrigger value="list">
              <ListIcon /> {dict.planner.tabs.list}
            </TabsTrigger>
          </TabsList>

          {/* Floor switcher */}
          <div className="flex items-center gap-1.5">
            <Building2Icon className="size-4 text-muted-foreground" />
            {sortedFloors.map((floor) => (
              <Button
                key={floor.id}
                variant={floor.id === activeFloorId ? 'secondary' : 'ghost'}
                size="sm"
                className={floor.id === activeFloorId ? 'border-primary/40' : ''}
                onClick={() => setActiveFloor(floor.id)}
              >
                {floor.name || dict.planner.floorN(floor.level)}
                {backgrounds[floor.id] && <ImageIcon className="!size-3 opacity-60" />}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={addFloor}
              aria-label={dict.planner.addFloor}
            >
              <PlusIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => {
                const hasRooms = (activeFloor?.rooms.length ?? 0) > 0
                if (hasRooms) {
                  confirmToast(dict.planner.deleteFloorConfirm, dict.planner.floorDeleted, () =>
                    deleteFloor(activeFloorId),
                  )
                } else {
                  deleteFloor(activeFloorId)
                  toast.success(dict.planner.floorDeleted)
                }
              }}
              aria-label={dict.planner.deleteFloor}
              title={dict.planner.deleteFloor}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>

        <TabsContent value="plan" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  variant={mode === 'select' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('select')}
                >
                  <MousePointer2Icon /> {dict.planner.select}
                </Button>
                <Button
                  variant={mode === 'draw' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('draw')}
                >
                  <PenLineIcon /> {dict.planner.drawRoom}
                </Button>
                <Button
                  variant={mode === 'calibrate' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode(mode === 'calibrate' ? 'select' : 'calibrate')}
                >
                  <RulerIcon /> {dict.planner.calibrate}
                </Button>
                <div className="mx-2 h-5 w-px bg-border" />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={past.length === 0}
                  onClick={undo}
                  aria-label={dict.planner.undo}
                  title={`${dict.planner.undo} (⌘Z)`}
                >
                  <Undo2Icon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={future.length === 0}
                  onClick={redo}
                  aria-label={dict.planner.redo}
                  title={`${dict.planner.redo} (⇧⌘Z)`}
                >
                  <Redo2Icon />
                </Button>
                <div className="mx-2 h-5 w-px bg-border" />
                <Button variant="ghost" size="sm" onClick={() => bgRef.current?.click()}>
                  <ImageIcon /> {dict.planner.background}
                </Button>
                {backgrounds[activeFloorId] && (
                  <>
                    <Button
                      size="sm"
                      disabled={detecting}
                      onClick={() => void runDetection(backgrounds[activeFloorId]!)}
                    >
                      <WandSparklesIcon /> {dict.planner.detect}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBackground((v) => !v)}
                    >
                      {showBackground ? <EyeOffIcon /> : <EyeIcon />}
                      {showBackground ? dict.planner.hideImage : dict.planner.showImage}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // The rooms came from this plan — they go with it
                        removeBackground(activeFloorId)
                        replaceDetectedRooms([])
                      }}
                    >
                      <XIcon /> {dict.planner.removeBackground}
                    </Button>
                  </>
                )}
                <input
                  ref={bgRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onBackgroundFile(file)
                    e.target.value = ''
                  }}
                />
              </div>
              {mode === 'draw' && (
                <p className="text-xs text-muted-foreground">{dict.planner.drawingHint}</p>
              )}
              {mode === 'calibrate' && (
                <p className="text-xs text-primary">{dict.planner.calibrateHint}</p>
              )}
              {mode === 'select' && selectedRoom && (
                <p className="text-xs text-muted-foreground">{dict.planner.editHint}</p>
              )}
              <TraceEditor
                dict={dict}
                showBackground={showBackground}
                onCalibrate={(points) => {
                  setCalibrateMeters('')
                  setCalibratePending(points)
                }}
              />
              <p className="text-xs text-muted-foreground">{dict.planner.backgroundHint}</p>
            </div>

            {/* Rooms sidebar */}
            <aside className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {dict.planner.rooms}
              </h3>
              {activeFloor && activeFloor.rooms.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  {dict.planner.noRooms}
                </p>
              )}
              {activeFloor?.rooms.map((room) => (
                <button
                  key={room.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                    room.id === selectedRoomId
                      ? 'border-primary/60 bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => selectRoom(room.id)}
                >
                  <span className="truncate">{room.name || dict.roomTypes[room.type]}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {dict.planner.area(
                      areaSquareMeters(room.polygon, project.unitsPerMeter).toFixed(0),
                    )}
                    {room.devices.length > 0 && (
                      <Badge className="px-1.5 py-0">{room.devices.length}</Badge>
                    )}
                  </span>
                </button>
              ))}
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="house" className="mt-4">
          {project.floors.every((f) => f.rooms.length === 0) ? (
            <div className="rounded-lg border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
              {dict.planner.is3dEmpty}
            </div>
          ) : (
            <div className="relative h-[560px] overflow-hidden rounded-lg border border-border bg-black/20">
              <HouseScene
                project={project}
                selectedRoomId={selectedRoomId}
                selectedLabel={
                  selectedRoom ? selectedRoom.name || dict.roomTypes[selectedRoom.type] : undefined
                }
                activeLevel={activeFloor?.level}
                onSelectRoom={(id) => selectRoom(id || null)}
                className="!absolute inset-0"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <ShoppingList dict={dict} locale={locale} />
        </TabsContent>
      </Tabs>

      <RoomSheet dict={dict} locale={locale} />
      {calibratePending && (
        <Dialog open onOpenChange={(open) => !open && setCalibratePending(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict.planner.calibrateTitle}</DialogTitle>
              <DialogDescription>{dict.planner.calibrateBody}</DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                onCalibrateConfirm()
              }}
            >
              <Label htmlFor="calibrate-meters">{dict.planner.calibrateMeters}</Label>
              <Input
                id="calibrate-meters"
                type="text"
                inputMode="decimal"
                autoFocus
                placeholder="3.57"
                value={calibrateMeters}
                onChange={(e) => setCalibrateMeters(e.target.value)}
              />
              <DialogFooter className="mt-2">
                <Button type="button" variant="ghost" onClick={() => setCalibratePending(null)}>
                  {dict.common.cancel}
                </Button>
                <Button type="submit">{dict.common.confirm}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {pendingPlan && (
        <PlanFloorDialog
          dataUrl={pendingPlan}
          floors={project.floors}
          activeFloorId={activeFloorId}
          backgrounds={backgrounds}
          dict={dict}
          onConfirm={onPlanTargetConfirm}
          onCancel={() => setPendingPlan(null)}
        />
      )}
      <Toaster />
    </div>
  )
}
