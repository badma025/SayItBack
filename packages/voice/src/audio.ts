import { SAMPLE_RATE } from "./whisperCore";

export type MicProblem = "unsupported" | "denied" | "no-device" | "failed";

export class MicError extends Error {
  constructor(
    public readonly kind: MicProblem,
    message: string,
  ) {
    super(message);
  }
}

export function isMicSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

export interface Recording {
  /** Stop and resolve with 16 kHz mono PCM, ready for Whisper. */
  stop(): Promise<Float32Array>;
  /** Stop and discard, releasing the mic. */
  cancel(): void;
}

function micError(err: unknown): MicError {
  const name = (err as { name?: string })?.name;
  if (name === "NotAllowedError" || name === "SecurityError") {
    return new MicError("denied", "Microphone permission was blocked.");
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return new MicError("no-device", "No microphone was found.");
  }
  return new MicError("failed", err instanceof Error ? err.message : "Could not start the microphone.");
}

export async function startRecording(): Promise<Recording> {
  if (!isMicSupported()) throw new MicError("unsupported", "This browser cannot record audio.");

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
  } catch (err) {
    throw micError(err);
  }

  // No mimeType: let each browser pick (webm/opus on Chrome and Firefox, mp4 on Safari).
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  const release = () => stream.getTracks().forEach((t) => t.stop());
  recorder.start();

  const finished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
  });

  return {
    async stop() {
      if (recorder.state !== "inactive") recorder.stop();
      const blob = await finished;
      release();
      return decodeTo16kMono(blob);
    },
    cancel() {
      recorder.ondataavailable = null;
      if (recorder.state !== "inactive") recorder.stop();
      release();
    },
  };
}

/** Decode any browser-recordable container, downmix to mono and resample to 16 kHz. */
export async function decodeTo16kMono(blob: Blob): Promise<Float32Array> {
  const bytes = await blob.arrayBuffer();
  const ctx = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(bytes);
  } finally {
    void ctx.close();
  }
  const frames = Math.max(1, Math.ceil(decoded.duration * SAMPLE_RATE));
  // Rendering into a 1-channel context at the target rate makes the browser do both the
  // downmix and the resample.
  const offline = new OfflineAudioContext(1, frames, SAMPLE_RATE);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start();
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0);
}
