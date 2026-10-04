"use client";

import React, { useState } from "react";
import type { GradedItem, Receipt, SlotResult } from "@sayitback/engine";
import { type DischargeLetter } from "../lib/letters";
import { PdfViewer } from "./PdfViewer";
import { type ExtractedPdfDocument } from "../lib/pdf-parser";
import {
  findItem,
  itemStatus,
  slotName,
  TONE_DOT,
  TONE_MARK,
  TONE_TEXT,
  type Tone,
} from "../lib/status";

interface LetterViewerProps {
  letter: DischargeLetter;
  receipt: Receipt | null;
  onPdfTextExtracted?: (extracted: ExtractedPdfDocument) => void;
}

export function LetterViewer({ letter, receipt, onPdfTextExtracted }: LetterViewerProps) {
  const [view, setView] = useState<"letter" | "pdf">("letter");

  const diagnosis = findItem(receipt, (i) => i.kind === "diagnosis");
  const redFlag = findItem(receipt, (i) => i.kind === "red_flag");
  const followUp = findItem(receipt, (i) => i.kind === "follow_up");
  const contactSlot = redFlag?.slots.find((s) => s.slot === "contact");
  const contactTone: Tone = !contactSlot
    ? "idle"
    : contactSlot.verdict === "match"
      ? "ok"
      : contactSlot.verdict === "mismatch"
        ? "bad"
        : "warn";

  return (
    <div className="overflow-hidden rounded-sheet border border-line bg-paper shadow-sheet">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-8">
        <div role="tablist" aria-label="Letter view" className="flex gap-5 text-sm">
          {(
            [
              ["letter", "Easy-read view"],
              ["pdf", "Original PDF"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`border-b-2 pb-1 font-bold transition ${
                view === key
                  ? "border-accent text-ink"
                  : "border-transparent text-faint hover:text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {receipt && (
          <span className="text-sm text-muted">
            <span className="font-bold text-ink">{receipt.summary.confirmed}</span> of{" "}
            {receipt.summary.total} said back
          </span>
        )}
      </div>

      {view === "pdf" ? (
        <div className="min-h-[600px] p-4">
          <PdfViewer pdfUrl="/kwame-discharge-letter.pdf" onTextExtracted={onPdfTextExtracted} />
        </div>
      ) : (
        <article className="px-5 pb-10 pt-7 font-serif text-[1.08rem] leading-relaxed sm:px-8">
          {/* Letterhead */}
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/80 pb-5">
            <div>
              <p className="text-xl font-semibold leading-tight">{letter.hospital}</p>
              <p className="text-muted">{letter.ward}</p>
            </div>
            <p className="font-sans text-sm uppercase tracking-[0.12em] text-muted">
              Discharge summary
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-line py-4 font-sans text-sm sm:grid-cols-4">
            <Field label="Patient" value={`${letter.patient_name}, ${letter.age}`} />
            <Field label="NHS number (test)" value={letter.nhs_number} mono />
            <Field label="Discharged" value={letter.discharge_date} mono />
            <Field
              label="Carer"
              value={`${letter.carer.name} (${letter.carer.relationship.split(" ")[0]})`}
            />
          </dl>

          <Section id="letter-diagnosis" number={1} title="Why Kwame was in hospital" item={diagnosis}>
            <p>
              <span className={TONE_MARK[itemStatus(diagnosis).tone]}>
                {letter.primary_diagnosis.clinical_name}
              </span>
            </p>
            <p className="mt-2 italic text-muted">
              In plain words: {letter.primary_diagnosis.plain_language}
            </p>
          </Section>

          {letter.must_know_medicine_changes.map((med, idx) => {
            const item = findItem(receipt, (i) => i.itemId === `med-change-${idx + 1}`);
            return (
              <Section
                key={idx}
                id={`letter-med-change-${idx + 1}`}
                number={2}
                title="Medicine that has changed"
                item={item}
              >
                <p>
                  <span className="font-semibold capitalize">{med.drug}</span>{" "}
                  <span className="text-muted">({med.lay_name})</span>
                </p>
                {med.previous_dose && (
                  <p className="mt-1 text-muted">
                    Before admission: <span className="line-through">{med.previous_dose}</span>
                  </p>
                )}
                <p className="mt-1">
                  <span className={TONE_MARK[itemStatus(item).tone]}>
                    From today: <span className="font-semibold">{med.dose}</span> {med.frequency}{" "}
                    <span className="font-sans text-sm font-bold uppercase tracking-[0.08em]">
                      ({med.direction})
                    </span>
                  </span>
                </p>
                {med.clinical_rationale && (
                  <p className="mt-2 text-[0.98rem] text-muted">{med.clinical_rationale}</p>
                )}
              </Section>
            );
          })}

          <Section id="letter-unchanged" number={3} title="Medicines to carry on as before">
            <ul className="divide-y divide-line font-sans text-sm">
              {letter.unchanged_medicines.map((med, idx) => (
                <li key={idx} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2">
                  <span>
                    <span className="font-bold capitalize">{med.drug}</span>{" "}
                    <span className="text-muted">{med.lay_name}</span>
                  </span>
                  <span className="tabular-nums text-muted">
                    {med.dose}, {med.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="letter-red-flags" number={4} title="Warning signs" item={redFlag}>
            <p className="font-semibold">
              <span className={TONE_MARK[itemStatus(redFlag).tone]}>
                {letter.red_flag_symptoms.weight_gain_threshold}
              </span>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {letter.red_flag_symptoms.symptoms.map((sym, idx) => (
                <li key={idx}>{sym}</li>
              ))}
            </ul>
          </Section>

          <Section id="letter-contacts" number={5} title="Who to call">
            <p>
              {letter.who_to_call.primary_urgent_service}:{" "}
              <span className={`font-sans font-bold tabular-nums ${TONE_MARK[contactTone]}`}>
                {letter.who_to_call.primary_urgent_phone}
              </span>
            </p>
            <p className="mt-1 text-muted">{letter.who_to_call.operating_hours}</p>
            <p className="mt-1 text-muted">
              Out of hours: {letter.who_to_call.out_of_hours}. Emergency:{" "}
              {letter.who_to_call.life_threatening_emergency}.
            </p>
          </Section>

          <Section id="letter-follow-up" number={6} title="Follow-up appointment" item={followUp}>
            <p>
              <span className={TONE_MARK[itemStatus(followUp).tone]}>
                <span className="font-semibold">{letter.follow_up_appointment.date_time}</span> (
                {letter.follow_up_appointment.timeframe})
              </span>
            </p>
            <p className="mt-1 text-muted">
              {letter.follow_up_appointment.clinic_name}, {letter.follow_up_appointment.location}
            </p>
          </Section>
        </article>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-[0.1em] text-faint">{label}</dt>
      <dd className={`font-bold ${mono ? "font-mono text-[0.85rem] font-medium" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function Section({
  id,
  number,
  title,
  item,
  children,
}: {
  id: string;
  number: number;
  title: string;
  item?: GradedItem;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`grid scroll-mt-6 gap-x-6 gap-y-3 border-b border-line py-6 last:border-b-0 ${
        item ? "xl:grid-cols-[minmax(0,1fr)_13.5rem]" : ""
      }`}
    >
      <div className="min-w-0">
        <h3 className="mb-2 font-sans text-sm font-bold text-muted">
          <span className="mr-2 tabular-nums text-faint">{number}.</span>
          {title}
        </h3>
        {children}
      </div>
      {item && <ReviewNote item={item} />}
    </section>
  );
}

/** The margin note: what the reviewer would pencil beside this section. */
function ReviewNote({ item }: { item: GradedItem }) {
  const status = itemStatus(item);
  const slots = status.tone === "ok" ? [] : item.slots.filter((s) => s.critical);
  return (
    <aside
      aria-label={`Teach-back result: ${status.label}`}
      className={`self-start border-l-2 pl-3 font-sans text-sm ${
        status.tone === "ok" ? "border-ok" : status.tone === "bad" ? "border-bad" : "border-warn"
      }`}
    >
      <p className={`flex items-center gap-2 font-bold ${TONE_TEXT[status.tone]}`}>
        <span className={`h-2 w-2 rounded-full ${TONE_DOT[status.tone]}`} aria-hidden />
        {status.label}
      </p>
      {status.tone === "ok" && item.matchedUtterance && (
        <p className="mt-1 italic text-muted">&ldquo;{item.matchedUtterance}&rdquo;</p>
      )}
      {slots.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {slots.map((s) => (
            <SlotLine key={s.slot} slot={s} />
          ))}
        </ul>
      )}
    </aside>
  );
}

function SlotLine({ slot }: { slot: SlotResult }) {
  return (
    <li className="leading-snug">
      <span className="font-bold">{sentence(slotName(slot.slot))}:</span>{" "}
      {slot.verdict === "match" ? (
        <span className="text-ok">
          {slot.heard ?? slot.expected} <span aria-label="matches">✓</span>
        </span>
      ) : slot.verdict === "mismatch" ? (
        <>
          heard <span className="font-bold text-bad">{slot.heard}</span>, letter says{" "}
          <span className="font-bold">{slot.expected}</span>
        </>
      ) : (
        <span className="text-muted">
          {slot.verdict === "uncertain" ? "unclear" : "not mentioned"}
          {slot.expected ? ` (letter: ${slot.expected})` : ""}
        </span>
      )}
    </li>
  );
}

function sentence(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
