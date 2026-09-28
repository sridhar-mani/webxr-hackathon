# Library Audit — Verified September 28, 2026

This is a maintenance-focused dependency review for the Spatial Wardrobe Companion.

## How "good" was evaluated

npm does not provide a trustworthy consumer-review score for libraries, so this audit uses:
- current npm release/version;
- recent release activity;
- npm dependents/downloads where available;
- GitHub stars and visible repository activity;
- TypeScript/ESM/browser suitability;
- dependency count and approximate bundle size when published;
- relevance to this IWSDK + direct Three.js + Quest Browser architecture.

A package is not recommended simply because it is popular.

---

## Tier A — strong additions

### 1. `valibot`
**Current:** 1.5.0

Use for:
- garment schemas;
- user profile;
- fit results;
- agent tool input/output;
- persisted data validation.

Why:
- zero dependencies;
- modular;
- starts at less than 700 bytes for small schemas;
- 100% test coverage is claimed by the project;
- 9k GitHub stars;
- published within days of this audit.

This is now the preferred validation layer for the project.

AI SDK explicitly supports Valibot through ` @ai-sdk/valibot`, so we do not need to choose Zod merely for AI tooling compatibility.

References:
- https://www.npmjs.com/package/valibot
- https://github.com/open-circle/valibot
- https://ai-sdk.dev/docs/foundations/tools

### 2. `zustand`
**Current:** 5.0.15

Use for:
- current wardrobe/session state;
- selected garment;
- current outfit;
- UI mode;
- user preferences.

Zustand has zero runtime dependencies on npm, ~58k GitHub stars, and very high npm adoption.

Important: our project is not React-based. Use Zustand's vanilla store APIs rather than adding React just to use state management.

Reference:
- https://www.npmjs.com/package/zustand
- https://github.com/pmndrs/zustand

### 3. `xstate`
**Current:** 5.33.2

Use for:
- app mode machine;
- camera permission/calibration states;
- try-on lifecycle;
- loading/error/retry transitions;
- preventing impossible UI states.

This is complementary to Zustand:
- **Zustand = application data**
- **XState = workflow/state-machine control**

XState is zero-dependency, has ~30k GitHub stars, and its repo shows active updates in September 2026.

Reference:
- https://www.npmjs.com/package/xstate
- https://github.com/statelyai/xstate

### 4. `motion`
**Current:** 13.4.4

This is an important new addition.

Motion now has a dedicated `motion/three` integration that can animate:
- Three.js Object3D transforms;
- materials;
- Vector2/3/4 values;
- shader uniforms;
- TSL uniform nodes.

The feature was added in the 13.2 line and the package has continued releasing through September 2026.

Use it for:
- garment fly-in;
- wardrobe rearrangement;
- panel transitions;
- avatar entrance;
- springy spatial feedback;
- material/color transitions;
- shader-driven transitions.

Do **not** use React Motion APIs; use the framework-free `motion` package with `motion/three`.

Reference:
- https://www.npmjs.com/package/motion
- https://motion.dev/docs/three
- https://motion.dev/changelog

### 5. `three-mesh-bvh`
**Current:** 0.9.15

Use for:
- accelerated garment raycasting;
- closest-point queries;
- spatial selection;
- garment inspection;
- later collision helpers.

It is particularly appropriate for this project because it is built specifically around Three.js and supports skinned geometry, shape intersection and worker generation.

Current repository size is ~3.5k GitHub stars and the npm package has zero runtime dependencies.

Reference:
- https://www.npmjs.com/package/three-mesh-bvh
- https://github.com/gkjohnson/three-mesh-bvh

### 6. `meshoptimizer`
**Current:** 1.3.0

Use primarily in build/asset tooling:
- mesh simplification;
- compression;
- runtime decoding where useful.

The npm release is current within days of this audit and the package is widely adopted.

Reference:
- https://www.npmjs.com/package/meshoptimizer

### 7. `gltf-transform/core` + `gltf-transform/functions`
**Current:** 4.5.0

Use for:
- validating garment GLBs;
- resizing textures;
- deduplication;
- simplifying geometry;
- applying WebP/KTX2/Basis transforms;
- generating repeatable asset pipelines.

This should mostly stay in tooling/build scripts instead of the XR runtime.

Reference:
- https://www.npmjs.com/package/@gltf-transform/core
- https://www.npmjs.com/package/@gltf-transform/functions
- https://github.com/donmccurdy/glTF-Transform

### 8. `fuse.js`
**Current:** 7.5.0

Use for:
- "show blue shirts";
- fuzzy garment names;
- wardrobe search;
- natural-ish filtering before the agent performs deeper reasoning.

The basic build is about 6.8 kB min+gzip and the package is zero-dependency. GitHub shows ~20k stars and strong npm adoption.

Reference:
- https://www.npmjs.com/package/fuse.js
- https://github.com/krisk/Fuse

### 9. `dexie`
**Current:** 4.4.6

Use for:
- wardrobe persistence;
- saved outfits;
- usage history;
- preferences;
- local-first memory.

Dexie has been published recently, has >1,000 npm dependents, and is designed specifically around IndexedDB.

Reference:
- https://www.npmjs.com/package/dexie

### 10. `idb-keyval`
**Current:** 6.3.0

This is the tiny alternative for simple values.

Use it for:
- settings;
- feature flags;
- camera calibration cache;
- small local preferences.

Its npm documentation states ~295 bytes brotli'd for get/set usage.

Do not use both Dexie and idb-keyval for the same data layer:
- **Dexie = structured wardrobe database**
- **idb-keyval = tiny key/value storage**

