import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);
const readProjectFile = (path) => readFile(projectFile(path), "utf8");

async function render() {
  const workerUrl = projectFile("dist/server/index.js");
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const indexHtml = await readProjectFile("dist/client/index.html");

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async (request) =>
          new URL(request.url).pathname === "/index.html"
            ? new Response(indexHtml, { headers: { "content-type": "text/html; charset=UTF-8" } })
            : new Response("Not found", { status: 404 }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Beach/Signals presentation shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Beach\/Signals/i);
  assert.match(html, /Beach\/Signals/i);
  assert.match(html, /(?:interactive|presentation|slide)/i);
  assert.match(html, /Starting/i);
  assert.doesNotMatch(html, /mascot\.webp|codex-preview|react-loading-skeleton|Lorem Ipsum/i);
});

test("keeps all nine hazards typed, local, and free of starter artifacts", async () => {
  const [hazards, page, layout, packageJson] = await Promise.all([
    readProjectFile("src/data/hazards.ts"),
    readProjectFile("app/page.tsx"),
    readProjectFile("app/layout.tsx"),
    readProjectFile("package.json"),
  ]);

  const hazardIds = hazards.match(/\n\s+id: "[^"]+"/g) ?? [];
  assert.equal(hazardIds.length, 9);
  assert.match(page, /import App from "@\/src\/App"/);
  assert.match(layout, /Beach\/Signals/);
  assert.match(packageJson, /"@react-three\/fiber"/);
  assert.match(packageJson, /"framer-motion"/);
  assert.doesNotMatch(
    page + layout + packageJson,
    /mascot\.webp|_sites-preview|react-loading-skeleton|Starter Project/,
  );
  await assert.rejects(access(projectFile("app/_sites-preview")));
});

test("uses Comic Sans throughout a full-height long-scroll presentation", async () => {
  const css = await readProjectFile("app/globals.css");
  const universalComicSans = /\*\s*\{[^}]*font-family\s*:\s*[^;}]*Comic Sans/is.test(css);
  const sharedComicSansVariables =
    /--display\s*:\s*[^;]*Comic Sans/i.test(css) &&
    /--body\s*:\s*[^;]*Comic Sans/i.test(css);

  assert.ok(
    universalComicSans || sharedComicSansVariables,
    "the global and display type must both resolve to Comic Sans",
  );
  assert.match(css, /(?:100svh|100dvh|100vh)/i);
  assert.match(css, /scroll-section/i);
  assert.match(css, /scroll-snap|scroll-behavior/i);
  assert.match(css, /--bw-black\s*:\s*#000000/i);
  assert.doesNotMatch(css, /filter\s*:\s*grayscale/i);
});

test("provides long-scroll jump navigation and a return to the map", async () => {
  const app = await readProjectFile("src/App.tsx");

  assert.match(app, /scrollIntoView/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /data-scroll-section/);
  assert.match(app, /Jump into the guide/i);
  assert.match(app, /Jump to a hazard/i);
  assert.match(app, /aria-label="Back to map"/i);
  assert.match(app, /<MapIcon aria-hidden="true"/i);
  assert.doesNotMatch(app, />\s*Back to map\s*</i);
  assert.match(app, /aria-current/);
  assert.match(app, /AccidentSceneMap/);
  assert.doesNotMatch(app, /Do this|Signal to notice|hazard-chapter__signal|GuideAvatar3D|scroll-companion|Safe action|Next field note|FIELD NOTE \/|Scout is watching|SCOUT’S SCAN/i);
  assert.doesNotMatch(app, /Why it matters|Calm move revealed|Your sixty-second safety check|END OF FIELD GUIDE|Review the directory|Start again/i);
});

test("shows all nine accidents on one clickable illustrated map", async () => {
  const map = await readProjectFile("src/components/AccidentSceneMap.tsx");
  assert.match(map, /hazards\.map/);
  assert.match(map, /markerPositions/);
  assert.match(map, /onClick=\{\(\) => onJump\(`story-\$\{hazard\.id\}`\)\}/);
  assert.match(map, /accident-scene-map__ocean/);
  assert.match(map, /accident-scene-map__sand/);
  assert.match(map, /accident-scene-map__cliff/);
  assert.match(map, /accident-scene-map__pier/);
  assert.match(map, /accident-scene-map__parasail/);
  assert.doesNotMatch(map, /Click a number|padStart|field note \$\{index/i);
});

test("pairs the nine supplied panels with retouched interactive action frames", async () => {
  const [visual, css] = await Promise.all([
    readProjectFile("src/components/HazardVisual.tsx"),
    readProjectFile("app/globals.css"),
  ]);

  assert.match(visual, /useState/);
  assert.match(visual, /aria-pressed=\{active\}/);
  assert.match(visual, /onClick=\{\(\) => setActive/);
  assert.match(visual, /hazard-panel__image/);
  const suppliedPanels = visual.match(/"\/hazard-panels\/[^"\r\n]+\.png"/g) ?? [];
  assert.equal(suppliedPanels.length, 9);
  await Promise.all(
    suppliedPanels.map((panel) => access(projectFile(`public${panel.slice(1, -1)}`))),
  );
  const activePanels = visual.match(/"\/hazard-panels-active\/[^"\r\n]+\.png"/g) ?? [];
  assert.equal(activePanels.length, 9);
  await Promise.all(
    activePanels.map((panel) => access(projectFile(`public${panel.slice(1, -1)}`))),
  );
  assert.match(css, /hazard-visual\.is-active/);
  assert.match(css, /inner(?:DebrisFall|CurrentPull|WaveSurge|Spark|Wind|Swing)/);
  assert.match(css, /--panel-accent/);
});

test("removes visible numbering from the active presentation", async () => {
  const [app, map, hazards] = await Promise.all([
    readProjectFile("src/App.tsx"),
    readProjectFile("src/components/AccidentSceneMap.tsx"),
    readProjectFile("src/data/hazards.ts"),
  ]);

  assert.doesNotMatch(app, /padStart|hazard-chapter__number|>09<|All six habits/i);
  assert.doesNotMatch(map, /accident-marker__pin[\s\S]*<b>/i);
  assert.doesNotMatch(hazards, /30 minutes/i);
});
