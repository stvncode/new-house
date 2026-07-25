---
title: 'Zigbee, Z-Wave, Thread, Wi-Fi or KNX: choosing your protocols'
description: 'The protocol decision shapes every purchase you make for the next decade. Here is how to think about it without the marketing fog.'
order: 1
minutes: 8
---

The first thing to internalize: **you will not pick one protocol**. Every real smart home is a mix. The goal is to pick a *primary* mesh protocol for the long tail of cheap devices, decide what your walls will carry if they're open, and know which exceptions are worth making.

## The contenders in one honest paragraph each

**Zigbee** is the pragmatic default. Enormous device selection (IKEA, Aqara, Philips Hue, Sonoff and hundreds more), the lowest prices, excellent battery life, and a mesh that strengthens with every mains-powered device you add. Its weakness is occasional pairing friction and quality variance between brands — mitigated by using one good coordinator and sticking to well-supported devices.

**Z-Wave** trades selection and price for certified interoperability. Every Z-Wave device must pass certification, encryption is mandatory in recent versions, and it uses a sub-GHz band that penetrates walls better and never fights your Wi-Fi. It shines for security devices — locks, sirens, perimeter sensors — where "it just works, always" matters more than saving €10.

**Thread** is the newest mesh, built on IP end-to-end, with Matter as the compatibility layer above it. Technically excellent: fast, low-power, self-healing, and border routers are appearing in everything. The catch is that the ecosystem is still maturing — device choice is thinner and Matter's feature coverage lags what native integrations expose. Buy Thread when the price is comparable; don't rebuild around it yet.

**Wi-Fi** is for bandwidth, not for sensors. Cameras, speakers, displays: yes. Fifty battery sensors: no — they'll crowd your access points, drain batteries, and the cheap ones tend to require vendor clouds. A good rule: every Wi-Fi smart device should earn its place.

**KNX** is a different animal entirely: a wired bus standard, 30+ years old, multi-vendor, installed by certified professionals. Lighting, blinds and heating run with zero batteries, zero pairing, zero servers. It costs several times more upfront and changes are electrician-territory, but it will outlive every wireless standard on this page. It only makes sense in new builds or heavy renovations.

## The decision, compressed

1. **Walls open + budget above ~€8k + you want set-and-forget?** Get KNX quotes for the core (lighting, blinds, heating), and layer Home Assistant plus a wireless mesh on top for sensors and everything KNX doesn't do.
2. **Everyone else:** Zigbee as the backbone for sensors, buttons, bulbs and modules. Add Z-Wave selectively for locks and security. Let Thread/Matter devices in as prices reach parity.
3. **Wi-Fi only for high-bandwidth devices** — and prefer ones with local APIs (or that work with Home Assistant locally).

## Mistakes to avoid

- **Buying a "starter kit" per brand.** Ecosystem lock-in is how you end up with five apps and five hubs. Buy devices, not ecosystems; let your hub unify them.
- **Choosing the protocol per device on impulse.** Every protocol you add is one more radio, one more failure mode, one more thing to learn. Two meshes (one primary, one for exceptions) is plenty.
- **Ignoring the mesh's need for routers.** Zigbee and Thread route through mains-powered devices. A house with only battery sensors has no mesh — sprinkle smart plugs or in-wall modules to build the skeleton.
- **Betting the whole house on Matter futures.** Buy for what works today; treat future compatibility as a bonus, not a plan.
