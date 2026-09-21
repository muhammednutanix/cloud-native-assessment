import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        report: resolve(__dirname, "report/index.html"),
      },
      output: {
        entryFileNames: "entries/[name].js",
        chunkFileNames: "main.js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "main.css" : "assets/[name][extname]",
      },
    },
  },
});
