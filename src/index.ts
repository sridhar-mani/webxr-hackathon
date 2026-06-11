import {
  World,
  SessionMode,
  Mesh,
  BoxGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  DirectionalLight,
  AmbientLight,
  Color,
  Interactable,
  OneHandGrabbable,
  EnvironmentType,
  LocomotionEnvironment,
  PanelUI,
  ScreenSpace,
} from "@iwsdk/core";

import { Spin, SpinSystem } from "./spin.js";
import { PanelSystem } from "./panel.js";

/**
 * iWSDK bootstrap.
 *
 * `World.create` owns the Three.js render loop, the WebXR session, input
 * (controllers + hand tracking), and the ECS scheduler. `offer: 'always'` lets
 * the headset browser surface its native "Enter VR" affordance; the spatial UI
 * panel below also has an Enter/Exit button (see ui/welcome.uikitml + panel.ts).
 *
 * Switch `SessionMode.ImmersiveVR` → `SessionMode.ImmersiveAR` for passthrough.
 */
World.create(document.getElementById("scene-container") as HTMLDivElement, {
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    offer: "always",
    features: { handTracking: true },
  },
  features: {
    grabbing: true,
    locomotion: true,
  },
}).then((world) => {
  const { camera } = world;
  camera.position.set(0, 1.6, 2);

  world.registerComponent(Spin);

  // --- Lighting -----------------------------------------------------------
  const sun = new DirectionalLight(0xffffff, 1.4);
  sun.position.set(3, 6, 2);
  world.createTransformEntity(sun);
  world.createTransformEntity(new AmbientLight(0xffffff, 0.6));

  // --- Floor (locomotion / teleport surface) ------------------------------
  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({ color: new Color(0x20202e), roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  world
    .createTransformEntity(floor)
    .addComponent(LocomotionEnvironment, { type: EnvironmentType.STATIC });

  // --- Grabbable, spinning cubes ------------------------------------------
  // Placed ~1m in front at eye height — inside the Quest comfort band.
  const palette = [0x7c6cff, 0x22c3a6, 0xf0a23b];
  palette.forEach((hex, i) => {
    const cube = new Mesh(
      new BoxGeometry(0.3, 0.3, 0.3),
      new MeshStandardMaterial({ color: new Color(hex), roughness: 0.35 }),
    );
    cube.position.set((i - 1) * 0.5, 1.4, -1.2);
    world
      .createTransformEntity(cube)
      .addComponent(Spin, { speed: 0.6 })
      .addComponent(Interactable)
      .addComponent(OneHandGrabbable, { translate: true, rotate: true });
  });

  // --- Welcome panel with Enter/Exit XR button ----------------------------
  // Renders as a spatial panel in XR, and as a screen-space overlay in the
  // browser (so users can enter XR before donning the headset's session).
  const panel = world
    .createTransformEntity()
    .addComponent(PanelUI, {
      config: "./ui/welcome.json",
      maxWidth: 1.6,
      maxHeight: 0.8,
    })
    .addComponent(Interactable)
    .addComponent(ScreenSpace, { top: "20px", left: "20px", height: "40%" });
  panel.object3D!.position.set(0, 1.4, -1.9);

  world.registerSystem(SpinSystem).registerSystem(PanelSystem);
});
