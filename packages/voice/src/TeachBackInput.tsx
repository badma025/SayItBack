"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isMicSupported, MicError, startRecording, type Recording } from "./audio";
import type { Snap } from "./biasing";
import { createTranscriber, type Transcriber, type TranscriberState } from "./transcriber";

export interface TeachBackSubmission {
  /** Final text, after any edits. This is what gets graded. */
  text: string;
  source: "voice" | "typed";
  /** True if the user changed the transcript after the mic produced it. */
  edited: boolean;
  /** Raw Whisper output, when the text came from the mic. */
  raw?: string;
  snaps: Snap[];
}

export interface TeachBackInputProps {
  /** Drug names found in the letter. Whisper output is snapped to these. */
  letterDrugs: readonly string[];
  onSubmit(result: TeachBackSubmission): void;
  /** Download the speech model as soon as the component mounts. Default true. */
  preload?: boolean;
  /** Share one transcriber (and one model download) across screens. */
  transcriber?: Transcriber;
  submitLabel?: string;
}

type Phase = "idle" | "starting" | "recording" | "transcribing";

const MIC_MESSAGES: Record<MicError["kind"], string> = {
  unsupported: "This browser can't record audio. Type what you remember instead.",
  denied: "Microphone access is blocked. Allow it in your browser settings, or type instead.",
  "no-device": "No microphone found. Type what you remember instead.",
  failed: "The microphone didn't start. Type what you remember instead.",
};

export function TeachBackInput({
  letterDrugs,
  onSubmit,
  preload = true,
  transcriber: shared,
  submitLabel = "Check my explanation",
}: TeachBackInputProps) {
  const own = useRef<Transcriber | null>(null);
  const transcriber = useMemo(() => {
    if (shared) return shared;
    own.current ??= createTranscriber();
    return own.current;
  }, [shared]);

  const [model, setModel] = useState<TranscriberState>(transcriber.getState());
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState("");
  const [fromMic, setFromMic] = useState<{ raw: string; text: string; snaps: Snap[] } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const recording = useRef<Recording | null>(null);

  const micOk = useMemo(() => isMicSupported(), []);

  useEffect(() => transcriber.subscribe(setModel), [transcriber]);

  useEffect(() => {
    if (preload && micOk) transcriber.load().catch(() => {}); // failure surfaces via model.error
  }, [preload, micOk, transcriber]);

  useEffect(
    () => () => {
      recording.current?.cancel();
      if (!shared) own.current?.dispose();
    },
    [shared],
  );

  const start = useCallback(async () => {
    setNotice(null);
    setPhase("starting");
    try {
      recording.current = await startRecording();
      setPhase("recording");
    } catch (err) {
      setPhase("idle");
      setNotice(MIC_MESSAGES[err instanceof MicError ? err.kind : "failed"]);
    }
  }, []);

  const stop = useCallback(async () => {
    const rec = recording.current;
    if (!rec) return;
    recording.current = null;
    setPhase("transcribing");
    try {
      const audio = await rec.stop();
      const result = await transcriber.transcribe(audio, letterDrugs);
      // Accumulate, so a second recording adds to the first instead of wiping it or any edits.
      setFromMic((prev) => ({
        raw: [prev?.raw, result.raw].filter(Boolean).join(" "),
        text: [prev?.text, result.text].filter(Boolean).join(" "),
        snaps: [...(prev?.snaps ?? []), ...result.snaps],
      }));
      setText((prev) => (prev.trim() ? `${prev.trimEnd()} ${result.text}` : result.text));
      if (!result.text) setNotice("We didn't catch anything. Try again, or type it.");
    } catch {
      setNotice("Couldn't turn that into text. Type what you remember instead.");
    } finally {
      setPhase("idle");
    }
  }, [transcriber, letterDrugs]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit({
      text: trimmed,
      source: fromMic ? "voice" : "typed",
      edited: fromMic ? trimmed !== fromMic.text.trim() : false,
      raw: fromMic?.raw,
      snaps: fromMic?.snaps ?? [],
    });
  };

  const busy = phase === "starting" || phase === "transcribing";
  const modelLoading = model.status === "loading";
  const modelFailed = model.status === "error";

  return (
    <section aria-label="Explain it back">
      {micOk && !modelFailed && (
        <div>
          <button
            type="button"
            onClick={phase === "recording" ? stop : start}
            disabled={busy}
            aria-pressed={phase === "recording"}
          >
            {phase === "recording" ? "Stop" : phase === "transcribing" ? "Working…" : "Tap and explain"}
          </button>
          <p role="status" aria-live="polite">
            {phase === "recording" && "Listening… tap Stop when you've finished."}
            {phase === "transcribing" && "Turning your voice into text on this device…"}
            {phase === "idle" &&
              modelLoading &&
              `Getting the speech model ready (${Math.round(model.progress * 100)}%). You can type meanwhile.`}
          </p>
        </div>
      )}

      {(!micOk || modelFailed) && (
        <p role="status">
          {modelFailed
            ? "Voice isn't available right now (the speech model couldn't load). Please type what you remember."
            : MIC_MESSAGES.unsupported}
        </p>
      )}

      {notice && <p role="alert">{notice}</p>}

      <label>
        What did the letter say? Check the words below, and fix anything that's wrong.
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Or type it here"
        />
      </label>

      {fromMic && fromMic.snaps.length > 0 && (
        <details>
          <summary>
            {fromMic.snaps.length} medicine name{fromMic.snaps.length > 1 ? "s" : ""} adjusted to match the
            letter
          </summary>
          <ul>
            {fromMic.snaps.map((s, i) => (
              <li key={i}>
                heard “{s.from}” → {s.to}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setText(fromMic.raw)}>
            Use exactly what the microphone heard
          </button>
        </details>
      )}

      <button type="button" onClick={submit} disabled={!text.trim() || phase === "recording" || busy}>
        {submitLabel}
      </button>
    </section>
  );
}
