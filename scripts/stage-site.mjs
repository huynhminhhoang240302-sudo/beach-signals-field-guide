import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const serverDirectory = resolve(root, "dist", "server");
const hostingSource = resolve(root, ".openai", "hosting.json");
const hostingTarget = resolve(root, "dist", ".openai", "hosting.json");

const worker = `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");
    const looksLikeRoute = !url.pathname.split("/").pop().includes(".");

    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || (!acceptsHtml && !looksLikeRoute)) {
      return response;
    }

    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};

export default worker;
`;

const wrangler = {
  name: "beach-signals",
  main: "index.js",
  compatibility_date: "2026-05-15",
  assets: {
    directory: "../client",
    binding: "ASSETS",
  },
  observability: {
    enabled: true,
  },
};

await mkdir(serverDirectory, { recursive: true });
await mkdir(dirname(hostingTarget), { recursive: true });
await writeFile(resolve(serverDirectory, "index.js"), worker, "utf8");
await writeFile(
  resolve(serverDirectory, "wrangler.json"),
  `${JSON.stringify(wrangler, null, 2)}\n`,
  "utf8",
);
await readFile(resolve(root, "dist", "client", "index.html"), "utf8");
await cp(hostingSource, hostingTarget);
