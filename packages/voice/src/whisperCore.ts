/**
 * Whisper via transformers.js. Environment-agnostic: the browser worker and the
 * Node eval script both call this, so what we measure is what ships.
 */
import { pipeline, type AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers";

// pipeline()'s overload union is too large for tsc to resolve; pin the one signature we use.
const createAsr = pipeline as unknown as (
  task: "automatic-speech-recognition",
  model: string,
  options: Record<string, unknown>,
) => Promise<AutomaticSpeechRecognitionPipeline>;

/** English-only base: noticeably better than tiny on older voices, ~80 MB quantised. */
export const DEFAULT_MODEL = "onnx-community/whisper-base.en";
/** Known-good quantised fallback if the default fails to load. */
export const FALLBACK_MODEL = "Xenova/whisper-tiny.en";

export const SAMPLE_RATE = 16_000;

export type Device = "webgpu" | "wasm" | "cpu";

export interface LoadProgress {
  /** 0..1 across all files being fetched. */
  fraction: number;
  file?: string;
}

export interface LoadedWhisper {
  run(audio: Float32Array): Promise<string>;
  model: string;
  device: Device;
}

export interface LoadOptions {
  model?: string;
  device?: Device;
  onProgress?: (p: LoadProgress) => void;
}

type ProgressEvent = { status: string; file?: string; loaded?: number; total?: number };

/**
 * Aggregates per-file download progress into one 0..1 fraction. Files are discovered as
 * loading proceeds (small configs finish before the big model files are even listed), so
 * the raw ratio can fall; we report the running maximum so a progress bar never rewinds.
 */
function progressTracker(cb?: (p: LoadProgress) => void) {
  const files = new Map<string, { loaded: number; total: number }>();
  let shown = 0;
  return (e: ProgressEvent) => {
    if (!cb || !e.file) return;
    if (e.status === "progress" && e.total) {
      files.set(e.file, { loaded: e.loaded ?? 0, total: e.total });
    } else if (e.status === "done") {
      const f = files.get(e.file);
      if (f) files.set(e.file, { loaded: f.total, total: f.total });
    } else {
      return;
    }
    let loaded = 0;
    let total = 0;
    for (const f of files.values()) {
      loaded += f.loaded;
      total += f.total;
    }
    shown = Math.max(shown, total ? Math.min(1, loaded / total) : 0);
    cb({ fraction: shown, file: e.file });
  };
}

export async function loadWhisper(opts: LoadOptions = {}): Promise<LoadedWhisper> {
  const device: Device = opts.device ?? "wasm";
  const candidates = opts.model ? [opts.model] : [DEFAULT_MODEL, FALLBACK_MODEL];
  let lastError: unknown;
  for (const model of candidates) {
    try {
      const asr: AutomaticSpeechRecognitionPipeline = await createAsr("automatic-speech-recognition", model, {
        device,
        // Quantised encoder/decoder: fp32 whisper-base is ~290 MB, too much for a bedside phone.
        dtype: device === "webgpu" ? { encoder_model: "fp32", decoder_model_merged: "q4" } : "q8",
        progress_callback: progressTracker(opts.onProgress),
      });
      return {
        model,
        device,
        async run(audio) {
          const out = await asr(audio, {
            // Teach-back answers can run past Whisper's 30 s window.
            chunk_length_s: 30,
            stride_length_s: 5,
          });
          const r = Array.isArray(out) ? out[0] : out;
          return r.text.trim();
        },
      };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
