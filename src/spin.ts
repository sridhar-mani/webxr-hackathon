import { createComponent, createSystem, Types } from "@iwsdk/core";

/**
 * Example custom ECS component + system.
 *
 * `Spin` is pure data (a rotation speed). `SpinSystem` is behavior: every frame
 * it rotates each entity that has a `Spin` component. This is the canonical
 * iWSDK pattern — define data with `createComponent`, behavior with
 * `createSystem`, then register both on the world.
 */
export const Spin = createComponent("Spin", {
  speed: { type: Types.Float32, default: 0.5 },
});

export class SpinSystem extends createSystem({
  spinning: { required: [Spin] },
}) {
  update(delta: number) {
    this.queries.spinning.entities.forEach((entity) => {
      const speed = entity.getValue(Spin, "speed") ?? 0;
      entity.object3D!.rotation.y += speed * delta;
    });
  }
}
