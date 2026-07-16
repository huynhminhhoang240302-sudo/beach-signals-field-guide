import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Beach/Signals field guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Beach\/Signals/i);
  assert.match(html, /The beach is/i);
  assert.match(html, /Nine dangers/i);
  assert.match(html, /Respect the Beach/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Lorem Ipsum/i);
});

test("keeps content typed, local and free of starter artifacts", async () => {
  const [hazards, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../src/data/hazards.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  const hazardIds = hazards.match(/\n\s+id: "[^"]+"/g) ?? [];
  assert.equal(hazardIds.length, 9);
  assert.match(page, /import App from "@\/src\/App"/);
  assert.match(layout, /Beach\/Signals/);
  assert.match(packageJson, /"@react-three\/fiber"/);
  assert.match(packageJson, /"framer-motion"/);
  assert.doesNotMatch(page + layout + packageJson, /_sites-preview|react-loading-skeleton|Starter Project/);
  await access(new URL("../public/mascot.webp", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
