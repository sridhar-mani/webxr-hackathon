# Spatial Wardrobe Companion — Product Specification

## Vision
A hands-first spatial lifestyle companion that turns a user's wardrobe into an interactive 3D space. The user can inspect garments, understand measurements and fit, try garments on an avatar, use a camera-based virtual mirror, assemble outfits, and ask an agent to act on their wardrobe.

Primary competition alignment: Productivity / daily-life utility. The experience is designed around the recurring moment of getting dressed.

## Core loop
**Discover → Inspect → Fit → Try On → Combine → Decide → Remember**

## Product pillars
### 1. Spatial wardrobe
3D garments are the primary interface. Users pinch/grab, rotate, compare, and place garments into an outfit.

### 2. Fit Lab
The user profile contains body measurements and fit preference. Garments contain structured measurements, size, material, stretch and fit metadata. Fit is explained region-by-region rather than reduced to one opaque score.

### 3. Virtual try-on
A parametrically fitted garment is displayed on a 3D avatar. Size and fit controls update the garment immediately.

### 4. Camera try-on
A Virtual Mirror uses the Quest camera stream where the target Browser/device path exposes a suitable camera. Pose and person segmentation drive a real-time 2.5D garment overlay. This is a planned major feature, but camera availability must be validated on the exact Quest Browser build before it becomes a hard dependency.

### 5. AI wardrobe agent
The agent queries structured wardrobe state and executes typed actions such as filtering garments, starting try-on, building an outfit, packing for a trip, and saving the result.

### 6. Wardrobe memory
Store structured events: worn outfit, saved outfit, preferred fit, rejected item, recent usage and packing history.

## Feature catalogue
- Wardrobe inventory (15–30 polished demo items)
- Garment inspector
- Fit Lab
- Avatar try-on
- Camera Virtual Mirror
- Outfit builder
- Occasion mode
- Weather/context-aware recommendations
- Capsule wardrobe
- Packing assistant
- Wardrobe analytics
- Garment care
- Style profile
- Daily outfit
- Wardrobe memory

## Core demo
1. Enter wardrobe.
2. Grab a shirt.
3. Inspect its specifications.
4. Try it on the avatar.
5. Change M → L.
6. Inspect fit regions.
7. Enter Virtual Mirror.
8. Run camera pose/segmentation.
9. Show the garment on the real-person view.
10. Ask the agent for a different outfit.
11. Agent changes the spatial scene.
12. Save the outfit.

## Scope boundary
We do not need a retail marketplace, ecommerce checkout, thousands of assets, perfect cloth physics, arbitrary garment reconstruction, or medical/body-health inference.

Camera output is an approximate visual try-on, not a promise of tailor-grade sizing.

## Privacy
Camera frames should remain local by default. Do not upload raw frames to an LLM/cloud CV service for the core demo. Camera processing stops when the mode exits.

## Fallback rule
If camera access is unavailable or unstable, the product must fall back to the 3D-avatar try-on without breaking the rest of the experience.
