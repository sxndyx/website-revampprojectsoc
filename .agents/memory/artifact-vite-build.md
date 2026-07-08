---
name: Artifact Vite build env
description: Web artifacts in this monorepo require PORT and BASE_PATH env vars for vite build/preview outside the managed workflow.
---

# Web artifact Vite build needs PORT + BASE_PATH

Running `pnpm --filter @workspace/<artifact> run build` (or dev) **outside the managed workflow** fails with `PORT environment variable is required` then `BASE_PATH environment variable is required` — the artifact `vite.config.ts` reads both at config load and throws if missing.

**Why:** the managed workflow injects these (each artifact gets a unique PORT; BASE_PATH is the path-routing prefix). A bare shell invocation has neither.

**How to apply:** to verify a build/chunking manually, run e.g. `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/<artifact> run build`. Value of PORT is irrelevant for a build; BASE_PATH=/ is fine for a local check. Don't edit the config to remove the guard.
