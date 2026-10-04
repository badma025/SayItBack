import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const engineSrc = fileURLToPath(new URL("./packages/engine/src/", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@sayitback\/engine$/, replacement: `${engineSrc}index.ts` },
      { find: /^@sayitback\/engine\/(.*)$/, replacement: `${engineSrc}$1.ts` },
    ],
  },
  test: {
    include: ["lib/**/*.test.ts"],
  },
});
