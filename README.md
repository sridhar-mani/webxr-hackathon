# quest-webxr-iwsdk

An **immersive WebXR starter for the Meta Quest browser**, built on **Meta's
Immersive Web SDK ([iWSDK](https://iwsdk.dev))** + Vite, with **PWA** support.

> For 2D web (panels, dashboards, PWAs) without 3D, use the sibling
> [`quest-2d-web`](https://github.com/axe-fb/quest-2d-web) template (Next.js + shadcn/ui).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/axe-fb/quest-webxr-iwsdk)

> Built on iWSDK `@iwsdk/core` (ECS on Three.js) · TypeScript · Vite 7 ·
> vite-plugin-pwa. Renderer is `super-three` (Meta's Three.js fork, pinned by iWSDK).

---

## What you get

| Area | Included |
|---|---|
| **Immersive scene** | `World.create` VR session (`offer: 'always'`), lighting, a locomotion floor, and grabbable cubes ~1m away in the comfort band |
| **Interaction** | `Interactable` + `OneHandGrabbable` grab; hand tracking enabled; locomotion (thumbstick move + turn) |
| **Custom ECS** | `Spin` component + `SpinSystem` — the canonical data/behavior pattern (`src/spin.ts`) |
| **Spatial UI** | A UIKitML welcome panel (`ui/welcome.uikitml`) with an Enter/Exit-XR button, shown spatially in VR and as a screen-space overlay in the browser (`src/panel.ts`) |
| **Desktop testing** | IWER emulator auto-injected on localhost via `@iwsdk/vite-plugin-dev` |
| **PWA** | `vite-plugin-pwa` manifest (`display: fullscreen`, landscape, maskable icons) + Workbox service worker that precaches the bundle and assets |
| **Deploy** | `vercel.json` (Vite preset, `dist/`, SPA rewrites) |
| **Docs** | [`docs/QUEST_GUIDELINES.md`](docs/QUEST_GUIDELINES.md) — the full Quest web checklist with sources |

---

## Quick start

```bash
npm install
npm run icons      # generate PWA icons (zero deps; already committed)
npm run dev        # https://localhost:8081  (mkcert provides HTTPS; WebXR needs it)
```

- **On desktop:** the [IWER](https://meta-quest.github.io/immersive-web-emulation-runtime/)
  emulator is injected automatically so you can preview without a headset.
- **On a headset:** open `https://<your-LAN-ip>:8081` in the Meta Quest browser,
  or build + deploy and open the public URL. Remote debug via `chrome://inspect`.

```bash
npm run typecheck  # tsc --noEmit, against the real @iwsdk/core types
npm run build      # → dist/ (static; deploy anywhere)
npm run preview    # serve the production build locally
```

---

## Project structure

```
index.html              # mounts #scene-container + /src/index.ts
src/
  index.ts              # World.create — scene, lights, floor, cubes, panel
  spin.ts               # example custom component (Spin) + system (SpinSystem)
  panel.ts              # PanelSystem — wires the Enter/Exit XR button
ui/
  welcome.uikitml       # spatial UI markup (compiled → public/ui/welcome.json)
public/icons/           # PWA icons (generated)
scripts/generate-icons.mjs
vite.config.ts          # iwsdkDev + compileUIKit + mkcert + VitePWA
tsconfig.json · vercel.json · package.json
```

---

## Switching VR ↔ AR (passthrough)

In `src/index.ts`, change the session mode:

```ts
xr: { sessionMode: SessionMode.ImmersiveAR, offer: 'always', features: { handTracking: true } }
```

For AR, render against the real world (don't add an opaque skybox) and consider
enabling `planeDetection` / `anchors` in the `xr.features` object. iWSDK exposes
`XRPlane` / `XRMesh` / `XRAnchor` components and a `SceneUnderstandingSystem`.

---

## Notes & caveats

- **iWSDK is pre-1.0 (0.4.2 pinned).** Minor releases may change APIs — bump
  deliberately. `three` is aliased to `super-three@0.181.0`; account for that if
  you add other Three.js ecosystem packages.
- **`dev` uses `vite` directly.** iWSDK also ships an `iwsdk dev` daemon CLI
  (`@iwsdk/cli`) with extra tooling; add it back if you want it.
- **PWA on Quest:** immersive PWAs boot straight into the session, so load heavy
  assets *after* the session starts (startup-time VRC). No web push on Quest.
- See [`docs/QUEST_GUIDELINES.md`](docs/QUEST_GUIDELINES.md) for comfort,
  input, performance (foveation/layers/multiview), and PWA packaging guidance.

---

## License

MIT.
