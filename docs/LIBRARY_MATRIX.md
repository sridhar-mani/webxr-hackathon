# Library and SDK Matrix — Verified September 28, 2026

This document records maintained libraries that can help the Spatial Wardrobe Companion. We intentionally do **not** add every library at once. Each package should enter the project only when its feature is ready.

## 1. Core interaction and 3D

| Area | Library | Decision | Use |
|---|---|---|---|
| XR runtime | `@iwsdk/core` | **Already installed / core** | XR lifecycle, ECS, hand/controller interaction |
| Spatial UI | `@pmndrs/uikit` | **Already installed / core** | World-space UI |
| Icons | `@pmndrs/uikit-lucide` / Lucide | **Already installed / core** | Spatial iconography |
| Scene rendering | `super-three` through IWSDK | **Already installed / core** | Three.js scene/rendering |
| State | `zustand` | **Add when app state expands** | Lightweight state for wardrobe, session, agent, try-on |
| IDs | `nanoid` | **Add** | Stable garment/outfit/event IDs |

Zustand remains actively maintained, with current 5.x releases and open maintenance work in September 2026. NanoID 6.0.1 is current on npm.

## 2. 3D assets and geometry

| Library | Decision | Use |
|---|---|---|
| `@gltf-transform/core` | **Add to asset tooling** | Read/edit/write GLB/glTF |
| `@gltf-transform/functions` | **Add to asset tooling** | Simplify, deduplicate, optimize and transform assets |
| `meshoptimizer` | **Add** | Mesh compression/optimization and runtime decoding |
| `three-mesh-bvh` | **Add** | Fast raycasting, nearest/closest-point queries, spatial queries, future collision helpers |
| Three.js KTX2/Basis tooling | **Use through Three/IWSDK** | GPU-friendly texture compression |

glTF Transform 4.5.0 is current on npm and actively maintained. Meshoptimizer 1.3.0 is current on npm. three-mesh-bvh 0.9.15 was released September 9, 2026 and has active work for WebGPU, skinned meshes and BVH refitting.

Use glTF Transform primarily as a **build-time asset pipeline**. Avoid putting heavy optimization work into the Quest runtime.

## 3. Physics and collisions

| Library | Decision | Use |
|---|---|---|
| `@dimforge/rapier3d` | **Evaluate first** | Rigid-body collision, capsule/box/sphere proxies, interaction physics |
| `@dimforge/rapier3d-compat` | **Fallback for bundling** | Same Rapier API with embedded WASM when bundlers have problems |
| Custom PBD/XPBD | **Preferred for cloth** | Garment-specific cloth dynamics |

Rapier 3D 0.21.0 is current and officially maintained. The compat build exists specifically for bundlers that struggle with WASM.

Important: Rapier is **not** our cloth solution. Use it for rigid collisions and scene physics. The cloth solver remains a project-specific PBD/XPBD subsystem.

## 4. Camera and computer vision

| Library | Decision | Use |
|---|---|---|
| `@mediapipe/tasks-vision` | **Add** | Pose/landmarks and vision tasks in browser |
| OpenCV.js | **Optional** | Image preprocessing, masks, morphology, geometric utilities |
| TensorFlow.js body-segmentation | **Alternative only** | Use only if MediaPipe segmentation is insufficient |

MediaPipe Tasks Vision 1.0.1 is current on npm and contains built-in TypeScript declarations. MediaPipe's upstream repository is actively releasing. OpenCV.js 5.0.0 builds exist in 2026, so it is viable, but it is a heavy addition and should not be loaded unless we need its specific image-processing primitives.

Do not load both MediaPipe and TensorFlow body-segmentation initially.

## 5. Workers and performance

| Library | Decision | Use |
|---|---|---|
| `comlink` | **Add when CV worker is implemented** | Typed RPC between main thread and Worker |
| Native Web Worker / OffscreenCanvas | **Core technique** | Keep CV and expensive processing away from XR loop |

Comlink 4.4.2 is current and maintained. The first implementation should still use a plain Worker boundary; Comlink is a convenience layer, not a requirement.

## 6. Wardrobe search, matching and metadata

| Library | Decision | Use |
|---|---|---|
| `fuse.js` | **Add** | Fuzzy wardrobe search and natural-ish text matching |
| `zod` | **Add** | Runtime validation for garment, fit, agent and saved-outfit schemas |
| `colord` | **Add only if color reasoning grows** | Color parsing, conversion and harmony calculations |
| `date-fns` | **Add** | Wear history, recency, packing/travel dates |

Fuse 7.5.0 is current, Zod 4.6.5 is current, Colord 2.10.0 is current, and date-fns 4.4.0 is current.

The fit engine should not use an ML library for basic garment sizing. Structured measurements + explicit rules are simpler, explainable and faster.

## 7. AI companion / agent

There are two viable stacks.

