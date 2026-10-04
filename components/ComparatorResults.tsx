"use client";

import React from "react";
import { type Receipt } from "@sayitback/engine";
import { itemStatus, KIND_TITLE, sectionIdFor, TONE_DOT, TONE_TEXT } from "../lib/status";

interface ComparatorResultsProps {
  receipt: Receipt;
}

export function ComparatorResults({ receipt }: ComparatorResultsProps) {
  const { items, summary, questionsForPharmacist } = receipt;
  const allConfirmed = summary.total > 0 && summary.confirmed === summary.total;

  return (
    <section aria-labelledby="results-title" className="space-y-4" aria-live="polite">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="results-title" className="font-serif text-2xl font-semibold">
          {allConfirmed
            ? "Everything matches the letter"
            : `${summary.confirmed} of ${summary.total} said back correctly`}
        </h2>
        <p className="text-sm text-muted">Marked beside each line in the letter</p>
      </div>

      {/* One segment per item, in letter order */}
      <div className="flex gap-1" aria-hidden>
        {items.map((item) => (
          <span
            key={item.itemId}
            className={`h-1.5 flex-1 rounded-full ${TONE_DOT[itemStatus(item).tone]}`}
          />
        ))}
      </div>

      <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
        {items.map((item) => {
          const status = itemStatus(item);
          return (
            <li key={item.itemId}>
              <a
                href={`#${sectionIdFor(item)}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 transition hover:bg-ground/60"
              >
                <span className="font-bold">{KIND_TITLE[item.kind]}</span>
                <span className={`flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold ${TONE_TEXT[status.tone]}`}>
                  <span className={`h-2 w-2 rounded-full ${TONE_DOT[status.tone]}`} aria-hidden />
                  {status.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {questionsForPharmacist.length > 0 && (
        <div className="rounded-lg border border-warn-line bg-warn-soft px-4 py-3.5">
          <p className="font-bold text-warn">For the pharmacist, not for this app</p>
          <p className="mt-1 text-sm text-muted">
            Say it back doesn&apos;t answer medical questions. These go on the receipt for the ward
            pharmacist:
          </p>
          <ul className="mt-2 space-y-1">
            {questionsForPharmacist.map((q) => (
              <li key={q.id} className="font-serif italic">
                &ldquo;{q.utterance}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
