import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {
    plugins: [],
  },
  preload: {
    plugins: [],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [react(), tailwindcss()],
    build: {
      target: "chrome115",
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: { treeshake: true },
      assetsInlineLimit: 0,
      cssMinify: true,
      // Optional: split chunks only if you lazy-load big features
    },
    esbuild: {
      drop: ["console", "debugger"],
      legalComments: "none",
    },
  },
});
