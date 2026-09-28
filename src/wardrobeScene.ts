import {
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  OneHandGrabbable,
  RayInteractable,
  SphereGeometry,
  CylinderGeometry,
  World
} from "@iwsdk/core";
import { calculateFit } from "./domain/fit.js";
import type { Garment } from "./domain/wardrobe.js";
import { demoProfile } from "./domain/wardrobe.js";

function material(color: number, roughness = 0.7): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: new Color(color), roughness });
}

export function addWardrobe(world: World, garments: Garment[]): void {
  garments.forEach((garment, index) => {
    const mesh =
      garment.category === "bottom"
        ? new Mesh(new BoxGeometry(0.42, 0.85, 0.12), material(garment.color))
        : new Mesh(new BoxGeometry(0.5, 0.62, 0.12), material(garment.color));

    mesh.position.set((index - (garments.length - 1) / 2) * 0.62, 1.25, -1.15);
    world
      .createTransformEntity(mesh)
      .addComponent(RayInteractable)
      .addComponent(OneHandGrabbable);

    const fit = calculateFit(
      demoProfile.measurements,
      garment.measurements,
      garment.id,
      garment.size,
      demoProfile.preferredFit
    );

    mesh.userData.garmentId = garment.id;
    mesh.userData.fitSummary = fit.summary;
  });
}

export function addTryOnAvatar(world: World, garment: Garment): void {
  const avatar = new Group();
  avatar.position.set(0, 0, -1.8);

  const skin = material(0xc78b6a, 0.9);
  const body = new Mesh(new CylinderGeometry(0.23, 0.27, 0.82, 24), skin);
  body.position.y = 1.15;
  avatar.add(body);

  const head = new Mesh(new SphereGeometry(0.17, 20, 16), skin);
  head.position.y = 1.72;
  avatar.add(head);

  const shirt = new Mesh(
    new BoxGeometry(0.55, 0.68, 0.16),
    material(garment.color, 0.65)
  );
  shirt.position.y = 1.2;
  avatar.add(shirt);

  const legs = new Mesh(new BoxGeometry(0.43, 0.78, 0.24), material(0x252936));
  legs.position.y = 0.42;
  avatar.add(legs);

  world.createTransformEntity(avatar);

  const fit = calculateFit(
    demoProfile.measurements,
    garment.measurements,
    garment.id,
    garment.size,
    demoProfile.preferredFit
  );

  avatar.userData.fit = fit;
}

export function addWardrobeMarker(world: World): void {
  const marker = new Mesh(
    new BoxGeometry(1.9, 0.025, 0.65),
    material(0x141622, 0.95)
  );
  marker.position.set(0, 0.03, -1.15);
  world.createTransformEntity(marker);
}
