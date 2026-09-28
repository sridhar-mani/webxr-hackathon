import {
  AmbientLight,
  Color,
  DirectionalLight,
  EnvironmentType,
  LocomotionEnvironment,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  World
} from "@iwsdk/core";
import projectOptions from "virtual:iwsdk-project";

import { Spin, SpinSystem } from "./spin.js";
import { configureWelcomePanel } from "./panel.js";
import { addTryOnAvatar, addWardrobe, addWardrobeMarker } from "./wardrobeScene.js";
import { demoWardrobe } from "./domain/wardrobe.js";

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

  addWardrobeMarker(world);
  addWardrobe(world, demoWardrobe);
  addTryOnAvatar(world, demoWardrobe[0]);

  const panel = world.requireSceneObject("welcome-panel");
  configureWelcomePanel(world, panel);

  world.registerSystem(SpinSystem);
});
