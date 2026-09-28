import { UIKitMLAsset, VisibilityState, World } from "@iwsdk/core";

export function configureWelcomePanel(world: World, panel: UIKitMLAsset): void {
  const xrButton = panel.requireElementById("xr-button");
  const exitButton = panel.requireElementById("exit-button");

  const launchXR = () => world.launchXR();
  const exitXR = () => world.exitXR();

  xrButton.addEventListener("click", launchXR);
  exitButton.addEventListener("click", exitXR);

  world.visibilityState.subscribe((visibilityState) => {
    const is2D = visibilityState === VisibilityState.NonImmersive;
    xrButton.setProperties({ display: is2D ? "flex" : "none" });
    exitButton.setProperties({ display: is2D ? "none" : "flex" });
  });
}
