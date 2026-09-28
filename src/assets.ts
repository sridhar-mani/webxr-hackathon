import { AssetType, defineAssets } from "@iwsdk/core";

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+\/u, "")}`;

export default defineAssets({
  "welcome-panel": {
    name: "Welcome Panel",
    type: AssetType.UIKitML,
    url: publicAssetUrl("ui/welcome.uikitml")
  }
});
