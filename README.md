# quest-webxr-iwsdk

A competition-ready WebXR starter for Meta Quest using Meta's Immersive Web SDK (IWSDK) 1.0, Three.js-compatible super-three, Vite, and PWA support.

## Stack

- IWSDK 1.0
- Three.js via Meta's pinned super-three@0.181.0
- TypeScript + Vite 7
- WebXR VR with hand tracking
- Hand-pinch grabbing + ray interaction
- Spatial UIKitML UI loaded as an asset
- IWSDK managed dev/emulator tooling
- PWA packaging for Quest

## Development

```bash
npm install
npm run icons
npm run typecheck
npm run build
npm run dev
```

Use `npm run dev:runtime` when you specifically want plain Vite without the IWSDK managed browser.

The IWSDK-managed HTTPS dev server is the preferred development path; no separate mkcert plugin is required.

## Project structure

```
iwsdk.config.json
public/scenes/main.iwsdk.scene.json
src/assets.ts
src/components.ts
src/index.ts
src/panel.ts
src/spin.ts
ui/welcome.uikitml
```

## Notes

- This migration branch intentionally leaves the old package lock untouched; run npm install locally to regenerate it.
- Keep three aliased to super-three@0.181.0 and overridden at the app root so IWSDK and app code share one Three.js runtime.
- Dynamic gameplay remains in TypeScript; stable authored scene composition belongs in native scene JSON.
