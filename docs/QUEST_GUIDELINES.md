# Building for Meta Quest on the Web — the comprehensive checklist

Everything a v0 / Vercel template should bake in to make a web app feel native
on the **Meta Quest browser** (Quest 2 / 3 / 3S / Pro). Numbers are from Meta's
Horizon OS design + web docs and the WebXR spec; sources at the bottom.

This is the shared checklist for both templates in this repo: **`2d-web`**
(Next.js PWA + multi-panel) and **`webxr-iwsdk`** (Vite + Immersive Web SDK).

> Units: Meta's design docs use **dp** (density-independent px). On a Quest 2D
> panel, `1dp ≈ 1 CSS px` at default scale — treat dp values as CSS px guidance.

Legend: ✅ covered by a template here · ➕ recommended add-on for your app.

---

## 0. Platform cheat-sheet (defaults to design against)

| Thing | Value | Why it matters |
|---|---|---|
| Engine | Chromium-based (Quest Browser, currently ~Chromium 136 / OculusBrowser 39.x) | Modern web standards; **don't** UA-sniff for features |
| 2D panel width | **500–2000 px** (default **1280**) | Your layout must be fluid across this whole range |
| 2D panel height | **495–1070 px** (default **670**) | Don't break below ~495px tall |
| Default browser mode | **Desktop** (ignores `<meta viewport>`) | Test both desktop + mobile modes |
| Refresh rate | 90 Hz (Quest 2+) / 72 Hz (Quest 1); up to 120 Hz on high-end | Frame budget ≈ 11ms @ 90Hz |
| Min hit target | **48dp** (~22mm / 3° FOV @ 0.42m) | Controller ray + hand pinch need big targets |
| Min visual target | **32dp** | Smaller visuals feel hard to hit even with hitslop |
| Body text | **14dp** (min legible 11dp) | Smaller text is unreadable at panel distance |
| Contrast | **4.5:1** text, **3:1** large/UI (WCAG 2.1) | LCD + lens optics wash out low contrast |
| Comfort distance | **≥0.5m, ~1m ideal** for fixated UI | Vergence-accommodation comfort |
| Working FOV band | **~40°** central | Place critical content here |
| Brightness | ~100 nits; values <~13/255 indistinguishable | **Don't use pure black**; avoid pure-white glare |
| PWA icon | **≥512×512** + maskable; `display: standalone`/`fullscreen`; `orientation: landscape` | Horizon Store packaging |
| Persistent anchors | **8 per site** (WebXR) | Budget your AR anchors |
| Hand joints | 25 per hand; profile `generic-hand` | Hand-tracking input |
| Depth API (WebXR) | **Not supported** (native-only) | Don't design around it on web |

---

## 1. Design & visual system

- ✅ **Dark-first theme.** Default to dark; it's easier on the eyes through Quest
  optics and saves power. (This template defaults to `dark`.)
- ✅ **Don't use pure black or pure white.** The Quest LCD can't resolve values
  below ~13/255, so deep blacks crush; large white fields glare in passthrough.
  Sit your background around `oklch(0.21)` (dark) / soft off-white (light).
- ✅ **High contrast.** Meet WCAG 2.1: 4.5:1 body text, 3:1 large text & UI/icons.
  Never rely on color alone; ship a high-contrast option. ➕ Add a high-contrast
  theme variant for accessibility.
- ✅ **Generous radii.** Squircle-ish corners match Horizon OS panels.
- ✅ **Legible type scale.** Body ≥14dp (this template bumps the root to 17px).
  Avoid italics (render poorly in VR) and overusing heavy weights.
- ✅ **Larger icons.** 24dp standard; 12–16dp only for status badges.
- ➕ **Color management.** Master in sRGB; Quest 3/Pro add Display P3 — ensure
  graceful clipping. Avoid large high-frequency repeating patterns (false fusion).

## 2. Layout & multi-panel

- ✅ **Fully fluid layout, 500–2000px wide.** Use flex/grid + container queries,
  not phone/desktop breakpoints. (`usePanelSize` + `PanelGroup` here.)
- ✅ **Assume you're one panel among several** and can be **resized live.** React
  to `ResizeObserver`, never to a fixed width.
