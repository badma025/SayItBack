"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Edit3,
} from "lucide-react";

export interface JudgeScenario {
  id: string;
  title: string;
  badge: string;
  text: string;
  note: string;
}

interface TeachBackStationProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onSubmit: (text: string) => void;
  onScenarioSelect: (scenario: JudgeScenario) => void;
  isEvaluating: boolean;
}

export const JUDGE_SCENARIOS = [
  {
    id: "wow_moment",
    title: "1. The 15s Wow Moment (Conflicted Dose)",
    badge: "Rubric Wow",
    text: "I take the water tablet, once a day like before.",
    note: "Kwame recalls frequency (once a day) but misses that dose doubled from 40mg to 80mg. Watch frequency turn green while dose turns red!",
  },
  {
    id: "reteach_corrected",
    title: "2. Second Pass (Re-teach Dose)",
    badge: "Loop Complete",
    text: "The water tablet furosemide is increased to 80 milligrams once a day in the morning.",
    note: "Re-explains ONLY the missing gap using the letter's quote. Now both dose and frequency confirm green!",
  },
  {
    id: "full_carer",
    title: "3. Comprehensive Carer Teach-Back",
    badge: "All Slots",
    text: "Kwame takes furosemide 80mg every morning. If his weight jumps 2kg we ring 020 7188 5678, and we have a cardiology clinic in two weeks.",
    note: "Covers medication change, red flag threshold, nurse contact, and follow-up appointment.",
  },
  {
    id: "advice_question",
    title: "4. Safety Guardrail: Advice Question",
    badge: "Safety Gate",
    text: "Can he take ibuprofen for his knee pain while taking the water tablet?",
    note: "AI never prescribes or gives advice. Routes directly to 'Questions for your ward pharmacist'.",
  },
];

export function TeachBackStation({
  transcript,
  onTranscriptChange,
  onSubmit,
  onScenarioSelect,
  isEvaluating,
}: TeachBackStationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        onTranscriptChange(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscriptChange]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Bedside Teach-Back Station
            </h2>
            <span className="text-[11px] bg-blue-100 text-[#005EB8] px-2 py-0.5 rounded font-semibold">
              Voice or Typed
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Efua holds the phone. Kwame explains what he understands before leaving the ward.
          </p>
        </div>
      </div>

      {/* 1-Click Judge Quick Scenarios */}
      <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Judge 1-Click Test Scenarios (Try in 10s)</span>
          </span>
          <span className="text-[11px] text-gray-500">Click to run immediately</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {JUDGE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                onScenarioSelect(scenario);
                onSubmit(scenario.text);
              }}
              className="text-left p-2.5 rounded-md border border-gray-200 bg-white hover:border-[#005EB8] hover:bg-blue-50/50 transition-all text-xs group relative shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-gray-900 group-hover:text-[#005EB8] line-clamp-1">
                  {scenario.title}
                </span>
                <span className="text-[10px] bg-gray-100 group-hover:bg-blue-100 text-gray-700 group-hover:text-blue-800 px-1.5 py-0.2 rounded font-semibold flex-shrink-0">
                  {scenario.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 italic line-clamp-1 mb-1">
                &ldquo;{scenario.text}&rdquo;
              </p>
              <p className="text-[10px] text-gray-600 line-clamp-1">{scenario.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Transcript Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="transcript-input" className="font-bold text-gray-700 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-gray-500" />
            <span>Spoken Transcript (Editable by carer before grading)</span>
          </label>
          <div className="flex items-center gap-2">
            {transcript && (
              <button
                onClick={() => onTranscriptChange("")}
                className="text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 text-[11px]"
                title="Clear transcript"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
            <span className="text-[11px] text-gray-400">{transcript.length} chars</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="transcript-input"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            rows={4}
            placeholder="Kwame speaks or carer types: e.g. 'I take the water tablet, once a day like before...'"
            className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005EB8] focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none font-sans bg-white shadow-inner"
          />

          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
              <span>Listening to Kwame...</span>
            </div>
          )}
        </div>
      </div>

      {/* Microphone and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {speechSupported ? (
            <button
              onClick={toggleRecording}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs transition-all shadow-sm ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
              }`}
              title={isRecording ? "Stop Recording" : "Record Voice via Browser Mic"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#005EB8]" />}
              <span>{isRecording ? "Stop Recording" : "Speak (Microphone)"}</span>
            </button>
          ) : (
            <span className="text-xs text-gray-500 italic bg-gray-100 px-2 py-1 rounded">
              Mic not available in this browser. Type in the box above.
            </span>
          )}

          <span className="text-[11px] text-gray-500 hidden sm:inline">
            Audio stays in-browser · Zero external voice APIs
          </span>
        </div>

        <button
          onClick={() => onSubmit(transcript)}
          disabled={!transcript.trim() || isEvaluating}
          className="inline-flex items-center gap-2 bg-[#005EB8] hover:bg-[#004b93] text-white px-5 py-2 rounded-lg font-bold text-xs shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Check Understanding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
