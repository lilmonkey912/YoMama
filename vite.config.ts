import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  root: "src/renderer",
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../../out/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(
          new URL("./src/renderer/index.html", import.meta.url),
        ),
        landing: fileURLToPath(
          new URL("./src/renderer/landing.html", import.meta.url),
        ),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer"),
    },
  },
});
