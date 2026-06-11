import {
  createSystem,
  PanelUI,
  PanelDocument,
  eq,
  VisibilityState,
  UIKitDocument,
  UIKit,
} from "@iwsdk/core";

/**
 * Wires the welcome panel's #xr-button to enter/exit the immersive session and
 * keeps its label in sync with the world's visibility state. Mirrors the iWSDK
 * scaffold's panel pattern.
 */
export class PanelSystem extends createSystem({
  welcomePanel: {
    required: [PanelUI, PanelDocument],
    where: [eq(PanelUI, "config", "./ui/welcome.json")],
  },
}) {
  init() {
    this.queries.welcomePanel.subscribe("qualify", (entity) => {
      const document = PanelDocument.data.document[entity.index] as UIKitDocument;
      if (!document) return;

      const xrButton = document.getElementById("xr-button") as UIKit.Text;
      xrButton.addEventListener("click", () => {
        if (this.world.visibilityState.value === VisibilityState.NonImmersive) {
          this.world.launchXR();
        } else {
          this.world.exitXR();
        }
      });

      this.world.visibilityState.subscribe((visibilityState) => {
        xrButton.setProperties({
          text:
            visibilityState === VisibilityState.NonImmersive
              ? "Enter VR"
              : "Exit to Browser",
        });
      });
    });
  }
}