- ✅ **Fill the panel edge-to-edge.** Horizon OS supplies the window chrome
  (title bar, close/minimize/theater) — don't duplicate it. (`QuestPanel`.)
- ✅ **Don't break when narrow/short.** Collapse multi-column to a single
  scrolling column under ~760px.
- ➕ **No programmatic window placement.** There's no web API to move/tile the
  user's panels; panel arrangement is a user action. (Feature-detect
  `window.getScreenDetails()` if you experiment — Quest support is unconfirmed.)
- ➕ **Curvature is the compositor's job** for 2D pages — don't try to fake it in
  CSS. Curved UI only matters inside WebXR.

## 3. Input & interaction

- ✅ **48px minimum hit targets** for everything tappable (ray-cast + pinch).
  Use the `min-h-touch` / `size-touch` utilities and the Button `xl` /
  `icon-touch` sizes. Add invisible hitslop if the visual is smaller.
- ✅ **Obvious hover + focus.** The controller ray surfaces as pointer hover;
  hand pinch as click. Style `:hover` and `:focus-visible` clearly (≥2px,
  high-contrast focus ring). Keep a logical focus order; never trap focus.
- ➕ **Map the standard controls:** trigger = click, thumbstick = scroll, grip =
  grab, B/Y = back. Meta/menu buttons are OS-reserved — don't bind them.
- ➕ **Hand tracking:** pinch = select; **palm-pinch is system-reserved** (don't
  use). In WebXR, hands expose 25 joints; the `generic-hand` profile renders them.
- ➕ **Virtual keyboard:** the system keyboard pops on `<input>` focus (2D). In
  WebXR, check `XRSession.isSystemKeyboardSupported`, summon via a focused
  `<input>`, and read the field `value` (there are **no per-keypress events**).
- ➕ Support **Bluetooth keyboard/mouse and gamepads** as alternate input.

## 4. PWA & installability

- ✅ **Web app manifest** with `name` + `short_name`, `start_url`, `display`,
  `orientation: "landscape"`, `theme_color`/`background_color`, and **≥512×512 +
  maskable icons**. (`app/manifest.ts` here.)
- ✅ **Service worker with an offline fallback** (required for Quest PWAs).
  (`public/sw.js` + `/offline` here; upgrade path: Serwist.)
- ✅ **Serve over HTTPS** (required for install + WebXR). Locally use
  `npm run dev:https`.
- ➕ **`display: "fullscreen"`** instead of `standalone` if your PWA should boot
  straight into an immersive WebXR session.
- ➕ **Package for the Meta Horizon Store** with **Bubblewrap** (wraps the PWA in
  a Trusted Web Activity). IAP via the Digital Goods API.
- ⚠️ **Quest PWA limits:** no web push notifications, no background execution
  when the user switches apps, limited storage quota (don't bundle huge local
  assets), limited Clipboard/WebRTC codecs.
- ⚠️ **WebXR PWA startup VRC:** immersive PWAs boot straight into VR, so load
  most assets *after* the session starts to pass the startup-time requirement.

## 5. WebXR (immersive VR + AR passthrough)

- ✅ **Feature-detect**, don't UA-sniff: `navigator.xr?.isSessionSupported('immersive-vr' | 'immersive-ar')`. (`useXRSupport`.)
- ✅ **Enter from a user gesture.** A session can only start from a click/tap.
  (`EnterXRButton`.)
- ✅ **Transparent canvas for AR.** Don't clear to an opaque color in
  `immersive-ar` or you'll paint over passthrough. (`XRScene` keeps the canvas
  transparent.)
- ✅ **Place content in the comfort band:** ~1m away, eye height, within ~40° FOV.
- ➕ **Reference spaces:** `local-floor` or `bounded-floor` for room-scale;
  `unbounded` for large-area AR.
- ➕ **Input sources:** controllers expose `targetRaySpace` + `gripSpace` and an
  `xr-standard` Gamepad; hands expose 25 joints. `@react-three/xr` wires all of
  this by default.
