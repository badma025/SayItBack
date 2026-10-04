"use client";

import React, { useState } from "react";
import { Volume2, RefreshCw, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { type ReteachStep } from "@sayitback/engine";

interface ReteachPanelProps {
  steps: ReteachStep[];
  onApplyCorrection: (text: string) => void;
}

export function ReteachPanel({ steps, onApplyCorrection }: ReteachPanelProps) {
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-lg p-5 text-center shadow-xs">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-emerald-950">
          All Critical Gaps Confirmed!
        </h3>
        <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
          Kwame&apos;s spoken explanation matches all critical slots in the discharge letter. The understanding receipt is ready for nurse sign-off.
        </p>
      </div>
    );
  }

  const handleSpeak = (text: string, idx: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white border-2 border-red-300 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-600" />
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Targeted Re-Teaching ({steps.length} {steps.length === 1 ? "Gap" : "Gaps"} Remaining)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            The AI re-explains ONLY the gaps using ONLY verbatim quotes from the letter.
          </p>
        </div>
        <span className="text-[11px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded uppercase">
          Quote-Only
        </span>
      </div>

      {/* Reteach Steps List */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={step.itemId}
            className="bg-red-50/50 border border-red-200 rounded-lg p-3.5 space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-red-950 uppercase tracking-wide text-[11px]">
                Gap #{idx + 1}: {step.gaps.join(", ")}
              </span>
              <button
                onClick={() => handleSpeak(step.quote, idx)}
                className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
                title="Read quote aloud using browser text-to-speech"
              >
                <Volume2 className={`w-3.5 h-3.5 ${speakingIdx === idx ? "text-blue-600 animate-pulse" : ""}`} />
                <span>{speakingIdx === idx ? "Reading..." : "Read Quote Aloud"}</span>
              </button>
            </div>

            {/* Verbatim Quote Display */}
            <div className="bg-white border border-red-200 rounded p-3 text-gray-800 font-mono text-[11px] leading-relaxed shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-red-700 mb-1 font-sans">
                Exact Letter Quote:
              </div>
              &ldquo;{step.quote}&rdquo;
            </div>

            {/* One-click correct second pass button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  if (step.itemId.includes("med")) {
                    onApplyCorrection(
                      "The water tablet furosemide was increased to 80 milligrams once daily in the morning."
                    );
                  } else {
                    onApplyCorrection(
                      "I understand the letter quote: " + step.quote.slice(0, 80)
                    );
                  }
                }}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-md text-xs shadow-xs transition-colors"
              >
                <span>Try Second-Pass Teach-Back</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
