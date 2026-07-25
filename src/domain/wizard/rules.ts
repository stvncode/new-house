import type { Rule } from './types'
import { canWire, has, is, isLargeHouse, multi } from './answers'

/**
 * The recommendation rulebook. Each rule's title/body lives in the i18n
 * dictionaries under `recommendations.<ruleId>`.
 */
export const RULES: Rule[] = [
  // ── Ecosystem ────────────────────────────────────────────────────────────
  {
    id: 'eco-ha-green',
    category: 'ecosystem',
    priority: 90,
    when: (a) => is(a, 'skill', 'beginner'),
    guides: ['ecosystem-local-first'],
  },
  {
    id: 'eco-ha-standard',
    category: 'ecosystem',
    priority: 90,
    when: (a) => is(a, 'skill', 'comfortable', 'tinkerer') || !is(a, 'skill', 'beginner'),
    guides: ['ecosystem-local-first'],
  },
  {
    id: 'eco-local-first',
    category: 'ecosystem',
    priority: 80,
    when: (a) => is(a, 'privacy', 'local-only'),
    guides: ['ecosystem-local-first'],
  },

  // ── Protocols ────────────────────────────────────────────────────────────
  {
    id: 'proto-zigbee-backbone',
    category: 'protocol',
    priority: 90,
    when: () => true,
    guides: ['choosing-protocols'],
  },
  {
    id: 'proto-thread-matter',
    category: 'protocol',
    priority: 70,
    when: (a) => is(a, 'budget', 'high', 'pro') || is(a, 'maintenance', 'set-forget'),
    guides: ['choosing-protocols'],
  },
  {
    id: 'proto-knx-consider',
    category: 'protocol',
    priority: 85,
    when: (a) =>
      is(a, 'stage', 'new-build') &&
      is(a, 'budget', 'pro') &&
      is(a, 'maintenance', 'set-forget'),
    guides: ['choosing-protocols', 'prewiring-checklist'],
  },
  {
    id: 'proto-zwave-security',
    category: 'protocol',
    priority: 60,
    when: (a) => has(a, 'priorities', 'security'),
    guides: ['choosing-protocols'],
  },
  {
    id: 'proto-wifi-caution',
    category: 'protocol',
    priority: 40,
    when: () => true,
    guides: ['choosing-protocols', 'large-house-network'],
  },

  // ── Wiring ───────────────────────────────────────────────────────────────
  {
    id: 'wire-ethernet-everywhere',
    category: 'wiring',
    priority: 95,
    when: (a) => is(a, 'stage', 'new-build'),
    guides: ['prewiring-checklist'],
  },
  {
    id: 'wire-neutral-everywhere',
    category: 'wiring',
    priority: 90,
    when: (a) => canWire(a),
    guides: ['prewiring-checklist'],
  },
  {
    id: 'wire-conduits',
    category: 'wiring',
    priority: 85,
    when: (a) => is(a, 'stage', 'new-build'),
    guides: ['prewiring-checklist'],
  },
  {
    id: 'wire-shutters',
    category: 'wiring',
    priority: 75,
    when: (a) => canWire(a) && has(a, 'priorities', 'blinds'),
    guides: ['prewiring-checklist'],
  },
  {
    id: 'wire-tenant-friendly',
    category: 'wiring',
    priority: 90,
    when: (a) => is(a, 'ownership', 'tenant') || is(a, 'wiring', 'no-wiring'),
    guides: ['room-by-room'],
  },

  // ── Network & scale ──────────────────────────────────────────────────────
  {
    id: 'net-wired-aps',
    category: 'network',
    priority: 90,
    when: (a) => isLargeHouse(a),
    guides: ['large-house-network'],
  },
  {
    id: 'net-poe',
    category: 'network',
    priority: 75,
    when: (a) => isLargeHouse(a) && is(a, 'budget', 'high', 'pro'),
    guides: ['large-house-network', 'prewiring-checklist'],
  },
  {
    id: 'net-mesh-density',
    category: 'network',
    priority: 70,
    when: (a) => isLargeHouse(a),
    guides: ['large-house-network', 'choosing-protocols'],
  },
  {
    id: 'net-technical-room',
    category: 'network',
    priority: 80,
    when: (a) => is(a, 'stage', 'new-build') || (isLargeHouse(a) && canWire(a)),
    guides: ['prewiring-checklist', 'large-house-network'],
  },

  // ── Devices ──────────────────────────────────────────────────────────────
  {
    id: 'dev-presence-mmwave',
    category: 'devices',
    priority: 80,
    when: (a) => has(a, 'priorities', 'presence'),
    guides: ['room-by-room'],
  },
  {
    id: 'dev-energy-monitoring',
    category: 'devices',
    priority: 75,
    when: (a) => has(a, 'priorities', 'energy'),
    guides: ['room-by-room'],
  },
  {
    id: 'dev-climate',
    category: 'devices',
    priority: 75,
    when: (a) => has(a, 'priorities', 'climate'),
    guides: ['room-by-room'],
  },
  {
    id: 'dev-safety-baseline',
    category: 'devices',
    priority: 85,
    when: () => true,
    guides: ['room-by-room'],
  },

  // ── Strategy ─────────────────────────────────────────────────────────────
  {
    id: 'strategy-phased-rollout',
    category: 'strategy',
    priority: 85,
    when: (a) => is(a, 'budget', 'starter', 'mid'),
    guides: ['room-by-room'],
  },
  {
    id: 'strategy-wire-now-devices-later',
    category: 'strategy',
    priority: 90,
    when: (a) => is(a, 'stage', 'new-build') && is(a, 'budget', 'starter', 'mid'),
    guides: ['prewiring-checklist'],
  },
  {
    id: 'strategy-start-small',
    category: 'strategy',
    priority: 70,
    when: (a) => is(a, 'skill', 'beginner') && multi(a, 'priorities').length > 3,
    guides: ['room-by-room'],
  },
]
