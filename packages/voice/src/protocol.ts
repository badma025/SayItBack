import type { Device } from "./whisperCore";

export type WorkerRequest =
  | { type: "load"; model?: string }
  | { type: "transcribe"; id: number; audio: Float32Array };

export type WorkerResponse =
  | { type: "progress"; fraction: number }
  | { type: "ready"; model: string; device: Device }
  | { type: "result"; id: number; text: string }
  | { type: "error"; id?: number; message: string };
