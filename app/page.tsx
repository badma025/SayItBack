"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Header } from "../components/Header";
import { LetterViewer } from "../components/LetterViewer";
import { TeachBackStation, JUDGE_SCENARIOS } from "../components/TeachBackStation";
import { ComparatorResults } from "../components/ComparatorResults";
import { ReteachPanel } from "../components/ReteachPanel";
import { UnderstandingReceipt } from "../components/UnderstandingReceipt";
import { JudgesTourModal } from "../components/JudgesTourModal";
import { DEFAULT_LETTER, type DischargeLetter } from "../lib/letters";
import { evaluateTeachBack } from "../lib/engine-bridge";
import { type Receipt, type ReteachStep } from "@sayitback/engine";
import { type ExtractedPdfDocument } from "../lib/pdf-parser";
import { CheckCircle2, RotateCcw, AlertCircle, FileCheck2, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState<DischargeLetter>(DEFAULT_LETTER);
  const [transcript, setTranscript] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reteachSteps, setReteachSteps] = useState<ReteachStep[]>([]);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [pdfGroundTruthText, setPdfGroundTruthText] = useState<string>("");
  const [activeRightTab, setActiveRightTab] = useState<"teachback" | "receipt">("teachback");

  // Handle PDF text extraction
  const handlePdfTextExtracted = useCallback((extracted: ExtractedPdfDocument) => {
    setPdfGroundTruthText(extracted.fullText);
  }, []);

  // Run evaluation on transcript
  const handleEvaluate = useCallback(
    (textToEvaluate: string) => {
      if (!textToEvaluate.trim()) return;

      setIsEvaluating(true);
      try {
        const result = evaluateTeachBack(
          currentLetter,
          textToEvaluate,
          true,
          pdfGroundTruthText
        );
        setReceipt(result.receipt);
        setReteachSteps(result.reteachSteps);

        // Highlight gap in letter viewer if dose mismatch
        const hasDoseMismatch = result.receipt.items.some((i) =>
          i.slots.some((s) => s.slot === "dose" && s.verdict === "mismatch")
        );
        if (hasDoseMismatch) {
          setHighlightedItemId("dose-gap");
        } else {
          setHighlightedItemId(null);
        }

        // Confetti celebration if 100% confirmed!
        if (
          result.receipt.summary.total > 0 &&
          result.receipt.summary.confirmed === result.receipt.summary.total
        ) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error("Evaluation error:", err);
      } finally {
        setIsEvaluating(false);
      }
    },
    [currentLetter, pdfGroundTruthText]
  );

  // Handle scenario selection from quick buttons
  const handleScenarioSelect = (scenario: (typeof JUDGE_SCENARIOS)[0]) => {
    setTranscript(scenario.text);
    handleEvaluate(scenario.text);
  };

  // Re-teach second pass correction
  const handleApplyCorrection = (correctionText: string) => {
    setTranscript(correctionText);
    handleEvaluate(correctionText);
  };

  // Reset demo
  const handleReset = () => {
    setTranscript("");
    setReceipt(null);
    setReteachSteps([]);
    setHighlightedItemId(null);
    setActiveRightTab("teachback");
  };

  // Print receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F5]">
      {/* Top Header */}
      <Header
        currentLetter={currentLetter}
        onSelectLetter={(letter) => {
          setCurrentLetter(letter);
          handleReset();
        }}
        onOpenTour={() => setIsTourOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Bedside Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (5 Cols on large screen): Discharge Letter Viewer */}
        <section className="lg:col-span-6 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Patient Document (Ground-Truth Source)
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Albert Ward Discharge
            </span>
          </div>

          <div className="flex-1">
            <LetterViewer
              letter={currentLetter}
              highlightedItemId={highlightedItemId}
              onPdfTextExtracted={handlePdfTextExtracted}
            />
          </div>
        </section>

        {/* Right Column (6 Cols on large screen): Teach-Back Station & Comparator */}
        <section className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between no-print">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveRightTab("teachback")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeRightTab === "teachback"
                    ? "bg-[#005EB8] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                1. Voice Teach-Back &amp; Checker
              </button>
              <button
                onClick={() => setActiveRightTab("receipt")}
                disabled={!receipt}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeRightTab === "receipt"
                    ? "bg-[#005EB8] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                2. Understanding Receipt {receipt && `(${receipt.summary.confirmed}/${receipt.summary.total})`}
              </button>
            </div>

            {receipt && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors"
                title="Reset teach-back evaluation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}
          </div>

          {activeRightTab === "receipt" && receipt ? (
            <div className="space-y-4">
              <UnderstandingReceipt
                receipt={receipt}
                letter={currentLetter}
                onPrint={handlePrint}
              />
              <div className="flex justify-end no-print">
                <button
                  onClick={() => setActiveRightTab("teachback")}
                  className="text-xs font-bold text-[#005EB8] hover:underline"
                >
                  ← Back to Teach-Back Station
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Teach-Back Input Box */}
              <TeachBackStation
                transcript={transcript}
                onTranscriptChange={setTranscript}
                onSubmit={handleEvaluate}
                onScenarioSelect={handleScenarioSelect}
                isEvaluating={isEvaluating}
              />

              {/* Live Comparator Results */}
              {receipt && (
                <>
                  <ComparatorResults
                    receipt={receipt}
                    onSelectGap={(id) => setHighlightedItemId(id)}
                  />

                  {/* Re-teaching Panel (Only Gaps) */}
                  <ReteachPanel
                    steps={reteachSteps}
                    onApplyCorrection={handleApplyCorrection}
                  />

                  {/* Jump to receipt CTA */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-2xs">
                    <div className="text-xs text-gray-700">
                      <span className="font-bold">Next Step: </span>
                      {receipt.summary.confirmed === receipt.summary.total
                        ? "All items matched! Sign off the receipt before leaving the ward."
                        : "Review questions to ask ward staff on the Understanding Receipt."}
                    </div>
                    <button
                      onClick={() => setActiveRightTab("receipt")}
                      className="inline-flex items-center gap-1 bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                    >
                      <span>View Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-xs text-gray-500 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Say It Back · Built for ForgeHacks 2026 (AI + Healthcare Track) · Guy&apos;s &amp; St Thomas&apos; NHS Trust
          </span>
          <span className="font-mono text-gray-400">
            Next.js 14 · pdf.js v3.11 · Deterministic Comparator
          </span>
        </div>
      </footer>

      {/* 60-Second Judges Tour Modal */}
      <JudgesTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </div>
  );
}