Reference:
- https://www.npmjs.com/package/idb-keyval
- https://github.com/jakearchibald/idb-keyval

### 11. `mediapipe/tasks-vision`
**Current:** 1.0.1

Use for:
- person/pose detection;
- landmark tracking;
- segmentation where supported;
- future face/hand/vision utilities.

This is the selected browser CV package for the camera feature.

Reference:
- https://www.npmjs.com/package/@mediapipe/tasks-vision

### 12. `dimforge/rapier3d`
**Current:** 0.21.0

Use for:
- rigid-body collisions;
- proxy body geometry;
- spatial interaction physics;
- non-cloth physics.

Do not use Rapier as the cloth solver.

The upstream Rapier repository has ~5.8k stars and active September 2026 activity.

Reference:
- https://www.npmjs.com/package/@dimforge/rapier3d
- https://github.com/dimforge/rapier

### 13. `stats-gl`
**Current:** 4.2.3

Development dependency only.

Use for:
- real FPS;
- CPU timing;
- GPU timing;
- WebGL/WebGPU profiling;
- worker profiling.

This is particularly valuable because Quest performance is a first-class constraint.

Reference:
- https://www.npmjs.com/package/stats-gl
- https://github.com/RenaudRohlinger/stats-gl

---

## Tier B — useful, but only when needed

### `ts-pattern` — 5.9.0
Very good for exhaustive handling of:
- agent action unions;
- garment categories;
- try-on states;
- interaction events.

It is tiny (~2 kB), zero-dependency, has >4.8M weekly npm downloads, and ~15k GitHub stars. However, its latest stable npm publish is older than the packages above, so it is a quality utility rather than a fast-moving dependency.

Use when the domain state starts getting branch-heavy.

Reference:
- https://www.npmjs.com/package/ts-pattern
- https://github.com/gvergnaud/ts-pattern

### `colord` — 2.10.0
Use if our color/style engine needs conversions, contrast or color arithmetic.

It is particularly attractive for Quest because the npm package reports about 1.8 kB brotli'd, zero dependencies and a current release.

Reference:
- https://www.npmjs.com/package/colord

### `postprocessing` — 6.39.5
Good Three.js post-processing library, actively released.

Use only for a specific visual effect such as a subtle vignette, outline or tone treatment. Do not install it as a baseline dependency because fullscreen effects can cost GPU time on Quest.

Current release requires Three >=0.168.0 and <0.187.0, so it is compatible with the project's `super-three@0.181.0` target, but it still needs device profiling.

Reference:
- https://www.npmjs.com/package/postprocessing
- https://github.com/pmndrs/postprocessing

### `animejs` — 4.5.0
Current, zero-dependency and well established.

We should **not** add it because Motion already gives us a newer Three.js-native path with springs and `motion/three`.

Reference:
- https://www.npmjs.com/package/animejs

---

## Tier C — deliberately skip

### `zod`
Still excellent, but Valibot gives us a significantly smaller modular validation layer and AI SDK supports Valibot directly. Use Zod only if another required dependency forces it.

### `nanoid`
Excellent and tiny, but native `crypto.randomUUID()` is sufficient for internal app IDs. Add NanoID only if short URL-safe IDs become a real requirement.

Current NanoID 6.0.1 is 118 bytes min+brottled and has enormous adoption, but it is unnecessary for the first version.

Reference:
- https://www.npmjs.com/package/nanoid

### `eventemitter3`
Very popular, but we should use native `EventTarget` first unless we hit a specific requirement.

### `mitt`
Extremely tiny (~200 bytes gzipped), but native `EventTarget` is enough for our current architecture.

### `zundo`
Interesting Zustand undo/redo middleware, but the current stable package is much older than our other choices. Prefer a small in-house command/history layer first; revisit if the outfit editor needs robust time travel.

### `detect-gpu`
Useful concept, but its current npm release is old. We already have Meta/Three runtime information and can feature-test the actual renderer instead of maintaining another GPU classification table.

### `camera-controls`
Excellent library, but camera control is not the problem we have in XR. IWSDK owns the XR camera/input lifecycle.

### `popmotion`
Mature but has not released in years. Motion has absorbed the active direction of this ecosystem.

### `tiny-invariant`
Extremely popular but old and unnecessary; ordinary TypeScript assertions are enough.

### `radash`
Useful utility library, but its latest stable line is old relative to the rest of our selected stack. Avoid adding a general-purpose utility kitchen sink.

### `spring-easing`
Very small, but old and unnecessary because Motion already gives us springs.

---

## Recommended project dependency architecture

### Base runtime
Already present:
- IWSDK
- super-three
- UIKit
- PWA

### Add early
- `zustand`
- `valibot`
- `xstate`
- `motion`
- `three-mesh-bvh`
- `fuse.js`
- `dexie`
- `colord`

### Add for asset pipeline
- ` @gltf-transform/core`
- ` @gltf-transform/functions`
- `meshoptimizer`

### Add for CV
- ` @mediapipe/tasks-vision`
- native Web Worker
- optional `comlink`

### Add for physics
- ` @dimforge/rapier3d`

### Add for profiling
- `stats-gl` as dev-only

### Do not add yet
- OpenCV.js
- TensorFlow.js body-segmentation
- postprocessing
- animejs
- NanoID
- EventEmitter3
- Radash
- Popmotion
- generic chart library

---

## Final architectural rule

Prefer this order:

**Native platform API → existing IWSDK/Three capability → tiny focused library → larger library**

A library must earn its place by solving a concrete problem better than the platform or code we already have.
