import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@easykpi/shared/catalog", replacement: path.resolve(here, "../../packages/shared/src/catalog/index.ts") },
      { find: "@easykpi/shared/formulas", replacement: path.resolve(here, "../../packages/shared/src/formulas/index.ts") },
      { find: "@easykpi/shared/benchmarks", replacement: path.resolve(here, "../../packages/shared/src/benchmarks.ts") },
      { find: "@easykpi/shared/drivers", replacement: path.resolve(here, "../../packages/shared/src/drivers/index.ts") },
      { find: "@easykpi/shared/forecasting", replacement: path.resolve(here, "../../packages/shared/src/forecasting/index.ts") },
      { find: "@easykpi/shared/schemas", replacement: path.resolve(here, "../../packages/shared/src/schemas.ts") },
      { find: "@easykpi/shared/types", replacement: path.resolve(here, "../../packages/shared/src/types.ts") },
      { find: /^@easykpi\/shared$/, replacement: path.resolve(here, "../../packages/shared/src/index.ts") },
      { find: "@/", replacement: path.resolve(here, "src") + "/" },
    ],
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
