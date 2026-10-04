import { biasTranscript, type Snap } from "./biasing";
import type { WorkerRequest, WorkerResponse } from "./protocol";
import type { Device } from "./whisperCore";

export type TranscriberStatus = "idle" | "loading" | "ready" | "transcribing" | "error";

export interface TranscriberState {
  status: TranscriberStatus;
  /** 0..1 model download progress while loading. */
  progress: number;
  model?: string;
  device?: Device;
  error?: string;
}

export interface Transcription {
  /** What Whisper heard, untouched. Kept so biasing can be ablated and audited. */
  raw: string;
  /** `raw` after drug-name snapping. This is what the user sees and may edit. */
  text: string;
  snaps: Snap[];
}

export interface Transcriber {
  getState(): TranscriberState;
  subscribe(fn: (s: TranscriberState) => void): () => void;
  /** Start downloading the model. Safe to call repeatedly. */
  load(): Promise<void>;
  transcribe(audio: Float32Array, letterDrugs: readonly string[]): Promise<Transcription>;
  dispose(): void;
}

export interface TranscriberOptions {
  model?: string;
  /** Override for tests or for bundlers that need a different Worker construction. */
  createWorker?: () => Worker;
}

export function createTranscriber(opts: TranscriberOptions = {}): Transcriber {
  let worker: Worker | null = null;
  let state: TranscriberState = { status: "idle", progress: 0 };
  let nextId = 1;
  let loadPromise: Promise<void> | null = null;
  const listeners = new Set<(s: TranscriberState) => void>();
  const pending = new Map<number, { resolve(text: string): void; reject(e: Error): void }>();
  let onReady: { resolve(): void; reject(e: Error): void } | null = null;

  const set = (patch: Partial<TranscriberState>) => {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  };

  const getWorker = (): Worker => {
    if (worker) return worker;
    worker =
      opts.createWorker?.() ??
      new Worker(new URL("./whisper.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      if (msg.type === "progress") {
        set({ progress: msg.fraction });
      } else if (msg.type === "ready") {
        set({ status: "ready", progress: 1, model: msg.model, device: msg.device });
        onReady?.resolve();
        onReady = null;
      } else if (msg.type === "result") {
        pending.get(msg.id)?.resolve(msg.text);
        pending.delete(msg.id);
      } else if (msg.type === "error") {
        const err = new Error(msg.message);
        if (msg.id !== undefined) {
          pending.get(msg.id)?.reject(err);
          pending.delete(msg.id);
          // A failed transcription leaves the model loaded and usable.
          set({ status: "ready" });
        } else {
          set({ status: "error", error: msg.message });
          onReady?.reject(err);
          onReady = null;
          loadPromise = null;
        }
      }
    };
    worker.onerror = (e) => {
      const err = new Error(e.message || "Speech model crashed");
      set({ status: "error", error: err.message });
      onReady?.reject(err);
      onReady = null;
      pending.forEach((p) => p.reject(err));
      pending.clear();
      loadPromise = null;
    };
    return worker;
  };

  const send = (msg: WorkerRequest, transfer: Transferable[] = []) =>
    getWorker().postMessage(msg, transfer);

  return {
    getState: () => state,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    load() {
      if (state.status === "ready") return Promise.resolve();
      if (!loadPromise) {
        set({ status: "loading", progress: 0, error: undefined });
        loadPromise = new Promise<void>((resolve, reject) => {
          onReady = { resolve, reject };
          try {
            send({ type: "load", model: opts.model });
          } catch (err) {
            set({ status: "error", error: String(err) });
            loadPromise = null;
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });
      }
      return loadPromise;
    },
    async transcribe(audio, letterDrugs) {
      await this.load();
      const id = nextId++;
      set({ status: "transcribing" });
      const raw = await new Promise<string>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        // Transfer, don't copy: a minute of audio is ~4 MB.
        send({ type: "transcribe", id, audio }, [audio.buffer]);
      });
      set({ status: "ready" });
      const { text, snaps } = biasTranscript(raw, letterDrugs);
      return { raw, text, snaps };
    },
    dispose() {
      worker?.terminate();
      worker = null;
      pending.forEach((p) => p.reject(new Error("Transcriber disposed")));
      pending.clear();
      listeners.clear();
      loadPromise = null;
    },
  };
}
