import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  EnvironmentType,
  LocomotionEnvironment,
  Mesh,
  MeshStandardMaterial,
  OneHandGrabbable,
  PlaneGeometry,
  RayInteractable,
  World
} from "@iwsdk/core";
import projectOptions from "virtual:iwsdk-project";

import { Spin, SpinSystem } from "./spin.js";
import { configureWelcomePanel } from "./panel.js";

World.create(
  document.getElementById("scene-container") as HTMLDivElement,
  projectOptions
).then((world) => {
  world.registerComponent(Spin);

  const sun = new DirectionalLight(0xffffff, 1.4);
  sun.position.set(3, 6, 2);
  world.createTransformEntity(sun);

  world.createTransformEntity(new AmbientLight(0xffffff, 0.6));

  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({ color: new Color(0x20202e), roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  world
    .createTransformEntity(floor)
    .addComponent(LocomotionEnvironment, { type: EnvironmentType.STATIC });

  const palette = [0x7c6cff, 0x22c3a6, 0xf0a23b];
  palette.forEach((hex, i) => {
    const cube = new Mesh(
      new BoxGeometry(0.3, 0.3, 0.3),
      new MeshStandardMaterial({ color: new Color(hex), roughness: 0.35 })
    );
    cube.position.set((i - 1) * 0.5, 1.4, -1.2);
    world
      .createTransformEntity(cube)
      .addComponent(Spin, { speed: 0.6 })
      .addComponent(RayInteractable)
      .addComponent(OneHandGrabbable);
  });

  const panel = world.requireSceneObject("welcome-panel");
  configureWelcomePanel(world, panel);

  world.registerSystem(SpinSystem);
});
