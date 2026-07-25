import { describe, expect, it } from 'vitest'
import { autoplan } from './autoplan'
import { toHomeAssistantYaml, toShoppingCsv } from '@/domain/export/homeAssistant'
import { shoppingList } from './budget'
import type { Project } from './types'
import type { Answers } from '@/domain/wizard/types'

function makeProject(): Project {
  return {
    id: 'test',
    name: 'Test house',
    unitsPerMeter: 40,
    floors: [
      {
        id: 'f0',
        level: 0,
        name: '',
        rooms: [
          {
            id: 'living',
            name: 'Living',
            type: 'living',
            polygon: [
              [0, 0],
              [200, 0],
              [200, 100],
              [0, 100],
            ],
            devices: [],
          },
          {
            id: 'bath',
            name: '',
            type: 'bathroom',
            polygon: [
              [200, 0],
              [300, 0],
              [300, 100],
              [200, 100],
            ],
            devices: [],
          },
          {
            id: 'tech',
            name: '',
            type: 'technical',
            polygon: [
              [300, 0],
              [360, 0],
              [360, 100],
              [300, 100],
            ],
            devices: [],
          },
        ],
      },
    ],
  }
}

const PRO_ANSWERS: Answers = {
  stage: 'new-build',
  budget: 'pro',
  priorities: ['lighting', 'climate', 'security', 'presence'],
  heating: 'radiators',
  privacy: 'local-only',
}

describe('autoplan', () => {
  it('fills rooms according to priorities, budget and heating type', () => {
    const { project, added } = autoplan(makeProject(), PRO_ANSWERS)
    expect(added).toBeGreaterThan(0)

    const living = project.floors[0]!.rooms.find((r) => r.id === 'living')!
    const ids = living.devices.map((d) => d.catalogId)
    expect(ids).toContain('radiator-valve') // climate + radiators
    expect(ids).toContain('presence-sensor-mmwave') // presence, pro budget
    expect(ids).not.toContain('motion-sensor') // superseded by mmWave
    expect(ids).not.toContain('pilot-wire-module') // wrong heating type

    const bath = project.floors[0]!.rooms.find((r) => r.id === 'bath')!
    expect(bath.devices.map((d) => d.catalogId)).toContain('leak-sensor') // safety baseline

    // One hub, placed in the technical room
    const tech = project.floors[0]!.rooms.find((r) => r.id === 'tech')!
    expect(tech.devices.map((d) => d.catalogId)).toContain('hub-home-assistant')
  })

  it('respects a starter budget by staying at the essential tier', () => {
    const { project } = autoplan(makeProject(), { ...PRO_ANSWERS, budget: 'starter' })
    const living = project.floors[0]!.rooms.find((r) => r.id === 'living')!
    const ids = living.devices.map((d) => d.catalogId)
    expect(ids).not.toContain('presence-sensor-mmwave') // premium tier
    expect(ids).not.toContain('radiator-valve') // comfort tier
  })

  it('is idempotent and never touches existing entries', () => {
    const first = autoplan(makeProject(), PRO_ANSWERS)
    const second = autoplan(first.project, PRO_ANSWERS)
    expect(second.added).toBe(0)
    expect(second.project).toEqual(first.project)
  })

  it('does not mutate the input project', () => {
    const input = makeProject()
    const snapshot = JSON.stringify(input)
    autoplan(input, PRO_ANSWERS)
    expect(JSON.stringify(input)).toBe(snapshot)
  })
})

describe('exports', () => {
  const naming = {
    deviceName: (id: string) => `name:${id}`,
    floorName: (level: number) => `Floor ${level}`,
    roomName: (name: string, type: string) => name || `type:${type}`,
  }

  it('produces a Home Assistant starter yaml with floors, areas and devices', () => {
    const { project } = autoplan(makeProject(), PRO_ANSWERS)
    const yaml = toHomeAssistantYaml(project, naming)
    expect(yaml).toContain('floors:')
    expect(yaml).toContain('areas:')
    expect(yaml).toContain('- name: "Living"')
    expect(yaml).toContain('- name: "type:bathroom"')
    expect(yaml).toContain('floor: "Floor 0"')
    expect(yaml).toContain('name:hub-home-assistant')
  })

  it('produces a well-formed csv with quoting', () => {
    const { project } = autoplan(makeProject(), PRO_ANSWERS)
    const rows = shoppingList(project)
    const csv = toShoppingCsv(
      rows,
      { device: 'Device', category: 'Category', rooms: 'Rooms', qty: 'Qty', unit: 'Unit, price', total: 'Total' },
      naming,
    )
    const lines = csv.trim().split('\n')
    expect(lines.length).toBe(rows.length + 1)
    expect(lines[0]).toContain('"Unit, price"') // comma-containing header quoted
    expect(lines[1]!.split(',').length).toBeGreaterThanOrEqual(6)
  })
})
