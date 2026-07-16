# Beach/Signals

A responsive, single-page beach-safety presentation. Fourteen click-through slides combine a procedural 3D guide, nine CSS-built hazard miniatures, an interactive shoreline map and a tappable safety checklist. The interface uses Comic Sans throughout.

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
npm run test
```

`npm run test` creates the production output in `dist/` and checks the rendered presentation shell, interaction affordances, typography, avatar implementation and local hazard data.

## Presentation controls

- Click **Start presentation**, **Previous**, **Next**, any progress dot or a hazard in the index.
- Use Left/Right or Page Up/Page Down to move one slide.
- Use Home/End to jump to the first or last slide.
- Swipe horizontally on touch screens. Interactive map markers and checklist cards are excluded from slide swipes so they remain easy to use.
- On a narrow or short screen, the current slide scrolls inside the presentation frame while the navigation controls remain visible.

## Project map

```text
app/
  globals.css                       Comic Sans visual system, presentation layout and CSS scenes
  layout.tsx                        Site metadata and root document
  page.tsx                          App entry
src/
  components/
    GuideAvatar3D.tsx               Procedural expressive 3D guide and WebGL fallback
    PresentationControls.tsx        Accessible previous/next controls and slide dots
    HazardVisual.tsx                Nine CSS-only miniature scenes
    BeachMap.tsx                    Keyboard-accessible warning-sign hotspots
  data/
    hazards.ts                      Typed local content for all nine hazards
  hooks/
    usePresentationNavigation.ts    Keyboard, click and touch-swipe navigation
  App.tsx                           Fourteen-slide presentation composition
tests/
  rendered-html.test.mjs            Production render and presentation invariants
```

## 3D guide

Scout is built entirely from React Three Fiber and Three.js geometry. The guide has a charcoal puzzle-piece body, blue accents, visible eyes and pupils, articulated eyebrows, multiple mouth shapes, arms, hands and legs. Reactions and gestures change by slide: wave, point, warn, move away and celebrate. No raster mascot texture, gold side piece or logo is rendered.

The canvas caps device pixel ratio, pauses when the page is hidden, honors reduced motion and falls back to a CSS-built character if WebGL is unavailable.

## Updating content

Edit `src/data/hazards.ts`. Each hazard contains its title, short description, danger explanation, immediate safety action, scene type, guide reaction and accent color. The hazard index and all nine lesson slides read from this typed source.

## Accessibility

- Every canvas has a descriptive label and all safety guidance remains semantic text outside WebGL.
- Presentation controls expose live slide status, disabled boundary states and named progress dots.
- Map markers support Tab plus Arrow, Home and End keys.
- Interactive targets have visible focus states; global slide shortcuts ignore form and button interactions.
- Reduced-motion preferences collapse presentation and ambient animation.

The presentation is educational and intentionally non-graphic. Local flags, lifeguards, posted closures and emergency services always take priority.