- ➕ **AR features that work on Quest:** passthrough (color on 3/Pro, grayscale on
  2), plane-detection, hit-test, anchors (incl. persistent — **max 8/site**),
  dom-overlay. **Depth-sensing is NOT available** in Quest WebXR.
- ➕ **Engine choice:** React Three Fiber + `@react-three/xr` (this template),
  or Three.js / Babylon.js / A-Frame / PlayCanvas / Wonderland, or
  `<model-viewer>` for a quick glTF/GLB "view in VR/AR" affordance.

## 6. Performance

- ➕ **Render in the XR frame loop** (`XRSession.requestAnimationFrame`), not
  `window.requestAnimationFrame`, while immersive. (R3F handles this.)
- ➕ **Target the device refresh** (90/72; up to 120). Enumerate
  `session.supportedFrameRates`; drop the target if you can't hold the budget.
- ➕ **Fixed Foveated Rendering** for fragment-bound scenes: `foveation` on
  `createXRStore`, or `XRWebGLLayer.fixedFoveation` 0–1. Can blur text-heavy UI.
- ➕ **Use compositor layers** for skyboxes/video (`XRMediaBinding`) — big GPU win
  (Meta measured ~3.15ms → 0.72ms moving a 360 photo to a layer).
- ➕ **Multiview** (`OCULUS_multiview`, WebGL2) renders both eyes in one pass
  (~25–50% CPU savings).
- ➕ **Be fill-rate aware:** Quest is usually fragment-bound. Sort opaque
  front-to-back, limit real-time lights/shadows, bake lighting, watch
  transparency/particles overdraw.
- ➕ **Compress textures** (KTX 2.0 / Basis Universal); stagger CPU work across
  frames; profile on device (OVR Metrics Tool, `ovrgpuprofiler`, `chrome://inspect`).

## 7. Comfort & accessibility

- ➕ **Avoid vection/nausea:** no forced or fast camera motion, keep the horizon
  stable, prefer teleport over smooth locomotion, offer comfort options
  (vignette, snap-turn).
- ➕ **No flashing** (seizure risk); keep animations gentle (caption roll-up
  ~0.5s ease-out is Meta's reference).
- ➕ **Ergonomics:** arms near the body, controls within easy reach; put frequent
  actions closer, rare ones farther.
- ➕ **Captions/labels** in the 40° band; visible focus; don't rely on color.

## 8. Testing & tooling

- ➕ **Immersive Web Emulator** (Chrome/Edge extension) for desktop WebXR dev.
  `@react-three/xr` auto-emulates a Quest 3 on localhost.
- ➕ **Remote debug** on device via `chrome://inspect#devices` (`com.oculus.browser`).
- ➕ Test the live URL in the Quest browser **before** packaging the PWA (same engine).
- ➕ Run **Lighthouse PWA** audit; verify install + offline.

---

## Sources

- Quest Browser intro / specs — https://developers.meta.com/horizon/documentation/web/browser-intro/ · https://developers.meta.com/horizon/documentation/web/browser-specs/
- Panels / design — https://developers.meta.com/horizon/design/panels · https://developers.meta.com/horizon/design/display
- Fonts & icons — https://developers.meta.com/horizon/design/fonts-icons
- Accessibility (targets, contrast, FOV) — https://developers.meta.com/horizon/design/accessibility
- Input modalities / controllers / hands — https://developers.meta.com/horizon/design/interactions-input-modalities · https://developers.meta.com/horizon/documentation/web/webxr-hands/
- WebXR overview / mixed reality / keyboard — https://developers.meta.com/horizon/documentation/web/webxr-overview/ · https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/ · https://developers.meta.com/horizon/documentation/web/webxr-keyboard/
- WebXR perf (frames, FFR, layers, multiview, best practices) — https://developers.meta.com/horizon/documentation/web/webxr-frames/ · https://developers.meta.com/horizon/documentation/web/webxr-ffr/ · https://developers.meta.com/horizon/documentation/web/webxr-layers/ · https://developers.meta.com/horizon/documentation/web/web-multiview/ · https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/
- PWA on Quest — https://developers.meta.com/horizon/documentation/web/pwa-gs/
- @react-three/xr — https://docs.pmnd.rs/xr
