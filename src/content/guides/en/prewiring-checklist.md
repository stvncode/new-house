---
title: 'The pre-wiring checklist: what to put in the walls while they are open'
description: 'Cables cost cents during construction and fortunes after. The definitive list to hand your electrician before drywall day.'
order: 2
minutes: 9
---

There is a brutal asymmetry in home building: a Cat6a run costs a few euros in an open wall and several hundred through a finished one. Wireless keeps improving, but a cable is still faster, more reliable, more secure, and completely silent on the radio spectrum. This checklist is what experienced people wish they had specified — print it, adapt it, give it to your electrician.

## Network cabling

- **Two RJ45 drops per habitable room**, at desk/TV height. You'll use one and be glad for the spare.
- **One drop per TV/media position** — streaming boxes, consoles and TVs all prefer wired.
- **One drop at each ceiling corner position where Wi-Fi access points will live** — the middle of the hallway ceiling per floor is the classic spot. This is the single highest-value run in the house.
- **One drop at every camera and doorbell position**, exterior corners included. PoE cameras beat battery cameras in every way that matters.
- **All runs home to one point** (star topology) — the technical room. No daisy chains.
- **Cat6a minimum.** The cost delta over Cat6 is noise compared to the labor.

## Electrical details that decide your future options

- **A neutral wire in every switch box.** Most in-wall smart modules are powered by neutral. Without it, your options shrink to a handful of no-neutral dimmers.
- **Deep boxes (50 mm+) everywhere.** A smart module sits *behind* the switch; shallow boxes make every install a fight.
- **Power at every window** (top corner) for future motorized blinds or shutters — even if you're not buying motors yet.
- **Power at every exterior camera/AP position.** PoE covers most, but conduit costs nothing now.
- **A few ceiling outlets** — presence sensors and ceiling APs want power where lamps aren't.

## Conduits: your time machine

Whatever cable wins in 2040, you can pull it later — if there's a path.

- **Oversize the conduits** one size beyond what's needed.
- **Leave a pull string in every conduit.**
- **Empty conduits from the technical room to:** each floor, the attic, the garage, and two exterior points. This is the cheapest insurance you will ever buy.

## The technical room

Half a closet is enough, but it needs:

- A **ventilated space for a small rack**: patch panel, switch (PoE), router, the smart home hub, an NVR if you go camera-heavy, and a small UPS.
- **Every network run terminating here** on a labeled patch panel.
- **Two dedicated power circuits** — one for the rack, one spare.
- If possible, put the **electrical panel adjacent** — your energy meter and any KNX equipment live there.

## If you're doing KNX

Decide *before* the electrical plan is final: KNX means running a green bus cable to every switch position, every actuator point, and the panel — alongside a different switch-wiring topology (loads home-run to the panel). Retrofitting KNX later is effectively a rewire; adding it during construction is a modest increment. Get two integrator quotes early.

## The one-sentence version

Ethernet everywhere, neutral everywhere, power at windows, oversized conduits with pull strings, one technical room — and every one of these is boring, invisible, and the best money you'll spend on the house.
