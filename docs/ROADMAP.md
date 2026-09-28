# Roadmap

## Phase 0 — Camera feasibility spike
**Goal:** prove the target camera path before deep implementation.

Deliver:
- IWSDK CameraSource enabled;
- enumerate devices;
- identify usable Quest camera source;
- preview VideoTexture;
- capture frames;
- log resolution/fps/permissions.

Exit condition: exact target Quest Browser exposes a usable camera path, or the product formally switches to the tested alternative/fallback.

## Phase 1 — Spatial wardrobe
Deliver:
- 15–30 garment assets;
- grab/rotate;
- garment inspector;
- spatial categories;
- outfit slots.

## Phase 2 — Fit engine
Deliver:
- user body profile;
- garment measurement schema;
- fit comparison;
- explainable fit regions;
- avatar parameterization.

## Phase 3 — Virtual try-on
Deliver:
- garment skinning;
- morph/size changes;
- avatar try-on;
- S/M/L/XL comparison;
- fit visualization.

This is the guaranteed try-on path.

## Phase 4 — Camera CV
Deliver:
- MediaPipe Pose Landmarker Worker;
- landmarks;
- optional segmentation;
- calibration;
- temporal smoothing.

## Phase 5 — Camera garment
Deliver:
- camera-ready garment mesh;
- anchor mapping;
- deformation;
- occlusion;
- size changes;
- Virtual Mirror interaction.

## Phase 6 — Agent
Deliver:
- wardrobe search tools;
- fit tools;
- try-on tools;
- outfit builder;
- save/remember;
- structured action execution.

## Phase 7 — Lifestyle features
Only after the main vertical slice is stable:
- weather/context;
- packing;
- capsule wardrobe;
- wardrobe analytics;
- garment care;
- daily outfit.

## Phase 8 — Cloth enhancement
Only if the camera/try-on path is stable:
- one garment PBD prototype;
- then XPBD if worthwhile;
- cap simulation cost.

## Phase 9 — Polish
- loading states;
- hand interaction affordances;
- comfort;
- accessibility;
- fallback states;
- performance profiling;
- demo video path.

## Priority rule

If a feature threatens the core vertical slice:

**Spatial wardrobe → Fit → Avatar try-on → Camera try-on → Agent → polish**

wins over secondary features.

## Definition of competition-ready

The build should demonstrate, in one coherent session:
1. hands-first garment interaction;
2. meaningful fit explanation;
3. instant avatar try-on;
4. camera-based try-on on the validated target setup, with graceful fallback;
5. agentic wardrobe manipulation;
6. saved outfit / reason to return.

## Research references

Meta IWSDK Camera Access:
https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/

Meta Passthrough Camera:
https://developers.meta.com/horizon/documentation/spatial-sdk/spatial-sdk-pca-overview/

Meta Quest Browser:
https://developers.meta.com/horizon/documentation/web/

MediaPipe Pose Landmarker:
https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
