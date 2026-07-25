# Foyer

**Plan your smart home before the walls close up.**

Foyer helps people making smart-home decisions for a new (often large) house — the choices that are expensive to change later. Three pillars:

1. **Decision guide** — a wizard that turns your project's context (new build vs. rental, size, budget, privacy stance…) into concrete recommendations via a data-driven rules engine.
2. **House planner** — upload your floor plan and the rooms are detected automatically (client-side computer vision — no server, no upload), see it as a living 3D model, plan devices per room, get a budget, a shopping list, and wiring notes for your electrician. Manual tracing remains available for corrections.
3. **Knowledge base** — plain-language guides explaining the reasoning (protocols, pre-wiring, large-house networking, local-first, room-by-room).

Bilingual (English/French), structured to add more languages.

## Stack

- [Astro](https://astro.build) + React islands
- Tailwind CSS v4 + shadcn/ui-style components
- Zustand (persisted to localStorage — no backend)
- react-three-fiber for the 3D house
- TanStack Table for the shopping list
- Vitest for the domain layer

## Architecture

```
src/
  domain/          # Pure TypeScript, zero UI imports — fully unit-testable
    wizard/        #   question graph + recommendation rules engine
    planner/       #   Project → Floor → Room model, geometry, budget
    catalog/       #   device catalog (typed data)
    vision/        #   room auto-detection from plan images (classical CV)
  stores/          # Zustand stores, thin over domain
  components/
    ui/            # shadcn-style primitives
    wizard/        # wizard island
    planner/       # trace editor (SVG), 3D scene (R3F), panels
    home/          # landing hero
  i18n/            # typed dictionaries (en, fr)
  content/guides/  # knowledge base (markdown, per locale)
  pages/[lang]/    # Astro pages
```

The load-bearing rule: `domain/` never imports React. All text lives in `src/i18n` keyed by stable ids — adding a language means one new dictionary + one content folder.

## Commands

```sh
npm run dev       # dev server
npm run build     # production build
npm run test      # domain unit tests (vitest)
npm run check     # astro type check
```
