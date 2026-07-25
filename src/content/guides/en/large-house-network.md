---
title: 'Covering a large house: Wi-Fi, meshes and the physics of walls'
description: 'Past 200 m² or two floors, coverage stops being automatic. How to design a network and radio meshes that work in every corner.'
order: 3
minutes: 7
---

Most smart home advice is written for apartments. In a large house — say 200 m²+, multiple floors, maybe thick stone or concrete-and-rebar floors — three systems need deliberate coverage design: your Wi-Fi, your low-power meshes (Zigbee/Thread), and the devices' physical power.

## Wi-Fi: access points, not repeaters

One router in a corner of a large house is a guarantee of dead zones. The fixes, from worst to best:

1. **Wireless repeaters / "mesh" kits in repeater mode** — halve your throughput per hop and add flaky handoffs. Avoid.
2. **Mesh kits with dedicated backhaul** — acceptable in an existing home where cabling is impossible.
3. **Multiple wired access points** — the correct answer wherever you can run a cable. Two or three ceiling-mounted APs, each fed by Ethernet, one SSID, PoE-powered from the technical room. Roaming works, throughput stays full, and each AP handles a sane number of clients.

Sizing rule of thumb: one AP comfortably covers ~120–150 m² of a single floor in typical construction. Thick masonry cuts that sharply; a floor of reinforced concrete usually means one AP per level, minimum.

## Zigbee and Thread: design the skeleton

These meshes route through **mains-powered devices only** — battery sensors are leaves, not relays. The classic large-house failure is a coordinator in the office, thirty battery sensors, and mysterious dropouts at the far end of the house. There was never a mesh; just one overworked radio.

- Plan **2–4 always-powered devices per floor** (smart plugs, in-wall modules, powered sensors). They become your routers.
- **Floors are the enemy.** Heated floors, foil insulation and rebar can isolate levels almost completely — ensure each level has routers, and consider where the coordinator physically sits (central, not in the basement rack, or use a network-attached coordinator).
- **Don't split meshes needlessly.** One strong Zigbee network beats two weak ones.
- Metal switchboards and racks are radio cages — if the hub lives in the technical room, put its Zigbee/Thread antenna outside the rack or use a coordinator over Ethernet placed centrally.

## Sub-GHz options for the stubborn corners

Z-Wave (868 MHz in Europe) penetrates walls better than 2.4 GHz protocols — useful for the detached garage, the cellar door sensor, the far gate. This is also where a couple of quality Wi-Fi devices (which lean on your now-excellent AP coverage) can be the pragmatic answer.

## Count your devices honestly

Large houses accumulate devices fast: a serious build ends at 80–150 entities-producing devices without trying. That's fine — Zigbee networks run happily into the hundreds with enough routers — but it changes the hub conversation: give Home Assistant real hardware (a mini-PC class machine rather than the smallest SD-card option), and put it on the UPS.

## The checklist

- One wired AP per ~130 m² per floor; ceiling mounted; single SSID.
- PoE switch in the technical room powering APs and cameras.
- 2–4 mesh routers (mains-powered devices) per floor, every floor.
- Coordinator placed centrally or network-attached — never inside a metal rack.
- Sub-GHz (Z-Wave) or quality Wi-Fi for outbuildings and stubborn corners.
- Hub on real hardware, on the UPS, wired to the network.
