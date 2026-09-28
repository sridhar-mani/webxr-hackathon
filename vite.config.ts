import { iwsdkDev } from "@iwsdk/vite-plugin-dev";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    iwsdkDev(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        id: "/",
        name: "quest-webxr-iwsdk",
        short_name: "quest-webxr",
        description: "A WebXR experience for Meta Quest, built with IWSDK.",
        start_url: "/",
        display: "fullscreen",
        orientation: "landscape",
        background_color: "#0c0c14",
        theme_color: "#0c0c14",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,json,wasm,glb,gltf,bin,hdr,ktx2,mp3}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      },
      devOptions: { enabled: false }
    })
  ],
  server: { host: "0.0.0.0", port: 8081, open: false },
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: process.env.NODE_ENV !== "production",
    rollupOptions: { input: "./index.html" }
  },
  esbuild: { target: "esnext" },
  resolve: {
    dedupe: ["three", "@pmndrs/uikit", "@pmndrs/uikit-horizon", "@pmndrs/uikit-lucide"]
  },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
    include: ["three", "@pmndrs/uikit", "@pmndrs/uikit-horizon", "@pmndrs/uikit-lucide", "@drawcall/uikitml"],
    esbuildOptions: { target: "esnext" }
  },
  publicDir: "public",
  base: "./"
});
