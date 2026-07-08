# Lynx Racing

A multi-page marketing + engineering showcase site for Lynx Racing — a UNSW student team designing and building an original high-performance electric superbike. Lives alongside a shared API server in a pnpm monorepo.

## Run & Operate

- `pnpm --filter @workspace/lynx-racing run dev` — run the Lynx Racing web app (managed by the `artifacts/lynx-racing: web` workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (API server)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web (lynx-racing): React 19, Vite 7, React Router v6 (code-split routes), Tailwind CSS v4, framer-motion, lucide-react
- 3D: React Three Fiber (v9) + drei (v10) + three, procedural model (no GLB dependency)
- API: Express 5 · DB: PostgreSQL + Drizzle ORM · Validation: Zod (`zod/v4`) · Codegen: Orval · Build: esbuild

## Where things live

- `artifacts/lynx-racing/` — the web app
  - `src/App.tsx` — React Router setup, lazy/code-split routes, basename from `BASE_URL`
  - `src/components/Layout.tsx` — header + footer + Suspense outlet + scroll-to-top
  - `src/pages/` — one file per route (home, the-bike, sponsors, events, team, join, contact, not-found)
  - `src/three/` — `BikeViewer.tsx` (Canvas + WebGL guard + camera rig), `LynxBike.tsx` (procedural model), `subsystemMap.json` (subsystem copy + camera presets — source of truth)
  - `src/data/site.ts` — sponsors, events, team, departments content
  - `src/lib/telemetry.ts` — animated live-stat hook
  - `src/index.css` — theme tokens (near-black + Lynx Green `#A8FF3E` + Lynx Purple `#7B2CFF`)
- `artifacts/api-server/` — Express API · `lib/` — shared workspace packages

## Architecture decisions

- 3D bike is **procedural** (built from three primitives), not a GLB. A `MODEL_URL` constant in `BikeViewer.tsx` (currently `null`) gates an optional GLB path with automatic fallback to procedural.
- Routes are code-split with `React.lazy` + `Suspense` so the heavy three.js chunk loads only on Home and The Bike — content pages stay ~2–6 kB.
- Lighting uses a local drei `Environment`/`Lightformer` studio (no network HDR fetch).
- Content is honest to the team's development stage — targets are labelled as targets; no fabricated race results.

## Product

- `/` — hero with a decorative auto-rotating 3D bike, honest stat row, link cards, sponsor strip, mailing-list signup
- `/the-bike` — interactive 3D viewer (orbit + zoom), subsystem tab bar with camera presets, live spec/telemetry panel
- `/sponsors`, `/events`, `/team`, `/join`, `/contact` — supporting content pages, plus a persistent "Partner With Us" CTA → `/sponsors`

## User preferences

- Use React Router (not wouter) for routing in the web app.

## Gotchas

- **WebGL detection is synchronous** in `BikeViewer.tsx` (lazy `useState` initializer) — it must decide before `<Canvas>` mounts, or R3F throws on no-WebGL devices before any fallback can render. Don't move it into a `useEffect`.
- The headless screenshot tool has no GPU/WebGL, so it always shows the branded "LX" fallback instead of the 3D bike — that is expected, not a bug. Verify 3D in a real browser.
- Building/previewing a web artifact **outside its workflow** needs `PORT` and `BASE_PATH` env vars (e.g. `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/lynx-racing run build`), or `vite.config.ts` throws.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
