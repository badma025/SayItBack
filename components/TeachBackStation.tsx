"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, ArrowRight } from "lucide-react";

export interface JudgeScenario {
  id: string;
  title: string;
  text: string;
  note: string;
}

interface TeachBackStationProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onSubmit: (text: string) => void;
  onScenarioSelect: (scenario: JudgeScenario) => void;
  isEvaluating: boolean;
  activeScenarioId: string | null;
}

export const JUDGE_SCENARIOS: JudgeScenario[] = [
  {
    id: "wow_moment",
    title: "Gets the dose wrong",
    text: "I take the water tablet, once a day like before.",
    note: "How often is right. The dose doubled, and he missed it.",
  },
  {
    id: "reteach_corrected",
    title: "Corrects it",
    text: "The water tablet furosemide is increased to 80 milligrams once a day in the morning.",
    note: "Second attempt after hearing the letter's own words.",
  },
  {
    id: "full_carer",
    title: "Carer covers everything",
    text: "Kwame takes furosemide 80mg every morning. If his weight jumps 2kg we ring 020 7946 0678, and we have a cardiology clinic in two weeks.",
    note: "Medicine, warning sign, who to call and follow-up.",
  },
  {
    id: "advice_question",
    title: "Asks for advice",
    text: "Can he take ibuprofen for his knee pain while taking the water tablet?",
    note: "It never answers. The question goes to the pharmacist.",
  },
];

export function TeachBackStation({
  transcript,
  onTranscriptChange,
  onSubmit,
  onScenarioSelect,
  isEvaluating,
  activeScenarioId,
}: TeachBackStationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";
    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      onTranscriptChange(text.trim());
    };
    recognition.onerror = (event: any) => {
      setMicError(
        event.error === "not-allowed"
          ? "Microphone access was blocked. Allow it in the browser, or type instead."
          : "The microphone stopped. Try again, or type instead.",
      );
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
  }, [onTranscriptChange]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    setMicError(null);
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {
      setMicError("The microphone couldn't start. Type instead.");
    }
  };

  return (
    <section id="teach-back" aria-labelledby="teach-back-title" className="space-y-6">
      <div>
        <h2 id="teach-back-title" className="font-serif text-[1.75rem] font-semibold leading-tight">
          Ask Kwame to say it back
        </h2>
        <p className="mt-1.5 text-muted">
          In his own words: what changed, what to watch for, who to call, and when he&apos;s next
          seen. Efua can type or correct what he said.
        </p>
      </div>

      <div>
        <p className="label mb-2">Try an example</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {JUDGE_SCENARIOS.map((s) => {
            const active = activeScenarioId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onScenarioSelect(s)}
                aria-pressed={active}
                className={`group rounded-lg border px-3.5 py-2.5 text-left transition duration-200 active:translate-y-px ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-paper hover:border-faint"
                }`}
              >
                <span className="block font-bold">{s.title}</span>
                <span className="block text-sm text-muted">{s.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="transcript-input" className="label mb-2 block">
          What Kwame said
        </label>
        <div
          className={`rounded-lg border bg-paper transition focus-within:border-accent ${
            isRecording ? "border-bad" : "border-line"
          }`}
        >
          <textarea
            id="transcript-input"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            rows={4}
            placeholder="“I take the water tablet once a day, like before…”"
            className="block w-full resize-none rounded-t-lg bg-transparent px-4 pt-3.5 text-lg leading-relaxed outline-none placeholder:text-faint"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-2.5">
            {speechSupported ? (
              <button
                onClick={toggleRecording}
                className={`btn px-3.5 py-2 text-sm ${
                  isRecording
                    ? "bg-bad text-paper hover:bg-bad/90"
                    : "border border-line bg-ground text-ink hover:border-faint"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
                    Stop listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    Speak
                  </>
                )}
              </button>
            ) : (
              <span className="text-sm text-muted">Voice isn&apos;t available in this browser.</span>
            )}
            {transcript && !isRecording && (
              <button
                onClick={() => onTranscriptChange("")}
                className="text-sm font-bold text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-faint">
          {micError ??
            "Voice uses your browser's speech service, which in Chrome sends audio to Google. Typing works too."}
        </p>
      </div>

      <button
        onClick={() => onSubmit(transcript)}
        disabled={!transcript.trim() || isEvaluating}
        className="btn-primary w-full text-lg sm:w-auto"
      >
        {isEvaluating ? "Reading what Kwame said…" : "Check against the letter"}
        <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </section>
  );
}
