---
name: R3F viewer robustness
description: Non-obvious lessons for embedding a React Three Fiber viewer in a web app (WebGL fallback, camera rig, lighting).
---

# React Three Fiber viewer robustness

## Detect WebGL synchronously, before mounting `<Canvas>`
Decide WebGL support in a **lazy `useState` initializer** (runs during first render) and only render `<Canvas>` when it returns true. Do NOT gate on a `useEffect` check.

**Why:** R3F creates the WebGL renderer during mount/layout. An effect-based capability check resolves *after* that, so on a no-WebGL device the Canvas throws before the fallback branch is reached (surfaces as `THREE.WebGLRenderer: Error creating WebGL context` + Vite runtime-error overlay). This exact bug shipped once and had to be re-fixed.

**How to apply:** `const [ok] = useState(() => detectWebGL())`. `detectWebGL` tries `canvas.getContext('webgl2'|'webgl'|'experimental-webgl')` inside try/catch. Also wrap the `<Canvas>` in a class error boundary that renders the branded fallback — belt-and-suspenders for context loss.

Note: the headless Screenshot tool has **no GPU/WebGL**, so 3D never renders there — you can only verify the 2D layout + that the fallback shows. The real browser preview renders fine. Don't chase the screenshot's WebGL error as a code bug.

## A "fly to preset" camera rig must not fight OrbitControls
If a rig lerps `camera.position`/`controls.target` toward a preset **every frame**, it continuously pulls the user's orbit back and feels stuck.

**How to apply:** animate only while an `animatingRef` is true; set it true on subsystem/preset change, set it false when close enough (distance epsilon) AND on OrbitControls `onStart` (user grabbed control).

## Lighting without network fetches
Use drei `<Environment>` with child `<Lightformer>`s (or a preset) instead of an HDR URL, so metal reflections work with **no network request**. Pair with `frames={1}` for a static bake. Pulse brand point lights in `useFrame` (mutate `.intensity` via ref only — no per-frame allocations).

## Procedural fallback model
A `MODEL_URL` constant gates GLB vs procedural. When null, render the procedural model directly (no doomed 404). When set, load via `useGLTF` inside Suspense + error boundary that falls back to procedural.
