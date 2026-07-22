import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

const githubRepository = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  base:
    process.env.GITHUB_PAGES === "true" && githubRepository
      ? `/${githubRepository}/`
      : "/",
  plugins: [react(), sites()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
