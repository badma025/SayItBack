"use client";

import React, { useState, useCallback, useRef } from "react";
import { type Receipt, type ReteachStep } from "@sayitback/engine";
import { Header } from "../components/Header";
import { LetterViewer } from "../components/LetterViewer";
import { TeachBackStation, type JudgeScenario } from "../components/TeachBackStation";
import { ComparatorResults } from "../components/ComparatorResults";
import { ReteachPanel } from "../components/ReteachPanel";
import { UnderstandingReceipt } from "../components/UnderstandingReceipt";
import { DEFAULT_LETTER, type DischargeLetter } from "../lib/letters";
import { evaluateTeachBack } from "../lib/engine-bridge";
import { type ExtractedPdfDocument } from "../lib/pdf-parser";
import { sectionIdFor } from "../lib/status";

const REPO_URL = "https://github.com/badma025/SayItBack";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState<DischargeLetter>(DEFAULT_LETTER);
  const [transcript, setTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reteachSteps, setReteachSteps] = useState<ReteachStep[]>([]);
  const [pdfGroundTruthText, setPdfGroundTruthText] = useState("");
  const [documentView, setDocumentView] = useState<"letter" | "receipt">("letter");
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const handlePdfTextExtracted = useCallback((extracted: ExtractedPdfDocument) => {
    setPdfGroundTruthText(extracted.fullText);
  }, []);

  const handleEvaluate = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setIsEvaluating(true);
      setError(null);
      try {
        const result = evaluateTeachBack(currentLetter, text, true, pdfGroundTruthText);
        setReceipt(result.receipt);
        setReteachSteps(result.reteachSteps);
        setDocumentView("letter");
        // Bring the first line that needs attention into view: this is the moment that matters.
        const firstGap = result.receipt.items.find((i) => i.grade !== "confirmed");
        if (firstGap) {
          requestAnimationFrame(() =>
            document
              .getElementById(sectionIdFor(firstGap))
              ?.scrollIntoView({ behavior: "smooth", block: "center" }),
          );
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        setError("We couldn't check that answer. Try rephrasing it, or reload the page.");
      } finally {
        setIsEvaluating(false);
      }
    },
    [currentLetter, pdfGroundTruthText],
  );

  const handleScenarioSelect = (scenario: JudgeScenario) => {
    setActiveScenarioId(scenario.id);
    setTranscript(scenario.text);
    handleEvaluate(scenario.text);
  };

  const handleReset = () => {
    setTranscript("");
    setReceipt(null);
    setReteachSteps([]);
    setActiveScenarioId(null);
    setDocumentView("letter");
    setError(null);
  };

  const handleTryAgain = () => {
    setTranscript("");
    setActiveScenarioId(null);
    transcriptRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("transcript-input")?.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-screen">
      <Header
        currentLetter={currentLetter}
        onSelectLetter={(letter) => {
          setCurrentLetter(letter);
          handleReset();
        }}
        onPrint={() => {
          if (receipt) setDocumentView("receipt");
          setTimeout(() => window.print(), 50);
        }}
      />

      <main className="mx-auto grid max-w-[1320px] items-start gap-x-10 gap-y-10 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Teach-back: input, results, re-teach */}
        <div ref={transcriptRef} className="no-print space-y-10">
          <TeachBackStation
            transcript={transcript}
            onTranscriptChange={setTranscript}
            onSubmit={(t) => {
              setActiveScenarioId(null);
              handleEvaluate(t);
            }}
            onScenarioSelect={handleScenarioSelect}
            isEvaluating={isEvaluating}
            activeScenarioId={activeScenarioId}
          />

          {error && (
            <p role="alert" className="rounded-lg border border-bad-line bg-bad-soft px-4 py-3 text-bad">
              {error}
            </p>
          )}

          {receipt && (
            <>
              <ComparatorResults receipt={receipt} />
              <ReteachPanel
                steps={reteachSteps}
                onTryAgain={handleTryAgain}
                onUseExampleCorrection={(text) => {
                  setTranscript(text);
                  setActiveScenarioId("reteach_corrected");
                  handleEvaluate(text);
                }}
              />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
                <button onClick={() => setDocumentView("receipt")} className="btn-primary">
                  Open the handover receipt
                </button>
                <button
                  onClick={handleReset}
                  className="text-sm font-bold text-muted underline underline-offset-4 hover:text-ink"
                >
                  Start over
                </button>
              </div>
            </>
          )}
        </div>

        {/* The patient's own document, or the receipt it produces */}
        <div className="min-w-0 space-y-4">
          {receipt && (
            <div
              role="tablist"
              aria-label="Document"
              className="no-print flex gap-1 rounded-lg bg-line/60 p-1 text-sm sm:w-fit"
            >
              {(
                [
                  ["letter", "Discharge letter"],
                  ["receipt", "Handover receipt"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={documentView === key}
                  onClick={() => setDocumentView(key)}
                  className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 font-bold transition ${
                    documentView === key ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {documentView === "receipt" && receipt ? (
            <UnderstandingReceipt
              receipt={receipt}
              letter={currentLetter}
              onPrint={() => window.print()}
            />
          ) : (
            <LetterViewer
              letter={currentLetter}
              receipt={receipt}
              onPdfTextExtracted={handlePdfTextExtracted}
            />
          )}
        </div>
      </main>

      <footer className="no-print border-t border-line">
        <div className="mx-auto max-w-[1320px] px-4 py-8 text-sm text-muted sm:px-6">
          <details className="max-w-[68ch]">
            <summary className="cursor-pointer font-bold text-ink">How this demo works</summary>
            <div className="mt-3 space-y-2">
              <p>
                The letter is a fictional discharge summary. When Kwame&apos;s words are checked,
                code compares each medicine, dose, warning sign and appointment with the exact
                wording of the letter. An item is marked correct only when it matches. Anything
                missing, unclear or different is gone over again.
              </p>
              <p>
                It never answers medical questions or adds advice. Those questions go to the
                pharmacist, and a nurse signs the receipt.
              </p>
              <p>
                Built for ForgeHacks 2026, AI + Healthcare track.{" "}
                <a href={REPO_URL} className="font-bold text-accent underline underline-offset-4">
                  Source and evaluation on GitHub
                </a>
                .
              </p>
            </div>
          </details>
        </div>
      </footer>
    </div>
  );
}
