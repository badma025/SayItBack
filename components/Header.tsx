"use client";

import React from "react";
import { Printer } from "lucide-react";
import { SEEDED_LETTERS, type DischargeLetter } from "../lib/letters";

interface HeaderProps {
  currentLetter: DischargeLetter;
  onSelectLetter: (letter: DischargeLetter) => void;
  onPrint: () => void;
}

const LETTER_LABELS: Record<string, string> = {
  kwame_letter_1_cardiology: "Heart failure, water tablet doubled",
  kwame_letter_2_renal_titration: "Kidney check, dose adjusted",
  kwame_letter_3_ambulatory_frailty: "Virtual ward, frailty follow-up",
};

export function Header({ currentLetter, onSelectLetter, onPrint }: HeaderProps) {
  return (
    <header className="no-print">
      <p className="bg-ink px-4 py-2 text-center text-sm text-paper/80">
        Demo with a fictional patient and hospital. It checks recall against the letter and never
        gives medical advice.
      </p>

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-x-8 gap-y-4 px-4 pb-6 pt-7 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-[2.1rem] font-semibold leading-none tracking-[-0.02em]">
              Say it back
            </h1>
            <span className="hidden font-mono text-xs uppercase tracking-[0.14em] text-faint sm:inline">
              Discharge teach-back
            </span>
          </div>
          <p className="mt-2 max-w-[56ch] text-muted">
            Before Kwame leaves the ward, he explains his letter back in his own words. Anything he
            gets wrong is marked beside the line it came from.
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
          <label htmlFor="letter-select" className="label">
            Letter
          </label>
          <select
            id="letter-select"
            value={currentLetter.letter_id}
            onChange={(e) => {
              const selected = SEEDED_LETTERS[e.target.value];
              if (selected) onSelectLetter(selected);
            }}
            className="min-w-0 max-w-full flex-1 cursor-pointer truncate rounded-lg border border-line bg-paper px-3 py-2.5 text-sm font-bold text-ink transition hover:border-faint sm:flex-none"
          >
            {Object.keys(SEEDED_LETTERS).map((id) => (
              <option key={id} value={id}>
                Kwame Mensah, 81 · {LETTER_LABELS[id] ?? id}
              </option>
            ))}
          </select>
          <button onClick={onPrint} className="btn-quiet text-sm">
            <Printer className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Print receipt
          </button>
        </div>
      </div>
    </header>
  );
}