### Option A — AI SDK
`ai`

**Recommendation for the first implementation.**

Use it for:
- model calls;
- structured outputs;
- tool calling;
- streaming responses;
- provider abstraction.

AI SDK 7.0.x is actively published on npm as of September 2026.

### Option B — LangGraph JS
`@langchain/langgraph`

**Use if the agent becomes a genuinely stateful multi-step workflow.**

Use it for:
- persistent state;
- multi-step planning;
- long-running workflows;
- human-in-the-loop;
- complex agent graphs.

LangGraph JS 1.4.x is actively maintained.

### Project rule

Do **not** install AI SDK + LangGraph + multiple orchestration frameworks at the same time.

Start with:

`AI SDK + Zod + our typed application tools`

Add LangGraph only if the agent workflow proves to need graph/state orchestration.

## 8. Persistence and memory

| Library | Decision | Use |
|---|---|---|
| `dexie` | **Add** | IndexedDB persistence for wardrobe, profile, memories and saved outfits |
| `@supabase/supabase-js` | **Optional backend** | Sync/auth/cloud storage if cross-device persistence is needed |

Dexie 4.4.6 is current on npm and actively maintained.

Supabase JS 2.117.x has releases in September 2026. It is a sensible backend option, but not required for the first offline-first vertical slice.

Recommended architecture:

**Dexie/local-first → optional Supabase sync later**

Do not make the app dependent on a backend just to demo the wardrobe.

## 9. Color/style intelligence

No large ML dependency is necessary initially.

Use:
- Colord for color conversion;
- explicit style metadata;
- color-distance/harmony rules;
- garment category and formality tags.

Later we can add image-based color/material extraction using MediaPipe/OpenCV or a model endpoint.

## 10. Visual materials and fabric

| Library/technology | Decision | Use |
|---|---|---|
| Three.js TSL / built-in materials | **Preferred** | Fabric shaders, normal maps, roughness, sheen-like effects |
| `three-custom-shader-material` | **Optional** | Faster custom material experimentation |
| KTX2/Basis | **Preferred** | Compressed textures |

Three Custom Shader Material is actively published, but we should prefer Three/IWSDK-native material paths until a custom shader requirement is clear.

## 11. Analytics/dashboard-style views

No chart framework is required for the competition build.

Build:
- wardrobe counts;
- usage bars;
- coverage rings;
- recent-wear timelines

as spatial UI using UIKit/Three.

Only add a chart library if a later screen genuinely needs a conventional chart.

## 12. Voice

Do **not** add a voice package first.

Use browser/platform voice APIs where available and keep voice as an enhancement over hands-first interaction.

Voice should issue semantic commands such as:

`show blue shirts`
`try the large one`
`make this more casual`
`pack for four days`

Hands remain sufficient to complete the core experience.

## 13. Feature-to-library map

### Spatial wardrobe
IWSDK + UIKit + Three + MeshBVH + Zustand + Zod

### Garment inspector
Three + MeshBVH + glTF Transform + meshoptimizer

### Fit engine
Zod + custom measurement rules

### 3D avatar try-on
Three + glTF + MeshBVH + optional Rapier

### Camera try-on
IWSDK CameraSource + MediaPipe Tasks Vision + Worker/Comlink + custom 2.5D deformation

### Outfit builder
Zustand + Zod + Fuse.js

### AI stylist
AI SDK + Zod + typed application tools

### Wardrobe memory
Zustand + Dexie + date-fns + NanoID

### Packing assistant
Zustand + Dexie + date-fns + Zod

### Capsule wardrobe
Fuse.js + custom scoring/rules

### Wardrobe analytics
Zustand/Dexie + UIKit

### Fabric/material viewer
Three native materials/TSL + KTX2

### Cloth
Custom PBD/XPBD + optional Rapier collision proxies

## 14. Packages we should NOT add casually

Avoid:
- React Three Fiber — the application is already IWSDK + direct Three;
- multiple state managers;
- multiple agent frameworks;
- multiple body-pose frameworks;
- generic charting libraries for small spatial visualizations;
- a full cloth engine before profiling;
- OpenCV.js merely because it is available;
- a backend before local-first persistence is working.

Every dependency must justify its bundle size, runtime cost, browser compatibility and maintenance burden on Quest.

## 15. Recommended dependency sequence

### Now
- Zustand
- Zod
- NanoID
- glTF Transform (tooling)
- meshoptimizer
- three-mesh-bvh
- Dexie
- Fuse.js
- date-fns
- Colord

### When AI is implemented
- AI SDK
- provider package as required

### When camera spike passes
- MediaPipe Tasks Vision
- Worker
- optionally Comlink
- optionally OpenCV.js if profiling shows a concrete need

### When interaction physics is needed
- Rapier 3D

### When cloth is justified
- custom PBD/XPBD subsystem

### Optional cloud phase
- Supabase JS
