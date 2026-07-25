import type { Project } from './types'

/**
 * A sample two-floor house used for the landing-page hero and as a
 * "load example" starting point in the planner. Cross-shaped ground floor
 * with two wings, smaller upper floor — 1 unit = 2.5 cm (40 units/m).
 */
export const DEMO_PROJECT: Project = {
  id: 'demo-house',
  name: 'Maison témoin',
  unitsPerMeter: 40,
  floors: [
    {
      id: 'ground',
      level: 0,
      name: '',
      rooms: [
        {
          id: 'living',
          name: 'Living room',
          type: 'living',
          polygon: [
            [200, 120],
            [520, 120],
            [520, 420],
            [200, 420],
          ],
          devices: [
            { catalogId: 'dimmer-module', qty: 2 },
            { catalogId: 'presence-sensor-mmwave', qty: 1 },
            { catalogId: 'shutter-module', qty: 3 },
            { catalogId: 'voice-satellite', qty: 1 },
            { catalogId: 'temp-humidity-sensor', qty: 1 },
          ],
        },
        {
          id: 'kitchen',
          name: 'Kitchen',
          type: 'kitchen',
          polygon: [
            [520, 120],
            [760, 120],
            [760, 300],
            [520, 300],
          ],
          devices: [
            { catalogId: 'switch-module', qty: 2 },
            { catalogId: 'leak-sensor', qty: 1 },
            { catalogId: 'smart-plug', qty: 2 },
          ],
        },
        {
          id: 'dining',
          name: 'Dining room',
          type: 'dining',
          polygon: [
            [520, 300],
            [760, 300],
            [760, 420],
            [520, 420],
          ],
          devices: [{ catalogId: 'dimmer-module', qty: 1 }],
        },
        {
          id: 'office',
          name: 'Office',
          type: 'office',
          polygon: [
            [40, 200],
            [200, 200],
            [200, 360],
            [40, 360],
          ],
          devices: [
            { catalogId: 'presence-sensor-mmwave', qty: 1 },
            { catalogId: 'smart-plug', qty: 1 },
          ],
        },
        {
          id: 'entrance',
          name: 'Entrance',
          type: 'entrance',
          polygon: [
            [760, 180],
            [920, 180],
            [920, 420],
            [760, 420],
          ],
          devices: [
            { catalogId: 'smart-lock', qty: 1 },
            { catalogId: 'video-doorbell', qty: 1 },
            { catalogId: 'motion-sensor', qty: 1 },
          ],
        },
      ],
    },
    {
      id: 'upper',
      level: 1,
      name: '',
      rooms: [
        {
          id: 'bedroom-1',
          name: 'Main bedroom',
          type: 'bedroom',
          polygon: [
            [260, 100],
            [480, 100],
            [480, 260],
            [260, 260],
          ],
          devices: [
            { catalogId: 'smart-bulb', qty: 2 },
            { catalogId: 'radiator-valve', qty: 1 },
            { catalogId: 'curtain-motor', qty: 1 },
          ],
        },
        {
          id: 'bedroom-2',
          name: 'Kids bedroom',
          type: 'bedroom',
          polygon: [
            [480, 100],
            [700, 100],
            [700, 260],
            [480, 260],
          ],
          devices: [
            { catalogId: 'smart-bulb', qty: 1 },
            { catalogId: 'temp-humidity-sensor', qty: 1 },
          ],
        },
        {
          id: 'bathroom',
          name: 'Bathroom',
          type: 'bathroom',
          polygon: [
            [260, 260],
            [420, 260],
            [420, 400],
            [260, 400],
          ],
          devices: [
            { catalogId: 'motion-sensor', qty: 1 },
            { catalogId: 'leak-sensor', qty: 1 },
          ],
        },
        {
          id: 'landing',
          name: 'Landing',
          type: 'hallway',
          polygon: [
            [420, 260],
            [700, 260],
            [700, 400],
            [420, 400],
          ],
          devices: [
            { catalogId: 'motion-sensor', qty: 1 },
            { catalogId: 'smoke-detector', qty: 1 },
          ],
        },
      ],
    },
  ],
}
