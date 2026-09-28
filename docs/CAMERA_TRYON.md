# Camera-Based Real-Person Try-On

## 1. Verified platform facts

As of September 2026, current Meta IWSDK documentation states that IWSDK exposes camera streams through the browser MediaDevices API as VideoTexture objects and that camera access can operate while the IWSDK world is visible, including immersive XR sessions. CameraSource supports device ID, front/back/unknown facing, width, height and frame rate; the documented example uses 1920×1080 at 30 FPS. Meta also documents frame capture through CameraUtils.

Meta separately documents a native Passthrough Camera API for Quest 3/3S forward-facing RGB cameras. It is specifically intended for computer vision/ML, requires appropriate camera permission and passthrough, and currently documents 1280×960 and 1280×1280 modes. The documented capture latency is 20–40 ms.

However, Meta currently has an active investigation into a Quest Browser camera-permission problem in which the browser can expose the avatar camera while the passthrough cameras fail to enumerate until the permission is manually granted. Therefore the forward-facing headset cameras must not be assumed to be uniformly available to every current Quest Browser build.

## 2. Project decision

For the competition, the best practical camera architecture is a **hybrid 2.5D try-on**:

- IWSDK CameraSource / MediaDevices camera stream
- pose landmarks
- person segmentation
- normalized body frame
- authored garment front-view mesh/texture
- GPU mesh deformation
- mask-based occlusion
- temporal smoothing/interpolation

Do not make fully simulated 3D cloth the live camera overlay.

A single RGB view cannot reliably recover the user's complete 3D body surface, hidden regions, back side, or physically correct garment-body contact. A 2.5D representation is the better quality/performance trade-off.

## 3. Computer vision

Use MediaPipe Pose Landmarker in the browser.

Current MediaPipe exposes 33 pose landmarks, including shoulders, elbows, wrists, hips, knees and ankles. It also exposes world landmarks and optional segmentation masks.

Start with the Lite model for Quest performance. Benchmark Full only if alignment quality requires it.

Run CV inference in a Worker so inference does not block the XR render/UI thread.

## 4. Pipeline

```
IWSDK CameraSource
       |
       +----> VideoTexture ----> Mirror rendering
       |
       v
sampled video frames
       |
       v
PoseLandmarker Worker
       |
       +----> landmarks
       +----> world landmarks
       +----> segmentation mask
       |
       v
Body calibration
       |
       +----> shoulder width
       +----> hip width
       +----> torso frame
       +----> arm pose
       |
       v
Garment deformation
       |
       v
GPU compositing
       |
       v
Virtual Mirror
```

## 5. Garment representation

Each camera-ready garment gets:
- transparent front-view texture/material;
- low-resolution deformation mesh;
- anchor points;
- semantic regions;
- size variants;
- optional sleeve/hem control points.

Typical shirt anchors:
- left shoulder
- right shoulder
- collar center
- left/right armpit
- left/right hem

This asset is separate from the higher-fidelity 3D garment used in the avatar Fit Lab.

## 6. Deformation

Start with triangle-mesh deformation.

Map source garment anchors to detected body anchors:
- shoulder width controls horizontal scale;
- torso height controls vertical scale;
- arm landmarks control sleeve deformation;
- hip landmarks control lower-body alignment.

Prefer stable piecewise-affine/barycentric deformation first. Add thin-plate-spline or learned dense correspondence only if required.

## 7. Occlusion

Base composition:
**camera video + garment mesh + person mask**

The segmentation mask determines where the real body remains visible.

For the first version, do not claim physically correct self-occlusion or depth ordering. Author the garment to minimize obvious intersections.

## 8. Temporal stability

CV does not need to run at headset render rate.

Initial target:
- camera/CV: approximately 15–30 updates/s after profiling;
- XR renderer: native device refresh;
- interpolate garment transforms/deformation between CV updates.

Use smoothing on landmarks to reduce jitter.

## 9. Calibration

The user stands in a neutral pose.

Validate:
- one person;
- shoulders visible;
- hips visible;
- body sufficiently large in frame.

Normalize body coordinates into a stable local frame before mapping the garment.

## 10. Camera geometry constraint

Quest 3/3S Passthrough Camera provides forward-facing RGB camera access. The wearer cannot directly see their own body through those outward-facing cameras from the same viewpoint.

Therefore the same-headset experience needs a camera arrangement in which the wearer is visible to that forward-facing camera, such as a physical mirror/reflection, or another camera view. We should prototype this exact interaction rather than assuming a conventional phone-style selfie camera exists.

## 11. Device validation milestone

Before implementing deep CV logic, run a Quest Browser spike that records:
- enumerateDevices result;
- available facing values;
- permission behavior;
- camera source activation;
- actual frame resolution;
- frame rate;
- whether the desired headset camera is exposed in the target browser build.

This spike is mandatory because Meta is actively investigating a Browser headset-camera permission/enumeration issue.

## 12. Privacy

- process locally by default;
- never upload raw frames for the core feature;
- stop camera processing on exit;
- discard frame buffers when no longer needed;
- clearly indicate camera activity.

## 13. Fallback

If no suitable camera is exposed:
**Camera Try-On unavailable → continue with 3D Avatar Try-On.**

## 14. Acceptance criteria

The camera milestone passes when:
- camera source activates on the target Quest/browser;
- a single person is tracked;
- shoulders and hips remain stable during normal movement;
- one shirt remains visually aligned;
- size changes modify the garment;
- occlusion is acceptable;
- CV does not destabilize XR rendering.

## References
- Meta IWSDK Camera Access: https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/
- Meta Passthrough Camera API: https://developers.meta.com/horizon/documentation/spatial-sdk/spatial-sdk-pca-overview/
- Meta Quest Browser camera investigation: https://developers.meta.com/horizon/feedback/vr/investigations/1557993751977106/
- MediaPipe Pose Landmarker: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
