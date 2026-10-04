/// <reference lib="webworker" />
/**
 * Runs Whisper off the main thread so the UI never freezes while loading or decoding.
 * Audio never leaves the device: the model is fetched once (then cached by the
 * browser) and inference happens locally.
 */
import { loadWhisper, type Device, type LoadedWhisper } from "./whisperCore";
import type { WorkerRequest, WorkerResponse } from "./protocol";

let loaded: Promise<LoadedWhisper> | null = null;

function post(msg: WorkerResponse) {
  (self as DedicatedWorkerGlobalScope).postMessage(msg);
}

async function pickDevice(): Promise<Device> {
  const gpu = (self.navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
  if (!gpu) return "wasm";
  try {
    return (await gpu.requestAdapter()) ? "webgpu" : "wasm";
  } catch {
    return "wasm";
  }
}

function ensureLoaded(model?: string): Promise<LoadedWhisper> {
  if (!loaded) {
    loaded = (async () => {
      const device = await pickDevice();
      try {
        return await loadWhisper({
          model,
          device,
          onProgress: (p) => post({ type: "progress", fraction: p.fraction }),
        });
      } catch (err) {
        if (device === "wasm") throw err;
        // WebGPU adapters exist on machines where the shader compile still fails.
        return loadWhisper({
          model,
          device: "wasm",
          onProgress: (p) => post({ type: "progress", fraction: p.fraction }),
        });
      }
    })();
    loaded.catch(() => {
      loaded = null; // allow a retry after a failed (e.g. offline) load
    });
  }
  return loaded;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      const w = await ensureLoaded(msg.model);
      post({ type: "ready", model: w.model, device: w.device });
    } else if (msg.type === "transcribe") {
      const w = await ensureLoaded();
      const text = await w.run(msg.audio);
      post({ type: "result", id: msg.id, text });
    }
  } catch (err) {
    post({
      type: "error",
      id: msg.type === "transcribe" ? msg.id : undefined,
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
