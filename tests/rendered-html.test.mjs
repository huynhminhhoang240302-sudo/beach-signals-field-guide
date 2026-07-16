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
  assert.match(html, /(?:Start|Next)/i);
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

test("provides long-scroll jump navigation and reveal interactions", async () => {
  const app = await readProjectFile("src/App.tsx");

  assert.match(app, /scrollIntoView/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /data-scroll-section/);
  assert.match(app, /Jump into the guide/i);
  assert.match(app, /Jump to a hazard/i);
  assert.match(app, /Reveal the calm move/i);
  assert.match(app, /aria-expanded/);
  assert.match(app, /aria-current/);
  assert.match(app, /BeachMap/);
  assert.doesNotMatch(app, /Scout is watching|SCOUT’S SCAN/i);
});

test("renders a procedural 3D guide with expressive face and gestures", async () => {
  const [app, guide] = await Promise.all([
    readProjectFile("src/App.tsx"),
    readProjectFile("src/components/GuideAvatar3D.tsx"),
  ]);

  assert.match(app, /GuideAvatar3D/);
  assert.doesNotMatch(app, /mascot\.webp|<AvatarGuide\b|<HeroScene\b/i);
  assert.match(guide, /@react-three\/fiber/);
  assert.match(guide, /<Canvas\b/);
  assert.match(guide, /<mesh\b|Geometry\b/);
  assert.match(guide, /eye/i);
  assert.match(guide, /brow/i);
  assert.match(guide, /mouth/i);
  assert.match(guide, /reaction|expression/i);
  assert.match(guide, /gesture|point/i);
  assert.doesNotMatch(
    guide,
    /mascot\.webp|useTexture|TextureLoader|#c89a3c|#f0ca72|<img\b/i,
  );
});
