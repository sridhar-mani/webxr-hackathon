# Camera Research — Verified September 2026

## Meta IWSDK
Current IWSDK Camera Access documentation (updated September 4, 2026) says IWSDK uses the browser MediaDevices API and exposes streams as VideoTexture objects. CameraSource can request front, back, or unknown facing and specify ideal width/height/frame rate. The same guide explicitly states camera operation can work in immersive XR sessions.

Source:
https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/

## Quest 3/3S passthrough cameras
Meta's Passthrough Camera API provides the forward-facing RGB cameras on Quest 3 and Quest 3S for CV/ML. The native API requires Horizon OS v74+, Quest 3/3S, camera permission and passthrough.

Source:
https://developers.meta.com/horizon/documentation/spatial-sdk/spatial-sdk-pca-overview/

## Browser caveat
Meta currently lists an active Quest Browser investigation where the headset's passthrough cameras may fail to enumerate because camera permission is not being surfaced correctly. The report says the avatar camera may still enumerate while environment-facing camera access fails.

Source:
https://developers.meta.com/horizon/feedback/vr/investigations/1557993751977106/

## Implication for our design
We can confidently build the application around IWSDK's camera abstraction, but we cannot honestly claim that every current Quest Browser build exposes the desired forward-facing headset camera without a physical-device test.

Therefore:
- camera feasibility is Phase 0;
- avatar try-on is the guaranteed fallback;
- camera try-on is implemented as a separate subsystem;
- the core product does not collapse if camera access fails.

## MediaPipe
MediaPipe Pose Landmarker for web supports 33 pose landmarks and optional segmentation masks. Google's current web samples demonstrate camera/video usage and provide Lite, Full and Heavy model choices.

Sources:
https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
https://github.com/google-ai-edge/mediapipe-samples-web

## Chosen CV architecture
Start with MediaPipe Pose Landmarker Lite in a Worker. Use segmentation output when sufficient. Only add a separate Image Segmenter model if the pose segmentation quality is inadequate.

## Why 2.5D
The camera view is a single RGB projection. The competition feature does not require reconstructing a perfect 3D body. A 2.5D deformable garment is more appropriate for:
- latency;
- stability;
- browser compute budget;
- predictable asset authoring.

## What is not verified
We have not yet verified on the exact target headset/browser build:
- which physical camera IDs the browser exposes;
- whether the forward-facing passthrough cameras are available without manual permission workarounds;
- sustained CV FPS while immersive rendering is active.

Those are device-test items, not assumptions.
