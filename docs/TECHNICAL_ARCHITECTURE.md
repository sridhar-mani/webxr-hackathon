# Technical Architecture

## Stack
- IWSDK 1.x
- Three.js / super-three as required by IWSDK
- TypeScript
- Vite
- @pmndrs/uikit for spatial UI
- MediaPipe Tasks Vision for browser CV
- Web Worker for CV inference
- Optional WebGPU path only after the baseline WebGL renderer is stable

## Runtime layers

```
Application
├── Wardrobe domain
├── Fit domain
├── Outfit domain
├── Agent domain
└── Camera-try-on domain

IWSDK/ECS
├── world lifecycle
├── XR input
├── grabbing/interactions
├── camera source
└── spatial UI

Three.js
├── scene graph
├── meshes/materials
├── avatar
├── garment rendering
├── deformation
└── compositing

Browser
├── MediaDevices
├── VideoTexture
├── Web Worker
└── IndexedDB/local persistence
```

## Suggested source layout

```
src/
  domain/
    wardrobe/
    fit/
    outfits/
    agent/
    cameraTryOn/
  xr/
    interactions/
    avatar/
    wardrobeScene/
  cv/
    poseWorker.ts
    segmentation.ts
    calibration.ts
  rendering/
    garmentDeformer.ts
    cameraCompositor.ts
    cloth/
  persistence/
  ui/
```

## Camera path
IWSDK CameraSource owns the browser stream. The CV worker consumes sampled frames. The main XR thread only receives compact landmarks/masks and renders the result.

## Garment asset strategy
Each garment can have:
1. hero 3D mesh for wardrobe;
2. avatar-fit mesh for virtual try-on;
3. camera-try-on 2.5D mesh/material.

This avoids forcing one asset representation to satisfy three different rendering requirements.

## Persistence
Start local:
- wardrobe JSON;
- user profile;
- outfit history;
- saved outfits;
- preference events.

Use IndexedDB or an application-owned persistence layer only after the in-memory vertical slice works.

## Performance priorities
Quest Browser must maintain the XR render budget.

Priorities:
1. avoid large transparent surfaces;
2. cap simultaneous garment meshes;
3. keep CV inference off the main thread;
4. sample camera frames rather than processing every render frame;
5. use simple materials for garments;
6. texture-compress production assets;
7. avoid real-time cloth unless visible and necessary;
8. profile on physical Quest.

## Cloth subsystem
The cloth solver is an isolated renderer feature:
```
Garment asset
   ↓
Cloth particles/mesh
   ↓
PBD/XPBD constraints
   ↓
Collision shapes
   ↓
render mesh
```

The fit engine must not depend on it.

## Camera compositing
```
camera texture
      +
deformed garment mesh
      +
person mask
      ↓
compositor
      ↓
virtual mirror surface
```

Use a dedicated render target/material path rather than modifying the entire world renderer.

## Device capabilities
Feature-detect camera access and WebXR capabilities at runtime. Never assume a facing camera exists.

## Testing
Minimum test matrix:
- desktop Chromium + IWSDK emulator;
- Quest 3 Browser;
- Quest 3S Browser;
- camera available;
- camera unavailable;
- good/bad lighting;
- single/multiple person;
- stable/moving pose;
- try-on fallback.
