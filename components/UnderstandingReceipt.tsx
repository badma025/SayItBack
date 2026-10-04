"use client";

import React, { useState } from "react";
import { Printer } from "lucide-react";
import { type Receipt } from "@sayitback/engine";
import { type DischargeLetter } from "../lib/letters";
import { itemStatus, KIND_TITLE, TONE_DOT, TONE_TEXT } from "../lib/status";

interface UnderstandingReceiptProps {
  receipt: Receipt;
  letter: DischargeLetter;
  onPrint: () => void;
}

export function UnderstandingReceipt({ receipt, letter, onPrint }: UnderstandingReceiptProps) {
  const [nurseName, setNurseName] = useState("");
  const [signed, setSigned] = useState(false);
  const unresolved = receipt.items.filter((i) => i.grade !== "confirmed");
  const canSign = nurseName.trim().length > 1;

  return (
    <article className="print-page overflow-hidden rounded-sheet border border-line bg-paper shadow-sheet">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/80 px-6 pb-5 pt-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
            {letter.hospital} · {letter.ward}
          </p>
          <h2 className="mt-1 font-serif text-[1.9rem] font-semibold leading-tight">
            Understanding receipt
          </h2>
          <p className="mt-1 text-muted">
            What {letter.patient_name.split(" ")[0]} said back before leaving, checked against his
            discharge letter.
          </p>
        </div>
        <button onClick={onPrint} className="btn-quiet no-print text-sm">
          <Printer className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Print large-print copy
        </button>
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-line px-6 py-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.1em] text-faint">Patient</dt>
          <dd className="font-bold">{letter.patient_name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.1em] text-faint">NHS number (test)</dt>
          <dd className="font-mono">{letter.nhs_number}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.1em] text-faint">Carer</dt>
          <dd className="font-bold">{letter.carer.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.1em] text-faint">Discharged</dt>
          <dd className="font-mono">{letter.discharge_date}</dd>
        </div>
      </dl>

      <div className="space-y-7 px-6 py-6">
        <section>
          <h3 className="label mb-2">Teach-back result</h3>
          <ul className="divide-y divide-line border-y border-line">
            {receipt.items.map((item) => {
              const status = itemStatus(item);
              return (
                <li key={item.itemId} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5">
                  <span className="font-bold">{KIND_TITLE[item.kind]}</span>
                  <span className={`flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold ${TONE_TEXT[status.tone]}`}>
                    <span className={`h-2 w-2 rounded-full ${TONE_DOT[status.tone]}`} aria-hidden />
                    {status.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-sm text-muted">
            &ldquo;Said back correctly&rdquo; means what was said matches the letter. It is not a
            clinical judgement of understanding.
          </p>
        </section>

        {unresolved.length > 0 && (
          <section className="print-break-inside-avoid">
            <h3 className="label mb-2">Ask the ward before leaving</h3>
            <ol className="list-decimal space-y-3 pl-5">
              {unresolved.map((item) => (
                <li key={item.itemId}>
                  <p className="font-bold">{item.askTheWard}</p>
                  <p className="mt-0.5 font-serif text-[0.98rem] italic text-muted">
                    Letter: &ldquo;{item.quote}&rdquo;
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {receipt.questionsForPharmacist.length > 0 && (
          <section className="print-break-inside-avoid">
            <h3 className="label mb-2">Questions for the pharmacist</h3>
            <ul className="space-y-1">
              {receipt.questionsForPharmacist.map((q) => (
                <li key={q.id} className="font-serif italic">
                  &ldquo;{q.utterance}&rdquo;
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="print-break-inside-avoid grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="label mb-1">If things get worse</h3>
            <p>{letter.red_flag_symptoms.weight_gain_threshold}</p>
            <p className="mt-1">
              Call <span className="font-bold tabular-nums">{letter.who_to_call.primary_urgent_phone}</span>{" "}
              <span className="text-muted">({letter.who_to_call.primary_urgent_service})</span>
            </p>
          </div>
          <div>
            <h3 className="label mb-1">Next appointment</h3>
            <p className="font-bold">{letter.follow_up_appointment.date_time}</p>
            <p className="text-muted">{letter.follow_up_appointment.clinic_name}</p>
          </div>
        </section>

        <section className="print-break-inside-avoid rounded-lg border border-line bg-ground/60 p-4">
          <h3 className="label mb-3">Nurse or pharmacist sign-off</h3>
          {signed ? (
            <p className="font-bold text-ok">
              Signed off by {nurseName}. Handover complete.{" "}
              <button
                onClick={() => setSigned(false)}
                className="no-print ml-2 text-sm font-bold text-muted underline underline-offset-4"
              >
                Undo
              </button>
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[14rem] flex-1">
                <label htmlFor="nurse-name" className="mb-1 block text-sm text-muted">
                  Name
                </label>
                <input
                  id="nurse-name"
                  type="text"
                  value={nurseName}
                  onChange={(e) => setNurseName(e.target.value)}
                  placeholder="e.g. Staff Nurse on Elm Ward"
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 outline-none transition focus:border-accent"
                />
              </div>
              <button
                onClick={() => setSigned(true)}
                disabled={!canSign}
                className="btn-primary no-print py-2.5"
              >
                Sign off
              </button>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
