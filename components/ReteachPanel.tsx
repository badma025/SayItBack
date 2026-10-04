"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { type ReteachStep } from "@sayitback/engine";
import { slotName } from "../lib/status";

interface ReteachPanelProps {
  steps: ReteachStep[];
  onTryAgain: () => void;
  onUseExampleCorrection: (text: string) => void;
}

// Demo shortcut: the corrected answer Kwame gives after hearing the letter's words.
const EXAMPLE_CORRECTION =
  "The water tablet furosemide was increased to 80 milligrams once daily in the morning.";

export function ReteachPanel({ steps, onTryAgain, onUseExampleCorrection }: ReteachPanelProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-ok-line bg-ok-soft px-4 py-3.5">
        <p className="font-bold text-ok">Nothing to go over again</p>
        <p className="mt-1 text-sm text-muted">
          What Kwame said matches the letter. A nurse still signs the receipt before he leaves.
        </p>
      </div>
    );
  }

  const speak = (step: ReteachStep) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(step.quote);
    u.lang = "en-GB";
    u.rate = 0.92;
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    setSpeakingId(step.itemId);
    window.speechSynthesis.speak(u);
  };

  const hasMedicineGap = steps.some((s) => s.itemId.startsWith("med-change"));

  return (
    <section aria-labelledby="reteach-title" className="space-y-4">
      <div>
        <h2 id="reteach-title" className="font-serif text-2xl font-semibold">
          Go over {steps.length === 1 ? "this part" : `these ${steps.length} parts`} again
        </h2>
        <p className="mt-1 text-muted">
          Read the letter&apos;s own words to Kwame. Nothing is added or reworded.
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((step) => (
          <li key={step.itemId} className="rounded-lg border border-line bg-paper px-4 py-4">
            <p className="text-sm font-bold text-muted">
              Missing: {step.gaps.map((g) => slotName(g)).join(", ")}
            </p>
            <blockquote className="mt-2 border-l-2 border-ink/70 pl-3 font-serif text-[1.08rem] leading-relaxed">
              {step.quote}
            </blockquote>
            <button
              onClick={() => speak(step)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent underline-offset-4 hover:underline"
            >
              <Volume2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {speakingId === step.itemId ? "Reading aloud…" : "Read it aloud"}
            </button>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button onClick={onTryAgain} className="btn-quiet">
          Ask him to say it again
        </button>
        {hasMedicineGap && (
          <button
            onClick={() => onUseExampleCorrection(EXAMPLE_CORRECTION)}
            className="text-sm font-bold text-muted underline underline-offset-4 hover:text-ink"
          >
            Use the example second attempt
          </button>
        )}
      </div>
    </section>
  );
}
