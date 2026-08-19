import { defineConfig } from "vite";

export default defineConfig({
  base: "./",

  build: {
    assetsDir: "",

    rollupOptions: {
      output: {
        entryFileNames: "assessment.js",

        chunkFileNames: "assessment.js",

        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "assessment.css";
          }

          return "[name][extname]";
        },
      },
    },
  },
});
