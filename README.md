# Beach/Signals

A responsive, single-page interactive field guide to nine hidden beach hazards. The experience combines a lightweight React interface, a Three.js hero scene, CSS-built hazard miniatures, and the supplied black-and-gold puzzle-piece mascot.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server (normally `http://localhost:3000`).

## Validate and build

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

`npm run build` creates the production output in `dist/`.

## Project map

```text
app/
  globals.css            Visual system, responsive rules and CSS scenes
  layout.tsx             Site metadata and root document
  page.tsx               App entry
src/
  components/
    AvatarGuide.tsx      Reusable framing for the supplied mascot
    HeroScene.tsx        React Three Fiber hero and WebGL fallback
    HazardOrbit.tsx      Desktop orbit and mobile swipe rail
    HazardCard.tsx       Selected-hazard summary
    HazardSection.tsx    Cinematic field-note layout
    HazardVisual.tsx     Nine CSS-only miniature scenes
    BeachMap.tsx         Keyboard-accessible warning-sign hotspots
    SafetyChecklist.tsx  Six large safety-principle tiles
    FooterScene.tsx      Sunset closing scene
  data/
    hazards.ts           Typed local content for all nine hazards
  hooks/                 Motion, viewport and tab-visibility helpers
  App.tsx                Single-page composition and navigation
public/
  mascot.webp            Optimized source mascot artwork
```

## Updating the content

Edit `src/data/hazards.ts`. Each hazard includes its title, short description, danger explanation, immediate safety action, icon, scene type, mascot reaction and accent color. The orbit and all nine story sections read from this one typed file.

## Replacing or updating the mascot

1. Export the approved mascot as a high-quality, roughly square WebP file.
2. Replace `public/mascot.webp` without changing the filename.
3. Keep the recognizable black puzzle-piece body, gold side section, sunglasses, gold X, limbs and original proportions.
4. Do not add text to the image. The current source had a narrow headline at the top, so `HeroScene.tsx` deliberately samples the lower 91% and the CSS guide frames mask the same strip. If a future source is already a clean cutout, change `MASCOT_VISIBLE_HEIGHT` in `HeroScene.tsx` to `1` and remove the top mask in `.avatar-guide__frame::after`.
5. Run the validation and production build commands above.

## Accessibility and performance

- All hazard guidance is available as semantic text outside the 3D canvas.
- The orbit, map, menu and calls to action are keyboard accessible with visible focus states.
- The map supports Tab plus Arrow, Home and End keys.
- `prefers-reduced-motion` disables ambient motion and uses simple state changes.
- Mobile replaces the 3D hero with a lightweight 2.5D mascot layer and changes the orbit into a swipeable rail.
- The Three.js scene is lazy-loaded, caps device pixel ratio, stops rendering when the tab is hidden and provides a WebGL fallback.
- The supplied mascot is served as an optimized WebP asset.

The guide is educational and intentionally non-graphic. Local flags, lifeguards, posted closures and emergency services always take priority.
