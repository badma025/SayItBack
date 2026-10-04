"use client";

import React from "react";
import { Stethoscope, Printer, HelpCircle, ShieldCheck, ChevronDown } from "lucide-react";
import { SEEDED_LETTERS, type DischargeLetter } from "../lib/letters";

interface HeaderProps {
  currentLetter: DischargeLetter;
  onSelectLetter: (letter: DischargeLetter) => void;
  onOpenTour: () => void;
  onPrint: () => void;
}

export function Header({
  currentLetter,
  onSelectLetter,
  onOpenTour,
  onPrint,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm no-print">
      {/* Top NHS Bar */}
      <div className="bg-[#005EB8] text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#005EB8] font-black px-2 py-0.5 tracking-tight rounded-sm text-xs">
              NHS
            </span>
            <span className="font-semibold tracking-wide">
              Thamesbank Hospitals Trust (fictional) · ForgeHacks 2026 (AI + Healthcare)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-blue-700/60 px-2 py-0.5 rounded text-blue-100 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>No login · Zero keys · Deterministic comparator</span>
            </span>
            <button
              onClick={onOpenTour}
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 transition-colors px-2.5 py-1 rounded text-white font-medium text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>60s Judge Tour &amp; Rubric</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#005EB8]/10 text-[#005EB8] flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Say It Back
              </h1>
              <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Live Bedside Demo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
              Carer explains the discharge letter back by voice. The AI listens and checks. It never adds advice.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Letter Dropdown */}
          <div className="relative inline-block text-left">
            <label htmlFor="letter-select" className="sr-only">
              Select Patient Letter
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 mr-2 font-medium">Letter:</span>
              <select
                id="letter-select"
                value={currentLetter.letter_id}
                onChange={(e) => {
                  const selected = SEEDED_LETTERS[e.target.value];
                  if (selected) onSelectLetter(selected);
                }}
                className="bg-transparent text-xs font-semibold text-gray-900 focus:outline-none cursor-pointer pr-4"
              >
                <option value="kwame_letter_1_cardiology">
                  Kwame (81) - Heart Failure (Furosemide 80mg)
                </option>
                <option value="kwame_letter_2_renal_titration">
                  Kwame (81) - Renal Titration
                </option>
                <option value="kwame_letter_3_ambulatory_frailty">
                  Kwame (81) - Ambulatory Frailty
                </option>
              </select>
            </div>
          </div>

          {/* Print Fridge Card */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition-colors"
            title="Print Large-Print Fridge Card and Ward Sign-Off Receipt"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </header>
  );
}
