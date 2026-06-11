import { iwsdkDev } from "@iwsdk/vite-plugin-dev";
import { compileUIKit } from "@iwsdk/vite-plugin-uikitml";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    // Local HTTPS — WebXR (and service workers) require a secure context.
    mkcert(),
    // Injects the Immersive Web Emulator (IWER) on desktop/localhost so you can
    // test in the browser without a headset. No-ops on the Quest browser.
    iwsdkDev({
      emulator: { device: "metaQuest3" },
      verbose: true,
    }),
    // Compiles ui/*.uikitml spatial UI markup → public/ui/*.json at build time.
    compileUIKit({ sourceDir: "ui", outputDir: "public/ui", verbose: true }),
    // PWA: installable on Quest. Immersive PWAs boot straight into the session,
    // so we use display "fullscreen" + landscape orientation.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        id: "/",
        name: "quest-webxr-iwsdk",
        short_name: "quest-webxr",
        description: "A WebXR experience for Meta Quest, built with iWSDK.",
        start_url: "/",
        display: "fullscreen",
        orientation: "landscape",
        background_color: "#0c0c14",
        theme_color: "#0c0c14",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,json,wasm,glb,gltf,bin,hdr,ktx2,mp3}",
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      // Keep the SW out of dev to avoid caching surprises while iterating.
      devOptions: { enabled: false },
    }),
  ],
  server: { host: "0.0.0.0", port: 8081, open: true },
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: process.env.NODE_ENV !== "production",
  },
  esbuild: { target: "esnext" },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
    esbuildOptions: { target: "esnext" },
  },
  publicDir: "public",
  // Root deploy (Vercel). For a subpath host (e.g. GitHub Pages) use "/repo/".
  base: "/",
});
