---
title: 'Local-first: why your smart home should work without the internet'
description: 'Clouds get discontinued, subscriptions appear, servers go down. How to build a home that answers to you — and where Home Assistant fits.'
order: 4
minutes: 6
---

Here is a test worth applying to every smart device you consider: **unplug the internet — does it still work?** If the answer is no, you don't own a smart home; you rent one, at the pleasure of a company's server budget.

## Why local control is the hill worth defending

- **Longevity.** Smart home graveyards are full of cloud-dependent devices that became paperweights when the vendor pivoted, got acquired, or added a subscription. A local device works until the hardware dies.
- **Reliability.** Your lights shouldn't depend on your ISP or a data center on another continent. Local automations execute in milliseconds, every time, internet or not.
- **Privacy.** Presence sensors, cameras, and door locks generate the most intimate data a household produces. Local-first means that data physically stays in your house.
- **Speed.** Motion-to-light via a cloud round trip is a visible lag; locally it's instant. You feel the difference every single day.

## The practical center: Home Assistant

Home Assistant is the largest open-source smart home platform, and it's the piece that makes a multi-brand, multi-protocol house feel like one system. It runs on your own hardware, speaks Zigbee, Z-Wave, Thread/Matter, KNX and about three thousand other integrations, and keeps automations, dashboards and history entirely local.

Choosing hardware by profile:

- **Just want it to work:** Home Assistant Green — a plug-in box, sold ready to go. Add a Zigbee or Z-Wave USB stick as needed.
- **Comfortable with tech:** a mini-PC (any recent N100-class machine) gives headroom for camera recording, voice assistants and add-ons for years.
- **Renting or experimenting:** a Raspberry Pi is a fine start; you can migrate the whole setup later with a backup file.

## Buying local-first without becoming a monk

You don't need ideological purity — you need a default with justified exceptions:

- **Default:** devices on open protocols (Zigbee, Z-Wave, Thread, KNX) are local by construction. This covers sensors, lights, switches, valves, locks.
- **Justified exceptions:** some categories are genuinely better with cloud features — voice assistants with good speech recognition, some robot vacuums, weather data. Keep them out of critical paths: the house must function fully with them offline.
- **Check before buying:** the Home Assistant integration page for a device tells you whether it's local or cloud-polling. Two minutes of reading saves years of regret.

## What this means at purchase time

1. Pick the hub first (Home Assistant on hardware matching your profile).
2. Prefer devices whose integration is local — protocol-based ones automatically are.
3. Refuse devices that require an account for basic on/off functionality.
4. Treat anything subscription-gated as a red flag unless the value is overwhelming.

The payoff arrives quietly: the internet goes down some evening and everything — lights, heating, presence automations, the lot — simply keeps working. That's what owning your home's intelligence feels like.
