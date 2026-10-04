import { defineConfig } from "vite";

export default defineConfig({
  root: import.meta.dirname,
  // transformers.js ships its own onnxruntime-web; pre-bundling breaks its wasm lookups.
  optimizeDeps: { exclude: ["@huggingface/transformers"] },
  server: { port: 5199, strictPort: true },
});
