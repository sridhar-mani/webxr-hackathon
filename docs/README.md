# Spatial Wardrobe Companion — Documentation Index

## Product
- [Product Specification](./PRODUCT_SPEC.md)
- [Experience Flow](./EXPERIENCE_FLOW.md)

## Fit and Try-On
- [Fit Engine and Simulation](./FIT_ENGINE.md)
- [Camera-Based Real-Person Try-On](./CAMERA_TRYON.md)

## Intelligence and Engineering
- [Agent Architecture](./AGENT_ARCHITECTURE.md)
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)

## Delivery
- [Roadmap](./ROADMAP.md)
- [Camera Research — Verified September 2026](./CAMERA_RESEARCH.md)

## Core technical decision

The project deliberately separates:

**Fit evaluation** → measurements and explainable rules.

**3D virtual try-on** → avatar + garment deformation.

**Dynamic cloth** → optional PBD/XPBD enhancement.

**Camera try-on** → browser camera + pose/segmentation + 2.5D garment deformation.

The camera path is being treated as a major planned feature, but its exact Quest Browser camera availability must be validated on the physical target device before it becomes a hard dependency.
